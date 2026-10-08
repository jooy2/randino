"""Phone numbers: a block the plan gives out, written the way the country writes it."""

import re
from typing import Any

from randino import (
    PHONE_COUNTRIES,
    PHONE_TYPES,
    RAND_COUNT_MAX,
    PhoneCountry,
    PhoneDetail,
    PhoneType,
    rand_phone,
)

# Internal, but it is what every number is checked against.
from randino.phone.data import PHONE_DATA

SAMPLE = 60
LARGE = 3000

NATIONAL: dict[PhoneCountry, str] = {
    "US": r"^\(\d{3}\) \d{3}-\d{4}$",
    "KR": r"^0\d{1,2}-\d{3,4}-\d{4}$",
    "JP": r"^0\d{1,2}-\d{3,4}-\d{4}$",
    "CN": r"^(1\d{2}|0\d{2,3}) \d{4} \d{4}$",
    "VN": r"^0\d{2,3} \d{3,4} \d{4}$",
    "ES": r"^[6-9]\d{2} \d{2} \d{2} \d{2}$",
    "IT": r"^(3\d{2}|0\d{1,2}) \d{3,4} \d{4}$",
    "DE": r"^0\d{2,3} \d{7,8}$",
    "RU": r"^8 \(\d{3}\) \d{3}-\d{2}-\d{2}$",
}
"""How each country writes a number for itself, by the shape of the string."""

INTERNATIONAL: dict[PhoneCountry, str] = {
    "US": r"^\+1 \d{3}-\d{3}-\d{4}$",
    "KR": r"^\+82 \d{1,2}-\d{3,4}-\d{4}$",
    "JP": r"^\+81 \d{1,2}-\d{3,4}-\d{4}$",
    "CN": r"^\+86 \d{2,3} \d{4} \d{4}$",
    "VN": r"^\+84 \d{2,3} \d{3,4} \d{4}$",
    "ES": r"^\+34 \d{3} \d{2} \d{2} \d{2}$",
    # Italy keeps a landline's `0`, because it is part of the number.
    "IT": r"^\+39 [03]\d{1,2} \d{3,4} \d{4}$",
    "DE": r"^\+49 [1-9]\d{1,2} \d{7,8}$",
    "RU": r"^\+7 \d{3} \d{3}-\d{2}-\d{2}$",
}
"""How each country writes a number for the world."""

DIGITS: dict[PhoneCountry, tuple[int, int]] = {
    "US": (10, 10),
    "KR": (8, 10),
    "JP": (9, 10),
    "CN": (10, 11),
    "VN": (9, 10),
    "ES": (9, 9),
    "IT": (10, 10),
    "DE": (10, 11),
    "RU": (10, 10),
}
"""How many digits follow the calling code: the national significant number."""


def significant(detail: PhoneDetail) -> str:
    """The digits after the calling code."""
    return detail.e164[1 + len(detail.calling_code) :]


def opens_on_its_plan(detail: PhoneDetail) -> bool:
    """Whether the number opens on a prefix its country's plan lists for its type."""
    return any(
        significant(detail).startswith(prefix)
        for shape in PHONE_DATA[detail.country].plans[detail.type]
        for prefix in shape.prefixes
    )


def draw(country: PhoneCountry, type: PhoneType, **options: Any) -> list[PhoneDetail]:
    """A sample of one country's numbers of one type, as details."""
    return rand_phone(country=country, type=type, count=SAMPLE, output="detail", **options)


def test_rand_phone_returns_one_number_by_default() -> None:
    phones = rand_phone()

    assert len(phones) == 1
    assert isinstance(phones[0], str)


