"""The nickname generator itself.

Internal — `rand_nickname` is the public entry point, in both of its output forms.

A nickname is a noun with something added to it: a modifier in front (멋진사자), a
second noun behind (고양이꼬리), or both (파란고양이발바닥). The nouns are everyday
words — animals, things, nature, ideas — and never person names, which is what keeps
a nickname from reading like one.

- `style` decides per word whether it comes out of a pool or is invented.
- `min_length` / `max_length` pick the shape first: a range too short for a modifier
  drops that pattern instead of truncating a word.
- `word_separator` decides what goes between the words, defaulting to the way the
  language joins them.
- `base_word` pins the noun, so only the decoration varies.

What used to be the fifth entry here, `unique_suffix`, is `rand_suffix` now:
attaching a token to a string was never a thing about nicknames.
"""

import math
import random
import re
from dataclasses import dataclass
from typing import Literal, NamedTuple

from randino._internal.generate import (
    collect,
    draw_language,
    length_bounds,
    resolve_length,
    resolve_prefix,
    resolve_style,
)
from randino._internal.utils import (
    capitalize_first,
    chance,
    clamp,
    pick,
    rand_int,
)
from randino._types import (
    NicknameDetail,
    NicknameLanguage,
    NicknameLanguageOption,
    NicknameTheme,
    NicknameThemeOption,
)
from randino.nickname.data import NICKNAME_DATA, NICKNAME_LANGUAGES, NICKNAME_THEMES
from randino.nickname.data._types import (
    NicknameLanguageData,
    PoolSynthesis,
    WordPool,
    WordSynthesis,
)

Slot = Literal["modifier", "noun", "part"]


class Pattern(NamedTuple):
    """One shape a nickname can take, and how often it is used."""

    slots: tuple[Slot, ...]
    weight: int


PATTERNS: tuple[Pattern, ...] = (
    Pattern(("noun",), 12),
    Pattern(("modifier", "noun"), 50),
    Pattern(("noun", "part"), 12),
    Pattern(("modifier", "noun", "part"), 26),
)
"""The shapes a nickname can take.

A bare noun stays rare on purpose — a modifier is what makes a nickname feel picked.
"""

FIT_ATTEMPTS = 12
"""How many shapes to try before settling for the closest fit found."""

SYNTH_ATTEMPTS = 8
"""Attempts spent looking for an invented word of the requested length."""

Bounds = dict[Slot, tuple[int, int]]


@dataclass(frozen=True, slots=True)
class Settings:
    """Everything a single nickname needs, with defaults already applied.

    The length bounds stay optional: left out, they are resolved per language and
    theme. So does the separator, which falls back to the language's own joiner.
    """

    theme: NicknameThemeOption
    style: int
    include_modifier: bool
    base_word: str
    prefix: str
    min_length: int | None = None
    max_length: int | None = None
    separator: str | None = None


def joiner_of(data: NicknameLanguageData, settings: Settings) -> str:
    """What goes between the words: the caller's separator, or the language's joiner.

    Its length is part of the nickname's, so every length calculation has to go
    through here rather than reading `data.joiner` directly.
    """
    return data.joiner if settings.separator is None else settings.separator


def pool_bounds(pool: WordPool) -> tuple[int, int]:
    """Shortest and longest word in a pool."""
    if not pool:
        return 1, 1

    return min(len(word) for word in pool), max(len(word) for word in pool)


_bounds_cache: dict[str, Bounds] = {}
"""Pool bounds never change, so they are worth computing once per language/theme."""


def slot_bounds(
    language: NicknameLanguage, data: NicknameLanguageData, theme: NicknameTheme
) -> Bounds:
    """Shortest and longest word each slot of a shape can hold."""
    key = f"{language}:{theme}"
    cached = _bounds_cache.get(key)

    if cached is not None:
        return cached

    bounds: Bounds = {
        "modifier": pool_bounds(data.modifiers),
        "noun": pool_bounds(data.nouns[theme]),
        "part": pool_bounds(data.parts or ()),
    }

    _bounds_cache[key] = bounds

    return bounds


def usable_patterns(data: NicknameLanguageData, settings: Settings) -> tuple[Pattern, ...]:
    """The shapes available for the current options, in the order they are weighted."""
    base_leads = bool(settings.base_word) and settings.base_word.lower().startswith(
        settings.prefix.lower()
    )

    def keep(pattern: Pattern) -> bool:
        slots = pattern.slots

        if not settings.include_modifier and "modifier" in slots:
            return False
        if data.parts is None and "part" in slots:
            return False
        # A given base word is the noun, so something has to be added to it —
        # otherwise every nickname would come back as the word itself.
        if settings.base_word and len(slots) < 2:
            return False
        # The starting character has to land on a word the generator is free to
        # choose, unless the given base word happens to start with it already.
        return not (
            settings.prefix and settings.base_word and slots[0] == "noun" and not base_leads
        )

    usable = tuple(pattern for pattern in PATTERNS if keep(pattern))

    # Options can rule out every shape — a base word with nothing allowed to decorate
    # it, say. The word on its own is then the only answer.
    return usable or (Pattern(("noun",), 1),)


