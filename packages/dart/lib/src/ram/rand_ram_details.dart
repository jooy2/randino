import 'dart:math';

import 'package:randino/src/ram/ram_generator.dart';
import 'package:randino/src/types.dart';

/// [randRam], along with the number, the unit, the bytes and the kind of memory
/// of each size.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randRamDetails().first; // RamDetail(16 GB, 17179869184, DDR5, desktop)
/// ```
List<RamDetail> randRamDetails({
  SystemPlatform? platform,
  int? minYear,
  int? maxYear,
  RamUnit? unit,
  bool includeUnit = true,
  num? minSize,
  num? maxSize,
  bool includeType = false,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateRamDetails(
  platform: platform,
  minYear: minYear,
  maxYear: maxYear,
  unit: unit,
  includeUnit: includeUnit,
  minSize: minSize,
  maxSize: maxSize,
  includeType: includeType,
  count: count,
  unique: unique,
  random: random,
);
