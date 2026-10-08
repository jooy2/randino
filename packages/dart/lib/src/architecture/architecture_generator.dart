// The architecture generator: what a machine's processor runs, by the name a
// toolchain writes it, mostly x86 and Arm.

import 'dart:math';

import 'package:randino/src/architecture/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// What `randArchitecture` and `randArchitectureDetails` both do.
List<ArchitectureDetail> generateArchitectureDetails({
  bool includeRare = false,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final candidates = <String>[
    for (final architecture in architectures)
      if (includeRare || !architectureData[architecture]!.rare) architecture,
  ];

  return withRandom(
    random,
    () => collect<ArchitectureDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      draw: () {
        final architecture = pickWeighted(candidates, (each) => architectureData[each]!.weight);
        final data = architectureData[architecture]!;

        return ArchitectureDetail(
          architecture: architecture,
          aliases: List<String>.unmodifiable(data.aliases),
          bits: data.bits,
          family: data.family,
          rare: data.rare,
        );
      },
      keyOf: (detail) => detail.architecture,
    ),
  );
}