def pattern_range(slots: tuple[Slot, ...], bounds: Bounds, joiner: int) -> tuple[int, int]:
    """Shortest and longest nickname a shape can produce."""
    gaps = (len(slots) - 1) * joiner

    return (
        gaps + sum(bounds[slot][0] for slot in slots),
        gaps + sum(bounds[slot][1] for slot in slots),
    )


def pick_pattern(patterns: tuple[Pattern, ...]) -> tuple[Slot, ...]:
    """Draw one shape in proportion to its weight."""
    roll = random.random() * sum(pattern.weight for pattern in patterns)

    for pattern in patterns:
        roll -= pattern.weight

        if roll <= 0:
            return pattern.slots

    return patterns[-1].slots


# --- Word selection ---------------------------------------------------------


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


class Chosen(NamedTuple):
    """One word, and whether it had to be invented against the caller's wishes."""

    word: str

    missed: bool
    """The word had to be invented because no real one started with the requested
    character — worth another shape or theme before settling for it."""


def pick_slot_word(
    data: NicknameLanguageData,
    slot: Slot,
    nouns: WordPool,
    settings: Settings,
    low: int,
    high: int,
    prefix: str,
) -> Chosen:
    """Fill one slot of a shape with a word."""
    if slot == "noun" and settings.base_word:
        base = settings.base_word

        return Chosen(capitalize_first(base) if data.capitalize else base, False)

    if slot == "modifier":
        pool = data.modifiers
    elif slot == "part":
        assert data.parts is not None
        pool = data.parts
    else:
        pool = nouns

    invent = chance(settings.style)
    word = None if invent else pick_word(pool, low, high, prefix)
    chosen = word if word is not None else synth_word(data.syn, low, high, prefix)

    return Chosen(
        capitalize_first(chosen) if data.capitalize else chosen,
        not invent and word is None,
    )


class Built(NamedTuple):
    """The words of one nickname, and the theme its base word came from."""

    words: tuple[str, ...]
    theme: NicknameTheme | None


def build_words(
    data: NicknameLanguageData,
    slots: tuple[Slot, ...],
    bounds: Bounds,
    nouns: WordPool,
    settings: Settings,
    low: int,
    high: int,
) -> tuple[list[str], bool]:
    """Fill a shape with words.

    Each slot is given the room left once the slots after it have been reserved
    theirs, so the last word can always close the gap to `low` and nothing overshoots
    `high`.
    """
    joiner = len(joiner_of(data, settings))
    words: list[str] = []
    missed = False
    used = 0

    for index, slot in enumerate(slots):
        gap = joiner if index > 0 else 0
        rest_min = sum(bounds[rest][0] + joiner for rest in slots[index + 1 :])
        rest_max = sum(bounds[rest][1] + joiner for rest in slots[index + 1 :])

        floor = max(1, low - used - gap - rest_max)
        ceiling = max(floor, high - used - gap - rest_min)
        chosen = pick_slot_word(
            data, slot, nouns, settings, floor, ceiling, settings.prefix if index == 0 else ""
        )

        missed = missed or chosen.missed
        used += gap + len(chosen.word)
        words.append(chosen.word)

    return words, missed


# --- Per-nickname generation ------------------------------------------------


def themes_of(theme: NicknameThemeOption) -> tuple[NicknameTheme, ...]:
    """The themes one request draws from."""
    return NICKNAME_THEMES if theme == "all" else (theme,)


def theme_of(data: NicknameLanguageData, word: str) -> NicknameTheme | None:
    """Theme a word belongs to, across every theme of the language."""
    for theme in NICKNAME_THEMES:
        if word in data.nouns[theme]:
            return theme

    return None


def has_boundary_repeat(words: list[str]) -> bool:
    """True when one word ends on the character the next one starts with (石霜 + 霜雨).

    Only meaningful where words run together with neither a separator nor a capital
    between them — plenty of real words double a character inside themselves (씩씩한,
    Sunny).
    """
    return any(words[index - 1][-1:] == words[index][:1] for index in range(1, len(words)))


def bounds_for(
    data: NicknameLanguageData,
    bounds: Bounds,
    patterns: tuple[Pattern, ...],
    settings: Settings,
) -> tuple[int, int]:
    """Length range for one language and theme.

    What the caller asked for, falling back to everything the available shapes can
    produce.
    """
    joiner = len(joiner_of(data, settings))
    ranges = [pattern_range(pattern.slots, bounds, joiner) for pattern in patterns]
    natural_min = min(low for low, _ in ranges)
    natural_max = max(high for _, high in ranges)

    return length_bounds(settings.min_length, settings.max_length, natural_min, natural_max)


