// How each location language writes a division by its short name, the way a
// place is said rather than registered. Written by hand in all three packages
// and compared by `tools/parity`, unlike the outlines `tools/location` writes.

import 'package:randino/src/types.dart';

/// How a language shortens a division's name. Internal.
class ShortRule {
  /// Creates a rule.
  const ShortRule({required this.kinds, required this.stem, required this.halves});

  /// The kinds a name at each level ends on, which `short` leaves off.
  ///
  /// Longest first, so `통합특별시` is tried before `특별시`. A name ending on
  /// none of them is written whole: a `가` (`종로1가`) or a `로` (`세종로`) is
  /// part of the name.
  final Map<LocationLevel, List<String>> kinds;

  /// The fewest characters a name keeps.
  ///
  /// A kind that would leave fewer stays on, so `중구` is not `중` and `목동`
  /// is not `목`.
  final int stem;

  /// The halves a first-level division is told apart by.
  ///
  /// A region whose stem is three characters ending on one goes by its first
  /// character and the half: `충청북도` is `충북`, `경상남도` is `경남`.
  final List<String> halves;
}

/// Each location language's rule, or null for one whose names carry no kind.
/// Internal.
///
/// A US state or place is its name alone, and the `City` of `Kansas City` is
/// part of it.
const Map<LocationLanguage, ShortRule?> locationShort = <LocationLanguage, ShortRule?>{
  LocationLanguage.en: null,
  LocationLanguage.ko: ShortRule(
    kinds: <LocationLevel, List<String>>{
      LocationLevel.region: <String>['통합특별시', '특별자치시', '특별자치도', '특별시', '광역시', '도'],
      LocationLevel.city: <String>['시', '군', '구'],
      LocationLevel.district: <String>['동', '읍', '면'],
    },
    stem: 2,
    halves: <String>['남', '북'],
  ),
};
