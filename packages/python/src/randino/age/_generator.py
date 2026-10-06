"""The age generator: a whole number of years, drawn along a curve shaped like a population.

Every option narrows the ages a draw may land on, and the curve says how likely each of
them is. Nothing is fitted afterwards, so an age is always one the caller's range and
groups allow.
"""

from collections.abc import Callable
from itertools import pairwise

from randino._internal.generate import collect, resolve_whole
from randino._internal.utils import pick_weighted, with_random
from randino._types import AgeDetail, AgeDistribution, AgeGroup, AgeGroupOption
from randino.age.data import (
    AGE_BANDS,
    AGE_CURVE,
    AGE_GROUPS,
    AGE_MAX_DEFAULT,
    resolve_age_groups,
    resolve_distribution,
)
from randino.constants import RAND_AGE_MAX


def curve_weight(age: int) -> float:
    """How common `age` is on the curve, read off the line between the points around it."""
    for (start, low), (end, high) in pairwise(AGE_CURVE):
        if age <= end:
            return low + (high - low) * (age - start) / (end - start)

    return 0.0


def group_of(age: int) -> AgeGroup:
    """The group an age falls in. The bands cover every age, so one always answers."""
    return next((group for group in AGE_GROUPS if age <= AGE_BANDS[group][1]), "senior")


def _candidates(
    min_age: int | None,
    max_age: int | None,
    group: object,
    distribution: AgeDistribution,
) -> list[tuple[int, float]]:
    """The ages one call may land on, each with how likely it is.

    Worked out once per call rather than per draw: it is at most a hundred and twenty-one
    entries, and a call of ten thousand would otherwise read the curve a million times
    over.
    """
    asked = resolve_whole(min_age, 0, 0, RAND_AGE_MAX)
    # Left out, `max_age` is 100 — unless `min_age` is already past it, which asks for the
    # oldest ages there are rather than contradicting a bound nobody wrote.
    high = resolve_whole(
        max_age, RAND_AGE_MAX if asked > AGE_MAX_DEFAULT else AGE_MAX_DEFAULT, 0, RAND_AGE_MAX
    )
    # A range the wrong way round keeps `max_age`, the same way a length range keeps
    # `max_length`: it is the bound a caller is usually holding to.
    low = min(asked, high)
    groups = resolve_age_groups(group)
    in_range = list(range(low, high + 1))
    grouped = [age for age in in_range if group_of(age) in groups]
    # A group the range has no age of cannot be answered inside it, and the range is the
    # harder ask: it is a number the caller wrote, where a group is a name for one. So the
    # range wins, as though no group had been named.
    ages = grouped or in_range
    uniform = resolve_distribution(distribution) == "uniform"

    return [(age, 1.0 if uniform else curve_weight(age)) for age in ages]


def generate_age_details(
    *,
    count: int = 1,
    min_age: int | None = None,
    max_age: int | None = None,
    group: AgeGroupOption = "all",
    distribution: AgeDistribution = "population",
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[AgeDetail]:
    """Generate `count` ages, applied to every option."""
    candidates = _candidates(min_age, max_age, group, distribution)

    def draw() -> AgeDetail:
        age, _ = pick_weighted(candidates, lambda candidate: candidate[1])

        return AgeDetail(age=age, group=group_of(age))

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: str(detail.age),
        )
