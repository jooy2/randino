import 'package:randino/src/types.dart';

/// Every processor architecture, by the name a download page most often lists
/// it under. The first four are what nearly every machine runs; the rest come
/// up only with `includeRare`.
const List<String> architectures = <String>[
  'x86_64',
  'arm64',
  'x86',
  'armv7',
  'riscv64',
  'ppc64le',
  's390x',
  'mips64',
  'loongarch64',
  'sparc64',
];

/// Every naming an architecture can be written by, the common one first.
const List<ArchitectureNaming> architectureNamings = <ArchitectureNaming>[
  ArchitectureNaming.common,
  ArchitectureNaming.debian,
  ArchitectureNaming.go,
  ArchitectureNaming.kernel,
];

/// What an architecture is, how often it comes up, and what it is called.
/// Internal.
typedef ArchitectureData =
    ({
      String family,
      int bits,
      Map<SystemPlatform, num> weights,
      bool rare,
      Map<ArchitectureNaming, String> names,
      List<String> aliases,
    });

/// Every architecture's line, width, weights and other names. Internal.
///
/// `weights` is how often it comes up on each platform it runs on, out of a
/// hundred for the common ones; a platform it is not found on is left out.
/// They are written by hand in the order they are common in: a desktop or a
/// laptop is mostly 64-bit x86 and a phone nearly always 64-bit Arm, with the
/// 32-bit two what is left of the old ones. Each rare one is a fraction, and
/// only a desktop's — a workstation or a server is not a phone — so the six
/// together are about one desktop draw in twenty when asked for.
///
/// `names` is the name each naming other than [ArchitectureNaming.common]
/// writes it by. The aliases are in the order they are met: Debian's and Go's,
/// then Windows' and Node's, then the kernel's or the compiler's, and every
/// name in `names` that is not the common one is among them.
const Map<String, ArchitectureData> architectureData = <String, ArchitectureData>{
  'x86_64': (
    family: 'x86',
    bits: 64,
    weights: <SystemPlatform, num>{SystemPlatform.desktop: 80},
    rare: false,
    names: <ArchitectureNaming, String>{
      ArchitectureNaming.debian: 'amd64',
      ArchitectureNaming.go: 'amd64',
      ArchitectureNaming.kernel: 'x86_64',
    },
    aliases: <String>['amd64', 'x64'],
  ),
  'arm64': (
    family: 'arm',
    bits: 64,
    weights: <SystemPlatform, num>{SystemPlatform.desktop: 14, SystemPlatform.mobile: 84},
    rare: false,
    names: <ArchitectureNaming, String>{
      ArchitectureNaming.debian: 'arm64',
      ArchitectureNaming.go: 'arm64',
      ArchitectureNaming.kernel: 'aarch64',
    },
    aliases: <String>['aarch64'],
  ),
  'x86': (
    family: 'x86',
    bits: 32,
    weights: <SystemPlatform, num>{SystemPlatform.desktop: 5, SystemPlatform.mobile: 2},
    rare: false,
    names: <ArchitectureNaming, String>{
      ArchitectureNaming.debian: 'i386',
      ArchitectureNaming.go: '386',
      ArchitectureNaming.kernel: 'i686',
    },
    aliases: <String>['i386', '386', 'ia32', 'i686'],
  ),
  'armv7': (
    family: 'arm',
    bits: 32,
    weights: <SystemPlatform, num>{SystemPlatform.desktop: 1, SystemPlatform.mobile: 14},
    rare: false,
    names: <ArchitectureNaming, String>{
      ArchitectureNaming.debian: 'armhf',
      ArchitectureNaming.go: 'arm',
      ArchitectureNaming.kernel: 'armv7l',
    },
    aliases: <String>['armhf', 'arm', 'armv7l'],
  ),
  'riscv64': (
    family: 'riscv',
    bits: 64,
    weights: <SystemPlatform, num>{SystemPlatform.desktop: 0.8},
    rare: true,
    names: <ArchitectureNaming, String>{
      ArchitectureNaming.debian: 'riscv64',
      ArchitectureNaming.go: 'riscv64',
      ArchitectureNaming.kernel: 'riscv64',
    },
    aliases: <String>[],
  ),
  'ppc64le': (
    family: 'power',
    bits: 64,
    weights: <SystemPlatform, num>{SystemPlatform.desktop: 0.8},
    rare: true,
    names: <ArchitectureNaming, String>{
      ArchitectureNaming.debian: 'ppc64el',
      ArchitectureNaming.go: 'ppc64le',
      ArchitectureNaming.kernel: 'ppc64le',
    },
    aliases: <String>['ppc64el'],
  ),
  's390x': (
    family: 's390',
    bits: 64,
    weights: <SystemPlatform, num>{SystemPlatform.desktop: 0.8},
    rare: true,
    names: <ArchitectureNaming, String>{
      ArchitectureNaming.debian: 's390x',
      ArchitectureNaming.go: 's390x',
      ArchitectureNaming.kernel: 's390x',
    },
    aliases: <String>[],
  ),
  'mips64': (
    family: 'mips',
    bits: 64,
    weights: <SystemPlatform, num>{SystemPlatform.desktop: 0.8},
    rare: true,
    // Debian's only 64-bit MIPS port, and the Loongson machines most of them
    // are, are little-endian.
    names: <ArchitectureNaming, String>{
      ArchitectureNaming.debian: 'mips64el',
      ArchitectureNaming.go: 'mips64le',
      ArchitectureNaming.kernel: 'mips64',
    },
    aliases: <String>['mips64el', 'mips64le'],
  ),
  'loongarch64': (
    family: 'loongarch',
    bits: 64,
    weights: <SystemPlatform, num>{SystemPlatform.desktop: 0.8},
    rare: true,
    names: <ArchitectureNaming, String>{
      ArchitectureNaming.debian: 'loong64',
      ArchitectureNaming.go: 'loong64',
      ArchitectureNaming.kernel: 'loongarch64',
    },
    aliases: <String>['loong64'],
  ),
  'sparc64': (
    family: 'sparc',
    bits: 64,
    weights: <SystemPlatform, num>{SystemPlatform.desktop: 0.8},
    rare: true,
    names: <ArchitectureNaming, String>{
      ArchitectureNaming.debian: 'sparc64',
      ArchitectureNaming.go: 'sparc64',
      ArchitectureNaming.kernel: 'sparc64',
    },
    aliases: <String>['sparcv9'],
  ),
};
