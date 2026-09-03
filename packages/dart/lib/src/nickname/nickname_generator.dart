// The nickname generator itself. Internal — `randNickname` and
// `randNicknameDetails` are the public entry points.
//
// A nickname is a noun with something added to it: a word for what it is like in
// front (멋진사자), one for what it is doing (웃는사자), a second noun behind
// (고양이꼬리), or a possessive between the two (사자의눈물). The nouns are the
// `word` category's pools — animals, things, nature, ideas — and never person
// names, which is what keeps a nickname from reading like one. Drawing one word
// is `word/word_generator.dart`; putting several of them together is what this
// file is.
//
// - Which shapes exist is the language's own business, and `data.frames` is
//   where it says so. A shape carries its particles with it, so Chinese can put
//   的 between a verb and its noun where Korean needs nothing.
// - `realism` decides per word whether it comes out of a pool or is invented,
//   and which themes a null `theme` spans — see `looseThemes`.
// - `minLength` / `maxLength` pick the shape first: a range too short for a
//   modifier drops that frame instead of truncating a word.
// - `wordSeparator` decides what goes between the words, defaulting to the way
//   the language joins them.
//
// What used to be the fifth entry here, `uniqueSuffix`, is `randSuffix` now:
// attaching a token to a string was never a thing about nicknames.

import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/data/types.dart';
import 'package:randino/src/word/word_generator.dart';

// How many shapes to try before settling for the closest fit found.
const int _fitAttempts = 12;

typedef _Bounds = Map<WordSlot, LengthRange>;

// Everything a single nickname needs, with defaults already applied. The length
// bounds stay optional: left out, they are resolved per language and theme. So
// does the separator, which falls back to the language's own joiner.
class _Settings {
  const _Settings({
    required this.theme,
    required this.invent,
    required this.loose,
    required this.minLength,
    required this.maxLength,
    required this.prefix,
    required this.separator,
  });

  final WordTheme? theme;

  /// How often one part is invented rather than drawn, as a percentage.
  final int invent;

  /// Whether the themes that make an awkward nickname are in play. Off at
  /// [RandRealism.real], which is what keeps a null theme readable.
  final bool loose;
  final int? minLength;
  final int? maxLength;
  final String prefix;
  final String? separator;
}

/// The themes one nickname may draw from.
///
/// A null [_Settings.theme] spans every theme a nickname can carry, which at
/// [RandRealism.real] is every theme but the loose ones; a theme the caller
/// named is always honoured.
List<WordTheme> _themesFor(_Settings settings) {
  if (settings.theme != null || settings.loose) {
    return themesOf(settings.theme);
  }

  return wordThemes.where((theme) => !looseThemes.contains(theme)).toList(growable: false);
}

/// What goes between the words: the caller's separator, or the language's own
/// joiner. Its length is part of the nickname's, so every length calculation has
/// to go through here rather than reading `data.joiner` directly.
String _joinerOf(WordLanguageData data, _Settings settings) => settings.separator ?? data.joiner;

// Pool bounds never change, so they are worth computing once per language/theme.
final Map<String, _Bounds> _boundsCache = <String, _Bounds>{};

_Bounds _slotBounds(WordLanguage language, WordLanguageData data, WordTheme theme) {
  final key = '${language.name}:${theme.name}';
  final cached = _boundsCache[key];

  if (cached != null) {
    return cached;
  }

  final bounds = <WordSlot, LengthRange>{
    WordSlot.adjective: poolBounds(data.adjectives),
    WordSlot.action: poolBounds(data.actions),
    WordSlot.noun: poolBounds(data.nouns[theme]!),
    WordSlot.part: poolBounds(data.parts ?? const <String>[]),
  };

  _boundsCache[key] = bounds;

  return bounds;
}

/// What sits in front of the slot at [index], in characters: the frame's own
/// particle for that gap, and then whatever joins the words. Nothing at all in
/// front of the first slot.
int _gapOf(WordFrame frame, int index, int joiner) =>
    index == 0 ? 0 : frame.glueAt(index).length + joiner;

/// Shortest and longest nickname a frame can produce.
LengthRange _frameRange(WordFrame frame, _Bounds bounds, int joiner) {
  var min = 0;
  var max = 0;

  for (var i = 0; i < frame.slots.length; i += 1) {
    final gap = _gapOf(frame, i, joiner);

    min += gap + bounds[frame.slots[i]]!.min;
    max += gap + bounds[frame.slots[i]]!.max;
  }

  return LengthRange(min, max);
}

