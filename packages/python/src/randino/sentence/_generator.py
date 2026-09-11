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

import sys
from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass, field, replace
from types import MappingProxyType
from typing import cast

from randino._internal.generate import (
    collect,
    languages_writing,
    length_bounds,
    resolve_length,
    resolve_many,
    resolve_option,
    resolve_optional,
    resolve_prefix,
    resolve_realism,
    resolve_vocabulary,
    resolve_whole,
)
from randino._internal.script import ends_with_consonant, ends_with_liquid
from randino._internal.utils import (
    chance,
    pick,
    pick_weighted,
    rand_int,
    random,
    with_random,
)
from randino._types import (
    RandRealism,
    RandVocabulary,
    SentenceDetail,
    SentenceQuote,
    SentenceShapeOption,
    SentenceSlot,
    SentenceSlotOption,
    SentenceStory,
    SentenceStyle,
    SentenceTense,
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
from randino.sentence._story import (
    Beat,
    JoinSide,
    actor_classes_of,
    hero_classes_for,
    item_themes_for,
    pick_story,
    plan,
    stories_for,
    unjoined,
)
from randino.sentence._story import Plan as StoryPlan
from randino.sentence.data import SENTENCE_DATA, STORIES, THEME_CLASS, StoryStep
from randino.sentence.data._types import (
    Condition,
    ConnectiveKind,
    NounClass,
    NounTrait,
    PredicateForm,
    PredicateTense,
    ReplyCue,
    SentenceFrame,
    SentenceJoin,
    SentenceLanguageData,
    SentenceMark,
    SentenceMood,
    SentencePart,
    SentenceSpeech,
    StateGroup,
    VerbField,
    VerbGroup,
)
from randino.word._generator import (
    agree,
    draw_word,
    gender_of,
    levelled_nouns,
    modifier_follows,
    pick_word,
    pool_bounds,
    synth_bounds,
    theme_of,
)
from randino.word.data import (
    WORD_DATA,
    WORD_LANGUAGES,
    WORD_THEMES,
    resolve_theme,
    resolve_word_language,
)
from randino.word.data._types import WordAgreement, WordGender, WordLanguageData, WordPool

FIT_ATTEMPTS = 14
"""How many sentences to build before settling for the closest fit found."""

STORY_ATTEMPTS = 3

NAME_ATTEMPTS = 6
"""How many times a name is drawn again when it is one the result already carries.

Two people in one story sharing a name reads as a mistake.
"""
"""How many times a story is told before settling for the closest fit found.

A story is sentences drawn one after another against a range shared out between them,
and a run of short sentences leaves the last one a gap no shape can fill. Telling the
whole story again is what closes that.
"""

THEME_CHANCE = 65
"""How often a fresh subject is drawn from the topic's own theme.

Rather than from anywhere in the topic's class.
"""

MODIFY_CHANCE = 45
"""How often a noun phrase that may carry a modifier is given one.

Length can override it in both directions — see `_modify_chance_for`.
"""

STORY_MODIFY_CHANCE = 55
"""The same in a sentence of a story, a little more often than in a lone one.

Its modifiers are chosen for the noun they describe, and a story told in bare nouns
reads as a list of events rather than as prose.
"""

DAY_STRIDE = 4
"""How many phases of the day one sentence may move on from the last one named."""

NOUN_SLOTS: tuple[SentenceSlot, ...] = ("subject", "object", "place", "destination", "quantity")
"""The slots that are a noun phrase, and so draw from the word pools."""

UNSTORIED: tuple[SentenceSlot, ...] = ("quantity", "money", "date", "clock")
"""The slots a story never writes: an amount, a count, a date and a clock."""

MONEY_FIELDS: tuple[VerbField, ...] = ("find", "take", "carry", "hide", "lose")
"""The fields an amount of money stands beside: what is found, taken, carried, hidden, lost.

An amount used to go with every verb whose object may be an idea, which is how `remembers
5,000 dollars` came out.
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

    month = rand_int(1, 12)
    # The month goes in last, because a month's name has letters in it that the other
    # two stand for: `März` would lose its `M` to the month number.
    written = calendar.date.replace(
        "Y", str(rand_int(calendar.years[0], calendar.years[1])), 1
    ).replace("D", str(rand_int(1, 28)), 1)

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

    return calendar.clock.replace("h", str(rand_int(0, 23)), 1).replace(
        "mm", f"{rand_int(0, 59):02d}", 1
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
    number = _grouped(rand_int(numeral.count[0], numeral.count[1]), numeral.group)

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

    vocabulary: RandVocabulary
    """How common the nouns have to be."""

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

    tense: SentenceTense | None
    """When it all happened, or None when the caller left it to the generator."""

    story: SentenceStory | None
    """The story a result of several sentences follows, or None for any of them."""

    typed: bool
    """Whether the caller named the kinds themselves. A story writes statements otherwise."""

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
        "question": ("casualQuestion", "casual", "question"),
        "exclamation": ("casual", "exclamation"),
    },
    "polite": {
        "statement": ("polite",),
        "trailing": ("polite",),
        "question": ("politeQuestion", "polite", "question"),
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

    described: frozenset[str]
    """The nouns the result has already described.

    A noun is described once: `반듯한 소쿠리 … 소중한 소쿠리 … 예쁜 소쿠리` is three baskets
    rather than one, and the pinned nouns of a story are not the only ones a telling
    draws twice.
    """

    follow: "Follow | None"
    tense: SentenceTense
    """The tense every sentence of the result is in."""

    beat: "BeatDraw | None"
    """What a story asks of this sentence, or None for one drawn on its own terms."""

    link: JoinSide | None
    """Whether this sentence is the first or the second clause of one, or whole."""

    day_at: int
    """The latest phase of the day the result has reached, as an index into `times.day`.

    -1 before it has named one. A story never goes back to the morning.
    """

    speech: SentenceSpeech | None = None
    """Set for a line the hero says or thinks in their own voice.

    What stands for the subject, and the head a state takes in the first person. None for
    a sentence the result narrates.
    """

    object: "ObjectReference | None" = None
    """How this sentence refers to the object the one before it named.

    When its shape puts that noun in the object slot again. None where the object is
    named in full.
    """

    dated: bool = False
    """Whether the sentence this clause belongs to has said when already.

    It opened on a temporal connective, or its first clause named a time, so this clause
    names none — and a whole sentence names none straight after one that did, or once the
    result has said when as often as a paragraph should.
    """

    spoken: bool = False
    """Whether this sentence is a line somebody says or thinks inside a story.

    In the first person, or about the thing in front of them — which is what is said and
    nothing around it: no time, no place, no manner, and nothing in front of it. A quoted
    line drawn on its own terms is not one of these.
    """


@dataclass(frozen=True, slots=True)
class BeatDraw:
    """What one sentence of a story has to be.

    Which fields its verb may come from, which condition a state sentence says, which
    parts the shape has to carry and which it is better with, and what the nouns of the
    story are.
    """

    headed_by_state: bool
    """Whether the shape is headed by a state rather than a verb."""

    fields: tuple[VerbField, ...]
    """The fields the verb may be drawn from. Empty for a state sentence."""

    describes: bool
    """Whether this is a state sentence, whose predicate has to say `condition`."""

    condition: Condition | None
    """The condition a state sentence asserts, or None for a plain trait."""

    wants: tuple[SentenceSlot, ...]
    """The parts the shape has to carry."""

    prefers: tuple[SentenceSlot, ...]
    """The parts the shape is better for carrying."""

    item: WordTheme | None
    """The theme the story's item comes from, for a phrase that draws it."""

    places: tuple[WordTheme, ...]
    """The themes the story's places come from."""

    subject: tuple[WordTheme, ...] | None
    """The themes the subject may come from, when the story has decided it."""

    pinned: "Mapping[SentenceSlot, Requirement]" = field(default_factory=dict)
    avoid: tuple[str, ...] = ()
    """Nouns this sentence's object must not be: the story's other thing.

    A prop is never the item and the item never the prop.
    """

    state: frozenset[Condition] | None = None
    """What is true of the hero before this sentence, for a verb group that shows a
    condition to be drawn by. None for a sentence that is not the hero's."""

    nameless: bool = False
    """Whether this sentence's subject is somebody the story never introduces.

    A passer-by, a bird on a fence — written as what they are and never by a name,
    whatever `include_name` asked: a name out of nowhere in the middle of a story is
    somebody the reader was supposed to know.
    """
    """The nouns the story has put on the page that this sentence writes again, by slot.

    What `Follow.scene` carries once there is a topic to follow; this is how the first
    sentence about the hero gets them when a scene came before it.
    """


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

    line: SentenceStyle | None = None
    """The level the last quoted line was said at, for an answer to be said at too."""


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


def _story_frame(frame: SentenceFrame, beat: BeatDraw) -> bool:
    """Whether a shape can be one sentence of a story.

    It has to be headed the way the step is — a verb for something done, a state for a
    description — it may not count or price or date anything, its verb has to be one the
    step's fields can supply, and a change of scene carries no place of its own:
    `숲이 숲에서 조용해졌다` is the sentence that rule keeps out.
    """
    if any(part.slot in UNSTORIED or part.copula is not None for part in frame.parts):
        return False

    if any(part.slot == "state" for part in frame.parts) != beat.headed_by_state:
        return False

    if frame.fields is not None and not any(field in beat.fields for field in frame.fields):
        return False

    # A shape that has somewhere the story did not ask for — a destination for a hero who
    # is not going anywhere, an object for a hero with empty hands — would draw a noun the
    # story does not know.
    known = (*beat.wants, *beat.prefers)

    return all(
        part.slot in known
        for part in frame.parts
        if part.slot in ("object", "destination", "place")
    )


def _frames_for(
    data: SentenceLanguageData,
    settings: Settings,
    mood: SentenceMood,
    beat: BeatDraw | None = None,
) -> list[SentenceFrame]:
    """The shapes one sentence may take.

    Every filter falls back rather than fails: a language that has no shape carrying
    what was asked for answers with the closest it does have, the same best-effort a
    too-narrow length range gets. A language that writes its question with the mark
    alone declares no question shape, and answers with the statement shapes it does
    have — that is not a fallback so much as the point: `¿El león corre?` is the
    statement.
    """
    storied = [frame for frame in data.frames if _story_frame(frame, beat)] if beat else []
    shaped = storied or list(data.frames)
    by_mood = [frame for frame in shaped if frame.mood == mood]
    moody = by_mood or [frame for frame in shaped if frame.mood == "statement"]
    moodly = moody or shaped
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
    sloted = by_slots or usable
    # A story's sentence has to carry what the story put in it — the thing the hero is
    # holding, the place they are going — and a shape with no room for that is a shape
    # that would draw something else. Fallen back on rather than failed.
    asked = (
        [
            frame
            for frame in sloted
            if all(any(part.slot == slot for part in frame.parts) for slot in beat.wants)
        ]
        if beat is not None and beat.wants
        else sloted
    )
    allowed = asked or sloted

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
    bare: bool = False
    """True for a word written on its own, with no modifier in front of it."""

    settled: bool = False
    """True for a noun the result has already described.

    It is written again with its article and nothing else in front of it, because
    `the icy hamlet` described a second time as `the quiet hamlet` reads as another hamlet.
    """


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

    manner = next(
        (found for group in data.manners if (found := _entry_of(group.words, word)) is not None),
        None,
    )

    if manner is not None:
        written = manner
        slots.append("manner")

    time = next(
        (found for pool in _time_pools(data) if (found := _entry_of(pool, word)) is not None),
        None,
    )

    if time is not None:
        written = time
        slots.append("time")

    degree = _entry_of(data.degrees, word) if data.degrees is not None else None

    if degree is not None:
        written = degree
        slots.append("degree")

    modifier = (
        next(
            (
                found
                for group in data.modifiers
                if (found := _entry_of(group.words, word)) is not None
            ),
            None,
        )
        or _entry_of(lexicon.adjectives, word)
        or _entry_of(lexicon.actions, word)
    )

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

_NOUN_CACHE: dict[tuple[WordLanguage, WordTheme, RandVocabulary], WordPool] = {}

# The subject pools a trait narrows, by group and theme. Every group a sentence considers
# reads them for every theme it could take, and filtering two hundred nouns each time is
# what made a paragraph slow once every language had them. A group is a constant of its
# language's data and lives as long as the process, so its `id` is a stable key.
_SUBJECT_POOL_CACHE: dict[tuple[int, WordTheme, RandVocabulary], WordPool] = {}
_PLACE_POOL_CACHE: dict[tuple[WordLanguage, WordTheme, RandVocabulary], WordPool] = {}
_BOUNDS_CACHE: dict[WordLanguage, dict[str, tuple[int, int]]] = {}
_SPAN_CACHE: dict[tuple[WordLanguage, WordTheme, int, RandVocabulary], tuple[int, int]] = {}
_AGREED_CACHE: dict[tuple[WordLanguage, WordTheme | None, WordGender | None], WordPool] = {}


def _nouns_of(language: WordLanguage, theme: WordTheme, vocabulary: RandVocabulary) -> WordPool:
    """The nouns of one theme a sentence may use, as common as the caller asked.

    A language that inflects leaves out the nouns with no singular: `ножницы` and
    `Jeans` would need a plural verb beside them, and a verb pool written twice over is
    a lot of data for a dozen words.
    """
    key = (language, theme, vocabulary)
    cached = _NOUN_CACHE.get(key)

    if cached is not None:
        return cached

    data = WORD_DATA[language]
    every = levelled_nouns(data, theme, vocabulary)
    gender = data.noun_gender
    pool = (
        every
        if gender is None
        else tuple(word for word in every if gender.get(word) not in ("p", "fp"))
    )
    usable = pool or every

    _NOUN_CACHE[key] = usable

    return usable


def _noun_span(
    language: WordLanguage, theme: WordTheme, invent: int, vocabulary: RandVocabulary
) -> tuple[int, int]:
    """Shortest and longest noun one phrase can actually be given.

    Not the same question `pool_bounds` answers: at `realism="invented"` the word comes
    out of the language's syllable template rather than its pools, and English invents
    at most two syllables where its pools hold words of twelve letters. A budget
    measured against the wrong one of those is a `min_length` the phrase cannot reach.
    """
    key = (language, theme, invent, vocabulary)
    cached = _SPAN_CACHE.get(key)

    if cached is not None:
        return cached

    pool_low, pool_high = pool_bounds(_nouns_of(language, theme, vocabulary))
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


def _modifiers_for(
    language: WordLanguage, theme: WordTheme | None, gender: WordGender | None
) -> WordPool:
    """The modifiers a noun of `theme` may carry, agreed for a noun of `gender`.

    Drawn from the sentence data's own groups rather than from the nickname pools, so that
    `맑은` goes in front of a drink and never in front of a mechanic; a noun no pool holds
    takes any of them. Written out rather than agreed after the fact, because a length
    budget has to see the word the sentence will actually carry: German `blau` is
    `blauer` in front of a masculine noun.
    """
    lexicon = WORD_DATA[language]
    data = SENTENCE_DATA[language]
    # Keyed by the theme rather than the class, because a group may narrow itself to
    # themes: a soup and a tea are both edible and take different words.
    key = (language, theme, gender)
    cached = _AGREED_CACHE.get(key)

    if cached is not None:
        return cached

    cls = THEME_CLASS[theme] if theme is not None else None
    groups = (
        list(data.modifiers)
        if cls is None
        else [
            group
            for group in data.modifiers
            if cls in group.subject and (group.themes is None or theme in group.themes)
        ]
    )
    base = tuple(dict.fromkeys(word for group in groups for word in group.words))
    agreed = (
        tuple(agree(lexicon, word, gender) for word in base)
        if gender is not None and lexicon.agreement is not None
        else base
    )

    _AGREED_CACHE[key] = agreed

    return agreed


def _predicate_pools(
    words: WordPool, forms: Mapping[PredicateForm, WordPool], past: PredicateTense | None
) -> list[WordPool]:
    """Every pool a group's predicate can be written from, in either tense."""
    pools = [words, *(_endings(pool) for pool in forms.values())]

    if past is not None:
        pools.extend([past.words, *(_endings(pool) for pool in past.forms.values())])

    return pools


def _time_pools(data: SentenceLanguageData) -> list[WordPool]:
    """Every pool a time adverbial can come from, whatever the tense."""
    return [
        pool
        for pool in (data.times.day, data.times.any, data.times.past, data.times.present)
        if pool
    ]


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
    noun = _span([_nouns_of(language, theme, "full") for theme in WORD_THEMES])
    bounds = {
        "subject": noun,
        "object": noun,
        "place": noun,
        "quantity": noun,
        "destination": noun,
        # Every form a predicate can take, not only the plain statement's: a question
        # form is a different length, and the shape is chosen against these.
        "verb": _span(
            [
                pool
                for group in data.verbs
                for pool in _predicate_pools(group.words, group.forms, group.past)
            ]
        ),
        "state": _span(
            [
                pool
                for group in data.states
                for pool in _predicate_pools(group.words, group.forms, group.past)
            ]
        ),
        "manner": _span([group.words for group in data.manners]),
        "degree": _span([data.degrees]) if data.degrees else (1, 1),
        "time": _span(_time_pools(data)),
        "money": _money_span(data),
        "date": _calendar_span(data, "date"),
        "clock": _calendar_span(data, "clock"),
        "modifier": _span(
            [
                _modifiers_for(language, None, gender)
                for gender in (None, *(WORD_DATA[language].agreement or {}))
            ]
        ),
    }

    _BOUNDS_CACHE[language] = bounds

    return bounds


# The caches below key on `id()`, which is safe here and nowhere else: every
# `SentenceLanguageData` and every `SentenceFrame` is part of `SENTENCE_DATA`, a module
# constant that lives as long as the process, so no id is ever recycled under a cache.
_ARTICLE_CACHE: dict[int, tuple[int, int]] = {}


def _article_span(data: SentenceLanguageData) -> tuple[int, int]:
    """The longest and shortest article the language can open a phrase with.

    Held on to, because it is a property of the language and `_part_range` asks for it
    once per noun phrase of every shape it measures — which was three percent of a
    paragraph spent walking the same dozen articles.

    Args:
        data: The language's sentence data.

    Returns:
        The shortest and longest article it writes, and `(0, 0)` where it writes none.
    """
    cached = _ARTICLE_CACHE.get(id(data))

    if cached is not None:
        return cached

    if data.articles is None:
        span = (0, 0)
    else:
        lengths = [len(article) for rules in data.articles.values() for _, article in rules]
        span = (min(lengths, default=0), max(lengths, default=0))

    _ARTICLE_CACHE[id(data)] = span

    return span


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
    low, high = _span(_predicate_pools(group.words, group.forms, group.past))
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


_FRAME_RANGE_CACHE: dict[tuple[int, int], tuple[int, int]] = {}


def _frame_range(
    frame: SentenceFrame,
    data: SentenceLanguageData,
    bounds: dict[str, tuple[int, int]],
) -> tuple[int, int]:
    """Shortest and longest sentence a shape can produce.

    Held by the shape and the bounds it was measured against. Both live as long as the
    process: the frames are the language's own data, the language's `_slot_bounds` is
    one dict reused for every call, and the narrowed one a named result uses is built
    once per language — so keying on identity never grows.

    Worth holding because this is the hottest thing a paragraph does. Every shape of the
    language is measured to pick a kind, again to pick a shape, again per attempt, and
    again for every sentence; it and `_part_range` together were a fifth of the time a
    paragraph took.

    Args:
        frame: The shape to measure.
        data: The language's sentence data.
        bounds: What each kind of slot can contribute.

    Returns:
        The shortest and longest sentence the shape can produce.
    """
    key = (id(frame), id(bounds))
    remembered = _FRAME_RANGE_CACHE.get(key)

    if remembered is not None:
        return remembered

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

    _FRAME_RANGE_CACHE[key] = (low, high)

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
    roll = random() * total

    for frame in frames:
        roll -= weight_of(frame)

        if roll <= 0:
            return frame

    return frames[-1]


def _accepts_object(group: VerbGroup, theme: WordTheme) -> bool:
    """Whether a verb group takes a noun of this theme as its object."""
    if group.object is None or THEME_CLASS[theme] not in group.object:
        return False

    return group.object_themes is None or theme in group.object_themes


def _accepts_object_noun(data: SentenceLanguageData, group: VerbGroup, noun: str) -> bool:
    """Whether a verb group takes this noun as its object, by what the noun is.

    The same question `_accepts_noun` asks of the subject: `sips` takes a liquid, `chews`
    takes none, and `roasts` takes something raw.
    """
    if group.object_traits is None and group.object_without is None:
        return True

    traits = _traits_of(data, noun)

    if group.object_traits is not None and not any(t in traits for t in group.object_traits):
        return False

    return group.object_without is None or not any(t in traits for t in group.object_without)


_OBJECT_POOL_CACHE: dict[tuple[int, WordTheme, RandVocabulary], WordPool] = {}


def _object_pool_avoiding(
    language: WordLanguage,
    data: SentenceLanguageData,
    group: VerbGroup | StateGroup,
    theme: WordTheme,
    vocabulary: RandVocabulary,
    avoid: tuple[str, ...],
) -> WordPool:
    """The object pool without the story's other thing.

    A prop is never the item and the item never the prop. The whole pool where nothing else
    is left.
    """
    pool = _object_pool_for(language, data, group, theme, vocabulary)

    if not avoid:
        return pool

    lexicon = WORD_DATA[language]
    kept = tuple(entry for entry in pool if _plain(lexicon, entry) not in avoid)

    return kept or pool


def _object_pool_for(
    language: WordLanguage,
    data: SentenceLanguageData,
    group: VerbGroup | StateGroup,
    theme: WordTheme,
    vocabulary: RandVocabulary,
) -> WordPool:
    """The nouns of a theme a group's object may be drawn from."""
    pool = _nouns_of(language, theme, vocabulary)

    if not isinstance(group, VerbGroup) or (
        group.object_traits is None and group.object_without is None
    ):
        return pool

    key = (id(group), theme, vocabulary)
    cached = _OBJECT_POOL_CACHE.get(key)

    if cached is not None:
        return cached

    lexicon = WORD_DATA[language]
    usable = tuple(
        entry for entry in pool if _accepts_object_noun(data, group, _plain(lexicon, entry))
    )
    _OBJECT_POOL_CACHE[key] = usable

    return usable


def _object_themes_of(
    language: WordLanguage,
    data: SentenceLanguageData,
    group: VerbGroup,
    beat: BeatDraw | None,
    vocabulary: RandVocabulary,
) -> tuple[WordTheme, ...]:
    """The themes a verb group's object may come from.

    Its classes, narrowed to the themes it names when it names any, to the story's item
    when there is one, and — for a group that asks something of its object — to the
    themes that have a noun with it.
    """
    by_theme: tuple[WordTheme, ...]

    if beat is not None and beat.item is not None:
        by_theme = (beat.item,) if _accepts_object(group, beat.item) else ()
    else:
        by_class = _themes_for_classes(WORD_THEMES, group.object or ())
        by_theme = (
            by_class
            if group.object_themes is None
            else tuple(theme for theme in by_class if theme in group.object_themes)
        )

    if group.object_traits is None and group.object_without is None:
        return by_theme

    return tuple(
        theme for theme in by_theme if _object_pool_for(language, data, group, theme, vocabulary)
    )


def _verb_groups_for(
    language: WordLanguage,
    data: SentenceLanguageData,
    vocabulary: RandVocabulary,
    frame: SentenceFrame,
    themes: Sequence[WordTheme],
    plan: Plan,
    beat: BeatDraw | None = None,
    subject_noun: str | None = None,
) -> list[VerbGroup]:
    """The verb groups one sentence may use.

    Transitive exactly when the shape has an object, able to take the subject the shape
    will be given, of the field a story step settled on, and — when a word was required —
    the group that word belongs to.
    """
    # A quantity is an object with a number on it, and an amount is an object of the
    # class money belongs to — unless the quantity is what the sentence is about, in
    # which case it is the subject and the verb takes nothing.
    wants_object = _takes_object(frame)
    wants_money = any(part.slot == "money" for part in frame.parts)
    wants_destination = any(part.slot == "destination" for part in frame.parts)
    subject = _required_at(frame, plan, "subject")
    obj = _required_at(frame, plan, "object")
    verb = _required_at(frame, plan, "verb")
    # A shape that goes somewhere wants a verb that goes, and a story step wants a verb
    # of the field it settled on.
    fields = beat.fields if beat is not None and beat.fields else frame.fields
    usable = []

    for group in data.verbs:
        if (group.object is not None) != wants_object:
            continue
        if fields is not None and group.field not in fields:
            continue
        # A group that needs a part is drawn only for a shape that has it — and a shape
        # that has a destination is drawn only for the groups that go somewhere, because
        # `leaves to the market` is what the rest of the field writes there.
        if group.requires is not None and not any(
            part.slot == group.requires for part in frame.parts
        ):
            continue
        if wants_destination and group.requires != "destination":
            continue
        if wants_money and (group.object is None or group.field not in MONEY_FIELDS):
            continue
        if verb is not None and verb.word not in group.words:
            continue
        if (
            subject is not None
            and subject.theme is not None
            and not _accepts_subject(group, subject.theme)
        ):
            continue
        if subject_noun is not None and not _accepts_noun(data, group, subject_noun):
            continue
        if obj is not None and obj.theme is not None and not _accepts_object(group, obj.theme):
            continue
        if obj is not None and not _accepts_object_noun(data, group, obj.word):
            continue
        if (
            beat is not None
            and beat.item is not None
            and group.object is not None
            and not _accepts_object(group, beat.item)
        ):
            continue
        # A group that shows a condition is drawn only for a hero it is true of — and,
        # for somebody else in a story whose state nobody knows, only where it shows
        # nothing worse than being pleased: a passer-by may smile, and never clutches
        # their stomach.
        if beat is not None and group.condition is not None:
            if beat.state is not None:
                if group.condition not in beat.state:
                    continue
            elif group.condition != "content":
                continue
        if not _subject_themes_of(language, data, group, themes, vocabulary):
            continue
        if group.object is not None and not _object_themes_of(
            language, data, group, beat, vocabulary
        ):
            continue

        usable.append(group)

    # And where some group shows what is true of the hero, those are what the sentence
    # says: the hero laughs after the meal rather than sneezing after it.
    showing = (
        [group for group in usable if group.condition is not None]
        if beat is not None and beat.state is not None
        else []
    )

    return showing or usable


def _accepts_subject(group: VerbGroup | StateGroup, theme: WordTheme) -> bool:
    """Whether a group takes a noun of this theme as its subject."""
    if THEME_CLASS[theme] not in group.subject:
        return False

    return group.subject_themes is None or theme in group.subject_themes


def _subject_themes_of(
    language: WordLanguage,
    data: SentenceLanguageData,
    group: VerbGroup | StateGroup,
    themes: Sequence[WordTheme],
    vocabulary: RandVocabulary,
) -> tuple[WordTheme, ...]:
    """The themes a group's subject may come from, out of the ones asked for.

    Its classes, narrowed to the themes it names when it names any — and, for a verb group
    that asks for a trait, to the themes that have a noun with it: `날아오른다` takes an
    `animal` and no `job`, because no job flies.
    """
    by_class = _themes_for_classes(themes, group.subject)
    by_theme = (
        by_class
        if group.subject_themes is None
        else tuple(theme for theme in by_class if theme in group.subject_themes)
    )

    if isinstance(group, VerbGroup) and group.subject_traits is not None:
        return tuple(
            theme
            for theme in by_theme
            if _subject_pool_for(language, data, group, theme, vocabulary)
        )

    return by_theme


def _place_head_for(data: SentenceLanguageData, noun: str) -> str | None:
    """The preposition this place takes, where the language lists one; None for the frame's."""
    for head, pool in (data.place_heads or {}).items():
        if noun in pool:
            return head

    return None


_TRAIT_CACHE: dict[int, dict[str, tuple[NounTrait, ...]]] = {}
_NO_TRAITS: tuple[NounTrait, ...] = ()


def _traits_index_of(data: SentenceLanguageData) -> dict[str, tuple[NounTrait, ...]]:
    """Every noun the language gives a trait to, as one lookup.

    Built once per language rather than walked per question: `_accepts_noun` asks this of
    every group it considers, and searching every pool each time was six percent of what
    a paragraph took.

    Args:
        data: The language's sentence data.

    Returns:
        The traits each noun carries, by the noun.
    """
    cached = _TRAIT_CACHE.get(id(data))

    if cached is not None:
        return cached

    building: dict[str, list[NounTrait]] = {}

    for trait, pool in (data.traits or {}).items():
        for noun in pool:
            building.setdefault(noun, []).append(trait)

    index = {noun: tuple(traits) for noun, traits in building.items()}
    _TRAIT_CACHE[id(data)] = index

    return index


def _traits_of(data: SentenceLanguageData, noun: str) -> tuple[NounTrait, ...]:
    """The traits a noun carries: what its language says it can do."""
    return _traits_index_of(data).get(noun, _NO_TRAITS)


def _accepts_noun(data: SentenceLanguageData, group: VerbGroup | StateGroup, noun: str) -> bool:
    """Whether a group takes this noun as its subject, by what the noun can do.

    A group that asks for no trait takes any noun; one that asks for one takes only a noun
    that carries it; one that rules some out takes any noun that carries none of them. A
    lifeless noun neither does anything nor is anything a creature is: a spell casts no
    spell, and an amulet is never hungry.
    """
    traits = _traits_of(data, noun)

    if "lifeless" in traits:
        return False

    if not isinstance(group, VerbGroup) or (
        group.subject_traits is None and group.subject_without is None
    ):
        return True

    if group.subject_traits is not None and not any(t in traits for t in group.subject_traits):
        return False

    return group.subject_without is None or not any(t in traits for t in group.subject_without)


def _subject_pool_for(
    language: WordLanguage,
    data: SentenceLanguageData,
    group: VerbGroup | StateGroup,
    theme: WordTheme,
    vocabulary: RandVocabulary,
) -> WordPool:
    """The nouns of a theme a group's subject may be drawn from."""
    pool = _nouns_of(language, theme, vocabulary)
    narrowed = isinstance(group, VerbGroup) and (
        group.subject_traits is not None or group.subject_without is not None
    )

    # A state group narrows nothing of its own, but a lifeless noun is no subject of one
    # either.
    if not narrowed and (data.traits is None or data.traits.get("lifeless") is None):
        return pool

    key = (id(group), theme, vocabulary)
    cached = _SUBJECT_POOL_CACHE.get(key)

    if cached is not None:
        return cached

    lexicon = WORD_DATA[language]
    usable = tuple(entry for entry in pool if _accepts_noun(data, group, _plain(lexicon, entry)))
    _SUBJECT_POOL_CACHE[key] = usable

    return usable


def _place_pool_for(
    language: WordLanguage, data: SentenceLanguageData, theme: WordTheme, vocabulary: RandVocabulary
) -> WordPool:
    """The nouns of a theme a place or a destination may be drawn from.

    The ones a sentence can happen in: a wave, a comet and a lightyear are `nature` and
    `space` the way a river and a moon are, and their language lists them `"placeless"`.
    The whole theme where nothing is left, which no pool comes to.
    """
    pool = _nouns_of(language, theme, vocabulary)
    placeless = (data.traits or {}).get("placeless")

    if placeless is None:
        return pool

    key = (language, theme, vocabulary)
    cached = _PLACE_POOL_CACHE.get(key)

    if cached is not None:
        return cached

    lexicon = WORD_DATA[language]
    usable = tuple(entry for entry in pool if _plain(lexicon, entry) not in placeless)
    narrowed = usable or pool
    _PLACE_POOL_CACHE[key] = narrowed

    return narrowed


def _subject_noun_of(frame: SentenceFrame, plan: Plan, follow: Follow | None) -> str | None:
    """The noun a sentence's subject is already decided to be, or None.

    A word the caller required or the story pinned, or the topic a later sentence names
    again, stands a pronoun for, or drops — a fish that is left unsaid is still a fish. None
    where the subject is still to be drawn.
    """
    required = _required_at(frame, plan, _subject_slot_of(frame))

    if required is not None:
        return required.word

    return follow.topic.noun if follow is not None and follow.reference != "fresh" else None


def _state_groups_for(
    language: WordLanguage,
    data: SentenceLanguageData,
    vocabulary: RandVocabulary,
    themes: Sequence[WordTheme],
    frame: SentenceFrame,
    plan: Plan,
    beat: BeatDraw | None = None,
) -> list[StateGroup]:
    """The same, for a shape headed by an adjective rather than a verb."""
    subject = _required_at(frame, plan, "subject")
    state = _required_at(frame, plan, "state")
    usable = []

    for group in data.states:
        if state is not None and state.word not in group.words:
            continue
        # A story's description says what is true of the hero just now, and a plain
        # trait where nothing is: `배고프다` where the hero is hungry, and never
        # `배부르다` there.
        if beat is not None and beat.describes and group.condition != beat.condition:
            continue
        if (
            subject is not None
            and subject.theme is not None
            and not _accepts_subject(group, subject.theme)
        ):
            continue
        if not _subject_themes_of(language, data, group, themes, vocabulary):
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
    modified: bool
    """Whether a modifier was written in front of the noun, or behind it."""


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

    described: tuple[str, ...]
    """The nouns it wrote a modifier in front of, for a later sentence to leave alone."""

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

    field: VerbField | None
    """The field its verb came from, for a story to know what it did."""

    day_at: int
    """The phase of the day it named, as an index into `times.day`, or -1."""

    object: "ObjectMention | None" = None
    """The object noun this sentence wrote, and whether it named it.

    Or stood a pronoun for it — or left it out, which is a pronoun that writes nothing.
    """


@dataclass(frozen=True, slots=True)
class ObjectMention:
    """An object noun a sentence wrote, and whether it named it or referred to it."""

    noun: str
    named: bool


@dataclass(frozen=True, slots=True)
class ObjectReference:
    """The object the sentence before named, referred to rather than named again.

    `text` is what stands for it — `""` where the language leaves the object out — and
    `clitic` puts it in front of the verb rather than where the object stood.
    """

    noun: str
    text: str
    clitic: bool


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
    described: WordTheme | None,
    only: WordPool | None = None,
    vocabulary: RandVocabulary = "full",
    settled: frozenset[str] | set[str] = frozenset(),
) -> Phrase:
    """Build one noun phrase: an article, the noun, and a modifier where there is room.

    `low` and `high` are what the whole phrase has to land in. The article is reserved
    before the noun is drawn — its length is not known until the noun's gender is, so
    the longest one the language has is what gets set aside — and whatever the noun
    leaves over is what the modifier is drawn to fit. `count` is what a counted phrase
    writes beside its noun, on the side the language puts it. `described` is the theme
    the modifier is chosen for, which is the noun's own — or None for a word no pool
    holds, which takes any modifier the language has. `settled` is the nouns the result
    has already described, which are written bare however they come round again.
    """
    lexicon = WORD_DATA[language]
    # `only` is the nouns the group has narrowed the subject to: a flier for a verb that
    # takes off. The theme's whole pool otherwise.
    pool = only if only is not None else _nouns_of(language, theme, vocabulary)
    space = len(data.space)
    _, noun_max = span
    # Measured against the base forms, because the noun that decides the gender has not
    # been drawn yet; the modifier itself is chosen from the agreed pool below.
    mod_min, mod_max = pool_bounds(_modifiers_for(language, described, None))
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
    # The budget reserved room for a modifier, and a noun the result has already
    # described gives it back rather than being described a second time.
    modified = modify and drawn not in settled

    if modified:
        room = high - overhead - len(drawn) - space
        want = low - overhead - len(drawn) - space
        agreed = _modifiers_for(language, described, gender)
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
        modified,
    )


