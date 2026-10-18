"""Names for the characters of a story or a game, written in every language by their sound."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import (
    FictionalLanguageOption,
    FictionalNameDetail,
    NameGenderOption,
    RandRealism,
    WordLanguage,
    WordLanguageOption,
)
from randino.fictional._name_generator import generate_fictional_name_details
from randino.fictional._options import is_listed


@overload
def rand_fictional_name(
    *,
    language: WordLanguageOption = ...,
    gender: NameGenderOption = ...,
    include_surname: bool = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_fictional_name(
    *,
    language: list[WordLanguage] | tuple[WordLanguage, ...],
    gender: NameGenderOption = ...,
    include_surname: bool = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[dict[WordLanguage, str]]: ...


@overload
def rand_fictional_name(
    *,
    language: FictionalLanguageOption = ...,
    gender: NameGenderOption = ...,
    include_surname: bool = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[FictionalNameDetail]: ...


@overload
def rand_fictional_name(
    *,
    language: FictionalLanguageOption = ...,
    gender: NameGenderOption = ...,
    include_surname: bool = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str] | list[dict[WordLanguage, str]]: ...


def rand_fictional_name(
    *,
    language: FictionalLanguageOption = "all",
    gender: NameGenderOption = "all",
    include_surname: bool = False,
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[dict[WordLanguage, str]] | list[FictionalNameDetail]:
    """Generate names for the characters of a story or a game.

    The names a novel, a game or a tabletop campaign gives its cast, rather than the names
    of real people in one country. A name is spelled in Latin letters first, English and
    British names among them, and written by its sound in every other language: `Artemis`
    is `아르테미스` in Korean and `アルテミス` in Japanese. `"all"`, the default, draws a
    language per name.

    A list of languages writes every name in all of them at once, for a game or a book that
    shows the same character to every reader in the reader's own language: each result is
    a dict of the name in each language, keyed by its code in the order of the list. The
    first language of the list is the one `starts_with` and the length range read.

    Args:
        language: Language of the names, `"all"` to draw one per name, or a list (or a
            tuple) to write every name in each language of it.
        gender: Gender the given name is drawn from. `"all"` picks one per name.
        include_surname: Follow the given name with a family name (`Elara Blackwood`). Off
            by default: a character in a story or a game is usually known by one name.
        count: How many names to return. Held inside `0`..`RAND_COUNT_MAX`.
        realism: Whether a part is one the pools hold or one invented out of syllables and
            halves. `"mixed"` decides per part.
        min_length: Minimum length of the whole name, in characters, in the language it is
            drawn in: the first of a list.
        max_length: Maximum length of the whole name. A range nothing fits is answered
            with the closest there is.
        starts_with: Keep only names that start with this character, in the language each
            is drawn in: the first of a list, which returns nothing when that language does
            not write the character. A hiragana character is read as the katakana every
            Japanese name is spelled in.
        unique: Never return the same name twice, in any language.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does.
        output: `"value"` for strings, or a dict each for a list of languages; `"detail"`
            for a `FictionalNameDetail` each — the name in its language, its gender, and
            the same name in every language asked for under `forms`.

    Returns:
        A `list[str]` for one language or `"all"`, a `list[dict[WordLanguage, str]]` for a
        list of them, or a `list[FictionalNameDetail]` when `output="detail"` — the
        overloads carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_fictional_name(language="en", count=3)
        ['Alice', 'Arsis', 'Emily']
        >>> rand_fictional_name(language="ko", gender="female", count=3)
        ['앨리스', '트리아', '베리']
        >>> rand_fictional_name(language="ja", include_surname=True)
        ['アスター・シンクレア']
        >>> rand_fictional_name(language=["ko", "en", "ja"], count=2)
        [{'ko': '아르테미스', 'en': 'Artemis', 'ja': 'アルテミス'}, {'ko': '앨리스', 'en': 'Alice', 'ja': 'アリス'}]
        >>> rand_fictional_name(language=["en", "ko"], output="detail")
        [FictionalNameDetail(name='Artemis', gender='female', language='en', forms={'en': 'Artemis', 'ko': '아르테미스'})]
    """
    details = generate_fictional_name_details(
        language=language,
        gender=gender,
        include_surname=include_surname,
        count=count,
        realism=realism,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    if is_listed(language):
        return [detail.forms for detail in details]

    return [detail.name for detail in details]
