"""Every type randino's public API is described in.

The options themselves are keyword arguments rather than a type: `randName({ … })`
in the npm package is `rand_name(…)` here.
"""

import datetime as dt
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

RandVocabulary = Literal["basic", "common", "full"]
"""How common the words a result is built from have to be.

`"basic"` is the everyday words, which nearly every speaker uses and a child already
knows — `사과`, `개`, `의사`, `apple`, `doctor`, `computer`. `"common"` is those and the
words an adult speaker knows and uses now and then — `두더지`, `탐정`, `badger`,
`interpreter`. `"full"` is every word the pools hold, the specialist's and the
dictionary's included — `탈륨`, `통메장이`, `thallium`, `cooper`. The default.

Each level holds the ones below it, so `"common"` is the pools with the rare words left
out, not a band of middling ones. The levels are a judgement made per language about
that language's own words — a word is basic because people say it, not because what it
names is familiar — and they only ever narrow what is drawn: a word the caller required,
an invented word and a person's name are not the pools', and have no level.
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
    "toy",
    "sound",
    "person",
    "furniture",
]
"""What a word is about.

Animals (`사자`), everyday things (`물병`), nature and its phenomena (`노을`), plants
(`민들레`), stones and metals (`흑요석`), ideas from the humanities and social world
(`철학`), creatures out of myth (`구미호`), the trades and roles people hold
(`대장장이`), music (`교향곡`), places (`광장`), food (`떡볶이`), sports (`양궁`),
things that carry you (`열기구`), things you buy (`이어폰`), toys and games (`팽이`),
sounds (`속삭임`), people by age and kinship (`꼬마`), or furniture (`요람`). Person
names are never used.

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
    "destination",
    "time",
    "manner",
    "degree",
    "quantity",
    "money",
    "date",
    "clock",
]
"""What one phrase does in a sentence.

`subject` is who or what the sentence is about (`검은 고양이가`), `verb` what it does
(`잠잔다`), `object` what it does it to (`사과를`), and `state` what it is like where
the sentence has no verb at all (`파랗다`). The rest frame the action: `place` where it
happens (`숲에서`), `time` when (`새벽에`), `manner` how (`조용히`), and `degree` how
much a state holds (`무척`, `very`), written in front of it.

`destination` is where it is going (`시장으로`, `to the market`), which only a verb that
goes somewhere or arrives can stand beside.

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

SentenceTense = Literal["present", "past"]
"""When a sentence happened.

`"present"` is the form the pools are written in (`달린다`, `runs`); `"past"` is the
tense a story is told in (`달렸다`, `ran`). Every language writes it its own way: Korean,
Japanese, English, Spanish, Italian and German change the verb, Russian changes it and
makes it agree with the subject, and Chinese and Vietnamese write a word beside it
(`了`, `đã`) and leave the verb alone. A result keeps one tense throughout.
"""

SentenceStory = Literal[
    "errand",
    "meal",
    "search",
    "outing",
    "craft",
    "stroll",
    "evening",
    "chores",
    "stash",
    "idle",
    "waking",
    "picnic",
    "mishap",
    "visit",
    "chat",
    "watch",
    "shelter",
    "sketch",
    "passage",
]
"""The story a result of several sentences follows.

Each is a short sequence of things that happen, in an order that makes sense, told with
whatever words the language has for each of them: `"errand"` — the hero goes somewhere,
gets something to eat, comes home and eats it; `"meal"` — the hero is hungry, prepares
something and eats it; `"search"` — the hero looks for something, finds it and brings it
back; `"outing"` — the hero gets up, goes out, plays and comes home tired; `"craft"` —
the hero makes something and sells it, people only; `"stroll"` — the hero goes out and
wanders, with nothing to carry; `"evening"` — the day ends, the hero comes home and
sleeps; `"chores"` — a person gets up, takes a thing out and sees to it; `"stash"` — the
hero carries something somewhere and hides it there; `"idle"` — the hero is at a loose
end at home, and plays; `"waking"` — the place wakes before the hero does, and the day
begins; `"picnic"` — the hero gets something to eat somewhere and eats it there;
`"mishap"` — the hero loses what they carried, looks for it, and may or may not find it;
`"visit"` — the hero goes to see somebody, and they talk; `"passage"` — something that is
not a person or an animal changes over time.

