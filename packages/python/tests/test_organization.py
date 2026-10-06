"""Organizations: one of the language's templates, its gaps filled from its pools."""

import re
from collections import Counter

from randino import (
    ORGANIZATION_INDUSTRIES,
    ORGANIZATION_TYPES,
    RAND_COUNT_MAX,
    RAND_ORGANIZATION_LENGTH_MAX,
    WORD_LANGUAGES,
    OrganizationDetail,
    WordLanguage,
    rand_organization,
)

# The datasets are internal, but an organization is only well formed if it is one of
# their templates with its gaps filled from their pools — these are what tie the output
# back to them.
from randino.organization._generator import legal_form_of
from randino.organization.data import ORGANIZATION_DATA, ORGANIZATION_TYPE_WEIGHTS
from randino.organization.data._types import PoolOrganizationSynthesis

SAMPLE = 60
LARGE = 3000


def alternation(pool: tuple[str, ...] | list[str]) -> str:
    """A pool as a pattern matching any one of its entries, the longest first."""
    return "(?:" + "|".join(re.escape(each) for each in sorted(pool, key=len, reverse=True)) + ")"


def descriptors_of(language: WordLanguage) -> list[str]:
    """Every word a language's companies can carry for their business."""
    data = ORGANIZATION_DATA[language]

    return [*data.generic, *(w for i in ORGANIZATION_INDUSTRIES for w in data.industries[i])]


def pattern_of(language: WordLanguage, template: str, stem: str) -> re.Pattern[str]:
    """A template as a pattern that matches what it can write."""
    data = ORGANIZATION_DATA[language]
    parts = re.split(r"(\{stem\}|\{industry\}|\{place\}|\{number\})", template)
    gaps = {
        "{stem}": stem,
        "{industry}": alternation(descriptors_of(language)),
        "{place}": alternation(data.places or ()),
        "{number}": "[1-9][0-9]*",
    }

    return re.compile("^" + "".join(gaps.get(part, re.escape(part)) for part in parts) + "$")


def patterns_for(detail: OrganizationDetail, stem: str) -> list[re.Pattern[str]]:
    """The patterns a name may match: its kind's templates, and a stem alone for a company."""
    templates = list(ORGANIZATION_DATA[detail.language].templates[detail.type])

    if detail.type == "company":
        templates.append("{stem}")

    return [pattern_of(detail.language, template, stem) for template in templates]


def stem_of(detail: OrganizationDetail) -> str | None:
    """The stem a name was built from: the shortest any matching template leaves."""
    stems = [
        match.group(1)
        for pattern in patterns_for(detail, "(.+?)")
        # A numbered template has no stem, and so no group to read.
        if (match := pattern.match(detail.name)) and pattern.groups
    ]

    return min(stems, key=len) if stems else None


def is_well_formed(detail: OrganizationDetail) -> bool:
    """Whether a name is one of its language's templates filled from its pools."""
    stems = alternation(ORGANIZATION_DATA[detail.language].stems)

    return any(pattern.match(detail.name) for pattern in patterns_for(detail, stems))


def wears_its_form(detail: OrganizationDetail) -> bool:
    """Whether the organization is the name with the legal form written around it."""
    if detail.legal_form is None:
        return detail.organization == detail.name

    return any(
        legal_form_of(form) == detail.legal_form
        and form.replace("{name}", detail.name, 1) == detail.organization
        for form in ORGANIZATION_DATA[detail.language].legal_forms
    )


def test_rand_organization_returns_one_organization_by_default() -> None:
    organizations = rand_organization()

    assert len(organizations) == 1
    assert isinstance(organizations[0], str)


