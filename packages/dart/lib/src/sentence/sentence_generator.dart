// The sentence generator itself. Internal — `randSentence` and
// `randSentenceDetails` are the public entry points.
//
// A sentence is a subject and something said about it: what it does (`사자가
// 달린다`), what it does it to (`여우가 사과를 먹는다`), or what it is like
// (`하늘은 파랗다`). The nouns are the `word` category's pools, the same ones a
// nickname is built from; everything a sentence needs beside them — a verb in
// the form a statement ends on, an adjective in the form a predicate takes, the
// adverbs, and the shapes the grammar allows — is `sentence/data`.
//
// Two things keep the result readable rather than a pile of words:
//
// - **The shapes belong to the language.** `data.frames` writes them out in the
//   language's own order, with the particle or preposition each phrase needs, so
//   Korean closes on its verb where English puts it second. A language whose
//   articles cannot mark an object simply declares no shape that has one.
// - **A verb states what it can take.** `VerbGroup` names the noun classes that
//   can be its subject and its object, and the nouns are drawn from those alone.
//   That is why `여우가 사과를 먹는다` comes out and `여우가 철학을 먹는다` does
//   not — no tag on any noun, because `themeClass` already knows what a theme
//   names.

import 'package:randino/src/constants.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/script.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/name/name_generator.dart';
import 'package:randino/src/name/name_length_range.dart';
import 'package:randino/src/sentence/data/index.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/sentence/story.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/data/types.dart';
import 'package:randino/src/word/word_generator.dart';

// How many sentences to build before settling for the closest fit found.
const int _fitAttempts = 14;

/// How many times a story is told before settling for the closest fit found.
///
/// A story is sentences drawn one after another against a range shared out
/// between them, and a run of short sentences leaves the last one a gap no shape
/// can fill. Telling the whole story again is what closes that.
const int _storyAttempts = 3;

// How often a noun phrase that may carry a modifier is given one. Length can
// override it in both directions — see [_modifyChanceFor].
const int _modifyChance = 45;

// A story's sentence carries a modifier a little more often than a lone one: its
// modifiers are chosen for the noun they describe, and a story told in bare
// nouns reads as a list of events rather than as prose.
const int _storyModifyChance = 55;

// How often a sentence that draws a fresh subject draws it from the topic's own
// theme rather than from anywhere in the topic's class.
const int _themeChance = 65;

// How many phases of the day one sentence may move on from the last one named.
const int _dayStride = 4;

/// The slots that are a noun phrase, and so draw from the word pools.
const List<SentenceSlot> _nounSlots = <SentenceSlot>[
  SentenceSlot.subject,
  SentenceSlot.object,
  SentenceSlot.place,
  SentenceSlot.destination,
  SentenceSlot.quantity,
];

/// The slots a story never writes: an amount, a count, a date and a clock.
const List<SentenceSlot> _unstoried = <SentenceSlot>[
  SentenceSlot.quantity,
  SentenceSlot.money,
  SentenceSlot.date,
  SentenceSlot.clock,
];

/// The fields an amount of money stands beside: what is found, taken, carried,
/// hidden and lost. An amount used to go with every verb whose object may be
/// an idea, which is how `remembers 5,000 dollars` came out.
const List<VerbField> _moneyFields = <VerbField>[
  VerbField.find,
  VerbField.take,
  VerbField.carry,
  VerbField.hide,
  VerbField.lose,
];

/// Whether a shape has anywhere a person's name could stand.
///
/// A counted shape makes its quantity the subject, and a copular one equates its
/// subject to a day — neither is a room for somebody.
bool _carriesPerson(SentenceFrame frame) =>
    _subjectSlotOf(frame) != SentenceSlot.quantity &&
    !frame.parts.any((part) => part.copula != null);

/// Which slot this shape's subject stands in.
///
/// Usually the subject, and the quantity for a shape that counts the thing the
/// sentence is about — `사과 12 개가 익는다` has no separate subject, and the
/// counted phrase is what the verb agrees with.
SentenceSlot _subjectSlotOf(SentenceFrame frame) =>
    frame.parts.any((part) => part.slot == SentenceSlot.subject)
        ? SentenceSlot.subject
        : SentenceSlot.quantity;

/// Whether a shape puts a noun phrase after its verb, counted or not.
bool _takesObject(SentenceFrame frame) {
  final subject = _subjectSlotOf(frame);

  return frame.parts.any(
    (part) =>
        part.slot == SentenceSlot.object ||
        part.slot == SentenceSlot.money ||
        (part.slot == SentenceSlot.quantity && subject != SentenceSlot.quantity),
  );
}

/// The digits of a number, grouped the way the language groups them.
String _grouped(int value, String group) {
  final digits = value.toString();
  final out = StringBuffer();

  for (var i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 == 0) out.write(group);

    out.write(digits[i]);
  }

  return out.toString();
}

/// A date, written the way the language writes one.
///
/// `Y`, `M`, `D` and `MMMM` stand for the year, the month, the day and the
/// month's name.
String _dateText(SentenceLanguageData data) {
  final calendar = data.calendar!;
  final month = randInt(1, 12);
  // The month goes in last, because a month's name has letters in it that the
  // other two stand for: `März` would lose its `M` to the month number.
  final written = calendar.date
      .replaceFirst('Y', '${randInt(calendar.years.min, calendar.years.max)}')
      .replaceFirst('D', '${randInt(1, 28)}');

  return calendar.months == null
      ? written.replaceFirst('M', '$month')
      : written.replaceFirst('MMMM', calendar.months![month - 1]);
}

/// A clock time, likewise. `h` is the hour and `mm` the minute.
String _clockText(SentenceLanguageData data) {
  final calendar = data.calendar!;

  return calendar.clock
      .replaceFirst('h', '${randInt(0, 23)}')
      .replaceFirst('mm', '${randInt(0, 59)}'.padLeft(2, '0'));
}

/// Shortest and longest either of them can be, for the budget.
///
/// Measured by taking the numbers out of the template and adding back the widest
/// and narrowest each of them can be written as.
LengthRange _calendarSpan(SentenceLanguageData data, SentenceSlot slot) {
  final calendar = data.calendar;

  if (calendar == null) return const LengthRange(1, 1);

  if (slot == SentenceSlot.clock) {
    final fixed = calendar.clock.replaceFirst('h', '').replaceFirst('mm', '').length;

    return LengthRange(fixed + 1 + 2, fixed + 2 + 2);
  }

  final fixed =
      (calendar.months == null
              ? calendar.date.replaceFirst('M', '')
              : calendar.date.replaceFirst('MMMM', ''))
          .replaceFirst('Y', '')
          .replaceFirst('D', '')
          .length;
  final names = calendar.months == null ? const LengthRange(1, 2) : poolBounds(calendar.months!);
  final years = <int>['${calendar.years.min}'.length, '${calendar.years.max}'.length];

  return LengthRange(fixed + names.min + years[0] + 1, fixed + names.max + years[1] + 2);
}

/// What a counted phrase writes beside its noun.
String _countText(SentenceLanguageData data, WordTheme theme) {
  final numeral = data.numeral!;
  final counter = numeral.counters[themeClass[theme]];
  final number = _grouped(randInt(numeral.count.min, numeral.count.max), numeral.group);

  return counter == null ? number : number + numeral.gap + counter;
}

/// What an amount of money writes.
String _moneyText(SentenceLanguageData data) {
  final numeral = data.numeral!;

  return _grouped(pick(numeral.amounts), numeral.group) + numeral.gap + numeral.currency;
}

/// Shortest and longest a count can be, so a phrase can reserve room for one.
LengthRange _countSpan(SentenceLanguageData data) {
  final numeral = data.numeral;

  if (numeral == null) return const LengthRange(0, 0);

  final counters = numeral.counters.values.toList(growable: false);
  var low = 0;
  var high = 0;

  if (counters.isNotEmpty) {
    low = counters.map((word) => word.length).reduce((a, b) => a < b ? a : b) + numeral.gap.length;
    high = counters.map((word) => word.length).reduce((a, b) => a > b ? a : b) + numeral.gap.length;
  }

  return LengthRange(
    data.space.length + _grouped(numeral.count.min, numeral.group).length + low,
    data.space.length + _grouped(numeral.count.max, numeral.group).length + high,
  );
}

/// The same for an amount, which is a phrase of its own rather than part of one.
LengthRange _moneySpan(SentenceLanguageData data) {
  final numeral = data.numeral;

  if (numeral == null) return const LengthRange(1, 1);

  final widths = numeral.amounts
      .map(
        (value) =>
            _grouped(value, numeral.group).length + numeral.gap.length + numeral.currency.length,
      )
      .toList(growable: false);

  return LengthRange(
    widths.reduce((a, b) => a < b ? a : b),
    widths.reduce((a, b) => a > b ? a : b),
  );
}

bool _isNounSlot(SentenceSlot slot) => _nounSlots.contains(slot);

class _Settings {
  const _Settings({
    required this.theme,
    required this.shape,
    required this.slots,
    required this.invent,
    required this.minLength,
    required this.maxLength,
    required this.prefix,
    required this.include,
    required this.sentences,
    required this.realism,
    required this.includeName,
    required this.types,
    required this.quote,
    required this.style,
    required this.tense,
    required this.story,
    required this.typed,
    required this.vocabulary,
  });

  final WordTheme? theme;
  final SentenceShape? shape;

  /// How common the nouns have to be.
  final RandVocabulary vocabulary;

  /// The parts a shape may carry beside the subject. Null is every shape the
  /// language has; an empty set is the subject and its predicate alone.
  final Set<SentenceSlot>? slots;

  /// How often one word is invented rather than drawn, as a percentage.
  final int invent;
  final int? minLength;
  final int? maxLength;
  final String prefix;
  final List<String> include;

  /// How many sentences one result holds, clamped.
  final int sentences;

  /// The same thing [invent] is, in the form `randName` takes it.
  ///
  /// A sentence that writes a person's name hands the name generator the level
  /// the caller asked for.
  final RandRealism realism;

  /// Whether a sentence about a person writes a name, or null when the caller
  /// left it to the generator, in which case it is decided once per result.
  final bool? includeName;

  /// What the sentences may be doing, normalized to a set to draw from.
  final List<SentenceType> types;

  /// Which marks a quoted line takes, or null for the type's own default.
  final SentenceQuote? quote;

  /// How the sentences address their reader, or null when the caller left it to
  /// the generator.
  final SentenceStyle? style;

  /// When it all happened, or null when the caller left it to the generator, in
  /// which case it is decided once per result.
  final SentenceTense? tense;

  /// The story a result of several sentences follows, or null for any of them.
  final SentenceStory? story;

  /// Whether the caller named the kinds themselves. A story writes statements
  /// unless they did.
  final bool typed;

  /// The same settings with [includeName] decided, which is what one result is
  /// drawn against. Dart has no spread for a class, so the copy is written out.
  _Settings naming(bool named) => _Settings(
    theme: theme,
    shape: shape,
    slots: slots,
    invent: invent,
    minLength: minLength,
    maxLength: maxLength,
    prefix: prefix,
    include: include,
    sentences: sentences,
    realism: realism,
    includeName: named,
    types: types,
    quote: quote,
    style: style,
    tense: tense,
    story: story,
    typed: typed,
    vocabulary: vocabulary,
  );
}

// The kinds a quoted line can be. Somebody speaking is as often asking as
// telling, and often enough neither, so the mark is drawn rather than fixed.
const List<SentenceType> _quotedMarks = <SentenceType>[
  SentenceType.statement,
  SentenceType.question,
  SentenceType.exclamation,
];

/// Every level, from the voice of a book to the one most spoken Korean is in.
const List<SentenceStyle> _styles = SentenceStyle.values;

/// The kinds that are a line somebody says or thinks rather than prose about it.
const List<SentenceType> _quotedTypes = <SentenceType>[SentenceType.dialogue, SentenceType.thought];

/// The kinds prose about a quoted line can be.
///
/// A line is answered by another line or by a sentence about it, and narration
/// that asks or exclaims is a third voice in a scene that has two.
const List<SentenceType> _narration = <SentenceType>[SentenceType.statement, SentenceType.trailing];

/// What each kind is worth against the others wherever the caller left the kind
/// to chance.
///
/// Prose is mostly statements: a paragraph that tells, asks, exclaims, trails off
/// and quotes in equal measure is not a paragraph but a sampler of the six. A
/// line somebody says comes next, because it is the one kind that carries a scene
/// with it, and the two marked kinds are the rarest — a question is only worth
/// reading when the sentences around it are not questions.
const Map<SentenceType, int> _typeWeight = <SentenceType, int>{
  SentenceType.statement: 100,
  SentenceType.dialogue: 34,
  SentenceType.trailing: 16,
  SentenceType.question: 14,
  SentenceType.thought: 12,
  SentenceType.exclamation: 10,
};

/// The same for the mark a quoted line closes on, which is drawn rather than
/// fixed: somebody speaking asks more often than a page of prose does, and still
/// tells more often than either.
const Map<SentenceType, int> _markWeight = <SentenceType, int>{
  SentenceType.statement: 100,
  SentenceType.question: 34,
  SentenceType.exclamation: 22,
  SentenceType.trailing: 16,
};

/// How much more likely a quoted line is inside a result that opened on one.
///
/// Speech is what a scene of speech is made of, and what the boost leaves room
/// for is the prose between the lines — the only thing that keeps two of them
/// from reading as one person talking to themselves.
const int _quotedBoost = 6;

/// What one more of the same in a row costs, against everything but the plain
/// statement a paragraph runs on.
///
/// A second question straight after one reads as a quiz and a third exclamation
/// as a shouting match, so each repeat is worth less than the last — damped
/// rather than forbidden, because an exchange of two lines is a conversation and
/// a run of ten is the tic.
const double _repeatDamp = 0.45;

/// The levels a line somebody says out loud is said at.
///
/// Never 해라체 — that is the voice of a book, not of a person with a listener in
/// front of them.
const List<SentenceStyle> _spokenLevels = <SentenceStyle>[
  SentenceStyle.casual,
  SentenceStyle.polite,
  SentenceStyle.formal,
];

/// The levels a thought is thought at, which is the other way round: it is
/// addressed to nobody, so it is never polite.
const List<SentenceStyle> _thoughtLevels = <SentenceStyle>[
  SentenceStyle.plain,
  SentenceStyle.casual,
];

/// Which form a level writes for each mood, best first.
///
/// A chain ends where it started, at the plain statement the group's `words`
/// already are, which is why seven of the nine write the same sentence whatever
/// the caller asks for. A trailing sentence is a statement that stops early, so
/// it ends on the statement's form.
const Map<SentenceStyle, Map<SentenceType, List<PredicateForm>>> _formChain =
    <SentenceStyle, Map<SentenceType, List<PredicateForm>>>{
      SentenceStyle.plain: <SentenceType, List<PredicateForm>>{
        SentenceType.statement: <PredicateForm>[],
        SentenceType.trailing: <PredicateForm>[],
        SentenceType.question: <PredicateForm>[PredicateForm.question],
        SentenceType.exclamation: <PredicateForm>[PredicateForm.exclamation],
      },
      SentenceStyle.casual: <SentenceType, List<PredicateForm>>{
        SentenceType.statement: <PredicateForm>[PredicateForm.casual],
        SentenceType.trailing: <PredicateForm>[PredicateForm.casual],
        SentenceType.question: <PredicateForm>[
          PredicateForm.casualQuestion,
          PredicateForm.casual,
          PredicateForm.question,
        ],
        SentenceType.exclamation: <PredicateForm>[PredicateForm.casual, PredicateForm.exclamation],
      },
      SentenceStyle.polite: <SentenceType, List<PredicateForm>>{
        SentenceType.statement: <PredicateForm>[PredicateForm.polite],
        SentenceType.trailing: <PredicateForm>[PredicateForm.polite],
        SentenceType.question: <PredicateForm>[
          PredicateForm.politeQuestion,
          PredicateForm.polite,
          PredicateForm.question,
        ],
        SentenceType.exclamation: <PredicateForm>[PredicateForm.polite, PredicateForm.exclamation],
      },
      SentenceStyle.formal: <SentenceType, List<PredicateForm>>{
        SentenceType.statement: <PredicateForm>[PredicateForm.formal, PredicateForm.polite],
        SentenceType.trailing: <PredicateForm>[PredicateForm.formal, PredicateForm.polite],
        SentenceType.question: <PredicateForm>[
          PredicateForm.formalQuestion,
          PredicateForm.formal,
          PredicateForm.polite,
          PredicateForm.question,
        ],
        SentenceType.exclamation: <PredicateForm>[
          PredicateForm.formal,
          PredicateForm.polite,
          PredicateForm.exclamation,
        ],
      },
    };

/// One of the endings a form pool entry lists.
///
/// `달리니|달리나|달리는가` is one verb written three ways, and a sentence takes
/// one of them; an entry with no `|` in it is itself.
String _oneOf(String entry) => entry.contains('|') ? pick(entry.split('|')) : entry;

/// Every ending an entry lists, which is what a length budget has to span.
WordPool _endings(WordPool pool) => <String>[for (final entry in pool) ...entry.split('|')];

/// The level one line is said at.
///
/// A level the caller named is used for every line, quoted or not; without one,
/// the result has a voice of its own and only a quoted line steps outside it,
/// because what a person says is not written the way the sentence around it is.
SentenceStyle _styleFor(SentenceType type, SentenceStyle? asked, SentenceStyle voice) {
  if (asked != null) return asked;
  if (type == SentenceType.dialogue) return pick(_spokenLevels);

  return type == SentenceType.thought ? pick(_thoughtLevels) : voice;
}

/// The marks a quoted line is wrapped in, or null when nothing is quoted.
List<String>? _quoteFor(SentenceLanguageData data, SentenceType type, SentenceQuote? override) {
  if (type != SentenceType.dialogue && type != SentenceType.thought) return null;

  return data.quotes[override ??
      (type == SentenceType.dialogue ? SentenceQuote.double : SentenceQuote.single)];
}

/// The one thing a shape has to match to answer a kind.
SentenceMood _moodFor(SentenceType mark) =>
    mark == SentenceType.question ? SentenceMood.question : SentenceMood.statement;

/// Everything one sentence of a result is drawn against: the room it has, what
/// it is doing, what it opens on, and — after the first — what it is about.
class _Draw {
  const _Draw({
    required this.budget,
    required this.type,
    required this.mark,
    required this.quote,
    required this.opener,
    required this.style,
    required this.avoid,
    required this.follow,
    required this.tense,
    required this.beat,
    required this.link,
    required this.dayAt,
    this.dated = false,
    this.object,
    this.speech,
    this.spoken = false,
  });

  final LengthRange budget;

  /// What the caller asked for, and what the detail reports.
  final SentenceType type;

  /// The kind whose mark it closes on — its own, or the one it is quoting.
  final SentenceType mark;

  /// The quotation marks it is wrapped in, or null.
  final List<String>? quote;

  /// A connective or an interjection, `''` for neither.
  final String opener;

  /// The level this line is said at, which a quoted one does not share.
  final SentenceStyle style;

  /// The predicates and adverbials the result has already used, in their plain
  /// form.
  ///
  /// A verb group holds four words and a paragraph holds ten sentences, so this
  /// cannot always be honoured — what it does is spend the group before it starts
  /// over, rather than rolling `식습니다` three times in four lines.
  final Set<String> avoid;
  final _Follow? follow;

  /// The tense every sentence of the result is in.
  final SentenceTense tense;

  /// What a story asks of this sentence, when it is one of a story. Null for a
  /// sentence that is drawn on its own terms.
  final _BeatDraw? beat;

  /// Whether this sentence is the first or the second clause of one two-clause
  /// sentence, or a whole sentence of its own.
  final JoinSide? link;

  /// The latest phase of the day the result has reached, as an index into the
  /// language's `times.day`, and `-1` before it has named one.
  final int dayAt;

  /// Whether the sentence this clause belongs to has said when already — it
  /// opened on a temporal connective, or its first clause named a time — so
  /// this clause names none.
  final bool dated;

  /// How this sentence refers to the object the one before it named, when its
  /// shape puts that noun in the object slot again. Null where the object is
  /// named in full.
  final _ObjectReference? object;

  /// Set for a line the hero says or thinks in their own voice: what stands for
  /// the subject, and the head a state takes in the first person. Null for a
  /// sentence the result narrates.
  final SentenceSpeech? speech;

  /// Whether this sentence is a line somebody says or thinks inside a story —
  /// in the first person, or about the thing in front of them — which is what
  /// is said and nothing around it: no time, no place, no manner, and nothing
  /// in front of it. A quoted line drawn on its own terms is not one of these.
  final bool spoken;

  /// The same draw with another opener, or another way of referring to the
  /// topic. Dart has no spread for a class, so the copy is written out.
  _Draw copyWith({String? opener, _Follow? follow, bool keepFollow = true}) => _Draw(
    budget: budget,
    type: type,
    mark: mark,
    quote: quote,
    opener: opener ?? this.opener,
    style: style,
    avoid: avoid,
    follow: keepFollow ? (follow ?? this.follow) : follow,
    tense: tense,
    beat: beat,
    link: link,
    dayAt: dayAt,
    dated: dated,
    object: object,
    speech: speech,
    spoken: spoken,
  );
}

/// What one sentence of a story has to be: which fields its verb may come from,
/// which condition a state sentence says, which parts the shape has to carry and
/// which it is better with, and what the nouns of the story are.
class _BeatDraw {
  const _BeatDraw({
    required this.headedByState,
    required this.fields,
    required this.describes,
    required this.condition,
    required this.wants,
    required this.prefers,
    required this.item,
    required this.places,
    required this.subject,
    this.pinned = const <SentenceSlot, _Requirement>{},
    this.avoid = const <String>[],
    this.state,
    this.nameless = false,
  });

