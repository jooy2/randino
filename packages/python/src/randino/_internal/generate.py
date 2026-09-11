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


def resolve_count(count: int) -> int:
    """Return `count`, floored and clamped to what a generator will serve."""
    return clamp(math.floor(count), 0, RAND_COUNT_MAX)


def resolve_prefix(starts_with: str) -> str:
    """Return `starts_with` narrowed to the single character generators match on.

    One character rather than a string: it is applied to the first *word* a
    result is built from, and a two-character prefix would rule out most pools.
    """
    return starts_with.strip()[:1]


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
    return None if value is None else math.floor(value)


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

    return resolved_low, max(resolved_low, resolved_high)


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
