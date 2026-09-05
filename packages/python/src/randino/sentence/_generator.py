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
from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass, field, replace
from types import MappingProxyType
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
from randino._internal.utils import chance, clamp, pick, pick_weighted
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
    ConnectiveKind,
    NounClass,
    PredicateForm,
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

THEME_CHANCE = 65
"""How often a fresh subject is drawn from the topic's own theme.

Rather than from anywhere in the topic's class.
"""

MODIFY_CHANCE = 45
"""How often a noun phrase that may carry a modifier is given one.

Length can override it in both directions — see `_modify_chance_for`.
"""

NOUN_SLOTS: tuple[SentenceSlot, ...] = ("subject", "object", "place", "quantity")
"""The slots that are a noun phrase, and so draw from the word pools."""

MONEY_CLASS: NounClass = "idea"
"""The class money belongs to, which decides the verbs it can stand beside.

An amount is an idea, so the verbs that remember and count one are the verbs that can
take it.
"""


def _carries_person(frame: SentenceFrame) -> bool:
    """Whether a shape has anywhere a person's name could stand.

    A counted shape makes its quantity the subject, and a copular one equates its
    subject to a day — neither is a room for somebody.

    Args:
        frame: The shape.

    Returns:
        Whether a name can stand in it.
    """
    return _subject_slot_of(frame) != "quantity" and not any(
        part.copula is not None for part in frame.parts
    )


def _subject_slot_of(frame: SentenceFrame) -> SentenceSlot:
    """Which slot this shape's subject stands in.

    Usually the subject, and the quantity for a shape that counts the thing the sentence
    is about — `사과 12 개가 익는다` has no separate subject, and the counted phrase is
    what the verb agrees with.

    Args:
        frame: The shape.

    Returns:
        The slot its subject stands in.
    """
    return "subject" if any(part.slot == "subject" for part in frame.parts) else "quantity"


def _takes_object(frame: SentenceFrame) -> bool:
    """Whether a shape puts a noun phrase after its verb, counted or not."""
    subject = _subject_slot_of(frame)

    return any(
        part.slot == "object"
        or part.slot == "money"
        or (part.slot == "quantity" and subject != "quantity")
        for part in frame.parts
    )


def _grouped(value: int, group: str) -> str:
    """The digits of a number, grouped the way the language groups them."""
    return f"{value:,}".replace(",", group)


def _date_text(data: SentenceLanguageData) -> str:
    """A date, written the way the language writes one.

    `Y`, `M`, `D` and `MMMM` stand for the year, the month, the day and the month's
    name.

    Args:
        data: The language's sentence data.

    Returns:
        The date as the language writes it.
    """
    calendar = data.calendar

    if calendar is None:
        return ""

    month = random.randint(1, 12)
    # The month goes in last, because a month's name has letters in it that the other
    # two stand for: `März` would lose its `M` to the month number.
    written = calendar.date.replace(
        "Y", str(random.randint(calendar.years[0], calendar.years[1])), 1
    ).replace("D", str(random.randint(1, 28)), 1)

    if calendar.months is None:
        return written.replace("M", str(month), 1)

    return written.replace("MMMM", calendar.months[month - 1], 1)


def _clock_text(data: SentenceLanguageData) -> str:
    """A clock time, likewise. `h` is the hour and `mm` the minute.

    Args:
        data: The language's sentence data.

    Returns:
        The time as the language writes it.
    """
    calendar = data.calendar

    if calendar is None:
        return ""

    return calendar.clock.replace("h", str(random.randint(0, 23)), 1).replace(
        "mm", f"{random.randint(0, 59):02d}", 1
    )


def _calendar_span(data: SentenceLanguageData, slot: SentenceSlot) -> tuple[int, int]:
    """Shortest and longest a date or a clock can be, for the budget.

    Measured by taking the numbers out of the template and adding back the widest and
    narrowest each of them can be written as.

    Args:
        data: The language's sentence data.
        slot: Which of the two.

    Returns:
        The shortest and longest it can be.
    """
    calendar = data.calendar

    if calendar is None:
        return (1, 1)

    if slot == "clock":
        fixed = len(calendar.clock.replace("h", "", 1).replace("mm", "", 1))

        return (fixed + 1 + 2, fixed + 2 + 2)

    without = (
        calendar.date.replace("M", "", 1)
        if calendar.months is None
        else calendar.date.replace("MMMM", "", 1)
    )
    fixed = len(without.replace("Y", "", 1).replace("D", "", 1))
    names = (1, 2) if calendar.months is None else pool_bounds(calendar.months)
    years = (len(str(calendar.years[0])), len(str(calendar.years[1])))

    return (fixed + names[0] + years[0] + 1, fixed + names[1] + years[1] + 2)


def _count_text(data: SentenceLanguageData, theme: WordTheme) -> str:
    """What a counted phrase writes beside its noun."""
    numeral = data.numeral

    if numeral is None:
        return ""

    counter = numeral.counters.get(THEME_CLASS[theme])
    number = _grouped(random.randint(numeral.count[0], numeral.count[1]), numeral.group)

    return number if counter is None else number + numeral.gap + counter


def _money_text(data: SentenceLanguageData) -> str:
    """What an amount of money writes."""
    numeral = data.numeral

    if numeral is None:
        return ""

    return _grouped(pick(numeral.amounts), numeral.group) + numeral.gap + numeral.currency


def _count_span(data: SentenceLanguageData) -> tuple[int, int]:
    """Shortest and longest a count can be, so a phrase can reserve room for one."""
    numeral = data.numeral

    if numeral is None:
        return (0, 0)

    counters = list(numeral.counters.values())
    low = min((len(word) for word in counters), default=0)
    high = max((len(word) for word in counters), default=0)
    space = len(data.space)
    gap = len(numeral.gap)

    return (
        space + len(_grouped(numeral.count[0], numeral.group)) + (low + gap if counters else 0),
        space + len(_grouped(numeral.count[1], numeral.group)) + (high + gap if counters else 0),
    )


