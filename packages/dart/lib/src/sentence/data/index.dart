// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/sentence/data/de.dart';
import 'package:randino/src/sentence/data/en.dart';
import 'package:randino/src/sentence/data/es.dart';
import 'package:randino/src/sentence/data/it.dart';
import 'package:randino/src/sentence/data/ja.dart';
import 'package:randino/src/sentence/data/ko.dart';
import 'package:randino/src/sentence/data/ru.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/sentence/data/vi.dart';
import 'package:randino/src/sentence/data/zh.dart';
import 'package:randino/src/types.dart';

/// What each theme's nouns are, as far as a verb is concerned.
///
/// The map is the same in every language, because a theme is: `animal` names
/// creatures wherever it is written, and a verb that needs one can say so once.
///
/// This is what keeps a sentence together. `먹는다` takes an [NounClass.edible]
/// object and nothing else, so `여우가 사과를 먹는다` is a sentence the
/// generator can build and `여우가 철학을 먹는다` is not — no tag on any noun,
/// and no rule per language.
const Map<WordTheme, NounClass> themeClass = <WordTheme, NounClass>{
  WordTheme.animal: NounClass.creature,
  WordTheme.myth: NounClass.creature,
  WordTheme.job: NounClass.person,
  WordTheme.person: NounClass.person,
  WordTheme.plant: NounClass.plant,
  WordTheme.food: NounClass.edible,
  WordTheme.drink: NounClass.edible,
  WordTheme.object: NounClass.thing,
  WordTheme.tool: NounClass.thing,
  WordTheme.clothing: NounClass.thing,
  WordTheme.product: NounClass.thing,
  WordTheme.gem: NounClass.thing,
  WordTheme.music: NounClass.thing,
  WordTheme.toy: NounClass.thing,
  WordTheme.furniture: NounClass.thing,
  WordTheme.vehicle: NounClass.vehicle,
  WordTheme.place: NounClass.place,
  WordTheme.nature: NounClass.place,
  WordTheme.space: NounClass.place,
  WordTheme.weather: NounClass.event,
  WordTheme.sport: NounClass.event,
  WordTheme.time: NounClass.event,
  WordTheme.sound: NounClass.event,
  WordTheme.concept: NounClass.idea,
  WordTheme.emotion: NounClass.idea,
  WordTheme.finance: NounClass.idea,
  WordTheme.tech: NounClass.idea,
  WordTheme.color: NounClass.idea,
  WordTheme.body: NounClass.body,
};

/// The classes a story can be about somebody in: the ones that act.
const List<NounClass> agentClasses = <NounClass>[NounClass.creature, NounClass.person];

/// What each field needs to be true of the hero before it happens, what it
/// leaves true afterwards, what it ends, and what makes the hero do it.
///
/// This is the whole of a story's memory: a step whose needs are not met is not
/// written, so nobody eats what nobody has picked up, and a connective that says
/// "so" is written only where the story gave the sentence a reason.
class FieldRule {
  /// Creates a rule.
  const FieldRule({
    this.needs = const <Condition>[],
    this.gives = const <Condition>[],
    this.takes = const <Condition>[],
    this.after = const <Condition>[],
  });

  /// What has to be true of the hero for this to happen at all.
  final List<Condition> needs;

  /// What is true of the hero once it has.
  final List<Condition> gives;

  /// What is no longer true once it has.
  final List<Condition> takes;

  /// What makes the hero do it, which is what a connective that says "so" may
  /// claim: a hungry hero who eats is a consequence.
  final List<Condition> after;
}

