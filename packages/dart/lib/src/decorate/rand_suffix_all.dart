import 'dart:math';

import 'package:randino/src/decorate/attach.dart';
import 'package:randino/src/decorate/data/index.dart';
import 'package:randino/src/internal/utils.dart';

/// [randSuffix] over a list — a fresh token for each entry rather than one for
/// the batch, which is what a generator's output is usually passed here for.
///
/// Dart has neither overloads nor union types, so the list form is its own
/// function rather than the same one taking `String | List<String>` the way the
/// npm and PyPI packages do.
///
/// ```dart
/// randSuffixAll(randNickname(language: WordLanguage.ko, count: 2));
/// // ['오래된곰_AVcCV', '영원한도마뱀_RUKAP']
/// ```
List<String> randSuffixAll(
  List<String> values, {
  int length = affixLengthDefault,
  String separator = affixSeparatorDefault,
  String? charset,

  /// Where the randomness comes from: `Random.secure()` for a token nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => withRandom(
  random,
  () => [for (final value in values) attachOne(value, length, separator, charset, appendToken)],
);
