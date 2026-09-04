"""The sentence generator itself.

Internal — `rand_sentence` is the public entry point, in both of its output forms.

A sentence is a subject and something said about it: what it does (`사자가 달린다`),
what it does it to (`여우가 사과를 먹는다`), or what it is like (`하늘은 파랗다`). The
nouns are the `word` category's pools, the same ones a nickname is built from;
everything a sentence needs beside them — a verb in the form a statement ends on, an
adjective in the form a predicate takes, the adverbs, and the shapes the grammar allows
— is `sentence/data`.

Two things keep the result readable rather than a pile of words. **The shapes belong to
the language**: `data.frames` writes them out in the language's own order, with the
particle or preposition each phrase needs, so Korean closes on its verb where English
puts it second, and a language whose articles cannot mark an object simply declares no
shape that has one. **A verb states what it can take**: `VerbGroup` names the noun
classes that can be its subject and its object, and the nouns are drawn from those
alone, which is why `여우가 사과를 먹는다` comes out and `여우가 철학을 먹는다` does
not — no tag on any noun, because `THEME_CLASS` already knows what a theme names.
"""

import random
from collections.abc import Sequence
from dataclasses import dataclass, field
from typing import cast

from randino._internal.generate import (
    collect,
    draw_language,
    length_bounds,
    resolve_length,
    resolve_prefix,
    resolve_realism,
)
from randino._internal.script import ends_with_consonant
from randino._internal.utils import chance, pick
from randino._types import (
    RandRealism,
    SentenceDetail,
    SentenceShapeOption,
    SentenceSlot,
    SentenceSlotOption,
    WordLanguage,
    WordLanguageOption,
    WordTheme,
    WordThemeOption,
)
from randino.constants import RAND_SENTENCE_LENGTH_MAX
from randino.sentence.data import SENTENCE_DATA, THEME_CLASS
from randino.sentence.data._types import (
    NounClass,
    SentenceFrame,
    SentenceLanguageData,
    SentencePart,
    StateGroup,
    VerbGroup,
)
from randino.word._generator import (
    agree,
    draw_word,
    modifier_follows,
    pick_word,
    pool_bounds,
    theme_of,
)
from randino.word.data import WORD_DATA, WORD_LANGUAGES, WORD_THEMES
from randino.word.data._types import WordGender, WordLanguageData, WordPool

FIT_ATTEMPTS = 14
"""How many sentences to build before settling for the closest fit found."""

MODIFY_CHANCE = 45
"""How often a noun phrase that may carry a modifier is given one.

Length can override it in both directions — see `_modify_chance_for`.
"""

NOUN_SLOTS: tuple[SentenceSlot, ...] = ("subject", "object", "place")
"""The slots that are a noun phrase, and so draw from the word pools."""


@dataclass(frozen=True, slots=True)
class Settings:
    """Everything a single sentence needs, with defaults already applied."""

    theme: WordThemeOption
    shape: SentenceShapeOption
    slots: tuple[SentenceSlot, ...] | str
    """The parts a shape may carry, normalized: `"all"`, `"none"`, or a set of them."""

    invent: int
    """How often one word is invented rather than drawn, as a percentage."""

    prefix: str
    include: tuple[str, ...]
    min_length: int | None = None
    max_length: int | None = None


# --- Shapes -----------------------------------------------------------------


def shape_of(frame: SentenceFrame) -> str:
    """How much a shape says, read off the shape itself rather than declared beside it.

    Two phrases is a subject and its predicate and nothing else; every phrase after that
    is one more thing the sentence has to say.
    """
    if len(frame.parts) <= 2:
        return "simple"

    return "detailed" if len(frame.parts) == 3 else "complex"


def _matches_slots(frame: SentenceFrame, slots: tuple[SentenceSlot, ...] | str) -> bool:
    """Whether a shape carries at least one of the parts the caller named.

    At least one rather than all of them, for the same reason a nickname's `slots` reads
    that way. `"none"` reads the other way round, and matches a sentence that is a
    subject and its predicate alone.
    """
    if slots == "none":
        return all(part.slot in ("subject", "verb", "state") for part in frame.parts)

    return any(part.slot in slots for part in frame.parts)