Which stories a language can tell depends on the shapes it declares: German and Russian
carry no object, so they tell the ones with nothing in the hero's hands. `"chat"` — a person goes out, meets somebody, and the two of them talk, the
story with the most lines in it; `"watch"` — the hero goes out, sits down somewhere, and
watches what happens around them; `"shelter"` — the weather turns while the hero is out,
and they wait it out; `"sketch"` — nothing happens to anybody: a place is described, and
the things in it do what they do.
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

    tense: SentenceTense
    """The tense every sentence of the result is in."""

    story: SentenceStory | None
    """The story a result of several sentences followed.

    None for a result of one sentence, which follows none.
    """

    language: WordLanguage
    """The language this sentence was generated in."""

    theme: WordTheme | None
    """Theme the result's subject belongs to: its hero's in a story, else the first sentence's.

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


LocationLanguage = Literal["en", "ko"]
"""A language the location generators can write in.

Each one writes the places of its own country — `ko` the divisions of South Korea, `en`
the states and places of the United States — and a language whose country publishes no
dataset that can be shipped without conditions is not one of them.
"""

LocationLanguageOption = Literal[LocationLanguage, "all"]
""""all" mixes every language the location generators support."""

LocationLevel = Literal["country", "region", "city", "district"]
"""How far down a location goes, largest first.

- `country`: the country itself (`대한민국`, `United States`).
- `region`: its first-level division — a Korean 시·도, a US state.
- `city`: the division a city, county or district is — a Korean 시·군·구, a US city,
  town, village or census designated place.
- `district`: the division inside a city — a Korean 읍·면·동.

Not every country has every level: the United States stops at `city`. Nothing goes below
`district`, and no location ever names a street or a building, so a result cannot point
at anybody's address.
"""


@dataclass(frozen=True, slots=True)
class LocationDetail:
    """A generated location with every level it was built from."""

    location: str
    """What the value form returns: one division's name, or the whole location written out."""

    language: LocationLanguage
    """The language, and so the country, this location was drawn from."""

    level: LocationLevel
    """The deepest level the result names."""

    country: str
    """The country, the way the language writes its own."""

    region: str | None
    """The first-level division.

    `None` for a level the result does not reach, or one its country does not have there.
    """

    city: str | None
    """The division inside the region, or `None` the way `region` is."""

    district: str | None
    """The division inside the city, or `None` the way `region` is."""


@dataclass(frozen=True, slots=True)
class CountryDetail:
    """A generated country with the code it is known by."""

    country: str
    """The country's name, as the language writes it."""

    code: str
    """Its ISO 3166-1 alpha-2 code, which is the same whatever the language."""

    language: WordLanguage
    """The language the name is written in."""


AgeGroup = Literal["child", "teen", "adult", "senior"]
"""Which part of a life an age falls in.

- `child`: 0 to 12.
- `teen`: 13 to 19, the ages that end in "-teen".
- `adult`: 20 to 64.
- `senior`: 65 and over, the age most pension and statistics systems count old age from.
"""

AgeGroupOption = AgeGroup | Sequence[AgeGroup] | Literal["all"]
"""Which groups an age may fall in.

A sequence is a set to draw from, so `("adult", "senior")` is any age from 20 up, and
`"all"` is every one of them.
"""

AgeDistribution = Literal["population", "uniform"]
"""How likely each age is.

- `population`: along a curve shaped like a population, so a draw lands on a young adult
  far more often than on a child or somebody past seventy. The default.
- `uniform`: every age in the range as often as any other.
"""


@dataclass(frozen=True, slots=True)
class AgeDetail:
    """A generated age with the part of a life it falls in."""

    age: int
    """The age, in whole years."""

    group: AgeGroup
    """The part of a life the age falls in."""


GenderCode = Literal["male", "female", "nonbinary", "unknown"]
"""A gender as a code, the same in every language.

- `male` and `female`: the same two codes `NameGender` uses.
- `nonbinary`: the third option a form offers beside them.
- `unknown`: not stated — what a record holds when nobody gave an answer.
"""


@dataclass(frozen=True, slots=True)
class GenderDetail:
    """A generated gender in its language, with the code behind it."""

    gender: str
    """The label a form in the language writes: `여성`, `Female`, `Weiblich`."""

    code: GenderCode
    """The same gender as a code, which is the same whatever the language."""

    language: WordLanguage
    """The language the label is written in."""