/// The rule of every field. `awake` is what almost everything needs and what
/// `sleep` ends, which is why a hero who has gone to sleep does nothing else.
const Map<VerbField, FieldRule> fieldRules = <VerbField, FieldRule>{
  VerbField.rise: FieldRule(
    gives: <Condition>[Condition.awake, Condition.rested],
    takes: <Condition>[Condition.asleep, Condition.tired],
  ),
  VerbField.go: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.away],
    takes: <Condition>[Condition.home],
    after: <Condition>[Condition.restless, Condition.hungry],
  ),
  VerbField.arrive: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.home],
    takes: <Condition>[Condition.away],
    after: <Condition>[Condition.tired, Condition.full],
  ),
  VerbField.move: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.tired],
    takes: <Condition>[Condition.rested],
    after: <Condition>[Condition.restless],
  ),
  VerbField.wait: FieldRule(needs: <Condition>[Condition.awake]),
  VerbField.rest: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.rested],
    takes: <Condition>[Condition.tired],
    after: <Condition>[Condition.tired, Condition.full],
  ),
  VerbField.sleep: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.asleep],
    takes: <Condition>[Condition.awake, Condition.tired],
    after: <Condition>[Condition.tired, Condition.full],
  ),
  VerbField.express: FieldRule(
    needs: <Condition>[Condition.awake],
    after: <Condition>[Condition.content, Condition.full],
  ),
  VerbField.play: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.tired, Condition.content],
    takes: <Condition>[Condition.rested, Condition.restless],
    after: <Condition>[Condition.restless, Condition.rested],
  ),
  VerbField.think: FieldRule(
    needs: <Condition>[Condition.awake],
    after: <Condition>[Condition.restless],
  ),
  VerbField.look: FieldRule(
    needs: <Condition>[Condition.awake],
    after: <Condition>[Condition.restless],
  ),
  VerbField.search: FieldRule(
    needs: <Condition>[Condition.awake],
    after: <Condition>[Condition.restless],
  ),
  VerbField.find: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.holding, Condition.content],
    takes: <Condition>[Condition.restless],
  ),
  VerbField.take: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.holding],
    after: <Condition>[Condition.hungry],
  ),
  VerbField.carry: FieldRule(needs: <Condition>[Condition.awake, Condition.holding]),
  VerbField.hide: FieldRule(
    needs: <Condition>[Condition.awake, Condition.holding],
    takes: <Condition>[Condition.holding],
  ),
  VerbField.make: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.holding],
  ),
  VerbField.tend: FieldRule(needs: <Condition>[Condition.awake, Condition.holding]),
  VerbField.sell: FieldRule(
    needs: <Condition>[Condition.awake, Condition.holding],
    takes: <Condition>[Condition.holding],
  ),
  VerbField.buy: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.holding],
    after: <Condition>[Condition.hungry],
  ),
  VerbField.cook: FieldRule(
    needs: <Condition>[Condition.awake, Condition.holding],
    after: <Condition>[Condition.hungry],
  ),
  // A meal leaves the hero full and pleased, which is what they show afterwards.
  VerbField.eat: FieldRule(
    needs: <Condition>[Condition.awake, Condition.holding],
    gives: <Condition>[Condition.full, Condition.content],
    takes: <Condition>[Condition.hungry, Condition.holding],
    after: <Condition>[Condition.hungry],
  ),
  VerbField.drink: FieldRule(
    needs: <Condition>[Condition.awake, Condition.holding],
    gives: <Condition>[Condition.full, Condition.content],
    takes: <Condition>[Condition.hungry, Condition.holding],
    after: <Condition>[Condition.hungry],
  ),
  // Losing what one holds is what makes a hero restless enough to search.
  VerbField.lose: FieldRule(
    needs: <Condition>[Condition.awake, Condition.holding],
    gives: <Condition>[Condition.restless],
    takes: <Condition>[Condition.holding, Condition.content],
  ),
  VerbField.meet: FieldRule(
    needs: <Condition>[Condition.awake],
    gives: <Condition>[Condition.content],
    takes: <Condition>[Condition.restless],
    after: <Condition>[Condition.restless],
  ),
  VerbField.talk: FieldRule(
    needs: <Condition>[Condition.awake],
    after: <Condition>[Condition.content],
  ),
  VerbField.change: FieldRule(),
};

/// The condition each one rules out. Saying the hero is full is saying they are
/// no longer hungry, so a state sentence ends the opposite of what it asserts.
const Map<Condition, Condition> opposites = <Condition, Condition>{
  Condition.awake: Condition.asleep,
  Condition.asleep: Condition.awake,
  Condition.hungry: Condition.full,
  Condition.full: Condition.hungry,
  Condition.tired: Condition.rested,
  Condition.rested: Condition.tired,
  Condition.away: Condition.home,
  Condition.home: Condition.away,
  Condition.content: Condition.restless,
  Condition.restless: Condition.content,
};