def _frames_for(data: SentenceLanguageData, settings: Settings) -> list[SentenceFrame]:
    """The shapes one sentence may take.

    Both filters fall back rather than fail: a language that has no shape carrying what
    was asked for answers with the closest it does have, the same best-effort a
    too-narrow length range gets.
    """
    by_slots = (
        list(data.frames)
        if settings.slots == "all"
        else [frame for frame in data.frames if _matches_slots(frame, settings.slots)]
    )
    allowed = by_slots or list(data.frames)

    if settings.shape == "all":
        return allowed

    by_shape = [frame for frame in allowed if shape_of(frame) == settings.shape]

    return by_shape or allowed


def _carries(data: SentenceLanguageData, settings: Settings) -> bool:
    """Whether a language has a shape that answers the request at all."""
    if settings.slots != "all" and not any(
        _matches_slots(frame, settings.slots) for frame in data.frames
    ):
        return False

    return settings.shape == "all" or any(
        shape_of(frame) == settings.shape for frame in data.frames
    )


def _languages_for(settings: Settings) -> tuple[WordLanguage, ...]:
    """The languages one draw may come from.

    `"all"` prefers the ones whose shapes answer the request, and — when words were
    required — the ones whose pools actually hold them. When none of them can, every
    language is back in play and each answers with its closest.
    """
    able = tuple(
        code
        for code in WORD_LANGUAGES
        if _carries(SENTENCE_DATA[code], settings)
        and all(_classify(code, word).known for word in settings.include)
    )

    if able:
        return able

    shaped = tuple(code for code in WORD_LANGUAGES if _carries(SENTENCE_DATA[code], settings))

    return shaped or WORD_LANGUAGES


# --- Required words ---------------------------------------------------------


@dataclass(frozen=True, slots=True)
class Requirement:
    """Where a required word can go, and what the generator knows about it.

    `slots` is a list rather than one entry, because a word can be more than one thing:
    English `brave` closes a sentence as a predicate and opens a noun phrase as a
    modifier, and which of the two it has to be depends on what the other required words
    need. Best first, and the shape takes the first that is still free.
    """

    word: str
    slots: tuple[SentenceSlot | None, ...]
    """The phrases it can fill. `None` stands for the modifier inside one."""

    theme: WordTheme | None = None
    known: bool = True


@dataclass(frozen=True, slots=True)
class Plan:
    """Which part of a shape each required word ends up in, by the part's index."""

    phrase: dict[int, Requirement] = field(default_factory=dict)
    modifier: dict[int, Requirement] = field(default_factory=dict)


def _entry_of(pool: WordPool, word: str) -> str | None:
    """The pool's own spelling of `word`, or None when the pool does not hold it.

    Matched without case, because English stores its pools capitalized and writes them
    lowercase inside a sentence — a caller who read `lion` out of one is asking for the
    same word the pool calls `Lion`.
    """
    lower = word.lower()

    for entry in pool:
        if entry.lower() == lower:
            return entry

    return None


def _classify(language: WordLanguage, word: str) -> Requirement:
    """What a required word is, judged by every pool it appears in."""
    lexicon = WORD_DATA[language]
    data = SENTENCE_DATA[language]
    slots: list[SentenceSlot | None] = []
    written = word
    theme: WordTheme | None = None

    for each in WORD_THEMES:
        entry = _entry_of(lexicon.nouns[each], word)

        if entry is not None:
            written = _plain(lexicon, entry)
            theme = each
            slots.append("subject")
            break

    for verbs in data.verbs:
        entry = _entry_of(verbs.words, word)

        if entry is not None:
            written = entry
            slots.append("verb")
            break

    for states in data.states:
        entry = _entry_of(states.words, word)

        if entry is not None:
            written = entry
            slots.append("state")
            break

    manner = _entry_of(data.manners, word)

    if manner is not None:
        written = manner
        slots.append("manner")

    time = _entry_of(data.times, word)

    if time is not None:
        written = time
        slots.append("time")

    modifier = _entry_of(lexicon.adjectives, word) or _entry_of(lexicon.actions, word)

    if modifier is not None:
        written = _plain(lexicon, modifier)
        slots.append(None)

    # A word from outside the pools is still a word the caller asked for. It goes
    # in as a noun, which is the one slot that takes any word without a form of
    # its own to be in.
    if not slots:
        return Requirement(word, ("subject",), known=False)

    return Requirement(written, tuple(slots), theme=theme)


