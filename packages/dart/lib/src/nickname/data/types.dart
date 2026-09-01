// Internal shape of the per-language nickname datasets. Not part of the public
// API — consumers only ever see the option parameters and NicknameDetail.

import 'package:randino/src/types.dart';

/// A pool of words a nickname can be built from.
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

/// Everything the generator knows about one nickname language.
class NicknameLanguageData {
  /// Creates a language dataset.
  const NicknameLanguageData({
    required this.joiner,
    required this.capitalize,
    required this.nouns,
    required this.modifiers,
    required this.syn,
    this.parts,
  });

  /// Joins the parts of one nickname. `''` everywhere so far — Korean and CJK
  /// words run together, and alphabetic parts read as CamelCase (BraveLion).
  final String joiner;

  /// Whether each part should be capitalized. Meaningless for CJK scripts.
  final bool capitalize;

  /// Words a nickname is built around, grouped by theme. Deliberately common
  /// nouns — never person names. Every theme has a pool; a language that could
  /// not fill one would not be a language this generator supports.
  final Map<NicknameTheme, WordPool> nouns;

  /// Words that decorate the noun, in the form that can precede it directly
  /// (Korean attributive: 멋진, Japanese: 青い / 静かな).
  final WordPool modifiers;

  /// Optional trailing noun for compounds (고양이 + 꼬리). Languages that would
  /// need a particle or a different word order for this leave it null, and the
  /// compound patterns are then skipped for them.
  final WordPool? parts;

  /// How an invented word is built.
  final WordSynthesis syn;
}