def _fresh_name(
    language: WordLanguage, settings: Settings, prefix: str, taken: list[str]
) -> tuple[str, WordGender]:
    """Draw a name nobody in this result carries yet.

    Two people in one story sharing a name reads as a mistake rather than as a
    coincidence, and the pools are small enough that an unsteered draw repeats one
    now and then.
    """
    text, gender = _proper_name(language, settings, prefix)

    for _ in range(NAME_ATTEMPTS - 1):
        if text not in taken:
            break

        text, gender = _proper_name(language, settings, prefix)

    return text, gender


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
    if part.tail_liquid and ends_with_liquid(phrase):
        return part.tail_liquid

    if part.tail_alt and ends_with_consonant(phrase):
        return part.tail_alt

    return part.tail


def _modify_chance_for(distance: int, too_long: bool, storied: bool) -> int:
    """How often a noun phrase carries a modifier on this attempt.

    The first attempt leaves it to chance; after that, a sentence that overshot the
    range drops its modifiers and one that fell short takes them everywhere, which is
    how the length range picks the shape rather than truncating a word.
    """
    if distance == 0:
        return STORY_MODIFY_CHANCE if storied else MODIFY_CHANCE

    return 0 if too_long else 100


DESTINATION_THEMES: tuple[WordTheme, ...] = ("place",)
"""Where a subject can go, and where a story happens.

`place` alone, and not the two other themes of its class: a hero can walk to the market
and not to Pluto, and a sky is not somewhere a fox goes. A `place` part on its own still
spans the class, because a fox can sleep under a sky.
"""


