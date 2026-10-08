import 'dart:math';

import 'package:randino/src/architecture/architecture_generator.dart';

/// Generate processor architectures, by the names a download page most often
/// lists them under: `x86_64`, `arm64`.
///
/// 64-bit x86 and Arm are nearly every draw, and the 32-bit `x86` and `armv7`
/// the rest. [includeRare] adds RISC-V, POWER, IBM Z, MIPS, LoongArch and
/// SPARC, about one draw in twenty together.
///
/// ```dart
/// randArchitecture(); // [x86_64]
/// randArchitecture(count: 3); // [arm64, x86_64, x86_64]
/// randArchitecture(includeRare: true, count: 3); // [x86_64, riscv64, arm64]
/// ```
List<String> randArchitecture({
  bool includeRare = false,
  int count = 1,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateArchitectureDetails(
    includeRare: includeRare,
    count: count,
    unique: unique,
    random: random,
  ))
    detail.architecture,
];
