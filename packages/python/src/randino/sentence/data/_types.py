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
from dataclasses import field as attribute
from typing import Literal

from randino._types import SentenceQuote, SentenceSlot, WordTheme
from randino.word.data._types import WordAgreement, WordGender, WordPool

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


PredicateForm = Literal[
    "question",
    "exclamation",
    "casual",
    "casualQuestion",
    "polite",
    "politeQuestion",
    "formal",
    "formalQuestion",
    "linking",
]
"""A form a predicate takes beside the one a plain statement ends on.

`"linking"` is the form a predicate takes when its clause is not the last one of the
sentence — Korean `돌아오고` or `돌아와서`, Japanese `戻って`. It carries no tense of its
own, so it lives in the present forms alone. A language that joins its clauses with a
word rather than a form (`and`, `y`, `и`) declares none.


`"question"` is Korean `달리니` beside `달린다`, and English `run` beside `runs`;
`"exclamation"` is `달리는구나`, `"casual"` `달려`, `"polite"` `달려요` and `"formal"`
`달립니다`. A form rather than another pool: the same verbs, said differently. Every
form pool is index-aligned with `words`, so a verb keeps its meaning across them and a
word the caller required can be translated into the form the sentence needs.

`"casual"` and `"polite"` carry no mood of their own because in Korean they have none:
`달려` is the statement, the question and the exclamation, and only the mark after it
differs. `"formal"` is the level that does move for a question, which is why it is the
only one with a `"formalQuestion"` beside it.

A group declares only what its language actually writes, and each level falls back along
its own chain to the plain statement the `words` already are. That is why Japanese
declares `"polite"` alone: `走ります` is its polite question too, because the `か` that
asks is the frame's tag rather than part of the verb, and it is its formal form as well.
"""

PredicateForms = Mapping[PredicateForm, WordPool]
"""The forms a group declares, beside the plain statement its `words` are in.

An entry may write more than one ending with `|` between them, and one of them is drawn.
That is what keeps a pool index-aligned with `words` while `달리니|달리나|달리는가` is
still one entry for one verb — a Korean question has several endings and a generator
that only ever wrote the first would close every sentence the same way.
"""

VerbField = Literal[
    "rise",
    "go",
    "arrive",
    "move",
    "wait",
    "rest",
    "sleep",
    "express",
    "play",
    "think",
    "look",
    "search",
    "find",
    "take",
    "carry",
    "hide",
    "make",
    "tend",
    "sell",
    "buy",
    "cook",
    "eat",
    "drink",
    "lose",
    "meet",
    "talk",
    "change",
]
"""What a verb does, as coarsely as a story needs to know it.

A step of a story asks for a field rather than for a word — "the hero eats something" —
and the language answers with any verb it has filed there, which is what lets one story
be told in nine languages and never twice the same way. `FIELD_RULES` says what each
field needs to be true first and what it leaves true afterwards, which is the whole of
the story's memory. `"change"` is everything that happens to something that is not a
hero: a place darkens, an apple ripens, a flag sways.
"""

Condition = Literal[
    "awake",
    "asleep",
    "hungry",
    "full",
    "tired",
    "rested",
    "away",
    "home",
    "holding",
    "content",
    "restless",
]
"""What can be true of a story's hero at one moment.

What a state sentence says and what an action changes. `"holding"` is the one that is
about a thing rather than a feeling: it is what `eat`, `carry` and `sell` need and what
`find`, `take`, `buy` and `make` leave behind.
"""


@dataclass(frozen=True, slots=True)
class PredicateTense:
    """The same predicates in another tense.

    The statement form in `words` and the moods and levels in `forms`, both index-aligned
    with the present-tense pools of the group. A group declares what its language writes
    — Korean and Japanese every level, English only the statement and its question's base
    form — and leaves the tense out entirely where the language does not inflect for it.
    """

    words: WordPool
    """The statement form."""

    forms: PredicateForms = attribute(default_factory=dict)
    """The other forms, index-aligned with `words`."""


