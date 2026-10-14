// The device generator: a real phone, tablet or laptop, by the name its maker
// gave it.
//
// Nothing is invented and nothing is weighted. Every option narrows the models
// a draw may land on, and every model left is as likely as the next.

import 'dart:math';

import 'package:randino/src/device/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// [entry] with its maker in front, unless the model already opens on the
/// maker's name: `Xiaomi 14` and `OnePlus 12` are never written with the maker
/// twice.
String writeDevice(DeviceEntry entry, bool includeVendor) =>
    includeVendor && !entry.model.startsWith(entry.vendor)
        ? '${entry.vendor} ${entry.model}'
        : entry.model;

/// What `randDevice` and `randDeviceDetails` both do.
List<DeviceDetail> generateDeviceDetails({
  Set<DeviceType>? type,
  int? minYear,
  int? maxYear,
  Set<String>? vendor,
  bool includeVendor = true,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final types = type == null || type.isEmpty ? deviceTypes : type;
  final (low, high) = resolveYears(minYear, maxYear);
  // Unknown names are dropped, and a set left with none of them reads as every
  // maker, the way the npm package's `resolveMany` reads one.
  final named = {
    for (final each in deviceVendors)
      if (vendor?.contains(each) ?? false) each,
  };
  final vendors = named.isEmpty ? deviceVendors.toSet() : named;
  // Worked out once per call rather than per draw: a call of ten thousand would
  // otherwise filter the catalog ten thousand times.
  final candidates = <DeviceEntry>[
    for (final entry in devices)
      if (types.contains(entry.type) &&
          vendors.contains(entry.vendor) &&
          entry.year >= low &&
          entry.year <= high)
        entry,
  ];

  return withRandom(
    random,
    () => collectFrom(
      count: count,
      unique: unique,
      startsWith: '',
      outcomes: [for (final entry in candidates) (entry: entry, weight: 1.0)],
      keyOf: (entry) => writeDevice(entry, includeVendor),
      build:
          (entry) => DeviceDetail(
            device: writeDevice(entry, includeVendor),
            vendor: entry.vendor,
            model: entry.model,
            type: entry.type,
            year: entry.year,
          ),
    ),
  );
}
