"""Every type randino's public API is described in.

The options themselves are keyword arguments rather than a type: `randName({ … })`
in the npm package is `rand_name(…)` here.
"""

from collections.abc import Sequence
from dataclasses import dataclass
from typing import Literal

NameLanguage = Literal["en", "ko", "ja", "zh", "it", "de", "ru", "es", "vi"]
"""A language the generator can produce names in."""

NameLanguageOption = Literal[NameLanguage, "all"]
""""all" mixes every supported language."""

NameGender = Literal["male", "female"]
"""The pool a given name is drawn from."""

NameGenderOption = Literal[NameGender, "all"]
""""all" picks a gender per name."""

NameScript = Literal["native", "roman"]
"""How a name is written out.

- `native`: the language's own script (김민준, 佐藤陽斗, Иванов Иван).
- `roman`: the English pronunciation of the native form (Kim Minjun).
"""

RandOutput = Literal["value", "detail"]
"""What a generator hands back.

- `value`: the finished strings, which is what most callers want.
- `detail`: an object per result, with the pieces it was built from.

One option rather than a second function. `rand_name_details` used to be that
second function, and splitting one generator into two over its return type meant
every option had to be documented twice.
"""

RandRealism = Literal["real", "mixed", "invented"]
"""How close to the real language a result stays.

`"real"` draws every part from the curated pools, so it is a word or a name the
language actually has. `"mixed"` decides per part, so one name can pair a real surname
with an invented given name. `"invented"` builds every part from the language's own
sounds instead, so it reads like the language without being any of its words.

Three levels rather than the 0-100 number this used to be. The decision is taken per
part and there is nothing between "always" and "half the time" worth naming, so the
numbers in between promised a precision that was not there.
"""

WordLanguage = Literal["en", "ko", "ja", "zh", "vi", "es", "it", "de", "ru"]
"""A language the word pools cover.

And so a language `rand_word`, `rand_modifier` and `rand_nickname` can work in. The
same nine `NameLanguage` holds: what used to keep a language out was word order or
agreement between a modifier and its noun, and both are the language's own data now —
the shapes in its frames, the endings in its agreement rules.
"""

WordLanguageOption = Literal[WordLanguage, "all"]
""""all" mixes every supported language."""

WordTheme = Literal[
    "animal",
    "object",
    "nature",
    "plant",
    "gem",
    "concept",
    "myth",
    "job",
    "music",
    "place",
    "food",
    "sport",
    "vehicle",
    "product",
    "color",
    "finance",
    "tech",
    "weather",
    "space",
    "time",
    "emotion",
    "body",
    "clothing",
    "tool",
    "drink",
]
"""What a word is about.

Animals (`사자`), everyday things (`물병`), nature and its phenomena (`노을`), plants
(`민들레`), stones and metals (`흑요석`), ideas from the humanities and social world
(`철학`), creatures out of myth (`구미호`), the trades and roles people hold
(`대장장이`), music (`교향곡`), places (`광장`), food (`떡볶이`), sports (`양궁`),
things that carry you (`열기구`), or things you buy (`이어폰`). Person names are
never used.

Each one is also a generator of its own — `"animal"` is `rand_animal`.
"""

WordThemeOption = Literal[WordTheme, "all"]
""""all" draws from every theme."""

WordSlot = Literal["adjective", "action", "noun", "part"]
"""What one word does inside a nickname.

`adjective` says what the noun is like (멋진, Brave, 青い), `action` what it is doing
(웃는, Laughing, 踊る), `noun` is the base word every shape is built around, and `part`
a trailing noun. `rand_nickname`'s `slots` names the ones a shape may use, and
`NicknameDetail.slots` reports the ones it did.
"""

WordSlotOption = WordSlot | Sequence[WordSlot] | Literal["all", "none"]
"""Which shapes a nickname may take, named by the slots they put beside the noun.

A shape qualifies when it uses at least one of them, so a sequence is a set to draw
from rather than a list every shape has to satisfy: `("adjective", "action")` asks for
a modifier and leaves the kind to chance. `"none"` asks for the bare noun, and `"all"`
— the default — leaves the shape to the language's own frame weights.
"""

ModifierKind = Literal["adjective", "action"]
"""The two slots that can modify a noun, which is what `rand_modifier` draws."""


@dataclass(frozen=True, slots=True)
class NameDetail:
    """A generated name in both scripts, with the choices that produced it."""

    native: str
    """The name in its own script."""

    roman: str
    """The English pronunciation of `native`. Identical to `native` for English."""

    language: NameLanguage
    """The language this name was generated in."""

    gender: NameGender
    """The pool the given name was drawn from."""


@dataclass(frozen=True, slots=True)
class WordDetail:
    """A generated word with where it came from."""

    word: str
    """The word itself."""

    language: WordLanguage
    """The language this word was drawn from."""

    theme: WordTheme | None
    """Theme the word belongs to.

    `None` when it is not one the generator knows, which happens when it was
    invented.
    """


SentenceSlot = Literal[
    "subject",
    "verb",
    "object",
    "state",
    "place",
    "time",
    "manner",
    "quantity",
    "money",
    "date",
    "clock",
]
"""What one phrase does in a sentence.

`subject` is who or what the sentence is about (`검은 고양이가`), `verb` what it does
(`잠잔다`), `object` what it does it to (`사과를`), and `state` what it is like where
the sentence has no verb at all (`파랗다`). The rest frame the action: `place` where it
happens (`숲에서`), `time` when (`새벽에`), `manner` how (`조용히`).

`quantity` is how many of something (`사과 12개`), which is a noun phrase with a number
and the counter its kind takes, and `money` is how much (`100,000원`, `12,000 dollars`).
`date` is what day (`2026년 9월 5일`) and `clock` what time of day (`11시 40분`).

A sentence is headed by a `verb` or by a `state`, and a shape with neither is a copular
one: it equates its subject to a `date` or a `clock` instead.
"""

