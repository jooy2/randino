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
];

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
List<SentenceFrame> _framesFor(SentenceLanguageData data, _Settings settings) {
  final wanted = settings.slots;
  final bySlots =
      wanted == null
          ? data.frames
          : data.frames.where((frame) => _matchesSlots(frame, wanted)).toList(growable: false);
  final allowed = bySlots.isNotEmpty ? bySlots : data.frames;
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
_Placement _planFor(SentenceFrame frame, List<_Requirement> requirements) {
  final plan = _Plan(<int, _Requirement>{}, <int, _Requirement>{});
  var complete = true;

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
    SentenceSlot.verb: _span(data.verbs.map((group) => group.words)),
    SentenceSlot.state: _span(data.states.map((group) => group.words)),
    SentenceSlot.manner: _span(<WordPool>[data.manners]),
    SentenceSlot.time: _span(<WordPool>[data.times]),
  };

  bounds[SentenceSlot.object] = bounds[SentenceSlot.subject]!;
  bounds[SentenceSlot.place] = bounds[SentenceSlot.subject]!;

  _boundsCache[language] = bounds;
  _modifierBounds[language] = poolBounds(wordData[language]!.adjectives);

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

  return LengthRange(
    head + low + own.min + _tailMin(part),
    head + high + withModifier + own.max + _tailMax(part),
  );
}

/// Shortest and longest sentence a shape can produce.
LengthRange _frameRange(
  SentenceFrame frame,
  SentenceLanguageData data,
  Map<SentenceSlot, LengthRange> bounds,
  LengthRange modifier,
) {
  var min = data.terminator.length;
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
  final modifier = _modifierBounds[language]!;
  var min = 1 << 30;
  var max = 0;

  for (final frame in data.frames) {
    final range = _frameRange(frame, data, bounds, modifier);

    if (range.min < min) min = range.min;
    if (range.max > max) max = range.max;
  }

  return LengthRange(min, max);
}

/* --- Choosing the words ---------------------------------------------------- */

/// The themes among [themes] whose nouns are one of [classes].
List<WordTheme> _themesForClasses(List<WordTheme> themes, List<NounClass> classes) =>
    themes.where((theme) => classes.contains(themeClass[theme])).toList(growable: false);