/// What kind of step a story writes.
enum StepKind {
  /// The hero does something, drawn from the step's fields.
  act,

  /// The hero is described, with a predicate that says a condition.
  state,

  /// The place the story is happening in does something of its own.
  scene,

  /// Somebody or something else does — the person the hero met, a sparrow on
  /// the fence, the wind — and nothing of the hero's state changes.
  other,
}

/// What the story's nouns a step names: the thing, the place, or home.
enum StoryRole {
  /// The thing the story is about.
  item,

  /// Where it is all happening.
  place,

  /// Where the hero comes back to.
  home,

  /// A second thing the hero picks up or looks at on the way, which is never
  /// what the story needs and so is never in a required step.
  prop,

  /// A fresh place the story moves on to, which is its place from then on.
  elsewhere,
}

/// One thing that happens in a story.
///
/// `object`, `place` and `destination` name the story's own nouns rather than
/// themes: the item is one thing throughout, the place is where it all happens
/// and home is where the hero comes back to. A part the shape has room for is
/// written with that noun, and one it has no room for is left out rather than
/// drawn afresh.
class StoryStep {
  /// Creates a step.
  const StoryStep(
    this.kind, {
    this.fields = const <VerbField>[],
    this.condition,
    this.object,
    this.place = false,
    this.destination,
    this.needs = const <Condition>[],
    this.required = false,
    this.link,
    this.kinds = const <SentenceType>[],
    this.actor,
    this.actorClasses,
    this.actorThemes,
  });

  /// What kind of step this is.
  final StepKind kind;

  /// Whom a [StepKind.other] step is about when it is the story's item: the
  /// person met. Only [StoryRole.item] means anything here.
  final StoryRole? actor;

  /// The classes a fresh actor of a [StepKind.other] step may belong to.
  final List<NounClass>? actorClasses;

  /// The themes it may come from, when its classes are too wide.
  final List<WordTheme>? actorThemes;

  /// The fields an action may draw from, best first.
  final List<VerbField> fields;

  /// The condition a state step says. Null for a state drawn from what is true.
  final Condition? condition;

  /// Whether the story's item is written as the object.
  final StoryRole? object;

  /// Whether the story's place is written where the shape has room for one.
  final bool place;

  /// Where the hero is going: the story's place, or home.
  final StoryRole? destination;

  /// What has to be true of the hero for this step, beside what its field needs.
  final List<Condition> needs;

  /// A step every telling of the story has. The rest are drawn as room allows.
  final bool required;

  /// What a connective in front of this sentence may claim about the last one.
  final ConnectiveKind? link;

  /// Kinds this sentence may be beside a statement.
  final List<SentenceType> kinds;
}

/// A story: an order of events a reader would accept, shared by every language.
class Story {
  /// Creates a story.
  const Story({
    required this.name,
    required this.hero,
    required this.start,
    required this.steps,
    required this.weight,
    this.item,
    this.itemThemes,
    this.prop,
    this.propThemes,
    this.heroThemes,
    this.lines,
  });

  /// Which story this is.
  final SentenceStory name;

  /// The themes the hero may come from, when the classes are too wide: a
  /// sketch is of a forest or a market, not of Pluto, though all three are the
  /// place class.
  final List<WordTheme>? heroThemes;

  /// The most lines one telling may quote. Null for the usual two.
  final int? lines;

  /// Classes the hero may belong to.
  final List<NounClass> hero;

  /// Classes the thing the story is about may belong to, for a story with one.
  final List<NounClass>? item;

  /// The themes it may come from, when the classes are too wide.
  final List<WordTheme>? itemThemes;

  /// Classes a second thing may belong to, for a story that has a step with
  /// `object: StoryRole.prop`, narrowed to [propThemes] the way the item is.
  final List<NounClass>? prop;

  /// The themes the prop may come from, when the classes are too wide.
  final List<WordTheme>? propThemes;

