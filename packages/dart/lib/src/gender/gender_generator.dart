// The gender generator: one of two codes, or of four with both options on, and
// the label a form in the language writes for it, or for `nonbinary` with
// `nonbinaryIdentity` on, the identity a person names themselves by.

import 'dart:math';

import 'package:randino/src/gender/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';

/// One result a call may land on: a code, the language it is written in, and
/// its identity.
typedef _Drawn = ({GenderCode code, WordLanguage language, NonbinaryIdentity? identity});

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

  // The code by its weight, the language evenly, and for `nonbinary` with the
  // option on, the identity by its own weight.
  final identityShares = shares(nonbinaryIdentities, (each) => nonbinaryWeights[each]!);
  final outcomes = <Outcome<_Drawn>>[];

  for (final (index, share) in shares(codes, (each) => genderWeights[each]!).indexed) {
    final code = codes[index];
    final forms = <({NonbinaryIdentity? identity, double share})>[
      if (code == GenderCode.nonbinary && nonbinaryIdentity)
        for (final (at, identity) in nonbinaryIdentities.indexed)
          (identity: identity, share: identityShares[at])
      else
        (identity: null, share: 1.0),
    ];

    for (final drawn in languages) {
      for (final form in forms) {
        outcomes.add((
          entry: (code: code, language: drawn, identity: form.identity),
          weight: share * form.share / languages.length,
        ));
      }
    }
  }

  String label(_Drawn drawn) =>
      drawn.identity == null
          ? genderLabels[drawn.language]![drawn.code]!
          : nonbinaryLabels[drawn.language]![drawn.identity]!;

  return withRandom(
    random,
    () => collectFrom(
      count: count,
      unique: unique,
      startsWith: '',
      outcomes: outcomes,
      keyOf: label,
      build:
          (drawn) => GenderDetail(
            gender: label(drawn),
            code: drawn.code,
            language: drawn.language,
            identity: drawn.identity,
          ),
    ),
  );
}
