// The MIME type generator: a type files are really served as, drawn by how
// common its most common extension is.

import 'dart:math';

import 'package:randino/src/file/data/index.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

// The types each set of options leaves, kept so a call does not filter the
// table again.
final Map<String, List<Outcome<MimeTypeEntry>>> _kept = {};

/// What `randMimeType` and `randMimeTypeDetails` both do.
List<MimeTypeDetail> generateMimeTypeDetails({
  Set<MimeTopLevel>? type,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final types = type == null || type.isEmpty ? mimeTopLevels : type;
  final outcomes = keptOutcomes<MimeTypeEntry>(
    _kept,
    types.map((each) => each.name).join(','),
    () => [
      for (final entry in mimeTypeEntries)
        if (types.contains(entry.type)) (entry: entry, weight: entry.weight.toDouble()),
    ],
  );

  return withRandom(
    random,
    () => collectFrom<MimeTypeEntry, MimeTypeDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      outcomes: outcomes,
      keyOf: (entry) => entry.mimeType,
      build:
          (entry) => MimeTypeDetail(
            mimeType: entry.mimeType,
            type: entry.type,
            subtype: entry.subtype,
            extensions: entry.extensions,
          ),
    ),
  );
}
