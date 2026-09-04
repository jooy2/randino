"""The word generator, and the primitives the nickname generator builds on.

A word is one entry of one theme's pool — an animal, a thing, something in nature —
or an invented one that only reads like the language. That is the whole of
`rand_word`; a nickname is what you get when several of these are put together, which
is why the drawing lives here and the composing lives in `nickname/_generator.py`.
"""

import math
from collections.abc import Sequence
from typing import Literal, NamedTuple

from randino._internal.generate import (
    collect,
    draw_language,
    length_bounds,
    resolve_prefix,
    resolve_realism,
)
from randino._internal.utils import capitalize_first, chance, clamp, pick, rand_int
from randino._types import (
    ModifierKind,
    RandRealism,
    WordDetail,
    WordLanguage,
    WordLanguageOption,
    WordTheme,
    WordThemeOption,
)
from randino.word.data import WORD_DATA, WORD_LANGUAGES, WORD_THEMES
from randino.word.data._types import (
    PoolSynthesis,
    SyllableSynthesis,
    WordGender,
    WordLanguageData,
    WordPool,
    WordSynthesis,
)

FIT_ATTEMPTS = 12
"""Themes to try before settling for the closest word found."""


def modifiers_of(data: WordLanguageData, kind: ModifierKind | Literal["all"] = "all") -> WordPool:
    """Return the decorating pool one draw may use.

    A word for what the noun is like, one for what it is doing, or either. Built per
    call: every draw already walks the pool it is given, so holding this one would save
    nothing worth the bookkeeping.
    """
    if kind == "adjective":
        return data.adjectives

    return data.actions if kind == "action" else (*data.adjectives, *data.actions)


def agree(data: WordLanguageData, word: str, gender: WordGender | None) -> str:
    """Return a modifier reshaped to agree with a noun of `gender`.

    The first rule whose ending matches wins; a word none of them match is already
    right, which is how Spanish `azul` stays `azul` beside both `gato` and `luna`. A
    language with no agreement hands the word straight back.
    """
    rules = data.agreement.get(gender) if gender and data.agreement else None

    if not rules:
        return word

    for ending, replacement in rules:
        if word.endswith(ending):
            return word[: len(word) - len(ending)] + replacement

    return word


def modifier_follows(data: WordLanguageData) -> bool:
    """Whether a modifier follows the noun rather than leading it.

    The language's own frames already say so: Vietnamese writes `mèo xanh`, the rest
    write `파란 고양이`. Read from the frames rather than declared beside them, so a
    language cannot state one order and compose in the other.
    """
    for frame in data.frames:
        if "noun" in frame.slots and "adjective" in frame.slots:
            return frame.slots.index("adjective") > frame.slots.index("noun")

    return False


def _piece_span(pool: Sequence[str]) -> tuple[int, int]:
    """Shortest and longest entry of a pool, counting an empty entry as the zero it is.

    `pool_bounds` answers the same question for a pool of words, where an empty result
    would mean nothing; a coda pool holds `""` on purpose.
    """
    if not pool:
        return 0, 0

    return min(len(entry) for entry in pool), max(len(entry) for entry in pool)


def _syllable_span(syn: SyllableSynthesis, count: int) -> tuple[int, int]:
    """What a word of `count` syllables can be, at its shortest and at its longest."""
    onset_low, onset_high = _piece_span(syn.onset)
    vowel_low, vowel_high = _piece_span(syn.vowel)
    coda_low, coda_high = _piece_span(syn.coda)

    return (
        count * (onset_low + vowel_low) + coda_low,
        count * (onset_high + vowel_high) + coda_high,
    )


def synth_bounds(syn: WordSynthesis) -> tuple[int, int]:
    """Shortest and longest word the invention template can make.

    The same question `pool_bounds` answers about a pool. What a caller asking for an
    invented word can be given is decided here rather than by the pools, and a length
    budget measured against the pools is wrong by however far the two differ — English
    invents at most two syllables where its pools hold words of twelve letters.

    Args:
        syn: The language's invention template.

    Returns:
        The shortest and the longest word it can spell.
    """
    if isinstance(syn, PoolSynthesis):
        # One entry is one character, so the length is the number of entries.
        return max(1, syn.min_syllables), max(1, syn.max_syllables)

    low, _ = _syllable_span(syn, syn.min_syllables)
    _, high = _syllable_span(syn, syn.max_syllables)

    return max(1, low), max(1, high)


def _fitting_piece(pool: Sequence[str], low: int, high: int) -> str:
    """One piece of an invented word, as close to the room left for it as the pool allows."""
    fitting = [entry for entry in pool if low <= len(entry) <= high]

    if fitting:
        return pick(fitting)

    # Every piece that comes equally close, not the first of them: a room no piece fits
    # is the common case at the ends of a range, and taking the first turned every such
    # word into the same one.
    closest: list[str] = []
    best_distance = math.inf

    for entry in pool:
        distance = low - len(entry) if len(entry) < low else max(0, len(entry) - high)

        if distance < best_distance:
            best_distance = distance
            closest = [entry]
        elif distance == best_distance:
            closest.append(entry)

    return pick(closest) if closest else ""


