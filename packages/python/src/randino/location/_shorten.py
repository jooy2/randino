"""The short name a division goes by, which `short` writes in place of the published one."""

from randino._types import LocationLanguage
from randino.location.data._types import OutlineLevel
from randino.location.data.short import LOCATION_SHORT, ShortRule


def short_name(language: LocationLanguage, level: OutlineLevel, name: str) -> str:
    """A division's name the way `short` writes it.

    `서울특별시` is `서울`, `충청북도` `충북`, and `수원시 장안구`, a city's district written
    with its city, is `수원 장안`. A language with no rule writes the name as it is.
    """
    rule = LOCATION_SHORT[language]

    if rule is None:
        return name

    return " ".join(_short_word(rule, level, word) for word in name.split(" "))


def _short_word(rule: ShortRule, level: OutlineLevel, word: str) -> str:
    """One word of a name, its kind left off when enough of it is left."""
    kind = next((ending for ending in rule.kinds[level] if word.endswith(ending)), None)

    if kind is None or len(word) - len(kind) < rule.stem:
        return word

    stem = word[: -len(kind)]

    if level == "region" and len(stem) == 3 and stem[2] in rule.halves:
        return stem[0] + stem[2]

    return stem