def _theme_for_part(
    language: WordLanguage,
    data: SentenceLanguageData,
    slot: SentenceSlot,
    group: VerbGroup | None,
    themes: Sequence[WordTheme],
    beat: BeatDraw | None,
    vocabulary: RandVocabulary,
) -> WordTheme:
    """The theme a phrase other than the subject draws from."""
    if slot in ("object", "quantity"):
        usable = (
            _object_themes_of(language, data, group, beat, vocabulary) if group is not None else ()
        )

        return pick(usable or WORD_THEMES)

    if slot == "destination":
        return pick(DESTINATION_THEMES)

    # A story happens somewhere a story can happen — a market, a park — and not on Pluto,
    # which is a place too as far as the classes know.
    places = beat.places if beat is not None else _themes_for_classes(WORD_THEMES, ("place",))

    return pick(places or tuple(themes))


def _agree_by(rules: WordAgreement, word: str, gender: WordGender | None) -> str:
    """A word reshaped by ordered `(ending, replacement)` rules for a gender.

    The same shape `word/data`'s agreement takes, applied to whatever pool a language
    says agrees. Russian's past verbs are the reason it is its own function.
    """
    chosen = rules.get(gender) if gender is not None else None

    if not chosen:
        return word

    for ending, replacement in chosen:
        if word.endswith(ending):
            return word[: len(word) - len(ending)] + replacement

    return word


def _form_of(
    state_group: StateGroup | None,
    verb_group: VerbGroup | None,
    mark: SentenceMark,
    style: SentenceStyle,
    tense: SentenceTense,
    join: SentenceJoin | None,
) -> WordPool:
    """The predicates of a group, in the form this sentence ends on.

    The first clause of a two-clause sentence takes the form that links it to the next,
    in a language that has one, and that form carries no tense, no mood and no level of
    its own. The past has its own statement and its own forms, and a level the past does
    not declare falls back along the same chain to the past statement — never to the
    present. A group with no past at all is one whose language marks it beside the verb,
    and it writes its present forms.

    Args:
        state_group: The state group heading the shape, or None.
        verb_group: The verb group heading it, or None.
        mark: The kind whose mark the sentence closes on.
        style: How the sentence addresses its reader.
        tense: When the sentence happened.
        join: How a first clause links to the next, when this is one.

    Returns:
        The pool the predicate is drawn from.
    """
    group: StateGroup | VerbGroup = state_group if state_group is not None else verb_group  # type: ignore[assignment]
    linking = group.forms.get("linking")

    if join is not None and join.form == "linking" and linking:
        return tuple(_one_of(entry) for entry in linking)

    tensed = group.past if tense == "past" and group.past is not None else group

    for key in FORM_CHAIN[style][mark]:
        pool = tensed.forms.get(key)

        if pool:
            return tuple(_one_of(entry) for entry in pool)

    return tensed.words


def _manners_for(
    data: SentenceLanguageData, subject: NounClass, field: VerbField | None
) -> WordPool:
    """The manners something of this class can do this kind of thing in.

    The groups for the class, narrowed to the ones that go with the verb's field where
    they name any. The class alone failing that, and any of them failing that.
    """
    by_class = [group for group in data.manners if subject in group.subject]
    by_field = [
        group
        for group in by_class
        if group.fields is None or (field is not None and field in group.fields)
    ]
    groups = by_field or by_class or data.manners
    seen: dict[str, None] = {}

    for group in groups:
        for word in group.words:
            seen.setdefault(word, None)

    return tuple(seen)


