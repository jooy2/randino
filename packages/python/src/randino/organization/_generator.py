"""The organization generator: a company, a school or an office that does not exist.

A name is a template from the language's data with its gaps filled, and a company may
carry its legal form around the whole of it. Nothing here knows a language's word order:
that is in the templates. A length range is met by setting aside the shapes that cannot
land inside it before one is chosen, and by filling each gap from the entries that leave
the gaps behind it room — see the JavaScript package's `organizationGenerator.ts`, which
this mirrors.
"""

import math
import re
from collections.abc import Callable, Sequence
from dataclasses import dataclass

from randino._internal.generate import (
    collect,
    languages_writing,
    length_bounds,
    resolve_length,
    resolve_prefix,
    resolve_realism,
)
from randino._internal.utils import (
    capitalize_first,
    chance,
    pick,
    pick_weighted,
    rand_int,
    with_random,
)
from randino._types import (
    OrganizationDetail,
    OrganizationIndustry,
    OrganizationIndustryOption,
    OrganizationType,
    OrganizationTypeOption,
    RandRealism,
    WordLanguage,
    WordLanguageOption,
)
from randino.constants import RAND_ORGANIZATION_LENGTH_MAX
from randino.organization.data import (
    ORGANIZATION_BARE_CHANCE,
    ORGANIZATION_DATA,
    ORGANIZATION_GENERIC_CHANCE,
    ORGANIZATION_INDUSTRIES,
    ORGANIZATION_LEGAL_FORM_CHANCE,
    ORGANIZATION_TYPE_WEIGHTS,
    resolve_industry,
    resolve_organization_types,
)
from randino.organization.data._types import (
    OrganizationLanguageData,
    OrganizationSynthesis,
    PoolOrganizationSynthesis,
)
from randino.word.data import WORD_LANGUAGES, resolve_word_language

_FIT_ATTEMPTS = 12
"""Draws spent on one result before settling for the closest.

The shapes and the gaps are already chosen against the range, so what is left to miss is
an invented stem, whose length is only roughly in hand.
"""

_BARE = "{stem}"
"""The company shape that is a stem and a legal form and nothing else."""

_GAP = re.compile(r"\{(stem|industry|place|number)\}")

Span = tuple[float, float]
"""The shortest and the longest something can come out, in characters."""


@dataclass(frozen=True, slots=True)
class _Piece:
    """One run of a template: the text the language writes, or a gap to fill."""

    text: str | None = None
    slot: str | None = None


_piece_cache: dict[str, tuple[_Piece, ...]] = {}


def pieces_of(template: str) -> tuple[_Piece, ...]:
    """A template as its runs of text and its gaps, in order, split once and kept."""
    cached = _piece_cache.get(template)

    if cached is None:
        pieces: list[_Piece] = []
        last = 0

        for match in _GAP.finditer(template):
            if match.start() > last:
                pieces.append(_Piece(text=template[last : match.start()]))

            pieces.append(_Piece(slot=match.group(1)))
            last = match.end()

        if last < len(template):
            pieces.append(_Piece(text=template[last:]))

        cached = tuple(pieces)
        _piece_cache[template] = cached

    return cached


def legal_form_of(template: str) -> str:
    """The legal form a template writes around `{name}`, on its own.

    `Inc.` out of `{name}, Inc.`, `ООО` out of `ООО «{name}»`. Read off the template rather
    than written beside it, so the two can never disagree.
    """
    form = template.replace("{name}", "", 1)
    form = re.sub("[«»]", "", form)

    return form.strip(" ,")


def _overhead_of(form: str | None) -> int:
    """How many characters a legal form adds to the name it is written around."""
    return 0 if form is None else len(form) - len("{name}")


def _matching(pool: Sequence[str], prefix: str) -> Sequence[str]:
    """The entries of a pool that start with `prefix`, or all of them for none."""
    if not prefix:
        return pool

    lower = prefix.lower()

    return tuple(entry for entry in pool if entry.lower().startswith(lower))


_span_cache: dict[int, tuple[int, int]] = {}


