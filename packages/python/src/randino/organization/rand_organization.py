"""Organizations that do not exist: companies, schools, offices and associations."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import (
    OrganizationDetail,
    OrganizationIndustryOption,
    OrganizationTypeOption,
    RandRealism,
    WordLanguageOption,
)
from randino.organization._generator import generate_organization_details


@overload
def rand_organization(
    *,
    language: WordLanguageOption = ...,
    type: OrganizationTypeOption | None = ...,
    industry: OrganizationIndustryOption = ...,
    include_legal_form: bool | None = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_organization(
    *,
    language: WordLanguageOption = ...,
    type: OrganizationTypeOption | None = ...,
    industry: OrganizationIndustryOption = ...,
    include_legal_form: bool | None = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[OrganizationDetail]: ...


def rand_organization(
    *,
    language: WordLanguageOption = "all",
    type: OrganizationTypeOption | None = None,
    industry: OrganizationIndustryOption = "all",
    include_legal_form: bool | None = None,
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[OrganizationDetail]:
    """Generate the names of organizations that do not exist.

    Companies, schools, government offices, public institutions and associations, written
    the way the language writes each of them. A name is built from a stem that is nobody's
    brand, a word for what a company does, and the shape the language gives that kind of
    organization.

    Args:
        language: Language of the organizations. `"all"` mixes every language.
        type: Which kinds — one, a sequence of them, or `"all"`. Left out, a kind is drawn
            per result, companies most often.
        industry: What the companies do. Naming one with `type` left out asks for
            companies; with `type` naming other kinds too, it narrows the companies among
            them.
        include_legal_form: Write a company's legal form — `Inc.`, `(주)`, `GmbH`, `ООО`.
            Left out, it is decided per company. Only a company carries one.
        count: How many organizations to return. Held inside `0`..`RAND_COUNT_MAX`.
        realism: Whether the stem is one the language's data holds or one invented to
            read like the language. `"mixed"` decides per result.
        min_length: Minimum length of the whole organization, in characters.
        max_length: Maximum length of the whole organization. A range nothing fits is
            answered with the closest there is.
        starts_with: Keep only organizations whose name — without a legal form in front of
            it — starts with this character.
        unique: Never return the same organization twice.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does.
        output: `"value"` for strings, `"detail"` for an `OrganizationDetail` each — the
            name with and without its legal form, the form, its kind and its industry.

    Returns:
        A `list[str]`, or a `list[OrganizationDetail]` when `output="detail"` — the
        overloads carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_organization(language="ko", count=3)
        ['(주)새솔테크', '가람초등학교', '해솔구청']
        >>> rand_organization(language="en", type="company", industry="logistics")
        ['Westbrook Freight, Inc.']
    """
    details = generate_organization_details(
        language=language,
        type=type,
        industry=industry,
        include_legal_form=include_legal_form,
        count=count,
        realism=realism,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.organization for detail in details]
