"""Furniture and the furnishings of a home."""

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
def rand_furniture(
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
def rand_furniture(
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


def rand_furniture(
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
    """Furniture and the furnishings of a home.

    `rand_word(theme="furniture")` with the theme already chosen; every other argument
    is the same.

    Args:
        language: Language of the generated words. `"all"` mixes every language.
        count: How many words to return. Held inside `0`..`RAND_COUNT_MAX`.
        realism: whether the word is a real one or invented to read like the
            language. `"mixed"` decides per word.
        vocabulary: How common the words have to be: `"basic"` for the everyday ones,
            `"common"` for those and the ones an adult uses now and then, `"full"` for
            every word the pools hold.
        min_length: Minimum length in characters. Defaults to what the pools hold.
        max_length: Maximum length in characters.
        starts_with: Keep only words whose first character is this one.
        unique: Never return the same word twice.
        output: `"value"` for strings, `"detail"` for a `WordDetail` each.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run. Used for every draw the call makes, including the ones a
            generator makes through another.

    Returns:
        `count` words, or a `WordDetail` for each of them.

    Example:
        >>> rand_furniture(language="ko", count=3)
        ['흔들의자', '요람', '책장']
        >>> rand_furniture(language="en", count=3)
        ['Hammock', 'Cradle', 'Wardrobe']
    """
    theme: WordThemeOption = "furniture"

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
