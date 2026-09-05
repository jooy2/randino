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
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/data/types.dart';
import 'package:randino/src/word/word_generator.dart';

// How many sentences to build before settling for the closest fit found.
const int _fitAttempts = 14;

// How often a noun phrase that may carry a modifier is given one. Length can
// override it in both directions — see [_modifyChanceFor].
const int _modifyChance = 45;

/// The slots that are a noun phrase, and so draw from the word pools.
const List<SentenceSlot> _nounSlots = <SentenceSlot>[
  SentenceSlot.subject,
  SentenceSlot.object,
  SentenceSlot.place,
  SentenceSlot.quantity,
];

/// The class money belongs to, which is what decides the verbs it can stand
/// beside.
///
/// An amount is an idea, so the verbs that remember and count one are the verbs
/// that can take it.
const NounClass _moneyClass = NounClass.idea;

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
  });

  final WordTheme? theme;
  final SentenceShape? shape;

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

  /// Whether a phrase about a person is written as a name.
  final bool includeName;

  /// What the sentences may be doing, normalized to a set to draw from.
  final List<SentenceType> types;

  /// Which marks a quoted line takes, or null for the type's own default.
  final SentenceQuote? quote;

  /// How the sentences address their reader, or null when the caller left it to
  /// the generator.
  final SentenceStyle? style;
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
        SentenceType.question: <PredicateForm>[PredicateForm.casual, PredicateForm.question],
        SentenceType.exclamation: <PredicateForm>[PredicateForm.casual, PredicateForm.exclamation],
      },
      SentenceStyle.polite: <SentenceType, List<PredicateForm>>{
        SentenceType.statement: <PredicateForm>[PredicateForm.polite],
        SentenceType.trailing: <PredicateForm>[PredicateForm.polite],
        SentenceType.question: <PredicateForm>[PredicateForm.polite, PredicateForm.question],
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

/// The kind whose mark a sentence of this type closes on.
///
/// Dialogue and thought have no mark of their own: what they quote is a sentence
/// of another kind, and they take its mark and put quotation marks around it.
SentenceType _markFor(SentenceType type) =>
    type == SentenceType.dialogue || type == SentenceType.thought ? pick(_quotedMarks) : type;

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
  const _Draw(this.budget, this.type, this.mark, this.quote, this.opener, this.style, this.follow);

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
  final _Follow? follow;
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
  const _Follow(this.topic, this.reference, this.pronoun);

  final _Topic topic;
  final _Reference reference;

  /// What a [_Reference.pronoun] writes; `''` where the language writes nothing.
  final String pronoun;
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
List<SentenceFrame> _framesFor(SentenceLanguageData data, _Settings settings, SentenceMood mood) {
  // A language that writes its question with the mark alone declares no question
  // shape, and answers with the statement shapes it does have. That is not a
  // fallback so much as the point: `¿El león corre?` is the statement.
  final byMood = data.frames.where((frame) => frame.mood == mood).toList(growable: false);
  final moody =
      byMood.isNotEmpty
          ? byMood
          : data.frames
              .where((frame) => frame.mood == SentenceMood.statement)
              .toList(growable: false);
  final usable = moody.isNotEmpty ? moody : data.frames;
  final wanted = settings.slots;
  final bySlots =
      wanted == null
          ? usable
          : usable.where((frame) => _matchesSlots(frame, wanted)).toList(growable: false);
  final allowed = bySlots.isNotEmpty ? bySlots : usable;
  final shape = settings.shape;

  if (shape == null) return allowed;

  final byShape = allowed.where((frame) => shapeOf(frame) == shape).toList(growable: false);

  return byShape.isNotEmpty ? byShape : allowed;
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
  const _Requirement(this.word, this.slots, {this.theme, this.known = true});

  final String word;

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

  final manner = _entryOf(data.manners, word);

  if (manner != null) {
    written = manner;
    slots.add(SentenceSlot.manner);
  }

  final time = _entryOf(data.times, word);

  if (time != null) {
    written = time;
    slots.add(SentenceSlot.time);
  }

  final modifier = _entryOf(lexicon.adjectives, word) ?? _entryOf(lexicon.actions, word);

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
_Placement _planFor(SentenceFrame frame, List<_Requirement> requirements, [_Requirement? subject]) {
  final plan = _Plan(<int, _Requirement>{}, <int, _Requirement>{});
  var complete = true;

  // A sentence carrying on about the topic is handed its subject rather than
  // asking for it, so it goes in the subject's own phrase before the greedy
  // placement below reaches for the first noun slot it can find.
  if (subject != null) {
    final at = _indexWhere(frame, (part, i) => part.slot == SentenceSlot.subject);

    if (at >= 0) plan.phrase[at] = subject;
  }

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
WordPool _nounsOf(WordLanguage language, WordTheme theme) {
  final key = '${language.name}:${theme.name}';
  final cached = _nounCache[key];

  if (cached != null) return cached;

  final data = wordData[language]!;
  final gender = data.nounGender;
  final all = data.nouns[theme]!;
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
LengthRange _nounSpan(WordLanguage language, WordTheme theme, int invent) {
  final key = '${language.name}:${theme.name}:$invent';
  final cached = _spanCache[key];

  if (cached != null) return cached;

  final pool = poolBounds(_nounsOf(language, theme));
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

/// The modifiers of a language, in the form they take beside a noun of [gender].
///
/// Written out rather than agreed after the fact, because a length budget has to
/// see the word the sentence will actually carry: German `blau` is `blauer` in
/// front of a masculine noun, and choosing by the four letters and writing the
/// six is how a sentence quietly stepped outside its range.
WordPool _agreedModifiers(WordLanguage language, WordGender? gender) {
  final lexicon = wordData[language]!;

  if (gender == null || lexicon.agreement == null) return lexicon.adjectives;

  final key = '${language.name}:${gender.name}';
  final cached = _agreedCache[key];

  if (cached != null) return cached;

  final agreed = lexicon.adjectives
      .map((word) => agree(lexicon, word, gender))
      .toList(growable: false);

  _agreedCache[key] = agreed;

  return agreed;
}

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
    SentenceSlot.subject: _span(wordThemes.map((theme) => _nounsOf(language, theme))),
    // Every form a predicate can take, not only the plain statement's: a question
    // form is a different length, and the shape is chosen against these.
    SentenceSlot.verb: _span(<WordPool>[
      for (final group in data.verbs) ...<WordPool>[
        group.words,
        ...group.forms.values.map(_endings),
      ],
    ]),
    SentenceSlot.state: _span(<WordPool>[
      for (final group in data.states) ...<WordPool>[
        group.words,
        ...group.forms.values.map(_endings),
      ],
    ]),
    SentenceSlot.manner: _span(<WordPool>[data.manners]),
    SentenceSlot.time: _span(<WordPool>[data.times]),
  };

  bounds[SentenceSlot.object] = bounds[SentenceSlot.subject]!;
  bounds[SentenceSlot.place] = bounds[SentenceSlot.subject]!;
  bounds[SentenceSlot.quantity] = bounds[SentenceSlot.subject]!;
  bounds[SentenceSlot.money] = _moneySpan(data);

  _boundsCache[language] = bounds;
  final lexicon = wordData[language]!;
  final genders = <WordGender?>[null, if (lexicon.agreement != null) ...lexicon.agreement!.keys];

  _modifierBounds[language] = _span(genders.map((gender) => _agreedModifiers(language, gender)));

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
LengthRange _partRange(
  SentencePart part,
  SentenceLanguageData data,
  Map<SentenceSlot, LengthRange> bounds,
  LengthRange modifier,
) {
  final space = data.space.length;
  final head = part.head == null ? 0 : part.head!.length + space;
  final own = bounds[part.slot]!;

  if (!_isNounSlot(part.slot)) {
    return LengthRange(head + own.min + _tailMin(part), head + own.max + _tailMax(part));
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
  SentenceLanguageData data,
  SentenceFrame frame,
  List<WordTheme> themes,
  _Plan plan,
) {
  // A quantity is an object with a number on it, and an amount is an object of
  // the class money belongs to — unless the quantity is what the sentence is
  // about, in which case it is the subject and the verb takes nothing.
  final wantsObject = _takesObject(frame);
  final wantsMoney = frame.parts.any((part) => part.slot == SentenceSlot.money);
  final subject = _requiredAt(frame, plan, SentenceSlot.subject);
  final object = _requiredAt(frame, plan, SentenceSlot.object);
  final verb = _requiredAt(frame, plan, SentenceSlot.verb);

  return data.verbs
      .where((group) {
        if ((group.object != null) != wantsObject) return false;
        if (wantsMoney && !(group.object?.contains(_moneyClass) ?? false)) return false;
        if (verb != null && !group.words.contains(verb.word)) return false;

        final subjectTheme = subject?.theme;

        if (subjectTheme != null && !group.subject.contains(themeClass[subjectTheme])) return false;

        final objectTheme = object?.theme;

        if (objectTheme != null && !(group.object?.contains(themeClass[objectTheme]) ?? false)) {
          return false;
        }

        return _themesForClasses(themes, group.subject).isNotEmpty &&
            (group.object == null || _themesForClasses(wordThemes, group.object!).isNotEmpty);
      })
      .toList(growable: false);
}

/// The same, for a shape headed by an adjective rather than a verb.
List<StateGroup> _stateGroupsFor(
  SentenceLanguageData data,
  List<WordTheme> themes,
  SentenceFrame frame,
  _Plan plan,
) {
  final subject = _requiredAt(frame, plan, SentenceSlot.subject);
  final state = _requiredAt(frame, plan, SentenceSlot.state);

  return data.states
      .where((group) {
        if (state != null && !group.words.contains(state.word)) return false;

        final subjectTheme = subject?.theme;

        if (subjectTheme != null && !group.subject.contains(themeClass[subjectTheme])) return false;

        return _themesForClasses(themes, group.subject).isNotEmpty;
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
    this.type,
    this.theme,
    this.subject,
    this.gender,
    this.named,
  );

  final String sentence;
  final List<String> phrases;
  final List<SentenceSlot> slots;

  /// The person names this sentence was written with, in order.
  final List<String> names;

  /// What this sentence is doing.
  final SentenceType type;
  final WordTheme? theme;

  /// The subject noun as written, which is what the next sentence carries on
  /// about.
  final String? subject;

  /// Its gender, for the pronoun and the agreement of whatever follows.
  final WordGender? gender;

  /// Whether that subject is a person's name.
  final bool named;
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
}) {
  final lexicon = wordData[language]!;
  final pool = _nounsOf(language, theme);
  final space = data.space.length;
  // Measured against the base forms, because the noun that decides the gender
  // has not been drawn yet; the modifier itself is chosen from the agreed pool.
  final modifiers = poolBounds(lexicon.adjectives);
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
    final agreed = _agreedModifiers(language, gender);
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
/// the gender a modifier and a predicate agree with — and only for a language
/// whose words agree at all, since nothing else has any use for it.
_Named _properName(
  WordLanguage language,
  WordLanguageData lexicon,
  _Settings settings,
  String prefix,
  int min,
  int max,
) {
  final drawn = drawName(
    NameLanguage.values.byName(language.name),
    includeSurname: false,
    realism: settings.realism,
    startsWith: prefix,
    minLength: min,
    maxLength: max,
  );

  return _Named(
    drawn.native,
    lexicon.agreement == null
        ? null
        : (drawn.gender == NameGender.male ? WordGender.m : WordGender.f),
  );
}

/// How long a given name of the language can be, which is what a phrase reserves.
LengthRange _nameSpan(WordLanguage language) =>
    nameLengthRange(language: NameLanguage.values.byName(language.name), includeSurname: false);

/// The particle a part writes after its phrase, in the form the phrase asks for.
String _tailOf(SentencePart part, String phrase) {
  final alt = part.tailAlt;

  if (alt != null && endsWithConsonant(phrase)) return alt;

  return part.tail ?? '';
}

/// How often a noun phrase carries a modifier on this attempt.
///
/// The first attempt leaves it to chance; after that, a sentence that overshot
/// the range drops its modifiers and one that fell short takes them everywhere,
/// which is how the length range picks the shape rather than truncating a word.
int _modifyChanceFor(int distance, bool tooLong) {
  if (distance == 0) return _modifyChance;

  return tooLong ? 0 : 100;
}

/// The theme a phrase other than the subject draws from.
WordTheme _themeForPart(SentenceSlot slot, List<NounClass>? objectClasses, List<WordTheme> themes) {
  if (slot == SentenceSlot.object || slot == SentenceSlot.quantity) {
    final usable = _themesForClasses(wordThemes, objectClasses ?? const <NounClass>[]);

    return pick(usable.isNotEmpty ? usable : wordThemes);
  }

  final places = _themesForClasses(wordThemes, const <NounClass>[NounClass.place]);

  return pick(places.isNotEmpty ? places : themes);
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
  final lexicon = wordData[language]!;
  final themes = requested.isNotEmpty ? requested : wordThemes;
  final headed = frame.parts.any((part) => part.slot == SentenceSlot.state);
  // A shape whose predicate has nothing to say about the requested subject only
  // gets this far when no shape of the language did, so the fallback is the same
  // best effort every other narrowing here makes.
  final states = headed ? _stateGroupsFor(data, themes, frame, plan) : const <StateGroup>[];
  final verbs = headed ? const <VerbGroup>[] : _verbGroupsFor(data, frame, themes, plan);
  final StateGroup? stateGroup = headed ? pick(states.isNotEmpty ? states : data.states) : null;
  final VerbGroup? verbGroup =
      headed
          ? null
          : pick(
            verbs.isNotEmpty
                ? verbs
                : data.verbs
                    .where((group) => (group.object != null) == _takesObject(frame))
                    .toList(growable: false),
          );
  // The same predicates, in the form this type of sentence ends on. Index-aligned
  // with the plain words, which is what lets a required word be translated rather
  // than written out in the wrong form.
  final base = stateGroup?.words ?? verbGroup!.words;
  final predicates = _formOf(stateGroup, verbGroup, draw.mark, draw.style);
  final subjectClasses = stateGroup?.subject ?? verbGroup!.subject;
  final subjectThemes = _themesForClasses(themes, subjectClasses);
  final subjectRequired = _requiredAt(frame, plan, SentenceSlot.subject);
  // A theme the caller named is honoured even when no verb group of the language
  // has anything to say about it, the same way a shape it cannot make falls back
  // rather than being answered with something else entirely.
  // Written out: `??` would otherwise infer `pick`'s type argument from the
  // nullable left-hand side, and hand back a `WordTheme?`.
  final WordTheme subjectTheme =
      subjectRequired?.theme ?? pick<WordTheme>(subjectThemes.isNotEmpty ? subjectThemes : themes);
  // A sentence carrying on about the topic stands a pronoun where its subject
  // would go, and the languages that drop their subject stand nothing there at
  // all — in which case the phrase is not in the shape to carry an article, a
  // modifier or a particle. Written out as its own list so that every budget
  // below is measured against what the sentence actually writes; `at` is the
  // index back into the frame, which is what the plan is keyed by.
  final String? pronoun = follow?.reference == _Reference.pronoun ? follow!.pronoun : null;
  final shape = <SentencePart>[];
  final at = <int>[];

  for (var i = 0; i < frame.parts.length; i += 1) {
    final part = frame.parts[i];

    if (part.slot != SentenceSlot.subject || pronoun == null || pronoun.isNotEmpty) {
      shape.add(part);
      at.add(i);
    }
  }

  // Only a shape that opens on a noun phrase with nothing in front of it can
  // honour `startsWith`; anywhere else the sentence opens on an article, a
  // preposition or an adverbial, and `collect` filters what does not match. A
  // sentence after the first one never opens the result, so it never carries it.
  final first = shape.first;
  final prefixable =
      follow == null && _isNounSlot(first.slot) && first.head == null && data.articles == null;
  final space = data.space.length;
  final opener = draw.opener;
  final close = data.terminators[draw.mark]!;
  final open = data.openers[draw.mark] ?? '';
  final quoteOpen = draw.quote?[0] ?? '';
  final quoteClose = draw.quote?[1] ?? '';
  final tag = frame.tag == null ? '' : data.space + frame.tag!;
  // Every phrase's theme is settled before any of them is drawn, because a length
  // budget is only as good as the pools it was measured against. Left to the loop,
  // each phrase was given the room the language's longest noun would need and drew
  // a word out of its own theme, which is how a sentence came out short of a
  // `minLength` the shape could otherwise have reached.
  final subjectSlot = _subjectSlotOf(frame);
  final partThemes = <WordTheme?>[
    for (var i = 0; i < shape.length; i += 1)
      !_isNounSlot(shape[i].slot)
          ? null
          : shape[i].slot == subjectSlot
          ? subjectTheme
          : (plan.phrase[at[i]]?.theme ?? _themeForPart(shape[i].slot, verbGroup?.object, themes)),
  ];
  // What a phrase writes instead of a noun phrase, when it writes one at all: a
  // pronoun standing in for the topic, the name a repeat carries forward, or a
  // fresh name for a phrase about a person. All three are bare words — no
  // article, no modifier, nothing but the word and whatever particle the frame
  // puts after it — and `''` marks the one that has to be drawn against the room
  // it is given.
  final proper = <String?>[
    for (var i = 0; i < shape.length; i += 1)
      () {
        final part = shape[i];

        if (part.slot == SentenceSlot.subject && pronoun != null && pronoun.isNotEmpty) {
          return pronoun;
        }

        if (part.slot == SentenceSlot.subject &&
            follow?.reference == _Reference.repeat &&
            follow!.topic.named) {
          return follow.topic.noun;
        }

        final theme = partThemes[i];

        return settings.includeName && theme != null && themeClass[theme] == NounClass.person
            ? ''
            : null;
      }(),
  ];
  final parts = <SentencePart>[
    for (var i = 0; i < shape.length; i += 1)
      proper[i] == null
          ? shape[i]
          : SentencePart(
            shape[i].slot,
            head: shape[i].head,
            tail: shape[i].tail,
            tailAlt: shape[i].tailAlt,
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

    if (partThemes[i] != null) {
      // A name that has still to be drawn is budgeted against the given names of
      // the language rather than against its nouns — `randName` invents from its
      // own syllables and draws from its own pools, and neither is this theme's.
      own[part.slot] =
          exact ??
          (proper[i] == ''
              ? _nameSpan(language)
              : _nounSpan(language, partThemes[i]!, settings.invent));
    } else if (part.slot == SentenceSlot.verb || part.slot == SentenceSlot.state) {
      own[part.slot] = exact ?? poolBounds(predicates);
    } else if (exact != null) {
      own[part.slot] = exact;
    }

    partBounds.add(own);
    partModifier.add(
      owed == null ? modifierBounds : LengthRange(owed.word.length, owed.word.length),
    );
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
  _Phrase? subject;
  var named = false;
  // A pronoun says nothing about its own gender, and neither does a name carried
  // over, so what agrees with either agrees with the noun it stands for.
  WordGender? gender =
      proper.any((word) => word != null && word.isNotEmpty) ? follow?.topic.gender : null;
  var used = close.length + open.length + tag.length + (opener.isEmpty ? 0 : opener.length + space);

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
    final headCost = part.head == null ? 0 : part.head!.length + space;
    final overhead = gap + headCost + _tailMin(part);
    final high = _atLeast(1, max - used - overhead - restMin);
    final low = _atLeast(1, min - used - overhead - restMax);
    String phrase;

    if (part.slot == SentenceSlot.money) {
      phrase = _moneyText(data);
    } else if (proper[i] != null) {
      // A bare proper noun, drawn now if it was not carried in. `high` and `low`
      // are what the phrase has room for, and the name generator fits them the
      // same way a noun would.
      if (proper[i]!.isNotEmpty) {
        phrase = proper[i]!;
      } else {
        final drawn = _properName(
          language,
          lexicon,
          settings,
          prefixable && i == 0 ? settings.prefix : '',
          low < high ? low : high,
          high,
        );

        phrase = drawn.text;
        names.add(drawn.text);

        if (part.slot == SentenceSlot.subject) gender = drawn.gender;
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
      // takes a modifier whatever the roll says, which is the only way it can
      // reach it — the alternative is a sentence that quietly misses `minLength`.
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
        // A counted phrase drops its article and takes no modifier: `12 apples`,
        // never `the 12 red apples`.
        bare: part.slot == SentenceSlot.quantity || part.bare,
        forcedModifier: owed?.word,
        invent: settings.invent,
        prefix: prefixable && i == 0 ? settings.prefix : '',
        min: low,
        max: high,
        nouns: nouns,
        count: part.slot == SentenceSlot.quantity ? _countText(data, theme) : '',
      );

      phrase = built.text;

      if (part.slot == subjectSlot) {
        subject = built;
        gender = genderOf(lexicon, _asPool(lexicon, built.noun));
      }
    } else {
      phrase = _predicateFor(
        part.slot,
        lexicon,
        data,
        base,
        predicates,
        plan.phrase[at[i]],
        gender,
        low,
        high,
      );
    }

    // The opening capital belongs to whatever is written first, and that is the
    // phrase itself unless a connective or a preposition stands in front of it.
    // Applied here rather than to the finished string, so the phrase the detail
    // reports is the one the sentence actually shows.
    final opens = data.capitalize && written.isEmpty;
    final head = opens && part.head != null ? _upper(part.head!) : part.head;
    final text = opens && part.head == null ? _upper(phrase) : phrase;
    final tail = _tailOf(part, text);

    if (head != null) written.add(head);

    written.add(text + tail);
    reported.add(text);
    slots.add(part.slot);
    used += gap + headCost + text.length + tail.length;

    // The opening capital belongs to the name too, so what the detail reports is
    // what the sentence shows.
    if (proper[i] != null && proper[i]!.isEmpty && text != phrase) {
      names[names.length - 1] = text;
    }
  }

  // A sentence whose subject is a name carries that name forward; one whose
  // subject was dropped carries forward what it was already handed.
  final carried =
      named
          ? reported[slots.indexOf(SentenceSlot.subject)]
          : (subject?.noun ?? (pronoun != null && pronoun.isNotEmpty ? follow!.topic.noun : null));

  return _Built(
    // The opener is written against the first phrase rather than beside it —
    // Spanish `¿El león corre?`, never `¿ El león corre ?`.
    quoteOpen + open + written.join(data.space) + tag + close + quoteClose,
    reported,
    slots,
    names,
    draw.type,
    named ? null : subject?.theme,
    carried,
    subject != null || named ? gender : (pronoun != null ? follow!.topic.gender : null),
    named || (pronoun != null && (follow?.topic.named ?? false)),
  );
}

/// The predicates of a group, in the form this sentence ends on.
///
/// Each level falls back along its own chain to the plain statement the `words`
/// already are, so a group declares only what its language actually writes.
/// Japanese declares `polite` alone and it serves the formal level and the
/// question too, because the `か` that asks is the frame's tag rather than part
/// of the verb.
WordPool _formOf(
  StateGroup? stateGroup,
  VerbGroup? verbGroup,
  SentenceType mark,
  SentenceStyle style,
) {
  final forms = stateGroup?.forms ?? verbGroup!.forms;
  final words = stateGroup?.words ?? verbGroup!.words;

  for (final key in _formChain[style]![mark]!) {
    final pool = forms[key];

    if (pool != null) return pool.map(_oneOf).toList(growable: false);
  }

  return words;
}

/// The word a phrase that is not a noun phrase writes: the predicate, or an
/// adverb.
String _predicateFor(
  SentenceSlot slot,
  WordLanguageData wordData,
  SentenceLanguageData data,
  WordPool base,
  WordPool predicates,
  _Requirement? required,
  WordGender? gender,
  int min,
  int max,
) {
  String agreed(String word) =>
      slot == SentenceSlot.state && data.predicateAgrees ? agree(wordData, word, gender) : word;

  if (required != null) {
    // A word the caller named is named in the form a statement ends on, and the
    // form pools are index-aligned so that it can be said the other way instead.
    final at = base.indexOf(required.word);

    return agreed(at >= 0 && at < predicates.length ? predicates[at] : required.word);
  }

  final pool =
      slot == SentenceSlot.manner
          ? data.manners
          : slot == SentenceSlot.time
          ? data.times
          : predicates;

  return agreed(pickWord(pool, min < max ? min : max, max, '') ?? pick(pool));
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
      settings.includeName
          ? _themesForClasses(requested, const <NounClass>[NounClass.person])
          : requested;
  final themes = wanted.isNotEmpty ? wanted : requested;
  final topicClass = follow?.topic.nounClass;

  if (topicClass == null) return themes;

  final inClass = _themesForClasses(themes, <NounClass>[topicClass]);

  return inClass.isNotEmpty ? inClass : themes;
}

_Built _generateOne(WordLanguage language, _Settings settings, _Draw draw) {
  final follow = draw.follow;
  final budget = draw.budget;
  final data = sentenceData[language]!;
  final bounds = _slotBounds(language);
  final modifierBounds = _modifierBounds[language]!;
  final allowed = _framesFor(data, settings, _moodFor(draw.mark));
  final requested = _subjectThemesFor(settings, follow);
  // The words a caller required go in the first sentence — once in the result
  // rather than once in every sentence of it.
  final requirements =
      follow != null
          ? const <_Requirement>[]
          : settings.include.map((word) => _classify(language, word)).toList(growable: false);
  final carried =
      follow?.reference == _Reference.repeat
          ? _Requirement(
            follow!.topic.noun,
            const <SentenceSlot?>[SentenceSlot.subject],
            theme: follow.topic.theme,
            known: follow.topic.theme != null,
          )
          : null;
  final placements = <SentenceFrame, _Placement>{
    for (final frame in allowed) frame: _planFor(frame, requirements, carried),
  };
  final range = budget;
  // A shape is only worth drawing when the language has a predicate for it: a
  // `body` subject has no transitive verb in any language here, so a shape with
  // an object in it would have to fall back to a verb that means something else.
  bool buildable(SentenceFrame frame) {
    final placement = placements[frame]!;

    if (!placement.complete) return false;

    return frame.parts.any((part) => part.slot == SentenceSlot.state)
        ? _stateGroupsFor(data, requested, frame, placement.plan).isNotEmpty
        : _verbGroupsFor(data, frame, requested, placement.plan).isNotEmpty;
  }

  // Prefer a shape that can land inside the range, then one that has somewhere
  // to put every word the caller required, and settle for any of them after that.
  final fitting = allowed
      .where((frame) {
        final own = _frameRange(frame, data, bounds, modifierBounds);

        return own.max >= range.min && own.min <= range.max && buildable(frame);
      })
      .toList(growable: false);
  final loose = allowed.where(buildable).toList(growable: false);
  final usable = fitting.isNotEmpty ? fitting : (loose.isNotEmpty ? loose : allowed);
  _Built? best;
  var bestDistance = 1 << 30;
  var bestTooLong = false;

  for (var attempt = 0; attempt < _fitAttempts; attempt += 1) {
    // After a miss, a shape whose own range runs past the requested one in the
    // direction that was missed is four times as likely. Weighted rather than
    // filtered: a shape that missed by two characters can still make it on the
    // next draw, and dropping it left a language whose short shape was the only
    // one in range settling for whatever it had.
    final frame = _pickFrame(
      usable,
      attempt == 0 || bestDistance == 0
          ? null
          : (candidate) {
            final own = _frameRange(candidate, data, bounds, modifierBounds);

            return (bestTooLong ? own.min <= range.min : own.max >= range.max) ? 4 : 1;
          },
    );
    final built = _compose(
      language,
      data,
      frame,
      placements[frame]!.plan,
      requested,
      settings,
      _modifyChanceFor(attempt == 0 ? 0 : bestDistance, bestTooLong),
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
  SentenceLanguageData data,
  List<SentenceFrame> frames,
  Map<SentenceSlot, LengthRange> bounds,
  LengthRange modifier,
  _Settings settings,
) {
  final count = settings.sentences;
  final gap = data.space.length * (count - 1);
  final natural = _naturalSpan(data, frames, bounds, modifier);

  return lengthBounds(
    settings.minLength,
    settings.maxLength,
    natural.min * count + gap,
    natural.max * count + gap,
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

// How a sentence refers to the topic, against the other two ways of doing it.
const Map<_Reference, int> _referenceWeight = <_Reference, int>{
  _Reference.repeat: 25,
  _Reference.pronoun: 40,
  _Reference.fresh: 35,
};

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
  final pool =
      data.pronouns[topic.gender ?? WordGender.n] ??
      data.pronouns[WordGender.n] ??
      const <String>[];
  final topicClass = topic.nounClass;

  if (topicClass != null && data.pronounless.contains(topicClass)) {
    return pool.where((word) => word.isEmpty).toList(growable: false);
  }

  return pool;
}

/// How one sentence carries on from the one before it.
_Follow _followFor(SentenceLanguageData data, _Topic topic) {
  final pronouns = _pronounsFor(data, topic);
  final usable =
      pronouns.isNotEmpty
          ? const <_Reference>[_Reference.repeat, _Reference.pronoun, _Reference.fresh]
          : const <_Reference>[_Reference.repeat, _Reference.fresh];
  var total = 0;

  for (final each in usable) {
    total += _referenceWeight[each]!;
  }

  var roll = randDouble() * total;
  var reference = usable.last;

  for (final each in usable) {
    roll -= _referenceWeight[each]!;

    if (roll <= 0) {
      reference = each;
      break;
    }
  }

  return _Follow(topic, reference, reference == _Reference.pronoun ? pick(pronouns) : '');
}

/// What a sentence opens on: an interjection when it is an exclamation, and a
/// connective when it follows another.
///
/// Never both — a sentence that opened on two things at once would be shouting
/// its own footnote. [room] is what the sentence may be at its longest, and it
/// is what decides whether it opens on anything at all: what stands in front is
/// written before a whole sentence rather than instead of any part of it, so one
/// longer than the budget can spare is a sentence that overshoots by exactly its
/// length. Russian `тем временем` is thirteen characters, and a third of a range
/// of seventy-five has nowhere to put them.
String _openerFor(
  SentenceLanguageData data,
  SentenceType mark,
  bool following,
  int room,
  int shortest,
) {
  final spare = room - data.space.length - shortest;

  List<String> fitting(WordPool pool) =>
      pool.where((word) => word.length <= spare).toList(growable: false);

  if (mark == SentenceType.exclamation) {
    final usable = fitting(data.interjections);

    if (usable.isNotEmpty && chance(_interjectionChance)) return pick(usable);
  }

  if (!following) return '';

  final usable = fitting(data.connectives);

  return usable.isNotEmpty && chance(_connectiveChance) ? pick(usable) : '';
}

/// Every sentence of one result, in order.
///
/// The range is shared out before the first of them is drawn, and the topic is
/// taken from that first sentence — so what follows is about the same thing
/// rather than another draw that happened to land beside it.
List<_Built> _generateResult(WordLanguage language, _Settings settings) {
  final data = sentenceData[language]!;
  final bounds = _slotBounds(language);
  final modifierBounds = _modifierBounds[language]!;
  // Every shape any of the requested types could take, because the budget is
  // shared out before the first type is even drawn.
  // A quoted line can be any kind at all, so its shapes are all of them.
  final frames = <SentenceFrame>[
    for (final type in settings.types)
      for (final mark
          in type == SentenceType.dialogue || type == SentenceType.thought
              ? _quotedMarks
              : <SentenceType>[type])
        ..._framesFor(data, settings, _moodFor(mark)),
  ];
  final shortest = _naturalSpan(data, frames, bounds, modifierBounds).min;
  final budgets = _shareOut(
    _boundsFor(data, frames, bounds, modifierBounds, settings),
    settings.sentences,
    data.space.length,
  );
  final built = <_Built>[];
  _Topic? topic;
  // The result's own voice, settled once. A caller who named a level gets that
  // one throughout; one who did not gets a paragraph that is at least consistent
  // with itself, rather than a level rerolled every sentence.
  // Written out: `??` would otherwise infer `pick`'s type argument from the
  // nullable left-hand side, and hand back a `SentenceStyle?`.
  final SentenceStyle voice = settings.style ?? pick<SentenceStyle>(_styles);

  for (var i = 0; i < settings.sentences; i += 1) {
    final budget = budgets[i];
    final type = pick(settings.types);
    final mark = _markFor(type);
    final follow = topic == null ? null : _followFor(data, topic);
    final draw = _Draw(
      budget,
      type,
      mark,
      _quoteFor(data, type, settings.quote),
      _openerFor(data, mark, follow != null, budget.max, shortest),
      _styleFor(type, settings.style, voice),
      follow,
    );
    var one = _generateOne(language, settings, draw);

    // `_openerFor` reserves room against the shortest sentence the shapes could
    // spell, which is a floor no draw actually reaches — the shortest word of
    // every pool at once. When the sentence that came back could not be made
    // short enough to carry what it opens on after all, that is the part worth
    // giving up: it stands in front of the whole sentence rather than instead of
    // any piece of it.
    if (draw.opener.isNotEmpty && _distanceFrom(one.sentence.length, budget) > 0) {
      final bare = _generateOne(
        language,
        settings,
        _Draw(draw.budget, draw.type, draw.mark, draw.quote, '', draw.style, draw.follow),
      );

      if (_distanceFrom(bare.sentence.length, budget) <
          _distanceFrom(one.sentence.length, budget)) {
        one = bare;
      }
    }

    built.add(one);
    topic ??= _topicOf(one);
  }

  return built;
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
  bool includeName = false,
  Set<SentenceType>? type,
  SentenceQuote? quote,
  SentenceStyle? style,
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
    types:
        type == null || type.isEmpty
            ? const <SentenceType>[SentenceType.statement]
            : type.toList(growable: false),
    quote: quote,
    style: style,
  );

  return collect<SentenceDetail>(
    count: count,
    unique: unique,
    startsWith: settings.prefix,
    draw: () {
      final WordLanguage code = language ?? pick(_languagesFor(settings));
      final data = sentenceData[code]!;
      final built = _generateResult(code, settings);

      return SentenceDetail(
        sentence: built.map((one) => one.sentence).join(data.space),
        sentences: List<String>.unmodifiable(built.map((one) => one.sentence)),
        phrases: List<String>.unmodifiable(built.expand((one) => one.phrases)),
        // Unmodifiable, and a copy: the frames are the language's own, so a
        // caller reading the detail must not be able to reach into them.
        slots: List<SentenceSlot>.unmodifiable(built.expand((one) => one.slots)),
        names: List<String>.unmodifiable(built.expand((one) => one.names)),
        types: List<SentenceType>.unmodifiable(built.map((one) => one.type)),
        language: code,
        // What the result is about is what its first sentence was about; the
        // ones after it stay inside that noun's class.
        theme: built.first.theme,
      );
    },
    keyOf: (detail) => detail.sentence,
  );
}
