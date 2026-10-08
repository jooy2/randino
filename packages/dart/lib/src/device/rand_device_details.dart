import 'dart:math';

import 'package:randino/src/device/device_generator.dart';
import 'package:randino/src/types.dart';

/// [randDevice], along with the maker, the model, the kind and the year of each
/// device.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randDeviceDetails().first; // DeviceDetail(Google Pixel 8, phone, 2023)
/// ```
List<DeviceDetail> randDeviceDetails({
  Set<DeviceType>? type,
  int? minYear,
  int? maxYear,
  bool includeVendor = true,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateDeviceDetails(
  type: type,
  minYear: minYear,
  maxYear: maxYear,
  includeVendor: includeVendor,
  count: count,
  unique: unique,
  random: random,
);
