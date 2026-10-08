import 'dart:math';

import 'package:randino/src/gpu/gpu_generator.dart';
import 'package:randino/src/types.dart';

/// Generate real graphics processors, by the names their makers gave them.
///
/// NVIDIA, AMD and Intel cards, laptop GPUs and integrated graphics for
/// desktops and laptops, and the GPUs inside the chips of phones and tablets
/// from Qualcomm, Arm and Samsung; a null [platform] draws from both. [minYear]
/// and [maxYear] keep to the parts whose first cards or machines went on sale in
/// those years.
///
/// ```dart
/// randGpu(); // [NVIDIA GeForce RTX 3060]
/// randGpu(platform: SystemPlatform.mobile, count: 2); // [Qualcomm Adreno 740, Arm Mali-G78]
/// randGpu(platform: SystemPlatform.desktop, maxYear: 2010); // [ATI Radeon HD 4870]
/// randGpu(includeVendor: false); // [Radeon RX 7900 XTX]
/// ```
List<String> randGpu({
  SystemPlatform? platform,
  int? minYear,
  int? maxYear,

  /// Write the maker in front of the graphics processor: `NVIDIA GeForce RTX
  /// 4090` rather than `GeForce RTX 4090`.
  bool includeVendor = true,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateGpuDetails(
    platform: platform,
    minYear: minYear,
    maxYear: maxYear,
    includeVendor: includeVendor,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.gpu,
];