def _money_span(data: SentenceLanguageData) -> tuple[int, int]:
    """The same for an amount, which is a phrase of its own rather than part of one."""
    numeral = data.numeral

    if numeral is None:
        return (1, 1)

    widths = [
        len(_grouped(value, numeral.group)) + len(numeral.gap) + len(numeral.currency)
        for value in numeral.amounts
    ]

    return (min(widths), max(widths))


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

    include_name: bool | None
    """Whether a sentence about a person writes a name, or None when the caller left it
    to the generator, in which case it is decided once per result.
    """

    types: tuple[SentenceType, ...]
    """What the sentences may be doing, normalized to a set to draw from."""

    quote: SentenceQuote | None
    """Which marks a quoted line takes, or None for the type's own default."""

    style: SentenceStyle | None
    """How the sentences address their reader, or None when the caller left it to the
    generator.
    """

    min_length: int | None = None
    max_length: int | None = None


QUOTED_TYPES: tuple[SentenceType, ...] = ("dialogue", "thought")
"""The kinds that are a line somebody says or thinks rather than prose about it."""

NARRATION: tuple[SentenceType, ...] = ("statement", "trailing")
"""The kinds prose about a quoted line can be.

A line is answered by another line or by a sentence about it, and narration that asks
or exclaims is a third voice in a scene that has two.
"""

TYPE_WEIGHT: dict[SentenceType, int] = {
    "statement": 100,
    "dialogue": 34,
    "trailing": 16,
    "question": 14,
    "thought": 12,
    "exclamation": 10,
}
"""What each kind is worth against the others wherever the caller left it to chance.

Prose is mostly statements: a paragraph that tells, asks, exclaims, trails off and
quotes in equal measure is not a paragraph but a sampler of the six. A line somebody
says comes next, because it is the one kind that carries a scene with it, and the two
marked kinds are the rarest — a question is only worth reading when the sentences
around it are not questions.
"""

MARK_WEIGHT: dict[SentenceMark, int] = {
    "statement": 100,
    "question": 34,
    "exclamation": 22,
    "trailing": 16,
}
"""The same for the mark a quoted line closes on, which is drawn rather than fixed.

Somebody speaking asks more often than a page of prose does, and still tells more often
than either.
"""

QUOTED_BOOST = 6
"""How much more likely a quoted line is inside a result that opened on one.

Speech is what a scene of speech is made of, and what the boost leaves room for is the
prose between the lines — the only thing that keeps two of them from reading as one
person talking to themselves.
"""

REPEAT_DAMP = 0.45
"""What one more of the same in a row costs, against everything but a plain statement.

A second question straight after one reads as a quiz and a third exclamation as a
shouting match, so each repeat is worth less than the last — damped rather than
forbidden, because an exchange of two lines is a conversation and a run of ten is
the tic.
"""

QUOTED_MARKS: tuple[SentenceMark, ...] = ("statement", "question", "exclamation")
"""The kinds a quoted line can be.

Somebody speaking asks more often than a page of prose does and often enough does
neither, so the mark
is drawn rather than fixed.
"""


STYLES: tuple[SentenceStyle, ...] = ("plain", "casual", "polite", "formal")
"""Every level, from the voice of a book to the one most spoken Korean is in."""

SPOKEN_LEVELS: tuple[SentenceStyle, ...] = ("casual", "polite", "formal")
"""The levels a line somebody says out loud is said at.

Never 해라체 — that is the voice of a book, not of a person with a listener in front of
them.
"""

THOUGHT_LEVELS: tuple[SentenceStyle, ...] = ("plain", "casual")
"""The levels a thought is thought at.

The other way round from a spoken line: it is addressed to nobody, so it is never
polite.
"""

FORM_CHAIN: Mapping[SentenceStyle, Mapping[SentenceMark, tuple[PredicateForm, ...]]] = {
    "plain": {
        "statement": (),
        "trailing": (),
        "question": ("question",),
        "exclamation": ("exclamation",),
    },
    "casual": {
        "statement": ("casual",),
        "trailing": ("casual",),
        "question": ("casual", "question"),
        "exclamation": ("casual", "exclamation"),
    },
    "polite": {
        "statement": ("polite",),
        "trailing": ("polite",),
        "question": ("polite", "question"),
        "exclamation": ("polite", "exclamation"),
    },
    "formal": {
        "statement": ("formal", "polite"),
        "trailing": ("formal", "polite"),
        "question": ("formalQuestion", "formal", "polite", "question"),
        "exclamation": ("formal", "polite", "exclamation"),
    },
}
"""Which form a level writes for each mood, best first.

A chain ends where it started, at the plain statement the group's `words` already are,
which is why seven of the nine write the same sentence whatever the caller asks for. A
trailing sentence is a statement that stops early, so it ends on the statement's form.
"""


def _one_of(entry: str) -> str:
    """One of the endings a form pool entry lists.

    `달리니|달리나|달리는가` is one verb written three ways, and a sentence takes one of
    them; an entry with no `|` in it is itself.

    Args:
        entry: The pool entry.

    Returns:
        The ending this sentence writes.
    """
    return pick(entry.split("|")) if "|" in entry else entry


def _endings(pool: WordPool) -> WordPool:
    """Every ending an entry lists, which is what a length budget has to span.

    Args:
        pool: A form pool.

    Returns:
        The pool with every alternative written out on its own.
    """
    return tuple(ending for entry in pool for ending in entry.split("|"))


