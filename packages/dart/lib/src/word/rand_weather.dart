import 'package:randino/src/types.dart';
import 'package:randino/src/word/rand_word.dart';

/// What the sky is doing, from a breeze to a blizzard.
///
/// [randWord] with the theme already chosen; every other parameter is the same.
/// For the detail form, pass [WordTheme.weather] to `randWordDetails` — Dart has
/// no overloads, and a second function per theme would be a second wall of them.
///
/// ```dart
/// randWeather(language: WordLanguage.ko, count: 3); // [소나기, 무지개, 된서리]
/// randWeather(language: WordLanguage.en, count: 3); // [Drizzle, Rainbow, Hoarfrost]
/// ```
List<String> randWeather({
  WordLanguage? language,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => randWord(
  language: language,
  theme: WordTheme.weather,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