  /// Whether the shape is headed by a state rather than a verb.
  final bool headedByState;

  /// What is true of the hero before this sentence, for a verb group that
  /// shows a condition to be drawn by. Null for a sentence that is not the
  /// hero's.
  final Set<Condition>? state;

  /// Whether this sentence's subject is somebody the story never introduces —
  /// a passer-by, a bird on a fence — who is written as what they are and never
  /// by a name, whatever `includeName` asked.
  final bool nameless;

  /// The fields the verb may be drawn from. Empty for a state sentence.
  final List<VerbField> fields;

  /// Whether this is a state sentence, whose predicate has to say [condition].
  final bool describes;

  /// The condition a state sentence asserts, or null for a plain trait.
  final Condition? condition;

  /// The parts the shape has to carry, and the ones it is better for carrying.
  final List<SentenceSlot> wants;
  final List<SentenceSlot> prefers;

  /// The theme the story's item comes from, for a phrase that draws it.
  final WordTheme? item;

  /// The themes the story's places come from.
  final List<WordTheme> places;

  /// The themes the subject may come from, when the story has decided it.
  final List<WordTheme>? subject;

  /// The nouns the story has put on the page that this sentence writes again,
  /// by slot. What `_Follow.scene` carries once there is a topic to follow; this
  /// is how the first sentence about the hero gets them when a scene came
  /// before it.
  final Map<SentenceSlot, _Requirement> pinned;

  /// Nouns this sentence's object must not be: the story's other thing. A prop
  /// is never the item and the item never the prop.
  final List<String> avoid;
}

/// What the sentences of one result are about: the first sentence's subject, and
/// everything a later one needs to keep talking about it.
///
/// A paragraph is not three draws, and this is the whole of the difference. The
/// class is what a fresh subject stays inside, the noun is what naming it again
/// writes, and the gender is what a pronoun and an agreeing predicate need.
class _Topic {
  const _Topic(this.noun, this.theme, this.nounClass, this.gender, this.named);

  /// The subject noun as the first sentence wrote it.
  final String noun;
  final WordTheme? theme;

  /// The class its theme falls into. Null when the noun is one no pool holds.
  final NounClass? nounClass;
  final WordGender? gender;

  /// Whether that noun is a person's name, which is written bare wherever it goes.
  final bool named;
}

/// How a sentence that follows another refers to what the two of them are about:
/// [repeat] names the topic again, [pronoun] stands in for it — with the empty
/// string where the language drops its subject — and [fresh] draws another noun
/// of the same class.
enum _Reference { repeat, pronoun, fresh }

/// Everything a sentence after the first one is built with.
class _Follow {
  const _Follow(this.topic, this.reference, this.pronoun, this.scene);

  final _Topic topic;
  final _Reference reference;

  /// What a [_Reference.pronoun] writes; `''` where the language writes nothing.
  final String pronoun;

  /// The nouns the result has already put on the page, by the slot they stood in.
  ///
  /// A sentence with one of those slots writes what is here rather than drawing
  /// again — a paragraph whose place changes every line is not one paragraph.
  final Map<SentenceSlot, _Requirement> scene;
}

/// The object the sentence before named, referred to rather than named again:
/// [text] is what stands for it — `''` where the language leaves the object
/// out — and [clitic] puts it in front of the verb rather than where the object
/// stood.
class _ObjectReference {
  const _ObjectReference(this.noun, this.text, this.clitic);

  final String noun;
  final String text;
  final bool clitic;
}

/// What the result has written so far, and the whole of what keeps the next
/// sentence from writing it again.
///
/// A paragraph is not a set of draws that happened to land together, and every
/// field here is one of the ways that shows: the register it opened in, the kind
/// and the mark it has just used, what it opened those sentences on, and whether
/// the last of them named the topic instead of standing a pronoun where it was.
class _Flow {
  _Flow();

  /// The kind the result opened on, which is the register the rest of it keeps.
  SentenceType? lead;

  /// The kind the sentence before this one was, and how many of it in a row.
  SentenceType? last;
  int run = 0;

  /// The mark that sentence closed on, quoted or not.
  SentenceType? mark;

  /// Whether it opened on a connective or an interjection.
  bool opened = false;

  /// Every one the result has already used, so that none is written twice.
  final Set<String> openers = <String>{};

  /// Whether it named the topic rather than standing a pronoun where it was.
  ///
  /// The opening sentence names the subject itself, which is why this starts
  /// true.
  bool repeated = true;

  /// The level the last quoted line was said at, for an answer to be said at too.
  SentenceStyle? line;
}

/* --- Shapes ---------------------------------------------------------------- */

/// How much a shape says, read off the shape itself rather than declared beside
/// it.
///
/// Two phrases is a subject and its predicate and nothing else; every phrase
/// after that is one more thing the sentence has to say.
SentenceShape shapeOf(SentenceFrame frame) {
  if (frame.parts.length <= 2) return SentenceShape.simple;

  return frame.parts.length == 3 ? SentenceShape.detailed : SentenceShape.complex;
}

/// Whether a shape is one the caller asked for: it carries at least one of the
/// parts they named.
///
/// At least one rather than all of them, for the same reason a nickname's slots
/// read that way — the named slots are a set to draw from. An empty set reads
/// the other way round, and matches a sentence that is a subject and its
/// predicate alone.
bool _matchesSlots(SentenceFrame frame, Set<SentenceSlot> slots) =>
    slots.isEmpty
        ? frame.parts.every(
          (part) =>
              part.slot == SentenceSlot.subject ||
              part.slot == SentenceSlot.verb ||
              part.slot == SentenceSlot.state,
        )
        : frame.parts.any((part) => slots.contains(part.slot));

/// The shapes one sentence may take.
///
/// Both filters fall back rather than fail: a language that has no shape
/// carrying what was asked for answers with the closest it does have, the same
/// best-effort a too-narrow length range gets.
List<SentenceFrame> _framesFor(
  SentenceLanguageData data,
  _Settings settings,
  SentenceMood mood, [
  _BeatDraw? beat,
]) {
  // A language that writes its question with the mark alone declares no question
  // shape, and answers with the statement shapes it does have. That is not a
  // fallback so much as the point: `¿El león corre?` is the statement.
  final storied =
      beat == null
          ? data.frames
          : data.frames.where((frame) => _storyFrame(frame, beat)).toList(growable: false);
  final shaped = storied.isNotEmpty ? storied : data.frames;
  final byMood = shaped.where((frame) => frame.mood == mood).toList(growable: false);
  final moody =
      byMood.isNotEmpty
          ? byMood
          : shaped.where((frame) => frame.mood == SentenceMood.statement).toList(growable: false);
  final moodly = moody.isNotEmpty ? moody : shaped;
  // A counted shape has no room for a name: its quantity is its subject, and
  // `서호 3명` counts somebody's name, which is not a thing a sentence says. Asked
  // for a name, the shapes that cannot carry one are left out.
  final nameable =
      (settings.includeName ?? false)
          ? moodly.where(_carriesPerson).toList(growable: false)
          : moodly;
  final usable = nameable.isNotEmpty ? nameable : moodly;
  final wanted = settings.slots;
  final bySlots =
      wanted == null
          ? usable
          : usable.where((frame) => _matchesSlots(frame, wanted)).toList(growable: false);
  final sloted = bySlots.isNotEmpty ? bySlots : usable;
  // A story's sentence has to carry what the story put in it — the thing the hero
  // is holding, the place they are going — and a shape with no room for that is a
  // shape that would draw something else. Fallen back on rather than failed,
  // because a language may have no such shape at all.
  final asked =
      beat == null || beat.wants.isEmpty
          ? sloted
          : sloted
              .where(
                (frame) => beat.wants.every((slot) => frame.parts.any((part) => part.slot == slot)),
              )
              .toList(growable: false);
  final allowed = asked.isNotEmpty ? asked : sloted;
  final shape = settings.shape;

  if (shape == null) return allowed;

  final byShape = allowed.where((frame) => shapeOf(frame) == shape).toList(growable: false);

  return byShape.isNotEmpty ? byShape : allowed;
}

/// Whether a shape can be one sentence of a story.
///
/// It has to be headed the way the step is — a verb for something done, a state
/// for a description — it may not count or price or date anything, its verb has
/// to be one the step's fields can supply, and a change of scene carries no place
/// of its own: `숲이 숲에서 조용해졌다` is the sentence that rule keeps out.
bool _storyFrame(SentenceFrame frame, _BeatDraw beat) {
  if (frame.parts.any((part) => _unstoried.contains(part.slot) || part.copula != null)) {
    return false;
  }

  final headedByState = frame.parts.any((part) => part.slot == SentenceSlot.state);

  if (headedByState != beat.headedByState) return false;

  final fields = frame.fields;

  if (fields != null && !fields.any(beat.fields.contains)) return false;

  // A shape that has somewhere the story did not ask for — a destination for a
  // hero who is not going anywhere, an object for a hero with empty hands — would
  // draw a noun the story does not know.
  final known = <SentenceSlot>[...beat.wants, ...beat.prefers];

  return frame.parts
      .map((part) => part.slot)
      .where(
        (slot) =>
            slot == SentenceSlot.object ||
            slot == SentenceSlot.destination ||
            slot == SentenceSlot.place,
      )
      .every(known.contains);
}

/// Whether a language has a shape that answers the request at all.
bool _carries(SentenceLanguageData data, _Settings settings) {
  final wanted = settings.slots;

  if (wanted != null && !data.frames.any((frame) => _matchesSlots(frame, wanted))) {
    return false;
  }

  final shape = settings.shape;

  return shape == null || data.frames.any((frame) => shapeOf(frame) == shape);
}

/// The languages one draw may come from.
///
/// A null language prefers the ones whose shapes answer the request, and — when
/// words were required — the ones whose pools actually hold them. When none of
/// them can, every language is back in play and each answers with its closest.
List<WordLanguage> _languagesFor(_Settings settings) {
  final able = wordLanguages
      .where(
        (code) =>
            _carries(sentenceData[code]!, settings) &&
            settings.include.every((word) => _classify(code, word).known),
      )
      .toList(growable: false);

  if (able.isNotEmpty) return able;

  final shaped = wordLanguages
      .where((code) => _carries(sentenceData[code]!, settings))
      .toList(growable: false);

  return shaped.isNotEmpty ? shaped : wordLanguages;
}

/* --- Required words -------------------------------------------------------- */

/// Where a required word can go, and what the generator knows about it.
///
/// [slots] is a list rather than one entry, because a word can be more than one
/// thing: English `brave` closes a sentence as a predicate and opens a noun
/// phrase as a modifier, and which of the two it has to be depends on what the
/// other required words need. Best first, and the shape takes the first that is
/// still free.
class _Requirement {
  const _Requirement(
    this.word,
    this.slots, {
    this.theme,
    this.known = true,
    this.bare = false,
    this.settled = false,
  });

  final String word;

  /// True for a word written on its own, with no modifier in front of it.
  final bool bare;

  /// True for a noun the result has already described. It is written again with
  /// its article and nothing else in front of it, because `the icy hamlet`
  /// described a second time as `the quiet hamlet` reads as another hamlet.
  final bool settled;

  /// The phrases it can fill. A null entry stands for the modifier inside one.
  final List<SentenceSlot?> slots;

  /// Set when the word is a noun the language knows, which fixes the subject's
  /// class.
  final WordTheme? theme;

  /// False for a word found in none of the pools, which is used as a noun anyway.
  final bool known;
}

/// Which part of a shape each required word ends up in, by the part's index.
class _Plan {
  _Plan(this.phrase, this.modifier);

  /// The word a phrase has to be written with.
  final Map<int, _Requirement> phrase;

  /// The modifier a noun phrase has to carry.
  final Map<int, _Requirement> modifier;
}

/// Where each required word goes in this shape, and whether the shape had room
/// for all of them.
class _Placement {
  const _Placement(this.plan, this.complete);

  final _Plan plan;
  final bool complete;
}

/// The pool's own spelling of [word], or null when the pool does not hold it.
///
/// Matched without case, because English stores its pools capitalized and writes
/// them lowercase inside a sentence — a caller who read `lion` out of one is
/// asking for the same word the pool calls `Lion`.
String? _entryOf(WordPool pool, String word) {
  final lower = word.toLowerCase();

  for (final entry in pool) {
    if (entry.toLowerCase() == lower) return entry;
  }

  return null;
}

/// What a required word is, judged by every pool it appears in.
_Requirement _classify(WordLanguage language, String word) {
  final lexicon = wordData[language]!;
  final data = sentenceData[language]!;
  final slots = <SentenceSlot?>[];
  var written = word;
  WordTheme? theme;

  for (final each in wordThemes) {
    final entry = _entryOf(lexicon.nouns[each]!, word);

    if (entry != null) {
      written = _plain(lexicon, entry);
      theme = each;
      slots.add(SentenceSlot.subject);
      break;
    }
  }

  for (final group in data.verbs) {
    final entry = _entryOf(group.words, word);

    if (entry != null) {
      written = entry;
      slots.add(SentenceSlot.verb);
      break;
    }
  }

  for (final group in data.states) {
    final entry = _entryOf(group.words, word);

    if (entry != null) {
      written = entry;
      slots.add(SentenceSlot.state);
      break;
    }
  }

  String? manner;

  for (final group in data.manners) {
    manner ??= _entryOf(group.words, word);
  }

  if (manner != null) {
    written = manner;
    slots.add(SentenceSlot.manner);
  }

  String? time;

  for (final pool in _timePools(data)) {
    time ??= _entryOf(pool, word);
  }

  if (time != null) {
    written = time;
    slots.add(SentenceSlot.time);
  }

  final degree = data.degrees == null ? null : _entryOf(data.degrees!, word);

  if (degree != null) {
    written = degree;
    slots.add(SentenceSlot.degree);
  }

  String? modifier;

  for (final group in data.modifiers) {
    modifier ??= _entryOf(group.words, word);
  }

  modifier ??= _entryOf(lexicon.adjectives, word) ?? _entryOf(lexicon.actions, word);

  if (modifier != null) {
    written = _plain(lexicon, modifier);
    slots.add(null);
  }

  // A word from outside the pools is still a word the caller asked for. It goes
  // in as a noun, which is the one slot that takes any word without a form of
  // its own to be in.
  return slots.isNotEmpty
      ? _Requirement(written, slots, theme: theme)
      : _Requirement(word, const <SentenceSlot?>[SentenceSlot.subject], known: false);
}

/// Where each required word goes in this shape.
///
/// Greedy: a word takes the first of its own slots that is still free, which is
/// enough because the lists are short and ordered by how specific the reading is.
_Placement _planFor(
  SentenceFrame frame,
  List<_Requirement> requirements, [
  Map<SentenceSlot, _Requirement> pinned = const <SentenceSlot, _Requirement>{},
]) {
  final plan = _Plan(<int, _Requirement>{}, <int, _Requirement>{});
  var complete = true;

  // A sentence carrying on from another one is handed the phrases the result has
  // already put on the page — its subject, and the place it is happening in —
  // rather than asking for them, so each goes in its own slot before the greedy
  // placement below reaches for the first noun slot it can find.
  pinned.forEach((slot, requirement) {
    // The subject goes wherever this shape's subject goes, which in a counted
    // shape is its quantity: `사과 12개가 익는다` has no `subject` part, and a topic
    // pinned to one would have been dropped and drawn again.
    final wanted = slot == SentenceSlot.subject ? _subjectSlotOf(frame) : slot;
    final at = _indexWhere(frame, (part, i) => part.slot == wanted);

    if (at >= 0) plan.phrase[at] = requirement;
  });

  for (final requirement in requirements) {
    var placed = false;

    for (final slot in requirement.slots) {
      if (slot == null) {
        final at = _indexWhere(
          frame,
          (part, i) => part.modifiable && !plan.modifier.containsKey(i),
        );

        if (at < 0) continue;

        plan.modifier[at] = requirement;
        placed = true;
        break;
      }

      // A noun goes wherever a noun goes, so a required subject can land in the
      // object phrase of a shape whose subject is already spoken for.
      final wanted = _isNounSlot(slot) ? _nounSlots : <SentenceSlot>[slot];
      final at = _indexWhere(
        frame,
        (part, i) => wanted.contains(part.slot) && !plan.phrase.containsKey(i),
      );

      if (at < 0) continue;

      plan.phrase[at] = requirement;
      placed = true;
      break;
    }

    complete = complete && placed;
  }

  return _Placement(plan, complete);
}

int _indexWhere(SentenceFrame frame, bool Function(SentencePart part, int index) test) {
  for (var i = 0; i < frame.parts.length; i += 1) {
    if (test(frame.parts[i], i)) return i;
  }

  return -1;
}

/// The word a shape's [slot] was required to use, if any.
_Requirement? _requiredAt(SentenceFrame frame, _Plan plan, SentenceSlot slot) {
  for (final entry in plan.phrase.entries) {
    if (frame.parts[entry.key].slot == slot) return entry.value;
  }

  return null;
}

/* --- Pools and bounds ------------------------------------------------------ */

// Pools and their bounds never change, so they are worth holding on to.
final Map<String, WordPool> _nounCache = <String, WordPool>{};

/// The subject pools a trait narrows, by group and theme. Every group a sentence
/// considers reads them for every theme it could take, and filtering two hundred
/// nouns each time is what made a paragraph slow once every language had them.
/// A group is a constant of its language's data, so it is its own key.
final Map<Object, Map<String, WordPool>> _subjectPoolCache = <Object, Map<String, WordPool>>{};
final Map<VerbGroup, Map<String, WordPool>> _objectPoolCache = <VerbGroup, Map<String, WordPool>>{};
final Map<String, WordPool> _placePoolCache = <String, WordPool>{};
final Map<WordLanguage, Map<SentenceSlot, LengthRange>> _boundsCache =
    <WordLanguage, Map<SentenceSlot, LengthRange>>{};
final Map<WordLanguage, LengthRange> _modifierBounds = <WordLanguage, LengthRange>{};
final Map<String, LengthRange> _spanCache = <String, LengthRange>{};
final Map<String, WordPool> _agreedCache = <String, WordPool>{};

/// The nouns of one theme a sentence may use.
///
/// A language that inflects leaves out the nouns with no singular: `ножницы`
/// and `Jeans` would need a plural verb beside them, and a verb pool written
/// twice over is a lot of data for a dozen words.
WordPool _nounsOf(WordLanguage language, WordTheme theme, RandVocabulary vocabulary) {
  final key = '${language.name}:${theme.name}:${vocabulary.name}';
  final cached = _nounCache[key];

  if (cached != null) return cached;

  final data = wordData[language]!;
  final gender = data.nounGender;
  // As common as the caller asked, and then only the nouns a singular verb can
  // stand beside.
  final all = levelledNouns(data, theme, vocabulary);
  final pool =
      gender == null
          ? all
          : all
              .where((word) => gender[word] != WordGender.p && gender[word] != WordGender.fp)
              .toList(growable: false);
  final usable = pool.isNotEmpty ? pool : all;

  _nounCache[key] = usable;

  return usable;
}

/// Shortest and longest noun one phrase can actually be given, which is not the
/// same question [poolBounds] answers.
///
/// At `RandRealism.invented` the word comes out of the language's syllable
/// template rather than its pools, and English invents at most two syllables
/// where its pools hold words of twelve letters. A budget measured against the
/// wrong one of those is a `minLength` the phrase cannot reach.
LengthRange _nounSpan(
  WordLanguage language,
  WordTheme theme,
  int invent,
  RandVocabulary vocabulary,
) {
  final key = '${language.name}:${theme.name}:$invent:${vocabulary.name}';
  final cached = _spanCache[key];

  if (cached != null) return cached;

  final pool = poolBounds(_nounsOf(language, theme, vocabulary));
  final syn = synthBounds(wordData[language]!.syn);
  // `RandRealism.mixed` draws from both, so both lengths are on the table.
  final span =
      invent >= 100
          ? syn
          : invent <= 0
          ? pool
          : LengthRange(
            pool.min < syn.min ? pool.min : syn.min,
            pool.max > syn.max ? pool.max : syn.max,
          );

  _spanCache[key] = span;

  return span;
}

/// The modifiers a noun of [theme] may carry, in the form they take beside a
/// noun of [gender].
///
/// Drawn from the sentence data's own groups rather than from the nickname pools,
/// so that `맑은` goes in front of a drink and never in front of a mechanic; a
/// noun no pool holds takes any of them. Written out rather than agreed after the
/// fact, because a length budget has to see the word the sentence will actually
/// carry: German `blau` is `blauer` in front of a masculine noun.
WordPool _modifiersFor(WordLanguage language, WordTheme? theme, WordGender? gender) {
  final lexicon = wordData[language]!;
  final data = sentenceData[language]!;
  // Keyed by the theme rather than the class, because a group may narrow itself
  // to themes: a soup and a tea are both edible and take different words.
  final key = '${language.name}:${theme?.name ?? '*'}:${gender?.name ?? '-'}';
  final cached = _agreedCache[key];

  if (cached != null) return cached;

  final cls = theme == null ? null : themeClass[theme];
  final groups =
      cls == null
          ? data.modifiers
          : data.modifiers
              .where(
                (group) =>
                    group.subject.contains(cls) &&
                    (group.themes == null || group.themes!.contains(theme)),
              )
              .toList(growable: false);
  final base = <String>{for (final group in groups) ...group.words}.toList(growable: false);
  final agreed =
      gender != null && lexicon.agreement != null
          ? base.map((word) => agree(lexicon, word, gender)).toList(growable: false)
          : base;

  _agreedCache[key] = agreed;

  return agreed;
}