def _time_for(
    data: SentenceLanguageData,
    tense: SentenceTense,
    day_at: int,
    opens: bool,
    avoid: frozenset[str],
    low: int,
    high: int,
    storied: bool,
) -> tuple[str, str, int]:
    """When something happens, chosen against the tense and where the result is in its day.

    A sentence that opens a result may set it in any time its tense allows: a season, a
    habit, `yesterday` in the past and `these days` in the present. One that follows
    another only moves the day forward — the next few phases of the day, so a story that
    opened at dawn reaches noon before it reaches midnight.
    """
    times = data.times
    day = [word for at, word in enumerate(times.day) if day_at < at <= day_at + DAY_STRIDE]
    tensed = times.past if tense == "past" else times.present
    # A habit — `every day`, `요즘` — is a thing a lone sentence can say and a story
    # cannot: a story tells of the one time something happened.
    habits = () if storied else (times.habitual or ())
    free = [*times.any, *(tensed or ()), *habits] if opens else []
    pool = [*day, *free]
    usable = pool or [*times.day, *times.any]
    fits = [word for word in usable if word not in avoid and low <= len(word) <= high]
    drawn = pick(fits) if fits else (pick_word(tuple(usable), low, high, "") or pick(usable))

    return drawn, drawn, times.day.index(drawn) if drawn in times.day else -1


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
    tense: SentenceTense,
    day_at: int,
    opens: bool,
    subject: NounClass,
    storied: bool,
    field: VerbField | None,
) -> tuple[str, str, int]:
    """What a phrase that is not a noun phrase writes, its plain form, and its day phase.

    `avoid` holds what the result has already said, and the plain form is what it holds:
    `끓습니까` and `끓어` are one verb said twice, so remembering the written form would
    remember nothing. It is a preference and not a filter — the range comes first, and a
    pool with nothing unused left inside it is drawn from as it always was. The third
    value is the phase of the day a time named, as an index into `times.day`, or -1.
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
            -1,
        )

    if slot == "date":
        return _date_text(data), "", -1

    if slot == "clock":
        return _clock_text(data), "", -1

    if slot == "time":
        return _time_for(data, tense, day_at, opens, avoid, min(low, high), high, storied)

    if slot == "manner":
        pool: WordPool = _manners_for(data, subject, field)
    elif slot == "degree":
        pool = data.degrees or ()
    else:
        pool = predicates

    if not pool:
        return "", "", -1

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

    return agreed(drawn), plainly(pool.index(drawn)), -1


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
    beat = draw.beat
    lexicon = WORD_DATA[language]
    themes = tuple(requested) or WORD_THEMES
    # A shape with a `state` part is headed by one and a shape with a `verb` part by
    # that; a shape with neither is a copular one, which equates its subject to the date
    # or the clock it carries and takes the language's copula for a predicate.
    copular = not any(part.slot in ("state", "verb") for part in frame.parts)
    headed = copular or any(part.slot == "state" for part in frame.parts)
    wants_object = _takes_object(frame)
    wants_destination = any(part.slot == "destination" for part in frame.parts)
    # A shape whose predicate has nothing to say about the requested subject only
    # gets this far when no shape of the language did, so the fallback is the same
    # best effort every other narrowing here makes.
    state_group: StateGroup | None = None
    verb_group: VerbGroup | None = None

    if headed:
        states = (
            [data.calendar.copula]
            if copular and data.calendar is not None
            else _state_groups_for(language, data, settings.vocabulary, themes, frame, plan, beat)
            or list(data.states)
        )
        state_group = pick(states)
        chosen: VerbGroup | StateGroup = state_group
        base = state_group.words
    else:
        verbs = _verb_groups_for(
            language,
            data,
            settings.vocabulary,
            frame,
            themes,
            plan,
            beat,
            _subject_noun_of(frame, plan, follow),
        ) or [
            group
            for group in data.verbs
            if (group.object is not None) == wants_object
            and (group.requires is None or any(part.slot == group.requires for part in frame.parts))
            and (not wants_destination or group.requires == "destination")
        ]
        verb_group = pick(verbs)
        chosen = verb_group
        base = verb_group.words

    # The same predicates, in the form this type of sentence ends on, in the tense the
    # result is in — or in the form that links a first clause to the one after it.
    # Index-aligned with the plain words, which is what lets a required word be
    # translated rather than written out in the wrong form.
    predicates = _form_of(
        state_group,
        verb_group,
        draw.mark,
        draw.style,
        draw.tense,
        data.join if draw.link == "first" else None,
    )
    subject_themes = _subject_themes_of(language, data, chosen, themes, settings.vocabulary)
    # Which part is the subject is the shape's business, not the slot's: a counted
    # shape has no `subject` part and its quantity is the subject.
    subject_slot = _subject_slot_of(frame)
    subject_required = _required_at(frame, plan, subject_slot)
    # A theme the caller named is honoured even when no verb group of the language
    # has anything to say about it.
    subject_theme = (
        subject_required.theme
        if subject_required is not None and subject_required.theme is not None
        else pick(subject_themes or themes)
    )
    # A sentence carrying on about the topic stands a pronoun where its subject would
    # go, and the languages that drop their subject stand nothing there at all — in
    # which case the phrase is not in the shape to carry an article, a modifier or a
    # particle. The second clause of one sentence shares the first one's subject and
    # writes nothing where it would stand, the way a dropped subject does.
    if draw.link == "second":
        pronoun: str | None = ""
    elif draw.speech is not None:
        pronoun = draw.speech.subject
    elif follow is not None and follow.reference == "pronoun":
        pronoun = follow.pronoun
    else:
        pronoun = None

    # And the object the sentence before named is referred to rather than named again,
    # where this shape puts the same noun in its object slot: left out, or stood a
    # pronoun for where the object would go or in front of the verb.
    object_required = _required_at(frame, plan, "object")
    reference = (
        draw.object
        if draw.object is not None
        and object_required is not None
        and object_required.word == draw.object.noun
        else None
    )
    referred_out = reference is not None and (reference.text == "" or reference.clitic)
    shape: list[SentencePart] = []
    at: list[int] = []

    for index, part in enumerate(frame.parts):
        if part.slot == "object" and referred_out:
            continue

        # A line is said in its own time, so it names none: `“배고프다.”`, not `“한낮에
        # 배고프다.”` — where `“부엌에서 열쇠를 찾았어!”` is what somebody says.
        if draw.spoken and part.slot == "time":
            continue

        if part.slot != "subject" or pronoun is None or pronoun:
            shape.append(part)
            at.append(index)

    # Only a shape that opens on a noun phrase with nothing in front of it can honour
    # `starts_with`; anywhere else the sentence opens on an article, a preposition or an
    # adverbial, and `collect` filters what does not match.
    first = shape[0]
    prefixable = (
        follow is None and first.slot in NOUN_SLOTS and not first.head and data.articles is None
    )
    space = len(data.space)
    opener = "" if draw.link == "second" else draw.opener
    # The first clause of a two-clause sentence closes on nothing: the mark, the tag and
    # the quotation marks all belong to the whole sentence, and the second clause
    # carries them.
    closes = draw.link != "first"
    close = data.terminators[draw.mark] if closes else ""
    open_mark = data.openers.get(draw.mark, "")
    # The quotation marks belong to the whole sentence too, but one goes on each end of
    # it: a two-clause line opens its quote on the first clause and closes it on the
    # second — `“시장에 가서 빵을 샀어.”`
    quote_pair = draw.quote or ("", "")
    quote_open = "" if draw.link == "second" else quote_pair[0]
    quote_close = quote_pair[1] if closes else ""
    tag = data.space + frame.tag if closes and frame.tag else ""
    past = draw.tense == "past"
    # What the language writes beside a verb that does not change for the past:
    # Vietnamese `đã` in front of it, Chinese `了` behind it.
    mark = data.past_mark if past and verb_group is not None and verb_group.past is None else None
    # Every phrase's theme is settled before any of them is drawn, because a length
    # budget is only as good as the pools it was measured against.
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
                language, data, part.slot, verb_group, themes, beat, settings.vocabulary
            )
        )

    # What a phrase writes instead of a noun phrase, when it writes one at all: a
    # pronoun standing in for the topic, the name a repeat carries forward, or a fresh
    # name for a phrase about a person. `""` marks the one that has to be drawn against
    # the room it is given.
    proper: list[str | None] = []

    for index, part in enumerate(shape):
        if part.slot == "subject" and pronoun:
            proper.append(pronoun)
        elif part.slot == "object" and reference is not None and not referred_out:
            proper.append(reference.text)
        elif (
            part.slot == "subject"
            and follow is not None
            and follow.reference == "repeat"
            and follow.topic.named
        ):
            proper.append(follow.topic.noun)
        elif plan.phrase.get(at[index]) is not None:
            # A word the caller required holds its place against all of this.
            proper.append(None)
        elif part.slot == "quantity":
            # A person is one person: `서호 3명` counts somebody's name.
            proper.append(None)
        else:
            theme = part_themes[index]
            person = theme is not None and THEME_CLASS[theme] == "person"
            # A name stands where a person would — and, outside the subject, only beside
            # a subject that is a person too: 성재 meets 유하, and a fox meets the baker.
            person_subject = THEME_CLASS[subject_theme] == "person" or (
                follow is not None and follow.topic.noun_class == "person"
            )
            # Never for somebody the story never introduced.
            proper.append(
                ""
                if settings.include_name
                and not (beat is not None and beat.nameless)
                and person
                and (part.slot == subject_slot or person_subject)
                else None
            )

    parts: list[SentencePart] = []

    for index, part in enumerate(shape):
        required = plan.phrase.get(at[index])

        if proper[index] is not None:
            parts.append(
                SentencePart(
                    part.slot,
                    head=part.head,
                    past_head=part.past_head,
                    tail=part.tail,
                    tail_alt=part.tail_alt,
                    tail_liquid=part.tail_liquid,
                    bare=True,
                )
            )
        elif (
            beat is not None
            and part.slot == subject_slot
            and follow is not None
            and follow.reference == "repeat"
        ) or (required is not None and (required.bare or required.settled)):
            # A story names its hero once with whatever describes them and then leaves
            # the name alone; a word required bare — home, which no modifier fits — is
            # left alone too.
            parts.append(replace(part, modifiable=False))
        else:
            parts.append(part)

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
            # the language rather than against its nouns.
            span = (
                _name_span(language)
                if proper[index] == ""
                else _noun_span(language, theme, settings.invent, settings.vocabulary)
            )
            own[part.slot] = exact or span
            # A word no pool holds is described by any modifier; a noun by the ones that
            # fit what it is.
            described = None if required is not None and not required.known else theme
            own["modifier"] = (
                (len(owed.word), len(owed.word))
                if owed is not None
                else pool_bounds(_modifiers_for(language, described, None))
            )
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
    spent: list[str] = []
    # The nouns the result has described, this sentence's own among them: two phrases of
    # one sentence describe one noun no more than two sentences do.
    settled = set(draw.described)
    described_nouns: list[str] = []
    drawn: dict[SentenceSlot, Phrase] = {}
    subject: Phrase | None = None
    named = False
    # The phase of the day this sentence named, if it named one.
    day_at = -1
    # A pronoun says nothing about its own gender, and neither does a name carried
    # over, so what agrees with either agrees with the noun it stands for.
    carries_name = any(
        word and part.slot == "subject" for word, part in zip(proper, parts, strict=True)
    )
    gender: WordGender | None = (
        follow.topic.gender
        if follow is not None and (pronoun is not None or carries_name)
        else None
    )
    # A clitic is written in front of the verb, and paid for here because it belongs to
    # no part's share of the range.
    clitic = reference.text if reference is not None and reference.clitic else ""
    used = (
        len(close)
        + len(open_mark)
        + len(tag)
        + len(quote_open)
        + len(quote_close)
        + (len(opener) + space if opener else 0)
        + (len(clitic) + space if clitic else 0)
    )

    if opener:
        written.append(_upper(opener) if data.capitalize else opener)

    for index, part in enumerate(parts):
        rest_min = sum(span[0] for span in spans[index + 1 :])
        rest_max = sum(span[1] for span in spans[index + 1 :])
        gap = 0 if index == 0 else space
        # A state group may bring its own copula, which wins over the shape's; a head
        # that carries the tense changes for the past, and agrees with the subject where
        # the language's past does (Russian `был` beside `была`).
        # A degree stands between the copula and the state it measures — `is very
        # tired`, `está muy cansado` — so whatever the state part would have written in
        # front of itself is written in front of the degree instead.
        state_at = next((k for k, each in enumerate(parts) if each.slot == "state"), -1)
        measured = part.slot == "degree" and state_at == index + 1
        head_of: SentencePart | None = (
            None
            if part.slot == "state" and index > 0 and parts[index - 1].slot == "degree"
            else parts[state_at]
            if measured
            else part
        )
        own_group = state_group if head_of is not None and head_of.slot == "state" else None
        own_head = (own_group.head if own_group is not None else None) or (
            head_of.head if head_of is not None else None
        )
        # The first and the second person take their own copula where the language has
        # one: `I am`, `are you`, `bist du`, `estás` — wherever the shape writes the
        # state's copula, which is in front of the state in a statement and in front of
        # the subject in a question.
        copular_head = (
            headed
            and own_head is not None
            and head_of is not None
            and head_of.slot in ("state", "subject")
        )

        if draw.speech is not None and copular_head:
            present_head: str | None = (
                (draw.speech.heads or {}).get(own_head or "") or draw.speech.head or own_head
            )
        else:
            present_head = own_head
        past_head = (own_group.past_head if own_group is not None else None) or (
            head_of.past_head if head_of is not None else None
        )
        tensed_head = past_head if past and past_head else present_head
        part_head = (
            _agree_by(data.past_agreement, tensed_head, gender)
            if past and past_head and data.past_agreement is not None and tensed_head
            else tensed_head
        )
        head_cost = (len(part_head) + space if part_head else 0) + _copula_span(part, data)[0]
        overhead = gap + head_cost + _tail_min(part)
        part_high = max(1, high - used - overhead - rest_min)
        part_low = max(1, low - used - overhead - rest_max)

        if part.slot == "money":
            phrase = _money_text(data)
        elif proper[index] is not None:
            carried_in = proper[index]

            if carried_in:
                phrase = carried_in
            else:
                phrase, drawn_gender = _fresh_name(
                    language,
                    settings,
                    settings.prefix if prefixable and index == 0 else "",
                    names,
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
            # takes a modifier whatever the roll says.
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
                bare=part.slot == "quantity" or part.bare,
                forced_modifier=owed.word if owed is not None else None,
                invent=settings.invent,
                prefix=settings.prefix if prefixable and index == 0 else "",
                low=part_low,
                high=part_high,
                span=(noun_low, noun_high),
                count=_count_text(data, theme) if part.slot == "quantity" else "",
                described=None if required is not None and not required.known else theme,
                only=_subject_pool_for(language, data, chosen, theme, settings.vocabulary)
                if part.slot == subject_slot
                else (
                    _object_pool_avoiding(
                        language,
                        data,
                        chosen,
                        theme,
                        settings.vocabulary,
                        beat.avoid if beat is not None else (),
                    )
                    if part.slot == "object"
                    else (
                        _place_pool_for(language, data, theme, settings.vocabulary)
                        if part.slot in ("place", "destination")
                        else None
                    )
                ),
                settled=settled,
            )
            phrase = built.text

            if built.modified:
                settled.add(built.noun)
                described_nouns.append(built.noun)

            # A place takes the preposition it takes — `on the balcony`, `at the market`,
            # `under the sky` — where the language says so, and the frame's own otherwise.
            # The budget was measured against the frame's, so the difference is paid here.
            if part.slot == "place" and part_head:
                place_head = _place_head_for(data, built.noun)

                if place_head is not None and place_head != part_head:
                    used += len(place_head) - len(part_head)
                    part_head = place_head

            if part.slot == subject_slot:
                subject = built
                gender = gender_of(lexicon, _as_pool(lexicon, built.noun))

            # A place is where the result is happening, an object is what it is about and
            # a destination is where it is going, so all three are kept for the sentences
            # that follow.
            if part.slot in ("place", "object", "destination"):
                drawn[part.slot] = built
        else:
            phrase, plain_form, named_day = _predicate_for(
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
                draw.tense,
                draw.day_at,
                # The first sentence of a result may set its scene in any time it
                # likes; the ones after it only move the day forward.
                follow is None and draw.link != "second",
                THEME_CLASS[subject_theme],
                draw.beat is not None,
                verb_group.field if verb_group is not None else None,
            )

            if plain_form:
                spent.append(plain_form)

            if named_day >= 0:
                day_at = named_day

            # A past-tense verb in a language whose verb does not change is written with
            # the language's own mark beside it — once per sentence, so the second clause
            # of one goes without — and one whose verb agrees with its subject in the
            # past is agreed with it.
            if part.slot == "verb" and past:
                if mark is not None and mark.head and draw.link != "second":
                    phrase = mark.head + data.space + phrase

                if mark is not None and mark.tail:
                    phrase += mark.tail

                if (
                    data.past_agreement is not None
                    and verb_group is not None
                    and verb_group.past is not None
                ):
                    phrase = _agree_by(data.past_agreement, phrase, gender)

        # The opening capital belongs to whatever is written first, and that is the
        # phrase itself unless a connective or a preposition stands in front of it. The
        # second clause of a sentence carries on from the first, so it opens on nothing.
        # The copula is written onto this phrase rather than beside it.
        copula = _one_of(pick(predicates)) if part.copula else ""
        opens = data.capitalize and not written and draw.link != "second"
        # A clitic goes in front of the verb, after whatever else stands there — Spanish
        # `la comió` — and is reported with neither, the way a particle is.
        head_text = data.space.join(
            piece
            for piece in (
                copula if part.copula == "head" else "",
                part_head,
                clitic if part.slot == "verb" else "",
            )
            if piece
        )
        head = (_upper(head_text) if opens else head_text) if head_text else ""
        text = _upper(phrase) if opens and not head_text else phrase
        tail = (copula if part.copula == "tail" else "") + _tail_of(part, text)

        if head:
            written.append(head)

        written.append(text + tail)
        reported.append(text)
        slots.append(part.slot)
        used += gap + head_cost + len(text) + len(tail)

        if proper[index] == "" and text != phrase:
            names[-1] = text

    # A dropped subject leaves no phrase behind, so what the next sentence carries on
    # about is the topic this one was already handed.
    carried = follow.topic if pronoun is not None and follow is not None else None

    if named:
        subject_word: str | None = reported[slots.index("subject")]
    elif subject is not None:
        subject_word = subject.noun
    else:
        subject_word = carried.noun if carried is not None and pronoun else None

    scene: dict[SentenceSlot, Requirement] = dict(follow.scene) if follow is not None else {}

    for slot, entry in drawn.items():
        # Described once, here, and never again.
        scene.setdefault(
            slot,
            Requirement(
                entry.noun, (slot,), theme=entry.theme, known=entry.theme is not None, settled=True
            ),
        )

    return Built(
        quote_open + open_mark + data.space.join(written) + tag + close + quote_close,
        tuple(reported),
        tuple(slots),
        tuple(names),
        tuple(spent),
        tuple(described_nouns),
        draw.type,
        None if named else (subject.theme if subject is not None else None),
        subject_word,
        gender
        if subject is not None or named
        else (carried.gender if carried is not None else None),
        named or (carried is not None and carried.named),
        scene,
        verb_group.field if verb_group is not None else None,
        day_at,
        ObjectMention(drawn["object"].noun, True)
        if "object" in drawn
        else (ObjectMention(reference.noun, False) if reference is not None else None),
    )


def _bounds_for(
    language: WordLanguage,
    data: SentenceLanguageData,
    frames: Sequence[SentenceFrame],
    room: dict[str, tuple[int, int]],
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
    # The top is what the result can reach, and a name lowers it: `Yvonne` where a noun
    # phrase would have written `die schlanke Wolke`. The bottom is measured against the
    # language's own nouns even then, because `sentence_length_range` is a promise about
    # the language — a name standing in the subject is no reason to write a sentence
    # shorter than the language says it writes.
    natural_high = _natural_span(data, frames, room)[1]
    natural_low = _natural_span(data, frames, _slot_bounds(language))[0]

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
    storied: bool = False,
) -> Follow:
    """How one sentence carries on from the one before it.

    `repeated` says whether that one already named the topic, and naming it again
    straight afterwards is what makes a paragraph read as a caption written ten times —
    worst of all with a person's name, which has no pronoun to alternate with in the
    languages that leave their subject out. A story never draws a fresh subject: its
    hero is whoever it opened on.
    """
    pronouns = _pronouns_for(data, topic)
    # A person is an individual, not a kind of thing: a paragraph about Emma that draws
    # a `fresh` subject is a paragraph that quietly becomes about Sophie.
    ways = ("repeat", "pronoun") if topic.named or storied else ("repeat", "pronoun", "fresh")
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


def _object_reference_for(
    language: WordLanguage,
    data: SentenceLanguageData,
    noun: str,
    forced: bool,
    named: bool,
) -> ObjectReference | None:
    """How a sentence refers to the object the sentence before it named.

    When its shape puts that noun in the object slot again. `forced` is the second clause
    of one sentence, which never names the noun its first clause just did: `소시지를
    끓여서 먹었다`, not `소시지를 끓여서 소시지를 먹었다`. A whole sentence draws between
    the two the way a subject does, and `named` damps naming it straight after the
    sentence before named it. None names the noun again, and a language with no object
    pronoun always does.
    """
    pronouns = data.object_pronouns

    if pronouns is None:
        return None

    lexicon = WORD_DATA[language]
    gender = gender_of(lexicon, _as_pool(lexicon, noun))
    pool = (pronouns.words.get(gender) if gender is not None else None) or pronouns.words.get(
        "n", ()
    )

    if not pool:
        return None

    def weight_of(way: str) -> float:
        if way == "repeat":
            return REFERENCE_WEIGHT[way] * (REPEAT_DAMP if named else 1)

        return REFERENCE_WEIGHT[way]

    if not forced and pick_weighted(["repeat", "pronoun"], weight_of) == "repeat":
        return None

    return ObjectReference(noun, pick(pool), pronouns.clitic)


def _opener_for(
    data: SentenceLanguageData,
    mark: SentenceMark,
    follow: "Follow | None",
    room: int,
    shortest: int,
    flow: Flow,
    kinds: Sequence[ConnectiveKind] | None = None,
) -> str:
    """What a sentence opens on: an interjection for an exclamation, else a connective.

    Never both — a sentence that opened on two things at once would be shouting its own
    footnote. `room` is what the sentence may be at its longest, and it is what decides
    whether it opens on anything at all. `flow` is the other half of the decision, and it
    is what makes an opener read as one: never the same word twice in one result, and far
    less likely at all when the sentence before this one already opened on something.
    `kinds` is what a story lets this sentence claim, when it is one of a story.

    Args:
        data: The language's sentence dataset.
        mark: The kind whose mark this sentence closes on.
        follow: How it carries on from the sentence before it, or None when it opens
            the result.
        room: The longest this sentence may be.
        shortest: The shortest sentence the language's shapes could spell.
        flow: What the result has already opened its sentences on.
        kinds: The kinds of connective a story allows here, or None for every kind.

    Returns:
        What the sentence opens on, or `""`.
    """
    spare = room - len(data.space) - shortest

    def fitting(pool: WordPool) -> tuple[str, ...]:
        # Never the same one twice in one result.
        return tuple(word for word in pool if len(word) <= spare and word not in flow.openers)

    damp = OPENER_DAMP if flow.opened else 1

    if mark == "exclamation":
        usable = fitting(data.interjections)

        if usable and chance(INTERJECTION_CHANCE * damp):
            return pick(usable)

    if follow is None:
        return ""

    usable = fitting(_connectives_of(data, follow, mark, kinds))

    return pick(usable) if usable and chance(CONNECTIVE_CHANCE * damp) else ""


def _connectives_of(
    data: SentenceLanguageData,
    follow: Follow,
    mark: SentenceMark,
    allowed: Sequence[ConnectiveKind] | None = None,
) -> WordPool:
    """The connectives whose claim about the sentence before this one can be true.

    Three of the four always can. What `causal` claims is that this sentence follows from
    the last, which needs the two of them to be about the same thing and this one to be
    telling rather than asking. A story has already decided what each of its sentences
    may claim, and hands the kinds in.
    """
    follows = follow.reference != "fresh" and mark in ("statement", "trailing")
    wanted = CONNECTIVE_KINDS if allowed is None else tuple(allowed)

    return tuple(
        word
        for kind in wanted
        if follows or kind != "causal"
        for word in data.connectives.get(kind, ())
    )


_ROOM_CACHE: dict[WordLanguage, dict[str, tuple[int, int]]] = {}


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

    if not include_name:
        return bounds

    # Held rather than rebuilt, and not only to save the copy: `_frame_range` keys what
    # it remembers on the bounds dict it was handed, so a fresh one per sentence would
    # be a fresh cache per sentence.
    narrowed = _ROOM_CACHE.get(language)

    if narrowed is None:
        narrowed = {**bounds, "subject": _name_span(language)}
        _ROOM_CACHE[language] = narrowed

    return narrowed


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


@dataclass(frozen=True, slots=True)
class Result:
    """Everything one result is made of."""

    built: list[Built]
    tense: SentenceTense
    story: SentenceStory | None
    theme: WordTheme | None
    """What the result is about: its hero's theme in a story, else the first sentence's."""


TIME_SHARE = 4
"""How many of a result's sentences may say when, as a share of its count.

