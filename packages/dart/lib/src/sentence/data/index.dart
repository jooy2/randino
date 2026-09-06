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
  WordTheme.plant: NounClass.plant,
  WordTheme.food: NounClass.edible,
  WordTheme.drink: NounClass.edible,
  WordTheme.object: NounClass.thing,
  WordTheme.tool: NounClass.thing,
  WordTheme.clothing: NounClass.thing,
  WordTheme.product: NounClass.thing,
  WordTheme.gem: NounClass.thing,
  WordTheme.music: NounClass.thing,
  WordTheme.vehicle: NounClass.vehicle,
  WordTheme.place: NounClass.place,
  WordTheme.nature: NounClass.place,
  WordTheme.space: NounClass.place,
  WordTheme.weather: NounClass.event,
  WordTheme.sport: NounClass.event,
  WordTheme.time: NounClass.event,
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
  VerbField.eat: FieldRule(
    needs: <Condition>[Condition.awake, Condition.holding],
    gives: <Condition>[Condition.full],
    takes: <Condition>[Condition.hungry, Condition.holding],
    after: <Condition>[Condition.hungry],
  ),
  VerbField.drink: FieldRule(
    needs: <Condition>[Condition.awake, Condition.holding],
    gives: <Condition>[Condition.full],
    takes: <Condition>[Condition.hungry, Condition.holding],
    after: <Condition>[Condition.hungry],
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
}

/// What the story's nouns a step names: the thing, the place, or home.
enum StoryRole {
  /// The thing the story is about.
  item,

  /// Where it is all happening.
  place,

  /// Where the hero comes back to.
  home,
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
    this.object = false,
    this.place = false,
    this.destination,
    this.needs = const <Condition>[],
    this.required = false,
    this.link,
    this.kinds = const <SentenceType>[],
  });

  /// What kind of step this is.
  final StepKind kind;

  /// The fields an action may draw from, best first.
  final List<VerbField> fields;

  /// The condition a state step says. Null for a state drawn from what is true.
  final Condition? condition;

  /// Whether the story's item is written as the object.
  final bool object;

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
  });

  /// Which story this is.
  final SentenceStory name;

  /// Classes the hero may belong to.
  final List<NounClass> hero;

  /// Classes the thing the story is about may belong to, for a story with one.
  final List<NounClass>? item;

  /// The themes it may come from, when the classes are too wide.
  final List<WordTheme>? itemThemes;

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
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.look], object: true, place: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.buy, VerbField.take, VerbField.find],
        object: true,
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
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.cook], object: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.eat, VerbField.drink],
        object: true,
        required: true,
        link: ConnectiveKind.causal,
      ),
      StoryStep(StepKind.state, condition: Condition.full, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.rest, VerbField.sleep],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
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
        object: true,
        required: true,
        link: ConnectiveKind.causal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.cook], object: true),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.look], object: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.eat, VerbField.drink],
        object: true,
        required: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.state, condition: Condition.full, link: ConnectiveKind.causal),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.express]),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.rest, VerbField.sleep],
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
    weight: 16,
    steps: <StoryStep>[
      StoryStep(StepKind.state, condition: Condition.restless),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.search], place: true, required: true),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait], place: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.find],
        object: true,
        place: true,
        required: true,
        kinds: <SentenceType>[SentenceType.exclamation],
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.carry, VerbField.take],
        object: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.arrive],
        destination: StoryRole.home,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.hide], object: true),
      StoryStep(StepKind.state, condition: Condition.content, link: ConnectiveKind.causal),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.rest],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
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
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.look], object: true, place: true),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.wait], place: true),
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
        fields: <VerbField>[VerbField.rest, VerbField.sleep],
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
    start: <Condition>[Condition.awake, Condition.rested, Condition.home],
    weight: 12,
    steps: <StoryStep>[
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.go], destination: StoryRole.place),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.make],
        object: true,
        place: true,
        required: true,
      ),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.tend],
        object: true,
        link: ConnectiveKind.temporal,
      ),
      StoryStep(StepKind.act, fields: <VerbField>[VerbField.look], object: true),
      StoryStep(
        StepKind.act,
        fields: <VerbField>[VerbField.sell, VerbField.carry],
        object: true,
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
        fields: <VerbField>[VerbField.rest],
        link: ConnectiveKind.temporal,
        kinds: <SentenceType>[SentenceType.trailing],
      ),
    ],
  ),
  Story(
    name: SentenceStory.stroll,
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
        fields: <VerbField>[VerbField.move],
        place: true,
        required: true,
        link: ConnectiveKind.additive,
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
        fields: <VerbField>[VerbField.rest, VerbField.sleep],
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
        object: true,
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
    object: true,
    needs: <Condition>[Condition.holding],
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
