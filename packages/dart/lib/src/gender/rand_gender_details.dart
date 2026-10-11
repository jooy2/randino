import 'dart:math';

import 'package:randino/src/gender/gender_generator.dart';
import 'package:randino/src/types.dart';

/// [randGender], along with the code behind each label, so the code can be
/// stored while the label is shown. With [nonbinaryIdentity],
/// [GenderDetail.identity] names the identity a `nonbinary` label writes.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randGenderDetails(language: WordLanguage.ko).first; // GenderDetail(여성, female, ko, null)
/// ```
List<GenderDetail> randGenderDetails({
  WordLanguage? language,
  int count = 1,
  bool includeUnknown = false,
  bool includeNonbinary = false,

  /// Write `nonbinary` as the identity a person names themselves by
  /// (`Genderfluid`, `에이젠더`, `Nichtbinär`) rather than as the option a
  /// form offers (`Non-binary`, `Divers`). Ignored unless [includeNonbinary]
  /// is on.
  bool nonbinaryIdentity = false,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateGenderDetails(
  language: language,
  count: count,
  includeUnknown: includeUnknown,
  includeNonbinary: includeNonbinary,
  nonbinaryIdentity: nonbinaryIdentity,
  unique: unique,
  random: random,
);
