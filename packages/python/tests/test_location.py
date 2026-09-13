"""The location generators: `rand_location` and one per level below it."""

import re
import unicodedata
from typing import Any, NamedTuple

from randino import (
    LOCATION_LANGUAGES,
    RAND_COUNT_MAX,
    LocationDetail,
    LocationLanguage,
    LocationLevel,
    rand_city,
    rand_country,
    rand_district,
    rand_location,
    rand_region,
)

# The datasets are internal, but a location is only real if it is one of theirs — these
# are what tie the output back to the outline each language ships.
from randino._internal.parse import outline
from randino.location.data import LOCATION_DATA

SAMPLE = 60

# What one division's name may be written with. Korean names carry a digit where the
# division does (`종로1가`); US names carry the punctuation their own official names do
# (`O'Fallon`, `Winston-Salem`, `St. Louis`).
KOREAN_NAME = re.compile(r"[가-힣0-9]+(?: [가-힣0-9]+)?")
ENGLISH_MARKS = frozenset("0123456789 .,'()/-")


def is_name(language: LocationLanguage, name: str) -> bool:
    """Whether `name` is written the way a division of `language` is.

    English is judged letter by letter against the Unicode name, which is the nearest the
    standard library comes to the Latin-script class the JavaScript suite matches with.
    """
    if language == "ko":
        return KOREAN_NAME.fullmatch(name) is not None

    return bool(name) and all(
        char in ENGLISH_MARKS or unicodedata.name(char, "").startswith("LATIN ") for char in name
    )


DEPTH: dict[LocationLevel, int] = {"country": 0, "region": 1, "city": 2, "district": 3}


class Place(NamedTuple):
    """One division an outline holds, by the name of every level it sits at."""

    region: str
    city: str | None
    district: str | None


def places_of(language: LocationLanguage) -> list[Place]:
    """Every division a language's outline holds, in the order it holds them."""
    data = LOCATION_DATA[language]
    places: list[Place] = []

    for entry in outline(data.outline, len(data.levels)):
        named: dict[str, str | None] = {"region": None, "city": None, "district": None}

        for depth, level in enumerate(data.levels):
            named[level] = entry.path[depth] if depth < len(entry.path) else None

        places.append(Place(named["region"] or "", named["city"], named["district"]))

    return places


def key_of(place: Place | LocationDetail) -> str:
    """The levels of a place or a detail, as one string to look the other up by."""
    return "/".join((place.region or "", place.city or "", place.district or ""))


LISTED: dict[LocationLanguage, list[Place]] = {
    language: places_of(language) for language in LOCATION_LANGUAGES
}

PLACES: dict[LocationLanguage, dict[str, Place]] = {
    language: {key_of(place): place for place in places} for language, places in LISTED.items()
}


def written(detail: LocationDetail) -> str:
    """What a detail writes out, rebuilt from its own levels."""
    data = LOCATION_DATA[detail.language]
    parts = [
        part
        for part in (detail.country, detail.region, detail.city, detail.district)
        if part is not None
    ]

    return data.joiner.join(parts if data.order == "largest-first" else parts[::-1])


def test_rand_location_returns_one_location_by_default() -> None:
    locations = rand_location()

    assert len(locations) == 1
    assert isinstance(locations[0], str)