NounTrait = Literal["flier", "swimmer", "crawler"]
"""What a noun can do that its theme does not say.

A fish and a sparrow are both `animal`, and only one of them flies; a snake and a lion are
both `animal`, and only one of them runs. A language lists the nouns that carry each trait
under `SentenceLanguageData.traits`, and a verb group asks for one with `subject_traits` or
rules one out with `subject_without`. A noun listed nowhere has no trait, so it takes any
group that asks for none.
"""


@dataclass(frozen=True, slots=True)
class VerbGroup:
    """Verbs that take the same arguments.

    Written as a group rather than one tagged entry per verb, because the tag is the
    interesting part and a group of thirty verbs shares one: they all say what can do
    the doing, and — when the verb is transitive — what it can be done to.
    """

    field: VerbField
    """What these verbs do, as a story asks for it."""

    subject: tuple[NounClass, ...]
    """Classes a noun has to belong to to be the subject of these verbs."""

    words: WordPool
    """The verbs themselves, in the form a plain statement ends on (`달린다`, `runs`)."""

    object: tuple[NounClass, ...] | None = None
    """Classes it can take as a direct object. Left out by an intransitive group."""

    subject_themes: tuple[WordTheme, ...] | None = None
    """The themes the subject may come from, when a class is too wide.

    `익는다` is a thing food does and drink does not, and `울린다` is a thing a song does
    and a spoon does not. None where the class alone is right. A theme narrowed out of
    one group has to be accepted by another of the same field, and the suite asserts it
    is.
    """

    subject_traits: tuple[NounTrait, ...] | None = None
    """A trait the subject has to carry, one of these.

    `날아오른다` takes a `flier`, `헤엄친다` a `swimmer`. None for a group that asks for none.
    """

    subject_without: tuple[NounTrait, ...] | None = None
    """Traits the subject may not carry.

    `달린다` and `걷는다` take no `swimmer` and no `crawler`. A noun with no trait at all
    passes.
    """

    object_themes: tuple[WordTheme, ...] | None = None
    """The themes the object may come from, when a class is too wide.

    `eat` takes an edible and `drink` takes an edible, and a lion that drinks a pretzel
    is the difference. Left out where the class alone is right.
    """

    requires: SentenceSlot | None = None
    """A part the shape has to carry for these verbs to make sense.

    `향한다` and `heads` want somewhere to head to, where `떠난다` and `leaves` stand on
    their own; a group that names a slot is drawn only for a shape that has it.
    """

    forms: PredicateForms = attribute(default_factory=dict)
    """The same verbs in another form, index-aligned with `words`.

    Empty for a language whose verb does not change — Chinese, Vietnamese, Spanish,
    Italian and Russian ask a question with the mark alone.
    """

    past: PredicateTense | None = None
    """The same verbs in the past, index-aligned with `words`.

    Left out by a language that marks the past with a word beside the verb rather than
    on it — Chinese `了`, Vietnamese `đã` — which is `past_mark`'s business.
    """


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

    condition: Condition | None = None
    """What these adjectives say is true of the subject, for a story to read and write.

    `배고프다` is `"hungry"` and `피곤하다` is `"tired"`; `크다` is neither, and a group
    of traits like it leaves this out.
    """

    subject_themes: tuple[WordTheme, ...] | None = None
    """The themes the subject may come from, when a class is too wide — see `VerbGroup`."""

    head: str | None = None
    """What is written in front of these instead of the shape's own head.

    In a language whose copula depends on what is said: Spanish `es valiente` and `está
    cansado` are two verbs, and only the group knows which its words take.
    """

    past_head: str | None = None
    """What `head` becomes in the past (`era`, `estaba`)."""

    forms: PredicateForms = attribute(default_factory=dict)
    """The same adjectives in another form, index-aligned with `words`."""

    past: PredicateTense | None = None
    """The same adjectives in the past, index-aligned with `words`."""


