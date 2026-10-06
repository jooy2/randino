"""The age groups and the curve every age is drawn along."""

from randino._internal.generate import resolve_many, resolve_option
from randino._types import AgeDistribution, AgeGroup
from randino.constants import RAND_AGE_MAX

AGE_GROUPS: tuple[AgeGroup, ...] = ("child", "teen", "adult", "senior")
"""The groups an age can fall in, youngest first."""

AGE_BANDS: dict[AgeGroup, tuple[int, int]] = {
    "child": (0, 12),
    "teen": (13, 19),
    "adult": (20, 64),
    "senior": (65, RAND_AGE_MAX),
}
"""The ages each group covers, both ends included.

They meet without a gap and run from `0` to `RAND_AGE_MAX`, so every age the generator
can return is in exactly one of them.
"""

AGE_CURVE: tuple[tuple[int, float], ...] = (
    (0, 35),
    (10, 55),
    (18, 80),
    (25, 100),
    (35, 100),
    (45, 85),
    (55, 75),
    (65, 60),
    (70, 50),
    (75, 30),
    (80, 18),
    (85, 9),
    (90, 4),
    (95, 1),
    (100, 0.3),
    (110, 0.02),
    (RAND_AGE_MAX, 0),
)
"""How many people are a given age, relative to the most common ages.

Written as `(age, weight)` points: every age between two points is drawn on the straight
line between them. It is the shape of a population rather than any one country's census,
and it is written by hand rather than measured — see the JavaScript package's
`age/data/index.ts` for the shares it works out to.
"""

AGE_MAX_DEFAULT = 100
"""What `max_age` is when it is left out: a centenarian is already a rare draw.

A `min_age` above it moves the default to `RAND_AGE_MAX` instead.
"""

AGE_DISTRIBUTIONS: tuple[AgeDistribution, ...] = ("population", "uniform")
"""Every value `distribution` accepts."""


def resolve_age_groups(group: object) -> tuple[AgeGroup, ...]:
    """The caller's `group` as the groups it names, or every group for `"all"`."""
    return resolve_many(group, AGE_GROUPS, AGE_GROUPS)


def resolve_distribution(distribution: object) -> AgeDistribution:
    """The caller's `distribution`, or `"population"` for one this package does not know."""
    return resolve_option(distribution, AGE_DISTRIBUTIONS, "population")
