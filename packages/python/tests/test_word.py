"""The word generators: `rand_word` and the fourteen themed ones."""

import re
from typing import get_args

from randino import (
    RAND_COUNT_MAX,
    WORD_LANGUAGES,
    WORD_THEMES,
    RandRealism,
    WordLanguage,
    WordTheme,
    rand_animal,
    rand_concept,
    rand_food,
    rand_gem,
    rand_job,
    rand_music,
    rand_myth,
    rand_nature,
    rand_object,
    rand_place,
    rand_plant,
    rand_product,
    rand_sport,
    rand_vehicle,
    rand_word,
    word_length_range,
)

# The datasets are internal, but a word generator is only as good as the pools behind
# it — these checks are what tie the output back to them.
from randino.word.data import WORD_DATA

SAMPLE = 60

SCRIPT: dict[WordLanguage, re.Pattern[str]] = {
    "en": re.compile(r"^[A-Za-z]+$"),
    "ko": re.compile(r"^[가-힣]+$"),
    "ja": re.compile(r"^[々぀-ヿ一-鿿]+$"),
    "zh": re.compile(r"^[々一-鿿]+$"),
}

THEMED = {
    "animal": rand_animal,
    "object": rand_object,
    "nature": rand_nature,
    "plant": rand_plant,
    "gem": rand_gem,
    "concept": rand_concept,
    "myth": rand_myth,
    "job": rand_job,
    "music": rand_music,
    "place": rand_place,
    "food": rand_food,
    "sport": rand_sport,
    "vehicle": rand_vehicle,
    "product": rand_product,
}
"""The themed generator for each theme, which is what the fourteen of them are."""


def pool_of(language: WordLanguage, theme: WordTheme | None = None) -> tuple[str, ...]:
    """Every noun the language holds, or every noun of one theme."""
    data = WORD_DATA[language]

    if theme is not None:
        return tuple(data.nouns[theme])

    return tuple(word for each in WORD_THEMES for word in data.nouns[each])


def test_rand_word_returns_one_word_by_default() -> None:
    words = rand_word()

    assert len(words) == 1
    assert isinstance(words[0], str)
    assert words[0]


def test_rand_word_returns_exactly_count_words() -> None:
    assert len(rand_word(count=25)) == 25
    assert rand_word(count=0) == []
    assert rand_word(count=-10) == []
    assert len(rand_word(count=RAND_COUNT_MAX + 500)) == RAND_COUNT_MAX


def test_every_language_writes_its_words_in_its_own_script() -> None:
    for language in WORD_LANGUAGES:
        for word in rand_word(language=language, count=SAMPLE):
            assert SCRIPT[language].match(word), f"{language}: {word}"

        for word in rand_word(language=language, count=SAMPLE, realism="invented"):
            assert SCRIPT[language].match(word), f"{language} invented: {word}"


def test_the_mixed_language_uses_every_language_it_knows() -> None:
    used = {detail.language for detail in rand_word(output="detail", count=400)}

    assert len(used) == len(WORD_LANGUAGES)


def test_a_drawn_word_comes_out_of_the_pools_with_the_theme_that_holds_it() -> None:
    for language in WORD_LANGUAGES:
        pool = set(pool_of(language))

        for detail in rand_word(output="detail", language=language, count=200):
            assert detail.word in pool, f"{language}: {detail.word} is not in the pools"
            assert detail.theme is not None, detail.word
            assert detail.word in pool_of(language, detail.theme), detail.word


def test_theme_narrows_the_pool_to_that_one_theme() -> None:
    for theme in WORD_THEMES:
        for language in WORD_LANGUAGES:
            nouns = pool_of(language, theme)

            for detail in rand_word(output="detail", language=language, theme=theme, count=40):
                assert detail.theme == theme, detail.word
                assert detail.word in nouns, f"{detail.word} is not a {theme} word"

    assert {detail.theme for detail in rand_word(output="detail", count=400)} == set(WORD_THEMES)


