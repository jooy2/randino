"""The fictional name generator: a name for a character in a story or a game.

A name is spelled in Latin letters first and written by its sound in every other script.
It is a given name and, when asked for, a family name. Each part is drawn from the pools
or invented out of parts, decided per part the way `realism` decides it for `rand_name`,
and every part carries its spelling in all five scripts, so writing a name in another
language is reading another column. See the JavaScript package's `nameGenerator.ts`,
which this mirrors.
"""

from collections.abc import Callable
from dataclasses import dataclass
from typing import Literal

from randino._internal.generate import collect, resolve_option, resolve_realism
from randino._internal.utils import pick, random, with_random
from randino._types import (
    FictionalLanguageOption,
    FictionalNameDetail,
    NameGender,
    NameGenderOption,
    RandRealism,
    WordLanguage,
)
from randino.fictional._options import prefix_in, resolve_base, script_of
from randino.fictional._pools import (
    Room,
    draw_word,
    halves_for,
    make_compound,
    make_given,
    pools,
    span_in,
    spelled_matching,
)
from randino.fictional._spelling import LATIN, NAME_JOINERS, Spelling, miss_by

_FIT_ATTEMPTS = 12
"""Draws spent on one name before settling for the closest to the length range.

Each part is already drawn against the room the other leaves, so what is left to miss is
an invented part, whose length is only roughly in hand.
"""

_GENDERS: tuple[NameGenderOption, ...] = ("male", "female", "all")


@dataclass(frozen=True, slots=True)
class _Settings:
    """A call's options, resolved once."""

    languages: tuple[WordLanguage, ...]
    forms: tuple[WordLanguage, ...]
    prefix: str
    bounds: tuple[int, int] | None
    gender: NameGenderOption
    surname: bool
    invent: int


@dataclass(frozen=True, slots=True)
class _Spans:
    """The shortest and the longest a given name and a surname come out in one script."""

    given: tuple[int, int]
    surname: tuple[int, int]


_span_cache: dict[tuple[str, int, int], _Spans] = {}
"""Worked out once per gender, script and realism.

Every draw of a name with a surname or a length range reads them, and they only depend on
the pools.
"""


def _spans_in(gender: NameGender | Literal["all"], script: int, invent: int) -> _Spans:
    """The shortest and the longest a given name, and a surname, can come out in one script.

    The pools' names, the invented ones, or both, as `realism` draws them.
    """
    key = (gender, script, invent)
    kept = _span_cache.get(key)

    if kept is not None:
        return kept

    data = pools()
    halves = halves_for("s")
    genders: tuple[NameGender, ...] = ("male", "female") if gender == "all" else (gender,)
    real = invent < 100
    made = invent > 0
    given_spans = [
        span_in(
            data.given[each] if real else (),
            [(data.heads, data.ends[each]), (data.heads, data.middles, data.ends[each])]
            if made
            else [],
            script,
        )
        for each in genders
    ]
    spans = _Spans(
        given=(min(span[0] for span in given_spans), max(span[1] for span in given_spans)),
        surname=span_in(
            data.surnames if real else (),
            [(halves.fronts, halves.backs)] if made else [],
            script,
        ),
    )
    _span_cache[key] = spans

    return spans


def _range_in(
    script: int, gender: NameGender | Literal["all"], surname: bool, invent: int
) -> tuple[int, int]:
    """What a name in `script` can come out at under these settings."""
    spans = _spans_in(gender, script, invent)

    if not surname:
        return spans.given

    joiner = len(NAME_JOINERS[script])

    return (
        spans.given[0] + joiner + spans.surname[0],
        spans.given[1] + joiner + spans.surname[1],
    )


def _gender_for(script: int, settings: _Settings) -> NameGender:
    """The gender of one name: the one asked for, or either of the two.

    With a length range, a gender whose names cannot meet it in this script is passed over
    while the other's can — Japanese writes a man's name no longer than seven characters
    and a woman's up to eight.
    """
    if settings.gender != "all":
        return settings.gender

    both: tuple[NameGender, ...] = ("male", "female")
    bounds = settings.bounds

    def reaches(gender: NameGender) -> bool:
        if bounds is None:
            return True

        low, high = _range_in(script, gender, settings.surname, settings.invent)

        return high >= bounds[0] and low <= bounds[1]

    able = [gender for gender in both if reaches(gender)]

    if len(able) == 1:
        return able[0]

    return "male" if random() < 0.5 else "female"


