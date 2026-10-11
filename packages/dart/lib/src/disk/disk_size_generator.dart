// The disk size generator: a capacity a drive is really sold with, in a unit it
// is a whole number of, for a kind of storage that is sold in it.

import 'dart:math';

import 'package:randino/src/disk/data/index.dart';
import 'package:randino/src/internal/capacity.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// A kind of storage one call may land on, with the sizes of it the call may
/// write.
typedef _Kind = ({DiskType type, List<CapacityCandidate<DiskUnit>> sizes});

/// The kinds of storage each platform may land on, each with its sizes.
///
/// Worked out once per call: a kind with no size left in the unit and the
/// range asked for is left out, and so is a platform with no kind left, so a
/// null platform never draws one it then has nothing to write for.
List<({SystemPlatform platform, List<_Kind> kinds})> _candidates(
  Set<DiskType>? type,
  SystemPlatform? platform,
  DiskUnit? unit,
  num? minSize,
  num? maxSize,
) {
  // A null or empty set reads as every kind, the way the npm package's
  // `resolveMany` reads one, and the kinds keep the catalog's order.
  final named = <DiskType>[
    for (final each in diskTypes)
      if (type == null || type.isEmpty || type.contains(each)) each,
  ];

  return [
    for (final drawn in resolvePlatforms(platform))
      (
        platform: drawn,
        kinds: <_Kind>[
          for (final each in named)
            if (diskTypeWeights[drawn]!.containsKey(each))
              (
                type: each,
                sizes: capacityCandidates(diskScale, diskSizes[each]!, unit, minSize, maxSize),
              ),
        ].where((kind) => kind.sizes.isNotEmpty).toList(growable: false),
      ),
  ].where((each) => each.kinds.isNotEmpty).toList(growable: false);
}

/// What `randDiskSize` and `randDiskSizeDetails` both do.
List<DiskSizeDetail> generateDiskSizeDetails({
  Set<DiskType>? type,
  SystemPlatform? platform,
  DiskUnit? unit,
  bool includeUnit = true,
  num? minSize,
  num? maxSize,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  // Without the unit there is nothing to tell `2` terabytes from `512`
  // gigabytes, so a size written bare is in one unit throughout.
  final written = unit ?? (includeUnit ? null : diskScale.reference);
  final candidates = _candidates(type, platform, written, minSize, maxSize);

  return withRandom(
    random,
    () => collect<DiskSizeDetail>(
      count: candidates.isEmpty ? 0 : count,
      unique: unique,
      startsWith: '',
      draw: () {
        // The platform first, so a null one is half desktops and half phones,
        // then the kind of storage by how common it is there, then a size it is
        // sold in.
        final (platform: drawn, :kinds) = pick(candidates);
        final kind = pickWeighted(kinds, (each) => diskTypeWeights[drawn]![each.type]!);
        final candidate = pickWeighted(kind.sizes, (each) => each.weight);

        return DiskSizeDetail(
          size: writeCapacity(candidate.value, candidate.unit.label, includeUnit),
          value: candidate.value,
          unit: candidate.unit,
          bytes: candidate.size * diskScale.bytes,
          type: kind.type,
          platform: drawn,
        );
      },
      keyOf: (detail) => detail.size,
    ),
  );
}
