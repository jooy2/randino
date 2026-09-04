// The word generator, and the word-drawing primitives the nickname generator
// builds on top of it.
//
// A word is one entry of one theme's pool — an animal, a thing, something in
// nature — or an invented one that only reads like the language. That is the
// whole of `randWord`; a nickname is what you get when several of these are put
// together, which is why the drawing lives here and the composing lives in
// `nickname/nickname_generator.dart`.

import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/data/types.dart';

// How many themes to try before settling for the closest word found.
const int _fitAttempts = 12;

/// The two decorating pools as one, for a draw that does not care whether it
/// gets a word for what the noun is like or one for what it is doing.
///
/// Built per call: every draw already walks the pool it is given, so holding
/// this one would save nothing worth the bookkeeping.
WordPool modifiersOf(WordLanguageData data, [ModifierKind? kind]) => switch (kind) {
  ModifierKind.adjective => data.adjectives,
  ModifierKind.action => data.actions,
  null => <String>[...data.adjectives, ...data.actions],
};

/// A modifier reshaped to agree with a noun of [gender].
///
/// The first rule whose ending matches wins; a word none of them match is
/// already right, which is how Spanish `azul` stays `azul` beside both `gato`
/// and `luna`. A language with no agreement hands the word straight back.
String agree(WordLanguageData data, String word, WordGender? gender) {
  final rules = gender == null ? null : data.agreement?[gender];

  if (rules == null) return word;

  for (final rule in rules) {
    if (word.endsWith(rule[0])) {
      return word.substring(0, word.length - rule[0].length) + rule[1];
    }
  }

  return word;
}

/// Whether a modifier follows the noun rather than leading it.
///
/// The language's own frames already say so: Vietnamese writes `mèo xanh`, the
/// rest write `파란 고양이`. Read from the frames rather than declared beside
/// them, so a language cannot state one order and compose in the other.
bool modifierFollows(WordLanguageData data) {
  for (final frame in data.frames) {
    final noun = frame.slots.indexOf(WordSlot.noun);
    final modifier = frame.slots.indexOf(WordSlot.adjective);

    if (noun >= 0 && modifier >= 0) return modifier > noun;
  }

  return false;
}

/// Shortest and longest entry of [pool], counting an empty entry as the zero it
/// is. [poolBounds] answers the same question for a pool of words, where an empty
/// result would mean nothing; a coda pool holds the empty string on purpose.
LengthRange _pieceSpan(WordPool pool) {
  var min = 1 << 30;
  var max = 0;

  for (final entry in pool) {
    if (entry.length < min) min = entry.length;
    if (entry.length > max) max = entry.length;
  }

  return LengthRange(min == 1 << 30 ? 0 : min, max);
}

/// What a word of [count] syllables can be, at its shortest and at its longest.
LengthRange _syllableSpan(SyllableSynthesis syn, int count) {
  final onset = _pieceSpan(syn.onset);
  final vowel = _pieceSpan(syn.vowel);
  final coda = _pieceSpan(syn.coda);

  return LengthRange(
    count * (onset.min + vowel.min) + coda.min,
    count * (onset.max + vowel.max) + coda.max,
  );
}

/// Shortest and longest word the invention template can make, the way
/// [poolBounds] reports the same about a pool.
///
/// What a caller asking for an invented word can be given is decided here rather
/// than by the pools, and a length budget measured against the pools is wrong by
/// however far the two differ — English invents at most two syllables where its
/// pools hold words of twelve letters.
LengthRange synthBounds(WordSynthesis syn) {
  if (syn is PoolSynthesis) {
    // One entry is one character, so the length is the number of entries.
    return LengthRange(
      syn.minSyllables < 1 ? 1 : syn.minSyllables,
      syn.maxSyllables < 1 ? 1 : syn.maxSyllables,
    );
  }

  final template = syn as SyllableSynthesis;
  final low = _syllableSpan(template, template.minSyllables).min;
  final high = _syllableSpan(template, template.maxSyllables).max;

  return LengthRange(low < 1 ? 1 : low, high < 1 ? 1 : high);
}