OrganizationType = Literal["company", "nonprofit", "school", "government", "public"]
"""What kind of organization a name is for.

- `company`: a business (`Westbrook Logistics, Inc.`, `(주)새솔테크`).
- `nonprofit`: an association, a foundation or a club (`새솔장학재단`).
- `school`: from a kindergarten to a university (`가람초등학교`).
- `government`: an office of the state or a town (`해솔구청`).
- `public`: an institution run for the public that is not an office — a library, a
  hospital, a transit authority (`새솔시립도서관`, `Stadtwerke Lindenhof`).
"""

OrganizationTypeOption = OrganizationType | Sequence[OrganizationType] | Literal["all"]
"""Which kinds a result may be.

A sequence is a set to draw from, decided per result, and `"all"` is every one of them.
"""

OrganizationIndustry = Literal[
    "tech",
    "manufacturing",
    "food",
    "retail",
    "finance",
    "construction",
    "logistics",
    "media",
    "health",
    "energy",
]
"""What a company does, which is the word its name carries for it."""

OrganizationIndustryOption = Literal[OrganizationIndustry, "all"]
""""all" draws an industry per company, or a word that names none."""


@dataclass(frozen=True, slots=True)
class OrganizationDetail:
    """A generated organization with the pieces it was built from."""

    organization: str
    """What the value form returns: the whole name, legal form and all."""

    name: str
    """The name without its legal form: `새솔테크` for `(주)새솔테크`."""

    legal_form: str | None
    """The legal form, as the language writes it (`(주)`, `Inc.`, `ООО`), or None."""

    type: OrganizationType
    """The kind of organization."""

    industry: OrganizationIndustry | None
    """The industry the name says the company is in, or None when it says none."""

    language: WordLanguage
    """The language the organization is written in."""


DateUnit = Literal["year", "month", "day", "hour", "minute", "second", "millisecond"]
"""One part of a date, largest first.

Named as `unit`, it is the one part `rand_date` hands back, as a number: `minute` is `0`
to `59`, `month` is `1` to `12`.
"""

DateInput = str | dt.datetime | dt.date
"""One end of the range a date is drawn from.

- A string in ISO 8601 form, from `"2024"` down to `"2024-03-15T14:07:32.481+09:00"`. It
  is UTC unless it carries an offset, and it names a span rather than an instant:
  `"2024-03"` is all of March, so as `max_date` it reaches the last millisecond of the
  month.
- A `datetime`, which is the instant it holds. An aware one is read in its own zone, and
  a naive one in the machine's, the way `datetime.timestamp` reads it.
- A `date`, which is the whole of that day in UTC, the way `"2024-03-15"` is.
"""


@dataclass(frozen=True, slots=True)
class DateDetail:
    """A generated date with every part it was built from. All of them are UTC."""

    date: str
    """The date as `format` writes it — what the value form returns when no `unit` is named."""

    timestamp: int
    """Milliseconds since `1970-01-01T00:00:00.000Z`, negative before it."""

    year: int
    """The year."""

    month: int
    """`1` to `12`."""

    day: int
    """`1` to `31`."""

    hour: int
    """`0` to `23`."""

    minute: int
    """`0` to `59`."""

    second: int
    """`0` to `59`."""

    millisecond: int
    """`0` to `999`."""

    weekday: int
    """The day of the week, `1` for Monday to `7` for Sunday, the way ISO 8601 counts it."""

    language: WordLanguage
    """The language the names in `date` are written in."""


PhoneCountry = Literal["US", "KR", "JP", "CN", "VN", "ES", "IT", "DE", "RU"]
"""A country `rand_phone` writes numbers for, by its ISO 3166-1 alpha-2 code.

One for each language the word pools cover: the United States for English, Korea for
Korean, and so on.
"""

PhoneCountryOption = Literal[PhoneCountry, "all"]
""""all" mixes every country."""

PhoneType = Literal["mobile", "landline"]
"""What a number is for.

- `mobile`: a mobile phone, from the blocks the country gives its operators.
- `landline`: a fixed line, behind the area code of a real city.

The United States writes both the same way, so there the two are drawn from the same
area codes.
"""

PhoneTypeOption = Literal[PhoneType, "all"]
""""all" draws a mobile number or a landline per result."""


@dataclass(frozen=True, slots=True)
class PhoneDetail:
    """A generated phone number with the pieces it was built from."""

    phone: str
    """What the value form returns, written the way the arguments asked for."""

    e164: str
    """The same number in E.164, the one form every system accepts: `+821023456789`."""

    country: PhoneCountry
    """The country the number is for."""

    calling_code: str
    """The country calling code, without the `+`: `"82"`."""

    type: PhoneType
    """What the number is for."""


