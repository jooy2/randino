"""The natural length range of a nickname."""

from randino._internal.utils import clamp
from randino._types import NicknameLanguageOption
from randino.nickname._generator import natural_range
from randino.nickname.data import (
    NICKNAME_LANGUAGES,
    NICKNAME_LENGTH_MAX,
    NICKNAME_LENGTH_MIN,
)


def nickname_length_range(
    language: NicknameLanguageOption = "all",
    include_modifier: bool = True,
    word_separator: str | None = None,
) -> tuple[int, int]:
    """Every nickname length the language can produce, in characters.

    This is what `rand_nickname` falls back to when `min_length` or `max_length` is
    omitted. The lower end is a bare noun and the upper end a modifier, a noun and a
    trailing word together, so the range is wide on purpose — the shape of each
    nickname is picked inside it. A `base_word` longer than this range widens it, and
    a `word_separator` widens it by what it adds between the words.

    Example:
        >>> nickname_length_range("ko")
        (1, 12)
        >>> nickname_length_range("ko", False)
        (1, 8)
        >>> nickname_length_range("en")
        (3, 30)
        >>> nickname_length_range("ko", True, "-")
        (1, 14)
    """
    languages = NICKNAME_LANGUAGES if language == "all" else (language,)
    ranges = [natural_range(code, include_modifier, word_separator) for code in languages]

    return (
        clamp(min(low for low, _ in ranges), NICKNAME_LENGTH_MIN, NICKNAME_LENGTH_MAX),
        clamp(max(high for _, high in ranges), NICKNAME_LENGTH_MIN, NICKNAME_LENGTH_MAX),
    )
