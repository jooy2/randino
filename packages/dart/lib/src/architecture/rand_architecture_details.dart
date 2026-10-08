import 'dart:math';

import 'package:randino/src/architecture/architecture_generator.dart';
import 'package:randino/src/types.dart';

/// [randArchitecture], along with the other names, the width and the line of
/// each architecture.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randArchitectureDetails().first; // ArchitectureDetail(x86_64, 64)
/// ```
List<ArchitectureDetail> randArchitectureDetails({
  bool includeRare = false,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateArchitectureDetails(
  includeRare: includeRare,
  count: count,
  unique: unique,
  random: random,
);
