"""Everyday words — the vocabulary a nickname is built from, on its own."""

from typing import Literal, overload

from randino._types import RandRealism, WordDetail, WordLanguageOption, WordThemeOption
from randino.word._generator import generate_word_details


@overload
def rand_word(
    *,
    language: WordLanguageOption = ...,
    theme: WordThemeOption = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_word(
    *,
    language: WordLanguageOption = ...,
    theme: WordThemeOption = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    output: Literal["detail"],
) -> list[WordDetail]: ...


def rand_word(
    *,
    language: WordLanguageOption = "all",
    theme: WordThemeOption = "all",
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    output: str = "value",
) -> list[str] | list[WordDetail]:
    """Generate everyday words: animals, things, nature, ideas.

    Twenty-five themes, in five languages. Person names are never used. `theme` picks
    what the words are about; the twenty-five `rand_…` functions beside this one are the
    same generator with one theme already chosen.

    Args:
        language: Language of the generated words. `"all"` mixes every language.
        theme: What the words should be about.
        count: How many words to return. Held inside `0`..`RAND_COUNT_MAX`.
        realism: whether the word is a real one or invented to read like the
            language. `"mixed"` decides per word.
        min_length: Minimum length in characters. Defaults to what the pools hold.
        max_length: Maximum length in characters.
        starts_with: Keep only words whose first character is this one.
        unique: Never return the same word twice. May return fewer than `count` once
            a pool runs out.
        output: `"value"` for strings, `"detail"` for a `WordDetail` per word — the
            word, its language and its theme.

    Returns:
        A `list[str]`, or a `list[WordDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_word(language="ko", theme="animal", count=3)
        ['여우', '고래', '수달']
        >>> rand_word(language="en", count=2)
        ['Lantern', 'Meadow']
        >>> rand_word(language="ko", theme="plant", output="detail")
        [WordDetail(word='민들레', language='ko', theme='plant')]
    """
    details = generate_word_details(
        language=language,
        theme=theme,
        count=count,
        realism=realism,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
    )

    if output == "detail":
        return details

    return [detail.word for detail in details]
