"""Reads the Python package's datasets and writes them in the canonical shape.

`index.mjs` compares that shape across the three packages; see
`tools/parity/README.md` for what canonical means and why each package needs a
dump of its own.
"""

import json
from collections.abc import Mapping, Sequence
from typing import Any

from randino._internal.parse import NameToken
from randino.constants import (
    RAND_COUNT_MAX,
    RAND_LENGTH_MAX,
    RAND_LENGTH_MIN,
    RAND_SENTENCE_LENGTH_MAX,
)
from randino.decorate.data import (
    AFFIX_CHARSET,
    AFFIX_LENGTH_DEFAULT,
    AFFIX_LENGTH_MAX,
    AFFIX_SEPARATOR_DEFAULT,
)
from randino.name.data import NAME_DATA, NAME_LANGUAGES
from randino.name.data.ko import KO_SURNAME_ROMAN
from randino.sentence.data import SENTENCE_DATA, THEME_CLASS
from randino.word.data import LOOSE_THEMES, WORD_DATA, WORD_LANGUAGES, WORD_THEMES
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
        "nounGender": None if data.noun_gender is None else dict(data.noun_gender),
        "genderRules": (
            None
            if data.gender_rules is None
            else [[ending, gender] for ending, gender in data.gender_rules]
        ),
        "agreement": (
            None
            if data.agreement is None
            else {g: [list(rule) for rule in rules] for g, rules in data.agreement.items()}
        ),
        # Optional in one package and defaulted in another; written as a list
        # either way so the shapes compare.
        "frames": [
            {
                "slots": list(frame.slots),
                "glue": list(frame.glue),
                "weight": frame.weight,
            }
            for frame in data.frames
        ],
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

sentence = {
    code: {
        "space": data.space,
        "capitalize": data.capitalize,
        "terminator": data.terminator,
        # Optional in one package and defaulted in another; written the same way
        # here either way, so the shapes compare.
        "predicateAgrees": data.predicate_agrees,
        "articles": (
            None
            if data.articles is None
            else {
                gender: [list(rule) for rule in rules]
                for gender, rules in data.articles.items()
            }
        ),
        "verbs": [
            {
                "subject": list(group.subject),
                "object": None if group.object is None else list(group.object),
                "words": listed(group.words),
            }
            for group in data.verbs
        ],
        "states": [
            {"subject": list(group.subject), "words": listed(group.words)}
            for group in data.states
        ],
        "manners": listed(data.manners),
        "times": listed(data.times),
        "frames": [
            {
                "parts": [
                    {
                        "slot": part.slot,
                        "head": part.head,
                        "tail": part.tail,
                        "tailAlt": part.tail_alt,
                        "modifiable": part.modifiable,
                        "bare": part.bare,
                    }
                    for part in frame.parts
                ],
                "weight": frame.weight,
            }
            for frame in data.frames
        ],
    }
    for code, data in SENTENCE_DATA.items()
}

print(
    json.dumps(
        {
            "constants": {
                "randCountMax": RAND_COUNT_MAX,
                "randLengthMin": RAND_LENGTH_MIN,
                "randLengthMax": RAND_LENGTH_MAX,
                "randSentenceLengthMax": RAND_SENTENCE_LENGTH_MAX,
                "affixLengthDefault": AFFIX_LENGTH_DEFAULT,
                "affixLengthMax": AFFIX_LENGTH_MAX,
                "affixSeparatorDefault": AFFIX_SEPARATOR_DEFAULT,
                "affixCharset": AFFIX_CHARSET,
            },
            "word": {
                "languages": list(WORD_LANGUAGES),
                "themes": list(WORD_THEMES),
                "looseThemes": list(LOOSE_THEMES),
                "data": word,
            },
            "sentence": {
                "themeClass": dict(THEME_CLASS),
                "data": sentence,
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