/// Every pool a group's predicate can be written from, in either tense.
List<WordPool> _predicatePools(WordPool words, PredicateForms forms, PredicateTense? past) =>
    <WordPool>[
      words,
      ...forms.values.map(_endings),
      if (past != null) ...<WordPool>[past.words, ...past.forms.values.map(_endings)],
    ];

/// Every pool a time adverbial can come from, whatever the tense.
List<WordPool> _timePools(SentenceLanguageData data) => <WordPool>[
  data.times.day,
  data.times.any,
  ...?data.times.past == null ? null : <WordPool>[data.times.past!],
  ...?data.times.present == null ? null : <WordPool>[data.times.present!],
].where((pool) => pool.isNotEmpty).toList(growable: false);

LengthRange _span(Iterable<WordPool> pools) {
  var min = 1 << 30;
  var max = 0;

  for (final pool in pools) {
    final bounds = poolBounds(pool);

    if (bounds.min < min) min = bounds.min;
    if (bounds.max > max) max = bounds.max;
  }

  return LengthRange(min == 1 << 30 ? 1 : min, max == 0 ? 1 : max);
}

/// Shortest and longest word each kind of slot can contribute, over every theme.
Map<SentenceSlot, LengthRange> _slotBounds(WordLanguage language) {
  final cached = _boundsCache[language];

  if (cached != null) return cached;

  final data = sentenceData[language]!;
  final bounds = <SentenceSlot, LengthRange>{
    SentenceSlot.subject: _span(
      wordThemes.map((theme) => _nounsOf(language, theme, RandVocabulary.full)),
    ),
    // Every form a predicate can take, not only the plain statement's: a question
    // form is a different length, and the shape is chosen against these.
    SentenceSlot.verb: _span(<WordPool>[
      for (final group in data.verbs) ..._predicatePools(group.words, group.forms, group.past),
    ]),
    SentenceSlot.state: _span(<WordPool>[
      for (final group in data.states) ..._predicatePools(group.words, group.forms, group.past),
    ]),
    SentenceSlot.manner: _span(<WordPool>[for (final group in data.manners) group.words]),
    SentenceSlot.degree:
        data.degrees == null ? const LengthRange(1, 1) : _span(<WordPool>[data.degrees!]),
    SentenceSlot.time: _span(_timePools(data)),
  };

  bounds[SentenceSlot.object] = bounds[SentenceSlot.subject]!;
  bounds[SentenceSlot.place] = bounds[SentenceSlot.subject]!;
  bounds[SentenceSlot.destination] = bounds[SentenceSlot.subject]!;
  bounds[SentenceSlot.quantity] = bounds[SentenceSlot.subject]!;
  bounds[SentenceSlot.money] = _moneySpan(data);
  bounds[SentenceSlot.date] = _calendarSpan(data, SentenceSlot.date);
  bounds[SentenceSlot.clock] = _calendarSpan(data, SentenceSlot.clock);

  _boundsCache[language] = bounds;
  final lexicon = wordData[language]!;
  final genders = <WordGender?>[null, if (lexicon.agreement != null) ...lexicon.agreement!.keys];

  _modifierBounds[language] = _span(genders.map((gender) => _modifiersFor(language, null, gender)));

  return bounds;
}

/// The longest and shortest article the language can open a phrase with.
LengthRange _articleSpan(SentenceLanguageData data) {
  final articles = data.articles;

  if (articles == null) return const LengthRange(0, 0);

  var min = 1 << 30;
  var max = 0;

  for (final rules in articles.values) {
    for (final rule in rules) {
      if (rule[1].length < min) min = rule[1].length;
      if (rule[1].length > max) max = rule[1].length;
    }
  }

  return LengthRange(min == 1 << 30 ? 0 : min, max);
}

int _tailMin(SentencePart part) {
  final tail = part.tail?.length ?? 0;
  final alt = part.tailAlt?.length ?? tail;

  return tail < alt ? tail : alt;
}

int _tailMax(SentencePart part) {
  final tail = part.tail?.length ?? 0;
  final alt = part.tailAlt?.length ?? 0;

  return tail > alt ? tail : alt;
}

/// What one part adds to the sentence, at its shortest and at its longest.
/// How much room the copula takes on the phrase it is written onto.
///
/// Every form of it, because the level and the mood are settled after the shape
/// is. A copula in front is a word of its own; one on the end is written onto
/// the phrase with nothing between them.
LengthRange _copulaSpan(SentencePart part, SentenceLanguageData data) {
  if (part.copula == null || data.calendar == null) return const LengthRange(0, 0);

  final group = data.calendar!.copula;
  final own = _span(_predicatePools(group.words, group.forms, group.past));
  final gap = part.copula == CopulaSide.head ? data.space.length : 0;

  return LengthRange(own.min + gap, own.max + gap);
}

LengthRange _partRange(
  SentencePart part,
  SentenceLanguageData data,
  Map<SentenceSlot, LengthRange> bounds,
  LengthRange modifier,
) {
  final space = data.space.length;
  final copula = _copulaSpan(part, data);
  final head = (part.head == null ? 0 : part.head!.length + space) + copula.min;
  final own = bounds[part.slot]!;
  final extra = copula.max - copula.min;

  if (!_isNounSlot(part.slot)) {
    return LengthRange(head + own.min + _tailMin(part), head + own.max + _tailMax(part) + extra);
  }

  final article = part.bare ? const LengthRange(0, 0) : _articleSpan(data);
  final low = article.min == 0 ? 0 : article.min + space;
  final high = article.max == 0 ? 0 : article.max + space;
  final withModifier = part.modifiable ? modifier.max + space : 0;
  // A counted phrase carries a number and the counter its kind takes, and no
  // article and no modifier — `12 apples`, never `the 12 red apples`.
  final count = part.slot == SentenceSlot.quantity ? _countSpan(data) : const LengthRange(0, 0);

  return LengthRange(
    head + low + own.min + count.min + _tailMin(part),
    head + high + withModifier + own.max + count.max + _tailMax(part),
  );
}

/// Shortest and longest sentence a shape can produce.
LengthRange _frameRange(
  SentenceFrame frame,
  SentenceLanguageData data,
  Map<SentenceSlot, LengthRange> bounds,
  LengthRange modifier,
) {
  // Measured against the longest mark the language writes, so a shape is never
  // chosen for a range only the shortest one could have reached.
  var marks = 0;

  for (final mark in data.terminators.values) {
    if (mark.length > marks) marks = mark.length;
  }

  final tag = frame.tag == null ? 0 : frame.tag!.length + data.space.length;
  var min = marks + tag;
  var max = min;

  for (var i = 0; i < frame.parts.length; i += 1) {
    final gap = i == 0 ? 0 : data.space.length;
    final range = _partRange(frame.parts[i], data, bounds, modifier);

    min += gap + range.min;
    max += gap + range.max;
  }

  return LengthRange(min, max);
}

/// Every sentence length the language can produce.
///
/// The fallback for an omitted `minLength` / `maxLength`, and what
/// `sentenceLengthRange` reports. Derived from the same frames and pools the
/// generator draws from.
LengthRange naturalRange(WordLanguage language) {
  final data = sentenceData[language]!;
  final bounds = _slotBounds(language);

  return _naturalSpan(data, data.frames, bounds, _modifierBounds[language]!);
}

/* --- Choosing the words ---------------------------------------------------- */

/// The themes among [themes] whose nouns are one of [classes].
List<WordTheme> _themesForClasses(List<WordTheme> themes, List<NounClass> classes) =>
    themes.where((theme) => classes.contains(themeClass[theme])).toList(growable: false);

SentenceFrame _pickFrame(List<SentenceFrame> frames, [int Function(SentenceFrame)? boost]) {
  int weightOf(SentenceFrame frame) => frame.weight * (boost == null ? 1 : boost(frame));

  var total = 0;

  for (final frame in frames) {
    total += weightOf(frame);
  }

  var roll = randDouble() * total;

  for (final frame in frames) {
    roll -= weightOf(frame);

    if (roll <= 0) return frame;
  }

  return frames.last;
}

/// The verb groups one sentence may use: transitive exactly when the shape has
/// an object, able to take the subject the shape will be given, and — when a
/// word was required — the group that word belongs to.
List<VerbGroup> _verbGroupsFor(
  WordLanguage language,
  SentenceLanguageData data,
  RandVocabulary vocabulary,
  SentenceFrame frame,
  List<WordTheme> themes,
  _Plan plan, [
  _BeatDraw? beat,
  String? subjectNoun,
]) {
  // A quantity is an object with a number on it, and an amount is an object of
  // the class money belongs to — unless the quantity is what the sentence is
  // about, in which case it is the subject and the verb takes nothing.
  final wantsObject = _takesObject(frame);
  final wantsMoney = frame.parts.any((part) => part.slot == SentenceSlot.money);
  final wantsDestination = frame.parts.any((part) => part.slot == SentenceSlot.destination);
  final subject = _requiredAt(frame, plan, SentenceSlot.subject);
  final object = _requiredAt(frame, plan, SentenceSlot.object);
  final verb = _requiredAt(frame, plan, SentenceSlot.verb);
  // A shape that goes somewhere wants a verb that goes, and a story step wants a
  // verb of the field it settled on.
  final fields = beat != null && beat.fields.isNotEmpty ? beat.fields : frame.fields;

  final usable = data.verbs
      .where((group) {
        if ((group.object != null) != wantsObject) return false;
        if (fields != null && !fields.contains(group.field)) return false;

        // A group that needs a part is drawn only for a shape that has it — and a
        // shape that has a destination is drawn only for the groups that go
        // somewhere, because `leaves to the market` is what the rest of the field
        // writes there.
        final requires = group.requires;

        if (requires != null && !frame.parts.any((part) => part.slot == requires)) return false;
        if (wantsDestination && requires != SentenceSlot.destination) return false;
        if (wantsMoney && (group.object == null || !_moneyFields.contains(group.field))) {
          return false;
        }
        if (verb != null && !group.words.contains(verb.word)) return false;

        final subjectTheme = subject?.theme;

        if (subjectTheme != null &&
            !_acceptsSubject(group.subject, group.subjectThemes, subjectTheme)) {
          return false;
        }

        if (subjectNoun != null && !_acceptsNoun(data, group, subjectNoun)) return false;

        final objectTheme = object?.theme;

        if (objectTheme != null && !_acceptsObject(group, objectTheme)) return false;
        if (object != null && !_acceptsObjectNoun(data, group, object.word)) return false;

        final item = beat?.item;

        if (item != null && group.object != null && !_acceptsObject(group, item)) return false;

        // A group that shows a condition is drawn only for a hero it is true of —
        // and, for somebody else in a story whose state nobody knows, only where
        // it shows nothing worse than being pleased: a passer-by may smile, and
        // never clutches their stomach.
        final condition = group.condition;

        if (beat != null && condition != null) {
          final state = beat.state;

          if (state != null ? !state.contains(condition) : condition != Condition.content) {
            return false;
          }
        }

        return _subjectThemesOf(language, data, group, themes, vocabulary).isNotEmpty &&
            (group.object == null ||
                _objectThemesOf(language, data, group, beat, vocabulary).isNotEmpty);
      })
      .toList(growable: false);
  // And where some group shows what is true of the hero, those are what the
  // sentence says: the hero laughs after the meal rather than sneezing after it.
  final showing =
      beat?.state == null
          ? const <VerbGroup>[]
          : usable.where((group) => group.condition != null).toList(growable: false);

  return showing.isNotEmpty ? showing : usable;
}

/// Whether a group takes a noun of this theme as its subject.
bool _acceptsSubject(List<NounClass> classes, List<WordTheme>? named, WordTheme theme) {
  if (!classes.contains(themeClass[theme])) return false;

  return named == null || named.contains(theme);
}

/// The themes a group's subject may come from, out of the ones asked for: its
/// classes, narrowed to the themes it names when it names any.
List<WordTheme> _subjectThemesOf(
  WordLanguage language,
  SentenceLanguageData data,
  Object group,
  List<WordTheme> themes,
  RandVocabulary vocabulary,
) {
  final classes = group is VerbGroup ? group.subject : (group as StateGroup).subject;
  final named = group is VerbGroup ? group.subjectThemes : (group as StateGroup).subjectThemes;
  final byClass = _themesForClasses(themes, classes);
  final byTheme = named == null ? byClass : byClass.where(named.contains).toList(growable: false);

  // A group that asks for a trait is only worth a theme that has a noun with it:
  // `날아오른다` takes an `animal` and no `job`, because no job flies.
  if (group is VerbGroup && group.subjectTraits != null) {
    return byTheme
        .where((theme) => _subjectPoolFor(language, data, group, theme, vocabulary).isNotEmpty)
        .toList(growable: false);
  }

  return byTheme;
}

/// The traits a noun carries: what its language says it can do.
/// The preposition this place takes, where the language lists one; null for
/// the frame's own.
String? _placeHeadFor(SentenceLanguageData data, String noun) {
  for (final entry in (data.placeHeads ?? const <String, WordPool>{}).entries) {
    if (entry.value.contains(noun)) return entry.key;
  }

  return null;
}

List<NounTrait> _traitsOf(SentenceLanguageData data, String noun) => <NounTrait>[
  for (final entry in (data.traits ?? const <NounTrait, WordPool>{}).entries)
    if (entry.value.contains(noun)) entry.key,
];

/// Whether a verb group takes this noun as its subject, by what the noun can do.
///
/// A group that asks for no trait takes any noun; one that asks for one takes
/// only a noun that carries it; one that rules some out takes any noun that
/// carries none of them.
bool _acceptsNoun(SentenceLanguageData data, Object group, String noun) {
  final traits = _traitsOf(data, noun);

  // A lifeless noun neither does anything nor is anything a creature is: a
  // spell casts no spell, and an amulet is never hungry.
  if (traits.contains(NounTrait.lifeless)) return false;

  if (group is! VerbGroup) return true;

  final wanted = group.subjectTraits;
  final barred = group.subjectWithout;

  if (wanted == null && barred == null) return true;

  if (wanted != null && !wanted.any(traits.contains)) return false;

  return barred == null || !barred.any(traits.contains);
}

/// The nouns of a theme a group's subject may be drawn from.
WordPool _subjectPoolFor(
  WordLanguage language,
  SentenceLanguageData data,
  Object group,
  WordTheme theme,
  RandVocabulary vocabulary,
) {
  final pool = _nounsOf(language, theme, vocabulary);
  final narrowed =
      group is VerbGroup && (group.subjectTraits != null || group.subjectWithout != null);

  // A state group narrows nothing of its own, but a lifeless noun is no subject
  // of one either.
  if (!narrowed && data.traits?[NounTrait.lifeless] == null) return pool;

  final byTheme = _subjectPoolCache.putIfAbsent(group, () => <String, WordPool>{});
  final key = '${theme.name}:${vocabulary.name}';
  final cached = byTheme[key];

  if (cached != null) {
    return cached;
  }

  final lexicon = wordData[language]!;
  final usable = pool
      .where((entry) => _acceptsNoun(data, group, _plain(lexicon, entry)))
      .toList(growable: false);

  byTheme[key] = usable;

  return usable;
}

/// The nouns of a theme a place or a destination may be drawn from: the ones a
/// sentence can happen in.
///
/// A wave, a comet and a lightyear are `nature` and `space` the way a river and
/// a moon are, and their language lists them [NounTrait.placeless]. The whole
/// theme where nothing is left, which no pool comes to.
WordPool _placePoolFor(
  WordLanguage language,
  SentenceLanguageData data,
  WordTheme theme,
  RandVocabulary vocabulary,
) {
  final pool = _nounsOf(language, theme, vocabulary);
  final placeless = data.traits?[NounTrait.placeless];

  if (placeless == null) return pool;

  final key = '${language.name}:${theme.name}:${vocabulary.name}';
  final cached = _placePoolCache[key];

  if (cached != null) {
    return cached;
  }

  final lexicon = wordData[language]!;
  final usable = pool
      .where((entry) => !placeless.contains(_plain(lexicon, entry)))
      .toList(growable: false);
  final narrowed = usable.isEmpty ? pool : usable;

  _placePoolCache[key] = narrowed;

  return narrowed;
}

/// The noun a sentence's subject is already decided to be, for the groups to be
/// chosen against: a word the caller required or the story pinned, or the topic
/// a later sentence names again, stands a pronoun for, or drops — a fish that is
/// left unsaid is still a fish. Null where the subject is still to be drawn.
String? _subjectNounOf(SentenceFrame frame, _Plan plan, _Follow? follow) {
  final required = _requiredAt(frame, plan, _subjectSlotOf(frame));

  if (required != null) return required.word;

  return follow != null && follow.reference != _Reference.fresh ? follow.topic.noun : null;
}

/// Whether a verb group takes a noun of this theme as its object.
bool _acceptsObject(VerbGroup group, WordTheme theme) {
  if (!(group.object?.contains(themeClass[theme]) ?? false)) return false;

  return group.objectThemes == null || group.objectThemes!.contains(theme);
}

/// Whether a verb group takes this noun as its object, by what the noun is:
/// the same question [_acceptsNoun] asks of the subject. `sips` takes a liquid,
/// `chews` takes none, and `roasts` takes something raw.
bool _acceptsObjectNoun(SentenceLanguageData data, VerbGroup group, String noun) {
  final wanted = group.objectTraits;
  final barred = group.objectWithout;

  if (wanted == null && barred == null) return true;

  final traits = _traitsOf(data, noun);

  if (wanted != null && !wanted.any(traits.contains)) return false;

  return barred == null || !barred.any(traits.contains);
}

/// The object pool without the story's other thing: a prop is never the item
/// and the item never the prop. The whole pool where nothing else is left.
WordPool _objectPoolAvoiding(
  WordLanguage language,
  SentenceLanguageData data,
  Object group,
  WordTheme theme,
  RandVocabulary vocabulary,
  List<String> avoid,
) {
  final pool = _objectPoolFor(language, data, group, theme, vocabulary);

  if (avoid.isEmpty) return pool;

  final lexicon = wordData[language]!;
  final kept = pool
      .where((entry) => !avoid.contains(_plain(lexicon, entry)))
      .toList(growable: false);

  return kept.isEmpty ? pool : kept;
}

/// The nouns of a theme a group's object may be drawn from.
WordPool _objectPoolFor(
  WordLanguage language,
  SentenceLanguageData data,
  Object group,
  WordTheme theme,
  RandVocabulary vocabulary,
) {
  final pool = _nounsOf(language, theme, vocabulary);

  if (group is! VerbGroup || (group.objectTraits == null && group.objectWithout == null)) {
    return pool;
  }

  final byTheme = _objectPoolCache.putIfAbsent(group, () => <String, WordPool>{});
  final key = '${theme.name}:${vocabulary.name}';
  final cached = byTheme[key];

  if (cached != null) return cached;

  final lexicon = wordData[language]!;
  final usable = pool
      .where((entry) => _acceptsObjectNoun(data, group, _plain(lexicon, entry)))
      .toList(growable: false);

  byTheme[key] = usable;

  return usable;
}

/// The themes a verb group's object may come from: its classes, narrowed to the
/// themes it names when it names any, and to the story's item when there is one.
List<WordTheme> _objectThemesOf(
  WordLanguage language,
  SentenceLanguageData data,
  VerbGroup group,
  _BeatDraw? beat,
  RandVocabulary vocabulary,
) {
  final item = beat?.item;
  final named = group.objectThemes;
  final byTheme =
      item != null
          ? (_acceptsObject(group, item) ? <WordTheme>[item] : const <WordTheme>[])
          : named == null
          ? _themesForClasses(wordThemes, group.object ?? const <NounClass>[])
          : _themesForClasses(
            wordThemes,
            group.object ?? const <NounClass>[],
          ).where(named.contains).toList(growable: false);

  // A group that asks for a trait is only worth a theme that has a noun with it.
  if (group.objectTraits == null && group.objectWithout == null) return byTheme;

  return byTheme
      .where((theme) => _objectPoolFor(language, data, group, theme, vocabulary).isNotEmpty)
      .toList(growable: false);
}

/// The same, for a shape headed by an adjective rather than a verb.
List<StateGroup> _stateGroupsFor(
  WordLanguage language,
  SentenceLanguageData data,
  RandVocabulary vocabulary,
  List<WordTheme> themes,
  SentenceFrame frame,
  _Plan plan, [
  _BeatDraw? beat,
]) {
  final subject = _requiredAt(frame, plan, SentenceSlot.subject);
  final state = _requiredAt(frame, plan, SentenceSlot.state);

  return data.states
      .where((group) {
        if (state != null && !group.words.contains(state.word)) return false;

        // A story's description says what is true of the hero just now, and a
        // plain trait where nothing is: `배고프다` where the hero is hungry, and
        // never `배부르다` there.
        if (beat != null && beat.describes && group.condition != beat.condition) return false;

        final subjectTheme = subject?.theme;

        if (subjectTheme != null &&
            !_acceptsSubject(group.subject, group.subjectThemes, subjectTheme)) {
          return false;
        }

        return _subjectThemesOf(language, data, group, themes, vocabulary).isNotEmpty;
      })
      .toList(growable: false);
}

/* --- Building one sentence ------------------------------------------------- */

