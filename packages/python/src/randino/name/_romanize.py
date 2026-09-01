"""Turns a native name into its "English pronunciation".

Every language does this with plain data — the package has no dependencies:

- Latin scripts strip their diacritics (José -> Jose, Müller -> Muller).
- Cyrillic is transliterated character by character.
- Hangul follows the Revised Romanization of Korean, including the sound changes
  that happen between syllables (석민 -> seongmin, not seokmin).
- Japanese and Chinese carry the reading on each token, so nothing to do here.
"""

import unicodedata
from typing import Literal, NamedTuple

from randino._internal.utils import capitalize_first
from randino.name.data._types import RomanMode
from randino.name.data.ko import KO_SURNAME_ROMAN


def fold(value: str) -> str:
    """ASCII-fold a Latin-script string (José -> Jose, Müller -> Muller, Đỗ -> Do).

    Decomposing and dropping the combining marks is what the npm package does; the
    Dart port cannot, and carries a written-out table instead.
    """
    stripped = "".join(
        char for char in unicodedata.normalize("NFD", value) if not unicodedata.combining(char)
    )

    return stripped.replace("đ", "d").replace("Đ", "D").replace("ß", "ss")


CYRILLIC_MAP = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "e",
    "ё": "yo",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "й": "y",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "kh",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "shch",
    "ъ": "",
    "ы": "y",
    "ь": "",
    "э": "e",
    "ю": "yu",
    "я": "ya",
}
"""Cyrillic letter to its Latin reading."""


def translit(value: str) -> str:
    """Transliterate Cyrillic to Latin character by character, keeping initial capitals."""
    out = ""

    for char in value:
        lower = char.lower()
        base = CYRILLIC_MAP.get(lower, char)

        out += base if char == lower else capitalize_first(base)

    return out


# --- Hangul -----------------------------------------------------------------

HANGUL_FIRST = 0xAC00
HANGUL_LAST = 0xD7A3

ONSET = (
    "g",
    "kk",
    "n",
    "d",
    "tt",
    "r",
    "m",
    "b",
    "pp",
    "s",
    "ss",
    "",
    "j",
    "jj",
    "ch",
    "k",
    "t",
    "p",
    "h",
)
"""Initial consonant, indexed by its jamo position within a composed syllable."""

NUCLEUS = (
    "a",
    "ae",
    "ya",
    "yae",
    "eo",
    "e",
    "yeo",
    "ye",
    "o",
    "wa",
    "wae",
    "oe",
    "yo",
    "u",
    "wo",
    "we",
    "wi",
    "yu",
    "eu",
    "ui",
    "i",
)
"""Vowel, indexed by its jamo position within a composed syllable."""

CODA = (
    "",
    "k",
    "k",
    "k",
    "n",
    "n",
    "n",
    "t",
    "l",
    "k",
    "m",
    "l",
    "l",
    "l",
    "p",
    "l",
    "m",
    "p",
    "p",
    "t",
    "t",
    "ng",
    "t",
    "t",
    "k",
    "t",
    "p",
    "t",
)
"""Final consonant, indexed by its jamo position within a composed syllable."""

LIAISON = (
    ("", ""),
    ("", "g"),
    ("", "kk"),
    ("k", "s"),
    ("", "n"),
    ("n", "j"),
    ("", "n"),
    ("", "d"),
    ("", "r"),
    ("l", "g"),
    ("l", "m"),
    ("l", "b"),
    ("l", "s"),
    ("l", "t"),
    ("l", "p"),
    ("", "r"),
    ("", "m"),
    ("", "b"),
    ("p", "s"),
    ("", "s"),
    ("", "ss"),
    ("ng", ""),
    ("", "j"),
    ("", "ch"),
    ("", "k"),
    ("", "t"),
    ("", "p"),
    ("", ""),
)
"""A final consonant in front of a vowel moves into the next syllable's onset.

`(keep, moved)`: complex finals leave their first half behind (닭이 -> dalgi), and a
silent ㅎ moves nothing (좋아 -> joa).
"""

