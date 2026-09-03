"""Nicknames.

Nicknames are checked against the datasets themselves: `rand_nickname(output="detail")`
reports the words it used, so every word can be asserted to come from the language's
pools, and the English pools are asserted to share nothing with the English
person-name pools.
"""

import re
from collections.abc import Sequence
from typing import get_args

from randino import (
    RAND_COUNT_MAX,
    WORD_LANGUAGES,
    WORD_THEMES,
    RandRealism,
    WordLanguage,
    WordTheme,
    nickname_length_range,
    rand_nickname,
)

# The datasets are internal, but a nickname is only as good as the words it is built
# from — these checks are what keep person names out of them.
from randino.name.data import NAME_DATA
from randino.word._generator import modifiers_of
from randino.word.data import WORD_DATA
from tests.test_name import pool_natives

SAMPLE = 60

SCRIPT: dict[WordLanguage, re.Pattern[str]] = {
    "en": re.compile(r"[A-Za-z]+"),
    "ko": re.compile(r"[가-힣]+"),
    "ja": re.compile(r"[々぀-ヿ一-鿿]+"),
    "zh": re.compile(r"[々一-鿿]+"),
}


def all_words(language: WordLanguage) -> list[str]:
    """Every word the language can put in a nickname."""
    data = WORD_DATA[language]

    return [
        *data.adjectives,
        *data.actions,
        *(data.parts or ()),
        *(word for theme in WORD_THEMES for word in data.nouns[theme]),
    ]


def glues_of(language: WordLanguage) -> list[str]:
    """Every particle the language's frames can put between two words, longest first."""
    seen = {""}

    for frame in WORD_DATA[language].frames:
        seen.update(frame.glue)

    return sorted(seen, key=len, reverse=True)


def joined_by(nickname: str, words: Sequence[str], glues: Sequence[str], separator: str) -> bool:
    """True when the nickname is exactly its words in order, with only allowed particles between.

    Backtracks, because a particle and the first character of the next word can be the
    same one (`의` in front of `의자`).
    """
    if not words:
        return nickname == ""

    if not nickname.startswith(words[0]):
        return False

    rest = nickname[len(words[0]) :]

    if len(words) == 1:
        return rest == ""

    return any(
        rest.startswith(glue + separator)
        and joined_by(rest[len(glue) + len(separator) :], words[1:], glues, separator)
        for glue in glues
    )


def nouns_of(language: WordLanguage, theme: WordTheme | None = None) -> list[str]:
    """Every noun of one theme, or of all of them."""
    nouns = WORD_DATA[language].nouns

    if theme is not None:
        return list(nouns[theme])

    return [word for each in WORD_THEMES for word in nouns[each]]


def test_rand_nickname_returns_one_nickname_by_default() -> None:
    nicknames = rand_nickname()

    assert len(nicknames) == 1
    assert isinstance(nicknames[0], str)
    assert nicknames[0]


def test_rand_nickname_returns_exactly_count_nicknames() -> None:
    assert len(rand_nickname(count=25)) == 25
    assert len(rand_nickname(count=0)) == 0
    assert len(rand_nickname(count=-10)) == 0
    assert len(rand_nickname(count=2.7)) == 2  # type: ignore[call-overload]
    assert len(rand_nickname(count=RAND_COUNT_MAX + 500)) == RAND_COUNT_MAX


def test_every_language_writes_nicknames_in_its_own_script() -> None:
    for language in WORD_LANGUAGES:
        for nickname in rand_nickname(language=language, count=SAMPLE):
            assert SCRIPT[language].fullmatch(nickname), f"{language}: {nickname}"

        for nickname in rand_nickname(language=language, count=SAMPLE, realism="invented"):
            assert SCRIPT[language].fullmatch(nickname), f"{language} invented: {nickname}"


def test_the_mixed_language_uses_every_language_it_knows() -> None:
    used = set()

    for detail in rand_nickname(output="detail", count=400):
        assert SCRIPT[detail.language].fullmatch(detail.nickname), detail.nickname
        used.add(detail.language)

    assert used == set(WORD_LANGUAGES)


