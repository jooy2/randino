import 'dart:math';

import 'package:randino/src/architecture/architecture_generator.dart';
import 'package:randino/src/types.dart';

/// Generate processor architectures, by the names a download page most often
/// lists them under: `x86_64`, `arm64`.
///
/// 64-bit x86 and Arm are nearly every draw, and the 32-bit `x86` and `armv7`
/// the rest. [platform] keeps to the architectures of desktops or of phones,
/// and [naming] writes Debian's, Go's or the kernel's names instead.
/// [includeRare] adds RISC-V, POWER, IBM Z, MIPS, LoongArch and SPARC, about
/// one desktop draw in twenty together.
///
/// ```dart
/// randArchitecture(); // [x86_64]
/// randArchitecture(count: 3); // [arm64, x86_64, arm64]
/// randArchitecture(platform: SystemPlatform.mobile); // [arm64]
/// randArchitecture(naming: ArchitectureNaming.debian, count: 2); // [amd64, armhf]
/// randArchitecture(includeRare: true, count: 3); // [x86_64, riscv64, arm64]
/// ```
List<String> randArchitecture({
  /// The architectures of desktops, laptops and servers, or of phones and
  /// tablets; a null one draws from both. A phone is nearly always `arm64`, and
  /// the rare architectures are never a phone's.
  SystemPlatform? platform,
  bool includeRare = false,

  /// Whose names to write: [ArchitectureNaming.debian] writes `amd64` where
  /// [ArchitectureNaming.common] writes `x86_64`, and
  /// [ArchitectureNaming.kernel] writes `aarch64` for `arm64`.
  ArchitectureNaming naming = ArchitectureNaming.common,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateArchitectureDetails(
    platform: platform,
    includeRare: includeRare,
    naming: naming,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.architecture,
];
