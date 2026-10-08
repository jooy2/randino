// The disk type generator: the kind of storage a machine has, by the platform
// it is drawn for.

import 'dart:math';

import 'package:randino/src/disk/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// What `randDiskType` and `randDiskTypeDetails` both do.
List<DiskTypeDetail> generateDiskTypeDetails({
  SystemPlatform? platform,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final platforms = resolvePlatforms(platform);

  return withRandom(
    random,
    () => collect<DiskTypeDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      draw: () {
        // The platform first, so a null one is half desktops and half phones,
        // and eMMC — which both use — is drawn by the platform it came up for.
        final drawn = pick(platforms);
        final weights = diskTypeWeights[drawn]!;
        final code = pickWeighted(<DiskType>[
          for (final type in diskTypes)
            if (weights.containsKey(type)) type,
        ], (type) => weights[type]!);

        return DiskTypeDetail(
          diskType: diskTypeLabels[code]!.label,
          code: code,
          name: diskTypeLabels[code]!.name,
          platform: drawn,
        );
      },
      keyOf: (detail) => detail.diskType,
    ),
  );
}
