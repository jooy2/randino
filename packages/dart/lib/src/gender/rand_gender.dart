import 'dart:math';

import 'package:randino/src/gender/gender_generator.dart';
import 'package:randino/src/types.dart';

/// Generate genders for sample people, written the way a form in the language
/// labels them.
///
/// Male and female, evenly, by default. [includeUnknown] adds a gender nobody
/// stated, about one draw in eleven, and [includeNonbinary] adds a third
/// gender, about one in a hundred. A null [language] mixes all nine.
///
/// ```dart
/// randGender(language: WordLanguage.ko, count: 3); // [여성, 남성, 여성]
/// randGender(language: WordLanguage.en, includeUnknown: true, count: 3); // [Male, Unknown, Female]
/// randGender(language: WordLanguage.de, includeNonbinary: true); // [Divers]
/// ```
List<String> randGender({
  WordLanguage? language,
  int count = 1,
  bool includeUnknown = false,
  bool includeNonbinary = false,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateGenderDetails(
    language: language,
    count: count,
    includeUnknown: includeUnknown,
    includeNonbinary: includeNonbinary,
    unique: unique,
    random: random,
  ))
    detail.gender,
];
