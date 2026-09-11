// How a result of several sentences decides what happens in each of them.
// Internal — `sentence_generator.dart` asks this module for a plan and writes
// the sentences itself.
//
// A story here is a list of steps in an order a reader would accept, shared by
// every language (`data/index.dart`). What this module does is turn one of them
// into exactly as many sentences as the caller asked for: it keeps the steps
// every telling has, adds the optional ones as room allows, fills what is left
// with interludes, and decides which two neighbouring actions are written as one
// sentence. All of it against a small memory of what is true of the hero — what
// `fieldRules` says each action needs and leaves behind — so that nobody eats
// what nobody picked up, and a "so" is written only where the story gave the
// sentence a reason.

import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/sentence/data/index.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';

// The most joins one result makes, against its sentence count: a story told in
// nothing but short sentences reads as stage directions, and `집에 돌아와서
// 사과를 먹었다` is what makes it prose, but every sentence a two-clause one is as
// monotonous as none. How many a telling makes is drawn between none and this.
const double _joinShare = 0.5;

// Whether anybody speaks in a telling, drawn once per telling: narrated all the
// way through, a line or two, or a scene of speech with an answer or two in it.
// Per telling rather than per line, so that two results are not the same amount
// of talking twice.
enum _VoiceMode { none, some, scene }

const Map<_VoiceMode, int> _voiceModeWeight = <_VoiceMode, int>{
  _VoiceMode.none: 30,
  _VoiceMode.some: 45,
  _VoiceMode.scene: 25,
};

// How often a sentence that could be a line is one, per mode, and the most
// lines a telling may have beside the story's own allowance — a scene of speech
// gets `_sceneExtra` more, because a scene is where the talking is.
const Map<_VoiceMode, int> _voiceChance = <_VoiceMode, int>{
  _VoiceMode.none: 0,
  _VoiceMode.some: 40,
  _VoiceMode.scene: 75,
};
const int _voiceMax = 2;
const int _sceneExtra = 2;

// How often a line is answered, per mode. An answer takes the place of an
// optional step, which is what keeps the count exact. In a scene of speech the
// hero may go on after being answered, which is how an exchange gets to be one.
const Map<_VoiceMode, int> _replyChance = <_VoiceMode, int>{
  _VoiceMode.none: 0,
  _VoiceMode.some: 35,
  _VoiceMode.scene: 70,
};

// How often a hero with somebody beside them turns to that person and asks how
// they are, where the step could be a line of their own instead.
const int _askChance = 40;

// The fields a person may report in their own words — `“열쇠를 찾았어!”`, `“I
// went to the market.”` — as against the ones nobody says aloud. Told in the
// past whatever tense the story is in.
const List<VerbField> _lineFields = <VerbField>[
  VerbField.go,
  VerbField.arrive,
  VerbField.wait,
  VerbField.rest,
  VerbField.search,
  VerbField.find,
  VerbField.take,
  VerbField.carry,
  VerbField.hide,
  VerbField.make,
  VerbField.tend,
  VerbField.sell,
  VerbField.buy,
  VerbField.cook,
  VerbField.eat,
  VerbField.drink,
  VerbField.lose,
  VerbField.meet,
  VerbField.play,
  VerbField.move,
];

// The fields a person may answer with a remark about the thing instead of
// doing: looking at it, or talking, which is about the place.
const List<VerbField> _commentFields = <VerbField>[VerbField.look, VerbField.talk];

// What is true of the hero that somebody would ask after: whether they are
// hungry, tired, restless, and the rest of it. The conditions that are about
// where the hero is or what they hold are nobody's question.
const List<Condition> _askable = <Condition>[
  Condition.hungry,
  Condition.full,
  Condition.tired,
  Condition.rested,
  Condition.content,
  Condition.restless,
];

// The conditions somebody answers with concern rather than with cheer.
const List<Condition> _low = <Condition>[Condition.hungry, Condition.tired, Condition.restless];

// The fields a step may be told twice in one story. Going, arriving, rising,
// sleeping and getting hold of the thing happen once.
const List<VerbField> _repeatableFields = <VerbField>[
  VerbField.express,
  VerbField.think,
  VerbField.wait,
  VerbField.look,
  VerbField.play,
  VerbField.move,
  VerbField.talk,
  VerbField.search,
  VerbField.tend,
  VerbField.change,
];

/// How a sentence of a story is spoken, when it is.
enum Voice {
  /// The hero says it themselves, in the first person: `“배고프다.”`, `“열쇠를
  /// 찾았어요!”`. Two beats the plan joined are one line when both are things
  /// the hero could report.
  line,

  /// The hero says something about the thing in front of them or the place
  /// around them, in the third person, instead of the step's own action.
  comment,

