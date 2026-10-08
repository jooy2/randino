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
  bool includeVendor = true,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final types = type == null || type.isEmpty ? deviceTypes : type;
  final (low, high) = resolveYears(minYear, maxYear);
  // Worked out once per call rather than per draw: a call of ten thousand would
  // otherwise filter the catalog ten thousand times.
  final candidates = <DeviceEntry>[
    for (final entry in devices)
      if (types.contains(entry.type) && entry.year >= low && entry.year <= high) entry,
  ];

  return withRandom(
    random,
    () => collect<DeviceDetail>(
      count: candidates.isEmpty ? 0 : count,
      unique: unique,
      startsWith: '',
      draw: () {
        final entry = pick(candidates);

        return DeviceDetail(
          device: writeDevice(entry, includeVendor),
          vendor: entry.vendor,
          model: entry.model,
          type: entry.type,
          year: entry.year,
        );
      },
      keyOf: (detail) => detail.device,
    ),
  );
}
