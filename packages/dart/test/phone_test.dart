import 'package:randino/randino.dart';
// Internal, but it is what every number is checked against.
import 'package:randino/src/phone/data/index.dart';
import 'package:randino/src/phone/data/types.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 3000;

// How each country writes a number for itself, by the shape of the string.
final Map<PhoneCountry, RegExp> national = <PhoneCountry, RegExp>{
  PhoneCountry.us: RegExp(r'^\(\d{3}\) \d{3}-\d{4}$'),
  PhoneCountry.kr: RegExp(r'^0\d{1,2}-\d{3,4}-\d{4}$'),
  PhoneCountry.jp: RegExp(r'^0\d{1,2}-\d{3,4}-\d{4}$'),
  PhoneCountry.cn: RegExp(r'^(1\d{2}|0\d{2,3}) \d{4} \d{4}$'),
  PhoneCountry.vn: RegExp(r'^0\d{2,3} \d{3,4} \d{4}$'),
  PhoneCountry.es: RegExp(r'^[6-9]\d{2} \d{2} \d{2} \d{2}$'),
  PhoneCountry.it: RegExp(r'^(3\d{2}|0\d{1,2}) \d{3,4} \d{4}$'),
  PhoneCountry.de: RegExp(r'^0\d{2,3} \d{7,8}$'),
  PhoneCountry.ru: RegExp(r'^8 \(\d{3}\) \d{3}-\d{2}-\d{2}$'),
};

// How each country writes a number for the world.
final Map<PhoneCountry, RegExp> international = <PhoneCountry, RegExp>{
  PhoneCountry.us: RegExp(r'^\+1 \d{3}-\d{3}-\d{4}$'),
  PhoneCountry.kr: RegExp(r'^\+82 \d{1,2}-\d{3,4}-\d{4}$'),
  PhoneCountry.jp: RegExp(r'^\+81 \d{1,2}-\d{3,4}-\d{4}$'),
  PhoneCountry.cn: RegExp(r'^\+86 \d{2,3} \d{4} \d{4}$'),
  PhoneCountry.vn: RegExp(r'^\+84 \d{2,3} \d{3,4} \d{4}$'),
  PhoneCountry.es: RegExp(r'^\+34 \d{3} \d{2} \d{2} \d{2}$'),
  // Italy keeps a landline's `0`, because it is part of the number.
  PhoneCountry.it: RegExp(r'^\+39 [03]\d{1,2} \d{3,4} \d{4}$'),
  PhoneCountry.de: RegExp(r'^\+49 [1-9]\d{1,2} \d{7,8}$'),
  PhoneCountry.ru: RegExp(r'^\+7 \d{3} \d{3}-\d{2}-\d{2}$'),
};

// How many digits follow the calling code: the national significant number.
const Map<PhoneCountry, (int, int)> digits = <PhoneCountry, (int, int)>{
  PhoneCountry.us: (10, 10),
  PhoneCountry.kr: (8, 10),
  PhoneCountry.jp: (9, 10),
  PhoneCountry.cn: (10, 11),
  PhoneCountry.vn: (9, 10),
  PhoneCountry.es: (9, 9),
  PhoneCountry.it: (10, 10),
  PhoneCountry.de: (10, 11),
  PhoneCountry.ru: (10, 10),
};

/// The digits after the calling code.
String significant(PhoneDetail detail) => detail.e164.substring(1 + detail.callingCode.length);

/// Whether the number opens on a prefix its country's plan lists for its type.
bool opensOnItsPlan(PhoneDetail detail) => phoneData[detail.country]!.plans[detail.type]!.any(
  (shape) => shape.prefixes.any((prefix) => significant(detail).startsWith(prefix)),
);

List<PhoneDetail> draw(
  PhoneCountry country,
  PhoneType type, {
  bool includeCountryCode = false,
  String? separator,
}) => randPhoneDetails(
  country: country,
  type: type,
  count: sample,
  includeCountryCode: includeCountryCode,
  separator: separator,
);

