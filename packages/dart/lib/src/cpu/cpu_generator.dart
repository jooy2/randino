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
  // Worked out once per call rather than per draw: a call of ten thousand would
  // otherwise filter the catalog ten thousand times.
  final candidates = <CpuEntry>[
    for (final entry in cpus)
      if (platforms.contains(entry.platform) &&
          vendors.contains(entry.vendor) &&
          entry.year >= low &&
          entry.year <= high)
        entry,
  ];

  return withRandom(
    random,
    () => collect<CpuDetail>(
      count: candidates.isEmpty ? 0 : count,
      unique: unique,
      startsWith: '',
      draw: () {
        final entry = pick(candidates);

        return CpuDetail(
          cpu: writeCpu(entry, includeVendor),
          vendor: entry.vendor,
          model: entry.model,
          platform: entry.platform,
          year: entry.year,
        );
      },
      keyOf: (detail) => detail.cpu,
    ),
  );
}