def test_nicknames_are_built_from_real_words_and_never_from_names() -> None:
    for language in WORD_LANGUAGES:
        pool = set(all_words(language))

        for detail in rand_nickname(output="detail", language=language, count=200):
            assert detail.words, detail.nickname

            for word in detail.words:
                assert word in pool, f"{language}: {word} is not in the word pools"

    # English person names are distinct words from English common nouns, so the two
    # sets must not meet — this is what stops an `Emma` or a `Bennett` from being
    # added to a nickname pool by accident. Korean and Japanese cannot be held to
    # that: 하늘, 별 and 森 are everyday nouns that also happen to be names, and
    # `아름다운하늘` is still nobody's name.
    en = NAME_DATA["en"]
    names = set(pool_natives(en.male or ()) + pool_natives(en.female or ()) + pool_natives(en.last))

    for word in all_words("en"):
        assert word not in names, f"{word} is a person name, not a nickname word"


def test_every_nickname_is_a_word_with_something_added_to_it() -> None:
    details = rand_nickname(output="detail", language="ko", count=200)
    modifiers = set(modifiers_of(WORD_DATA["ko"]))
    decorated = [
        detail for detail in details if len(detail.words) > 1 or detail.words[0] in modifiers
    ]

    # A bare word is allowed, but a decorated one is the point.
    assert len(decorated) > len(details) * 0.5, (
        f"only {len(decorated)} of {len(details)} were decorated"
    )
    assert any(detail.words[0] in modifiers for detail in details)
    assert any(len(detail.words) == 3 for detail in details)


def test_theme_decides_what_the_nickname_is_about() -> None:
    for theme in WORD_THEMES:
        for language in WORD_LANGUAGES:
            nouns = nouns_of(language, theme)

            for detail in rand_nickname(output="detail", language=language, theme=theme, count=40):
                assert detail.theme == theme, detail.nickname
                assert any(word in nouns for word in detail.words), (
                    f"{detail.nickname} has no {theme} word"
                )

    themes = {detail.theme for detail in rand_nickname(output="detail", count=400)}
    assert themes == set(WORD_THEMES)


def test_a_word_belongs_to_exactly_one_theme() -> None:
    # Two themes claiming one word make `theme` ambiguous, and make
    # `rand_nickname(output="detail")` report a theme the caller never asked about.
    for language in WORD_LANGUAGES:
        owner: dict[str, WordTheme] = {}

        for theme in WORD_THEMES:
            for word in nouns_of(language, theme):
                held = owner.get(word)

                assert held is None, f"{language}: {word} is in both {held} and {theme}"
                owner[word] = theme


def test_nicknames_stay_inside_the_requested_length_range() -> None:
    ranges: list[tuple[WordLanguage, int, int]] = [
        ("ko", 2, 3),
        ("ko", 4, 6),
        ("ko", 8, 10),
        ("en", 4, 8),
        ("en", 10, 16),
        ("en", 18, 24),
        ("ja", 2, 4),
        ("zh", 2, 4),
    ]

    for language, low, high in ranges:
        for nickname in rand_nickname(
            language=language, min_length=low, max_length=high, count=SAMPLE
        ):
            assert low <= len(nickname) <= high, (
                f"{language} {low}-{high}: {nickname} ({len(nickname)})"
            )


def test_omitted_length_bounds_fall_back_to_what_the_language_can_produce() -> None:
    assert nickname_length_range("zh") == (2, 8)
    assert nickname_length_range("ko") == (1, 13)
    assert nickname_length_range("en") == (3, 31)

    for language in WORD_LANGUAGES:
        low, high = nickname_length_range(language)

        for realism in ("real", "invented"):
            for nickname in rand_nickname(language=language, realism=realism, count=SAMPLE):
                assert low <= len(nickname) <= high, (
                    f"{language} @ {realism}: {nickname} ({len(nickname)})"
                )


