"""The nickname generator itself.

Internal — `rand_nickname` is the public entry point, in both of its output forms.

A nickname is a noun with something added to it: a word for what it is like in front
(멋진사자), one for what it is doing (웃는사자), a second noun behind (고양이꼬리), or a
possessive between the two (사자의눈물). The nouns are the `word` package's pools —
animals, things, nature, ideas — and never person names, which is what keeps a nickname
from reading like one. Drawing one word is `word/_generator.py`; putting several of them
together is what this module is.

- Which shapes exist is the language's own business, and `data.frames` is where it says
  so. A shape carries its particles with it, so Chinese can put 的 between a verb and
  its noun where Korean needs nothing.
- `realism` decides per word whether it comes out of a pool or is invented, and which
  themes `theme="all"` spans — see `LOOSE_THEMES`.
- `min_length` / `max_length` pick the shape first: a range too short for a modifier
  drops that frame instead of truncating a word.
- `word_separator` decides what goes between the words, defaulting to the way the
  language joins them.

What used to be the fifth entry here, `unique_suffix`, is `rand_suffix` now:
attaching a token to a string was never a thing about nicknames.
"""

import math
import random
from collections.abc import Sequence
from dataclasses import dataclass
from typing import NamedTuple

from randino._internal.generate import (
    collect,
    draw_language,
    length_bounds,
    resolve_length,
    resolve_prefix,
    resolve_realism,
)
from randino._internal.utils import pick
from randino._types import (
    NicknameDetail,
    RandRealism,
    WordLanguage,
    WordLanguageOption,
    WordTheme,
    WordThemeOption,
)
from randino.word._generator import draw_word, pool_bounds, theme_of, themes_of
from randino.word.data import LOOSE_THEMES, WORD_DATA, WORD_LANGUAGES, WORD_THEMES
from randino.word.data._types import WordFrame, WordLanguageData, WordPool, WordSlot

FIT_ATTEMPTS = 12
"""How many shapes to try before settling for the closest fit found."""

Bounds = dict[WordSlot, tuple[int, int]]


@dataclass(frozen=True, slots=True)
class Settings:
    """Everything a single nickname needs, with defaults already applied.

    The length bounds stay optional: left out, they are resolved per language and
    theme. So does the separator, which falls back to the language's own joiner.
    """

    theme: WordThemeOption
    invent: int
    loose: bool
    prefix: str
    min_length: int | None = None
    max_length: int | None = None
    separator: str | None = None


def themes_for(settings: Settings) -> tuple[WordTheme, ...]:
    """The themes one nickname may draw from.

    `theme="all"` spans every theme a nickname can carry, which at `realism="real"` is
    every theme but the loose ones; a theme the caller named is always honoured.
    """
    if settings.theme != "all" or settings.loose:
        return themes_of(settings.theme)

    return tuple(theme for theme in WORD_THEMES if theme not in LOOSE_THEMES)


def joiner_of(data: WordLanguageData, settings: Settings) -> str:
    """What goes between the words: the caller's separator, or the language's joiner.

    Its length is part of the nickname's, so every length calculation has to go
    through here rather than reading `data.joiner` directly.
    """
    return data.joiner if settings.separator is None else settings.separator


_bounds_cache: dict[str, Bounds] = {}
"""Pool bounds never change, so they are worth computing once per language/theme."""


def slot_bounds(language: WordLanguage, data: WordLanguageData, theme: WordTheme) -> Bounds:
    """Shortest and longest word each slot of a frame can hold."""
    key = f"{language}:{theme}"
    cached = _bounds_cache.get(key)

    if cached is not None:
        return cached

    bounds: Bounds = {
        "adjective": pool_bounds(data.adjectives),
        "action": pool_bounds(data.actions),
        "noun": pool_bounds(data.nouns[theme]),
        "part": pool_bounds(data.parts or ()),
    }

    _bounds_cache[key] = bounds

    return bounds


def gap_of(frame: WordFrame, index: int, joiner: int) -> int:
    """Return what sits in front of the slot at `index`, in characters.

    The frame's own particle for that gap, and then whatever joins the words. Nothing
    at all in front of the first slot.
    """
    return 0 if index == 0 else len(frame.glue_at(index)) + joiner


def frame_range(frame: WordFrame, bounds: Bounds, joiner: int) -> tuple[int, int]:
    """Shortest and longest nickname a frame can produce."""
    gaps = sum(gap_of(frame, index, joiner) for index in range(len(frame.slots)))

    return (
        gaps + sum(bounds[slot][0] for slot in frame.slots),
        gaps + sum(bounds[slot][1] for slot in frame.slots),
    )


def pick_frame(frames: Sequence[WordFrame]) -> WordFrame:
    """Draw one shape in proportion to its weight."""
    roll = random.random() * sum(frame.weight for frame in frames)

    for frame in frames:
        roll -= frame.weight

        if roll <= 0:
            return frame

    return frames[-1]


def pool_of(data: WordLanguageData, slot: WordSlot, nouns: WordPool) -> WordPool:
    """The pool one slot draws from."""
    if slot == "adjective":
        return data.adjectives

    if slot == "action":
        return data.actions

    if slot == "part":
        # Only a frame of the language's own can ask for this, and one that does is
        # only written where the pool is.
        assert data.parts is not None

        return data.parts

    return nouns


def assemble(words: Sequence[str], frame: WordFrame, joiner: str) -> str:
    """The finished string: the words in order, with the frame's particles between them."""
    out = ""

    for index, word in enumerate(words):
        out += ("" if index == 0 else frame.glue_at(index) + joiner) + word

    return out


class Built(NamedTuple):
    """The words of one nickname, the string they make, and the base word's theme."""

    words: tuple[str, ...]
    nickname: str
    theme: WordTheme | None


