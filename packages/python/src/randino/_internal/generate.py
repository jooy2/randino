"""The parts every generator shares: the common options, and the draw loop.

`rand_name`, `rand_nickname` and `rand_word` differ in what one draw produces
and in nothing else about this — the same clamping, the same `starts_with`
filter, the same `unique` bookkeeping and the same attempt budget. Written once
here, a new generator gets all of it by calling `collect`, or `collect_from` when
it can list every result it may return.
"""

import math
from bisect import bisect_right
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from itertools import accumulate
from typing import Any, Generic, TypeVar

from randino._internal.script import writes_script
from randino._internal.utils import clamp, pick, random
from randino._types import RandRealism, RandVocabulary, SystemPlatform
from randino.constants import (
    RAND_COUNT_MAX,
    RAND_LENGTH_MAX,
    RAND_LENGTH_MIN,
    SYSTEM_PLATFORMS,
)

T = TypeVar("T")
E = TypeVar("E")
L = TypeVar("L", bound=str)


def _whole(value: object) -> int | None:
    """A whole number, or None for anything that is not one.

    The type rules a `nan` out of every option that takes a number; an unchecked caller
    can still pass one, and `nan` is the value that does not announce itself — it
    compares false against every bound it is checked against, so a generator handed one
    quietly produced nothing, or reached a negative list length and raised from
    somewhere that says nothing about which option was wrong.

    Args:
        value: Whatever the caller passed.

    Returns:
        The floor of the number, or None when it is not a finite one. An integer too
        large for a float is not one either, the way JavaScript reads it as `Infinity`.
    """
    number = finite(value)

    return None if number is None else math.floor(number)


def finite(value: object) -> float | None:
    """A finite number, or None for anything that is not one.

    `_whole` without the floor, for a bound that may fall between two whole numbers: half
    a gigabyte is 512 MB. An integer too large for a float is not a finite number, the
    way JavaScript reads it as `Infinity`.
    """
    try:
        number = float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError, OverflowError):
        return None

    return number if math.isfinite(number) else None


def resolve_whole(value: object, fallback: int, low: int, high: int) -> int:
    """A whole number clamped to a range, for `count` and for `sentences`."""
    number = _whole(value)

    return clamp(fallback if number is None else number, low, high)


def resolve_count(count: int) -> int:
    """Return `count`, floored and clamped to what a generator will serve."""
    return resolve_whole(count, 1, 0, RAND_COUNT_MAX)


def resolve_option(value: object, allowed: Sequence[L], fallback: L) -> L:
    """A caller's option narrowed to a value the generator knows, or the default.

    The same reasoning as `resolve_realism`: the type rules the wrong value out, and an
    unchecked caller can still pass one. Answering that with a `KeyError` from inside a
    pool lookup names the value and not the option, so every option that takes one of a
    fixed set falls back instead.

    Args:
        value: Whatever the caller passed.
        allowed: Every value the option accepts.
        fallback: What an unknown value reads as.

    Returns:
        The caller's value when the option accepts it, and `fallback` otherwise.
    """
    return value if value in allowed else fallback  # type: ignore[return-value]


def resolve_optional(value: object, allowed: Sequence[L]) -> L | None:
    """The same, for an option whose absence means something of its own.

    A `style` left out is a level drawn per result rather than a default level. An
    unknown value reads as absent, which is the only answer that keeps "left out" and
    "wrong" apart without inventing a level the caller did not ask for.

    Args:
        value: Whatever the caller passed.
        allowed: Every value the option accepts.

    Returns:
        The caller's value when the option accepts it, and None otherwise.
    """
    return value if value in allowed else None  # type: ignore[return-value]


def resolve_many(value: object, allowed: Sequence[L], fallback: Sequence[L]) -> tuple[L, ...]:
    """The same for an option that takes one value or several.

    Unknown entries are dropped, and a list left with none of them falls back the way a
    single value does.

    Args:
        value: Whatever the caller passed — one value, or several.
        allowed: Every value the option accepts.
        fallback: What a list with nothing usable left in it reads as.

    Returns:
        The entries the option accepts, or `fallback` when none are left.
    """
    if isinstance(value, str):
        listed: Sequence[object] = (value,)
    elif isinstance(value, Sequence):
        listed = value
    else:
        listed = ()

    known = tuple(entry for entry in listed if entry in allowed)

    return known or tuple(fallback)  # type: ignore[return-value]


