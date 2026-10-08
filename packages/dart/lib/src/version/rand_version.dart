import 'dart:math';

import 'package:randino/src/types.dart';
import 'package:randino/src/version/version_generator.dart';

/// Generate software version numbers: `2.14.3`, `2024.3.1`, `42`.
///
/// [format] picks how they are numbered, and several are drawn evenly, one per
/// result; a null or empty one draws every format. Every part is drawn with the
/// small numbers most often, so `0.x` and `x.y.0` come up the way they do in a
/// registry.
///
/// ```dart
/// randVersion(); // [2.14.3]
/// randVersion(format: {VersionFormat.calver}, count: 3); // [2024.3.1, 24.04, 2019.2]
/// randVersion(format: {VersionFormat.number}, prefix: 'v'); // [v42]
/// randVersion(includePrerelease: true, count: 3); // [1.4.0, 3.0.0-rc.1, 0.12.2]
/// ```
List<String> randVersion({
  Set<VersionFormat>? format = const {VersionFormat.semver},

  /// Written in front of every version: `'v'` writes `v2.14.3`.
  String prefix = '',

  /// Give a semantic version a pre-release now and then: `2.0.0-beta.2`. About
  /// one in four carries one.
  bool includePrerelease = false,

  /// The earliest year a calendar version may be counted from. Kept inside 2000
  /// to 2099; null is 2010.
  int? minYear,

  /// The latest year a calendar version may be counted from. Null is 2026, or
  /// [minYear] when that is later.
  int? maxYear,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateVersionDetails(
    format: format,
    prefix: prefix,
    includePrerelease: includePrerelease,
    minYear: minYear,
    maxYear: maxYear,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.version,
];
