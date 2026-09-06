"""The per-language sentence datasets: the grammar every sentence is written in."""

from dataclasses import dataclass
from typing import Literal

from randino._types import SentenceStory, SentenceType, WordLanguage, WordTheme
from randino.sentence.data._types import (
    Condition,
    ConnectiveKind,
    NounClass,
    SentenceLanguageData,
    VerbField,
)
from randino.sentence.data.de import DE
from randino.sentence.data.en import EN
from randino.sentence.data.es import ES
from randino.sentence.data.it import IT
from randino.sentence.data.ja import JA
from randino.sentence.data.ko import KO
from randino.sentence.data.ru import RU
from randino.sentence.data.vi import VI
from randino.sentence.data.zh import ZH

THEME_CLASS: dict[WordTheme, NounClass] = {
    "animal": "creature",
    "myth": "creature",
    "job": "person",
    "plant": "plant",
    "food": "edible",
    "drink": "edible",
    "object": "thing",
    "tool": "thing",
    "clothing": "thing",
    "product": "thing",
    "gem": "thing",
    "music": "thing",
    "vehicle": "vehicle",
    "place": "place",
    "nature": "place",
    "space": "place",
    "weather": "event",
    "sport": "event",
    "time": "event",
    "concept": "idea",
    "emotion": "idea",
    "finance": "idea",
    "tech": "idea",
    "color": "idea",
    "body": "body",
}
"""What each theme's nouns are, as far as a verb is concerned.

The map is the same in every language, because a theme is: `animal` names creatures
wherever it is written, and a verb that needs one can say so once.

This is what keeps a sentence together. `먹는다` takes an `edible` object and nothing
else, so `여우가 사과를 먹는다` is a sentence the generator can build and `여우가
철학을 먹는다` is not — no tag on any noun, and no rule per language.
"""

AGENT_CLASSES: tuple[NounClass, ...] = ("creature", "person")
"""The classes a story can be about somebody in: the ones that act."""


@dataclass(frozen=True, slots=True)
class FieldRule:
    """What a field needs to be true first, leaves true afterwards, ends, and follows from.

    This is the whole of a story's memory: a step whose needs are not met is not written,
    so nobody eats what nobody has picked up, and a connective that says "so" is written
    only where the story gave the sentence a reason.
    """

    needs: tuple[Condition, ...] = ()
    """What has to be true of the hero for this to happen at all."""

    gives: tuple[Condition, ...] = ()
    """What is true of the hero once it has."""

    takes: tuple[Condition, ...] = ()
    """What is no longer true once it has."""

    after: tuple[Condition, ...] = ()
    """What makes the hero do it, which is what a connective that says "so" may claim."""


