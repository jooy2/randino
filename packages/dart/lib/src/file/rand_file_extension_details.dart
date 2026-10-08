import 'dart:math';

import 'package:randino/src/file/file_extension_generator.dart';
import 'package:randino/src/types.dart';

/// [randFileExtension], along with what kind of file each extension is.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randFileExtensionDetails().first; // FileExtensionDetail(.png, image)
/// ```
List<FileExtensionDetail> randFileExtensionDetails({
  Set<FileCategory>? category,
  bool includeDot = true,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateFileExtensionDetails(
  category: category,
  includeDot: includeDot,
  count: count,
  unique: unique,
  random: random,
);
