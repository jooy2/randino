"""How a result of several sentences decides what happens in each of them.

Internal — `_generator` asks this module for a plan and writes the sentences itself.

A story here is a list of steps in an order a reader would accept, shared by every
language (`sentence/data`). What this module does is turn one of them into exactly as
many sentences as the caller asked for: it keeps the steps every telling has, adds the
optional ones as room allows, fills what is left with interludes, and decides which two
neighbouring actions are written as one sentence. All of it against a small memory of
what is true of the hero — what `FIELD_RULES` says each action needs and leaves behind —
so that nobody eats what nobody picked up, and a "so" is written only where the story
gave the sentence a reason.
"""

import random
from collections.abc import Callable, Sequence
from dataclasses import dataclass, replace
from typing import Literal

from randino._internal.utils import chance, pick, pick_weighted, rand_int
from randino._types import SentenceStory, SentenceType, WordTheme
from randino.sentence.data import (
    AGENT_CLASSES,
    FIELD_RULES,
    INTERLUDES,
    OPPOSITES,
    STORIES,
    THEME_CLASS,
    Story,
    StoryStep,
)
from randino.sentence.data._types import (
    Condition,
    ConnectiveKind,
    NounClass,
    SentenceLanguageData,
    StateGroup,
    VerbField,
    VerbGroup,
)

JOIN_SHARE = 0.5

# How often a state sentence about a person becomes a line of their own, and how many of
# them one telling may have. A paragraph that speaks in every other line is a script, not
# a story.
VOICE_CHANCE = 40
VOICE_MAX = 2
"""The most joins one result makes, against its sentence count.

A story told in nothing but short sentences reads as stage directions, and `집에
돌아와서 사과를 먹었다` is what makes it prose, but every sentence a two-clause one is as
monotonous as none. How many a telling makes is drawn between none and this.
"""

JoinSide = Literal["first", "second"]
"""Whether a beat is the first or the second clause of one sentence."""


@dataclass(frozen=True, slots=True)
class Beat:
    """One sentence of the plan.

    The step it tells, the field that was settled for it, the condition a state sentence
    asserts, and how it relates to the sentence in front of it.
    """

    step: StoryStep
    field: VerbField | None
    """The field the sentence draws its verb from. None for a state sentence."""

    condition: Condition | None
    """The condition a state sentence says, drawn from what is true just then."""

    before: frozenset[Condition]
    """What was true of the hero before this sentence."""

    links: tuple[ConnectiveKind, ...]
    """The kinds of connective this sentence may open on."""

    kinds: tuple[SentenceType, ...]
    """The kinds this sentence may be beside a statement."""

    join: JoinSide | None
    """Whether this beat is the first or the second clause of one sentence."""

    voiced: bool = False
    """Whether the hero says this one themselves.

    A state sentence quoted in the first person — `“배고프다.”` — rather than narrated.
    Only a person's, only after the first sentence, and only where the language can
    write it.
    """


@dataclass(frozen=True, slots=True)
class Plan:
    """A telling: the story and its beats, one per sentence or per clause."""

    story: Story
    beats: tuple[Beat, ...]
    prop: WordTheme | None
    """The theme the story's prop comes from, when it has one and the language can write it."""


def _has(state: frozenset[Condition], needs: Sequence[Condition]) -> bool:
    return all(condition in state for condition in needs)


def takes_theme(group: VerbGroup, theme: WordTheme) -> bool:
    """Whether a verb group takes a noun of this theme as its object."""
    return (
        group.object is not None
        and THEME_CLASS[theme] in group.object
        and (group.object_themes is None or theme in group.object_themes)
    )


