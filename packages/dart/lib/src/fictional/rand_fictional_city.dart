import 'dart:math';

import 'package:randino/src/fictional/place_generator.dart';
import 'package:randino/src/types.dart';

/// Generate the names of cities and towns that do not exist, for the map of a
/// story or a game. A place may carry the kind it is beside its name — left
/// null, [includeKind] decides that per place.
///
/// A name is spelled in Latin letters first and written by its sound in every
/// other language, and the kind in each language's own words. A [language] set
/// draws one language per place, in the order it was written, and a null or
/// empty one draws from every language. [kindStyle] says how a kind is written
/// outside English; left null, it depends on the level — see
/// [FictionalKindStyle].
///
/// [startsWith] reads the place's name, not a kind written in front of it, and
/// [minLength] and [maxLength] the whole place.
///
/// ```dart
/// randFictionalCity(language: {WordLanguage.en}, count: 3);
/// // [Ashwick, Port Ravenford, Hollowbrook Falls]
/// randFictionalCity(language: {WordLanguage.ko}, count: 3);
/// // [애시윅, 포트 레이븐퍼드, 할로브룩 폴스]
/// randFictionalCity(
///   language: {WordLanguage.es},
///   kindStyle: FictionalKindStyle.translated,
///   includeKind: true,
/// );
/// // [Puerto Ravenford]
/// ```
List<String> randFictionalCity({
  Set<WordLanguage>? language,
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
    LocationLevel.city,
    language: language,
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