def _plan_for(frame: SentenceFrame, requirements: Sequence[Requirement]) -> tuple[Plan, bool]:
    """Where each required word goes in this shape, and whether all of them fit.

    Greedy: a word takes the first of its own slots that is still free, which is enough
    because the lists are short and ordered by how specific the reading is.
    """
    plan = Plan()
    complete = True

    for requirement in requirements:
        placed = False

        for slot in requirement.slots:
            if slot is None:
                at = _free_modifier(frame, plan)

                if at < 0:
                    continue

                plan.modifier[at] = requirement
                placed = True
                break

            # A noun goes wherever a noun goes, so a required subject can land in
            # the object phrase of a shape whose subject is already spoken for.
            wanted = NOUN_SLOTS if slot in NOUN_SLOTS else (slot,)
            at = _free_phrase(frame, plan, wanted)

            if at < 0:
                continue

            plan.phrase[at] = requirement
            placed = True
            break

        complete = complete and placed

    return plan, complete


def _free_modifier(frame: SentenceFrame, plan: Plan) -> int:
    """The first phrase that may carry a modifier and has not been given one, or -1."""
    for index, part in enumerate(frame.parts):
        if part.modifiable and index not in plan.modifier:
            return index

    return -1


def _free_phrase(frame: SentenceFrame, plan: Plan, wanted: Sequence[SentenceSlot]) -> int:
    """The first phrase of one of `wanted` that no required word has taken, or -1."""
    for index, part in enumerate(frame.parts):
        if part.slot in wanted and index not in plan.phrase:
            return index

    return -1


def _required_at(frame: SentenceFrame, plan: Plan, slot: SentenceSlot) -> Requirement | None:
    """The word a shape's `slot` was required to use, if any."""
    for at, requirement in plan.phrase.items():
        if frame.parts[at].slot == slot:
            return requirement

    return None


# --- Pools and bounds -------------------------------------------------------

_NOUN_CACHE: dict[tuple[WordLanguage, WordTheme], WordPool] = {}
_BOUNDS_CACHE: dict[WordLanguage, dict[str, tuple[int, int]]] = {}


def _nouns_of(language: WordLanguage, theme: WordTheme) -> WordPool:
    """The nouns of one theme a sentence may use.

    A language that inflects leaves out the nouns with no singular: `ножницы` and
    `Jeans` would need a plural verb beside them, and a verb pool written twice over is
    a lot of data for a dozen words.
    """
    key = (language, theme)
    cached = _NOUN_CACHE.get(key)

    if cached is not None:
        return cached

    data = WORD_DATA[language]
    every = data.nouns[theme]
    gender = data.noun_gender
    pool = (
        every
        if gender is None
        else tuple(word for word in every if gender.get(word) not in ("p", "fp"))
    )
    usable = pool or every

    _NOUN_CACHE[key] = usable

    return usable


def _span(pools: Sequence[WordPool]) -> tuple[int, int]:
    """Shortest and longest word across several pools."""
    low = None
    high = 0

    for pool in pools:
        pool_low, pool_high = pool_bounds(pool)
        low = pool_low if low is None else min(low, pool_low)
        high = max(high, pool_high)

    return (low or 1, high or 1)


def _slot_bounds(language: WordLanguage) -> dict[str, tuple[int, int]]:
    """Shortest and longest word each kind of slot can contribute, over every theme."""
    cached = _BOUNDS_CACHE.get(language)

    if cached is not None:
        return cached

    data = SENTENCE_DATA[language]
    noun = _span([_nouns_of(language, theme) for theme in WORD_THEMES])
    bounds = {
        "subject": noun,
        "object": noun,
        "place": noun,
        "verb": _span([group.words for group in data.verbs]),
        "state": _span([group.words for group in data.states]),
        "manner": _span([data.manners]),
        "time": _span([data.times]),
        "modifier": pool_bounds(WORD_DATA[language].adjectives),
    }

    _BOUNDS_CACHE[language] = bounds

    return bounds