def pool_bounds(pool: WordPool) -> tuple[int, int]:
    """Shortest and longest word in a pool."""
    if not pool:
        return 1, 1

    return min(len(word) for word in pool), max(len(word) for word in pool)


def themes_of(theme: WordThemeOption) -> tuple[WordTheme, ...]:
    """The themes one draw may use."""
    return WORD_THEMES if theme == "all" else (theme,)


def gender_of(data: WordLanguageData, word: str) -> WordGender | None:
    """The gender a word is taken to have, for languages whose articles and modifiers ask.

    The pools carry it word by word, and an invented word is in none of them — so a word
    the pools do not hold is read by its ending instead, which is what the language
    itself does. Without that, Spanish and Italian write no article at all in front of
    an invented noun (they declare theirs under `m` and `f` alone) and every language
    that inflects hands back the base form of its modifier.

    A made-up word has no true gender. What this buys is an article and an adjective
    that agree with each other.

    Args:
        data: The language's dataset.
        word: The word to judge.

    Returns:
        Its gender, or None for a language that does not ask.
    """
    known = None if data.noun_gender is None else data.noun_gender.get(word)

    if known is not None:
        return known

    if data.gender_rules is None:
        return None

    lower = word.lower()

    for ending, gender in data.gender_rules:
        if lower.endswith(ending):
            return gender

    return None


def pool_capitalizes(pool: WordPool) -> bool:
    """Whether a pool writes its own entries with a capital.

    That is what an invented word standing in for one has to match. Read off the pool
    rather than declared beside it, for the same reason `modifier_follows` reads the
    frames: German capitalizes its nouns and nothing else, so `capitalize` on the
    language would capitalize its modifiers too, and a second field saying so could
    contradict the pool it describes. The first entry with a case to it answers for all
    of them — no pool of any language here is written both ways.

    Args:
        pool: The pool to judge.

    Returns:
        True when its entries open on a capital.
    """
    for entry in pool:
        first = entry[:1]

        if first.lower() != first.upper():
            return first == first.upper()

    return False


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

    # Built against the length rather than sampled until something fits. Drawing each
    # piece at random and re-rolling the whole word missed a third of the exact lengths
    # English, Spanish, Italian, German and Russian were asked for: the shortest and the
    # longest word a template can spell need every piece to come out that way at once,
    # which random sampling almost never does.
    counts = [
        count
        for count in range(syn.min_syllables, syn.max_syllables + 1)
        if _syllable_span(syn, count)[1] >= low and _syllable_span(syn, count)[0] <= high
    ]
    syllables = pick(counts) if counts else rand_int(syn.min_syllables, syn.max_syllables)
    # The pieces the word is spelled out of, in order. A requested first character stands
    # in for the opening onset, which is what makes `starts_with` work.
    pieces: list[Sequence[str]] = []

    for index in range(syllables):
        pieces.append([prefix.lower()] if index == 0 and prefix else syn.onset)
        pieces.append(syn.vowel)

    pieces.append(syn.coda)

    # What the pieces after each one can still add, so a piece is only chosen from the
    # lengths that leave the rest of the word able to land in the range.
    rest_low = [0] * (len(pieces) + 1)
    rest_high = [0] * (len(pieces) + 1)

    for index in range(len(pieces) - 1, -1, -1):
        piece_low, piece_high = _piece_span(pieces[index])
        rest_low[index] = piece_low + rest_low[index + 1]
        rest_high[index] = piece_high + rest_high[index + 1]

    word = ""

    for index, piece in enumerate(pieces):
        word += _fitting_piece(
            piece,
            low - len(word) - rest_high[index + 1],
            high - len(word) - rest_low[index + 1],
        )

    return word


class Drawn(NamedTuple):
    """One word, and whether it had to be invented against the caller's wishes."""

    word: str

    missed: bool
    """The word had to be invented because no real one started with the requested
    character — worth another theme before settling for it."""


def draw_word(
    data: WordLanguageData,
    pool: WordPool,
    invent: int,
    low: int,
    high: int,
    prefix: str,
) -> Drawn:
    """Draw one word from `pool`, or invent one `invent` percent of the time."""
    made = chance(invent)
    word = None if made else pick_word(pool, low, high, prefix)
    chosen = word if word is not None else synth_word(data.syn, low, high, prefix)

    # An invented word is written the way the pool it stands in for is written, which is
    # how a German one comes out `Biefreum` rather than `biefreum` beside the `Klugheit`
    # and `Bettdecke` of the pools.
    capitalized = data.capitalize or pool_capitalizes(pool)

    return Drawn(
        capitalize_first(chosen) if capitalized else chosen,
        not made and word is None,
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
    invent: int
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
        word, missed = draw_word(data, pool, settings.invent, low, high, settings.prefix)
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
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
) -> list[WordDetail]:
    """Generate `count` words, applied to every option the caller passed."""
    settings = Settings(
        theme=theme,
        invent=resolve_realism(realism),
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
