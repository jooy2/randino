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
