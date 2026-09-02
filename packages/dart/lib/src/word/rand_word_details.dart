import 'package:randino/src/types.dart';
import 'package:randino/src/word/word_generator.dart';

/// [randWord], reporting the language and theme behind each word.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
/// It is also where the fourteen themed functions send you for details: pass
/// their [WordTheme] here.
///
/// [WordDetail.theme] is null for an invented word that matches nothing in the
/// pools.
///
/// ```dart
/// randWordDetails(language: WordLanguage.ko, theme: WordTheme.plant).first;
/// // WordDetail(민들레, ko, plant)
/// ```
List<WordDetail> randWordDetails({
  WordLanguage? language,
  WordTheme? theme,
  int count = 1,
  int style = 0,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => generateWordDetails(
  language: language,
  theme: theme,
  count: count,
  style: style,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
