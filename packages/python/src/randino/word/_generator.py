"""The word generator, and the primitives the nickname generator builds on.

A word is one entry of one theme's pool — an animal, a thing, something in nature —
or an invented one that only reads like the language. That is the whole of
`rand_word`; a nickname is what you get when several of these are put together, which
is why the drawing lives here and the composing lives in `nickname/_generator.py`.
"""

import math
from typing import NamedTuple

from randino._internal.generate import (
    collect,
    draw_language,
    length_bounds,
    resolve_prefix,
    resolve_style,
)
from randino._internal.utils import capitalize_first, chance, clamp, pick, rand_int
from randino._types import (
    WordDetail,
    WordLanguage,
    WordLanguageOption,
    WordTheme,
    WordThemeOption,
)
from randino.word.data import WORD_DATA, WORD_LANGUAGES, WORD_THEMES
from randino.word.data._types import (
    PoolSynthesis,
    WordLanguageData,
    WordPool,
    WordSynthesis,
)

FIT_ATTEMPTS = 12
"""Themes to try before settling for the closest word found."""

SYNTH_ATTEMPTS = 8
"""Attempts spent looking for an invented word of the requested length."""


def pool_bounds(pool: WordPool) -> tuple[int, int]:
    """Shortest and longest word in a pool."""
    if not pool:
        return 1, 1

    return min(len(word) for word in pool), max(len(word) for word in pool)


def themes_of(theme: WordThemeOption) -> tuple[WordTheme, ...]:
    """The themes one draw may use."""
    return WORD_THEMES if theme == "all" else (theme,)


def theme_of(data: WordLanguageData, word: str) -> WordTheme | None:
    """Theme a word belongs to, across every theme of the language."""
    for theme in WORD_THEMES:
        if word in data.nouns[theme]:
            return theme

    return None


def pick_word(pool: WordPool, low: int, high: int, prefix: str) -> str | None:
    """A pool word between `low` and `high` characters, starting with `prefix`.

    Falls back to a looser fit rather than nothing, and returns None only when no
    word starts with the requested character.
    """
    candidates = (
        tuple(word for word in pool if word.lower().startswith(prefix.lower())) if prefix else pool
    )

    if not candidates:
        return None

    fitting = tuple(word for word in candidates if low <= len(word) <= high)

    if fitting:
        return pick(fitting)

    short_enough = tuple(word for word in candidates if len(word) <= high)

    if short_enough:
        return pick(short_enough)

    long_enough = tuple(word for word in candidates if len(word) >= low)

    return pick(long_enough or candidates)


def synth_word(syn: WordSynthesis, low: int, high: int, prefix: str) -> str:
    """Build one invented word, as close to the requested length as the template allows."""
    if isinstance(syn, PoolSynthesis):
        # One entry is one character, so the length is the number of entries.
        floor = max(low, 1)
        ceiling = max(floor, high)
        count = clamp(rand_int(syn.min_syllables, syn.max_syllables), floor, ceiling)
        out = prefix

        for _ in range(len(out), count):
            # Avoid immediately repeating a character (狼狼).
            following = pick(syn.pool)

            for _tries in range(3):
                if following != out[-1:]:
                    break
                following = pick(syn.pool)

            out += following

        return out

    best = ""
    best_distance = math.inf

    for _attempt in range(SYNTH_ATTEMPTS):
        syllables = rand_int(syn.min_syllables, syn.max_syllables)
        word = ""

        for index in range(syllables):
            word += prefix.lower() if index == 0 and prefix else pick(syn.onset)
            word += pick(syn.vowel)

            if index == syllables - 1:
                word += pick(syn.coda)

        if low <= len(word) <= high:
            return word

        distance = low - len(word) if len(word) < low else len(word) - high

        if distance < best_distance:
            best_distance = distance
            best = word

    return best


class Drawn(NamedTuple):
    """One word, and whether it had to be invented against the caller's wishes."""

    word: str

    missed: bool
    """The word had to be invented because no real one started with the requested
    character — worth another theme before settling for it."""


def draw_word(
    data: WordLanguageData,
    pool: WordPool,
    style: int,
    low: int,
    high: int,
    prefix: str,
) -> Drawn:
    """Draw one word from `pool`, or invent one, at the given `style`."""
    invent = chance(style)
    word = None if invent else pick_word(pool, low, high, prefix)
    chosen = word if word is not None else synth_word(data.syn, low, high, prefix)

    return Drawn(
        capitalize_first(chosen) if data.capitalize else chosen,
        not invent and word is None,
    )


def natural_range(language: WordLanguage, theme: WordThemeOption) -> tuple[int, int]:
    """Every length the language's pools hold, across the requested themes.

    The fallback for an omitted `min_length` / `max_length`, and what
    `word_length_range` reports.
    """
    data = WORD_DATA[language]
    ranges = [pool_bounds(data.nouns[each]) for each in themes_of(theme)]

    return min(low for low, _ in ranges), max(high for _, high in ranges)


class Settings(NamedTuple):
    """Everything one word needs, with the defaults already applied."""

    theme: WordThemeOption
    style: int
    min_length: int | None
    max_length: int | None
    prefix: str


def generate_one(language: WordLanguage, settings: Settings) -> WordDetail:
    """Draw one word, trying another theme when the first one cannot serve."""
    data = WORD_DATA[language]
    themes = themes_of(settings.theme)
    best: WordDetail | None = None
    best_distance = math.inf

    for _attempt in range(FIT_ATTEMPTS):
        # One theme per word, so a mixed request spreads over all of them.
        theme = pick(themes)
        pool = data.nouns[theme]
        natural_low, natural_high = pool_bounds(pool)
        low, high = length_bounds(
            settings.min_length, settings.max_length, natural_low, natural_high
        )
        word, missed = draw_word(data, pool, settings.style, low, high, settings.prefix)
        detail = WordDetail(
            word=word,
            language=language,
            # A drawn word came out of this theme; an invented one has to be looked
            # up, because it can spell a real word by accident.
            theme=theme if word in pool else theme_of(data, word),
        )

        if low <= len(word) <= high and not missed:
            return detail

        # Worth spending another attempt on: a real word may well start with the
        # requested character in one of the other themes.
        distance = (low - len(word) if len(word) < low else max(0, len(word) - high)) + (
            1 if missed else 0
        )

        if distance < best_distance:
            best_distance = distance
            best = detail

    assert best is not None

    return best


def generate_word_details(
    *,
    language: WordLanguageOption = "all",
    theme: WordThemeOption = "all",
    count: int = 1,
    style: int = 0,
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
) -> list[WordDetail]:
    """Generate `count` words, applied to every option the caller passed."""
    settings = Settings(
        theme=theme,
        style=resolve_style(style),
        min_length=min_length,
        max_length=max_length,
        prefix=resolve_prefix(starts_with),
    )

    return collect(
        count=count,
        unique=unique,
        starts_with=settings.prefix,
        draw=lambda: generate_one(draw_language(language, WORD_LANGUAGES), settings),
        key_of=lambda detail: detail.word,
    )
