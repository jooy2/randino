"""The name generator itself.

Internal — `rand_name` is the public entry point, in both of its output forms.

- At `realism="real"`, names come out of the curated pools: whole given
  names for CJK, given/surname pools for the other scripts.
- Toward the abstract end they are invented instead — Latin and Cyrillic scripts
  from syllable templates, CJK by combining given-name syllables.
- The structure the caller asked for (surname, middle name, starting letter) is
  always honoured. The length range is satisfied by re-drawing from the pools; a
  range no draw landed in is answered by drawing each part from the lengths that
  can still reach it, and only then padded with extra middle names.
- Every name is produced in both scripts, native and romanized.
"""

import math
import random
import re
from collections.abc import Collection
from dataclasses import dataclass, field
from typing import Literal, NamedTuple

from randino._internal.generate import (
    collect,
    draw_language,
    length_bounds,
    resolve_length,
    resolve_prefix,
    resolve_realism,
)
from randino._internal.parse import NameToken
from randino._internal.utils import (
    capitalize_first,
    chance,
    clamp,
    pick,
    pick_weighted,
    rand_int,
)
from randino._types import (
    NameDetail,
    NameGender,
    NameGenderOption,
    NameLanguage,
    NameLanguageOption,
    RandRealism,
)
from randino.name._romanize import romanize, romanize_hangul
from randino.name.data import NAME_DATA, NAME_LANGUAGES
from randino.name.data._types import NameLanguageData, NamePool, SyllableSet
from randino.name.name_length_range import name_length_range

NamePart = Literal["surname", "given"]

FIT_ATTEMPTS = 12
"""Draws to spend looking for a name inside the length range before settling."""

STRETCHED_LEN_WEIGHT = 40
"""Draw weight for given-name lengths the language itself never uses.

On the same 0-100 scale as `given_len_weights`. Only in play once the range is
stretched past those lengths, where it also floors the natural weights so that no
real length ends up rarer than an invented one.
"""

LAST_WEIGHT_DEFAULT = 1
"""Draw weight for a surname the language's frequency table leaves out.

On the same tenths-of-a-percent scale the tables are written in. Only languages that
have a table are affected; the rest keep drawing surnames evenly.
"""


class Entry(NamedTuple):
    """One name part, or a whole name, in both scripts."""

    n: str
    r: str


@dataclass(slots=True)
class Parts:
    """The pieces of one full name, before they are joined."""

    given: Entry
    surname: Entry | None
    middles: list[Entry] = field(default_factory=list)


@dataclass(frozen=True, slots=True)
class Settings:
    """Everything a single name needs, with defaults already applied.

    The length bounds stay optional here: left out, they are resolved per language,
    so mixing languages does not stretch a Korean name to fill a Spanish name's range.
    """

    gender: NameGenderOption
    include_surname: bool
    include_middle_name: bool
    invent: int
    prefix: str
    min_length: int | None = None
    max_length: int | None = None


def native_of(item: str | NameToken) -> str:
    """The native form of a pool entry, whether or not it carries its own reading."""
    return item if isinstance(item, str) else item.n


def starting_with(pool: NamePool, prefix: str) -> NamePool:
    """Pool items whose native form begins with `prefix` (case-insensitive)."""
    lower = prefix.lower()

    return tuple(item for item in pool if native_of(item).lower().startswith(lower))


def span_of(pool: NamePool) -> tuple[int, int]:
    """The shortest and longest item a pool holds, in characters of the native form."""
    lengths = [len(native_of(item)) for item in pool]

    return min(lengths), max(lengths)


def miss_by(length: int, low: int, high: int) -> float:
    """How far a length falls outside the range.

    A score to rank names by rather than a character count: overshooting scores half
    a character more than falling short by the same amount, because `max_length` is
    the bound a caller is usually holding to — a field limit, a column width — where
    `min_length` only shapes how a name reads.
    """
    if length < low:
        return low - length

    if length > high:
        return length - high + 0.5

    return 0


def lengths_between(pool: NamePool, low: int, high: int) -> NamePool:
    """Pool items between `low` and `high` characters long.

    Falls back to the items closest to that window when the pool holds none inside
    it.
    """
    inside = tuple(item for item in pool if miss_by(len(native_of(item)), low, high) == 0)

    if inside:
        return inside

    closest = min(miss_by(len(native_of(item)), low, high) for item in pool)

    return tuple(item for item in pool if miss_by(len(native_of(item)), low, high) == closest)