def resolve_prefix(starts_with: str) -> str:
    """Return `starts_with` narrowed to the single character generators match on.

    One character rather than a string: it is applied to the first *word* a
    result is built from, and a two-character prefix would rule out most pools.
    """
    return starts_with.strip()[:1] if isinstance(starts_with, str) else ""


_INVENT_CHANCE: dict[str, int] = {"real": 0, "mixed": 50, "invented": 100}
"""How often a part is invented rather than drawn, per level, as a percentage."""


def resolve_realism(realism: RandRealism) -> int:
    """Return `realism` as the chance of inventing one part, as a percentage.

    That is what every generator actually asks of it. A level the type rules out but an
    unchecked caller can still pass falls back to the default rather than raising.
    """
    # A list or a dict is no level, and cannot be looked up in one either.
    return _INVENT_CHANCE.get(realism, 0) if isinstance(realism, str) else 0


_VOCABULARIES: tuple[RandVocabulary, ...] = ("basic", "common", "full")


def resolve_vocabulary(vocabulary: RandVocabulary) -> RandVocabulary:
    """Return `vocabulary` as one of the three levels, falling back to every word.

    What `rand_word`, `rand_nickname` and `rand_sentence` narrow their noun pools by. A
    level the type rules out but an unchecked caller can still pass falls back to the
    default rather than raising.
    """
    return vocabulary if vocabulary in _VOCABULARIES else "full"


def resolve_length(value: int | None) -> int | None:
    """Return a length bound as a whole number, or None when it was left out."""
    return None if value is None else _whole(value)


def length_bounds(
    low: int | None,
    high: int | None,
    natural_low: int,
    natural_high: int,
    ceiling: int = RAND_LENGTH_MAX,
) -> tuple[int, int]:
    """Return the caller's bounds against a natural range, clamped to what is allowed.

    `ceiling` is the highest bound the generator will serve, and only `rand_sentence`
    passes one of its own: a sentence is many words where every other generator
    produces at most three, so `RAND_LENGTH_MAX` would cut most of them in half.
    """
    resolved_low = clamp(natural_low if low is None else low, RAND_LENGTH_MIN, ceiling)
    resolved_high = clamp(natural_high if high is None else high, RAND_LENGTH_MIN, ceiling)

    # A range the wrong way round is a caller contradicting themselves, and the bound
    # that survives is `max_length` — the one they are usually holding to, a field
    # limit or a column width, where `min_length` only shapes how a result reads.
    # `(30, 5)` used to read as `(30, 30)`, which is the other way about.
    return min(resolved_low, resolved_high), resolved_high


def resolve_platforms(platform: object) -> tuple[SystemPlatform, ...]:
    """The platforms a call may draw from: the one named, or both for `"all"` and the rest."""
    return (platform,) if platform in SYSTEM_PLATFORMS else SYSTEM_PLATFORMS


_YEAR_MAX = 9999
"""The latest year a catalog bound is read up to.

A year of four digits is as far as anything here is dated, and nothing in a catalog
comes close to either end.
"""


def resolve_years(min_year: object, max_year: object) -> tuple[int, int]:
    """`min_year` and `max_year` as the years a catalog draw may come from, both included.

    A bound left out is no bound, and a range the wrong way round keeps `max_year`, the
    way a length range keeps `max_length`: it is the one a caller usually means — "as of
    2015" — where `min_year` only trims the old end.

    Args:
        min_year: The earliest year, or None for no bound.
        max_year: The latest year, or None for no bound.

    Returns:
        The two years, the first never after the second.
    """
    high = resolve_whole(max_year, _YEAR_MAX, 0, _YEAR_MAX)

    return min(resolve_whole(min_year, 0, 0, _YEAR_MAX), high), high


def draw_language(option: str, languages: Sequence[L]) -> L:
    """Return the language one draw uses: the requested one, or any for `"all"`."""
    return pick(languages) if option == "all" else option  # type: ignore[return-value]