SentenceFrame _pickFrame(List<SentenceFrame> frames) {
  var total = 0;

  for (final frame in frames) {
    total += frame.weight;
  }

  var roll = randDouble() * total;

  for (final frame in frames) {
    roll -= frame.weight;

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
  final wantsObject = frame.parts.any((part) => part.slot == SentenceSlot.object);
  final subject = _requiredAt(frame, plan, SentenceSlot.subject);
  final object = _requiredAt(frame, plan, SentenceSlot.object);
  final verb = _requiredAt(frame, plan, SentenceSlot.verb);

  return data.verbs
      .where((group) {
        if ((group.object != null) != wantsObject) return false;
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

class _Phrase {
  const _Phrase(this.text, this.noun, this.theme);

  final String text;
  final String noun;
  final WordTheme? theme;
}

class _Built {
  const _Built(this.sentence, this.phrases, this.slots, this.theme);

  final String sentence;
  final List<String> phrases;
  final List<SentenceSlot> slots;
  final WordTheme? theme;
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
}) {
  final lexicon = wordData[language]!;
  final pool = _nounsOf(language, theme);
  final space = data.space.length;
  final nouns = poolBounds(pool);
  final modifiers = poolBounds(lexicon.adjectives);
  final article = bare ? const LengthRange(0, 0) : _articleSpan(data);
  final overhead = article.max == 0 ? 0 : article.max + space;
  final modCost = modify ? modifiers.min + space : 0;
  final high = _atLeast(1, _atMost(nouns.max, max - overhead - modCost));
  final low = _atLeast(1, min - overhead - (modify ? modifiers.max + space : 0));
  final drawn =
      forced ??
      _plain(lexicon, drawWord(lexicon, pool, invent, low < high ? low : high, high, prefix).word);
  final gender = lexicon.nounGender?[_asPool(lexicon, drawn)];
  final parts = <String>[drawn];

  if (modify) {
    final room = max - overhead - drawn.length - space;
    final want = min - overhead - drawn.length - space;
    final chosen =
        forcedModifier ??
        _plain(
          lexicon,
          pickWord(
                lexicon.adjectives,
                _atLeast(1, _atMost(want, room)),
                _atLeast(1, _atMost(modifiers.max, room)),
                '',
              ) ??
              pick(lexicon.adjectives),
        );
    final modifier = agree(lexicon, chosen, gender);

    if (modifierFollows(lexicon)) {
      parts.add(modifier);
    } else {
      parts.insert(0, modifier);
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
  if (slot == SentenceSlot.object) {
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
) {
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
                    .where(
                      (group) =>
                          (group.object != null) ==
                          frame.parts.any((part) => part.slot == SentenceSlot.object),
                    )
                    .toList(growable: false),
          );
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
  // Only a shape that opens on a noun phrase with nothing in front of it can
  // honour `startsWith`; anywhere else the sentence opens on an article, a
  // preposition or an adverbial, and `collect` filters what does not match.
  final first = frame.parts.first;
  final prefixable = _isNounSlot(first.slot) && first.head == null && data.articles == null;
  final space = data.space.length;
  final spans = <LengthRange>[
    for (var i = 0; i < frame.parts.length; i += 1)
      () {
        final range = _partRange(frame.parts[i], data, bounds, modifierBounds);
        final gap = i == 0 ? 0 : space;

        return LengthRange(gap + range.min, gap + range.max);
      }(),
  ];
  final written = <String>[];
  final reported = <String>[];
  final slots = <SentenceSlot>[];
  _Phrase? subject;
  WordGender? gender;
  var used = data.terminator.length;

  for (var i = 0; i < frame.parts.length; i += 1) {
    final part = frame.parts[i];
    var restMin = 0;
    var restMax = 0;

    for (var rest = i + 1; rest < frame.parts.length; rest += 1) {
      restMin += spans[rest].min;
      restMax += spans[rest].max;
    }

    final gap = i == 0 ? 0 : space;
    final headCost = part.head == null ? 0 : part.head!.length + space;
    final overhead = gap + headCost + _tailMin(part);
    final high = _atLeast(1, max - used - overhead - restMin);
    final low = _atLeast(1, min - used - overhead - restMax);
    String phrase;

    if (_isNounSlot(part.slot)) {
      final required = plan.phrase[i];
      final owed = plan.modifier[i];
      final theme =
          part.slot == SentenceSlot.subject
              ? subjectTheme
              : (required?.theme ?? _themeForPart(part.slot, verbGroup?.object, themes));
      final room = high - poolBounds(_nounsOf(language, theme)).min;
      final modify =
          part.modifiable &&
          (owed != null || (room >= modifierBounds.min + space && chance(modifyChance)));
      final built = _nounPhrase(
        language,
        data,
        theme,
        forced: required?.word,
        modify: modify,
        bare: part.bare,
        forcedModifier: owed?.word,
        invent: settings.invent,
        prefix: prefixable && i == 0 ? settings.prefix : '',
        min: low,
        max: high,
      );

      phrase = built.text;

      if (part.slot == SentenceSlot.subject) {
        subject = built;
        gender = lexicon.nounGender?[_asPool(lexicon, built.noun)];
      }
    } else {
      phrase = _predicateFor(
        part.slot,
        lexicon,
        data,
        stateGroup?.words ?? verbGroup!.words,
        plan.phrase[i],
        gender,
        low,
        high,
      );
    }

    // The opening capital belongs to whatever is written first, and that is the
    // phrase itself unless a preposition stands in front of it. Applied here
    // rather than to the finished string, so the phrase the detail reports is
    // the one the sentence actually shows.
    final opens = data.capitalize && written.isEmpty;
    final head = opens && part.head != null ? _upper(part.head!) : part.head;
    final text = opens && part.head == null ? _upper(phrase) : phrase;
    final tail = _tailOf(part, text);

    if (head != null) written.add(head);

    written.add(text + tail);
    reported.add(text);
    slots.add(part.slot);
    used += gap + headCost + text.length + tail.length;
  }

  return _Built(written.join(data.space) + data.terminator, reported, slots, subject?.theme);
}

/// The word a phrase that is not a noun phrase writes: the predicate, or an
/// adverb.
String _predicateFor(
  SentenceSlot slot,
  WordLanguageData wordData,
  SentenceLanguageData data,
  WordPool predicates,
  _Requirement? required,
  WordGender? gender,
  int min,
  int max,
) {
  String agreed(String word) =>
      slot == SentenceSlot.state && data.predicateAgrees ? agree(wordData, word, gender) : word;

  if (required != null) return agreed(required.word);

  final pool =
      slot == SentenceSlot.manner
          ? data.manners
          : slot == SentenceSlot.time
          ? data.times
          : predicates;

  return agreed(pickWord(pool, min < max ? min : max, max, '') ?? pick(pool));
}

_Built _generateOne(WordLanguage language, _Settings settings) {
  final data = sentenceData[language]!;
  final bounds = _slotBounds(language);
  final modifierBounds = _modifierBounds[language]!;
  final allowed = _framesFor(data, settings);
  final requested = settings.theme == null ? wordThemes : <WordTheme>[settings.theme!];
  final requirements = settings.include
      .map((word) => _classify(language, word))
      .toList(growable: false);
  final placements = <SentenceFrame, _Placement>{
    for (final frame in allowed) frame: _planFor(frame, requirements),
  };
  final range = _boundsFor(data, allowed, bounds, modifierBounds, settings);
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
    final frame = _pickFrame(usable);
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

/// The length range one sentence has to land in.
LengthRange _boundsFor(
  SentenceLanguageData data,
  List<SentenceFrame> frames,
  Map<SentenceSlot, LengthRange> bounds,
  LengthRange modifier,
  _Settings settings,
) {
  var naturalMin = 1 << 30;
  var naturalMax = 0;

  for (final frame in frames) {
    final range = _frameRange(frame, data, bounds, modifier);

    if (range.min < naturalMin) naturalMin = range.min;
    if (range.max > naturalMax) naturalMax = range.max;
  }

  return lengthBounds(
    settings.minLength,
    settings.maxLength,
    naturalMin,
    naturalMax,
    ceiling: randSentenceLengthMax,
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
  );

  return collect<SentenceDetail>(
    count: count,
    unique: unique,
    startsWith: settings.prefix,
    draw: () {
      final WordLanguage code = language ?? pick(_languagesFor(settings));
      final built = _generateOne(code, settings);

      return SentenceDetail(
        sentence: built.sentence,
        phrases: List<String>.unmodifiable(built.phrases),
        // Unmodifiable, and a copy: the frames are the language's own, so a
        // caller reading the detail must not be able to reach into them.
        slots: List<SentenceSlot>.unmodifiable(built.slots),
        language: code,
        theme: built.theme,
      );
    },
    keyOf: (detail) => detail.sentence,
  );
}
