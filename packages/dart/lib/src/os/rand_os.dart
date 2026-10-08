import 'dart:math';

import 'package:randino/src/os/os_generator.dart';
import 'package:randino/src/types.dart';

/// Generate real operating systems, written the way each release is known.
///
/// Windows, macOS, Ubuntu, Debian and Fedora on the desktop, Android, iOS and
/// iPadOS on mobile; a null [platform] draws from both. [includeBuild] writes
/// the build or the point release, and [includeEdition] an edition where the
/// release has one. [minYear] and [maxYear] keep to the releases out in those
/// years, so `maxYear: 2015` is what was out by the end of 2015 — and with
/// [includeBuild], the year that counts is the build's.
///
/// ```dart
/// randOs(); // [Windows 10]
/// randOs(platform: SystemPlatform.mobile, count: 3); // [Android 9 Pie, iOS 17, Android 13]
/// randOs(includeBuild: true, includeEdition: true); // [Windows 11 Pro 23H2 (Build 22631)]
/// randOs(platform: SystemPlatform.desktop, maxYear: 2010); // [Mac OS X Snow Leopard 10.6]
/// ```
List<String> randOs({
  SystemPlatform? platform,
  int? minYear,
  int? maxYear,

  /// Write the version after the name. Left off, the build and the edition go
  /// with it, because neither means anything without its version.
  bool includeVersion = true,
  bool includeBuild = false,
  bool includeEdition = false,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateOsDetails(
    platform: platform,
    minYear: minYear,
    maxYear: maxYear,
    includeVersion: includeVersion,
    includeBuild: includeBuild,
    includeEdition: includeEdition,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.os,
];
