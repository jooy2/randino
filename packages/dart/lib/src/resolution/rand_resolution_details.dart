import 'dart:math';

import 'package:randino/src/resolution/data/index.dart';
import 'package:randino/src/resolution/resolution_generator.dart';
import 'package:randino/src/types.dart';

/// [randResolution], along with the width and the height of each resolution as
/// numbers.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randResolutionDetails().first; // ResolutionDetail(1920x1080, desktop)
/// ```
List<ResolutionDetail> randResolutionDetails({
  SystemPlatform? platform,
  String separator = resolutionSeparatorDefault,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateResolutionDetails(
  platform: platform,
  separator: separator,
  count: count,
  unique: unique,
  random: random,
);
