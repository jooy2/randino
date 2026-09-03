// The nickname generator itself. Internal — `randNickname` and
// `randNicknameDetails` are the public entry points.
//
// A nickname is a noun with something added to it: a modifier in front
// (멋진사자), a second noun behind (고양이꼬리), or both (파란고양이발바닥). The
// nouns are the `word` category's pools — animals, things, nature, ideas — and
// never person names, which is what keeps a nickname from reading like one.
// Drawing one word is `word/word_generator.dart`; putting several of them
// together is what this file is.
//
// - `style` decides per word whether it comes out of a pool or is invented.
// - `minLength` / `maxLength` pick the shape first: a range too short for a
//   modifier drops that pattern instead of truncating a word.
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

enum _Slot { modifier, noun, part }

class _Pattern {
  const _Pattern(this.slots, this.weight);

  final List<_Slot> slots;
  final int weight;
}

// The shapes a nickname can take, and how often each one is used. A bare noun
// stays rare on purpose — a modifier is what makes a nickname feel picked.
const List<_Pattern> _patterns = <_Pattern>[
  _Pattern(<_Slot>[_Slot.noun], 12),
  _Pattern(<_Slot>[_Slot.modifier, _Slot.noun], 50),
  _Pattern(<_Slot>[_Slot.noun, _Slot.part], 12),
  _Pattern(<_Slot>[_Slot.modifier, _Slot.noun, _Slot.part], 26),
];

// How many shapes to try before settling for the closest fit found.
const int _fitAttempts = 12;

typedef _Bounds = Map<_Slot, LengthRange>;

// Everything a single nickname needs, with defaults already applied. The length
// bounds stay optional: left out, they are resolved per language and theme. So
// does the separator, which falls back to the language's own joiner.
class _Settings {
  const _Settings({
    required this.theme,
    required this.style,
    required this.minLength,
    required this.maxLength,
    required this.prefix,
    required this.separator,
  });

  final WordTheme? theme;
  final int style;
  final int? minLength;
  final int? maxLength;
  final String prefix;
  final String? separator;
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

  final bounds = <_Slot, LengthRange>{
    _Slot.modifier: poolBounds(modifiersOf(data)),
    _Slot.noun: poolBounds(data.nouns[theme]!),
    _Slot.part: poolBounds(data.parts ?? const <String>[]),
  };

  _boundsCache[key] = bounds;

  return bounds;
}

/// The shapes available for the language, in the order they are weighted.
///
/// The only shapes a language can rule out are the compound ones, and only by
/// having no `parts` pool — which `ja` and `zh` do not.
List<_Pattern> _usablePatterns(WordLanguageData data) => _patterns
    .where((pattern) => data.parts != null || !pattern.slots.contains(_Slot.part))
    .toList(growable: false);

/// Shortest and longest nickname a shape can produce.
LengthRange _patternRange(List<_Slot> slots, _Bounds bounds, int joiner) {
  final gaps = (slots.length - 1) * joiner;
  var min = gaps;
  var max = gaps;

  for (final slot in slots) {
    min += bounds[slot]!.min;
    max += bounds[slot]!.max;
  }

  return LengthRange(min, max);
}

List<_Slot> _pickPattern(List<_Pattern> patterns) {
  final total = patterns.fold<int>(0, (sum, pattern) => sum + pattern.weight);
  var roll = randDouble() * total;

  for (final pattern in patterns) {
    roll -= pattern.weight;

    if (roll <= 0) {
      return pattern.slots;
    }
  }

  return patterns[patterns.length - 1].slots;
}

class _Built {
  const _Built(this.words, this.theme);

  final List<String> words;
  final WordTheme? theme;
}

class _Filled {
  const _Filled(this.words, this.missed);

  final List<String> words;
  final bool missed;
}

/// Fill a shape with words. Each slot is given the room left once the slots
/// after it have been reserved theirs, so the last word can always close the gap
/// to [min] and nothing overshoots [max].
_Filled _buildWords(
  WordLanguageData data,
  List<_Slot> slots,
  _Bounds bounds,
  WordPool nouns,
  _Settings settings,
  int min,
  int max,
) {
  final joiner = _joinerOf(data, settings).length;
  final words = <String>[];
  var missed = false;
  var used = 0;

  for (var i = 0; i < slots.length; i += 1) {
    final gap = i > 0 ? joiner : 0;
    var restMin = 0;
    var restMax = 0;

    for (var rest = i + 1; rest < slots.length; rest += 1) {
      restMin += bounds[slots[rest]]!.min + joiner;
      restMax += bounds[slots[rest]]!.max + joiner;
    }

    final lowRaw = min - used - gap - restMax;
    final low = lowRaw < 1 ? 1 : lowRaw;
    final highRaw = max - used - gap - restMin;
    final high = highRaw < low ? low : highRaw;
    final slot = slots[i];
    final pool = switch (slot) {
      _Slot.modifier => modifiersOf(data),
      _Slot.part => data.parts!,
      _Slot.noun => nouns,
    };
    final chosen = drawWord(data, pool, settings.style, low, high, i == 0 ? settings.prefix : '');

    missed = missed || chosen.missed;
    used += gap + chosen.word.length;
    words.add(chosen.word);
  }

  return _Filled(words, missed);
}

