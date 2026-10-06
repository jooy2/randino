import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a label is checked against.
import 'package:randino/src/gender/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;

// Large enough that a share of one in a hundred shows up and stays well inside
// a band, so the weights can be asserted with room to spare rather than by luck.
const int large = 10000;

/// How many of [details] carry each code, as a share of all of them in percent.
Map<GenderCode, double> shares(List<GenderDetail> details) => <GenderCode, double>{
  for (final code in genderCodes)
    code: 100 * details.where((detail) => detail.code == code).length / details.length,
};

void main() {
  group('Gender', () {
    test('randGender returns one label by default', () {
      expect(randGender(), hasLength(1));
    });

    test('returns exactly `count` genders', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randGender(count: count), hasLength(count));
      }

      expect(randGender(count: -3), isEmpty);
      expect(randGender(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every language labels every code, and no two codes alike', () {
      expect(genderLabels.keys.toSet(), WordLanguage.values.toSet());

      for (final language in WordLanguage.values) {
        final labels = <String>[for (final code in genderCodes) genderLabels[language]![code]!];

        expect(labels.every((label) => label.trim().isNotEmpty), isTrue, reason: language.name);
        expect(
          labels.toSet(),
          hasLength(labels.length),
          reason: '${language.name} repeats a label',
        );
      }
    });

    test('a label is the one its language writes for its code', () {
      for (final language in WordLanguage.values) {
        for (final detail in randGenderDetails(
          language: language,
          includeUnknown: true,
          includeNonbinary: true,
          count: sample,
        )) {
          expect(detail.language, language);
          expect(detail.gender, genderLabels[language]![detail.code]);
        }
      }

      expect(randGender(language: WordLanguage.ko, count: sample).toSet(), <String>{'남성', '여성'});
    });

    test('the value form is the label of each detail', () {
      expect(
        randGender(includeUnknown: true, includeNonbinary: true, count: sample, random: Random(7)),
        <String>[
          for (final detail in randGenderDetails(
            includeUnknown: true,
            includeNonbinary: true,
            count: sample,
            random: Random(7),
          ))
            detail.gender,
        ],
      );
    });

    test('male and female alone, until the other two are asked for', () {
      Set<GenderCode> codes({bool includeUnknown = false, bool includeNonbinary = false}) => {
        for (final detail in randGenderDetails(
          includeUnknown: includeUnknown,
          includeNonbinary: includeNonbinary,
          count: large,
        ))
          detail.code,
      };

      expect(codes(), <GenderCode>{GenderCode.male, GenderCode.female});
      expect(codes(includeUnknown: true), <GenderCode>{
        GenderCode.male,
        GenderCode.female,
        GenderCode.unknown,
      });
      expect(codes(includeNonbinary: true), <GenderCode>{
        GenderCode.male,
        GenderCode.female,
        GenderCode.nonbinary,
      });
      expect(codes(includeUnknown: true, includeNonbinary: true), hasLength(4));
    });

    test('male and female split evenly, unknown is uncommon and nonbinary rare', () {
      final share = shares(
        randGenderDetails(includeUnknown: true, includeNonbinary: true, count: large),
      );

      expect((share[GenderCode.male]! - share[GenderCode.female]!).abs(), lessThan(4));
      expect(share[GenderCode.unknown], inExclusiveRange(6, 12));
      expect(share[GenderCode.nonbinary], inExclusiveRange(0.4, 2));
      expect(genderWeights[GenderCode.male], genderWeights[GenderCode.female]);
    });

    test('a null language mixes every language', () {
      expect({
        for (final detail in randGenderDetails(count: sample * 5)) detail.language,
      }, hasLength(WordLanguage.values.length));
    });

    test('unique never repeats a label, and stops when the labels run out', () {
      final genders = randGender(
        language: WordLanguage.en,
        includeUnknown: true,
        unique: true,
        count: 10,
      );

      expect(genders.toList()..sort(), <String>['Female', 'Male', 'Unknown']);
    });
  });
}