/// A person's name, and the gender whatever agrees with it has to agree with.
class _Named {
  const _Named(this.text, this.gender);

  final String text;
  final WordGender? gender;
}

class _Phrase {
  const _Phrase(this.text, this.noun, this.theme);

  final String text;
  final String noun;
  final WordTheme? theme;
}

class _Built {
  const _Built(
    this.sentence,
    this.phrases,
    this.slots,
    this.names,
    this.used,
    this.type,
    this.theme,
    this.subject,
    this.gender,
    this.named,
    this.scene,
    this.field,
    this.dayAt,
    this.object,
  );

  final String sentence;
  final List<String> phrases;
  final List<SentenceSlot> slots;

  /// The person names this sentence was written with, in order.
  final List<String> names;

  /// The predicates and adverbials it used, in their plain form.
  final List<String> used;

  /// What this sentence is doing.
  final SentenceType type;
  final WordTheme? theme;

  /// The subject noun as written, which is what the next sentence carries on
  /// about.
  final String? subject;

  /// Its gender, for the pronoun and the agreement of whatever follows.
  final WordGender? gender;

  /// The nouns this sentence put on the page that a later one keeps: where it is
  /// happening, and what it is about beside its subject.
  ///
  /// A paragraph whose place changes every line is not one paragraph.
  final Map<SentenceSlot, _Requirement> scene;

  /// Whether that subject is a person's name.
  final bool named;

  /// The field its verb came from, for a story to know what it did.
  final VerbField? field;

  /// The phase of the day it named, as an index into `times.day`, or `-1`.
  final int dayAt;

  /// The object noun this sentence wrote, and whether it named it or stood a
  /// pronoun for it — or left it out, which is a pronoun that writes nothing.
  final ({String noun, bool named})? object;
}

/// The article a phrase opens with, by the noun's gender and the word after it.
String _articleFor(SentenceLanguageData data, WordGender? gender, String next) {
  final articles = data.articles;

  if (articles == null) return '';

  final rules = articles[gender ?? WordGender.n] ?? articles[WordGender.n];

  if (rules == null) return '';

  final lower = next.toLowerCase();

  for (final rule in rules) {
    if (lower.startsWith(rule[0])) return rule[1];
  }

  return '';
}

/// A word as a sentence writes it — English stores its pools capitalized.
String _plain(WordLanguageData data, String word) =>
    data.capitalize ? word.substring(0, 1).toLowerCase() + word.substring(1) : word;

/// The other way round, for looking a written word back up in the pools.
String _asPool(WordLanguageData data, String word) => data.capitalize ? _upper(word) : word;

String _upper(String word) =>
    word.isEmpty ? word : word.substring(0, 1).toUpperCase() + word.substring(1);

/// Build one noun phrase: an article where the language uses one, the noun, and
/// a modifier on the side the language's own frames put it.
///
/// [min] and [max] are what the whole phrase has to land in. The article is
/// reserved before the noun is drawn — its length is not known until the noun's
/// gender is, so the longest one the language has is what gets set aside — and
/// whatever the noun leaves over is what the modifier is drawn to fit.
_Phrase _nounPhrase(
  WordLanguage language,
  SentenceLanguageData data,
  WordTheme theme, {
  required String? forced,
  required bool modify,
  required bool bare,
  required String? forcedModifier,
  required int invent,
  required String prefix,
  required int min,
  required int max,
  required LengthRange nouns,
  required String count,
  // The theme the modifier is chosen for, which is the noun's own — or null for
  // a word no pool holds, which takes any modifier the language has.
  required WordTheme? described,
  // The nouns to draw from, when the group has narrowed them: a flier for a
  // verb that takes off. The theme's whole pool otherwise.
  WordPool? only,
  RandVocabulary vocabulary = RandVocabulary.full,
}) {
  final lexicon = wordData[language]!;
  final pool = only ?? _nounsOf(language, theme, vocabulary);
  final space = data.space.length;
  // Measured against the base forms, because the noun that decides the gender
  // has not been drawn yet; the modifier itself is chosen from the agreed pool.
  final modifiers = poolBounds(_modifiersFor(language, described, null));
  final article = bare ? const LengthRange(0, 0) : _articleSpan(data);
  final overhead = article.max == 0 ? 0 : article.max + space;
  final modCost = modify ? modifiers.min + space : 0;
  final high = _atLeast(1, _atMost(nouns.max, max - overhead - modCost));
  final low = _atLeast(1, min - overhead - (modify ? modifiers.max + space : 0));
  final drawn =
      forced ??
      _plain(lexicon, drawWord(lexicon, pool, invent, low < high ? low : high, high, prefix).word);
  final gender = genderOf(lexicon, _asPool(lexicon, drawn));
  final parts = <String>[drawn];

  if (modify) {
    final room = max - overhead - drawn.length - space;
    final want = min - overhead - drawn.length - space;
    final agreed = _modifiersFor(language, described, gender);
    final modifier =
        forcedModifier != null
            ? agree(lexicon, forcedModifier, gender)
            : _plain(
              lexicon,
              pickWord(
                    agreed,
                    _atLeast(1, _atMost(want, room)),
                    _atLeast(1, _atMost(modifiers.max, room)),
                    '',
                  ) ??
                  pick(agreed),
            );

    if (modifierFollows(lexicon)) {
      parts.add(modifier);
    } else {
      parts.insert(0, modifier);
    }
  }

  // A counted phrase writes its number where the language puts it — behind the
  // noun in Korean, Japanese and Chinese, in front of it in Vietnamese, where the
  // classifier comes with it.
  if (count.isNotEmpty) {
    if (data.numeral?.order == NumeralOrder.before) {
      parts.insert(0, count);
    } else {
      parts.add(count);
    }
  }

  final written = bare ? '' : _articleFor(data, gender, parts[0]);
  // An elided article carries its own boundary — `l'orso`, never `l' orso`.
  final text =
      written.endsWith("'")
          ? written + parts.join(data.space)
          : <String>[if (written.isNotEmpty) written, ...parts].join(data.space);

  return _Phrase(
    text,
    drawn,
    // Compared in the form the sentence writes rather than the form the pool
    // stores, which is the same word for every language but English.
    pool.any((entry) => _plain(lexicon, entry) == drawn)
        ? theme
        : themeOf(lexicon, _asPool(lexicon, drawn)),
  );
}

int _atLeast(int floor, int value) => value < floor ? floor : value;

int _atMost(int ceiling, int value) => value > ceiling ? ceiling : value;

/// A person's name for a phrase that has room for one, and the gender it carries.
///
/// A bare given name rather than a full one: a sentence about someone uses the
/// name they are called by, and `randName`'s default would put a surname in
/// every clause. The gender is the one the name was drawn for, translated into
/// the gender a modifier and a predicate agree with — and carried even by a
/// language whose words agree with nothing, because a pronoun still has to pick
/// between `he` and `she`.
_Named _properName(WordLanguage language, _Settings settings, String prefix) {
  // No length range, on purpose. `randName` reads one as a licence to change the
  // name's structure: a CJK given name is stretched to fill a range longer than
  // its real ones, and an alphabetic language writes a second given name where
  // one will not reach — `한진혜미유효영지경혜연림정` and `Annette Tanja`, each of
  // them one person. Both are the name generator answering a caller who asked
  // for a length; a sentence is asking for a name. `_nameSpan` is what the
  // budget measured this phrase against, and an unsteered draw is what fits it.
  final drawn = drawName(
    NameLanguage.values.byName(language.name),
    includeSurname: false,
    realism: settings.realism,
    startsWith: prefix,
  );

  return _Named(drawn.native, drawn.gender == NameGender.male ? WordGender.m : WordGender.f);
}

/// How long a given name of the language can be, which is what a phrase reserves.
LengthRange _nameSpan(WordLanguage language) =>
    nameLengthRange(language: NameLanguage.values.byName(language.name), includeSurname: false);

/// The particle a part writes after its phrase, in the form the phrase asks for.
String _tailOf(SentencePart part, String phrase) {
  final liquid = part.tailLiquid;

  if (liquid != null && endsWithLiquid(phrase)) return liquid;

  final alt = part.tailAlt;

  if (alt != null && endsWithConsonant(phrase)) return alt;

  return part.tail ?? '';
}

/// How often a noun phrase carries a modifier on this attempt.
///
/// The first attempt leaves it to chance; after that, a sentence that overshot
/// the range drops its modifiers and one that fell short takes them everywhere,
/// which is how the length range picks the shape rather than truncating a word.
int _modifyChanceFor(int distance, bool tooLong, bool storied) {
  if (distance == 0) return storied ? _storyModifyChance : _modifyChance;

  return tooLong ? 0 : 100;
}

/// The theme a phrase other than the subject draws from.
/// Where a subject can go, and where a story happens. `place` alone, and not
/// the two other themes of its class: a hero can walk to the market and not to
/// Pluto, and a sky is not somewhere a fox goes. A `place` part on its own
/// still spans the class, because a fox can sleep under a sky.
const List<WordTheme> _destinationThemes = <WordTheme>[WordTheme.place];

WordTheme _themeForPart(
  WordLanguage language,
  SentenceLanguageData data,
  SentenceSlot slot,
  VerbGroup? group,
  List<WordTheme> themes,
  _BeatDraw? beat,
  RandVocabulary vocabulary,
) {
  if (slot == SentenceSlot.object || slot == SentenceSlot.quantity) {
    final usable =
        group == null
            ? const <WordTheme>[]
            : _objectThemesOf(language, data, group, beat, vocabulary);

    return pick(usable.isNotEmpty ? usable : wordThemes);
  }

  if (slot == SentenceSlot.destination) return pick(_destinationThemes);

  // A story happens somewhere a story can happen — a market, a park — and not
  // on Pluto, which is a place too as far as the classes know.
  final places = beat?.places ?? _themesForClasses(wordThemes, const <NounClass>[NounClass.place]);

  return pick(places.isNotEmpty ? places : themes);
}

/// A word reshaped by ordered `[ending, replacement]` rules for a gender — the
/// same shape `word/data`'s agreement takes, applied to whatever pool a language
/// says agrees. Russian's past verbs are the reason it is its own function.
String _agreeBy(WordAgreement rules, String word, WordGender? gender) {
  final chosen = gender == null ? null : rules[gender];

  if (chosen == null) return word;

  for (final rule in chosen) {
    if (word.endsWith(rule[0])) {
      return word.substring(0, word.length - rule[0].length) + rule[1];
    }
  }

  return word;
}

