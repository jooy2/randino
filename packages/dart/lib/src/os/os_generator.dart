// The OS generator: a real release, written the way the release is known.
//
// Nothing is invented. A draw picks a line of operating systems, then one of
// its releases, then — when the caller asked for one — one of that release's
// builds, and every option narrows what may be picked rather than shaping what
// is written afterwards.

import 'dart:math';

import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/os/data/index.dart';
import 'package:randino/src/types.dart';

/// [release] written out, with [build] and [edition] where the call asked for
/// them.
String writeOs(OsRelease release, OsBuild? build, String? edition) {
  // A template with no `{b}` writes its build in the version's place: macOS 14
  // at a point release is `14.5`, never `14 14.5`.
  final inPlace = !release.template.contains('{b}');

  return release.template
      .replaceFirst('{v}', build != null && inPlace ? build.text : release.version)
      .replaceFirst('{e}', edition != null ? ' $edition' : '')
      .replaceFirst('{b}', build != null && !inPlace ? ' ${build.text}' : '');
}

/// The releases one call may land on, grouped by line, each with the builds of
/// it the call may write.
///
/// Worked out once per call: a year range is read against every release and
/// every build, and a call of ten thousand would otherwise read them all ten
/// thousand times. With [byBuild] the year that counts is the build's — the
/// thing the result names — so a release none of whose builds is inside the
/// range is left out, and one without builds is read by its own year.
Map<OsFamily, List<(OsRelease, List<OsBuild>)>> _candidates(
  List<SystemPlatform> platforms,
  (int, int) years,
  bool byBuild,
) {
  final (minYear, maxYear) = years;
  bool inRange(int year) => year >= minYear && year <= maxYear;
  final families = <OsFamily, List<(OsRelease, List<OsBuild>)>>{};

  for (final release in osReleases) {
    if (!platforms.contains(osFamilies[release.family]!.platform)) continue;

    final builds =
        byBuild && release.builds.isNotEmpty
            ? release.builds.where((build) => inRange(build.year)).toList()
            : null;

    if (builds != null ? builds.isEmpty : !inRange(release.year)) continue;

    families.putIfAbsent(release.family, () => []).add((release, builds ?? const <OsBuild>[]));
  }

  return families;
}

/// What `randOs` and `randOsDetails` both do.
List<OsDetail> generateOsDetails({
  SystemPlatform? platform,
  int? minYear,
  int? maxYear,
  bool includeVersion = true,
  bool includeBuild = false,
  bool includeEdition = false,
  int count = 1,
  bool unique = false,
  Random? random,
}) {
  final families = _candidates(
    resolvePlatforms(platform),
    resolveYears(minYear, maxYear),
    includeVersion && includeBuild,
  );
  final lines = families.keys.toList(growable: false);

  return withRandom(
    random,
    () => collect<OsDetail>(
      count: lines.isEmpty ? 0 : count,
      unique: unique,
      startsWith: '',
      draw: () {
        final family = pickWeighted(lines, (line) => osFamilies[line]!.weight);
        final (release, builds) = pick(families[family]!);
        final build = builds.isEmpty ? null : pick(builds);
        final edition =
            includeVersion && includeEdition && release.editions.isNotEmpty
                ? pick(release.editions)
                : null;

        return OsDetail(
          os: includeVersion ? writeOs(release, build, edition) : release.name,
          name: release.name,
          version: includeVersion ? release.version : null,
          build: build?.text,
          edition: edition,
          platform: osFamilies[family]!.platform,
          year: build?.year ?? release.year,
        );
      },
      keyOf: (detail) => detail.os,
    ),
  );
}
