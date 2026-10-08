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
