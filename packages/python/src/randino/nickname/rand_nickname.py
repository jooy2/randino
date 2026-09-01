"""Generating nicknames as plain strings."""

from randino._types import NicknameLanguageOption, NicknameThemeOption
from randino.nickname._generator import generate_nickname_details


def rand_nickname(
    *,
    language: NicknameLanguageOption | None = None,
    theme: NicknameThemeOption = "all",
    count: int = 1,
    style: int = 0,
    min_length: int | None = None,
    max_length: int | None = None,
    include_modifier: bool = True,
    word_separator: str | None = None,
    base_word: str = "",
    unique_suffix: bool = False,
    unique_suffix_length: int = 5,
    unique_suffix_separator: str = "_",
    unique_suffix_charset: str = "",
    starts_with: str = "",
    unique: bool = False,
) -> list[str]:
    """Generate nicknames — the kind of handle someone would pick for a game or a website.

    Each one is an everyday word (an animal, a thing, something in nature, an idea)
    with a modifier in front of it or a second word behind it. Person names are never
    used.

    Args:
        language: Language of the generated nicknames. `"all"` mixes every language.
            Left out, it is `"all"` — or, when `base_word` is given, the language
            that word is written in, so `"고양이"` is not handed an English modifier.
        theme: What the nickname should be about.
        count: How many nicknames to return. Held inside `0`..`NICKNAME_COUNT_MAX`.
        style: `0` builds nicknames out of real words, `100` invents words that only
            read like the language, and values in between mix the two.
        min_length: Minimum length in characters, not counting the unique suffix.
            Defaults to the language's own range.
        max_length: Maximum length in characters, not counting the unique suffix.
        include_modifier: Decorate the noun with a modifier (`멋진사자` rather than
            `사자`).
        word_separator: Placed between the words a nickname is built from
            (`"멋진 사자"`, `"misty-owl"`), and counted toward `min_length` /
            `max_length`. Defaults to the way the language itself joins them, which
            is to run them together (`멋진사자`, `MistyOwl`).
        base_word: Build every nickname around this word instead of a random one,
            adding only the decoration — `"고양이"` gives `멋진고양이`, `고양이꼬리`,
            `파란고양이발바닥`.
        unique_suffix: Append a random suffix so that two people asking at the same
            time do not end up with the same nickname (`멋진사자_nVtRC`).
        unique_suffix_length: Characters in the unique suffix. Held inside
            `1`..`NICKNAME_SUFFIX_LENGTH_MAX`.
        unique_suffix_separator: Placed between the nickname and its unique suffix.
        unique_suffix_charset: Characters the unique suffix is drawn from. Defaults
            to `NICKNAME_SUFFIX_CHARSET`, alphanumerics without `0O1lI`.
        starts_with: Keep only nicknames whose first character is this one.
        unique: Never return the same nickname twice. May return fewer than `count`
            nicknames once the pools run out of combinations.

    Example:
        >>> rand_nickname(language="ko", count=3)
        ['멋진사자', '파란물병', '고양이꼬리']
        >>> rand_nickname(language="en")
        ['MistyOwl']
        >>> rand_nickname(language="ko", unique_suffix=True, count=2)
        ['달리는표범_gDe2C', '조용한노을_nVtRC']
        >>> rand_nickname(language="ko", word_separator=" ", count=2)
        ['멋진 사자', '고양이 꼬리']
        >>> rand_nickname(base_word="고양이", count=3)
        ['멋진고양이', '고양이발바닥', '파란고양이꼬리']
    """
    return [
        detail.nickname
        for detail in generate_nickname_details(
            language=language,
            theme=theme,
            count=count,
            style=style,
            min_length=min_length,
            max_length=max_length,
            include_modifier=include_modifier,
            word_separator=word_separator,
            base_word=base_word,
            unique_suffix=unique_suffix,
            unique_suffix_length=unique_suffix_length,
            unique_suffix_separator=unique_suffix_separator,
            unique_suffix_charset=unique_suffix_charset,
            starts_with=starts_with,
            unique=unique,
        )
    ]
