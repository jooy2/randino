import 'dart:math';

import 'package:randino/src/ram/ram_generator.dart';
import 'package:randino/src/types.dart';

/// [randRam], along with the number, the unit and the bytes of each size.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randRamDetails().first; // RamDetail(16 GB, 17179869184)
/// ```
List<RamDetail> randRamDetails({
  RamUnit? unit,
  bool includeUnit = true,
  num? minSize,
  num? maxSize,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateRamDetails(
  unit: unit,
  includeUnit: includeUnit,
  minSize: minSize,
  maxSize: maxSize,
  count: count,
  unique: unique,
  random: random,
);