def languages_fitting(
    languages: Sequence[L],
    min_length: int | None,
    max_length: int | None,
    range_of: Callable[[L], tuple[int, int]],
) -> tuple[L, ...]:
    """The languages whose own range of lengths meets the range the caller asked for.

    Every one of them when none does. With every language in play, a range only some of
    them can reach was answered by the rest with the closest result they had:
    `rand_word(max_length=1)` kept to one character a quarter of the time, because only
    the CJK languages write a word that short. A language that cannot meet the range is
    left out, the way `languages_writing` leaves out one that cannot write
    `starts_with`; when none can, every language is kept and each answers with its
    closest.

    Args:
        languages: The languages still in play.
        min_length: The caller's minimum, or None.
        max_length: The caller's maximum, or None.
        range_of: A language's own shortest and longest result.

    Returns:
        The languages that can meet the range, or all of them when none can.
    """
    if len(languages) < 2 or (min_length is None and max_length is None):
        return tuple(languages)

    low = 0 if min_length is None else min_length
    fitting = tuple(
        code
        for code in languages
        if range_of(code)[1] >= low and (max_length is None or range_of(code)[0] <= max_length)
    )

    return fitting or tuple(languages)


def languages_writing(option: str, languages: Sequence[L], prefix: str) -> tuple[L, ...]:
    """The languages a draw may come from once `starts_with` has had its say.

    The requested one, or every one of them for `"all"`, minus the ones that do not
    write the requested character's script. A character a language does not write is
    a character it can never lead a result with, and a generator asked for one anyway
    used to answer with the character glued to the front — `rand_name(language="ko",
    starts_with="Q")` came back `Q대겸`, which is a Latin letter and a Korean given
    name in one string and a name in neither language.

    Args:
        option: The language the caller asked for, or `"all"`.
        languages: Every language the generator knows.
        prefix: The requested first character, or `""`.

    Returns:
        The languages that can answer, which is empty when none can — and the
        generators pass that on as no results at all, the way `unique` already
        answers an exhausted pool with fewer results rather than with wrong ones.
    """
    wanted: tuple[L, ...] = tuple(languages) if option == "all" else (option,)  # type: ignore[assignment]

    if not prefix:
        return wanted

    return tuple(code for code in wanted if writes_script(code, prefix))


_COLLECT_STALL = 2000
"""How many draws in a row may add nothing before `collect` stops, at the least.

The run is twenty draws for each result found so far, when that comes to more. With k
results found, a pool drawn evenly that holds one more gives it one draw in k + 1, and
twenty times k draws in a row miss it about twice in a billion; the floor gives the same
odds to a result one draw in a hundred finds. Only a call of more than thirty results ever
reaches the floor, since a smaller one runs out of attempts first. A pool drawn by weight
can still stop short of a result far rarer than the rest, which is why a catalog draws
through `collect_from` instead.
"""

_COLLECT_STALL_PER_RESULT = 20
"""How many draws in a row `collect` waits through for each result found so far."""


def collect(
    *,
    count: int,
    unique: bool,
    starts_with: str,
    draw: Callable[[], T],
    key_of: Callable[[T], str],
    unique_of: Callable[[T], str] | None = None,
) -> list[T]:
    """Draw until there are `count` results, discarding what the filters reject.

    Args:
        count: How many results the caller asked for, before clamping.
        unique: Whether a result already returned should be drawn again.
        starts_with: The single character every result has to begin with.
        draw: Produces one candidate result.
        key_of: The string a result is filtered and deduplicated by.
        unique_of: Another string to deduplicate by, where the one handed back is not
            the one `starts_with` reads: a romanized name is returned in Latin letters
            and matched against the native first character.

    Returns:
        Up to `count` results — fewer only when `unique` exhausts the pools.
    """
    wanted = resolve_count(count)
    prefix = starts_with.lower()

    seen: set[str] = set()
    results: list[T] = []
    # Generous enough that a plain request always fills up, while still ending a
    # `unique` request whose pool has run out of combinations.
    max_attempts = wanted * 50 + 500
    attempts = 0
    missed = 0

    # A run of draws that adds nothing is a pool with nothing new left in it, and the
    # budget above was spent all the same: `rand_word(language="vi", starts_with="ư",
    # unique=True, count=2000)` found its 270 words and went on for a hundred thousand
    # draws. A result still to be found is missed only when it fails to come up that many
    # draws in a row, and the run grows with what has been found: a fixed two thousand
    # left one of the 249 countries out about once in three thousand calls.
    while (
        len(results) < wanted
        and attempts < max_attempts
        and missed < max(_COLLECT_STALL, _COLLECT_STALL_PER_RESULT * len(results))
    ):
        attempts += 1
        missed += 1

        item = draw()
        key = key_of(item)

        if not key:
            continue
        if prefix and not key.lower().startswith(prefix):
            continue

        if unique:
            once = key if unique_of is None else unique_of(item)

            if once in seen:
                continue

            seen.add(once)

        results.append(item)
        missed = 0

    return results


