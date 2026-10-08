import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but it is what a result is checked against.
import 'package:randino/src/resolution/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 6000;

void main() {
  group('Resolution', () {
    test('randResolution returns one resolution by default', () {
      expect(randResolution().single, matches(RegExp(r'^\d+x\d+$')));
    });

    test('returns exactly `count` resolutions', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randResolution(count: count), hasLength(count));
      }

      expect(randResolution(count: -3), isEmpty);
      expect(randResolution(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every size is listed once, and each platform’s weights add up to a hundred', () {
      final seen = <String>{};

      for (final entry in resolutions) {
        final key = '${entry.platform.name} ${entry.width}x${entry.height}';

        expect(seen.add(key), isTrue, reason: '$key is listed twice');
        expect(entry.weight, greaterThan(0));
      }

      for (final platform in SystemPlatform.values) {
        expect(
          resolutions
              .where((entry) => entry.platform == platform)
              .fold<num>(0, (sum, entry) => sum + entry.weight),
          100,
        );
      }
    });

    test('every resolution is one the table holds, and its detail is the two numbers', () {
      for (final detail in randResolutionDetails(count: sample * 5)) {
        expect(
          resolutions.any(
            (entry) =>
                entry.platform == detail.platform &&
                entry.width == detail.width &&
                entry.height == detail.height,
          ),
          isTrue,
          reason: detail.resolution,
        );
        expect(detail.resolution, '${detail.width}x${detail.height}');
      }
    });

    test('a desktop is wider than it is tall, and a phone is written portrait', () {
      for (final detail in randResolutionDetails(
        platform: SystemPlatform.desktop,
        count: sample * 3,
      )) {
        expect(detail.width, greaterThan(detail.height));
      }

      for (final detail in randResolutionDetails(
        platform: SystemPlatform.mobile,
        count: sample * 3,
      )) {
        expect(detail.width, lessThan(detail.height));
      }
    });

    test(
      'platform keeps to the screens of one kind of machine, and a null one draws both evenly',
      () {
        for (final platform in SystemPlatform.values) {
          expect(
            randResolutionDetails(
              platform: platform,
              count: sample,
            ).every((detail) => detail.platform == platform),
            isTrue,
          );
        }

        final details = randResolutionDetails(count: large);
        final desktop =
            details.where((detail) => detail.platform == SystemPlatform.desktop).length /
            details.length;

        expect(desktop, inExclusiveRange(0.45, 0.55));
      },
    );

    test('1920x1080 is the most common desktop, and the rare sizes rare', () {
      final desktops = randResolution(platform: SystemPlatform.desktop, count: large);
      double share(String size) => desktops.where((each) => each == size).length / desktops.length;

      expect(share('1920x1080'), greaterThan(0.2));
      expect(share('1920x1080'), greaterThan(share('1366x768')));
      expect(share('1024x768'), lessThan(0.03));
    });

    test('separator replaces the x', () {
      for (final resolution in randResolution(separator: ' × ', count: sample)) {
        expect(resolution, matches(RegExp(r'^\d+ × \d+$')));
      }

      expect(randResolution(separator: '', count: sample).every(RegExp(r'^\d+$').hasMatch), isTrue);
    });

    test('the value form is the resolution of each detail', () {
      expect(randResolution(count: sample, random: Random(7)), <String>[
        for (final detail in randResolutionDetails(count: sample, random: Random(7)))
          detail.resolution,
      ]);
    });

    test('unique never repeats a resolution', () {
      final found = randResolution(platform: SystemPlatform.desktop, unique: true, count: 100);

      expect(found.toSet(), hasLength(found.length));
      expect(found.length, greaterThan(15));
    });
  });
}
