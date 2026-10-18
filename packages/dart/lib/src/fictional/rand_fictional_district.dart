import 'dart:math';

import 'package:randino/src/fictional/place_generator.dart';
import 'package:randino/src/types.dart';

/// Generate the names of districts that do not exist — the parts of a city a
/// story moves between. A district usually carries the kind of place it is
/// beside its name — left null, [includeKind] decides that per district, and a
/// district's kind keeps its English word outside English unless [kindStyle]
/// says otherwise.
///
/// A name is spelled in Latin letters first and written by its sound in every
/// other language, and the kind in each language's own words. A null
/// [language], the default, draws a language per place.
///
/// [startsWith] reads the place's name, not a kind written in front of it, and
/// [minLength] and [maxLength] the whole place. [randFictionalDistrictForms]
/// writes every place in several languages at once.
///
/// ```dart
/// randFictionalDistrict(language: WordLanguage.en, count: 3);
/// // [Gruger Park, Evelyn Bay, Hadley]
/// randFictionalDistrict(language: WordLanguage.ko, count: 3);
/// // [그루거 파크, 이블린 베이, 해들리]
/// randFictionalDistrict(
///   language: WordLanguage.ko,
///   kindStyle: FictionalKindStyle.translated,
///   includeKind: true,
/// );
/// // [그루거 공원]
/// ```
List<String> randFictionalDistrict({
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
    LocationLevel.district,
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
