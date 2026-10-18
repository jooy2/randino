"""How a fictional name or place is written in every language at once.

A fictional name is made up in Latin letters, and every other language writes it by its
sound: `Artemis` is `아르테미스`, `アルテミス`, `阿尔忒弥斯` and `Артемис`. Five scripts
cover the nine word languages, because English, Vietnamese, Spanish, Italian and German
all keep a made-up name the way it is spelled. So every entry of the fictional datasets is
one spelling per script, and a language only has to say which script it reads.
"""

import math
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from typing import TypeVar

from randino._internal.table import rows
from randino._internal.utils import capitalize_first
from randino._types import WordLanguage

T = TypeVar("T")

Spelling = tuple[str, str, str, str, str]
"""One word in each of the five scripts: Latin, Hangul, katakana, hanzi and Cyrillic."""

LATIN = 0
"""Where the Latin spelling sits in a `Spelling`."""

HANGUL = 1
"""Where the Hangul spelling sits in a `Spelling`."""

KANA = 2
"""Where the katakana spelling sits in a `Spelling`."""

HAN = 3
"""Where the hanzi spelling sits in a `Spelling`."""

CYRILLIC = 4
"""Where the Cyrillic spelling sits in a `Spelling`."""

SCRIPT_OF: dict[WordLanguage, int] = {
    "en": LATIN,
    "vi": LATIN,
    "es": LATIN,
    "it": LATIN,
    "de": LATIN,
    "ko": HANGUL,
    "ja": KANA,
    "zh": HAN,
    "ru": CYRILLIC,
}
"""The script each word language writes a fictional name in."""

NAME_JOINERS: tuple[str, ...] = (" ", " ", "・", "·", " ")
"""What sits between a given name and a surname in each script.

Japanese and Chinese write a foreign name's parts apart with a dot of their own, where
every other script leaves a space: `エララ・ブラックウッド`, `埃拉拉·布莱克伍德`.
"""


@dataclass(frozen=True, slots=True)
class SpelledRow:
    """One row of a table whose last five cells are a spelling."""

    cells: tuple[str, ...]
    """The cells before the spelling."""

    spelling: Spelling
    """The five spellings the row ends on."""


def spelled_rows(source: str) -> list[SpelledRow]:
    """Split a table whose rows end on the five spellings of one word.

    Args:
        source: The table, one row per line with `|` between the cells.

    Returns:
        Each row, its spelling apart from the cells in front of it.
    """
    split: list[SpelledRow] = []

    for cells in rows(source):
        at = len(cells) - 5
        split.append(
            SpelledRow(
                cells=cells[:at],
                spelling=(cells[at], cells[at + 1], cells[at + 2], cells[at + 3], cells[at + 4]),
            )
        )

    return split


# Hangul syllables are composed as (initial * 21 + vowel) * 28 + final, so a syllable with
# no final consonant is a multiple of 28 from the base, and the liquid `ㄹ` is the eighth
# final.
_HANGUL_BASE = 0xAC00
_HANGUL_LAST = 0xD7A3
_HANGUL_FINALS = 28
_HANGUL_LIQUID = 8


def _join_hangul(left: str, right_latin: str, right: str) -> str:
    """`left` and `right` joined into one Korean word, for parts of one word written apart.

    `에드` and `린` are `에들린`, `아` and `리아` are `알리아`. Korean writes an English `l`
    between vowels, or after a consonant written with a vowel of its own, as a doubled
    `ㄹ`: `Alice` is `앨리스` and `Hartley` is `하틀리`. A part that starts with `l` is
    spelled for a word that starts there, so the `ㄹ` it needs in front is added to the
    syllable before it, when that syllable has no final consonant to stand in the way. An
    `r` keeps a single `ㄹ` (`이스라`), which is why the rule asks the Latin spelling and
    not the Hangul one.

    Args:
        left: The Korean word so far.
        right_latin: The next part's Latin spelling.
        right: The next part's Hangul spelling.

    Returns:
        The two joined.
    """
    code = ord(left[-1]) if left else 0
    is_open = _HANGUL_BASE <= code <= _HANGUL_LAST and (code - _HANGUL_BASE) % _HANGUL_FINALS == 0

    if is_open and right_latin.lower().startswith("l"):
        return left[:-1] + chr(code + _HANGUL_LIQUID) + right

    return left + right


def joinable(left: str, right: str) -> bool:
    """Whether two parts make one word that every script can write by joining them.

    A part ending on the letter the next one starts with is spelled double in English and
    written once in the other scripts — `Kallis` is `カリス`, never `カルリス` — so the two
    cannot be joined part by part. Nor can an `sh` meet an `l`, which Korean writes as one
    sound of its own: `Ashley` is `애슐리`, and `애시` and `리` make `애실리`. And an open
    syllable is not followed by one that starts the same way, which reads as a stutter
    (`Lalan`, `Raria`).

    Args:
        left: The Latin spelling of the part in front.
        right: The Latin spelling of the part after it.

    Returns:
        True when the two can be joined.
    """
    end = left.lower()
    start = right.lower()

    if not end or not start or end[-1] == start[0]:
        return False

    if end[-1] in "aeiouy" and end[0] == start[0]:
        return False

    return not (end.endswith("sh") and start.startswith("l"))


def join_parts(parts: Sequence[Spelling]) -> Spelling:
    """Parts joined into one word in every script.

    Each part is written for where it sits, so the Latin and Cyrillic words only need
    their first letter raised.

    Args:
        parts: The parts, in order.

    Returns:
        The word in all five scripts.
    """
    latin, hangul, kana, han, cyrillic = parts[0]

    for part in parts[1:]:
        hangul = _join_hangul(hangul, part[LATIN], part[HANGUL])
        latin += part[LATIN]
        kana += part[KANA]
        han += part[HAN]
        cyrillic += part[CYRILLIC]

    return (
        capitalize_first(latin.lower()),
        hangul,
        kana,
        han,
        capitalize_first(cyrillic.lower()),
    )


def leads_with(text: str, prefix: str) -> bool:
    """Whether `text` starts with `prefix`, ignoring case. An empty prefix matches anything."""
    return not prefix or text.lower().startswith(prefix.lower())


def miss_by(length: int, low: int, high: int) -> float:
    """How far a length is from a range, an overshoot counting half a character worse."""
    if length < low:
        return low - length

    if length > high:
        return length - high + 0.5

    return 0


def fitting(pool: Sequence[T], text_of: Callable[[T], str], low: int, high: int) -> list[T]:
    """The entries of `pool` whose text is between `low` and `high` characters long.

    Or the closest ones when none is.

    Args:
        pool: The entries to choose among.
        text_of: The text of an entry that is measured.
        low: The shortest length wanted.
        high: The longest length wanted.

    Returns:
        The entries that fit, or the ones that miss by the least.
    """
    best = math.inf
    closest: list[T] = []

    for entry in pool:
        miss = miss_by(len(text_of(entry)), low, high)

        if miss < best:
            best = miss
            closest = [entry]
        elif miss == best:
            closest.append(entry)

    return closest


def span_of(texts: Sequence[str]) -> tuple[int, int]:
    """The shortest and the longest text of a pool, in characters, `(0, 0)` for none."""
    if not texts:
        return 0, 0

    lengths = [len(text) for text in texts]

    return min(lengths), max(lengths)
