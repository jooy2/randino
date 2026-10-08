import 'dart:math';

import 'package:randino/src/device/device_generator.dart';
import 'package:randino/src/types.dart';

/// Generate real phones, tablets and laptops, by the names their makers gave
/// them.
///
/// Every model is one that came out, written with its generation or year where
/// the line is told apart by one: `iPad (10th generation)`, `ThinkPad X1 Carbon
/// Gen 11`, `MacBook Air (M2, 2022)`. A null or empty [type] draws every kind,
/// and [minYear] and [maxYear] keep to the models released in those years.
///
/// ```dart
/// randDevice(); // [Samsung Galaxy S24 Ultra]
/// randDevice(type: {DeviceType.laptop}, count: 2); // [Lenovo ThinkPad T14 Gen 3, Apple MacBook Air (M2, 2022)]
/// randDevice(type: {DeviceType.phone}, includeVendor: false); // [Pixel 8 Pro]
/// randDevice(type: {DeviceType.phone, DeviceType.tablet}, maxYear: 2012); // [Apple iPad 2]
/// ```
List<String> randDevice({
  Set<DeviceType>? type,
  int? minYear,
  int? maxYear,

  /// Write the maker in front of the model. A model whose name already opens
  /// on its maker's is written the same either way.
  bool includeVendor = true,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateDeviceDetails(
    type: type,
    minYear: minYear,
    maxYear: maxYear,
    includeVendor: includeVendor,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.device,
];
