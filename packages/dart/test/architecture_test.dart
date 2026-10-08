import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but it is what a result is checked against.
import 'package:randino/src/architecture/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 6000;

void main() {
  group('Architecture', () {
    test('randArchitecture returns one architecture by default', () {
      expect(architectures, contains(randArchitecture().single));
    });

    test('returns exactly `count` architectures', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randArchitecture(count: count), hasLength(count));
      }

      expect(randArchitecture(count: -3), isEmpty);
      expect(randArchitecture(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every architecture is described, and no name is another one’s alias', () {
      expect(architectureData.keys.toSet(), architectures.toSet());

      final names = <String>{};

      for (final architecture in architectures) {
        final data = architectureData[architecture]!;

        expect(<int>[32, 64], contains(data.bits));
        expect(data.weight, greaterThan(0));

        for (final name in <String>[architecture, ...data.aliases]) {
          expect(names.add(name), isTrue, reason: '$name is written twice');
        }
      }

      final common = [
        for (final each in architectures)
          if (!architectureData[each]!.rare) each,
      ];

      expect(common, <String>['x86_64', 'arm64', 'x86', 'armv7']);
      expect(common.fold<num>(0, (sum, each) => sum + architectureData[each]!.weight), 100);
    });

    test('the detail is the architecture’s own data', () {
      for (final detail in randArchitectureDetails(includeRare: true, count: sample * 3)) {
        final data = architectureData[detail.architecture]!;

        expect(detail.aliases, data.aliases);
        expect(detail.bits, data.bits);
        expect(detail.family, data.family);
        expect(detail.rare, data.rare);
      }
    });

    test('x86 and Arm alone, until the rare ones are asked for', () {
      expect(randArchitecture(count: large).toSet(), {'x86_64', 'arm64', 'x86', 'armv7'});
      expect(
        randArchitecture(includeRare: true, count: large).toSet(),
        hasLength(architectures.length),
      );
    });

    test('64-bit x86 and Arm are nearly every draw, and the rare ones uncommon', () {
      final details = randArchitectureDetails(includeRare: true, count: large);
      double share(bool Function(ArchitectureDetail detail) keep) =>
          details.where(keep).length / details.length;

      expect(
        share((each) => each.architecture == 'x86_64' || each.architecture == 'arm64'),
        greaterThan(0.75),
      );
      expect(share((each) => each.rare), inExclusiveRange(0.02, 0.08));
    });

    test('the value form is the architecture of each detail', () {
      expect(randArchitecture(includeRare: true, count: sample, random: Random(7)), <String>[
        for (final detail in randArchitectureDetails(
          includeRare: true,
          count: sample,
          random: Random(7),
        ))
          detail.architecture,
      ]);
    });

    test('unique never repeats an architecture, and stops when they run out', () {
      expect(randArchitecture(unique: true, count: 10).toSet(), {
        'x86_64',
        'arm64',
        'x86',
        'armv7',
      });
    });
  });
}
