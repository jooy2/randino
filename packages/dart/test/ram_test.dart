import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/internal/capacity.dart';
import 'package:randino/src/ram/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 4000;
const int megabyte = 1024 * 1024;
const int gigabyte = 1024;

// Every size either platform is sold with.
final Set<int> sizes = {
  for (final platform in systemPlatforms)
    for (final (size, _) in ramSizes[platform]!) size,
};

/// The entry [detail] says its memory is.
RamTypeEntry? entryOf(RamDetail detail) {
  for (final entry in ramTypeEntries) {
    if (entry.type == detail.type && entry.platform == detail.platform) return entry;
  }

  return null;
}

void main() {
  group('Ram', () {
    test('randRam returns one size by default', () {
      expect(randRam().single, matches(RegExp(r'^\d+ (MB|GB)$')));
    });

    test('returns exactly `count` sizes', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randRam(count: count), hasLength(count));
      }

      expect(randRam(count: -3), isEmpty);
      expect(randRam(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('each pool is every size once, smallest first, each a whole number of megabytes', () {
      for (final platform in systemPlatforms) {
        final pool = ramSizes[platform]!;

        for (var i = 0; i < pool.length; i += 1) {
          final (size, weight) = pool[i];

          expect(size, greaterThan(0), reason: '${platform.name} $size');
          expect(weight, greaterThan(0), reason: '${platform.name} $size');

          if (i > 0) {
            expect(
              size,
              greaterThan(pool[i - 1].$1),
              reason: '${platform.name} $size is out of order',
            );
          }
        }
      }

      // A phone's memory stops at 24 GB.
      expect(ramSizes[SystemPlatform.mobile]!.last.$1, 24 * gigabyte);
    });

    test(
      'every kind of memory is described once per platform, at sizes its platform is sold with',
      () {
        final seen = <String>{};

        for (final entry in ramTypeEntries) {
          final key = '${entry.type} ${entry.platform.name}';
          final pool = [for (final (size, _) in ramSizes[entry.platform]!) size];

          expect(seen.add(key), isTrue, reason: '$key is listed twice');
          expect(ramTypes, contains(entry.type), reason: key);
          expect(entry.from, inInclusiveRange(2000, 2026), reason: key);
          expect(
            entry.to == null || (entry.to! >= entry.from && entry.to! <= 2026),
            isTrue,
            reason: key,
          );
          expect(entry.weight, greaterThan(0), reason: key);
          expect(entry.sizes, isNotEmpty, reason: key);

          for (var i = 0; i < entry.sizes.length; i += 1) {
            final (:size, :from) = entry.sizes[i];

            expect(pool, contains(size), reason: '$key at $size MB');
            // A size comes no earlier than its kind, and inside the years it was sold.
            expect(
              from >= entry.from && from <= (entry.to ?? 2026),
              isTrue,
              reason: '$key at $size MB',
            );

            if (i > 0) {
              expect(size, greaterThan(entry.sizes[i - 1].size), reason: '$key is out of order');
            }
          }
        }

        for (final type in ramTypes) {
          expect(ramTypeEntries.any((entry) => entry.type == type), isTrue, reason: type);
        }

        for (final platform in systemPlatforms) {
          final entries = ramTypeEntries.where((entry) => entry.platform == platform);

          expect(
            entries.fold<num>(0, (sum, entry) => sum + entry.weight),
            100,
            reason: platform.name,
          );

          // Every size a platform is sold with is one some kind of memory came in.
          for (final (size, _) in ramSizes[platform]!) {
            expect(
              entries.any((entry) => entry.sizes.any((each) => each.size == size)),
              isTrue,
              reason: '${platform.name} $size MB',
            );
          }
        }

        // Only a desktop or a laptop is sold with DDR memory.
        expect(
          ramTypeEntries
              .where((entry) => entry.platform == SystemPlatform.mobile)
              .every((entry) => entry.type.startsWith('LPDDR')),
          isTrue,
        );
      },
    );

    test('a size is written in the largest unit it is a whole number of', () {
      expect(fitUnit(ramScale, 512), RamUnit.mb);
      expect(fitUnit(ramScale, 16384), RamUnit.gb);
      expect(inUnit(ramScale, 16384, RamUnit.gb), 16);
      expect(inUnit(ramScale, 512, RamUnit.gb), 0.5);

      for (final detail in randRamDetails(count: large)) {
        expect(detail.unit, fitUnit(ramScale, detail.bytes ~/ megabyte), reason: detail.ram);
      }
    });

    test('every size is one the pool holds, and the detail is what was written', () {
      for (final unit in <RamUnit?>[null, ...ramUnits]) {
        for (final detail in randRamDetails(unit: unit, count: sample * 5)) {
          final size = detail.bytes ~/ megabyte;

          expect(
            ramSizes[detail.platform]!.any((each) => each.$1 == size),
            isTrue,
            reason: detail.ram,
          );
          expect(detail.ram, '${detail.value} ${detail.unit.label}');
          expect(detail.value, inUnit(ramScale, size, detail.unit));
        }
      }
    });

    test('a named unit keeps to the sizes whole in it, and never writes a decimal point', () {
      final gigabytes = randRamDetails(unit: RamUnit.gb, count: large);

      expect(gigabytes.every((detail) => detail.unit == RamUnit.gb), isTrue);
      expect(gigabytes.any((detail) => detail.bytes == 512 * megabyte), isFalse);
      expect(
        randRam(unit: RamUnit.mb, count: sample * 3).every(RegExp(r'^\d+ MB$').hasMatch),
        isTrue,
      );

      for (final ram in randRam(count: large)) {
        expect(ram, isNot(contains('.')));
      }
    });

    test('includeUnit: false writes the number alone, in one unit throughout', () {
      for (final ram in randRam(includeUnit: false, count: sample * 5)) {
        expect(ram, matches(RegExp(r'^\d+$')));
        // In gigabytes throughout, so every bare number is a size in gigabytes.
        expect(sizes, contains(int.parse(ram) * 1024));
      }

      expect(
        randRam(
          unit: RamUnit.mb,
          includeUnit: false,
          count: sample,
        ).every((ram) => int.parse(ram) >= 512),
        isTrue,
      );
    });

    test('minSize and maxSize are read in the unit, or in gigabytes for a null one', () {
      for (final detail in randRamDetails(minSize: 8, maxSize: 32, count: sample * 3)) {
        expect(detail.bytes ~/ megabyte ~/ 1024, inInclusiveRange(8, 32), reason: detail.ram);
      }

      for (final detail in randRamDetails(unit: RamUnit.mb, maxSize: 4096, count: sample * 3)) {
        expect(detail.value, lessThanOrEqualTo(4096), reason: detail.ram);
      }

      // Both ends are included.
      expect(randRam(minSize: 16, maxSize: 16, count: sample).toSet(), {'16 GB'});
    });

    test('a range no real size is inside answers with nothing', () {
      expect(randRam(minSize: 5, maxSize: 5, count: 5), isEmpty);
      expect(randRam(minSize: 5000, count: 5), isEmpty);
    });

    test('a bound need not be whole, and is not rounded', () {
      // Half a gigabyte is 512 MB, which is in range.
      expect(randRam(maxSize: 0.5, count: sample).toSet(), {'512 MB'});
      expect(randRam(minSize: 0.6, maxSize: 0.9, count: 5), isEmpty);
    });

    test('a range the wrong way round keeps maxSize', () {
      expect(randRam(minSize: 64, maxSize: 8, count: sample).toSet(), {'8 GB'});
    });

    test('8 and 16 GB are the most common, and the largest sizes rare', () {
      final ram = randRam(count: large);
      double share(String size) => ram.where((each) => each == size).length / ram.length;

      expect(share('8 GB') + share('16 GB'), greaterThan(0.3));
      expect(share('8 GB'), greaterThan(share('32 GB')));
      expect(share('1024 GB'), lessThan(0.01));
    });

    test('the value form is the size of each detail', () {
      expect(randRam(count: sample, random: Random(7)), <String>[
        for (final detail in randRamDetails(count: sample, random: Random(7))) detail.ram,
      ]);
    });

    test('the kind of memory is one sold at that size, on that platform', () {
      for (final detail in randRamDetails(count: large)) {
        final entry = entryOf(detail);

        expect(entry, isNotNull, reason: '${detail.ram} ${detail.type} ${detail.platform.name}');
        expect(
          entry!.sizes.any((each) => each.size == detail.bytes ~/ megabyte),
          isTrue,
          reason: '${detail.ram} ${detail.type}',
        );
      }
    });

    test('platform keeps to the memory of one kind of machine', () {
      final mobile = randRamDetails(platform: SystemPlatform.mobile, count: large);

      expect(mobile.every((detail) => detail.platform == SystemPlatform.mobile), isTrue);
      expect(mobile.every((detail) => detail.type.startsWith('LPDDR')), isTrue);
      expect(mobile.every((detail) => detail.bytes <= 24 * gigabyte * megabyte), isTrue);

      final desktop = randRamDetails(platform: SystemPlatform.desktop, count: sample * 3);

      expect(desktop.every((detail) => detail.platform == SystemPlatform.desktop), isTrue);
      expect({
        for (final detail in randRamDetails(count: sample * 3)) detail.platform,
      }, hasLength(systemPlatforms.length));
    });

    test('a year range keeps to the kinds of memory sold in it', () {
      final old = randRamDetails(
        platform: SystemPlatform.desktop,
        maxYear: 2005,
        count: sample * 5,
      );

      expect({for (final detail in old) detail.type}, {'DDR', 'DDR2'});
      expect(old.every((detail) => detail.bytes <= 8 * gigabyte * megabyte), isTrue);

      for (final detail in randRamDetails(minYear: 2024, count: large)) {
        final entry = entryOf(detail)!;

        expect(
          entry.to == null || entry.to! >= 2024,
          isTrue,
          reason: '${detail.type} ${detail.platform.name}',
        );
      }

      // No phone was sold with 512 MB before 2010, and nothing at all before 2000.
      expect(randRam(platform: SystemPlatform.mobile, maxYear: 2009, count: 5), isEmpty);
      expect(randRam(maxYear: 1990, count: 5), isEmpty);
      // A range the wrong way round keeps maxYear.
      expect(
        randRamDetails(
          minYear: 2024,
          maxYear: 2003,
          platform: SystemPlatform.desktop,
          count: sample,
        ).every((detail) => detail.type == 'DDR'),
        isTrue,
      );
    });

    test('a year range keeps to the sizes out by then, not only to the kinds', () {
      for (final maxYear in [2005, 2010, 2015, 2020, 2022]) {
        for (final detail in randRamDetails(maxYear: maxYear, count: large ~/ 4)) {
          final size = entryOf(
            detail,
          )!.sizes.firstWhere((each) => each.size == detail.bytes ~/ megabyte);

          expect(size.from, lessThanOrEqualTo(maxYear), reason: '${detail.ram} by $maxYear');
        }
      }

      // The largest a desktop of 2010 came with was 32 GB of DDR3: the half a
      // terabyte of a workstation came three years later.
      expect(
        randRamDetails(
          platform: SystemPlatform.desktop,
          maxYear: 2010,
          count: large,
        ).every((detail) => detail.bytes <= 32 * gigabyte * megabyte),
        isTrue,
      );
    });

    test('includeType writes the kind of memory after the size', () {
      for (final detail in randRamDetails(includeType: true, count: sample * 3)) {
        expect(detail.ram, '${detail.value} ${detail.unit.label} ${detail.type}');
      }

      // A bare number goes without the kind, the way it goes without the unit,
      // and the detail still carries it.
      for (final detail in randRamDetails(includeType: true, includeUnit: false, count: sample)) {
        expect(detail.ram, matches(RegExp(r'^\d+$')));
        expect(detail.type, isNotEmpty);
      }

      for (final detail in randRamDetails(count: sample)) {
        expect(detail.ram, '${detail.value} ${detail.unit.label}');
      }
    });

    test('DDR4 and DDR5 lead the desktops, and LPDDR4X and later the phones', () {
      double share(List<RamDetail> details, bool Function(RamDetail detail) keep) =>
          details.where(keep).length / details.length;
      final desktop = randRamDetails(platform: SystemPlatform.desktop, count: large);
      final mobile = randRamDetails(platform: SystemPlatform.mobile, count: large);

      expect(
        share(desktop, (each) => each.type == 'DDR4' || each.type == 'DDR5'),
        greaterThan(0.5),
      );
      expect(
        share(mobile, (each) => <String>['LPDDR4X', 'LPDDR5', 'LPDDR5X'].contains(each.type)),
        greaterThan(0.6),
      );
    });

    test('unique never repeats a size, and stops when the sizes run out', () {
      final ram = randRam(minSize: 4, maxSize: 16, unique: true, count: 100);

      expect(ram.toSet(), hasLength(ram.length));
      expect(ram.toSet(), {'4 GB', '6 GB', '8 GB', '12 GB', '16 GB'});

      // The whole pool too, though its rarest size is a draw in a thousand.
      final every = randRamDetails(unique: true, count: 100);

      expect({for (final detail in every) detail.ram}, hasLength(every.length));
      expect({for (final detail in every) detail.bytes ~/ megabyte}, sizes);
    });
  });
}
