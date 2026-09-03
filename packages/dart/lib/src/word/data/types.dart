// Internal shape of the per-language word datasets. Not part of the public API
// — consumers only ever see the option parameters and the two details.
//
// One dataset per language rather than one per generator: `randWord` and its
// fourteen themed forms draw from `nouns`, `randModifier` draws from
// `adjectives` and `actions`, and `randNickname` puts them together in the
// shapes `frames` allows. The pools are the same words either way, so they are
// written once.

import 'package:randino/src/types.dart';

/// A pool of words a generator can draw from.
typedef WordPool = List<String>;

/// How invented words are built at the abstract end of the style range.
sealed class WordSynthesis {
  /// Creates a synthesis template.
  const WordSynthesis({required this.minSyllables, required this.maxSyllables});

  /// Fewest syllables in an invented word.
  final int minSyllables;

  /// Most syllables in an invented word.
  final int maxSyllables;
}

/// Onset + vowel + coda, for alphabetic scripts (Blorin).
class SyllableSynthesis extends WordSynthesis {
  /// Creates a syllable template.
  const SyllableSynthesis({
    required this.onset,
    required this.vowel,
    required this.coda,
    required super.minSyllables,
    required super.maxSyllables,
  });

  /// Consonant clusters a syllable can open with.
  final WordPool onset;

  /// Vowels a syllable is built around.
  final WordPool vowel;

  /// Endings the last syllable can close on. Empty entries leave it open.
  final WordPool coda;
}

/// Pick N whole syllables or characters, for scripts where one character is
/// already a syllable (뮤겔, 星霧).
class PoolSynthesis extends WordSynthesis {
  /// Creates a syllable-pool template.
  const PoolSynthesis({
    required this.pool,
    required super.minSyllables,
    required super.maxSyllables,
  });

  /// The syllables to draw from. One entry is one character.
  final WordPool pool;
}

/// What one word does inside a nickname.
enum WordSlot {
  /// Says what the noun is like: 멋진, Brave, 青い.
  adjective,

  /// Says what the noun is doing: 웃는, Laughing, 踊る.
  action,

  /// The nickname's base word, out of one theme's pool.
  noun,

  /// A trailing noun, from [WordLanguageData.parts].
  part,
}

/// One shape a nickname can take, written in the order the language puts it in.
///
/// Per language rather than shared, because the shapes themselves differ:
/// Chinese needs 的 between a verb and its noun where Korean needs nothing, and
/// a language with no possessive particle has no possessive shape at all.
class WordFrame {
  /// Creates a nickname shape.
  const WordFrame(this.slots, this.weight, {this.glue});

  /// The words to draw, in order.
  final List<WordSlot> slots;

  /// How often this shape is used, against the other frames of the language.
  final int weight;

  /// A particle for each gap, so one entry shorter than [slots], and null where
  /// every gap is empty. It attaches to the word in front of it, which is what
  /// puts a word separator after it rather than around it (`사자의 눈물`, never
  /// `사자 의 눈물`).
  final List<String>? glue;

  /// The particle in front of the slot at [index], or `''` where there is none.
  String glueAt(int index) {
    final all = glue;

    return all == null || index < 1 || index > all.length ? '' : all[index - 1];
  }
}

/// Everything the generators know about one word language.
class WordLanguageData {
  /// Creates a language dataset.
  const WordLanguageData({
    required this.joiner,
    required this.capitalize,
    required this.nouns,
    required this.adjectives,
    required this.actions,
    required this.frames,
    required this.syn,
    this.parts,
  });

  /// Joins words that are put together. `''` everywhere so far — Korean and
  /// CJK words run together, and alphabetic ones read as CamelCase (BraveLion).
  final String joiner;

  /// Whether each word should be capitalized. Meaningless for CJK scripts.
  final bool capitalize;

  /// The words themselves, grouped by theme. Deliberately common nouns — never
  /// person names. Every theme has a pool; a language that could not fill one
  /// would not be a language these generators support.
  final Map<WordTheme, WordPool> nouns;

  /// Words that say what the noun is like, in the form that can sit straight in
  /// front of it (Korean attributive: 멋진, Japanese: 青い / 静かな). A handful
  /// of them are nouns used attributively (별빛, Marble); they describe all the
  /// same, so they live here rather than in a third pool.
  final WordPool adjectives;

  /// Words that say what the noun is doing, in that same attributive form
  /// (웃는, Laughing, 踊る). Kept apart from [adjectives] because the two are
  /// different grammar: a language may need something between an action and its
  /// noun where an adjective needs nothing (Chinese 奔跑的狮子), and only an
  /// action can become a predicate.
  final WordPool actions;

  /// Trailing noun for compounds (고양이 + 꼬리, 狮子 + 的 + 眼泪), used by
  /// nicknames only. A language with no frame that asks for one leaves it null.
  final WordPool? parts;

  /// The shapes a nickname of this language can take. Every language has to
  /// declare its own: a shape is only as natural as the grammar behind it.
  final List<WordFrame> frames;

  /// How an invented word is built.
  final WordSynthesis syn;
}
