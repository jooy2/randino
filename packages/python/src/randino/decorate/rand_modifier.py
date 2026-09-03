"""Put a random modifier in front of a string, or of every string in a list."""

from typing import overload

from randino._internal.generate import draw_language, resolve_style
from randino._internal.script import detect_language
from randino._types import WordLanguageOption
from randino.word._generator import draw_word, modifiers_of, pool_bounds
from randino.word.data import WORD_DATA, WORD_LANGUAGES


def _draw(value: str | None, language: WordLanguageOption | None, style: int) -> tuple[str, str]:
    """One modifier, and the separator its language joins words with."""
    # The language of the word being decorated, so that `"고양이"` is not handed an
    # English modifier. Only consulted when the caller left `language` out.
    requested = language or (detect_language(value) if value is not None else "all")
    code = draw_language(requested, WORD_LANGUAGES)
    data = WORD_DATA[code]
    pool = modifiers_of(data)
    low, high = pool_bounds(pool)
    word, _missed = draw_word(data, pool, resolve_style(style), low, high, "")

    return word, data.joiner


@overload
def rand_modifier(
    value: None = ...,
    *,
    language: WordLanguageOption | None = ...,
    style: int = ...,
    separator: str | None = ...,
) -> str: ...


@overload
def rand_modifier(
    value: str,
    *,
    language: WordLanguageOption | None = ...,
    style: int = ...,
    separator: str | None = ...,
) -> str: ...


@overload
def rand_modifier(
    value: list[str],
    *,
    language: WordLanguageOption | None = ...,
    style: int = ...,
    separator: str | None = ...,
) -> list[str]: ...


def rand_modifier(
    value: str | list[str] | None = None,
    *,
    language: WordLanguageOption | None = None,
    style: int = 0,
    separator: str | None = None,
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
        style: `0` draws a modifier the language actually uses, `100` invents one
            that only reads like it.
        separator: Placed between the modifier and the value. Defaults to the way
            the language itself joins words, which is to run them together.

    Returns:
        A string when `value` is a string or omitted, a list when it is a list.

    Example:
        >>> rand_modifier(language="ko")
        '멋진'
        >>> rand_modifier("사자")
        '멋진사자'
        >>> rand_modifier("Owl", separator=" ")
        'Misty Owl'
        >>> rand_modifier(rand_animal(language="ko", count=2))
        ['오래된곰', '영원한도마뱀']
    """
    if value is None:
        return _draw(None, language, style)[0]

    def one(item: str) -> str:
        word, joiner = _draw(item, language, style)

        return word + (joiner if separator is None else separator) + item

    if isinstance(value, str):
        return one(value)

    return [one(item) for item in value]
