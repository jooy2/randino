"""Reads the Python package's datasets and writes them in the canonical shape.

`index.mjs` compares that shape across the three packages; see
`tools/parity/README.md` for what canonical means and why each package needs a
dump of its own.
"""

import json
from collections.abc import Mapping, Sequence
from typing import Any

from randino._internal.parse import NameToken, outline
from randino.age.data import AGE_BANDS, AGE_CURVE, AGE_GROUPS, AGE_MAX_DEFAULT
from randino.architecture.data import ARCHITECTURE_DATA, ARCHITECTURES
from randino.constants import (
    RAND_AGE_MAX,
    RAND_COUNT_MAX,
    RAND_LENGTH_MAX,
    RAND_LENGTH_MIN,
    RAND_LOCATION_LENGTH_MAX,
    RAND_ORGANIZATION_LENGTH_MAX,
    RAND_SENTENCE_LENGTH_MAX,
    SYSTEM_PLATFORMS,
)
from randino.cpu.data import CPUS
from randino.date.data import (
    DATE_CEILING,
    DATE_FLOOR,
    DATE_FORMAT_DEFAULT,
    DATE_MAX_DEFAULT,
    DATE_MIN_DEFAULT,
    DATE_NAMES,
    DATE_UNITS,
)
from randino.decorate.data import (
    AFFIX_CHARSET,
    AFFIX_LENGTH_DEFAULT,
    AFFIX_LENGTH_MAX,
    AFFIX_SEPARATOR_DEFAULT,
)
from randino.device.data import DEVICE_TYPES, DEVICES
from randino.disk.data import DISK_SCALE, DISK_TYPE_LABELS, DISK_TYPE_WEIGHTS, DISK_TYPES
from randino.gender.data import GENDER_CODES, GENDER_LABELS, GENDER_WEIGHTS
from randino.gpu.data import GPUS
from randino.location.data import LOCATION_DATA, LOCATION_LANGUAGES, LOCATION_LEVELS
from randino.location.data.countries import COUNTRIES
from randino.name.data import NAME_DATA, NAME_LANGUAGES
from randino.name.data.ko import KO_SURNAME_ROMAN
from randino.organization.data import (
    ORGANIZATION_BARE_CHANCE,
    ORGANIZATION_DATA,
    ORGANIZATION_GENERIC_CHANCE,
    ORGANIZATION_INDUSTRIES,
    ORGANIZATION_LEGAL_FORM_CHANCE,
    ORGANIZATION_TYPE_WEIGHTS,
    ORGANIZATION_TYPES,
)
from randino.organization.data._types import OrganizationLanguageData, PoolOrganizationSynthesis
from randino.os.data import OS_FAMILIES, OS_RELEASES
from randino.phone.data import PHONE_COUNTRIES, PHONE_DATA, PHONE_TYPES
from randino.phone.data._types import PhoneShape
from randino.ram.data import RAM_SCALE
from randino.resolution.data import RESOLUTION_SEPARATOR_DEFAULT, RESOLUTIONS
from randino.version.data import (
    CALVER_SCHEMES,
    VERSION_FORMATS,
    VERSION_PARTS,
    VERSION_PRERELEASE_CHANCE,
    VERSION_PRERELEASES,
    VERSION_YEAR_CEILING,
    VERSION_YEAR_FLOOR,
    VERSION_YEAR_MAX_DEFAULT,
    VERSION_YEAR_MIN_DEFAULT,
)
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


def phone_plans(plans: Mapping[str, Sequence[PhoneShape]]) -> dict[str, Any]:
    """A phone plan per type, every optional field of a shape written out."""
    return {
        kind: [
            {
                "prefixes": list(shape.prefixes),
                "lead": shape.lead,
                "groups": list(shape.groups),
                "avoid": list(shape.avoid),
                "trunk": shape.trunk,
            }
            for shape in plans[kind]
        ]
        for kind in PHONE_TYPES
    }


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
        "levels": {"basic": listed(data.levels.basic), "rare": listed(data.levels.rare)},
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

location = {
    code: {
        "country": data.country,
        "order": data.order,
        "joiner": data.joiner,
        "levels": list(data.levels),
        "entries": [
            {"path": list(entry.path), "depth": entry.depth, "below": entry.below}
            for entry in outline(data.outline, len(data.levels))
        ],
    }
    for code, data in LOCATION_DATA.items()
}