def groups_of(
    data: SentenceLanguageData,
    field: VerbField,
    subject: NounClass,
    obj: WordTheme | None,
    wants_object: bool,
) -> list[VerbGroup]:
    """The verb groups of a field that can take this subject, and an object of this theme.

    The theme rather than its class, because a group may narrow its object to themes —
    `drink` takes an edible, and not a pretzel.
    """
    return [
        group
        for group in data.verbs
        if group.field == field
        and subject in group.subject
        and (group.object is not None) == wants_object
        and (not wants_object or obj is None or takes_theme(group, obj))
        and (
            group.requires is None
            or any(part.slot == group.requires for frame in data.frames for part in frame.parts)
        )
    ]


def states_of(
    data: SentenceLanguageData, subject: NounClass, condition: Condition | None
) -> list[StateGroup]:
    """The state groups that can describe this subject, and say this condition."""
    return [
        group
        for group in data.states
        if subject in group.subject
        and (group.condition is None if condition is None else group.condition == condition)
    ]


def _fields_for(
    data: SentenceLanguageData,
    step: StoryStep,
    hero: NounClass,
    item: WordTheme | None,
    prop: WordTheme | None,
    state: frozenset[Condition],
) -> list[VerbField]:
    """The fields of an action step the language can write for this hero just now."""
    subject: NounClass = "place" if step.kind == "scene" else hero

    # A prop step with no prop to write is not a step: the sentence would draw anything
    # at all into the object slot.
    if not _has(state, step.needs) or (step.object == "prop" and prop is None):
        return []

    theme = prop if step.object == "prop" else item

    return [
        field
        for field in step.fields
        if _has(state, FIELD_RULES[field].needs)
        and groups_of(data, field, subject, theme, step.object is not None)
    ]


@dataclass(frozen=True, slots=True)
class _Memory:
    """What a telling knows as it goes.

    What is true of the hero, which of it a step of the story made true — as against
    what was simply true at the start — and which conditions a sentence has already said.
    """

    state: frozenset[Condition]
    given: frozenset[Condition]
    said: frozenset[Condition]


_UNTELLABLE = object()


def _condition_for(
    data: SentenceLanguageData, step: StoryStep, hero: NounClass, memory: _Memory
) -> object:
    """The condition a state step says.

    A step that names one says that one; a step that names none describes the hero as
    they are just now, with whichever of the conditions the story itself brought about
    the language has a predicate for — or, for a hero nothing is ever true of, a plain
    trait. Never one the telling has already said. `_UNTELLABLE` when there is nothing to
    say.
    """
    if step.condition is not None:
        if states_of(data, hero, step.condition) and step.condition not in memory.said:
            return step.condition

        return _UNTELLABLE

    current = [
        condition
        for condition in sorted(memory.state)
        if condition in memory.given
        and condition not in memory.said
        and states_of(data, hero, condition)
    ]

    if current:
        return pick(current)

    # A hero who acts is described by how they are, never by a trait pulled out of
    # nowhere in the middle of what they are doing; a thing a story is about has nothing
    # else to be described by.
    if hero not in AGENT_CLASSES and states_of(data, hero, None):
        return None

    return _UNTELLABLE


def _settle(
    data: SentenceLanguageData,
    step: StoryStep,
    hero: NounClass,
    item: WordTheme | None,
    prop: WordTheme | None,
    memory: _Memory,
) -> tuple[VerbField | None, Condition | None] | None:
    """Settle one step against the state, or None when it cannot be told here."""
    if step.kind == "state":
        if not _has(memory.state, step.needs):
            return None

        condition = _condition_for(data, step, hero, memory)

        if condition is _UNTELLABLE:
            return None

        return (None, condition)  # type: ignore[return-value]

    fields = _fields_for(data, step, hero, item, prop, memory.state)

    return (fields[0], None) if fields else None


def _discard_opposite(state: set[Condition], condition: Condition) -> None:
    """Forget the condition this one rules out, where it has one: `holding` has none."""
    opposite = OPPOSITES.get(condition)

    if opposite is not None:
        state.discard(opposite)


