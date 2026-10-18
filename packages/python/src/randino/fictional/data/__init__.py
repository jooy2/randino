"""The fictional datasets, and how often a fictional place or name takes each shape.

The tables are generated from the JavaScript package by `tools/emit`; the chances below
are written by hand in every package and compared by `tools/parity`.
"""

from randino._types import LocationLevel
from randino.fictional.data.avoid import FICTIONAL_AVOID, FICTIONAL_AVOID_INSIDE
from randino.fictional.data.compounds import FICTIONAL_COMPOUNDS
from randino.fictional.data.kinds import FICTIONAL_KINDS
from randino.fictional.data.names import FICTIONAL_GIVEN_NAMES, FICTIONAL_SURNAMES
from randino.fictional.data.places import FICTIONAL_PLACES
from randino.fictional.data.syllables import FICTIONAL_PLACE_ENDINGS, FICTIONAL_SYLLABLES

__all__ = [
    "FICTIONAL_AVOID",
    "FICTIONAL_AVOID_INSIDE",
    "FICTIONAL_COMPOUNDS",
    "FICTIONAL_GIVEN_NAMES",
    "FICTIONAL_KINDS",
    "FICTIONAL_KIND_CHANCE",
    "FICTIONAL_MIDDLE_CHANCE",
    "FICTIONAL_PLACES",
    "FICTIONAL_PLACE_ENDINGS",
    "FICTIONAL_SURNAMES",
    "FICTIONAL_SYLLABLES",
    "FICTIONAL_SYLLABLE_CHANCE",
]

FICTIONAL_KIND_CHANCE: dict[LocationLevel, int] = {
    "country": 50,
    "region": 50,
    "city": 40,
    "district": 70,
}
"""How often a place carries its kind when the caller left `include_kind` out, per level.

A percentage. A district is nearly always named with one (`Evelyn Bay`), and a country is
as often its name alone (`Glacia`) as a kingdom.
"""

FICTIONAL_MIDDLE_CHANCE = 40
"""How often an invented name or place takes a `middle` syllable, as a percentage."""

FICTIONAL_SYLLABLE_CHANCE: dict[LocationLevel, int] = {
    "country": 100,
    "region": 50,
    "city": 0,
    "district": 40,
}
"""How often an invented place is built from syllables, per level, as a percentage.

The rest are built from two English halves: `Silvaria` against `Ravenford`. A country is a
sweeping Latin name and a city an English town's; a district built from syllables is named
like a person (`Kalira Park`).
"""
