"""The per-language location datasets: the divisions every location is drawn from."""

from randino._internal.generate import resolve_option
from randino._types import LocationLanguage, LocationLanguageOption, LocationLevel
from randino.location.data._types import LocationLanguageData
from randino.location.data.en import EN
from randino.location.data.ko import KO

LOCATION_LANGUAGES: tuple[LocationLanguage, ...] = ("en", "ko")
"""Languages the location generators cover, and so the countries.

A language writes the places of its own. Only countries that publish their divisions
free of conditions are here — no attribution to carry, no licence to pass on — which is
why this is two languages where the word pools are nine. See CLAUDE.md before adding one.
"""

LOCATION_LEVELS: tuple[LocationLevel, ...] = ("country", "region", "city", "district")
"""How far down a location can go, largest first."""

LOCATION_DATA: dict[LocationLanguage, LocationLanguageData] = {
    "en": EN,
    "ko": KO,
}
"""Each language's country and divisions, keyed by its code."""


_LOCATION_LANGUAGE_OPTIONS: tuple[LocationLanguageOption, ...] = (*LOCATION_LANGUAGES, "all")
"""Every value `language` accepts.

The type rules any other out and an unchecked caller can still pass one; answering with
`LOCATION_DATA["xx"]` names the value and not the option.
"""


def resolve_location_language(language: object) -> LocationLanguageOption:
    """The caller's `language`, or `"all"` for one the location generators do not know."""
    return resolve_option(language, _LOCATION_LANGUAGE_OPTIONS, "all")


def resolve_level(level: object) -> LocationLevel:
    """The caller's `level`, or `"district"` — as far down as any location goes — for an unknown one."""
    return resolve_option(level, LOCATION_LEVELS, "district")
