"""Stones and metals, precious and ordinary alike."""

from typing import Literal, overload

from randino._types import WordDetail, WordLanguageOption, WordThemeOption
from randino.word.rand_word import rand_word


@overload
def rand_gem(
    *,
    language: WordLanguageOption = ...,
    count: int = ...,
    style: int = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_gem(
    *,
    language: WordLanguageOption = ...,
    count: int = ...,
    style: int = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    output: Literal["detail"],
) -> list[WordDetail]: ...


def rand_gem(
    *,
    language: WordLanguageOption = "all",
    count: int = 1,
    style: int = 0,
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    output: str = "value",
) -> list[str] | list[WordDetail]:
    """Stones and metals, precious and ordinary alike.

    `rand_word(theme="gem")` with the theme already chosen; every other argument
    is the same, and they are documented on `rand_word`.

    Returns:
        A `list[str]`, or a `list[WordDetail]` when `output="detail"`.

    Example:
        >>> rand_gem(language="ko", count=3)
        ['금', '수정', '흑요석']
        >>> rand_gem(language="en", count=3)
        ['Gold', 'Quartz', 'Obsidian']
    """
    theme: WordThemeOption = "gem"

    if output == "detail":
        return rand_word(
            language=language,
            theme=theme,
            count=count,
            style=style,
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
        style=style,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
    )
