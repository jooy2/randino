"""Every sentence length a language can produce."""

from randino._internal.utils import clamp
from randino._types import WordLanguageOption
from randino.constants import RAND_LENGTH_MIN, RAND_SENTENCE_LENGTH_MAX
from randino.sentence._generator import natural_range
from randino.word.data import WORD_LANGUAGES


def sentence_length_range(language: WordLanguageOption = "all") -> tuple[int, int]:
    """Every sentence length the language can produce, in characters.

    That is what `rand_sentence` falls back to when `min_length` or `max_length` is
    omitted. The lower end is the shortest shape with the shortest words in it, and the
    upper end the longest shape with a modifier on every phrase, so the range is wide on
    purpose — the shape of each sentence is picked inside it.

    Args:
        language: The language to measure, or `"all"` for every one at once.

    Returns:
        The shortest and the longest sentence it can write.

    Example:
        >>> sentence_length_range("ko")
        (6, 41)
        >>> sentence_length_range("en")
        (13, 92)
    """
    languages = WORD_LANGUAGES if language == "all" else (language,)
    low = None
    high = 0

    for code in languages:
        code_low, code_high = natural_range(code)
        low = code_low if low is None else min(low, code_low)
        high = max(high, code_high)

    return (
        clamp(low or 1, RAND_LENGTH_MIN, RAND_SENTENCE_LENGTH_MAX),
        clamp(high, RAND_LENGTH_MIN, RAND_SENTENCE_LENGTH_MAX),
    )
