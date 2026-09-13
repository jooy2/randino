import 'package:randino/src/location/data/en.dart';
import 'package:randino/src/location/data/ko.dart';
import 'package:randino/src/location/data/types.dart';
import 'package:randino/src/types.dart';

/// Languages the location generators cover, and so the countries: a language
/// writes the places of its own.
///
/// Only countries that publish their divisions free of conditions are here — no
/// attribution to carry, no licence to pass on — which is why this is two
/// languages where the word pools are nine. See CLAUDE.md before adding one.
final List<LocationLanguage> locationLanguages = List<LocationLanguage>.unmodifiable(
  <LocationLanguage>[LocationLanguage.en, LocationLanguage.ko],
);

/// How far down a location can go, largest first.
final List<LocationLevel> locationLevels = List<LocationLevel>.unmodifiable(<LocationLevel>[
  LocationLevel.country,
  LocationLevel.region,
  LocationLevel.city,
  LocationLevel.district,
]);

/// The dataset behind each language. Internal.
final Map<LocationLanguage, LocationLanguageData> locationData =
    Map<LocationLanguage, LocationLanguageData>.unmodifiable(
      <LocationLanguage, LocationLanguageData>{LocationLanguage.en: en, LocationLanguage.ko: ko},
    );
