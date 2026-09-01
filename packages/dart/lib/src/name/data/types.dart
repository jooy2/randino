// Internal shape of the per-language name datasets. These types are not part of
// the public API — consumers only ever see the option parameters and NameDetail.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/types.dart';

/// One pool entry: the native form, plus the romanization for scripts whose
/// characters carry their own reading (Japanese kanji, Chinese hanzi). [r] is
/// null wherever the language romanizes by rule instead.
class NameEntry {
  /// Creates a pool entry.
  const NameEntry(this.n, [this.r]);

  /// The native form.
  final String n;

  /// The romanization the entry carries, or null when there is none.
  final String? r;
}

/// A pool of name parts.
typedef NamePool = List<NameEntry>;

/// Whitespace-separated pool of plain entries.
NamePool pool(String source) => NamePool.unmodifiable(words(source).map((word) => NameEntry(word)));

/// Whitespace-separated pool of `native:roman` pairs.
NamePool tokenPool(String source) =>
    NamePool.unmodifiable(pairs(source).map((pair) => NameEntry(pair[0], pair[1])));

/// Which part of a full name comes first.
enum NameOrder {
  /// Given name, then surname: Emma Clover.
  givenFirst,

  /// Surname, then given name: 김민준.
  familyFirst,
}

/// How a language's native strings become "English pronunciation".
enum RomanMode {
  /// Strip diacritics (Latin scripts).
  fold,

  /// Surname via map, given name via Revised Romanization.
  hangul,

  /// Character-level Cyrillic -> Latin.
  translit,

  /// Read the romanization off each [NameEntry].
  token,
}

/// Templates an invented name part is built from.
class SyllableSet {
  /// Creates a syllable template.
  const SyllableSet({
    required this.onset,
    required this.vowel,
    required this.coda,
    required this.minSyllables,
    required this.maxSyllables,
  });

  /// Consonant clusters a syllable can open with.
  final List<String> onset;

  /// Vowels a syllable is built around.
  final List<String> vowel;

  /// Endings the last syllable can close on. Empty entries leave it open.
  final List<String> coda;

  /// Fewest syllables in an invented part.
  final int minSyllables;

  /// Most syllables in an invented part.
  final int maxSyllables;
}

/// Character span of each part of a full name, joiner included.
///
/// Summing the parts that are actually switched on yields a default length
/// range that matches the requested structure, so turning a surname or middle
/// name off relaxes the range instead of forcing the remaining parts to stretch
/// and fill it.
class NameLengthSpec {
  /// Creates a length spec.
  const NameLengthSpec({required this.given, required this.last, required this.middle});

  /// Span of the given name.
  final LengthRange given;

  /// Span of the surname, the joiner in front of it included.
  final LengthRange last;

  /// Span of the middle name, the joiner in front of it included.
  final LengthRange middle;
}

/// Everything the generator knows about one language.
class NameLanguageData {
  /// Creates a language dataset.
  const NameLanguageData({
    required this.order,
    required this.joiner,
    required this.hasMiddle,
    required this.roman,
    required this.lengthSpec,
    required this.last,
    this.lastWeights,
    this.male,
    this.female,
    this.middleMale,
    this.middleFemale,
    this.givenMale,
    this.givenFemale,
    this.givenLenWeights,
    this.firstMale,
    this.restMale,
    this.firstFemale,
    this.restFemale,
    this.syn,
  });

  /// Which part of a full name comes first.
  final NameOrder order;

  /// Joins native parts: `''` for CJK (김민준), `' '` for space-separated scripts.
  final String joiner;

  /// Whether the language uses a middle name at all.
  final bool hasMiddle;

  /// How the native form becomes its English pronunciation.
  final RomanMode roman;

  /// The language's own length range, per part.
  final NameLengthSpec lengthSpec;

  /// Surnames.
  final NamePool last;

  /// How likely each surname is relative to the others, for languages whose
  /// surnames are steeply distributed (Korean, Chinese, Vietnamese). Written in
  /// tenths of a percent of the population; surnames the table leaves out keep
  /// the generator's default weight. Null draws surnames evenly.
  final Map<String, int>? lastWeights;

  /// Western realistic given names, masculine.
  final NamePool? male;

  /// Western realistic given names, feminine.
  final NamePool? female;

  /// Dedicated middle names, masculine. Falls back to [male].
  final NamePool? middleMale;

  /// Dedicated middle names, feminine. Falls back to [female].
  final NamePool? middleFemale;

  /// CJK realistic given names, kept whole, masculine.
  final NamePool? givenMale;

  /// CJK realistic given names, kept whole, feminine.
  final NamePool? givenFemale;

  /// CJK relative likelihood of a given name being N syllables long, used when
  /// the requested length range leaves room for more than one option.
  final Map<int, int>? givenLenWeights;

  /// First syllable of an invented CJK given name, masculine.
  final NamePool? firstMale;

  /// Following syllables of an invented CJK given name, masculine.
  final NamePool? restMale;

  /// First syllable of an invented CJK given name, feminine.
  final NamePool? firstFemale;

  /// Following syllables of an invented CJK given name, feminine.
  final NamePool? restFemale;

  /// Template for invented names in Latin, Cyrillic and Vietnamese scripts.
  final SyllableSet? syn;
}