/// One piece of an invented word, as close to the room left for it as the pool
/// allows.
String _fittingPiece(WordPool pool, int low, int high) {
  final fitting = pool.where((entry) => entry.length >= low && entry.length <= high).toList();

  if (fitting.isNotEmpty) return pick(fitting);

  // Every piece that comes equally close, not the first of them: a room no piece
  // fits is the common case at the ends of a range, and taking the first turned
  // every such word into the same one.
  final closest = <String>[];
  var bestDistance = 1 << 30;

  for (final entry in pool) {
    final distance =
        entry.length < low
            ? low - entry.length
            : entry.length > high
            ? entry.length - high
            : 0;

    if (distance < bestDistance) {
      bestDistance = distance;
      closest
        ..clear()
        ..add(entry);
    } else if (distance == bestDistance) {
      closest.add(entry);
    }
  }

  return closest.isEmpty ? '' : pick(closest);
}

/// Shortest and longest word in [pool].
LengthRange poolBounds(WordPool pool) {
  var min = 1 << 30;
  var max = 0;

  for (final word in pool) {
    if (word.length < min) min = word.length;
    if (word.length > max) max = word.length;
  }

  return LengthRange(min == 1 << 30 ? 1 : min, max == 0 ? 1 : max);
}

/// The themes one draw may use. A null [theme] means every one of them.
List<WordTheme> themesOf(WordTheme? theme) => theme == null ? wordThemes : <WordTheme>[theme];

/// Theme a word belongs to, across every theme of the language.
WordTheme? themeOf(WordLanguageData data, String word) {
  for (final theme in wordThemes) {
    if (data.nouns[theme]!.contains(word)) {
      return theme;
    }
  }

  return null;
}

/// A pool word of a length between [min] and [max], starting with [prefix] when
/// one was asked for.
///
/// Falls back to a looser fit rather than nothing, and returns null only when no
/// word starts with the requested character.
String? pickWord(WordPool pool, int min, int max, String prefix) {
  final candidates =
      prefix.isEmpty
          ? pool
          : pool
              .where((word) => word.toLowerCase().startsWith(prefix.toLowerCase()))
              .toList(growable: false);

  if (candidates.isEmpty) {
    return null;
  }

  final fitting = candidates
      .where((word) => word.length >= min && word.length <= max)
      .toList(growable: false);

  if (fitting.isNotEmpty) {
    return pick(fitting);
  }

  final shortEnough = candidates.where((word) => word.length <= max).toList(growable: false);

  if (shortEnough.isNotEmpty) {
    return pick(shortEnough);
  }

  final longEnough = candidates.where((word) => word.length >= min).toList(growable: false);

  return pick(longEnough.isNotEmpty ? longEnough : candidates);
}

/// Build one invented word, as close to the requested length as the template
/// allows.
String synthWord(WordSynthesis syn, int min, int max, String prefix) {
  if (syn is PoolSynthesis) {
    // One entry is one character, so the length is the number of entries.
    final low = min < 1 ? 1 : min;
    final high = max < low ? low : max;
    final count = clampInt(randInt(syn.minSyllables, syn.maxSyllables), low, high);
    final buffer = StringBuffer(prefix);
    var last = prefix.isEmpty ? '' : prefix.substring(prefix.length - 1);

    for (var i = prefix.length; i < count; i += 1) {
      // Avoid immediately repeating a character (狼狼).
      var next = pick(syn.pool);

      for (var tries = 0; tries < 3 && next == last; tries += 1) {
        next = pick(syn.pool);
      }

      buffer.write(next);
      last = next;
    }

    return buffer.toString();
  }

  final template = syn as SyllableSynthesis;
  // Built against the length rather than sampled until something fits. Drawing
  // each piece at random and re-rolling the whole word missed a third of the
  // exact lengths English, Spanish, Italian, German and Russian were asked for:
  // the shortest and the longest word a template can spell need every piece to
  // come out that way at once, which random sampling almost never does.
  final counts = <int>[];

  for (var count = template.minSyllables; count <= template.maxSyllables; count += 1) {
    final span = _syllableSpan(template, count);

    if (span.max >= min && span.min <= max) counts.add(count);
  }

  final syllables =
      counts.isNotEmpty ? pick(counts) : randInt(template.minSyllables, template.maxSyllables);
  // The pieces the word is spelled out of, in order. A requested first character
  // stands in for the opening onset, which is what makes `startsWith` work.
  final pieces = <WordPool>[];

  for (var i = 0; i < syllables; i += 1) {
    pieces.add(i == 0 && prefix.isNotEmpty ? <String>[prefix.toLowerCase()] : template.onset);
    pieces.add(template.vowel);
  }

  pieces.add(template.coda);

  // What the pieces after each one can still add, so a piece is only chosen from
  // the lengths that leave the rest of the word able to land in the range.
  final restLow = List<int>.filled(pieces.length + 1, 0);
  final restHigh = List<int>.filled(pieces.length + 1, 0);

  for (var i = pieces.length - 1; i >= 0; i -= 1) {
    final span = _pieceSpan(pieces[i]);

    restLow[i] = span.min + restLow[i + 1];
    restHigh[i] = span.max + restHigh[i + 1];
  }

  final buffer = StringBuffer();

  for (var i = 0; i < pieces.length; i += 1) {
    final written = buffer.length;

    buffer.write(
      _fittingPiece(pieces[i], min - written - restHigh[i + 1], max - written - restLow[i + 1]),
    );
  }

  return buffer.toString();
}

