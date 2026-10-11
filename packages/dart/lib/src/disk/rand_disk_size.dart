import 'dart:math';

import 'package:randino/src/disk/disk_size_generator.dart';
import 'package:randino/src/types.dart';

/// Generate capacities a drive is really sold with.
///
/// Sizes from 128 GB to 1 TB are the most common, the small flash of an old
/// phone and the largest hard disks the rarest. Each size is one its kind of
/// storage is sold in, so an eMMC chip is never 8 TB: [type] keeps to the kinds
/// named and [platform] to the kinds a desktop or a phone uses. A null [unit]
/// writes each size in the largest unit it is a whole number of, a named one
/// keeps to the sizes whole in it, and no size is ever written with a decimal
/// point; a terabyte is 1000 gigabytes, the way a drive is sold. [minSize] and
/// [maxSize] bound the sizes, in [unit] or in gigabytes for a null one; a range
/// no real size is inside returns nothing.
///
/// ```dart
/// randDiskSize(); // [512 GB]
/// randDiskSize(count: 3); // [1 TB, 256 GB, 2 TB]
/// randDiskSize(unit: DiskUnit.gb); // [1000 GB]
/// randDiskSize(minSize: 2000); // [4 TB]
/// randDiskSize(type: {DiskType.emmc}, count: 2); // [64 GB, 32 GB]
/// ```
List<String> randDiskSize({
  /// Which kinds of storage the sizes are for: `{DiskType.emmc}`. Each kind is
  /// sold in sizes of its own, so an eMMC chip stops at 128 GB and only a hard
  /// disk reaches 24 TB. A null or empty set draws every kind.
  Set<DiskType>? type,

  /// The storage of desktops and laptops, or of phones and tablets; a null one
  /// draws from both. A kind the platform does not use is answered with
  /// nothing: `{DiskType.hdd}` on [SystemPlatform.mobile].
  SystemPlatform? platform,
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
    type: type,
    platform: platform,
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