def _style_for(
    type_: SentenceType, asked: SentenceStyle | None, voice: SentenceStyle
) -> SentenceStyle:
    """The level one line is said at.

    A level the caller named is used for every line, quoted or not; without one, the
    result has a voice of its own and only a quoted line steps outside it, because what
    a person says is not written the way the sentence around it is.

    Args:
        type_: What this line is.
        asked: The level the caller named, or None.
        voice: The level the result settled on.

    Returns:
        The level this line is written at.
    """
    if asked is not None:
        return asked

    if type_ == "dialogue":
        return pick(SPOKEN_LEVELS)

    return pick(THOUGHT_LEVELS) if type_ == "thought" else voice


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

    style: SentenceStyle
    """The level this line is said at, which a quoted one does not share."""

    avoid: frozenset[str]
    """The predicates and adverbials the result has already used, in their plain form.

    A verb group holds four words and a paragraph holds ten sentences, so this cannot
    always be honoured — what it does is spend the group before it starts over, rather
    than rolling `식습니다` three times in four lines.
    """

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

    scene: "Mapping[SentenceSlot, Requirement]"
    """The nouns the result has already put on the page, by the slot they stood in.

    A sentence with one of those slots writes what is here rather than drawing again —
    a paragraph whose place changes every line is not one paragraph.
    """


@dataclass(slots=True)
class Flow:
    """What the result has written so far, and what keeps the next sentence from it.

    A paragraph is not a set of draws that happened to land together, and every field
    here is one of the ways that shows: the register it opened in, the kind and the mark
    it has just used, what it opened those sentences on, and whether the last of them
    named the topic instead of standing a pronoun where it was.
    """

    lead: SentenceType | None = None
    """The kind the result opened on, which is the register the rest of it keeps."""

    last: SentenceType | None = None
    """The kind the sentence before this one was."""

    run: int = 0
    """How many of that kind in a row."""

    mark: SentenceMark | None = None
    """The mark that sentence closed on, quoted or not."""

    opened: bool = False
    """Whether it opened on a connective or an interjection."""

    openers: set[str] = field(default_factory=set)
    """Every one the result has already used, so that none is written twice."""

    repeated: bool = True
    """Whether it named the topic rather than standing a pronoun where it was.

    The opening sentence names the subject itself, which is why this starts True.
    """


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
    moodly = moody or list(data.frames)
    # A counted shape has no room for a name: its quantity is its subject, and
    # `서호 3명` counts somebody's name, which is not a thing a sentence says. Asked for
    # a name, the shapes that cannot carry one are left out.
    nameable = (
        [frame for frame in moodly if _carries_person(frame)] if settings.include_name else moodly
    )
    usable = nameable or moodly
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
    pinned: Mapping[SentenceSlot, Requirement] = MappingProxyType({}),
) -> tuple[Plan, bool]:
    """Where each required word goes in this shape, and whether all of them fit.

    Greedy: a word takes the first of its own slots that is still free, which is enough
    because the lists are short and ordered by how specific the reading is. A sentence
    carrying on from another one is handed the phrases the result has already put on the
    page — its subject, and the place it is happening in — rather than asking for them,
    so each goes in its own slot before the greedy placement reaches for the first noun
    slot it can find.
    """
    plan = Plan()
    complete = True

    for pin, requirement in pinned.items():
        # The subject goes wherever this shape's subject goes, which in a counted shape
        # is its quantity: `사과 12개가 익는다` has no `subject` part, and a topic pinned
        # to one would have been dropped and drawn again.
        stands = _subject_slot_of(frame) if pin == "subject" else pin

        for index, part in enumerate(frame.parts):
            if part.slot == stands:
                plan.phrase[index] = requirement
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
        "quantity": noun,
        # Every form a predicate can take, not only the plain statement's: a question
        # form is a different length, and the shape is chosen against these.
        "verb": _span(
            [group.words for group in data.verbs]
            + [_endings(pool) for group in data.verbs for pool in group.forms.values()]
        ),
        "state": _span(
            [group.words for group in data.states]
            + [_endings(pool) for group in data.states for pool in group.forms.values()]
        ),
        "manner": _span([data.manners]),
        "time": _span([data.times]),
        "money": _money_span(data),
        "date": _calendar_span(data, "date"),
        "clock": _calendar_span(data, "clock"),
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


def _copula_span(part: SentencePart, data: SentenceLanguageData) -> tuple[int, int]:
    """How much room the copula takes on the phrase it is written onto.

    Every form of it, because the level and the mood are settled after the shape is. A
    copula in front is a word of its own; one on the end is written onto the phrase with
    nothing between them.

    Args:
        part: The phrase it is written onto.
        data: The language's sentence data.

    Returns:
        The shortest and longest it can be.
    """
    if part.copula is None or data.calendar is None:
        return (0, 0)

    group = data.calendar.copula
    low, high = _span([group.words, *(_endings(pool) for pool in group.forms.values())])
    gap = len(data.space) if part.copula == "head" else 0

    return (low + gap, high + gap)


