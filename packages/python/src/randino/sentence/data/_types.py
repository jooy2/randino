"""Internal shape of the per-language sentence datasets.

Not part of the public API — callers only ever see the keyword arguments and
`SentenceDetail`. One dataset per language, beside `word/data` rather than inside it.
The word pools hold nouns and the words that sit in front of them; a sentence needs
what neither of those is — a verb in the form a sentence ends on, an adjective in the
form a predicate takes, and the shapes the language's own grammar allows. So the nouns
are still drawn from `word/data`, and everything a sentence adds to them lives here.
"""

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Literal

from randino._types import SentenceSlot
from randino.word.data._types import WordGender, WordPool

NounClass = Literal[
    "creature",
    "person",
    "plant",
    "edible",
    "thing",
    "vehicle",
    "place",
    "event",
    "idea",
    "body",
]
"""The kind of thing a noun names, as far as a verb is concerned.

A verb states the classes it accepts, and the nouns beside it are drawn from those
alone — `여우가 사과를 먹는다` and `여우가 철학을 먹는다` differ by nothing else.
Derived from `WordTheme`, so no noun carries a tag of its own: a theme is already a
slice of vocabulary, and which of these it falls into is the same in every language.
`THEME_CLASS` is where that map is written.
"""


@dataclass(frozen=True, slots=True)
class VerbGroup:
    """Verbs that take the same arguments.

    Written as a group rather than one tagged entry per verb, because the tag is the
    interesting part and a group of thirty verbs shares one: they all say what can do
    the doing, and — when the verb is transitive — what it can be done to.
    """

    subject: tuple[NounClass, ...]
    """Classes a noun has to belong to to be the subject of these verbs."""

    words: WordPool
    """The verbs themselves, in the form a plain statement ends on (`달린다`, `runs`)."""

    object: tuple[NounClass, ...] | None = None
    """Classes it can take as a direct object. Left out by an intransitive group."""


@dataclass(frozen=True, slots=True)
class StateGroup:
    """Predicate adjectives that describe the same kinds of thing.

    Grouped the way verbs are, and their own pool rather than `word/data`'s
    `adjectives`, which are written to sit in front of a noun: Korean `파란` cannot end
    a sentence and `파랗다` cannot start a noun phrase.
    """

    subject: tuple[NounClass, ...]
    """Classes a noun has to belong to to be described by these."""

    words: WordPool
    """The adjectives themselves, in the form a plain statement ends on."""


@dataclass(frozen=True, slots=True)
class SentencePart:
    """One phrase of a shape, with whatever the language writes around it.

    Both sides, because languages mark a phrase on either: Korean and Japanese suffix a
    particle, English and Chinese put a preposition in front, and a language can want
    both at once (Chinese `在` … `里`).
    """

    slot: SentenceSlot
    """What this phrase does in the sentence."""

    head: str = ""
    """Written in front of the phrase (`in`, `在`, `is`)."""

    tail: str = ""
    """Written after it (`가`, `が`, `里`)."""

    tail_alt: str = ""
    """Used instead of `tail` when the word in front of it ends on a consonant.

    That is the whole of Korean particle alternation — `사자가` beside `사슴이` — and a
    language whose particles do not alternate leaves it out.
    """

    modifiable: bool = False
    """Whether the phrase may carry a modifier when there is room for one.

    Off for a phrase that is already a fixed expression, which is every adverbial.
    """

    bare: bool = False
    """Whether the phrase goes without the article the language would otherwise give it.

    Italian is why this exists: every Italian preposition merges with the article behind
    it (`in` + `la` is `nella`), so a phrase opening on one either carries the merged
    form or carries no article at all.
    """


@dataclass(frozen=True, slots=True)
class SentenceFrame:
    """One shape a sentence can take, written in the order the language puts it in.

    Per language rather than shared, and for the same reason a nickname's frames are:
    Korean closes on its verb where English puts it second, and a language whose
    articles cannot mark an object has no shape that carries one.
    """

    parts: tuple[SentencePart, ...]
    """The phrases, in the order the language writes them."""

    weight: int
    """How often this shape is used, against the other frames of the language."""


SentenceArticles = Mapping[WordGender, tuple[tuple[str, str], ...]]
"""The article a noun takes, by its gender and how the word after the article begins.

Each rule is `(prefix, article)`; the first whose prefix matches wins, and `""` matches
anything, which is how Italian picks `l'` before a vowel, `lo` before `s` plus a
consonant, and `il` for the rest. A language whose nouns carry no gender writes every
rule under `"n"`, which is what the lookup falls back to.
"""


@dataclass(frozen=True, slots=True)
class SentenceLanguageData:
    """Everything the sentence generator knows about one language."""

    space: str
    """Placed between the phrases, and between the words inside one.

    A space in every language that writes one, and nothing in Japanese and Chinese. Not
    `word/data`'s `joiner`, which runs a nickname's words together on purpose:
    `멋진사자` is a handle, and `멋진 사자가 달린다` is a sentence.
    """

    capitalize: bool
    """Whether the sentence opens on a capital letter."""

    terminator: str
    """What the sentence closes on."""

    verbs: Sequence[VerbGroup]
    """The verbs, grouped by what they can take."""

    states: Sequence[StateGroup]
    """The predicate adjectives, grouped by what they can describe."""

    manners: WordPool
    """How something is done, written as the language writes it (`조용히`)."""

    times: WordPool
    """When it happens, written whole, particle and all (`새벽에`)."""

    frames: Sequence[SentenceFrame]
    """The shapes a sentence of this language can take."""

    articles: SentenceArticles | None = None
    """The article a noun phrase opens with. Left out by a language with no articles."""

    predicate_agrees: bool = False
    """Whether a predicate adjective agrees with its subject the way an attributive one does.

    Spanish, Italian and Russian inflect both; German inflects only the attributive
    form, so `der Wal ist blau` keeps the base word.
    """
