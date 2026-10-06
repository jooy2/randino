import 'package:randino/randino.dart';
// Internal, but they are what an age is checked against: the bands say which
// group an age is in, and the curve is what the draw follows.
import 'package:randino/src/age/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;

// Large enough that a share is within a point or two of the curve's, so the
// distribution can be asserted with room to spare rather than by luck.
const int large = 6000;

bool inBand(int age, AgeGroup group) {
  final (low, high) = ageBands[group]!;

  return age >= low && age <= high;
}

/// The share of [ages] from [low] to [high], as a percentage.
double share(List<int> ages, int low, int high) =>
    100 * ages.where((age) => age >= low && age <= high).length / ages.length;

void main() {
  group('Age', () {
    test('randAge returns one whole number by default', () {
      expect(randAge(), hasLength(1));
    });

    test('returns exactly `count` ages', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randAge(count: count), hasLength(count));
      }

      expect(randAge(count: -3), isEmpty);
      expect(randAge(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('the default range is 0 to 100', () {
      for (final age in randAge(count: large)) {
        expect(age, inInclusiveRange(0, 100));
      }
    });

    test('every age is inside minAge and maxAge', () {
      for (final (minAge, maxAge) in <(int, int)>[(18, 30), (0, 0), (65, 65), (100, 120)]) {
        for (final age in randAge(minAge: minAge, maxAge: maxAge, count: sample)) {
          expect(age, inInclusiveRange(minAge, maxAge));
        }
      }
    });

    test('the bounds are clamped, and a range the wrong way round keeps maxAge', () {
      for (final age in randAge(minAge: -10, maxAge: 500, count: sample)) {
        expect(age, inInclusiveRange(0, randAgeMax));
      }

      expect(randAge(minAge: 30, maxAge: 5, count: 5), <int>[5, 5, 5, 5, 5]);
    });

    test('group narrows the ages to its band', () {
      for (final group in ageGroups) {
        for (final detail in randAgeDetails(group: {group}, count: sample)) {
          expect(detail.group, group);
          expect(inBand(detail.age, group), isTrue, reason: '${detail.age} is not ${group.name}');
        }
      }

      for (final age in randAge(group: {AgeGroup.child, AgeGroup.senior}, count: sample)) {
        expect(inBand(age, AgeGroup.child) || inBand(age, AgeGroup.senior), isTrue);
      }

      // An empty set names no group, which is every one of them.
      expect(randAge(group: <AgeGroup>{}, count: sample), hasLength(sample));
    });

    test('a group narrows the range rather than replacing it', () {
      for (final age in randAge(group: {AgeGroup.adult}, maxAge: 30, count: sample)) {
        expect(age, inInclusiveRange(20, 30));
      }
    });

    test('a group the range has no age of leaves the range to answer', () {
      for (final age in randAge(group: {AgeGroup.senior}, minAge: 20, maxAge: 40, count: sample)) {
        expect(age, inInclusiveRange(20, 40));
      }
    });

    test('the detail reports the group the age is in', () {
      for (final detail in randAgeDetails(count: sample * 5)) {
        expect(inBand(detail.age, detail.group), isTrue);
      }
    });

    test('the bands cover every age once, and the curve spans them', () {
      var next = 0;

      for (final group in ageGroups) {
        final (low, high) = ageBands[group]!;

        expect(low, next, reason: '${group.name} does not start where the last band ended');
        expect(high, greaterThanOrEqualTo(low));
        next = high + 1;
      }

      expect(next, randAgeMax + 1);
      expect(ageCurve.first.$1, 0);
      expect(ageCurve.last, (randAgeMax, 0.0));

      for (var i = 1; i < ageCurve.length; i += 1) {
        expect(ageCurve[i].$1, greaterThan(ageCurve[i - 1].$1));
        expect(ageCurve[i].$2, greaterThanOrEqualTo(0));
      }
    });

    test('the population curve favours young adults over children and the old', () {
      final ages = randAge(count: large);
      // Per year of age, so that a band of twenty years is not favoured for being
      // wide.
      double perYear(int low, int high) => share(ages, low, high) / (high - low + 1);

      expect(share(ages, 20, 64), greaterThan(55));
      expect(perYear(20, 39), greaterThan(perYear(0, 12) * 1.3));
      expect(perYear(20, 39), greaterThan(perYear(65, 100) * 2));
      expect(perYear(60, 69), greaterThan(perYear(75, 84) * 1.5));
      expect(share(ages, 90, 100), lessThan(2));
    });

    test('uniform draws every age alike', () {
      final ages = randAge(count: large, distribution: AgeDistribution.uniform);
      final mean = ages.reduce((sum, age) => sum + age) / ages.length;

      // An even draw over 0..100 averages 50; the population curve averages under 40.
      expect((mean - 50).abs(), lessThan(3));
      expect(share(ages, 80, 100), greaterThan(15));
    });

    test('a minAge past the default maxAge reaches for the oldest ages', () {
      for (final age in randAge(minAge: 105, count: sample)) {
        expect(age, inInclusiveRange(105, randAgeMax));
      }

      // The curve reaches zero at its last age, which is still drawn when it is
      // the only age the range holds.
      expect(randAge(minAge: randAgeMax, count: 3), <int>[randAgeMax, randAgeMax, randAgeMax]);
    });

    test('unique never repeats an age, and stops when the range runs out', () {
      final ages = randAge(minAge: 10, maxAge: 14, count: 10, unique: true);

      expect(ages, hasLength(5));
      expect(ages.toList()..sort(), <int>[10, 11, 12, 13, 14]);

      final many = randAge(count: 50, unique: true);

      expect(many.toSet(), hasLength(many.length));
    });
  });
}
