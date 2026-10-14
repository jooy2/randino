// The file extension generator: an extension files are really saved with, the
// common ones most often.

import 'dart:math';

import 'package:randino/src/file/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

// The extensions each set of options leaves, kept so a call does not filter the
// table again.
final Map<String, List<Outcome<FileExtensionEntry>>> _kept = {};

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
  final outcomes = keptOutcomes<FileExtensionEntry>(
    _kept,
    categories.map((each) => each.name).join(','),
    () => [
      for (final entry in fileExtensions)
        if (categories.contains(entry.category)) (entry: entry, weight: entry.weight.toDouble()),
    ],
  );

  return withRandom(
    random,
    () => collectFrom<FileExtensionEntry, FileExtensionDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      outcomes: outcomes,
      keyOf: (entry) => '$dot${entry.name}',
      build:
          (entry) => FileExtensionDetail(
            extension: '$dot${entry.name}',
            name: entry.name,
            category: entry.category,
            mimeType: entry.mimeType,
          ),
    ),
  );
}
