"""Places — where people gather, live and pass through."""

from typing import Literal, overload

from randino._types import WordDetail, WordLanguageOption, WordThemeOption
from randino.word.rand_word import rand_word


@overload
def rand_place(
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
def rand_place(
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


def rand_place(
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
    """Places — where people gather, live and pass through.

    `rand_word(theme="place")` with the theme already chosen; every other argument
    is the same, and they are documented on `rand_word`.

    Returns:
        A `list[str]`, or a `list[WordDetail]` when `output="detail"`.

    Example:
        >>> rand_place(language="ko", count=3)
        ['시장', '광장', '마을']
        >>> rand_place(language="en", count=3)
        ['Market', 'Plaza', 'Village']
    """
    theme: WordThemeOption = "place"

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
