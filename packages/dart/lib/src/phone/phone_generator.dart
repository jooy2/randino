// The phone number generator: a block the country's numbering plan gives out,
// the digits after it, and the number written the way the country writes one.
//
// What is drawn and how it is written are kept apart. A number is its groups
// of digits, and the national form, the international form and E.164 are three
// ways of writing the same groups — which is why a separator can replace the
// country's own punctuation without the number changing underneath it.

import 'dart:math';

import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/phone/data/index.dart';
import 'package:randino/src/phone/data/types.dart';
import 'package:randino/src/types.dart';

// A group that keeps landing on an avoided value is given up on after this
// many draws. Nine values out of eight hundred never get close to it.
const int _avoidAttempts = 20;

/// [pattern] with every `x`, `n` and `N` replaced by a digit it allows.
String _fill(String pattern) {
  final buffer = StringBuffer();

  for (final mark in pattern.split('')) {
    buffer.write(switch (mark) {
      'x' => randInt(0, 9),
      'n' => randInt(1, 9),
      'N' => randInt(2, 9),
      _ => mark,
    });
  }

  return buffer.toString();
}

/// How many first groups [shape] can write: its prefixes, times what its lead
/// can add.
int _openings(PhoneShape shape) {
  var span = shape.prefixes.length;

  for (final mark in shape.lead.split('')) {
    span *= switch (mark) {
      'x' => 10,
      'n' => 9,
      'N' => 8,
      _ => 1,
    };
  }

  return span;
}

/// A group drawn from [pattern], never one of the values in [avoid].
String _drawGroup(String pattern, List<String> avoid) {
  var group = _fill(pattern);

  for (var attempt = 1; avoid.contains(group) && attempt < _avoidAttempts; attempt += 1) {
    group = _fill(pattern);
  }

  return group;
}

/// [template] with its trunk and its groups put in, in order.
String _writeTemplate(String template, String trunk, List<String> groups) {
  var next = 0;

  return template.replaceAllMapped(
    RegExp('[T#]'),
    (match) => match.group(0) == 'T' ? trunk : groups[next++],
  );
}

/// The national form's groups, joined by the caller's separator rather than
/// by the country's punctuation. The trunk goes where the country's own
/// template puts it: attached to the first group (`010`), or a group of its
/// own (`8`).
String _joinNational(String template, String trunk, List<String> groups, String separator) {
  if (trunk.isEmpty) return groups.join(separator);

  return template.contains('T#')
      ? <String>['$trunk${groups.first}', ...groups.skip(1)].join(separator)
      : <String>[trunk, ...groups].join(separator);
}

String _write(
  PhoneCountryData data,
  String trunk,
  List<String> groups, {
  required bool includeCountryCode,
  required String? separator,
}) {
  if (includeCountryCode) {
    return separator == null
        ? '+${data.callingCode} ${_writeTemplate(data.international, '', groups)}'
        : '+${data.callingCode}$separator${groups.join(separator)}';
  }

  return separator == null
      ? _writeTemplate(data.national, trunk, groups)
      : _joinNational(data.national, trunk, groups, separator);
}

/// What `randPhone` and `randPhoneDetails` both do.
List<PhoneDetail> generatePhoneDetails({
  PhoneCountry? country,
  PhoneType? type = PhoneType.mobile,
  int count = 1,
  bool includeCountryCode = false,
  String? separator,
  bool fictional = false,
  bool unique = false,
  Random? random,
}) {
  // A country that reserves no numbers for fiction can only answer with real
  // ones, so asking it for fiction is asking for nothing.
  final countries = <PhoneCountry>[
    for (final code in country == null ? phoneCountries : <PhoneCountry>[country])
      if (!fictional || phoneData[code]!.fiction != null) code,
  ];

  if (countries.isEmpty) return <PhoneDetail>[];

  return withRandom(
    random,
    () => collect<PhoneDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      draw: () {
        final code = pick(countries);
        final PhoneType kind = type ?? pick(phoneTypes);
        final data = phoneData[code]!;
        // Every opening the plan can write is as likely as any other, so a shape
        // listing sixteen area codes comes up sixteen times as often as one listing
        // one, and Spain's `6xx` ten times as often as its `71x`.
        final plans = fictional ? data.fiction ?? data.plans : data.plans;
        final shape = pickWeighted(plans[kind]!, _openings);
        final groups = <String>[
          pick(shape.prefixes) + _fill(shape.lead),
          for (final pattern in shape.groups) _drawGroup(pattern, shape.avoid),
        ];

        return PhoneDetail(
          phone: _write(
            data,
            shape.trunk ?? data.trunk,
            groups,
            includeCountryCode: includeCountryCode,
            separator: separator,
          ),
          e164: '+${data.callingCode}${groups.join()}',
          country: code,
          callingCode: data.callingCode,
          type: kind,
        );
      },
      keyOf: (detail) => detail.phone,
    ),
  );
}
