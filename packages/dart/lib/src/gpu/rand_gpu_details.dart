import 'dart:math';

import 'package:randino/src/gpu/gpu_generator.dart';
import 'package:randino/src/types.dart';

/// [randGpu], along with the maker, the model, the platform and the year of
/// each graphics processor.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randGpuDetails().first; // GpuDetail(Intel Arc A770, desktop, 2022)
/// ```
List<GpuDetail> randGpuDetails({
  SystemPlatform? platform,
  int? minYear,
  int? maxYear,
  Set<String>? vendor,
  bool includeVendor = true,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateGpuDetails(
  platform: platform,
  minYear: minYear,
  maxYear: maxYear,
  vendor: vendor,
  includeVendor: includeVendor,
  count: count,
  unique: unique,
  random: random,
);
