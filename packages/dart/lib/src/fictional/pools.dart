// The fictional datasets parsed into pools, and the drawing every fictional
// generator shares: a word from a pool, or one invented out of parts.
//
// The datasets are strings until a draw needs them, and each is split the first
// time one does, so importing the package costs nothing for a pool nobody asks
// for.

import 'dart:math';

import 'package:randino/src/fictional/data/index.dart';
import 'package:randino/src/fictional/spelling.dart';
import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// A part that builds only some things: [uses] is the letters of what it may
/// build.
typedef Tagged = ({String uses, Spelling spelling});

/// The length range a word has to land in, both ends included.
typedef Room = ({int low, int high});

/// The name datasets, split into the pools a draw reads.
final class NamePools {
  /// Creates the pools. Built once, by [pools].
  const NamePools({
    required this.given,
    required this.surnames,
    required this.heads,
    required this.middles,
    required this.ends,
    required this.fronts,
    required this.backs,
    required this.avoid,
    required this.avoidInside,
  });

  /// The given names of each gender.
  final Map<NameGender, List<Spelling>> given;

  /// The family names.
  final List<Spelling> surnames;

  /// The syllables an invented given name or place opens on.
  final List<Spelling> heads;

  /// The syllables an invented word may take between its head and its ending.
  final List<Spelling> middles;

  /// The syllables an invented given name of each gender ends on.
  final Map<NameGender, List<Spelling>> ends;

  /// The halves a compound opens on, with what each may build.
  final List<Tagged> fronts;

  /// The halves a compound ends on, with what each may build.
  final List<Tagged> backs;

  /// The words, in lower-case Latin letters, no invented word may be.
  final Set<String> avoid;

  /// The runs of letters no invented word may hold in any of its spellings.
  final List<String> avoidInside;
}

final NamePools _namePools = _splitPools();

NamePools _splitPools() {
  final given = <NameGender, List<Spelling>>{NameGender.male: [], NameGender.female: []};
  final ends = <NameGender, List<Spelling>>{NameGender.male: [], NameGender.female: []};
  final heads = <Spelling>[];
  final middles = <Spelling>[];
  final fronts = <Tagged>[];
  final backs = <Tagged>[];

  for (final (:cells, :spelling) in spelledRows(fictionalGivenNames)) {
    given[cells[0] == 'f' ? NameGender.female : NameGender.male]!.add(spelling);
  }

  for (final (:cells, :spelling) in spelledRows(fictionalSyllables)) {
    final role = cells[0];

    if (role == 'head') {
      heads.add(spelling);
    } else if (role == 'middle') {
      middles.add(spelling);
    } else {
      ends[role == 'female' ? NameGender.female : NameGender.male]!.add(spelling);
    }
  }

  for (final (:cells, :spelling) in spelledRows(fictionalCompounds)) {
    (cells[0] == 'front' ? fronts : backs).add((uses: cells[1], spelling: spelling));
  }

  return NamePools(
    given: given.map((gender, pool) => MapEntry(gender, List<Spelling>.unmodifiable(pool))),
    surnames: List<Spelling>.unmodifiable(<Spelling>[
      for (final row in spelledRows(fictionalSurnames)) row.spelling,
    ]),
    heads: List<Spelling>.unmodifiable(heads),
    middles: List<Spelling>.unmodifiable(middles),
    ends: ends.map((gender, pool) => MapEntry(gender, List<Spelling>.unmodifiable(pool))),
    fronts: List<Tagged>.unmodifiable(fronts),
    backs: List<Tagged>.unmodifiable(backs),
    avoid: Set<String>.unmodifiable(<String>{
      for (final word in words(fictionalAvoid)) word.toLowerCase(),
    }),
    avoidInside: words(fictionalAvoidInside),
  );
}

/// The name datasets, split the first time a draw needs them.
NamePools pools() => _namePools;