def _after(
    memory: _Memory, step: StoryStep, settled: tuple[VerbField | None, Condition | None]
) -> _Memory:
    """What the telling knows after a settled step."""
    state = set(memory.state)
    given = set(memory.given)
    said = set(memory.said)
    field, condition = settled

    if field is not None and step.kind != "scene":
        rule = FIELD_RULES[field]

        state.difference_update(rule.takes)

        for each in rule.gives:
            state.add(each)
            given.add(each)
            _discard_opposite(state, each)

    if condition is not None:
        state.add(condition)
        given.add(condition)
        said.add(condition)
        _discard_opposite(state, condition)

    return _Memory(frozenset(state), frozenset(given), frozenset(said))


@dataclass(frozen=True, slots=True)
class _Walked:
    step: StoryStep
    field: VerbField | None
    condition: Condition | None
    before: frozenset[Condition]
    given: frozenset[Condition]
    """What the story itself had made true by then."""


def _walk(
    data: SentenceLanguageData,
    story: Story,
    steps: Sequence[StoryStep],
    hero: NounClass,
    item: WordTheme | None,
    prop: WordTheme | None,
) -> list[_Walked] | None:
    """Walk a sequence of steps from the story's start, settling each in turn.

    None when a step cannot be told where it stands, which is what rejects an optional
    step that would take away what a later required one needs.
    """
    memory = _Memory(frozenset(story.start), frozenset(), frozenset())
    walked: list[_Walked] = []

    for step in steps:
        one = _settle(data, step, hero, item, prop, memory)

        if one is None:
            return None

        walked.append(_Walked(step, one[0], one[1], memory.state, memory.given))
        memory = _after(memory, step, one)

    return walked


def tellable(
    data: SentenceLanguageData, story: Story, hero: NounClass, item: WordTheme | None
) -> bool:
    """Whether the language can tell this story about this hero at all."""
    return (
        _walk(data, story, [step for step in story.steps if step.required], hero, item, None)
        is not None
    )


def item_themes_for(data: SentenceLanguageData, story: Story, hero: NounClass) -> list[WordTheme]:
    """The themes the story's item may come from, for this hero.

    Every theme of the classes the story names that the language can tell the whole
    story with.
    """
    if story.item is None:
        return []

    return [
        theme
        for theme in THEME_CLASS
        if THEME_CLASS[theme] in story.item
        and (story.item_themes is None or theme in story.item_themes)
        and tellable(data, story, hero, theme)
    ]


def prop_themes_for(data: SentenceLanguageData, story: Story, hero: NounClass) -> list[WordTheme]:
    """The themes the story's prop may come from, for this hero.

    Every theme of the classes the story names that some verb of every prop step takes.
    Empty for a story with no prop, and for a language that cannot write one of its steps.
    """
    steps = [step for step in story.steps if step.object == "prop"]

    if story.prop is None or not steps:
        return []

    return [
        theme
        for theme in THEME_CLASS
        if THEME_CLASS[theme] in story.prop
        and (story.prop_themes is None or theme in story.prop_themes)
        and all(
            any(groups_of(data, field, hero, theme, True) for field in step.fields)
            for step in steps
        )
    ]


def hero_classes_for(
    data: SentenceLanguageData, story: Story, heroes: Sequence[NounClass]
) -> list[NounClass]:
    """The classes of `heroes` this story can be told about in this language."""
    return [
        hero
        for hero in story.hero
        if hero in heroes
        and (
            bool(item_themes_for(data, story, hero))
            if story.item is not None
            else tellable(data, story, hero, None)
        )
    ]


def stories_for(
    data: SentenceLanguageData, heroes: Sequence[NounClass], asked: SentenceStory | None
) -> list[Story]:
    """The stories a result may follow.

    The ones about a hero of one of these classes that the language can tell all the way
    through, narrowed to the one the caller named when they named one that qualifies.
    """
    able = [
        story
        for story in STORIES
        if any(hero in heroes for hero in story.hero) and hero_classes_for(data, story, heroes)
    ]
    named = [story for story in able if story.name == asked] if asked is not None else able

    return named or able