@dataclass(frozen=True, slots=True)
class _Drawn:
    """One name and the string it is told apart from others by, whatever its language."""

    detail: FictionalNameDetail
    key: str


def _draft(language: WordLanguage, settings: _Settings) -> _Drawn | None:
    """One name in `language`, or None when a part could not be drawn."""
    script = script_of(language)
    prefix = prefix_in(settings.prefix, script)
    gender = _gender_for(script, settings)
    data = pools()
    bounds = settings.bounds
    surname: Spelling | None = None
    room: Room = bounds

    if settings.surname:
        joiner = len(NAME_JOINERS[script])
        spans = _spans_in(gender, script, settings.invent)
        # The surname takes the room a given name of any length still leaves, so that the
        # given name drawn after it has somewhere to land.
        surname_room: Room = (
            None
            if bounds is None
            else (bounds[0] - joiner - spans.given[1], bounds[1] - joiner - spans.given[0])
        )

        surname = draw_word(
            data.surnames,
            lambda: make_compound("s", script, "", surname_room),
            settings.invent,
            script,
            "",
            surname_room,
        )

        if surname is None:
            return None

        taken = joiner + len(surname[script])
        room = None if bounds is None else (bounds[0] - taken, bounds[1] - taken)

    given_room = room
    first = draw_word(
        spelled_matching(data.given[gender], script, prefix),
        lambda: make_given(gender, script, prefix, given_room),
        settings.invent,
        script,
        prefix,
        given_room,
    )

    if first is None:
        return None

    write = _writer(first, surname)

    return _Drawn(
        detail=FictionalNameDetail(
            name=write(language),
            gender=gender,
            language=language,
            forms={code: write(code) for code in settings.forms},
        ),
        key=first[LATIN] if surname is None else f"{first[LATIN]} {surname[LATIN]}",
    )


def _writer(first: Spelling, surname: Spelling | None) -> Callable[[WordLanguage], str]:
    """How a name made of `first` and `surname` is written in a language."""

    def write(code: WordLanguage) -> str:
        at = script_of(code)

        return first[at] if surname is None else first[at] + NAME_JOINERS[at] + surname[at]

    return write


def _generate_one(language: WordLanguage, settings: _Settings) -> _Drawn | None:
    """One name, as close to the length range as `_FIT_ATTEMPTS` drafts bring it."""
    best: _Drawn | None = None
    best_miss = float("inf")

    for _ in range(_FIT_ATTEMPTS):
        drawn = _draft(language, settings)

        if drawn is None:
            continue

        miss = (
            0.0
            if settings.bounds is None
            else miss_by(len(drawn.detail.name), settings.bounds[0], settings.bounds[1])
        )

        if miss == 0:
            return drawn

        if miss < best_miss:
            best = drawn
            best_miss = miss

    return best


def generate_fictional_name_details(
    *,
    language: FictionalLanguageOption = "all",
    gender: NameGenderOption = "all",
    include_surname: bool = False,
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[FictionalNameDetail]:
    """Generate `count` fictional names, applied to every option."""
    own_gender = resolve_option(gender, _GENDERS, "all")
    surname = include_surname is True
    invent = resolve_realism(realism)
    base = resolve_base(
        language=language,
        starts_with=starts_with,
        min_length=min_length,
        max_length=max_length,
        range_of=lambda code: _range_in(script_of(code), own_gender, surname, invent),
    )
    settings = _Settings(
        languages=base.languages,
        forms=base.forms,
        prefix=base.prefix,
        bounds=base.bounds,
        gender=own_gender,
        surname=surname,
        invent=invent,
    )

    if not settings.languages:
        return []

    with with_random(random):
        results = collect(
            count=count,
            unique=unique,
            # `starts_with` is checked as each name is drawn: a Japanese name is spelled in
            # katakana, and a hiragana prefix has to match it.
            starts_with="",
            draw=lambda: _generate_one(pick(settings.languages), settings),
            key_of=lambda drawn: "" if drawn is None else drawn.detail.name,
            unique_of=lambda drawn: "" if drawn is None else drawn.key,
        )

    return [drawn.detail for drawn in results if drawn is not None]