/// Fill a shape and write it out.
///
/// The predicate is settled first, because it is what decides which nouns can
/// stand beside it. The phrases themselves are then drawn in the order the frame
/// gives, each one against the room left once the phrases behind it have
/// reserved their shortest — which is how a narrow range drops a modifier rather
/// than overshooting a word, and how the subject's gender is in hand before the
/// adjective that has to agree with it.
_Built _compose(
  WordLanguage language,
  SentenceLanguageData data,
  SentenceFrame frame,
  _Plan plan,
  List<WordTheme> requested,
  _Settings settings,
  int modifyChance,
  Map<SentenceSlot, LengthRange> bounds,
  LengthRange modifierBounds,
  int min,
  int max,
  _Draw draw,
) {
  final follow = draw.follow;
  final beat = draw.beat;
  final lexicon = wordData[language]!;
  final themes = requested.isNotEmpty ? requested : wordThemes;
  // A shape with a `state` part is headed by one and a shape with a `verb` part
  // by that; a shape with neither is a copular one, which equates its subject to
  // the date or the clock it carries and takes the language's copula for a
  // predicate.
  final copular =
      !frame.parts.any((part) => part.slot == SentenceSlot.state || part.slot == SentenceSlot.verb);
  final headed = copular || frame.parts.any((part) => part.slot == SentenceSlot.state);
  // A shape whose predicate has nothing to say about the requested subject only
  // gets this far when no shape of the language did, so the fallback is the same
  // best effort every other narrowing here makes.
  final states =
      copular
          ? <StateGroup>[data.calendar!.copula]
          : headed
          ? _stateGroupsFor(language, data, settings.vocabulary, themes, frame, plan, beat)
          : const <StateGroup>[];
  final verbs =
      headed
          ? const <VerbGroup>[]
          : _verbGroupsFor(
            language,
            data,
            settings.vocabulary,
            frame,
            themes,
            plan,
            beat,
            _subjectNounOf(frame, plan, follow),
          );
  final StateGroup? stateGroup = headed ? pick(states.isNotEmpty ? states : data.states) : null;
  final VerbGroup? verbGroup =
      headed
          ? null
          : pick(
            verbs.isNotEmpty
                ? verbs
                : data.verbs
                    .where(
                      (group) =>
                          (group.object != null) == _takesObject(frame) &&
                          (group.requires == null ||
                              frame.parts.any((part) => part.slot == group.requires)) &&
                          (!frame.parts.any((part) => part.slot == SentenceSlot.destination) ||
                              group.requires == SentenceSlot.destination),
                    )
                    .toList(growable: false),
          );
  // The same predicates, in the form this type of sentence ends on, in the tense
  // the result is in — or in the form that links a first clause to the one after
  // it. Index-aligned with the plain words, which is what lets a required word be
  // translated rather than written out in the wrong form.
  final base = stateGroup?.words ?? verbGroup!.words;
  final predicates = _formOf(
    stateGroup,
    verbGroup,
    draw.mark,
    draw.style,
    draw.tense,
    draw.link == JoinSide.first ? data.join : null,
  );
  final Object group = stateGroup ?? verbGroup!;
  final subjectThemes = _subjectThemesOf(language, data, group, themes, settings.vocabulary);
  // Which part is the subject is the shape's business, not the slot's: a counted
  // shape has no `subject` part and its quantity is the subject.
  final subjectSlot = _subjectSlotOf(frame);
  final subjectRequired = _requiredAt(frame, plan, subjectSlot);
  // A theme the caller named is honoured even when no verb group of the language
  // has anything to say about it. Written out: `??` would otherwise infer `pick`'s
  // type argument from the nullable left-hand side, and hand back a `WordTheme?`.
  final WordTheme subjectTheme =
      subjectRequired?.theme ?? pick<WordTheme>(subjectThemes.isNotEmpty ? subjectThemes : themes);
  // A sentence carrying on about the topic stands a pronoun where its subject
  // would go, and the languages that drop their subject stand nothing there at
  // all — in which case the phrase is not in the shape to carry an article, a
  // modifier or a particle. The second clause of one sentence shares the first
  // one's subject and writes nothing where it would stand, the way a dropped
  // subject does. `at` is the index back into the frame, which the plan is keyed
  // by.
  final String? pronoun =
      draw.link == JoinSide.second
          ? ''
          : draw.speech != null
          ? draw.speech!.subject
          : follow?.reference == _Reference.pronoun
          ? follow!.pronoun
          : null;
  // And the object the sentence before named is referred to rather than named
  // again, where this shape puts the same noun in its object slot: left out, or
  // stood a pronoun for where the object would go or in front of the verb.
  final objectRequired = _requiredAt(frame, plan, SentenceSlot.object);
  final reference =
      draw.object != null && objectRequired?.word == draw.object!.noun ? draw.object : null;
  final referredOut = reference != null && (reference.text.isEmpty || reference.clitic);
  final shape = <SentencePart>[];
  final at = <int>[];

  for (var i = 0; i < frame.parts.length; i += 1) {
    final part = frame.parts[i];

    if (part.slot == SentenceSlot.object && referredOut) continue;

    // A line is said in its own time, so it names none: `“배고프다.”`, not
    // `“한낮에 배고프다.”` — where `“부엌에서 열쇠를 찾았어!”` is what somebody says.
    if (draw.spoken && part.slot == SentenceSlot.time) continue;

    if (part.slot != SentenceSlot.subject || pronoun == null || pronoun.isNotEmpty) {
      shape.add(part);
      at.add(i);
    }
  }

  // Only a shape that opens on a noun phrase with nothing in front of it can
  // honour `startsWith`; anywhere else the sentence opens on an article, a
  // preposition or an adverbial, and `collect` filters what does not match.
  final first = shape.first;
  final prefixable =
      follow == null && _isNounSlot(first.slot) && first.head == null && data.articles == null;
  final space = data.space.length;
  final opener = draw.link == JoinSide.second ? '' : draw.opener;
  // The first clause of a two-clause sentence closes on nothing: the mark, the
  // tag and the quotation marks all belong to the whole sentence, and the second
  // clause carries them.
  final closes = draw.link != JoinSide.first;
  final close = closes ? data.terminators[draw.mark]! : '';
  final open = data.openers[draw.mark] ?? '';
  // The quotation marks belong to the whole sentence too, but one goes on each
  // end of it: a two-clause line opens its quote on the first clause and closes
  // it on the second — `“시장에 가서 빵을 샀어.”`
  final quoteOpen = draw.link == JoinSide.second ? '' : (draw.quote?[0] ?? '');
  final quoteClose = closes ? (draw.quote?[1] ?? '') : '';
  final tag = closes && frame.tag != null ? data.space + frame.tag! : '';
  final past = draw.tense == SentenceTense.past;
  // What the language writes beside a verb that does not change for the past:
  // Vietnamese `đã` in front of it, Chinese `了` behind it.
  final mark = past && verbGroup != null && verbGroup.past == null ? data.pastMark : null;
  // Every phrase's theme is settled before any of them is drawn, because a length
  // budget is only as good as the pools it was measured against.
  final partThemes = <WordTheme?>[
    for (var i = 0; i < shape.length; i += 1)
      !_isNounSlot(shape[i].slot)
          ? null
          : shape[i].slot == subjectSlot
          ? subjectTheme
          : (plan.phrase[at[i]]?.theme ??
              _themeForPart(
                language,
                data,
                shape[i].slot,
                verbGroup,
                themes,
                beat,
                settings.vocabulary,
              )),
  ];
  // What a phrase writes instead of a noun phrase, when it writes one at all: a
  // pronoun standing in for the topic, the name a repeat carries forward, or a
  // fresh name for a phrase about a person. `''` marks the one that has to be
  // drawn against the room it is given.
  final proper = <String?>[
    for (var i = 0; i < shape.length; i += 1)
      () {
        final part = shape[i];

        if (part.slot == SentenceSlot.subject && pronoun != null && pronoun.isNotEmpty) {
          return pronoun;
        }

        if (part.slot == SentenceSlot.object && reference != null && !referredOut) {
          return reference.text;
        }

        if (part.slot == SentenceSlot.subject &&
            follow?.reference == _Reference.repeat &&
            follow!.topic.named) {
          return follow.topic.noun;
        }

        // A word the caller required holds its place against all of this.
        if (plan.phrase.containsKey(at[i])) return null;

        // A person is one person. `서호 3명` counts somebody's name, which is not
        // a thing a sentence says.
        if (part.slot == SentenceSlot.quantity) return null;

        final theme = partThemes[i];

        // A name stands where a person would — and, outside the subject, only
        // beside a subject that is a person too: 성재 meets 유하, and a fox meets
        // the baker.
        final personSubject =
            themeClass[subjectTheme] == NounClass.person ||
            follow?.topic.nounClass == NounClass.person;

        // Never for somebody the story never introduced.
        return (settings.includeName ?? false) &&
                !(draw.beat?.nameless ?? false) &&
                theme != null &&
                themeClass[theme] == NounClass.person &&
                (part.slot == subjectSlot || personSubject)
            ? ''
            : null;
      }(),
  ];
  final parts = <SentencePart>[
    for (var i = 0; i < shape.length; i += 1)
      proper[i] == null
          // A story names its hero once with whatever describes them and then
          // leaves the name alone; a word required bare — home, which no modifier
          // fits — is left alone too.
          ? ((beat != null &&
                      shape[i].slot == subjectSlot &&
                      follow?.reference == _Reference.repeat) ||
                  (plan.phrase[at[i]]?.bare ?? false) ||
                  (plan.phrase[at[i]]?.settled ?? false))
              ? SentencePart(
                shape[i].slot,
                head: shape[i].head,
                pastHead: shape[i].pastHead,
                tail: shape[i].tail,
                tailAlt: shape[i].tailAlt,
                tailLiquid: shape[i].tailLiquid,
                bare: shape[i].bare,
                copula: shape[i].copula,
              )
              : shape[i]
          : SentencePart(
            shape[i].slot,
            head: shape[i].head,
            pastHead: shape[i].pastHead,
            tail: shape[i].tail,
            tailAlt: shape[i].tailAlt,
            tailLiquid: shape[i].tailLiquid,
            bare: true,
          ),
  ];
  // The same for the predicate: `bounds` spans every group the language has, and
  // one sentence draws from one of them. A word the caller required is narrower
  // still — its length is not a range at all, and neither is a pronoun's.
  final partBounds = <Map<SentenceSlot, LengthRange>>[];
  final partModifier = <LengthRange>[];

  for (var i = 0; i < parts.length; i += 1) {
    final part = parts[i];
    final required = plan.phrase[at[i]];
    final String? word = (proper[i] != null && proper[i]!.isNotEmpty) ? proper[i] : required?.word;
    final exact = word == null ? null : LengthRange(word.length, word.length);
    final own = Map<SentenceSlot, LengthRange>.from(bounds);
    final owed = plan.modifier[at[i]];
    final theme = partThemes[i];

    if (theme != null) {
      // A name that has still to be drawn is budgeted against the given names of
      // the language rather than against its nouns.
      own[part.slot] =
          exact ??
          (proper[i] == ''
              ? _nameSpan(language)
              : _nounSpan(language, theme, settings.invent, settings.vocabulary));
      // A word no pool holds is described by any modifier; a noun by the ones
      // that fit what it is.
      final described = required != null && !required.known ? null : theme;

      partModifier.add(
        owed == null
            ? poolBounds(_modifiersFor(language, described, null))
            : LengthRange(owed.word.length, owed.word.length),
      );
    } else {
      if (part.slot == SentenceSlot.verb || part.slot == SentenceSlot.state) {
        own[part.slot] = exact ?? poolBounds(predicates);
      } else if (exact != null) {
        own[part.slot] = exact;
      }

      partModifier.add(modifierBounds);
    }

    partBounds.add(own);
  }

  final spans = <LengthRange>[
    for (var i = 0; i < parts.length; i += 1)
      () {
        final range = _partRange(parts[i], data, partBounds[i], partModifier[i]);
        final gap = i == 0 ? 0 : space;

        return LengthRange(gap + range.min, gap + range.max);
      }(),
  ];
  final written = <String>[];
  final reported = <String>[];
  final slots = <SentenceSlot>[];
  final names = <String>[];
  final spent = <String>[];
  final drawn = <SentenceSlot, _Phrase>{};
  _Phrase? subject;
  var named = false;
  // The phase of the day this sentence named, if it named one.
  var dayAt = -1;
  // A pronoun says nothing about its own gender, and neither does a name carried
  // over, so what agrees with either agrees with the noun it stands for.
  var carriesName = false;

  for (var i = 0; i < proper.length; i += 1) {
    final word = proper[i];

    if (word != null && word.isNotEmpty && parts[i].slot == SentenceSlot.subject) {
      carriesName = true;
    }
  }

  WordGender? gender = pronoun != null || carriesName ? follow?.topic.gender : null;
  // A clitic is written in front of the verb, and paid for here because it
  // belongs to no part's share of the range.
  final clitic = reference != null && reference.clitic ? reference.text : '';
  var used =
      close.length +
      open.length +
      tag.length +
      quoteOpen.length +
      quoteClose.length +
      (opener.isEmpty ? 0 : opener.length + space) +
      (clitic.isEmpty ? 0 : clitic.length + space);

  if (opener.isNotEmpty) written.add(data.capitalize ? _upper(opener) : opener);

  for (var i = 0; i < parts.length; i += 1) {
    final part = parts[i];
    var restMin = 0;
    var restMax = 0;

    for (var rest = i + 1; rest < parts.length; rest += 1) {
      restMin += spans[rest].min;
      restMax += spans[rest].max;
    }

    final gap = i == 0 ? 0 : space;
    // A state group may bring its own copula, which wins over the shape's; a head
    // that carries the tense changes for the past, and agrees with the subject
    // where the language's past does (Russian `был` beside `была`).
    // A degree stands between the copula and the state it measures — `is very
    // tired`, `está muy cansado` — so whatever the state part would have written
    // in front of itself is written in front of the degree instead.
    final stateAt = parts.indexWhere((entry) => entry.slot == SentenceSlot.state);
    final measured = part.slot == SentenceSlot.degree && stateAt == i + 1;
    final SentencePart? headOf =
        part.slot == SentenceSlot.state && i > 0 && parts[i - 1].slot == SentenceSlot.degree
            ? null
            : measured
            ? parts[stateAt]
            : part;
    final own = headOf?.slot == SentenceSlot.state ? stateGroup : null;
    final ownHead = own?.head ?? headOf?.head;
    // The first and the second person take their own copula where the language
    // has one: `I am`, `are you`, `bist du`, `estás` — wherever the shape writes
    // the state's copula, which is in front of the state in a statement and in
    // front of the subject in a question.
    final speech = draw.speech;
    final copular =
        headed &&
        ownHead != null &&
        (headOf?.slot == SentenceSlot.state || headOf?.slot == SentenceSlot.subject);
    final String? presentHead;

    if (speech != null && copular) {
      presentHead = speech.heads?[ownHead] ?? speech.head ?? ownHead;
    } else {
      presentHead = ownHead;
    }
    final pastHead = own?.pastHead ?? headOf?.pastHead;
    final tensedHead = past && pastHead != null ? pastHead : presentHead;
    final agreement = data.pastAgreement;
    var partHead =
        past && pastHead != null && agreement != null && tensedHead != null
            ? _agreeBy(agreement, tensedHead, gender)
            : tensedHead;
    final headCost = (partHead == null ? 0 : partHead.length + space) + _copulaSpan(part, data).min;
    final overhead = gap + headCost + _tailMin(part);
    final high = _atLeast(1, max - used - overhead - restMin);
    final low = _atLeast(1, min - used - overhead - restMax);
    String phrase;

    if (part.slot == SentenceSlot.money) {
      phrase = _moneyText(data);
    } else if (proper[i] != null) {
      if (proper[i]!.isNotEmpty) {
        phrase = proper[i]!;
      } else {
        final drawnName = _properName(
          language,
          settings,
          prefixable && i == 0 ? settings.prefix : '',
        );

        phrase = drawnName.text;
        names.add(drawnName.text);

        if (part.slot == SentenceSlot.subject) gender = drawnName.gender;
      }

      if (part.slot == SentenceSlot.subject) named = true;
    } else if (_isNounSlot(part.slot)) {
      final required = plan.phrase[at[i]];
      final owed = plan.modifier[at[i]];
      final theme = partThemes[i]!;
      final nouns = partBounds[i][part.slot]!;
      final article = part.bare ? const LengthRange(0, 0) : _articleSpan(data);
      final counted = part.slot == SentenceSlot.quantity ? _countSpan(data).max : 0;
      final room = high - nouns.min - counted;
      // A phrase whose share of the range is longer than any noun of its theme
      // takes a modifier whatever the roll says.
      final needed = low > (article.max == 0 ? 0 : article.max + space) + nouns.max;
      final modify =
          part.slot != SentenceSlot.quantity &&
          part.modifiable &&
          (owed != null || needed || (room >= modifierBounds.min + space && chance(modifyChance)));
      final built = _nounPhrase(
        language,
        data,
        theme,
        forced: required?.word,
        modify: modify,
        bare: part.slot == SentenceSlot.quantity || part.bare,
        forcedModifier: owed?.word,
        invent: settings.invent,
        prefix: prefixable && i == 0 ? settings.prefix : '',
        min: low,
        max: high,
        nouns: nouns,
        count: part.slot == SentenceSlot.quantity ? _countText(data, theme) : '',
        described: required != null && !required.known ? null : theme,
        only:
            part.slot == subjectSlot
                ? _subjectPoolFor(language, data, group, theme, settings.vocabulary)
                : part.slot == SentenceSlot.object
                ? _objectPoolAvoiding(
                  language,
                  data,
                  group,
                  theme,
                  settings.vocabulary,
                  beat?.avoid ?? const <String>[],
                )
                : part.slot == SentenceSlot.place || part.slot == SentenceSlot.destination
                ? _placePoolFor(language, data, theme, settings.vocabulary)
                : null,
        vocabulary: settings.vocabulary,
      );

      phrase = built.text;

      // A place takes the preposition it takes — `on the balcony`, `at the
      // market`, `under the sky` — where the language says so, and the frame's
      // own otherwise. The budget was measured against the frame's, so the
      // difference is paid here.
      if (part.slot == SentenceSlot.place && partHead != null) {
        final own = _placeHeadFor(data, built.noun);

        if (own != null && own != partHead) {
          used += own.length - partHead.length;
          partHead = own;
        }
      }

      if (part.slot == subjectSlot) {
        subject = built;
        gender = genderOf(lexicon, _asPool(lexicon, built.noun));
      }

      // A place is where the result is happening, an object is what it is about
      // and a destination is where it is going, so all three are kept for the
      // sentences that follow.
      if (part.slot == SentenceSlot.place ||
          part.slot == SentenceSlot.object ||
          part.slot == SentenceSlot.destination) {
        drawn[part.slot] = built;
      }
    } else {
      final predicate = _predicateFor(
        part.slot,
        lexicon,
        data,
        base,
        predicates,
        plan.phrase[at[i]],
        gender,
        low,
        high,
        draw.avoid,
        draw.tense,
        draw.dayAt,
        // The first sentence of a result may set its scene in any time it likes;
        // the ones after it only move the day forward.
        follow == null && draw.link != JoinSide.second,
        themeClass[subjectTheme]!,
        draw.beat != null,
        verbGroup?.field,
      );

      phrase = predicate.text;

      if (predicate.base.isNotEmpty) spent.add(predicate.base);
      if (predicate.dayAt >= 0) dayAt = predicate.dayAt;

      // A past-tense verb in a language whose verb does not change is written
      // with the language's own mark beside it — once per sentence, so the second
      // clause of one goes without — and one whose verb agrees with its subject in
      // the past is agreed with it.
      if (part.slot == SentenceSlot.verb && past) {
        if (mark?.head != null && draw.link != JoinSide.second) {
          phrase = mark!.head! + data.space + phrase;
        }

        if (mark?.tail != null) phrase += mark!.tail!;

        if (agreement != null && verbGroup?.past != null) {
          phrase = _agreeBy(agreement, phrase, gender);
        }
      }
    }

    // The opening capital belongs to whatever is written first, and that is the
    // phrase itself unless a connective or a preposition stands in front of it.
    // The second clause of a sentence carries on from the first, so it opens on
    // nothing. The copula is written onto this phrase rather than beside it, on
    // whichever side the language puts it.
    final copula = part.copula == null ? '' : _oneOf(pick(predicates));
    final opens = data.capitalize && written.isEmpty && draw.link != JoinSide.second;
    // A clitic goes in front of the verb, after whatever else stands there —
    // Spanish `la comió` — and is reported with neither, the way a particle is.
    final headText = <String>[
      if (part.copula == CopulaSide.head) copula,
      if (partHead != null) partHead,
      if (part.slot == SentenceSlot.verb && clitic.isNotEmpty) clitic,
    ].join(data.space);
    final head = headText.isEmpty ? null : (opens ? _upper(headText) : headText);
    final text = opens && headText.isEmpty ? _upper(phrase) : phrase;
    final tail = (part.copula == CopulaSide.tail ? copula : '') + _tailOf(part, text);

    if (head != null) written.add(head);

    written.add(text + tail);
    reported.add(text);
    slots.add(part.slot);
    used += gap + headCost + text.length + tail.length;

    if (proper[i] != null && proper[i]!.isEmpty && text != phrase) {
      names[names.length - 1] = text;
    }
  }

  // A sentence whose subject is a name carries that name forward; one whose
  // subject was dropped carries forward what it was already handed.
  final carried =
      named
          ? reported[slots.indexOf(SentenceSlot.subject)]
          : (subject?.noun ?? (pronoun != null && pronoun.isNotEmpty ? follow?.topic.noun : null));
  final scene = <SentenceSlot, _Requirement>{...?follow?.scene};

  drawn.forEach((slot, entry) {
    scene.putIfAbsent(
      slot,
      () => _Requirement(
        entry.noun,
        <SentenceSlot?>[slot],
        theme: entry.theme,
        known: entry.theme != null,
        // Described once, here, and never again.
        settled: true,
      ),
    );
  });

  return _Built(
    quoteOpen + open + written.join(data.space) + tag + close + quoteClose,
    reported,
    slots,
    names,
    spent,
    draw.type,
    named ? null : subject?.theme,
    carried,
    subject != null || named ? gender : (pronoun != null ? follow?.topic.gender : null),
    named || (pronoun != null && (follow?.topic.named ?? false)),
    scene,
    verbGroup?.field,
    dayAt,
    drawn.containsKey(SentenceSlot.object)
        ? (noun: drawn[SentenceSlot.object]!.noun, named: true)
        : reference != null
        ? (noun: reference.noun, named: false)
        : null,
  );
}

/// Which form a level writes for each mood, best first, in the tense the result
/// is in — or the form that links a first clause to the one after it.
///
/// The first clause of a two-clause sentence takes the form that links it to
/// the next, in a language that has one, and that form carries no tense, no
/// mood and no level of its own. The past has its own statement and its own
/// forms, and a level the past does not declare falls back along the same chain
/// to the past statement — never to the present. A group with no past at all is
/// one whose language marks it beside the verb, and it writes its present forms.
WordPool _formOf(
  StateGroup? stateGroup,
  VerbGroup? verbGroup,
  SentenceType mark,
  SentenceStyle style,
  SentenceTense tense,
  SentenceJoin? join,
) {
  final forms = stateGroup?.forms ?? verbGroup!.forms;
  final words = stateGroup?.words ?? verbGroup!.words;
  final linking = forms[PredicateForm.linking];

  if (join?.form == PredicateForm.linking && linking != null) {
    return linking.map(_oneOf).toList(growable: false);
  }

  final past = stateGroup?.past ?? verbGroup?.past;
  final tensedForms = tense == SentenceTense.past && past != null ? past.forms : forms;
  final tensedWords = tense == SentenceTense.past && past != null ? past.words : words;

  for (final key in _formChain[style]![mark]!) {
    final pool = tensedForms[key];

    if (pool != null) return pool.map(_oneOf).toList(growable: false);
  }

  return tensedWords;
}

/// What a phrase that is not a noun phrase writes, the word it is a form of, and
/// — for a time — which phase of the day it named, as an index into `times.day`.
class _Predicate {
  const _Predicate(this.text, this.base, this.dayAt);

  final String text;
  final String base;
  final int dayAt;
}

/// The manners something of this class can do this kind of thing in: the
/// groups for the class, narrowed to the ones that go with the verb's field
/// where they name any. The class alone failing that, and any of them failing
/// that.
WordPool _mannersFor(SentenceLanguageData data, NounClass subject, VerbField? field) {
  final byClass = data.manners.where((group) => group.subject.contains(subject)).toList();
  final byField =
      byClass
          .where(
            (group) => group.fields == null || (field != null && group.fields!.contains(field)),
          )
          .toList();
  final groups =
      byField.isNotEmpty
          ? byField
          : byClass.isNotEmpty
          ? byClass
          : data.manners;

  return <String>{for (final group in groups) ...group.words}.toList(growable: false);
}

/// When something happens, chosen against the tense and against where the
/// result has got to in its day.
///
/// A sentence that opens a result may set it in any time its tense allows: a
/// season, a habit, `yesterday` in the past and `these days` in the present. One
/// that follows another only moves the day forward — the next few phases of the
/// day, so a story that opened at dawn reaches noon before it reaches midnight.
_Predicate _timeFor(
  SentenceLanguageData data,
  SentenceTense tense,
  int dayAt,
  bool opens,
  Set<String> avoid,
  int min,
  int max,
  bool storied,
) {
  final times = data.times;
  final day = <String>[
    for (var at = 0; at < times.day.length; at += 1)
      if (at > dayAt && at <= dayAt + _dayStride) times.day[at],
  ];
  final tensed = tense == SentenceTense.past ? times.past : times.present;
  // A habit — `every day`, `요즘` — is a thing a lone sentence can say and a
  // story cannot: a story tells of the one time something happened.
  final habits = storied ? const <String>[] : times.habitual ?? const <String>[];
  final free = opens ? <String>[...times.any, ...?tensed, ...habits] : const <String>[];
  final pool = <String>[...day, ...free];
  final usable = pool.isNotEmpty ? pool : <String>[...times.day, ...times.any];
  final fits = usable
      .where((word) => !avoid.contains(word) && word.length >= min && word.length <= max)
      .toList(growable: false);
  final String drawn =
      fits.isNotEmpty ? pick(fits) : (pickWord(usable, min, max, '') ?? pick(usable));

  return _Predicate(drawn, drawn, times.day.indexOf(drawn));
}

/// The word a phrase that is not a noun phrase writes: the predicate, or an
/// adverb.
///
/// [avoid] holds what the result has already said, and the plain form is what it
/// holds: `끓습니까` and `끓어` are one verb said twice, so remembering the
/// written form would remember nothing. It is a preference and not a filter —
/// the range comes first, and a pool with nothing unused left inside it is drawn
/// from as it always was.
_Predicate _predicateFor(
  SentenceSlot slot,
  WordLanguageData wordData,
  SentenceLanguageData data,
  WordPool base,
  WordPool predicates,
  _Requirement? required,
  WordGender? gender,
  int min,
  int max,
  Set<String> avoid,
  SentenceTense tense,
  int dayAt,
  bool opens,
  NounClass subject,
  bool storied,
  VerbField? field,
) {
  String agreed(String word) =>
      slot == SentenceSlot.state && data.predicateAgrees ? agree(wordData, word, gender) : word;

  if (required != null) {
    // A word the caller named is named in the form a statement ends on, and the
    // form pools are index-aligned so that it can be said the other way instead.
    final at = base.indexOf(required.word);

    return _Predicate(
      agreed(at >= 0 && at < predicates.length ? predicates[at] : required.word),
      required.word,
      -1,
    );
  }

  if (slot == SentenceSlot.date) return _Predicate(_dateText(data), '', -1);
  if (slot == SentenceSlot.clock) return _Predicate(_clockText(data), '', -1);
  if (slot == SentenceSlot.time) {
    return _timeFor(data, tense, dayAt, opens, avoid, min < max ? min : max, max, storied);
  }

  final pool =
      slot == SentenceSlot.manner
          ? _mannersFor(data, subject, field)
          : slot == SentenceSlot.degree
          ? (data.degrees ?? const <String>[])
          : predicates;

  if (pool.isEmpty) return const _Predicate('', '', -1);

  // A predicate is a form of the word at the same index of the group; an
  // adverbial is written whole and is its own plain form.
  String plainly(int at) =>
      identical(pool, predicates) && at >= 0 && at < base.length ? base[at] : pool[at];
  final low = min < max ? min : max;
  final fresh = <String>[
    for (var at = 0; at < pool.length; at += 1)
      if (!avoid.contains(plainly(at)) && pool[at].length >= low && pool[at].length <= max)
        pool[at],
  ];
  final String drawn =
      fresh.isNotEmpty ? pick(fresh) : (pickWord(pool, low, max, '') ?? pick(pool));

  return _Predicate(agreed(drawn), plainly(pool.indexOf(drawn)), -1);
}

/// The themes a sentence may draw its subject from.
///
/// A sentence carrying on about a topic stays inside the topic's own class,
/// which is what makes a paragraph read as one rather than as three draws that
/// happened to land together.
List<WordTheme> _subjectThemesFor(_Settings settings, _Follow? follow) {
  final requested = settings.theme == null ? wordThemes : <WordTheme>[settings.theme!];
  // A name can only stand where a person would, so asking for one narrows the
  // subject to the themes that name people. A theme the caller named themselves
  // still wins — a request for animals with `includeName` is a sentence about a
  // lion, not about somebody the lion reminded us of.
  final wanted =
      (settings.includeName ?? false)
          ? _themesForClasses(requested, const <NounClass>[NounClass.person])
          : requested;
  final themes = wanted.isNotEmpty ? wanted : requested;

  if (follow == null) return themes;

  final topicClass = follow.topic.nounClass;

  if (topicClass == null) return themes;

  // A fresh subject is usually another noun of the topic's own theme rather than
  // of its wider class. The class is what a paragraph may not leave — a verb that
  // takes a creature takes every creature — but a paragraph that opens on a drink
  // and then works through every edible there is reads as a list of them.
  final own = follow.topic.theme;

  if (own != null && themes.contains(own) && chance(_themeChance)) return <WordTheme>[own];

  final inClass = _themesForClasses(themes, <NounClass>[topicClass]);

  return inClass.isNotEmpty ? inClass : themes;
}