  /// The hero says what somebody else is doing — `“새가 날아가네!”` — which is
  /// the `other` step told in their voice.
  notice,

  /// The hero asks the person beside them how they are — `“배고파?”`, `“Are you
  /// tired?”` — in the second person. Always answered.
  ask,

  /// Somebody answers the line before, which is not a step of the story at all.
  reply,
}

/// Whether a beat is the first or the second clause of one sentence.
enum JoinSide {
  /// The first clause, which closes on nothing.
  first,

  /// The second clause, which opens on nothing and drops its subject.
  second,
}

/// One sentence of the plan: the step it tells, the field that was settled for
/// it, the condition a state sentence asserts, and how it relates to the
/// sentence in front of it.
class Beat {
  /// Creates a beat.
  const Beat({
    required this.step,
    required this.field,
    required this.condition,
    required this.before,
    required this.links,
    required this.kinds,
    required this.join,
    required this.voice,
    required this.asked,
    required this.cue,
    required this.answered,
  });

  /// The step this sentence tells.
  final StoryStep step;

  /// The field the sentence draws its verb from. Null for a state sentence.
  final VerbField? field;

  /// The condition a state sentence says, drawn from what is true just then.
  final Condition? condition;

  /// What was true of the hero before this sentence.
  final Set<Condition> before;

  /// The kinds of connective this sentence may open on.
  final List<ConnectiveKind> links;

  /// The kinds this sentence may be beside a statement.
  final List<SentenceType> kinds;

  /// Whether this beat is the first or the second clause of one sentence.
  final JoinSide? join;

  /// How this sentence is spoken, or null for one the story narrates. Never the
  /// first sentence, because a line needs a topic to speak. For a
  /// [Voice.reply], [step] is the line's, kept for bookkeeping.
  final Voice? voice;

  /// What is being asked about, for a [Voice.ask]. Null otherwise.
  final Condition? asked;

  /// What a [Voice.reply] answers, which decides which of the language's
  /// replies fit.
  final ReplyCue? cue;

  /// Whether the sentence after this line answers it, which makes it said aloud.
  final bool answered;

  /// The same beat, written as a whole sentence rather than as a clause.
  Beat unjoined() => Beat(
    step: step,
    field: field,
    condition: condition,
    before: before,
    links: links,
    kinds: kinds,
    join: null,
    voice: voice,
    asked: asked,
    cue: cue,
    answered: answered,
  );
}

/// A telling: the story and its beats, one per sentence or per clause.
class Plan {
  /// Creates a plan.
  const Plan(this.story, this.beats, this.prop);

  /// The story told.
  final Story story;

  /// Its sentences, in order.
  final List<Beat> beats;

  /// The theme the story's prop comes from, when it has one and the language
  /// can write it.
  final WordTheme? prop;
}

bool _has(Set<Condition> state, List<Condition> needs) => needs.every(state.contains);

/// Whether a verb group takes a noun of this theme as its object.
bool takesTheme(VerbGroup group, WordTheme theme) =>
    (group.object?.contains(themeClass[theme]) ?? false) &&
    (group.objectThemes == null || group.objectThemes!.contains(theme));

/// The verb groups of a field that can take this subject, and an object of this
/// theme.
///
/// The theme rather than its class, because a group may narrow its object to
/// themes — `drink` takes an edible, and not a pretzel.
List<VerbGroup> groupsOf(
  SentenceLanguageData data,
  VerbField field,
  NounClass subject,
  WordTheme? object,
  bool wantsObject,
) => data.verbs
    .where(
      (group) =>
          group.field == field &&
          group.subject.contains(subject) &&
          (group.object != null) == wantsObject &&
          (!wantsObject || object == null || takesTheme(group, object)) &&
          (group.requires == null ||
              data.frames.any((frame) => frame.parts.any((part) => part.slot == group.requires))),
    )
    .toList(growable: false);

/// The intransitive verb groups of a field that can take somebody else as their
/// subject: one of these classes, narrowed to these themes where the group
/// narrows itself. What a [StepKind.other] step draws from.
List<VerbGroup> groupsForActor(
  SentenceLanguageData data,
  VerbField field,
  List<NounClass> classes,
  List<WordTheme>? themes,
) => data.verbs
    .where(
      (group) =>
          group.field == field &&
          group.object == null &&
          group.subject.any(classes.contains) &&
          (themes == null ||
              group.subjectThemes == null ||
              themes.any(group.subjectThemes!.contains)) &&
          (group.requires == null ||
              data.frames.any((frame) => frame.parts.any((part) => part.slot == group.requires))),
    )
    .toList(growable: false);

