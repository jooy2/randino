import 'package:randino/src/internal/capacity.dart';
import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/types.dart';

/// Every unit memory is written in, smallest first.
const List<RamUnit> ramUnits = <RamUnit>[RamUnit.mb, RamUnit.gb];

/// Every kind of memory, the desktop ones first, each line oldest first.
///
/// `DDR` to `DDR5` in desktops and laptops, and the low-power `LPDDR` to
/// `LPDDR5X` soldered into phones, tablets and thin laptops, each by the name
/// of the JEDEC standard it is built to. `LPDDR` is the first of them, once
/// called Mobile DDR. Names rather than an enum, the way the makers are.
const List<String> ramTypes = <String>[
  'DDR',
  'DDR2',
  'DDR3',
  'DDR4',
  'DDR5',
  'LPDDR',
  'LPDDR2',
  'LPDDR3',
  'LPDDR4',
  'LPDDR4X',
  'LPDDR5',
  'LPDDR5X',
];

/// How memory is measured: in powers of two, as an operating system reports
/// it. Internal.
const CapacityScale<RamUnit> ramScale = CapacityScale<RamUnit>(
  units: ramUnits,
  step: 1024,
  base: RamUnit.mb,
  reference: RamUnit.gb,
  bytes: 1024 * 1024,
);

/// Every amount of memory a machine of each platform is sold with, in
/// megabytes, and how often each one comes up. Internal.
///
/// The weights are written by hand in the order the sizes are common in, not
/// measured from any one survey: 8 and 16 GB are most of a sample, 4 and 32 GB
/// after them, the sizes of the oldest machines and of workstations rare. The
/// odd ones are real too — 3 and 6 GB phones, 18 and 36 GB Macs, 24 and 48 GB
/// laptops with two unequal modules. A phone's stop at 24 GB.
const Map<SystemPlatform, CapacityPool> ramSizes = <SystemPlatform, CapacityPool>{
  SystemPlatform.desktop: <(int, num)>[
    (512, 1),
    (1024, 2),
    (2048, 4),
    (3072, 1),
    (4096, 10),
    (6144, 1),
    (8192, 24),
    (12288, 2),
    (16384, 26),
    (18432, 1),
    (24576, 4),
    (32768, 14),
    (36864, 1),
    (49152, 2),
    (65536, 6),
    (98304, 1),
    (131072, 2),
    (196608, 0.3),
    (262144, 0.3),
    (524288, 0.2),
    (1048576, 0.1),
  ],
  SystemPlatform.mobile: <(int, num)>[
    (512, 2),
    (1024, 4),
    (2048, 8),
    (3072, 8),
    (4096, 14),
    (6144, 14),
    (8192, 22),
    (12288, 16),
    (16384, 8),
    (18432, 0.5),
    (24576, 1),
  ],
};

/// A size a kind of memory came in, in megabytes, and the first year a machine
/// of the platform was sold with that much of it — the kind's own first year
/// unless the size came later. Internal.
typedef RamTypeSize = ({int size, int from});

/// One kind of memory, on one platform. Internal.
class RamTypeEntry {
  /// Creates an entry.
  const RamTypeEntry({
    required this.type,
    required this.platform,
    required this.from,
    required this.to,
    required this.weight,
    required this.sizes,
  });

  /// The kind of memory: `DDR5`, `LPDDR5X`. One of [ramTypes].
  final String type;

  /// The kind of machine it is found on.
  final SystemPlatform platform;

  /// The first year machines of the platform were sold with it.
  final int from;

  /// The last year they were, or null while they still are.
  final int? to;

  /// How often it comes up beside the other kinds of the platform, out of a
  /// hundred.
  final num weight;

  /// The sizes machines of the platform were sold with in it, smallest first.
  final List<RamTypeSize> sizes;
}