def build_words(
    data: WordLanguageData,
    frame: WordFrame,
    bounds: Bounds,
    nouns: WordPool,
    settings: Settings,
    low: int,
    high: int,
) -> tuple[list[str], bool]:
    """Fill a frame with words.

    Each slot is given the room left once the slots after it have been reserved
    theirs, so the last word can always close the gap to `low` and nothing overshoots
    `high`.
    """
    joiner = len(joiner_of(data, settings))
    words: list[str] = []
    missed = False
    used = 0

    for index, slot in enumerate(frame.slots):
        gap = gap_of(frame, index, joiner)
        rest = range(index + 1, len(frame.slots))
        rest_min = sum(bounds[frame.slots[at]][0] + gap_of(frame, at, joiner) for at in rest)
        rest_max = sum(bounds[frame.slots[at]][1] + gap_of(frame, at, joiner) for at in rest)

        floor = max(1, low - used - gap - rest_max)
        ceiling = max(floor, high - used - gap - rest_min)
        chosen = draw_word(
            data,
            pool_of(data, slot, nouns),
            settings.invent,
            floor,
            ceiling,
            settings.prefix if index == 0 else "",
        )

        missed = missed or chosen.missed
        used += gap + len(chosen.word)
        words.append(chosen.word)

    return words, missed


# --- Per-nickname generation ------------------------------------------------


def has_boundary_repeat(words: list[str], frame: WordFrame) -> bool:
    """True when one word ends on the character the next one starts with (石霜 + 霜雨).

    Only meaningful where the two run straight together — a particle or a capital
    between them reads fine, and plenty of real words double a character inside
    themselves (씩씩한, Sunny).
    """
    return any(
        not frame.glue_at(index) and words[index - 1][-1:] == words[index][:1]
        for index in range(1, len(words))
    )


def bounds_for(data: WordLanguageData, bounds: Bounds, settings: Settings) -> tuple[int, int]:
    """Length range for one language and theme.

    What the caller asked for, falling back to everything the language's frames can
    produce.
    """
    joiner = len(joiner_of(data, settings))
    ranges = [frame_range(frame, bounds, joiner) for frame in data.frames]
    natural_min = min(low for low, _ in ranges)
    natural_max = max(high for _, high in ranges)

    return length_bounds(settings.min_length, settings.max_length, natural_min, natural_max)


def natural_range(language: WordLanguage, separator: str | None = None) -> tuple[int, int]:
    """Every length a language can produce, across all of its themes.

    The fallback for an omitted `min_length` / `max_length`, and what
    `nickname_length_range` reports. Kept here so it is derived from the same frames
    and pools the generator actually draws from.
    """
    data = WORD_DATA[language]
    settings = Settings(theme="all", invent=0, loose=True, prefix="", separator=separator)
    joiner = len(joiner_of(data, settings))
    ranges = [
        frame_range(frame, slot_bounds(language, data, theme), joiner)
        for theme in WORD_THEMES
        for frame in data.frames
    ]

    return min(low for low, _ in ranges), max(high for _, high in ranges)


def generate_one(language: WordLanguage, settings: Settings) -> Built:
    """Build one complete nickname in one language."""
    data = WORD_DATA[language]
    themes = themes_for(settings)
    joiner = joiner_of(data, settings)
    best: Built | None = None
    best_distance = math.inf

    for _attempt in range(FIT_ATTEMPTS):
        # One theme per nickname, so a mixed request spreads over all of them.
        theme = pick(themes)
        nouns = data.nouns[theme]
        bounds = slot_bounds(language, data, theme)
        low, high = bounds_for(data, bounds, settings)
        # Prefer a shape that can actually land inside the range.
        spans = [(frame, frame_range(frame, bounds, len(joiner))) for frame in data.frames]
        fitting = [frame for frame, (low_, high_) in spans if high_ >= low and low_ <= high]
        frame = pick_frame(fitting or list(data.frames))
        words, missed = build_words(data, frame, bounds, nouns, settings, low, high)
        base = words[frame.slots.index("noun")]
        nickname = assemble(words, frame, joiner)
        built = Built(
            tuple(words),
            nickname,
            # Only a word the generator knows carries a theme. A drawn word came out of
            # this theme; an invented one has to be looked up, because it can spell a
            # real word by accident.
            theme if base in nouns else theme_of(data, base),
        )
        length = len(nickname)
        # Worth spending another attempt on, but not worth failing over: a real word
        # may well start with the requested character in one of the other themes, and
        # another draw will not stutter across the word boundary.
        rough = missed or (not joiner and not data.capitalize and has_boundary_repeat(words, frame))

        if low <= length <= high and not rough:
            return built

        distance = (low - length if length < low else max(0, length - high)) + (1 if rough else 0)

        if distance < best_distance:
            best_distance = distance
            best = built

    assert best is not None

    return best


def generate_nickname_details(
    *,
    language: WordLanguageOption = "all",
    theme: WordThemeOption = "all",
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    word_separator: str | None = None,
    starts_with: str = "",
    unique: bool = False,
) -> list[NicknameDetail]:
    """Generate `count` nicknames, applied to every option the caller passed."""
    settings = Settings(
        theme=theme,
        invent=resolve_realism(realism),
        loose=realism != "real",
        min_length=resolve_length(min_length),
        max_length=resolve_length(max_length),
        prefix=resolve_prefix(starts_with),
        separator=word_separator,
    )

    def draw() -> NicknameDetail:
        code = draw_language(language, WORD_LANGUAGES)
        words, nickname, built_theme = generate_one(code, settings)

        return NicknameDetail(
            nickname=nickname,
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