SystemPlatform = Literal["desktop", "mobile"]
"""Which kind of machine a system value belongs to.

- `desktop`: a PC, a laptop included — what runs Windows, macOS or Linux.
- `mobile`: a phone or a tablet — what runs Android, iOS or iPadOS.
"""

SystemPlatformOption = Literal[SystemPlatform, "all"]
""""all" draws from both."""


@dataclass(frozen=True, slots=True)
class OsDetail:
    """A generated operating system with the pieces it was written from."""

    os: str
    """The system as the value form returns it: `Windows 11 Pro 23H2 (Build 22631)`."""

    name: str
    """The name without a version: `Windows`, `macOS`, `Mac OS X`, `Ubuntu`."""

    version: str | None
    """The release's version: `11`, `14`, `22.04`, `XP`. None with `include_version=False`."""

    build: str | None
    """The build or point release written, as it is written: `23H2 (Build 22631)`, `14.5`."""

    edition: str | None
    """The edition written: `Pro`, `Server`."""

    platform: SystemPlatform
    """The kind of machine the system runs on."""

    year: int
    """The year the release came out, or the build when one is written."""


DeviceType = Literal["phone", "tablet", "laptop"]
"""What kind of device a model is.

- `phone`: a smartphone, and the handful of phones before them that carried a model name
  a sample is likely to want.
- `tablet`: a tablet, a detachable two-in-one such as the Surface Pro included.
- `laptop`: a laptop. A desktop PC is left out on purpose: it is mostly built from parts
  and has no model name of its own.
"""

DeviceTypeOption = DeviceType | Sequence[DeviceType] | Literal["all"]
"""Which kinds of device to draw.

A sequence is a set to draw from, so `("phone", "tablet")` is any mobile device, and
`"all"` is every one of them.
"""


@dataclass(frozen=True, slots=True)
class DeviceDetail:
    """A generated device with the pieces it was written from."""

    device: str
    """The device as the value form returns it: `Samsung Galaxy S24 Ultra`."""

    vendor: str
    """Who makes it: `Samsung`."""

    model: str
    """The model's own name: `Galaxy S24 Ultra`."""

    type: DeviceType
    """What kind of device it is."""

    year: int
    """The year the device was released."""


RamUnit = Literal["MB", "GB"]
"""A unit memory is written in.

Memory counts in powers of two, so a gigabyte here is 1024 megabytes — the way an
operating system reports it.
"""

RamUnitOption = Literal[RamUnit, "auto"]
""""auto" writes each size in the largest unit it is a whole number of: `16 GB`, but `512 MB`."""


@dataclass(frozen=True, slots=True)
class RamDetail:
    """A generated amount of memory, in the unit it was written in and in bytes."""

    ram: str
    """The size as the value form returns it: `16 GB`."""

    value: int
    """The number written: `16`."""

    unit: RamUnit
    """The unit the size is written in."""

    bytes: int
    """The same size in bytes, counted in powers of two: `17179869184`."""


DiskType = Literal["hdd", "ssd", "sshd", "emmc", "ufs"]
"""What kind of storage a machine has, as a code.

- `hdd`: a hard disk drive, spinning platters.
- `ssd`: a solid-state drive, flash memory behind SATA or NVMe.
- `sshd`: a solid-state hybrid drive, a hard disk with a flash cache.
- `emmc`: embedded MultiMediaCard flash, soldered to the board — older phones, cheap
  tablets and laptops.
- `ufs`: Universal Flash Storage, what a phone or a tablet stores to now.
"""


@dataclass(frozen=True, slots=True)
class DiskTypeDetail:
    """A generated kind of storage, with its code and its name written out."""

    disk_type: str
    """The label as the value form returns it: `SSD`, `eMMC`."""

    code: DiskType
    """The same kind as a code."""

    name: str
    """The label written out: `Solid State Drive`, `Universal Flash Storage`."""

    platform: SystemPlatform
    """The kind of machine it was drawn for."""


DiskUnit = Literal["MB", "GB", "TB"]
"""A unit storage is written in.

A drive is sold in powers of ten, so a terabyte here is 1000 gigabytes — the way the box
and the spec sheet count it.
"""

DiskUnitOption = Literal[DiskUnit, "auto"]
""""auto" writes each size in the largest unit it is a whole number of: `2 TB`, but `512 GB`."""