SentenceSlotOption = SentenceSlot | Sequence[SentenceSlot] | Literal["all", "none"]
"""Which shapes a sentence may take, named by the parts they carry beside the subject.

A shape qualifies when it uses at least one of them, the same way `WordSlotOption`
reads for a nickname: a sequence is a set to draw from rather than a list every shape
has to satisfy. `"none"` asks for the bare subject and its predicate, and `"all"` — the
default — leaves the shape to the language's own frame weights.
"""

SentenceShape = Literal["simple", "detailed", "complex"]
"""How much a sentence says, which is the closest thing it has to an expected length.

`"simple"` is a subject and its predicate (`사자가 달린다`), `"detailed"` one phrase
more (`사자가 숲에서 달린다`), and `"complex"` two or more (`용감한 사자가 새벽에
숲에서 달린다`). `min_length` and `max_length` bound the characters; this bounds the
parts, which is what a caller usually means by a short or a long sentence.
"""

SentenceShapeOption = Literal[SentenceShape, "all"]
""""all" leaves the shape to the language's own frame weights."""


SentenceType = Literal["statement", "question", "exclamation", "trailing", "dialogue", "thought"]
"""What a sentence is doing.

It decides what the sentence closes on and — where the grammar needs it — the shape it
takes: `"statement"` says something, `"question"` asks it, `"exclamation"` says it with
feeling, `"trailing"` is a statement that stops rather than ends, and `"dialogue"` and
`"thought"` are lines somebody says or thinks, in the language's own quotation marks.

A question is a shape, not a punctuation mark bolted on: English writes `Does the lion
run?` and German `Läuft ein Wolf?`, and both are shapes their own frames declare. A
language whose question differs from its statement by nothing but the mark declares
none, and gets its statement shapes back. `"dialogue"` and `"thought"` are the two that
are not shapes at all: what is quoted is a sentence of one of the other kinds, drawn per
line, because somebody speaking asks more often than a page of prose does — and still
tells more often than either.
"""

SentenceStyle = Literal["plain", "casual", "polite", "formal"]
"""How a sentence addresses whoever is reading it.

Four levels, which is what a Korean speech level actually is. `"plain"` is the form a
written statement takes (`사자가 달린다`, `猫が走る`), addressed to nobody; `"casual"`
is what you say to someone you are close to (`사자가 달려`); `"polite"` is the same
closeness said politely (`사자가 달려요`), the warmest of the four; `"formal"` is polite
and at a distance (`사자가 달립니다`, `猫が走ります`).

Korean has all four. Japanese has two and maps onto them, `"casual"` being its plain
form and `"polite"` and `"formal"` both `走ります`. Spanish, Italian, German and Russian
have a T–V distinction, but it lives in the second person and every sentence here is
third; English has no such form at all. In those seven all four levels write exactly the
same sentence.
"""

SentenceQuote = Literal["double", "single"]
"""Which pair of quotation marks a quoted line takes.

Left out, `"dialogue"` takes the language's first-level marks and `"thought"` the ones
it keeps for a second level — `“…”` beside `‘…’` in English, `«…»` beside `„…“` in
Russian.
"""

SentenceTypeOption = SentenceType | Sequence[SentenceType] | Literal["all"]
"""Which of them a result may be.

A sequence is a set to draw from, decided per sentence, and `"all"` is every one.
"""


@dataclass(frozen=True, slots=True)
class SentenceDetail:
    """A generated sentence with the pieces it was built from."""

    sentence: str
    """The finished result, punctuation and all — every sentence of it, joined."""

    sentences: tuple[str, ...]
    """One entry per sentence.

    A single entry unless `sentences` asked for more, and `sentence` is always these
    joined by the language's own space.
    """

    phrases: tuple[str, ...]
    """The phrases the sentence is made of, in order.

    A phrase and its modifier, without the particle or preposition that marks it. So
    `검은 고양이가 잠잔다` reports `("검은 고양이", "잠잔다")`. One flat tuple across
    every sentence of the result, the same way `slots` is; a connective a sentence
    opens on is not a phrase and is not in here.
    """

    slots: tuple[SentenceSlot, ...]
    """What each phrase does in the sentence, at the same index as `phrases`."""

    names: tuple[str, ...]
    """The person names the result was written with, in order.

    Empty unless `include_name` asked for them. Every one of them is also a phrase.
    """

    types: tuple[SentenceType, ...]
    """What each sentence is doing, at the same index as `sentences`."""

    language: WordLanguage
    """The language this sentence was generated in."""

    theme: WordTheme | None
    """Theme the result's subject belongs to — the first sentence's.

    That is what every sentence after it stays about. None when the word is not one the
    generator knows, which happens when it was invented or was handed in through
    `include`.
    """


@dataclass(frozen=True, slots=True)
class NicknameDetail:
    """A generated nickname with the pieces it was built from."""

    nickname: str
    """The finished nickname."""

    words: tuple[str, ...]
    """The words the nickname is made of, in order — the words only.

    A shape that needs a particle between two of them carries it in `nickname` and
    nowhere here, so `사자의눈물` reports `("사자", "눈물")`.
    """

    slots: tuple[WordSlot, ...]
    """What each word does in the shape, at the same index as `words`.

    The noun the nickname is built around, and whatever the shape put beside it.
    """

    language: WordLanguage
    """The language this nickname was generated in."""

    theme: WordTheme | None
    """Theme the nickname's base word belongs to.

    `None` when that word is not one the generator knows, which happens when it
    was invented.
    """
