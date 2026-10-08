import 'dart:math';

import 'package:randino/src/file/mime_type_generator.dart';
import 'package:randino/src/types.dart';

/// Generate MIME types files are really served as: `application/pdf`,
/// `image/png`, `video/mp4`.
///
/// They are the types `randFileExtension`'s extensions carry, once each, and a
/// type is as common as its most common extension. A null or empty [type]
/// draws every top-level type.
///
/// ```dart
/// randMimeType(); // [application/pdf]
/// randMimeType(type: {MimeTopLevel.image}, count: 3); // [image/png, image/jpeg, image/webp]
/// ```
List<String> randMimeType({
  /// Which top-level types, the part in front of the slash.
  Set<MimeTopLevel>? type,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateMimeTypeDetails(
    type: type,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.mimeType,
];
