"""The name generator itself.

Internal — `rand_name` is the public entry point, in both of its output forms.

- At the realistic end of `style`, names come out of the curated pools: whole given
  names for CJK, given/surname pools for the other scripts.
- Toward the abstract end they are invented instead — Latin and Cyrillic scripts
  from syllable templates, CJK by combining given-name syllables.
- The structure the caller asked for (surname, middle name, starting letter) is
  always honoured. The length range is satisfied by re-drawing from the pools, and
  only padded with extra middle names when no draw can reach the minimum.
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
    resolve_style,
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
    style: int
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
    through to an invented name at `style=0` whenever the pool has no real name of
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
        if not chance(settings.style):
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


def draw_parts(data: NameLanguageData, settings: Settings, is_male: bool) -> Parts:
    """Draw one structurally complete space-separated name, ignoring the length range."""
    given_pool = data.male if is_male else data.female
    assert given_pool is not None
    leads_with_surname = surname_leads(data, settings.include_surname)
    given_prefix = "" if leads_with_surname else settings.prefix

    if data.syn is not None and chance(settings.style):
        given = synth_entry(data, given_prefix)
    elif given_prefix:
        given = lead_entry(data, given_pool, "given", given_prefix)
    else:
        given = pick_entry(given_pool, data, "given")

    surname: Entry | None = None

    if settings.include_surname:
        surname_prefix = settings.prefix if leads_with_surname else ""

        if data.syn is not None and chance(settings.style):
            surname = synth_entry(data, surname_prefix)
        elif surname_prefix:
            surname = lead_entry(data, data.last, "surname", surname_prefix)
        else:
            native = native_of(pick_pooled(data.last, data, "surname"))

            if data.roman == "translit" and not is_male:
                native = feminize_ru(native)

            surname = Entry(native, romanize(data.roman, native, "surname"))

    middles: list[Entry] = []

    if settings.include_middle_name and data.has_middle:
        middle_pool = (data.middle_male if is_male else data.middle_female) or given_pool
        # Languages without a dedicated middle-name pool reuse given names, so
        # re-draw rather than hand out "Levi Levi Cole".
        middle = pick_entry(middle_pool, data, "given")

        for _tries in range(4):
            if middle.n != given.n:
                break
            middle = pick_entry(middle_pool, data, "given")

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

        distance = min_length - length if length < min_length else length - max_length

        if distance < best_distance:
            best_distance = distance
            best = parts

    assert best is not None
    parts = best
    # Still short of the minimum: pad with extra given names, English-style.
    given_pool = data.male if is_male else data.female
    assert given_pool is not None
    required = len(parts.middles)
    used = {parts.given.n, *(entry.n for entry in parts.middles)}

    for _guard in range(16):
        length = len(assemble(data, parts).n)

        if length >= min_length:
            break

        # Pad with a part that still leaves the name inside the range, and that is not
        # in the name already — "Paul Paul Vincent Edwards" reads as a mistake.
        room = max_length - length - len(data.joiner)
        fits = tuple(item for item in given_pool if len(native_of(item)) <= room)
        fresh = tuple(item for item in fits if native_of(item) not in used)
        pad = pick_entry(fresh or fits or given_pool, data, "given")

        used.add(pad.n)
        parts.middles.append(pad)

    # Padding can overshoot; drop pads back off, never the requested middle name.
    while len(assemble(data, parts).n) > max_length and len(parts.middles) > required:
        popped = parts.middles.pop()

        if len(assemble(data, parts).n) < min_length:
            parts.middles.append(popped)
            break

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


def generate_name_details(
    *,
    language: NameLanguageOption = "all",
    gender: NameGenderOption = "all",
    count: int = 1,
    style: int = 0,
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
        style=resolve_style(style),
        prefix=resolve_prefix(starts_with),
    )

    return collect(
        count=count,
        unique=unique,
        starts_with=settings.prefix,
        draw=lambda: generate_one(draw_language(language, NAME_LANGUAGES), settings),
        key_of=lambda detail: detail.native,
    )