def organization_of(data: OrganizationLanguageData) -> dict[str, object]:
    """One language's organization dataset, the synthesis tagged with its kind."""
    syn = data.syn

    return {
        "stems": list(data.stems),
        "syn": {
            "kind": "pool",
            "pool": list(syn.pool),
            "joiner": syn.joiner,
            "minSyllables": syn.min_syllables,
            "maxSyllables": syn.max_syllables,
        }
        if isinstance(syn, PoolOrganizationSynthesis)
        else {
            "kind": "syllable",
            "onset": list(syn.onset),
            "vowel": list(syn.vowel),
            "coda": list(syn.coda),
            "minSyllables": syn.min_syllables,
            "maxSyllables": syn.max_syllables,
        },
        "places": None if data.places is None else list(data.places),
        "numbers": None if data.numbers is None else list(data.numbers),
        "industries": {each: list(data.industries[each]) for each in ORGANIZATION_INDUSTRIES},
        "generic": list(data.generic),
        "templates": {kind: list(data.templates[kind]) for kind in ORGANIZATION_TYPES},
        "legalForms": list(data.legal_forms),
    }


print(
    json.dumps(
        {
            "constants": {
                "randCountMax": RAND_COUNT_MAX,
                "randLengthMin": RAND_LENGTH_MIN,
                "randLengthMax": RAND_LENGTH_MAX,
                "randSentenceLengthMax": RAND_SENTENCE_LENGTH_MAX,
                "randLocationLengthMax": RAND_LOCATION_LENGTH_MAX,
                "randAgeMax": RAND_AGE_MAX,
                "randOrganizationLengthMax": RAND_ORGANIZATION_LENGTH_MAX,
                "affixLengthDefault": AFFIX_LENGTH_DEFAULT,
                "affixLengthMax": AFFIX_LENGTH_MAX,
                "affixSeparatorDefault": AFFIX_SEPARATOR_DEFAULT,
                "affixCharset": AFFIX_CHARSET,
                "systemPlatforms": list(SYSTEM_PLATFORMS),
            },
            "age": {
                "groups": list(AGE_GROUPS),
                "bands": {group: list(AGE_BANDS[group]) for group in AGE_GROUPS},
                "curve": [[age, weight] for age, weight in AGE_CURVE],
                "maxDefault": AGE_MAX_DEFAULT,
            },
            "date": {
                "units": list(DATE_UNITS),
                "floor": DATE_FLOOR,
                "ceiling": DATE_CEILING,
                "minDefault": DATE_MIN_DEFAULT,
                "maxDefault": DATE_MAX_DEFAULT,
                "formatDefault": DATE_FORMAT_DEFAULT,
                "names": {
                    code: {
                        "months": list(names.months),
                        "monthsShort": list(names.months_short),
                        "weekdays": list(names.weekdays),
                        "weekdaysShort": list(names.weekdays_short),
                        "meridiem": list(names.meridiem),
                        "meridiemLower": list(names.meridiem_lower),
                    }
                    for code, names in DATE_NAMES.items()
                },
            },
            "organization": {
                "types": list(ORGANIZATION_TYPES),
                "industries": list(ORGANIZATION_INDUSTRIES),
                "typeWeights": dict(ORGANIZATION_TYPE_WEIGHTS),
                "bareChance": ORGANIZATION_BARE_CHANCE,
                "genericChance": ORGANIZATION_GENERIC_CHANCE,
                "legalFormChance": ORGANIZATION_LEGAL_FORM_CHANCE,
                "data": {code: organization_of(data) for code, data in ORGANIZATION_DATA.items()},
            },
            # A shape's optional fields are written out, so a lead, an avoid list or a trunk
            # one package leaves unset and another sets shows up as a difference.
            "phone": {
                "countries": list(PHONE_COUNTRIES),
                "types": list(PHONE_TYPES),
                "data": {
                    code: {
                        "callingCode": data.calling_code,
                        "trunk": data.trunk,
                        "national": data.national,
                        "international": data.international,
                        "plans": phone_plans(data.plans),
                        "fiction": None if data.fiction is None else phone_plans(data.fiction),
                    }
                    for code, data in PHONE_DATA.items()
                },
            },
            "gender": {
                "codes": list(GENDER_CODES),
                "weights": dict(GENDER_WEIGHTS),
                "labels": {language: dict(labels) for language, labels in GENDER_LABELS.items()},
            },
            "architecture": {
                "architectures": list(ARCHITECTURES),
                "data": {
                    code: {
                        "family": data.family,
                        "bits": data.bits,
                        "weight": data.weight,
                        "rare": data.rare,
                        "aliases": list(data.aliases),
                    }
                    for code, data in ARCHITECTURE_DATA.items()
                },
            },
            # One entry per screen size, keyed by its platform and the size itself.
            "resolution": {
                "separator": RESOLUTION_SEPARATOR_DEFAULT,
                "sizes": {
                    f"{entry.platform} {entry.width}x{entry.height}": entry.weight
                    for entry in RESOLUTIONS
                },
            },
            "version": {
                "formats": list(VERSION_FORMATS),
                "parts": {name: list(span) for name, span in VERSION_PARTS.items()},
                "prereleases": dict(VERSION_PRERELEASES),
                "prereleaseChance": VERSION_PRERELEASE_CHANCE,
                "calverSchemes": dict(CALVER_SCHEMES),
                "years": {
                    "minDefault": VERSION_YEAR_MIN_DEFAULT,
                    "maxDefault": VERSION_YEAR_MAX_DEFAULT,
                    "floor": VERSION_YEAR_FLOOR,
                    "ceiling": VERSION_YEAR_CEILING,
                },
            },
            # One entry per processor, keyed by its maker and model, the way the devices are.
            "cpu": {
                f"{entry.vendor} {entry.model}": {"platform": entry.platform, "year": entry.year}
                for entry in CPUS
            },
            # One entry per graphics processor, keyed the same way.
            "gpu": {
                f"{entry.vendor} {entry.model}": {"platform": entry.platform, "year": entry.year}
                for entry in GPUS
            },
            # One entry per device, keyed by its maker and model, so a device one package
            # holds and another does not is reported as itself.
            "device": {
                "types": list(DEVICE_TYPES),
                "devices": {
                    f"{entry.vendor} {entry.model}": {
                        "type": entry.type,
                        "year": entry.year,
                    }
                    for entry in DEVICES
                },
            },
            "disk": {
                "types": list(DISK_TYPES),
                "labels": {
                    code: {"label": label, "name": name}
                    for code, (label, name) in DISK_TYPE_LABELS.items()
                },
                "weights": {platform: dict(row) for platform, row in DISK_TYPE_WEIGHTS.items()},
                "scale": {
                    "units": list(DISK_SCALE.units),
                    "step": DISK_SCALE.step,
                    "base": DISK_SCALE.base,
                    "reference": DISK_SCALE.reference,
                    "bytes": DISK_SCALE.bytes,
                    "pool": [[size, weight] for size, weight in DISK_SCALE.pool],
                },
            },
            # The scale and the pool as written: every size with its weight, in the unit the
            # pool is kept in.
            "ram": {
                "units": list(RAM_SCALE.units),
                "step": RAM_SCALE.step,
                "base": RAM_SCALE.base,
                "reference": RAM_SCALE.reference,
                "bytes": RAM_SCALE.bytes,
                "pool": [[size, weight] for size, weight in RAM_SCALE.pool],
            },
            # One entry per release, keyed by its line and version, so a release one package
            # holds and another does not is reported as itself. A build is `year text`, the
            # way the table groups them.
            "os": {
                "families": {
                    family: {"platform": data.platform, "weight": data.weight}
                    for family, data in OS_FAMILIES.items()
                },
                "releases": {
                    f"{release.family} {release.version}": {
                        "year": release.year,
                        "template": release.template,
                        "name": release.name,
                        "editions": list(release.editions),
                        "builds": [f"{build.year} {build.text}" for build in release.builds],
                    }
                    for release in OS_RELEASES
                },
            },
            # The outline is compared as each package parses it rather than as the text it
            # is written in, so a parser that reads `_` or a skipped level differently
            # shows up here even though the three strings are the same generated text.
            "location": {
                "languages": list(LOCATION_LANGUAGES),
                "levels": list(LOCATION_LEVELS),
                # One row per country, `[code, name, name, …]`, split the way the package
                # splits it.
                "countries": {
                    "languages": list(COUNTRIES.languages),
                    "rows": [
                        line.strip().split("|")
                        for line in COUNTRIES.table.split("\n")
                        if line.strip()
                    ],
                },
                "data": location,
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
