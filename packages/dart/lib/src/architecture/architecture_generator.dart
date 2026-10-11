// The architecture generator: what a machine's processor runs, by the name a
// toolchain writes it, mostly x86 and Arm.

import 'dart:math';

import 'package:randino/src/architecture/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// [architecture] by the names [naming] writes.
String writeArchitecture(String architecture, ArchitectureNaming naming) =>
    naming == ArchitectureNaming.common
        ? architecture
        : architectureData[architecture]!.names[naming]!;

/// Every name [architecture] goes by but [written], the common one first where
/// it is not the one written. Debian and Go share most of their names, so a
/// name is listed once however many namings write it.
List<String> aliasesOf(String architecture, String written) => List<String>.unmodifiable(
  <String>[
    architecture,
    ...architectureData[architecture]!.aliases,
  ].where((name) => name != written),
);

/// What `randArchitecture` and `randArchitectureDetails` both do.
List<ArchitectureDetail> generateArchitectureDetails({
  SystemPlatform? platform,
  bool includeRare = false,
  ArchitectureNaming naming = ArchitectureNaming.common,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  // The architectures each platform may land on, worked out once per call. A
  // platform none of them runs on is left out, so a null platform never draws
  // one it then has nothing to write for.
  final candidates = [
    for (final each in resolvePlatforms(platform))
      (
        platform: each,
        architectures: <String>[
          for (final architecture in architectures)
            if (architectureData[architecture]!.weights.containsKey(each) &&
                (includeRare || !architectureData[architecture]!.rare))
              architecture,
        ],
      ),
  ].where((each) => each.architectures.isNotEmpty).toList(growable: false);

  return withRandom(
    random,
    () => collect<ArchitectureDetail>(
      count: candidates.isEmpty ? 0 : count,
      unique: unique,
      startsWith: '',
      draw: () {
        // The platform first, so a null one is half desktops and half phones.
        final (platform: drawn, architectures: pool) = pick(candidates);
        final architecture = pickWeighted(pool, (each) => architectureData[each]!.weights[drawn]!);
        final data = architectureData[architecture]!;
        final written = writeArchitecture(architecture, naming);

        return ArchitectureDetail(
          architecture: written,
          code: architecture,
          aliases: aliasesOf(architecture, written),
          bits: data.bits,
          family: data.family,
          rare: data.rare,
          platform: drawn,
        );
      },
      keyOf: (detail) => detail.architecture,
    ),
  );
}
