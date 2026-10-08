import 'package:randino/src/internal/capacity.dart';
import 'package:randino/src/types.dart';

/// Every unit memory is written in, smallest first.
const List<RamUnit> ramUnits = <RamUnit>[RamUnit.mb, RamUnit.gb];

/// Every amount of memory a phone, a laptop, a desktop or a workstation is sold
/// with, in megabytes, and how often each one comes up. Internal.
///
/// The weights are written by hand in the order the sizes are common in, not
/// measured from any one survey: 8 and 16 GB are most of a sample, 4 and 32 GB
/// after them, the sizes of older phones and of workstations rare. The odd ones
/// are real too — 3 and 6 GB phones, 18 and 36 GB Macs, 24 and 48 GB laptops
/// with two unequal modules.
const CapacityScale<RamUnit> ramScale = CapacityScale<RamUnit>(
  units: ramUnits,
  step: 1024,
  base: RamUnit.mb,
  reference: RamUnit.gb,
  bytes: 1024 * 1024,
  pool: <(int, num)>[
    (512, 2),
    (1024, 3),
    (2048, 5),
    (3072, 4),
    (4096, 12),
    (6144, 8),
    (8192, 24),
    (12288, 10),
    (16384, 22),
    (18432, 1),
    (24576, 4),
    (32768, 12),
    (36864, 1),
    (49152, 2),
    (65536, 5),
    (98304, 1),
    (131072, 2),
    (196608, 0.3),
    (262144, 0.3),
    (524288, 0.2),
    (1048576, 0.1),
  ],
);
