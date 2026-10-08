import 'dart:math';

import 'package:randino/src/types.dart';
import 'package:randino/src/version/version_generator.dart';

/// [randVersion], along with the scheme and the numbers each version is made
/// of.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randVersionDetails().first; // VersionDetail(2.14.3, semver)
/// ```
List<VersionDetail> randVersionDetails({
  Set<VersionFormat>? format = const {VersionFormat.semver},
  String prefix = '',
  bool includePrerelease = false,
  int? minYear,
  int? maxYear,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateVersionDetails(
  format: format,
  prefix: prefix,
  includePrerelease: includePrerelease,
  minYear: minYear,
  maxYear: maxYear,
  count: count,
  unique: unique,
  random: random,
);