def _article_span(data: SentenceLanguageData) -> tuple[int, int]:
    """The longest and shortest article the language can open a phrase with."""
    if data.articles is None:
        return (0, 0)

    lengths = [len(article) for rules in data.articles.values() for _, article in rules]

    return (min(lengths, default=0), max(lengths, default=0))


def _tail_min(part: SentencePart) -> int:
    return min(len(part.tail), len(part.tail_alt) if part.tail_alt else len(part.tail))


def _tail_max(part: SentencePart) -> int:
    return max(len(part.tail), len(part.tail_alt))


def _part_range(
    part: SentencePart,
    data: SentenceLanguageData,
    bounds: dict[str, tuple[int, int]],
) -> tuple[int, int]:
    """What one part adds to the sentence, at its shortest and at its longest."""
    space = len(data.space)
    head = len(part.head) + space if part.head else 0
    low, high = bounds[part.slot]

    if part.slot not in NOUN_SLOTS:
        return (head + low + _tail_min(part), head + high + _tail_max(part))

    article_min, article_max = (0, 0) if part.bare else _article_span(data)
    modifier = bounds["modifier"][1] + space if part.modifiable else 0

    return (
        head + (article_min + space if article_min else 0) + low + _tail_min(part),
        head + (article_max + space if article_max else 0) + modifier + high + _tail_max(part),
    )


def _frame_range(
    frame: SentenceFrame,
    data: SentenceLanguageData,
    bounds: dict[str, tuple[int, int]],
) -> tuple[int, int]:
    """Shortest and longest sentence a shape can produce."""
    low = len(data.terminator)
    high = low

    for index, part in enumerate(frame.parts):
        gap = 0 if index == 0 else len(data.space)
        part_low, part_high = _part_range(part, data, bounds)

        low += gap + part_low
        high += gap + part_high

    return (low, high)


def natural_range(language: WordLanguage) -> tuple[int, int]:
    """Every sentence length the language can produce.

    The fallback for an omitted `min_length` / `max_length`, and what
    `sentence_length_range` reports. Derived from the same frames and pools the
    generator draws from.

    Args:
        language: The language to measure.

    Returns:
        The shortest and the longest sentence it can write.
    """
    data = SENTENCE_DATA[language]
    bounds = _slot_bounds(language)
    low = None
    high = 0

    for frame in data.frames:
        frame_low, frame_high = _frame_range(frame, data, bounds)
        low = frame_low if low is None else min(low, frame_low)
        high = max(high, frame_high)

    return (low or 1, high)


# --- Choosing the words -----------------------------------------------------


def _themes_for_classes(
    themes: Sequence[WordTheme],
    classes: Sequence[NounClass],
) -> tuple[WordTheme, ...]:
    """The themes among `themes` whose nouns are one of `classes`."""
    return tuple(theme for theme in themes if THEME_CLASS[theme] in classes)


def _pick_frame(frames: Sequence[SentenceFrame]) -> SentenceFrame:
    """One shape, drawn in proportion to the weights the language gave them."""
    total = sum(frame.weight for frame in frames)
    roll = random.random() * total

    for frame in frames:
        roll -= frame.weight

        if roll <= 0:
            return frame

    return frames[-1]


def _verb_groups_for(
    data: SentenceLanguageData,
    frame: SentenceFrame,
    themes: Sequence[WordTheme],
    plan: Plan,
) -> list[VerbGroup]:
    """The verb groups one sentence may use.

    Transitive exactly when the shape has an object, able to take the subject the shape
    will be given, and — when a word was required — the group that word belongs to.
    """
    wants_object = any(part.slot == "object" for part in frame.parts)
    subject = _required_at(frame, plan, "subject")
    obj = _required_at(frame, plan, "object")
    verb = _required_at(frame, plan, "verb")
    usable = []

    for group in data.verbs:
        if (group.object is not None) != wants_object:
            continue
        if verb is not None and verb.word not in group.words:
            continue
        if (
            subject is not None
            and subject.theme is not None
            and THEME_CLASS[subject.theme] not in group.subject
        ):
            continue
        if (
            obj is not None
            and obj.theme is not None
            and (group.object is None or THEME_CLASS[obj.theme] not in group.object)
        ):
            continue
        if not _themes_for_classes(themes, group.subject):
            continue
        if group.object is not None and not _themes_for_classes(WORD_THEMES, group.object):
            continue

        usable.append(group)

    return usable


