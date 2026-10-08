import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/types.dart';

/// The lines of operating systems the catalog holds. Internal.
///
/// A line keeps its key across renames, so [macos] holds Mac OS X and OS X as
/// well, and [ios] holds iPhone OS.
enum OsFamily {
  /// Microsoft Windows.
  windows,

  /// Apple macOS, OS X and Mac OS X.
  macos,

  /// Canonical Ubuntu.
  ubuntu,

  /// Fedora, and Fedora Core before it.
  fedora,

  /// Debian.
  debian,

  /// Google Android.
  android,

  /// Apple iOS, and iPhone OS before it.
  ios,

  /// Apple iPadOS.
  ipados,
}

/// Which platform a line runs on, and how often it comes up. Internal.
typedef OsFamilyData = ({SystemPlatform platform, int weight});

/// Which platform each line runs on, and how often it comes up beside the
/// other lines of that platform, out of a hundred. Internal.
///
/// A draw picks the line first and the release inside it second, because the
/// lines do not ship at the same pace: macOS, iOS and Android put out a release
/// a year or more where Windows has eleven in thirty years, and an even draw
/// over releases would make Windows a tenth of every desktop. The weights are
/// written by hand in the order the lines are common in, not measured from any
/// one survey, and every release inside a line is as likely as the next.
const Map<OsFamily, OsFamilyData> osFamilies = <OsFamily, OsFamilyData>{
  OsFamily.windows: (platform: SystemPlatform.desktop, weight: 64),
  OsFamily.macos: (platform: SystemPlatform.desktop, weight: 22),
  OsFamily.ubuntu: (platform: SystemPlatform.desktop, weight: 7),
  OsFamily.fedora: (platform: SystemPlatform.desktop, weight: 4),
  OsFamily.debian: (platform: SystemPlatform.desktop, weight: 3),
  OsFamily.android: (platform: SystemPlatform.mobile, weight: 62),
  OsFamily.ios: (platform: SystemPlatform.mobile, weight: 30),
  OsFamily.ipados: (platform: SystemPlatform.mobile, weight: 8),
};

/// A build or a point release, with the year it came out. Internal.
class OsBuild {
  /// Creates a build.
  const OsBuild(this.text, this.year);

  /// The build as it is written: `23H2 (Build 22631)`, `14.5`.
  final String text;

  /// The year the build came out.
  final int year;
}

/// One release of an operating system, and how it is written. Internal.
class OsRelease {
  /// Creates a release.
  const OsRelease({
    required this.family,
    required this.year,
    required this.version,
    required this.template,
    required this.name,
    required this.editions,
    required this.builds,
  });

  /// The line the release belongs to.
  final OsFamily family;

  /// The year the release came out.
  final int year;

  /// The release's own version: `11`, `14`, `22.04`, `XP`.
  final String version;

  /// How the release is written.
  ///
  /// `{v}` is the version, `{e}` the edition with a space in front of it, and
  /// `{b}` the build with a space in front of it. A template with no `{b}`
  /// writes its build in the version's place: macOS 14 is written `14.5` at a
  /// point release, never `14 14.5`.
  final String template;

  /// What the release is written as without a version: `Windows`, `Mac OS X`.
  final String name;

  /// The editions the release came in, or none.
  final List<String> editions;

  /// The builds the release is known by, oldest first, or none.
  final List<OsBuild> builds;
}

/// A cell of builds, `2023: 14.0, 14.1; 2024: 14.3`, as the builds it lists.
List<OsBuild> _builds(String cell) => List<OsBuild>.unmodifiable(<OsBuild>[
  for (final group in cell.split(';'))
    if (group.trim().isNotEmpty)
      for (final text in items(group.substring(group.indexOf(':') + 1)))
        OsBuild(text, int.parse(group.substring(0, group.indexOf(':')).trim())),
]);

