// The resolution generator: a screen size people really have, drawn by how
// common it is on the platform it is drawn for.

import 'dart:math';

import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/resolution/data/index.dart';
import 'package:randino/src/types.dart';

/// What `randResolution` and `randResolutionDetails` both do.
List<ResolutionDetail> generateResolutionDetails({
  SystemPlatform? platform,
  String separator = resolutionSeparatorDefault,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  // One list per platform, worked out once per call rather than per draw.
  final pools = <List<ResolutionEntry>>[
    for (final each in resolvePlatforms(platform))
      [
        for (final entry in resolutions)
          if (entry.platform == each) entry,
      ],
  ];

  return withRandom(
    random,
    () => collect<ResolutionDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      draw: () {
        // The platform first, so a null one is half screens of each kind rather
        // than whichever kind the table happens to list more sizes for.
        final entry = pickWeighted(pick(pools), (each) => each.weight);

        return ResolutionDetail(
          resolution: '${entry.width}$separator${entry.height}',
          width: entry.width,
          height: entry.height,
          platform: entry.platform,
        );
      },
      keyOf: (detail) => detail.resolution,
    ),
  );
}
