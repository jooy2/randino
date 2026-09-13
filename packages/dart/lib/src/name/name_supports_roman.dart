import 'package:randino/src/name/data/index.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/name/romanize.dart';
import 'package:randino/src/types.dart';

final Map<NameLanguage, bool> _answers = <NameLanguage, bool>{};

/// Whether `NameScript.roman` produces anything different from
/// `NameScript.native`.
///
/// English names are already written in the Latin alphabet, so both scripts
/// return the same string. A null [language] answers for the mixed draw, where
/// some of the languages do.
///
/// ```dart
/// nameSupportsRoman(NameLanguage.ko); // true
/// nameSupportsRoman(NameLanguage.en); // false
/// ```
bool nameSupportsRoman([NameLanguage? language]) =>
    language == null ? nameLanguages.any(_differs) : _differs(language);

/// Whether the language writes a name that romanizes to something else.
///
/// Read off the pools rather than off the language code. Hangul, Cyrillic and
/// the two scripts that carry their own reading always romanize to something
/// else; a Latin-script language only does when one of its names carries a mark
/// that folding takes off, and whether it does is a fact about the pools — a
/// Latin-script language added tomorrow with no marks at all would differ in
/// none.
bool _differs(NameLanguage language) => _answers.putIfAbsent(language, () {
  final data = nameData[language]!;

  if (data.roman != RomanMode.fold) {
    return true;
  }

  final pools = <NamePool?>[
    data.last,
    data.male,
    data.female,
    data.middleMale,
    data.middleFemale,
    data.givenMale,
    data.givenFemale,
  ];

  return pools.any(
    (pool) => (pool ?? const <NameEntry>[]).any((entry) => fold(entry.n) != entry.n),
  );
});