FIELD_RULES: dict[VerbField, FieldRule] = {
    "rise": FieldRule(gives=("awake", "rested"), takes=("asleep", "tired")),
    "go": FieldRule(
        needs=("awake",), gives=("away",), takes=("home",), after=("restless", "hungry")
    ),
    "arrive": FieldRule(
        needs=("awake",), gives=("home",), takes=("away",), after=("tired", "full")
    ),
    "move": FieldRule(needs=("awake",), gives=("tired",), takes=("rested",), after=("restless",)),
    "wait": FieldRule(needs=("awake",)),
    "rest": FieldRule(
        needs=("awake",), gives=("rested",), takes=("tired",), after=("tired", "full")
    ),
    "sleep": FieldRule(
        needs=("awake",), gives=("asleep",), takes=("awake", "tired"), after=("tired", "full")
    ),
    "express": FieldRule(needs=("awake",), after=("content", "full")),
    "play": FieldRule(
        needs=("awake",),
        gives=("tired", "content"),
        takes=("rested", "restless"),
        after=("restless", "rested"),
    ),
    "think": FieldRule(needs=("awake",), after=("restless",)),
    "look": FieldRule(needs=("awake",), after=("restless",)),
    "search": FieldRule(needs=("awake",), after=("restless",)),
    "find": FieldRule(needs=("awake",), gives=("holding", "content"), takes=("restless",)),
    "take": FieldRule(needs=("awake",), gives=("holding",), after=("hungry",)),
    "carry": FieldRule(needs=("awake", "holding")),
    "hide": FieldRule(needs=("awake", "holding"), takes=("holding",)),
    "make": FieldRule(needs=("awake",), gives=("holding",)),
    "tend": FieldRule(needs=("awake", "holding")),
    "sell": FieldRule(needs=("awake", "holding"), takes=("holding",)),
    "buy": FieldRule(needs=("awake",), gives=("holding",), after=("hungry",)),
    "cook": FieldRule(needs=("awake", "holding"), after=("hungry",)),
    "eat": FieldRule(
        needs=("awake", "holding"), gives=("full",), takes=("hungry", "holding"), after=("hungry",)
    ),
    "drink": FieldRule(
        needs=("awake", "holding"), gives=("full",), takes=("hungry", "holding"), after=("hungry",)
    ),
    "change": FieldRule(),
}
"""The rule of every field.

`"awake"` is what almost everything needs and what `sleep` ends, which is why a hero who
has gone to sleep does nothing else in that story.
"""

OPPOSITES: dict[Condition, Condition] = {
    "awake": "asleep",
    "asleep": "awake",
    "hungry": "full",
    "full": "hungry",
    "tired": "rested",
    "rested": "tired",
    "away": "home",
    "home": "away",
    "content": "restless",
    "restless": "content",
}
"""The condition each one rules out.

Saying the hero is full is saying they are no longer hungry, so a state sentence ends the
opposite of what it asserts.
"""

StepKind = Literal["act", "state", "scene"]
"""What kind of step a story writes.

`"act"`: the hero does something, drawn from the step's fields. `"state"`: the hero is
described, with a predicate that says a condition. `"scene"`: the place the story is
happening in does something of its own.
"""

StoryRole = Literal["item", "place", "home"]
"""The story's own nouns: the thing it is about, where it happens, and where home is."""


@dataclass(frozen=True, slots=True)
class StoryStep:
    """One thing that happens in a story.

    `object`, `place` and `destination` name the story's own nouns rather than themes:
    the item is one thing throughout, the place is where it all happens and home is where
    the hero comes back to. A part the shape has room for is written with that noun, and
    one it has no room for is left out rather than drawn afresh.
    """

    kind: StepKind
    fields: tuple[VerbField, ...] = ()
    """The fields an action may draw from, best first."""

    condition: Condition | None = None
    """The condition a state step says. None for a state drawn from what is true."""

    object: bool = False
    """Whether the story's item is written as the object."""

    place: bool = False
    """Whether the story's place is written where the shape has room for one."""

    destination: StoryRole | None = None
    """Where the hero is going: the story's place, or home."""

    needs: tuple[Condition, ...] = ()
    """What has to be true of the hero for this step, beside what its field needs."""

    required: bool = False
    """A step every telling of the story has. The rest are drawn as room allows."""

    link: ConnectiveKind | None = None
    """What a connective in front of this sentence may claim about the last one."""

    kinds: tuple[SentenceType, ...] = ()
    """Kinds this sentence may be beside a statement."""


@dataclass(frozen=True, slots=True)
class Story:
    """A story: an order of events a reader would accept, shared by every language."""

    name: SentenceStory
    hero: tuple[NounClass, ...]
    """Classes the hero may belong to."""

    start: tuple[Condition, ...]
    """What is true of the hero before the first sentence."""

    steps: tuple[StoryStep, ...]
    weight: int
    """How often this story is told, against the others the hero could be in."""

    item: tuple[NounClass, ...] | None = None
    """Classes the thing the story is about may belong to, for a story with one."""

    item_themes: tuple[WordTheme, ...] | None = None
    """The themes it may come from, when the classes are too wide."""


