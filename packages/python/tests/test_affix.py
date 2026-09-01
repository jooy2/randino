"""`rand_suffix` and `rand_prefix` — the random token, attached to anything."""

import re

from randino import (
    AFFIX_CHARSET,
    AFFIX_LENGTH_MAX,
    rand_name,
    rand_nickname,
    rand_prefix,
    rand_suffix,
)

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
