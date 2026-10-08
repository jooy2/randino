import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/version/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 6000;
final RegExp semver = RegExp(r'^(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|rc)\.(\d+))?$');

bool inside(int value, (int, int) range) => value >= range.$1 && value <= range.$2;

void main() {
  group('Version', () {
    test('randVersion returns one semantic version by default', () {
      expect(randVersion().single, matches(RegExp(r'^\d+\.\d+\.\d+$')));
    });

    test('returns exactly `count` versions', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randVersion(count: count), hasLength(count));
      }

      expect(randVersion(count: -3), isEmpty);
      expect(randVersion(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('a semantic version keeps every part inside its range', () {
      for (final detail in randVersionDetails(count: sample * 5)) {
        expect(detail.format, VersionFormat.semver);
        expect(detail.scheme, 'MAJOR.MINOR.PATCH');
        expect(detail.version, detail.parts.join('.'));
        expect(inside(detail.parts[0], versionParts['major']!), isTrue);
        expect(inside(detail.parts[1], versionParts['minor']!), isTrue);
        expect(inside(detail.parts[2], versionParts['patch']!), isTrue);
        expect(detail.prerelease, isNull);
        expect(detail.year, isNull);
      }
    });

    test('the small numbers come up most often', () {
      final details = randVersionDetails(count: large);
      double share(int index, int value) =>
          details.where((detail) => detail.parts[index] == value).length / details.length;

      expect(share(2, 0), greaterThan(0.18));
      expect(share(2, 0), greaterThan(share(2, 1)));
      expect(share(2, 1), greaterThan(share(2, 10)));
      expect(share(0, 20), lessThan(0.03));
    });

    test('a calendar version is written by its scheme, and its year is in range', () {
      final schemes = {for (final each in calverSchemes) each.scheme};

      for (final detail in randVersionDetails(format: {VersionFormat.calver}, count: sample * 5)) {
        expect(detail.format, VersionFormat.calver);
        expect(schemes, contains(detail.scheme));
        expect(detail.year, inInclusiveRange(2010, 2026));

        final tokens = detail.scheme.split('.');
        final written = detail.version.split('.');

        expect(written, hasLength(tokens.length));
        expect(written.map(int.parse).toList(), detail.parts);

        for (var index = 0; index < tokens.length; index++) {
          final token = tokens[index];

          if (token == 'YYYY') expect(detail.parts[index], detail.year);
          if (token == 'YY') expect(detail.parts[index], detail.year! - 2000);
          if (token == '0M' || token == '0D') expect(written[index], matches(RegExp(r'^\d\d$')));
          if (token == 'MM' || token == '0M') expect(detail.parts[index], inInclusiveRange(1, 12));
        }

        if (detail.scheme == 'YYYY.0M.0D') {
          final [year, month, day] = detail.parts;

          expect(
            DateTime.utc(year, month, day).day,
            day,
            reason: '${detail.version} is a real day',
          );
        }
      }
    });

    test('minYear and maxYear keep a calendar version inside them', () {
      final calver = {VersionFormat.calver};

      expect(
        randVersionDetails(
          format: calver,
          minYear: 2019,
          maxYear: 2021,
          count: sample,
        ).every((detail) => detail.year! >= 2019 && detail.year! <= 2021),
        isTrue,
      );
      expect(
        randVersionDetails(
          format: calver,
          minYear: 2040,
          count: sample,
        ).every((detail) => detail.year == 2040),
        isTrue,
        reason: 'a bound left out moves aside',
      );
      expect(
        randVersionDetails(
          format: calver,
          minYear: 2024,
          maxYear: 2015,
          count: sample,
        ).every((detail) => detail.year == 2015),
        isTrue,
        reason: 'the wrong way round keeps maxYear',
      );
      expect(
        randVersionDetails(
          format: calver,
          minYear: 1990,
          maxYear: 3000,
          count: sample,
        ).every((detail) => detail.year! >= 2000 && detail.year! <= 2099),
        isTrue,
      );
    });

    test('a single-number version keeps inside its range', () {
      for (final detail in randVersionDetails(format: {VersionFormat.number}, count: sample * 5)) {
        expect(detail.scheme, 'MAJOR');
        expect(detail.version, '${detail.parts.single}');
        expect(inside(detail.parts.single, versionParts['number']!), isTrue);
      }
    });

    test('several formats, or all of them, are drawn evenly', () {
      final details = randVersionDetails(format: null, count: large);

      for (final format in versionFormats) {
        final share = details.where((detail) => detail.format == format).length / details.length;

        expect(share, inExclusiveRange(0.28, 0.39), reason: format.name);
      }

      expect(
        randVersionDetails(
          format: {VersionFormat.calver, VersionFormat.number},
          count: sample,
        ).every((detail) => detail.format != VersionFormat.semver),
        isTrue,
      );
      expect(
        randVersionDetails(format: {}, count: sample).map((detail) => detail.format).toSet(),
        hasLength(greaterThan(1)),
      );
    });

    test('includePrerelease gives about one semantic version in four a pre-release', () {
      final details = randVersionDetails(includePrerelease: true, count: large);
      final marked = details.where((detail) => detail.prerelease != null).length / details.length;

      expect(marked, inExclusiveRange(0.2, 0.3));

      for (final detail in details) {
        expect(detail.version, matches(semver));

        final prerelease = detail.prerelease;

        if (prerelease != null) {
          final [label, number] = prerelease.split('.');

          expect(versionPrereleases.keys, contains(label));
          expect(int.parse(number), inInclusiveRange(1, 9));
          expect(detail.version, endsWith('-$prerelease'));
        }
      }

      expect(
        randVersionDetails(
          format: {VersionFormat.calver},
          includePrerelease: true,
          count: sample,
        ).every((detail) => detail.prerelease == null),
        isTrue,
      );
    });

    test('prefix is written in front of every version', () {
      for (final version in randVersion(format: null, prefix: 'v', count: sample)) {
        expect(version, matches(RegExp(r'^v\d')));
      }
    });

    test('the value form is the version of each detail', () {
      expect(randVersion(format: null, count: sample, random: Random(7)), <String>[
        for (final detail in randVersionDetails(format: null, count: sample, random: Random(7)))
          detail.version,
      ]);
    });

    test('unique never repeats a version', () {
      final found = randVersion(format: {VersionFormat.number}, unique: true, count: 100);

      expect(found.toSet(), hasLength(found.length));
      expect(found.length, greaterThan(25));
    });
  });
}