@dataclass(frozen=True, slots=True)
class ModifierGroup:
    """Attributive modifiers that fit the same kinds of noun, grouped the way states are.

    `word/data`'s `adjectives` are what a nickname is built from, and a nickname is
    allowed to be a joke — `맑은기계공` is a handle. A sentence is not, so it draws its
    modifiers from here instead, and `맑은` sits in front of a place or a drink and never
    in front of a mechanic.
    """

    subject: tuple[NounClass, ...]
    """Classes a noun has to belong to to carry one of these."""

    words: WordPool
    """Base forms, which `agree` reshapes in a language that inflects."""

    themes: tuple[WordTheme, ...] | None = None
    """The themes it may belong to, when a class is too wide.

    A soup is `매콤한` and a tea is not, though both are edible.
    """


CopulaSide = Literal["head", "tail"]
"""Which side of the phrase a copula is written on.

`"head"` is its own word in front — English `is`, Chinese `是`; `"tail"` is written onto
the end — Korean `이다`, Japanese `です`.
"""


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

    past_head: str = ""
    """What `head` becomes in a past-tense sentence.

    For a language whose auxiliary or copula carries the tense: English `does` is `did`
    and `is` is `was`, Spanish `es` is `era`. Left out where the head does not change.
    """

    tail: str = ""
    """Written after it (`가`, `が`, `里`)."""

    tail_alt: str = ""
    """Used instead of `tail` when the word in front of it ends on a consonant.

    That is the whole of Korean particle alternation — `사자가` beside `사슴이` — and a
    language whose particles do not alternate leaves it out.
    """

    tail_liquid: str = ""
    """Used instead of either when the word in front of it ends on `ㄹ`.

    For the one Korean particle that treats that consonant as a vowel: `시장으로` and
    `마을로` are `로` after a vowel, `으로` after a consonant, and `로` again after `ㄹ`.
    Left out by every other particle.
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

    copula: CopulaSide | None = None
    """Where the copula stands relative to this phrase, on the shape that equates a
    subject to it.

    `"head"` is English `is` and Chinese `是`, written as their own word in front;
    `"tail"` is Korean `이다` and Japanese `です`, written onto the end of the phrase. On
    the phrase rather than a part of its own because that is what a copula is in half of
    these languages: `11시 40분이다` is one word, and a slot for it would have to be
    written with no space in front, which is a thing no other part does.
    """


SentenceMark = Literal["statement", "question", "exclamation", "trailing"]
"""The kinds of sentence a language writes a mark of its own for.

`"dialogue"` and `"thought"` are not among them: what they quote is a sentence of one of
these, so they take its mark and add the quotation marks around it.
"""

SentenceMood = Literal["statement", "question"]
"""What a shape is for.

A frame with the statement mood also serves an exclamation and a sentence that trails
off — those differ from it by the mark and by what stands in front, not by the order of
the words. A question is the one that can differ, and only four of the nine languages
need it to. The rest declare no question shape and get their statement shapes back,
which is the same best-effort every other narrowing here makes.
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

    mood: SentenceMood = "statement"
    """What the shape is for."""

    tag: str = ""
    """Written after the last phrase and before the terminator, with the space in front.

    That is Chinese `吗`, Japanese `か` and Vietnamese `không` — none of which is a
    phrase, and none of which any slot could carry.
    """

    fields: tuple[VerbField, ...] | None = None
    """The fields the verb of this shape may come from, for a shape only some verbs can head.

    A destination is the reason: `시장으로` wants a verb that goes somewhere and `시장에`
    one that arrives, and `시장으로 웃는다` is neither.
    """


@dataclass(frozen=True, slots=True)
class SentenceTimes:
    """When something happens, written whole, sorted by what a paragraph has to know.

    `day` is the phases of a day in the order they come, from dawn to midnight, because a
    story told across several sentences moves forward through them and never back. `any`
    is what fits every tense — a season, a weekend. `past` and `present` are the ones
    that name a tense, and a sentence takes only the pool of the tense it is in.
    """

    day: WordPool
    any: WordPool
    past: WordPool | None = None
    present: WordPool | None = None
    habitual: WordPool | None = None
    """What happens as a habit: `every day`, `sometimes`, `these days`.

    Right in a sentence on its own and wrong in a story, which tells of one time something
    happened, so a story never draws from it.
    """


