"""Planets by name."""

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
def rand_planet(
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
def rand_planet(
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


def rand_planet(
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
    """Planets by name.

    The eight, the dwarf planets, named minor planets and the exoplanets the IAU has
    named. Never a catalogue designation.

    `rand_word(theme="planet")` with the theme already chosen; every other argument
    is the same, and they are documented on `rand_word`.

    Returns:
        A `list[str]`, or a `list[WordDetail]` when `output="detail"`.

    Example:
        >>> rand_planet(language="ko", count=3)
        ['화성', '목성', '세드나']
        >>> rand_planet(language="en", count=3)
        ['Mars', 'Jupiter', 'Sedna']
    """
    theme: WordThemeOption = "planet"

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