def test_there_is_one_generator_per_theme_and_it_is_that_theme() -> None:
    # A theme added to `WORD_THEMES` without a generator beside it is the failure this
    # catches — the table above would be missing a key.
    assert sorted(THEMED) == sorted(WORD_THEMES)

    for theme in WORD_THEMES:
        for language in WORD_LANGUAGES:
            nouns = pool_of(language, theme)

            for word in THEMED[theme](language=language, count=20):
                assert word in nouns, f"{theme}: {word}"

    # The detail form carries through the wrapper, overload and all.
    for detail in rand_animal(language="ko", count=20, output="detail"):
        assert detail.theme == "animal"
        assert detail.language == "ko"


def test_words_stay_inside_the_requested_length_range() -> None:
    ranges: list[tuple[WordLanguage, WordTheme, int, int]] = [
        ("ko", "animal", 2, 3),
        ("ko", "food", 2, 4),
        ("en", "animal", 3, 6),
        ("en", "object", 6, 9),
        ("ja", "nature", 2, 4),
        ("zh", "plant", 2, 3),
    ]

    for language, theme, min_length, max_length in ranges:
        for word in rand_word(
            language=language,
            theme=theme,
            min_length=min_length,
            max_length=max_length,
            count=SAMPLE,
        ):
            assert min_length <= len(word) <= max_length, (
                f"{language}/{theme} {min_length}-{max_length}: {word}"
            )


def test_omitted_length_bounds_fall_back_to_what_the_pools_hold() -> None:
    assert word_length_range("zh") == (2, 3)
    assert word_length_range("ko") == (1, 4)
    assert word_length_range("en") == (3, 11)

    for language in WORD_LANGUAGES:
        low, high = word_length_range(language)

        for word in rand_word(language=language, count=SAMPLE):
            assert low <= len(word) <= high, f"{language}: {word}"

        # A theme is a pool of its own, so its range sits inside the language's.
        for theme in WORD_THEMES:
            span_low, span_high = word_length_range(language, theme)

            assert span_low >= low and span_high <= high, f"{language}/{theme}"


def test_starts_with_leads_every_word_with_the_requested_character() -> None:
    for word in rand_word(language="ko", count=SAMPLE, starts_with="바"):
        assert word.startswith("바"), word

    for word in rand_word(language="en", count=SAMPLE, starts_with="b"):
        assert word[0] in "Bb", word

    # A character no real word starts with is answered with an invented one.
    for word in rand_word(language="en", theme="gem", count=20, starts_with="Z"):
        assert re.fullmatch(r"Z[A-Za-z]+", word), word


def test_realism_invents_words_instead_of_drawing_them() -> None:
    pool = set(pool_of("ko"))
    invented = rand_word(output="detail", language="ko", realism="invented", count=200)
    drawn = [detail for detail in invented if detail.word in pool]

    assert len(drawn) < 20, f"{len(drawn)} of 200 still came from the pools"

    for detail in invented:
        assert SCRIPT["ko"].match(detail.word), detail.word

        # An invented word can spell a real one by accident (나 + 비 -> 나비), and the
        # theme is then reported rather than hidden — but it has to be true.
        if detail.theme is not None:
            assert detail.word in pool_of("ko", detail.theme), detail.word

    # Halfway, both kinds of word show up.
    mixed = rand_word(output="detail", language="ko", realism="mixed", count=200)

    assert any(detail.word in pool for detail in mixed)
    assert any(detail.word not in pool for detail in mixed)

    # Out-of-range values are clamped rather than rejected.
    # Every level is accepted, and the type is what rules the rest out.
    for realism in get_args(RandRealism):
        assert len(rand_word(language="ko", realism=realism, count=5)) == 5


def test_unique_never_repeats_a_word() -> None:
    words = rand_word(language="ko", count=400, unique=True)

    assert len(set(words)) == len(words)

    # One theme in one language is a pool of a few dozen words, so the request runs
    # out and returns fewer instead of looping.
    limited = rand_word(language="zh", theme="sport", count=400, unique=True)

    assert len(set(limited)) == len(limited)
    assert len(limited) < 400
