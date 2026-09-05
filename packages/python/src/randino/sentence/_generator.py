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
from collections.abc import Callable, Sequence
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
from randino._internal.utils import chance, clamp, pick
from randino._types import (
    RandRealism,
    SentenceDetail,
    SentenceQuote,
    SentenceShapeOption,
    SentenceSlot,
    SentenceSlotOption,
    SentenceStyle,
    SentenceType,
    SentenceTypeOption,
    WordLanguage,
    WordLanguageOption,
    WordTheme,
    WordThemeOption,
)
from randino.constants import RAND_SENTENCE_COUNT_MAX, RAND_SENTENCE_LENGTH_MAX
from randino.name._generator import draw_name
from randino.name.name_length_range import name_length_range
from randino.sentence.data import SENTENCE_DATA, THEME_CLASS
from randino.sentence.data._types import (
    NounClass,
    SentenceFrame,
    SentenceLanguageData,
    SentenceMark,
    SentenceMood,
    SentencePart,
    StateGroup,
    VerbGroup,
)
from randino.word._generator import (
    agree,
    draw_word,
    gender_of,
    modifier_follows,
    pick_word,
    pool_bounds,
    synth_bounds,
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
    sentences: int
    """How many sentences one result holds, clamped."""

    realism: RandRealism
    """The same thing `invent` is, in the form `rand_name` takes it.

    A sentence that writes a person's name hands the name generator the level the
    caller asked for.
    """

    include_name: bool
    """Whether a phrase about a person is written as a name."""

    types: tuple[SentenceType, ...]
    """What the sentences may be doing, normalized to a set to draw from."""

    quote: SentenceQuote | None
    """Which marks a quoted line takes, or None for the type's own default."""

    style: SentenceStyle
    """How the sentences address their reader."""

    min_length: int | None = None
    max_length: int | None = None


QUOTED_MARKS: tuple[SentenceMark, ...] = ("statement", "question", "exclamation")
"""The kinds a quoted line can be.

Somebody speaking is as often asking as telling, and often enough neither, so the mark
is drawn rather than fixed.
"""


def _mark_for(type_: SentenceType) -> SentenceMark:
    """The kind whose mark a sentence of this type closes on.

    Dialogue and thought have no mark of their own: what they quote is a sentence of
    another kind, and they take its mark and put quotation marks around it.

    Args:
        type_: What the caller asked for.

    Returns:
        The kind whose mark the sentence closes on.
    """
    if type_ in ("dialogue", "thought"):
        return pick(QUOTED_MARKS)

    return cast("SentenceMark", type_)


def _quote_for(
    data: SentenceLanguageData, type_: SentenceType, override: SentenceQuote | None
) -> tuple[str, str] | None:
    """The marks a quoted line is wrapped in, or None when nothing is quoted.

    Args:
        data: The language's sentence dataset.
        type_: What the caller asked for.
        override: The caller's `quote`, if any.

    Returns:
        The pair of marks, or None.
    """
    if type_ not in ("dialogue", "thought"):
        return None

    return data.quotes[override or ("double" if type_ == "dialogue" else "single")]


def _mood_for(mark: SentenceMark) -> SentenceMood:
    """The one thing a shape has to match to answer a kind."""
    return "question" if mark == "question" else "statement"


@dataclass(frozen=True, slots=True)
class Draw:
    """Everything one sentence of a result is drawn against.

    The room it has, what it is doing, what it opens on, and — after the first — what
    it is about.
    """

    budget: tuple[int, int]
    type: SentenceType
    """What the caller asked for, and what the detail reports."""

    mark: SentenceMark
    """The kind whose mark it closes on — its own, or the one it is quoting."""

    quote: tuple[str, str] | None
    """The quotation marks it is wrapped in, or None."""

    opener: str
    """A connective or an interjection, `""` for neither."""

    follow: "Follow | None"


@dataclass(frozen=True, slots=True)
class Topic:
    """What the sentences of one result are about.

    The first sentence's subject, and everything a later one needs to keep talking
    about it. A paragraph is not three draws, and this is the whole of the difference:
    the class is what a fresh subject stays inside, the noun is what naming it again
    writes, and the gender is what a pronoun and an agreeing predicate need.
    """

    noun: str
    """The subject noun as the first sentence wrote it."""

    theme: WordTheme | None
    noun_class: NounClass | None
    """The class its theme falls into. None when the noun is one no pool holds."""

    gender: WordGender | None
    named: bool
    """Whether that noun is a person's name, which is written bare wherever it goes."""


@dataclass(frozen=True, slots=True)
class Follow:
    """Everything a sentence after the first one is built with.

    `reference` says how it refers to what the two of them are about: `"repeat"` names
    the topic again, `"pronoun"` stands in for it — with the empty string where the
    language drops its subject — and `"fresh"` draws another noun of the same class.
    """

    topic: Topic
    reference: str
    pronoun: str
    """What a `"pronoun"` reference writes; `""` where the language writes nothing."""


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


def _frames_for(
    data: SentenceLanguageData, settings: Settings, mood: SentenceMood
) -> list[SentenceFrame]:
    """The shapes one sentence may take.

    Every filter falls back rather than fails: a language that has no shape carrying
    what was asked for answers with the closest it does have, the same best-effort a
    too-narrow length range gets. A language that writes its question with the mark
    alone declares no question shape, and answers with the statement shapes it does
    have — that is not a fallback so much as the point: `¿El león corre?` is the
    statement.
    """
    by_mood = [frame for frame in data.frames if frame.mood == mood]
    moody = by_mood or [frame for frame in data.frames if frame.mood == "statement"]
    usable = moody or list(data.frames)
    by_slots = (
        usable
        if settings.slots == "all"
        else [frame for frame in usable if _matches_slots(frame, settings.slots)]
    )
    allowed = by_slots or usable

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


def _plan_for(
    frame: SentenceFrame,
    requirements: Sequence[Requirement],
    subject: Requirement | None = None,
) -> tuple[Plan, bool]:
    """Where each required word goes in this shape, and whether all of them fit.

    Greedy: a word takes the first of its own slots that is still free, which is enough
    because the lists are short and ordered by how specific the reading is. A sentence
    carrying on about the topic is handed its `subject` rather than asking for it, so
    that goes in the subject's own phrase before the greedy placement reaches for the
    first noun slot it can find.
    """
    plan = Plan()
    complete = True

    if subject is not None:
        for index, part in enumerate(frame.parts):
            if part.slot == "subject":
                plan.phrase[index] = subject
                break

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
_SPAN_CACHE: dict[tuple[WordLanguage, WordTheme, int], tuple[int, int]] = {}
_AGREED_CACHE: dict[tuple[WordLanguage, WordGender], WordPool] = {}


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


def _noun_span(language: WordLanguage, theme: WordTheme, invent: int) -> tuple[int, int]:
    """Shortest and longest noun one phrase can actually be given.

    Not the same question `pool_bounds` answers: at `realism="invented"` the word comes
    out of the language's syllable template rather than its pools, and English invents
    at most two syllables where its pools hold words of twelve letters. A budget
    measured against the wrong one of those is a `min_length` the phrase cannot reach.
    """
    key = (language, theme, invent)
    cached = _SPAN_CACHE.get(key)

    if cached is not None:
        return cached

    pool_low, pool_high = pool_bounds(_nouns_of(language, theme))
    syn_low, syn_high = synth_bounds(WORD_DATA[language].syn)

    if invent >= 100:
        span = (syn_low, syn_high)
    elif invent <= 0:
        span = (pool_low, pool_high)
    else:
        # `"mixed"` draws from both, so both lengths are on the table.
        span = (min(pool_low, syn_low), max(pool_high, syn_high))

    _SPAN_CACHE[key] = span

    return span


def _agreed_modifiers(language: WordLanguage, gender: WordGender | None) -> WordPool:
    """The modifiers of a language, in the form they take beside a noun of `gender`.

    Written out rather than agreed after the fact, because a length budget has to see
    the word the sentence will actually carry: German `blau` is `blauer` in front of a
    masculine noun, and choosing by the four letters and writing the six is how a
    sentence quietly stepped outside its range.
    """
    lexicon = WORD_DATA[language]

    if gender is None or lexicon.agreement is None:
        return lexicon.adjectives

    key = (language, gender)
    cached = _AGREED_CACHE.get(key)

    if cached is not None:
        return cached

    agreed = tuple(agree(lexicon, word, gender) for word in lexicon.adjectives)

    _AGREED_CACHE[key] = agreed

    return agreed


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
        # Every form a predicate can take, not only the plain statement's: a question
        # form is a different length, and the shape is chosen against these.
        "verb": _span(
            [group.words for group in data.verbs]
            + [pool for group in data.verbs for pool in group.forms.values()]
        ),
        "state": _span(
            [group.words for group in data.states]
            + [pool for group in data.states for pool in group.forms.values()]
        ),
        "manner": _span([data.manners]),
        "time": _span([data.times]),
        "modifier": _span(
            [
                _agreed_modifiers(language, gender)
                for gender in (None, *(WORD_DATA[language].agreement or {}))
            ]
        ),
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
    # Measured against the longest mark the language writes, so a shape is never chosen
    # for a range only the shortest one could have reached.
    marks = max(len(mark) for mark in data.terminators.values())
    tag = len(frame.tag) + len(data.space) if frame.tag else 0
    low = marks + tag
    high = low

    for index, part in enumerate(frame.parts):
        gap = 0 if index == 0 else len(data.space)
        part_low, part_high = _part_range(part, data, bounds)

        low += gap + part_low
        high += gap + part_high

    return (low, high)


def _natural_span(
    data: SentenceLanguageData,
    frames: Sequence[SentenceFrame],
    bounds: dict[str, tuple[int, int]],
) -> tuple[int, int]:
    """The shortest and longest sentence a set of shapes can produce."""
    low = None
    high = 0

    for frame in frames:
        frame_low, frame_high = _frame_range(frame, data, bounds)
        low = frame_low if low is None else min(low, frame_low)
        high = max(high, frame_high)

    return (low or 1, high)


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

    return _natural_span(data, data.frames, _slot_bounds(language))


# --- Choosing the words -----------------------------------------------------


def _themes_for_classes(
    themes: Sequence[WordTheme],
    classes: Sequence[NounClass],
) -> tuple[WordTheme, ...]:
    """The themes among `themes` whose nouns are one of `classes`."""
    return tuple(theme for theme in themes if THEME_CLASS[theme] in classes)


def _pick_frame(
    frames: Sequence[SentenceFrame],
    boost: Callable[[SentenceFrame], int] | None = None,
) -> SentenceFrame:
    """One shape, drawn in proportion to the weights the language gave them.

    `boost` multiplies a shape's weight, which is what a retry uses to ask for a shape
    that reaches further without dropping the others.
    """

    def weight_of(frame: SentenceFrame) -> int:
        return frame.weight * (1 if boost is None else boost(frame))

    total = sum(weight_of(frame) for frame in frames)
    roll = random.random() * total

    for frame in frames:
        roll -= weight_of(frame)

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
    names: tuple[str, ...]
    """The person names this sentence was written with, in order."""

    type: SentenceType
    """What this sentence is doing."""

    theme: WordTheme | None
    subject: str | None
    """The subject noun as written, which is what the next sentence carries on about."""

    gender: WordGender | None
    """Its gender, for the pronoun and the agreement of whatever follows."""

    named: bool
    """Whether that subject is a person's name."""


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
    span: tuple[int, int],
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
    _, noun_max = span
    # Measured against the base forms, because the noun that decides the gender has not
    # been drawn yet; the modifier itself is chosen from the agreed pool below.
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
    gender = gender_of(lexicon, _as_pool(lexicon, drawn))
    parts = [drawn]

    if modify:
        room = high - overhead - len(drawn) - space
        want = low - overhead - len(drawn) - space
        agreed = _agreed_modifiers(language, gender)
        modifier = (
            agree(lexicon, forced_modifier, gender)
            if forced_modifier
            else _plain(
                lexicon,
                pick_word(agreed, max(1, min(want, room)), max(1, min(mod_max, room)), "")
                or pick(agreed),
            )
        )

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


def _proper_name(
    language: WordLanguage,
    lexicon: WordLanguageData,
    settings: Settings,
    prefix: str,
    low: int,
    high: int,
) -> tuple[str, WordGender | None]:
    """A person's name for a phrase that has room for one, and the gender it carries.

    A bare given name rather than a full one: a sentence about someone uses the name
    they are called by, and `rand_name`'s default would put a surname in every clause.
    The gender is the one the name was drawn for, translated into the gender a modifier
    and a predicate agree with — and only for a language whose words agree at all,
    since nothing else has any use for it.

    Args:
        language: The language the sentence is written in.
        lexicon: Its word data, which says whether anything agrees.
        settings: The sentence's own settings, for the realism level.
        prefix: A `starts_with` the name has to honour, or `""`.
        low: Shortest the phrase may be.
        high: Longest it may be.

    Returns:
        The name, and the gender whatever agrees with it has to agree with.
    """
    drawn = draw_name(
        # `WordLanguage` and `NameLanguage` list the same nine codes.
        language,
        include_surname=False,
        realism=settings.realism,
        starts_with=prefix,
        min_length=low,
        max_length=high,
    )
    gender: WordGender | None = None

    if lexicon.agreement is not None:
        gender = "m" if drawn.gender == "male" else "f"

    return drawn.native, gender


def _name_span(language: WordLanguage) -> tuple[int, int]:
    """How long a given name of the language can be, which is what a phrase reserves."""
    return name_length_range(language, False)


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


def _form_of(
    state_group: StateGroup | None,
    verb_group: VerbGroup | None,
    mark: SentenceMark,
    style: SentenceStyle,
) -> WordPool:
    """The predicates of a group, in the form this sentence ends on.

    The chain is `politeQuestion` → `polite` → `question` → `words`, so a group declares
    only what its language actually writes. Japanese declares `"polite"` alone and it
    serves the question too, because the `か` that asks is the frame's tag rather than
    part of the verb; Korean declares both, because `달립니까` is not `달립니다`.

    Args:
        state_group: The state group heading the shape, or None.
        verb_group: The verb group heading it, or None.
        mark: The kind whose mark the sentence closes on.
        style: How the sentence addresses its reader.

    Returns:
        The pool the predicate is drawn from.
    """
    group: StateGroup | VerbGroup = state_group if state_group is not None else verb_group  # type: ignore[assignment]
    asking = mark == "question"

    if style == "polite":
        polite = (
            group.forms.get("politeQuestion") or group.forms.get("polite")
            if asking
            else group.forms.get("polite")
        )

        if polite:
            return polite

    return (group.forms.get("question") if asking else None) or group.words


def _predicate_for(
    slot: SentenceSlot,
    lexicon: WordLanguageData,
    data: SentenceLanguageData,
    base: WordPool,
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
        # A word the caller named is named in the form a statement ends on, and the form
        # pools are index-aligned so that it can be said the other way instead.
        at = base.index(required.word) if required.word in base else -1

        return agreed(predicates[at] if 0 <= at < len(predicates) else required.word)

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
    draw: Draw,
) -> Built:
    """Fill a shape and write it out.

    The predicate is settled first, because it is what decides which nouns can stand
    beside it. The phrases themselves are then drawn in the order the frame gives, each
    one against the room left once the phrases behind it have reserved their shortest —
    which is how a narrow range drops a modifier rather than overshooting a word, and
    how the subject's gender is in hand before the adjective that has to agree with it.
    """
    follow = draw.follow
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

    # The same predicates, in the form this type of sentence ends on. Index-aligned
    # with the plain words, which is what lets a required word be translated rather than
    # written out in the wrong form.
    base = predicates
    predicates = _form_of(state_group, verb_group, draw.mark, settings.style)
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
    # A sentence carrying on about the topic stands a pronoun where its subject would
    # go, and the languages that drop their subject stand nothing there at all — in
    # which case the phrase is not in the shape to carry an article, a modifier or a
    # particle. Written out as its own list so that every budget below is measured
    # against what the sentence actually writes; `at` is the index back into the frame,
    # which is what the plan is keyed by.
    pronoun = follow.pronoun if follow is not None and follow.reference == "pronoun" else None
    shape: list[SentencePart] = []
    at: list[int] = []

    for index, part in enumerate(frame.parts):
        if part.slot != "subject" or pronoun is None or pronoun:
            shape.append(part)
            at.append(index)

    # Only a shape that opens on a noun phrase with nothing in front of it can
    # honour `starts_with`; anywhere else the sentence opens on an article, a
    # preposition or an adverbial, and `collect` filters what does not match. A
    # sentence after the first one never opens the result, so it never carries it.
    first = shape[0]
    prefixable = (
        follow is None and first.slot in NOUN_SLOTS and not first.head and data.articles is None
    )
    space = len(data.space)
    opener = draw.opener
    close = data.terminators[draw.mark]
    open_mark = data.openers.get(draw.mark, "")
    quote_open, quote_close = draw.quote or ("", "")
    tag = data.space + frame.tag if frame.tag else ""
    # Every phrase's theme is settled before any of them is drawn, because a length
    # budget is only as good as the pools it was measured against. Left to the loop, each
    # phrase was given the room the language's longest noun would need and drew a word
    # out of its own theme, which is how a sentence came out short of a `min_length` the
    # shape could otherwise have reached.
    part_themes: list[WordTheme | None] = []

    for index, part in enumerate(shape):
        if part.slot not in NOUN_SLOTS:
            part_themes.append(None)
            continue

        if part.slot == "subject":
            part_themes.append(subject_theme)
            continue

        required = plan.phrase.get(at[index])
        part_themes.append(
            required.theme
            if required is not None and required.theme is not None
            else _theme_for_part(
                part.slot,
                verb_group.object if verb_group is not None else None,
                themes,
            )
        )

    # What a phrase writes instead of a noun phrase, when it writes one at all: a
    # pronoun standing in for the topic, the name a repeat carries forward, or a fresh
    # name for a phrase about a person. All three are bare words — no article, no
    # modifier, nothing but the word and whatever particle the frame puts after it —
    # and `""` marks the one that has to be drawn against the room it is given.
    proper: list[str | None] = []

    for index, part in enumerate(shape):
        if part.slot == "subject" and pronoun:
            proper.append(pronoun)
        elif (
            part.slot == "subject"
            and follow is not None
            and follow.reference == "repeat"
            and follow.topic.named
        ):
            proper.append(follow.topic.noun)
        else:
            theme = part_themes[index]
            person = theme is not None and THEME_CLASS[theme] == "person"
            proper.append("" if settings.include_name and person else None)

    parts = [
        part
        if proper[index] is None
        else SentencePart(
            part.slot,
            head=part.head,
            tail=part.tail,
            tail_alt=part.tail_alt,
            bare=True,
        )
        for index, part in enumerate(shape)
    ]

    # The same for the predicate: `bounds` spans every group the language has, and one
    # sentence draws from one of them. A word the caller required is narrower still — its
    # length is not a range at all, and neither is a pronoun's.
    part_bounds: list[dict[str, tuple[int, int]]] = []

    for index, part in enumerate(parts):
        required = plan.phrase.get(at[index])
        word = proper[index] or (required.word if required is not None else None)
        exact = None if word is None else (len(word), len(word))
        own = dict(bounds)
        theme = part_themes[index]

        if theme is not None:
            owed = plan.modifier.get(at[index])
            # A name that has still to be drawn is budgeted against the given names of
            # the language rather than against its nouns — `rand_name` invents from its
            # own syllables and draws from its own pools, and neither is this theme's.
            span = (
                _name_span(language)
                if proper[index] == ""
                else _noun_span(language, theme, settings.invent)
            )
            own[part.slot] = exact or span

            if owed is not None:
                own["modifier"] = (len(owed.word), len(owed.word))
        elif part.slot in ("verb", "state"):
            own[part.slot] = exact or pool_bounds(predicates)
        elif exact is not None:
            own[part.slot] = exact

        part_bounds.append(own)

    spans = [
        (
            (0 if index == 0 else space) + part_low,
            (0 if index == 0 else space) + part_high,
        )
        for index, (part_low, part_high) in enumerate(
            _part_range(part, data, part_bounds[index]) for index, part in enumerate(parts)
        )
    ]
    written: list[str] = []
    reported: list[str] = []
    slots: list[SentenceSlot] = []
    names: list[str] = []
    subject: Phrase | None = None
    named = False
    # A pronoun says nothing about its own gender, and neither does a name carried
    # over, so what agrees with either agrees with the noun it stands for.
    gender: WordGender | None = follow.topic.gender if follow is not None and any(proper) else None
    used = (
        len(close)
        + len(open_mark)
        + len(tag)
        + len(quote_open)
        + len(quote_close)
        + (len(opener) + space if opener else 0)
    )

    if opener:
        written.append(_upper(opener) if data.capitalize else opener)

    for index, part in enumerate(parts):
        rest_min = sum(span[0] for span in spans[index + 1 :])
        rest_max = sum(span[1] for span in spans[index + 1 :])
        gap = 0 if index == 0 else space
        head_cost = len(part.head) + space if part.head else 0
        overhead = gap + head_cost + _tail_min(part)
        part_high = max(1, high - used - overhead - rest_min)
        part_low = max(1, low - used - overhead - rest_max)

        if proper[index] is not None:
            # A bare proper noun, drawn now if it was not carried in. `part_high` and
            # `part_low` are what the phrase has room for, and the name generator fits
            # them the same way a noun would.
            carried_in = proper[index]

            if carried_in:
                phrase = carried_in
            else:
                phrase, drawn_gender = _proper_name(
                    language,
                    lexicon,
                    settings,
                    settings.prefix if prefixable and index == 0 else "",
                    min(part_low, part_high),
                    part_high,
                )
                names.append(phrase)

                if part.slot == "subject":
                    gender = drawn_gender

            if part.slot == "subject":
                named = True
        elif part.slot in NOUN_SLOTS:
            required = plan.phrase.get(at[index])
            owed = plan.modifier.get(at[index])
            theme = cast("WordTheme", part_themes[index])
            noun_low, noun_high = part_bounds[index][part.slot]
            _, article_max = (0, 0) if part.bare else _article_span(data)
            room = part_high - noun_low
            # A phrase whose share of the range is longer than any noun of its theme
            # takes a modifier whatever the roll says, which is the only way it can
            # reach it — the alternative is a sentence that misses `min_length`.
            needed = part_low > (article_max + space if article_max else 0) + noun_high
            modify = part.modifiable and (
                owed is not None
                or needed
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
                span=(noun_low, noun_high),
            )
            phrase = built.text

            if part.slot == "subject":
                subject = built
                gender = gender_of(lexicon, _as_pool(lexicon, built.noun))
        else:
            phrase = _predicate_for(
                part.slot,
                lexicon,
                data,
                base,
                predicates,
                plan.phrase.get(at[index]),
                gender,
                part_low,
                part_high,
            )

        # The opening capital belongs to whatever is written first, and that is the
        # phrase itself unless a connective or a preposition stands in front of it.
        # Applied here rather than to the finished string, so the phrase the detail
        # reports is the one the sentence actually shows.
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

        # The opening capital belongs to the name too, so what the detail reports is
        # what the sentence shows.
        if proper[index] == "" and text != phrase:
            names[-1] = text

    # A dropped subject leaves no phrase behind, so what the next sentence carries on
    # about is the topic this one was already handed.
    carried = follow.topic if pronoun is not None and follow is not None else None
    # A sentence whose subject is a name carries that name forward.
    if named:
        subject_word: str | None = reported[slots.index("subject")]
    elif subject is not None:
        subject_word = subject.noun
    else:
        subject_word = carried.noun if carried is not None and pronoun else None

    return Built(
        # The opener is written against the first phrase rather than beside it —
        # Spanish `¿El león corre?`, never `¿ El león corre ?`.
        quote_open + open_mark + data.space.join(written) + tag + close + quote_close,
        tuple(reported),
        tuple(slots),
        tuple(names),
        draw.type,
        None if named else (subject.theme if subject is not None else None),
        subject_word,
        gender
        if subject is not None or named
        else (carried.gender if carried is not None else None),
        named or (carried is not None and carried.named),
    )


def _bounds_for(
    data: SentenceLanguageData,
    frames: Sequence[SentenceFrame],
    bounds: dict[str, tuple[int, int]],
    settings: Settings,
) -> tuple[int, int]:
    """The length range one whole result has to land in.

    Every sentence of it and the spaces between them, because that is what `min_length`
    and `max_length` describe. The ceiling is per sentence rather than per result: a
    paragraph of ten is ten sentences long, and capping it at what one of them may be
    would answer the ask with ten sentences of twenty characters.
    """
    count = settings.sentences
    gap = len(data.space) * (count - 1)
    natural_low, natural_high = _natural_span(data, frames, bounds)

    return length_bounds(
        settings.min_length,
        settings.max_length,
        natural_low * count + gap,
        natural_high * count + gap,
        RAND_SENTENCE_LENGTH_MAX * count + gap,
    )


def _distance_from(length: int, budget: tuple[int, int]) -> int:
    """How far a length falls outside a range, and 0 when it is inside it."""
    low, high = budget

    return length - high if length > high else max(0, low - length)


def _share_out(budget: tuple[int, int], count: int, space: int) -> list[tuple[int, int]]:
    """The result's range, shared out over its sentences.

    The joins between them come off the top and the last sentence absorbs the rounding,
    so the shares add back up to exactly what the caller asked for rather than to one
    character less.
    """
    if count == 1:
        return [budget]

    gap = space * (count - 1)

    def split(total: int) -> list[int]:
        body = max(count, total - gap)
        each = body // count

        return [each] * (count - 1) + [body - each * (count - 1)]

    lows = split(budget[0])
    highs = split(budget[1])

    return [(max(1, lows[i]), max(lows[i], highs[i])) for i in range(count)]


# --- Building the whole result ----------------------------------------------

CONNECTIVE_CHANCE = 40
"""How often a sentence that follows another one opens on a connective."""

INTERJECTION_CHANCE = 65
"""How often an exclamation opens on an interjection.

Higher than the connective's, because an exclamation with nothing in front of it is a
statement wearing a mark.
"""

REFERENCE_WEIGHT = {"repeat": 25, "pronoun": 40, "fresh": 35}
"""How a sentence refers to the topic, against the other two ways of doing it."""


def _topic_of(built: Built) -> Topic | None:
    """What the rest of the result is about, read off the sentence that opened it."""
    if built.subject is None:
        return None

    return Topic(
        built.subject,
        built.theme,
        # A name is in no pool and so has no theme, but it is a person all the same,
        # which is the whole of what a later sentence needs to stay on topic.
        "person"
        if built.named
        else (THEME_CLASS[built.theme] if built.theme is not None else None),
        built.gender,
        built.named,
    )


def _pronouns_for(data: SentenceLanguageData, topic: Topic) -> WordPool:
    """The pronouns the language can stand in for this topic with.

    A class its written pronouns are wrong for is left with the empty entry alone — the
    language says nothing where it can, and where it cannot, there is no pronoun to be
    had and the sentence names the topic again instead.
    """
    pool = data.pronouns.get(topic.gender or "n") or data.pronouns.get("n") or ()

    if topic.noun_class is not None and topic.noun_class in data.pronounless:
        return tuple(word for word in pool if not word)

    return pool


def _follow_for(data: SentenceLanguageData, topic: Topic) -> Follow:
    """How one sentence carries on from the one before it."""
    pronouns = _pronouns_for(data, topic)
    usable = ("repeat", "pronoun", "fresh") if pronouns else ("repeat", "fresh")
    roll = random.random() * sum(REFERENCE_WEIGHT[each] for each in usable)
    reference = usable[-1]

    for each in usable:
        roll -= REFERENCE_WEIGHT[each]

        if roll <= 0:
            reference = each
            break

    return Follow(topic, reference, pick(pronouns) if reference == "pronoun" else "")


def _opener_for(
    data: SentenceLanguageData, mark: SentenceMark, following: bool, room: int, shortest: int
) -> str:
    """What a sentence opens on: an interjection for an exclamation, else a connective.

    Never both — a sentence that opened on two things at once would be shouting its own
    footnote. `room` is what the sentence may be at its longest, and it is what decides
    whether it opens on anything at all: what stands in front is written before a whole
    sentence rather than instead of any part of it, so one longer than the budget can
    spare is a sentence that overshoots by exactly its length. Russian `тем временем` is
    thirteen characters, and a third of a range of seventy-five has nowhere to put them.

    Args:
        data: The language's sentence dataset.
        mark: The kind whose mark this sentence closes on.
        following: Whether it follows another sentence of the same result.
        room: The longest this sentence may be.
        shortest: The shortest sentence the language's shapes could spell.

    Returns:
        What the sentence opens on, or `""`.
    """
    spare = room - len(data.space) - shortest

    def fitting(pool: WordPool) -> tuple[str, ...]:
        return tuple(word for word in pool if len(word) <= spare)

    if mark == "exclamation":
        usable = fitting(data.interjections)

        if usable and chance(INTERJECTION_CHANCE):
            return pick(usable)

    if not following:
        return ""

    usable = fitting(data.connectives)

    return pick(usable) if usable and chance(CONNECTIVE_CHANCE) else ""


def _generate_result(language: WordLanguage, settings: Settings) -> list[Built]:
    """Every sentence of one result, in order.

    The range is shared out before the first of them is drawn, and the topic is taken
    from that first sentence — so what follows is about the same thing rather than
    another draw that happened to land beside it.
    """
    data = SENTENCE_DATA[language]
    bounds = _slot_bounds(language)
    # Every shape any of the requested types could take, because the budget is shared
    # out before the first type is even drawn.
    # A quoted line can be any kind at all, so its shapes are all of them.
    frames = [
        frame
        for type_ in settings.types
        for mark in (QUOTED_MARKS if type_ in ("dialogue", "thought") else (type_,))
        for frame in _frames_for(data, settings, _mood_for(cast("SentenceMark", mark)))
    ]
    shortest = _natural_span(data, frames, bounds)[0]
    budgets = _share_out(
        _bounds_for(data, frames, bounds, settings), settings.sentences, len(data.space)
    )
    built: list[Built] = []
    topic: Topic | None = None

    for budget in budgets:
        type_ = pick(settings.types)
        mark = _mark_for(type_)
        follow = None if topic is None else _follow_for(data, topic)
        draw = Draw(
            budget,
            type_,
            mark,
            _quote_for(data, type_, settings.quote),
            _opener_for(data, mark, follow is not None, budget[1], shortest),
            follow,
        )
        one = _generate_one(language, settings, draw)

        # `_opener_for` reserves room against the shortest sentence the shapes could
        # spell, which is a floor no draw actually reaches — the shortest word of every
        # pool at once. When the sentence that came back could not be made short enough
        # to carry what it opens on after all, that is the part worth giving up: it
        # stands in front of the whole sentence rather than instead of any piece of it.
        if draw.opener and _distance_from(len(one.sentence), budget) > 0:
            bare = _generate_one(
                language, settings, Draw(budget, type_, mark, draw.quote, "", follow)
            )

            if _distance_from(len(bare.sentence), budget) < _distance_from(
                len(one.sentence), budget
            ):
                one = bare

        built.append(one)

        if topic is None:
            topic = _topic_of(one)

    return built


def _subject_themes_for(settings: Settings, follow: Follow | None) -> tuple[WordTheme, ...]:
    """The themes a sentence may draw its subject from.

    A sentence carrying on about a topic stays inside the topic's own class, which is
    what makes a paragraph read as one rather than as three draws that happened to land
    together.
    """
    requested = WORD_THEMES if settings.theme == "all" else (settings.theme,)
    # A name can only stand where a person would, so asking for one narrows the subject
    # to the themes that name people. A theme the caller named themselves still wins —
    # `theme="animal"` with `include_name` is a sentence about a lion, not about
    # somebody the lion reminded us of.
    wanted = _themes_for_classes(requested, ("person",)) if settings.include_name else requested
    themes = tuple(wanted) or requested

    if follow is None or follow.topic.noun_class is None:
        return themes

    in_class = _themes_for_classes(themes, (follow.topic.noun_class,))

    return tuple(in_class) or themes


def _generate_one(language: WordLanguage, settings: Settings, draw: Draw) -> Built:
    """Build one sentence, as close to what was asked for as the language allows."""
    follow = draw.follow
    budget = draw.budget
    data = SENTENCE_DATA[language]
    bounds = _slot_bounds(language)
    allowed = _frames_for(data, settings, _mood_for(draw.mark))
    requested = _subject_themes_for(settings, follow)
    # The words a caller required go in the first sentence — once in the result rather
    # than once in every sentence of it.
    requirements = [] if follow is not None else [_classify(language, w) for w in settings.include]
    carried = (
        Requirement(
            follow.topic.noun,
            ("subject",),
            theme=follow.topic.theme,
            known=follow.topic.theme is not None,
        )
        if follow is not None and follow.reference == "repeat"
        else None
    )
    plans = {id(frame): _plan_for(frame, requirements, carried) for frame in allowed}
    low, high = budget

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

    def reaching(candidate: SentenceFrame) -> int:
        # After a miss, a shape whose own range runs past the requested one in the
        # direction that was missed is four times as likely. Weighted rather than
        # filtered: a shape that missed by two characters can still make it on the next
        # draw, and dropping it left a language whose short shape was the only one in
        # range settling for whatever it had.
        own_low, own_high = _frame_range(candidate, data, bounds)

        return 4 if (own_low <= low if best_too_long else own_high >= high) else 1

    for attempt in range(FIT_ATTEMPTS):
        frame = _pick_frame(usable, None if attempt == 0 else reaching)
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
            draw,
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


def _resolve_types(type_: SentenceTypeOption) -> tuple[SentenceType, ...]:
    """The caller's `type`, as the set one sentence is drawn from."""
    every: tuple[SentenceType, ...] = (
        "statement",
        "question",
        "exclamation",
        "trailing",
        "dialogue",
        "thought",
    )

    if type_ == "all":
        return every

    wanted = (type_,) if isinstance(type_, str) else tuple(type_)
    usable = tuple(each for each in wanted if each in every)

    return usable or ("statement",)


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
    sentences: int = 1,
    include_name: bool = False,
    type: SentenceTypeOption = "statement",
    quote: SentenceQuote | None = None,
    style: SentenceStyle = "plain",
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
        sentences: How many sentences one result holds.
        include_name: Whether a phrase about a person is written as a name.
        type: What the sentences are doing.
        quote: Which quotation marks a quoted line takes.
        style: How the sentences address their reader.

    Returns:
        One `SentenceDetail` per result.
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
        sentences=clamp(sentences, 1, RAND_SENTENCE_COUNT_MAX),
        realism=realism,
        include_name=include_name,
        types=_resolve_types(type),
        quote=quote,
        style=style,
    )

    def draw() -> SentenceDetail:
        code = draw_language(language, _languages_for(settings))
        data = SENTENCE_DATA[code]
        built = _generate_result(code, settings)

        return SentenceDetail(
            sentence=data.space.join(one.sentence for one in built),
            sentences=tuple(one.sentence for one in built),
            phrases=tuple(phrase for one in built for phrase in one.phrases),
            slots=tuple(slot for one in built for slot in one.slots),
            names=tuple(name for one in built for name in one.names),
            types=tuple(one.type for one in built),
            language=code,
            # What the result is about is what its first sentence was about; the ones
            # after it stay inside that noun's class.
            theme=built[0].theme,
        )

    return collect(
        count=count,
        unique=unique,
        starts_with=settings.prefix,
        draw=draw,
        key_of=lambda detail: detail.sentence,
    )
