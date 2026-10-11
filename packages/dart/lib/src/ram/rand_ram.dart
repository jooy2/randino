import 'dart:math';

import 'package:randino/src/ram/ram_generator.dart';
import 'package:randino/src/types.dart';

/// Generate amounts of memory a machine is really sold with.
///
/// 8 and 16 GB are the most common, the sizes of old phones and of workstations
/// the rarest. A null [unit] writes each size in the largest unit it is a whole
/// number of, a named one keeps to the sizes whole in it, and no size is ever
/// written with a decimal point. [minSize] and [maxSize] bound the sizes, in
/// [unit] or in gigabytes for a null one; a range no real size is inside
/// returns nothing. Each size comes with the kind of memory it was sold as on
/// its platform — `DDR5` in a desktop, `LPDDR5X` in a phone — which
/// [platform], [minYear] and [maxYear] narrow and [includeType] writes.
///
/// ```dart
/// randRam(); // [16 GB]
/// randRam(count: 3); // [8 GB, 16 GB, 4 GB]
/// randRam(unit: RamUnit.mb); // [8192 MB]
/// randRam(minSize: 32, includeUnit: false); // [64]
/// randRam(platform: SystemPlatform.mobile, includeType: true); // [12 GB LPDDR5X]
/// randRam(platform: SystemPlatform.desktop, maxYear: 2010, includeType: true); // [4 GB DDR3]
/// ```
List<String> randRam({
  /// The memory of desktops and laptops, or of phones and tablets; a null one
  /// draws from both. A phone's sizes stop at 24 GB, and only a desktop or a
  /// laptop is sold with `DDR` memory.
  SystemPlatform? platform,

  /// The earliest year a machine with the memory may have been sold in: only
  /// the kinds of memory still sold by then, and the sizes they came in, are
  /// drawn.
  int? minYear,

  /// The latest year a machine with the memory may have been sold in — `2010`
  /// is what was sold by the end of 2010. A range the wrong way round keeps
  /// [maxYear], and a range no kind of memory was sold in returns nothing.
  int? maxYear,
  RamUnit? unit,

  /// Write the unit after the number. Left off with a null [unit], every size
  /// is written in gigabytes, because a bare `512` and a bare `16` would
  /// otherwise be in two different units.
  bool includeUnit = true,
  num? minSize,
  num? maxSize,

  /// Write the kind of memory after the size: `16 GB DDR5` rather than
  /// `16 GB`. With `includeUnit: false` it is left out, the way the unit is:
  /// a kind of memory belongs to a size written as one, not to a bare number.
  /// The detail carries it either way.
  bool includeType = false,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateRamDetails(
    platform: platform,
    minYear: minYear,
    maxYear: maxYear,
    unit: unit,
    includeUnit: includeUnit,
    minSize: minSize,
    maxSize: maxSize,
    includeType: includeType,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.ram,
];