def _state_groups_for(
    data: SentenceLanguageData,
    themes: Sequence[WordTheme],
    frame: SentenceFrame,
    plan: Plan,
) -> list[StateGroup]:
    """The same, for a shape headed by an adjective rather than a verb."""
    subject = _required_at(frame, plan, "subject")
    state = _required_at(frame, plan, "state")
    usable = []

    for group in data.states:
        if state is not None and state.word not in group.words:
            continue
        if (
            subject is not None
            and subject.theme is not None
            and THEME_CLASS[subject.theme] not in group.subject
        ):
            continue
        if not _themes_for_classes(themes, group.subject):
            continue

        usable.append(group)

    return usable


# --- Building one sentence --------------------------------------------------


@dataclass(frozen=True, slots=True)
class Phrase:
    """One noun phrase, and the noun it was built around."""

    text: str
    noun: str
    theme: WordTheme | None


@dataclass(frozen=True, slots=True)
class Built:
    """One finished sentence, before it becomes a detail."""

    sentence: str
    phrases: tuple[str, ...]
    slots: tuple[SentenceSlot, ...]
    theme: WordTheme | None


def _article_for(data: SentenceLanguageData, gender: WordGender | None, following: str) -> str:
    """The article a phrase opens with, by the noun's gender and the word after it."""
    if data.articles is None:
        return ""

    rules = data.articles.get(gender or "n") or data.articles.get("n")

    if rules is None:
        return ""

    lower = following.lower()

    for prefix, article in rules:
        if lower.startswith(prefix):
            return article

    return ""


def _plain(data: WordLanguageData, word: str) -> str:
    """A word as a sentence writes it — English stores its pools capitalized."""
    return word[:1].lower() + word[1:] if data.capitalize else word


def _as_pool(data: WordLanguageData, word: str) -> str:
    """The other way round, for looking a written word back up in the pools."""
    return _upper(word) if data.capitalize else word


def _upper(word: str) -> str:
    return word[:1].upper() + word[1:]


def _noun_phrase(
    language: WordLanguage,
    data: SentenceLanguageData,
    theme: WordTheme,
    *,
    forced: str | None,
    modify: bool,
    bare: bool,
    forced_modifier: str | None,
    invent: int,
    prefix: str,
    low: int,
    high: int,
) -> Phrase:
    """Build one noun phrase: an article, the noun, and a modifier where there is room.

    `low` and `high` are what the whole phrase has to land in. The article is reserved
    before the noun is drawn — its length is not known until the noun's gender is, so
    the longest one the language has is what gets set aside — and whatever the noun
    leaves over is what the modifier is drawn to fit.
    """
    lexicon = WORD_DATA[language]
    pool = _nouns_of(language, theme)
    space = len(data.space)
    _, noun_max = pool_bounds(pool)
    mod_min, mod_max = pool_bounds(lexicon.adjectives)
    _, article_max = (0, 0) if bare else _article_span(data)
    overhead = article_max + space if article_max else 0
    mod_cost = mod_min + space if modify else 0
    noun_high = max(1, min(noun_max, high - overhead - mod_cost))
    noun_low = max(1, low - overhead - (mod_max + space if modify else 0))
    drawn = forced or _plain(
        lexicon,
        draw_word(lexicon, pool, invent, min(noun_low, noun_high), noun_high, prefix).word,
    )
    gender = (
        None if lexicon.noun_gender is None else lexicon.noun_gender.get(_as_pool(lexicon, drawn))
    )
    parts = [drawn]

    if modify:
        room = high - overhead - len(drawn) - space
        want = low - overhead - len(drawn) - space
        chosen = forced_modifier or _plain(
            lexicon,
            pick_word(lexicon.adjectives, max(1, min(want, room)), max(1, min(mod_max, room)), "")
            or pick(lexicon.adjectives),
        )
        modifier = agree(lexicon, chosen, gender)

        if modifier_follows(lexicon):
            parts.append(modifier)
        else:
            parts.insert(0, modifier)

    article = "" if bare else _article_for(data, gender, parts[0])
    # An elided article carries its own boundary — `l'orso`, never `l' orso`.
    text = (
        article + data.space.join(parts)
        if article.endswith("'")
        else data.space.join(([article] if article else []) + parts)
    )

    return Phrase(
        text,
        drawn,
        # Compared in the form the sentence writes rather than the form the pool
        # stores, which is the same word for every language but English.
        theme
        if any(_plain(lexicon, entry) == drawn for entry in pool)
        else theme_of(lexicon, _as_pool(lexicon, drawn)),
    )


