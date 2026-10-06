"""Ages for sample people, drawn along a curve shaped like a population."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import AgeDetail, AgeDistribution, AgeGroupOption
from randino.age._generator import generate_age_details


@overload
def rand_age(
    *,
    count: int = ...,
    min_age: int | None = ...,
    max_age: int | None = ...,
    group: AgeGroupOption = ...,
    distribution: AgeDistribution = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[int]: ...


@overload
def rand_age(
    *,
    count: int = ...,
    min_age: int | None = ...,
    max_age: int | None = ...,
    group: AgeGroupOption = ...,
    distribution: AgeDistribution = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[AgeDetail]: ...


def rand_age(
    *,
    count: int = 1,
    min_age: int | None = None,
    max_age: int | None = None,
    group: AgeGroupOption = "all",
    distribution: AgeDistribution = "population",
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[int] | list[AgeDetail]:
    """Generate ages for sample people, in whole years.

    The draw follows a curve shaped like a population rather than an even spread, so young
    adults come up far more often than children or anybody past seventy.

    Args:
        count: How many ages to return. Held inside `0`..`RAND_COUNT_MAX`.
        min_age: The youngest age to return. Defaults to `0`.
        max_age: The oldest age to return. Defaults to `100`, or to `RAND_AGE_MAX` when
            `min_age` is above 100, and is held inside `0`..`RAND_AGE_MAX`. A range the
            wrong way round keeps `max_age`.
        group: Which parts of a life the ages come from — one group, a sequence of them,
            or `"all"`. It narrows the range rather than replacing it, and a group with no
            age inside the range leaves the range to answer, as though none was named.
        distribution: `"population"` follows the curve; `"uniform"` draws every age in
            the range alike.
        unique: Never return the same age twice. Returns fewer than `count` once the
            range runs out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for numbers, `"detail"` for an `AgeDetail` per age — the age and
            the group it falls in.

    Returns:
        A `list[int]`, or a `list[AgeDetail]` when `output="detail"` — the overloads carry
        that through, so a type checker knows which one it got.

    Example:
        >>> rand_age()
        [34]
        >>> rand_age(min_age=18, count=3)
        [22, 45, 31]
        >>> rand_age(group="senior", count=3)
        [71, 66, 80]
        >>> rand_age(output="detail")
        [AgeDetail(age=16, group='teen')]
    """
    details = generate_age_details(
        count=count,
        min_age=min_age,
        max_age=max_age,
        group=group,
        distribution=distribution,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.age for detail in details]
