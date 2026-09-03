// Internal shape of the per-language word datasets. Not part of the public API
// — consumers only ever see the option parameters and the two details.
//
// One dataset per language rather than one per generator: `randWord` and its
// fourteen themed forms draw from `nouns`, `randModifier` draws from
// `adjectives` and `actions`, and `randNickname` puts the two together and adds
// `parts`. The pools are the same words either way, so they are written once.

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

/// Everything the generators know about one word language.
class WordLanguageData {
  /// Creates a language dataset.
  const WordLanguageData({
    required this.joiner,
    required this.capitalize,
    required this.nouns,
    required this.adjectives,
    required this.actions,
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

  /// Optional trailing noun for compounds (고양이 + 꼬리), used by nicknames
  /// only. Languages that would need a particle or a different word order for
  /// this leave it null, and the compound patterns are then skipped for them.
  final WordPool? parts;

  /// How an invented word is built.
  final WordSynthesis syn;
}
