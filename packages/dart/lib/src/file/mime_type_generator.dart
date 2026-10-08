// The MIME type generator: a type files are really served as, drawn by how
// common its most common extension is.

import 'dart:math';

import 'package:randino/src/file/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// What `randMimeType` and `randMimeTypeDetails` both do.
List<MimeTypeDetail> generateMimeTypeDetails({
  Set<MimeTopLevel>? type,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final types = type == null || type.isEmpty ? mimeTopLevels : type;
  // Worked out once per call rather than per draw.
  final candidates = [
    for (final entry in mimeTypeEntries)
      if (types.contains(entry.type)) entry,
  ];

  return withRandom(
    random,
    () => collect<MimeTypeDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      draw: () {
        final entry = pickWeighted(candidates, (each) => each.weight);

        return MimeTypeDetail(
          mimeType: entry.mimeType,
          type: entry.type,
          subtype: entry.subtype,
          extensions: entry.extensions,
        );
      },
      keyOf: (detail) => detail.mimeType,
    ),
  );
}
