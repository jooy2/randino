// Small shared helpers. Internal only — nothing here is exported from the
// package.

import 'dart:math';

/// The one source of randomness. There is no seed and no way to inject one:
/// the generators promise randomness, and a seeded run would be a different
/// promise with a different test suite behind it.
final Random _random = Random();

/// Random entry of a non-empty list.
T pick<T>(List<T> items) => items[_random.nextInt(items.length)];

/// Random entry of a non-empty list, drawn in proportion to [weightOf]. Falls
/// back to an even draw when every weight is zero, so a caller never has to
/// check that its weight table covers the pool.
T pickWeighted<T>(List<T> items, num Function(T item) weightOf) {
  var total = 0.0;

  for (final item in items) {
    total += max(0, weightOf(item));
  }

  if (total <= 0) {
    return pick(items);
  }

  var roll = _random.nextDouble() * total;

  for (final item in items) {
    roll -= max(0, weightOf(item));

    if (roll < 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

/// Random integer between [min] and [max], both inclusive.
int randInt(int min, int max) => max <= min ? min : min + _random.nextInt(max - min + 1);

/// True with a [percent] chance (`0` never, `100` always).
bool chance(num percent) => _random.nextDouble() * 100 < percent;

/// Random double in `[0, 1)`, for the weighted draws that roll their own.
double randDouble() => _random.nextDouble();

/// [value] held inside `[min, max]`.
int clampInt(int value, int min, int max) => value < min ? min : (value > max ? max : value);

/// [value] with its first character upper-cased.
String capitalizeFirst(String value) =>
    value.isEmpty ? value : value[0].toUpperCase() + value.substring(1);

/// Random string of [length] characters drawn from [charset].
String randToken(int length, String charset) {
  final buffer = StringBuffer();

  for (var i = 0; i < length; i += 1) {
    buffer.write(charset[_random.nextInt(charset.length)]);
  }

  return buffer.toString();
}