_Built _generateOne(WordLanguage language, _Settings settings, _Draw draw) {
  final follow = draw.follow;
  final budget = draw.budget;
  final data = sentenceData[language]!;
  final bounds = _roomFor(language, settings.includeName);
  final modifierBounds = _modifierBounds[language]!;
  final allowed = _framesFor(data, settings, _moodFor(draw.mark), draw.beat);
  final requested = draw.beat?.subject ?? _subjectThemesFor(settings, follow);
  // The words a caller required go in the first sentence — once in the result
  // rather than once in every sentence of it.
  final requirements =
      follow != null
          ? const <_Requirement>[]
          : settings.include.map((word) => _classify(language, word)).toList(growable: false);
  // What the result has already put on the page and this sentence keeps: its
  // subject when the topic is being named again, and every noun of its scene.
  final pinned = <SentenceSlot, _Requirement>{...(follow?.scene ?? draw.beat?.pinned ?? const {})};

  if (follow?.reference == _Reference.repeat) {
    pinned[SentenceSlot.subject] = _Requirement(
      follow!.topic.noun,
      const <SentenceSlot?>[SentenceSlot.subject],
      theme: follow.topic.theme,
      known: follow.topic.theme != null,
    );
  }

  // The second clause of one sentence shares the first one's subject and writes
  // nothing where it would stand, the way a dropped subject does.
  if (draw.link == JoinSide.second) pinned.remove(SentenceSlot.subject);

  // A result that has reached the last phase of its day has no later one to
  // name, so a sentence after that carries no time at all rather than a wrong one.
  // And a sentence that opens on `later` or `잠시후` has said when already:
  // `잠시후 한낮에` says it twice.
  final spent = follow != null && draw.dayAt >= data.times.day.length - 1;
  final dated =
      draw.dated ||
      (data.connectives[ConnectiveKind.temporal] ?? const <String>[]).contains(draw.opener);
  final timeless =
      spent || dated
          ? allowed
              .where((frame) => !frame.parts.any((part) => part.slot == SentenceSlot.time))
              .toList(growable: false)
          : allowed;
  // A sentence that drops its subject and carries nothing else is one word —
  // `놀아요.`, `울어.` — and a paragraph with three of those in it reads as a
  // list. So one that will write no subject takes a shape with something beside
  // the predicate. A quoted line is the exception, and so is the second clause
  // of one sentence. An object the sentence before named, which this one leaves
  // out, counts as a phrase gone too.
  final dropped =
      draw.link != JoinSide.second &&
      follow?.reference == _Reference.pronoun &&
      follow!.pronoun.isEmpty;
  final reference = draw.object;
  final elided =
      reference != null &&
              pinned[SentenceSlot.object]?.word == reference.noun &&
              (reference.text.isEmpty || reference.clitic)
          ? 1
          : 0;
  // A quoted line is the one exception, by half: `“배고파요.”` is what people
  // say, where `“찾았어.”` is not — a report of what was done says what was done
  // to what, or where. So a line about a state may be the state alone, and a
  // line that reports carries one thing beside its verb.
  final least =
      !draw.spoken
          ? 3
          : draw.beat?.headedByState == false
          ? 2
          : 1;
  final roomy =
      dropped
          ? timeless.where((frame) => frame.parts.length - elided >= least).toList(growable: false)
          : timeless;
  final frames =
      roomy.isNotEmpty
          ? roomy
          : timeless.isNotEmpty
          ? timeless
          : allowed;
  final placements = <SentenceFrame, _Placement>{
    for (final frame in frames) frame: _planFor(frame, requirements, pinned),
  };
  final range = budget;
  // A shape is only worth drawing when the language has a predicate for it.
  bool buildable(SentenceFrame frame) {
    final placement = placements[frame]!;

    if (!placement.complete) return false;

    // A copular shape equates its subject to a day, so it is worth drawing only
    // where the subject can be one: a match is on a Tuesday and a buggy is not.
    if (!frame.parts.any(
      (part) => part.slot == SentenceSlot.state || part.slot == SentenceSlot.verb,
    )) {
      return _themesForClasses(requested, data.calendar!.copula.subject).isNotEmpty;
    }

    return frame.parts.any((part) => part.slot == SentenceSlot.state)
        ? _stateGroupsFor(
          language,
          data,
          settings.vocabulary,
          requested,
          frame,
          placement.plan,
          draw.beat,
        ).isNotEmpty
        : _verbGroupsFor(
          language,
          data,
          settings.vocabulary,
          frame,
          requested,
          placement.plan,
          draw.beat,
          _subjectNounOf(frame, placement.plan, follow),
        ).isNotEmpty;
  }

  // Prefer a shape that can land inside the range, then one that has somewhere
  // to put every word the caller required, and settle for any of them after that.
  final fitting = frames
      .where((frame) {
        final own = _frameRange(frame, data, bounds, modifierBounds);

        return own.max >= range.min && own.min <= range.max && buildable(frame);
      })
      .toList(growable: false);
  final loose = frames.where(buildable).toList(growable: false);
  final usable = fitting.isNotEmpty ? fitting : (loose.isNotEmpty ? loose : frames);
  _Built? best;
  var bestDistance = 1 << 30;
  var bestTooLong = false;

  for (var attempt = 0; attempt < _fitAttempts; attempt += 1) {
    // After a miss, a shape whose own range runs past the requested one in the
    // direction that was missed is four times as likely. A story's sentence is
    // better for carrying what the story would rather it carried — the place it
    // is all happening in — and for saying a little more than the bare subject
    // and verb.
    final frame = _pickFrame(usable, (candidate) {
      var weight = 1;

      if (attempt > 0 && bestDistance > 0) {
        final own = _frameRange(candidate, data, bounds, modifierBounds);

        weight *= (bestTooLong ? own.min <= range.min : own.max >= range.max) ? 4 : 1;
      }

      final beat = draw.beat;

      if (beat != null) {
        if (beat.prefers.any((slot) => candidate.parts.any((part) => part.slot == slot))) {
          weight *= 3;
        }

        if (candidate.parts.length >= 3) weight *= 2;
      }

      return weight;
    });
    final built = _compose(
      language,
      data,
      frame,
      placements[frame]!.plan,
      requested,
      settings,
      _modifyChanceFor(attempt == 0 ? 0 : bestDistance, bestTooLong, draw.beat != null),
      bounds,
      modifierBounds,
      range.min,
      range.max,
      draw,
    );
    final length = built.sentence.length;

    if (length >= range.min && length <= range.max) return built;

    final over = length - range.max;
    final distance = over > 0 ? over : range.min - length;

    if (distance < bestDistance) {
      bestDistance = distance;
      bestTooLong = over > 0;
      best = built;
    }
  }

  return best!;
}

/// The shortest and longest sentence a set of shapes can produce.
LengthRange _naturalSpan(
  SentenceLanguageData data,
  List<SentenceFrame> frames,
  Map<SentenceSlot, LengthRange> bounds,
  LengthRange modifier,
) {
  var min = 1 << 30;
  var max = 0;

  for (final frame in frames) {
    final range = _frameRange(frame, data, bounds, modifier);

    if (range.min < min) min = range.min;
    if (range.max > max) max = range.max;
  }

  return LengthRange(min, max);
}

/// The length range one whole result has to land in — every sentence of it and
/// the spaces between them, because that is what `minLength` and `maxLength`
/// describe.
///
/// The ceiling is per sentence rather than per result: a paragraph of ten is ten
/// sentences long, and capping it at what one of them may be would answer the
/// ask with ten sentences of twenty characters.
LengthRange _boundsFor(
  WordLanguage language,
  SentenceLanguageData data,
  List<SentenceFrame> frames,
  Map<SentenceSlot, LengthRange> room,
  LengthRange modifier,
  _Settings settings,
) {
  final count = settings.sentences;
  final gap = data.space.length * (count - 1);
  // The top is what the result can reach, and a name lowers it: `Yvonne` where a
  // noun phrase would have written `die schlanke Wolke`. The bottom is measured
  // against the language's own nouns even then, because `sentenceLengthRange` is
  // a promise about the language — a name standing in the subject is no reason to
  // write a sentence shorter than the language says it writes.
  final high = _naturalSpan(data, frames, room, modifier).max;
  final low = _naturalSpan(data, frames, _slotBounds(language), modifier).min;

  return lengthBounds(
    settings.minLength,
    settings.maxLength,
    low * count + gap,
    high * count + gap,
    ceiling: randSentenceLengthMax * count + gap,
  );
}

/// How far a length falls outside a range, and `0` when it is inside it.
int _distanceFrom(int length, LengthRange range) =>
    length > range.max ? length - range.max : _atLeast(0, range.min - length);

/// The result's range, shared out over its sentences.
///
/// The joins between them come off the top and the last sentence absorbs the
/// rounding, so the shares add back up to exactly what the caller asked for
/// rather than to one character less.
List<LengthRange> _shareOut(LengthRange range, int count, int space) {
  if (count == 1) return <LengthRange>[range];

  final gap = space * (count - 1);

  List<int> split(int total) {
    final body = _atLeast(count, total - gap);
    final each = body ~/ count;
    final shares = List<int>.filled(count, each);

    shares[count - 1] = body - each * (count - 1);

    return shares;
  }

  final mins = split(range.min);
  final maxs = split(range.max);

  return <LengthRange>[
    for (var i = 0; i < count; i += 1)
      LengthRange(_atLeast(1, mins[i]), _atLeast(mins[i], maxs[i])),
  ];
}

/* --- Building the whole result --------------------------------------------- */

// How often a sentence that follows another one opens on a connective.
const int _connectiveChance = 40;

// How often an exclamation opens on an interjection. Higher than the
// connective's, because an exclamation with nothing in front of it is a
// statement wearing a mark.
const int _interjectionChance = 65;

// What both of those are worth when the sentence before this one already opened
// on something. Two in a row read as a list of asides rather than as a paragraph.
const double _openerDamp = 0.4;

// Every claim a connective can make, in the order the datasets write them.
const List<ConnectiveKind> _connectiveKinds = ConnectiveKind.values;

// How a sentence refers to the topic, against the other two ways of doing it.
const Map<_Reference, int> _referenceWeight = <_Reference, int>{
  _Reference.repeat: 25,
  _Reference.pronoun: 40,
  _Reference.fresh: 35,
};

// What naming the topic again is worth when the topic is a person's name.
//
// A name is the most conspicuous word in a sentence and the one a reader is
// least likely to lose track of, so prose names somebody once and then leaves
// them alone; `신우가 …. 신우는 …. 신우가 …` is a caption written three times.
const double _namedDamp = 0.6;

/// What the rest of the result is about, read off the sentence that opened it.
_Topic? _topicOf(_Built built) {
  final noun = built.subject;

  if (noun == null) return null;

  final theme = built.theme;

  return _Topic(
    noun,
    theme,
    // A name is in no pool and so has no theme, but it is a person all the same,
    // which is the whole of what a later sentence needs to stay on topic.
    built.named ? NounClass.person : (theme == null ? null : themeClass[theme]),
    built.gender,
    built.named,
  );
}

/// The pronouns the language can stand in for this topic with.
///
/// A class its written pronouns are wrong for is left with the empty entry alone
/// — the language says nothing where it can, and where it cannot, there is no
/// pronoun to be had and the sentence names the topic again instead.
WordPool _pronounsFor(SentenceLanguageData data, _Topic topic) {
  // A gendered pronoun is the one thing a `pronounless` class can still take, and
  // only where the topic carries a gender to choose it by. That is what the list
  // is about: `he` and `she` cannot stand for `the locksmith`, because nothing
  // says which of the two, and a name says. A language that declares no pool for
  // that gender has none to offer, so Korean still drops the subject rather than
  // writing `그것` about somebody.
  final gender = topic.gender;
  final gendered = gender == null ? null : data.pronouns[gender];
  final pool = gendered ?? data.pronouns[WordGender.n] ?? const <String>[];
  final topicClass = topic.nounClass;

  if (gendered == null && topicClass != null && data.pronounless.contains(topicClass)) {
    return pool.where((word) => word.isEmpty).toList(growable: false);
  }

  return pool;
}

/// How one sentence carries on from the one before it.
///
/// [repeated] says whether that one already named the topic, and naming it again
/// straight afterwards is what makes a paragraph read as a caption written ten
/// times — worst of all with a person's name, which has no pronoun to alternate
/// with in the languages that leave their subject out. A story never draws a
/// fresh subject: its hero is whoever it opened on.
_Follow _followFor(
  SentenceLanguageData data,
  _Topic topic,
  Map<SentenceSlot, _Requirement> scene,
  bool repeated, [
  bool storied = false,
]) {
  final pronouns = _pronounsFor(data, topic);
  // A person is an individual, not a kind of thing: a paragraph about Emma that
  // draws a `fresh` subject is a paragraph that quietly becomes about Sophie.
  final ways =
      topic.named || storied
          ? const <_Reference>[_Reference.repeat, _Reference.pronoun]
          : const <_Reference>[_Reference.repeat, _Reference.pronoun, _Reference.fresh];
  final usable =
      pronouns.isNotEmpty
          ? ways
          : ways.where((way) => way != _Reference.pronoun).toList(growable: false);
  final reference = pickWeighted<_Reference>(usable, (way) {
    if (way != _Reference.repeat) return _referenceWeight[way]!;

    return _referenceWeight[way]! * (repeated ? _repeatDamp : 1) * (topic.named ? _namedDamp : 1);
  });

  return _Follow(topic, reference, reference == _Reference.pronoun ? pick(pronouns) : '', scene);
}

/// How a sentence refers to the object the sentence before it named, when its
/// shape puts that noun in the object slot again.
///
/// `forced` is the second clause of one sentence, which never names the noun
/// its first clause just did: `소시지를 끓여서 먹었다`, not `소시지를 끓여서
/// 소시지를 먹었다`. A whole sentence draws between the two the way a subject
/// does, and `named` damps naming it straight after the sentence before named
/// it. Null names the noun again, and a language with no object pronoun always
/// does.
_ObjectReference? _objectReferenceFor(
  WordLanguage language,
  SentenceLanguageData data,
  String noun,
  bool forced,
  bool named,
) {
  final pronouns = data.objectPronouns;

  if (pronouns == null) return null;

  final lexicon = wordData[language]!;
  final gender = genderOf(lexicon, _asPool(lexicon, noun));
  final pool =
      (gender == null ? null : pronouns.words[gender]) ??
      pronouns.words[WordGender.n] ??
      const <String>[];

  if (pool.isEmpty) return null;

  final way = pickWeighted<_Reference>(
    const <_Reference>[_Reference.repeat, _Reference.pronoun],
    (way) =>
        way == _Reference.repeat
            ? _referenceWeight[way]! * (named ? _repeatDamp : 1)
            : _referenceWeight[way]!,
  );

  if (!forced && way == _Reference.repeat) return null;

  return _ObjectReference(noun, pick(pool), pronouns.clitic);
}

/// What a sentence opens on: an interjection when it is an exclamation, and a
/// connective when it follows another.
///
/// Never both — a sentence that opened on two things at once would be shouting
/// its own footnote. [room] is what the sentence may be at its longest, and it
/// is what decides whether it opens on anything at all; [flow] is the other half
/// of the decision, and it is what makes an opener read as one: never the same
/// word twice in one result, and far less likely at all when the sentence before
/// this one already opened on something. [kinds] is what a story lets this
/// sentence claim, when it is one of a story.
String _openerFor(
  SentenceLanguageData data,
  SentenceType mark,
  _Follow? follow,
  int room,
  int shortest,
  _Flow flow, [
  List<ConnectiveKind>? kinds,
]) {
  final spare = room - data.space.length - shortest;

  List<String> fitting(WordPool pool) => pool
      .where((word) => word.length <= spare && !flow.openers.contains(word))
      .toList(growable: false);

  final damp = flow.opened ? _openerDamp : 1.0;

  if (mark == SentenceType.exclamation) {
    final usable = fitting(data.interjections);

    if (usable.isNotEmpty && chance(_interjectionChance * damp)) return pick(usable);
  }

  if (follow == null) return '';

  final usable = fitting(_connectivesOf(data, follow, mark, kinds));

  return usable.isNotEmpty && chance(_connectiveChance * damp) ? pick(usable) : '';
}

/// The connectives this sentence may open on: the ones whose claim about the
/// sentence before it can actually be true.
///
/// Three of the four always can. What [ConnectiveKind.causal] claims is that
/// this sentence follows from the last, which needs the two of them to be about
/// the same thing and this one to be telling rather than asking. A story has
/// already decided what each of its sentences may claim, and hands the kinds in.
WordPool _connectivesOf(
  SentenceLanguageData data,
  _Follow follow,
  SentenceType mark, [
  List<ConnectiveKind>? allowed,
]) {
  final follows =
      follow.reference != _Reference.fresh &&
      (mark == SentenceType.statement || mark == SentenceType.trailing);
  final wanted = allowed ?? _connectiveKinds;

  return <String>[
    for (final kind in wanted)
      if (follows || kind != ConnectiveKind.causal) ...?data.connectives[kind],
  ];
}

/// Every sentence of one result, in order.
///
/// The range is shared out before the first of them is drawn, and the topic is
/// taken from that first sentence — so what follows is about the same thing
/// rather than another draw that happened to land beside it.
/// The kind this sentence is, and the kind whose mark it closes on, chosen
/// against the room it has.
///
/// A shape is not always answerable in a narrow range: a question is a different
/// shape — Vietnamese writes `không` after the whole clause, English `Does` in
/// front of the subject — and a quoted line pays for its marks out of the same
/// budget. Drawing the kind first and discovering that afterwards is how
/// `‘Họa sĩ có ồn ào không?’` came out of a range of 12 to 17.
///
/// A kind the caller named is still drawn when none of them fit, which is the
/// same best effort every other narrowing here makes.
List<SentenceType> _kindFor(
  SentenceLanguageData data,
  _Settings settings,
  Map<SentenceSlot, LengthRange> bounds,
  LengthRange modifierBounds,
  LengthRange budget,
  _Flow flow,
) {
  // Both ends: a shape whose shortest is past the top of the budget overshoots
  // whatever it draws, and one whose longest is under the bottom falls short of
  // it however long the words are.
  bool fits(SentenceType mark, LengthRange room) =>
      _framesFor(data, settings, _moodFor(mark)).any((frame) {
        final own = _frameRange(frame, data, bounds, modifierBounds);

        return own.min <= room.max && own.max >= room.min;
      });

  List<SentenceType> marksOf(SentenceType type) =>
      type == SentenceType.dialogue || type == SentenceType.thought
          ? _quotedMarks
          : <SentenceType>[type];

  LengthRange roomOf(SentenceType type) {
    final quote = _quoteFor(data, type, settings.quote);
    final marks = quote == null ? 0 : quote[0].length + quote[1].length;

    return LengthRange(budget.min - marks, budget.max - marks);
  }

  // A paragraph stays in the register it opened in. Prose about a line may not
  // become one, so the narrated register is the closed half; a quoted one keeps
  // the prose that goes between its lines, because a line answered only by
  // another line is one person talking to themselves. Nothing to keep to on the
  // first sentence, which is where the register comes from.
  final lead = flow.lead;
  final family =
      lead == null
          ? settings.types
          : settings.types
              .where(
                (type) =>
                    _quotedTypes.contains(lead)
                        ? type == lead || _narration.contains(type)
                        : !_quotedTypes.contains(type),
              )
              .toList(growable: false);
  final wanted = family.isNotEmpty ? family : settings.types;
  final usable = wanted
      .where((type) => marksOf(type).any((mark) => fits(mark, roomOf(type))))
      .toList(growable: false);
  final pool = usable.isNotEmpty ? usable : wanted;
  final type = pickWeighted<SentenceType>(pool, (each) => _typeWeightFor(each, flow));
  final marks = marksOf(type).where((mark) => fits(mark, roomOf(type))).toList(growable: false);

  return <SentenceType>[
    type,
    pickWeighted<SentenceType>(
      marks.isNotEmpty ? marks : marksOf(type),
      (mark) => _markWeightFor(mark, flow),
    ),
  ];
}

/// What one kind is worth here, in this result, after what it has already said.
///
/// Two things move it off the flat weight. A result that opened on a quoted line
/// is a scene of speech, so the line it opened on outweighs the prose around it;
/// and a kind the sentence before this one already was is worth less each time it
/// comes round again, so that a run of them ends by itself. The plain statement
/// is the one thing exempt from that: a run of statements is what prose is.
double _typeWeightFor(SentenceType type, _Flow flow) {
  final lead = flow.lead;
  final quoted = lead != null && _quotedTypes.contains(lead);
  final base = _typeWeight[type]! * (quoted && type == lead ? _quotedBoost : 1);

  if (type != flow.last || type == SentenceType.statement) return base.toDouble();

  var weight = base.toDouble();

  for (var each = 0; each < flow.run; each += 1) {
    weight *= _repeatDamp;
  }

  return weight;
}

/// The same for the mark a quoted line closes on.
double _markWeightFor(SentenceType mark, _Flow flow) {
  final base = _markWeight[mark]!.toDouble();

  return mark == flow.mark && mark != SentenceType.statement ? base * _repeatDamp : base;
}

/// The slot bounds this result is measured against: the language's own, with the
/// subject narrowed to a name when the result writes one.
///
/// A name is one word and no article — `Yvonne` where a noun phrase would write
/// `die schlanke Wolke` — so a shape chosen against noun lengths is a shape a
/// named sentence cannot fill. Both the result's budget and the per-sentence
/// choice of shape read this rather than `_slotBounds` directly.
/// The modifier bounds, priming the cache that `_slotBounds` fills them from.
///
/// Reading `_modifierBounds` before anything has asked for the slot bounds is
/// reading an empty map, which is why this is a function rather than a lookup.
LengthRange _modifierSpan(WordLanguage language) {
  _slotBounds(language);

  return _modifierBounds[language]!;
}

Map<SentenceSlot, LengthRange> _roomFor(WordLanguage language, bool? includeName) {
  final bounds = _slotBounds(language);

  return (includeName ?? false)
      ? <SentenceSlot, LengthRange>{...bounds, SentenceSlot.subject: _nameSpan(language)}
      : bounds;
}

/// Whether a result that writes a name can still land in the range the caller
/// asked for.
///
/// A named sentence is the shorter of the two by a wide margin, so a range only
/// the longer one can reach is a range a name cannot be in. Asked for a name
/// outright the generator writes one anyway, the same way it answers a range too
/// narrow for the parts it was told to carry; drawn, it is one more thing to
/// decide against the room.
bool _nameFits(
  SentenceLanguageData data,
  List<SentenceFrame> frames,
  LengthRange modifierBounds,
  _Settings settings,
  WordLanguage language,
) {
  if (settings.minLength == null) return true;

  final count = settings.sentences;
  final gap = data.space.length * (count - 1);
  final natural = _naturalSpan(data, frames, _roomFor(language, true), modifierBounds);

  return settings.minLength! <= natural.max * count + gap;
}

/// Everything one result is made of.
class _Result {
  const _Result(this.built, this.tense, this.story, this.theme);

  final List<_Built> built;
  final SentenceTense tense;
  final SentenceStory? story;

  /// What the result is about: its hero's theme in a story, and the first
  /// sentence's subject otherwise.
  final WordTheme? theme;
}

/// What every sentence of one result is drawn against, settled before the first.
/// The whole of a result as one string, which is what the caller's range describes.
int _lengthOf(SentenceLanguageData data, List<_Built> built) =>
    built.fold<int>(0, (sum, one) => sum + one.sentence.length) +
    data.space.length * (built.length - 1);

