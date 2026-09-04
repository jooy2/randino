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

// Attempts spent looking for an invented word of the requested length.
const int _synthAttempts = 8;

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
  var best = '';
  var bestDistance = 1 << 30;

  for (var attempt = 0; attempt < _synthAttempts; attempt += 1) {
    final syllables = randInt(template.minSyllables, template.maxSyllables);
    final buffer = StringBuffer();

    for (var i = 0; i < syllables; i += 1) {
      buffer.write(i == 0 && prefix.isNotEmpty ? prefix.toLowerCase() : pick(template.onset));
      buffer.write(pick(template.vowel));

      if (i == syllables - 1) {
        buffer.write(pick(template.coda));
      }
    }

    final word = buffer.toString();

    if (word.length >= min && word.length <= max) {
      return word;
    }

    final distance = word.length < min ? min - word.length : word.length - max;

    if (distance < bestDistance) {
      bestDistance = distance;
      best = word;
    }
  }

  return best;
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
