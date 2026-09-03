"""Generating nicknames, as strings or as details."""

from typing import Literal, overload

from randino._types import (
    NicknameDetail,
    RandOutput,
    RandRealism,
    WordLanguageOption,
    WordThemeOption,
)
from randino.nickname._generator import generate_nickname_details


@overload
def rand_nickname(
    *,
    language: WordLanguageOption = ...,
    theme: WordThemeOption = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    word_separator: str | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_nickname(
    *,
    language: WordLanguageOption = ...,
    theme: WordThemeOption = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    word_separator: str | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    output: Literal["detail"],
) -> list[NicknameDetail]: ...


def rand_nickname(
    *,
    language: WordLanguageOption = "all",
    theme: WordThemeOption = "all",
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    word_separator: str | None = None,
    starts_with: str = "",
    unique: bool = False,
    output: RandOutput = "value",
) -> list[str] | list[NicknameDetail]:
    """Generate nicknames — the kind of handle someone would pick for a game or a website.

    Each one is an everyday word (an animal, a thing, something in nature, an idea)
    with a modifier in front of it or a second word behind it. Person names are never
    used.

    Args:
        language: Language of the generated nicknames. `"all"` mixes every language.
        theme: What the nickname should be about.
        count: How many nicknames to return. Held inside `0`..`RAND_COUNT_MAX`.
        realism: whether the words are real ones or invented to read like the
            language. `"mixed"` decides per word.
        min_length: Minimum length in characters. Defaults to the language's own
            range.
        max_length: Maximum length in characters.
        word_separator: Placed between the words a nickname is built from
            (`"멋진 사자"`, `"misty-owl"`), and counted toward `min_length` /
            `max_length`. Defaults to the way the language itself joins them, which
            is to run them together (`멋진사자`, `MistyOwl`).
        starts_with: Keep only nicknames whose first character is this one.
        unique: Never return the same nickname twice. May return fewer than `count`
            nicknames once the pools run out of combinations.
        output: `"value"` for strings, `"detail"` for a `NicknameDetail` per
            nickname — the words in order, the language and the theme.

    Returns:
        A `list[str]`, or a `list[NicknameDetail]` when `output="detail"` — the
        overloads carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_nickname(language="ko", count=3)
        ['멋진사자', '파란물병', '고양이꼬리']
        >>> rand_nickname(language="en")
        ['MistyOwl']
        >>> rand_suffix(rand_nickname(language="ko", count=2))
        ['달리는표범_gDe2C', '조용한노을_nVtRC']
        >>> rand_nickname(language="ko", word_separator=" ", count=2)
        ['멋진 사자', '고양이 꼬리']
        >>> rand_nickname(language="ko", output="detail")
        [NicknameDetail(nickname='멋진사자', words=('멋진', '사자'), language='ko', theme='animal')]
    """
    details: list[NicknameDetail] = generate_nickname_details(
        language=language,
        theme=theme,
        count=count,
        realism=realism,
        min_length=min_length,
        max_length=max_length,
        word_separator=word_separator,
        starts_with=starts_with,
        unique=unique,
    )

    if output == "detail":
        return details

    return [detail.nickname for detail in details]