/// The classes a [StepKind.other] step's actor may belong to: the item's, or
/// the ones listed.
List<NounClass> actorClassesOf(StoryStep step, WordTheme? item) {
  if (step.actor == StoryRole.item) {
    return item == null ? const <NounClass>[] : <NounClass>[themeClass[item]!];
  }

  return step.actorClasses ?? const <NounClass>[];
}

/// The themes it may come from, or null for any of its classes.
List<WordTheme>? actorThemesOf(StoryStep step, WordTheme? item) {
  if (step.actor == StoryRole.item) return item == null ? null : <WordTheme>[item];

  return step.actorThemes;
}

/// The state groups that can describe this subject, and say this condition.
List<StateGroup> statesOf(SentenceLanguageData data, NounClass subject, Condition? condition) =>
    data.states
        .where(
          (group) =>
              group.subject.contains(subject) &&
              (condition == null ? group.condition == null : group.condition == condition),
        )
        .toList(growable: false);

/// The fields of an action step the language can write for this hero, whose
/// needs the hero meets just now. The step's own order is kept.
List<VerbField> _fieldsFor(
  SentenceLanguageData data,
  StoryStep step,
  NounClass hero,
  WordTheme? item,
  WordTheme? prop,
  Set<Condition> state,
) {
  final subject = step.kind == StepKind.scene ? NounClass.place : hero;

  // A prop step with no prop to write is not a step: the sentence would draw
  // anything at all into the object slot.
  if (!_has(state, step.needs) || (step.object == StoryRole.prop && prop == null)) {
    return const <VerbField>[];
  }

  // Somebody else's doing needs nothing of the hero, only a verb that takes them.
  if (step.kind == StepKind.other) {
    final classes = actorClassesOf(step, item);
    final themes = actorThemesOf(step, item);

    if (classes.isEmpty) return const <VerbField>[];

    return step.fields
        .where((field) => groupsForActor(data, field, classes, themes).isNotEmpty)
        .toList(growable: false);
  }

  final object = step.object == StoryRole.prop ? prop : item;

  return step.fields
      .where(
        (field) =>
            _has(state, fieldRules[field]!.needs) &&
            groupsOf(data, field, subject, object, step.object != null).isNotEmpty,
      )
      .toList(growable: false);
}

/// What a telling knows as it goes: what is true of the hero, which of it a step
/// of the story made true — as against what was simply true at the start — and
/// which conditions a sentence has already said.
class _Memory {
  const _Memory(this.state, this.given, this.said);

  final Set<Condition> state;
  final Set<Condition> given;
  final Set<Condition> said;
}

/// A settled step: the field and the condition, or the marker that says the
/// step cannot be told here.
class _Settled {
  const _Settled(this.field, this.condition);

  final VerbField? field;
  final Condition? condition;
}

// A state step drawn from what is true, when nothing true has a predicate.
const Object _untellable = Object();

/// The condition a state step says. A step that names one says that one; a step
/// that names none describes the hero as they are just now, with whichever of
/// the conditions the story itself brought about the language has a predicate
/// for — or, for a hero nothing is ever true of, a plain trait. Never one the
/// telling has already said.
Object? _conditionFor(SentenceLanguageData data, StoryStep step, NounClass hero, _Memory memory) {
  final named = step.condition;

  if (named != null) {
    return statesOf(data, hero, named).isNotEmpty && !memory.said.contains(named)
        ? named
        : _untellable;
  }

  final current = memory.state
      .where(
        (condition) =>
            memory.given.contains(condition) &&
            !memory.said.contains(condition) &&
            statesOf(data, hero, condition).isNotEmpty,
      )
      .toList(growable: false);

  if (current.isNotEmpty) return pick(current);

  // A hero who acts is described by how they are, never by a trait pulled out of
  // nowhere in the middle of what they are doing; a thing a story is about has
  // nothing else to be described by.
  return !agentClasses.contains(hero) && statesOf(data, hero, null).isNotEmpty ? null : _untellable;
}

_Settled? _settle(
  SentenceLanguageData data,
  StoryStep step,
  NounClass hero,
  WordTheme? item,
  WordTheme? prop,
  _Memory memory,
) {
  if (step.kind == StepKind.state) {
    if (!_has(memory.state, step.needs)) return null;

    final condition = _conditionFor(data, step, hero, memory);

    if (identical(condition, _untellable)) return null;

    return _Settled(null, condition as Condition?);
  }

  final fields = _fieldsFor(data, step, hero, item, prop, memory.state);

  return fields.isEmpty ? null : _Settled(fields.first, null);
}