One in four, and never two in a row: `아침에 … 한낮에 … 저녁에 … 밤에` in a paragraph of
six is a timetable rather than a paragraph.
"""


def _time_spent(built: Sequence[Built], count: int) -> bool:
    """Whether the next sentence of a result has to leave the time out.

    The one before it named one, or the result has named its share already.
    """
    last = built[-1] if built else None
    named = sum(1 for one in built if "time" in one.slots)

    return (last is not None and "time" in last.slots) or named >= max(1, -(-count // TIME_SHARE))


def _length_of(data: SentenceLanguageData, built: Sequence[Built]) -> int:
    """The whole of a result as one string, which is what the caller's range describes."""
    return sum(len(one.sentence) for one in built) + len(data.space) * (len(built) - 1)


@dataclass(frozen=True, slots=True)
class Telling:
    """What every sentence of one result is drawn against, settled before the first."""

    language: WordLanguage
    data: SentenceLanguageData
    settings: Settings
    budgets: list[tuple[int, int]]
    room: dict[str, tuple[int, int]]
    shortest: int
    flow: Flow
    spent: set[str]
    described: set[str]
    voice: SentenceStyle
    tense: SentenceTense


def _draw_one(telling: Telling, draw: Draw) -> tuple[Built, str]:
    """One sentence, drawn again without what it opened on when that put it out of range.

    `_opener_for` reserves room against the shortest sentence the shapes could spell,
    which is a floor no draw actually reaches. When the sentence that came back could not
    be made short enough to carry what it opens on after all, that is the part worth
    giving up: it stands in front of the whole sentence rather than instead of any piece
    of it.
    """
    one = _generate_one(telling.language, telling.settings, draw)
    opened = draw.opener

    if draw.opener and _distance_from(len(one.sentence), draw.budget) > 0:
        bare = _generate_one(telling.language, telling.settings, replace(draw, opener=""))

        if _distance_from(len(bare.sentence), draw.budget) < _distance_from(
            len(one.sentence), draw.budget
        ):
            one = bare
            opened = ""

    return one, opened


def _generate_result(language: WordLanguage, settings: Settings) -> Result:
    """Every sentence of one result, in order.

    The range is shared out before the first of them is drawn, and the topic is taken
    from that first sentence — so what follows is about the same thing rather than
    another draw that happened to land beside it. More than one sentence is a story, when
    the language can tell one about the subject asked for; it always can, so the plain
    paragraph is what a result falls back to rather than what it usually is.
    """
    data = SENTENCE_DATA[language]
    # Every shape any of the requested kinds could take, because the budget is shared
    # out before the first of them is even drawn — and a quoted line can be any kind at
    # all, so its shapes are all of them.
    frames = [
        frame
        for type_ in settings.types
        for mark in (QUOTED_MARKS if type_ in ("dialogue", "thought") else (type_,))
        for frame in _frames_for(data, settings, _mood_for(cast("SentenceMark", mark)))
    ]
    # A result either has a person in it or does not; deciding that per sentence would
    # put a name in one line of a paragraph and not the next.
    named = (
        settings.include_name
        if settings.include_name is not None
        else (_name_fits(data, frames, settings, language) and chance(50))
    )
    settled = settings if settings.include_name == named else replace(settings, include_name=named)
    # And the budget is measured against what a named result actually writes.
    room = _room_for(language, named)
    shortest = _natural_span(data, frames, room)[0]
    budgets = _share_out(
        _bounds_for(language, data, frames, room, settled),
        settings.sentences,
        len(data.space),
    )
    # The result's own voice, settled once, and its tense likewise: a story is told in
    # one tense from start to end.
    voice = settings.style if settings.style is not None else pick(STYLES)
    tense: SentenceTense = (
        settings.tense if settings.tense is not None else ("past" if chance(50) else "present")
    )

    def telling() -> Telling:
        # What one telling of the result says as it goes. Fresh for every telling,
        # because a story told again starts over.
        return Telling(
            language,
            data,
            settled,
            budgets,
            room,
            shortest,
            Flow(),
            set(),
            set(),
            voice,
            tense,
        )

    # More than one sentence is a story, when the language can tell one about the
    # subject asked for. It always can — every class has a story — so the paragraph
    # below is what a result falls back to rather than what it usually is. A story that
    # landed outside the range is told again, and the closest telling is kept.
    if settings.sentences > 1:
        whole = _bounds_for(language, data, frames, room, settled)
        closest: Result | None = None
        missed = sys.maxsize

        for _ in range(STORY_ATTEMPTS):
            story = _tell_story(telling())

            if story is None:
                break

            miss = _distance_from(_length_of(data, story.built), whole)

            if miss < missed:
                closest = story
                missed = miss

            if miss == 0:
                break

        if closest is not None:
            return closest

    paragraph = telling()
    flow = paragraph.flow
    spent = paragraph.spent
    described = paragraph.described

    built: list[Built] = []
    topic: Topic | None = None
    scene: Mapping[SentenceSlot, Requirement] = {}

    for budget in budgets:
        type_, mark = _kind_for(data, settled, room, budget, flow)
        follow = None if topic is None else _follow_for(data, topic, scene, flow.repeated)
        item = scene.get("object")
        last = built[-1] if built else None
        draw = Draw(
            budget,
            type_,
            mark,
            _quote_for(data, type_, settings.quote),
            _opener_for(data, mark, follow, budget[1], shortest, flow),
            _style_for(type_, settings.style, voice),
            frozenset(spent),
            frozenset(described),
            follow,
            tense,
            None,
            None,
            max((one.day_at for one in built), default=-1),
            object=_object_reference_for(language, data, item.word, False, last.object.named)
            if item is not None
            and last is not None
            and last.object is not None
            and last.object.noun == item.word
            else None,
            dated=_time_spent(built, settings.sentences),
        )
        one, opened = _draw_one(paragraph, draw)

        built.append(one)
        scene = one.scene
        spent.update(one.used)
        described.update(one.described)
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

    return Result(built, tense, None, built[0].theme)


