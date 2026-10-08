import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/cpu/cpu_generator.dart';
import 'package:randino/src/cpu/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;

void main() {
  group('Cpu', () {
    test('randCpu returns one processor by default', () {
      expect(randCpu(), hasLength(1));
    });

    test('returns exactly `count` processors', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randCpu(count: count), hasLength(count));
      }

      expect(randCpu(count: -3), isEmpty);
      expect(randCpu(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every processor in the catalog is well formed', () {
      final seen = <String>{};

      for (final entry in cpus) {
        final key = '${entry.vendor} ${entry.model}';

        expect(seen.add(key), isTrue, reason: '$key is listed twice');
        expect(entry.year, inInclusiveRange(2000, 2025), reason: key);
        expect(entry.model.startsWith(entry.vendor), isFalse, reason: key);
      }

      for (final platform in SystemPlatform.values) {
        expect(cpus.where((entry) => entry.platform == platform).length, greaterThanOrEqualTo(60));
      }
    });

    test('every processor is one the catalog holds, written as its detail says', () {
      for (final detail in randCpuDetails(count: sample * 5)) {
        final entry = cpus.firstWhere(
          (each) => each.vendor == detail.vendor && each.model == detail.model,
        );

        expect(detail.cpu, writeCpu(entry, true));
        expect(detail.cpu, '${detail.vendor} ${detail.model}');
        expect(detail.platform, entry.platform);
        expect(detail.year, entry.year);
      }

      for (final detail in randCpuDetails(includeVendor: false, count: sample * 3)) {
        expect(detail.cpu, detail.model);
      }
    });

    test('platform keeps to the processors of one kind of machine', () {
      for (final platform in SystemPlatform.values) {
        expect(
          randCpuDetails(
            platform: platform,
            count: sample * 3,
          ).every((detail) => detail.platform == platform),
          isTrue,
        );
      }

      expect({
        for (final detail in randCpuDetails(count: sample * 3)) detail.platform,
      }, hasLength(SystemPlatform.values.length));
    });

    test('a year range keeps to the processors out in it', () {
      for (final detail in randCpuDetails(minYear: 2015, maxYear: 2018, count: sample * 3)) {
        expect(detail.year, inInclusiveRange(2015, 2018), reason: detail.cpu);
      }

      final asOf = randCpu(
        platform: SystemPlatform.desktop,
        maxYear: 2010,
        unique: true,
        count: 100,
      );

      expect(asOf, contains('Intel Core i7-920'));
      expect(asOf, isNot(contains('Intel Core i5-2500K')));
    });

    test(
      'a year range nothing came out in answers with nothing, and one the wrong way round keeps maxYear',
      () {
        expect(randCpu(maxYear: 1999, count: 5), isEmpty);
        expect(randCpu(minYear: 2030, count: 5), isEmpty);
        // The first phone chip in the catalog is the 2010 Apple A4.
        expect(randCpu(platform: SystemPlatform.mobile, maxYear: 2009), isEmpty);

        for (final detail in randCpuDetails(minYear: 2024, maxYear: 2016, count: sample)) {
          expect(detail.year, 2016, reason: detail.cpu);
        }
      },
    );

    test('the value form is the processor of each detail', () {
      expect(randCpu(count: sample, random: Random(7)), <String>[
        for (final detail in randCpuDetails(count: sample, random: Random(7))) detail.cpu,
      ]);
    });

    test('unique never repeats a processor, and stops when the processors run out', () {
      final expected = {
        for (final entry in cpus)
          if (entry.platform == SystemPlatform.mobile && entry.year == 2025) writeCpu(entry, true),
      };
      final found = randCpu(
        platform: SystemPlatform.mobile,
        minYear: 2025,
        unique: true,
        count: 100,
      );

      expect(found.toSet(), hasLength(found.length));
      expect(found.toSet(), expected);
    });

    test('vendor keeps to the makers named, and lists every maker the catalog holds', () {
      expect({for (final entry in cpus) entry.vendor}, cpuVendors.toSet());

      for (final vendor in cpuVendors) {
        expect(
          randCpuDetails(
            vendor: {vendor},
            count: sample,
          ).every((detail) => detail.vendor == vendor),
          isTrue,
          reason: vendor,
        );
      }

      expect(
        randCpuDetails(
          vendor: {'Intel', 'Apple'},
          count: sample,
        ).every((detail) => detail.vendor == 'Intel' || detail.vendor == 'Apple'),
        isTrue,
      );
      expect(
        randCpuDetails(vendor: {'Nope'}, count: sample).any((detail) => detail.vendor != 'Intel'),
        isTrue,
        reason: 'an unknown maker reads as all of them',
      );
    });

    test('a maker with no part on the platform asked for is answered with nothing', () {
      expect(randCpu(vendor: {'MediaTek'}, platform: SystemPlatform.desktop, count: 5), isEmpty);
      expect(randCpu(vendor: {'Intel'}, platform: SystemPlatform.mobile, count: 5), isEmpty);
    });
  });
}
