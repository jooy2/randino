import 'package:randino/src/constants.dart';
import 'package:randino/src/types.dart';

/// The groups an age can fall in, youngest first.
final List<AgeGroup> ageGroups = List<AgeGroup>.unmodifiable(<AgeGroup>[
  AgeGroup.child,
  AgeGroup.teen,
  AgeGroup.adult,
  AgeGroup.senior,
]);

/// The ages each group covers, both ends included. Internal.
///
/// They meet without a gap and run from `0` to [randAgeMax], so every age the
/// generator can return is in exactly one of them.
const Map<AgeGroup, (int, int)> ageBands = <AgeGroup, (int, int)>{
  AgeGroup.child: (0, 12),
  AgeGroup.teen: (13, 19),
  AgeGroup.adult: (20, 64),
  AgeGroup.senior: (65, randAgeMax),
};

/// How many people are a given age, relative to the most common ages, as
/// `(age, weight)` points: every age between two points is drawn on the
/// straight line between them. Internal.
///
/// It is the shape of a population rather than any one country's census, and it
/// is written by hand rather than measured — see the JavaScript package's
/// `age/data/index.ts` for the shares it works out to.
const List<(int, double)> ageCurve = <(int, double)>[
  (0, 35),
  (10, 55),
  (18, 80),
  (25, 100),
  (35, 100),
  (45, 85),
  (55, 75),
  (65, 60),
  (70, 50),
  (75, 30),
  (80, 18),
  (85, 9),
  (90, 4),
  (95, 1),
  (100, 0.3),
  (110, 0.02),
  (randAgeMax, 0),
];

/// What `maxAge` is when it is left out: a centenarian is already a rare draw.
/// A `minAge` above it moves the default to [randAgeMax] instead. Internal.
const int ageMaxDefault = 100;
