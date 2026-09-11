import 'dart:math';

import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Things that carry you.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.vehicle] to `randWordDetails` — Dart has
/// no overloads, and twenty-eight more functions for it would be twenty-eight too many.
///
/// ```dart
/// randVehicle(language: WordLanguage.ko, count: 3); // [자전거, 기차, 열기구]
/// randVehicle(language: WordLanguage.en, count: 3); // [Bicycle, Boat, Locomotive]
/// ```
List<String> randVehicle({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  RandVocabulary vocabulary = RandVocabulary.full,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => randWord(
  language: language,
  theme: WordTheme.vehicle,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  random: random,
);
