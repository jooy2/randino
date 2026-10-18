"""The fictional place generator: a country, a region, a city or a district of a made-up world.

A place is a name — drawn from the pools or invented, the way a fictional person's is —
and maybe a kind out of `FICTIONAL_KINDS`, each language writing the kind in its own
template. The name is spelled in all five scripts and the kind in all nine languages, so
writing a place in another language is reading another column, the way it is for a name.
See the JavaScript package's `placeGenerator.ts`, which this mirrors.
"""

from collections.abc import Callable
from dataclasses import dataclass
from functools import cache
from typing import cast

from randino._internal.generate import (
    collect,
    resolve_optional,
    resolve_realism,
)
from randino._internal.table import rows
from randino._internal.utils import chance, pick, with_random
from randino._types import (
    FictionalKindStyle,
    FictionalLanguageOption,
    FictionalPlaceDetail,
    FictionalPlaceKind,
    LocationLevel,
    RandRealism,
    WordLanguage,
)
from randino.fictional._options import prefix_in, resolve_base, script_of
from randino.fictional._pools import (
    Room,
    Slots,
    assemble,
    draw_word,
    halves_for,
    make_compound,
    make_given,
    pools,
    span_in,
    spelled_matching,
)
from randino.fictional._spelling import LATIN, Spelling, miss_by, spelled_rows
from randino.fictional.data import (
    FICTIONAL_KIND_CHANCE,
    FICTIONAL_KINDS,
    FICTIONAL_MIDDLE_CHANCE,
    FICTIONAL_PLACE_ENDINGS,
    FICTIONAL_PLACES,
    FICTIONAL_SYLLABLE_CHANCE,
)

_FIT_ATTEMPTS = 12
"""Draws spent on one place before settling for the closest to the length range."""

_LEVEL_LETTER: dict[LocationLevel, str] = {
    "country": "n",
    "region": "r",
    "city": "c",
    "district": "d",
}
"""The letter each level goes by in the datasets' first cell."""

_KIND_STYLES: tuple[FictionalKindStyle, ...] = ("borrowed", "translated")


@dataclass(frozen=True, slots=True)
class _Kind:
    """One kind of place, and how each language writes it."""

    code: FictionalPlaceKind
    levels: str
    borrowed: bool
    """Whether a language borrows the kind's English word when `kind_style` is left out."""

    templates: dict[WordLanguage, tuple[str, str]]
    """Each language's two templates: the English word borrowed, and its own word."""


@dataclass(frozen=True, slots=True)
class _PlacePools:
    """The place datasets, split into the pools a draw reads."""

    kinds: tuple[_Kind, ...]
    stems: dict[str, tuple[Spelling, ...]]
    """Each level's names, keyed by its letter."""

    endings: dict[str, tuple[Spelling, ...]]
    """Each level's endings for an invented name, keyed by its letter."""


@cache
def _place_data() -> _PlacePools:
    """The place datasets, split the first time a draw needs them, and kept."""
    kinds: list[_Kind] = []

    for cells in rows(FICTIONAL_KINDS):
        code, levels, style, en, ko, ko_t, ja, ja_t, zh, ru, ru_t, vi, es, it, de = cells
        kinds.append(
            _Kind(
                code=cast(FictionalPlaceKind, code),
                levels=levels,
                borrowed=style == "borrowed",
                templates={
                    "en": (en, en),
                    "ko": (ko, ko_t),
                    "ja": (ja, ja_t),
                    "zh": (zh, zh),
                    "ru": (ru, ru_t),
                    "vi": (en, vi),
                    "es": (en, es),
                    "it": (en, it),
                    "de": (en, de),
                },
            )
        )

    stems: dict[str, list[Spelling]] = {"n": [], "r": [], "c": [], "d": []}
    endings: dict[str, list[Spelling]] = {"n": [], "r": []}

    for row in spelled_rows(FICTIONAL_PLACES):
        for letter in row.cells[0]:
            if letter in stems:
                stems[letter].append(row.spelling)

    # A district is named after a family as often as not, so it draws from the surnames
    # too; a surname the place pool already holds is one entry.
    named = {stem[LATIN] for stem in stems["d"]}

    for surname in pools().surnames:
        if surname[LATIN] not in named:
            stems["d"].append(surname)

    for row in spelled_rows(FICTIONAL_PLACE_ENDINGS):
        for letter in row.cells[0]:
            if letter in endings:
                endings[letter].append(row.spelling)

    return _PlacePools(
        kinds=tuple(kinds),
        stems={letter: tuple(pool) for letter, pool in stems.items()},
        endings={letter: tuple(pool) for letter, pool in endings.items()},
    )


