// The RAM generator: an amount of memory a machine is really sold with, in a
// unit it is a whole number of.

import 'dart:math';

import 'package:randino/src/internal/capacity.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/ram/data/index.dart';
import 'package:randino/src/types.dart';

/// What `randRam` and `randRamDetails` both do.
List<RamDetail> generateRamDetails({
  RamUnit? unit,
  bool includeUnit = true,
  int? minSize,
  int? maxSize,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  // Without the unit there is nothing to tell `512` megabytes from `16`
  // gigabytes, so a size written bare is in one unit throughout.
  final written = unit ?? (includeUnit ? null : ramScale.reference);
  // Worked out once per call: at most a couple of dozen sizes, each with its
  // unit already decided.
  final candidates = capacityCandidates(ramScale, written, minSize, maxSize);

  return withRandom(
    random,
    () => collect<RamDetail>(
      count: candidates.isEmpty ? 0 : count,
      unique: unique,
      startsWith: '',
      draw: () {
        final candidate = pickWeighted(candidates, (each) => each.weight);

        return RamDetail(
          ram: writeCapacity(candidate.value, candidate.unit.label, includeUnit),
          value: candidate.value,
          unit: candidate.unit,
          bytes: candidate.size * ramScale.bytes,
        );
      },
      keyOf: (detail) => detail.ram,
    ),
  );
}
