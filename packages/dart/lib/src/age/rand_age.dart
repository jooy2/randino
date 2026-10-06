import 'dart:math';

import 'package:randino/src/age/age_generator.dart';
import 'package:randino/src/types.dart';

/// Generate ages for sample people, in whole years.
///
/// The draw follows a curve shaped like a population rather than an even
/// spread, so young adults come up far more often than children or anybody past
/// seventy. [distribution] `AgeDistribution.uniform` draws every age in the
/// range alike instead.
///
/// [minAge] defaults to `0` and [maxAge] to `100`, or to `randAgeMax` when
/// [minAge] is above 100; a range the wrong way round keeps [maxAge]. [group]
/// narrows the range to the parts of a life it names, and a null or empty set
/// is every one of them. A group with no age inside the range leaves the range
/// to answer, as though no group had been named.
///
/// ```dart
/// randAge(); // [34]
/// randAge(count: 5); // [27, 8, 41, 63, 30]
/// randAge(minAge: 18, count: 3); // [22, 45, 31]
/// randAge(group: {AgeGroup.senior}, count: 3); // [71, 66, 80]
/// ```
List<int> randAge({
  int count = 1,
  int? minAge,
  int? maxAge,
  Set<AgeGroup>? group,
  AgeDistribution distribution = AgeDistribution.population,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateAgeDetails(
    count: count,
    minAge: minAge,
    maxAge: maxAge,
    group: group,
    distribution: distribution,
    unique: unique,
    random: random,
  ))
    detail.age,
];