// --- Per-nickname generation ------------------------------------------------

/// True when one word ends on the character the next one starts with (石霜 +
/// 霜雨). Only meaningful where words run together with neither a separator nor
/// a capital between them — plenty of real words double a character inside
/// themselves (씩씩한, Sunny).
bool _hasBoundaryRepeat(List<String> words) {
  for (var i = 1; i < words.length; i += 1) {
    if (words[i - 1].substring(words[i - 1].length - 1) == words[i].substring(0, 1)) {
      return true;
    }
  }

  return false;
}

/// Length range for one language and theme: what the caller asked for, falling
/// back to everything the available shapes can produce.
LengthRange _lengthBounds(
  WordLanguageData data,
  _Bounds bounds,
  List<_Pattern> patterns,
  _Settings settings,
) {
  var naturalMin = 1 << 30;
  var naturalMax = 0;

  for (final pattern in patterns) {
    final range = _patternRange(pattern.slots, bounds, _joinerOf(data, settings).length);

    if (range.min < naturalMin) naturalMin = range.min;
    if (range.max > naturalMax) naturalMax = range.max;
  }

  return lengthBounds(settings.minLength, settings.maxLength, naturalMin, naturalMax);
}

/// Every length a language can produce, across all of its themes — the fallback
/// for an omitted `minLength` / `maxLength`, and what `nicknameLengthRange`
/// reports. Kept here so it is derived from the same shapes and pools the
/// generator actually draws from.
LengthRange naturalRange(WordLanguage language, String? separator) {
  final data = wordData[language]!;
  final settings = _Settings(
    theme: null,
    style: 0,
    minLength: null,
    maxLength: null,
    prefix: '',
    separator: separator,
  );
  final patterns = _usablePatterns(data);
  final joiner = _joinerOf(data, settings).length;
  var min = 1 << 30;
  var max = 0;

  for (final theme in wordThemes) {
    final bounds = _slotBounds(language, data, theme);

    for (final pattern in patterns) {
      final range = _patternRange(pattern.slots, bounds, joiner);

      if (range.min < min) min = range.min;
      if (range.max > max) max = range.max;
    }
  }

  return LengthRange(min, max);
}

_Built _generateOne(WordLanguage language, _Settings settings) {
  final data = wordData[language]!;
  final themes = themesOf(settings.theme);
  final patterns = _usablePatterns(data);
  final joiner = _joinerOf(data, settings);
  _Built? best;
  var bestDistance = 1 << 30;

  for (var attempt = 0; attempt < _fitAttempts; attempt += 1) {
    // One theme per nickname, so a mixed request spreads over all of them.
    final theme = pick(themes);
    final nouns = data.nouns[theme]!;
    final bounds = _slotBounds(language, data, theme);
    final range = _lengthBounds(data, bounds, patterns, settings);
    // Prefer a shape that can actually land inside the range.
    final fitting = patterns
        .where((pattern) {
          final span = _patternRange(pattern.slots, bounds, joiner.length);

          return span.max >= range.min && span.min <= range.max;
        })
        .toList(growable: false);
    final slots = _pickPattern(fitting.isNotEmpty ? fitting : patterns);
    final filled = _buildWords(data, slots, bounds, nouns, settings, range.min, range.max);
    final base = filled.words[slots.indexOf(_Slot.noun)];
    final built = _Built(
      filled.words,
      // Only a word the generator knows carries a theme. A drawn word came out
      // of this theme; an invented one has to be looked up, because it can spell
      // a real word by accident.
      nouns.contains(base) ? theme : themeOf(data, base),
    );
    final length = filled.words.join(joiner).length;
    // Worth spending another attempt on, but not worth failing over: a real word
    // may well start with the requested character in one of the other themes,
    // and another draw will not stutter across the word boundary.
    final rough =
        filled.missed || (joiner.isEmpty && !data.capitalize && _hasBoundaryRepeat(filled.words));

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
  int style = 0,
  int? minLength,
  int? maxLength,
  String? wordSeparator,
  String? startsWith,
  bool unique = false,
}) {
  final settings = _Settings(
    theme: theme,
    style: resolveStyle(style),
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
        nickname: built.words.join(_joinerOf(wordData[code]!, settings)),
        words: List<String>.unmodifiable(built.words),
        language: code,
        theme: built.theme,
      );
    },
    keyOf: (detail) => detail.nickname,
  );
}