def _tail_of(part: SentencePart, phrase: str) -> str:
    """The particle a part writes after its phrase, in the form the phrase asks for."""
    if part.tail_alt and ends_with_consonant(phrase):
        return part.tail_alt

    return part.tail


def _modify_chance_for(distance: int, too_long: bool) -> int:
    """How often a noun phrase carries a modifier on this attempt.

    The first attempt leaves it to chance; after that, a sentence that overshot the
    range drops its modifiers and one that fell short takes them everywhere, which is
    how the length range picks the shape rather than truncating a word.
    """
    if distance == 0:
        return MODIFY_CHANCE

    return 0 if too_long else 100


def _theme_for_part(
    slot: SentenceSlot,
    object_classes: Sequence[NounClass] | None,
    themes: Sequence[WordTheme],
) -> WordTheme:
    """The theme a phrase other than the subject draws from."""
    if slot == "object":
        usable = _themes_for_classes(WORD_THEMES, object_classes or ())

        return pick(usable or WORD_THEMES)

    places = _themes_for_classes(WORD_THEMES, ("place",))

    return pick(places or tuple(themes))


def _predicate_for(
    slot: SentenceSlot,
    lexicon: WordLanguageData,
    data: SentenceLanguageData,
    predicates: WordPool,
    required: Requirement | None,
    gender: WordGender | None,
    low: int,
    high: int,
) -> str:
    """The word a phrase that is not a noun phrase writes: the predicate, or an adverb."""

    def agreed(word: str) -> str:
        if slot == "state" and data.predicate_agrees:
            return agree(lexicon, word, gender)

        return word

    if required is not None:
        return agreed(required.word)

    pool = data.manners if slot == "manner" else data.times if slot == "time" else predicates

    return agreed(pick_word(pool, min(low, high), high, "") or pick(pool))