@dataclass(frozen=True, slots=True)
class SentencePastMark:
    """How the language marks the past when it does not inflect its verb for it.

    Vietnamese writes `đã` in front (`con mèo đã chạy`) and Chinese `了` behind
    (`狮子跑了`), and a language that conjugates leaves it out and writes `past` on its
    groups instead.
    """

    head: str = ""
    tail: str = ""


@dataclass(frozen=True, slots=True)
class SentenceJoin:
    """How two clauses become one sentence: `돌아와서 사과를 먹었다`, `came home and ate`.

    Either the first clause's predicate takes the `"linking"` form its group declares, or
    a word is written between the two — a language declares whichever its grammar does,
    and one that declares neither joins nothing.
    """

    form: PredicateForm | None = None
    word: str | None = None


SentenceArticles = Mapping[WordGender, tuple[tuple[str, str], ...]]
"""The article a noun takes, by its gender and how the word after the article begins.

Each rule is `(prefix, article)`; the first whose prefix matches wins, and `""` matches
anything, which is how Italian picks `l'` before a vowel, `lo` before `s` plus a
consonant, and `il` for the rest. A language whose nouns carry no gender writes every
rule under `"n"`, which is what the lookup falls back to.
"""


SentencePronouns = Mapping[WordGender, WordPool]


@dataclass(frozen=True, slots=True)
class SentenceObjectPronouns:
    """How a later sentence refers to a noun it has already put in the object slot.

    Rather than naming it a second time. `words` is by the noun's gender the way
    `SentencePronouns` is, and `""` is a real entry meaning the language leaves the object
    out altogether (`끓여서 먹었다`); `clitic` is set where the pronoun is written in front
    of the verb rather than where the object stood (Spanish `la comió`). Left out by a
    language that names the noun again.
    """

    words: SentencePronouns
    clitic: bool = False


@dataclass(frozen=True, slots=True)
class SentenceSpeech:
    """How the hero of a story speaks for themselves, in a line the story quotes.

    `subject` is what stands where the subject would: `""` for a language that drops it
    (`“배고프다.”`), `我`, `Tôi`, `I`. `head` is the copula the first person takes where a
    state's head changes for it — English `am` beside `is`. Left out by a language whose
    predicates would have to change for the first person, which is Spanish, Italian,
    German and Russian; their stories are narrated all the way through.
    """

    subject: str
    head: str | None = None


ConnectiveKind = Literal["additive", "temporal", "contrastive", "causal"]
"""What a connective claims about the sentence before it.

- `additive` says here is one more thing (`그리고`, `besides`, `また`).
- `temporal` says time passed (`이윽고`, `meanwhile`, `やがて`).
- `contrastive` says this cuts against it (`하지만`, `however`, `しかし`).
- `causal` says this follows from it (`그러므로`, `therefore`, `だから`).

The first three can open any continuation: time passes whatever is said, one more thing
is always one more thing, and any two things can be set against each other. `causal` is
the one that can be false — `그러므로 금빛 하이볼이 식죠?` after a sentence about a
pretzel claims a consequence that is not there — so the generator writes one only where
the sentences can carry it.
"""

SentenceConnectives = Mapping[ConnectiveKind, WordPool]
"""What a sentence opens on when it follows another one, by what that opening claims.

Written whole, so a language that needs a comma after it writes the comma. A language
declares only the kinds it can actually write: German declares no `temporal`, because
`dann` and `danach` are adverbs and an adverb in the first position moves the finite
verb, so the five coordinating conjunctions are all it has to open a clause with.
"""
"""The subject pronoun a later sentence refers to the topic with, by its gender.

Nominative only, because a subject is never in another case. `""` is a real entry and
means the language writes no subject at all, which is what Korean, Japanese, Chinese,
Spanish and Italian actually do in a second sentence about the same thing. The lookup
falls back to `"n"` the way `SentenceArticles` does, so a language whose pronoun does
not inflect writes one rule.
"""


