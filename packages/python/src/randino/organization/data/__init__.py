"""The per-language organization datasets, and how often each kind comes up."""

from randino._internal.generate import resolve_many, resolve_option
from randino._types import (
    OrganizationIndustry,
    OrganizationIndustryOption,
    OrganizationType,
    WordLanguage,
)
from randino.organization.data._types import OrganizationLanguageData
from randino.organization.data.de import DE
from randino.organization.data.en import EN
from randino.organization.data.es import ES
from randino.organization.data.it import IT
from randino.organization.data.ja import JA
from randino.organization.data.ko import KO
from randino.organization.data.ru import RU
from randino.organization.data.vi import VI
from randino.organization.data.zh import ZH

ORGANIZATION_TYPES: tuple[OrganizationType, ...] = (
    "company",
    "nonprofit",
    "school",
    "government",
    "public",
)
"""The kinds of organization, a business first and the institutions after it."""

ORGANIZATION_INDUSTRIES: tuple[OrganizationIndustry, ...] = (
    "tech",
    "manufacturing",
    "food",
    "retail",
    "finance",
    "construction",
    "logistics",
    "media",
    "health",
    "energy",
)
"""What a company can do, which is the word its name carries for it."""

ORGANIZATION_TYPE_WEIGHTS: dict[OrganizationType, int] = {
    "company": 40,
    "nonprofit": 15,
    "school": 20,
    "government": 10,
    "public": 15,
}
"""How often each kind comes up when more than one is in play, out of a hundred."""

ORGANIZATION_BARE_CHANCE = 20
"""How often a company with no industry asked for is its stem and a legal form alone."""

ORGANIZATION_GENERIC_CHANCE = 25
"""How often a company that is not a bare stem carries a word that names no industry."""

ORGANIZATION_LEGAL_FORM_CHANCE = 50
"""How often a company carries its legal form when the caller left it to chance."""

ORGANIZATION_DATA: dict[WordLanguage, OrganizationLanguageData] = {
    "en": EN,
    "ko": KO,
    "ja": JA,
    "zh": ZH,
    "vi": VI,
    "es": ES,
    "it": IT,
    "de": DE,
    "ru": RU,
}
"""Each language's organizations, keyed by its code."""

_INDUSTRY_OPTIONS: tuple[OrganizationIndustryOption, ...] = (*ORGANIZATION_INDUSTRIES, "all")


def resolve_organization_types(value: object) -> tuple[OrganizationType, ...]:
    """The caller's `type` as the kinds it names, or every kind for `"all"`."""
    return resolve_many(value, ORGANIZATION_TYPES, ORGANIZATION_TYPES)


def resolve_industry(industry: object) -> OrganizationIndustryOption:
    """The caller's `industry`, or `"all"` for one this package does not know."""
    return resolve_option(industry, _INDUSTRY_OPTIONS, "all")
