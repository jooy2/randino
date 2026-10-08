// The version generator: a version number in one of three schemes, its parts
// drawn with the small numbers most often.

import 'dart:math';

import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/version/data/index.dart';

/// A number from [range], each one weighted by one over its distance from the
/// bottom plus one: the bottom is most likely, and a number is about twice as
/// likely as the one twice as far up.
int smallNumber((int, int) range) {
  final (low, high) = range;
  var total = 0.0;

  for (var n = low; n <= high; n++) {
    total += 1 / (n - low + 1);
  }

  var roll = randDouble() * total;

  for (var n = low; n <= high; n++) {
    roll -= 1 / (n - low + 1);

    if (roll < 0) {
      return n;
    }
  }

  return high;
}

/// [minYear] and [maxYear] as the years a calendar version may come from. A
/// bound left out moves out of the way of the one that was written, and a
/// range the wrong way round keeps [maxYear].
(int, int) resolveVersionYears(int? minYear, int? maxYear) {
  final low = clampInt(minYear ?? versionYearMinDefault, versionYearFloor, versionYearCeiling);
  final high = clampInt(
    maxYear ?? max(versionYearMaxDefault, low),
    versionYearFloor,
    versionYearCeiling,
  );

  return (min(low, high), high);
}

String _pad(int value) => value.toString().padLeft(2, '0');

typedef _Drawn = ({String written, String scheme, List<int> parts, String? prerelease, int? year});

final List<String> _prereleases = versionPrereleases.keys.toList();

_Drawn _drawSemver(bool includePrerelease) {
  final parts = <int>[
    smallNumber(versionParts['major']!),
    smallNumber(versionParts['minor']!),
    smallNumber(versionParts['patch']!),
  ];
  final prerelease =
      includePrerelease && chance(versionPrereleaseChance)
          ? '${pickWeighted(_prereleases, (label) => versionPrereleases[label]!)}'
              '.${smallNumber(versionParts['prerelease']!)}'
          : null;

  return (
    written: parts.join('.') + (prerelease == null ? '' : '-$prerelease'),
    scheme: 'MAJOR.MINOR.PATCH',
    parts: parts,
    prerelease: prerelease,
    year: null,
  );
}

_Drawn _drawCalver((int, int) years) {
  final scheme = pickWeighted(calverSchemes, (each) => each.weight).scheme;
  final year = randInt(years.$1, years.$2);
  final month = randInt(1, 12);
  final parts = <int>[];
  // Each token is drawn in the order it is written, so a scheme draws only the
  // parts it has.
  final written = scheme
      .split('.')
      .map((token) {
        switch (token) {
          case 'YYYY':
            parts.add(year);

            return '$year';
          case 'YY':
            parts.add(year - 2000);

            return '${year - 2000}';
          case 'MM':
            parts.add(month);

            return '$month';
          case '0M':
            parts.add(month);

            return _pad(month);
          case '0D':
            final day = randInt(1, DateTime.utc(year, month + 1, 0).day);

            parts.add(day);

            return _pad(day);
          case 'MINOR':
            final release = smallNumber(versionParts['release']!);

            parts.add(release);

            return '$release';
          default:
            final micro = smallNumber(versionParts['micro']!);

            parts.add(micro);

            return '$micro';
        }
      })
      .join('.');

  return (written: written, scheme: scheme, parts: parts, prerelease: null, year: year);
}

_Drawn _drawNumber() {
  final number = smallNumber(versionParts['number']!);

  return (written: '$number', scheme: 'MAJOR', parts: <int>[number], prerelease: null, year: null);
}

/// What `randVersion` and `randVersionDetails` both do.
List<VersionDetail> generateVersionDetails({
  Set<VersionFormat>? format = const {VersionFormat.semver},
  String prefix = '',
  bool includePrerelease = false,
  int? minYear,
  int? maxYear,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final formats =
      format == null || format.isEmpty
          ? versionFormats
          : [
            for (final each in versionFormats)
              if (format.contains(each)) each,
          ];
  final years = resolveVersionYears(minYear, maxYear);

  return withRandom(
    random,
    () => collect<VersionDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      draw: () {
        final chosen = pick(formats);
        final drawn = switch (chosen) {
          VersionFormat.semver => _drawSemver(includePrerelease),
          VersionFormat.calver => _drawCalver(years),
          VersionFormat.number => _drawNumber(),
        };

        return VersionDetail(
          version: prefix + drawn.written,
          format: chosen,
          scheme: drawn.scheme,
          parts: List<int>.unmodifiable(drawn.parts),
          prerelease: drawn.prerelease,
          year: drawn.year,
        );
      },
      keyOf: (detail) => detail.version,
    ),
  );
}
