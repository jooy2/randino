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

/// One result a call may land on: a release of a line, and its build and
/// edition where asked for.
typedef _Drawn = ({OsFamily family, OsRelease release, OsBuild? build, String? edition});

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
/// thousand times.
///
/// [named] and [platforms] both narrow the lines, so a line named that does not
/// run on the platform asked for leaves nothing to draw, rather than either
/// option giving way to the other.
///
/// With [byBuild] the year that counts is the build's — the thing the result
/// names — so a release none of whose builds is inside the range is left out,
/// and one without builds is read by its own year.
Map<OsFamily, List<(OsRelease, List<OsBuild>)>> _candidates(
  List<SystemPlatform> platforms,
  Set<OsFamily> named,
  (int, int) years,
  bool byBuild,
) {
  final (minYear, maxYear) = years;
  bool inRange(int year) => year >= minYear && year <= maxYear;
  final families = <OsFamily, List<(OsRelease, List<OsBuild>)>>{};

  for (final release in osReleases) {
    if (!named.contains(release.family)) continue;
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
  Set<OsFamily>? family,
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
    // A null or empty set reads as every line, the way the npm package's
    // `resolveMany` reads one.
    family == null || family.isEmpty ? osFamilyCodes.toSet() : family,
    resolveYears(minYear, maxYear),
    includeVersion && includeBuild,
  );
  final lines = families.keys.toList(growable: false);
  final withEdition = includeVersion && includeEdition;
  final outcomes = <Outcome<_Drawn>>[];

  // The line first, by how common it is among the lines left, and the release
  // inside it second, each as likely as the next; then a build and an edition
  // of it where the call asked for them.
  for (final (index, share) in shares(lines, (each) => osFamilies[each]!.weight).indexed) {
    final line = lines[index];
    final releases = families[line]!;

    for (final (release, builds) in releases) {
      final written = builds.isEmpty ? <OsBuild?>[null] : builds;
      final editions =
          withEdition && release.editions.isNotEmpty ? release.editions : <String?>[null];
      final weight = share / releases.length / written.length / editions.length;

      for (final build in written) {
        for (final edition in editions) {
          outcomes.add((
            entry: (family: line, release: release, build: build, edition: edition),
            weight: weight,
          ));
        }
      }
    }
  }

  String write(_Drawn drawn) =>
      includeVersion ? writeOs(drawn.release, drawn.build, drawn.edition) : drawn.release.name;

  return withRandom(
    random,
    () => collectFrom<_Drawn, OsDetail>(
      count: count,
      unique: unique,
      startsWith: '',
      outcomes: outcomes,
      keyOf: write,
      build:
          (drawn) => OsDetail(
            os: write(drawn),
            name: drawn.release.name,
            version: includeVersion ? drawn.release.version : null,
            build: drawn.build?.text,
            edition: drawn.edition,
            family: drawn.family,
            platform: osFamilies[drawn.family]!.platform,
            year: drawn.build?.year ?? drawn.release.year,
          ),
    ),
  );
}
