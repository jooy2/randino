"""Internal shape of the per-language location datasets.

Not part of the public API — callers only ever see the keyword arguments and
`LocationDetail`.

Unlike every other dataset in the package, these are not written by hand: `tools/location`
writes them out of the file the country publishes, into all three packages at once.
"""

from dataclasses import dataclass
from typing import Literal

from randino._types import WordLanguage

OutlineLevel = Literal["region", "city", "district"]
"""A level an outline holds: every one but the country, which the dataset names itself."""


@dataclass(frozen=True, slots=True)
class LocationLanguageData:
    """One language's country, how it writes a location, and the divisions themselves."""

    country: str
    """The country, the way the language writes its own."""

    order: Literal["largest-first", "smallest-first"]
    """Which end a location is written from.

    Korean writes the country first (`대한민국 서울특별시 종로구`), English writes it last
    (`Pasadena, California, United States`).
    """

    joiner: str
    """What goes between two levels when a location is written out."""

    levels: tuple[OutlineLevel, ...]
    """The levels the outline holds, largest first."""

    outline: str
    """The divisions themselves, as `outline` in `_internal/parse` reads them."""


@dataclass(frozen=True, slots=True)
class CountryTable:
    """Every country, named in every word language.

    One line per ISO 3166-1 code, `code|name|name|…`, with the names in the order
    `languages` lists them.
    """

    languages: tuple[WordLanguage, ...]
    """The word languages, in the order the names follow the code on every line."""

    table: str
    """The countries themselves, one line each."""
