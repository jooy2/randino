"""The location generator: one real division, or a whole location written out.

Drawn from the outline a language's dataset carries. Nothing here invents. A draw is an
index into a list of divisions the country itself published, and every option narrows
that list rather than shaping what is drawn from it — which is what keeps a Korean 동
inside the 구 it belongs to.
"""

from collections.abc import Callable
from dataclasses import dataclass
from typing import Literal, NamedTuple

from randino._internal.generate import (
    collect,
    languages_writing,
    length_bounds,
    resolve_length,
    resolve_prefix,
)
from randino._internal.parse import OutlineEntry, outline
from randino._internal.utils import pick, rand_int, with_random
from randino._types import LocationDetail, LocationLanguage, LocationLanguageOption, LocationLevel
from randino.constants import RAND_LOCATION_LENGTH_MAX
from randino.location.data import (
    LOCATION_DATA,
    LOCATION_LANGUAGES,
    LOCATION_LEVELS,
    resolve_location_language,
)
from randino.location.data._types import LocationLanguageData

LocationForm = Literal["unit", "path"]
"""What one draw hands back.

A single division's name (`rand_city`), or every level down to it written out the way
the language writes a location (`rand_location`).
"""


@dataclass(slots=True)
class _Pool:
    """The divisions one kind of draw may land on, with what each is written as.

    The text is worked out once, because every length and `starts_with` filter reads it
    and a US list is thirty-two thousand of them.
    """

    data: LocationLanguageData
    """The dataset the divisions come from."""

    language: LocationLanguage
    """The language that dataset is written in."""

    form: LocationForm
    """Whether a draw is one division's name or the whole location."""

    entries: tuple[OutlineEntry | None, ...]
    """The divisions, with None for the country, which the outline does not hold."""

    texts: tuple[str, ...]
    """What each entry is written as, at the same index."""

    shortest: int
    """The length of the shortest text, or `0` for an empty pool."""

    longest: int
    """The length of the longest text."""

    narrowed: tuple[tuple[str, int | None, int | None], tuple[int, ...]] | None = None
    """The last narrowing asked of this pool, and its answer.

    That is the one a loop of single draws asks again: filtering thirty-two thousand
    names is not free, and a caller drawing one at a time would pay it every call.
    """


class _Candidate(NamedTuple):
    """A pool one call may draw from, and the indexes of it that call may land on."""

    pool: _Pool
    """The pool itself."""

    indexes: tuple[int, ...] | None
    """The indexes left once the options had their say, or None for all of them."""


# Parsed once per dataset, on the first draw that needs it rather than at import:
# importing the package should not cost a split of every division it ships. Keyed on
# the language, whose dataset is a module constant that lives as long as the process.
_ENTRY_CACHE: dict[LocationLanguage, tuple[OutlineEntry, ...]] = {}

# One pool per language, form and level, each built the first time it is drawn from.
_POOL_CACHE: dict[tuple[LocationLanguage, LocationForm, LocationLevel], _Pool] = {}


def _entries_of(language: LocationLanguage) -> tuple[OutlineEntry, ...]:
    """Every division a language's outline holds, parsed on first use."""
    entries = _ENTRY_CACHE.get(language)

    if entries is None:
        data = LOCATION_DATA[language]
        entries = outline(data.outline, len(data.levels))
        _ENTRY_CACHE[language] = entries

    return entries


def _rank_of(data: LocationLanguageData, depth: int) -> int:
    """Which of the four levels an outline depth is, as an index into `LOCATION_LEVELS`."""
    return LOCATION_LEVELS.index(data.levels[depth])


def _entries_at(
    language: LocationLanguage, form: LocationForm, level: LocationLevel
) -> tuple[OutlineEntry | None, ...]:
    """The divisions a draw at `level` may land on.

    A single division is one at exactly that level, so a country without the level has
    none. A location written out stops at the deepest level the country has at or above
    the one asked for, and at any division with nothing inside it at that depth:
    `rand_location(level="city")` has to be able to reach 세종특별자치시, which has no
    시·군·구 and whose branch stops at the region.

    Args:
        language: The language whose outline is read.
        form: Whether a draw is one division's name or the whole location.
        level: The level asked for.

    Returns:
        The entries, or a single None for the country.
    """
    wanted = LOCATION_LEVELS.index(level)

    if wanted == 0:
        return (None,)

    data = LOCATION_DATA[language]
    entries = _entries_of(language)

    if form == "unit":
        return tuple(entry for entry in entries if _rank_of(data, entry.depth) == wanted)

    limit = -1

    for depth in range(len(data.levels)):
        if _rank_of(data, depth) <= wanted:
            limit = depth

    return tuple(
        entry
        for entry in entries
        if entry.depth == limit
        or (entry.depth < limit and (entry.below is None or entry.below > limit))
    )


def _detail_of(pool: _Pool, entry: OutlineEntry | None) -> LocationDetail:
    """One result, built fresh per draw."""
    data = pool.data

    if entry is None:
        return LocationDetail(
            location=data.country,
            language=pool.language,
            level="country",
            country=data.country,
            region=None,
            city=None,
            district=None,
        )

    named: dict[str, str | None] = {"region": None, "city": None, "district": None}

    for depth, level in enumerate(data.levels):
        named[level] = entry.path[depth] if depth < len(entry.path) else None

    parts = [part for part in (data.country, *entry.path) if part is not None]
    name = entry.path[entry.depth] or ""

    if pool.form == "unit":
        location = name
    else:
        location = data.joiner.join(parts if data.order == "largest-first" else parts[::-1])

    return LocationDetail(
        location=location,
        language=pool.language,
        level=data.levels[entry.depth],
        country=data.country,
        region=named["region"],
        city=named["city"],
        district=named["district"],
    )


