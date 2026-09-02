"""Ideas out of the humanities and the social world."""

from typing import Literal, overload

from randino._types import WordDetail, WordLanguageOption, WordThemeOption
from randino.word.rand_word import rand_word


@overload
def rand_concept(
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
def rand_concept(
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


def rand_concept(
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
    """Ideas out of the humanities and the social world.

    `rand_word(theme="concept")` with the theme already chosen; every other argument
    is the same, and they are documented on `rand_word`.

    Returns:
        A `list[str]`, or a `list[WordDetail]` when `output="detail"`.

    Example:
        >>> rand_concept(language="ko", count=3)
        ['자유', '평화', '진리']
        >>> rand_concept(language="en", count=3)
        ['Freedom', 'Peace', 'Truth']
    """
    theme: WordThemeOption = "concept"

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
