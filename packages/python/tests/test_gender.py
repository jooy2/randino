"""Genders: male and female evenly, and the two rarer codes only when asked for."""

from random import Random

from randino import RAND_COUNT_MAX, WORD_LANGUAGES, GenderCode, GenderDetail, rand_gender

# Internal, but they are what a label is checked against.
from randino.gender.data import GENDER_CODES, GENDER_LABELS, GENDER_WEIGHTS

SAMPLE = 60

LARGE = 10000
"""Large enough that a share of one in a hundred shows up and stays well inside a band."""


def shares(details: list[GenderDetail]) -> dict[GenderCode, float]:
    """How many of `details` carry each code, as a share of all of them in percent."""
    return {
        code: 100 * sum(1 for detail in details if detail.code == code) / len(details)
        for code in GENDER_CODES
    }


def test_rand_gender_returns_one_label_by_default() -> None:
    genders = rand_gender()

    assert len(genders) == 1
    assert isinstance(genders[0], str)


def test_returns_exactly_count_genders() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_gender(count=count)) == count

    assert rand_gender(count=-3) == []
    assert len(rand_gender(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_language_labels_every_code_and_no_two_codes_alike() -> None:
    assert set(GENDER_LABELS) == set(WORD_LANGUAGES)

    for language in WORD_LANGUAGES:
        labels = [GENDER_LABELS[language][code] for code in GENDER_CODES]

        assert all(label.strip() for label in labels), language
        assert len(set(labels)) == len(labels), f"{language} repeats a label"


def test_a_label_is_the_one_its_language_writes_for_its_code() -> None:
    for language in WORD_LANGUAGES:
        for detail in rand_gender(
            language=language,
            include_unknown=True,
            include_nonbinary=True,
            count=SAMPLE,
            output="detail",
        ):
            assert detail.language == language
            assert detail.gender == GENDER_LABELS[language][detail.code]

    assert set(rand_gender(language="ko", count=SAMPLE)) == {"남성", "여성"}


def test_the_value_form_is_the_label_of_each_detail() -> None:
    values = rand_gender(
        include_unknown=True, include_nonbinary=True, count=SAMPLE, random=Random(7).random
    )
    details = rand_gender(
        include_unknown=True,
        include_nonbinary=True,
        count=SAMPLE,
        random=Random(7).random,
        output="detail",
    )

    assert values == [detail.gender for detail in details]


def test_male_and_female_alone_until_the_other_two_are_asked_for() -> None:
    def codes(*, include_unknown: bool = False, include_nonbinary: bool = False) -> set[str]:
        return {
            detail.code
            for detail in rand_gender(
                include_unknown=include_unknown,
                include_nonbinary=include_nonbinary,
                count=LARGE,
                output="detail",
            )
        }

    assert codes() == {"male", "female"}
    assert codes(include_unknown=True) == {"male", "female", "unknown"}
    assert codes(include_nonbinary=True) == {"male", "female", "nonbinary"}
    assert len(codes(include_unknown=True, include_nonbinary=True)) == 4


def test_male_and_female_split_evenly_unknown_is_uncommon_and_nonbinary_rare() -> None:
    share = shares(
        rand_gender(include_unknown=True, include_nonbinary=True, count=LARGE, output="detail")
    )

    assert abs(share["male"] - share["female"]) < 4
    assert 6 < share["unknown"] < 12
    assert 0.4 < share["nonbinary"] < 2
    assert GENDER_WEIGHTS["male"] == GENDER_WEIGHTS["female"]


def test_language_all_mixes_every_language() -> None:
    languages = {detail.language for detail in rand_gender(count=SAMPLE * 5, output="detail")}

    assert len(languages) == len(WORD_LANGUAGES)


def test_unique_never_repeats_a_label_and_stops_when_the_labels_run_out() -> None:
    genders = rand_gender(language="en", include_unknown=True, unique=True, count=10)

    assert sorted(genders) == ["Female", "Male", "Unknown"]
