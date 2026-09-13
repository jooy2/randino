"""The parts every generator shares: the common options, and the draw loop.

`rand_name`, `rand_nickname` and `rand_word` differ in what one draw produces
and in nothing else about this — the same clamping, the same `starts_with`
filter, the same `unique` bookkeeping and the same attempt budget. Written once
here, a new generator gets all of it by calling `collect`.
"""

import math
from collections.abc import Callable, Sequence
from typing import TypeVar

from randino._internal.script import writes_script
from randino._internal.utils import clamp, pick
from randino._types import RandRealism, RandVocabulary
from randino.constants import RAND_COUNT_MAX, RAND_LENGTH_MAX, RAND_LENGTH_MIN

T = TypeVar("T")
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
        The floor of the number, or None when it is not a finite one.
    """
    try:
        number = float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None

    return math.floor(number) if math.isfinite(number) else None


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
    return _INVENT_CHANCE.get(realism, 0)


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


def draw_language(option: str, languages: Sequence[L]) -> L:
    """Return the language one draw uses: the requested one, or any for `"all"`."""
    return pick(languages) if option == "all" else option  # type: ignore[return-value]


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


def collect(
    *,
    count: int,
    unique: bool,
    starts_with: str,
    draw: Callable[[], T],
    key_of: Callable[[T], str],
) -> list[T]:
    """Draw until there are `count` results, discarding what the filters reject.

    Args:
        count: How many results the caller asked for, before clamping.
        unique: Whether a result already returned should be drawn again.
        starts_with: The single character every result has to begin with.
        draw: Produces one candidate result.
        key_of: The string a result is filtered and deduplicated by.

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

    while len(results) < wanted and attempts < max_attempts:
        attempts += 1

        item = draw()
        key = key_of(item)

        if not key:
            continue
        if prefix and not key.lower().startswith(prefix):
            continue

        if unique:
            if key in seen:
                continue

            seen.add(key)

        results.append(item)

    return results