def _pool_of(language: LocationLanguage, form: LocationForm, level: LocationLevel) -> _Pool:
    """The pool for one language, form and level, built the first time it is drawn from."""
    key = (language, form, level)
    cached = _POOL_CACHE.get(key)

    if cached is not None:
        return cached

    data = LOCATION_DATA[language]
    entries = _entries_at(language, form, level)
    pool = _Pool(
        data=data,
        language=language,
        form=form,
        entries=entries,
        texts=(),
        shortest=0,
        longest=0,
    )
    texts = tuple(_detail_of(pool, entry).location for entry in entries)
    lengths = [len(text) for text in texts]

    pool.texts = texts
    pool.shortest = min(lengths, default=0)
    pool.longest = max(lengths, default=0)
    _POOL_CACHE[key] = pool

    return pool


def _narrow(
    pool: _Pool, prefix: str, min_length: int | None, max_length: int | None
) -> tuple[int, ...] | None:
    """The indexes of a pool one call may draw from once the options have had their say.

    A range nothing in the pool fits is answered with the divisions closest to it rather
    than with none, the way every other generator answers one — and an overshoot counts
    half a character worse than an undershoot, because `max_length` is the bound a
    caller is usually holding to.

    Args:
        pool: The pool to narrow.
        prefix: The requested first character, or `""`.
        min_length: The caller's lower length bound, or None.
        max_length: The caller's upper length bound, or None.

    Returns:
        The indexes, or None for all of them when neither `starts_with` nor a length
        was asked.
    """
    if not prefix and min_length is None and max_length is None:
        return None

    key = (prefix, min_length, max_length)

    if pool.narrowed is not None and pool.narrowed[0] == key:
        return pool.narrowed[1]

    indexes = _narrow_afresh(pool, prefix, min_length, max_length)
    pool.narrowed = (key, indexes)

    return indexes


def _narrow_afresh(
    pool: _Pool, prefix: str, min_length: int | None, max_length: int | None
) -> tuple[int, ...]:
    """What `_narrow` answers when the pool has not been asked the same thing just before."""
    lower = prefix.lower()
    matching = [
        index
        for index, text in enumerate(pool.texts)
        if not lower or text.lower().startswith(lower)
    ]

    if min_length is None and max_length is None:
        return tuple(matching)

    low, high = length_bounds(
        min_length, max_length, pool.shortest, pool.longest, RAND_LOCATION_LENGTH_MAX
    )

    def miss_by(index: int) -> float:
        length = len(pool.texts[index])

        if length < low:
            return low - length

        return length - high + 0.5 if length > high else 0

    best = float("inf")
    closest: list[int] = []

    for index in matching:
        miss = miss_by(index)

        if miss < best:
            best = miss
            closest = [index]
        elif miss == best:
            closest.append(index)

    return tuple(closest)


def generate_location_details(
    form: LocationForm,
    level: LocationLevel,
    *,
    language: LocationLanguageOption = "all",
    count: int = 1,
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[LocationDetail]:
    """Generate `count` locations at one level, in one form, applied to every option."""
    prefix = resolve_prefix(starts_with)
    low = resolve_length(min_length)
    high = resolve_length(max_length)

    # A language that cannot write the requested first character, and one with nothing
    # at the requested level, are out before a draw is made — so asking every language
    # for a 읍·면·동 draws Korean rather than spending half the draws on English, which
    # has none.
    candidates: list[_Candidate] = []

    for code in languages_writing(resolve_location_language(language), LOCATION_LANGUAGES, prefix):
        pool = _pool_of(code, form, level)
        indexes = _narrow(pool, prefix, low, high) if pool.entries else ()

        if indexes is None or indexes:
            candidates.append(_Candidate(pool, indexes))

    if not candidates:
        return []

    def draw() -> LocationDetail:
        pool, indexes = pick(candidates)
        index = pick(indexes) if indexes is not None else rand_int(0, len(pool.entries) - 1)

        return _detail_of(pool, pool.entries[index])

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with=prefix,
            draw=draw,
            key_of=lambda detail: detail.location,
        )


def draw_location(
    form: LocationForm,
    level: LocationLevel,
    *,
    language: LocationLanguageOption,
    count: int,
    min_length: int | None,
    max_length: int | None,
    starts_with: str,
    unique: bool,
    random: Callable[[], float] | None,
    output: str,
) -> list[str] | list[LocationDetail]:
    """What every location generator does: a draw at one level, in one form.

    Args:
        form: Whether a draw is one division's name or the whole location.
        level: The level asked for, already resolved.
        language: The caller's `language`.
        count: The caller's `count`.
        min_length: The caller's `min_length`.
        max_length: The caller's `max_length`.
        starts_with: The caller's `starts_with`.
        unique: The caller's `unique`.
        random: The caller's `random`.
        output: `"detail"` for the details, anything else for the strings.

    Returns:
        The details, or what each of them writes out.
    """
    details = generate_location_details(
        form,
        level,
        language=language,
        count=count,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
    )

    return details if output == "detail" else [detail.location for detail in details]
