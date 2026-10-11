// The gender generator: one of two codes, or of four with both options on, and
// the label a form in the language writes for it, or for `nonbinary` with
// `nonbinaryIdentity` on, the identity a person names themselves by.

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
  bool nonbinaryIdentity = false,
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
        // Drawn after the language and only for `nonbinary`, so a call without
        // the option makes the same draws it always made.
        final named =
            code == GenderCode.nonbinary && nonbinaryIdentity
                ? pickWeighted(nonbinaryIdentities, (each) => nonbinaryWeights[each]!)
                : null;

        return GenderDetail(
          gender: named == null ? genderLabels[drawn]![code]! : nonbinaryLabels[drawn]![named]!,
          code: code,
          language: drawn,
          identity: named,
        );
      },
      keyOf: (detail) => detail.gender,
    ),
  );
}
