import 'package:randino/randino.dart';
// The datasets are internal, but a location is only real if it is one of theirs —
// these are what tie the output back to the outline each language ships.
import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/location/data/countries.dart';
import 'package:randino/src/location/data/index.dart';
import 'package:randino/src/location/data/types.dart';
import 'package:test/test.dart';

const int sample = 60;

// What one division's name may be written with. Korean names carry a digit where
// the division does (`종로1가`); US names carry the punctuation their own
// official names do (`O'Fallon`, `Winston-Salem`, `St. Louis`).
final Map<LocationLanguage, RegExp> nameScript = <LocationLanguage, RegExp>{
  LocationLanguage.ko: RegExp(r'^[가-힣0-9]+(?: [가-힣0-9]+)?$'),
  LocationLanguage.en: RegExp(r"^[\p{Script=Latin}0-9 .,'()/-]+$", unicode: true),
};

// The script a country's name opens on, per word language.
final Map<WordLanguage, RegExp> opens = <WordLanguage, RegExp>{
  WordLanguage.en: RegExp(r'^\p{Script=Latin}', unicode: true),
  WordLanguage.ko: RegExp(r'^[가-힣]'),
  WordLanguage.ja: RegExp(r'^[぀-ヿ一-鿿]'),
  WordLanguage.zh: RegExp(r'^[一-鿿]'),
  WordLanguage.vi: RegExp(r'^\p{Script=Latin}', unicode: true),
  WordLanguage.es: RegExp(r'^\p{Script=Latin}', unicode: true),
  WordLanguage.it: RegExp(r'^\p{Script=Latin}', unicode: true),
  WordLanguage.de: RegExp(r'^\p{Script=Latin}', unicode: true),
  WordLanguage.ru: RegExp(r'^\p{Script=Cyrillic}', unicode: true),
};

/// The country table as rows of `[code, name, name, …]`.
final List<List<String>> countryRows = <List<String>>[
  for (final line in countries.table.trim().split('\n')) line.trim().split('|'),
];

/// Every country's name in one language, by its code.
Map<String, String> countriesIn(WordLanguage language) {
  final column = countries.languages.indexOf(language) + 1;

  return <String, String>{for (final row in countryRows) row[0]: row[column]};
}

const Map<LocationLevel, int> depthOf = <LocationLevel, int>{
  LocationLevel.country: 0,
  LocationLevel.region: 1,
  LocationLevel.city: 2,
  LocationLevel.district: 3,
};

/// One division the outline holds, by the names of every level down to it.
typedef Place = ({String region, String? city, String? district});

/// Every division a language's outline holds, in the order it holds them.
List<Place> placesOf(LocationLanguage language) {
  final data = locationData[language]!;

  return <Place>[
    for (final entry in outline(data.outline, data.levels.length))
      () {
        final named = <LocationLevel, String?>{};

        for (var depth = 0; depth < data.levels.length; depth += 1) {
          named[data.levels[depth]] = depth < entry.path.length ? entry.path[depth] : null;
        }

        return (
          region: named[LocationLevel.region] ?? '',
          city: named[LocationLevel.city],
          district: named[LocationLevel.district],
        );
      }(),
  ];
}

String keyOf(String? region, String? city, String? district) =>
    <String>[region ?? '', city ?? '', district ?? ''].join('/');

String placeKey(Place place) => keyOf(place.region, place.city, place.district);

String detailKey(LocationDetail detail) => keyOf(detail.region, detail.city, detail.district);

final Map<LocationLanguage, List<Place>> listed = <LocationLanguage, List<Place>>{
  for (final language in locationLanguages) language: placesOf(language),
};

final Map<LocationLanguage, Map<String, Place>> places = <LocationLanguage, Map<String, Place>>{
  for (final language in locationLanguages)
    language: <String, Place>{for (final place in listed[language]!) placeKey(place): place},
};

/// What a detail writes out, rebuilt from its own levels.
String written(LocationDetail detail) {
  final data = locationData[detail.language]!;
  final parts =
      <String?>[detail.country, detail.region, detail.city, detail.district].nonNulls.toList();

  return (data.order == LocationOrder.largestFirst ? parts : parts.reversed).join(data.joiner);
}

