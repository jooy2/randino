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

/// How storage is measured: in powers of ten, the way a drive is sold.
/// Internal.
const CapacityScale<DiskUnit> diskScale = CapacityScale<DiskUnit>(
  units: diskUnits,
  step: 1000,
  base: DiskUnit.gb,
  reference: DiskUnit.gb,
  bytes: 1000 * 1000 * 1000,
);

/// Every capacity each kind of storage is sold in, in gigabytes, and how often
/// each one comes up beside the others of that kind. Internal.
///
/// A kind is sold in sizes of its own, so a size is drawn from the kind's pool
/// rather than from every size there is: a hard disk is the only kind past
/// 8 TB, an eMMC chip stops at 128 GB, and the 120, 240 and 480 GB of the first
/// SATA SSDs are an SSD's alone. The weights are written by hand in the order
/// the sizes are common in, not measured from any one survey: 512 GB and 1 TB
/// lead the SSDs, 1 and 2 TB the hard disks, 128 and 256 GB the phones.
const Map<DiskType, CapacityPool> diskSizes = <DiskType, CapacityPool>{
  DiskType.hdd: <(int, num)>[
    (120, 1),
    (250, 3),
    (500, 10),
    (1000, 18),
    (2000, 12),
    (3000, 3),
    (4000, 8),
    (6000, 3),
    (8000, 4),
    (10000, 1.5),
    (12000, 1.5),
    (14000, 1),
    (16000, 1),
    (18000, 1),
    (20000, 1),
    (22000, 0.5),
    (24000, 0.5),
  ],
  DiskType.ssd: <(int, num)>[
    (32, 0.5),
    (64, 1),
    (120, 2),
    (128, 6),
    (240, 3),
    (250, 4),
    (256, 18),
    (480, 3),
    (500, 8),
    (512, 22),
    (1000, 22),
    (2000, 8),
    (4000, 2),
    (8000, 0.5),
  ],
  DiskType.sshd: <(int, num)>[(250, 1), (500, 4), (1000, 8), (2000, 4), (3000, 1), (4000, 0.5)],
  DiskType.emmc: <(int, num)>[(16, 4), (32, 8), (64, 8), (128, 4)],
  DiskType.ufs: <(int, num)>[(32, 1), (64, 4), (128, 16), (256, 20), (512, 10), (1000, 3)],
};