def fitted(
    pool: NamePool, fit: tuple[int, int] | None, spent: int, rest: tuple[int, int]
) -> NamePool:
    """A pool narrowed to the lengths one part may take.

    `spent` is what the name already costs, and `rest` the shortest and longest the
    parts behind it can still total. A `fit` of None hands the pool straight back,
    which is what every draw outside the length fitting passes.
    """
    if fit is None:
        return pool

    return lengths_between(pool, fit[0] - spent - rest[1], fit[1] - spent - rest[0])


def pick_pooled(pool: NamePool, data: NameLanguageData, part: NamePart) -> str | NameToken:
    """Draw one pool item.

    Surnames follow the language's own frequency table where it has one, so 김 leads
    a fifth of the Korean names rather than a seventy-fifth, and Nguyễn two
    Vietnamese names in five. Given names stay an even draw — a curated pool is
    already a list of names in use, with no comparable skew.
    """
    table = data.last_weights if part == "surname" else None

    if table is None:
        return pick(pool)

    return pick_weighted(pool, lambda item: table.get(native_of(item), LAST_WEIGHT_DEFAULT))


def pick_entry(pool: NamePool, data: NameLanguageData, part: NamePart) -> Entry:
    """Pick one pool item as a native + romanized entry."""
    item = pick_pooled(pool, data, part)

    if isinstance(item, NameToken):
        return Entry(item.n, item.r)

    return Entry(item, romanize(data.roman, item, part))


# --- Invented names ---------------------------------------------------------


def synth_token(syn: SyllableSet, prefix: str = "") -> str:
    """Build a pronounceable invented part from syllable templates.

    `prefix` replaces the first onset, so a requested starting letter that no real
    name uses still leads a name that reads naturally (Q -> "Quen").
    """
    syllables = rand_int(syn.min_syllables, syn.max_syllables)
    out = ""

    for index in range(syllables):
        out += (prefix.lower() if index == 0 and prefix else pick(syn.onset)) + pick(syn.vowel)

        if index == syllables - 1:
            out += pick(syn.coda)

    return capitalize_first(out)


def synth_entry(data: NameLanguageData, prefix: str = "") -> Entry:
    """Build an invented part in both scripts."""
    assert data.syn is not None
    native = synth_token(data.syn, prefix)

    return Entry(native, romanize(data.roman, native, "given"))


def lead_entry(data: NameLanguageData, pool: NamePool, part: NamePart, prefix: str) -> Entry:
    """Pick the part that leads the full name when a starting character was asked for.

    Prefers a real name that already starts with it; otherwise invents one
    (Latin/Cyrillic) or uses the character verbatim (CJK, where any syllable is a
    usable name part — so 앙 + 지수 -> 앙지수).
    """
    matches = starting_with(pool, prefix)

    if matches:
        return pick_entry(matches, data, part)

    if data.syn is not None:
        return synth_entry(data, prefix)

    return Entry(prefix, romanize(data.roman, prefix, part))


# --- CJK given names --------------------------------------------------------


def compose_given(data: NameLanguageData, is_male: bool, length: int, prefix: str) -> Entry:
    """Compose an invented CJK given name of exactly `length` syllables."""
    first_pool = data.first_male if is_male else data.first_female
    rest_pool = data.rest_male if is_male else data.rest_female
    assert first_pool is not None and rest_pool is not None

    matches = starting_with(first_pool, prefix) if prefix else first_pool
    parts: list[str | NameToken] = [pick(matches) if matches else prefix]

    for _ in range(1, length):
        # Avoid immediately repeating the previous syllable (e.g. 敏敏).
        part = pick(rest_pool)

        for _tries in range(3):
            if native_of(part) != native_of(parts[-1]):
                break
            part = pick(rest_pool)

        parts.append(part)

    native = "".join(native_of(part) for part in parts)

    if data.roman == "hangul":
        return Entry(native, capitalize_first(romanize_hangul(native)))

    # Kanji and hanzi carry their own reading, but a syllable the caller passed to
    # `starts_with` has none — fall back to the character itself rather than
    # dropping it from the romanization.
    roman = "".join(part if isinstance(part, str) else part.r for part in parts)

    return Entry(native, capitalize_first(roman))


