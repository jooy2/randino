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
from randino.sentence.data import (
    AGENT_CLASSES,
    FIELD_RULES,
    INTERLUDES,
    OPPOSITES,
    SENTENCE_DATA,
    STORIES,
    THEME_CLASS,
    StoryStep,
)
from randino.sentence.data._types import ModifierGroup, PredicateTense, SentenceSpeech
from randino.word.data import LOOSE_THEMES, WORD_DATA, WORD_LANGUAGES, WORD_THEMES
from randino.word.data._types import SyllableSynthesis, WordAgreement


def pool(source: Sequence[Any] | None) -> list[dict[str, str | None]] | None:
    """Flatten a name pool: a plain entry carries no reading, a token does."""
    if source is None:
        return None
    return [
        {"n": entry.n, "r": entry.r} if isinstance(entry, NameToken) else {"n": entry, "r": None}
        for entry in source
    ]


def listed(source: Sequence[str] | None) -> list[str] | None:
    """Flatten a word pool."""
    return None if source is None else list(source)


def speech(person: SentenceSpeech | None) -> dict[str, object] | None:
    """A first or second person in the canonical shape, with an empty map for no heads."""
    if person is None:
        return None

    return {
        "subject": person.subject,
        "head": person.head or "",
        "heads": dict(person.heads or {}),
    }


def tense(source: PredicateTense | None) -> dict[str, object] | None:
    """A predicate's past forms, or None where the language's predicate does not change."""
    if source is None:
        return None

    return {
        "words": listed(source.words),
        "forms": {form: listed(pool) for form, pool in source.forms.items()},
    }


def groups(source: Sequence[ModifierGroup]) -> list[dict[str, object]]:
    """A group of modifiers or manners, narrowed by class and optionally by theme."""
    return [
        {
            "subject": list(group.subject),
            "themes": listed(group.themes),
            "fields": listed(group.fields),
            "words": listed(group.words),
        }
        for group in source
    ]


def rules(source: WordAgreement | None) -> dict[str, object] | None:
    """Agreement rules per gender, as lists of `[ending, replacement]` pairs."""
    if source is None:
        return None

    return {gender: [list(rule) for rule in each] for gender, each in source.items()}


def step(source: StoryStep) -> dict[str, object]:
    """A story step, in the shape every package writes."""
    return {
        "kind": source.kind,
        "fields": list(source.fields),
        "condition": source.condition or "",
        "object": source.object or "",
        "place": source.place,
        "destination": source.destination or "",
        "needs": list(source.needs),
        "required": source.required,
        "link": source.link or "",
        "kinds": list(source.kinds),
        "actor": source.actor or "",
        "actorClasses": list(source.actor_classes or ()),
        "actorThemes": listed(source.actor_themes),
    }