_OUTCOMES_KEPT = 64
"""How many sets of options a catalog keeps the outcomes of.

A caller asks with a handful; one who moves a year range call by call would otherwise keep
a list for every range, so the lists are let go at this many and listed again.
"""


def kept_outcomes(
    kept: dict[str, list[tuple[E, float]]],
    key: str,
    listed: Callable[[], list[tuple[E, float]]],
) -> list[tuple[E, float]]:
    """The outcomes a catalog lists for one set of options, kept for the calls after.

    Without it a call of one result listed the whole catalog to draw it, which made
    `rand_os()` slower than the draw it replaced. `key` has to name every option the list
    depends on, and nothing a result is only written by — a maker in front of a model is
    `key_of`'s business, not the list's.

    Args:
        kept: The catalog's own table of lists, by key.
        key: Every option the list depends on, written out.
        listed: Lists the outcomes, the first time a call asks with `key`.

    Returns:
        The outcomes, listed now or by an earlier call.
    """
    outcomes = kept.get(key)

    if outcomes is None:
        if len(kept) >= _OUTCOMES_KEPT:
            kept.clear()

        outcomes = listed()
        kept[key] = outcomes

    return outcomes


def collect_from(
    *,
    count: int,
    unique: bool,
    starts_with: str,
    outcomes: Sequence[tuple[E, float]],
    key_of: Callable[[E], str],
    build: Callable[[E], T],
) -> list[T]:
    """`collect` for a generator that can list every result it may return.

    A catalog, where a draw only picks. Each result comes up as often as its weight says,
    and two outcomes with the same `key_of` are one result, as likely as the two of them
    together. `build` writes the result out of the entry it came up on, once for each time
    it comes up, so no two results are the same object.

    A `unique` call takes each result out as it comes up, which deals the same odds as
    drawing again on a repeat and stops exactly when the list runs out. `collect` can only
    guess that from a run of draws that found nothing new, and a list drawn by weight beat
    the guess: `rand_os` asked for every release came back short one call in six, even once
    the run grew with what had been found.

    Args:
        count: How many results the caller asked for, before clamping.
        unique: Whether a result already returned should come up again.
        starts_with: The single character every result has to begin with.
        outcomes: Every entry a result may be built from, each with its weight.
        key_of: The string a result is filtered and deduplicated by.
        build: Writes the result out of its entry.

    Returns:
        Up to `count` results — fewer only when `unique` exhausts the list.
    """
    wanted = resolve_count(count)
    prefix = starts_with.lower()

    if prefix:
        fitting = [outcome for outcome in outcomes if key_of(outcome[0]).lower().startswith(prefix)]
        dealt = _deal_from(_prepare(fitting), wanted, unique, key_of, build)
        assert dealt is not None
        return dealt

    # Without a `starts_with` a key is read only for what comes up — one for a call of one,
    # rather than the whole catalog's. A result whose key is empty is never returned, so an
    # entry written as nothing sends the call back to deal from the entries that are
    # written as something.
    dealt = _deal_from(
        _prepare(outcomes), wanted, unique, lambda entry: key_of(entry) or None, build
    )

    if dealt is None:
        written = [outcome for outcome in outcomes if key_of(outcome[0])]
        dealt = _deal_from(_prepare(written), wanted, unique, key_of, build)
        assert dealt is not None

    return dealt


@dataclass(frozen=True, slots=True)
class _Prepared(Generic[E]):
    """A list of outcomes made ready to draw from."""

    pool: Sequence[tuple[E, float]]
    """The outcomes that can come up."""

    totals: list[float] | None
    """The running total of their weights, so a draw is a search rather than a walk down
    the list — or None when every weight is the same, and a draw is an index."""


