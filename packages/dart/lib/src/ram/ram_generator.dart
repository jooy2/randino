// The RAM generator: an amount of memory a machine is really sold with, in a
// unit it is a whole number of, and the kind of memory it was sold as.

import 'dart:math';

import 'package:randino/src/internal/capacity.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/ram/data/index.dart';
import 'package:randino/src/types.dart';

/// A size one call may land on, with the kinds of memory it was sold as.
typedef _Candidate = ({CapacityCandidate<RamUnit> size, List<RamTypeEntry> types});

/// One result a call may land on: a size on a platform, and the kind of memory
/// it was sold as.
typedef _Drawn = ({SystemPlatform platform, CapacityCandidate<RamUnit> size, String type});

/// [capacity] with the kind of memory after it where the call asked for it.
String writeRam(String capacity, String type, bool includeType) =>
    includeType ? '$capacity $type' : capacity;

/// The sizes [platform] may land on, each with the kinds of memory sold at it
/// on that platform in the years asked for.
List<_Candidate> _sizesFor(
  SystemPlatform platform,
  (int, int) years,
  RamUnit? unit,
  num? minSize,
  num? maxSize,
) {
  final (minYear, maxYear) = years;
  // A kind is in when it was sold at any point of the range.
  final types = <RamTypeEntry>[
    for (final entry in ramTypeEntries)
      if (entry.platform == platform && entry.from <= maxYear && (entry.to ?? maxYear) >= minYear)
        entry,
  ];

  return <_Candidate>[
    for (final candidate in capacityCandidates(
      ramScale,
      ramSizes[platform]!,
      unit,
      minSize,
      maxSize,
    ))
      (
        size: candidate,
        // A kind is in at a size when that size was out by the end of the range.
        types: types
            .where(
              (entry) =>
                  entry.sizes.any((each) => each.size == candidate.size && each.from <= maxYear),
            )
            .toList(growable: false),
      ),
  ].where((candidate) => candidate.types.isNotEmpty).toList(growable: false);
}

/// What `randRam` and `randRamDetails` both do.
List<RamDetail> generateRamDetails({
  SystemPlatform? platform,
  int? minYear,
  int? maxYear,
  RamUnit? unit,
  bool includeUnit = true,
  num? minSize,
  num? maxSize,
  bool includeType = false,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  // Without the unit there is nothing to tell `512` megabytes from `16`
  // gigabytes, so a size written bare is in one unit throughout.
  final written = unit ?? (includeUnit ? null : ramScale.reference);
  final years = resolveYears(minYear, maxYear);
  // The sizes each platform may land on, worked out once per call. A platform
  // left with no size is left out, so a null platform never draws one it then
  // has nothing to write for.
  final candidates = [
    for (final each in resolvePlatforms(platform))
      (platform: each, sizes: _sizesFor(each, years, written, minSize, maxSize)),
  ].where((each) => each.sizes.isNotEmpty).toList(growable: false);

  // The platform first, so a null one is half desktops and half phones, then
  // the size, then the kind of memory that size was sold as.
  final outcomes = <Outcome<_Drawn>>[];

  for (final (platform: each, :sizes) in candidates) {
    final sizeShares = shares(sizes, (candidate) => candidate.size.weight);

    for (final (at, candidate) in sizes.indexed) {
      for (final (index, share) in shares(candidate.types, (entry) => entry.weight).indexed) {
        outcomes.add((
          entry: (platform: each, size: candidate.size, type: candidate.types[index].type),
          weight: sizeShares[at] * share / candidates.length,
        ));
      }
    }
  }

  // A kind of memory belongs to a size written as a size, so a bare number goes
  // without it, the way `randOs` drops the build along with the version.
  String write(_Drawn drawn) => writeRam(
    writeCapacity(drawn.size.value, drawn.size.unit.label, includeUnit),
    drawn.type,
    includeUnit && includeType,
  );

  return withRandom(
    random,
    () => collectFrom<_Drawn, RamDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      outcomes: outcomes,
      keyOf: write,
      build:
          (drawn) => RamDetail(
            ram: write(drawn),
            value: drawn.size.value,
            unit: drawn.size.unit,
            bytes: drawn.size.size * ramScale.bytes,
            type: drawn.type,
            platform: drawn.platform,
          ),
    ),
  );
}