/// What the telling knows after a settled step.
_Memory _after(_Memory memory, StoryStep step, _Settled settled) {
  final state = <Condition>{...memory.state};
  final given = <Condition>{...memory.given};
  final said = <Condition>{...memory.said};
  final field = settled.field;

  // What the place or somebody else does changes nothing of the hero.
  if (field != null && step.kind != StepKind.scene && step.kind != StepKind.other) {
    final rule = fieldRules[field]!;

    state.removeAll(rule.takes);

    for (final condition in rule.gives) {
      state.add(condition);
      given.add(condition);
      state.remove(opposites[condition]);
    }
  }

  final condition = settled.condition;

  if (condition != null) {
    state.add(condition);
    given.add(condition);
    said.add(condition);
    state.remove(opposites[condition]);
  }

  return _Memory(state, given, said);
}

class _Walked {
  const _Walked(this.step, this.field, this.condition, this.before, this.given, this.memory);

  final StoryStep step;
  final VerbField? field;
  final Condition? condition;
  final Set<Condition> before;

  /// What the story itself had made true by then.
  final Set<Condition> given;

  /// Everything the telling knew before this step, for walking on from here.
  final _Memory memory;
}

/// Walk a sequence of steps from the story's start, settling each against the
/// state the ones before it left. Null when a step cannot be told where it
/// stands, which is what rejects an optional step that would take away what a
/// later required one needs.
List<_Walked>? _walk(
  SentenceLanguageData data,
  Story story,
  List<StoryStep> steps,
  NounClass hero,
  WordTheme? item,
  WordTheme? prop,
) => _walkFrom(
  data,
  steps,
  hero,
  item,
  prop,
  _Memory(<Condition>{...story.start}, <Condition>{}, <Condition>{}),
);

/// The same, from what a telling knew at some point rather than from the start.
List<_Walked>? _walkFrom(
  SentenceLanguageData data,
  List<StoryStep> steps,
  NounClass hero,
  WordTheme? item,
  WordTheme? prop,
  _Memory start,
) {
  var memory = start;
  final walked = <_Walked>[];

  for (final step in steps) {
    final one = _settle(data, step, hero, item, prop, memory);

    if (one == null) return null;

    walked.add(_Walked(step, one.field, one.condition, memory.state, memory.given, memory));
    memory = _after(memory, step, one);
  }

  return walked;
}

/// Whether a step can happen a second time in one telling.
bool _repeatable(StoryStep step) =>
    step.destination == null &&
    (step.kind != StepKind.act || step.fields.every(_repeatableFields.contains));

/// What each of the three questions below already answered, per language.
///
/// All three are decided by the language's own verbs and the story's own steps,
/// so none of them changes between one telling and the next — and every telling
/// asks them again, [itemThemesFor] once per theme of the item's classes.
/// Walking a story's required steps twenty-nine times over was a quarter of what
/// a paragraph took.
///
/// A telling is random and this is not: `_settle` picks which condition a state
/// step says, but whether the step can be settled at all is the language's
/// business, and that is the only half [tellable] reads.
final Expando<Map<String, Object>> _answerCache = Expando<Map<String, Object>>('storyAnswers');

T _remembered<T extends Object>(SentenceLanguageData data, String key, T Function() answer) {
  final byKey = _answerCache[data] ??= <String, Object>{};
  final cached = byKey[key];

  if (cached != null) return cached as T;

  final value = answer();

  byKey[key] = value;

  return value;
}

/// Whether the language can tell this story about this hero at all.
bool tellable(SentenceLanguageData data, Story story, NounClass hero, WordTheme? item) =>
    _remembered(
      data,
      'tellable:${story.name.name}:${hero.name}:${item?.name ?? '-'}',
      () =>
          _walk(
            data,
            story,
            story.steps.where((step) => step.required).toList(growable: false),
            hero,
            item,
            // A prop is never in a required step, so none is needed to tell it.
            null,
          ) !=
          null,
    );

/// The themes the story's item may come from, for this hero: every theme of the
/// classes the story names that the language can tell the whole story with.
List<WordTheme> itemThemesFor(SentenceLanguageData data, Story story, NounClass hero) =>
    _remembered(data, 'item:${story.name.name}:${hero.name}', () {
      final item = story.item;

      if (item == null) return const <WordTheme>[];

      return themeClass.keys
          .where(
            (theme) =>
                item.contains(themeClass[theme]) &&
                (story.itemThemes == null || story.itemThemes!.contains(theme)) &&
                tellable(data, story, hero, theme),
          )
          .toList(growable: false);
    });

