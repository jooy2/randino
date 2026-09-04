"""Which language a piece of text is written in, judged by its script alone.

Internal — it answers one narrow question, for the decorators that have to match
a value they were handed rather than one they generated.
"""

import re

from randino._types import WordLanguage

HANGUL = re.compile(r"[가-힣]")
KANA = re.compile(r"[぀-ヿ]")
HAN = re.compile(r"[一-鿿]")
# Vietnamese shares the Latin alphabet with English, and is told apart by the
# letters and tone marks English never uses. A Vietnamese word carrying none of
# them reads as English, which is the most a single word can be asked to say.
VIETNAMESE = re.compile(r"[\u00c0-\u024f\u1ea0-\u1ef9]")


def detect_language(text: str) -> WordLanguage:
    """The word language `text` is written in.

    Han characters are read as Chinese unless kana appear alongside them, which is
    the only signal a single word carries; anything else is English.

    Args:
        text: The text to judge.

    Returns:
        The language code its script points to.
    """
    if HANGUL.search(text):
        return "ko"
    if KANA.search(text):
        return "ja"
    if HAN.search(text):
        return "zh"
    if VIETNAMESE.search(text):
        return "vi"

    return "en"


# Hangul syllables are composed as (initial * 21 + vowel) * 28 + final, so the
# remainder is the final consonant, and 0 means there is none.
_HANGUL_BASE = 0xAC00
_HANGUL_LAST = 0xD7A3
_HANGUL_FINALS = 28

LETTER = re.compile(r"[^\W\d_]", re.UNICODE)
VOWELS = re.compile(r"[aeiouàáâãäåèéêëìíîïòóôõöùúûüыаеёиоуэюяıəăâêôơư]")


def ends_with_consonant(text: str) -> bool:
    """Whether `text` ends on a consonant.

    That is what a language whose particles alternate needs to know: Korean writes
    `사자가` and `사슴이` for the same particle, by whether the syllable in front of it
    closes on one.

    Answered by the script rather than per language. A Hangul syllable carries its final
    consonant in its code point; a Latin or Cyrillic word is judged by its last letter;
    a script that writes no vowels of its own — Han, kana — has no answer to give and
    reports False, which is also what its particles need, since they do not alternate.

    Args:
        text: The text to judge.

    Returns:
        True when the last letter closes the syllable.
    """
    trimmed = text.rstrip()

    if not trimmed:
        return False

    last = trimmed[-1]
    code = ord(last)

    if _HANGUL_BASE <= code <= _HANGUL_LAST:
        return (code - _HANGUL_BASE) % _HANGUL_FINALS != 0

    return bool(LETTER.match(last)) and not VOWELS.match(last.lower())