# --- Telling a story --------------------------------------------------------

STORY_KIND_WEIGHT: dict[SentenceType, int] = {"statement": 100, "exclamation": 35, "trailing": 30}

# What a line of the hero's own is: said aloud more often than thought, and exclaimed now
# and then — `“배고파!”` beside `“배고파.”`.
LINE_KINDS: tuple[SentenceType, ...] = ("dialogue", "thought")
LINE_WEIGHT: dict[SentenceType, int] = {"dialogue": 60, "thought": 40}
LINE_EXCLAIM = 30
NOTICE_EXCLAIM = 55
"""What somebody says of what they see somebody else doing is more often an exclamation."""
"""What each kind is worth in a sentence of a story, where the caller left it to the story.

A story is told in statements; a step that allows an exclamation or a trailing end gets
one now and then.
"""

FIRST_CLAUSE_SHARE = 0.5
"""What share of a two-clause sentence's range the first clause takes."""

JOIN_ROOM = 0.6
"""What share of a language's longest sentence one sentence must be allowed to join two."""


REPLY_CHAIN: dict[SentenceStyle, tuple[str, ...]] = {
    "plain": ("casual", "polite", "formal"),
    "casual": ("casual", "polite", "formal"),
    "polite": ("polite", "casual", "formal"),
    "formal": ("formal", "polite", "casual"),
}
"""Which pool an answer at each level is drawn from, best first.

A level a language does not write falls back the way a predicate form does, and
`"plain"` is never spoken.
"""


def _homecomings_of(data: SentenceLanguageData, style: SentenceStyle) -> WordPool:
    """What the language says on coming home at this level, or the nearest level it says it at."""
    for level in REPLY_CHAIN[style]:
        pool = (data.homecomings or {}).get(level)

        if pool:
            return pool

    return ()


def _replies_of(data: SentenceLanguageData, style: SentenceStyle, cue: ReplyCue) -> WordPool:
    """The replies at this level, or the nearest level written, that fit what was said.

    The pool for the cue, and every pool but the answers where the level has none for
    it — an answer to nothing is odd, and the rest fit most things.
    """
    for level in REPLY_CHAIN[style]:
        pools = (data.replies or {}).get(level)

        if pools is None:
            continue

        own = pools.get(cue)

        if own:
            return own

        rest = tuple(word for each, pool in pools.items() if each != "answer" for word in pool)

        if rest:
            return rest

    return ()


def _reply_of(entry: str) -> tuple[str, SentenceMark]:
    """A reply entry, read: what is said, and the mark it closes on.

    `잘됐다!` is exclaimed and `정말?` asked, and the tag is taken off so the language's
    own mark can be written in its place.
    """
    if entry.endswith("!"):
        return entry[:-1], "exclamation"

    if entry.endswith("?"):
        return entry[:-1], "question"

    return entry, "statement"


@dataclass(frozen=True, slots=True)
class Commented:
    """What a remark is about: a noun the story has written, or None for one to draw."""

    noun: Requirement | None
    themes: tuple[WordTheme, ...]


@dataclass(slots=True)
class Roles:
    """The nouns a story has put on the page, by the role each one plays."""

    item: Requirement | None = None
    prop: Requirement | None = None
    """The story's second thing, once a sentence has written it."""

    place: Requirement | None = None
    home: Requirement | None = None


@dataclass(frozen=True, slots=True)
class Found:
    """The story a result follows, the hero it is about and the thing in the hero's hands."""

    plan: StoryPlan
    hero: NounClass
    hero_themes: tuple[WordTheme, ...]
    item: WordTheme | None


def _story_for(telling: Telling) -> Found | None:
    """The story a result follows, or None when no story can be told about what was asked."""
    data = telling.data
    settings = telling.settings
    hero_themes = _subject_themes_for(settings, None)
    hero_classes = tuple(dict.fromkeys(THEME_CLASS[theme] for theme in hero_themes))
    candidates = list(stories_for(data, hero_classes, settings.story))
    longest = _natural_span(data, data.frames, telling.room)[1]
    joinable = telling.budgets[0][1] >= longest * JOIN_ROOM

    while candidates:
        story = pick_story(candidates)

        candidates.remove(story)

        heroes = hero_classes_for(data, story, hero_classes)

        if not heroes:
            continue

        hero = pick(heroes)
        items = item_themes_for(data, story, hero)
        item = pick(items) if items else None
        # A story is spoken in only where the caller left the kinds to it: a story told
        # on its own terms is prose, and a caller who asked for every kind gets the
        # register they asked for.
        planned = plan(data, story, hero, item, settings.sentences, joinable, not settings.typed)

        if planned is not None:
            # The hero's themes: the ones asked for, in the hero's class, and — where the
            # story narrows them — the story's own. A sketch is of a forest, not of Pluto.
            in_class = _themes_for_classes(hero_themes, (hero,))
            own = (
                tuple(theme for theme in in_class if theme in story.hero_themes)
                if story.hero_themes is not None
                else tuple(in_class)
            )

            return Found(planned, hero, own or tuple(in_class), item)

    return None


@dataclass(frozen=True, slots=True)
class Told:
    """One beat told: the sentence, its kind and mark, what it opened on, and its follow."""

    one: Built
    type: SentenceType
    mark: SentenceMark
    opened: str
    follow: Follow | None