/// The themes the story's prop may come from, for this hero: every theme of the
/// classes the story names that some verb of every prop step takes. Empty for a
/// story with no prop, and for a language that cannot write one of its steps.
List<WordTheme> propThemesFor(
  SentenceLanguageData data,
  Story story,
  NounClass hero,
) => _remembered(data, 'prop:${story.name.name}:${hero.name}', () {
  final prop = story.prop;
  final steps = story.steps.where((step) => step.object == StoryRole.prop).toList(growable: false);

  if (prop == null || steps.isEmpty) return const <WordTheme>[];

  return themeClass.keys
      .where(
        (theme) =>
            prop.contains(themeClass[theme]) &&
            (story.propThemes?.contains(theme) ?? true) &&
            steps.every(
              (step) =>
                  step.fields.any((field) => groupsOf(data, field, hero, theme, true).isNotEmpty),
            ),
      )
      .toList(growable: false);
});

/// The classes of [heroes] this story can be told about in this language.
List<NounClass> heroClassesFor(SentenceLanguageData data, Story story, List<NounClass> heroes) =>
    story.hero
        .where(
          (hero) =>
              heroes.contains(hero) &&
              (story.item != null
                  ? itemThemesFor(data, story, hero).isNotEmpty
                  : tellable(data, story, hero, null)),
        )
        .toList(growable: false);

/// The stories a result may follow: the ones about a hero of one of these
/// classes that the language can tell all the way through, narrowed to the one
/// the caller named when they named one that qualifies.
List<Story> storiesFor(SentenceLanguageData data, List<NounClass> heroes, SentenceStory? asked) {
  final able = stories
      .where(
        (story) =>
            story.hero.any(heroes.contains) && heroClassesFor(data, story, heroes).isNotEmpty,
      )
      .toList(growable: false);
  final named =
      asked == null ? able : able.where((story) => story.name == asked).toList(growable: false);

  return named.isNotEmpty ? named : able;
}

/// Whether a step is something the hero does, which is what two clauses share.
bool _isAction(StoryStep step) => step.kind == StepKind.act;

/// The connectives a sentence may open on, by what it claims. A causal one is
/// kept only where the story has given it a reason: what this sentence needs, or
/// what makes a hero do it, is true because an earlier sentence made it so, or
/// the sentence before it was the scene changing, which is a reason to go home.
/// Anything else is left to the quiet kinds, which any continuation can carry.
List<ConnectiveKind> _linksFor(_Walked? previous, _Walked current) {
  final asked = current.step.link;

  if (previous == null) return const <ConnectiveKind>[];

  if (asked == ConnectiveKind.causal) {
    final field = current.field;
    final rule = field == null ? null : fieldRules[field];
    final reasons =
        current.step.kind == StepKind.state
            ? <Condition>[if (current.condition != null) current.condition!]
            : <Condition>[...?rule?.needs, ...?rule?.after];
    final motivated = reasons.any(
      (condition) => current.before.contains(condition) && current.given.contains(condition),
    );
    // A state sentence is a consequence of what brought the condition about, and
    // a fresh condition is what the sentence before it left behind.
    final followed =
        current.step.kind == StepKind.state &&
        previous.field != null &&
        fieldRules[previous.field]!.gives.contains(current.condition);

    return motivated || followed || previous.step.kind == StepKind.scene
        ? const <ConnectiveKind>[ConnectiveKind.causal]
        : const <ConnectiveKind>[ConnectiveKind.additive, ConnectiveKind.temporal];
  }

  return asked == null
      ? const <ConnectiveKind>[ConnectiveKind.additive, ConnectiveKind.temporal]
      : <ConnectiveKind>[asked];
}

