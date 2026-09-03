"""The natural length range of a nickname."""

from randino._internal.utils import clamp
from randino._types import WordLanguageOption
from randino.constants import RAND_LENGTH_MAX, RAND_LENGTH_MIN
from randino.nickname._generator import natural_range
from randino.word.data import WORD_LANGUAGES


def nickname_length_range(
    language: WordLanguageOption = "all",
    word_separator: str | None = None,
) -> tuple[int, int]:
    """Every nickname length the language can produce, in characters.

    This is what `rand_nickname` falls back to when `min_length` or `max_length` is
    omitted. The lower end is a bare noun and the upper end a modifier, a noun and a
    trailing word together, so the range is wide on purpose — the shape of each
    nickname is picked inside it. A `word_separator` widens it by what it adds
    between the words.

    Example:
        >>> nickname_length_range("ko")
        (1, 13)
        >>> nickname_length_range("en")
        (3, 31)
        >>> nickname_length_range("ko", "-")
        (1, 15)
    """
    languages = WORD_LANGUAGES if language == "all" else (language,)
    ranges = [natural_range(code, word_separator) for code in languages]

    return (
        clamp(min(low for low, _ in ranges), RAND_LENGTH_MIN, RAND_LENGTH_MAX),
        clamp(max(high for _, high in ranges), RAND_LENGTH_MIN, RAND_LENGTH_MAX),
    )
