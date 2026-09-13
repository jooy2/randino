"""The location generators: `rand_location` and one per level below it."""

import re
import unicodedata
from collections.abc import Callable
from typing import Any, NamedTuple

from randino import (
    LOCATION_LANGUAGES,
    RAND_COUNT_MAX,
    WORD_LANGUAGES,
    LocationDetail,
    LocationLanguage,
    LocationLevel,
    WordLanguage,
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
from randino.location.data.countries import COUNTRIES
from tests.test_name import script

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


# The script a country's name opens on, per word language. Python's `re` has no
# `\p{Script=…}`, so the alphabetic ones are judged by the character's Unicode name.
OPENS: dict[WordLanguage, Callable[[str], bool]] = {
    "en": script("LATIN"),
    "ko": lambda char: re.fullmatch(r"[가-힣]", char) is not None,
    "ja": lambda char: re.fullmatch(r"[぀-ヿ一-鿿]", char) is not None,
    "zh": lambda char: re.fullmatch(r"[一-鿿]", char) is not None,
    "vi": script("LATIN"),
    "es": script("LATIN"),
    "it": script("LATIN"),
    "de": script("LATIN"),
    "ru": script("CYRILLIC"),
}

COUNTRY_ROWS: list[list[str]] = [
    line.strip().split("|") for line in COUNTRIES.table.strip().split("\n")
]
"""The country table as rows of `[code, name, name, …]`."""


def countries_in(language: WordLanguage) -> dict[str, str]:
    """Every country's name in one language, by its code."""
    column = COUNTRIES.languages.index(language) + 1

    return {row[0]: row[column] for row in COUNTRY_ROWS}


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


def test_include_country_false_writes_a_location_without_its_country() -> None:
    for language in LOCATION_LANGUAGES:
        data = LOCATION_DATA[language]

        for detail in rand_location(
            language=language, include_country=False, count=SAMPLE, output="detail"
        ):
            parts = [part for part in (detail.region, detail.city, detail.district) if part]

            assert detail.location == data.joiner.join(
                parts if data.order == "largest-first" else parts[::-1]
            )
            assert detail.country == data.country
            assert data.country not in detail.location, detail.location

    # A location at the country level is the country, so it is written either way.
    assert rand_location(language="en", level="country", include_country=False) == ["United States"]

    # `starts_with` and the length arguments read the string that is written.
    for location in rand_location(
        language="ko", include_country=False, starts_with="서", count=SAMPLE
    ):
        assert location.startswith("서울특별시 ")

    for location in rand_location(
        language="ko", include_country=False, max_length=10, count=SAMPLE
    ):
        assert len(location) <= 10, location


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


def test_rand_country_names_every_iso_3166_1_country_in_every_word_language() -> None:
    assert len(COUNTRY_ROWS) == 249
    assert len({row[0] for row in COUNTRY_ROWS}) == 249
    assert sorted(COUNTRIES.languages) == sorted(WORD_LANGUAGES)

    for row in COUNTRY_ROWS:
        assert re.fullmatch(r"[A-Z]{2}", row[0])
        assert len(row) == len(COUNTRIES.languages) + 1, row[0]

    for language in WORD_LANGUAGES:
        named = countries_in(language)

        for detail in rand_country(language=language, count=SAMPLE, output="detail"):
            assert detail.language == language
            assert named.get(detail.code) == detail.country, f"{language}: {detail.code}"
            assert OPENS[language](detail.country[0]), detail.country

        # Unique by name, and two countries a language names alike would be one.
        assert len(rand_country(language=language, unique=True, count=300)) == len(
            set(named.values())
        )


def test_rand_country_mixes_every_word_language_not_only_the_ones_with_divisions() -> None:
    languages = {detail.language for detail in rand_country(count=300, output="detail")}

    assert sorted(languages) == sorted(WORD_LANGUAGES)
    assert rand_country(language="de", starts_with="Ö", count=3, unique=True) == ["Österreich"]

    for name in rand_country(language="ru", max_length=5, count=SAMPLE):
        assert len(name) <= 5, name


def test_a_location_opens_on_the_name_the_country_table_gives_its_country() -> None:
    # `rand_location` and `rand_country` read one table, so they cannot spell a country two
    # ways.
    assert LOCATION_DATA["ko"].country == countries_in("ko").get("KR")
    assert LOCATION_DATA["en"].country == countries_in("en").get("US")
    assert rand_location(language="ko", level="country") == ["대한민국"]


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
