// The app store generator: a store people really get apps from, drawn by how
// common it is on the platform it is drawn for.

import 'dart:math';

import 'package:randino/src/appstore/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

// The stores each set of platforms leaves, kept so a call does not work them
// out again.
final Map<String, List<Outcome<AppStoreEntry>>> _kept = {};

/// What `randAppStore` and `randAppStoreDetails` both do.
List<AppStoreDetail> generateAppStoreDetails({
  SystemPlatform? platform,
  bool includeCompany = true,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final platforms = resolvePlatforms(platform);
  // The platform first, so a null one is half stores of each kind rather than
  // whichever kind the table happens to list more stores for.
  final outcomes = keptOutcomes<AppStoreEntry>(
    _kept,
    platforms.map((each) => each.name).join(','),
    () {
      final pools = <List<AppStoreEntry>>[
        for (final each in platforms)
          [
            for (final entry in appStores)
              if (entry.platform == each) entry,
          ],
      ];

      return [
        for (final pool in pools)
          for (final (index, share) in shares(pool, (each) => each.weight).indexed)
            (entry: pool[index], weight: share / pools.length),
      ];
    },
  );

  return withRandom(
    random,
    () => collectFrom<AppStoreEntry, AppStoreDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      outcomes: outcomes,
      keyOf: (entry) => includeCompany ? entry.full : entry.name,
      build:
          (entry) => AppStoreDetail(
            store: includeCompany ? entry.full : entry.name,
            name: entry.name,
            company: entry.company,
            platform: entry.platform,
          ),
    ),
  );
}