void main() {
  group('Phone', () {
    test('randPhone returns one number by default', () {
      expect(randPhone(), hasLength(1));
    });

    test('returns exactly `count` numbers', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randPhone(count: count), hasLength(count));
      }

      expect(randPhone(count: -3), isEmpty);
      expect(randPhone(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every country writes its own national form', () {
      for (final country in phoneCountries) {
        for (final type in phoneTypes) {
          for (final detail in draw(country, type)) {
            expect(
              detail.phone,
              matches(national[country]!),
              reason: '${country.code} ${type.name}',
            );
            expect(detail.country, country);
            expect(detail.type, type);
          }
        }
      }
    });

    test('every number opens on a block its plan gives out, and is as long as the plan says', () {
      for (final country in phoneCountries) {
        final (low, high) = digits[country]!;

        for (final type in phoneTypes) {
          for (final detail in draw(country, type)) {
            expect(opensOnItsPlan(detail), isTrue, reason: detail.e164);
            expect(detail.e164, matches(RegExp(r'^\+\d+$')));
            expect(significant(detail).length, inInclusiveRange(low, high), reason: detail.e164);
          }
        }
      }
    });

    test('the national form is the trunk prefix and the same digits as E.164', () {
      for (final country in phoneCountries) {
        final data = phoneData[country]!;

        for (final type in phoneTypes) {
          final trunks = <String?>{data.trunk, for (final shape in data.plans[type]!) shape.trunk};

          for (final detail in draw(country, type)) {
            final written = detail.phone.replaceAll(RegExp(r'\D'), '');
            final rest = significant(detail);

            expect(written.endsWith(rest), isTrue, reason: detail.phone);
            expect(trunks, contains(written.substring(0, written.length - rest.length)));
          }
        }
      }

      // A Chinese mobile number is dialled without the `0` a landline takes.
      for (final detail in draw(PhoneCountry.cn, PhoneType.mobile)) {
        expect(detail.phone, startsWith('1'));
      }
    });

    test('includeCountryCode writes the international form, without the trunk prefix', () {
      for (final country in phoneCountries) {
        for (final type in phoneTypes) {
          for (final detail in draw(country, type, includeCountryCode: true)) {
            expect(detail.phone, matches(international[country]!), reason: country.code);
            expect(detail.phone.replaceAll(RegExp(r'[^\d+]'), ''), detail.e164);
          }
        }
      }
    });

    test('separator replaces the punctuation, and nothing else', () {
      for (final country in phoneCountries) {
        for (final detail in draw(country, PhoneType.landline, separator: '')) {
          expect(detail.phone, matches(RegExp(r'^\d+$')));
          expect(detail.phone.endsWith(significant(detail)), isTrue);
        }

        for (final detail in draw(
          country,
          PhoneType.mobile,
          separator: '',
          includeCountryCode: true,
        )) {
          expect(detail.phone, detail.e164);
        }

        for (final detail in draw(country, PhoneType.mobile, separator: '.')) {
          expect(detail.phone, matches(RegExp(r'^\d+(\.\d+)+$')));
        }
      }

      // The trunk goes where the country writes it: on the first group in
      // Korea, a group of its own in Russia.
      expect(
        randPhone(country: PhoneCountry.kr, separator: '-').single,
        matches(RegExp(r'^010-\d{4}-\d{4}$')),
      );
      expect(
        randPhone(country: PhoneCountry.ru, separator: '-').single,
        matches(RegExp(r'^8-9\d{2}-\d{3}-\d{2}-\d{2}$')),
      );
      expect(
        randPhone(country: PhoneCountry.kr, separator: '-', includeCountryCode: true).single,
        matches(RegExp(r'^\+82-10-\d{4}-\d{4}$')),
      );
    });

    test('a US exchange is never a service code or 555', () {
      for (final detail in randPhoneDetails(country: PhoneCountry.us, count: large)) {
        final exchange = significant(detail).substring(3, 6);

        expect(exchange, isNot(matches(RegExp(r'^[2-9]11$'))));
        expect(exchange, isNot('555'));
        expect(exchange, matches(RegExp(r'^[2-9]')));
      }
    });

    test('a Korean mobile number opens its exchange on 2 to 9', () {
      for (final phone in randPhone(country: PhoneCountry.kr, count: large)) {
        expect(phone, matches(RegExp(r'^010-[2-9]')));
      }
    });

    test('mobile is the default, and a null type draws both', () {
      expect(
        randPhoneDetails(count: sample).every((detail) => detail.type == PhoneType.mobile),
        isTrue,
      );
      expect(
        randPhoneDetails(type: null, count: sample).map((detail) => detail.type).toSet(),
        phoneTypes.toSet(),
      );
    });

    test('every country comes up when none is named', () {
      final countries = randPhoneDetails(count: large).map((detail) => detail.country).toSet();

      expect(countries, phoneCountries.toSet());
      expect(PhoneCountry.kr.code, 'KR');
    });

    test('unique never repeats a number', () {
      final phones = randPhone(country: PhoneCountry.kr, count: 500, unique: true);

      expect(phones, hasLength(500));
      expect(phones.toSet(), hasLength(500));
    });

    test('fictional keeps to the numbers a country sets aside for fiction', () {
      final reserved = <PhoneCountry, RegExp>{
        PhoneCountry.us: RegExp(r'^\(\d{3}\) 555-01\d{2}$'),
        // The Bundesnetzagentur's drama numbers, and the two mobile blocks.
        PhoneCountry.de: RegExp(
          r'^(030 23125\d{3}|040 66969\d{3}|069 90009\d{3}|089 99998\d{3}|0221 4710\d{3}'
          r'|0171 39200\d{2}|0176 040690\d{2})$',
        ),
      };

      for (final MapEntry(key: country, value: pattern) in reserved.entries) {
        for (final type in phoneTypes) {
          for (final detail in randPhoneDetails(
            country: country,
            type: type,
            fictional: true,
            count: sample,
          )) {
            expect(detail.phone, matches(pattern), reason: '${country.code} ${type.name}');
          }
        }
      }

      // A null country narrows to the two that reserve any.
      expect(
        randPhoneDetails(fictional: true, count: sample).map((detail) => detail.country).toSet(),
        <PhoneCountry>{PhoneCountry.us, PhoneCountry.de},
      );

      // A country that reserves none answers with nothing rather than real numbers.
      for (final country in phoneCountries.where((code) => phoneData[code]!.fiction == null)) {
        expect(randPhone(country: country, fictional: true, count: 5), isEmpty);
      }
    });

    test('every shape is one the templates can write', () {
      expect(phoneData.keys.toSet(), PhoneCountry.values.toSet());

      for (final country in phoneCountries) {
        final data = phoneData[country]!;
        int marks(String template) => '#'.allMatches(template).length;

        expect(data.international, isNot(contains('T')));

        for (final type in phoneTypes) {
          expect(data.plans[type], isNotEmpty);

          for (final shape in <PhoneShape>[...data.plans[type]!, ...?data.fiction?[type]]) {
            // The first group is the prefix, and each pattern is one group more.
            expect(marks(data.national), shape.groups.length + 1);
            expect(marks(data.international), shape.groups.length + 1);
            expect(shape.prefixes.every((prefix) => RegExp(r'^\d+$').hasMatch(prefix)), isTrue);
            expect(shape.prefixes.toSet(), hasLength(shape.prefixes.length));
          }
        }
      }
    });
  });
}