/// Every kind of memory, with the platform it is found on, the years machines
/// were sold with it new, and the sizes they came in, one per row: `type |
/// platform | from | to | weight | sizes in gigabytes`. Internal.
///
/// `to` is empty while machines are still sold with it. A size that came later
/// than the kind itself carries its own first year, `512@2013`: a year range
/// keeps to the sizes out by then as well as to the kinds, so a desktop of 2010
/// is never handed a workstation's half a terabyte of DDR3. The year of a kind
/// and of each size is the first one a maker's own spec sheet shows — Apple's
/// tech specs, Lenovo's PSREF, HP's QuickSpecs, a phone maker's specification
/// page — and a size no spec sheet showed in a kind is left out of it rather
/// than guessed at. The years are those the standard was in new machines, from
/// the first that shipped with it to the point its successor had replaced it in
/// all but a few: DDR4 from Intel's Haswell-E in 2014, DDR5 from Alder Lake in
/// 2021, LPDDR5X from the phones of late 2022. A laptop built on a phone's
/// memory — a MacBook Air, a Snapdragon laptop — is under `desktop`, with the
/// sizes laptops came in. The weights are written by hand in the order the
/// kinds are common in among the machines in use now, so DDR4 and DDR5 lead the
/// desktops and LPDDR4X and LPDDR5 the phones.
final List<RamTypeEntry> ramTypeEntries = List<RamTypeEntry>.unmodifiable(
  rows(r'''
  DDR     | desktop | 2000 | 2006 | 1  | 0.5@2002 1@2002 2@2002
  DDR2    | desktop | 2004 | 2010 | 2  | 0.5@2005 1@2005 2@2005 3@2006 4@2005 8@2005
  DDR3    | desktop | 2008 | 2017 | 8  | 1@2009 2 3@2009 4 6@2009 8@2009 12@2009 16@2009 24@2010 32@2009 48@2012 64@2012 128@2013 256@2013 512@2013
  DDR4    | desktop | 2014 |      | 34 | 4 8 12@2015 16 24@2016 32 48@2017 64 96@2017 128 192 256 512 1024@2015
  DDR5    | desktop | 2021 |      | 30 | 8 16 24@2022 32 48@2023 64 96@2023 128 192@2023 256@2023 512@2023 1024@2024
  LPDDR3  | desktop | 2013 | 2020 | 2  | 4 8 16@2014
  LPDDR4X | desktop | 2018 |      | 6  | 4 8 16@2019 32@2019
  LPDDR5  | desktop | 2021 |      | 8  | 8@2022 16 18@2023 24@2022 32 36@2023 48@2023 64 96@2023 128@2022 192@2023 256@2025 512@2025
  LPDDR5X | desktop | 2023 |      | 9  | 8@2024 16 24@2024 32 36@2024 48@2024 64 96@2026 128@2024

  LPDDR   | mobile  | 2010 | 2011 | 1  | 0.5
  LPDDR2  | mobile  | 2011 | 2015 | 3  | 0.5 1 2@2012
  LPDDR3  | mobile  | 2013 | 2018 | 6  | 1 2 3 4@2015
  LPDDR4  | mobile  | 2015 | 2020 | 10 | 2 3 4 6@2016
  LPDDR4X | mobile  | 2017 |      | 30 | 2 3 4 6 8 12@2019
  LPDDR5  | mobile  | 2020 |      | 25 | 6 8 12 16 18@2021
  LPDDR5X | mobile  | 2022 |      | 25 | 8 12 16 24@2023
''').map(
    (row) => RamTypeEntry(
      type: row[0],
      platform: SystemPlatform.values.byName(row[1]),
      from: int.parse(row[2]),
      to: row[3].isEmpty ? null : int.parse(row[3]),
      weight: num.parse(row[4]),
      sizes: List<RamTypeSize>.unmodifiable(
        row[5].split(RegExp(r'\s+')).where((cell) => cell.isNotEmpty).map((cell) {
          final parts = cell.split('@');

          return (
            size: (num.parse(parts[0]) * 1024).toInt(),
            from: parts.length > 1 ? int.parse(parts[1]) : int.parse(row[2]),
          );
        }),
      ),
    ),
  ),
);