def test_every_generator_returns_exactly_count_results() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_location(count=count)) == count
        assert len(rand_country(count=count)) == count
        assert len(rand_region(count=count)) == count
        assert len(rand_city(count=count)) == count
        assert len(rand_district(count=count)) == count

    assert len(rand_location(count=-3)) == 0
    assert len(rand_region(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_a_location_is_written_out_from_its_own_levels_in_its_languages_order() -> None:
    for language in LOCATION_LANGUAGES:
        for detail in rand_location(language=language, count=SAMPLE, output="detail"):
            assert detail.language == language
            assert detail.country == LOCATION_DATA[language].country
            assert detail.location == written(detail), detail.location

    assert rand_location(language="ko")[0].startswith("대한민국 ")
    assert rand_location(language="en")[0].endswith(", United States")


def test_every_division_is_one_the_dataset_holds_inside_the_division_beside_it() -> None:
    for language in LOCATION_LANGUAGES:
        for detail in rand_location(language=language, count=SAMPLE * 5, output="detail"):
            assert key_of(detail) in PLACES[language], (
                f"{language}: {detail.location} is not in the outline"
            )

            for name in (detail.region, detail.city, detail.district):
                if name is not None:
                    assert is_name(language, name), detail.location


def test_level_says_how_far_down_and_stops_at_the_deepest_one_its_country_has() -> None:
    levels: tuple[LocationLevel, ...] = ("country", "region", "city", "district")

    for level in levels:
        for detail in rand_location(language="ko", level=level, count=SAMPLE, output="detail"):
            # 세종특별자치시 has no 시·군·구, so a location asked for a city can stop at the
            # region; nothing ever goes past the level asked for.
            assert DEPTH[detail.level] <= DEPTH[level], detail.location
            assert (detail.district is None) == (level != "district")
            assert (detail.region is None) == (level == "country")

    for detail in rand_location(language="en", count=SAMPLE, output="detail"):
        assert detail.level == "city"
        assert detail.district is None

    assert rand_location(language="en", level="country", count=2) == [
        "United States",
        "United States",
    ]


def test_a_region_with_no_city_is_still_a_location_at_the_city_level() -> None:
    # Every city-level location of that exact length, which is few enough for the draws
    # `unique` allows to reach all of them.
    locations = rand_location(
        language="ko",
        level="city",
        min_length=len("대한민국 세종특별자치시"),
        max_length=len("대한민국 세종특별자치시"),
        unique=True,
        count=1000,
    )

    assert "대한민국 세종특별자치시" in locations


def test_each_level_has_a_generator_of_its_own_handing_back_that_level_alone() -> None:
    generators = {"region": rand_region, "city": rand_city, "district": rand_district}

    for level, generate in generators.items():
        for detail in generate(count=SAMPLE, output="detail"):
            assert detail.level == level
            assert detail.location == getattr(detail, level)
            assert key_of(detail) in PLACES[detail.language], detail.location

    assert rand_country(language="ko") == ["대한민국"]
    assert rand_country(language="en", output="detail") == [
        LocationDetail(
            location="United States",
            language="en",
            level="country",
            country="United States",
            region=None,
            city=None,
            district=None,
        )
    ]


def test_a_level_the_country_does_not_have_is_nothing_and_all_skips_that_country() -> None:
    assert rand_district(language="en", count=5) == []

    for detail in rand_district(count=SAMPLE, output="detail"):
        assert detail.language == "ko"


def test_the_mixed_language_uses_every_language_it_knows() -> None:
    languages = {detail.language for detail in rand_city(count=SAMPLE, output="detail")}

    assert sorted(languages) == sorted(LOCATION_LANGUAGES)


def test_an_unknown_language_or_level_falls_back_to_the_default() -> None:
    # Reached through `Any` on purpose: the caller this is about is the one the types do
    # not describe.
    loose: Any = rand_location
    detail: LocationDetail = loose(language="ja", level="street", output="detail")[0]

    assert detail.language in LOCATION_LANGUAGES
    assert detail.level == "district" or detail.language == "en"


def test_starts_with_leads_every_result_with_the_requested_character() -> None:
    for city in rand_city(language="en", starts_with="Z", count=SAMPLE):
        assert city.startswith("Z")

    for district in rand_district(starts_with="역", count=SAMPLE):
        assert district.startswith("역")

    # Matched without regard to case, the way every generator matches it.
    assert rand_region(language="en", starts_with="n")[0].startswith("N")


def test_a_starts_with_no_language_or_division_can_lead_with_is_answered_with_nothing() -> None:
    assert rand_location(language="ko", starts_with="Q") == []
    assert rand_city(starts_with="ж") == []
    # Every Korean location opens on the country, so no other character can lead one.
    assert rand_location(language="ko", starts_with="서") == []
    # And a language that cannot answer is out before a draw, rather than half the draws.
    assert len(rand_city(starts_with="Z", count=10)) == 10


def test_results_stay_inside_the_requested_length_range() -> None:
    for city in rand_city(language="en", min_length=5, max_length=6, count=SAMPLE):
        assert 5 <= len(city) <= 6, city

    for location in rand_location(language="ko", max_length=16, count=SAMPLE):
        assert len(location) <= 16, location


def test_a_range_nothing_fits_is_answered_with_the_closest_division_not_with_none() -> None:
    longest = max(len(place.city or "") for place in LISTED["en"])

    for city in rand_city(language="en", min_length=60, count=5):
        assert len(city) == longest

    # An overshoot is worse than an undershoot of the same size.
    for region in rand_region(language="ko", max_length=2, count=5):
        assert len(region) == 3, region


def test_unique_never_repeats_a_result_and_stops_when_the_pool_runs_out() -> None:
    regions = rand_region(language="en", unique=True, count=SAMPLE)

    assert len(set(regions)) == len(regions)
    assert len(regions) == 51
    assert len(rand_country(unique=True, count=5)) == 2


def test_the_korean_dataset_stops_above_the_ri_and_writes_a_district_after_its_city() -> None:
    places = LISTED["ko"]
    regions = [place for place in places if place.city is None and place.district is None]
    cities = {place.city for place in places if place.city}

    assert len(regions) == 16

    for place in places:
        if place.district:
            assert re.search(r"(?:동|읍|면|가|로)$", place.district), place.district
            assert not re.search(r"리$|출장소", place.district), place.district

    for city in cities:
        # `수원시장안구` is how the file writes it and not how an address does.
        assert not re.search(r"시\S+구$", city), city

    assert "수원시 장안구" in cities
    # 세종특별자치시 has no 시·군·구, and its 읍·면·동 sit directly under it.
    assert any(
        place.region == "세종특별자치시" and place.city is None and place.district
        for place in places
    )
    assert not any(place.region == "세종특별자치시" and place.city is not None for place in places)


def test_the_us_dataset_is_the_fifty_states_and_dc_with_places_named_as_called() -> None:
    places = LISTED["en"]
    regions = {place.region for place in places}

    assert len(regions) == 51
    assert "District of Columbia" in regions
    assert "Puerto Rico" not in regions

    seen: set[str] = set()

    for place in places:
        if not place.city:
            continue

        assert not re.search(
            r" (?:city|town|village|borough|CDP|municipality)$|\(balance\)", place.city
        ), place.city

        key = f"{place.region}/{place.city}"

        assert key not in seen, f"{key} is listed twice"
        seen.add(key)