class _Telling {
  const _Telling({
    required this.language,
    required this.data,
    required this.settings,
    required this.budgets,
    required this.room,
    required this.modifierBounds,
    required this.shortest,
    required this.flow,
    required this.spent,
    required this.voice,
    required this.tense,
  });

  final WordLanguage language;
  final SentenceLanguageData data;
  final _Settings settings;
  final List<LengthRange> budgets;
  final Map<SentenceSlot, LengthRange> room;
  final LengthRange modifierBounds;
  final int shortest;
  final _Flow flow;
  final Set<String> spent;
  final SentenceStyle voice;
  final SentenceTense tense;
}

/// One sentence, drawn and then drawn again without what it opened on when that
/// was what put it outside its range.
///
/// `_openerFor` reserves room against the shortest sentence the shapes could
/// spell, which is a floor no draw actually reaches. When the sentence that came
/// back could not be made short enough to carry what it opens on after all, that
/// is the part worth giving up: it stands in front of the whole sentence rather
/// than instead of any piece of it.
(_Built, String) _drawOne(_Telling telling, _Draw draw) {
  var one = _generateOne(telling.language, telling.settings, draw);
  var opened = draw.opener;

  if (draw.opener.isNotEmpty && _distanceFrom(one.sentence.length, draw.budget) > 0) {
    final bare = _generateOne(telling.language, telling.settings, draw.copyWith(opener: ''));

    if (_distanceFrom(bare.sentence.length, draw.budget) <
        _distanceFrom(one.sentence.length, draw.budget)) {
      one = bare;
      opened = '';
    }
  }

  return (one, opened);
}

// How many of a result's sentences may say when, as a share of its count: one
// in four, and never two in a row. `아침에 … 한낮에 … 저녁에 … 밤에` in a paragraph
// of six is a timetable rather than a paragraph.
const int _timeShare = 4;

/// Whether the next sentence of a result has to leave the time out: the one
/// before it named one, or the result has named its share already.
bool _timeSpent(List<_Built> built, int count) {
  final named = built.where((one) => one.slots.contains(SentenceSlot.time)).length;
  final share = (count + _timeShare - 1) ~/ _timeShare;

  return (built.isNotEmpty && built.last.slots.contains(SentenceSlot.time)) ||
      named >= (share < 1 ? 1 : share);
}

_Result _generateResult(WordLanguage language, _Settings settings) {
  final data = sentenceData[language]!;
  final modifierBounds = _modifierSpan(language);
  // Every shape any of the requested kinds could take, because the budget is
  // shared out before the first of them is even drawn — and a quoted line can be
  // any kind at all, so its shapes are all of them.
  final frames = <SentenceFrame>[
    for (final type in settings.types)
      for (final mark
          in type == SentenceType.dialogue || type == SentenceType.thought
              ? _quotedMarks
              : <SentenceType>[type])
        ..._framesFor(data, settings, _moodFor(mark)),
  ];
  // A result either has a person in it or does not; deciding that per sentence
  // would put a name in one line of a paragraph and not the next.
  final named =
      settings.includeName ??
      (_nameFits(data, frames, modifierBounds, settings, language) && chance(50));
  final settled = settings.includeName == named ? settings : settings.naming(named);
  // And the budget is measured against what a named result actually writes: one
  // word where a noun phrase would have written an article, a modifier and a noun.
  final room = _roomFor(language, named);
  final shortest = _naturalSpan(data, frames, room, modifierBounds).min;
  final budgets = _shareOut(
    _boundsFor(language, data, frames, room, modifierBounds, settled),
    settings.sentences,
    data.space.length,
  );
  // The result's own voice, settled once, and its tense likewise: a story is told
  // in one tense from start to end. Written out: `??` would otherwise infer
  // `pick`'s type argument from the nullable left-hand side.
  final SentenceStyle voice = settings.style ?? pick<SentenceStyle>(_styles);
  final SentenceTense tense =
      settings.tense ?? (chance(50) ? SentenceTense.past : SentenceTense.present);
  // What one telling of the result says as it goes. Fresh for every telling,
  // because a story told again starts over.
  _Telling telling() => _Telling(
    language: language,
    data: data,
    settings: settled,
    budgets: budgets,
    room: room,
    modifierBounds: modifierBounds,
    shortest: shortest,
    flow: _Flow(),
    spent: <String>{},
    voice: voice,
    tense: tense,
  );

  // More than one sentence is a story, when the language can tell one about the
  // subject asked for. It always can — every class has a story — so the paragraph
  // below is what a result falls back to rather than what it usually is. A story
  // that landed outside the range is told again, and the closest telling is kept.
  if (settings.sentences > 1) {
    final range = _boundsFor(language, data, frames, room, modifierBounds, settled);
    _Result? closest;
    var missed = 1 << 30;

    for (var attempt = 0; attempt < _storyAttempts; attempt += 1) {
      final story = _tellStory(telling());

      if (story == null) break;

      final miss = _distanceFrom(_lengthOf(data, story.built), range);

      if (miss < missed) {
        closest = story;
        missed = miss;
      }

      if (miss == 0) break;
    }

    if (closest != null) return closest;
  }

  final paragraph = telling();
  final flow = paragraph.flow;
  final spent = paragraph.spent;

  final built = <_Built>[];
  _Topic? topic;
  var scene = const <SentenceSlot, _Requirement>{};

  for (var i = 0; i < settings.sentences; i += 1) {
    final budget = budgets[i];
    final kind = _kindFor(data, settled, room, modifierBounds, budget, flow);
    final type = kind[0];
    final mark = kind[1];
    final follow = topic == null ? null : _followFor(data, topic, scene, flow.repeated);
    final item = scene[SentenceSlot.object];
    final last = built.isEmpty ? null : built.last;
    final object =
        item != null && last?.object?.noun == item.word
            ? _objectReferenceFor(language, data, item.word, false, last!.object!.named)
            : null;
    var dayAt = -1;

    for (final one in built) {
      if (one.dayAt > dayAt) dayAt = one.dayAt;
    }

    final draw = _Draw(
      budget: budget,
      type: type,
      mark: mark,
      quote: _quoteFor(data, type, settings.quote),
      opener: _openerFor(data, mark, follow, budget.max, shortest, flow),
      style: _styleFor(type, settled.style, voice),
      avoid: spent,
      follow: follow,
      tense: tense,
      beat: null,
      link: null,
      dayAt: dayAt,
      object: object,
      dated: _timeSpent(built, settings.sentences),
    );
    final (one, opened) = _drawOne(paragraph, draw);

    built.add(one);
    scene = one.scene;
    spent.addAll(one.used);
    flow.run = type == flow.last ? flow.run + 1 : 1;
    flow.last = type;
    flow.mark = mark;
    flow.opened = opened.isNotEmpty;
    flow.lead ??= type;
    flow.repeated = follow == null || follow.reference == _Reference.repeat;

    if (opened.isNotEmpty) flow.openers.add(opened);

    topic ??= _topicOf(one);
  }

  return _Result(built, tense, null, built.first.theme);
}

/* --- Telling a story ------------------------------------------------------- */

// What each kind is worth in a sentence of a story, where the caller left the
// kind to the story. A story is told in statements; a step that allows an
// exclamation or a trailing end gets one now and then.
// What a line of the hero's own is: said aloud more often than thought, and
// exclaimed now and then — `“배고파!”` beside `“배고파.”`.
const List<SentenceType> _lineKinds = <SentenceType>[SentenceType.dialogue, SentenceType.thought];
const Map<SentenceType, int> _lineWeight = <SentenceType, int>{
  SentenceType.dialogue: 60,
  SentenceType.thought: 40,
};
const int _lineExclaim = 30;

// And what somebody says of what they see somebody else doing is more often an
// exclamation than not: `“새가 날아가네!”`
const int _noticeExclaim = 55;

const Map<SentenceType, int> _storyKindWeight = <SentenceType, int>{
  SentenceType.statement: 100,
  SentenceType.exclamation: 35,
  SentenceType.trailing: 30,
};

// What share of a two-clause sentence's range the first clause takes.
const double _firstClauseShare = 0.5;

// What share of a language's longest sentence one sentence of a result has to be
// allowed before two clauses are written into it.
const double _joinRoom = 0.6;

// Where a story happens. `place` alone, and not the two other themes of its
// class: a hero can walk to the market and not to Pluto.
/// The nouns a story has put on the page, by the role each one plays.
class _Roles {
  _Requirement? item;

  /// The story's second thing, once a sentence has written it.
  _Requirement? prop;
  _Requirement? place;
  _Requirement? home;
}

/// The story a result follows, the hero it is about and the thing in the hero's
/// hands.
class _Found {
  const _Found(this.plan, this.hero, this.heroThemes, this.item);

  final Plan plan;
  final NounClass hero;
  final List<WordTheme> heroThemes;
  final WordTheme? item;
}

_Found? _storyFor(_Telling telling) {
  final data = telling.data;
  final settings = telling.settings;
  final heroThemes = _subjectThemesFor(settings, null);
  final heroClasses = <NounClass>{for (final theme in heroThemes) themeClass[theme]!}.toList();
  final candidates = storiesFor(data, heroClasses, settings.story).toList();
  final longest = _naturalSpan(data, data.frames, telling.room, telling.modifierBounds).max;
  final joinable = telling.budgets.first.max >= longest * _joinRoom;

  while (candidates.isNotEmpty) {
    final story = pickStory(candidates);

    candidates.remove(story);

    final heroes = heroClassesFor(data, story, heroClasses);

    if (heroes.isEmpty) continue;

    final hero = pick(heroes);
    final items = itemThemesFor(data, story, hero);
    final WordTheme? item = items.isEmpty ? null : pick(items);
    // A story is spoken in only where the caller left the kinds to it: a story
    // told on its own terms is prose, and a caller who asked for every kind gets
    // the register they asked for.
    final planned = plan(data, story, hero, item, settings.sentences, joinable, !settings.typed);

    if (planned != null) {
      // The hero's themes: the ones asked for, in the hero's class, and — where
      // the story narrows them — the story's own. A sketch is of a forest, not of
      // Pluto.
      final inClass = _themesForClasses(heroThemes, <NounClass>[hero]);
      final own =
          story.heroThemes == null
              ? inClass
              : inClass.where(story.heroThemes!.contains).toList(growable: false);

      return _Found(planned, hero, own.isNotEmpty ? own : inClass, item);
    }
  }

  return null;
}

/// One beat told: the sentence, its kind and mark, what it opened on, and how it
/// referred to the topic.
class _Told {
  const _Told(this.one, this.type, this.mark, this.opened, this.follow);

  final _Built one;
  final SentenceType type;
  final SentenceType mark;
  final String opened;
  final _Follow? follow;
}

/// What a remark is about: a noun the story has written, or null for one still
/// to be drawn out of [themes].
class _Commented {
  const _Commented(this.noun, this.themes);

  final _Requirement? noun;
  final List<WordTheme> themes;
}

/// One of a language's replies: what is said, and the mark it closes on.
class _Reply {
  const _Reply(this.text, this.mark);

  final String text;
  final SentenceType mark;
}

// Which pool an answer at each level is drawn from, best first. A level a
// language does not write falls back the way a predicate form does, and plain
// is never spoken.
const Map<SentenceStyle, List<SentenceStyle>> _replyChain = <SentenceStyle, List<SentenceStyle>>{
  SentenceStyle.plain: <SentenceStyle>[
    SentenceStyle.casual,
    SentenceStyle.polite,
    SentenceStyle.formal,
  ],
  SentenceStyle.casual: <SentenceStyle>[
    SentenceStyle.casual,
    SentenceStyle.polite,
    SentenceStyle.formal,
  ],
  SentenceStyle.polite: <SentenceStyle>[
    SentenceStyle.polite,
    SentenceStyle.casual,
    SentenceStyle.formal,
  ],
  SentenceStyle.formal: <SentenceStyle>[
    SentenceStyle.formal,
    SentenceStyle.polite,
    SentenceStyle.casual,
  ],
};

/// The replies a language writes at this level, or the nearest level it does
/// write, that fit what was said: the pool for the cue, and every pool but the
/// answers where the level has none for it — an answer to nothing is odd, and
/// the rest fit most things.
/// What the language says on coming home at this level, or the nearest level
/// it says it at.
WordPool _homecomingsOf(SentenceLanguageData data, SentenceStyle style) {
  for (final level in _replyChain[style]!) {
    final pool = data.homecomings?[level];

    if (pool != null && pool.isNotEmpty) return pool;
  }

  return const <String>[];
}

WordPool _repliesOf(SentenceLanguageData data, SentenceStyle style, ReplyCue cue) {
  for (final level in _replyChain[style]!) {
    final pools = data.replies?[level];

    if (pools == null) continue;

    final own = pools[cue];

    if (own != null && own.isNotEmpty) return own;

    final rest = <String>[
      for (final entry in pools.entries)
        if (entry.key != ReplyCue.answer) ...entry.value,
    ];

    if (rest.isNotEmpty) return rest;
  }

  return const <String>[];
}

/// A reply entry, read: `잘됐다!` is exclaimed and `정말?` asked, and the tag is
/// taken off so the language's own mark can be written in its place.
_Reply _replyOf(String entry) {
  if (entry.endsWith('!')) {
    return _Reply(entry.substring(0, entry.length - 1), SentenceType.exclamation);
  }

  if (entry.endsWith('?')) {
    return _Reply(entry.substring(0, entry.length - 1), SentenceType.question);
  }

  return _Reply(entry, SentenceType.statement);
}

