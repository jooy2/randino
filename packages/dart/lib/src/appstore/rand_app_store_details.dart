import 'dart:math';

import 'package:randino/src/appstore/app_store_generator.dart';
import 'package:randino/src/types.dart';

/// [randAppStore], along with each store's own name and the company that runs
/// it.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randAppStoreDetails().first; // AppStoreDetail(Samsung Galaxy Store, mobile)
/// ```
List<AppStoreDetail> randAppStoreDetails({
  SystemPlatform? platform,
  bool includeCompany = true,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateAppStoreDetails(
  platform: platform,
  includeCompany: includeCompany,
  count: count,
  unique: unique,
  random: random,
);
