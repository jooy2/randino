import 'dart:math';

import 'package:randino/src/file/file_extension_generator.dart';
import 'package:randino/src/types.dart';

/// Generate file extensions files are really saved with: `.pdf`, `.png`, `.mp4`.
///
/// The extensions nearly everybody meets come up most often, and the ones only
/// a few programs write rarely. A null or empty [category] draws every kind of
/// file.
///
/// ```dart
/// randFileExtension(); // [.pdf]
/// randFileExtension(category: {FileCategory.image}, count: 3); // [.png, .jpg, .webp]
/// randFileExtension(category: {FileCategory.code, FileCategory.data}, includeDot: false, count: 2); // [js, json]
/// ```
List<String> randFileExtension({
  Set<FileCategory>? category,

  /// Write the dot in front: `.png` rather than `png`.
  bool includeDot = true,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateFileExtensionDetails(
    category: category,
    includeDot: includeDot,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.extension,
];
