// The shape of the phone dataset. Internal: nothing here is exported.

import 'package:randino/src/types.dart';

/// One way a country writes a number: what it opens on, and the groups of
/// digits after that.
///
/// A digit in a pattern is written as it is; `x` is any digit, `n` is 1 to 9
/// and `N` is 2 to 9, because a subscriber number seldom opens on a `0` or a
/// `1` where those are what a trunk prefix and a special service dial.
class PhoneShape {
  /// Creates a shape.
  const PhoneShape({
    required this.prefixes,
    required this.groups,
    this.lead = '',
    this.avoid = const <String>[],
    this.trunk,
  });

  /// What the first group opens on, after the trunk prefix: an area code, or a
  /// mobile block.
  final List<String> prefixes;

  /// Digits the first group carries after its prefix, as a pattern.
  final String lead;

  /// The groups after the first, as patterns.
  final List<String> groups;

  /// Group values no number is written with, drawn again when they come up: a
  /// US exchange is never `N11`, which dials a service, nor `555`.
  final List<String> avoid;

  /// The trunk prefix, where this shape's is not the country's: a Chinese
  /// mobile number has none.
  final String? trunk;
}

/// How one country numbers its phones and writes them.
class PhoneCountryData {
  /// Creates a country's data.
  const PhoneCountryData({
    required this.callingCode,
    required this.trunk,
    required this.national,
    required this.international,
    required this.plans,
  });

  /// The country calling code, without the `+`.
  final String callingCode;

  /// What a number opens on at home and drops abroad: `0`, `8`, or `''`.
  final String trunk;

  /// How the country writes a number for itself: `T` is the trunk prefix and
  /// each `#` the next group. `T#` attaches the trunk to the first group
  /// (`010`), and anything between them keeps the two apart (`8 (912)`).
  final String national;

  /// How it writes one for the world, after `+` and the calling code and a
  /// space.
  final String international;

  /// The shapes each type of number is drawn from.
  final Map<PhoneType, List<PhoneShape>> plans;
}
