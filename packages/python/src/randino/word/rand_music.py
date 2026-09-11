"""Music: instruments, forms and the words around them."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import (
    RandRealism,
    RandVocabulary,
    WordDetail,
    WordLanguageOption,
    WordThemeOption,
)
from randino.word.rand_word import rand_word


@overload
def rand_music(
    *,
    language: WordLanguageOption = ...,
    count: int = ...,
    realism: RandRealism = ...,
    vocabulary: RandVocabulary = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_music(
    *,
    language: WordLanguageOption = ...,
    count: int = ...,
    realism: RandRealism = ...,
    vocabulary: RandVocabulary = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[WordDetail]: ...


def rand_music(
    *,
    language: WordLanguageOption = "all",
    count: int = 1,
    realism: RandRealism = "real",
    vocabulary: RandVocabulary = "full",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[WordDetail]:
    """Music: instruments, forms and the words around them.

    `rand_word(theme="music")` with the theme already chosen; every other argument
    is the same, and they are documented on `rand_word`.

    Returns:
        A `list[str]`, or a `list[WordDetail]` when `output="detail"`.

    Example:
        >>> rand_music(language="ko", count=3)
        ['피아노', '거문고', '교향곡']
        >>> rand_music(language="en", count=3)
        ['Piano', 'Fiddle', 'Symphony']
    """
    theme: WordThemeOption = "music"

    if output == "detail":
        return rand_word(
            language=language,
            theme=theme,
            count=count,
            realism=realism,
            vocabulary=vocabulary,
            min_length=min_length,
            max_length=max_length,
            starts_with=starts_with,
            unique=unique,
            random=random,
            output="detail",
        )

    return rand_word(
        language=language,
        theme=theme,
        count=count,
        realism=realism,
        vocabulary=vocabulary,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
    )
