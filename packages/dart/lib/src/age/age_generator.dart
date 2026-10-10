// The age generator: a whole number of years, drawn along a curve shaped like a
// population rather than evenly over every age a person can be.
//
// Every option narrows the ages a draw may land on, and the curve says how
// likely each of them is. Nothing is fitted afterwards, so an age is always one
// the caller's range and groups allow.

import 'dart:math';

import 'package:randino/src/age/data/index.dart';
import 'package:randino/src/constants.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// How common [age] is on the curve, read off the straight line between the two
/// points around it.
double curveWeight(int age) {
  for (var i = 1; i < ageCurve.length; i += 1) {
    final (from, low) = ageCurve[i - 1];
    final (to, high) = ageCurve[i];

    if (age <= to) {
      return low + (high - low) * (age - from) / (to - from);
    }
  }

  return 0;
}

/// The group [age] falls in. The bands cover every age, so one always answers.
AgeGroup groupOf(int age) =>
    ageGroups.firstWhere((group) => age <= ageBands[group]!.$2, orElse: () => AgeGroup.senior);

/// The ages one call may land on, each with how likely it is.
///
/// Worked out once per call rather than per draw: it is at most a hundred and
/// twenty-one entries, and a call of ten thousand would otherwise read the curve
/// a million times over.
List<(int, double)> _candidates({
  required int? minAge,
  required int? maxAge,
  required Set<AgeGroup>? group,
  required AgeDistribution distribution,
}) {
  final asked = clampInt(minAge ?? 0, 0, randAgeMax);
  // Left out, `maxAge` is 100 — unless `minAge` is already past it, which asks
  // for the oldest ages there are rather than contradicting a bound nobody
  // wrote.
  final high = clampInt(
    maxAge ?? (asked > ageMaxDefault ? randAgeMax : ageMaxDefault),
    0,
    randAgeMax,
  );
  // A range the wrong way round keeps `maxAge`, the same way a length range
  // keeps `maxLength`: it is the bound a caller is usually holding to.
  final low = asked < high ? asked : high;
  final groups = group == null || group.isEmpty ? ageGroups.toSet() : group;
  final inRange = <int>[for (var age = low; age <= high; age += 1) age];
  final grouped = inRange.where((age) => groups.contains(groupOf(age))).toList();
  // A group the range has no age of cannot be answered inside it, and the range
  // is the harder ask: it is a number the caller wrote, where a group is a name
  // for one. So the range wins, as though no group had been named.
  final ages = grouped.isNotEmpty ? grouped : inRange;
  final uniform = distribution == AgeDistribution.uniform;

  return <(int, double)>[for (final age in ages) (age, uniform ? 1.0 : curveWeight(age))];
}

/// What `randAge` and `randAgeDetails` both do.
List<AgeDetail> generateAgeDetails({
  int count = 1,
  int? minAge,
  int? maxAge,
  Set<AgeGroup>? group,
  AgeDistribution distribution = AgeDistribution.population,
  bool unique = false,
  Random? random,
}) {
  final candidates = _candidates(
    minAge: minAge,
    maxAge: maxAge,
    group: group,
    distribution: distribution,
  );
  // A unique call takes each age out once it is drawn, which deals the same odds
  // as drawing again on a repeat and stops when the ages run out, rather than
  // spending the whole attempt budget on repeats. An age the curve gives no
  // weight is left out of it, since a repeat would never have reached that age
  // either.
  final weighted = candidates.where((candidate) => candidate.$2 > 0).toList();
  final left = unique ? (weighted.isNotEmpty ? weighted : candidates.toList()) : candidates;
  final wanted = unique ? min(resolveCount(count), left.length) : count;

  return withRandom(
    random,
    () => collect<AgeDetail>(
      count: wanted,
      unique: unique,
      startsWith: '',
      draw: () {
        final drawn = pickWeighted(left, (candidate) => candidate.$2);

        if (unique) {
          left.remove(drawn);
        }

        return AgeDetail(age: drawn.$1, group: groupOf(drawn.$1));
      },
      keyOf: (detail) => '${detail.age}',
    ),
  );
}
