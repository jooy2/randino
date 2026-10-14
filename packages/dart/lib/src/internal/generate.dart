// The parts every generator shares: resolving the options they all take, and
// the loop that draws until it has as many results as the caller asked for.
//
// `randName`, `randNickname` and `randWord` differ in what one draw produces
// and in nothing else about this — the same clamping, the same `startsWith`
// filter, the same `unique` bookkeeping and the same attempt budget. Written
// once here, a new generator gets all of it by calling [collect], or
// [collectFrom] when it can list every result it may return.

import 'dart:math';

import 'package:randino/src/constants.dart';
import 'package:randino/src/internal/script.dart';
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
///
/// [ceiling] is the highest bound the generator will serve, and only
/// `randSentence` passes one of its own: a sentence is many words where every
/// other generator produces at most three, so [randLengthMax] would cut most of
/// them in half.
LengthRange lengthBounds(
  int? min,
  int? max,
  int naturalMin,
  int naturalMax, {
  int ceiling = randLengthMax,
}) {
  final low = clampInt(min ?? naturalMin, randLengthMin, ceiling);
  final high = clampInt(max ?? naturalMax, randLengthMin, ceiling);

  // A range the wrong way round is a caller contradicting themselves, and the
  // bound that survives is `maxLength` — the one they are usually holding to, a
  // field limit or a column width, where `minLength` only shapes how a result
  // reads. `(30, 5)` used to read as `(30, 30)`, which is the other way about.
  return LengthRange(high < low ? high : low, high);
}

/// The platforms a call may draw from: the one named, or both for a null one.
List<SystemPlatform> resolvePlatforms(SystemPlatform? platform) =>
    platform == null ? systemPlatforms : <SystemPlatform>[platform];

// The latest year a catalog bound is read up to. A year of four digits is as far
// as anything here is dated, and nothing in a catalog comes close to either end.
const int _yearMax = 9999;

/// `minYear` and `maxYear` as the years a catalog draw may come from, both ends
/// included.
///
/// A bound left out is no bound, and a range the wrong way round keeps
/// `maxYear`, the way a length range keeps `maxLength`: it is the one a caller
/// usually means — "as of 2015" — where `minYear` only trims the old end.
(int, int) resolveYears(int? minYear, int? maxYear) {
  final high = clampInt(maxYear ?? _yearMax, 0, _yearMax);
  final low = clampInt(minYear ?? 0, 0, _yearMax);

  return (low < high ? low : high, high);
}

/// The languages a draw may come from once `startsWith` has had its say: the
/// requested one, or every one of them for a null [option], minus the ones that
/// do not write the requested character's script.
///
/// A character a language does not write is a character it can never lead a
/// result with, and a generator asked for one anyway used to answer with the
/// character glued to the front — `randName(language: NameLanguage.ko,
/// startsWith: 'Q')` came back `Q대겸`, which is a Latin letter and a Korean
/// given name in one string and a name in neither language.
///
/// Empty when nothing can answer, which the generators pass on as no results at
/// all. That is the same answer `unique` already gives when a pool runs out:
/// fewer results than were asked for, rather than results that are not what was
/// asked for.
List<T> languagesWriting<T extends Enum>(T? option, List<T> languages, String prefix) {
  final wanted = option == null ? languages : <T>[option];

  return prefix.isEmpty
      ? wanted
      : wanted.where((code) => writesScript(code.name, prefix)).toList(growable: false);
}

/// The languages among [languages] whose own range of lengths meets the range
/// the caller asked for, or every one of them when none does.
///
/// With every language in play, a range only some of them can reach was
/// answered by the rest with the closest result they had: `randWord(maxLength:
/// 1)` kept to one character a quarter of the time, because only the CJK
/// languages write a word that short. A language that cannot meet the range is
/// left out, the way [languagesWriting] leaves out one that cannot write
/// `startsWith`; when none can, every language is kept and each answers with
/// its closest.
List<T> languagesFitting<T>(
  List<T> languages,
  int? minLength,
  int? maxLength,
  LengthRange Function(T code) rangeOf,
) {
  if (languages.length < 2 || (minLength == null && maxLength == null)) return languages;

  final low = minLength ?? 0;
  final fitting = languages
      .where((code) {
        final range = rangeOf(code);

        return range.max >= low && (maxLength == null || range.min <= maxLength);
      })
      .toList(growable: false);

  return fitting.isNotEmpty ? fitting : languages;
}

