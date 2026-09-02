"""The length range the word pools hold."""

from randino._internal.utils import clamp
from randino._types import WordLanguageOption, WordThemeOption
from randino.constants import RAND_LENGTH_MAX, RAND_LENGTH_MIN
from randino.word._generator import natural_range
from randino.word.data import WORD_LANGUAGES


def word_length_range(
    language: WordLanguageOption = "all",
    theme: WordThemeOption = "all",
) -> tuple[int, int]:
    """Shortest and longest word the language's pools hold, in characters.

    This is what `rand_word` falls back to when `min_length` or `max_length` is
    omitted. Narrowing the theme narrows the range, because a theme is a pool of its
    own.

    Args:
        language: The language to report on, or `"all"` for every one of them.
        theme: The theme to report on, or `"all"` for every one of them.

    Returns:
        `(min, max)`, in characters.

    Example:
        >>> word_length_range("ko")
        (1, 4)
        >>> word_length_range("en")
        (3, 11)
        >>> word_length_range("ko", "animal")
        (1, 4)
    """
    languages = WORD_LANGUAGES if language == "all" else (language,)
    ranges = [natural_range(code, theme) for code in languages]

    return (
        clamp(min(low for low, _ in ranges), RAND_LENGTH_MIN, RAND_LENGTH_MAX),
        clamp(max(high for _, high in ranges), RAND_LENGTH_MIN, RAND_LENGTH_MAX),
    )
