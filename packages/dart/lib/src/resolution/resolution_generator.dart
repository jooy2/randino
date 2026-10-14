// The resolution generator: a screen size people really have, drawn by how
// common it is on the platform it is drawn for.

import 'dart:math';

import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/resolution/data/index.dart';
import 'package:randino/src/types.dart';

// The sizes each set of platforms leaves, kept so a call does not work them
// out again.
final Map<String, List<Outcome<ResolutionEntry>>> _kept = {};

/// What `randResolution` and `randResolutionDetails` both do.
List<ResolutionDetail> generateResolutionDetails({
  SystemPlatform? platform,
  String separator = resolutionSeparatorDefault,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final platforms = resolvePlatforms(platform);
  // The platform first, so a null one is half screens of each kind rather than
  // whichever kind the table happens to list more sizes for.
  final outcomes = keptOutcomes<ResolutionEntry>(
    _kept,
    platforms.map((each) => each.name).join(','),
    () {
      final pools = <List<ResolutionEntry>>[
        for (final each in platforms)
          [
            for (final entry in resolutions)
              if (entry.platform == each) entry,
          ],
      ];

      return [
        for (final pool in pools)
          for (final (index, share) in shares(pool, (each) => each.weight).indexed)
            (entry: pool[index], weight: share / pools.length),
      ];
    },
  );

  return withRandom(
    random,
    () => collectFrom<ResolutionEntry, ResolutionDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      outcomes: outcomes,
      keyOf: (entry) => '${entry.width}$separator${entry.height}',
      build:
          (entry) => ResolutionDetail(
            resolution: '${entry.width}$separator${entry.height}',
            width: entry.width,
            height: entry.height,
            platform: entry.platform,
          ),
    ),
  );
}