def natural_range(
    language: NicknameLanguage, include_modifier: bool, separator: str | None = None
) -> tuple[int, int]:
    """Every length a language can produce, across all of its themes.

    The fallback for an omitted `min_length` / `max_length`, and what
    `nickname_length_range` reports. Kept here so it is derived from the same shapes
    and pools the generator actually draws from.
    """
    data = NICKNAME_DATA[language]
    settings = Settings(
        theme="all",
        style=0,
        include_modifier=include_modifier,
        base_word="",
        prefix="",
        separator=separator,
    )
    patterns = usable_patterns(data, settings)
    joiner = len(joiner_of(data, settings))
    ranges = [
        pattern_range(pattern.slots, slot_bounds(language, data, theme), joiner)
        for theme in NICKNAME_THEMES
        for pattern in patterns
    ]

    return min(low for low, _ in ranges), max(high for _, high in ranges)


def generate_one(language: NicknameLanguage, settings: Settings) -> Built:
    """Build one complete nickname in one language."""
    data = NICKNAME_DATA[language]
    themes = themes_of(settings.theme)
    patterns = usable_patterns(data, settings)
    joiner = joiner_of(data, settings)
    best: Built | None = None
    best_distance = math.inf

    for _attempt in range(FIT_ATTEMPTS):
        # One theme per nickname, so a mixed request spreads over all of them.
        theme = pick(themes)
        nouns = data.nouns[theme]
        cached = slot_bounds(language, data, theme)
        # A given base word takes the noun's place, so it also takes over its bounds —
        # never write that into the cache.
        bounds: Bounds = (
            {**cached, "noun": (len(settings.base_word), len(settings.base_word))}
            if settings.base_word
            else cached
        )

        low, high = bounds_for(data, bounds, patterns, settings)
        # Prefer a shape that can actually land inside the range.
        spans = {pattern: pattern_range(pattern.slots, bounds, len(joiner)) for pattern in patterns}
        fitting = tuple(
            pattern for pattern, (low_, high_) in spans.items() if high_ >= low and low_ <= high
        )
        slots = pick_pattern(fitting or patterns)
        words, missed = build_words(data, slots, bounds, nouns, settings, low, high)
        base = words[slots.index("noun")]
        built = Built(
            tuple(words),
            # Only a word the generator knows carries a theme. A drawn word came out of
            # this theme; a given base word has to be looked up, and an invented one is
            # found nowhere.
            theme if base in nouns else theme_of(data, base),
        )
        length = len(joiner.join(words))
        # Worth spending another attempt on, but not worth failing over: a real word
        # may well start with the requested character in one of the other themes, and
        # another draw will not stutter across the word boundary.
        rough = missed or (not joiner and not data.capitalize and has_boundary_repeat(words))

        if low <= length <= high and not rough:
            return built

        distance = (low - length if length < low else max(0, length - high)) + (1 if rough else 0)

        if distance < best_distance:
            best_distance = distance
            best = built

    assert best is not None

    return best


HANGUL = re.compile(r"[가-힣]")
KANA = re.compile(r"[぀-ヿ]")
HAN = re.compile(r"[一-鿿]")


def detect_language(word: str) -> NicknameLanguage:
    """Language a given base word belongs to.

    So that `base_word="고양이"` is not decorated with an English modifier. Only
    consulted when the caller left `language` out.
    """
    if HANGUL.search(word):
        return "ko"
    if KANA.search(word):
        return "ja"
    if HAN.search(word):
        return "zh"

    return "en"


def generate_nickname_details(
    *,
    language: NicknameLanguageOption | None = None,
    theme: NicknameThemeOption = "all",
    count: int = 1,
    style: int = 0,
    min_length: int | None = None,
    max_length: int | None = None,
    include_modifier: bool = True,
    word_separator: str | None = None,
    base_word: str = "",
    starts_with: str = "",
    unique: bool = False,
) -> list[NicknameDetail]:
    """Generate `count` nicknames, applied to every option the caller passed."""
    settings = Settings(
        theme=theme,
        style=resolve_style(style),
        min_length=resolve_length(min_length),
        max_length=resolve_length(max_length),
        include_modifier=include_modifier,
        base_word=base_word.strip(),
        prefix=resolve_prefix(starts_with),
        separator=word_separator,
    )
    resolved: NicknameLanguageOption = language or (
        detect_language(settings.base_word) if settings.base_word else "all"
    )

    def draw() -> NicknameDetail:
        code = draw_language(resolved, NICKNAME_LANGUAGES)
        words, built_theme = generate_one(code, settings)

        return NicknameDetail(
            nickname=joiner_of(NICKNAME_DATA[code], settings).join(words),
            words=words,
            language=code,
            theme=built_theme,
        )

    return collect(
        count=count,
        unique=unique,
        starts_with=settings.prefix,
        draw=draw,
        key_of=lambda detail: detail.nickname,
    )