NumeralOrder = Literal["before", "after"]
"""Where a number stands relative to the noun it counts.

Korean, Japanese and Chinese put it behind (`사과 12 개`); Vietnamese puts it in front,
classifier and all (`12 con mèo`).
"""


@dataclass(frozen=True, slots=True)
class SentenceCalendar:
    """How a language writes a date, a clock time, and the copula for one.

    The templates are written as the language writes them, with letters standing for the
    numbers, because a date is word order as much as it is digits: `2026년 9월 5일` runs
    largest to smallest and `ngày 5 tháng 9 năm 2026` runs the other way with a word in
    front of every part.
    """

    date: str
    """The date.

    `Y` is the year, `M` the month as a number, `D` the day, and `MMMM` the month's name
    for a language that writes one.
    """

    clock: str
    """The clock. `h` is the hour and `mm` the minute, zero-padded to two."""

    years: tuple[int, int]
    """The years a date may fall in, at the earliest and the latest."""

    copula: "StateGroup"
    """The copula, as a predicate group.

    One entry with whatever forms the language writes for a question, an exclamation and
    each level. It states the classes its subject may belong to the way a verb group
    does — an event is a thing that happens on a day, and a lion is not.
    """

    months: WordPool | None = None
    """The month names in order, for a date that writes `MMMM`."""