// The entries of a pool that lead with a prefix in one script, kept per pool: a
// call draws many results with the same prefix, and filtering a pool of two
// hundred names for each one of them is most of what a large call would cost.
final Expando<Map<String, List<Spelling>>> _matchCache = Expando<Map<String, List<Spelling>>>(
  'matching',
);

/// The spellings of [pool] that lead with [prefix] in [script], or all of them
/// for none.
List<Spelling> spelledMatching(List<Spelling> pool, int script, String prefix) {
  if (prefix.isEmpty) {
    return pool;
  }

  final byPrefix = _matchCache[pool] ??= <String, List<Spelling>>{};

  return byPrefix.putIfAbsent(
    '$script|$prefix',
    () => List<Spelling>.unmodifiable(pool.where((entry) => leadsWith(entry[script], prefix))),
  );
}

/// Parts joined into one word, or null when two of them cannot be joined part
/// by part, or the word is one the datasets keep out: `fictionalAvoid` as a
/// whole, `fictionalAvoidInside` anywhere in any of its spellings.
Spelling? compose(List<Spelling> parts) {
  for (var i = 1; i < parts.length; i += 1) {
    if (!joinable(parts[i - 1][latinScript], parts[i][latinScript])) {
      return null;
    }
  }

  final word = joinParts(parts);
  final kept = pools();

  if (kept.avoid.contains(word[latinScript].toLowerCase())) {
    return null;
  }

  for (final spelling in word) {
    final lower = spelling.toLowerCase();

    if (kept.avoidInside.any(lower.contains)) {
      return null;
    }
  }

  return word;
}

// How many times an invented word is put together before the closest one made
// is kept. A pair that cannot be joined, a word to avoid and a length outside
// the range are each drawn again, and each is a small share of the draws.
const int _inventAttempts = 16;

/// A word [make] puts together that leads with [prefix] in [script] and lands
/// inside [room], or the closest it made when none did — null when it made
/// nothing at all. The prefix is checked on the word rather than on its first
/// part, because joining can change how a script writes the first part: `아`
/// and `라` are `알라`.
Spelling? invent(Spelling? Function() make, int script, String prefix, Room? room) {
  Spelling? best;
  var bestMiss = double.infinity;

  for (var attempt = 0; attempt < _inventAttempts; attempt += 1) {
    final word = make();

    if (word == null || !leadsWith(word[script], prefix)) {
      continue;
    }

    final miss = room == null ? 0.0 : missBy(word[script].length, room.low, room.high);

    if (miss == 0) {
      return word;
    }

    if (miss < bestMiss) {
      best = word;
      bestMiss = miss;
    }
  }

  return best;
}

/// A word for one part of a result: one out of [pool] (already narrowed to the
/// prefix), or one [make] invents, [inventChance] times in a hundred, and
/// whenever the pool has nothing to offer. An invented word that cannot be made
/// to lead with the prefix falls back to the pool.
Spelling? drawWord(
  List<Spelling> pool,
  Spelling? Function() make,
  int inventChance,
  int script,
  String prefix,
  Room? room,
) {
  if (chance(inventChance) || pool.isEmpty) {
    final made = invent(make, script, prefix, room);

    if (made != null) {
      return made;
    }
  }

  if (pool.isEmpty) {
    return null;
  }

  return pick<Spelling>(
    room == null ? pool : fitting<Spelling>(pool, (entry) => entry[script], room.low, room.high),
  );
}

// The shortest and the longest entry of a slot in each script, kept per slot.
final Expando<List<(int, int)>> _slotSpans = Expando<List<(int, int)>>('slot spans');

(int, int) _slotSpan(List<Spelling> slot, int script) {
  final spans =
      _slotSpans[slot] ??= List<(int, int)>.unmodifiable(<(int, int)>[
        for (var each = 0; each < 5; each += 1) spanOf(slot.map((entry) => entry[each])),
      ]);

  return spans[script];
}

