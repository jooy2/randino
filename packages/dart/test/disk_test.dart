import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/disk/data/index.dart';
import 'package:randino/src/internal/capacity.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 4000;
const int gigabyte = 1000 * 1000 * 1000;
// Every size any kind of storage is sold in.
final Set<int> sizes = {
  for (final type in diskTypes)
    for (final (size, _) in diskSizes[type]!) size,
};

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
    group('randDiskSize', () {
      test('returns one size by default', () {
        expect(randDiskSize().single, matches(RegExp(r'^\d+ (GB|TB)$')));
      });

      test('returns exactly `count` sizes', () {
        for (final count in <int>[0, 1, 7, 25]) {
          expect(randDiskSize(count: count), hasLength(count));
        }

        expect(randDiskSize(count: -3), isEmpty);
        expect(randDiskSize(count: randCountMax + 5), hasLength(randCountMax));
      });

      test('each kind’s pool is every size once, smallest first', () {
        expect(diskSizes.keys.toSet(), diskTypes.toSet());

        for (final type in diskTypes) {
          final pool = diskSizes[type]!;

          expect(pool, isNotEmpty, reason: type.name);

          for (var i = 0; i < pool.length; i += 1) {
            final (size, weight) = pool[i];

            expect(size, greaterThan(0), reason: '${type.name} $size');
            expect(weight, greaterThan(0), reason: '${type.name} $size');

            if (i > 0) {
              expect(
                size,
                greaterThan(pool[i - 1].$1),
                reason: '${type.name} $size is out of order',
              );
            }
          }
        }

        // A hard disk is the only kind past 8 TB, and eMMC stops at 128 GB.
        int largest(DiskType type) => diskSizes[type]!.last.$1;

        expect(largest(DiskType.emmc), 128);
        expect(diskTypes.every((type) => type == DiskType.hdd || largest(type) <= 8000), isTrue);
      });

      test(
        'a size is counted in powers of ten, and written in the largest unit it is whole in',
        () {
          expect(fitUnit(diskScale, 1000), DiskUnit.tb);
          expect(fitUnit(diskScale, 512), DiskUnit.gb);
          expect(inUnit(diskScale, 1000, DiskUnit.tb), 1);
          expect(inUnit(diskScale, 500, DiskUnit.tb), 0.5);
          expect(inUnit(diskScale, 512, DiskUnit.mb), 512000);

          for (final detail in randDiskSizeDetails(count: large)) {
            expect(detail.unit, fitUnit(diskScale, detail.bytes ~/ gigabyte), reason: detail.size);
          }
        },
      );

      test('every size is one the pool holds, and the detail is what was written', () {
        for (final unit in <DiskUnit?>[null, ...diskUnits]) {
          for (final detail in randDiskSizeDetails(unit: unit, count: sample * 5)) {
            final size = detail.bytes ~/ gigabyte;

            expect(
              diskSizes[detail.type]!.any((each) => each.$1 == size),
              isTrue,
              reason: '${detail.size} ${detail.type.name}',
            );
            expect(detail.size, '${detail.value} ${detail.unit.label}');
            expect(detail.value, inUnit(diskScale, size, detail.unit));
          }
        }
      });

      test('a named unit keeps to the sizes whole in it, and never writes a decimal point', () {
        final terabytes = randDiskSizeDetails(unit: DiskUnit.tb, count: large);

        expect(terabytes.every((detail) => detail.unit == DiskUnit.tb), isTrue);
        expect(terabytes.any((detail) => detail.bytes == 500 * gigabyte), isFalse);
        expect(
          randDiskSize(unit: DiskUnit.gb, count: sample * 3).every(RegExp(r'^\d+ GB$').hasMatch),
          isTrue,
        );

        for (final size in randDiskSize(count: large)) {
          expect(size, isNot(contains('.')));
        }
      });

      test('includeUnit: false writes the number alone, in gigabytes throughout', () {
        for (final size in randDiskSize(includeUnit: false, count: sample * 5)) {
          expect(size, matches(RegExp(r'^\d+$')));
          expect(sizes, contains(int.parse(size)));
        }
      });

      test('minSize and maxSize are read in the unit, or in gigabytes for a null one', () {
        for (final detail in randDiskSizeDetails(minSize: 500, maxSize: 2000, count: sample * 3)) {
          expect(detail.bytes ~/ gigabyte, inInclusiveRange(500, 2000), reason: detail.size);
        }

        for (final detail in randDiskSizeDetails(
          unit: DiskUnit.tb,
          minSize: 8,
          count: sample * 3,
        )) {
          expect(detail.value, greaterThanOrEqualTo(8), reason: detail.size);
        }

        expect(randDiskSize(minSize: 1000, maxSize: 1000, count: sample).toSet(), {'1 TB'});
      });

      test(
        'a range no real size is inside answers with nothing, and one the wrong way round keeps maxSize',
        () {
          expect(randDiskSize(minSize: 600, maxSize: 900, count: 5), isEmpty);
          expect(randDiskSize(minSize: 100000, count: 5), isEmpty);
          expect(randDiskSize(minSize: 4000, maxSize: 256, count: sample).toSet(), {'256 GB'});
        },
      );

      test('a bound need not be whole, and is not rounded', () {
        expect(randDiskSize(unit: DiskUnit.tb, minSize: 1.5, maxSize: 2.5, count: sample).toSet(), {
          '2 TB',
        });
      });

      test('256 GB, 512 GB and 1 TB are the most common, and the largest drives rare', () {
        final drives = randDiskSize(count: large);
        double share(String size) => drives.where((each) => each == size).length / drives.length;

        expect(share('256 GB') + share('512 GB') + share('1 TB'), greaterThan(0.35));
        expect(share('1 TB'), greaterThan(share('8 TB')));
        expect(share('24 TB'), lessThan(0.01));
      });

      test('the value form is the size of each detail', () {
        expect(randDiskSize(count: sample, random: Random(7)), <String>[
          for (final detail in randDiskSizeDetails(count: sample, random: Random(7))) detail.size,
        ]);
      });

      test('type keeps to the kinds named, each in the sizes it is sold in', () {
        for (final type in diskTypes) {
          for (final detail in randDiskSizeDetails(type: {type}, count: sample * 3)) {
            expect(detail.type, type);
            expect(
              diskSizes[type]!.any((each) => each.$1 * gigabyte == detail.bytes),
              isTrue,
              reason: '${detail.size} ${type.name}',
            );
          }
        }

        // No eMMC is ever 8 TB.
        expect(
          randDiskSizeDetails(
            type: {DiskType.emmc},
            count: large,
          ).every((detail) => detail.bytes <= 128 * gigabyte),
          isTrue,
        );
        expect(
          {
            for (final detail in randDiskSizeDetails(
              type: {DiskType.ssd, DiskType.hdd},
              count: sample * 3,
            ))
              detail.type,
          },
          {DiskType.hdd, DiskType.ssd},
        );
        expect(
          randDiskSizeDetails(type: {}, count: sample).any((detail) => detail.type != DiskType.hdd),
          isTrue,
          reason: 'an empty set reads as every kind',
        );
      });

      test('platform keeps to the kinds of storage its machines use', () {
        for (final platform in systemPlatforms) {
          for (final detail in randDiskSizeDetails(platform: platform, count: sample * 3)) {
            expect(detail.platform, platform);
            expect(
              diskTypeWeights[platform]!.containsKey(detail.type),
              isTrue,
              reason: detail.type.name,
            );
          }
        }

        // A kind the platform does not use is answered with nothing.
        expect(
          randDiskSize(type: {DiskType.hdd}, platform: SystemPlatform.mobile, count: 5),
          isEmpty,
        );
        expect(
          randDiskSize(type: {DiskType.ufs}, platform: SystemPlatform.desktop, count: 5),
          isEmpty,
        );
        // eMMC is both, and keeps to the platform asked for.
        expect(
          randDiskSizeDetails(
            type: {DiskType.emmc},
            platform: SystemPlatform.mobile,
            count: sample,
          ).every((detail) => detail.platform == SystemPlatform.mobile),
          isTrue,
        );
        // And a range none of the kinds is sold in, the same.
        expect(randDiskSize(type: {DiskType.emmc}, minSize: 256, count: 5), isEmpty);
      });

      test('the kind is drawn by how common it is on the platform', () {
        final desktop = randDiskSizeDetails(platform: SystemPlatform.desktop, count: large);
        int count(DiskType type) => desktop.where((detail) => detail.type == type).length;

        expect(count(DiskType.ssd), greaterThan(count(DiskType.hdd)));
        expect(count(DiskType.hdd), greaterThan(count(DiskType.sshd)));
      });

      test('unique never repeats a size, and stops when the sizes run out', () {
        final drives = randDiskSize(minSize: 256, maxSize: 2000, unique: true, count: 100);

        expect(drives.toSet(), hasLength(drives.length));
        expect(drives.toSet(), {'256 GB', '480 GB', '500 GB', '512 GB', '1 TB', '2 TB'});

        // The whole pool too, every kind of drive and every size it is sold in.
        final every = randDiskSizeDetails(unique: true, count: 100);

        expect({for (final detail in every) detail.size}, hasLength(every.length));
        expect({for (final detail in every) detail.bytes ~/ diskScale.bytes}, sizes);
      });
    });
  });
}
