import 'dart:math';

import 'package:randino/src/cpu/cpu_generator.dart';
import 'package:randino/src/types.dart';

/// [randCpu], along with the maker, the model, the platform and the year of
/// each processor.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randCpuDetails().first; // CpuDetail(Apple M3 Pro, desktop, 2023)
/// ```
List<CpuDetail> randCpuDetails({
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
}) => generateCpuDetails(
  platform: platform,
  minYear: minYear,
  maxYear: maxYear,
  vendor: vendor,
  includeVendor: includeVendor,
  count: count,
  unique: unique,
  random: random,
);
