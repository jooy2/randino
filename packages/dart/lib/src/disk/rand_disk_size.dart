import 'dart:math';

import 'package:randino/src/disk/disk_size_generator.dart';
import 'package:randino/src/types.dart';

/// Generate capacities a drive is really sold with.
///
/// 256 GB, 512 GB and 1 TB are the most common, the small flash of an old
/// phone and the largest hard disks the rarest. A null [unit] writes each size
/// in the largest unit it is a whole number of, a named one keeps to the sizes
/// whole in it, and no size is ever written with a decimal point; a terabyte is
/// 1000 gigabytes, the way a drive is sold. [minSize] and [maxSize] bound the
/// sizes, in [unit] or in gigabytes for a null one; a range no real size is
/// inside returns nothing.
///
/// ```dart
/// randDiskSize(); // [512 GB]
/// randDiskSize(count: 3); // [1 TB, 256 GB, 2 TB]
/// randDiskSize(unit: DiskUnit.gb); // [1000 GB]
/// randDiskSize(minSize: 2000); // [4 TB]
/// ```
List<String> randDiskSize({
  DiskUnit? unit,

  /// Write the unit after the number. Left off with a null [unit], every size
  /// is written in gigabytes, because a bare `2` and a bare `512` would
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
  for (final detail in generateDiskSizeDetails(
    unit: unit,
    includeUnit: includeUnit,
    minSize: minSize,
    maxSize: maxSize,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.size,
];