STORIES: tuple[Story, ...] = (
    Story(
        name="errand",
        hero=AGENT_CLASSES,
        item=("edible",),
        start=("awake", "hungry", "home"),
        weight=20,
        steps=(
            StoryStep("state", condition="hungry"),
            StoryStep("act", fields=("go",), destination="place", required=True),
            StoryStep("act", fields=("look",), object=True, place=True),
            StoryStep(
                "act", fields=("buy", "take", "find"), object=True, place=True, required=True
            ),
            StoryStep(
                "act", fields=("arrive",), destination="home", required=True, link="temporal"
            ),
            StoryStep("act", fields=("cook",), object=True),
            StoryStep("act", fields=("eat", "drink"), object=True, required=True, link="causal"),
            StoryStep("state", condition="full", link="causal"),
            StoryStep(
                "act",
                fields=("express", "think", "rest"),
                link="temporal",
                kinds=("trailing", "exclamation"),
            ),
        ),
    ),
    Story(
        name="meal",
        hero=AGENT_CLASSES,
        item=("edible",),
        start=("awake", "hungry", "home"),
        weight=14,
        steps=(
            StoryStep("state", condition="hungry", required=True),
            StoryStep("act", fields=("take", "find"), object=True, required=True, link="causal"),
            StoryStep("act", fields=("cook",), object=True),
            StoryStep("act", fields=("look",), object=True),
            StoryStep("act", fields=("eat", "drink"), object=True, required=True, link="temporal"),
            StoryStep("state", condition="full", link="causal"),
            StoryStep("act", fields=("express",), kinds=("exclamation",)),
            StoryStep("act", fields=("think", "play"), link="temporal", kinds=("trailing",)),
        ),
    ),
    Story(
        name="search",
        hero=AGENT_CLASSES,
        item=("thing", "plant"),
        item_themes=("object", "tool", "clothing", "gem", "plant"),
        start=("awake", "restless", "home"),
        weight=16,
        steps=(
            StoryStep("state", condition="restless"),
            StoryStep("act", fields=("search",), place=True, required=True),
            StoryStep("act", fields=("wait",), place=True),
            StoryStep(
                "act",
                fields=("find",),
                object=True,
                place=True,
                required=True,
                kinds=("exclamation",),
            ),
            StoryStep("act", fields=("carry", "take"), object=True, link="temporal"),
            StoryStep("act", fields=("arrive",), destination="home", link="temporal"),
            StoryStep("act", fields=("hide",), object=True),
            StoryStep("state", condition="content", link="causal"),
            StoryStep(
                "act",
                fields=("think", "express"),
                link="temporal",
                kinds=("trailing", "exclamation"),
            ),
        ),
    ),
    Story(
        name="outing",
        hero=AGENT_CLASSES,
        item=("plant", "thing"),
        start=("asleep", "rested", "home"),
        weight=18,
        steps=(
            StoryStep("act", fields=("rise",), required=True),
            StoryStep("act", fields=("go",), destination="place", required=True, link="temporal"),
            StoryStep("act", fields=("move", "play"), place=True, link="additive"),
            StoryStep("act", fields=("look",), object=True, place=True),
            StoryStep("act", fields=("wait",), place=True),
            StoryStep("scene", fields=("change",), link="temporal"),
            StoryStep("state", condition="tired", link="causal"),
            StoryStep(
                "act", fields=("arrive",), destination="home", required=True, link="temporal"
            ),
            StoryStep(
                "act", fields=("rest", "sleep", "express"), link="causal", kinds=("trailing",)
            ),
        ),
    ),
    Story(
        name="craft",
        hero=("person",),
        item=("thing",),
        item_themes=("object", "tool", "clothing", "product", "gem"),
        start=("awake", "rested", "home"),
        weight=12,
        steps=(
            StoryStep("act", fields=("go",), destination="place"),
            StoryStep("act", fields=("make",), object=True, place=True, required=True),
            StoryStep("act", fields=("tend",), object=True, link="temporal"),
            StoryStep("act", fields=("look",), object=True),
            StoryStep("act", fields=("sell", "carry"), object=True, required=True, link="temporal"),
            StoryStep("state", condition="content", link="causal"),
            StoryStep("act", fields=("arrive",), destination="home", link="temporal"),
            StoryStep(
                "act",
                fields=("express", "think"),
                link="temporal",
                kinds=("trailing", "exclamation"),
            ),
        ),
    ),
    Story(
        name="stroll",
        hero=AGENT_CLASSES,
        start=("awake", "rested", "home"),
        weight=12,
        steps=(
            StoryStep("act", fields=("go",), destination="place", required=True),
            StoryStep("act", fields=("move",), place=True, required=True, link="additive"),
            StoryStep("act", fields=("wait", "express"), place=True),
            StoryStep("act", fields=("play",), place=True),
            StoryStep("scene", fields=("change",), link="temporal"),
            StoryStep("act", fields=("think",)),
            StoryStep("state", condition="tired", link="causal"),
            StoryStep(
                "act", fields=("arrive",), destination="home", required=True, link="temporal"
            ),
            StoryStep(
                "act",
                fields=("rest", "sleep", "think", "express"),
                link="causal",
                kinds=("trailing",),
            ),
        ),
    ),
    Story(
        name="evening",
        hero=AGENT_CLASSES,
        item=("edible",),
        start=("awake", "away", "holding"),
        weight=12,
        steps=(
            StoryStep("scene", fields=("change",), required=True),
            StoryStep("act", fields=("arrive",), destination="home", required=True, link="causal"),
            StoryStep("act", fields=("eat", "drink"), object=True, link="temporal"),
            StoryStep("act", fields=("express",)),
            StoryStep("act", fields=("think",)),
            StoryStep("state", condition="tired"),
            StoryStep("act", fields=("sleep",), required=True, link="temporal"),
            StoryStep("scene", fields=("change",), link="temporal", kinds=("trailing",)),
        ),
    ),
    # A day at home: a person gets up, takes a thing out and sees to it.
    Story(
        name="chores",
        hero=("person",),
        item=("thing",),
        item_themes=("object", "tool", "clothing"),
        start=("asleep", "rested", "home"),
        weight=12,
        steps=(
            StoryStep("act", fields=("rise",), required=True),
            StoryStep("act", fields=("take",), object=True, required=True, link="temporal"),
            StoryStep("act", fields=("look",), object=True),
            StoryStep("act", fields=("tend",), object=True, required=True, link="additive"),
            StoryStep("act", fields=("carry",), object=True, link="temporal"),
            StoryStep("state", condition="content", link="causal"),
            StoryStep(
                "act",
                fields=("express", "think"),
                link="temporal",
                kinds=("trailing", "exclamation"),
            ),
        ),
    ),
    # The hero carries something somewhere and hides it there.
    Story(
        name="stash",
        hero=AGENT_CLASSES,
        item=("edible", "thing"),
        start=("awake", "rested", "home", "holding"),
        weight=12,
        steps=(
            StoryStep("act", fields=("carry",), object=True, required=True),
            StoryStep("act", fields=("go",), destination="place", required=True, link="temporal"),
            StoryStep("act", fields=("look",), object=True, place=True),
            StoryStep(
                "act", fields=("hide",), object=True, place=True, required=True, link="temporal"
            ),
            StoryStep("act", fields=("wait",), place=True),
            StoryStep("scene", fields=("change",), link="temporal"),
            StoryStep("act", fields=("think",), link="additive"),
            StoryStep("act", fields=("arrive",), destination="home", link="temporal"),
            StoryStep("state", condition="content", link="causal", kinds=("trailing",)),
        ),
    ),
    # Nothing happens: the hero is at a loose end, and plays.
    Story(
        name="idle",
        hero=AGENT_CLASSES,
        start=("awake", "rested", "home"),
        weight=10,
        steps=(
            StoryStep("state", condition="restless"),
            StoryStep("act", fields=("wait",), required=True),
            StoryStep("act", fields=("think",), link="additive"),
            StoryStep("act", fields=("play",), required=True, link="temporal"),
            StoryStep("act", fields=("express",), link="causal", kinds=("exclamation",)),
            StoryStep("state", condition="content", link="causal"),
            StoryStep("act", fields=("rest", "think"), link="temporal", kinds=("trailing",)),
        ),
    ),
    # The place wakes before the hero does, and the day begins.
    Story(
        name="waking",
        hero=AGENT_CLASSES,
        start=("asleep", "rested", "home"),
        weight=10,
        steps=(
            StoryStep("scene", fields=("change",), required=True),
            StoryStep("act", fields=("rise",), required=True, link="temporal"),
            StoryStep("act", fields=("express",), link="additive"),
            StoryStep("act", fields=("move", "play"), link="additive"),
            StoryStep("act", fields=("think",)),
            StoryStep("act", fields=("wait",), link="temporal"),
            StoryStep("scene", fields=("change",), link="temporal", kinds=("trailing",)),
        ),
    ),
    # The hero eats out: gets something somewhere and eats it there.
    Story(
        name="picnic",
        hero=AGENT_CLASSES,
        item=("edible",),
        start=("awake", "hungry", "home"),
        weight=12,
        steps=(
            StoryStep("act", fields=("go",), destination="place", required=True),
            StoryStep(
                "act", fields=("buy", "take", "find"), object=True, place=True, required=True
            ),
            StoryStep("act", fields=("look",), object=True),
            StoryStep(
                "act",
                fields=("eat", "drink"),
                object=True,
                place=True,
                required=True,
                link="temporal",
            ),
            StoryStep("state", condition="full", link="causal"),
            StoryStep("act", fields=("express",), link="causal", kinds=("exclamation",)),
            StoryStep("scene", fields=("change",), link="temporal"),
            StoryStep("act", fields=("arrive",), destination="home", link="temporal"),
            StoryStep("act", fields=("think", "express"), kinds=("trailing",)),
        ),
    ),
    Story(
        name="passage",
        hero=("plant", "edible", "thing", "vehicle", "place", "event", "idea", "body"),
        start=(),
        weight=10,
        steps=(
            StoryStep("state"),
            StoryStep("act", fields=("change", "move"), required=True),
            StoryStep("act", fields=("change", "move"), required=True, link="temporal"),
            StoryStep("act", fields=("change", "move"), link="temporal"),
            StoryStep("state", link="causal", kinds=("trailing",)),
        ),
    ),
)
"""The stories, written once for every language.

A story's required steps alone have to satisfy their own needs, so that a telling cut
down to them still holds together; the suite walks each of them to check.
"""

INTERLUDES: tuple[StoryStep, ...] = (
    StoryStep("state", link="causal"),
    StoryStep("act", fields=("express", "wait", "think"), link="additive"),
    StoryStep("act", fields=("look",), object=True, needs=("holding",)),
    # Out of the house, the hero may move about where they are, and the place may do
    # something of its own. At home neither: a scene is the place the story is happening
    # in, and a home story has none.
    StoryStep("act", fields=("move", "play"), place=True, needs=("away",), link="additive"),
    StoryStep("scene", fields=("change",), needs=("away",), link="temporal"),
)
"""What a telling may put between the steps of its story when asked for more sentences."""

SENTENCE_DATA: dict[WordLanguage, SentenceLanguageData] = {
    "en": EN,
    "ko": KO,
    "ja": JA,
    "zh": ZH,
    "vi": VI,
    "es": ES,
    "it": IT,
    "de": DE,
    "ru": RU,
}
"""The sentence dataset for each language the word pools cover."""