def _span_of_pool(pool: Sequence[str]) -> tuple[int, int]:
    """The shortest and the longest entry of a pool, `(0, 0)` for an empty one."""
    key = id(pool)
    cached = _span_cache.get(key)

    if cached is None:
        cached = (min(map(len, pool)), max(map(len, pool))) if pool else (0, 0)
        _span_cache[key] = cached

    return cached


def _syllable_span(syn: OrganizationSynthesis, count: int) -> tuple[int, int]:
    """What an invented stem of `count` syllables can come out at."""
    if isinstance(syn, PoolOrganizationSynthesis):
        low, high = _span_of_pool(syn.pool)
        joins = (count - 1) * len(syn.joiner)

        return count * low + joins, count * high + joins

    onset = _span_of_pool(syn.onset)
    vowel = _span_of_pool(syn.vowel)
    coda = _span_of_pool(syn.coda)

    return (
        count * (onset[0] + vowel[0]) + coda[0],
        count * (onset[1] + vowel[1]) + coda[1],
    )


def invent_stem(
    syn: OrganizationSynthesis, prefix: str, low: float = 0, high: float = math.inf
) -> str:
    """A stem nobody chose, of a syllable count that can land between `low` and `high`.

    A requested first character stands in for the first sound, or picks the first
    syllable, which is what lets `starts_with` reach past the stems the data holds.
    """
    counts = [
        count
        for count in range(syn.min_syllables, syn.max_syllables + 1)
        if _syllable_span(syn, count)[1] >= low and _syllable_span(syn, count)[0] <= high
    ]
    count = pick(counts) if counts else rand_int(syn.min_syllables, syn.max_syllables)

    if isinstance(syn, PoolOrganizationSynthesis):
        firsts = _matching(syn.pool, prefix)
        parts = [pick(firsts) if firsts else prefix]

        while len(parts) < count:
            following = pick(syn.pool)

            # The same syllable twice in a row reads as a stutter (솔솔, 瑞瑞).
            for _ in range(3):
                if following != parts[-1]:
                    break

                following = pick(syn.pool)

            parts.append(following)

        return syn.joiner.join(parts)

    word = ""

    for i in range(count):
        word += prefix.lower() if i == 0 and prefix else pick(syn.onset)
        word += pick(syn.vowel)

    return capitalize_first(word + pick(syn.coda))


def _miss_by(length: int, bounds: Span) -> float:
    """How far a length is from a range, an overshoot counting half a character worse."""
    low, high = bounds

    if length < low:
        return low - length

    return length - high + 0.5 if length > high else 0


def _fitting(pool: Sequence[str], low: float, high: float) -> str | None:
    """An entry between `low` and `high` long, or the closest — None for an empty pool."""
    if not pool:
        return None

    inside = [entry for entry in pool if low <= len(entry) <= high]

    if inside:
        return pick(inside)

    best = min(_miss_by(len(entry), (low, high)) for entry in pool)

    return pick([entry for entry in pool if _miss_by(len(entry), (low, high)) == best])


@dataclass(frozen=True, slots=True)
class _Settings:
    types: tuple[OrganizationType, ...]
    industry: OrganizationIndustryOption
    legal_form: bool | None
    """None leaves a company's legal form to chance."""
    invent: int
    prefix: str
    bounds: tuple[int, int] | None


_descriptor_cache: dict[int, tuple[str, ...]] = {}


def _every_descriptor(data: OrganizationLanguageData) -> tuple[str, ...]:
    """Every word that says what a company does, across the industries and the generic."""
    key = id(data)
    cached = _descriptor_cache.get(key)

    if cached is None:
        cached = (
            *data.generic,
            *(word for industry in ORGANIZATION_INDUSTRIES for word in data.industries[industry]),
        )
        _descriptor_cache[key] = cached

    return cached


def _descriptors_for(
    data: OrganizationLanguageData, wanted: OrganizationIndustryOption
) -> Sequence[str]:
    """What an `{industry}` gap can be, for the industry the caller asked for."""
    return _every_descriptor(data) if wanted == "all" else data.industries[wanted]