def _tell_story(telling: Telling) -> Result | None:
    """Every sentence of a result that follows a story.

    The plan says what happens in each sentence; this writes it. The hero is the topic,
    named in the first sentence and then referred to the way a paragraph refers to its
    subject; the thing, the place and home are drawn the first time a sentence has room
    for them and pinned into every sentence after; two beats the plan joined are written
    as one sentence, the second clause without its subject.
    """
    language = telling.language
    data = telling.data
    settings = telling.settings
    found = _story_for(telling)

    if found is None:
        return None

    story = found.plan.story
    beats = found.plan.beats
    hero_themes = found.hero_themes
    roles = Roles()
    built: list[Built] = []
    topic: Topic | None = None
    day_at = -1
    at = 0
    # Whether the clause just written named the place. A story happens in one place, and
    # it does not have to say so in every line: `운동장으로 달려가서 운동장에서 날아오른다`
    # names it twice in one sentence, so a clause that follows one that named the place
    # leaves it out.
    placed = False
    # Whether the sentence just written was the hero's. After one that was not — the
    # place changing, somebody else doing something, an answer — the hero is named again
    # rather than dropped or stood a pronoun for: `바람이 분다. 조용해진다.` leaves the
    # reader asking who.
    hero_last = True

    def placeable(beat: Beat) -> bool:
        # Whether this beat may write the place: not straight after a clause that did.
        return beat.step.place and not placed

    def pinned_for(beat: Beat) -> dict[SentenceSlot, Requirement]:
        # The nouns this beat's sentence has to write, in the slots it has for them.
        pinned: dict[SentenceSlot, Requirement] = {}
        step = beat.step

        if step.object == "item" and roles.item is not None:
            pinned["object"] = roles.item

        if step.object == "prop" and roles.prop is not None:
            pinned["object"] = roles.prop

        if placeable(beat) and roles.place is not None:
            pinned["place"] = roles.place

        if step.destination == "place" and roles.place is not None:
            pinned["destination"] = roles.place

        if step.destination == "home":
            if roles.home is None:
                roles.home = Requirement(pick(data.homes), ("destination",), known=False, bare=True)

            pinned["destination"] = roles.home

        return pinned

    def place_of() -> Requirement:
        # The place the story is happening in, drawn now if no sentence has named it.
        if roles.place is None:
            theme = pick(DESTINATION_THEMES)
            lexicon = WORD_DATA[language]

            roles.place = Requirement(
                _plain(lexicon, pick(_place_pool_for(language, data, theme, settings.vocabulary))),
                ("place",),
                theme=theme,
            )

        return roles.place

    def actor_themes_for(step: StoryStep) -> tuple[WordTheme, ...]:
        # The themes an `other` step's actor is drawn from.
        if step.actor == "item":
            return (
                (found.item,)
                if found.item is not None
                else _themes_for_classes(WORD_THEMES, ("person",))
            )

        in_class = _themes_for_classes(WORD_THEMES, actor_classes_of(step, found.item))
        own = (
            tuple(theme for theme in in_class if theme in step.actor_themes)
            if step.actor_themes is not None
            else tuple(in_class)
        )

        return own or tuple(in_class)

    def comment_for(beat: Beat) -> Commented | None:
        # What a remark is about: the thing looked at, or the place — as a noun the story
        # has already written, or as a theme to draw one from.
        step = beat.step

        if step.kind == "scene":
            return Commented(place_of(), DESTINATION_THEMES)

        if step.object is not None:
            noun = roles.prop if step.object == "prop" else roles.item
            theme = found.plan.prop if step.object == "prop" else found.item

            return Commented(noun, (theme,)) if theme is not None else None

        # Talking is about the place, which is drawn now if no sentence has named it.
        return Commented(place_of(), DESTINATION_THEMES)

    def topic_for(noun: Requirement, fallback: NounClass | None) -> Topic:
        # A noun the story has written, as the topic of a sentence about it.
        lexicon = WORD_DATA[language]

        return Topic(
            noun.word,
            noun.theme,
            THEME_CLASS[noun.theme] if noun.theme is not None else fallback,
            gender_of(lexicon, _as_pool(lexicon, noun.word)),
            # A person met by name is written bare wherever they go again.
            noun.bare,
        )

    def beat_draw(beat: Beat, commented: Commented | None = None) -> BeatDraw:
        # What a beat asks of its sentence.
        step = beat.step
        wants: list[SentenceSlot] = []
        prefers: list[SentenceSlot] = []

        # A remark is about one thing and says what it is like: nothing beside the
        # subject and its state, and the subject pinned where the story has it.
        if commented is not None:
            pinned: dict[SentenceSlot, Requirement] = {}

            if commented.noun is not None:
                pinned["subject"] = replace(commented.noun, slots=("subject",), settled=True)

            return BeatDraw(
                headed_by_state=True,
                fields=(),
                describes=True,
                condition=None,
                wants=(),
                prefers=(),
                item=None,
                places=DESTINATION_THEMES,
                subject=commented.themes,
                pinned=pinned,
                avoid=(),
                state=None,
                nameless=True,
            )

        if step.destination is not None:
            wants.append("destination")

        if step.object is not None:
            wants.append("object")

        if placeable(beat):
            prefers.append("place")

        # Whose sentence this is: the hero's, the place's, or somebody else's — the
        # person the story is about, or a fresh noun of the classes the step names.
        if step.kind == "scene":
            subject: tuple[WordTheme, ...] = DESTINATION_THEMES
        elif step.kind == "other":
            subject = actor_themes_for(step)
        else:
            subject = hero_themes

        return BeatDraw(
            headed_by_state=step.kind == "state",
            fields=(beat.field,) if beat.field is not None else (),
            describes=step.kind == "state",
            condition=beat.condition,
            wants=tuple(wants),
            prefers=tuple(prefers),
            item=found.plan.prop if step.object == "prop" else found.item,
            places=DESTINATION_THEMES,
            subject=subject,
            pinned=pinned_for(beat),
            avoid=tuple(
                word
                for word in (
                    roles.item.word if step.object == "prop" and roles.item is not None else None,
                    roles.prop.word if step.object != "prop" and roles.prop is not None else None,
                )
                if word is not None
            ),
            # What is true of the hero, for the verb to be drawn by; nothing for a
            # sentence that is not about the hero.
            state=beat.before if step.kind == "act" else None,
            nameless=step.kind == "other" and step.actor != "item",
        )

    def saying_for(budget: tuple[int, int], pool: WordPool) -> tuple[Built, SentenceMark] | None:
        # A line said whole — one of the language's replies, or what it says on coming
        # home — at the level the result's lines are said in, in the marks a line of
        # dialogue takes. Built from no phrase at all. None where the pool is empty.
        if not pool:
            return None

        quote = _quote_for(data, "dialogue", settings.quote)
        assert quote is not None
        entries = [_reply_of(entry) for entry in pool]
        fresh = [entry for entry in entries if entry[0] not in telling.spent]
        usable = fresh or entries

        def length_of(entry: tuple[str, SentenceMark]) -> int:
            return (
                len(quote[0])
                + len(data.openers.get(entry[1], ""))
                + len(entry[0])
                + len(data.terminators[entry[1]])
                + len(quote[1])
            )

        fitting = [entry for entry in usable if length_of(entry) <= budget[1]]
        text, mark = pick(fitting or usable)
        written = _upper(text) if data.capitalize else text

        telling.spent.add(text)

        return (
            Built(
                quote[0] + data.openers.get(mark, "") + written + data.terminators[mark] + quote[1],
                (),
                (),
                (),
                (),
                (),
                "dialogue",
                None,
                None,
                None,
                False,
                {},
                None,
                -1,
                None,
            ),
            mark,
        )

    def shortest_for(beat: Beat) -> int:
        # The shortest sentence a beat could be written as.
        frames = _frames_for(data, settings, "statement", beat_draw(beat))

        return min(_frame_range(frame, data, telling.room)[0] for frame in frames)

    # The sentence written last, for the next one to carry on from.
    last: Built | None = None

    def tell(
        beat: Beat, budget: tuple[int, int], previous: Built | None, opened_before: str = ""
    ) -> Told:
        # One beat as one sentence, or as one clause of one.
        nonlocal topic, day_at, placed, hero_last
        scene = beat.step.kind == "scene"
        aside = beat.step.kind == "other"

        # Somebody answers the line before. Not a sentence of the story's own, and not
        # drawn: written whole, at the level the line was said in. Only after a line that
        # was actually quoted; a beat the story narrated after all is answered by nobody,
        # and the beat here is told as its own step instead.
        if (
            beat.voice == "reply"
            and topic is not None
            and last is not None
            and last.type in QUOTED_TYPES
        ):
            level = telling.flow.line if telling.flow.line is not None else pick(SPOKEN_LEVELS)
            telling.flow.line = level
            reply = saying_for(budget, _replies_of(data, level, beat.cue or "agree"))

            if reply is not None:
                hero_last = False

                return Told(reply[0], "dialogue", reply[1], "", None)

        # Coming home is said in the language's own words — `다녀왔어`, `ただいま`, `I'm
        # home` — rather than reported as arriving somewhere, which nobody says. A line,
        # so the hero's own, and said aloud: it is said to whoever is there.
        if (
            beat.voice == "line"
            and beat.field == "arrive"
            and beat.step.destination == "home"
            and topic is not None
            and beat.join is None
        ):
            level = telling.flow.line if telling.flow.line is not None else pick(SPOKEN_LEVELS)
            telling.flow.line = level
            said = saying_for(budget, _homecomings_of(data, level))

            if said is not None:
                hero_last = True

                return Told(said[0], "dialogue", said[1], "", None)

        # A second clause whose sentence has said when already — opened on `later`, or
        # named a time in its first clause — says it no second time. A whole sentence
        # says none straight after one that did, or once the result has said when as
        # often as a paragraph should.
        dated = _time_spent(built, len(beats)) or (
            beat.join == "second"
            and previous is not None
            and (opened_before in data.connectives.get("temporal", ()) or "time" in previous.slots)
        )
        # A line the hero says or thinks, in their own voice: the first person where the
        # language writes one, a level a person speaks at, and nothing in front of it —
        # nobody opens a line on "meanwhile". What is true of them is said now, and what
        # they just did is reported in the past.
        # A line needs a topic to speak, which the first sentence about the hero gives
        # it; and the second clause of a sentence speaks exactly where its first clause
        # did, because the quotation marks are the whole sentence's.
        speakable = (
            previous is not None and previous.type in QUOTED_TYPES
            if beat.join == "second"
            else topic is not None
        )
        line = beat.voice == "line" and speakable and data.speech is not None
        # A remark about the thing in front of them or the place around them, in the
        # third person: `“사과가 참 달다!”`, `“숲이 조용하네.”`
        commented = comment_for(beat) if beat.voice == "comment" and speakable else None
        # What somebody else is doing, said by the hero as they see it: the `"other"`
        # step told in the hero's voice, and in the present, because it is what is in
        # front of them — `“새가 날아가네!”`
        noticed = beat.voice == "notice" and speakable and aside
        # A question to the person beside them, in the second person: `“배고파?”`,
        # `“Are you tired?”`. Only once the story has put that person on the page.
        listener = data.listener
        company = roles.item
        asked = (
            beat.voice == "ask"
            and beat.asked is not None
            and speakable
            and listener is not None
            and company is not None
        )
        spoken = line or commented is not None or noticed or asked
        # What this sentence is doing. A caller who named the kinds gets them; the story
        # otherwise tells, and lets a step that allows more do more. A line that is
        # answered is said aloud, because nobody answers a thought — and so is a report
        # of what was just done.
        if settings.typed:
            type_, mark = _kind_for(data, settings, telling.room, budget, telling.flow)
        elif asked:
            type_, mark = "dialogue", "question"
        elif spoken:
            # What the hero makes of the person beside them is thought, not said to
            # their face.
            type_ = (
                "dialogue"
                if beat.answered or (line and beat.step.kind == "act")
                else "thought"
                if noticed and beat.step.actor == "item"
                else pick_weighted(LINE_KINDS, lambda kind: LINE_WEIGHT.get(kind, 1))
            )
            mark = (
                "exclamation"
                if chance(NOTICE_EXCLAIM if noticed else LINE_EXCLAIM)
                else "statement"
            )
        else:
            kinds: tuple[SentenceType, ...] = (
                ("statement", *beat.kinds) if beat.join is None else ("statement",)
            )
            type_ = pick_weighted(kinds, lambda kind: STORY_KIND_WEIGHT.get(kind, 1))
            mark = cast("SentenceMark", type_)

        pinned = {} if commented is not None else pinned_for(beat)
        # The sentence this one follows: the first clause for a second one, and the
        # sentence before for a whole one. What it named is what this one may refer to
        # rather than name again.
        before = previous if beat.join == "second" else last
        item = pinned.get("object")
        reference = (
            _object_reference_for(
                language, data, item.word, beat.join == "second", before.object.named
            )
            if item is not None
            and before is not None
            and before.object is not None
            and before.object.noun == item.word
            else None
        )
        follow: Follow | None

        if beat.join == "second" and previous is not None:
            # The second clause carries on from the first: its subject is the first
            # clause's, and it writes nothing where the subject would stand.
            shared = _topic_of(previous) or topic

            follow = Follow(shared, "pronoun", "", pinned) if shared is not None else None
        elif scene:
            # The scene is the one sentence whose subject is not the hero: the place the
            # story is happening in, named in full.
            place = place_of()
            lexicon = WORD_DATA[language]

            follow = Follow(
                Topic(
                    place.word,
                    place.theme,
                    "place",
                    gender_of(lexicon, _as_pool(lexicon, place.word)),
                    False,
                ),
                "repeat",
                "",
                pinned,
            )
        elif aside:
            # Somebody else's sentence: the person the story is about, named again, or a
            # fresh noun of whatever the step names — and the hero stays the topic.
            actor = roles.item if beat.step.actor == "item" else None

            if actor is not None:
                follow = Follow(topic_for(actor, "person"), "repeat", "", pinned)
            else:
                follow = Follow(topic, "fresh", "", pinned) if topic is not None else None
        elif asked:
            # The hero asks the person beside them: the subject is that person, written
            # the way the language writes a second person.
            assert company is not None and listener is not None
            follow = Follow(topic_for(company, "person"), "pronoun", listener.subject, pinned)
        elif commented is not None:
            # A remark is about the thing, which is named in full where the story has it,
            # and drawn from its theme where it has not.
            assert topic is not None
            follow = (
                Follow(topic_for(commented.noun, None), "repeat", "", pinned)
                if commented.noun is not None
                else Follow(topic, "fresh", "", pinned)
            )
        elif line:
            # The hero speaks: the subject is theirs, written the way the language writes
            # a first person.
            assert topic is not None and data.speech is not None
            follow = Follow(topic, "pronoun", data.speech.subject, pinned)
        elif topic is not None and not hero_last:
            # After a sentence that was not the hero's, the hero is named again.
            follow = Follow(topic, "repeat", "", pinned)
        else:
            follow = (
                None
                if topic is None
                else _follow_for(data, topic, pinned, telling.flow.repeated, True)
            )

        # The people of one story speak at one level: a line and its answer, and the
        # next line, are said the way the first was.
        if type_ == "dialogue" and settings.style is None:
            level = telling.flow.line if telling.flow.line is not None else pick(SPOKEN_LEVELS)
            telling.flow.line = level
            style = level
        else:
            style = _style_for(type_, settings.style, telling.voice)

        draw = Draw(
            budget,
            type_,
            mark,
            _quote_for(data, type_, settings.quote),
            ""
            if beat.join == "second" or spoken
            else _opener_for(
                data, mark, follow, budget[1], telling.shortest, telling.flow, beat.links
            ),
            style,
            frozenset(telling.spent),
            frozenset(telling.described),
            follow,
            # A line says now what is true, and reports in the past what was just done;
            # a remark, a question and what is noticed are about now.
            ("past" if beat.step.kind == "act" else "present")
            if line
            else "present"
            if commented is not None or noticed or asked
            else telling.tense,
            BeatDraw(
                headed_by_state=True,
                fields=(),
                describes=True,
                condition=beat.asked,
                wants=(),
                prefers=(),
                item=None,
                places=DESTINATION_THEMES,
                subject=_themes_for_classes(WORD_THEMES, ("person",)),
                nameless=True,
            )
            if asked
            else beat_draw(beat, commented),
            beat.join,
            day_at,
            object=reference,
            dated=dated,
            speech=data.speech if line else listener if asked else None,
            spoken=spoken,
        )
        one, opened = _draw_one(telling, draw)

        # A sentence that missed its range by more than the tolerance is drawn once more
        # the other way round about its subject: named, where it was dropped and came
        # out short; dropped or stood a pronoun for, where it was named and came out
        # long.
        if (
            follow is not None
            and not scene
            and not aside
            and not spoken
            and beat.join is None
            and _distance_from(len(one.sentence), budget) > 1
        ):
            pronouns = _pronouns_for(data, follow.topic)
            short = len(one.sentence) < budget[0]
            other: str | None = None

            if short and follow.reference == "pronoun":
                other = "repeat"
            elif not short and follow.reference == "repeat" and pronouns:
                other = "pronoun"

            if other is not None:
                again = Follow(
                    follow.topic, other, pick(pronouns) if other == "pronoun" else "", follow.scene
                )
                two, opened_again = _draw_one(telling, replace(draw, follow=again))

                if _distance_from(len(two.sentence), budget) < _distance_from(
                    len(one.sentence), budget
                ):
                    one = two
                    opened = opened_again
                    follow = again

        # What this sentence put on the page, for the rest of the story to keep.
        for slot in ("object", "place", "destination"):
            drawn = one.scene.get(slot)

            if drawn is None:
                continue

            if slot == "object":
                if beat.step.object == "prop":
                    if roles.prop is None:
                        roles.prop = replace(drawn, settled=True)
                elif roles.item is None:
                    roles.item = replace(drawn, settled=True)
            elif slot == "destination" and beat.step.destination == "elsewhere":
                # The story moved on: where it went is where it happens from here.
                roles.place = replace(drawn, slots=("place",), settled=True)
            elif (slot == "place" or beat.step.destination == "place") and roles.place is None:
                roles.place = replace(drawn, slots=("place",), settled=True)

        # A remark that drew the thing it is about has named it: that is the story's
        # thing from here on. And a person met by name — which no scene records, because
        # a name is no noun phrase — is the story's person.
        if (
            commented is not None
            and commented.noun is None
            and one.subject is not None
            and beat.step.object is not None
        ):
            role = Requirement(
                one.subject,
                ("object",),
                theme=one.theme,
                known=one.theme is not None,
                settled=True,
            )

            if beat.step.object == "prop":
                if roles.prop is None:
                    roles.prop = role
            elif roles.item is None:
                roles.item = role
        elif beat.step.object == "item" and roles.item is None and "object" not in one.scene:
            met = next((name for name in one.names if name != one.subject), None)

            if met is not None:
                roles.item = Requirement(met, ("object",), known=False, bare=True, settled=True)

        telling.spent.update(one.used)
        telling.described.update(one.described)
        placed = (
            scene
            or "place" in one.scene
            or (beat.step.destination in ("place", "elsewhere") and "destination" in one.scene)
        )
        day_at = max(day_at, one.day_at)

        if topic is None and not scene and not aside and commented is None:
            topic = _topic_of(one)

        hero_last = not scene and not aside and commented is None

        return Told(one, type_, mark, opened, follow)

    # The range is shared out again after every sentence, over the ones still to come: a
    # sentence that fell short hands what it did not use to the next one.
    total_min = sum(budget[0] for budget in telling.budgets) + len(data.space) * (
        len(telling.budgets) - 1
    )
    total_max = sum(budget[1] for budget in telling.budgets) + len(data.space) * (
        len(telling.budgets) - 1
    )
    written = 0
    i = 0

    while i < len(beats):
        beat = beats[i]
        left = sum(1 for each in beats[i:] if each.join != "second")
        gaps = len(data.space) * (at + left - 1)
        budget = _share_out(
            (max(left, total_min - written - gaps), max(left, total_max - written - gaps)),
            left,
            len(data.space),
        )[0]
        # Two beats the plan joined are written as one sentence only where the range has
        # room for both clauses; where it has not, the first is written on its own and
        # the second — never a step the story needs — is left out.
        join = data.join
        glue = (len(join.word) + len(data.space) if join is not None and join.word else 0) + len(
            data.space
        )
        joins_next = beat.join == "first" and i + 1 < len(beats)
        fits = joins_next and shortest_for(beat) + shortest_for(beats[i + 1]) + glue <= budget[1]

        if joins_next and not fits and not beats[i + 1].step.required:
            told = tell(unjoined(beat), budget, None)
            i += 1
        elif joins_next:
            # Two clauses share one sentence's range: the join between them comes off the
            # top, and each clause gets its share of what is left.
            low = max(2, budget[0] - glue)
            high = max(2, budget[1] - glue)
            first_range = (
                max(1, int(low * FIRST_CLAUSE_SHARE)),
                max(1, int(high * FIRST_CLAUSE_SHARE)),
            )
            second_range = (max(1, low - first_range[0]), max(1, high - first_range[1]))
            first = tell(beat, first_range, None)
            second = tell(beats[i + 1], second_range, first.one, first.opened)

            told = Told(
                _join_clauses(data, first.one, second.one),
                second.type,
                second.mark,
                first.opened,
                first.follow,
            )
            i += 1

            # The estimate above is the shortest the two shapes could be, and the clauses
            # are drawn against pinned nouns the estimate did not know. A two-clause
            # sentence that overshoots after all gives up its second clause where the
            # story can spare it, and is drawn again as one.
            if (
                len(told.one.sentence) > budget[1] + 1
                and not beats[i].step.required
                and len(first.one.sentence) <= budget[1]
            ):
                told = tell(unjoined(beat), budget, None)
        else:
            told = tell(beat, budget, None)

        built.append(told.one)
        last = told.one
        written += len(told.one.sentence) + (len(data.space) if at > 0 else 0)
        at += 1
        i += 1

        flow = telling.flow

        flow.run = flow.run + 1 if told.type == flow.last else 1
        flow.last = told.type
        flow.mark = told.mark
        flow.opened = bool(told.opened)

        if flow.lead is None:
            flow.lead = told.type

        # Whether the topic was just named is about the hero's own sentences: a scene,
        # somebody else's doing, a remark and an answer say nothing of it.
        if beat.step.kind not in ("scene", "other") and beat.voice is None:
            flow.repeated = told.follow is None or told.follow.reference == "repeat"

        if told.opened:
            flow.openers.add(told.opened)

    # A named hero has no theme, and the scene's place is not what the story is about.
    return Result(
        built, telling.tense, story.name, topic.theme if topic is not None else built[0].theme
    )


