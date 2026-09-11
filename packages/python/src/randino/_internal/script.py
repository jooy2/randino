"""Which language a piece of text is written in, judged by its script alone.

Internal — it answers one narrow question, for the decorators that have to match
a value they were handed rather than one they generated, and for the `starts_with`
that has to be a character the language actually writes.
"""

import re

from randino._types import WordLanguage

HANGUL = re.compile(r"[가-힣]")
KANA = re.compile(r"[぀-ヿ]")
HAN = re.compile(r"[一-鿿]")
CYRILLIC = re.compile(r"[\u0400-\u04ff\u0500-\u052f]")
LATIN = re.compile(r"[A-Za-z\u00c0-\u024f\u1e00-\u1eff]")
# Vietnamese shares the Latin alphabet with English, and is told apart by the
# letters and tone marks English never uses. A Vietnamese word carrying none of
# them reads as English, which is the most a single word can be asked to say.
VIETNAMESE = re.compile(r"[\u00c0-\u024f\u1ea0-\u1ef9]")


def detect_language(text: str) -> WordLanguage:
    """The word language `text` is written in.

    Han characters are read as Chinese unless kana appear alongside them, which is
    the only signal a single word carries; Cyrillic is Russian, a Latin word with
    Vietnamese marks on it is Vietnamese, and anything else is English.

    Spanish, Italian and German share the Latin alphabet with English and with each
    other, so no script tells them apart — a caller who wants one of those names it.
    `rand_modifier` asks their pools instead, which is a question about the word
    rather than about its script and so does not belong here.

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
    if CYRILLIC.search(text):
        return "ru"
    if VIETNAMESE.search(text):
        return "vi"

    return "en"


# The scripts the nine languages are written in, by the code both `NameLanguage`
# and `WordLanguage` spell the same way, so one table answers for both.
#
# Written out rather than read off the pools because no pool answers it reliably:
# Japanese nouns are kanji and katakana at once, so the first entry of a pool says
# nothing about the rest of it.
_SCRIPTS: dict[str, tuple[re.Pattern[str], ...]] = {
    "en": (LATIN,),
    "ko": (HANGUL,),
    "ja": (KANA, HAN),
    "zh": (HAN,),
    "vi": (LATIN,),
    "es": (LATIN,),
    "it": (LATIN,),
    "de": (LATIN,),
    "ru": (CYRILLIC,),
}


def writes_script(language: str, text: str) -> bool:
    """Whether `language` writes the script `text` is in.

    That is what a requested first character has to be before a generator can lead
    anything with it. A character from another script is one the language can never
    begin a word with, and putting it there anyway is how
    `rand_name(language="ko", starts_with="Q")` used to answer `Q대겸` — a Latin
    letter glued to a Korean given name, in two scripts and in neither language.

    Args:
        language: The language code to ask about.
        text: The text whose script is in question.

    Returns:
        True when the language writes that script, or when there is nothing to ask.
    """
    scripts = _SCRIPTS.get(language)

    if not text or scripts is None:
        return True

    return any(script.search(text) for script in scripts)


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


# The final consonant `ㄹ` is the eighth of the twenty-seven a syllable can close on, and
# the one Korean treats as a vowel for one particle: `마을로`, never `마을으로`.
_HANGUL_LIQUID = 8


def ends_with_liquid(text: str) -> bool:
    """Whether `text` ends on the Korean liquid `ㄹ`.

    That is the one coda the particle `로` does not alternate for: `시장으로` and
    `마을로`, both from one particle. Anything that is not a Hangul syllable reports
    False.

    Args:
        text: The text to judge.

    Returns:
        True when the last syllable closes on `ㄹ`.
    """
    trimmed = text.rstrip()

    if not trimmed:
        return False

    code = ord(trimmed[-1])

    return (
        _HANGUL_BASE <= code <= _HANGUL_LAST
        and (code - _HANGUL_BASE) % _HANGUL_FINALS == _HANGUL_LIQUID
    )