@dataclass(frozen=True, slots=True)
class SentenceNumeral:
    """How a language writes a number beside a noun, and beside money.

    Left out by a language that cannot write either correctly, which is what German and
    Russian do: both would need a case their nouns change their own ending for, the same
    reason neither declares an object shape.
    """

    order: NumeralOrder
    """Where the number stands relative to the noun it counts."""

    counters: Mapping[NounClass, str]
    """The counter each kind of noun takes.

    That is what the noun classes were worth having for: `마리` for a creature, `명` for
    a person, `대` for a vehicle. A classifier is also what makes an abstract noun
    countable at all — `슬픔 12 가지` is twelve kinds of sadness — so a language with
    this table can count anything in its pools. English, Spanish and Italian have no
    such word and would need a plural, and a plural of `sadness` is not a thing anyone
    writes; that is why they leave it empty and declare no counted shape.
    """

    count: tuple[int, int]
    """How many of a counted thing, at the fewest and at the most."""

    currency: str
    """What money is written in, after the amount (`원`, `dollars`, `円`), joined by the
    same `gap` a counter is.
    """

    amounts: tuple[int, ...]
    """The amounts the language writes, as a pool rather than a range.

    A range would hand back `73,412 dollars`, and nobody writes that; these are the
    round numbers a sentence actually names.
    """

    group: str
    """What separates the thousands.

    `,` in English, Korean, Japanese and Chinese; `.` in Vietnamese, Spanish and
    Italian.
    """

    gap: str
    """What stands between the digits and what they count — the counter, or the currency.

    Empty in Korean, Japanese and Chinese, which write `6개`, `6個` and `6个` with
    nothing in between; a space in Vietnamese, English, Spanish and Italian, which write
    `6 con` and `500 dollars`.

    Its own field rather than the language's space, because Korean writes a space
    everywhere else and still attaches this one. 한글 맞춤법 제43항 spaces a unit noun off
    the number it follows and then allows the attached form with Arabic numerals, which
    is what anyone writing `6개` actually does.
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

    terminators: Mapping[SentenceMark, str]
    """What a sentence of each kind closes on."""

    verbs: Sequence[VerbGroup]
    """The verbs, grouped by what they can take."""

    states: Sequence[StateGroup]
    """The predicate adjectives, grouped by what they can describe."""

    modifiers: Sequence[ModifierGroup]
    """The modifiers a noun phrase may carry, by what they can describe."""

    manners: Sequence[ModifierGroup]
    """How something is done (`조용히`), grouped by what can do it that way.

    A fox walks `부지런히` and a river does not flow so.
    """

    times: SentenceTimes
    """When it happens, written whole, particle and all (`새벽에`)."""

    homes: WordPool
    """Where the hero of a story comes back to (`집`, `house`, `家`).

    Bare nouns, and the destination frame writes its own particle or preposition around
    one.
    """

    connectives: SentenceConnectives
    """What a sentence opens on when it follows another one, by what it claims."""

    quotes: Mapping[SentenceQuote, tuple[str, str]]
    """The two levels of quotation marks the language writes, as `(open, close)`.

    Per language and not close to universal: Japanese writes `「」` and `『』`, German
    opens low and closes high (`„…“`), and Spanish, Italian and Russian reach for
    guillemets before anything else.
    """

    interjections: WordPool
    """What an exclamation opens on (`와,`, `Wow,`, `ああ、`).

    Written whole, comma and all, because where the comma goes is the language's
    business. Exclamations alone: a statement that opened on one would be reading itself
    aloud, and a question has its own mark to do the work.
    """

    pronouns: SentencePronouns
    """How a later sentence refers to the topic without naming it again."""

    frames: Sequence[SentenceFrame]
    """The shapes a sentence of this language can take."""

    articles: SentenceArticles | None = None
    """The article a noun phrase opens with. Left out by a language with no articles."""

    numeral: SentenceNumeral | None = None
    """How the language writes a number.

    None for one that cannot, which then declares no `quantity` and no `money` shape
    either.
    """

    calendar: SentenceCalendar | None = None
    """How the language writes a date and a clock time, and the copula for one.

    None for a language that cannot write them the way the shapes here need — Russian
    equates with a dash rather than a word, and a dash does not change for a question or
    a level.
    """

    openers: Mapping[SentenceMark, str] = attribute(default_factory=dict)
    """What a sentence opens on, for a language that marks the type at both ends.

    Spanish `¿` and `¡` are the only ones here, and every other language leaves it out.
    """

    predicate_agrees: bool = False
    """Whether a predicate adjective agrees with its subject the way an attributive one does.

    Spanish, Italian and Russian inflect both; German inflects only the attributive
    form, so `der Wal ist blau` keeps the base word.
    """

    past_agreement: WordAgreement | None = None
    """How a past-tense verb agrees with its subject, in a language where it does.

    Russian is the one: `бежал` beside `бежала`, and `вернулся` beside `вернулась`. The
    same rule shape `word/data`'s `agreement` has, applied to the verb's past form.
    """

    past_mark: SentencePastMark | None = None
    """What marks the past beside the verb, for a language that does not put it on the verb.

    Left out by every language that writes `past` on its groups.
    """

    join: SentenceJoin | None = None
    """How two clauses are written as one sentence. Left out by a language that does not."""

    traits: Mapping[NounTrait, WordPool] | None = None
    """The nouns that fly, swim or crawl, for the verb groups that ask.

    Written in the plain form — lowercase where the pools capitalize — and None for a
    language whose verbs ask for no trait.
    """

    pronounless: tuple[NounClass, ...] = ()
    object_pronouns: SentenceObjectPronouns | None = None
    """How a later sentence refers to the object the one before it named.

    None for a language that names it again.
    """

    speech: SentenceSpeech | None = None
    """How a story's hero speaks for themselves. None for a language that cannot write it."""
    """Noun classes the language's written pronouns are wrong for.

    A sentence about one of them leaves the subject out where the language can, and
    names the topic again where it cannot. English is the reason it exists: `he` and
    `she` need a person's gender, which a job noun does not carry, and `they` needs a
    plural verb the pools are not written in — so an English sentence about a person
    names it again. The languages whose written pronoun is inanimate — `그것`, `それ`,
    `它`, `nó` — list `person` too, and drop the subject instead, which is what they
    would do anyway. Empty for a language whose pronouns stand for anything.

    A topic that carries a gender is the exception, and a person's name is the only
    thing that does: `he` is wrong for `the locksmith` and right for `Philip`. A
    language that declares no pool for that gender is unaffected, which is why Korean
    drops the subject rather than writing `그것` about somebody.
    """