_prepared: dict[int, tuple[Sequence[tuple[Any, float]], _Prepared[Any]]] = {}
"""Each list made ready, keyed on the list's identity and held with it, the way
`word._generator._prefixed` holds a pool, so the identity stays its own. A list put
together for one call is held too, so the table is emptied once it reaches
`_PREPARED_KEPT` rather than growing with every call."""

_PREPARED_KEPT = 1024


def _prepare(outcomes: Sequence[tuple[E, float]]) -> _Prepared[E]:
    """`outcomes` made ready to draw from, once for each list."""
    held = _prepared.get(id(outcomes))

    if held is not None and held[0] is outcomes:
        return held[1]

    # An outcome of no weight never comes up, unless none has any, when each is as likely
    # as the next — the way `pick_weighted` reads a table of zeros.
    weighted = [outcome for outcome in outcomes if outcome[1] > 0]
    pool = weighted or [(entry, 1.0) for entry, _ in outcomes]
    even = all(weight == pool[0][1] for _, weight in pool) if pool else True
    made = _Prepared(pool, None if even else list(accumulate(weight for _, weight in pool)))

    if len(_prepared) >= _PREPARED_KEPT:
        _prepared.clear()

    _prepared[id(outcomes)] = (outcomes, made)

    return made


def _draw_index(prepared: _Prepared[E]) -> int:
    """One index of a prepared pool, drawn by its weight."""
    if prepared.totals is None:
        return int(random() * len(prepared.pool))

    return min(
        bisect_right(prepared.totals, random() * prepared.totals[-1]), len(prepared.pool) - 1
    )


_UNIQUE_REPEATS = 16
"""How many repeats in a row a unique call draws through before it deals out what is left.

Drawing again is cheaper while most of the list is still to come, and dealing is cheaper
once nearly every draw is a repeat.
"""


def _deal_from(
    prepared: _Prepared[E],
    wanted: int,
    unique: bool,
    keyed: Callable[[E], str | None],
    build: Callable[[E], T],
) -> list[T] | None:
    """Draw from outcomes `collect_from` may return.

    Args:
        prepared: The outcomes, made ready to draw from.
        wanted: How many results to draw, already clamped.
        unique: Whether a result already drawn may come up again.
        keyed: The key of an entry, or None for one that has no key.
        build: Writes the result out of its entry.

    Returns:
        The results, or None when one of the entries turns out to have no key, which
        only a list whose every key was not read can hold.
    """
    pool = prepared.pool
    results: list[T] = []

    if not pool:
        return results

    # Each entry's key, read the first time it comes up.
    keys: dict[int, str | None] = {}

    def key_at(index: int) -> str | None:
        if index not in keys:
            keys[index] = keyed(pool[index][0])

        return keys[index]

    if not unique:
        while len(results) < wanted:
            index = _draw_index(prepared)

            if key_at(index) is None:
                return None

            results.append(build(pool[index][0]))

        return results

    seen: set[str] = set()
    repeats = 0

    while len(results) < wanted and repeats < _UNIQUE_REPEATS:
        index = _draw_index(prepared)
        key = key_at(index)

        if key is None:
            return None

        if key in seen:
            repeats += 1
            continue

        seen.add(key)
        results.append(build(pool[index][0]))
        repeats = 0

    if len(results) >= wanted:
        return results

    # The rest is dealt out of what is left. Each entry waits a time drawn at the rate of
    # its weight, and they come up in the order a draw that skips repeats would find them:
    # the next is each one's by its share of the weight left, the way it was for every draw
    # before. That holds from here as it did from the start, since a wait drawn this way
    # does not remember how long it has run. Ties keep the list's order.
    left: list[tuple[float, int, str]] = []

    for index, (_, weight) in enumerate(pool):
        key = key_at(index)

        if key is None:
            return None

        if key not in seen:
            left.append((-math.log(1 - random()) / weight, index, key))

    left.sort()

    for _, index, key in left:
        if len(results) >= wanted:
            break

        if key in seen:
            continue

        seen.add(key)
        results.append(build(pool[index][0]))

    return results