  /// What is true of the hero before the first sentence.
  final List<Condition> start;

  /// The steps, in order.
  final List<StoryStep> steps;

  /// How often this story is told, against the others the hero could be in.
  final int weight;
}

/// The stories, written once for every language.
///
/// A story's required steps alone have to satisfy their own needs, so that a
/// telling cut down to them still holds together; the suite walks each of them
/// to check.
const List<Story> stories = <Story>[
  Story(
    name: SentenceStory.errand,
    hero: agentClasses,
    item: <NounClass>[NounClass.edible],
    // Something else on the stall, looked at and left there.
    prop: <NounClass>[NounClass.edible],
    start: <Condition>[Condition.awake, Condition.hungry, Condition.home],
    weight: 20,
    steps: <StoryStep>[
      StoryStep(StepKind.state, condition: Condition.hungry),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.place,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.look],
        object: StoryRole.prop,
        place: true,
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.look],
        object: StoryRole.item,
        place: true,
      ),
      // Somebody at the market, doing what people at a market do.
      StoryStep(
        StepKind.other,
        actorClasses: <NounClass>[NounClass.person],
        fields: <VerbField>[VerbField.talk, VerbField.express, VerbField.wait, VerbField.move],
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.buy, VerbField.take, VerbField.find],
        object: StoryRole.item,
        place: true,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.cook], object: StoryRole.item),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.eat, VerbField.drink],
        object: StoryRole.item,
        required: true,
        link: ConnectiveKind.causal,
      ),
      StoryStep(StepKind.state, condition: Condition.full, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express, VerbField.think, VerbField.rest],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing, SentenceType.exclamation],
      ),
    ],
  ),
  Story(
    name: SentenceStory.meal,
    hero: agentClasses,
    item: <NounClass>[NounClass.edible],
    start: <Condition>[Condition.awake, Condition.hungry, Condition.home],
    weight: 14,
    steps: <StoryStep>[
      StoryStep(StepKind.state, condition: Condition.hungry, required: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.take, VerbField.find],
        object: StoryRole.item,
        required: true,
        link: ConnectiveKind.causal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.cook], object: StoryRole.item),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.look], object: StoryRole.item),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.eat, VerbField.drink],
        object: StoryRole.item,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.state, condition: Condition.full, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express],
        kinds: <SentenceType>[SentenceType.exclamation],
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.think, VerbField.play],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  Story(
    name: SentenceStory.search,
    hero: agentClasses,
    item: <NounClass>[NounClass.thing, NounClass.plant],
    itemThemes: <WordTheme>[
      WordTheme.object,
      WordTheme.tool,
      WordTheme.clothing,
      WordTheme.gem,
      WordTheme.plant,
    ],
    start: <Condition>[Condition.awake, Condition.restless, Condition.home],
    // What the search turns up first, which is not what it was for.
    prop: <NounClass>[NounClass.thing],
    propThemes: <WordTheme>[WordTheme.object, WordTheme.clothing],
    weight: 16,
    steps: <StoryStep>[
      StoryStep(StepKind.state, condition: Condition.restless),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.search], place: true, required: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.look],
        object: StoryRole.prop,
        place: true,
        link: ConnectiveKind.additive,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait], place: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.elsewhere,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.find],
        object: StoryRole.item,
        place: true,
        required: true,
        kinds: <SentenceType>[SentenceType.exclamation],
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.carry, VerbField.take],
        object: StoryRole.item,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.hide], object: StoryRole.item),
      StoryStep(StepKind.state, condition: Condition.content, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.think, VerbField.express],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing, SentenceType.exclamation],
      ),
    ],
  ),
  Story(
    name: SentenceStory.outing,
    hero: agentClasses,
    item: <NounClass>[NounClass.plant, NounClass.thing],
    start: <Condition>[Condition.asleep, Condition.rested, Condition.home],
    weight: 18,
    steps: <StoryStep>[
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.rise], required: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.place,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.move, VerbField.play],
        place: true,
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.look],
        object: StoryRole.item,
        place: true,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait], place: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.elsewhere,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.scene,
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.state, condition: Condition.tired, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.rest, VerbField.sleep, VerbField.express],
        link: ConnectiveKind.causal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  Story(
    name: SentenceStory.craft,
    hero: <NounClass>[NounClass.person],
    item: <NounClass>[NounClass.thing],
    itemThemes: <WordTheme>[
      WordTheme.object,
      WordTheme.tool,
      WordTheme.clothing,
      WordTheme.product,
      WordTheme.gem,
    ],
    // The tool in hand before the making.
    prop: <NounClass>[NounClass.thing],
    propThemes: <WordTheme>[WordTheme.tool],
    start: <Condition>[Condition.awake, Condition.rested, Condition.home],
    weight: 12,
    steps: <StoryStep>[
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.go], destination: StoryRole.place),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.take],
        object: StoryRole.prop,
        place: true,
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.make],
        object: StoryRole.item,
        place: true,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.tend],
        object: StoryRole.item,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.look], object: StoryRole.item),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.sell, VerbField.carry],
        object: StoryRole.item,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.state, condition: Condition.content, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express, VerbField.think],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing, SentenceType.exclamation],
      ),
    ],
  ),
  Story(
    name: SentenceStory.stroll,
    hero: agentClasses,
    // Something seen on the way.
    prop: <NounClass>[NounClass.plant, NounClass.thing],
    propThemes: <WordTheme>[WordTheme.plant, WordTheme.object],
    start: <Condition>[Condition.awake, Condition.rested, Condition.home],
    weight: 12,
    steps: <StoryStep>[
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.place,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.move],
        place: true,
        required: true,
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.look],
        object: StoryRole.prop,
        place: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.elsewhere,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait, VerbField.express], place: true),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.play], place: true),
      StoryStep(
        StepKind.scene,
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.think]),
      StoryStep(StepKind.state, condition: Condition.tired, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.rest, VerbField.sleep, VerbField.think, VerbField.express],
        link: ConnectiveKind.causal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  Story(
    name: SentenceStory.evening,
    hero: agentClasses,
    item: <NounClass>[NounClass.edible],
    start: <Condition>[Condition.awake, Condition.away, Condition.holding],
    weight: 12,
    steps: <StoryStep>[
      StoryStep(StepKind.scene, fields: <VerbField>[VerbField.change], required: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        required: true,
        link: ConnectiveKind.causal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.eat, VerbField.drink],
        object: StoryRole.item,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.express]),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.think]),
      StoryStep(StepKind.state, condition: Condition.tired),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.sleep],
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.scene,
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  // A day at home: a person gets up, takes a thing out and sees to it.
  Story(
    name: SentenceStory.chores,
    hero: <NounClass>[NounClass.person],
    item: <NounClass>[NounClass.thing],
    itemThemes: <WordTheme>[WordTheme.object, WordTheme.tool, WordTheme.clothing],
    start: <Condition>[Condition.asleep, Condition.rested, Condition.home],
    weight: 12,
    steps: <StoryStep>[
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.rise], required: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.take],
        object: StoryRole.item,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.look], object: StoryRole.item),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.tend],
        object: StoryRole.item,
        required: true,
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.carry],
        object: StoryRole.item,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.state, condition: Condition.content, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express, VerbField.think],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing, SentenceType.exclamation],
      ),
    ],
  ),
  // The hero carries something somewhere and hides it there.
  Story(
    name: SentenceStory.stash,
    hero: agentClasses,
    item: <NounClass>[NounClass.edible, NounClass.thing],
    start: <Condition>[Condition.awake, Condition.rested, Condition.home, Condition.holding],
    weight: 12,
    steps: <StoryStep>[
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.carry],
        object: StoryRole.item,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.place,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.look],
        object: StoryRole.item,
        place: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.hide],
        object: StoryRole.item,
        place: true,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait], place: true),
      StoryStep(
        StepKind.scene,
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.think], link: ConnectiveKind.additive),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.state,
        condition: Condition.content,
        link: ConnectiveKind.causal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  // Nothing happens: the hero is at a loose end, and plays.
  Story(
    name: SentenceStory.idle,
    hero: agentClasses,
    // Something in the room.
    prop: <NounClass>[NounClass.thing],
    propThemes: <WordTheme>[WordTheme.object, WordTheme.music],
    start: <Condition>[Condition.awake, Condition.rested, Condition.home],
    weight: 10,
    steps: <StoryStep>[
      StoryStep(StepKind.state, condition: Condition.restless),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait], required: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.look],
        object: StoryRole.prop,
        link: ConnectiveKind.additive,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.think], link: ConnectiveKind.additive),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.play],
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express],
        link: ConnectiveKind.causal,
        kinds: <SentenceType>[SentenceType.exclamation],
      ),
      StoryStep(StepKind.state, condition: Condition.content, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.rest, VerbField.think],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  // The place wakes before the hero does, and the day begins.
  Story(
    name: SentenceStory.waking,
    hero: agentClasses,
    start: <Condition>[Condition.asleep, Condition.rested, Condition.home],
    weight: 10,
    steps: <StoryStep>[
      StoryStep(StepKind.scene, fields: <VerbField>[VerbField.change], required: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.rise],
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express],
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.move, VerbField.play],
        link: ConnectiveKind.additive,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.think]),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait], link: ConnectiveKind.temporal),
      StoryStep(
        StepKind.scene,
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  // The hero eats out: gets something somewhere and eats it there.
  Story(
    name: SentenceStory.picnic,
    hero: agentClasses,
    item: <NounClass>[NounClass.edible],
    // Something else on the stall, looked at and left there.
    prop: <NounClass>[NounClass.edible],
    start: <Condition>[Condition.awake, Condition.hungry, Condition.home],
    weight: 12,
    steps: <StoryStep>[
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.place,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.look],
        object: StoryRole.prop,
        place: true,
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.buy, VerbField.take, VerbField.find],
        object: StoryRole.item,
        place: true,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.elsewhere,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.look], object: StoryRole.item),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.eat, VerbField.drink],
        object: StoryRole.item,
        place: true,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.state, condition: Condition.full, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express],
        link: ConnectiveKind.causal,
        kinds: <SentenceType>[SentenceType.exclamation],
      ),
      StoryStep(
        StepKind.scene,
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.think, VerbField.express],
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  // The hero loses what they carried, looks for it, and may or may not find it.
  Story(
    name: SentenceStory.mishap,
    hero: agentClasses,
    item: <NounClass>[NounClass.thing, NounClass.edible],
    itemThemes: <WordTheme>[
      WordTheme.object,
      WordTheme.tool,
      WordTheme.clothing,
      WordTheme.gem,
      WordTheme.food,
    ],
    start: <Condition>[Condition.awake, Condition.rested, Condition.home, Condition.holding],
    weight: 12,
    steps: <StoryStep>[
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.carry],
        object: StoryRole.item,
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.place,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.lose],
        object: StoryRole.item,
        place: true,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.state, condition: Condition.restless, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.search],
        place: true,
        required: true,
        link: ConnectiveKind.causal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait], place: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.find],
        object: StoryRole.item,
        place: true,
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.exclamation],
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express, VerbField.think, VerbField.rest],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing, SentenceType.exclamation],
      ),
    ],
  ),
  // The hero goes to see somebody, and they talk. The person met is the thing
  // this story is about.
  Story(
    name: SentenceStory.visit,
    hero: agentClasses,
    item: <NounClass>[NounClass.person],
    start: <Condition>[Condition.awake, Condition.rested, Condition.home],
    weight: 12,
    steps: <StoryStep>[
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.place,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.meet],
        object: StoryRole.item,
        place: true,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      // The person met, doing something of their own.
      StoryStep(
        StepKind.other,
        actor: StoryRole.item,
        fields: <VerbField>[VerbField.express, VerbField.talk, VerbField.wait],
        link: ConnectiveKind.additive,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.talk], link: ConnectiveKind.additive),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express],
        link: ConnectiveKind.causal,
        kinds: <SentenceType>[SentenceType.exclamation],
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait], place: true),
      StoryStep(StepKind.state, condition: Condition.content, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.think, VerbField.express],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  // Two people talk. The hero goes out, meets somebody, and what the two of them
  // say to each other is most of the story — it is the one that allows the most
  // lines, and the person met is the one who answers them.
  Story(
    name: SentenceStory.chat,
    hero: <NounClass>[NounClass.person],
    item: <NounClass>[NounClass.person],
    // Something at the place, looked at while they talk.
    prop: <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
    propThemes: <WordTheme>[WordTheme.object, WordTheme.plant, WordTheme.food, WordTheme.drink],
    lines: 5,
    start: <Condition>[Condition.awake, Condition.rested, Condition.home],
    weight: 14,
    steps: <StoryStep>[
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.place,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.meet],
        object: StoryRole.item,
        place: true,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.other,
        actor: StoryRole.item,
        fields: <VerbField>[VerbField.express, VerbField.talk],
        link: ConnectiveKind.additive,
      ),
      StoryStep(StepKind.state, condition: Condition.content, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.talk],
        required: true,
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.look],
        object: StoryRole.prop,
        place: true,
      ),
      StoryStep(
        StepKind.other,
        actor: StoryRole.item,
        fields: <VerbField>[VerbField.express, VerbField.talk, VerbField.wait, VerbField.move],
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express],
        link: ConnectiveKind.causal,
        kinds: <SentenceType>[SentenceType.exclamation],
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.talk], link: ConnectiveKind.temporal),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait], place: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.think, VerbField.express],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  // The hero goes out, sits down somewhere, and watches: what turns up, what the
  // light does. The hero does little, and that is the point of it.
  Story(
    name: SentenceStory.watch,
    hero: agentClasses,
    // Something seen from where they sit.
    prop: <NounClass>[NounClass.plant, NounClass.thing],
    propThemes: <WordTheme>[WordTheme.plant, WordTheme.object],
    start: <Condition>[Condition.awake, Condition.rested, Condition.home],
    weight: 14,
    steps: <StoryStep>[
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.place,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.rest],
        place: true,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.other,
        actorClasses: <NounClass>[NounClass.creature],
        actorThemes: <WordTheme>[WordTheme.animal],
        fields: <VerbField>[
          VerbField.move,
          VerbField.play,
          VerbField.wait,
          VerbField.express,
          VerbField.rest,
        ],
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.look],
        object: StoryRole.prop,
        place: true,
      ),
      StoryStep(
        StepKind.scene,
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.other,
        actorClasses: <NounClass>[NounClass.person],
        fields: <VerbField>[
          VerbField.move,
          VerbField.talk,
          VerbField.express,
          VerbField.wait,
          VerbField.play,
        ],
        link: ConnectiveKind.additive,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.think], link: ConnectiveKind.additive),
      StoryStep(StepKind.state, condition: Condition.rested, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.scene,
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.express, VerbField.think, VerbField.sleep],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  // The weather turns while the hero is out. They wait it out, and go on once it
  // has passed.
  Story(
    name: SentenceStory.shelter,
    hero: agentClasses,
    start: <Condition>[Condition.awake, Condition.rested, Condition.home],
    weight: 12,
    steps: <StoryStep>[
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.go],
        destination: StoryRole.place,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.move, VerbField.play, VerbField.wait],
        place: true,
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.other,
        actorClasses: <NounClass>[NounClass.event],
        actorThemes: <WordTheme>[WordTheme.weather],
        fields: <VerbField>[VerbField.change],
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.wait],
        place: true,
        required: true,
        link: ConnectiveKind.causal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.think, VerbField.express],
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.other,
        actorClasses: <NounClass>[NounClass.event],
        actorThemes: <WordTheme>[WordTheme.weather],
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.scene,
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.move, VerbField.play],
        place: true,
        link: ConnectiveKind.causal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.rest, VerbField.express, VerbField.think],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  // Nothing happens to anybody. A place is described, and the things in it do
  // what they do — the wind, the leaves, a bird, the evening. The hero is the
  // place.
  Story(
    name: SentenceStory.sketch,
    hero: <NounClass>[NounClass.place],
    heroThemes: <WordTheme>[WordTheme.place, WordTheme.nature],
    start: <Condition>[],
    weight: 16,
    steps: <StoryStep>[
      StoryStep(StepKind.state, required: true),
      StoryStep(
        StepKind.other,
        actorClasses: <NounClass>[NounClass.event],
        actorThemes: <WordTheme>[WordTheme.weather],
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.other,
        actorClasses: <NounClass>[NounClass.creature],
        actorThemes: <WordTheme>[WordTheme.animal],
        fields: <VerbField>[
          VerbField.move,
          VerbField.rest,
          VerbField.express,
          VerbField.wait,
          VerbField.play,
          VerbField.sleep,
        ],
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.change],
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.other,
        actorClasses: <NounClass>[NounClass.plant],
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.additive,
      ),
      StoryStep(
        StepKind.other,
        actorClasses: <NounClass>[NounClass.event],
        actorThemes: <WordTheme>[WordTheme.time],
        fields: <VerbField>[VerbField.change],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.other,
        actorClasses: <NounClass>[NounClass.creature, NounClass.person],
        actorThemes: <WordTheme>[WordTheme.animal, WordTheme.job, WordTheme.person],
        fields: <VerbField>[
          VerbField.move,
          VerbField.rest,
          VerbField.wait,
          VerbField.sleep,
          VerbField.express,
        ],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.change], link: ConnectiveKind.temporal),
      StoryStep(
        StepKind.state,
        link: ConnectiveKind.causal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  Story(
    name: SentenceStory.passage,
    hero: <NounClass>[
      NounClass.plant,
      NounClass.edible,
      NounClass.thing,
      NounClass.vehicle,
      NounClass.place,
      NounClass.event,
      NounClass.idea,
      NounClass.body,
    ],
    start: <Condition>[],
    weight: 10,
    steps: <StoryStep>[
      StoryStep(StepKind.state),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.change, VerbField.move],
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.change, VerbField.move],
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.change, VerbField.move],
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.state,
        link: ConnectiveKind.causal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
];