def _is_action(step: StoryStep) -> bool:
    """Whether a step is something the hero does, which is what two clauses share."""
    return step.kind == "act"


def _links_for(previous: _Walked | None, current: _Walked) -> tuple[ConnectiveKind, ...]:
    """The connectives a sentence may open on, by what it claims.

    A causal one is kept only where the story has given it a reason: what this sentence
    needs, or what makes a hero do it, is true because an earlier sentence made it so, or
    the sentence before it was the scene changing, which is a reason to go home. Anything
    else is left to the quiet kinds, which any continuation can carry.
    """
    asked = current.step.link

    if previous is None:
        return ()

    if asked == "causal":
        rule = FIELD_RULES[current.field] if current.field is not None else None
        reasons: tuple[Condition, ...] = (
            (current.condition,)  # type: ignore[assignment]
            if current.step.kind == "state"
            else (*(rule.needs if rule else ()), *(rule.after if rule else ()))
        )
        motivated = any(
            condition in current.before and condition in current.given for condition in reasons
        )
        # A state sentence is a consequence of what brought the condition about, and a
        # fresh condition is what the sentence before it left behind.
        followed = (
            current.step.kind == "state"
            and previous.field is not None
            and current.condition in FIELD_RULES[previous.field].gives
        )

        if motivated or followed or previous.step.kind == "scene":
            return ("causal",)

        return ("additive", "temporal")

    return (asked,) if asked is not None else ("additive", "temporal")


def _index_of(story: Story, step: StoryStep) -> int:
    """Where a step stands in the story's own steps, or -1 for an interlude."""
    return story.steps.index(step) if step in story.steps else -1


