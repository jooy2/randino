import 'dart:math';

import 'package:randino/src/appstore/app_store_generator.dart';
import 'package:randino/src/types.dart';

/// Generate real app stores, by the name each is known by: `Google Play Store`,
/// `Apple App Store`, `Microsoft Store`, `Steam`.
///
/// Google Play and Apple's App Store are most of the phones, and the Microsoft
/// Store, Steam and the Mac App Store most of the desktops; [platform] keeps to
/// one of the two, and Google Play is never a desktop's.
///
/// ```dart
/// randAppStore(); // [Google Play Store]
/// randAppStore(platform: SystemPlatform.desktop, count: 3); // [Steam, Microsoft Store, Mac App Store]
/// randAppStore(platform: SystemPlatform.mobile, includeCompany: false); // [App Store]
/// ```
List<String> randAppStore({
  SystemPlatform? platform,

  /// Write the name with its company where the store is known by one: `Apple
  /// App Store` rather than `App Store`.
  bool includeCompany = true,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateAppStoreDetails(
    platform: platform,
    includeCompany: includeCompany,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.store,
];
