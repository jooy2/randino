// Internal shape of the per-language location datasets. Not part of the public
// API — consumers only ever see the parameters and `LocationDetail`.
//
// Unlike every other dataset in the package, these are not written by hand:
// `tools/location` writes them out of the file the country publishes, into all
// three packages at once.

import 'package:randino/src/types.dart';

/// Which end a location is written from.
enum LocationOrder {
  /// The country first: `대한민국 서울특별시 종로구`.
  largestFirst,

  /// The country last: `Pasadena, California, United States`.
  smallestFirst,
}

/// Everything the location generators know about one language, and so about
/// one country.
class LocationLanguageData {
  /// Creates a language dataset.
  const LocationLanguageData({
    required this.country,
    required this.order,
    required this.joiner,
    required this.levels,
    required this.outline,
  });

  /// The country, the way the language writes its own.
  final String country;

  /// Which end a location is written from. Korean writes the country first,
  /// English writes it last.
  final LocationOrder order;

  /// What goes between two levels when a location is written out.
  final String joiner;

  /// The levels the outline holds, largest first. Never [LocationLevel.country],
  /// which the dataset names itself.
  final List<LocationLevel> levels;

  /// The divisions themselves, as `outline` in `internal/parse.dart` reads them.
  final String outline;
}