_number_cache: dict[int, tuple[str, ...]] = {}


def _numbers_of(data: OrganizationLanguageData) -> tuple[str, ...]:
    """The numbers a `{number}` gap can be, as text."""
    key = id(data)
    cached = _number_cache.get(key)

    if cached is None:
        low, high = data.numbers or (1, 1)
        cached = tuple(str(number) for number in range(low, high + 1))
        _number_cache[key] = cached

    return cached


def _gap_span(slot: str, data: OrganizationLanguageData, settings: _Settings) -> tuple[int, int]:
    """What one gap can come out at."""
    if slot == "stem":
        real = _span_of_pool(data.stems)
        made = (
            _syllable_span(data.syn, data.syn.min_syllables)[0],
            _syllable_span(data.syn, data.syn.max_syllables)[1],
        )

        if settings.invent <= 0:
            return real

        if settings.invent >= 100:
            return made

        return min(real[0], made[0]), max(real[1], made[1])

    if slot == "industry":
        return _span_of_pool(_descriptors_for(data, settings.industry))

    if slot == "place":
        return _span_of_pool(data.places or ())

    low, high = data.numbers or (1, 1)

    return len(str(low)), len(str(high))


def _piece_span(
    piece: _Piece, data: OrganizationLanguageData, settings: _Settings
) -> tuple[int, int]:
    if piece.text is not None:
        return len(piece.text), len(piece.text)

    return _gap_span(piece.slot or "", data, settings)


def _template_span(
    template: str, data: OrganizationLanguageData, settings: _Settings
) -> tuple[int, int]:
    """What a template can come out at, its text and every gap together."""
    spans = [_piece_span(piece, data, settings) for piece in pieces_of(template)]

    return sum(span[0] for span in spans), sum(span[1] for span in spans)


def _leads_with(template: str, data: OrganizationLanguageData, settings: _Settings) -> bool:
    """Whether a template can put the prefix first, before any of it is drawn."""
    prefix = settings.prefix
    pieces = pieces_of(template)

    if not prefix or not pieces:
        return True

    first = pieces[0]

    if first.text is not None:
        return first.text.lower().startswith(prefix.lower())

    if first.slot == "stem":
        # A stem can always be invented to start with it.
        return True

    if first.slot == "industry":
        return bool(_matching(_descriptors_for(data, settings.industry), prefix))

    if first.slot == "place":
        return bool(_matching(data.places or (), prefix))

    return bool(_matching(_numbers_of(data), prefix))


@dataclass(frozen=True, slots=True)
class _Shape:
    """One shape a result can take: a template, and the legal forms it may be written in."""

    template: str
    forms: tuple[str | None, ...]


def _forms_that_fit(
    shape: _Shape, data: OrganizationLanguageData, settings: _Settings
) -> tuple[str | None, ...]:
    """The legal forms of a shape that let it land inside the range."""
    if settings.bounds is None:
        return shape.forms

    low, high = _template_span(shape.template, data, settings)
    minimum, maximum = settings.bounds

    return tuple(
        form
        for form in shape.forms
        if high + _overhead_of(form) >= minimum and low + _overhead_of(form) <= maximum
    )


@dataclass(frozen=True, slots=True)
class _Plan:
    """What one language can answer a call with, worked out once per call."""

    language: WordLanguage
    data: OrganizationLanguageData
    shapes: dict[OrganizationType, tuple[_Shape, ...]]
    types: tuple[OrganizationType, ...]