def curated_given(
    data: NameLanguageData, is_male: bool, low: int, high: int, prefix: str
) -> Entry | None:
    """A real CJK given name that fits the length range, or None when the pool holds none.

    The length follows the language's own distribution, but only over the lengths the
    pool can actually serve: rolling a length first and then looking it up would drop
    through to an invented name at `realism="real"` whenever the pool has no real name of
    that length — Korean lists three-syllable given names in its weights and holds
    none, so one name in twenty-five came out invented.
    """
    pool = data.given_male if is_male else data.given_female

    if pool is None:
        return None

    candidates: NamePool = tuple(item for item in pool if low <= len(native_of(item)) <= high)

    if prefix:
        candidates = starting_with(candidates, prefix)

    if not candidates:
        return None

    available = {len(native_of(item)) for item in candidates}
    length = pick_given_length(data, low, high, available)
    fitting = tuple(item for item in candidates if len(native_of(item)) == length)

    return pick_entry(fitting or candidates, data, "given")


def pick_given_length(
    data: NameLanguageData, low: int, high: int, available: Collection[int] | None = None
) -> int:
    """How many syllables the given name should have.

    Inside the lengths the language actually uses, follow its natural distribution. A
    range stretched past them is a deliberate ask for names the language does not
    have — realism is gone either way, so spread the draw over the whole range and
    leave the common lengths only a bump, rather than capping at the longest length
    the table happens to list.

    `available` restricts the draw to the lengths a curated pool holds. Stretching is
    off in that case: the pool, not the range, is what the caller gets.
    """
    weights = data.given_len_weights

    if weights:
        stretched = available is None and high > max(weights)
        options: list[tuple[int, int]] = []

        for length in range(low, high + 1):
            if available is not None and length not in available:
                continue

            natural = weights.get(length, 0)
            weight = max(natural, STRETCHED_LEN_WEIGHT) if stretched else natural

            if weight > 0:
                options.append((length, weight))

        # A pool can hold a length the weight table does not list. Draw evenly over
        # what it holds rather than falling through to a fixed length outside it.
        if not options and available is not None:
            options = [(length, 1) for length in available]

        total = sum(weight for _, weight in options)

        if total > 0:
            roll = random.random() * total

            for length, weight in options:
                roll -= weight

                if roll <= 0:
                    return length

    return clamp(2, low, high)


# --- Assembly ---------------------------------------------------------------


def assemble(data: NameLanguageData, parts: Parts) -> Entry:
    """Join the pieces of a name in the language's own order."""
    if data.order == "family-first":
        sequence = [parts.surname, *parts.middles, parts.given]
    else:
        sequence = [parts.given, *parts.middles, parts.surname]

    kept = [entry for entry in sequence if entry is not None]

    return Entry(
        data.joiner.join(entry.n for entry in kept),
        " ".join(entry.r for entry in kept),
    )


def surname_leads(data: NameLanguageData, include_surname: bool) -> bool:
    """True when the surname is the part the full name starts with."""
    return data.order == "family-first" and include_surname


# --- Per-name generation ----------------------------------------------------


def generate_cjk(
    data: NameLanguageData,
    settings: Settings,
    is_male: bool,
    min_length: int,
    max_length: int,
) -> Entry:
    """Build one name for a language whose parts run together."""
    prefix = settings.prefix
    leads_with_surname = surname_leads(data, settings.include_surname)

    surname: Entry | None = None

    if settings.include_surname:
        surname = (
            lead_entry(data, data.last, "surname", prefix)
            if leads_with_surname
            else pick_entry(data.last, data, "surname")
        )

    surname_length = len(surname.n) if surname else 0
    low = max(1, min_length - surname_length)
    high = max_length - surname_length

    if high < low and surname:
        # A multi-character surname alone overflows the range — drop it.
        surname = None
        low = max(1, min_length)
        high = max(low, max_length)

    high = max(low, high)

    given_prefix = "" if leads_with_surname else prefix

    def draw_given() -> Entry:
        if not chance(settings.invent):
            real = curated_given(data, is_male, low, high, given_prefix)

            if real is not None:
                return real

        return compose_given(data, is_male, pick_given_length(data, low, high), given_prefix)

    # Re-draw when the given name repeats the surname syllable (서 + 서연 -> 서서연).
    given = draw_given()

    for _tries in range(4):
        if not surname or not given.n.startswith(surname.n):
            break
        given = draw_given()

    return assemble(data, Parts(given=given, surname=surname))


