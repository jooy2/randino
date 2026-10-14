"""Genders: male and female evenly, and the two rarer codes only when asked for."""

from random import Random

from randino import RAND_COUNT_MAX, WORD_LANGUAGES, GenderCode, GenderDetail, rand_gender

# Internal, but they are what a label is checked against.
from randino.gender.data import (
    GENDER_CODES,
    GENDER_LABELS,
    GENDER_WEIGHTS,
    NONBINARY_IDENTITIES,
    NONBINARY_LABELS,
    NONBINARY_WEIGHTS,
)

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

    # Every identity too, though the rarest of them is a draw in a few thousand.
    every = rand_gender(
        language="en",
        include_unknown=True,
        include_nonbinary=True,
        nonbinary_identity=True,
        unique=True,
        count=100,
    )

    assert len(set(every)) == len(every)
    assert set(every) == {
        *(GENDER_LABELS["en"][code] for code in ("female", "male", "unknown")),
        *(NONBINARY_LABELS["en"][identity] for identity in NONBINARY_IDENTITIES),
    }


def test_every_language_writes_every_identity_none_alike_and_none_a_form_label() -> None:
    assert set(NONBINARY_LABELS) == set(WORD_LANGUAGES)

    for language in WORD_LANGUAGES:
        labels = [NONBINARY_LABELS[language][identity] for identity in NONBINARY_IDENTITIES]
        others = [GENDER_LABELS[language][code] for code in ("male", "female", "unknown")]

        assert all(label.strip() for label in labels), language
        assert len(set(labels)) == len(labels), f"{language} repeats an identity"
        assert not set(labels) & set(others), f"{language} writes an identity as another code's"


def test_the_umbrella_term_is_the_most_common_identity_and_the_rest_follow_in_order() -> None:
    weights = [NONBINARY_WEIGHTS[identity] for identity in NONBINARY_IDENTITIES]

    assert NONBINARY_IDENTITIES[0] == "nonbinary"
    assert all(weight > 0 for weight in weights)
    assert weights == sorted(weights, reverse=True), weights


def test_nonbinary_identity_writes_nonbinary_as_an_identity_and_leaves_the_rest_alone() -> None:
    identities: set[str] = set()

    for detail in rand_gender(
        include_unknown=True,
        include_nonbinary=True,
        nonbinary_identity=True,
        count=LARGE,
        output="detail",
    ):
        if detail.code == "nonbinary":
            assert detail.identity is not None, f"{detail.gender} ({detail.language})"
            assert detail.gender == NONBINARY_LABELS[detail.language][detail.identity]
            identities.add(detail.identity)
        else:
            assert detail.identity is None
            assert detail.gender == GENDER_LABELS[detail.language][detail.code]

    # About a hundred `nonbinary` draws, split over seven identities.
    assert len(identities) > 2, identities
    assert "nonbinary" in identities


def test_german_writes_the_identity_not_the_option_its_forms_carry() -> None:
    labels = {
        detail.gender
        for detail in rand_gender(
            language="de",
            include_nonbinary=True,
            nonbinary_identity=True,
            count=LARGE,
            output="detail",
        )
        if detail.code == "nonbinary"
    }

    assert labels
    assert "Divers" not in labels


def test_the_identity_is_none_without_the_option() -> None:
    details = rand_gender(
        include_unknown=True, include_nonbinary=True, count=LARGE, output="detail"
    )

    assert {detail.identity for detail in details} == {None}


def test_nonbinary_identity_changes_nothing_without_include_nonbinary() -> None:
    assert rand_gender(
        include_unknown=True, nonbinary_identity=True, count=SAMPLE, random=Random(7).random
    ) == rand_gender(include_unknown=True, count=SAMPLE, random=Random(7).random)
