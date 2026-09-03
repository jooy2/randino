"""What the sky is doing, from a breeze to a blizzard."""

from typing import Literal, overload

from randino._types import RandRealism, WordDetail, WordLanguageOption, WordThemeOption
from randino.word.rand_word import rand_word


@overload
def rand_weather(
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
def rand_weather(
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


def rand_weather(
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
    """What the sky is doing, from a breeze to a blizzard.

    `rand_word(theme="weather")` with the theme already chosen; every other argument
    is the same.

    Args:
        language: Language of the generated words. `"all"` mixes every language.
        count: How many words to return. Held inside `0`..`RAND_COUNT_MAX`.
        realism: whether the word is a real one or invented to read like the
            language. `"mixed"` decides per word.
        min_length: Minimum length in characters. Defaults to what the pools hold.
        max_length: Maximum length in characters.
        starts_with: Keep only words whose first character is this one.
        unique: Never return the same word twice.
        output: `"value"` for strings, `"detail"` for a `WordDetail` each.

    Returns:
        `count` words, or a `WordDetail` for each of them.

    Example:
        >>> rand_weather(language="ko", count=3)
        ['소나기', '무지개', '된서리']
        >>> rand_weather(language="en", count=3)
        ['Drizzle', 'Rainbow', 'Hoarfrost']
    """
    theme: WordThemeOption = "weather"

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
