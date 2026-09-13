// Helpers that keep the datasets readable: pools are written as whitespace-
// separated strings inside a raw multi-line string instead of one list entry
// per line, which keeps a 120-name pool to a handful of lines.

import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

final RegExp _whitespace = RegExp(r'\s+');

/// Split a whitespace-separated pool. `_` stands for a space inside a single
/// entry, so multi-word names survive the split (`De_Luca` -> `De Luca`).
List<String> words(String source) => List<String>.unmodifiable(
  source.trim().split(_whitespace).map((word) => word.replaceAll('_', ' ')),
);

/// Split a whitespace-separated pool of `left:right` pairs into `[left, right]`
/// entries. Used for scripts whose characters carry their own reading
/// (`佐藤:Sato`) and for the frequency tables (`김:215`).
List<List<String>> pairs(String source) => List<List<String>>.unmodifiable(
  words(source).map((pair) {
    final at = pair.indexOf(':');

    return List<String>.unmodifiable(<String>[pair.substring(0, at), pair.substring(at + 1)]);
  }),
);

/// Build a lookup from `native:weight` pairs, for pools whose entries are not
/// equally likely (surname frequency). Entries left out of the source keep
/// whatever default the caller falls back to.
Map<String, int> weightMap(String source) => Map<String, int>.unmodifiable(<String, int>{
  for (final pair in pairs(source)) pair[0]: int.parse(pair[1]),
});

/// Build a native -> romanization lookup from `native:roman` pairs.
Map<String, String> romanMap(String source) => Map<String, String>.unmodifiable(<String, String>{
  for (final pair in pairs(source)) pair[0]: pair[1],
});

/// A noun pool split from its `gato:m` tags, and the lookup those tags carry.
class TaggedNouns {
  /// Creates a split pool.
  const TaggedNouns(this.pools, this.gender);

  /// The words, with the tags taken off.
  final Map<WordTheme, WordPool> pools;

  /// The gender each of them carries.
  final Map<String, WordGender> gender;
}

/// Split a `theme -> 'gato:m luna:f'` map into the pools and the gender lookup.
///
/// One pass over one source, so a language that inflects still writes each noun
/// exactly once.
TaggedNouns taggedNouns(Map<WordTheme, String> source) {
  final pools = <WordTheme, WordPool>{};
  final gender = <String, WordGender>{};

  for (final entry in source.entries) {
    final pool = <String>[];

    for (final tagged in words(entry.value)) {
      final at = tagged.lastIndexOf(':');
      final word = tagged.substring(0, at);

      gender[word] = WordGender.values.byName(tagged.substring(at + 1));
      pool.add(word);
    }

    pools[entry.key] = pool;
  }

  return TaggedNouns(pools, gender);
}

/// Every form of a tense from one pool of stems and one ending per form, for a
/// language whose endings are the same whatever the stem.
///
/// A Korean past stem closes on `ㅆ`, so `달렸` takes `다`, `니`, `구나`, `어요`
/// and `습니다` exactly the way `걸었` does. An ending may list alternatives with
/// `|` between them, and each stem gets every one of them, so the pools stay
/// index-aligned with the present-tense words the stems were written for.
PredicateTense conjugate(
  String stems, {
  required String statement,
  Map<PredicateForm, String> endings = const <PredicateForm, String>{},
}) {
  final bases = words(stems);

  List<String> attach(String ending) => List<String>.unmodifiable(
    bases.map((stem) => ending.split('|').map((each) => stem + each).join('|')),
  );

  return PredicateTense(
    words: attach(statement),
    forms: <PredicateForm, WordPool>{
      for (final entry in endings.entries) entry.key: attach(entry.value),
    },
  );
}

/// One division an outline names, and where it sits.
class OutlineEntry {
  /// Creates an entry. Built by [outline]; there is no other reason to make one.
  const OutlineEntry({required this.path, required this.depth, required this.below});

  /// The division's name and the name of every division it sits inside, largest
  /// first, one per level down to its own. `null` for a level its branch skips.
  final List<String?> path;

  /// The level the division itself is, as an index into the dataset's levels.
  final int depth;

  /// The shallowest level among the divisions directly inside it, or `null` for
  /// none.
  final int? below;
}

/// An entry while its outline is still being read: the divisions inside it are
/// what settle [below], and they come after it.
class _OpenEntry {
  _OpenEntry(this.path, this.depth);

  final List<String?> path;
  final int depth;
  int? below;
}

final RegExp _marker = RegExp(r'^(#+) (\S+)$');

/// Split an outline of divisions, [levels] deep.
///
/// A line `# name` opens a division at the first level and `## name` one at the
/// second; a line with no marker is a pool of divisions at the last level, inside
/// the division opened last. `_` stands for a space, the way it does in [words].
///
/// A pool straight after a `#` line skips the levels between: 세종특별자치시 has
/// no 시·군·구, so its 읍·면·동 follow its own line.
List<OutlineEntry> outline(String source, int levels) {
  final entries = <_OpenEntry>[];
  // The division opened last at each level, down to the deepest one still open.
  // A marker that skips a level leaves a hole, the way the npm package's does.
  final open = <_OpenEntry?>[];

  _OpenEntry add(String name, int depth, _OpenEntry? parent) {
    final path = <String?>[...?parent?.path];

    while (path.length < depth) {
      path.add(null);
    }

    path.add(name.replaceAll('_', ' '));

    final entry = _OpenEntry(List<String?>.unmodifiable(path), depth);

    if (parent != null) {
      final below = parent.below;

      parent.below = below == null || depth < below ? depth : below;
    }

    entries.add(entry);

    return entry;
  }

  for (final line in source.split('\n')) {
    final text = line.trim();

    if (text.isEmpty) {
      continue;
    }

    final marker = _marker.firstMatch(text);

    if (marker != null) {
      final depth = marker.group(1)!.length - 1;

      open.length = depth;
      open.add(add(marker.group(2)!, depth, depth > 0 ? open[depth - 1] : null));
      continue;
    }

    for (final name in text.split(_whitespace)) {
      add(name, levels - 1, open.isEmpty ? null : open.last);
    }
  }

  return List<OutlineEntry>.unmodifiable(
    entries.map((entry) => OutlineEntry(path: entry.path, depth: entry.depth, below: entry.below)),
  );
}
