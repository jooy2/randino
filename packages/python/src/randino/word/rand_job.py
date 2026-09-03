"""The trades and roles people hold."""

from typing import Literal, overload

from randino._types import RandRealism, WordDetail, WordLanguageOption, WordThemeOption
from randino.word.rand_word import rand_word


@overload
def rand_job(
    *,
    language: WordLanguageOption = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_job(
    *,
    language: WordLanguageOption = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    output: Literal["detail"],
) -> list[WordDetail]: ...


def rand_job(
    *,
    language: WordLanguageOption = "all",
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    output: str = "value",
) -> list[str] | list[WordDetail]:
    """The trades and roles people hold.

    `rand_word(theme="job")` with the theme already chosen; every other argument
    is the same, and they are documented on `rand_word`.

    Returns:
        A `list[str]`, or a `list[WordDetail]` when `output="detail"`.

    Example:
        >>> rand_job(language="ko", count=3)
        ['기사', '마법사', '대장장이']
        >>> rand_job(language="en", count=3)
        ['Wizard', 'Ranger', 'Blacksmith']
    """
    theme: WordThemeOption = "job"

    if output == "detail":
        return rand_word(
            language=language,
            theme=theme,
            count=count,
            realism=realism,
            min_length=min_length,
            max_length=max_length,
            starts_with=starts_with,
            unique=unique,
            output="detail",
        )

    return rand_word(
        language=language,
        theme=theme,
        count=count,
        realism=realism,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
    )
