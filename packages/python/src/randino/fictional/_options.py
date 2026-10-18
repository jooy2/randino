"""What the fictional generators share about their options.

The languages a call writes in, and the prefix as each script spells it.
"""

from collections.abc import Callable, Sequence
from dataclasses import dataclass

from randino._internal.generate import (
    languages_fitting,
    languages_writing,
    length_bounds,
    resolve_length,
    resolve_many,
    resolve_prefix,
)
from randino._internal.script import kana_like
from randino._types import WordLanguage
from randino.constants import RAND_LENGTH_MAX
from randino.fictional._spelling import KANA, SCRIPT_OF
from randino.word.data import WORD_LANGUAGES


def resolve_fictional_languages(option: object) -> tuple[WordLanguage, ...]:
    """The languages a call asked for, in the order it asked for them.

    Every word language for `"all"`, for nothing, and for a sequence that names none of
    them. A language named twice is written once.

    Args:
        option: The caller's `language`.

    Returns:
        The languages, each once.
    """
    return tuple(dict.fromkeys(resolve_many(option, WORD_LANGUAGES, WORD_LANGUAGES)))


def is_listed(option: object) -> bool:
    """Whether `language` is a list of languages rather than one, or `"all"`.

    A list or a tuple is, and so is any other sequence but a string: it asks for every
    result in every language of it at once.
    """
    return isinstance(option, Sequence) and not isinstance(option, str)


def prefix_in(prefix: str, script: int) -> str:
    """`starts_with` as a script spells it.

    Japanese writes a made-up name in katakana, so a hiragana `あ` is read as the `ア`
    every name is spelled with.
    """
    return kana_like(prefix, "ア") if script == KANA else prefix


@dataclass(frozen=True, slots=True)
class FictionalBase:
    """What every fictional generator works out from the options before it draws."""

    languages: tuple[WordLanguage, ...]
    """The languages a result may be drawn in. Empty when none can answer."""

    forms: tuple[WordLanguage, ...]
    """The languages every result is written in, for the detail's `forms` and a list's dicts."""

    prefix: str
    """The first character asked for, or `""`."""

    bounds: tuple[int, int] | None
    """The length range a result has to land in, or None for none."""


def resolve_base(
    *,
    language: object,
    starts_with: str,
    min_length: int | None,
    max_length: int | None,
    range_of: Callable[[WordLanguage], tuple[int, int]],
) -> FictionalBase:
    """The languages, the prefix and the length range of a call.

    One language, or `"all"`, is the language each result is drawn in, and a language
    that does not write the requested character is left out, and so is one whose own range
    cannot meet the one asked for while another's can.

    A list asks for every result in every language of it, so each result is drawn in the
    first and written in the rest: the first is the one `starts_with` and the length range
    read, the way a game's own language is the one its fields are sized for.

    Args:
        language: The caller's `language`.
        starts_with: The caller's `starts_with`.
        min_length: The caller's `min_length`.
        max_length: The caller's `max_length`.
        range_of: A language's own range of lengths for this call.

    Returns:
        What the call draws with.
    """
    forms = resolve_fictional_languages(language)
    prefix = resolve_prefix(starts_with)
    low = resolve_length(min_length)
    high = resolve_length(max_length)
    listed = is_listed(language)
    writing = languages_writing("all", forms[:1] if listed else forms, prefix)

    return FictionalBase(
        languages=writing if listed else languages_fitting(writing, low, high, range_of),
        forms=forms,
        prefix=prefix,
        bounds=None
        if low is None and high is None
        else length_bounds(low, high, 1, RAND_LENGTH_MAX),
    )


def script_of(language: WordLanguage) -> int:
    """The script a language writes a fictional name in."""
    return SCRIPT_OF[language]