def _compose(
    language: WordLanguage,
    data: SentenceLanguageData,
    frame: SentenceFrame,
    plan: Plan,
    requested: Sequence[WordTheme],
    settings: Settings,
    modify_chance: int,
    bounds: dict[str, tuple[int, int]],
    low: int,
    high: int,
) -> Built:
    """Fill a shape and write it out.

    The predicate is settled first, because it is what decides which nouns can stand
    beside it. The phrases themselves are then drawn in the order the frame gives, each
    one against the room left once the phrases behind it have reserved their shortest —
    which is how a narrow range drops a modifier rather than overshooting a word, and
    how the subject's gender is in hand before the adjective that has to agree with it.
    """
    lexicon = WORD_DATA[language]
    themes = tuple(requested) or WORD_THEMES
    headed = any(part.slot == "state" for part in frame.parts)
    wants_object = any(part.slot == "object" for part in frame.parts)
    # A shape whose predicate has nothing to say about the requested subject only
    # gets this far when no shape of the language did, so the fallback is the same
    # best effort every other narrowing here makes.
    state_group: StateGroup | None = None
    verb_group: VerbGroup | None = None

    if headed:
        states = _state_groups_for(data, themes, frame, plan) or list(data.states)
        state_group = pick(states)
        subject_classes = state_group.subject
        predicates = state_group.words
    else:
        verbs = _verb_groups_for(data, frame, themes, plan) or [
            group for group in data.verbs if (group.object is not None) == wants_object
        ]
        verb_group = pick(verbs)
        subject_classes = verb_group.subject
        predicates = verb_group.words

    subject_themes = _themes_for_classes(themes, subject_classes)
    subject_required = _required_at(frame, plan, "subject")
    # A theme the caller named is honoured even when no verb group of the language
    # has anything to say about it, the same way a shape it cannot make falls back
    # rather than being answered with something else entirely.
    subject_theme = (
        subject_required.theme
        if subject_required is not None and subject_required.theme is not None
        else pick(subject_themes or themes)
    )
    # Only a shape that opens on a noun phrase with nothing in front of it can
    # honour `starts_with`; anywhere else the sentence opens on an article, a
    # preposition or an adverbial, and `collect` filters what does not match.
    first = frame.parts[0]
    prefixable = first.slot in NOUN_SLOTS and not first.head and data.articles is None
    space = len(data.space)
    spans = [
        (
            (0 if index == 0 else space) + part_low,
            (0 if index == 0 else space) + part_high,
        )
        for index, (part_low, part_high) in enumerate(
            _part_range(part, data, bounds) for part in frame.parts
        )
    ]
    written: list[str] = []
    reported: list[str] = []
    slots: list[SentenceSlot] = []
    subject: Phrase | None = None
    gender: WordGender | None = None
    used = len(data.terminator)

    for index, part in enumerate(frame.parts):
        rest_min = sum(span[0] for span in spans[index + 1 :])
        rest_max = sum(span[1] for span in spans[index + 1 :])
        gap = 0 if index == 0 else space
        head_cost = len(part.head) + space if part.head else 0
        overhead = gap + head_cost + _tail_min(part)
        part_high = max(1, high - used - overhead - rest_min)
        part_low = max(1, low - used - overhead - rest_max)

        if part.slot in NOUN_SLOTS:
            required = plan.phrase.get(index)
            owed = plan.modifier.get(index)
            theme = (
                subject_theme
                if part.slot == "subject"
                else (
                    required.theme
                    if required is not None and required.theme is not None
                    else _theme_for_part(
                        part.slot,
                        verb_group.object if verb_group is not None else None,
                        themes,
                    )
                )
            )
            room = part_high - pool_bounds(_nouns_of(language, theme))[0]
            modify = part.modifiable and (
                owed is not None
                or (room >= bounds["modifier"][0] + space and chance(modify_chance))
            )
            built = _noun_phrase(
                language,
                data,
                theme,
                forced=required.word if required is not None else None,
                modify=modify,
                bare=part.bare,
                forced_modifier=owed.word if owed is not None else None,
                invent=settings.invent,
                prefix=settings.prefix if prefixable and index == 0 else "",
                low=part_low,
                high=part_high,
            )
            phrase = built.text

            if part.slot == "subject":
                subject = built
                gender = (
                    None
                    if lexicon.noun_gender is None
                    else lexicon.noun_gender.get(_as_pool(lexicon, built.noun))
                )
        else:
            phrase = _predicate_for(
                part.slot,
                lexicon,
                data,
                predicates,
                plan.phrase.get(index),
                gender,
                part_low,
                part_high,
            )

        # The opening capital belongs to whatever is written first, and that is the
        # phrase itself unless a preposition stands in front of it. Applied here
        # rather than to the finished string, so the phrase the detail reports is
        # the one the sentence actually shows.
        opens = data.capitalize and not written
        head = _upper(part.head) if opens and part.head else part.head
        text = _upper(phrase) if opens and not part.head else phrase
        tail = _tail_of(part, text)

        if head:
            written.append(head)

        written.append(text + tail)
        reported.append(text)
        slots.append(part.slot)
        used += gap + head_cost + len(text) + len(tail)

    return Built(
        data.space.join(written) + data.terminator,
        tuple(reported),
        tuple(slots),
        subject.theme if subject is not None else None,
    )


def _bounds_for(
    data: SentenceLanguageData,
    frames: Sequence[SentenceFrame],
    bounds: dict[str, tuple[int, int]],
    settings: Settings,
) -> tuple[int, int]:
    """The length range one sentence has to land in."""
    natural_low = None
    natural_high = 0

    for frame in frames:
        frame_low, frame_high = _frame_range(frame, data, bounds)
        natural_low = frame_low if natural_low is None else min(natural_low, frame_low)
        natural_high = max(natural_high, frame_high)

    return length_bounds(
        settings.min_length,
        settings.max_length,
        natural_low or 1,
        natural_high,
        RAND_SENTENCE_LENGTH_MAX,
    )


