// The disk type generator: the kind of storage a machine has, by the platform
// it is drawn for.

import 'dart:math';

import 'package:randino/src/disk/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// One result a call may land on: a kind of storage, on the platform it was
/// drawn for.
typedef _Drawn = ({SystemPlatform platform, DiskType code});

// The kinds each set of platforms uses, kept so a call does not work them out again.
final Map<String, List<Outcome<_Drawn>>> _kept = {};

/// What `randDiskType` and `randDiskTypeDetails` both do.
List<DiskTypeDetail> generateDiskTypeDetails({
  SystemPlatform? platform,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final platforms = resolvePlatforms(platform);

  // The platform first, so a null one is half desktops and half phones, and
  // eMMC — which both use — is drawn by the platform it came up for.
  final outcomes = keptOutcomes<_Drawn>(_kept, platforms.map((each) => each.name).join(','), () {
    final listed = <Outcome<_Drawn>>[];

    for (final each in platforms) {
      final weights = diskTypeWeights[each]!;
      final codes = <DiskType>[
        for (final type in diskTypes)
          if (weights.containsKey(type)) type,
      ];

      for (final (index, share) in shares(codes, (type) => weights[type]!).indexed) {
        listed.add((entry: (platform: each, code: codes[index]), weight: share / platforms.length));
      }
    }

    return listed;
  });

  return withRandom(
    random,
    () => collectFrom<_Drawn, DiskTypeDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      outcomes: outcomes,
      keyOf: (entry) => diskTypeLabels[entry.code]!.label,
      build:
          (entry) => DiskTypeDetail(
            diskType: diskTypeLabels[entry.code]!.label,
            code: entry.code,
            name: diskTypeLabels[entry.code]!.name,
            platform: entry.platform,
          ),
    ),
  );
}
