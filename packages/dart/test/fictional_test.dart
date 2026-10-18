import 'dart:math';

import 'package:randino/randino.dart';
// The datasets are internal, but a name is only well formed if it is spelled out
// of them — these are what tie the output back to them.
import 'package:randino/src/fictional/data/index.dart';
import 'package:randino/src/fictional/pools.dart';
import 'package:randino/src/fictional/spelling.dart';
import 'package:randino/src/internal/parse.dart';
import 'package:test/test.dart';

const int sample = 60;

typedef PlaceGenerator =
    List<String> Function({
      Set<WordLanguage>? language,
      bool? includeKind,
      FictionalKindStyle? kindStyle,
      int count,
      RandRealism realism,
      int? minLength,
      int? maxLength,
      String? startsWith,
      bool unique,
      Random? random,
    });

typedef PlaceDetailGenerator =
    List<FictionalPlaceDetail> Function({
      Set<WordLanguage>? language,
      bool? includeKind,
      FictionalKindStyle? kindStyle,
      int count,
      RandRealism realism,
      int? minLength,
      int? maxLength,
      String? startsWith,
      bool unique,
      Random? random,
    });

const Map<LocationLevel, PlaceGenerator> places = <LocationLevel, PlaceGenerator>{
  LocationLevel.country: randFictionalCountry,
  LocationLevel.region: randFictionalRegion,
  LocationLevel.city: randFictionalCity,
  LocationLevel.district: randFictionalDistrict,
};

const Map<LocationLevel, PlaceDetailGenerator> placeDetails = <LocationLevel, PlaceDetailGenerator>{
  LocationLevel.country: randFictionalCountryDetails,
  LocationLevel.region: randFictionalRegionDetails,
  LocationLevel.city: randFictionalCityDetails,
  LocationLevel.district: randFictionalDistrictDetails,
};

// What a whole fictional name or place may hold, per language: the script, and
// the joiners and marks that script writes between and inside names.
final Map<WordLanguage, RegExp> script = <WordLanguage, RegExp>{
  WordLanguage.en: RegExp(r"^[A-Za-z' -]+$"),
  WordLanguage.vi: RegExp(r"^[A-Za-zÀ-ỹ' -]+$"),
  WordLanguage.es: RegExp(r"^[A-Za-zÁÉÍÓÚáéíóúñÑü' -]+$"),
  WordLanguage.it: RegExp(r"^[A-Za-zÀ-ÿ' -]+$"),
  WordLanguage.de: RegExp(r"^[A-Za-zÄÖÜäöüß' -]+$"),
  WordLanguage.ko: RegExp(r'^[가-힣 ]+$'),
  WordLanguage.ja: RegExp(r'^[ぁ-ゖァ-ヶー・一-龯]+$'),
  WordLanguage.zh: RegExp(r'^[一-鿿·]+$'),
  WordLanguage.ru: RegExp(r'^[А-Яа-яЁё -]+$'),
};

// The column each script is in, and the pattern every spelling in it matches.
final List<RegExp> spellingPattern = <RegExp>[
  RegExp(r'^[A-Za-z]+$'),
  RegExp(r'^[가-힣]+$'),
  RegExp(r'^[ァ-ヶー]+$'),
  RegExp(r'^[一-鿿]+$'),
  RegExp(r'^[А-Яа-яЁё]+$'),
];

const List<WordLanguage> latinLanguages = <WordLanguage>[
  WordLanguage.en,
  WordLanguage.vi,
  WordLanguage.es,
  WordLanguage.it,
  WordLanguage.de,
];

const List<RandRealism> realisms = <RandRealism>[
  RandRealism.real,
  RandRealism.mixed,
  RandRealism.invented,
];

const List<FictionalKindStyle?> kindStyles = <FictionalKindStyle?>[
  null,
  FictionalKindStyle.borrowed,
  FictionalKindStyle.translated,
];