def _generate_one(language: WordLanguage, settings: Settings) -> Built:
    """Build one sentence, as close to what was asked for as the language allows."""
    data = SENTENCE_DATA[language]
    bounds = _slot_bounds(language)
    allowed = _frames_for(data, settings)
    requested = WORD_THEMES if settings.theme == "all" else (settings.theme,)
    requirements = [_classify(language, word) for word in settings.include]
    plans = {id(frame): _plan_for(frame, requirements) for frame in allowed}
    low, high = _bounds_for(data, allowed, bounds, settings)

    def buildable(frame: SentenceFrame) -> bool:
        # A shape is only worth drawing when the language has a predicate for it:
        # a `body` subject has no transitive verb in any language here, so a shape
        # with an object in it would have to fall back to a verb that means
        # something else.
        plan, complete = plans[id(frame)]

        if not complete:
            return False

        if any(part.slot == "state" for part in frame.parts):
            return bool(_state_groups_for(data, requested, frame, plan))

        return bool(_verb_groups_for(data, frame, requested, plan))

    # Prefer a shape that can land inside the range, then one that has somewhere to
    # put every word the caller required, and settle for any of them after that.
    fitting = [
        frame
        for frame in allowed
        if _frame_range(frame, data, bounds)[1] >= low
        and _frame_range(frame, data, bounds)[0] <= high
        and buildable(frame)
    ]
    loose = [frame for frame in allowed if buildable(frame)]
    usable = fitting or loose or allowed
    best: Built | None = None
    best_distance = None
    best_too_long = False

    for attempt in range(FIT_ATTEMPTS):
        frame = _pick_frame(usable)
        built = _compose(
            language,
            data,
            frame,
            plans[id(frame)][0],
            requested,
            settings,
            _modify_chance_for(0 if attempt == 0 else (best_distance or 0), best_too_long),
            bounds,
            low,
            high,
        )
        length = len(built.sentence)

        if low <= length <= high:
            return built

        over = length - high
        distance = over if over > 0 else low - length

        if best_distance is None or distance < best_distance:
            best_distance = distance
            best_too_long = over > 0
            best = built

    return cast("Built", best)


def _resolve_slots(slots: SentenceSlotOption) -> tuple[SentenceSlot, ...] | str:
    """The caller's `slots`, in the form the generator wants.

    One slot becomes a one-entry set, and an empty sequence asks the same thing `"none"`
    does, since neither leaves any part allowed beside the subject.
    """
    if slots in ("all", "none"):
        return cast("str", slots)

    wanted = (slots,) if isinstance(slots, str) else tuple(slots)

    return cast("tuple[SentenceSlot, ...]", wanted) if wanted else "none"


def generate_sentence_details(
    *,
    language: WordLanguageOption = "all",
    theme: WordThemeOption = "all",
    shape: SentenceShapeOption = "all",
    slots: SentenceSlotOption = "all",
    include: str | Sequence[str] = (),
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
) -> list[SentenceDetail]:
    """Generate sentences with every choice already resolved.

    Args:
        language: Language of the generated sentences.
        theme: What the sentence's subject is about.
        shape: How much the sentence says.
        slots: Which parts a shape may carry beside its subject.
        include: Words the sentence has to contain, each at least once.
        count: How many sentences to return.
        realism: Whether the words are real ones or invented to read like the language.
        min_length: Minimum length in characters.
        max_length: Maximum length in characters.
        starts_with: Keep only sentences whose first character is this one.
        unique: Never return the same sentence twice.

    Returns:
        One `SentenceDetail` per sentence.
    """
    listed = (include,) if isinstance(include, str) else tuple(include)
    settings = Settings(
        theme=theme,
        shape=shape,
        slots=_resolve_slots(slots),
        invent=resolve_realism(realism),
        min_length=resolve_length(min_length),
        max_length=resolve_length(max_length),
        prefix=resolve_prefix(starts_with),
        include=tuple(word.strip() for word in listed if word.strip()),
    )

    def draw() -> SentenceDetail:
        code = draw_language(language, _languages_for(settings))
        built = _generate_one(code, settings)

        return SentenceDetail(
            sentence=built.sentence,
            phrases=built.phrases,
            slots=built.slots,
            language=code,
            theme=built.theme,
        )

    return collect(
        count=count,
        unique=unique,
        starts_with=settings.prefix,
        draw=draw,
        key_of=lambda detail: detail.sentence,
    )
