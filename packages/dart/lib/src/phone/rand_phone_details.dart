import 'dart:math';

import 'package:randino/src/phone/phone_generator.dart';
import 'package:randino/src/types.dart';

/// [randPhone], along with each number's country, type and E.164 form.
///
/// A drawn number may belong to somebody, the same as with [randPhone]: use it
/// as sample data, never call or text one, and pass [fictional] for numbers
/// kept out of service.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randPhoneDetails(country: PhoneCountry.jp).first;
/// // PhoneDetail(090-3718-2046, +819037182046, JP, mobile)
/// ```
List<PhoneDetail> randPhoneDetails({
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
}) => generatePhoneDetails(
  country: country,
  type: type,
  count: count,
  includeCountryCode: includeCountryCode,
  separator: separator,
  fictional: fictional,
  unique: unique,
  random: random,
);