RU_MASCULINE = re.compile(r"[оеё]в$|ин$|ын$")


def feminize_ru(surname: str) -> str:
    """Feminize a masculine Russian surname (Иванов -> Иванова, ...ский -> ...ская)."""
    if surname.endswith("ский") or surname.endswith("ой"):
        return surname[:-2] + "ая"
    if RU_MASCULINE.search(surname):
        return surname + "а"

    return surname


def draw_parts(
    data: NameLanguageData,
    settings: Settings,
    is_male: bool,
    fit: tuple[int, int] | None = None,
) -> Parts:
    """Draw one structurally complete space-separated name.

    `fit` is the length range the whole name has to land in, and it is None for
    every draw the length fitting makes on its own: an even draw over the pools is
    what keeps each part's length distribution the language's own, and re-drawing is
    how a range is normally met. A range here is the last resort, and it is spent
    from left to right — each part is drawn from the lengths that still leave the
    parts behind it able to reach it. Nothing is invented under one, because a
    syllable template cannot be asked to come out a given length.
    """
    given_pool = data.male if is_male else data.female
    assert given_pool is not None
    middle_pool = (
        (data.middle_male if is_male else data.middle_female) or given_pool
        if settings.include_middle_name and data.has_middle
        else None
    )
    leads_with_surname = surname_leads(data, settings.include_surname)
    given_prefix = "" if leads_with_surname else settings.prefix
    invent = settings.invent if fit is None else 0
    # Only a fitted draw measures the pools. They run to a few hundred entries, and
    # every attempt of a normal draw would pay for the scan.
    gaps = (
        0
        if fit is None
        else (len(data.joiner) if settings.include_surname else 0)
        + (len(data.joiner) if middle_pool is not None else 0)
    )
    last_span = span_of(data.last) if fit is not None and settings.include_surname else (0, 0)
    middle_span = span_of(middle_pool) if fit is not None and middle_pool is not None else (0, 0)
    # Feminizing a Russian surname can add a character (Иванов -> Иванова), which is
    # a character the range has to account for before any pool is narrowed.
    inflates = 1 if settings.include_surname and data.roman == "translit" and not is_male else 0

    if data.syn is not None and chance(invent):
        given = synth_entry(data, given_prefix)
    else:
        pool = fitted(
            given_pool,
            fit,
            gaps + inflates,
            (last_span[0] + middle_span[0], last_span[1] + middle_span[1]),
        )
        given = (
            lead_entry(data, pool, "given", given_prefix)
            if given_prefix
            else pick_entry(pool, data, "given")
        )

    surname: Entry | None = None

    if settings.include_surname:
        surname_prefix = settings.prefix if leads_with_surname else ""
        pool = fitted(data.last, fit, gaps + len(given.n) + inflates, middle_span)

        if data.syn is not None and chance(invent):
            surname = synth_entry(data, surname_prefix)
        elif surname_prefix:
            surname = lead_entry(data, pool, "surname", surname_prefix)
        else:
            native = native_of(pick_pooled(pool, data, "surname"))

            if data.roman == "translit" and not is_male:
                native = feminize_ru(native)

            surname = Entry(native, romanize(data.roman, native, "surname"))

    middles: list[Entry] = []

    if middle_pool is not None:
        spent = gaps + len(given.n) + (len(surname.n) if surname is not None else 0)
        pool = fitted(middle_pool, fit, spent, (0, 0))
        # Languages without a dedicated middle-name pool reuse given names, so
        # re-draw rather than hand out "Levi Levi Cole".
        middle = pick_entry(pool, data, "given")

        for _tries in range(4):
            if middle.n != given.n:
                break
            middle = pick_entry(pool, data, "given")

        middles.append(middle)

    return Parts(given=given, surname=surname, middles=middles)