/// Every release the catalog holds, one per row. Internal.
///
/// `family | year | version | template | name | editions | builds`
///
/// The years are the year a release reached the public, and a build's year the
/// year that build did. Builds are the ones a release is known by — a Windows
/// feature update or service pack with its build number, a macOS, iOS or iPadOS
/// point release, an Ubuntu LTS point release, an Android API level. Debian,
/// Fedora and the Ubuntu releases between two LTS ones are written at their
/// version only. The catalog runs to the releases out by October 2026.
final List<OsRelease> osReleases = List<OsRelease>.unmodifiable(
  rows(r'''
  windows | 1995 | 95 | Windows {v}{b} | Windows | | 1995: (4.00.950); 1996: OSR2 (4.00.950 B); 1997: OSR2.5 (4.00.950 C)
  windows | 1998 | 98 | Windows {v}{b} | Windows | | 1998: (4.10.1998); 1999: Second Edition (4.10.2222)
  windows | 2000 | 2000 | Windows {v}{e}{b} | Windows | Professional | 2000: (Build 2195), SP1 (Build 2195); 2001: SP2 (Build 2195); 2002: SP3 (Build 2195); 2003: SP4 (Build 2195)
  windows | 2000 | Me | Windows {v}{b} | Windows | | 2000: (4.90.3000)
  windows | 2001 | XP | Windows {v}{e}{b} | Windows | Home Edition, Professional | 2001: (Build 2600); 2002: SP1 (Build 2600); 2004: SP2 (Build 2600); 2008: SP3 (Build 2600)
  windows | 2007 | Vista | Windows {v}{e}{b} | Windows | Home Basic, Home Premium, Business, Enterprise, Ultimate | 2007: (Build 6000); 2008: SP1 (Build 6001); 2009: SP2 (Build 6002)
  windows | 2009 | 7 | Windows {v}{e}{b} | Windows | Starter, Home Basic, Home Premium, Professional, Enterprise, Ultimate | 2009: (Build 7600); 2011: SP1 (Build 7601)
  windows | 2012 | 8 | Windows {v}{e}{b} | Windows | Pro, Enterprise | 2012: (Build 9200)
  windows | 2013 | 8.1 | Windows {v}{e}{b} | Windows | Pro, Enterprise | 2013: (Build 9600)
  windows | 2015 | 10 | Windows {v}{e}{b} | Windows | Home, Pro, Education, Enterprise | 2015: 1507 (Build 10240), 1511 (Build 10586); 2016: 1607 (Build 14393); 2017: 1703 (Build 15063), 1709 (Build 16299); 2018: 1803 (Build 17134), 1809 (Build 17763); 2019: 1903 (Build 18362), 1909 (Build 18363); 2020: 2004 (Build 19041), 20H2 (Build 19042); 2021: 21H1 (Build 19043), 21H2 (Build 19044); 2022: 22H2 (Build 19045)
  windows | 2021 | 11 | Windows {v}{e}{b} | Windows | Home, Pro, Education, Enterprise | 2021: 21H2 (Build 22000); 2022: 22H2 (Build 22621); 2023: 23H2 (Build 22631); 2024: 24H2 (Build 26100); 2025: 25H2 (Build 26200); 2026: 26H2 (Build 26300)

  macos | 2001 | 10.0 | Mac OS X {v} | Mac OS X | | 2001: 10.0, 10.0.1, 10.0.2, 10.0.3, 10.0.4
  macos | 2001 | 10.1 | Mac OS X {v} | Mac OS X | | 2001: 10.1, 10.1.1, 10.1.2; 2002: 10.1.3, 10.1.4, 10.1.5
  macos | 2002 | 10.2 | Mac OS X Jaguar {v} | Mac OS X | | 2002: 10.2, 10.2.1, 10.2.2, 10.2.3; 2003: 10.2.4, 10.2.5, 10.2.6, 10.2.7, 10.2.8
  macos | 2003 | 10.3 | Mac OS X Panther {v} | Mac OS X | | 2003: 10.3, 10.3.1, 10.3.2; 2004: 10.3.3, 10.3.4, 10.3.5, 10.3.6, 10.3.7; 2005: 10.3.8, 10.3.9
  macos | 2005 | 10.4 | Mac OS X Tiger {v} | Mac OS X | | 2005: 10.4, 10.4.1, 10.4.2, 10.4.3; 2006: 10.4.4, 10.4.5, 10.4.6, 10.4.7, 10.4.8; 2007: 10.4.9, 10.4.10, 10.4.11
  macos | 2007 | 10.5 | Mac OS X Leopard {v} | Mac OS X | | 2007: 10.5, 10.5.1; 2008: 10.5.2, 10.5.3, 10.5.4, 10.5.5, 10.5.6; 2009: 10.5.7, 10.5.8
  macos | 2009 | 10.6 | Mac OS X Snow Leopard {v} | Mac OS X | | 2009: 10.6, 10.6.1, 10.6.2; 2010: 10.6.3, 10.6.4, 10.6.5; 2011: 10.6.6, 10.6.7, 10.6.8
  macos | 2011 | 10.7 | Mac OS X Lion {v} | Mac OS X | | 2011: 10.7, 10.7.1, 10.7.2; 2012: 10.7.3, 10.7.4, 10.7.5
  macos | 2012 | 10.8 | OS X Mountain Lion {v} | OS X | | 2012: 10.8, 10.8.1, 10.8.2; 2013: 10.8.3, 10.8.4, 10.8.5
  macos | 2013 | 10.9 | OS X Mavericks {v} | OS X | | 2013: 10.9, 10.9.1; 2014: 10.9.2, 10.9.3, 10.9.4, 10.9.5
  macos | 2014 | 10.10 | OS X Yosemite {v} | OS X | | 2014: 10.10, 10.10.1; 2015: 10.10.2, 10.10.3, 10.10.4, 10.10.5
  macos | 2015 | 10.11 | OS X El Capitan {v} | OS X | | 2015: 10.11, 10.11.1, 10.11.2; 2016: 10.11.3, 10.11.4, 10.11.5, 10.11.6
  macos | 2016 | 10.12 | macOS Sierra {v} | macOS | | 2016: 10.12, 10.12.1, 10.12.2; 2017: 10.12.3, 10.12.4, 10.12.5, 10.12.6
  macos | 2017 | 10.13 | macOS High Sierra {v} | macOS | | 2017: 10.13, 10.13.1, 10.13.2; 2018: 10.13.3, 10.13.4, 10.13.5, 10.13.6
  macos | 2018 | 10.14 | macOS Mojave {v} | macOS | | 2018: 10.14, 10.14.1, 10.14.2; 2019: 10.14.3, 10.14.4, 10.14.5, 10.14.6
  macos | 2019 | 10.15 | macOS Catalina {v} | macOS | | 2019: 10.15, 10.15.1, 10.15.2; 2020: 10.15.3, 10.15.4, 10.15.5, 10.15.6, 10.15.7
  macos | 2020 | 11 | macOS Big Sur {v} | macOS | | 2020: 11.0.1, 11.1; 2021: 11.2, 11.3, 11.4, 11.5, 11.6; 2022: 11.7
  macos | 2021 | 12 | macOS Monterey {v} | macOS | | 2021: 12.0.1, 12.1; 2022: 12.2, 12.3, 12.4, 12.5, 12.6; 2023: 12.7
  macos | 2022 | 13 | macOS Ventura {v} | macOS | | 2022: 13.0, 13.1; 2023: 13.2, 13.3, 13.4, 13.5, 13.6; 2024: 13.7
  macos | 2023 | 14 | macOS Sonoma {v} | macOS | | 2023: 14.0, 14.1, 14.2; 2024: 14.3, 14.4, 14.5, 14.6, 14.7
  macos | 2024 | 15 | macOS Sequoia {v} | macOS | | 2024: 15.0, 15.1, 15.2; 2025: 15.3, 15.4, 15.5, 15.6, 15.7
  macos | 2025 | 26 | macOS Tahoe {v} | macOS | | 2025: 26.0, 26.1, 26.2; 2026: 26.3, 26.4, 26.5, 26.6, 26.7
  macos | 2026 | 27 | macOS Golden Gate {v} | macOS | | 2026: 27.0

  ubuntu | 2004 | 4.10 | Ubuntu {v} | Ubuntu | |
  ubuntu | 2005 | 5.04 | Ubuntu {v} | Ubuntu | |
  ubuntu | 2005 | 5.10 | Ubuntu {v} | Ubuntu | |
  ubuntu | 2006 | 6.06 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2006: 6.06, 6.06.1; 2008: 6.06.2
  ubuntu | 2006 | 6.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2007 | 7.04 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2007 | 7.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2008 | 8.04 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2008: 8.04, 8.04.1; 2009: 8.04.2, 8.04.3; 2010: 8.04.4
  ubuntu | 2008 | 8.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2009 | 9.04 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2009 | 9.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2010 | 10.04 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2010: 10.04, 10.04.1; 2011: 10.04.2, 10.04.3; 2012: 10.04.4
  ubuntu | 2010 | 10.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2011 | 11.04 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2011 | 11.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2012 | 12.04 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2012: 12.04, 12.04.1; 2013: 12.04.2, 12.04.3; 2014: 12.04.4, 12.04.5
  ubuntu | 2012 | 12.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2013 | 13.04 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2013 | 13.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2014 | 14.04 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2014: 14.04, 14.04.1; 2015: 14.04.2, 14.04.3; 2016: 14.04.4, 14.04.5; 2019: 14.04.6
  ubuntu | 2014 | 14.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2015 | 15.04 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2015 | 15.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2016 | 16.04 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2016: 16.04, 16.04.1; 2017: 16.04.2, 16.04.3; 2018: 16.04.4, 16.04.5; 2019: 16.04.6; 2020: 16.04.7
  ubuntu | 2016 | 16.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2017 | 17.04 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2017 | 17.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2018 | 18.04 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2018: 18.04, 18.04.1; 2019: 18.04.2, 18.04.3; 2020: 18.04.4, 18.04.5; 2021: 18.04.6
  ubuntu | 2018 | 18.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2019 | 19.04 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2019 | 19.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2020 | 20.04 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2020: 20.04, 20.04.1; 2021: 20.04.2, 20.04.3; 2022: 20.04.4, 20.04.5; 2023: 20.04.6
  ubuntu | 2020 | 20.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2021 | 21.04 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2021 | 21.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2022 | 22.04 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2022: 22.04, 22.04.1; 2023: 22.04.2, 22.04.3; 2024: 22.04.4, 22.04.5
  ubuntu | 2022 | 22.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2023 | 23.04 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2023 | 23.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2024 | 24.04 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2024: 24.04, 24.04.1; 2025: 24.04.2, 24.04.3; 2026: 24.04.4
  ubuntu | 2024 | 24.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2025 | 25.04 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2025 | 25.10 | Ubuntu{e} {v} | Ubuntu | Desktop, Server |
  ubuntu | 2026 | 26.04 | Ubuntu{e} {v} LTS | Ubuntu | Desktop, Server | 2026: 26.04

  debian | 1996 | 1.1 | Debian {v} | Debian | |
  debian | 1996 | 1.2 | Debian {v} | Debian | |
  debian | 1997 | 1.3 | Debian {v} | Debian | |
  debian | 1998 | 2.0 | Debian {v} | Debian | |
  debian | 1999 | 2.1 | Debian {v} | Debian | |
  debian | 2000 | 2.2 | Debian {v} | Debian | |
  debian | 2002 | 3.0 | Debian {v} | Debian | |
  debian | 2005 | 3.1 | Debian {v} | Debian | |
  debian | 2007 | 4.0 | Debian {v} | Debian | |
  debian | 2009 | 5.0 | Debian {v} | Debian | |
  debian | 2011 | 6.0 | Debian {v} | Debian | |
  debian | 2013 | 7 | Debian {v} | Debian | |
  debian | 2015 | 8 | Debian {v} | Debian | |
  debian | 2017 | 9 | Debian {v} | Debian | |
  debian | 2019 | 10 | Debian {v} | Debian | |
  debian | 2021 | 11 | Debian {v} | Debian | |
  debian | 2023 | 12 | Debian {v} | Debian | |
  debian | 2025 | 13 | Debian {v} | Debian | |

  fedora | 2003 | 1 | Fedora Core {v} | Fedora Core | |
  fedora | 2004 | 2 | Fedora Core {v} | Fedora Core | |
  fedora | 2004 | 3 | Fedora Core {v} | Fedora Core | |
  fedora | 2005 | 4 | Fedora Core {v} | Fedora Core | |
  fedora | 2006 | 5 | Fedora Core {v} | Fedora Core | |
  fedora | 2006 | 6 | Fedora Core {v} | Fedora Core | |
  fedora | 2007 | 7 | Fedora {v} | Fedora | |
  fedora | 2007 | 8 | Fedora {v} | Fedora | |
  fedora | 2008 | 9 | Fedora {v} | Fedora | |
  fedora | 2008 | 10 | Fedora {v} | Fedora | |
  fedora | 2009 | 11 | Fedora {v} | Fedora | |
  fedora | 2009 | 12 | Fedora {v} | Fedora | |
  fedora | 2010 | 13 | Fedora {v} | Fedora | |
  fedora | 2010 | 14 | Fedora {v} | Fedora | |
  fedora | 2011 | 15 | Fedora {v} | Fedora | |
  fedora | 2011 | 16 | Fedora {v} | Fedora | |
  fedora | 2012 | 17 | Fedora {v} | Fedora | |
  fedora | 2013 | 18 | Fedora {v} | Fedora | |
  fedora | 2013 | 19 | Fedora {v} | Fedora | |
  fedora | 2013 | 20 | Fedora {v} | Fedora | |
  fedora | 2014 | 21 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2015 | 22 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2015 | 23 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2016 | 24 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2016 | 25 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2017 | 26 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2017 | 27 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2018 | 28 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2018 | 29 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2019 | 30 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2019 | 31 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2020 | 32 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2020 | 33 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2021 | 34 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2021 | 35 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2022 | 36 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2022 | 37 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2023 | 38 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2023 | 39 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2024 | 40 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2024 | 41 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2025 | 42 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2025 | 43 | Fedora{e} {v} | Fedora | Workstation, Server |
  fedora | 2026 | 44 | Fedora{e} {v} | Fedora | Workstation, Server |

  android | 2008 | 1.0 | Android {v}{b} | Android | | 2008: (API 1)
  android | 2009 | 1.1 | Android {v}{b} | Android | | 2009: (API 2)
  android | 2009 | 1.5 | Android {v} Cupcake{b} | Android | | 2009: (API 3)
  android | 2009 | 1.6 | Android {v} Donut{b} | Android | | 2009: (API 4)
  android | 2009 | 2.0 | Android {v} Eclair{b} | Android | | 2009: (API 5)
  android | 2009 | 2.0.1 | Android {v} Eclair{b} | Android | | 2009: (API 6)
  android | 2010 | 2.1 | Android {v} Eclair{b} | Android | | 2010: (API 7)
  android | 2010 | 2.2 | Android {v} Froyo{b} | Android | | 2010: (API 8)
  android | 2010 | 2.3 | Android {v} Gingerbread{b} | Android | | 2010: (API 9)
  android | 2011 | 2.3.3 | Android {v} Gingerbread{b} | Android | | 2011: (API 10)
  android | 2011 | 3.0 | Android {v} Honeycomb{b} | Android | | 2011: (API 11)
  android | 2011 | 3.1 | Android {v} Honeycomb{b} | Android | | 2011: (API 12)
  android | 2011 | 3.2 | Android {v} Honeycomb{b} | Android | | 2011: (API 13)
  android | 2011 | 4.0 | Android {v} Ice Cream Sandwich{b} | Android | | 2011: (API 14)
  android | 2011 | 4.0.3 | Android {v} Ice Cream Sandwich{b} | Android | | 2011: (API 15)
  android | 2012 | 4.1 | Android {v} Jelly Bean{b} | Android | | 2012: (API 16)
  android | 2012 | 4.2 | Android {v} Jelly Bean{b} | Android | | 2012: (API 17)
  android | 2013 | 4.3 | Android {v} Jelly Bean{b} | Android | | 2013: (API 18)
  android | 2013 | 4.4 | Android {v} KitKat{b} | Android | | 2013: (API 19)
  android | 2014 | 5.0 | Android {v} Lollipop{b} | Android | | 2014: (API 21)
  android | 2015 | 5.1 | Android {v} Lollipop{b} | Android | | 2015: (API 22)
  android | 2015 | 6.0 | Android {v} Marshmallow{b} | Android | | 2015: (API 23)
  android | 2016 | 7.0 | Android {v} Nougat{b} | Android | | 2016: (API 24)
  android | 2016 | 7.1 | Android {v} Nougat{b} | Android | | 2016: (API 25)
  android | 2017 | 8.0 | Android {v} Oreo{b} | Android | | 2017: (API 26)
  android | 2017 | 8.1 | Android {v} Oreo{b} | Android | | 2017: (API 27)
  android | 2018 | 9 | Android {v} Pie{b} | Android | | 2018: (API 28)
  android | 2019 | 10 | Android {v}{b} | Android | | 2019: (API 29)
  android | 2020 | 11 | Android {v}{b} | Android | | 2020: (API 30)
  android | 2021 | 12 | Android {v}{b} | Android | | 2021: (API 31)
  android | 2022 | 12L | Android {v}{b} | Android | | 2022: (API 32)
  android | 2022 | 13 | Android {v}{b} | Android | | 2022: (API 33)
  android | 2023 | 14 | Android {v}{b} | Android | | 2023: (API 34)
  android | 2024 | 15 | Android {v}{b} | Android | | 2024: (API 35)
  android | 2025 | 16 | Android {v}{b} | Android | | 2025: (API 36)
  android | 2026 | 17 | Android {v}{b} | Android | | 2026: (API 37)

  ios | 2007 | 1 | iPhone OS {v} | iPhone OS | | 2007: 1.0, 1.1
  ios | 2008 | 2 | iPhone OS {v} | iPhone OS | | 2008: 2.0, 2.1, 2.2
  ios | 2009 | 3 | iPhone OS {v} | iPhone OS | | 2009: 3.0, 3.1
  ios | 2010 | 4 | iOS {v} | iOS | | 2010: 4.0, 4.1, 4.2; 2011: 4.3
  ios | 2011 | 5 | iOS {v} | iOS | | 2011: 5.0; 2012: 5.1
  ios | 2012 | 6 | iOS {v} | iOS | | 2012: 6.0; 2013: 6.1
  ios | 2013 | 7 | iOS {v} | iOS | | 2013: 7.0; 2014: 7.1
  ios | 2014 | 8 | iOS {v} | iOS | | 2014: 8.0, 8.1; 2015: 8.2, 8.3, 8.4
  ios | 2015 | 9 | iOS {v} | iOS | | 2015: 9.0, 9.1, 9.2; 2016: 9.3
  ios | 2016 | 10 | iOS {v} | iOS | | 2016: 10.0, 10.1, 10.2; 2017: 10.3
  ios | 2017 | 11 | iOS {v} | iOS | | 2017: 11.0, 11.1, 11.2; 2018: 11.3, 11.4
  ios | 2018 | 12 | iOS {v} | iOS | | 2018: 12.0, 12.1; 2019: 12.2, 12.3, 12.4; 2020: 12.5
  ios | 2019 | 13 | iOS {v} | iOS | | 2019: 13.0, 13.1, 13.2, 13.3; 2020: 13.4, 13.5, 13.6, 13.7
  ios | 2020 | 14 | iOS {v} | iOS | | 2020: 14.0, 14.1, 14.2, 14.3; 2021: 14.4, 14.5, 14.6, 14.7, 14.8
  ios | 2021 | 15 | iOS {v} | iOS | | 2021: 15.0, 15.1, 15.2; 2022: 15.3, 15.4, 15.5, 15.6, 15.7; 2023: 15.8
  ios | 2022 | 16 | iOS {v} | iOS | | 2022: 16.0, 16.1, 16.2; 2023: 16.3, 16.4, 16.5, 16.6, 16.7
  ios | 2023 | 17 | iOS {v} | iOS | | 2023: 17.0, 17.1, 17.2; 2024: 17.3, 17.4, 17.5, 17.6, 17.7
  ios | 2024 | 18 | iOS {v} | iOS | | 2024: 18.0, 18.1, 18.2; 2025: 18.3, 18.4, 18.5, 18.6, 18.7
  ios | 2025 | 26 | iOS {v} | iOS | | 2025: 26.0, 26.1, 26.2; 2026: 26.3, 26.4, 26.5, 26.6
  ios | 2026 | 27 | iOS {v} | iOS | | 2026: 27.0

  ipados | 2019 | 13 | iPadOS {v} | iPadOS | | 2019: 13.1, 13.2, 13.3; 2020: 13.4, 13.5, 13.6, 13.7
  ipados | 2020 | 14 | iPadOS {v} | iPadOS | | 2020: 14.0, 14.1, 14.2, 14.3; 2021: 14.4, 14.5, 14.6, 14.7, 14.8
  ipados | 2021 | 15 | iPadOS {v} | iPadOS | | 2021: 15.0, 15.1, 15.2; 2022: 15.3, 15.4, 15.5, 15.6, 15.7; 2023: 15.8
  ipados | 2022 | 16 | iPadOS {v} | iPadOS | | 2022: 16.1, 16.2; 2023: 16.3, 16.4, 16.5, 16.6, 16.7
  ipados | 2023 | 17 | iPadOS {v} | iPadOS | | 2023: 17.0, 17.1, 17.2; 2024: 17.3, 17.4, 17.5, 17.6, 17.7
  ipados | 2024 | 18 | iPadOS {v} | iPadOS | | 2024: 18.0, 18.1, 18.2; 2025: 18.3, 18.4, 18.5, 18.6, 18.7
  ipados | 2025 | 26 | iPadOS {v} | iPadOS | | 2025: 26.0, 26.1, 26.2; 2026: 26.3, 26.4, 26.5, 26.6
  ipados | 2026 | 27 | iPadOS {v} | iPadOS | | 2026: 27.0
''').map((row) {
    String at(int index) => index < row.length ? row[index] : '';

    return OsRelease(
      family: OsFamily.values.byName(at(0)),
      year: int.parse(at(1)),
      version: at(2),
      template: at(3),
      name: at(4),
      editions: items(at(5)),
      builds: _builds(at(6)),
    );
  }),
);