def plan(
    data: SentenceLanguageData,
    story: Story,
    hero: NounClass,
    item: WordTheme | None,
    count: int,
    joinable: bool,
) -> Plan | None:
    """Plan a telling of `story` in exactly `count` sentences.

    The required steps come first, then optional steps are added wherever the state
    allows and a later step still holds, then interludes fill what is left. Some
    neighbouring actions are then joined into one sentence, and the plan is topped up
    again for each join, so the count comes out exact. A story that has fewer required
    steps than the caller wants sentences is padded; one that has more is cut where it
    stands.
    """
    required = [step for step in story.steps if step.required]
    # The prop is drawn once per telling, the way the item is drawn once per story.
    props = prop_themes_for(data, story, hero)
    prop = pick(props) if props else None
    chosen = required[:count]
    walked = _walk(data, story, chosen, hero, item, prop)

    if walked is None:
        return None

    # Two clauses in one sentence need the room for two clauses. `joinable` is the
    # caller's range saying whether there is any.
    can_join = joinable and data.join is not None
    # How many two-clause sentences this telling aims for. Drawn once, so that a
    # paragraph is not all of one or all of the other.
    joins = rand_int(0, int(count * JOIN_SHARE)) if can_join and count > 1 else 0

    def grow(again: bool) -> bool:
        # Add a step: the story's own optional steps first, each once; then the
        # interludes, each once; then any of them again.
        nonlocal chosen, walked
        optional = [
            step for step in story.steps if not step.required and (again or step not in chosen)
        ]
        own: list[Callable[[], list[StoryStep]]] = []
        filler: list[Callable[[], list[StoryStep]]] = []

        for step in optional:

            def place(step: StoryStep = step) -> list[StoryStep]:
                # An interlude is at no index of the story's own steps, and reads as -1
                # so that it stays in front of the step being placed.
                at = _index_of(story, step)
                before = [each for each in chosen if _index_of(story, each) < at]
                rest = [each for each in chosen if _index_of(story, each) >= at]

                return [*before, step, *rest]

            own.append(place)

        for step in INTERLUDES:
            if (step.object == "item" and story.item is None) or (not again and step in chosen):
                continue

            def insert(step: StoryStep = step) -> list[StoryStep]:
                at = rand_int(1, len(chosen))

                return [*chosen[:at], step, *chosen[at:]]

            filler.append(insert)

        random.shuffle(own)
        random.shuffle(filler)

        for attempt in [*own, *filler]:
            candidate = attempt()
            walked_next = _walk(data, story, candidate, hero, item, prop)

            if walked_next is not None:
                chosen = candidate
                walked = walked_next

                return True

        return False

    while len(chosen) < count + joins:
        if not grow(False) and not grow(True):
            joins = max(0, len(chosen) - count)
            break

    # A telling that cannot reach its count is not a telling of this story.
    if len(chosen) < count:
        return None

    assert walked is not None

    # Which neighbouring actions become one sentence. Every pair that could is a
    # candidate, and the draw decides, up to the number the telling paid for.
    joined: set[int] = set()
    pairs = [
        i
        for i in range(len(walked) - 1)
        if _is_action(walked[i].step) and _is_action(walked[i + 1].step)
    ]

    random.shuffle(pairs)

    for at in pairs:
        if len(joined) >= joins:
            break

        if at - 1 not in joined and at + 1 not in joined:
            joined.add(at)

    # A join that was paid for and not made leaves the telling one sentence long; the
    # steps that were only ever padding come off the end first. A step whose removal
    # breaks a later step's needs stays: `take` was optional, and `eat` after it is not.
    while len(walked) - len(joined) > count:
        trimmed: list[_Walked] | None = None
        at = -1
        # The join a trimmed clause was one half of, given up with it: the other clause
        # is a sentence of its own then.
        unjoined = -1

        for i in range(len(walked) - 1, -1, -1):
            if walked[i].step.required or i in joined or i - 1 in joined:
                continue

            trimmed = _walk(data, story, [*chosen[:i], *chosen[i + 1 :]], hero, item, prop)
            at = i

            if trimmed is not None:
                break

        # Nothing stands alone: every optional step left is one clause of a two-clause
        # sentence, and a join is not worth a sentence the caller did not ask for. One
        # clause goes, and its join with it.
        if trimmed is None:
            for i in range(len(walked) - 1, -1, -1):
                if walked[i].step.required or not (i in joined or i - 1 in joined):
                    continue

                trimmed = _walk(data, story, [*chosen[:i], *chosen[i + 1 :]], hero, item, prop)
                at = i
                unjoined = i if i in joined else i - 1

                if trimmed is not None:
                    break

        if trimmed is None:
            break

        chosen.pop(at)
        walked = trimmed
        joined.discard(unjoined)
        joined = {each - 1 if each > at else each for each in joined}

    # A person says some of what is true of them in their own words: a state sentence
    # after the first, in a language that writes the first person, is now and then a
    # line the story quotes rather than narrates.
    voiced = 0
    beats: list[Beat] = []

    for i, one in enumerate(walked):
        voice = (
            hero == "person"
            and data.speech is not None
            and i > 0
            and one.step.kind == "state"
            and one.condition is not None
            and voiced < VOICE_MAX
            and chance(VOICE_CHANCE)
        )

        if voice:
            voiced += 1

        beats.append(
            Beat(
                step=one.step,
                field=one.field,
                condition=one.condition,
                before=one.before,
                links=_links_for(walked[i - 1] if i > 0 else None, one),
                # A kind beside the statement is the step's own, and `trailing` is kept
                # for the sentence that closes the result.
                kinds=tuple(
                    kind for kind in one.step.kinds if kind != "trailing" or i == len(walked) - 1
                ),
                join="first" if i in joined else "second" if i - 1 in joined else None,
                voiced=voice,
            )
        )

    return Plan(story, tuple(beats), prop)


def unjoined(beat: Beat) -> Beat:
    """The same beat, written as a whole sentence rather than as a clause."""
    return replace(beat, join=None)


def pick_story(stories: Sequence[Story]) -> Story:
    """One story out of several, by weight."""
    return pick_weighted(stories, lambda story: story.weight)