@dataclass(frozen=True, slots=True)
class DiskSizeDetail:
    """A generated drive capacity, in the unit it was written in and in bytes."""

    size: str
    """The size as the value form returns it: `1 TB`."""

    value: int
    """The number written: `1`."""

    unit: DiskUnit
    """The unit the size is written in."""

    bytes: int
    """The same size in bytes, counted in powers of ten: `1000000000000`."""


@dataclass(frozen=True, slots=True)
class CpuDetail:
    """A generated processor with the pieces it was written from."""

    cpu: str
    """The processor as the value form returns it: `AMD Ryzen 7 7800X3D`."""

    vendor: str
    """Who makes it: `AMD`."""

    model: str
    """The processor's own name: `Ryzen 7 7800X3D`."""

    platform: SystemPlatform
    """The kind of machine it is built into."""

    year: int
    """The year the first machines with it went on sale."""


@dataclass(frozen=True, slots=True)
class GpuDetail:
    """A generated graphics processor with the pieces it was written from."""

    gpu: str
    """The graphics processor as the value form returns it: `NVIDIA GeForce RTX 4090`."""

    vendor: str
    """Who sells it under their name: `NVIDIA`."""

    model: str
    """The graphics processor's own name: `GeForce RTX 4090`."""

    platform: SystemPlatform
    """The kind of machine it is built into."""

    year: int
    """The year the first cards or machines with it went on sale."""


Architecture = Literal[
    "x86_64",
    "arm64",
    "x86",
    "armv7",
    "riscv64",
    "ppc64le",
    "s390x",
    "mips64",
    "loongarch64",
    "sparc64",
]
"""A processor architecture, by the name a download page most often lists it under.

The first four are what nearly every machine runs; the rest come up only with
`include_rare`.
"""


@dataclass(frozen=True, slots=True)
class ArchitectureDetail:
    """A generated processor architecture with what it is known by elsewhere."""

    architecture: Architecture
    """The architecture as the value form returns it: `x86_64`."""

    aliases: tuple[str, ...]
    """The other names it goes by: `amd64` in Debian and Go, `x64` in Windows and Node."""

    bits: int
    """`32` or `64`."""

    family: str
    """The line it belongs to: `x86`, `arm`, `riscv`, `power`, `s390`, `mips`, `loongarch`, `sparc`."""

    rare: bool
    """Whether it is one of the architectures `include_rare` adds."""


@dataclass(frozen=True, slots=True)
class ResolutionDetail:
    """A generated screen resolution, as two numbers and as written."""

    resolution: str
    """The resolution as the value form returns it: `1920x1080`."""

    width: int
    """The width, in the pixels a browser reports."""

    height: int
    """The height, in the pixels a browser reports."""

    platform: SystemPlatform
    """The kind of machine the screen belongs to."""


VersionFormat = Literal["semver", "calver", "number"]
"""How a software version is numbered.

- `semver`: semantic versioning, `2.14.3`, with a pre-release such as `-beta.2` when asked.
- `calver`: calendar versioning, counted from a year, `2024.3.1`, `24.04`, `2024.03.15`.
- `number`: a version that is one number, the way a browser's is, `42`.
"""

VersionFormatOption = VersionFormat | Sequence[VersionFormat] | Literal["all"]
"""One format, a sequence of them to draw from, or `"all"` of them."""


@dataclass(frozen=True, slots=True)
class VersionDetail:
    """A generated software version, with the numbers it is made of."""

    version: str
    """The version as the value form returns it, prefix included: `v2.14.3`."""

    format: VersionFormat
    """How it is numbered."""

    scheme: str
    """How it is numbered, in CalVer's notation: `MAJOR.MINOR.PATCH`, `MAJOR`, `YY.0M`."""

    parts: tuple[int, ...]
    """The numbers in the order they are written: `(2, 14, 3)`, `(24, 4)`."""

    prerelease: str | None
    """The pre-release, without its hyphen: `beta.2`. `None` when there is none."""

    year: int | None
    """The year a calendar version is counted from, in full. `None` for the others."""


@dataclass(frozen=True, slots=True)
class AppStoreDetail:
    """A generated app store, with the company that runs it."""

    store: str
    """The store as the value form returns it: `Apple App Store`."""

    name: str
    """The store's own name, without the company: `App Store`."""

    company: str
    """The company that runs it: `Apple`."""

    platform: SystemPlatform
    """The kind of machine the store sells apps for."""
