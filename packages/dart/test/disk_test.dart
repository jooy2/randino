import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/disk/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 4000;

double share(List<DiskTypeDetail> details, DiskType code) =>
    details.where((detail) => detail.code == code).length / details.length;

void main() {
  group('Disk', () {
    group('randDiskType', () {
      test('returns one label by default', () {
        expect(randDiskType(), hasLength(1));
      });

      test('returns exactly `count` labels', () {
        for (final count in <int>[0, 1, 7, 25]) {
          expect(randDiskType(count: count), hasLength(count));
        }

        expect(randDiskType(count: -3), isEmpty);
        expect(randDiskType(count: randCountMax + 5), hasLength(randCountMax));
      });

      test('every kind has a label and a name of its own, and a platform that uses it', () {
        expect({for (final code in diskTypes) diskTypeLabels[code]!.label}, hasLength(5));
        expect({for (final code in diskTypes) diskTypeLabels[code]!.name}, hasLength(5));

        for (final code in diskTypes) {
          expect(diskTypeWeights.values.any((row) => row.containsKey(code)), isTrue);
        }

        for (final row in diskTypeWeights.values) {
          expect(row.values.reduce((sum, each) => sum + each), 100);
        }
      });

      test('the label is the one its code is written with', () {
        for (final detail in randDiskTypeDetails(count: sample * 3)) {
          expect(detail.diskType, diskTypeLabels[detail.code]!.label);
          expect(detail.name, diskTypeLabels[detail.code]!.name);
          expect(diskTypeWeights[detail.platform]!.containsKey(detail.code), isTrue);
        }
      });

      test('platform keeps to the storage of one kind of machine', () {
        final desktop = randDiskTypeDetails(platform: SystemPlatform.desktop, count: large);
        final mobile = randDiskTypeDetails(platform: SystemPlatform.mobile, count: large);

        expect(desktop.every((detail) => detail.platform == SystemPlatform.desktop), isTrue);
        expect({for (final detail in mobile) detail.code}, {DiskType.emmc, DiskType.ufs});
        expect(desktop.any((detail) => detail.code == DiskType.ufs), isFalse);
        expect({
          for (final detail in randDiskTypeDetails(count: sample * 3)) detail.platform,
        }, hasLength(2));
      });

      test('an SSD is most desktops and UFS most phones', () {
        final desktop = randDiskTypeDetails(platform: SystemPlatform.desktop, count: large);
        final mobile = randDiskTypeDetails(platform: SystemPlatform.mobile, count: large);

        expect(share(desktop, DiskType.ssd), greaterThan(0.55));
        expect(share(desktop, DiskType.hdd), greaterThan(share(desktop, DiskType.sshd)));
        expect(share(desktop, DiskType.sshd), greaterThan(0));
        expect(share(mobile, DiskType.ufs), greaterThan(0.6));
      });

      test('the value form is the label of each detail', () {
        expect(randDiskType(count: sample, random: Random(7)), <String>[
          for (final detail in randDiskTypeDetails(count: sample, random: Random(7)))
            detail.diskType,
        ]);
      });

      test('unique never repeats a label, and stops when the labels run out', () {
        expect(randDiskType(platform: SystemPlatform.mobile, unique: true, count: 10).toSet(), {
          'UFS',
          'eMMC',
        });
        expect(randDiskType(unique: true, count: 10), hasLength(diskTypes.length));
      });
    });
  });
}