def _join_clauses(data: SentenceLanguageData, first: Built, second: Built) -> Built:
    """Two clauses as one sentence: the first, the language's join, then the second.

    The first clause closed on nothing and the second opened on nothing, so the seam is
    the language's own space.
    """
    glue = data.space + data.join.word if data.join is not None and data.join.word else ""

    return Built(
        first.sentence + glue + data.space + second.sentence,
        (*first.phrases, *second.phrases),
        (*first.slots, *second.slots),
        (*first.names, *second.names),
        (*first.used, *second.used),
        (*first.described, *second.described),
        second.type,
        first.theme,
        first.subject if first.subject is not None else second.subject,
        first.gender if first.gender is not None else second.gender,
        first.named or second.named,
        {**first.scene, **second.scene},
        second.field,
        max(first.day_at, second.day_at),
        second.object if second.object is not None else first.object,
    )


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
    beat = draw.beat
    data = SENTENCE_DATA[language]
    bounds = _room_for(language, settings.include_name)
    allowed = _frames_for(data, settings, _mood_for(draw.mark), beat)
    requested = (
        beat.subject
        if beat is not None and beat.subject is not None
        else _subject_themes_for(settings, follow)
    )
    # The words a caller required go in the first sentence — once in the result rather
    # than once in every sentence of it.
    requirements = [] if follow is not None else [_classify(language, w) for w in settings.include]
    # What the result has already put on the page and this sentence keeps: its subject
    # when the topic is being named again, and every noun of its scene.
    pinned: dict[SentenceSlot, Requirement] = (
        dict(follow.scene)
        if follow is not None
        else dict(draw.beat.pinned)
        if draw.beat is not None
        else {}
    )

    if follow is not None and follow.reference == "repeat":
        pinned["subject"] = Requirement(
            follow.topic.noun,
            ("subject",),
            theme=follow.topic.theme,
            known=follow.topic.theme is not None,
        )

    # The second clause of one sentence shares the first one's subject and writes
    # nothing where it would stand, the way a dropped subject does.
    if draw.link == "second":
        pinned.pop("subject", None)

    # A result that has reached the last phase of its day has no later one to name, so a
    # sentence after that carries no time at all rather than a wrong one. And a sentence
    # that opens on `later` or `잠시후` has said when already: `잠시후 한낮에` says it twice.
    spent = follow is not None and draw.day_at >= len(data.times.day) - 1
    dated = draw.dated or draw.opener in data.connectives.get("temporal", ())
    timeless = (
        [frame for frame in allowed if not any(part.slot == "time" for part in frame.parts)]
        if spent or dated
        else allowed
    )
    # A sentence that drops its subject and carries nothing else is one word — `놀아요.`,
    # `울어.` — and a paragraph with three of those in it reads as a list. So one that
    # will write no subject takes a shape with something beside the predicate. A quoted
    # line is the exception: `“배고파요.”` is what people say, and so is the second
    # clause of one sentence, which its first clause carries. An object the sentence
    # before named, which this one leaves out, counts as a phrase gone too.
    dropped = (
        draw.link != "second"
        and follow is not None
        and follow.reference == "pronoun"
        and follow.pronoun == ""
    )
    pinned_object = pinned.get("object")
    elided = (
        1
        if draw.object is not None
        and pinned_object is not None
        and pinned_object.word == draw.object.noun
        and (draw.object.text == "" or draw.object.clitic)
        else 0
    )
    # A quoted line is the one exception, by half: `“배고파요.”` is what people say, where
    # `“찾았어.”` is not — a report of what was done says what was done to what, or
    # where. So a line about a state may be the state alone, and a line that reports
    # carries one thing beside its verb.
    least = (
        3
        if not draw.spoken
        else 2
        if draw.beat is not None and not draw.beat.headed_by_state
        else 1
    )
    roomy = (
        [frame for frame in timeless if len(frame.parts) - elided >= least] if dropped else timeless
    )
    frames = roomy or timeless or allowed
    plans = {id(frame): _plan_for(frame, requirements, pinned) for frame in frames}
    low, high = budget

    def buildable(frame: SentenceFrame) -> bool:
        # A shape is only worth drawing when the language has a predicate for it.
        plan, complete = plans[id(frame)]

        if not complete:
            return False

        # A copular shape equates its subject to a day, so it is worth drawing only
        # where the subject can be one: a match is on a Tuesday and a buggy is not.
        if not any(part.slot in ("state", "verb") for part in frame.parts):
            classes = data.calendar.copula.subject if data.calendar is not None else ()

            return bool(_themes_for_classes(requested, classes))

        if any(part.slot == "state" for part in frame.parts):
            return bool(
                _state_groups_for(language, data, settings.vocabulary, requested, frame, plan, beat)
            )

        return bool(
            _verb_groups_for(
                language,
                data,
                settings.vocabulary,
                frame,
                requested,
                plan,
                beat,
                _subject_noun_of(frame, plan, follow),
            )
        )

    # Prefer a shape that can land inside the range, then one that has somewhere to
    # put every word the caller required, and settle for any of them after that.
    fitting = [
        frame
        for frame in frames
        if _frame_range(frame, data, bounds)[1] >= low
        and _frame_range(frame, data, bounds)[0] <= high
        and buildable(frame)
    ]
    # Only asked for when nothing fits. `buildable` walks every verb group of the
    # language against the shape, and computing it every time cost a quarter of what a
    # Korean paragraph took to answer a question it usually never asks.
    loose = [] if fitting else [frame for frame in frames if buildable(frame)]
    usable = fitting or loose or frames
    best: Built | None = None
    best_distance = None
    best_too_long = False

    def weigh(candidate: SentenceFrame, attempt: int) -> int:
        # After a miss, a shape whose own range runs past the requested one in the
        # direction that was missed is four times as likely. A story's sentence is
        # better for carrying what the story would rather it carried — the place it is
        # all happening in — and for saying a little more than the bare subject and verb.
        weight = 1

        if attempt > 0 and best_distance:
            own_low, own_high = _frame_range(candidate, data, bounds)

            weight *= 4 if (own_low <= low if best_too_long else own_high >= high) else 1

        if beat is not None:
            if any(part.slot in beat.prefers for part in candidate.parts):
                weight *= 3

            if len(candidate.parts) >= 3:
                weight *= 2

        return weight

    for attempt in range(FIT_ATTEMPTS):
        at = attempt
        frame = _pick_frame(usable, lambda candidate: weigh(candidate, at))  # noqa: B023
        built = _compose(
            language,
            data,
            frame,
            plans[id(frame)][0],
            requested,
            settings,
            _modify_chance_for(
                0 if attempt == 0 else (best_distance or 0), best_too_long, beat is not None
            ),
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


# Every value the fixed-set options accept. A caller the type does not check can pass
# anything; these are what is answered with rather than a shape drawn against a mood no
# frame declares, or quotation marks silently left off.
_SENTENCE_TYPES: tuple[SentenceType, ...] = (
    "statement",
    "question",
    "exclamation",
    "trailing",
    "dialogue",
    "thought",
)
_SENTENCE_SLOTS: tuple[SentenceSlot, ...] = (
    "subject",
    "verb",
    "object",
    "state",
    "place",
    "destination",
    "time",
    "manner",
    "degree",
    "quantity",
    "money",
    "date",
    "clock",
)
_SHAPES: tuple[SentenceShapeOption, ...] = ("all", "simple", "detailed", "complex")
_TENSES: tuple[SentenceTense, ...] = ("present", "past")
_QUOTES: tuple[SentenceQuote, ...] = ("single", "double")
_REALISMS: tuple[RandRealism, ...] = ("real", "mixed", "invented")
_STYLES: tuple[SentenceStyle, ...] = ("plain", "casual", "polite", "formal")
_STORIES_BY_NAME: tuple[SentenceStory, ...] = tuple(story.name for story in STORIES)


def _resolve_types(type_: SentenceTypeOption | None) -> tuple[SentenceType, ...]:
    """The caller's `type`, as the set one sentence is drawn from.

    Left out, or asked for something none of these are, the set is every one of them:
    a sentence with nothing said about it is as likely to ask as to tell.
    """
    if type_ is None or type_ == "all":
        return _SENTENCE_TYPES

    return resolve_many(type_, _SENTENCE_TYPES, _SENTENCE_TYPES)


def _resolve_slots(slots: SentenceSlotOption) -> tuple[SentenceSlot, ...] | str:
    """The caller's `slots`, in the form the generator wants.

    One slot becomes a one-entry set, and an empty sequence asks the same thing `"none"`
    does, since neither leaves any part allowed beside the subject.
    """
    if slots in ("all", "none"):
        return cast("str", slots)

    wanted = resolve_many(slots, _SENTENCE_SLOTS, ())

    # An empty set asks the same thing `"none"` does, and so does a set of slots this
    # package does not know: neither leaves any part allowed beside the subject.
    return wanted or "none"


def generate_sentence_details(
    *,
    language: WordLanguageOption = "all",
    theme: WordThemeOption = "all",
    shape: SentenceShapeOption = "all",
    slots: SentenceSlotOption = "all",
    include: str | Sequence[str] = (),
    count: int = 1,
    realism: RandRealism = "real",
    vocabulary: RandVocabulary = "common",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    random: Callable[[], float] | None = None,
    sentences: int = 1,
    include_name: bool | None = None,
    type: SentenceTypeOption | None = None,
    quote: SentenceQuote | None = None,
    style: SentenceStyle | None = None,
    tense: SentenceTense | None = None,
    story: SentenceStory | None = None,
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
        vocabulary: How common the nouns have to be.
        min_length: Minimum length in characters.
        max_length: Maximum length in characters.
        starts_with: Keep only sentences whose first character is this one.
        unique: Never return the same sentence twice.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run. Used for every draw the call makes, including the ones a
            generator makes through another.
        sentences: How many sentences one result holds.
        include_name: Whether a phrase about a person is written as a name.
        type: What the sentences are doing.
        quote: Which quotation marks a quoted line takes.
        style: How the sentences address their reader.
        tense: When it happened, or None to draw it per result.
        story: Which story a result of several sentences tells, or None to draw it.

    Returns:
        One `SentenceDetail` per result.
    """
    # Anything that is not a word is dropped with the blanks: a required word is
    # looked up in the pools, and `None.strip()` says nothing about which entry of the
    # list was wrong.
    if isinstance(include, str):
        listed: Sequence[object] = (include,)
    elif isinstance(include, Sequence):
        listed = tuple(include)
    else:
        listed = ()

    settings = Settings(
        theme=resolve_theme(theme),
        shape=resolve_option(shape, _SHAPES, "all"),
        slots=_resolve_slots(slots),
        invent=resolve_realism(realism),
        vocabulary=resolve_vocabulary(vocabulary),
        min_length=resolve_length(min_length),
        max_length=resolve_length(max_length),
        prefix=resolve_prefix(starts_with),
        include=tuple(word.strip() for word in listed if isinstance(word, str) and word.strip()),
        sentences=resolve_whole(sentences, 1, 1, RAND_SENTENCE_COUNT_MAX),
        realism=resolve_option(realism, _REALISMS, "real"),
        include_name=include_name if isinstance(include_name, bool) else None,
        types=_resolve_types(type),
        # A mark the language does not write is no quotation mark at all, and a quoted
        # line that came back without one was the whole of what went wrong.
        quote=resolve_optional(quote, _QUOTES),
        style=resolve_optional(style, _STYLES),
        tense=resolve_optional(tense, _TENSES),
        story=resolve_optional(story, _STORIES_BY_NAME),
        # A caller who named the kinds — `"all"` included — gets them; a story writes
        # statements otherwise.
        typed=type is not None,
    )

    # Settled once rather than per draw. Neither the shapes a language has nor the
    # words it holds changes between one result and the next, and `_classify` walks
    # every pool of every language to answer `include` — which is nine walks per
    # result when this sits inside the loop.
    able = _languages_for(settings)
    # And a requested first character the language does not write is one it can never
    # lead a sentence with, so those languages are out before a draw is made.
    languages = languages_writing(resolve_word_language(language), able, settings.prefix)

    if not languages:
        return []

    def draw() -> SentenceDetail:
        # Whether the result writes a person's name is settled inside
        # `_generate_result`, which is where the language's own name lengths are in
        # hand: a range only a noun phrase can reach is a range no name can answer.
        # Deciding it here left `_name_fits` unreachable, and a `min_length` of 54
        # Korean characters wrote a name in half of its results where the reference
        # implementation wrote none.
        code = pick(languages)
        data = SENTENCE_DATA[code]
        result = _generate_result(code, settings)
        built = result.built

        return SentenceDetail(
            sentence=data.space.join(one.sentence for one in built),
            sentences=tuple(one.sentence for one in built),
            phrases=tuple(phrase for one in built for phrase in one.phrases),
            slots=tuple(slot for one in built for slot in one.slots),
            names=tuple(name for one in built for name in one.names),
            types=tuple(one.type for one in built),
            tense=result.tense,
            story=result.story,
            language=code,
            # What the result is about: its hero in a story, and otherwise what its first
            # sentence was about, which the ones after it stay inside.
            theme=result.theme,
        )

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with=settings.prefix,
            draw=draw,
            key_of=lambda detail: detail.sentence,
        )
