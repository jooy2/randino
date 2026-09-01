// Helpers that keep the datasets readable: pools are written as whitespace-
// separated strings inside a raw multi-line string instead of one list entry
// per line, which keeps a 120-name pool to a handful of lines.

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
