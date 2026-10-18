import 'dart:math';

import 'package:randino/src/fictional/place_generator.dart';
import 'package:randino/src/types.dart';

/// Generate the names of regions that do not exist — provinces, valleys, coasts
/// and the like — for the map of a story or a game. A region may carry the kind
/// of place it is beside its name — left null, [includeKind] decides that per
/// region, and a region's kind is translated outside English unless [kindStyle]
/// says otherwise.
///
/// A name is spelled in Latin letters first and written by its sound in every
/// other language, and the kind in each language's own words. A null
/// [language], the default, draws a language per place.
///
/// [startsWith] reads the place's name, not a kind written in front of it, and
/// [minLength] and [maxLength] the whole place. [randFictionalRegionForms]
/// writes every place in several languages at once.
///
/// ```dart
/// randFictionalRegion(language: WordLanguage.en, count: 3);
/// // [Silverfen Valley, Altheria, Isle of Lumeria]
/// randFictionalRegion(language: WordLanguage.ko, count: 3);
/// // [실버펜 계곡, 알테리아, 루메리아섬]
/// randFictionalRegion(language: WordLanguage.de, includeKind: true);
/// // [Grafschaft Altheria]
/// ```
List<String> randFictionalRegion({
  WordLanguage? language,
  bool? includeKind,
  FictionalKindStyle? kindStyle,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateFictionalPlaceDetails(
    LocationLevel.region,
    language: language == null ? null : {language},
    includeKind: includeKind,
    kindStyle: kindStyle,
    count: count,
    realism: realism,
    minLength: minLength,
    maxLength: maxLength,
    startsWith: startsWith,
    unique: unique,
    random: random,
  ))
    detail.place,
];
