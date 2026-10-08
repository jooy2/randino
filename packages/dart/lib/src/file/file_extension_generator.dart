// The file extension generator: an extension files are really saved with, the
// common ones most often.

import 'dart:math';

import 'package:randino/src/file/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// What `randFileExtension` and `randFileExtensionDetails` both do.
List<FileExtensionDetail> generateFileExtensionDetails({
  Set<FileCategory>? category,
  bool includeDot = true,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final categories = category == null || category.isEmpty ? fileCategories : category;
  final dot = includeDot ? '.' : '';
  // Worked out once per call rather than per draw.
  final candidates = [
    for (final entry in fileExtensions)
      if (categories.contains(entry.category)) entry,
  ];

  return withRandom(
    random,
    () => collect<FileExtensionDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      draw: () {
        final entry = pickWeighted(candidates, (each) => each.weight);

        return FileExtensionDetail(
          extension: '$dot${entry.name}',
          name: entry.name,
          category: entry.category,
          mimeType: entry.mimeType,
        );
      },
      keyOf: (detail) => detail.extension,
    ),
  );
}
