// The gender generator: one of two codes, or of four with both options on, and
// the label a form in the language writes for it.

import 'dart:math';

import 'package:randino/src/gender/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';

/// What `randGender` and `randGenderDetails` both do.
List<GenderDetail> generateGenderDetails({
  WordLanguage? language,
  int count = 1,
  bool includeUnknown = false,
  bool includeNonbinary = false,
  bool unique = false,
  Random? random,
}) {
  final languages = language == null ? wordLanguages : <WordLanguage>[language];
  // The two that are always on, and whichever of the others the call asked for.
  final codes = <GenderCode>[
    for (final code in genderCodes)
      if ((code != GenderCode.unknown || includeUnknown) &&
          (code != GenderCode.nonbinary || includeNonbinary))
        code,
  ];

  return withRandom(
    random,
    () => collect<GenderDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      draw: () {
        final code = pickWeighted(codes, (each) => genderWeights[each]!);
        final drawn = pick(languages);

        return GenderDetail(gender: genderLabels[drawn]![code]!, code: code, language: drawn);
      },
      keyOf: (detail) => detail.gender,
    ),
  );
}