def _part_range(
    part: SentencePart,
    data: SentenceLanguageData,
    bounds: dict[str, tuple[int, int]],
) -> tuple[int, int]:
    """What one part adds to the sentence, at its shortest and at its longest."""
    space = len(data.space)
    copula_low, copula_high = _copula_span(part, data)
    head = (len(part.head) + space if part.head else 0) + copula_low
    extra = copula_high - copula_low
    low, high = bounds[part.slot]

    if part.slot not in NOUN_SLOTS:
        return (head + low + _tail_min(part), head + high + _tail_max(part) + extra)

    article_min, article_max = (0, 0) if part.bare else _article_span(data)
    modifier = bounds["modifier"][1] + space if part.modifiable else 0
    # A counted phrase carries a number and the counter its kind takes, and no article
    # and no modifier — `12 apples`, never `the 12 red apples`.
    count_min, count_max = _count_span(data) if part.slot == "quantity" else (0, 0)

    return (
        head + (article_min + space if article_min else 0) + low + count_min + _tail_min(part),
        head
        + (article_max + space if article_max else 0)
        + modifier
        + high
        + count_max
        + _tail_max(part),
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
    # A quantity is an object with a number on it, and an amount is an object of the
    # class money belongs to — unless the quantity is what the sentence is about, in
    # which case it is the subject and the verb takes nothing.
    wants_object = _takes_object(frame)
    wants_money = any(part.slot == "money" for part in frame.parts)
    subject = _required_at(frame, plan, "subject")
    obj = _required_at(frame, plan, "object")
    verb = _required_at(frame, plan, "verb")
    usable = []

    for group in data.verbs:
        if (group.object is not None) != wants_object:
            continue

        if wants_money and MONEY_CLASS not in (group.object or ()):
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

    used: tuple[str, ...]
    """The predicates and adverbials it used, in their plain form."""

    type: SentenceType
    """What this sentence is doing."""

    theme: WordTheme | None
    subject: str | None
    """The subject noun as written, which is what the next sentence carries on about."""

    gender: WordGender | None
    """Its gender, for the pronoun and the agreement of whatever follows."""

    named: bool
    """Whether that subject is a person's name."""

    scene: Mapping[SentenceSlot, Requirement]
    """The nouns this sentence put on the page that a later one keeps.

    Where it is happening, and what it is about beside its subject. A paragraph whose
    place changes every line is not one paragraph.
    """


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
    count: str,
) -> Phrase:
    """Build one noun phrase: an article, the noun, and a modifier where there is room.

    `low` and `high` are what the whole phrase has to land in. The article is reserved
    before the noun is drawn — its length is not known until the noun's gender is, so
    the longest one the language has is what gets set aside — and whatever the noun
    leaves over is what the modifier is drawn to fit. `count` is what a counted phrase
    writes beside its noun, on the side the language puts it.
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

    # A counted phrase writes its number where the language puts it — behind the noun in
    # Korean, Japanese and Chinese, in front of it in Vietnamese, where the classifier
    # comes with it.
    if count:
        if data.numeral is not None and data.numeral.order == "before":
            parts.insert(0, count)
        else:
            parts.append(count)

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


def _proper_name(language: WordLanguage, settings: Settings, prefix: str) -> tuple[str, WordGender]:
    """A person's name for a phrase that has room for one, and the gender it carries.

    A bare given name rather than a full one: a sentence about someone uses the name
    they are called by, and `rand_name`'s default would put a surname in every clause.
    The gender is the one the name was drawn for, translated into the gender a modifier
    and a predicate agree with — and carried even by a language whose words agree with
    nothing, because a pronoun still has to pick between `he` and `she`.

    Args:
        language: The language the sentence is written in.
        settings: The sentence's own settings, for the realism level.
        prefix: A `starts_with` the name has to honour, or `""`.

    Returns:
        The name, and the gender whatever agrees with it has to agree with.
    """
    # No length range, on purpose. `rand_name` reads one as a licence to change the
    # name's structure: a CJK given name is stretched to fill a range longer than its
    # real ones, and an alphabetic language writes a second given name where one will
    # not reach — `한진혜미유효영지경혜연림정` and `Annette Tanja`, each of them one
    # person. Both are the name generator answering a caller who asked for a length; a
    # sentence is asking for a name. `_name_span` is what the budget measured this
    # phrase against, and an unsteered draw is what fits it.
    drawn = draw_name(
        # `WordLanguage` and `NameLanguage` list the same nine codes.
        language,
        include_surname=False,
        realism=settings.realism,
        starts_with=prefix,
    )
    return drawn.native, ("m" if drawn.gender == "male" else "f")


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
    if slot in ("object", "quantity"):
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

    Each level falls back along its own chain to the plain statement the `words` already
    are, so a group declares only what its language actually writes. Japanese declares
    `"polite"` alone and it serves the formal level and the question too, because the
    `か` that asks is the frame's tag rather than part of the verb.

    Args:
        state_group: The state group heading the shape, or None.
        verb_group: The verb group heading it, or None.
        mark: The kind whose mark the sentence closes on.
        style: How the sentence addresses its reader.

    Returns:
        The pool the predicate is drawn from.
    """
    group: StateGroup | VerbGroup = state_group if state_group is not None else verb_group  # type: ignore[assignment]

    for key in FORM_CHAIN[style][mark]:
        pool = group.forms.get(key)

        if pool:
            return tuple(_one_of(entry) for entry in pool)

    return group.words


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
    avoid: frozenset[str],
) -> tuple[str, str]:
    """What a phrase that is not a noun phrase writes, and the word it is a form of.

    `avoid` holds what the result has already said, and the plain form is what it holds:
    `끓습니까` and `끓어` are one verb said twice, so remembering the written form would
    remember nothing. It is a preference and not a filter — the range comes first, and a
    pool with nothing unused left inside it is drawn from as it always was.
    """

    def agreed(word: str) -> str:
        if slot == "state" and data.predicate_agrees:
            return agree(lexicon, word, gender)

        return word

    if required is not None:
        # A word the caller named is named in the form a statement ends on, and the form
        # pools are index-aligned so that it can be said the other way instead.
        at = base.index(required.word) if required.word in base else -1

        return (
            agreed(predicates[at] if 0 <= at < len(predicates) else required.word),
            required.word,
        )

    if slot == "date":
        return _date_text(data), ""

    if slot == "clock":
        return _clock_text(data), ""

    pool = data.manners if slot == "manner" else data.times if slot == "time" else predicates

    def plainly(at: int) -> str:
        # A predicate is a form of the word at the same index of the group; an adverbial
        # is written whole and is its own plain form.
        if pool is predicates and 0 <= at < len(base):
            return base[at]

        return pool[at]

    least = min(low, high)
    fresh = tuple(
        word
        for at, word in enumerate(pool)
        if plainly(at) not in avoid and least <= len(word) <= high
    )
    drawn = pick(fresh) if fresh else (pick_word(pool, least, high, "") or pick(pool))

    return agreed(drawn), plainly(pool.index(drawn))


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
    # A shape with a `state` part is headed by one and a shape with a `verb` part by
    # that; a shape with neither is a copular one, which equates its subject to the date
    # or the clock it carries and takes the language's copula for a predicate.
    copular = not any(part.slot in ("state", "verb") for part in frame.parts)
    headed = copular or any(part.slot == "state" for part in frame.parts)
    wants_object = _takes_object(frame)
    # A shape whose predicate has nothing to say about the requested subject only
    # gets this far when no shape of the language did, so the fallback is the same
    # best effort every other narrowing here makes.
    state_group: StateGroup | None = None
    verb_group: VerbGroup | None = None

    if headed:
        states = (
            [data.calendar.copula]
            if copular and data.calendar is not None
            else _state_groups_for(data, themes, frame, plan) or list(data.states)
        )
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
    predicates = _form_of(state_group, verb_group, draw.mark, draw.style)
    subject_themes = _themes_for_classes(themes, subject_classes)
    # Which part is the subject is the shape's business, not the slot's: a counted
    # shape has no `subject` part and its quantity is the subject. Looking for a
    # `subject` part regardless is how a word required into a counted subject lost its
    # theme, and `사과` came out as `사과 9명` — nine people's worth of apple.
    subject_slot = _subject_slot_of(frame)
    subject_required = _required_at(frame, plan, subject_slot)
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

        if part.slot == subject_slot:
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
        elif plan.phrase.get(at[index]) is not None:
            # A word the caller required holds its place against all of this.
            # `include` says the sentence has to contain it, and a name written over
            # it would be a sentence that does not.
            proper.append(None)
        elif part.slot == "quantity":
            # A person is one person. `사과 12개` counts apples, and `서호 3명` counts
            # somebody's name, which is not a thing a sentence says.
            proper.append(None)
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
    # The predicates and adverbials this sentence spends, for the next one to leave
    # alone.
    spent: list[str] = []
    # The noun phrases this sentence drew for the slots a later one keeps.
    drawn: dict[SentenceSlot, Phrase] = {}
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
        head_cost = (len(part.head) + space if part.head else 0) + _copula_span(part, data)[0]
        overhead = gap + head_cost + _tail_min(part)
        part_high = max(1, high - used - overhead - rest_min)
        part_low = max(1, low - used - overhead - rest_max)

        if part.slot == "money":
            phrase = _money_text(data)
        elif proper[index] is not None:
            # A bare proper noun, drawn now if it was not carried in. `part_high` and
            # `part_low` are what the phrase has room for, and the name generator fits
            # them the same way a noun would.
            carried_in = proper[index]

            if carried_in:
                phrase = carried_in
            else:
                phrase, drawn_gender = _proper_name(
                    language, settings, settings.prefix if prefixable and index == 0 else ""
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
            counted = _count_span(data)[1] if part.slot == "quantity" else 0
            room = part_high - noun_low - counted
            # A phrase whose share of the range is longer than any noun of its theme
            # takes a modifier whatever the roll says, which is the only way it can
            # reach it — the alternative is a sentence that misses `min_length`.
            needed = part_low > (article_max + space if article_max else 0) + noun_high
            modify = (
                part.slot != "quantity"
                and part.modifiable
                and (
                    owed is not None
                    or needed
                    or (room >= bounds["modifier"][0] + space and chance(modify_chance))
                )
            )
            built = _noun_phrase(
                language,
                data,
                theme,
                forced=required.word if required is not None else None,
                modify=modify,
                # A counted phrase drops its article and takes no modifier: `12 apples`,
                # never `the 12 red apples`.
                bare=part.slot == "quantity" or part.bare,
                forced_modifier=owed.word if owed is not None else None,
                invent=settings.invent,
                prefix=settings.prefix if prefixable and index == 0 else "",
                low=part_low,
                high=part_high,
                span=(noun_low, noun_high),
                count=_count_text(data, theme) if part.slot == "quantity" else "",
            )
            phrase = built.text

            if part.slot == subject_slot:
                subject = built
                gender = gender_of(lexicon, _as_pool(lexicon, built.noun))

            # A place is where the result is happening and an object is what it is
            # about, so both are kept for the sentences that follow. A quantity is
            # not: `사과 12개` is an amount of something rather than a thing.
            if part.slot in ("place", "object"):
                drawn[part.slot] = built
        else:
            phrase, plain_form = _predicate_for(
                part.slot,
                lexicon,
                data,
                base,
                predicates,
                plan.phrase.get(at[index]),
                gender,
                part_low,
                part_high,
                draw.avoid,
            )

            if plain_form:
                spent.append(plain_form)

        # The opening capital belongs to whatever is written first, and that is the
        # phrase itself unless a connective or a preposition stands in front of it.
        # Applied here rather than to the finished string, so the phrase the detail
        # reports is the one the sentence actually shows.
        # The copula is written onto this phrase rather than beside it, on whichever
        # side the language puts it: `11시 40분이다` is one word and `is September 5` is
        # two. Its form comes from the same chain a verb's does, so a copular question
        # asks and a polite one is polite. A copula in front still lets the phrase keep
        # its own preposition, because German says `ist am 5. März`.
        copula = _one_of(pick(predicates)) if part.copula else ""
        opens = data.capitalize and not written
        opener = data.space.join(
            piece for piece in (copula if part.copula == "head" else "", part.head) if piece
        )
        head = (_upper(opener) if opens else opener) if opener else ""
        text = _upper(phrase) if opens and not opener else phrase
        tail = (copula if part.copula == "tail" else "") + _tail_of(part, text)

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

    # Where this sentence happened and what it was about, for the next one. The bare
    # noun rather than the phrase, so the next sentence writes its own article and may
    # put a different modifier in front of the same place.
    scene: dict[SentenceSlot, Requirement] = dict(follow.scene) if follow is not None else {}

    for slot, entry in drawn.items():
        scene.setdefault(
            slot, Requirement(entry.noun, (slot,), theme=entry.theme, known=entry.theme is not None)
        )

    return Built(
        # The opener is written against the first phrase rather than beside it —
        # Spanish `¿El león corre?`, never `¿ El león corre ?`.
        quote_open + open_mark + data.space.join(written) + tag + close + quote_close,
        tuple(reported),
        tuple(slots),
        tuple(names),
        tuple(spent),
        draw.type,
        None if named else (subject.theme if subject is not None else None),
        subject_word,
        gender
        if subject is not None or named
        else (carried.gender if carried is not None else None),
        named or (carried is not None and carried.named),
        scene,
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

OPENER_DAMP = 0.4
"""What both of those are worth when the sentence before this one already opened.

Two in a row read as a list of asides rather than as a paragraph.
"""

CONNECTIVE_KINDS: tuple[ConnectiveKind, ...] = ("additive", "temporal", "contrastive", "causal")
"""Every claim a connective can make, in the order the datasets write them."""

REFERENCE_WEIGHT = {"repeat": 25, "pronoun": 40, "fresh": 35}
"""How a sentence refers to the topic, against the other two ways of doing it."""

NAMED_DAMP = 0.6
"""What naming the topic again is worth when the topic is a person's name.

A name is the most conspicuous word in a sentence and the one a reader is least likely
to lose track of, so prose names somebody once and then leaves them alone;
`신우가 …. 신우는 …. 신우가 …` is a caption written three times.
"""


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

    A gendered pronoun is the one thing such a class can still take, and only where the
    topic carries a gender to choose it by. That is what the list is about: `he` and
    `she` cannot stand for `the locksmith`, because nothing says which of the two, and a
    name says. A language that declares no pool for that gender has none to offer, so
    Korean still drops the subject rather than writing `그것` about somebody.
    """
    gendered = data.pronouns.get(topic.gender) if topic.gender else None
    pool = gendered or data.pronouns.get("n") or ()

    if gendered is None and topic.noun_class is not None and topic.noun_class in data.pronounless:
        return tuple(word for word in pool if not word)

    return pool


def _follow_for(
    data: SentenceLanguageData,
    topic: Topic,
    scene: Mapping[SentenceSlot, Requirement],
    repeated: bool,
) -> Follow:
    """How one sentence carries on from the one before it.

    `repeated` says whether that one already named the topic, and naming it again
    straight afterwards is what makes a paragraph read as a caption written ten times —
    worst of all with a person's name, which has no pronoun to alternate with in the
    languages that leave their subject out.
    """
    pronouns = _pronouns_for(data, topic)
    # A person is an individual, not a kind of thing: a paragraph about Emma that draws
    # a `fresh` subject is a paragraph that quietly becomes about Sophie. Every other
    # topic can be another one of its own class.
    ways = ("repeat", "pronoun") if topic.named else ("repeat", "pronoun", "fresh")
    usable = ways if pronouns else tuple(way for way in ways if way != "pronoun")

    def weight_of(way: str) -> float:
        if way != "repeat":
            return REFERENCE_WEIGHT[way]

        return (
            REFERENCE_WEIGHT[way]
            * (REPEAT_DAMP if repeated else 1)
            * (NAMED_DAMP if topic.named else 1)
        )

    reference = pick_weighted(usable, weight_of)

    return Follow(topic, reference, pick(pronouns) if reference == "pronoun" else "", scene)


def _opener_for(
    data: SentenceLanguageData,
    mark: SentenceMark,
    follow: "Follow | None",
    room: int,
    shortest: int,
    flow: Flow,
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
        follow: How it carries on from the sentence before it, or None when it opens
            the result.
        room: The longest this sentence may be.
        shortest: The shortest sentence the language's shapes could spell.
        flow: What the result has already opened its sentences on.

    Returns:
        What the sentence opens on, or `""`.
    """
    spare = room - len(data.space) - shortest

    def fitting(pool: WordPool) -> tuple[str, ...]:
        # Never the same one twice in one result.
        return tuple(word for word in pool if len(word) <= spare and word not in flow.openers)

    # Far less likely at all when the sentence before this one already opened on
    # something.
    damp = OPENER_DAMP if flow.opened else 1

    if mark == "exclamation":
        usable = fitting(data.interjections)

        if usable and chance(INTERJECTION_CHANCE * damp):
            return pick(usable)

    if follow is None:
        return ""

    usable = fitting(_connectives_of(data, follow, mark))

    return pick(usable) if usable and chance(CONNECTIVE_CHANCE * damp) else ""


def _connectives_of(data: SentenceLanguageData, follow: Follow, mark: SentenceMark) -> WordPool:
    """The connectives whose claim about the sentence before this one can be true.

    Three of the four always can. Time passes whatever was said, one more thing is always
    one more thing, and any two things can be set against each other. What `causal`
    claims is that this sentence follows from the last, which needs the two of them to be
    about the same thing and this one to be telling rather than asking — `그러므로 금빛
    하이볼이 식죠?` after a sentence about a pretzel is a consequence of nothing.
    """
    follows = follow.reference != "fresh" and mark in ("statement", "trailing")

    return tuple(
        word
        for kind in CONNECTIVE_KINDS
        if follows or kind != "causal"
        for word in data.connectives.get(kind, ())
    )


def _room_for(language: WordLanguage, include_name: bool | None) -> dict[str, tuple[int, int]]:
    """The slot bounds this result is measured against.

    The language's own, with the subject narrowed to a name when the result writes one.
    A name is one word and no article — `Yvonne` where a noun phrase would write
    `die schlanke Wolke` — so a shape chosen against noun lengths is a shape a named
    sentence cannot fill. Both the result's budget and the per-sentence choice of shape
    read this rather than `_slot_bounds` directly.

    Args:
        language: The language the sentence is written in.
        include_name: Whether the result writes a person's name.

    Returns:
        The bounds every phrase of this result is measured against.
    """
    bounds = _slot_bounds(language)

    return {**bounds, "subject": _name_span(language)} if include_name else bounds


def _name_fits(
    data: SentenceLanguageData,
    frames: list[SentenceFrame],
    settings: Settings,
    language: WordLanguage,
) -> bool:
    """Whether a named result can still land in the range the caller asked for.

    A named sentence is the shorter of the two by a wide margin, so a range only the
    longer one can reach is a range a name cannot be in. Asked for a name outright the
    generator writes one anyway, the same way it answers a range too narrow for the
    parts it was told to carry; drawn, it is one more thing to decide against the room.

    Args:
        data: The language's sentence data.
        frames: Every shape the requested kinds could take.
        settings: What the caller asked for.
        language: The language the sentence is written in.

    Returns:
        Whether a name can answer the requested range.
    """
    if settings.min_length is None:
        return True

    count = settings.sentences
    gap = len(data.space) * (count - 1)
    natural = _natural_span(data, frames, _room_for(language, True))[1]

    return settings.min_length <= natural * count + gap


def _kind_for(
    data: SentenceLanguageData,
    settings: Settings,
    bounds: dict[str, tuple[int, int]],
    budget: tuple[int, int],
    flow: Flow,
) -> tuple[SentenceType, SentenceMark]:
    """The kind this sentence is, and the kind whose mark it closes on.

    Chosen against the room it has. A shape is not always answerable in a narrow range:
    a question is a different shape — Vietnamese writes `không` after the whole clause,
    English `Does` in front of the subject — and a quoted line pays for its marks out of
    the same budget. Drawing the kind first and discovering that afterwards is how
    `‘Họa sĩ có ồn ào không?’` came out of a range of 12 to 17.

    A kind the caller named is still drawn when none of them fit, which is the same best
    effort every other narrowing here makes.

    Args:
        data: The language's sentence data.
        settings: What the caller asked for.
        bounds: The bounds every phrase is measured against.
        budget: The room this sentence has.
        flow: What the result has already said, and in what register.

    Returns:
        The kind, and the kind whose mark it closes on.
    """

    def fits(mark: SentenceMark, room: tuple[int, int]) -> bool:
        # Both ends: a shape whose shortest is past the top of the budget overshoots
        # whatever it draws, and one whose longest is under the bottom falls short of it
        # however long the words are.
        return any(
            _frame_range(frame, data, bounds)[0] <= room[1]
            and _frame_range(frame, data, bounds)[1] >= room[0]
            for frame in _frames_for(data, settings, _mood_for(mark))
        )

    def marks_of(type_: SentenceType) -> tuple[SentenceMark, ...]:
        if type_ in ("dialogue", "thought"):
            return QUOTED_MARKS

        return (cast("SentenceMark", type_),)

    def room_of(type_: SentenceType) -> tuple[int, int]:
        quote = _quote_for(data, type_, settings.quote)
        marks = len(quote[0]) + len(quote[1]) if quote else 0

        return (budget[0] - marks, budget[1] - marks)

    # A paragraph stays in the register it opened in. Prose about a line may not become
    # one, so the narrated register is the closed half; a quoted one keeps the prose that
    # goes between its lines, because a line answered only by another line is one person
    # talking to themselves. Nothing to keep to on the first sentence, which is where the
    # register comes from.
    lead = flow.lead
    family = (
        settings.types
        if lead is None
        else tuple(
            type_
            for type_ in settings.types
            if (
                (type_ == lead or type_ in NARRATION)
                if lead in QUOTED_TYPES
                else type_ not in QUOTED_TYPES
            )
        )
    )
    wanted = family or settings.types
    usable = tuple(
        type_ for type_ in wanted if any(fits(mark, room_of(type_)) for mark in marks_of(type_))
    )
    pool = usable or wanted
    type_ = pick_weighted(pool, lambda each: _type_weight_for(each, flow))
    marks = tuple(mark for mark in marks_of(type_) if fits(mark, room_of(type_)))

    return type_, pick_weighted(marks or marks_of(type_), lambda mark: _mark_weight_for(mark, flow))


def _type_weight_for(type_: SentenceType, flow: Flow) -> float:
    """What one kind is worth here, in this result, after what it has already said.

    Two things move it off the flat weight. A result that opened on a quoted line is a
    scene of speech, so the line it opened on outweighs the prose around it; and a kind
    the sentence before this one already was is worth less each time it comes round
    again, so that a run of them ends by itself. The plain statement is the one thing
    exempt from that: a run of statements is what prose is.
    """
    quoted = flow.lead is not None and flow.lead in QUOTED_TYPES
    base = TYPE_WEIGHT[type_] * (QUOTED_BOOST if quoted and type_ == flow.lead else 1)

    if type_ != flow.last or type_ == "statement":
        return base

    return base * REPEAT_DAMP**flow.run


def _mark_weight_for(mark: SentenceMark, flow: Flow) -> float:
    """The same for the mark a quoted line closes on."""
    base = MARK_WEIGHT[mark]

    return base * REPEAT_DAMP if mark == flow.mark and mark != "statement" else base


def _generate_result(language: WordLanguage, settings: Settings) -> list[Built]:
    """Every sentence of one result, in order.

    The range is shared out before the first of them is drawn, and the topic is taken
    from that first sentence — so what follows is about the same thing rather than
    another draw that happened to land beside it.
    """
    data = SENTENCE_DATA[language]
    # Every shape any of the requested types could take, because the budget is shared
    # out before the first type is even drawn.
    # A quoted line can be any kind at all, so its shapes are all of them.
    frames = [
        frame
        for type_ in settings.types
        for mark in (QUOTED_MARKS if type_ in ("dialogue", "thought") else (type_,))
        for frame in _frames_for(data, settings, _mood_for(cast("SentenceMark", mark)))
    ]
    # A result either has a person in it or does not; deciding that per sentence would
    # put a name in one line of a paragraph and not the next. Settled here because it
    # takes the language's own name lengths to know whether a name can answer the range
    # that was asked for.
    named = (
        settings.include_name
        if settings.include_name is not None
        else (_name_fits(data, frames, settings, language) and chance(50))
    )
    settled = settings if settings.include_name == named else replace(settings, include_name=named)
    # And the budget is measured against what a named result actually writes: one word
    # where a noun phrase would have written an article, a modifier and a noun.
    room = _room_for(language, named)
    shortest = _natural_span(data, frames, room)[0]
    budgets = _share_out(
        _bounds_for(data, frames, room, settled), settings.sentences, len(data.space)
    )
    built: list[Built] = []
    topic: Topic | None = None
    scene: Mapping[SentenceSlot, Requirement] = {}
    # What the result has said so far — the register it opened in, and everything the
    # next sentence has to avoid saying the same way.
    flow = Flow()
    # What it has already said with its predicates and its adverbials.
    spent: set[str] = set()
    # The result's own voice, settled once. A caller who named a level gets that one
    # throughout; one who did not gets a paragraph that is at least consistent with
    # itself, rather than a level rerolled every sentence.
    voice = settings.style if settings.style is not None else pick(STYLES)

    for budget in budgets:
        type_, mark = _kind_for(data, settled, room, budget, flow)
        follow = None if topic is None else _follow_for(data, topic, scene, flow.repeated)
        draw = Draw(
            budget,
            type_,
            mark,
            _quote_for(data, type_, settings.quote),
            _opener_for(data, mark, follow, budget[1], shortest, flow),
            _style_for(type_, settings.style, voice),
            frozenset(spent),
            follow,
        )
        one = _generate_one(language, settled, draw)
        opened = draw.opener

        # `_opener_for` reserves room against the shortest sentence the shapes could
        # spell, which is a floor no draw actually reaches — the shortest word of every
        # pool at once. When the sentence that came back could not be made short enough
        # to carry what it opens on after all, that is the part worth giving up: it
        # stands in front of the whole sentence rather than instead of any piece of it.
        if draw.opener and _distance_from(len(one.sentence), budget) > 0:
            bare = _generate_one(
                language,
                settled,
                Draw(budget, type_, mark, draw.quote, "", draw.style, draw.avoid, follow),
            )

            if _distance_from(len(bare.sentence), budget) < _distance_from(
                len(one.sentence), budget
            ):
                one = bare
                opened = ""

        built.append(one)
        scene = one.scene
        spent.update(one.used)
        flow.run = flow.run + 1 if type_ == flow.last else 1
        flow.last = type_
        flow.mark = mark
        flow.opened = bool(opened)
        flow.repeated = follow is None or follow.reference == "repeat"

        if opened:
            flow.openers.add(opened)

        if flow.lead is None:
            flow.lead = type_

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

    # A fresh subject is usually another noun of the topic's own theme rather than of
    # its wider class. The class is what a paragraph may not leave — a verb that takes a
    # creature takes every creature — but a paragraph that opens on a drink and then
    # works through every edible there is reads as a list of them.
    own = follow.topic.theme

    if own is not None and own in themes and chance(THEME_CHANCE):
        return (own,)

    in_class = _themes_for_classes(themes, (follow.topic.noun_class,))

    return tuple(in_class) or themes


def _generate_one(language: WordLanguage, settings: Settings, draw: Draw) -> Built:
    """Build one sentence, as close to what was asked for as the language allows."""
    follow = draw.follow
    budget = draw.budget
    data = SENTENCE_DATA[language]
    bounds = _room_for(language, settings.include_name)
    allowed = _frames_for(data, settings, _mood_for(draw.mark))
    requested = _subject_themes_for(settings, follow)
    # The words a caller required go in the first sentence — once in the result rather
    # than once in every sentence of it.
    requirements = [] if follow is not None else [_classify(language, w) for w in settings.include]
    # What the result has already put on the page and this sentence keeps: its subject
    # when the topic is being named again, and every noun of its scene.
    pinned: dict[SentenceSlot, Requirement] = dict(follow.scene) if follow is not None else {}

    if follow is not None and follow.reference == "repeat":
        pinned["subject"] = Requirement(
            follow.topic.noun,
            ("subject",),
            theme=follow.topic.theme,
            known=follow.topic.theme is not None,
        )

    plans = {id(frame): _plan_for(frame, requirements, pinned) for frame in allowed}
    low, high = budget

    def buildable(frame: SentenceFrame) -> bool:
        # A shape is only worth drawing when the language has a predicate for it:
        # a `body` subject has no transitive verb in any language here, so a shape
        # with an object in it would have to fall back to a verb that means
        # something else.
        plan, complete = plans[id(frame)]

        if not complete:
            return False

        # A copular shape equates its subject to a day, so it is worth drawing only
        # where the subject can be one: a match is on a Tuesday and a buggy is not.
        if not any(part.slot in ("state", "verb") for part in frame.parts):
            classes = data.calendar.copula.subject if data.calendar is not None else ()

            return bool(_themes_for_classes(requested, classes))

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


def _resolve_types(type_: SentenceTypeOption | None) -> tuple[SentenceType, ...]:
    """The caller's `type`, as the set one sentence is drawn from.

    Left out, or asked for something none of these are, the set is every one of them:
    a sentence with nothing said about it is as likely to ask as to tell.
    """
    every: tuple[SentenceType, ...] = (
        "statement",
        "question",
        "exclamation",
        "trailing",
        "dialogue",
        "thought",
    )

    if type_ is None or type_ == "all":
        return every

    wanted = (type_,) if isinstance(type_, str) else tuple(type_)
    usable = tuple(each for each in wanted if each in every)

    return usable or every


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
    include_name: bool | None = None,
    type: SentenceTypeOption | None = None,
    quote: SentenceQuote | None = None,
    style: SentenceStyle | None = None,
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
        # A result either has a person in it or does not; deciding that per sentence
        # would put a name in one line of a paragraph and not the next. It is settled
        # before the language is drawn, because `_languages_for` reads it to prefer the
        # languages that can answer.
        drawn = (
            settings
            if settings.include_name is not None
            else replace(settings, include_name=chance(50))
        )
        code = draw_language(language, _languages_for(drawn))
        data = SENTENCE_DATA[code]
        built = _generate_result(code, drawn)

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
