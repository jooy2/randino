import 'dart:math';

import 'package:randino/src/age/age_generator.dart';
import 'package:randino/src/types.dart';

/// [randAge], along with the part of a life each age falls in.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randAgeDetails().first; // AgeDetail(16, teen)
/// ```
List<AgeDetail> randAgeDetails({
  int count = 1,
  int? minAge,
  int? maxAge,
  Set<AgeGroup>? group,
  AgeDistribution distribution = AgeDistribution.population,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateAgeDetails(
  count: count,
  minAge: minAge,
  maxAge: maxAge,
  group: group,
  distribution: distribution,
  unique: unique,
  random: random,
);