def _plan_for(language: WordLanguage, settings: _Settings) -> _Plan:
    data = ORGANIZATION_DATA[language]
    shapes: dict[OrganizationType, tuple[_Shape, ...]] = {}
    fitting: list[OrganizationType] = []
    forms: tuple[str | None, ...]

    if settings.legal_form is True:
        forms = data.legal_forms
    elif settings.legal_form is False:
        forms = (None,)
    else:
        forms = (None, *data.legal_forms)

    for kind in settings.types:
        company = kind == "company"
        listed = [
            _Shape(template, forms if company else (None,))
            for template in data.templates[kind]
            if _leads_with(template, data, settings)
        ]

        # A company named by its stem alone says nothing about its business, so it is
        # only one when no industry was asked for, and it always takes a legal form, so
        # it is never one when legal forms were turned off.
        if company and settings.industry == "all" and settings.legal_form is not False:
            listed.append(_Shape(_BARE, data.legal_forms))

        fit = [_Shape(shape.template, _forms_that_fit(shape, data, settings)) for shape in listed]
        fit = [shape for shape in fit if shape.forms]

        if fit:
            fitting.append(kind)

        shapes[kind] = tuple(fit or listed)

    types = tuple(kind for kind in settings.types if shapes[kind])

    return _Plan(language, data, shapes, tuple(fitting) or types)


def _choose_shape(shapes: Sequence[_Shape]) -> _Shape:
    """A stem alone a fifth of the time when it is in play, a template otherwise."""
    bare = next((shape for shape in shapes if shape.template == _BARE), None)
    templated = [shape for shape in shapes if shape is not bare]

    if bare is not None and (not templated or chance(ORGANIZATION_BARE_CHANCE)):
        return bare

    return pick(templated)


def _choose_form(shape: _Shape) -> str | None:
    """Which legal form to write: none or one by a coin flip when both are possible."""
    written = [form for form in shape.forms if form is not None]

    if not written:
        return None

    if None in shape.forms and not chance(ORGANIZATION_LEGAL_FORM_CHANCE):
        return None

    return pick(written)


def _descriptor_for(
    data: OrganizationLanguageData,
    wanted: OrganizationIndustryOption,
    prefix: str,
    low: float,
    high: float,
) -> tuple[str, OrganizationIndustry | None] | None:
    """The word that says what a company does, and the industry it says."""
    if wanted != "all":
        word = _fitting(_matching(data.industries[wanted], prefix), low, high)

        return None if word is None else (word, wanted)

    generic = chance(ORGANIZATION_GENERIC_CHANCE)
    industry: OrganizationIndustry | None = None if generic else pick(ORGANIZATION_INDUSTRIES)
    pool = _matching(data.generic if industry is None else data.industries[industry], prefix)
    word = _fitting(pool, low, high) if pool else None

    if word is not None and low <= len(word) <= high:
        return word, industry

    # Nothing of the one drawn starts with the character or fits the room, so the word
    # is drawn from all of them and the industry is whichever it belongs to.
    entries: list[tuple[str, OrganizationIndustry | None]] = [
        (each, None) for each in _matching(data.generic, prefix)
    ]
    entries += [
        (entry, each)
        for each in ORGANIZATION_INDUSTRIES
        for entry in _matching(data.industries[each], prefix)
    ]
    chosen = _fitting([entry[0] for entry in entries], low, high)

    return None if chosen is None else pick([entry for entry in entries if entry[0] == chosen])


def _fill(
    template: str, plan: _Plan, settings: _Settings, low: float, high: float
) -> tuple[str, OrganizationIndustry | None] | None:
    """A template with its gaps filled, each leaving the gaps behind it room."""
    data = plan.data
    pieces = pieces_of(template)
    rest_low = [0] * (len(pieces) + 1)
    rest_high = [0] * (len(pieces) + 1)

    for i in range(len(pieces) - 1, -1, -1):
        shortest, longest = _piece_span(pieces[i], data, settings)
        rest_low[i] = shortest + rest_low[i + 1]
        rest_high[i] = longest + rest_high[i + 1]

    name = ""
    industry: OrganizationIndustry | None = None

    for i, piece in enumerate(pieces):
        if piece.text is not None:
            name += piece.text
            continue

        # Only the first gap has to lead with the requested character.
        prefix = settings.prefix if i == 0 else ""
        room_low = low - len(name) - rest_high[i + 1]
        room_high = high - len(name) - rest_low[i + 1]
        value: str | None

        if piece.slot == "stem":
            stems = _matching(data.stems, prefix)
            # A first character no stem starts with is answered with an invented stem
            # that does, the way `rand_word` answers one.
            value = (
                invent_stem(data.syn, prefix, room_low, room_high)
                if chance(settings.invent) or not stems
                else _fitting(stems, room_low, room_high)
            )
        elif piece.slot == "industry":
            descriptor = _descriptor_for(data, settings.industry, prefix, room_low, room_high)
            value = None if descriptor is None else descriptor[0]
            industry = None if descriptor is None else descriptor[1]
        elif piece.slot == "place":
            value = _fitting(_matching(data.places or (), prefix), room_low, room_high)
        else:
            value = _fitting(_matching(_numbers_of(data), prefix), room_low, room_high)

        if value is None:
            return None

        name += value

    return name, industry