def mapped(source: Mapping[Any, Any] | None) -> dict[str, Any] | None:
    """Flatten a lookup, keyed by string so a syllable count compares as one."""
    return None if source is None else {str(key): value for key, value in source.items()}


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
        "terminators": dict(data.terminators),
        # Optional in one package and defaulted in another; written as a map either way
        # so the shapes compare.
        "openers": dict(data.openers),
        "quotes": {kind: list(pair) for kind, pair in data.quotes.items()},
        # Optional in one package and defaulted in another; written the same way
        # here either way, so the shapes compare.
        "predicateAgrees": data.predicate_agrees,
        "pastAgreement": rules(data.past_agreement),
        "pastMark": (
            None
            if data.past_mark is None
            else {"head": data.past_mark.head, "tail": data.past_mark.tail}
        ),
        "join": (
            None
            if data.join is None
            else {"form": data.join.form or "", "word": data.join.word or ""}
        ),
        "articles": rules(data.articles),
        "verbs": [
            {
                "subject": list(group.subject),
                "object": None if group.object is None else list(group.object),
                "field": group.field,
                "subjectThemes": listed(group.subject_themes),
                "subjectTraits": listed(group.subject_traits),
                "subjectWithout": listed(group.subject_without),
                "objectThemes": listed(group.object_themes),
                "objectTraits": listed(group.object_traits),
                "objectWithout": listed(group.object_without),
                "requires": group.requires or "",
                "condition": group.condition or "",
                "words": listed(group.words),
                "forms": {form: listed(pool) for form, pool in group.forms.items()},
                "past": tense(group.past),
            }
            for group in data.verbs
        ],
        "states": [
            {
                "subject": list(group.subject),
                "subjectThemes": listed(group.subject_themes),
                "condition": group.condition or "",
                "head": group.head or "",
                "pastHead": group.past_head or "",
                "words": listed(group.words),
                "forms": {form: listed(pool) for form, pool in group.forms.items()},
                "past": tense(group.past),
            }
            for group in data.states
        ],
        "modifiers": groups(data.modifiers),
        "manners": groups(data.manners),
        "times": {
            "day": listed(data.times.day),
            "any": listed(data.times.any),
            "past": listed(data.times.past),
            "present": listed(data.times.present),
            "habitual": listed(data.times.habitual),
        },
        "homes": listed(data.homes),
        "replies": (
            None
            if data.replies is None
            else {
                level: {cue: listed(pool) for cue, pool in pools.items()}
                for level, pools in data.replies.items()
            }
        ),
        "degrees": listed(data.degrees),
        "connectives": {kind: listed(pool) for kind, pool in data.connectives.items()},
        "traits": (
            None
            if data.traits is None
            else {trait: listed(pool) for trait, pool in data.traits.items()}
        ),
        "interjections": listed(data.interjections),
        "pronouns": {gender: listed(pool) for gender, pool in data.pronouns.items()},
        # Optional in one package and defaulted in another; written as a list either
        # way so the shapes compare.
        "pronounless": list(data.pronounless),
        "objectPronouns": (
            None
            if data.object_pronouns is None
            else {
                "words": {
                    gender: listed(pool) for gender, pool in data.object_pronouns.words.items()
                },
                "clitic": data.object_pronouns.clitic,
            }
        ),
        "speech": speech(data.speech),
        "listener": speech(data.listener),
        "homecomings": (
            None
            if data.homecomings is None
            else {level: listed(pool) for level, pool in data.homecomings.items()}
        ),
        "placeHeads": (
            None
            if data.place_heads is None
            else {head: listed(pool) for head, pool in data.place_heads.items()}
        ),
        "numeral": (
            None
            if data.numeral is None
            else {
                "order": data.numeral.order,
                "counters": dict(data.numeral.counters),
                "count": list(data.numeral.count),
                "currency": data.numeral.currency,
                "amounts": list(data.numeral.amounts),
                "group": data.numeral.group,
                "gap": data.numeral.gap,
            }
        ),
        "calendar": (
            None
            if data.calendar is None
            else {
                "date": data.calendar.date,
                "months": (None if data.calendar.months is None else listed(data.calendar.months)),
                "clock": data.calendar.clock,
                "years": list(data.calendar.years),
                "copula": {
                    "subject": list(data.calendar.copula.subject),
                    "words": listed(data.calendar.copula.words),
                    "forms": {
                        form: listed(pool) for form, pool in data.calendar.copula.forms.items()
                    },
                    "past": tense(data.calendar.copula.past),
                },
            }
        ),
        "frames": [
            {
                "parts": [
                    {
                        "slot": part.slot,
                        "head": part.head,
                        "pastHead": part.past_head,
                        "tail": part.tail,
                        "tailAlt": part.tail_alt,
                        "tailLiquid": part.tail_liquid,
                        "modifiable": part.modifiable,
                        "bare": part.bare,
                        "copula": part.copula or "",
                    }
                    for part in frame.parts
                ],
                "weight": frame.weight,
                "mood": frame.mood,
                "tag": frame.tag,
                "fields": listed(frame.fields),
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
                "agentClasses": list(AGENT_CLASSES),
                "fieldRules": {
                    field: {
                        "needs": list(rule.needs),
                        "gives": list(rule.gives),
                        "takes": list(rule.takes),
                        "after": list(rule.after),
                    }
                    for field, rule in FIELD_RULES.items()
                },
                "opposites": dict(OPPOSITES),
                "stories": [
                    {
                        "name": story.name,
                        "hero": list(story.hero),
                        "item": listed(story.item),
                        "itemThemes": listed(story.item_themes),
                        "prop": listed(story.prop),
                        "propThemes": listed(story.prop_themes),
                        "heroThemes": listed(story.hero_themes),
                        "lines": story.lines or 0,
                        "start": list(story.start),
                        "steps": [step(each) for each in story.steps],
                        "weight": story.weight,
                    }
                    for story in STORIES
                ],
                "interludes": [step(each) for each in INTERLUDES],
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