// How many draws in a row may add nothing before `collect` stops: twenty for
// each result found so far, and never fewer than two thousand. With k results
// found, a pool drawn evenly that holds one more gives it one draw in k + 1,
// and twenty times k draws in a row miss it about twice in a billion; the floor
// gives the same odds to a result one draw in a hundred finds. Only a call of
// more than thirty results ever reaches the floor, since a smaller one runs out
// of attempts first. A pool drawn by weight can still stop short of a result
// far rarer than the rest, which is why a catalog draws through [collectFrom]
// instead.
const int _collectStall = 2000;
const int _collectStallPerResult = 20;

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

  /// Another string to deduplicate by, where the one handed back is not the one
  /// [startsWith] reads: a romanized name is returned in Latin letters and
  /// matched against the native first character.
  String Function(T item)? uniqueOf,
}) {
  final wanted = resolveCount(count);
  final prefix = startsWith.toLowerCase();

  final seen = <String>{};
  final results = <T>[];
  // Generous enough that a plain request always fills up, while still ending a
  // `unique` request whose pool has run out of combinations.
  final maxAttempts = wanted * 50 + 500;
  var attempts = 0;
  var missed = 0;

  // A run of draws that adds nothing is a pool with nothing new left in it, and
  // the budget above was spent all the same: `randWord(language:
  // WordLanguage.vi, startsWith: 'ư', unique: true, count: 2000)` found its 270
  // words and went on for a hundred thousand draws. A result still to be found
  // is missed only when it fails to come up that many draws in a row, and the
  // run grows with what has been found: a fixed two thousand left one of the
  // 249 countries out about once in three thousand calls.
  while (results.length < wanted &&
      attempts < maxAttempts &&
      missed < max(_collectStall, _collectStallPerResult * results.length)) {
    attempts += 1;
    missed += 1;

    final item = draw();
    final key = keyOf(item);

    if (key.isEmpty) continue;
    if (prefix.isNotEmpty && !key.toLowerCase().startsWith(prefix)) continue;

    if (unique) {
      final once = uniqueOf == null ? key : uniqueOf(item);

      if (seen.contains(once)) continue;

      seen.add(once);
    }

    results.add(item);
    missed = 0;
  }

  return results;
}

/// What a catalog builds one result from, and how likely that result is
/// against the others.
typedef Outcome<E> = ({E entry, double weight});

// How many sets of options a catalog keeps the outcomes of. A caller asks with a
// handful; one who moves a year range call by call would otherwise keep a list
// for every range, so the lists are let go at this many and listed again.
const int _outcomesKept = 64;

/// The outcomes a catalog lists for one set of options: listed the first time a
/// call asks with it, and kept for the calls after.
///
/// Without it a call of one result listed the whole catalog to draw it, which
/// made `randOs()` twice as slow as the draw it replaced. [key] has to name
/// every option the list depends on, and nothing a result is only written by —
/// a maker in front of a model is `keyOf`'s business, not the list's.
List<Outcome<E>> keptOutcomes<E>(
  Map<String, List<Outcome<E>>> kept,
  String key,
  List<Outcome<E>> Function() list,
) {
  final cached = kept[key];

  if (cached != null) {
    return cached;
  }

  if (kept.length >= _outcomesKept) {
    kept.clear();
  }

  return kept[key] = list();
}

/// [collect] for a generator that can list every result it may return — a
/// catalog, where a draw only picks.
///
/// Each result comes up as often as its weight says, and two outcomes with the
/// same [keyOf] are one result, as likely as the two of them together. [build]
/// writes the result out of the entry it came up on, once for each time it
/// comes up, so no two results are the same object.
///
/// A [unique] call takes each result out as it comes up, which deals the same
/// odds as drawing again on a repeat and stops exactly when the list runs out.
/// [collect] can only guess that from a run of draws that found nothing new,
/// and a list drawn by weight beat the guess: `randOs` asked for every release
/// came back short one call in six, even once the run grew with what had been
/// found.
List<T> collectFrom<E, T>({
  required int count,
  required bool unique,
  required String startsWith,
  required List<Outcome<E>> outcomes,
  required String Function(E entry) keyOf,
  required T Function(E entry) build,
}) {
  final wanted = resolveCount(count);
  final prefix = startsWith.toLowerCase();

  if (prefix.isNotEmpty) {
    final fitting = <Outcome<E>>[
      for (final outcome in outcomes)
        if (keyOf(outcome.entry).toLowerCase().startsWith(prefix)) outcome,
    ];

    return _dealFrom<E, T>(_prepare<E>(fitting), wanted, unique, keyOf, build)!;
  }

  // Without a `startsWith` a key is read only for what comes up — one for a call
  // of one, rather than the whole catalog's. A result whose key is empty is never
  // returned, so an entry written as nothing sends the call back to deal from the
  // entries that are written as something.
  String? keyed(E entry) {
    final key = keyOf(entry);

    return key.isEmpty ? null : key;
  }

  return _dealFrom<E, T>(_prepare<E>(outcomes), wanted, unique, keyed, build) ??
      _dealFrom<E, T>(
        _prepare<E>(<Outcome<E>>[
          for (final outcome in outcomes)
            if (keyOf(outcome.entry).isNotEmpty) outcome,
        ]),
        wanted,
        unique,
        keyOf,
        build,
      )!;
}

