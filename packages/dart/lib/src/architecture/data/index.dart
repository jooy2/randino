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

/// What an architecture is, and how often it comes up. Internal.
typedef ArchitectureData = ({String family, int bits, num weight, bool rare, List<String> aliases});

/// Every architecture's line, width, weight and other names. Internal.
///
/// The weights are out of a hundred for the four common ones, written by hand
/// in the order they are common in: 64-bit x86 and Arm are nearly every
/// machine, the 32-bit two what is left of the old ones. Each rare one is a
/// fraction, so the six together are about one draw in twenty when asked for.
/// The aliases are in the order they are met: Debian's and Go's, then Windows'
/// and Node's, then the kernel's or the compiler's.
const Map<String, ArchitectureData> architectureData = <String, ArchitectureData>{
  'x86_64': (family: 'x86', bits: 64, weight: 46, rare: false, aliases: <String>['amd64', 'x64']),
  'arm64': (family: 'arm', bits: 64, weight: 40, rare: false, aliases: <String>['aarch64']),
  'x86': (
    family: 'x86',
    bits: 32,
    weight: 8,
    rare: false,
    aliases: <String>['i386', 'ia32', 'i686'],
  ),
  'armv7': (family: 'arm', bits: 32, weight: 6, rare: false, aliases: <String>['armhf', 'armv7l']),
  'riscv64': (family: 'riscv', bits: 64, weight: 0.8, rare: true, aliases: <String>[]),
  'ppc64le': (family: 'power', bits: 64, weight: 0.8, rare: true, aliases: <String>['ppc64el']),
  's390x': (family: 's390', bits: 64, weight: 0.8, rare: true, aliases: <String>[]),
  'mips64': (family: 'mips', bits: 64, weight: 0.8, rare: true, aliases: <String>[]),
  'loongarch64': (
    family: 'loongarch',
    bits: 64,
    weight: 0.8,
    rare: true,
    aliases: <String>['loong64'],
  ),
  'sparc64': (family: 'sparc', bits: 64, weight: 0.8, rare: true, aliases: <String>['sparcv9']),
};