def generate_spaced(
    data: NameLanguageData,
    settings: Settings,
    is_male: bool,
    min_length: int,
    max_length: int,
) -> Entry:
    """Build one name for a language whose parts are separated by spaces."""
    # Re-draw rather than trim: shortening a name by dropping parts would throw away
    # the surname or middle name the caller explicitly asked for.
    best: Parts | None = None
    best_distance = math.inf

    for _attempt in range(FIT_ATTEMPTS):
        parts = draw_parts(data, settings, is_male)
        length = len(assemble(data, parts).n)

        if min_length <= length <= max_length:
            return assemble(data, parts)

        distance = miss_by(length, min_length, max_length)

        if distance < best_distance:
            best_distance = distance
            best = parts

    assert best is not None
    parts = best
    # Every attempt missed. An even draw will not turn up `Ann Cox` or `Maximilian`
    # by chance when most of the pool is the wrong length, so draw each part from the
    # lengths that can still land inside the range — and keep that draw only if it
    # came closer than the twelve honest ones did.
    aimed = draw_parts(data, settings, is_male, (min_length, max_length))

    if miss_by(len(assemble(data, aimed).n), min_length, max_length) < best_distance:
        parts = aimed

    # Still short of the minimum: pad with extra given names, English-style.
    given_pool = data.male if is_male else data.female
    assert given_pool is not None
    used = {parts.given.n, *(entry.n for entry in parts.middles)}

    for _guard in range(16):
        length = len(assemble(data, parts).n)

        if length >= min_length:
            break

        # Pad with a part that still leaves the name inside the range, and that is not
        # in the name already — "Paul Paul Vincent Edwards" reads as a mistake.
        room = max_length - length - len(data.joiner)
        fits = tuple(item for item in given_pool if len(native_of(item)) <= room)

        if not fits:
            # Nothing in the pool is short enough to add. Stop here: a name left a few
            # characters short of the minimum is closer to what was asked for than one
            # carrying a whole extra part past the maximum.
            break

        fresh = tuple(item for item in fits if native_of(item) not in used)
        pad = pick_entry(fresh or fits, data, "given")

        used.add(pad.n)
        parts.middles.append(pad)

    return assemble(data, parts)


def bounds_for(language: NameLanguage, settings: Settings) -> tuple[int, int]:
    """Length range for one language.

    What the caller asked for, falling back to the language's own natural range for
    whichever bound was left out.
    """
    natural_min, natural_max = name_length_range(
        language, settings.include_surname, settings.include_middle_name
    )

    return length_bounds(settings.min_length, settings.max_length, natural_min, natural_max)


def generate_one(language: NameLanguage, settings: Settings) -> NameDetail:
    """Build one complete name in one language."""
    data = NAME_DATA[language]
    gender: NameGender = (
        ("male" if random.random() < 0.5 else "female")
        if settings.gender == "all"
        else settings.gender
    )
    low, high = bounds_for(language, settings)
    build = generate_cjk if data.joiner == "" else generate_spaced
    entry = build(data, settings, gender == "male", low, high)

    return NameDetail(native=entry.n, roman=entry.r, language=language, gender=gender)


def draw_name(
    language: NameLanguage,
    *,
    realism: RandRealism = "real",
    include_surname: bool = True,
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
) -> NameDetail:
    """One name in `language`, drawn the way `rand_name` would draw it.

    Internal, and the only way into this generator from outside `randino.name`:
    `rand_sentence` writes a person's name where a sentence has room for one, and it
    has no business resolving `rand_name`'s options itself.

    Args:
        language: The language to write the name in.
        realism: Whether the name is drawn from the pools or invented.
        include_surname: Whether a surname is written beside the given name.
        min_length: Minimum length in characters.
        max_length: Maximum length in characters.
        starts_with: Keep only names whose first character is this one.

    Returns:
        One `NameDetail`.
    """
    return generate_one(
        language,
        Settings(
            gender="all",
            include_surname=include_surname,
            include_middle_name=False,
            min_length=resolve_length(min_length),
            max_length=resolve_length(max_length),
            invent=resolve_realism(realism),
            prefix=resolve_prefix(starts_with),
        ),
    )


def generate_name_details(
    *,
    language: NameLanguageOption = "all",
    gender: NameGenderOption = "all",
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    include_surname: bool = True,
    include_middle_name: bool = False,
    starts_with: str = "",
    unique: bool = False,
) -> list[NameDetail]:
    """Generate `count` names, applied to every option the caller passed."""
    settings = Settings(
        gender=gender,
        include_surname=include_surname,
        include_middle_name=include_middle_name,
        min_length=resolve_length(min_length),
        max_length=resolve_length(max_length),
        invent=resolve_realism(realism),
        prefix=resolve_prefix(starts_with),
    )

    return collect(
        count=count,
        unique=unique,
        starts_with=settings.prefix,
        draw=lambda: generate_one(draw_language(language, NAME_LANGUAGES), settings),
        key_of=lambda detail: detail.native,
    )
