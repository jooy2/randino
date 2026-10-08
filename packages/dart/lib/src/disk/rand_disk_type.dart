import 'dart:math';

import 'package:randino/src/disk/disk_type_generator.dart';
import 'package:randino/src/types.dart';

/// Generate the kind of storage a machine has: `SSD`, `HDD`, `UFS`.
///
/// A desktop or a laptop is mostly an SSD and a hard disk after it, a phone or
/// a tablet UFS or eMMC. [platform] keeps to one of the two, and a null one
/// draws from both.
///
/// ```dart
/// randDiskType(); // [SSD]
/// randDiskType(platform: SystemPlatform.desktop, count: 3); // [SSD, HDD, SSD]
/// randDiskType(platform: SystemPlatform.mobile); // [UFS]
/// ```
List<String> randDiskType({
  SystemPlatform? platform,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateDiskTypeDetails(
    platform: platform,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.diskType,
];
