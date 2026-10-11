import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/architecture/architecture_generator.dart';
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
        expect(data.weights, isNotEmpty, reason: architecture);
        expect(data.weights.values.every((weight) => weight > 0), isTrue, reason: architecture);

        for (final name in <String>[architecture, ...data.aliases]) {
          expect(names.add(name), isTrue, reason: '$name is written twice');
        }

        // Every naming writes a name the architecture goes by.
        for (final naming in architectureNamings) {
          expect(
            <String>[architecture, ...data.aliases],
            contains(writeArchitecture(architecture, naming)),
            reason: '$architecture ${naming.name}',
          );
        }
      }

      // The four common ones are what a hundred draws are split between, on each
      // platform, and the rare ones are a desktop's alone.
      final common = [
        for (final each in architectures)
          if (!architectureData[each]!.rare) each,
      ];

      expect(common, <String>['x86_64', 'arm64', 'x86', 'armv7']);

      for (final platform in systemPlatforms) {
        expect(
          common.fold<num>(
            0,
            (sum, each) => sum + (architectureData[each]!.weights[platform] ?? 0),
          ),
          100,
          reason: platform.name,
        );
      }

      expect(
        architectures
            .where((each) => architectureData[each]!.rare)
            .every((each) => !architectureData[each]!.weights.containsKey(SystemPlatform.mobile)),
        isTrue,
      );
    });

    test('the detail is the architecture’s own data', () {
      for (final detail in randArchitectureDetails(includeRare: true, count: sample * 3)) {
        final data = architectureData[detail.code]!;

        expect(detail.architecture, detail.code);
        expect(detail.aliases, data.aliases);
        expect(data.weights.containsKey(detail.platform), isTrue, reason: detail.architecture);
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

      // About one desktop draw in twenty, the rare ones being a desktop's alone.
      final desktop = randArchitectureDetails(
        platform: SystemPlatform.desktop,
        includeRare: true,
        count: large,
      );

      expect(
        desktop.where((each) => each.rare).length / desktop.length,
        inExclusiveRange(0.02, 0.08),
      );
    });

    test('platform keeps to the architectures of one kind of machine', () {
      final mobile = randArchitectureDetails(
        platform: SystemPlatform.mobile,
        includeRare: true,
        count: large,
      );

      expect(mobile.every((detail) => detail.platform == SystemPlatform.mobile), isTrue);
      // A phone is Arm nearly always, never 64-bit x86 and never a rare one.
      expect({for (final detail in mobile) detail.architecture}, {'arm64', 'armv7', 'x86'});
      expect(
        mobile.where((detail) => detail.family == 'arm').length / mobile.length,
        greaterThan(0.9),
      );

      final desktop = randArchitectureDetails(platform: SystemPlatform.desktop, count: large);

      expect(desktop.every((detail) => detail.platform == SystemPlatform.desktop), isTrue);
      expect(
        desktop.where((detail) => detail.architecture == 'x86_64').length / desktop.length,
        greaterThan(0.7),
      );
      expect({
        for (final detail in randArchitectureDetails(count: sample * 3)) detail.platform,
      }, hasLength(systemPlatforms.length));
    });

    test('naming writes Debian’s, Go’s or the kernel’s names', () {
      List<String> written(ArchitectureNaming naming) => [
        for (final each in architectures) writeArchitecture(each, naming),
      ];

      expect(written(ArchitectureNaming.common), architectures);
      expect(written(ArchitectureNaming.debian).take(4), <String>[
        'amd64',
        'arm64',
        'i386',
        'armhf',
      ]);
      expect(written(ArchitectureNaming.go).take(4), <String>['amd64', 'arm64', '386', 'arm']);
      expect(written(ArchitectureNaming.kernel).take(4), <String>[
        'x86_64',
        'aarch64',
        'i686',
        'armv7l',
      ]);

      for (final naming in architectureNamings) {
        for (final detail in randArchitectureDetails(
          naming: naming,
          includeRare: true,
          count: sample * 3,
        )) {
          expect(detail.architecture, writeArchitecture(detail.code, naming));
          // The common name is among the aliases whenever it is not the one written.
          expect(detail.aliases, aliasesOf(detail.code, detail.architecture));
          expect(detail.aliases, isNot(contains(detail.architecture)));
          expect(
            detail.aliases.contains(detail.code),
            detail.architecture != detail.code,
            reason: detail.architecture,
          );
        }
      }
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
