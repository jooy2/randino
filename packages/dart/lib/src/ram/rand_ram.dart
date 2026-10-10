import 'dart:math';

import 'package:randino/src/ram/ram_generator.dart';
import 'package:randino/src/types.dart';

/// Generate amounts of memory a machine is really sold with.
///
/// 8 and 16 GB are the most common, the sizes of old phones and of workstations
/// the rarest. A null [unit] writes each size in the largest unit it is a whole
/// number of, a named one keeps to the sizes whole in it, and no size is ever
/// written with a decimal point. [minSize] and [maxSize] bound the sizes, in
/// [unit] or in gigabytes for a null one; a range no real size is inside
/// returns nothing.
///
/// ```dart
/// randRam(); // [16 GB]
/// randRam(count: 3); // [8 GB, 16 GB, 4 GB]
/// randRam(unit: RamUnit.mb); // [8192 MB]
/// randRam(minSize: 32, includeUnit: false); // [64]
/// ```
List<String> randRam({
  RamUnit? unit,

  /// Write the unit after the number. Left off with a null [unit], every size
  /// is written in gigabytes, because a bare `512` and a bare `16` would
  /// otherwise be in two different units.
  bool includeUnit = true,
  num? minSize,
  num? maxSize,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateRamDetails(
    unit: unit,
    includeUnit: includeUnit,
    minSize: minSize,
    maxSize: maxSize,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.ram,
];
