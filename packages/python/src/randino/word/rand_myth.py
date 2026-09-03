"""Creatures and figures out of myth and folklore."""

from typing import Literal, overload

from randino._types import RandRealism, WordDetail, WordLanguageOption, WordThemeOption
from randino.word.rand_word import rand_word


@overload
def rand_myth(
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
def rand_myth(
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


def rand_myth(
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
    """Creatures and figures out of myth and folklore.

    `rand_word(theme="myth")` with the theme already chosen; every other argument
    is the same, and they are documented on `rand_word`.

    Returns:
        A `list[str]`, or a `list[WordDetail]` when `output="detail"`.

    Example:
        >>> rand_myth(language="ko", count=3)
        ['용', '봉황', '구미호']
        >>> rand_myth(language="en", count=3)
        ['Dragon', 'Phoenix', 'Griffin']
    """
    theme: WordThemeOption = "myth"

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
