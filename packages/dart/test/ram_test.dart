import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/internal/capacity.dart';
import 'package:randino/src/ram/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 4000;
const int megabyte = 1024 * 1024;
final List<int> sizes = [for (final (size, _) in ramScale.pool) size];

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

    test('the pool is every size once, smallest first, each a whole number of megabytes', () {
      for (var i = 0; i < ramScale.pool.length; i += 1) {
        final (size, weight) = ramScale.pool[i];

        expect(size, greaterThan(0));
        expect(weight, greaterThan(0));

        if (i > 0) {
          expect(size, greaterThan(ramScale.pool[i - 1].$1), reason: '$size is out of order');
        }
      }
    });

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

          expect(sizes, contains(size));
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

    test('unique never repeats a size, and stops when the sizes run out', () {
      // Kept to the common sizes, so every one of them is reached long before the
      // draws run out: the rarest of the whole pool is a draw in a thousand.
      final ram = randRam(minSize: 4, maxSize: 16, unique: true, count: 100);

      expect(ram.toSet(), hasLength(ram.length));
      expect(ram.toSet(), {'4 GB', '6 GB', '8 GB', '12 GB', '16 GB'});
    });
  });
}