/// One part out of each slot, joined into a word that leads with [prefix] in
/// [script] — the first slot is narrowed to it — and lands inside [room] where
/// the slots can reach it: each part is drawn from the entries that leave the
/// slots after it able to land the whole word there. Null when the word cannot
/// be joined or is one to keep out.
Spelling? assemble(List<List<Spelling>> slots, int script, String prefix, Room? room) {
  final parts = <Spelling>[];
  var length = 0;

  for (var i = 0; i < slots.length; i += 1) {
    var pool = i == 0 ? spelledMatching(slots[0], script, prefix) : slots[i];

    if (room != null) {
      var restLow = 0;
      var restHigh = 0;

      for (var j = i + 1; j < slots.length; j += 1) {
        final (low, high) = _slotSpan(slots[j], script);

        restLow += low;
        restHigh += high;
      }

      final fit = pool
          .where((entry) {
            final reach = length + entry[script].length;

            return reach + restLow <= room.high && reach + restHigh >= room.low;
          })
          .toList(growable: false);

      // A slot nothing of which fits is drawn from whole, and the word comes
      // out as close as the rest of it can bring it.
      if (fit.isNotEmpty) {
        pool = fit;
      }
    }

    if (pool.isEmpty) {
      return null;
    }

    final part = pick(pool);

    parts.add(part);
    length += part[script].length;
  }

  return compose(parts);
}

/// A given name put together out of syllables, for one gender: `Al` + `dric`,
/// `Va` + `le` + `ria`.
Spelling? makeGiven(NameGender gender, int script, String prefix, Room? room) {
  final kept = pools();

  return assemble(
    chance(fictionalMiddleChance)
        ? <List<Spelling>>[kept.heads, kept.middles, kept.ends[gender]!]
        : <List<Spelling>>[kept.heads, kept.ends[gender]!],
    script,
    prefix,
    room,
  );
}

/// The fronts and backs that build one kind of thing.
typedef Halves = ({List<Spelling> fronts, List<Spelling> backs});

// The halves that may build each kind of thing, kept by the letter that names
// it.
final Map<String, Halves> _halvesCache = <String, Halves>{};

/// The fronts and backs that may build [use]: `s` a surname, `r` a region, `c`
/// a city, `d` a district.
Halves halvesFor(String use) => _halvesCache.putIfAbsent(use, () {
  final kept = pools();

  return (
    fronts: List<Spelling>.unmodifiable(<Spelling>[
      for (final part in kept.fronts)
        if (part.uses.contains(use)) part.spelling,
    ]),
    backs: List<Spelling>.unmodifiable(<Spelling>[
      for (final part in kept.backs)
        if (part.uses.contains(use)) part.spelling,
    ]),
  );
});

/// A word put together out of a front and a back that may build [use]:
/// `Raven` + `ford`.
Spelling? makeCompound(String use, int script, String prefix, Room? room) {
  final halves = halvesFor(use);
  final word = assemble(<List<Spelling>>[halves.fronts, halves.backs], script, prefix, room);

  // A half that is both a front and a back (`stone`) is not joined to itself.
  return word != null &&
          halves.fronts.any(
            (front) => front[latinScript] + front[latinScript] == word[latinScript].toLowerCase(),
          )
      ? null
      : word;
}

/// The shortest and longest a part can come out in one script, the pool's and
/// the invented ones together: [pool] is what the pools hold, and [madeOf] the
/// shapes an invented part is put together in, each a list of slots.
(int, int) spanIn(List<Spelling> pool, List<List<List<Spelling>>> madeOf, int script) {
  int? low;
  var high = 0;

  if (pool.isNotEmpty) {
    (low, high) = spanOf(pool.map((entry) => entry[script]));
  }

  for (final shape in madeOf) {
    var shortest = 0;
    var longest = 0;

    for (final slot in shape) {
      final (slotLow, slotHigh) = spanOf(slot.map((entry) => entry[script]));

      shortest += slotLow;
      longest += slotHigh;
    }

    low = low == null ? shortest : min(low, shortest);
    high = max(high, longest);
  }

  return (low ?? 0, high);
}
