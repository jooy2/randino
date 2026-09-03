// The parts every generator shares: resolving the options they all take, and
// the loop that draws until it has as many results as the caller asked for.
//
// `randName`, `randNickname` and `randWord` differ in what one draw produces
// and in nothing else about this — the same clamping, the same `startsWith`
// filter, the same `unique` bookkeeping and the same attempt budget. Written
// once here, a new generator gets all of it by calling [collect].

import 'package:randino/src/constants.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// [count], clamped to what a generator will serve.
int resolveCount(int count) => clampInt(count, 0, randCountMax);

/// `startsWith` narrowed to the single character every generator matches on.
///
/// One character rather than a string: it is applied to the first *word* a
/// result is built from, and a two-character prefix would rule out most pools.
String resolvePrefix(String? startsWith) {
  final trimmed = (startsWith ?? '').trim();

  return trimmed.isEmpty ? '' : trimmed.substring(0, 1);
}

/// [realism] as the chance of inventing one part, as a percentage, which is what
/// every generator actually asks of it.
int resolveRealism(RandRealism realism) => switch (realism) {
  RandRealism.real => 0,
  RandRealism.mixed => 50,
  RandRealism.invented => 100,
};

/// A caller's length bounds against a natural range, clamped to what is allowed.
LengthRange lengthBounds(int? min, int? max, int naturalMin, int naturalMax) {
  final low = clampInt(min ?? naturalMin, randLengthMin, randLengthMax);
  final high = clampInt(max ?? naturalMax, randLengthMin, randLengthMax);

  return LengthRange(low, high < low ? low : high);
}

/// Draw until there are [count] results, discarding what the filters reject.
///
/// [keyOf] is the string a result is filtered and deduplicated by — the name,
/// the nickname, the word.
List<T> collect<T>({
  required int count,
  required bool unique,
  required String startsWith,
  required T Function() draw,
  required String Function(T item) keyOf,
}) {
  final wanted = resolveCount(count);
  final prefix = startsWith.toLowerCase();

  final seen = <String>{};
  final results = <T>[];
  // Generous enough that a plain request always fills up, while still ending a
  // `unique` request whose pool has run out of combinations.
  final maxAttempts = wanted * 50 + 500;
  var attempts = 0;

  while (results.length < wanted && attempts < maxAttempts) {
    attempts += 1;

    final item = draw();
    final key = keyOf(item);

    if (key.isEmpty) continue;
    if (prefix.isNotEmpty && !key.toLowerCase().startsWith(prefix)) continue;

    if (unique) {
      if (seen.contains(key)) continue;

      seen.add(key);
    }

    results.add(item);
  }

  return results;
}