def test_returns_exactly_count_organizations() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_organization(count=count)) == count

    assert rand_organization(count=-3) == []
    assert len(rand_organization(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_name_is_one_of_the_templates_of_its_language() -> None:
    for language in WORD_LANGUAGES:
        for detail in rand_organization(language=language, count=SAMPLE * 3, output="detail"):
            assert detail.language == language
            assert is_well_formed(detail), (language, detail.name)
            assert wears_its_form(detail), (language, detail.organization)


def test_the_value_form_is_the_whole_organization() -> None:
    organization = rand_organization(language="ru", type="company", include_legal_form=True)[0]

    assert re.fullmatch(r"(ООО|АО|ПАО) «.+»", organization), organization


def test_type_narrows_the_kinds_one_or_several() -> None:
    for kind in ORGANIZATION_TYPES:
        for detail in rand_organization(type=kind, count=SAMPLE, output="detail"):
            assert detail.type == kind

    kinds = {
        detail.type
        for detail in rand_organization(type=("school", "public"), count=SAMPLE, output="detail")
    }

    assert kinds == {"school", "public"}


def test_every_kind_comes_up_when_none_is_named_companies_most_often() -> None:
    counts = Counter(detail.type for detail in rand_organization(count=LARGE, output="detail"))

    assert set(counts) == set(ORGANIZATION_TYPES)
    assert counts.most_common(1)[0][0] == "company"
    assert sum(ORGANIZATION_TYPE_WEIGHTS.values()) == 100


def test_an_industry_is_carried_by_the_name_and_asks_for_companies() -> None:
    for language in WORD_LANGUAGES:
        for industry in ORGANIZATION_INDUSTRIES:
            words = ORGANIZATION_DATA[language].industries[industry]

            for detail in rand_organization(
                language=language, industry=industry, count=12, output="detail"
            ):
                assert detail.type == "company"
                assert detail.industry == industry
                assert any(word in detail.name for word in words), (language, detail.name)


def test_an_industry_narrows_the_companies_among_other_kinds() -> None:
    details = rand_organization(
        type=("company", "school"), industry="food", count=SAMPLE * 2, output="detail"
    )

    for detail in details:
        assert detail.industry == ("food" if detail.type == "company" else None)

    assert any(detail.type == "school" for detail in details)


def test_only_a_company_carries_an_industry_or_a_legal_form() -> None:
    for detail in rand_organization(count=LARGE, output="detail"):
        if detail.type != "company":
            assert detail.industry is None, detail.organization
            assert detail.legal_form is None, detail.organization


def test_include_legal_form_decides_it_and_left_out_leaves_it_to_chance() -> None:
    def companies(include_legal_form: bool | None) -> list[OrganizationDetail]:
        return rand_organization(
            type="company",
            include_legal_form=include_legal_form,
            count=SAMPLE * 3,
            output="detail",
        )

    assert all(detail.legal_form is not None for detail in companies(True))
    assert all(detail.legal_form is None for detail in companies(False))

    either = companies(None)

    assert any(detail.legal_form is not None for detail in either)
    assert any(detail.legal_form is None for detail in either)


def test_a_company_named_by_its_stem_alone_always_carries_a_legal_form() -> None:
    for detail in rand_organization(type="company", count=LARGE, output="detail"):
        if detail.industry is None and detail.name in ORGANIZATION_DATA[detail.language].stems:
            assert detail.legal_form is not None, detail.organization

    for detail in rand_organization(
        type="company", include_legal_form=False, count=SAMPLE * 3, output="detail"
    ):
        assert detail.name not in ORGANIZATION_DATA[detail.language].stems, detail.name


def test_starts_with_reads_the_name_not_a_legal_form_in_front_of_it() -> None:
    leads: dict[WordLanguage, str] = {
        "en": "W",
        "ko": "해",
        "ja": "青",
        "zh": "新",
        "vi": "C",
        "es": "C",
        "it": "C",
        "de": "S",
        "ru": "Ш",
    }

    for language in WORD_LANGUAGES:
        lead = leads[language]
        details = rand_organization(
            language=language, starts_with=lead, count=SAMPLE, output="detail"
        )

        assert len(details) == SAMPLE, language

        for detail in details:
            assert detail.name.lower().startswith(lead.lower()), (language, detail.name)


def test_a_first_character_no_stem_starts_with_is_answered_with_an_invented_one() -> None:
    details = rand_organization(language="ko", starts_with="퐁", count=SAMPLE, output="detail")

    assert len(details) == SAMPLE
    assert all(detail.name.startswith("퐁") for detail in details)
    assert rand_organization(language="ko", starts_with="Q", count=5) == []


def test_realism_invents_the_stem_and_nothing_else() -> None:
    for language in WORD_LANGUAGES:
        data = ORGANIZATION_DATA[language]
        invented = 0
        with_stems = 0

        for detail in rand_organization(
            language=language, realism="invented", count=SAMPLE, output="detail"
        ):
            stem = stem_of(detail)

            # A numbered school or station has no stem to invent.
            if stem is None:
                assert is_well_formed(detail), detail.name
                continue

            with_stems += 1

            if stem not in data.stems:
                invented += 1

            if isinstance(data.syn, PoolOrganizationSynthesis):
                parts = stem.split(data.syn.joiner) if data.syn.joiner else list(stem)

                assert all(part in data.syn.pool for part in parts), (language, stem)

        # A stem spelled at random can be one the language already holds (다솔).
        assert invented > with_stems * 0.8, (language, invented, with_stems)


def test_the_length_options_bound_the_whole_organization() -> None:
    for language in WORD_LANGUAGES:
        for organization in rand_organization(language=language, max_length=24, count=SAMPLE):
            assert len(organization) <= 24, (language, organization)

        for organization in rand_organization(language=language, min_length=12, count=SAMPLE):
            assert len(organization) >= 12, (language, organization)

    # A range nothing reaches is answered with the closest, never with nothing.
    assert len(rand_organization(language="en", max_length=3, count=5)) == 5


def test_the_datasets_are_complete_and_every_organization_fits_the_ceiling() -> None:
    def longest(pool: tuple[str, ...] | list[str]) -> int:
        return max((len(each) for each in pool), default=0)

    for language in WORD_LANGUAGES:
        data = ORGANIZATION_DATA[language]
        words = descriptors_of(language)

        assert len(data.stems) >= 30, language
        assert len(set(data.stems)) == len(data.stems), language
        assert len(set(words)) == len(words), language
        assert all("{name}" in form for form in data.legal_forms)

        for industry in ORGANIZATION_INDUSTRIES:
            assert len(data.industries[industry]) >= 4, (language, industry)

        for template in data.templates["company"]:
            assert "{industry}" in template, (language, template)

        syn = data.syn
        made = (
            syn.max_syllables * (longest(syn.pool) + len(syn.joiner))
            if isinstance(syn, PoolOrganizationSynthesis)
            else syn.max_syllables * (longest(syn.onset) + longest(syn.vowel)) + longest(syn.coda)
        )
        stem = max(longest(data.stems), made)
        form = longest(data.legal_forms) - len("{name}")

        for kind in ORGANIZATION_TYPES:
            assert data.templates[kind], (language, kind)

            for template in data.templates[kind]:
                filled = (
                    template.replace("{stem}", "x" * stem)
                    .replace("{industry}", "x" * longest(words))
                    .replace("{place}", "x" * longest(data.places or ()))
                    .replace("{number}", str(data.numbers[1]) if data.numbers else "")
                )
                length = len(filled) + (form if kind == "company" else 0)

                assert length <= RAND_ORGANIZATION_LENGTH_MAX, (language, template, length)


def test_language_all_mixes_every_language() -> None:
    languages = {detail.language for detail in rand_organization(count=SAMPLE * 5, output="detail")}

    assert len(languages) == len(WORD_LANGUAGES)


def test_unique_never_repeats_an_organization() -> None:
    organizations = rand_organization(language="en", unique=True, count=300)

    assert len(set(organizations)) == len(organizations)
