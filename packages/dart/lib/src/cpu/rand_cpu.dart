import 'dart:math';

import 'package:randino/src/cpu/cpu_generator.dart';
import 'package:randino/src/types.dart';

/// Generate real processors, by the names their makers gave them.
///
/// Intel, AMD, Apple and Qualcomm parts for desktops and laptops, and the
/// systems-on-chip of phones and tablets from Apple, Qualcomm, Samsung,
/// MediaTek, Google and HiSilicon; a null [platform] draws from both. [minYear]
/// and [maxYear] keep to the parts whose first machines went on sale in those
/// years.
///
/// ```dart
/// randCpu(); // [Intel Core i7-13700K]
/// randCpu(platform: SystemPlatform.mobile, count: 2); // [Qualcomm Snapdragon 8 Gen 3, Apple A17 Pro]
/// randCpu(platform: SystemPlatform.desktop, maxYear: 2012); // [AMD Phenom II X4 940]
/// randCpu(includeVendor: false); // [Ryzen 7 7800X3D]
/// ```
List<String> randCpu({
  SystemPlatform? platform,
  int? minYear,
  int? maxYear,

  /// Write the maker in front of the processor: `Intel Core i7-13700K` rather
  /// than `Core i7-13700K`.
  bool includeVendor = true,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateCpuDetails(
    platform: platform,
    minYear: minYear,
    maxYear: maxYear,
    includeVendor: includeVendor,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.cpu,
];
