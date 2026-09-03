"""The decorators: what you attach to a string you already have."""

import re

from randino import (
    AFFIX_CHARSET,
    AFFIX_LENGTH_MAX,
    WORD_LANGUAGES,
    WordLanguage,
    rand_animal,
    rand_modifier,
    rand_name,
    rand_nickname,
    rand_prefix,
    rand_suffix,
    rand_word,
)

# The decorating pools are internal, but what `rand_modifier` attaches has to come out
# of them, and they are the same pools the nickname generator uses.
from randino.word._generator import modifiers_of
from randino.word.data import WORD_DATA

SAMPLE = 60
"""Large enough that a broken option cannot pass by luck."""

TOKEN = re.compile(r"[0-9A-Za-z]{5}")
"""The default token: five characters, alphanumeric."""


def test_rand_suffix_appends_the_token_and_rand_prefix_puts_it_in_front() -> None:
    for word in rand_nickname(language="en", count=SAMPLE):
        suffixed = rand_suffix(word)
        prefixed = rand_prefix(word)

        assert suffixed.startswith(f"{word}_"), suffixed
        assert prefixed.endswith(f"_{word}"), prefixed
        assert len(suffixed) == len(word) + 6
        assert len(prefixed) == len(word) + 6

        token = suffixed[len(word) + 1 :]

        assert TOKEN.fullmatch(token), suffixed

        # Not merely alphanumeric: the pairs that are easy to misread are out.
        for character in token:
            assert character in AFFIX_CHARSET, f"{character} in {suffixed}"


def test_a_string_in_gives_a_string_and_a_list_in_gives_a_list() -> None:
    words = rand_nickname(language="ko", count=SAMPLE)
    suffixed = rand_suffix(words)
    prefixed = rand_prefix(words)

    assert len(suffixed) == len(words)
    assert len(prefixed) == len(words)

    for word, tagged, led in zip(words, suffixed, prefixed, strict=True):
        assert tagged.startswith(f"{word}_"), tagged
        assert led.endswith(f"_{word}"), led

    assert rand_suffix([]) == []
    assert isinstance(rand_suffix(""), str)


def test_every_value_gets_its_own_token_rather_than_the_batch_sharing_one() -> None:
    # Twelve characters, so that a collision is not what this is measuring.
    tokens = rand_suffix(["x"] * 2000, length=12)

    assert len(set(tokens)) == 2000


def test_length_separator_and_charset_are_all_configurable() -> None:
    for _ in range(SAMPLE):
        assert re.fullmatch(r"Owl-[0-9A-Za-z]{8}", rand_suffix("Owl", length=8, separator="-"))
        assert re.fullmatch(r"[0-9A-Za-z]{8}-Owl", rand_prefix("Owl", length=8, separator="-"))
        assert re.fullmatch(r"사자_[0-9]{4}", rand_suffix("사자", length=4, charset="0123456789"))
        # An empty separator is a choice, not a missing value.
        assert re.fullmatch(r"Owl[0-9A-Za-z]", rand_suffix("Owl", separator="", length=1))


def test_length_is_clamped_to_at_least_one_character_and_at_most_the_maximum() -> None:
    assert len(rand_suffix("a", length=0, separator="")) == 2
    assert len(rand_suffix("a", length=-5, separator="")) == 2
    assert len(rand_suffix("a", length=999, separator="")) == 1 + AFFIX_LENGTH_MAX


def test_it_attaches_to_anything_which_is_why_it_is_not_a_nickname_option() -> None:
    names = rand_name(language="ko", count=SAMPLE)

    for name, tagged in zip(names, rand_suffix(names), strict=True):
        assert tagged.startswith(f"{name}_"), tagged

    assert re.fullmatch(
        r"[0-9A-Za-z]{4}-order-4021", rand_prefix("order-4021", length=4, separator="-")
    )


def test_with_no_value_at_all_the_token_is_the_whole_answer() -> None:
    # What a decorator attaches is worth having on its own, so the value is optional
    # on all three of them.
    for _ in range(SAMPLE):
        assert re.fullmatch(TOKEN, rand_suffix())
        assert re.fullmatch(TOKEN, rand_prefix())
        assert re.fullmatch(r"[0-9A-Za-z]{8}", rand_suffix(length=8))
        assert re.fullmatch(r"[0-9]{4}", rand_prefix(length=4, charset="0123456789"))
        # No value means no separator either — there is nothing to separate.
        assert "-" not in rand_suffix(separator="-")

    # An empty string is a value, and a missing one is not.
    assert len(rand_suffix("")) == 6


def test_rand_modifier_puts_a_real_modifier_in_front_of_the_value() -> None:
    for language in WORD_LANGUAGES:
        modifiers = set(modifiers_of(WORD_DATA[language]))

        for word in rand_word(language=language, count=SAMPLE):
            decorated = rand_modifier(word, language=language)

            assert decorated.endswith(word), decorated
            assert decorated[: len(decorated) - len(word)] in modifiers, (
                f"{decorated} does not start with a {language} modifier"
            )


def test_rand_modifier_on_its_own_is_the_modifier() -> None:
    for language in WORD_LANGUAGES:
        modifiers = set(modifiers_of(WORD_DATA[language]))

        for _ in range(SAMPLE):
            assert rand_modifier(language=language) in modifiers, language

    # Every language shows up when none is asked for.
    used: set[WordLanguage] = set()

    for _ in range(400):
        word = rand_modifier()

        for language in WORD_LANGUAGES:
            if word in modifiers_of(WORD_DATA[language]):
                used.add(language)

    assert used == set(WORD_LANGUAGES)


def test_rand_modifier_follows_the_script_of_the_value_when_no_language_is_given() -> None:
    def belongs(word: str, language: WordLanguage) -> bool:
        return any(word.startswith(modifier) for modifier in modifiers_of(WORD_DATA[language]))

    scripts: list[tuple[str, WordLanguage]] = [
        ("고양이", "ko"),
        ("ネコ", "ja"),
        ("熊猫", "zh"),
        ("Cat", "en"),
    ]

    for word, language in scripts:
        for _ in range(20):
            decorated = rand_modifier(word)

            assert belongs(decorated, language), decorated

    # An explicit language wins over the guess.
    for _ in range(20):
        assert belongs(rand_modifier("고양이", language="en"), "en")


def test_rand_modifier_takes_a_separator_a_style_and_a_list() -> None:
    for _ in range(SAMPLE):
        assert re.fullmatch(r"[A-Za-z]+ Owl", rand_modifier("Owl", language="en", separator=" "))
        assert re.fullmatch(r"[가-힣]+-사자", rand_modifier("사자", language="ko", separator="-"))

    # An invented modifier is still in the language's script.
    pool = set(modifiers_of(WORD_DATA["ko"]))
    drawn = 0

    for _ in range(200):
        word = rand_modifier(language="ko", style=100)

        assert re.fullmatch(r"[가-힣]+", word), word

        if word in pool:
            drawn += 1

    assert drawn < 20, f"{drawn} of 200 still came from the pool"

    # A list gets a fresh modifier each, not one for the batch.
    words = rand_animal(language="ko", count=SAMPLE)
    decorated = rand_modifier(words)

    assert len(decorated) == len(words)

    for word, one in zip(words, decorated, strict=True):
        assert one.endswith(word), one

    assert rand_modifier([]) == []