/// What a telling may put between the steps of its story when it is asked for
/// more sentences than the story has.
const List<StoryStep> interludes = <StoryStep>[
  StoryStep(StepKind.state, link: ConnectiveKind.causal),
  StoryStep(
    StepKind.act,
    fields: <VerbField>[VerbField.express, VerbField.wait, VerbField.think],
    link: ConnectiveKind.additive,
  ),
  StoryStep(
    StepKind.act,
    fields: <VerbField>[VerbField.look],
    object: StoryRole.item,
    needs: <Condition>[Condition.holding],
  ),
  // Out of the house, the hero may move about where they are, and the place may
  // do something of its own. At home neither: a scene is the place the story is
  // happening in, and a home story has none.
  StoryStep(
    StepKind.act,
    fields: <VerbField>[VerbField.move, VerbField.play],
    place: true,
    needs: <Condition>[Condition.away],
    link: ConnectiveKind.additive,
  ),
  StoryStep(
    StepKind.scene,
    fields: <VerbField>[VerbField.change],
    needs: <Condition>[Condition.away],
    link: ConnectiveKind.temporal,
  ),
  // And somebody else is about: a passer-by, a bird on a fence.
  StoryStep(
    StepKind.other,
    actorClasses: <NounClass>[NounClass.creature, NounClass.person],
    actorThemes: <WordTheme>[WordTheme.animal, WordTheme.job, WordTheme.person],
    fields: <VerbField>[
      VerbField.move,
      VerbField.express,
      VerbField.wait,
      VerbField.talk,
      VerbField.play,
    ],
    needs: <Condition>[Condition.away],
    link: ConnectiveKind.additive,
  ),
];

/// The sentence dataset for each language the word pools cover.
final Map<WordLanguage, SentenceLanguageData> sentenceData = <WordLanguage, SentenceLanguageData>{
  WordLanguage.en: en,
  WordLanguage.ko: ko,
  WordLanguage.ja: ja,
  WordLanguage.zh: zh,
  WordLanguage.vi: vi,
  WordLanguage.es: es,
  WordLanguage.it: it,
  WordLanguage.de: de,
  WordLanguage.ru: ru,
};
