"""Ages: drawn along a curve shaped like a population, inside the range asked for."""

from itertools import pairwise

from randino import AGE_GROUPS, RAND_AGE_MAX, RAND_COUNT_MAX, AgeGroup, rand_age

# Internal, but they are what an age is checked against: the bands say which group an
# age is in, and the curve is what the draw follows.
from randino.age.data import AGE_BANDS, AGE_CURVE

SAMPLE = 60

LARGE = 6000
"""Large enough that a share is within a point or two of the curve's.

So the distribution can be asserted with room to spare rather than by luck.
"""


def in_band(age: int, group: AgeGroup) -> bool:
    """Whether `age` is inside the band of `group`."""
    low, high = AGE_BANDS[group]

    return low <= age <= high


def share(ages: list[int], low: int, high: int) -> float:
    """The share of `ages` from `low` to `high`, as a percentage."""
    return 100 * sum(1 for age in ages if low <= age <= high) / len(ages)


def test_rand_age_returns_one_whole_number_by_default() -> None:
    ages = rand_age()

    assert len(ages) == 1
    assert isinstance(ages[0], int)


def test_returns_exactly_count_ages() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_age(count=count)) == count

    assert rand_age(count=-3) == []
    assert len(rand_age(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_the_default_range_is_0_to_100() -> None:
    assert all(0 <= age <= 100 for age in rand_age(count=LARGE))


def test_every_age_is_inside_min_age_and_max_age() -> None:
    for min_age, max_age in ((18, 30), (0, 0), (65, 65), (100, 120)):
        for age in rand_age(min_age=min_age, max_age=max_age, count=SAMPLE):
            assert min_age <= age <= max_age, age


def test_the_bounds_are_clamped_and_a_range_the_wrong_way_round_keeps_max_age() -> None:
    assert all(0 <= age <= RAND_AGE_MAX for age in rand_age(min_age=-10, max_age=500, count=SAMPLE))
    assert rand_age(min_age=30, max_age=5, count=5) == [5, 5, 5, 5, 5]


def test_group_narrows_the_ages_to_its_band() -> None:
    for group in AGE_GROUPS:
        for detail in rand_age(group=group, count=SAMPLE, output="detail"):
            assert detail.group == group
            assert in_band(detail.age, group), (detail.age, group)

    for age in rand_age(group=("child", "senior"), count=SAMPLE):
        assert in_band(age, "child") or in_band(age, "senior"), age


def test_a_group_narrows_the_range_rather_than_replacing_it() -> None:
    assert all(20 <= age <= 30 for age in rand_age(group="adult", max_age=30, count=SAMPLE))


def test_a_group_the_range_has_no_age_of_leaves_the_range_to_answer() -> None:
    ages = rand_age(group="senior", min_age=20, max_age=40, count=SAMPLE)

    assert all(20 <= age <= 40 for age in ages)


def test_the_detail_reports_the_group_the_age_is_in() -> None:
    for detail in rand_age(count=SAMPLE * 5, output="detail"):
        assert in_band(detail.age, detail.group), detail


def test_the_bands_cover_every_age_once_and_the_curve_spans_them() -> None:
    following = 0

    for group in AGE_GROUPS:
        low, high = AGE_BANDS[group]

        assert low == following, f"{group} does not start where the last band ended"
        assert high >= low
        following = high + 1

    assert following == RAND_AGE_MAX + 1
    assert AGE_CURVE[0][0] == 0
    assert AGE_CURVE[-1] == (RAND_AGE_MAX, 0)

    for (start, _), (end, weight) in pairwise(AGE_CURVE):
        assert end > start, "the curve has to move forward"
        assert weight >= 0


def test_the_population_curve_favours_young_adults_over_children_and_the_old() -> None:
    ages = rand_age(count=LARGE)

    def per_year(low: int, high: int) -> float:
        # Per year of age, so that a band of twenty years is not favoured for being wide.
        return share(ages, low, high) / (high - low + 1)

    assert share(ages, 20, 64) > 55, "adults are most of a population"
    assert per_year(20, 39) > per_year(0, 12) * 1.3, "more young adults than children"
    assert per_year(20, 39) > per_year(65, 100) * 2, "more young adults than seniors"
    assert per_year(60, 69) > per_year(75, 84) * 1.5, "the old thin out past seventy"
    assert share(ages, 90, 100) < 2, "a nonagenarian is a rare draw"


def test_uniform_draws_every_age_alike() -> None:
    ages = rand_age(count=LARGE, distribution="uniform")
    mean = sum(ages) / len(ages)

    # An even draw over 0..100 averages 50; the population curve averages under 40.
    assert abs(mean - 50) < 3, mean
    assert share(ages, 80, 100) > 15, "the old are as likely as anybody"


def test_a_min_age_past_the_default_max_age_reaches_for_the_oldest_ages() -> None:
    assert all(105 <= age <= RAND_AGE_MAX for age in rand_age(min_age=105, count=SAMPLE))
    # The curve reaches zero at its last age, which is still drawn when it is the only age
    # the range holds.
    assert rand_age(min_age=RAND_AGE_MAX, count=3) == [RAND_AGE_MAX] * 3


def test_unique_never_repeats_an_age_and_stops_when_the_range_runs_out() -> None:
    ages = rand_age(min_age=10, max_age=14, count=10, unique=True)

    assert sorted(ages) == [10, 11, 12, 13, 14]

    many = rand_age(count=50, unique=True)

    assert len(set(many)) == len(many)
