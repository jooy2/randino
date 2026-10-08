import 'package:randino/src/internal/capacity.dart';
import 'package:randino/src/types.dart';

/// Every kind of storage, in the order the catalog lists them.
const List<DiskType> diskTypes = <DiskType>[
  DiskType.hdd,
  DiskType.ssd,
  DiskType.sshd,
  DiskType.emmc,
  DiskType.ufs,
];

/// How each kind of storage is written: the label a spec sheet uses, and the
/// name behind it. Internal.
const Map<DiskType, ({String label, String name})> diskTypeLabels =
    <DiskType, ({String label, String name})>{
      DiskType.hdd: (label: 'HDD', name: 'Hard Disk Drive'),
      DiskType.ssd: (label: 'SSD', name: 'Solid State Drive'),
      DiskType.sshd: (label: 'SSHD', name: 'Solid State Hybrid Drive'),
      DiskType.emmc: (label: 'eMMC', name: 'Embedded MultiMediaCard'),
      DiskType.ufs: (label: 'UFS', name: 'Universal Flash Storage'),
    };

/// How often each kind of storage comes up on each platform, out of a hundred.
/// Internal.
///
/// Written by hand in the order the kinds are common in, not measured from any
/// one survey: an SSD is most desktops and laptops now and a hard disk most of
/// the rest, while a phone or a tablet stores to UFS or, older and cheaper, to
/// eMMC — which is also what a low-cost laptop is built with. A null platform
/// picks the platform first, so the two come up about evenly.
const Map<SystemPlatform, Map<DiskType, int>> diskTypeWeights =
    <SystemPlatform, Map<DiskType, int>>{
      SystemPlatform.desktop: <DiskType, int>{
        DiskType.ssd: 62,
        DiskType.hdd: 33,
        DiskType.sshd: 3,
        DiskType.emmc: 2,
      },
      SystemPlatform.mobile: <DiskType, int>{DiskType.ufs: 70, DiskType.emmc: 30},
    };

/// Every unit storage is written in, smallest first.
const List<DiskUnit> diskUnits = <DiskUnit>[DiskUnit.mb, DiskUnit.gb, DiskUnit.tb];

/// Every capacity a drive or a phone's storage is sold with, in gigabytes, and
/// how often each one comes up. Internal.
///
/// The weights are written by hand in the order the sizes are common in, not
/// measured from any one survey: 256 GB, 512 GB and 1 TB are most of a sample,
/// the small flash of an old phone and the largest hard disks rare. The SATA
/// sizes of the first SSDs (120, 240 and 480 GB) and the 250 and 500 GB of the
/// hard disks beside them are in too.
const CapacityScale<DiskUnit> diskScale = CapacityScale<DiskUnit>(
  units: diskUnits,
  step: 1000,
  base: DiskUnit.gb,
  reference: DiskUnit.gb,
  bytes: 1000 * 1000 * 1000,
  pool: <(int, num)>[
    (16, 1),
    (32, 2),
    (64, 4),
    (120, 2),
    (128, 8),
    (240, 3),
    (250, 3),
    (256, 16),
    (480, 3),
    (500, 8),
    (512, 18),
    (1000, 18),
    (2000, 10),
    (3000, 2),
    (4000, 6),
    (6000, 2),
    (8000, 3),
    (10000, 1),
    (12000, 1),
    (14000, 0.5),
    (16000, 0.5),
    (18000, 0.5),
    (20000, 0.5),
    (22000, 0.3),
    (24000, 0.3),
  ],
);
