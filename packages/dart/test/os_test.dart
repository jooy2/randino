import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/os/data/index.dart';
import 'package:randino/src/os/os_generator.dart';
import 'package:test/test.dart';

const int sample = 60;

// Large enough that a line weighted at three in a hundred still shows up.
const int large = 4000;

/// Every string a release can be written as, with every build and edition it has.
Set<String> everyWriting() => <String>{
  for (final release in osReleases) ...<String>{
    release.name,
    for (final build in <OsBuild?>[null, ...release.builds])
      for (final edition in <String?>[null, ...release.editions]) writeOs(release, build, edition),
  },
};

void main() {
  group('Os', () {
    test('randOs returns one system by default', () {
      expect(randOs(), hasLength(1));
    });

    test('returns exactly `count` systems', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randOs(count: count), hasLength(count));
      }

      expect(randOs(count: -3), isEmpty);
      expect(randOs(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every release is well formed', () {
      final seen = <String>{};

      for (final release in osReleases) {
        final key = '${release.family.name} ${release.version}';

        expect(seen.add(key), isTrue, reason: '$key is listed twice');
        expect(release.template, contains('{v}'), reason: key);
        expect(release.year, inInclusiveRange(1995, 2026), reason: key);
        // An edition needs somewhere to go, and a place for one needs editions.
        expect(release.template.contains('{e}'), release.editions.isNotEmpty, reason: key);

        var last = release.year;

        for (final build in release.builds) {
          expect(build.year, greaterThanOrEqualTo(last), reason: '$key ${build.text}');
          last = build.year;
        }
      }

      for (final family in OsFamily.values) {
        expect(osReleases.any((release) => release.family == family), isTrue, reason: family.name);
      }
    });

    test('every system is one the catalog writes', () {
      final written = everyWriting();

      for (final system in <String>[
        ...randOs(count: sample * 5),
        ...randOs(includeBuild: true, count: sample * 5),
        ...randOs(includeEdition: true, count: sample * 5),
        ...randOs(includeBuild: true, includeEdition: true, count: sample * 5),
        ...randOs(includeVersion: false, count: sample * 5),
      ]) {
        expect(written, contains(system));
      }
    });

    test('the detail is what the value was written from', () {
      for (final detail in randOsDetails(
        includeBuild: true,
        includeEdition: true,
        count: sample * 5,
      )) {
        final release = osReleases.firstWhere(
          (each) => each.name == detail.name && each.version == detail.version,
        );
        final matches = release.builds.where((each) => each.text == detail.build);
        final build = matches.isEmpty ? null : matches.first;

        expect(detail.platform, osFamilies[release.family]!.platform);
        expect(build == null, detail.build == null, reason: detail.os);
        // A release with builds always writes one when asked.
        expect(detail.build != null, release.builds.isNotEmpty, reason: detail.os);
        expect(detail.edition != null, release.editions.isNotEmpty, reason: detail.os);
        expect(detail.os, writeOs(release, build, detail.edition));
        expect(detail.year, build?.year ?? release.year);
      }
    });

    test('the version, the build and the edition are left out unless asked for', () {
      for (final detail in randOsDetails(count: sample * 5)) {
        expect(detail.build, isNull);
        expect(detail.edition, isNull);
        expect(detail.version, isNotNull);
      }

      // Without a version there is nothing for a build or an edition to belong to.
      for (final detail in randOsDetails(
        includeVersion: false,
        includeBuild: true,
        includeEdition: true,
        count: sample,
      )) {
        expect(detail.os, detail.name);
        expect(detail.version, isNull);
        expect(detail.build, isNull);
        expect(detail.edition, isNull);
      }
    });

    test('platform keeps to the systems of one kind of machine', () {
      for (final platform in systemPlatforms) {
        expect(
          randOsDetails(
            platform: platform,
            count: sample * 3,
          ).every((detail) => detail.platform == platform),
          isTrue,
        );
      }

      expect({
        for (final detail in randOsDetails(count: sample * 3)) detail.platform,
      }, hasLength(systemPlatforms.length));
    });

    test('a year range keeps to the releases out in it', () {
      for (final detail in randOsDetails(minYear: 2010, maxYear: 2015, count: sample * 3)) {
        expect(detail.year, inInclusiveRange(2010, 2015), reason: detail.os);
      }

      // As of 2015: no Windows 11, and Windows 10 at no feature update after 1511.
      final asOf = randOs(
        maxYear: 2015,
        platform: SystemPlatform.desktop,
        count: large,
        includeBuild: true,
      );

      expect(asOf.any((system) => system.startsWith('Windows 11')), isFalse);
      expect(asOf.any((system) => system.startsWith('Windows 10')), isTrue);
      expect(asOf.any((system) => system.startsWith('Windows 10 1607')), isFalse);
    });

    test('with includeBuild the year is the build’s, without it the release’s', () {
      // Windows 10 came out in 2015, and its 22H2 update in 2022.
      final released = randOs(minYear: 2022, count: large, platform: SystemPlatform.desktop);
      final built = randOs(
        minYear: 2022,
        count: large,
        platform: SystemPlatform.desktop,
        includeBuild: true,
      );

      expect(released, isNot(contains('Windows 10')));
      expect(built, contains('Windows 10 22H2 (Build 19045)'));
    });

    test('a year range nothing came out in answers with nothing', () {
      expect(randOs(maxYear: 1990, count: 5), isEmpty);
      expect(randOs(minYear: 2030, count: 5), isEmpty);
      // The first iPhone OS is 2007, so mobile before it has nothing.
      expect(randOs(platform: SystemPlatform.mobile, maxYear: 2006), isEmpty);
    });

    test('a year range the wrong way round keeps maxYear', () {
      for (final detail in randOsDetails(minYear: 2020, maxYear: 2005, count: sample)) {
        expect(detail.year, 2005, reason: detail.os);
      }
    });

    test('Windows is most of the desktop and Android most of mobile', () {
      double share(List<OsDetail> details, String name) =>
          details.where((detail) => detail.name == name).length / details.length;

      final desktop = randOsDetails(platform: SystemPlatform.desktop, count: large);
      final mobile = randOsDetails(platform: SystemPlatform.mobile, count: large);

      expect(share(desktop, 'Windows'), greaterThan(0.55));
      expect(share(mobile, 'Android'), greaterThan(0.52));
      expect(share(desktop, 'Debian'), greaterThan(0));
    });

    test('the value form is the os of each detail', () {
      expect(
        randOs(includeBuild: true, includeEdition: true, count: sample, random: Random(7)),
        <String>[
          for (final detail in randOsDetails(
            includeBuild: true,
            includeEdition: true,
            count: sample,
            random: Random(7),
          ))
            detail.os,
        ],
      );
    });

    test('unique never repeats a system, and stops when the systems run out', () {
      final names = randOs(includeVersion: false, unique: true, count: 100);

      expect(names.toSet(), hasLength(names.length));
      expect(names.toSet(), {for (final release in osReleases) release.name});
    });
  });
}