void main() {
  group('Fictional names', () {
    test('returns exactly `count` names, one by default', () {
      expect(randFictionalName(), hasLength(1));

      for (final count in [0, 1, 7, 25]) {
        expect(randFictionalName(count: count), hasLength(count));
      }

      expect(randFictionalName(count: -3), isEmpty);
      expect(randFictionalName(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('writes each language in its own script', () {
      for (final language in wordLanguages) {
        for (final realism in [RandRealism.real, RandRealism.invented]) {
          for (final name in randFictionalName(
            language: {language},
            realism: realism,
            includeSurname: true,
            count: sample,
          )) {
            expect(name, matches(script[language]!), reason: '${language.name} $name');
          }
        }
      }
    });

    test('writes a name in Latin letters the same way in every language that uses them', () {
      for (final detail in randFictionalNameDetails(
        includeSurname: true,
        realism: RandRealism.mixed,
        count: sample,
      )) {
        for (final language in latinLanguages) {
          expect(detail.forms[language], detail.forms[WordLanguage.en]);
        }
      }
    });

    test(
      '`forms` holds every language asked for, in the order asked, and `name` is one of them',
      () {
        final asked = <WordLanguage>[
          WordLanguage.ru,
          WordLanguage.ko,
          WordLanguage.en,
          WordLanguage.ja,
        ];
        final seen = <WordLanguage>{};

        for (final detail in randFictionalNameDetails(language: asked.toSet(), count: sample)) {
          expect(detail.forms.keys.toList(), asked);
          expect(asked, contains(detail.language));
          expect(detail.name, detail.forms[detail.language]);
          seen.add(detail.language);
        }

        // The value form draws a language per name from the set.
        expect(seen.length, greaterThan(1));

        final one = randFictionalNameDetails(language: {WordLanguage.ko})[0];

        expect(one.forms.keys.toList(), [WordLanguage.ko]);
        expect(randFictionalNameDetails()[0].forms.keys.toList(), wordLanguages);
      },
    );

    test('reads an empty language set as every language, and a repeated one once', () {
      expect(randFictionalNameDetails(language: {})[0].forms.keys.toList(), wordLanguages);
      expect(
        randFictionalNameDetails(
          language: {
            ...const [WordLanguage.ko, WordLanguage.ko, WordLanguage.en],
          },
        )[0].forms.keys.toList(),
        [WordLanguage.ko, WordLanguage.en],
      );
    });

    test('`realism: real` draws given names and surnames from the pools, of the right gender', () {
      final kept = pools();
      Set<String> latin(List<Spelling> pool) => {for (final entry in pool) entry[latinScript]};
      final male = latin(kept.given[NameGender.male]!);
      final female = latin(kept.given[NameGender.female]!);
      final family = latin(kept.surnames);

      for (final gender in NameGender.values) {
        for (final detail in randFictionalNameDetails(
          language: {WordLanguage.en},
          gender: gender,
          includeSurname: true,
          count: sample,
        )) {
          final [first, last] = detail.name.split(' ');

          expect(detail.gender, gender);
          expect(
            (gender == NameGender.male ? male : female).contains(first),
            isTrue,
            reason: first,
          );
          expect(family.contains(last), isTrue, reason: last);
        }
      }
    });

    test('writes a surname apart from the given name the way each script does', () {
      const joiners = <WordLanguage, String>{WordLanguage.ja: '・', WordLanguage.zh: '·'};

      for (final language in wordLanguages) {
        final joiner = joiners[language] ?? ' ';

        for (final name in randFictionalName(
          language: {language},
          includeSurname: true,
          count: sample,
        )) {
          expect(name.split(joiner), hasLength(2), reason: name);
        }

        for (final name in randFictionalName(language: {language}, count: sample)) {
          expect(name, isNot(contains(joiner)));
        }
      }
    });

    test('`startsWith` is the first character in the language the name is written in', () {
      for (final (language, prefix) in [
        (WordLanguage.en, 'A'),
        (WordLanguage.ko, '아'),
        (WordLanguage.ru, 'Э'),
        (WordLanguage.zh, '阿'),
      ]) {
        for (final realism in realisms) {
          final names = randFictionalName(
            language: {language},
            startsWith: prefix,
            realism: realism,
            count: sample,
          );

          expect(names, hasLength(sample));

          for (final name in names) {
            expect(name, startsWith(prefix), reason: '${language.name} ${realism.name} $name');
          }
        }
      }

      // Japanese spells a made-up name in katakana, so a hiragana prefix is read
      // as one.
      for (final name in randFictionalName(
        language: {WordLanguage.ja},
        startsWith: 'あ',
        count: sample,
      )) {
        expect(name, startsWith('ア'));
      }

      // A character no language writes is answered with nothing.
      expect(randFictionalName(startsWith: '!', count: 3), isEmpty);

      // And a language that does not write it is left out of a set.
      for (final detail in randFictionalNameDetails(
        language: {WordLanguage.ko, WordLanguage.en},
        startsWith: 'B',
        count: sample,
      )) {
        expect(detail.language, WordLanguage.en);
      }
    });

    test('keeps to a length range the pools can meet', () {
      for (final language in wordLanguages) {
        for (final name in randFictionalName(
          language: {language},
          minLength: 4,
          maxLength: 6,
          count: sample,
        )) {
          expect(name.length, inInclusiveRange(4, 6), reason: '${language.name} $name');
        }
      }

      for (final name in randFictionalName(includeSurname: true, minLength: 18, count: sample)) {
        expect(name.length, greaterThanOrEqualTo(18), reason: name);
      }

      // Only the CJK languages write a name of two characters.
      for (final detail in randFictionalNameDetails(maxLength: 2, count: sample)) {
        expect(detail.name.length, lessThanOrEqualTo(2), reason: detail.name);
      }
    });

    test('`unique` never returns the same name twice, in any language', () {
      final details = randFictionalNameDetails(
        language: {WordLanguage.en, WordLanguage.ko},
        unique: true,
        count: 500,
      );
      final keys = [for (final detail in details) detail.forms[WordLanguage.en]];

      expect(keys.toSet(), hasLength(keys.length));
      // The pools hold fewer than five hundred, so it stops when they run out.
      expect(
        details,
        hasLength(
          pools().given[NameGender.male]!.length + pools().given[NameGender.female]!.length,
        ),
      );
    });

    test('a seeded source draws the same names twice', () {
      List<String> draw() => randFictionalName(
        count: 20,
        realism: RandRealism.mixed,
        includeSurname: true,
        random: Random(7),
      );

      expect(draw(), draw());
    });
  });

  group('Fictional places', () {
    final kinds = rows(fictionalKinds);
    final kindOf = {for (final cells in kinds) cells[0]: cells};
    const letter = <LocationLevel, String>{
      LocationLevel.country: 'n',
      LocationLevel.region: 'r',
      LocationLevel.city: 'c',
      LocationLevel.district: 'd',
    };
    // The column of each language's templates, borrowed then translated.
    const column = <WordLanguage, (int, int)>{
      WordLanguage.en: (3, 3),
      WordLanguage.ko: (4, 5),
      WordLanguage.ja: (6, 7),
      WordLanguage.zh: (8, 8),
      WordLanguage.ru: (9, 10),
      WordLanguage.vi: (3, 11),
      WordLanguage.es: (3, 12),
      WordLanguage.it: (3, 13),
      WordLanguage.de: (3, 14),
    };

    test('returns exactly `count` places on every level', () {
      for (final generate in places.values) {
        expect(generate(), hasLength(1));
        expect(generate(count: 9), hasLength(9));
        expect(generate(count: -1), isEmpty);
      }

      for (final generate in placeDetails.values) {
        expect(generate(count: 9), hasLength(9));
      }
    });

    test('writes each language in its own script', () {
      for (final MapEntry(key: level, value: generate) in places.entries) {
        for (final language in wordLanguages) {
          for (final kindStyle in kindStyles) {
            for (final place in generate(
              language: {language},
              kindStyle: kindStyle,
              realism: RandRealism.mixed,
              count: sample,
            )) {
              expect(
                place,
                matches(script[language]!),
                reason: '${level.name} ${language.name} $place',
              );
            }
          }
        }
      }
    });

    test('is the name written into the template its kind and language have', () {
      for (final MapEntry(key: level, value: generate) in placeDetails.entries) {
        for (final kindStyle in kindStyles) {
          for (final detail in generate(
            kindStyle: kindStyle,
            includeKind: true,
            realism: RandRealism.mixed,
            count: sample,
          )) {
            final cells = kindOf[detail.kind!.name]!;

            expect(cells[1], contains(letter[level]!), reason: '${detail.kind} on ${level.name}');
            expect(detail.level, level);

            for (final MapEntry(key: code, value: place) in detail.forms.entries) {
              final borrowed =
                  kindStyle != null
                      ? kindStyle == FictionalKindStyle.borrowed
                      : cells[2] == 'borrowed';
              final (borrowedAt, translatedAt) = column[code]!;
              final template = cells[borrowed ? borrowedAt : translatedAt];

              expect(template, contains('{}'));

              final [before, after] = template.split('{}');

              expect(
                place.startsWith(before) && place.endsWith(after),
                isTrue,
                reason: '$template $place',
              );

              if (detail.language == code) {
                expect(place, before + detail.name + after);
              }
            }
          }
        }
      }
    });

    test('writes a country’s kind translated and a district’s borrowed, unless told otherwise', () {
      final country = randFictionalCountry(
        language: {WordLanguage.ko},
        includeKind: true,
        count: sample,
      );
      final district = randFictionalDistrict(
        language: {WordLanguage.ko},
        includeKind: true,
        count: sample,
      );

      expect(country.any(RegExp(r'(왕국|제국|공화국|공국|연방)$').hasMatch), isTrue);
      expect(district.any(RegExp(r'(파크|베이|힐스|스퀘어|마켓)$').hasMatch), isTrue);
      expect(
        randFictionalCountry(
          language: {WordLanguage.ko},
          includeKind: true,
          kindStyle: FictionalKindStyle.borrowed,
          count: sample,
        ).any(RegExp(r' (킹덤|엠파이어|리퍼블릭)$').hasMatch),
        isTrue,
      );
      expect(
        randFictionalDistrict(
          language: {WordLanguage.ko},
          includeKind: true,
          kindStyle: FictionalKindStyle.translated,
          count: sample,
        ).any(RegExp(r' (공원|광장|시장)$|만$').hasMatch),
        isTrue,
      );
    });

    test('`includeKind` decides the kind, and leaving it null leaves it to chance', () {
      for (final generate in placeDetails.values) {
        for (final detail in generate(includeKind: false, count: sample)) {
          expect(detail.kind, isNull);
          expect(detail.place, detail.name);
        }

        for (final detail in generate(includeKind: true, count: sample)) {
          expect(detail.kind, isNotNull);
          expect(detail.place, isNot(detail.name));
        }

        final mixed = generate(count: 200);

        expect(mixed.any((detail) => detail.kind == null), isTrue);
        expect(mixed.any((detail) => detail.kind != null), isTrue);
      }
    });

    test('never writes a kind its name already says', () {
      for (final generate in placeDetails.values) {
        for (final detail in generate(language: {WordLanguage.en}, includeKind: true, count: 400)) {
          final code = detail.kind!.name;
          final said = code.endsWith('s') ? code.substring(0, code.length - 1) : code;

          expect(detail.name.toLowerCase(), isNot(contains(said)), reason: detail.place);
        }
      }
    });

    test('`startsWith` reads the name, not the kind in front of it', () {
      for (final generate in placeDetails.values) {
        for (final detail in generate(
          language: {WordLanguage.en},
          startsWith: 'E',
          includeKind: true,
          count: sample,
        )) {
          expect(detail.name, startsWith('E'), reason: detail.place);
        }

        for (final detail in generate(
          language: {WordLanguage.ko},
          startsWith: '에',
          count: sample,
        )) {
          expect(detail.name, startsWith('에'), reason: detail.place);
        }
      }
    });

    test('keeps to a length range the pools can meet', () {
      for (final MapEntry(key: level, value: generate) in places.entries) {
        for (final language in [
          WordLanguage.en,
          WordLanguage.ko,
          WordLanguage.es,
          WordLanguage.ru,
        ]) {
          for (final place in generate(
            language: {language},
            minLength: 8,
            maxLength: 14,
            count: sample,
          )) {
            expect(
              place.length,
              inInclusiveRange(8, 14),
              reason: '${level.name} ${language.name} $place',
            );
          }
        }
      }
    });

    test('`unique` never returns the same place twice', () {
      for (final generate in placeDetails.values) {
        final details = generate(
          language: {WordLanguage.en, WordLanguage.ja},
          unique: true,
          count: 300,
        );
        final keys = [for (final detail in details) detail.forms[WordLanguage.en]];

        expect(keys.toSet(), hasLength(keys.length));
      }
    });

    test('a seeded source draws the same places twice', () {
      for (final generate in places.values) {
        List<String> draw() => generate(count: 20, realism: RandRealism.mixed, random: Random(11));

        expect(draw(), draw());
      }
    });
  });

  group('Fictional datasets', () {
    test('spells every entry in all five scripts', () {
      for (final table in [
        fictionalGivenNames,
        fictionalSurnames,
        fictionalSyllables,
        fictionalPlaceEndings,
        fictionalCompounds,
        fictionalPlaces,
      ]) {
        for (final row in rows(table)) {
          expect(row.length, greaterThanOrEqualTo(5), reason: row.join(' | '));
        }

        for (final (:cells, :spelling) in spelledRows(table)) {
          expect(cells, isA<List<String>>());

          for (var at = 0; at < 5; at += 1) {
            expect(spelling[at], matches(spellingPattern[at]), reason: spelling.join(' | '));
          }
        }
      }
    });

    test('holds no name twice within a pool', () {
      final kept = pools();

      for (final pool in [
        kept.given[NameGender.male]!,
        kept.given[NameGender.female]!,
        kept.surnames,
        [for (final row in spelledRows(fictionalPlaces)) row.spelling],
      ]) {
        final latin = [for (final entry in pool) entry[latinScript]];
        final twice = [
          for (var i = 0; i < latin.length; i += 1)
            if (latin.indexOf(latin[i]) != i) latin[i],
        ];

        expect(twice, isEmpty);
      }
    });

    test('holds between a hundred and three hundred given names of each gender', () {
      final kept = pools();

      for (final gender in NameGender.values) {
        expect(kept.given[gender]!.length, inInclusiveRange(100, 300), reason: gender.name);
      }

      expect(kept.surnames.length, greaterThanOrEqualTo(100));
    });

    test('writes every kind on a level, in every language, with one place for the name', () {
      final kinds = rows(fictionalKinds);
      final codes = <String>[];

      for (final cells in kinds) {
        expect(cells, hasLength(15), reason: cells[0]);
        expect(['borrowed', 'translated'], contains(cells[2]), reason: cells[0]);
        expect(cells[1], matches(RegExp(r'^[nrcd]+$')), reason: cells[0]);

        for (final template in cells.sublist(3)) {
          expect(template.split('{}'), hasLength(2), reason: '${cells[0]} $template');
        }

        codes.add(cells[0]);
      }

      expect(codes.toSet(), hasLength(codes.length));
      // The enum is the table's codes, in the table's order.
      expect(codes, [for (final kind in FictionalPlaceKind.values) kind.name]);

      for (final letter in 'nrcd'.split('')) {
        expect(
          kinds.where((cells) => cells[1].contains(letter)).length,
          greaterThanOrEqualTo(10),
          reason: letter,
        );
      }
    });

    test('offers every level a hundred names or more, with the ones it invents', () {
      final counts = <String, int>{'n': 0, 'r': 0, 'c': 0, 'd': pools().surnames.length};

      for (final (:cells, spelling: _) in spelledRows(fictionalPlaces)) {
        for (final letter in cells[0].split('')) {
          counts[letter] = counts[letter]! + 1;
        }
      }

      expect(counts['n'], greaterThanOrEqualTo(100), reason: 'country');
      expect(counts['r'], greaterThanOrEqualTo(100), reason: 'region');
      expect(counts['c'], greaterThanOrEqualTo(90), reason: 'city');
      expect(counts['d'], greaterThanOrEqualTo(100), reason: 'district');
    });

    test('the chances are percentages for every level', () {
      for (final level in LocationLevel.values) {
        expect(fictionalKindChance[level], inInclusiveRange(0, 100), reason: level.name);
        expect(fictionalSyllableChance[level], inInclusiveRange(0, 100), reason: level.name);
      }

      expect(fictionalMiddleChance, inInclusiveRange(0, 100));
    });

    test('spells a joined word the way each script spells it', () {
      Spelling join(List<String> latin) {
        final kept = pools();
        final all = [
          ...kept.heads,
          ...kept.middles,
          ...kept.ends[NameGender.male]!,
          ...kept.ends[NameGender.female]!,
        ];

        return joinParts([
          for (final part in latin) all.firstWhere((entry) => entry[latinScript] == part),
        ]);
      }

      expect(join(['ed', 'lyn']), ['Edlyn', '에들린', 'エドリン', '埃德琳', 'Эдлин']);
      expect(join(['a', 'lia']), ['Alia', '알리아', 'アリア', '阿莉娅', 'Алия']);
      expect(join(['va', 'le', 'ria']), ['Valeria', '발레리아', 'ヴァレリア', '瓦莱莉娅', 'Валерия']);
      // An `r` is one `ㄹ` and an `l` two.
      expect(join(['is', 'ra'])[hangulScript], '이스라');
      expect(join(['is', 'lia'])[hangulScript], '이슬리아');
      expect(joinable('kal', 'lis'), isFalse);
      expect(joinable('ash', 'ley'), isFalse);
    });

    test('an invented word is never one the datasets keep out', () {
      // The JavaScript suite walks every word the shapes can make; this samples
      // them, to check that `compose` reads the lists the way it does there.
      final avoid = {for (final word in words(fictionalAvoid)) word.toLowerCase()};
      final inside = words(fictionalAvoidInside);
      for (var i = 0; i < 2000; i += 1) {
        for (final word in [
          makeGiven(NameGender.female, latinScript, '', null),
          makeGiven(NameGender.male, latinScript, '', null),
          makeCompound('s', latinScript, '', null),
        ]) {
          if (word == null) continue;

          expect(avoid, isNot(contains(word[latinScript].toLowerCase())));

          for (final spelling in word) {
            for (final run in inside) {
              expect(spelling.toLowerCase(), isNot(contains(run)), reason: word.join(' | '));
            }
          }
        }
      }
    });
  });
}