def test_word_separator_goes_between_the_words() -> None:
    for language in WORD_LANGUAGES:
        for separator in ("", " ", "-", "::"):
            for detail in rand_nickname(
                output="detail", language=language, word_separator=separator, count=SAMPLE
            ):
                assert joined_by(detail.nickname, detail.words, glues_of(language), separator), (
                    f"{language} '{separator}': {detail.nickname}"
                )

                for word in detail.words:
                    assert SCRIPT[language].fullmatch(word), f"{language}: {word}"

    # Omitted, it falls back to the way the language joins its words, which is to run
    # them together.
    for detail in rand_nickname(output="detail", count=SAMPLE):
        assert joined_by(detail.nickname, detail.words, glues_of(detail.language), ""), (
            detail.nickname
        )

    # The separator is part of the nickname, so it counts toward the length.
    assert nickname_length_range("ko", "-") == (1, 15)
    assert nickname_length_range("en", " ") == (3, 33)

    separated: list[tuple[WordLanguage, str, int, int]] = [
        ("ko", " ", 5, 8),
        ("en", "-", 8, 14),
        ("zh", "::", 6, 9),
    ]

    for language, separator, low, high in separated:
        for nickname in rand_nickname(
            language=language,
            word_separator=separator,
            min_length=low,
            max_length=high,
            count=SAMPLE,
        ):
            assert low <= len(nickname) <= high, (
                f"{language} '{separator}' {low}-{high}: {nickname} ({len(nickname)})"
            )


def test_starts_with_leads_every_nickname_with_the_requested_character() -> None:
    for nickname in rand_nickname(language="ko", count=SAMPLE, starts_with="파"):
        assert nickname.startswith("파"), nickname

    for nickname in rand_nickname(language="en", count=SAMPLE, starts_with="b"):
        assert nickname[0] in "Bb", nickname

    # A character no real word starts with is answered with an invented one.
    for nickname in rand_nickname(language="en", count=20, starts_with="Z"):
        assert re.fullmatch(r"Z[A-Za-z]+", nickname), nickname


def test_realism_invents_words_instead_of_drawing_them() -> None:
    pool = set(all_words("ko"))
    invented = rand_nickname(output="detail", language="ko", realism="invented", count=200)
    drawn = [detail for detail in invented if any(word in pool for word in detail.words)]

    assert len(drawn) < 20, f"{len(drawn)} of 200 still came from the pools"

    for detail in invented:
        assert SCRIPT["ko"].fullmatch(detail.nickname), detail.nickname

        # An invented word can spell a real one by accident (나 + 비 -> 나비), and the
        # theme is then reported rather than hidden — but it has to be true.
        if detail.theme:
            nouns = nouns_of("ko", detail.theme)
            assert any(word in nouns for word in detail.words), detail.nickname

    # Halfway, both kinds of word show up.
    mixed = rand_nickname(output="detail", language="ko", realism="mixed", count=200)
    assert any(all(word in pool for word in detail.words) for detail in mixed)
    assert any(all(word not in pool for word in detail.words) for detail in mixed)

    # Out-of-range values are clamped rather than rejected.
    # Every level is accepted, and the type is what rules the rest out.
    for realism in get_args(RandRealism):
        assert len(rand_nickname(language="ko", realism=realism, count=5)) == 5


def test_unique_never_repeats_a_nickname() -> None:
    nicknames = rand_nickname(language="ko", count=2000, unique=True)
    assert len(set(nicknames)) == len(nicknames)

    # One theme in one language, held to two characters, is a small enough pool that
    # the request runs out of combinations and returns fewer instead of looping.
    limited = rand_nickname(language="zh", theme="animal", max_length=2, count=400, unique=True)

    assert len(set(limited)) == len(limited)
    assert len(limited) < 400, f"expected the pool to run out: {len(limited)}"


def test_output_detail_reports_the_pieces_it_used() -> None:
    # Written out rather than going through the helper, so that the overload
    # itself is what a type checker sees.
    for detail in rand_nickname(count=100, output="detail"):
        joiner = WORD_DATA[detail.language].joiner

        assert joined_by(detail.nickname, detail.words, glues_of(detail.language), joiner)
        assert detail.language in WORD_LANGUAGES
        assert detail.theme is None or detail.theme in WORD_THEMES