def _draft(plan: _Plan, settings: _Settings) -> OrganizationDetail | None:
    """One draw, before its length is checked; None when the prefix could not lead it."""
    kind = pick_weighted(plan.types, lambda each: ORGANIZATION_TYPE_WEIGHTS[each])
    shape = _choose_shape(plan.shapes[kind])
    form = _choose_form(shape)
    extra = _overhead_of(form)
    low, high = settings.bounds or (0, math.inf)
    filled = _fill(shape.template, plan, settings, low - extra, high - extra)

    if filled is None:
        return None

    name, industry = filled

    if settings.prefix and not name.lower().startswith(settings.prefix.lower()):
        return None

    return OrganizationDetail(
        organization=name if form is None else form.replace("{name}", name, 1),
        name=name,
        legal_form=None if form is None else legal_form_of(form),
        type=kind,
        industry=industry if kind == "company" else None,
        language=plan.language,
    )


def _generate_one(plan: _Plan, settings: _Settings) -> OrganizationDetail | None:
    best: OrganizationDetail | None = None
    best_miss = math.inf

    for _ in range(_FIT_ATTEMPTS):
        detail = _draft(plan, settings)

        if detail is None:
            continue

        miss = 0 if settings.bounds is None else _miss_by(len(detail.organization), settings.bounds)

        if miss == 0:
            return detail

        if miss < best_miss:
            best_miss = miss
            best = detail

    return best


def generate_organization_details(
    *,
    language: WordLanguageOption = "all",
    type: OrganizationTypeOption | None = None,
    industry: OrganizationIndustryOption = "all",
    include_legal_form: bool | None = None,
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[OrganizationDetail]:
    """Generate `count` organizations, applied to every option."""
    wanted = resolve_industry(industry)
    # An industry is a company's, so naming one with no kind named asks for companies;
    # with kinds named, it narrows the companies among them.
    types: tuple[OrganizationType, ...] = (
        ("company",) if type is None and wanted != "all" else resolve_organization_types(type)
    )
    low = resolve_length(min_length)
    high = resolve_length(max_length)
    settings = _Settings(
        types=types,
        industry=wanted,
        legal_form=include_legal_form if isinstance(include_legal_form, bool) else None,
        invent=resolve_realism(realism),
        prefix=resolve_prefix(starts_with),
        bounds=None
        if low is None and high is None
        else length_bounds(
            low, high, 1, RAND_ORGANIZATION_LENGTH_MAX, RAND_ORGANIZATION_LENGTH_MAX
        ),
    )
    # A language that does not write the requested character, and one with no shape of
    # the requested kinds that can lead with it, are out before a draw.
    plans = [
        plan
        for plan in (
            _plan_for(code, settings)
            for code in languages_writing(
                resolve_word_language(language), WORD_LANGUAGES, settings.prefix
            )
        )
        if plan.types
    ]

    if not plans:
        return []

    with with_random(random):
        results = collect(
            count=count,
            unique=unique,
            # `starts_with` is the name's, and checked in `_draft`: a legal form written
            # in front of a name is not where the name starts.
            starts_with="",
            draw=lambda: _generate_one(pick(plans), settings),
            key_of=lambda detail: "" if detail is None else detail.organization,
        )

    return [detail for detail in results if detail is not None]
