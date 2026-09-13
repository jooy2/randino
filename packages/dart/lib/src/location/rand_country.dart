import 'dart:math';

import 'package:randino/src/location/location_generator.dart';
import 'package:randino/src/types.dart';

/// Generate country names: every ISO 3166-1 country and territory, 249 of them,
/// named the way the language names it.
///
/// Every word language has a name for every one, so this takes a
/// [WordLanguage], where the other location generators write only the languages
/// whose countries publish their divisions. A null [language] mixes all nine.
///
/// Each is drawn as often as any other. The names are Wikidata's, and the list
/// is ISO's: a territory is in because ISO 3166-1 gives it a code of its own.
///
/// ```dart
/// randCountry(language: WordLanguage.ko, count: 3); // [아르헨티나, 방글라데시, 세인트키츠 네비스]
/// randCountry(language: WordLanguage.en, count: 2); // [Gibraltar, Burkina Faso]
/// ```
List<String> randCountry({
  WordLanguage? language,
  int count = 1,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateCountryDetails(
    language: language,
    count: count,
    minLength: minLength,
    maxLength: maxLength,
    startsWith: startsWith,
    unique: unique,
    random: random,
  ))
    detail.country,
];
