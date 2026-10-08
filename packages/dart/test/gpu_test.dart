import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/gpu/data/index.dart';
import 'package:randino/src/gpu/gpu_generator.dart';
import 'package:test/test.dart';

const int sample = 60;

void main() {
  group('Gpu', () {
    test('randCpu returns one graphics processor by default', () {
      expect(randGpu(), hasLength(1));
    });

    test('returns exactly `count` graphics processors', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randGpu(count: count), hasLength(count));
      }

      expect(randGpu(count: -3), isEmpty);
      expect(randGpu(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every graphics processor in the catalog is well formed', () {
      final seen = <String>{};

      for (final entry in gpus) {
        final key = '${entry.vendor} ${entry.model}';

        expect(seen.add(key), isTrue, reason: '$key is listed twice');
        expect(entry.year, inInclusiveRange(2006, 2025), reason: key);
        expect(entry.model.startsWith(entry.vendor), isFalse, reason: key);
      }

      for (final platform in SystemPlatform.values) {
        expect(gpus.where((entry) => entry.platform == platform).length, greaterThanOrEqualTo(40));
      }
    });

    test('every graphics processor is one the catalog holds, written as its detail says', () {
      for (final detail in randGpuDetails(count: sample * 5)) {
        final entry = gpus.firstWhere(
          (each) => each.vendor == detail.vendor && each.model == detail.model,
        );

        expect(detail.gpu, writeGpu(entry, true));
        expect(detail.gpu, '${detail.vendor} ${detail.model}');
        expect(detail.platform, entry.platform);
        expect(detail.year, entry.year);
      }

      for (final detail in randGpuDetails(includeVendor: false, count: sample * 3)) {
        expect(detail.gpu, detail.model);
      }
    });

    test('platform keeps to the graphics processors of one kind of machine', () {
      for (final platform in SystemPlatform.values) {
        expect(
          randGpuDetails(
            platform: platform,
            count: sample * 3,
          ).every((detail) => detail.platform == platform),
          isTrue,
        );
      }

      expect({
        for (final detail in randGpuDetails(count: sample * 3)) detail.platform,
      }, hasLength(SystemPlatform.values.length));
    });

    test('a year range keeps to the graphics processors out in it', () {
      for (final detail in randGpuDetails(minYear: 2015, maxYear: 2018, count: sample * 3)) {
        expect(detail.year, inInclusiveRange(2015, 2018), reason: detail.gpu);
      }

      final asOf = randGpu(
        platform: SystemPlatform.desktop,
        maxYear: 2010,
        unique: true,
        count: 100,
      );

      expect(asOf, contains('NVIDIA GeForce GTX 480'));
      expect(asOf, isNot(contains('NVIDIA GeForce GTX 560 Ti')));
    });

    test(
      'a year range nothing came out in answers with nothing, and one the wrong way round keeps maxYear',
      () {
        expect(randGpu(maxYear: 2005, count: 5), isEmpty);
        expect(randGpu(minYear: 2030, count: 5), isEmpty);
        // The first phone GPU in the catalog is the 2013 Adreno 330.
        expect(randGpu(platform: SystemPlatform.mobile, maxYear: 2012), isEmpty);

        for (final detail in randGpuDetails(minYear: 2024, maxYear: 2016, count: sample)) {
          expect(detail.year, 2016, reason: detail.gpu);
        }
      },
    );

    test('the value form is the graphics processor of each detail', () {
      expect(randGpu(count: sample, random: Random(7)), <String>[
        for (final detail in randGpuDetails(count: sample, random: Random(7))) detail.gpu,
      ]);
    });

    test('unique never repeats a graphics processor, and stops when they run out', () {
      final expected = {
        for (final entry in gpus)
          if (entry.platform == SystemPlatform.mobile && entry.year == 2025) writeGpu(entry, true),
      };
      final found = randGpu(
        platform: SystemPlatform.mobile,
        minYear: 2025,
        unique: true,
        count: 100,
      );

      expect(found.toSet(), hasLength(found.length));
      expect(found.toSet(), expected);
    });
  });
}
