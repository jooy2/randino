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

// How often a state sentence about a person becomes a line of their own, and
// how many of them one telling may have. A paragraph that speaks in every other
// line is a script, not a story.
const int _voiceChance = 40;
const int _voiceMax = 2;

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
    required this.voiced,
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

  /// Whether the hero says this one themselves: a state sentence quoted in the
  /// first person — `“배고프다.”` — rather than narrated. Only a person's, only
  /// after the first sentence, and only where the language can write it.
  final bool voiced;

  /// The same beat, written as a whole sentence rather than as a clause.
  Beat unjoined() => Beat(
    step: step,
    field: field,
    condition: condition,
    before: before,
    links: links,
    kinds: kinds,
    join: null,
    voiced: voiced,
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

  if (field != null && step.kind != StepKind.scene) {
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
  const _Walked(this.step, this.field, this.condition, this.before, this.given);

  final StoryStep step;
  final VerbField? field;
  final Condition? condition;
  final Set<Condition> before;

  /// What the story itself had made true by then.
  final Set<Condition> given;
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
) {
  var memory = _Memory(<Condition>{...story.start}, <Condition>{}, <Condition>{});
  final walked = <_Walked>[];

  for (final step in steps) {
    final one = _settle(data, step, hero, item, prop, memory);

    if (one == null) return null;

    walked.add(_Walked(step, one.field, one.condition, memory.state, memory.given));
    memory = _after(memory, step, one);
  }

  return walked;
}

/// Whether the language can tell this story about this hero at all.
bool tellable(SentenceLanguageData data, Story story, NounClass hero, WordTheme? item) =>
    _walk(
      data,
      story,
      story.steps.where((step) => step.required).toList(growable: false),
      hero,
      item,
      // A prop is never in a required step, so none is needed to tell the story.
      null,
    ) !=
    null;

/// The themes the story's item may come from, for this hero: every theme of the
/// classes the story names that the language can tell the whole story with.
List<WordTheme> itemThemesFor(SentenceLanguageData data, Story story, NounClass hero) {
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
}

/// The themes the story's prop may come from, for this hero: every theme of the
/// classes the story names that some verb of every prop step takes. Empty for a
/// story with no prop, and for a language that cannot write one of its steps.
List<WordTheme> propThemesFor(SentenceLanguageData data, Story story, NounClass hero) {
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
}

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
  bool joinable,
) {
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
    final optional = story.steps
        .where((step) => !step.required && (again || !chosen.contains(step)))
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

  // A person says some of what is true of them in their own words: a state
  // sentence after the first, in a language that writes the first person, is
  // now and then a line the story quotes rather than narrates.
  var voiced = 0;
  final beats = <Beat>[];

  for (var i = 0; i < walked!.length; i += 1) {
    final one = walked![i];
    final voice =
        hero == NounClass.person &&
        data.speech != null &&
        i > 0 &&
        one.step.kind == StepKind.state &&
        one.condition != null &&
        voiced < _voiceMax &&
        chance(_voiceChance);

    if (voice) voiced += 1;

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
        voiced: voice,
      ),
    );
  }

  return Plan(story, beats, prop);
}

/// One story out of several, by weight.
Story pickStory(List<Story> stories) => pickWeighted<Story>(stories, (story) => story.weight);