def _template_of(kind: _Kind, language: WordLanguage, style: FictionalKindStyle | None) -> str:
    """The template a language writes a kind in, `{}` standing for the name."""
    borrowed = kind.borrowed if style is None else style == "borrowed"

    return kind.templates[language][0 if borrowed else 1]


def _overhead_of(kind: _Kind, language: WordLanguage, style: FictionalKindStyle | None) -> int:
    """How many characters a kind adds to the name it is written beside."""
    return len(_template_of(kind, language, style)) - len("{}")


@dataclass(frozen=True, slots=True)
class _Own:
    """The options only a place takes, resolved once."""

    level: LocationLevel
    kind: bool | None
    """Whether a place carries its kind, or None to leave it to chance."""

    style: FictionalKindStyle | None
    invent: int


@dataclass(frozen=True, slots=True)
class _Settings:
    """A call's options, resolved once."""

    languages: tuple[WordLanguage, ...]
    forms: tuple[WordLanguage, ...]
    prefix: str
    bounds: tuple[int, int] | None
    own: _Own


def _make_stem(level: LocationLevel, script: int, prefix: str, room: Room) -> Spelling | None:
    """A name invented for a place on `level`, out of syllables or out of two halves."""
    letter = _LEVEL_LETTER[level]

    if not chance(FICTIONAL_SYLLABLE_CHANCE[level]):
        return make_compound(letter, script, prefix, room)

    # A district built from syllables is named like a person: `Kalira Park`.
    if level == "district":
        return make_given("female" if chance(50) else "male", script, prefix, room)

    data = pools()
    endings = _place_data().endings[letter]
    slots: Slots = (
        (data.heads, data.middles, endings)
        if chance(FICTIONAL_MIDDLE_CHANCE)
        else (data.heads, endings)
    )

    return assemble(slots, script, prefix, room)


_stem_spans: dict[tuple[LocationLevel, int, int], tuple[int, int]] = {}
"""What a name for a place on each level can come out at in each script.

For the names the pools hold, the invented ones, or both, as `realism` draws them.
"""


def _stem_span(level: LocationLevel, script: int, invent: int) -> tuple[int, int]:
    """The shortest and the longest a place's name on `level` comes out in `script`."""
    key = (level, script, invent)
    span = _stem_spans.get(key)

    if span is None:
        letter = _LEVEL_LETTER[level]
        data = pools()
        halves = halves_for(letter)
        shapes: list[Slots] = []

        if invent > 0 and FICTIONAL_SYLLABLE_CHANCE[level] < 100:
            shapes.append((halves.fronts, halves.backs))

        if invent > 0 and FICTIONAL_SYLLABLE_CHANCE[level] > 0:
            closing = (
                (*data.ends["male"], *data.ends["female"])
                if level == "district"
                else _place_data().endings[letter]
            )

            shapes.extend([(data.heads, closing), (data.heads, data.middles, closing)])

        span = span_in(_place_data().stems[letter] if invent < 100 else (), shapes, script)
        _stem_spans[key] = span

    return span


_kinds_on_level: dict[LocationLevel, tuple[_Kind, ...]] = {}


def _kinds_on(level: LocationLevel) -> tuple[_Kind, ...]:
    """The kinds a place on `level` may be."""
    kinds = _kinds_on_level.get(level)

    if kinds is None:
        letter = _LEVEL_LETTER[level]
        kinds = tuple(kind for kind in _place_data().kinds if letter in kind.levels)
        _kinds_on_level[level] = kinds

    return kinds


def _range_of(language: WordLanguage, own: _Own) -> tuple[int, int]:
    """What a place on `own.level` in `language` can come out at, with or without a kind."""
    low, high = _stem_span(own.level, script_of(language), own.invent)
    overheads = [_overhead_of(kind, language, own.style) for kind in _kinds_on(own.level)]
    with_kind = own.kind is not False
    without_kind = own.kind is not True

    return (
        low if without_kind else low + min(overheads),
        high + max(overheads) if with_kind else high,
    )


def _choose_kind(language: WordLanguage, settings: _Settings) -> _Kind | None:
    """The kind written beside a place, or None for none."""
    own = settings.own
    kinds = _kinds_on(own.level)

    if settings.bounds is None:
        include = own.kind if own.kind is not None else chance(FICTIONAL_KIND_CHANCE[own.level])

        return pick(kinds) if include else None

    # A kind whose template leaves no name able to land inside the range is passed over
    # while another one leaves some, and when the range can only be met with a kind or only
    # without one, a kind left to chance is decided by the range.
    low, high = _stem_span(own.level, script_of(language), own.invent)
    least, most = settings.bounds
    able = [
        kind
        for kind in kinds
        if _overhead_of(kind, language, own.style) + high >= least
        and _overhead_of(kind, language, own.style) + low <= most
    ]
    bare = high >= least and low <= most

    if own.kind is not None:
        include = own.kind
    elif able and not bare:
        include = True
    elif not able and bare:
        include = False
    else:
        include = chance(FICTIONAL_KIND_CHANCE[own.level])

    return pick(able or kinds) if include else None


