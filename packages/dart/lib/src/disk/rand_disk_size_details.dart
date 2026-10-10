import 'dart:math';

import 'package:randino/src/disk/disk_size_generator.dart';
import 'package:randino/src/types.dart';

/// [randDiskSize], along with the number, the unit and the bytes of each size.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randDiskSizeDetails().first; // DiskSizeDetail(1 TB, 1000000000000)
/// ```
List<DiskSizeDetail> randDiskSizeDetails({
  DiskUnit? unit,
  bool includeUnit = true,
  num? minSize,
  num? maxSize,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateDiskSizeDetails(
  unit: unit,
  includeUnit: includeUnit,
  minSize: minSize,
  maxSize: maxSize,
  count: count,
  unique: unique,
  random: random,
);
