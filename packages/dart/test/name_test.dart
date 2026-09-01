import 'package:randino/randino.dart';
// Internal, so they get their own checks: everything else about a generated name
// is random, but romanization is a pure function with known answers, and the
// pools are what the tests below hold the generator to.
import 'package:randino/src/name/data/index.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/name/romanize.dart';
import 'package:test/test.dart';

// Output is random by definition, so the tests assert the properties every name
// must have — script, structure, length, requested prefix — over a sample large
// enough that a broken option cannot pass by luck.
const int sample = 60;

// A name may be a single part or several joined by a single space.
RegExp joined(String part) => RegExp('^$part+( $part+)*\$', unicode: true);

final Map<NameLanguage, RegExp> script = <NameLanguage, RegExp>{
  NameLanguage.en: joined('[A-Za-z]'),
  NameLanguage.ko: RegExp(r'^[가-힣]+$'),
  NameLanguage.ja: RegExp(r'^[々぀-ヿ一-鿿]+$'),
  NameLanguage.zh: RegExp(r'^[々一-鿿]+$'),
  NameLanguage.it: joined(r'\p{Script=Latin}'),
  NameLanguage.de: joined(r'\p{Script=Latin}'),
  NameLanguage.ru: joined(r'\p{Script=Cyrillic}'),
  NameLanguage.es: joined(r'\p{Script=Latin}'),
  NameLanguage.vi: joined(r'\p{Script=Latin}'),
};

final RegExp roman = joined('[A-Za-z]');

/// The CJK surname a name starts with, longest first so 山田 wins over 山.
String surnameOf(NameLanguage language, String name) {
  final pool =
      nameData[language]!.last.map((entry) => entry.n).toList()
        ..sort((left, right) => right.length - left.length);

  return pool.firstWhere(name.startsWith, orElse: () => '');
}

