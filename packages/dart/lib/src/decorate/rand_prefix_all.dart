import 'dart:math';

import 'package:randino/src/decorate/attach.dart';
import 'package:randino/src/decorate/data/index.dart';
import 'package:randino/src/internal/utils.dart';

/// [randPrefix] over a list — a fresh token for each entry, not one for the
/// batch. See [randSuffixAll] for why the list form is its own function.
///
/// ```dart
/// randPrefixAll(randNickname(language: WordLanguage.en, count: 2));
/// // ['AVcCV_MistyOwl', 'RUKAP_RustyBoot']
/// ```
List<String> randPrefixAll(
  List<String> values, {
  int length = affixLengthDefault,
  String separator = affixSeparatorDefault,
  String? charset,

  /// Where the randomness comes from: `Random.secure()` for a token nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => withRandom(
  random,
  () => [for (final value in values) attachOne(value, length, separator, charset, prependToken)],
);
