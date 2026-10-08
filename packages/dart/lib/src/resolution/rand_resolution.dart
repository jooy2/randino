import 'dart:math';

import 'package:randino/src/resolution/data/index.dart';
import 'package:randino/src/resolution/resolution_generator.dart';
import 'package:randino/src/types.dart';

/// Generate screen resolutions, the way a browser reports them, with the
/// common ones most often.
///
/// 1920x1080 is about a quarter of the desktops, and the sizes of the common
/// iPhones and Android phones lead on mobile; a null [platform] draws both
/// evenly. Each is written as the width, [separator] and the height.
///
/// ```dart
/// randResolution(); // [1920x1080]
/// randResolution(platform: SystemPlatform.mobile, count: 2); // [390x844, 360x800]
/// randResolution(separator: ' × '); // [2560 × 1440]
/// ```
List<String> randResolution({
  SystemPlatform? platform,

  /// What goes between the width and the height: `'×'` writes `1920×1080`.
  String separator = resolutionSeparatorDefault,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateResolutionDetails(
    platform: platform,
    separator: separator,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.resolution,
];
