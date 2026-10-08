import 'dart:math';

import 'package:randino/src/phone/phone_generator.dart';
import 'package:randino/src/types.dart';

/// Generate phone numbers, written the way their country writes them.
///
/// Each number opens on a block the country's numbering plan gives out — a
/// mobile block, or the area code of a real city — and the digits after it are
/// random. That is what makes it look like a real number, and it is also why
/// it can be one: a drawn number may belong to somebody. Use the numbers as
/// sample data, and never call or text one.
///
/// [fictional] keeps to the numbers a country sets aside for films and books,
/// which no subscriber is ever given: `555-0100` to `555-0199` in the United
/// States, the Bundesnetzagentur's drama numbers in Germany. The other seven
/// countries reserve none, so naming one of them returns nothing rather than
/// real numbers, and a null [country] narrows to the two that do.
///
/// A null [country] mixes all nine. [type] defaults to `PhoneType.mobile`, and
/// a null [type] draws a mobile number or a landline per result.
/// [includeCountryCode] writes the international form, dropping the trunk
/// prefix the country dials at home, and [separator] replaces the country's own
/// punctuation: `''` writes the digits alone, which with [includeCountryCode]
/// is E.164.
///
/// ```dart
/// randPhone(country: PhoneCountry.kr); // [010-4821-3967]
/// randPhone(country: PhoneCountry.us, count: 2); // [(415) 726-0193, (917) 384-5520]
/// randPhone(country: PhoneCountry.kr, includeCountryCode: true); // [+82 10-4821-3967]
/// randPhone(country: PhoneCountry.kr, includeCountryCode: true, separator: ''); // [+821048213967]
/// randPhone(country: PhoneCountry.us, fictional: true); // [(415) 555-0147]
/// ```
List<String> randPhone({
  PhoneCountry? country,
  PhoneType? type = PhoneType.mobile,
  int count = 1,
  bool includeCountryCode = false,
  String? separator,
  bool fictional = false,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generatePhoneDetails(
    country: country,
    type: type,
    count: count,
    includeCountryCode: includeCountryCode,
    separator: separator,
    fictional: fictional,
    unique: unique,
    random: random,
  ))
    detail.phone,
];