/// Plan a telling of [story] in exactly [count] sentences.
///
/// The required steps come first, then optional steps are added wherever the
/// state allows and a later step still holds, then interludes fill what is left.
/// Some neighbouring actions are then joined into one sentence, and the plan is
/// topped up again for each join, so the count comes out exact. A story that has
/// fewer required steps than the caller wants sentences is padded; one that has
/// more is cut where it stands.
Plan? plan(
  SentenceLanguageData data,
  Story story,
  NounClass hero,
  WordTheme? item,
  int count,
  bool joinable, [
  bool spoken = true,
]) {
  final required = story.steps.where((step) => step.required).toList(growable: false);
  // The prop is drawn once per telling, the way the item is drawn once per story.
  final props = propThemesFor(data, story, hero);
  final WordTheme? prop = props.isEmpty ? null : pick(props);
  var chosen = required.take(count).toList();
  var walked = _walk(data, story, chosen, hero, item, null);

  if (walked == null) return null;

  // Two clauses in one sentence need the room for two clauses. `joinable` is
  // the caller's range saying whether there is any.
  final canJoin = joinable && data.join != null;
  // How many two-clause sentences this telling aims for. Drawn once, so that a
  // paragraph is not all of one or all of the other.
  var joins = canJoin && count > 1 ? randInt(0, (count * _joinShare).floor()) : 0;

  // Add steps until the telling is one longer than its sentence count for every
  // join it will make — or until nothing more can be added, in which case the
  // joins give way. The story's own optional steps go first, each once; then the
  // interludes, each once; then any of them again.
  bool grow(bool again) {
    // A step goes in again only if it can happen twice: a hero who looks, waits
    // or laughs again is still in the story, and one who comes home again never
    // left.
    final optional = story.steps
        .where((step) => !step.required && (!chosen.contains(step) || (again && _repeatable(step))))
        .toList(growable: false);
    final own = <List<StoryStep> Function()>[];
    final filler = <List<StoryStep> Function()>[];

    for (final step in optional) {
      own.add(() {
        final at = story.steps.indexOf(step);
        final before = chosen.where((each) => story.steps.indexOf(each) < at).toList();
        final rest = chosen.where((each) => story.steps.indexOf(each) >= at).toList();

        return <StoryStep>[...before, step, ...rest];
      });
    }

    for (final step in interludes) {
      if ((step.object == StoryRole.item && story.item == null) ||
          (!again && chosen.contains(step))) {
        continue;
      }

      filler.add(() {
        final at = randInt(1, chosen.length);

        return <StoryStep>[...chosen.take(at), step, ...chosen.skip(at)];
      });
    }

    own.shuffle();
    filler.shuffle();

    for (final attempt in <List<StoryStep> Function()>[...own, ...filler]) {
      final candidate = attempt();
      final next = _walk(data, story, candidate, hero, item, prop);

      if (next != null) {
        chosen = candidate;
        walked = next;

        return true;
      }
    }

    return false;
  }

  while (chosen.length < count + joins) {
    if (!grow(false) && !grow(true)) {
      joins = chosen.length - count < 0 ? 0 : chosen.length - count;
      break;
    }
  }

  // A telling that cannot reach its count is not a telling of this story.
  if (chosen.length < count) return null;

  // Which neighbouring actions become one sentence. Every pair that could is a
  // candidate, and the draw decides, up to the number the telling paid for.
  final joined = <int>{};
  final pairs = <int>[
    for (var i = 0; i + 1 < walked!.length; i += 1)
      if (_isAction(walked![i].step) && _isAction(walked![i + 1].step)) i,
  ]..shuffle();

  for (final at in pairs) {
    if (joined.length >= joins) break;

    if (!joined.contains(at - 1) && !joined.contains(at + 1)) joined.add(at);
  }

  // A join that was paid for and not made leaves the telling one sentence long;
  // the steps that were only ever padding come off the end first. A step whose
  // removal breaks a later step's needs stays: `take` was optional, and `eat`
  // after it is not.
  while (walked!.length - joined.length > count) {
    List<_Walked>? trimmed;
    var at = -1;
    // The join a trimmed clause was one half of, given up with it: the other
    // clause is a sentence of its own then.
    var unjoined = -1;

    for (var i = walked!.length - 1; i >= 0 && trimmed == null; i -= 1) {
      if (walked![i].step.required || joined.contains(i) || joined.contains(i - 1)) continue;

      trimmed = _walk(
        data,
        story,
        <StoryStep>[...chosen.sublist(0, i), ...chosen.sublist(i + 1)],
        hero,
        item,
        prop,
      );
      at = i;
    }

    // Nothing stands alone: every optional step left is one clause of a
    // two-clause sentence, and a join is not worth a sentence the caller did
    // not ask for. One clause goes, and its join with it.
    for (var i = walked!.length - 1; i >= 0 && trimmed == null; i -= 1) {
      if (walked![i].step.required || !(joined.contains(i) || joined.contains(i - 1))) continue;

      trimmed = _walk(
        data,
        story,
        <StoryStep>[...chosen.sublist(0, i), ...chosen.sublist(i + 1)],
        hero,
        item,
        prop,
      );
      at = i;
      unjoined = joined.contains(i) ? i : i - 1;
    }

    if (trimmed == null) break;

    chosen.removeAt(at);
    walked = trimmed;

    if (unjoined >= 0) joined.remove(unjoined);

    final shifted = <int>{for (final each in joined) each > at ? each - 1 : each};

    joined
      ..clear()
      ..addAll(shifted);
  }

  final voices = _voicesFor(data, story, hero, item, prop, chosen, walked!, joined, spoken);
  final beats = <Beat>[];

  walked = voices.walked;

  for (var i = 0; i < walked!.length; i += 1) {
    final one = walked![i];

    beats.add(
      Beat(
        step: one.step,
        field: one.field,
        condition: one.condition,
        before: one.before,
        links: _linksFor(i > 0 ? walked![i - 1] : null, one),
        // A kind beside the statement is the step's own, and `trailing` is kept
        // for the sentence that closes the result.
        kinds: one.step.kinds
            .where((kind) => kind != SentenceType.trailing || i == walked!.length - 1)
            .toList(growable: false),
        join:
            joined.contains(i)
                ? JoinSide.first
                : joined.contains(i - 1)
                ? JoinSide.second
                : null,
        voice: voices.voice[i],
        asked: voices.asked[i],
        cue: voices.cue[i],
        answered: voices.answered[i],
      ),
    );
  }

  return Plan(story, beats, prop);
}

