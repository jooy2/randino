"""Generating nicknames along with the pieces each one was built from."""

from randino._types import NicknameDetail, NicknameLanguageOption, NicknameThemeOption
from randino.nickname._generator import generate_nickname_details


def rand_nickname_details(
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
    starts_with: str = "",
    unique: bool = False,
) -> list[NicknameDetail]:
    """Generate nicknames along with the pieces each one was built from.

    Takes the same options as `rand_nickname`. Useful when you need the words on
    their own — to highlight the base word, or to group by theme.

    Example:
        >>> rand_nickname_details(language="ko")
        [NicknameDetail(nickname='멋진사자', words=('멋진', '사자'), language='ko', theme='animal')]
    """
    return generate_nickname_details(
        language=language,
        theme=theme,
        count=count,
        style=style,
        min_length=min_length,
        max_length=max_length,
        include_modifier=include_modifier,
        word_separator=word_separator,
        base_word=base_word,
        starts_with=starts_with,
        unique=unique,
    )