ONSET_N = 2
ONSET_R = 5
ONSET_M = 6
ONSET_EMPTY = 11

CODA_K = frozenset({1, 2, 3, 9, 24})
CODA_T = frozenset({7, 19, 20, 22, 23, 25, 27})
CODA_P = frozenset({14, 17, 18, 26})
CODA_L = frozenset({8, 11, 12, 13, 15})
CODA_NASAL = frozenset({10, 16, 21})

CODA_H = {6: "n", 15: "l", 27: ""}
"""Finals containing ㅎ, which aspirates the following consonant (좋고 -> joko)."""

ASPIRATED = {0: "k", 3: "t", 9: "ss", 12: "ch"}
"""What each aspirable onset becomes after a ㅎ final."""


class Syllable(NamedTuple):
    """One composed Hangul syllable, taken apart into its three jamo positions."""

    onset: int
    nucleus: int
    coda: int


def decompose(char: str) -> Syllable | None:
    """Take a composed Hangul syllable apart, or return None for anything else."""
    code = ord(char)

    if code < HANGUL_FIRST or code > HANGUL_LAST:
        return None

    offset = code - HANGUL_FIRST

    return Syllable(onset=offset // 588, nucleus=(offset % 588) // 28, coda=offset % 28)


def romanize_coda(coda: int, following: Syllable | None) -> tuple[str, str | None]:
    """Romanize one final consonant against the syllable that follows it.

    Returns the sound the current syllable ends on plus an onset override for the
    next one.
    """
    if coda == 0:
        return "", None

    if following is None:
        return CODA[coda], None

    onset = following.onset

    # A vowel-initial syllable pulls the final consonant across.
    if onset == ONSET_EMPTY:
        return LIAISON[coda]

    # ㅎ in the final aspirates the next consonant (놓다 -> nota).
    if coda in CODA_H and onset in ASPIRATED:
        return CODA_H[coda], ASPIRATED[onset]

    # Nasalization: a stop in front of ㄴ or ㅁ becomes the matching nasal.
    if onset in (ONSET_N, ONSET_M):
        if coda in CODA_K:
            return "ng", None
        if coda in CODA_T:
            return "n", None
        if coda in CODA_P:
            return "m", None
        # ㄹ + ㄴ assimilates the other way around (실내 -> sillae).
        if coda in CODA_L and onset == ONSET_N:
            return "l", "l"

        return CODA[coda], None

    # ㄹ either doubles after another ㄹ (별로 -> byeollo) or turns into ㄴ.
    if onset == ONSET_R:
        if coda in CODA_L or coda == 4:
            return "l", "l"
        if coda in CODA_K:
            return "ng", "n"
        if coda in CODA_T:
            return "n", "n"
        if coda in CODA_P:
            return "m", "n"
        if coda in CODA_NASAL:
            return CODA[coda], "n"

    return CODA[coda], None


def romanize_hangul(text: str) -> str:
    """Romanize Hangul with the Revised Romanization of Korean.

    Characters that are not composed Hangul syllables are passed through untouched.
    """
    syllables = [decompose(char) for char in text]
    out = ""
    override: str | None = None

    for index, char in enumerate(text):
        current = syllables[index]

        if current is None:
            out += char
            override = None
            continue

        following = syllables[index + 1] if index + 1 < len(syllables) else None
        coda, next_onset = romanize_coda(current.coda, following)

        out += ONSET[current.onset] if override is None else override
        out += NUCLEUS[current.nucleus] + coda
        override = next_onset

    return out


def romanize(mode: RomanMode, value: str, part: Literal["surname", "given"]) -> str:
    """Romanize a native name part according to its language's romanization mode."""
    if mode == "fold":
        return fold(value)
    if mode == "translit":
        return translit(value)
    if mode == "hangul":
        if part == "surname" and value in KO_SURNAME_ROMAN:
            return KO_SURNAME_ROMAN[value]

        return capitalize_first(romanize_hangul(value))

    return value