/// One word out of a pool, or an invented one.
///
/// [missed] marks a word that had to be invented because no real one started
/// with the requested character — worth another theme before settling for it.
class Drawn {
  /// Creates a drawn word.
  const Drawn(this.word, this.missed);

  /// The word itself.
  final String word;

  /// Whether a real word starting with the requested character was not found.
  final bool missed;
}

/// Draw one word from [pool], or invent one [invent] percent of the time.
Drawn drawWord(WordLanguageData data, WordPool pool, int invent, int min, int max, String prefix) {
  final made = chance(invent);
  final word = made ? null : pickWord(pool, min, max, prefix);
  final chosen = word ?? synthWord(data.syn, min, max, prefix);

  return Drawn(data.capitalize ? capitalizeFirst(chosen) : chosen, !made && word == null);
}

/// Every length the language's pools hold, across the requested themes.
///
/// The fallback for an omitted `minLength` / `maxLength`, and what
/// `wordLengthRange` reports.
LengthRange naturalRange(WordLanguage language, WordTheme? theme) {
  final data = wordData[language]!;
  var min = 1 << 30;
  var max = 0;

  for (final each in themesOf(theme)) {
    final bounds = poolBounds(data.nouns[each]!);

    if (bounds.min < min) min = bounds.min;
    if (bounds.max > max) max = bounds.max;
  }

  return LengthRange(min, max);
}

WordDetail _generateOne(
  WordLanguage language,
  WordTheme? theme,
  int invent,
  int? minLength,
  int? maxLength,
  String prefix,
) {
  final data = wordData[language]!;
  final themes = themesOf(theme);
  WordDetail? best;
  var bestDistance = 1 << 30;

  for (var attempt = 0; attempt < _fitAttempts; attempt += 1) {
    // One theme per word, so a mixed request spreads over all of them.
    final drawnTheme = pick(themes);
    final pool = data.nouns[drawnTheme]!;
    final natural = poolBounds(pool);
    final range = lengthBounds(minLength, maxLength, natural.min, natural.max);
    final drawn = drawWord(data, pool, invent, range.min, range.max, prefix);
    final detail = WordDetail(
      word: drawn.word,
      language: language,
      // A drawn word came out of this theme; an invented one has to be looked
      // up, because it can spell a real word by accident.
      theme: pool.contains(drawn.word) ? drawnTheme : themeOf(data, drawn.word),
    );

    if (drawn.word.length >= range.min && drawn.word.length <= range.max && !drawn.missed) {
      return detail;
    }

    // Worth spending another attempt on: a real word may well start with the
    // requested character in one of the other themes.
    final over = drawn.word.length - range.max;
    final distance =
        (drawn.word.length < range.min ? range.min - drawn.word.length : (over > 0 ? over : 0)) +
        (drawn.missed ? 1 : 0);

    if (distance < bestDistance) {
      bestDistance = distance;
      best = detail;
    }
  }

  return best!;
}

/// Generate words with every choice already resolved.
///
/// `randWord`, `randWordDetails` and the twenty-five themed functions are the
/// public shapes over this.
List<WordDetail> generateWordDetails({
  WordLanguage? language,
  WordTheme? theme,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) {
  final invent = resolveRealism(realism);
  final prefix = resolvePrefix(startsWith);

  return collect<WordDetail>(
    count: count,
    unique: unique,
    startsWith: prefix,
    // Written out: `??` would otherwise infer `pick`'s type argument from the
    // nullable left-hand side, and hand back a `WordLanguage?`.
    draw: () {
      final WordLanguage code = language ?? pick(wordLanguages);

      return _generateOne(code, theme, invent, minLength, maxLength, prefix);
    },
    keyOf: (detail) => detail.word,
  );
}