WordFrame _pickFrame(List<WordFrame> frames) {
  final total = frames.fold<int>(0, (sum, frame) => sum + frame.weight);
  var roll = randDouble() * total;

  for (final frame in frames) {
    roll -= frame.weight;

    if (roll <= 0) {
      return frame;
    }
  }

  return frames[frames.length - 1];
}

/// The pool one slot draws from.
WordPool _poolOf(WordLanguageData data, WordSlot slot, WordPool nouns) => switch (slot) {
  WordSlot.adjective => data.adjectives,
  WordSlot.action => data.actions,
  // Only a frame of the language's own can ask for this, and one that does is
  // only written where the pool is.
  WordSlot.part => data.parts!,
  WordSlot.noun => nouns,
};

/// The finished string: the words in order, with the frame's particles between
/// them.
String _assemble(List<String> words, WordFrame frame, String joiner) {
  final buffer = StringBuffer();

  for (var i = 0; i < words.length; i += 1) {
    if (i > 0) {
      buffer
        ..write(frame.glueAt(i))
        ..write(joiner);
    }

    buffer.write(words[i]);
  }

  return buffer.toString();
}

class _Built {
  const _Built(this.words, this.nickname, this.theme);

  final List<String> words;
  final String nickname;
  final WordTheme? theme;
}

class _Filled {
  const _Filled(this.words, this.missed);

  final List<String> words;
  final bool missed;
}

/// Fill a frame with words. Each slot is given the room left once the slots
/// after it have been reserved theirs, so the last word can always close the gap
/// to [min] and nothing overshoots [max].
_Filled _buildWords(
  WordLanguageData data,
  WordFrame frame,
  _Bounds bounds,
  WordPool nouns,
  _Settings settings,
  int min,
  int max,
) {
  final joiner = _joinerOf(data, settings).length;
  final words = <String>[];
  final nounAt = frame.slots.indexOf(WordSlot.noun);
  // A language that inflects has to know the noun's gender before it draws a
  // modifier, and its frames may put the modifier first (`blauer Wal`). So the
  // noun is drawn ahead of its turn and waits for the slot it belongs to; its
  // length is then exact rather than a range, which keeps the length fitting as
  // tight as it is for every other language.
  final early =
      data.agreement != null && nounAt > 0
          ? drawWord(
            data,
            nouns,
            settings.invent,
            bounds[WordSlot.noun]!.min,
            bounds[WordSlot.noun]!.max,
            '',
          )
          : null;
  LengthRange span(int index) =>
      early != null && index == nounAt
          ? LengthRange(early.word.length, early.word.length)
          : bounds[frame.slots[index]]!;
  WordGender? gender = early == null ? null : data.nounGender?[early.word];
  var missed = false;
  var used = 0;

  for (var i = 0; i < frame.slots.length; i += 1) {
    final gap = _gapOf(frame, i, joiner);
    var restMin = 0;
    var restMax = 0;

    for (var rest = i + 1; rest < frame.slots.length; rest += 1) {
      final restGap = _gapOf(frame, rest, joiner);

      restMin += span(rest).min + restGap;
      restMax += span(rest).max + restGap;
    }

    final lowRaw = min - used - gap - restMax;
    final low = lowRaw < 1 ? 1 : lowRaw;
    final highRaw = max - used - gap - restMin;
    final high = highRaw < low ? low : highRaw;
    final slot = frame.slots[i];
    final pool = _poolOf(data, slot, nouns);
    final chosen =
        early != null && i == nounAt
            ? early
            : drawWord(data, pool, settings.invent, low, high, i == 0 ? settings.prefix : '');
    // A language that inflects makes its modifiers agree with the noun, which is
    // why the noun is in hand before any of them is drawn.
    final word = slot == WordSlot.noun ? chosen.word : agree(data, chosen.word, gender);

    if (slot == WordSlot.noun && early == null) gender = data.nounGender?[chosen.word];

    missed = missed || chosen.missed;
    used += gap + word.length;
    words.add(word);
  }

  return _Filled(words, missed);
}

// --- Per-nickname generation ------------------------------------------------

/// True when one word ends on the character the next one starts with (石霜 +
/// 霜雨). Only meaningful where the two run straight together — a particle or a
/// capital between them reads fine, and plenty of real words double a character
/// inside themselves (씩씩한, Sunny).
bool _hasBoundaryRepeat(List<String> words, WordFrame frame) {
  for (var i = 1; i < words.length; i += 1) {
    if (frame.glueAt(i).isEmpty &&
        words[i - 1].substring(words[i - 1].length - 1) == words[i].substring(0, 1)) {
      return true;
    }
  }

  return false;
}

