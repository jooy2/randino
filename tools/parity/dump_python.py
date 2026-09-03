"""Reads the Python package's datasets and writes them in the canonical shape.

`index.mjs` compares that shape across the three packages; see
`tools/parity/README.md` for what canonical means and why each package needs a
dump of its own.
"""

import json
from collections.abc import Mapping, Sequence
from typing import Any

from randino._internal.parse import NameToken
from randino.constants import RAND_COUNT_MAX, RAND_LENGTH_MAX, RAND_LENGTH_MIN
from randino.decorate.data import (
    AFFIX_CHARSET,
    AFFIX_LENGTH_DEFAULT,
    AFFIX_LENGTH_MAX,
    AFFIX_SEPARATOR_DEFAULT,
)
from randino.name.data import NAME_DATA, NAME_LANGUAGES
from randino.name.data.ko import KO_SURNAME_ROMAN
from randino.word.data import WORD_DATA, WORD_LANGUAGES, WORD_THEMES
from randino.word.data._types import SyllableSynthesis


def pool(source: Sequence[Any] | None) -> list[dict[str, str | None]] | None:
    """Flatten a name pool: a plain entry carries no reading, a token does."""
    if source is None:
        return None
    return [
        {"n": entry.n, "r": entry.r}
        if isinstance(entry, NameToken)
        else {"n": entry, "r": None}
        for entry in source
    ]


def listed(source: Sequence[str] | None) -> list[str] | None:
    """Flatten a word pool."""
    return None if source is None else list(source)


def mapped(source: Mapping[Any, Any] | None) -> dict[str, Any] | None:
    """Flatten a lookup, keyed by string so a syllable count compares as one."""
    return (
        None if source is None else {str(key): value for key, value in source.items()}
    )


word = {
    code: {
        "joiner": data.joiner,
        "capitalize": data.capitalize,
        "adjectives": listed(data.adjectives),
        "actions": listed(data.actions),
        "parts": listed(data.parts),
        "nouns": {theme: listed(words) for theme, words in data.nouns.items()},
        # The npm package tags the two shapes with `kind`; here they are two
        # classes, so the tag is written back out for the comparison.
        "syn": {
            "kind": "syllable",
            "onset": listed(data.syn.onset),
            "vowel": listed(data.syn.vowel),
            "coda": listed(data.syn.coda),
            "minSyllables": data.syn.min_syllables,
            "maxSyllables": data.syn.max_syllables,
        }
        if isinstance(data.syn, SyllableSynthesis)
        else {
            "kind": "pool",
            "pool": listed(data.syn.pool),
            "minSyllables": data.syn.min_syllables,
            "maxSyllables": data.syn.max_syllables,
        },
    }
    for code, data in WORD_DATA.items()
}

name = {
    code: {
        "order": data.order,
        "joiner": data.joiner,
        "hasMiddle": data.has_middle,
        "roman": data.roman,
        "lengthSpec": {
            "given": list(data.length_spec.given),
            "last": list(data.length_spec.last),
            "middle": list(data.length_spec.middle),
        },
        "last": pool(data.last),
        "lastWeights": mapped(data.last_weights),
        "male": pool(data.male),
        "female": pool(data.female),
        "middleMale": pool(data.middle_male),
        "middleFemale": pool(data.middle_female),
        "givenMale": pool(data.given_male),
        "givenFemale": pool(data.given_female),
        "givenLenWeights": mapped(data.given_len_weights),
        "firstMale": pool(data.first_male),
        "restMale": pool(data.rest_male),
        "firstFemale": pool(data.first_female),
        "restFemale": pool(data.rest_female),
        "syn": None
        if data.syn is None
        else {
            "onset": listed(data.syn.onset),
            "vowel": listed(data.syn.vowel),
            "coda": listed(data.syn.coda),
            "minSyllables": data.syn.min_syllables,
            "maxSyllables": data.syn.max_syllables,
        },
    }
    for code, data in NAME_DATA.items()
}

print(
    json.dumps(
        {
            "constants": {
                "randCountMax": RAND_COUNT_MAX,
                "randLengthMin": RAND_LENGTH_MIN,
                "randLengthMax": RAND_LENGTH_MAX,
                "affixLengthDefault": AFFIX_LENGTH_DEFAULT,
                "affixLengthMax": AFFIX_LENGTH_MAX,
                "affixSeparatorDefault": AFFIX_SEPARATOR_DEFAULT,
                "affixCharset": AFFIX_CHARSET,
            },
            "word": {
                "languages": list(WORD_LANGUAGES),
                "themes": list(WORD_THEMES),
                "data": word,
            },
            "name": {
                "languages": list(NAME_LANGUAGES),
                "koSurnameRoman": mapped(KO_SURNAME_ROMAN),
                "data": name,
            },
        },
        ensure_ascii=False,
    )
)