void main() {
  group('Name', () {
    test('randomName returns one name by default', () {
      final names = randomName();

      expect(names.length, 1);
      expect(names[0], isNotEmpty);
    });

    test('randomName returns exactly `count` names', () {
      expect(randomName(count: 25).length, 25);
      expect(randomName(count: 1).length, 1);
      // Out-of-range counts are clamped rather than rejected.
      expect(randomName(count: 0).length, 0);
      expect(randomName(count: -10).length, 0);
      expect(randomName(count: nameCountMax + 500).length, nameCountMax);
    });

    test('every language writes names in its own script', () {
      for (final language in nameLanguages) {
        for (final name in randomName(language: language, count: sample)) {
          expect(name, matches(script[language]!), reason: '${language.name}: $name');
        }
      }
    });

    test('the mixed language uses every language it knows', () {
      final used = <NameLanguage>{};

      for (final detail in randomNameDetails(count: 600)) {
        expect(detail.native, matches(script[detail.language]!), reason: detail.native);
        used.add(detail.language);
      }

      expect(used.length, nameLanguages.length);
    });

    test('script: roman romanizes every language into ASCII', () {
      for (final language in nameLanguages) {
        for (final name in randomName(
          language: language,
          count: sample,
          script: NameScript.roman,
        )) {
          expect(name, matches(roman), reason: '${language.name}: $name');
        }
      }
    });

    test('script: roman leaves English names as they are', () {
      for (final detail in randomNameDetails(language: NameLanguage.en, count: sample)) {
        expect(detail.roman, detail.native);
      }

      expect(nameSupportsRoman(NameLanguage.en), isFalse);
      expect(nameSupportsRoman(NameLanguage.ko), isTrue);
    });

    test('Korean surnames use their conventional romanization', () {
      for (final detail in randomNameDetails(
        language: NameLanguage.ko,
        count: sample,
        startsWith: '김',
      )) {
        expect(detail.native, startsWith('김'));
        expect(detail.roman, startsWith('Kim '));
      }
    });

    test('includeSurname adds or drops the family name', () {
      // A generous length range keeps the generator from padding the name with
      // extra parts to reach a minimum length, which is what is being counted.
      for (final name in randomName(
        language: NameLanguage.en,
        minLength: 1,
        maxLength: 30,
        count: sample,
      )) {
        expect(name.split(' ').length, 2, reason: name);
      }

      for (final name in randomName(
        language: NameLanguage.en,
        minLength: 1,
        maxLength: 30,
        count: sample,
        includeSurname: false,
      )) {
        expect(name.split(' ').length, 1, reason: name);
      }

      // Korean keeps its own default range: one syllable of surname plus two of
      // given name.
      for (final name in randomName(language: NameLanguage.ko, count: sample)) {
        expect(name.length, 3, reason: name);
      }

      for (final name in randomName(
        language: NameLanguage.ko,
        count: sample,
        includeSurname: false,
      )) {
        expect(name.length, 2, reason: name);
      }
    });

    test('includeMiddleName adds a middle name where the language has one', () {
      for (final name in randomName(
        language: NameLanguage.en,
        count: sample,
        includeMiddleName: true,
        minLength: 1,
        maxLength: 30,
      )) {
        expect(name.split(' ').length, 3, reason: name);
      }

      // Korean, Japanese and Chinese names have no middle part, so the option is
      // ignored instead of inventing one.
      expect(nameSupportsMiddleName(NameLanguage.ko), isFalse);
      expect(nameSupportsMiddleName(NameLanguage.en), isTrue);

      for (final name in randomName(
        language: NameLanguage.ko,
        count: sample,
        includeMiddleName: true,
      )) {
        expect(name.length, 3, reason: name);
      }
    });

    test('gender picks the pools the name is drawn from', () {
      // Russian is the one language whose middle name and surname are inflected
      // for gender, which makes the choice verifiable.
      for (final name in randomName(
        language: NameLanguage.ru,
        minLength: 1,
        maxLength: 40,
        count: sample,
        gender: NameGender.male,
        includeMiddleName: true,
      )) {
        expect(name.split(' ')[1], endsWith('ич'), reason: name);
      }

      for (final name in randomName(
        language: NameLanguage.ru,
        minLength: 1,
        maxLength: 40,
        count: sample,
        gender: NameGender.female,
        includeMiddleName: true,
      )) {
        final parts = name.split(' ');

        expect(parts[1], endsWith('на'), reason: name);
        expect(parts[2], endsWith('а'), reason: name);
      }

      final genders =
          randomNameDetails(
            language: NameLanguage.ru,
            minLength: 1,
            maxLength: 40,
            count: 200,
          ).map((detail) => detail.gender).toSet();

      expect(genders, <NameGender>{NameGender.male, NameGender.female});

      for (final detail in randomNameDetails(
        language: NameLanguage.ru,
        minLength: 1,
        maxLength: 40,
        count: sample,
        gender: NameGender.female,
      )) {
        expect(detail.gender, NameGender.female);
      }
    });

    test('names stay inside the requested length range', () {
      const ranges = <(NameLanguage, int, int)>[
        (NameLanguage.ko, 3, 3),
        (NameLanguage.ko, 2, 2),
        (NameLanguage.ko, 5, 8),
        (NameLanguage.ja, 3, 5),
        (NameLanguage.zh, 2, 3),
        (NameLanguage.en, 8, 16),
        (NameLanguage.en, 20, 25),
        (NameLanguage.ru, 12, 20),
        (NameLanguage.vi, 5, 13),
      ];

      for (final (language, minLength, maxLength) in ranges) {
        for (final name in randomName(
          language: language,
          minLength: minLength,
          maxLength: maxLength,
          count: sample,
        )) {
          expect(
            name.length,
            inInclusiveRange(minLength, maxLength),
            reason: '${language.name} $minLength-$maxLength: $name',
          );
        }
      }
    });

    test('omitted length bounds fall back to the language default', () {
      expect(nameLengthRange(language: NameLanguage.ko), const LengthRange(3, 3));
      expect(
        nameLengthRange(language: NameLanguage.ko, includeSurname: false),
        const LengthRange(2, 2),
      );
      expect(nameLengthRange(language: NameLanguage.en), const LengthRange(8, 16));
      expect(
        nameLengthRange(language: NameLanguage.en, includeSurname: false),
        const LengthRange(4, 8),
      );
      expect(
        nameLengthRange(language: NameLanguage.en, includeMiddleName: true),
        const LengthRange(12, 24),
      );
      // A middle name the language does not have cannot widen the range.
      expect(
        nameLengthRange(language: NameLanguage.ko, includeMiddleName: true),
        const LengthRange(3, 3),
      );

      for (final language in nameLanguages) {
        final range = nameLengthRange(language: language);

        for (final name in randomName(language: language, count: sample)) {
          expect(
            name.length,
            inInclusiveRange(range.min, range.max),
            reason: '${language.name}: $name',
          );
        }
      }
    });

    test('startsWith leads every name with the requested character', () {
      for (final name in randomName(language: NameLanguage.en, count: sample, startsWith: 'k')) {
        expect(name, matches(RegExp('^[Kk]')), reason: name);
      }

      for (final name in randomName(language: NameLanguage.ko, count: sample, startsWith: '김')) {
        expect(name, startsWith('김'), reason: name);
      }

      // The character leads the given name when there is no surname to lead with.
      for (final name in randomName(
        language: NameLanguage.ko,
        count: sample,
        includeSurname: false,
        startsWith: '김',
      )) {
        expect(name, startsWith('김'), reason: name);
      }

      // A letter no real name starts with is answered with an invented name
      // rather than an empty result.
      for (final name in randomName(language: NameLanguage.en, count: sample, startsWith: 'Q')) {
        expect(name, startsWith('Q'), reason: name);
        expect(name, matches(roman), reason: name);
      }

      // Only the first character of a longer string is used.
      for (final name in randomName(language: NameLanguage.en, count: 10, startsWith: 'Beck')) {
        expect(name, startsWith('B'), reason: name);
      }
    });

    test('style invents names without breaking the script or the structure', () {
      for (final style in <int>[0, 50, 100, -20, 500]) {
        for (final language in nameLanguages) {
          for (final name in randomName(language: language, style: style, count: 20)) {
            expect(name, matches(script[language]!), reason: '${language.name} @ $style: $name');
          }
        }
      }

      // The abstract end should mostly leave the curated pools behind.
      final realistic = randomName(language: NameLanguage.en, style: 0, count: 400).toSet();
      final abstract = randomName(language: NameLanguage.en, style: 100, count: 100);
      final overlap = abstract.where(realistic.contains).length;

      expect(overlap, lessThan(10), reason: 'too many invented names look curated: $overlap');
    });

    test('style: 0 stays inside the curated pools', () {
      // The realistic end promises names people actually carry, so a rolled given
      // name length the pool cannot serve has to be re-rolled rather than invented.
      // Ranges here are ones the pools can satisfy; asking for a length no real
      // name has (a three-syllable Korean given name) is a different request.
      const cases = <(NameLanguage, int?, int?)>[
        (NameLanguage.ko, null, null),
        (NameLanguage.ko, 2, 5),
        (NameLanguage.ja, null, null),
        (NameLanguage.zh, null, null),
        (NameLanguage.zh, 2, 3),
      ];

      for (final (language, minLength, maxLength) in cases) {
        final data = nameData[language]!;
        final given = <String>{
          ...data.givenMale!.map((entry) => entry.n),
          ...data.givenFemale!.map((entry) => entry.n),
        };

        for (final name in randomName(
          language: language,
          style: 0,
          count: 300,
          minLength: minLength,
          maxLength: maxLength,
        )) {
          final surname = surnameOf(language, name);

          expect(surname, isNotEmpty, reason: '${language.name}: no curated surname leads $name');
          expect(
            given,
            contains(name.substring(surname.length)),
            reason: '${language.name} @ $minLength-$maxLength: $name is not a curated name',
          );
        }
      }
    });

    test('surnames follow the frequency table of the languages that have one', () {
      // A table entry that no longer matches the pool silently degrades to the
      // default weight, which reads as "the weighting stopped working".
      for (final language in nameLanguages) {
        final data = nameData[language]!;
        final table = data.lastWeights;

        if (table == null) {
          continue;
        }

        final pool = data.last.map((entry) => entry.n).toSet();

        for (final surname in table.keys) {
          expect(
            pool,
            contains(surname),
            reason: '${language.name}: $surname is weighted but not in the pool',
          );
        }
      }

      // Shares the table aims for: 김 ~23%, Nguyễn ~41%, 王 ~11%. The thresholds sit
      // far enough below to be unreachable by chance, and an even draw over the
      // pool (1.3% / 3.3% / 2.2%) cannot come near any of them.
      double share(NameLanguage language, String surname) {
        final names = randomName(language: language, style: 0, count: 2000);

        return names.where((name) => name.startsWith(surname)).length / names.length;
      }

      expect(
        share(NameLanguage.ko, '김'),
        greaterThan(0.12),
        reason: 'Korean surnames are not weighted',
      );
      expect(
        share(NameLanguage.vi, 'Nguyễn'),
        greaterThan(0.25),
        reason: 'Vietnamese surnames are not weighted',
      );
      expect(
        share(NameLanguage.zh, '王'),
        greaterThan(0.05),
        reason: 'Chinese surnames are not weighted',
      );
    });

    test('unique never repeats a name', () {
      final names = randomName(language: NameLanguage.ko, count: 400, unique: true);

      expect(names.toSet().length, names.length);
      // Korean given names are a closed pool, so a request this large runs out of
      // combinations and returns fewer names instead of looping forever. Keep the
      // count comfortably above the pool, or growing the pool turns this into a
      // failure that reads like a bug in `unique`.
      final limited = randomName(
        language: NameLanguage.ko,
        count: 800,
        unique: true,
        includeSurname: false,
      );

      expect(limited.toSet().length, limited.length);
      expect(
        limited.length,
        lessThan(800),
        reason: 'expected the pool to run out: ${limited.length}',
      );
    });

    test('randomNameDetails reports both scripts and the choices made', () {
      for (final detail in randomNameDetails(language: NameLanguage.ja, count: sample)) {
        expect(detail.language, NameLanguage.ja);
        expect(detail.native, matches(script[NameLanguage.ja]!), reason: detail.native);
        expect(detail.roman, matches(roman), reason: detail.roman);
        expect(NameGender.values, contains(detail.gender));
      }
    });

    test('romanizeHangul follows the Revised Romanization of Korean', () {
      const cases = <(String, String)>[
        ('민준', 'minjun'),
        ('서연', 'seoyeon'),
        ('하은', 'haeun'),
        ('한결', 'hangyeol'),
        ('지훈', 'jihun'),
        ('슬기', 'seulgi'),
        ('별', 'byeol'),
        ('다온', 'daon'),
        ('하람', 'haram'),
        ('광수', 'gwangsu'),
        ('혜진', 'hyejin'),
        ('아름', 'areum'),
        ('하늘', 'haneul'),
        ('채원', 'chaewon'),
        ('지율', 'jiyul'),
        ('영희', 'yeonghui'),
        // A final consonant in front of a vowel moves into the next syllable.
        ('은우', 'eunu'),
        ('백은', 'baegeun'),
        // Sound changes between syllables.
        ('석민', 'seongmin'),
        ('성록', 'seongnok'),
        ('슬나', 'seulla'),
        ('좋고', 'joko'),
        // Anything that is not a composed syllable is passed through.
        ('Kim 민준', 'Kim minjun'),
      ];

      for (final (hangul, expected) in cases) {
        expect(romanizeHangul(hangul), expected, reason: hangul);
      }
    });

    test('the fold table covers every Latin-script pool', () {
      // Dart has no Unicode normalization, so `fold` is a written-out table
      // rather than an NFD strip — which means a character nobody listed passes
      // through as itself and lands in a supposedly-ASCII romanization. This is
      // the check that catches that, and it is the reason the table covers more
      // than the pools currently hold.
      final ascii = RegExp(r'^[\x20-\x7E]*$');

      for (final language in nameLanguages) {
        final data = nameData[language]!;

        if (data.roman != RomanMode.fold) {
          continue;
        }

        final pools = <NamePool?>[
          data.male,
          data.female,
          data.last,
          data.middleMale,
          data.middleFemale,
        ];

        for (final entries in pools.whereType<NamePool>()) {
          for (final entry in entries) {
            expect(
              fold(entry.n),
              matches(ascii),
              reason: '${language.name}: ${entry.n} folds to ${fold(entry.n)}',
            );
          }
        }
      }
    });
  });
}
