"""Put a random modifier in front of a string, or of every string in a list."""

from collections.abc import Callable
from typing import Literal, overload

from randino._internal.generate import draw_language, resolve_realism
from randino._internal.script import detect_language
from randino._internal.utils import capitalize_first, with_random
from randino._types import ModifierKind, RandRealism, WordLanguage, WordLanguageOption
from randino.word._generator import (
    agree,
    draw_word,
    gender_of,
    modifier_follows,
    modifiers_of,
    pool_bounds,
)
from randino.word.data import WORD_DATA, WORD_LANGUAGES

# The Latin-script languages that carry a gender per noun, and so can answer whether a
# word is theirs in one lookup.
_INFLECTING: tuple[WordLanguage, ...] = ("es", "it", "de")


def _language_of(value: str) -> WordLanguage:
    """The language a value is written in, for a caller who named none.

    The script answers it wherever the script says which: Hangul is Korean, kana
    Japanese, han Chinese, Cyrillic Russian, and Latin with Vietnamese marks on it
    Vietnamese. What is left is the Latin alphabet, which English, Spanish, Italian and
    German share — so the three of those that carry a gender per noun are asked whether
    the word is one of theirs, which is one lookup each. English is what nobody claims.

    A word none of them holds and no script places is English, which is the most a
    single word can be asked to say: `gato` is Spanish because Spanish has it, and an
    invented Latin word is nobody's.
    """
    by_script = detect_language(value)

    if by_script != "en":
        return by_script

    for code in _INFLECTING:
        nouns = WORD_DATA[code].noun_gender

        if nouns and (value in nouns or capitalize_first(value) in nouns):
            return code

    return "en"


def _draw(
    value: str | None,
    language: WordLanguageOption | None,
    realism: RandRealism,
    kind: ModifierKind | Literal["all"],
) -> tuple[str, str, bool]:
    """One modifier, the separator its language joins with, and which side it goes."""
    # The language of the word being decorated, so that `"고양이"` is not handed an
    # English modifier. Only consulted when the caller left `language` out.
    requested = language or (_language_of(value) if value else "all")
    code = draw_language(requested, WORD_LANGUAGES)
    data = WORD_DATA[code]
    pool = modifiers_of(data, kind)
    low, high = pool_bounds(pool)
    word, _missed = draw_word(data, pool, resolve_realism(realism), low, high, "")
    # A value the language knows is a noun whose gender it can look up, so the
    # modifier lands in the form that goes beside it. A value from anywhere else is
    # read by its ending, the way the language itself reads an unfamiliar word, and
    # a language that does not inflect has nothing to look up either way.
    gender = None if value is None else gender_of(data, value)

    return agree(data, word, gender), data.joiner, modifier_follows(data)


@overload
def rand_modifier(
    value: None = ...,
    *,
    language: WordLanguageOption | None = ...,
    realism: RandRealism = ...,
    kind: ModifierKind | Literal["all"] = ...,
    separator: str | None = ...,
    random: Callable[[], float] | None = ...,
) -> str: ...


@overload
def rand_modifier(
    value: str,
    *,
    language: WordLanguageOption | None = ...,
    realism: RandRealism = ...,
    kind: ModifierKind | Literal["all"] = ...,
    separator: str | None = ...,
    random: Callable[[], float] | None = ...,
) -> str: ...


@overload
def rand_modifier(
    value: list[str],
    *,
    language: WordLanguageOption | None = ...,
    realism: RandRealism = ...,
    kind: ModifierKind | Literal["all"] = ...,
    separator: str | None = ...,
    random: Callable[[], float] | None = ...,
) -> list[str]: ...


def rand_modifier(
    value: str | list[str] | None = None,
    *,
    language: WordLanguageOption | None = None,
    realism: RandRealism = "real",
    kind: ModifierKind | Literal["all"] = "all",
    separator: str | None = None,
    random: Callable[[], float] | None = None,
) -> str | list[str]:
    """Put a random modifier in front of a string: `"사자"` becomes `"멋진사자"`.

    This is what `rand_nickname`'s `include_modifier` used to be, and it stopped
    being a nickname argument for the same reason `rand_suffix` did — decorating a
    string was never a thing about nicknames. Give it a word from `rand_word`, a
    word of your own, or anything else you have. A list gets a fresh modifier per
    entry rather than one for the batch.

    Args:
        value: The string, or the list of strings, to decorate. Omitted, the
            modifier is the whole answer and `separator` is not used.
        language: Language the modifier is drawn from. Left out, the script of the
            value picks it, so `"고양이"` is never handed an English modifier; with
            no value at all, or with `"all"`, every language is in play.
        realism: whether the modifier is one the language actually uses, or one
            invented to read like it.
        kind: whether the modifier says what the value is like (`멋진`, `Misty`) or
            what it is doing (`웃는`, `Laughing`). `"all"` draws from both.
        separator: Placed between the modifier and the value. Defaults to the way
            the language itself joins words, which is to run them together.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.

    Returns:
        A string when `value` is a string or omitted, a list when it is a list.

    Example:
        >>> rand_modifier(language="ko")
        '멋진'
        >>> rand_modifier("사자")
        '멋진사자'
        >>> rand_modifier("Owl", separator=" ")
        'Misty Owl'
        >>> rand_modifier(language="ko", kind="action")
        '웃는'
        >>> rand_modifier(rand_animal(language="ko", count=2))
        ['오래된곰', '영원한도마뱀']
    """

    def one(item: str) -> str:
        word, joiner, follows = _draw(item, language, realism, kind)
        gap = joiner if separator is None else separator

        # Vietnamese puts the modifier after the noun, and says so in its frames.
        return item + gap + word if follows else word + gap + item

    with with_random(random):
        if value is None:
            return _draw(None, language, realism, kind)[0]

        if isinstance(value, str):
            return one(value)

        return [one(item) for item in value]