void main() {
  group('Location', () {
    test('randLocation returns one location by default', () {
      final locations = randLocation();

      expect(locations, hasLength(1));
      expect(locations.first, isNotEmpty);
    });

    test('every generator returns exactly `count` results', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randLocation(count: count), hasLength(count));
        expect(randCountry(count: count), hasLength(count));
        expect(randRegion(count: count), hasLength(count));
        expect(randCity(count: count), hasLength(count));
        expect(randDistrict(count: count), hasLength(count));
      }

      expect(randLocation(count: -3), isEmpty);
      expect(randRegion(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('a location is written out from its own levels, in the order its language writes one', () {
      for (final language in locationLanguages) {
        for (final detail in randLocationDetails(language: language, count: sample)) {
          expect(detail.language, language);
          expect(detail.country, locationData[language]!.country);
          expect(detail.location, written(detail), reason: detail.location);
        }
      }

      expect(randLocation(language: LocationLanguage.ko).first, startsWith('대한민국 '));
      expect(randLocation(language: LocationLanguage.en).first, endsWith(', United States'));
    });

    test('every division is one the dataset holds, inside the division written beside it', () {
      for (final language in locationLanguages) {
        for (final detail in randLocationDetails(language: language, count: sample * 5)) {
          expect(
            places[language]!.containsKey(detailKey(detail)),
            isTrue,
            reason: '$language: ${detail.location} is not in the outline',
          );

          for (final name in <String?>[detail.region, detail.city, detail.district].nonNulls) {
            expect(name, matches(nameScript[language]!), reason: detail.location);
          }
        }
      }
    });

    test(
      'level says how far down a location goes, and stops at the deepest one its country has',
      () {
        for (final level in LocationLevel.values) {
          for (final detail in randLocationDetails(
            language: LocationLanguage.ko,
            level: level,
            count: sample,
          )) {
            // 세종특별자치시 has no 시·군·구, so a location asked for a city can stop at
            // the region; nothing ever goes past the level asked for.
            expect(
              depthOf[detail.level]!,
              lessThanOrEqualTo(depthOf[level]!),
              reason: detail.location,
            );
            expect(
              detail.district == null,
              level != LocationLevel.district,
              reason: detail.location,
            );
            expect(detail.region == null, level == LocationLevel.country, reason: detail.location);
          }
        }

        for (final detail in randLocationDetails(language: LocationLanguage.en, count: sample)) {
          expect(detail.level, LocationLevel.city);
          expect(detail.district, isNull);
        }

        expect(
          randLocation(language: LocationLanguage.en, level: LocationLevel.country, count: 2),
          <String>['United States', 'United States'],
        );
      },
    );

    test('a region with no city is still a location at the city level', () {
      // Every city-level location of that exact length, which is few enough for the
      // draws `unique` allows to reach all of them.
      final locations = randLocation(
        language: LocationLanguage.ko,
        level: LocationLevel.city,
        minLength: '대한민국 세종특별자치시'.length,
        maxLength: '대한민국 세종특별자치시'.length,
        unique: true,
        count: 1000,
      );

      expect(locations, contains('대한민국 세종특별자치시'));
    });

    test('each level has a generator of its own, and it hands back that level alone', () {
      final generators =
          <(LocationLevel, List<LocationDetail> Function(), String? Function(LocationDetail))>[
            (LocationLevel.region, () => randRegionDetails(count: sample), (d) => d.region),
            (LocationLevel.city, () => randCityDetails(count: sample), (d) => d.city),
            (LocationLevel.district, () => randDistrictDetails(count: sample), (d) => d.district),
          ];

      for (final (level, generate, named) in generators) {
        for (final detail in generate()) {
          expect(detail.level, level);
          expect(detail.location, named(detail));
          expect(
            places[detail.language]!.containsKey(detailKey(detail)),
            isTrue,
            reason: detail.location,
          );
        }
      }
    });

    test('randCountry names every ISO 3166-1 country, in every word language', () {
      expect(countryRows, hasLength(249));
      expect(countryRows.map((row) => row[0]).toSet(), hasLength(249));
      expect(countries.languages, unorderedEquals(wordLanguages));

      for (final row in countryRows) {
        expect(row[0], matches(RegExp(r'^[A-Z]{2}$')));
        expect(row, hasLength(countries.languages.length + 1), reason: row[0]);
      }

      for (final language in wordLanguages) {
        final named = countriesIn(language);

        for (final detail in randCountryDetails(language: language, count: sample)) {
          expect(detail.language, language);
          expect(named[detail.code], detail.country, reason: '${language.name}: ${detail.code}');
          expect(detail.country, matches(opens[language]!), reason: detail.country);
        }

        // Unique by name, and two countries a language names alike would be one.
        expect(
          randCountry(language: language, unique: true, count: 300),
          hasLength(named.values.toSet().length),
        );
      }
    });

    test('randCountry mixes every word language, not only the ones with divisions', () {
      final languages = randCountryDetails(count: 300).map((detail) => detail.language).toSet();

      expect(languages, wordLanguages.toSet());
      expect(
        randCountry(language: WordLanguage.de, startsWith: 'Ö', count: 3, unique: true),
        <String>['Österreich'],
      );

      for (final name in randCountry(language: WordLanguage.ru, maxLength: 5, count: sample)) {
        expect(name.length, lessThanOrEqualTo(5), reason: name);
      }
    });

    test('a location opens on the name the country table gives its country', () {
      // `randLocation` and `randCountry` read one table, so they cannot spell a
      // country two ways.
      expect(locationData[LocationLanguage.ko]!.country, countriesIn(WordLanguage.ko)['KR']);
      expect(locationData[LocationLanguage.en]!.country, countriesIn(WordLanguage.en)['US']);
      expect(randLocation(language: LocationLanguage.ko, level: LocationLevel.country), <String>[
        '대한민국',
      ]);
    });

    test(
      'a level the country does not have is answered with nothing, and `all` skips that country',
      () {
        expect(randDistrict(language: LocationLanguage.en, count: 5), isEmpty);

        for (final detail in randDistrictDetails(count: sample)) {
          expect(detail.language, LocationLanguage.ko);
        }
      },
    );

    test('the mixed language uses every language it knows', () {
      final languages = randCityDetails(count: sample).map((detail) => detail.language).toSet();

      expect(languages, locationLanguages.toSet());
    });

    test('a null language and the default level are every language and the district', () {
      // The npm package's `language: 'ja'` and `level: 'street'` fall back to these
      // two; Dart's enums cannot be handed an unknown value, so what is left to check
      // is that leaving both out means the same.
      final detail = randLocationDetails().first;

      expect(locationLanguages, contains(detail.language));
      expect(
        detail.level == LocationLevel.district || detail.language == LocationLanguage.en,
        isTrue,
      );
    });

    test('startsWith leads every result with the requested character', () {
      for (final city in randCity(language: LocationLanguage.en, startsWith: 'Z', count: sample)) {
        expect(city, startsWith('Z'));
      }

      for (final district in randDistrict(startsWith: '역', count: sample)) {
        expect(district, startsWith('역'));
      }

      // Matched without regard to case, the way every generator matches it.
      expect(randRegion(language: LocationLanguage.en, startsWith: 'n').first, startsWith('N'));
    });

    test(
      'a startsWith no language can write, or no division begins with, is answered with nothing',
      () {
        expect(randLocation(language: LocationLanguage.ko, startsWith: 'Q'), isEmpty);
        expect(randCity(startsWith: 'ж'), isEmpty);
        // Every Korean location opens on the country, so no other character can lead one.
        expect(randLocation(language: LocationLanguage.ko, startsWith: '서'), isEmpty);
        // And a language that cannot answer is out before a draw, rather than half the draws.
        expect(randCity(startsWith: 'Z', count: 10), hasLength(10));
      },
    );

    test('results stay inside the requested length range', () {
      for (final city in randCity(
        language: LocationLanguage.en,
        minLength: 5,
        maxLength: 6,
        count: sample,
      )) {
        expect(city.length, inInclusiveRange(5, 6), reason: city);
      }

      for (final location in randLocation(
        language: LocationLanguage.ko,
        maxLength: 16,
        count: sample,
      )) {
        expect(location.length, lessThanOrEqualTo(16), reason: location);
      }
    });

    test('a range nothing fits is answered with the closest division, not with none', () {
      final longest = listed[LocationLanguage.en]!.fold<int>(
        0,
        (most, place) =>
            place.city != null && place.city!.length > most ? place.city!.length : most,
      );

      for (final city in randCity(language: LocationLanguage.en, minLength: 60, count: 5)) {
        expect(city.length, longest);
      }

      // An overshoot is worse than an undershoot of the same size.
      for (final region in randRegion(language: LocationLanguage.ko, maxLength: 2, count: 5)) {
        expect(region.length, 3, reason: region);
      }
    });

    test('unique never repeats a result, and stops when the pool runs out', () {
      final regions = randRegion(language: LocationLanguage.en, unique: true, count: sample);

      expect(regions.toSet(), hasLength(regions.length));
      expect(regions, hasLength(51));
    });

    test('the Korean dataset stops above the 리, and writes a city district after its city', () {
      final korean = listed[LocationLanguage.ko]!;
      final regions = korean.where((place) => place.city == null && place.district == null);
      final cities = korean.map((place) => place.city).nonNulls.toSet();

      expect(regions, hasLength(16));

      for (final place in korean) {
        final district = place.district;

        if (district != null) {
          expect(district, matches(RegExp(r'(?:동|읍|면|가|로)$')), reason: district);
          expect(district, isNot(matches(RegExp(r'리$|출장소'))), reason: district);
        }
      }

      for (final city in cities) {
        // `수원시장안구` is how the file writes it and not how an address does.
        expect(city, isNot(matches(RegExp(r'시\S+구$'))), reason: city);
      }

      expect(cities, contains('수원시 장안구'));
      // 세종특별자치시 has no 시·군·구, and its 읍·면·동 sit directly under it.
      expect(
        korean.any(
          (place) => place.region == '세종특별자치시' && place.city == null && place.district != null,
        ),
        isTrue,
      );
      expect(korean.any((place) => place.region == '세종특별자치시' && place.city != null), isFalse);
    });

    test(
      'the US dataset is the fifty states and DC, with each place named the way it is called',
      () {
        final american = listed[LocationLanguage.en]!;
        final regions = american.map((place) => place.region).toSet();

        expect(regions, hasLength(51));
        expect(regions, contains('District of Columbia'));
        expect(regions, isNot(contains('Puerto Rico')));

        final seen = <String>{};
        final suffixed = RegExp(r' (?:city|town|village|borough|CDP|municipality)$|\(balance\)');

        for (final place in american) {
          final city = place.city;

          if (city == null) continue;

          expect(city, isNot(matches(suffixed)), reason: city);

          final key = '${place.region}/$city';

          expect(seen.contains(key), isFalse, reason: '$key is listed twice');
          seen.add(key);
        }
      },
    );
  });
}