/// Length range for one language and theme: what the caller asked for, falling
/// back to everything the language's frames can produce.
LengthRange _lengthBounds(WordLanguageData data, _Bounds bounds, _Settings settings) {
  final joiner = _joinerOf(data, settings).length;
  var naturalMin = 1 << 30;
  var naturalMax = 0;

  for (final frame in data.frames) {
    final range = _frameRange(frame, bounds, joiner);

    if (range.min < naturalMin) naturalMin = range.min;
    if (range.max > naturalMax) naturalMax = range.max;
  }

  return lengthBounds(settings.minLength, settings.maxLength, naturalMin, naturalMax);
}

/// Every length a language can produce, across all of its themes — the fallback
/// for an omitted `minLength` / `maxLength`, and what `nicknameLengthRange`
/// reports. Kept here so it is derived from the same frames and pools the
/// generator actually draws from.
LengthRange naturalRange(WordLanguage language, String? separator) {
  final data = wordData[language]!;
  final settings = _Settings(
    theme: null,
    invent: 0,
    loose: true,
    minLength: null,
    maxLength: null,
    prefix: '',
    separator: separator,
  );
  final joiner = _joinerOf(data, settings).length;
  var min = 1 << 30;
  var max = 0;

  for (final theme in wordThemes) {
    final bounds = _slotBounds(language, data, theme);

    for (final frame in data.frames) {
      final range = _frameRange(frame, bounds, joiner);

      if (range.min < min) min = range.min;
      if (range.max > max) max = range.max;
    }
  }

  return LengthRange(min, max);
}

_Built _generateOne(WordLanguage language, _Settings settings) {
  final data = wordData[language]!;
  final themes = _themesFor(settings);
  final joiner = _joinerOf(data, settings);
  _Built? best;
  var bestDistance = 1 << 30;

  for (var attempt = 0; attempt < _fitAttempts; attempt += 1) {
    // One theme per nickname, so a mixed request spreads over all of them.
    final theme = pick(themes);
    final nouns = data.nouns[theme]!;
    final bounds = _slotBounds(language, data, theme);
    final range = _lengthBounds(data, bounds, settings);
    // Prefer a shape that can actually land inside the range.
    final fitting = data.frames
        .where((frame) {
          final span = _frameRange(frame, bounds, joiner.length);

          return span.max >= range.min && span.min <= range.max;
        })
        .toList(growable: false);
    final frame = _pickFrame(fitting.isNotEmpty ? fitting : data.frames);
    final filled = _buildWords(data, frame, bounds, nouns, settings, range.min, range.max);
    final base = filled.words[frame.slots.indexOf(WordSlot.noun)];
    final nickname = _assemble(filled.words, frame, joiner);
    final built = _Built(
      filled.words,
      nickname,
      // Only a word the generator knows carries a theme. A drawn word came out
      // of this theme; an invented one has to be looked up, because it can spell
      // a real word by accident.
      nouns.contains(base) ? theme : themeOf(data, base),
    );
    final length = nickname.length;
    // Worth spending another attempt on, but not worth failing over: a real word
    // may well start with the requested character in one of the other themes,
    // and another draw will not stutter across the word boundary.
    final rough =
        filled.missed ||
        (joiner.isEmpty && !data.capitalize && _hasBoundaryRepeat(filled.words, frame));

    if (length >= range.min && length <= range.max && !rough) {
      return built;
    }

    final over = length - range.max;
    final distance =
        (length < range.min ? range.min - length : (over > 0 ? over : 0)) + (rough ? 1 : 0);

    if (distance < bestDistance) {
      bestDistance = distance;
      best = built;
    }
  }

  return best!;
}

/// Generate nicknames with every choice already resolved. `randNickname` and
/// `randNicknameDetails` are the two public shapes over this.
List<NicknameDetail> generateNicknameDetails({
  WordLanguage? language,
  WordTheme? theme,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? wordSeparator,
  String? startsWith,
  bool unique = false,
}) {
  final settings = _Settings(
    theme: theme,
    invent: resolveRealism(realism),
    loose: realism != RandRealism.real,
    minLength: minLength,
    maxLength: maxLength,
    prefix: resolvePrefix(startsWith),
    separator: wordSeparator,
  );

  return collect<NicknameDetail>(
    count: count,
    unique: unique,
    startsWith: settings.prefix,
    // Written out: `??` would otherwise infer `pick`'s type argument from the
    // nullable left-hand side, and hand back a `WordLanguage?`.
    draw: () {
      final WordLanguage code = language ?? pick(wordLanguages);
      final built = _generateOne(code, settings);

      return NicknameDetail(
        nickname: built.nickname,
        words: List<String>.unmodifiable(built.words),
        language: code,
        theme: built.theme,
      );
    },
    keyOf: (detail) => detail.nickname,
  );
}
