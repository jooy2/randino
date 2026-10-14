// The CPU generator: a real processor, by the name its maker gave it.
//
// Nothing is invented and nothing is weighted. Every option narrows the parts a
// draw may land on, and every part left is as likely as the next.

import 'dart:math';

import 'package:randino/src/cpu/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// [entry] with its maker in front, or alone.
String writeCpu(CpuEntry entry, bool includeVendor) =>
    includeVendor ? '${entry.vendor} ${entry.model}' : entry.model;

// The parts each set of options leaves, kept so a call does not filter the
// catalog again.
final Map<String, List<Outcome<CpuEntry>>> _kept = {};

/// What `randCpu` and `randCpuDetails` both do.
List<CpuDetail> generateCpuDetails({
  SystemPlatform? platform,
  int? minYear,
  int? maxYear,
  Set<String>? vendor,
  bool includeVendor = true,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final platforms = resolvePlatforms(platform);
  final (low, high) = resolveYears(minYear, maxYear);
  // Unknown names are dropped, and a set left with none of them reads as every
  // maker, the way the npm package's `resolveMany` reads one.
  final named = {
    for (final each in cpuVendors)
      if (vendor?.contains(each) ?? false) each,
  };
  final vendors = named.isEmpty ? cpuVendors.toSet() : named;
  final outcomes = keptOutcomes<CpuEntry>(
    _kept,
    '${platforms.map((each) => each.name).join(',')}|${vendors.join(',')}|$low|$high',
    () => [
      for (final entry in cpus)
        if (platforms.contains(entry.platform) &&
            vendors.contains(entry.vendor) &&
            entry.year >= low &&
            entry.year <= high)
          (entry: entry, weight: 1.0),
    ],
  );

  return withRandom(
    random,
    () => collectFrom<CpuEntry, CpuDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      outcomes: outcomes,
      keyOf: (entry) => writeCpu(entry, includeVendor),
      build:
          (entry) => CpuDetail(
            cpu: writeCpu(entry, includeVendor),
            vendor: entry.vendor,
            model: entry.model,
            platform: entry.platform,
            year: entry.year,
          ),
    ),
  );
}
