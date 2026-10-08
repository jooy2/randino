// Sizes of memory and storage: a pool of real capacities, the units they are
// written in, and the candidates `randRam` and `randDiskSize` both draw from.
//
// A size is always one a machine is really sold with, and it is only ever
// written in a unit it is a whole number of: 512 MB of memory is never
// `0.5 GB`, and a 500 GB drive is never `0.5 TB`. Asking for a unit leaves out
// the sizes that are not whole in it rather than rounding them into a size
// nobody sells.

import 'dart:math';

/// How one kind of size is measured: its units, and the pool it draws from.
class CapacityScale<U extends Enum> {
  /// Creates a scale.
  const CapacityScale({
    required this.units,
    required this.step,
    required this.base,
    required this.reference,
    required this.bytes,
    required this.pool,
  });

  /// The units, smallest first, each [step] times the one before it.
  final List<U> units;

  /// How many of one unit make the next: `1024` for memory, `1000` for storage.
  final int step;

  /// The unit [pool] is written in.
  final U base;

  /// The unit `minSize` and `maxSize` are read in when the unit is left to fit.
  final U reference;

  /// How many bytes one [base] unit is.
  final int bytes;

  /// Every size there is, in [base], with how often it comes up.
  final List<(int, num)> pool;
}

/// A size a call may land on, with the unit it is written in.
class CapacityCandidate<U extends Enum> {
  /// Creates a candidate.
  const CapacityCandidate(this.size, this.weight, this.unit, this.value);

  /// The size, in the scale's base unit.
  final int size;

  /// How often the size comes up.
  final num weight;

  /// The unit the size is written in.
  final U unit;

  /// The number written, in [unit].
  final int value;
}

/// [size], given in the scale's base unit, as a number of [unit].
///
/// Multiplied for a smaller unit and divided for a larger one, never multiplied
/// by a fraction, so a size that is whole in a unit comes out exactly whole.
num inUnit<U extends Enum>(CapacityScale<U> scale, int size, U unit) {
  final steps = scale.units.indexOf(scale.base) - scale.units.indexOf(unit);

  return steps >= 0 ? size * pow(scale.step, steps).toInt() : size / pow(scale.step, -steps);
}

bool _whole(num value) => value == value.truncate();

/// The largest unit [size] is a whole number of — what a unit left to fit writes
/// it in.
U fitUnit<U extends Enum>(CapacityScale<U> scale, int size) {
  for (var i = scale.units.length - 1; i > 0; i -= 1) {
    if (_whole(inUnit(scale, size, scale.units[i]))) return scale.units[i];
  }

  return scale.units[0];
}

/// The sizes one call may land on, each in the unit it is written in.
///
/// A named [unit] keeps to the sizes that are whole in it, and a null one fits
/// each size. [minSize] and [maxSize] are read in [unit], or in the scale's
/// reference unit for a null one, and keep to the sizes inside them, both ends
/// included. Nothing is fitted afterwards, so a range no real size is inside is
/// answered with nothing.
List<CapacityCandidate<U>> capacityCandidates<U extends Enum>(
  CapacityScale<U> scale,
  U? unit,
  int? minSize,
  int? maxSize,
) {
  final bound = unit ?? scale.reference;
  // A range the wrong way round keeps `maxSize`, the way a length range keeps
  // `maxLength`: it is the bound a caller is usually holding to.
  final low = minSize != null && maxSize != null && minSize > maxSize ? maxSize : minSize;
  final candidates = <CapacityCandidate<U>>[];

  for (final (size, weight) in scale.pool) {
    final written = unit ?? fitUnit(scale, size);
    final value = inUnit(scale, size, written);
    final measured = inUnit(scale, size, bound);

    if (!_whole(value)) continue;
    if (low != null && measured < low) continue;
    if (maxSize != null && measured > maxSize) continue;

    candidates.add(CapacityCandidate<U>(size, weight, written, value.toInt()));
  }

  return candidates;
}

/// A size written out: `16 GB`, or `16` without its unit.
String writeCapacity(int value, String unit, bool includeUnit) =>
    includeUnit ? '$value $unit' : '$value';