/// What a telling's voices came to: who speaks in each sentence, and what of.
class _Voices {
  const _Voices(this.voice, this.asked, this.cue, this.answered, this.walked);

  final List<Voice?> voice;
  final List<Condition?> asked;
  final List<ReplyCue?> cue;
  final List<bool> answered;
  final List<_Walked> walked;
}

/// Which sentences of a telling are spoken, and which of those are answered.
///
/// Only a person speaks, and only after the first sentence. What they can say is
/// what is true of them or what they just did (a field in `_lineFields`) — both
/// in the first person, where the language writes one — what they make of the
/// thing, the place or what somebody else is doing (a `look`, a `talk`, a scene
/// or an `other` step, said in the third person, which any language can write),
/// or, with somebody beside them, a question about how that somebody is. An
/// answer takes the place of the optional step after a line, where the story
/// can spare it and somebody is there to answer: the hero is out, or the story
/// is about a person. A question is only asked where it can be answered.
///
/// Whether anybody speaks at all is one draw per telling, so a paragraph is
/// narrated through, quotes a line or two, or is a scene of speech — where the
/// hero may go on after being answered, which is what an exchange is.
_Voices _voicesFor(
  SentenceLanguageData data,
  Story story,
  NounClass hero,
  WordTheme? item,
  WordTheme? prop,
  List<StoryStep> chosen,
  List<_Walked> walked,
  Set<int> joined,
  bool spoken,
) {
  final voice = List<Voice?>.filled(walked.length, null);
  final asked = List<Condition?>.filled(walked.length, null);
  final cue = List<ReplyCue?>.filled(walked.length, null);
  final answered = List<bool>.filled(walked.length, false);

  if (hero != NounClass.person || !spoken) {
    return _Voices(voice, asked, cue, answered, walked);
  }

  final mode = pickWeighted<_VoiceMode>(_VoiceMode.values, (each) => _voiceModeWeight[each]!);
  final most = (story.lines ?? _voiceMax) + (mode == _VoiceMode.scene ? _sceneExtra : 0);
  // Somebody to answer: the person the story is about, if it is about one.
  final company = story.item?.contains(NounClass.person) ?? false;
  // What the hero may ask that person: a condition the language can describe a
  // person as being in.
  final askable =
      data.listener == null
          ? const <Condition>[]
          : _askable
              .where(
                (condition) => data.states.any(
                  (group) =>
                      group.condition == condition && group.subject.contains(NounClass.person),
                ),
              )
              .toList(growable: false);
  var lines = 0;

  /// Whether this beat is a whole sentence: not one clause of a two-clause one.
  bool whole(int i) => !joined.contains(i) && !joined.contains(i - 1);

  /// Whether this beat is the hero coming home, which the language says whole.
  bool homecoming(_Walked one) =>
      one.field == VerbField.arrive && one.step.destination == StoryRole.home;

  /// Whether the hero could report this beat in their own words. Coming home
  /// is never reported — `집에 도달했습니다` is nothing anybody says — but said in
  /// the language's own words where it has them, first person or not.
  bool reportable(_Walked one) {
    final field = one.field;

    return data.speech != null &&
        one.step.kind == StepKind.act &&
        field != null &&
        _lineFields.contains(field) &&
        !homecoming(one);
  }

  bool sayable(_Walked one) =>
      data.homecomings != null && one.step.kind == StepKind.act && homecoming(one);

  /// Whether this beat and the one the plan joined it to are both things the
  /// hero could report, which makes the two of them one line.
  bool pair(int i) =>
      joined.contains(i) &&
      i + 1 < walked.length &&
      reportable(walked[i]) &&
      reportable(walked[i + 1]);

  /// The ways this beat could be spoken, if any.
  List<Voice> voicesOf(_Walked one) {
    final step = one.step;
    final field = one.field;
    final out = <Voice>[];

    if (step.kind == StepKind.state && one.condition != null) {
      if (data.speech != null) out.add(Voice.line);
      if (company && askable.isNotEmpty) out.add(Voice.ask);
    }

    if (step.kind == StepKind.act && field != null) {
      if (reportable(one) || sayable(one)) out.add(Voice.line);

      if (_commentFields.contains(field) && (field == VerbField.talk || step.object != null)) {
        out.add(Voice.comment);
      }

      if (field == VerbField.talk && company && askable.isNotEmpty) out.add(Voice.ask);
    }

    if (step.kind == StepKind.scene) out.add(Voice.comment);
    if (step.kind == StepKind.other) out.add(Voice.notice);

    return out;
  }

  /// What an answer to this line has to fit.
  ReplyCue cueFor(Voice kind, _Walked one) {
    if (kind == Voice.ask) return ReplyCue.answer;
    if (kind == Voice.comment || kind == Voice.notice) return ReplyCue.agree;

    final condition = one.condition;

    if (one.step.kind == StepKind.state) {
      return condition != null && _low.contains(condition)
          ? pick(const <ReplyCue>[ReplyCue.care, ReplyCue.care, ReplyCue.agree])
          : pick(const <ReplyCue>[ReplyCue.cheer, ReplyCue.agree]);
    }

    return one.field == VerbField.lose
        ? pick(const <ReplyCue>[ReplyCue.care, ReplyCue.wonder])
        : pick(const <ReplyCue>[ReplyCue.cheer, ReplyCue.wonder, ReplyCue.agree]);
  }

  /// Whether the beat at [next] can give way to an answer: the story can spare
  /// it, it is a whole sentence, and somebody is there to answer.
  bool answerable(int next, _Walked one) =>
      data.replies != null &&
      next < walked.length &&
      lines + 1 < most &&
      !walked[next].step.required &&
      whole(next) &&
      (one.before.contains(Condition.away) || company);

  var i = 1;

  while (i < walked.length && lines < most) {
    final one = walked[i];
    // Never two lines in a row from the same mouth: what follows a line is
    // prose, or somebody else's answer — and, in a scene of speech, the hero
    // again after that answer.
    final after = voice[i - 1];

    if (after != null && !(mode == _VoiceMode.scene && after == Voice.reply)) {
      i += 1;
      continue;
    }

    final twin = pair(i);

    if (!twin && !whole(i)) {
      i += 1;
      continue;
    }

    final options = twin ? const <Voice>[Voice.line] : voicesOf(one);

    if (options.isEmpty || !chance(_voiceChance[mode]!)) {
      i += 1;
      continue;
    }

    final others = options.where((each) => each != Voice.ask).toList(growable: false);
    final next = twin ? i + 2 : i + 1;
    Voice? kind =
        options.contains(Voice.ask) && chance(_askChance)
            ? Voice.ask
            : others.isNotEmpty
            ? pick(others)
            : null;
    List<_Walked>? rest;

    // A question has to be answered, so it is asked only where it can be; where
    // it cannot, the beat is spoken some other way, or narrated.
    if (kind == Voice.ask) {
      rest =
          answerable(next, one)
              ? _walkFrom(data, chosen.sublist(next + 1), hero, item, prop, walked[next].memory)
              : null;

      if (rest == null) kind = others.isNotEmpty ? pick(others) : null;
    }

    if (kind == null) {
      i += 1;
      continue;
    }

    // What the hero makes of the person beside them is thought rather than
    // said, and nobody answers a thought.
    // And nobody answers `다녀왔어` with `정말?`.
    final aside = (kind == Voice.notice && one.step.actor == StoryRole.item) || homecoming(one);

    if (kind != Voice.ask && !aside && answerable(next, one) && chance(_replyChance[mode]!)) {
      rest = _walkFrom(data, chosen.sublist(next + 1), hero, item, prop, walked[next].memory);
    }

    voice[i] = kind;
    asked[i] = kind == Voice.ask ? pick(askable) : null;

    if (twin) voice[i + 1] = kind;

    lines += 1;

    if (rest == null) {
      i += 1;
      continue;
    }

    // The line's step stands in for the answered one, so that `chosen` and
    // `walked` stay the same length and a later answer walks on from the right
    // place; nothing reads it back.
    chosen[next] = one.step;
    walked.replaceRange(next, walked.length, <_Walked>[
      _Walked(one.step, null, null, walked[next].before, walked[next].given, walked[next].memory),
      ...rest,
    ]);
    voice[next] = Voice.reply;
    cue[next] = cueFor(kind, one);
    answered[i] = true;
    lines += 1;
    i = next + 1;
  }

  return _Voices(voice, asked, cue, answered, walked);
}

/// One story out of several, by weight.
Story pickStory(List<Story> stories) => pickWeighted<Story>(stories, (story) => story.weight);
