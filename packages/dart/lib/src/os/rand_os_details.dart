import 'dart:math';

import 'package:randino/src/os/os_generator.dart';
import 'package:randino/src/types.dart';

/// [randOs], along with the pieces each system was written from: its name, the
/// version, the build and the edition written, and the year it came out.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randOsDetails(includeBuild: true).first; // OsDetail(macOS Sonoma 14.5, desktop, 2024)
/// ```
List<OsDetail> randOsDetails({
  SystemPlatform? platform,
  int? minYear,
  int? maxYear,
  bool includeVersion = true,
  bool includeBuild = false,
  bool includeEdition = false,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateOsDetails(
  platform: platform,
  minYear: minYear,
  maxYear: maxYear,
  includeVersion: includeVersion,
  includeBuild: includeBuild,
  includeEdition: includeEdition,
  count: count,
  unique: unique,
  random: random,
);