/// Every sentence of a result that follows a story.
///
/// The plan says what happens in each sentence; this writes it. The hero is the
/// topic, named in the first sentence and then referred to the way a paragraph
/// refers to its subject; the thing, the place and home are drawn the first time
/// a sentence has room for them and pinned into every sentence after; two beats
/// the plan joined are written as one sentence, the second clause without its
/// subject.
_Result? _tellStory(_Telling telling) {
  final language = telling.language;
  final data = telling.data;
  final settings = telling.settings;
  final found = _storyFor(telling);

  if (found == null) return null;

  final story = found.plan.story;
  final beats = found.plan.beats;
  final prop = found.plan.prop;
  final heroThemes = found.heroThemes;
  final roles = _Roles();
  final built = <_Built>[];
  _Topic? topic;
  var dayAt = -1;
  var at = 0;
  // Whether the clause just written named the place. A story happens in one
  // place, and it does not have to say so in every line: `운동장으로 달려가서
  // 운동장에서 날아오른다` names it twice in one sentence, so a clause that
  // follows one that named the place leaves it out.
  var placed = false;
  // Whether the sentence just written was the hero's. After one that was not —
  // the place changing, somebody else doing something, an answer — the hero is
  // named again rather than dropped or stood a pronoun for: `바람이 분다.
  // 조용해진다.` leaves the reader asking who.
  var heroLast = true;

  /// Whether this beat may write the place: not straight after a clause that did.
  bool placeable(Beat beat) => beat.step.place && !placed;

  /// The nouns this beat's sentence has to write, in the slots it has for them.
  Map<SentenceSlot, _Requirement> pinnedFor(Beat beat) {
    final pinned = <SentenceSlot, _Requirement>{};
    final step = beat.step;
    final item = roles.item;
    final place = roles.place;

    if (step.object == StoryRole.item && item != null) pinned[SentenceSlot.object] = item;
    if (step.object == StoryRole.prop && roles.prop != null) {
      pinned[SentenceSlot.object] = roles.prop!;
    }
    if (placeable(beat) && place != null) pinned[SentenceSlot.place] = place;
    if (step.destination == StoryRole.place && place != null) {
      pinned[SentenceSlot.destination] = place;
    }

    if (step.destination == StoryRole.home) {
      roles.home ??= _Requirement(
        pick(data.homes),
        const <SentenceSlot?>[SentenceSlot.destination],
        known: false,
        bare: true,
      );
      pinned[SentenceSlot.destination] = roles.home!;
    }

    return pinned;
  }

  /// The place the story is happening in, drawn now if no sentence has named it.
  _Requirement placeOf() {
    if (roles.place == null) {
      final theme = pick(_destinationThemes);
      final lexicon = wordData[language]!;

      roles.place = _Requirement(
        _plain(lexicon, pick(_placePoolFor(language, data, theme, settings.vocabulary))),
        const <SentenceSlot?>[SentenceSlot.place],
        theme: theme,
      );
    }

    return roles.place!;
  }

  /// The themes an `other` step's actor is drawn from.
  List<WordTheme> actorThemesFor(StoryStep step) {
    if (step.actor == StoryRole.item) {
      final item = found.item;

      return item == null
          ? _themesForClasses(wordThemes, const <NounClass>[NounClass.person])
          : <WordTheme>[item];
    }

    final inClass = _themesForClasses(wordThemes, actorClassesOf(step, found.item));
    final own =
        step.actorThemes == null
            ? inClass
            : inClass.where(step.actorThemes!.contains).toList(growable: false);

    return own.isNotEmpty ? own : inClass;
  }

  /// What a remark is about: the thing looked at, or the place — as a noun the
  /// story has already written, or as a theme to draw one from.
  _Commented? commentFor(Beat beat) {
    final step = beat.step;

    if (step.kind == StepKind.scene) return _Commented(placeOf(), _destinationThemes);

    if (step.object != null) {
      final noun = step.object == StoryRole.prop ? roles.prop : roles.item;
      final theme = step.object == StoryRole.prop ? prop : found.item;

      return theme == null ? null : _Commented(noun, <WordTheme>[theme]);
    }

    // Talking is about the place, which is drawn now if no sentence has named it.
    return _Commented(placeOf(), _destinationThemes);
  }

  /// A noun the story has written, as the topic of a sentence about it.
  _Topic topicFor(_Requirement noun, NounClass? fallback) {
    final lexicon = wordData[language]!;
    final theme = noun.theme;

    return _Topic(
      noun.word,
      theme,
      theme == null ? fallback : themeClass[theme],
      genderOf(lexicon, _asPool(lexicon, noun.word)),
      // A person met by name is written bare wherever they go again.
      noun.bare,
    );
  }

  /// What a beat asks of its sentence.
  _BeatDraw beatDraw(Beat beat, [_Commented? commented]) {
    final step = beat.step;
    final wants = <SentenceSlot>[];
    final prefers = <SentenceSlot>[];

    // A remark is about one thing and says what it is like: nothing beside the
    // subject and its state, and the subject pinned where the story has it.
    if (commented != null) {
      final noun = commented.noun;

      return _BeatDraw(
        headedByState: true,
        fields: const <VerbField>[],
        describes: true,
        condition: null,
        wants: wants,
        prefers: prefers,
        item: null,
        places: _destinationThemes,
        subject: commented.themes,
        pinned:
            noun == null
                ? const <SentenceSlot, _Requirement>{}
                : <SentenceSlot, _Requirement>{
                  SentenceSlot.subject: _Requirement(
                    noun.word,
                    const <SentenceSlot?>[SentenceSlot.subject],
                    theme: noun.theme,
                    known: noun.known,
                    bare: noun.bare,
                    settled: true,
                  ),
                },
        nameless: true,
      );
    }

    if (step.destination != null) wants.add(SentenceSlot.destination);
    if (step.object != null) wants.add(SentenceSlot.object);
    if (placeable(beat)) prefers.add(SentenceSlot.place);

    // Whose sentence this is: the hero's, the place's, or somebody else's — the
    // person the story is about, or a fresh noun of the classes the step names.
    final subject =
        step.kind == StepKind.scene
            ? _destinationThemes
            : step.kind == StepKind.other
            ? actorThemesFor(step)
            : heroThemes;

    return _BeatDraw(
      headedByState: step.kind == StepKind.state,
      fields: beat.field == null ? const <VerbField>[] : <VerbField>[beat.field!],
      describes: step.kind == StepKind.state,
      condition: beat.condition,
      wants: wants,
      prefers: prefers,
      item: step.object == StoryRole.prop ? prop : found.item,
      places: _destinationThemes,
      subject: subject,
      pinned: pinnedFor(beat),
      avoid: <String>[
        if (step.object == StoryRole.prop && roles.item != null) roles.item!.word,
        if (step.object != StoryRole.prop && roles.prop != null) roles.prop!.word,
      ],
      // What is true of the hero, for the verb to be drawn by; nothing for a
      // sentence that is not about the hero.
      state: step.kind == StepKind.act ? beat.before : null,
      nameless: step.kind == StepKind.other && step.actor != StoryRole.item,
    );
  }

  /// Somebody's answer to the line before: one of the language's replies, at
  /// the level that line was said in, in the marks a line of dialogue takes.
  /// Written whole, and built from no phrase at all. Null where the language
  /// has none.
  (_Built, SentenceType)? sayingFor(LengthRange budget, WordPool pool) {
    if (pool.isEmpty) return null;

    final quote = _quoteFor(data, SentenceType.dialogue, settings.quote)!;
    final entries = pool.map(_replyOf).toList(growable: false);
    final fresh = entries.where((entry) => !telling.spent.contains(entry.text)).toList();
    final usable = fresh.isNotEmpty ? fresh : entries;

    int lengthOf(_Reply entry) =>
        quote[0].length +
        (data.openers[entry.mark]?.length ?? 0) +
        entry.text.length +
        data.terminators[entry.mark]!.length +
        quote[1].length;

    final fitting = usable.where((entry) => lengthOf(entry) <= budget.max).toList();
    final chosen = pick(fitting.isNotEmpty ? fitting : usable);
    final text = data.capitalize ? _upper(chosen.text) : chosen.text;

    telling.spent.add(chosen.text);

    return (
      _Built(
        quote[0] +
            (data.openers[chosen.mark] ?? '') +
            text +
            data.terminators[chosen.mark]! +
            quote[1],
        const <String>[],
        const <SentenceSlot>[],
        const <String>[],
        const <String>[],
        SentenceType.dialogue,
        null,
        null,
        null,
        false,
        const <SentenceSlot, _Requirement>{},
        null,
        -1,
        null,
      ),
      chosen.mark,
    );
  }

  /// The shortest sentence a beat could be written as.
  int shortestFor(Beat beat) {
    final frames = _framesFor(data, settings, SentenceMood.statement, beatDraw(beat));
    var shortest = 1 << 30;

    for (final frame in frames) {
      final own = _frameRange(frame, data, telling.room, telling.modifierBounds).min;

      if (own < shortest) shortest = own;
    }

    return shortest;
  }

  /// One beat as one sentence, or as one clause of one.
  // The sentence written last, for the next one to carry on from.
  _Built? last;

  _Told tell(Beat beat, LengthRange budget, _Built? previous, [String openedBefore = '']) {
    final scene = beat.step.kind == StepKind.scene;
    final aside = beat.step.kind == StepKind.other;

    // Somebody answers the line before. Not a sentence of the story's own, and
    // not drawn: written whole, at the level the line was said in. Only after a
    // line that was actually quoted; a beat the story narrated after all is
    // answered by nobody, and the beat here is told as its own step instead.
    if (beat.voice == Voice.reply &&
        topic != null &&
        last != null &&
        _quotedTypes.contains(last.type)) {
      final reply = sayingFor(
        budget,
        _repliesOf(
          data,
          telling.flow.line ??= pick<SentenceStyle>(_spokenLevels),
          beat.cue ?? ReplyCue.agree,
        ),
      );

      if (reply != null) {
        heroLast = false;

        return _Told(reply.$1, SentenceType.dialogue, reply.$2, '', null);
      }
    }

    // Coming home is said in the language's own words — `다녀왔어`, `ただいま`,
    // `I'm home` — rather than reported as arriving somewhere, which nobody
    // says. A line, so the hero's own, and said aloud: it is said to whoever
    // is there.
    if (beat.voice == Voice.line &&
        beat.field == VerbField.arrive &&
        beat.step.destination == StoryRole.home &&
        topic != null &&
        beat.join == null) {
      final said = sayingFor(
        budget,
        _homecomingsOf(data, telling.flow.line ??= pick<SentenceStyle>(_spokenLevels)),
      );

      if (said != null) {
        heroLast = true;

        return _Told(said.$1, SentenceType.dialogue, said.$2, '', null);
      }
    }

    // A second clause whose sentence has said when already — opened on `later`,
    // or named a time in its first clause — says it no second time. A whole
    // sentence says none straight after one that did, or once the result has
    // said when as often as a paragraph should.
    final dated =
        _timeSpent(built, beats.length) ||
        (beat.join == JoinSide.second &&
            previous != null &&
            ((data.connectives[ConnectiveKind.temporal] ?? const <String>[]).contains(
                  openedBefore,
                ) ||
                previous.slots.contains(SentenceSlot.time)));
    // A line the hero says or thinks, in their own voice: the first person where
    // the language writes one, a level a person speaks at, and nothing in front
    // of it — nobody opens a line on "meanwhile". What is true of them is said
    // now, and what they just did is reported in the past.
    // A line needs a topic to speak, which the first sentence about the hero
    // gives it; and the second clause of a sentence speaks exactly where its
    // first clause did, because the quotation marks are the whole sentence's.
    final speakable =
        beat.join == JoinSide.second
            ? previous != null && _quotedTypes.contains(previous.type)
            : topic != null;
    final line = beat.voice == Voice.line && speakable && data.speech != null;
    // A remark about the thing in front of them or the place around them, in
    // the third person: `“사과가 참 달다!”`, `“숲이 조용하네.”`
    final commented = beat.voice == Voice.comment && speakable ? commentFor(beat) : null;
    // What somebody else is doing, said by the hero as they see it: the `other`
    // step told in the hero's voice, and in the present, because it is what is
    // in front of them — `“새가 날아가네!”`
    final noticed = beat.voice == Voice.notice && speakable && aside;
    // A question to the person beside them, in the second person: `“배고파?”`,
    // `“Are you tired?”`. Only once the story has put that person on the page.
    final listener = data.listener;
    final company = roles.item;
    final asked =
        beat.voice == Voice.ask &&
        beat.asked != null &&
        speakable &&
        listener != null &&
        company != null;
    final spoken = line || commented != null || noticed || asked;
    SentenceType type;
    SentenceType mark;

    if (settings.typed) {
      final kind = _kindFor(
        data,
        settings,
        telling.room,
        telling.modifierBounds,
        budget,
        telling.flow,
      );

      type = kind[0];
      mark = kind[1];
    } else if (asked) {
      type = SentenceType.dialogue;
      mark = SentenceType.question;
    } else if (spoken) {
      // What was just done is reported to somebody, and an answered line was
      // heard; what is true of oneself may be thought — and what the hero makes
      // of the person beside them is thought, not said to their face.
      type =
          beat.answered || (line && beat.step.kind == StepKind.act)
              ? SentenceType.dialogue
              : noticed && beat.step.actor == StoryRole.item
              ? SentenceType.thought
              : pickWeighted<SentenceType>(_lineKinds, (kind) => _lineWeight[kind] ?? 1);
      mark =
          chance(noticed ? _noticeExclaim : _lineExclaim)
              ? SentenceType.exclamation
              : SentenceType.statement;
    } else {
      final kinds = <SentenceType>[SentenceType.statement, if (beat.join == null) ...beat.kinds];

      type = pickWeighted<SentenceType>(kinds, (kind) => _storyKindWeight[kind] ?? 1);
      mark = type;
    }

    final pinned = commented != null ? <SentenceSlot, _Requirement>{} : pinnedFor(beat);
    // The sentence this one follows: the first clause for a second one, and the
    // sentence before for a whole one. What it named is what this one may refer
    // to rather than name again.
    final before = beat.join == JoinSide.second ? previous : last;
    final item = pinned[SentenceSlot.object];
    final object =
        item != null && before?.object?.noun == item.word
            ? _objectReferenceFor(
              language,
              data,
              item.word,
              beat.join == JoinSide.second,
              before!.object!.named,
            )
            : null;
    _Follow? follow;

    if (beat.join == JoinSide.second && previous != null) {
      // The second clause carries on from the first: its subject is the first
      // clause's, and it writes nothing where the subject would stand.
      final shared = _topicOf(previous) ?? topic;

      follow = shared == null ? null : _Follow(shared, _Reference.pronoun, '', pinned);
    } else if (scene) {
      // The scene is the one sentence whose subject is not the hero: the place the
      // story is happening in, named in full.
      final place = placeOf();
      final lexicon = wordData[language]!;

      follow = _Follow(
        _Topic(
          place.word,
          place.theme,
          NounClass.place,
          genderOf(lexicon, _asPool(lexicon, place.word)),
          false,
        ),
        _Reference.repeat,
        '',
        pinned,
      );
    } else if (aside) {
      // Somebody else's sentence: the person the story is about, named again,
      // or a fresh noun of whatever the step names — and the hero stays the
      // topic either way.
      final actor = beat.step.actor == StoryRole.item ? roles.item : null;

      follow =
          actor != null
              ? _Follow(topicFor(actor, NounClass.person), _Reference.repeat, '', pinned)
              : topic == null
              ? null
              : _Follow(topic!, _Reference.fresh, '', pinned);
    } else if (asked) {
      // The hero asks the person beside them: the subject is that person,
      // written the way the language writes a second person.
      follow = _Follow(
        topicFor(company, NounClass.person),
        _Reference.pronoun,
        listener.subject,
        pinned,
      );
    } else if (commented != null) {
      // A remark is about the thing, which is named in full where the story has
      // it, and drawn from its theme where it has not.
      final noun = commented.noun;

      follow =
          noun != null
              ? _Follow(topicFor(noun, null), _Reference.repeat, '', pinned)
              : _Follow(topic!, _Reference.fresh, '', pinned);
    } else if (line) {
      // The hero speaks: the subject is theirs, written the way the language
      // writes a first person.
      follow = _Follow(topic!, _Reference.pronoun, data.speech!.subject, pinned);
    } else if (topic != null && !heroLast) {
      // After a sentence that was not the hero's, the hero is named again.
      follow = _Follow(topic!, _Reference.repeat, '', pinned);
    } else {
      follow = topic == null ? null : _followFor(data, topic!, pinned, telling.flow.repeated, true);
    }

    // The people of one story speak at one level: a line and its answer, and
    // the next line, are said the way the first was.
    final SentenceStyle style;

    if (type == SentenceType.dialogue && settings.style == null) {
      style = telling.flow.line ??= pick<SentenceStyle>(_spokenLevels);
    } else {
      style = _styleFor(type, settings.style, telling.voice);
    }

    final draw = _Draw(
      budget: budget,
      type: type,
      mark: mark,
      quote: _quoteFor(data, type, settings.quote),
      opener:
          beat.join == JoinSide.second || spoken
              ? ''
              : _openerFor(
                data,
                mark,
                follow,
                budget.max,
                telling.shortest,
                telling.flow,
                beat.links,
              ),
      style: style,
      avoid: telling.spent,
      follow: follow,
      // A line says now what is true, and reports in the past what was just
      // done; a remark, a question and what is noticed are about now.
      tense:
          line
              ? (beat.step.kind == StepKind.act ? SentenceTense.past : SentenceTense.present)
              : commented != null || noticed || asked
              ? SentenceTense.present
              : telling.tense,
      beat:
          asked
              ? _BeatDraw(
                headedByState: true,
                fields: const <VerbField>[],
                describes: true,
                condition: beat.asked,
                wants: const <SentenceSlot>[],
                prefers: const <SentenceSlot>[],
                item: null,
                places: _destinationThemes,
                subject: _themesForClasses(wordThemes, const <NounClass>[NounClass.person]),
                nameless: true,
              )
              : beatDraw(beat, commented),
      link: beat.join,
      dayAt: dayAt,
      dated: dated,
      object: object,
      speech:
          line
              ? data.speech
              : asked
              ? listener
              : null,
      spoken: spoken,
    );
    var (one, opened) = _drawOne(telling, draw);

    // A sentence that missed its range by more than the tolerance is drawn once
    // more the other way round about its subject: named, where it was dropped and
    // came out short; dropped or stood a pronoun for, where it was named and came
    // out long.
    if (follow != null &&
        !scene &&
        !aside &&
        !spoken &&
        beat.join == null &&
        _distanceFrom(one.sentence.length, budget) > 1) {
      final pronouns = _pronounsFor(data, follow.topic);
      final short = one.sentence.length < budget.min;
      _Reference? other;

      if (short && follow.reference == _Reference.pronoun) {
        other = _Reference.repeat;
      } else if (!short && follow.reference == _Reference.repeat && pronouns.isNotEmpty) {
        other = _Reference.pronoun;
      }

      if (other != null) {
        final again = _Follow(
          follow.topic,
          other,
          other == _Reference.pronoun ? pick(pronouns) : '',
          follow.scene,
        );
        final (two, openedAgain) = _drawOne(telling, draw.copyWith(follow: again));

        if (_distanceFrom(two.sentence.length, budget) <
            _distanceFrom(one.sentence.length, budget)) {
          one = two;
          opened = openedAgain;
          follow = again;
        }
      }
    }

    // What this sentence put on the page, for the rest of the story to keep.
    for (final slot in <SentenceSlot>[
      SentenceSlot.object,
      SentenceSlot.place,
      SentenceSlot.destination,
    ]) {
      final drawn = one.scene[slot];

      if (drawn == null) continue;

      if (slot == SentenceSlot.object) {
        final written = _Requirement(
          drawn.word,
          drawn.slots,
          theme: drawn.theme,
          known: drawn.known,
          settled: true,
        );

        if (beat.step.object == StoryRole.prop) {
          roles.prop ??= written;
        } else {
          roles.item ??= written;
        }
      } else if (slot == SentenceSlot.destination && beat.step.destination == StoryRole.elsewhere) {
        // The story moved on: where it went is where it happens from here.
        roles.place = _Requirement(
          drawn.word,
          const <SentenceSlot?>[SentenceSlot.place],
          theme: drawn.theme,
          known: drawn.known,
          settled: true,
        );
      } else if (slot == SentenceSlot.place || beat.step.destination == StoryRole.place) {
        roles.place ??= _Requirement(
          drawn.word,
          const <SentenceSlot?>[SentenceSlot.place],
          theme: drawn.theme,
          known: drawn.known,
          settled: true,
        );
      }
    }

    // A remark that drew the thing it is about has named it: that is the story's
    // thing from here on. And a person met by name — which no scene records,
    // because a name is no noun phrase — is the story's person.
    final subject = one.subject;

    if (commented != null &&
        commented.noun == null &&
        subject != null &&
        beat.step.object != null) {
      final role = _Requirement(
        subject,
        const <SentenceSlot?>[SentenceSlot.object],
        theme: one.theme,
        known: one.theme != null,
        settled: true,
      );

      if (beat.step.object == StoryRole.prop) {
        roles.prop ??= role;
      } else {
        roles.item ??= role;
      }
    } else if (beat.step.object == StoryRole.item &&
        roles.item == null &&
        !one.scene.containsKey(SentenceSlot.object)) {
      final met = one.names.where((name) => name != one.subject).firstOrNull;

      if (met != null) {
        roles.item = _Requirement(
          met,
          const <SentenceSlot?>[SentenceSlot.object],
          known: false,
          bare: true,
          settled: true,
        );
      }
    }

    telling.spent.addAll(one.used);
    placed =
        scene ||
        one.scene.containsKey(SentenceSlot.place) ||
        ((beat.step.destination == StoryRole.place ||
                beat.step.destination == StoryRole.elsewhere) &&
            one.scene.containsKey(SentenceSlot.destination));

    if (one.dayAt > dayAt) dayAt = one.dayAt;
    if (topic == null && !scene && !aside && commented == null) topic = _topicOf(one);

    heroLast = !scene && !aside && commented == null;

    return _Told(one, type, mark, opened, follow);
  }

  // The range is shared out again after every sentence, over the ones still to
  // come: a sentence that fell short hands what it did not use to the next one.
  var totalMin = data.space.length * (telling.budgets.length - 1);
  var totalMax = totalMin;

  for (final range in telling.budgets) {
    totalMin += range.min;
    totalMax += range.max;
  }

  var written = 0;

  for (var i = 0; i < beats.length; i += 1) {
    final beat = beats[i];
    var left = 0;

    for (var j = i; j < beats.length; j += 1) {
      if (beats[j].join != JoinSide.second) left += 1;
    }

    final gaps = data.space.length * (at + left - 1);
    final budget =
        _shareOut(
          LengthRange(
            _atLeast(left, totalMin - written - gaps),
            _atLeast(left, totalMax - written - gaps),
          ),
          left,
          data.space.length,
        ).first;
    _Told told;

    // Two beats the plan joined are written as one sentence only where the range
    // has room for both clauses; where it has not, the first is written on its own
    // and the second — never a step the story needs — is left out.
    final join = data.join;
    final glue =
        (join?.word == null ? 0 : join!.word!.length + data.space.length) + data.space.length;
    final joinsNext = beat.join == JoinSide.first && i + 1 < beats.length;
    final fits = joinsNext && shortestFor(beat) + shortestFor(beats[i + 1]) + glue <= budget.max;

    if (joinsNext && !fits && !beats[i + 1].step.required) {
      told = tell(beat.unjoined(), budget, null);
      i += 1;
    } else if (joinsNext) {
      // Two clauses share one sentence's range: the join between them comes off
      // the top, and each clause gets its share of what is left.
      final min = _atLeast(2, budget.min - glue);
      final max = _atLeast(2, budget.max - glue);
      final firstRange = LengthRange(
        _atLeast(1, (min * _firstClauseShare).floor()),
        _atLeast(1, (max * _firstClauseShare).floor()),
      );
      final secondRange = LengthRange(
        _atLeast(1, min - firstRange.min),
        _atLeast(1, max - firstRange.max),
      );
      final first = tell(beat, firstRange, null);
      final second = tell(beats[i + 1], secondRange, first.one, first.opened);

      told = _Told(
        _joinClauses(data, first.one, second.one),
        second.type,
        second.mark,
        first.opened,
        first.follow,
      );
      i += 1;

      // The estimate above is the shortest the two shapes could be, and the clauses
      // are drawn against pinned nouns the estimate did not know. A two-clause
      // sentence that overshoots after all gives up its second clause where the
      // story can spare it, and is drawn again as one.
      if (told.one.sentence.length > budget.max + 1 &&
          !beats[i].step.required &&
          first.one.sentence.length <= budget.max) {
        told = tell(beat.unjoined(), budget, null);
      }
    } else {
      told = tell(beat, budget, null);
    }

    built.add(told.one);
    last = told.one;
    written += told.one.sentence.length + (at > 0 ? data.space.length : 0);
    at += 1;

    final flow = telling.flow;

    flow.run = told.type == flow.last ? flow.run + 1 : 1;
    flow.last = told.type;
    flow.mark = told.mark;
    flow.opened = told.opened.isNotEmpty;
    flow.lead ??= told.type;

    // Whether the topic was just named is about the hero's own sentences: a
    // scene, somebody else's doing, a remark and an answer say nothing of it.
    if (beat.step.kind != StepKind.scene &&
        beat.step.kind != StepKind.other &&
        beat.voice == null) {
      flow.repeated = told.follow == null || told.follow!.reference == _Reference.repeat;
    }

    if (told.opened.isNotEmpty) flow.openers.add(told.opened);
  }

  // A named hero has no theme, and the scene's place is not what the story is about.
  final hero = topic;

  return _Result(built, telling.tense, story.name, hero != null ? hero.theme : built.first.theme);
}

/// Two clauses as one sentence: the first, then whatever the language writes
/// between them, then the second. The first clause closed on nothing and the
/// second opened on nothing, so the seam is the language's own space.
_Built _joinClauses(SentenceLanguageData data, _Built first, _Built second) {
  final word = data.join?.word;
  final glue = word == null ? '' : data.space + word;

  return _Built(
    first.sentence + glue + data.space + second.sentence,
    <String>[...first.phrases, ...second.phrases],
    <SentenceSlot>[...first.slots, ...second.slots],
    <String>[...first.names, ...second.names],
    <String>[...first.used, ...second.used],
    second.type,
    first.theme,
    first.subject ?? second.subject,
    first.gender ?? second.gender,
    first.named || second.named,
    <SentenceSlot, _Requirement>{...first.scene, ...second.scene},
    second.field,
    first.dayAt > second.dayAt ? first.dayAt : second.dayAt,
    second.object ?? first.object,
  );
}

/// Generate sentences with every choice already resolved.
///
/// `randSentence` and `randSentenceDetails` are the two public shapes over this.
List<SentenceDetail> generateSentenceDetails({
  WordLanguage? language,
  WordTheme? theme,
  SentenceShape? shape,
  Set<SentenceSlot>? slots,
  List<String> include = const <String>[],
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
  int sentences = 1,
  bool? includeName,
  Set<SentenceType>? type,
  SentenceQuote? quote,
  SentenceStyle? style,
  SentenceTense? tense,
  SentenceStory? story,
  RandVocabulary vocabulary = RandVocabulary.common,
}) {
  final settings = _Settings(
    theme: theme,
    shape: shape,
    slots: slots,
    invent: resolveRealism(realism),
    minLength: minLength,
    maxLength: maxLength,
    prefix: resolvePrefix(startsWith),
    include: include.map((word) => word.trim()).where((word) => word.isNotEmpty).toList(),
    sentences: clampInt(sentences, 1, randSentenceCountMax),
    realism: realism,
    includeName: includeName,
    types: type == null || type.isEmpty ? SentenceType.values : type.toList(growable: false),
    quote: quote,
    style: style,
    tense: tense,
    story: story,
    // A caller who named the kinds — every one of them included — gets them; a
    // story writes statements otherwise.
    typed: type != null && type.isNotEmpty,
    vocabulary: vocabulary,
  );

  return collect<SentenceDetail>(
    count: count,
    unique: unique,
    startsWith: settings.prefix,
    draw: () {
      // A result either has a person in it or does not; deciding that per sentence
      // would put a name in one line of a paragraph and not the next. It is
      // settled before the language is drawn, because `_languagesFor` reads it to
      // prefer the languages that can answer.
      final drawn = settings.includeName == null ? settings.naming(chance(50)) : settings;
      final WordLanguage code = language ?? pick(_languagesFor(drawn));
      final data = sentenceData[code]!;
      final result = _generateResult(code, drawn);
      final built = result.built;

      return SentenceDetail(
        sentence: built.map((one) => one.sentence).join(data.space),
        sentences: List<String>.unmodifiable(built.map((one) => one.sentence)),
        phrases: List<String>.unmodifiable(built.expand((one) => one.phrases)),
        // Unmodifiable, and a copy: the frames are the language's own, so a
        // caller reading the detail must not be able to reach into them.
        slots: List<SentenceSlot>.unmodifiable(built.expand((one) => one.slots)),
        names: List<String>.unmodifiable(built.expand((one) => one.names)),
        types: List<SentenceType>.unmodifiable(built.map((one) => one.type)),
        tense: result.tense,
        story: result.story,
        language: code,
        // What the result is about: its hero in a story, and otherwise what its
        // first sentence was about, which the ones after it stay inside.
        theme: result.theme,
      );
    },
    keyOf: (detail) => detail.sentence,
  );
}
