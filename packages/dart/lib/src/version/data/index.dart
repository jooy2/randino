import 'package:randino/src/types.dart';

/// Every format, in the order the npm package lists them.
const List<VersionFormat> versionFormats = <VersionFormat>[
  VersionFormat.semver,
  VersionFormat.calver,
  VersionFormat.number,
];

/// The lowest and highest number each part of a version is drawn from. Internal.
///
/// A part is drawn with the small numbers most often — a number is about twice
/// as likely as the one twice as far from the bottom — so `0.x` and `x.y.0` are
/// common and `18.27.30` is rare, the way they are in a registry. `number` is a
/// version that is one number, the way a browser's is; `release` and `micro`
/// are a calendar version's, counted within its year or month.
const Map<String, (int, int)> versionParts = <String, (int, int)>{
  'major': (0, 20),
  'minor': (0, 30),
  'patch': (0, 30),
  'number': (1, 150),
  'release': (1, 4),
  'micro': (1, 9),
  'prerelease': (1, 9),
};

/// The pre-release labels a semantic version is given, and how often each one.
/// Internal.
const Map<String, num> versionPrereleases = <String, num>{'alpha': 30, 'beta': 35, 'rc': 35};

/// The percentage of semantic versions given a pre-release under
/// `includePrerelease`. Internal.
const num versionPrereleaseChance = 25;

/// One calendar scheme, in CalVer's notation, and how often it comes up.
/// Internal.
typedef CalverScheme = ({String scheme, num weight});

/// The calendar schemes: a year and a release within it (`2024.2`), a year,
/// month and fix (`2024.3.1`), a short year and zero-padded month (`24.04`) with
/// or without a fix, and a whole date (`2024.03.15`). `MINOR` here is the
/// release within a year, never a semantic version's minor. Internal.
const List<CalverScheme> calverSchemes = <CalverScheme>[
  (scheme: 'YYYY.MINOR', weight: 25),
  (scheme: 'YYYY.MM.MICRO', weight: 25),
  (scheme: 'YY.0M', weight: 20),
  (scheme: 'YY.0M.MICRO', weight: 15),
  (scheme: 'YYYY.0M.0D', weight: 15),
];

/// The earliest year a calendar version is drawn from when the caller names
/// none. Internal.
const int versionYearMinDefault = 2010;

/// The latest year a calendar version is drawn from when the caller names
/// none. Internal.
const int versionYearMaxDefault = 2026;

/// The earliest year a calendar version may be counted from at all. CalVer's
/// short year is the year less 2000. Internal.
const int versionYearFloor = 2000;

/// The latest year a calendar version may be counted from at all. Internal.
const int versionYearCeiling = 2099;