def test_returns_exactly_count_numbers() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_phone(count=count)) == count

    assert rand_phone(count=-3) == []
    assert len(rand_phone(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_country_writes_its_own_national_form() -> None:
    for country in PHONE_COUNTRIES:
        for type in PHONE_TYPES:
            for detail in draw(country, type):
                assert re.match(NATIONAL[country], detail.phone), (country, type, detail.phone)
                assert detail.country == country
                assert detail.type == type


def test_every_number_opens_on_a_block_its_plan_gives_out() -> None:
    for country in PHONE_COUNTRIES:
        low, high = DIGITS[country]

        for type in PHONE_TYPES:
            for detail in draw(country, type):
                assert opens_on_its_plan(detail), detail.e164
                assert re.fullmatch(r"\+\d+", detail.e164)
                assert low <= len(significant(detail)) <= high, detail.e164


def test_the_national_form_is_the_trunk_prefix_and_the_same_digits() -> None:
    for country in PHONE_COUNTRIES:
        data = PHONE_DATA[country]

        for type in PHONE_TYPES:
            trunks = {data.trunk} | {shape.trunk for shape in data.plans[type]}

            for detail in draw(country, type):
                written = re.sub(r"\D", "", detail.phone)
                rest = significant(detail)

                assert written.endswith(rest), detail.phone
                assert written[: len(written) - len(rest)] in trunks, detail.phone

    # A Chinese mobile number is dialled without the `0` a landline takes.
    assert all(detail.phone.startswith("1") for detail in draw("CN", "mobile"))


def test_include_country_code_writes_the_international_form() -> None:
    for country in PHONE_COUNTRIES:
        for type in PHONE_TYPES:
            for detail in draw(country, type, include_country_code=True):
                assert re.match(INTERNATIONAL[country], detail.phone), detail.phone
                assert re.sub(r"[^\d+]", "", detail.phone) == detail.e164


def test_separator_replaces_the_punctuation_and_nothing_else() -> None:
    for country in PHONE_COUNTRIES:
        for detail in draw(country, "landline", separator=""):
            assert re.fullmatch(r"\d+", detail.phone)
            assert detail.phone.endswith(significant(detail))

        for detail in draw(country, "mobile", separator="", include_country_code=True):
            assert detail.phone == detail.e164

        for detail in draw(country, "mobile", separator="."):
            assert re.fullmatch(r"\d+(\.\d+)+", detail.phone)

    # The trunk goes where the country writes it: on the first group in Korea, a group of
    # its own in Russia.
    assert re.fullmatch(r"010-\d{4}-\d{4}", rand_phone(country="KR", separator="-")[0])
    assert re.fullmatch(r"8-9\d{2}-\d{3}-\d{2}-\d{2}", rand_phone(country="RU", separator="-")[0])
    assert re.fullmatch(
        r"\+82-10-\d{4}-\d{4}",
        rand_phone(country="KR", separator="-", include_country_code=True)[0],
    )


def test_a_us_exchange_is_never_a_service_code_or_555() -> None:
    for detail in rand_phone(country="US", count=LARGE, output="detail"):
        exchange = significant(detail)[3:6]

        assert not re.fullmatch(r"[2-9]11", exchange), detail.phone
        assert exchange != "555", detail.phone
        assert exchange[0] in "23456789"


def test_a_korean_mobile_number_opens_its_exchange_on_2_to_9() -> None:
    assert all(re.match(r"010-[2-9]", phone) for phone in rand_phone(country="KR", count=LARGE))


def test_mobile_is_the_default_and_all_draws_both() -> None:
    assert all(detail.type == "mobile" for detail in rand_phone(count=SAMPLE, output="detail"))

    types = {detail.type for detail in rand_phone(type="all", count=SAMPLE, output="detail")}

    assert types == set(PHONE_TYPES)


def test_every_country_comes_up_and_a_code_is_read_in_any_case() -> None:
    countries = {detail.country for detail in rand_phone(count=LARGE, output="detail")}

    assert countries == set(PHONE_COUNTRIES)

    loose: Any = rand_phone

    for detail in loose(country="kr", count=SAMPLE, output="detail"):
        assert detail.country == "KR"
        assert detail.calling_code == "82"


def test_unique_never_repeats_a_number() -> None:
    phones = rand_phone(country="KR", count=500, unique=True)

    assert len(phones) == 500
    assert len(set(phones)) == 500


def test_fictional_keeps_to_the_numbers_a_country_sets_aside_for_fiction() -> None:
    reserved: dict[PhoneCountry, str] = {
        "US": r"\(\d{3}\) 555-01\d{2}",
        # The Bundesnetzagentur's drama numbers, and the two mobile blocks.
        "DE": (
            r"030 23125\d{3}|040 66969\d{3}|069 90009\d{3}|089 99998\d{3}|0221 4710\d{3}"
            r"|0171 39200\d{2}|0176 040690\d{2}"
        ),
    }

    for country, pattern in reserved.items():
        for type in PHONE_TYPES:
            for detail in draw(country, type, fictional=True):
                assert re.fullmatch(pattern, detail.phone), (country, type, detail.phone)

    # "all" narrows to the two countries that reserve any.
    countries = {
        detail.country for detail in rand_phone(fictional=True, count=SAMPLE, output="detail")
    }

    assert countries == {"US", "DE"}

    # A country that reserves none answers with nothing rather than with real numbers.
    for country in PHONE_COUNTRIES:
        if PHONE_DATA[country].fiction is None:
            assert rand_phone(country=country, fictional=True, count=5) == []


def test_every_shape_is_one_the_templates_can_write() -> None:
    assert set(PHONE_DATA) == set(PHONE_COUNTRIES)

    for country in PHONE_COUNTRIES:
        data = PHONE_DATA[country]

        assert "T" not in data.international

        for type in PHONE_TYPES:
            assert data.plans[type], f"{country} has no {type} plan"

            for shape in (*data.plans[type], *(data.fiction or {}).get(type, ())):
                # The first group is the prefix, and each pattern is one group more.
                assert data.national.count("#") == len(shape.groups) + 1
                assert data.international.count("#") == len(shape.groups) + 1
                assert all(re.fullmatch(r"\d+", prefix) for prefix in shape.prefixes)
                assert len(set(shape.prefixes)) == len(shape.prefixes)
