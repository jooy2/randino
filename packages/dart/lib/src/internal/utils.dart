// Small shared helpers. Internal only — nothing here is exported from the
// package.

import 'dart:math';

/// Where every draw in this package comes from.
///
/// A source is ambient rather than threaded through every signature, because
/// every function here would have to carry it and hand it on: `randSentence`
/// alone reaches [pick] from some fifty places, through the word generator, the
/// name generator and the story planner. The library is synchronous from the
/// entry point down — there is no `await` anywhere in it — so nothing can
/// interleave between [withRandom] setting this and putting it back.
Random _source = Random();

/// The source in play, for the few places that have to hand it to something
/// else: `List.shuffle` takes its own [Random] and would otherwise reach for one
/// of its own, which is a draw the caller's source never sees.
Random get randomSource => _source;

/// Run [body] with [next] as the source of randomness, and put the previous
/// source back afterwards — including when [body] throws.
///
/// Restoring rather than clearing, because a generator can reach another one:
/// `randSentence` writes a person's name through `randName`, and the name is
/// meant to come from the same source the sentence did.
T withRandom<T>(Random? next, T Function() body) {
  if (next == null) return body();

  final previous = _source;

  _source = next;

  try {
    return body();
  } finally {
    _source = previous;
  }
}

/// Random entry of a non-empty list.
T pick<T>(List<T> items) => items[_source.nextInt(items.length)];

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

  var roll = _source.nextDouble() * total;

  for (final item in items) {
    roll -= max(0, weightOf(item));

    if (roll < 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

/// Random integer between [min] and [max], both inclusive.
int randInt(int min, int max) => max <= min ? min : min + _source.nextInt(max - min + 1);

/// True with a [percent] chance (`0` never, `100` always).
bool chance(num percent) => _source.nextDouble() * 100 < percent;

/// Random double in `[0, 1)`, for the weighted draws that roll their own.
double randDouble() => _source.nextDouble();

/// [value] held inside `[min, max]`.
int clampInt(int value, int min, int max) => value < min ? min : (value > max ? max : value);

/// [value] with its first character upper-cased.
String capitalizeFirst(String value) =>
    value.isEmpty ? value : value[0].toUpperCase() + value.substring(1);

/// Random string of [length] characters drawn from [charset].
String randToken(int length, String charset) {
  final buffer = StringBuffer();

  for (var i = 0; i < length; i += 1) {
    buffer.write(charset[_source.nextInt(charset.length)]);
  }

  return buffer.toString();
}