/// A list of outcomes made ready to draw from: the ones that can come up, and
/// the running total of their weights, so a draw is a search rather than a walk
/// down the list. [totals] is null when every weight is the same, and a draw is
/// then an index.
final class _Prepared<E> {
  const _Prepared(this.pool, this.totals);

  final List<Outcome<E>> pool;

  final List<double>? totals;
}

// Kept with the list itself, so a list a catalog keeps is made ready once and
// one put together for a single call goes when the call does.
final Expando<Object> _preparedLists = Expando<Object>('prepared');

_Prepared<E> _prepare<E>(List<Outcome<E>> outcomes) {
  final cached = _preparedLists[outcomes];

  if (cached != null) {
    return cached as _Prepared<E>;
  }

  // An outcome of no weight never comes up, unless none has any, when each is
  // as likely as the next — the way [pickWeighted] reads a table of zeros.
  final weighted = <Outcome<E>>[
    for (final outcome in outcomes)
      if (outcome.weight > 0) outcome,
  ];
  final pool =
      weighted.isNotEmpty
          ? weighted
          : <Outcome<E>>[for (final outcome in outcomes) (entry: outcome.entry, weight: 1.0)];
  List<double>? totals;

  if (pool.any((outcome) => outcome.weight != pool.first.weight)) {
    var total = 0.0;

    totals = [for (final outcome in pool) total += outcome.weight];
  }

  final made = _Prepared<E>(pool, totals);

  _preparedLists[outcomes] = made;

  return made;
}

/// One index of a prepared pool, drawn by its weight.
int _drawIndex<E>(_Prepared<E> prepared) {
  final totals = prepared.totals;

  if (totals == null) {
    return randInt(0, prepared.pool.length - 1);
  }

  final roll = randDouble() * totals.last;
  var low = 0;
  var high = totals.length - 1;

  while (low < high) {
    final middle = (low + high) >> 1;

    if (totals[middle] > roll) {
      high = middle;
    } else {
      low = middle + 1;
    }
  }

  return low;
}

// How many repeats in a row a unique call draws through before it deals out
// what is left. Drawing again is cheaper while most of the list is still to
// come, and dealing is cheaper once nearly every draw is a repeat.
const int _uniqueRepeats = 16;

/// The draw [collectFrom] makes once the outcomes are the ones it may return:
/// null when one of them turns out to have no key, which only a list it has not
/// read every key of can hold.
List<T>? _dealFrom<E, T>(
  _Prepared<E> prepared,
  int wanted,
  bool unique,
  String? Function(E entry) keyed,
  T Function(E entry) build,
) {
  final pool = prepared.pool;
  final results = <T>[];

  if (pool.isEmpty) {
    return results;
  }

  // Each entry's key, read the first time it comes up.
  final keys = List<String?>.filled(pool.length, null);
  final read = List<bool>.filled(pool.length, false);

  String? keyAt(int index) {
    if (!read[index]) {
      keys[index] = keyed(pool[index].entry);
      read[index] = true;
    }

    return keys[index];
  }

  if (!unique) {
    while (results.length < wanted) {
      final index = _drawIndex<E>(prepared);

      if (keyAt(index) == null) return null;

      results.add(build(pool[index].entry));
    }

    return results;
  }

  final seen = <String>{};
  var repeats = 0;

  while (results.length < wanted && repeats < _uniqueRepeats) {
    final index = _drawIndex<E>(prepared);
    final key = keyAt(index);

    if (key == null) return null;

    if (seen.contains(key)) {
      repeats += 1;
      continue;
    }

    seen.add(key);
    results.add(build(pool[index].entry));
    repeats = 0;
  }

  if (results.length >= wanted) {
    return results;
  }

  // The rest is dealt out of what is left. Each entry waits a time drawn at the
  // rate of its weight, and they come up in the order a draw that skips repeats
  // would find them: the next is each one's by its share of the weight left,
  // the way it was for every draw before. That holds from here as it did from
  // the start, since a wait drawn this way does not remember how long it has
  // run. Ties keep the list's order, which `List.sort` does not promise.
  final left = <({int index, String key, double at})>[];

  for (var index = 0; index < pool.length; index += 1) {
    final key = keyAt(index);

    if (key == null) return null;
    if (seen.contains(key)) continue;

    left.add((index: index, key: key, at: -log(1 - randDouble()) / pool[index].weight));
  }

  left.sort((a, b) => a.at != b.at ? a.at.compareTo(b.at) : a.index.compareTo(b.index));

  for (final (:index, :key, at: _) in left) {
    if (results.length >= wanted) break;
    if (seen.contains(key)) continue;

    seen.add(key);
    results.add(build(pool[index].entry));
  }

  return results;
}
