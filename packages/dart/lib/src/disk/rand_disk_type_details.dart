import 'dart:math';

import 'package:randino/src/disk/disk_type_generator.dart';
import 'package:randino/src/types.dart';

/// [randDiskType], along with the code and the name behind each label.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randDiskTypeDetails().first; // DiskTypeDetail(SSD, desktop)
/// ```
List<DiskTypeDetail> randDiskTypeDetails({
  SystemPlatform? platform,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateDiskTypeDetails(platform: platform, count: count, unique: unique, random: random);
