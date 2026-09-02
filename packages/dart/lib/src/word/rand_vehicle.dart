import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// Things that carry you.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.vehicle] to `randWordDetails` — Dart has
/// no overloads, and fourteen more functions for it would be fourteen too many.
///
/// ```dart
/// randVehicle(language: WordLanguage.ko, count: 3); // [자전거, 기차, 열기구]
/// randVehicle(language: WordLanguage.en, count: 3); // [Bicycle, Boat, Locomotive]
/// ```
List<String> randVehicle({
  WordLanguage? language,
  int count = 1,
  int style = 0,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.vehicle,
  count: count,
  style: style,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
