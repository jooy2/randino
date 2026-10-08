import 'dart:math';

import 'package:randino/src/file/mime_type_generator.dart';
import 'package:randino/src/types.dart';

/// [randMimeType], along with each type's parts and the extensions it is saved
/// with.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randMimeTypeDetails().first; // MimeTypeDetail(image/jpeg)
/// ```
List<MimeTypeDetail> randMimeTypeDetails({
  Set<MimeTopLevel>? type,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateMimeTypeDetails(type: type, count: count, unique: unique, random: random);
