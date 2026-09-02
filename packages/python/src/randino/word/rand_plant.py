"""Plants: trees, flowers, leaves and what grows on them."""

from typing import Literal, overload

from randino._types import WordDetail, WordLanguageOption, WordThemeOption
from randino.word.rand_word import rand_word


@overload
def rand_plant(
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
def rand_plant(
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


def rand_plant(
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
    """Plants: trees, flowers, leaves and what grows on them.

    `rand_word(theme="plant")` with the theme already chosen; every other argument
    is the same, and they are documented on `rand_word`.

    Returns:
        A `list[str]`, or a `list[WordDetail]` when `output="detail"`.

    Example:
        >>> rand_plant(language="ko", count=3)
        ['나무', '민들레', '꽃']
        >>> rand_plant(language="en", count=3)
        ['Treetop', 'Blossom', 'Fern']
    """
    theme: WordThemeOption = "plant"

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
