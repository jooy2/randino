import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/types.dart';

/// One store the catalog holds, and how often it comes up. Internal.
class AppStoreEntry {
  /// Creates an entry.
  const AppStoreEntry({
    required this.platform,
    required this.weight,
    required this.company,
    required this.name,
    required this.full,
  });

  /// The kind of machine the store sells apps for.
  final SystemPlatform platform;

  /// How often it comes up beside the other stores of its platform, out of a
  /// hundred.
  final num weight;

  /// The company that runs it.
  final String company;

  /// The store's own name: `App Store`, `Galaxy Store`.
  final String name;

  /// The name with its company, where the store is known by one: `Apple App
  /// Store`.
  final String full;
}

/// Every store the catalog holds, one per row: `platform | weight | company |
/// name | full name`. Internal.
///
/// Only stores that sell or hand out apps for a platform's own system are in,
/// and only ones still open. Google Play is a phone's alone, since no desktop
/// system ships it. The weights are written by hand in the order the stores
/// are common in, not measured, and each platform's add up to a hundred.
final List<AppStoreEntry> appStores = List<AppStoreEntry>.unmodifiable(
  rows(r'''
  mobile | 45 | Google | Google Play | Google Play Store
  mobile | 35 | Apple | App Store | Apple App Store
  mobile | 6 | Samsung | Galaxy Store | Samsung Galaxy Store
  mobile | 5 | Huawei | AppGallery | Huawei AppGallery
  mobile | 3 | Amazon | Amazon Appstore | Amazon Appstore
  mobile | 2 | Xiaomi | GetApps | Xiaomi GetApps
  mobile | 2 | ONE store | ONE store | ONE store
  mobile | 1 | Aptoide | Aptoide | Aptoide
  mobile | 1 | F-Droid | F-Droid | F-Droid

  desktop | 30 | Microsoft | Microsoft Store | Microsoft Store
  desktop | 25 | Valve | Steam | Steam
  desktop | 20 | Apple | Mac App Store | Mac App Store
  desktop | 8 | Epic Games | Epic Games Store | Epic Games Store
  desktop | 4 | GOG | GOG.com | GOG.com
  desktop | 4 | Canonical | Snap Store | Snap Store
  desktop | 3 | Electronic Arts | EA app | EA app
  desktop | 3 | Ubisoft | Ubisoft Connect | Ubisoft Connect
  desktop | 3 | MacPaw | Setapp | Setapp
''').map(
    (row) => AppStoreEntry(
      platform: SystemPlatform.values.byName(row[0]),
      weight: num.parse(row[1]),
      company: row[2],
      name: row[3],
      full: row[4],
    ),
  ),
);