@dataclass(frozen=True, slots=True)
class _Drawn:
    """One place and the string it is told apart from others by, whatever its language."""

    detail: FictionalPlaceDetail
    key: str


def _draft(language: WordLanguage, settings: _Settings) -> _Drawn | None:
    """One place in `language`, or None when its name could not be drawn."""
    own = settings.own
    script = script_of(language)
    prefix = prefix_in(settings.prefix, script)
    kind = _choose_kind(language, settings)
    overhead = 0 if kind is None else _overhead_of(kind, language, own.style)
    bounds = settings.bounds
    room: Room = None if bounds is None else (bounds[0] - overhead, bounds[1] - overhead)
    letter = _LEVEL_LETTER[own.level]
    stem = draw_word(
        spelled_matching(_place_data().stems[letter], script, prefix),
        lambda: _make_stem(own.level, script, prefix, room),
        own.invent,
        script,
        prefix,
        room,
    )

    if stem is None:
        return None

    # A kind the name already says is drawn again: `Port Galeport`, `Highmoor Moors`.
    if kind is not None and _said(kind.code) in stem[LATIN].lower():
        return None

    write = _writer(stem, kind, own.style)

    return _Drawn(
        detail=FictionalPlaceDetail(
            place=write(language),
            name=stem[script],
            kind=None if kind is None else kind.code,
            level=own.level,
            language=language,
            forms={code: write(code) for code in settings.forms},
        ),
        key=f"{stem[LATIN]}|{'' if kind is None else kind.code}",
    )


def _said(code: str) -> str:
    """A kind's code less a final `s`, which is how a name would say it: `moor` in `Highmoor`."""
    return code[:-1] if code.endswith("s") else code


def _writer(
    stem: Spelling, kind: _Kind | None, style: FictionalKindStyle | None
) -> Callable[[WordLanguage], str]:
    """How a place named `stem`, of `kind`, is written in a language."""

    def write(code: WordLanguage) -> str:
        name = stem[script_of(code)]

        return name if kind is None else _template_of(kind, code, style).replace("{}", name)

    return write


def _generate_one(language: WordLanguage, settings: _Settings) -> _Drawn | None:
    """One place, as close to the length range as `_FIT_ATTEMPTS` drafts bring it."""
    best: _Drawn | None = None
    best_miss = float("inf")

    for _ in range(_FIT_ATTEMPTS):
        drawn = _draft(language, settings)

        if drawn is None:
            continue

        miss = (
            0.0
            if settings.bounds is None
            else miss_by(len(drawn.detail.place), settings.bounds[0], settings.bounds[1])
        )

        if miss == 0:
            return drawn

        if miss < best_miss:
            best = drawn
            best_miss = miss

    return best


def generate_fictional_place_details(
    level: LocationLevel,
    *,
    language: FictionalLanguageOption = "all",
    include_kind: bool | None = None,
    kind_style: FictionalKindStyle | None = None,
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[FictionalPlaceDetail]:
    """Generate `count` fictional places on `level`, applied to every option."""
    own = _Own(
        level=level,
        kind=include_kind if isinstance(include_kind, bool) else None,
        style=resolve_optional(kind_style, _KIND_STYLES),
        invent=resolve_realism(realism),
    )
    base = resolve_base(
        language=language,
        starts_with=starts_with,
        min_length=min_length,
        max_length=max_length,
        range_of=lambda code: _range_of(code, own),
    )
    settings = _Settings(
        languages=base.languages,
        forms=base.forms,
        prefix=base.prefix,
        bounds=base.bounds,
        own=own,
    )

    if not settings.languages:
        return []

    with with_random(random):
        results = collect(
            count=count,
            unique=unique,
            # `starts_with` is the place's name, not its kind, and is checked as each place
            # is drawn: `Kingdom of Edlin` starts with `E`.
            starts_with="",
            draw=lambda: _generate_one(pick(settings.languages), settings),
            key_of=lambda drawn: "" if drawn is None else drawn.detail.place,
            unique_of=lambda drawn: "" if drawn is None else drawn.key,
        )

    return [drawn.detail for drawn in results if drawn is not None]
