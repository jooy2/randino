import 'dart:math';

import 'package:randino/src/fictional/place_generator.dart';
import 'package:randino/src/types.dart';

/// Generate the names of countries that do not exist, for the map of a story or
/// a game. A country may carry the kind of state it is beside its name — left
/// null, [includeKind] decides that per country, and a country's kind is
/// translated outside English unless [kindStyle] says otherwise.
///
/// A name is spelled in Latin letters first and written by its sound in every
/// other language, and the kind in each language's own words. A null
/// [language], the default, draws a language per place.
///
/// [startsWith] reads the place's name, not a kind written in front of it, and
/// [minLength] and [maxLength] the whole place. [randFictionalCountryForms]
/// writes every place in several languages at once.
///
/// ```dart
/// randFictionalCountry(language: WordLanguage.en, count: 3);
/// // [Kingdom of Edlin, Glacia, Castavia Empire]
/// randFictionalCountry(language: WordLanguage.ko, count: 3);
/// // [에들린 왕국, 글래시아, 카스타비아 제국]
/// randFictionalCountry(
///   language: WordLanguage.ko,
///   kindStyle: FictionalKindStyle.borrowed,
///   includeKind: true,
/// );
/// // [에들린 킹덤]
/// ```
List<String> randFictionalCountry({
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
    LocationLevel.country,
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
