// The disk size generator: a capacity a drive is really sold with, in a unit it
// is a whole number of.

import 'dart:math';

import 'package:randino/src/disk/data/index.dart';
import 'package:randino/src/internal/capacity.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// What `randDiskSize` and `randDiskSizeDetails` both do.
List<DiskSizeDetail> generateDiskSizeDetails({
  DiskUnit? unit,
  bool includeUnit = true,
  int? minSize,
  int? maxSize,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  // Without the unit there is nothing to tell `2` terabytes from `512`
  // gigabytes, so a size written bare is in one unit throughout.
  final written = unit ?? (includeUnit ? null : diskScale.reference);
  // Worked out once per call: a couple of dozen sizes, each with its unit
  // already decided.
  final candidates = capacityCandidates(diskScale, written, minSize, maxSize);

  return withRandom(
    random,
    () => collect<DiskSizeDetail>(
      count: candidates.isEmpty ? 0 : count,
      unique: unique,
      startsWith: '',
      draw: () {
        final candidate = pickWeighted(candidates, (each) => each.weight);

        return DiskSizeDetail(
          size: writeCapacity(candidate.value, candidate.unit.label, includeUnit),
          value: candidate.value,
          unit: candidate.unit,
          bytes: candidate.size * diskScale.bytes,
        );
      },
      keyOf: (detail) => detail.size,
    ),
  );
}
