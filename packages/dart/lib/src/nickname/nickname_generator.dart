// The nickname generator itself. Internal — `randNickname` and
// `randNicknameDetails` are the public entry points.
//
// A nickname is a noun with something added to it: a modifier in front
// (멋진사자), a second noun behind (고양이꼬리), or both (파란고양이발바닥). The
// nouns are everyday words — animals, things, nature, ideas — and never person
// names, which is what keeps a nickname from reading like one.
//
// - `style` decides per word whether it comes out of a pool or is invented.
// - `minLength` / `maxLength` pick the shape first: a range too short for a
//   modifier drops that pattern instead of truncating a word.
// - `wordSeparator` decides what goes between the words, defaulting to the way
//   the language joins them.
// - `baseWord` pins the noun, so only the decoration varies.
//
// What used to be the fifth entry here, `uniqueSuffix`, is `randSuffix` now:
// attaching a token to a string was never a thing about nicknames.

import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/nickname/data/index.dart';
import 'package:randino/src/nickname/data/types.dart';
import 'package:randino/src/types.dart';

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

// Attempts spent looking for an invented word of the requested length.
const int _synthAttempts = 8;

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
    required this.includeModifier,
    required this.baseWord,
    required this.prefix,
    required this.separator,
  });

  final NicknameTheme? theme;
  final int style;
  final int? minLength;
  final int? maxLength;
  final bool includeModifier;
  final String baseWord;
  final String prefix;
  final String? separator;
}

/// What goes between the words: the caller's separator, or the language's own
/// joiner. Its length is part of the nickname's, so every length calculation has
/// to go through here rather than reading `data.joiner` directly.
String _joinerOf(NicknameLanguageData data, _Settings settings) =>
    settings.separator ?? data.joiner;

LengthRange _poolBounds(WordPool pool) {
  var min = 1 << 30;
  var max = 0;

  for (final word in pool) {
    if (word.length < min) min = word.length;
    if (word.length > max) max = word.length;
  }

  return LengthRange(min == 1 << 30 ? 1 : min, max == 0 ? 1 : max);
}

// Pool bounds never change, so they are worth computing once per language/theme.
final Map<String, _Bounds> _boundsCache = <String, _Bounds>{};

_Bounds _slotBounds(NicknameLanguage language, NicknameLanguageData data, NicknameTheme theme) {
  final key = '${language.name}:${theme.name}';
  final cached = _boundsCache[key];

  if (cached != null) {
    return cached;
  }

  final bounds = <_Slot, LengthRange>{
    _Slot.modifier: _poolBounds(data.modifiers),
    _Slot.noun: _poolBounds(data.nouns[theme]!),
    _Slot.part: _poolBounds(data.parts ?? const <String>[]),
  };

  _boundsCache[key] = bounds;

  return bounds;
}

/// The shapes available for the current options, in the order they are weighted.
List<_Pattern> _usablePatterns(NicknameLanguageData data, _Settings settings) {
  final baseLeads =
      settings.baseWord.isNotEmpty &&
      settings.baseWord.toLowerCase().startsWith(settings.prefix.toLowerCase());
  final usable = _patterns
      .where((pattern) {
        final slots = pattern.slots;

        if (!settings.includeModifier && slots.contains(_Slot.modifier)) return false;
        if (data.parts == null && slots.contains(_Slot.part)) return false;
        // A given base word is the noun, so something has to be added to it —
        // otherwise every nickname would come back as the word itself.
        if (settings.baseWord.isNotEmpty && slots.length < 2) return false;
        // The starting character has to land on a word the generator is free to
        // choose, unless the given base word happens to start with it already.
        if (settings.prefix.isNotEmpty &&
            settings.baseWord.isNotEmpty &&
            slots.first == _Slot.noun &&
            !baseLeads) {
          return false;
        }

        return true;
      })
      .toList(growable: false);

  // Options can rule out every shape — a base word with nothing allowed to
  // decorate it, say. The word on its own is then the only answer.
  return usable.isNotEmpty
      ? usable
      : const <_Pattern>[
        _Pattern(<_Slot>[_Slot.noun], 1),
      ];
}

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

// --- Word selection ---------------------------------------------------------

/// A pool word of a length between [min] and [max], starting with [prefix] when
/// one was asked for. Falls back to a looser fit rather than nothing, and
/// returns null only when no word starts with the requested character.
String? _pickWord(WordPool pool, int min, int max, String prefix) {
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
String _synthWord(WordSynthesis syn, int min, int max, String prefix) {
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

// `missed` marks a word that had to be invented because no real one started with
// the requested character — worth another shape or theme before settling for it.
class _Chosen {
  const _Chosen(this.word, this.missed);

  final String word;
  final bool missed;
}

_Chosen _pickSlotWord(
  NicknameLanguageData data,
  _Slot slot,
  WordPool nouns,
  _Settings settings,
  int min,
  int max,
  String prefix,
) {
  if (slot == _Slot.noun && settings.baseWord.isNotEmpty) {
    final base = settings.baseWord;

    return _Chosen(data.capitalize ? capitalizeFirst(base) : base, false);
  }

  final pool = switch (slot) {
    _Slot.modifier => data.modifiers,
    _Slot.part => data.parts!,
    _Slot.noun => nouns,
  };
  final invent = chance(settings.style);
  final word = invent ? null : _pickWord(pool, min, max, prefix);
  final chosen = word ?? _synthWord(data.syn, min, max, prefix);

  return _Chosen(data.capitalize ? capitalizeFirst(chosen) : chosen, !invent && word == null);
}

class _Built {
  const _Built(this.words, this.theme);

  final List<String> words;
  final NicknameTheme? theme;
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
  NicknameLanguageData data,
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
    final chosen = _pickSlotWord(
      data,
      slots[i],
      nouns,
      settings,
      low,
      high,
      i == 0 ? settings.prefix : '',
    );

    missed = missed || chosen.missed;
    used += gap + chosen.word.length;
    words.add(chosen.word);
  }

  return _Filled(words, missed);
}

// --- Per-nickname generation ------------------------------------------------

List<NicknameTheme> _themesOf(NicknameTheme? theme) =>
    theme == null ? nicknameThemes : <NicknameTheme>[theme];

/// Theme a word belongs to, across every theme of the language.
NicknameTheme? _themeOf(NicknameLanguageData data, String word) {
  for (final theme in nicknameThemes) {
    if (data.nouns[theme]!.contains(word)) {
      return theme;
    }
  }

  return null;
}

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
  NicknameLanguageData data,
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
LengthRange naturalRange(NicknameLanguage language, bool includeModifier, String? separator) {
  final data = nicknameData[language]!;
  final settings = _Settings(
    theme: null,
    style: 0,
    minLength: null,
    maxLength: null,
    includeModifier: includeModifier,
    baseWord: '',
    prefix: '',
    separator: separator,
  );
  final patterns = _usablePatterns(data, settings);
  final joiner = _joinerOf(data, settings).length;
  var min = 1 << 30;
  var max = 0;

  for (final theme in nicknameThemes) {
    final bounds = _slotBounds(language, data, theme);

    for (final pattern in patterns) {
      final range = _patternRange(pattern.slots, bounds, joiner);

      if (range.min < min) min = range.min;
      if (range.max > max) max = range.max;
    }
  }

  return LengthRange(min, max);
}

_Built _generateOne(NicknameLanguage language, _Settings settings) {
  final data = nicknameData[language]!;
  final themes = _themesOf(settings.theme);
  final patterns = _usablePatterns(data, settings);
  final joiner = _joinerOf(data, settings);
  _Built? best;
  var bestDistance = 1 << 30;

  for (var attempt = 0; attempt < _fitAttempts; attempt += 1) {
    // One theme per nickname, so a mixed request spreads over all of them.
    final theme = pick(themes);
    final nouns = data.nouns[theme]!;
    final cached = _slotBounds(language, data, theme);
    // A given base word takes the noun's place, so it also takes over its
    // bounds — never write that into the cache.
    final bounds =
        settings.baseWord.isEmpty
            ? cached
            : <_Slot, LengthRange>{
              ...cached,
              _Slot.noun: LengthRange(settings.baseWord.length, settings.baseWord.length),
            };

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
      // of this theme; a given base word has to be looked up, and an invented
      // one is found nowhere.
      nouns.contains(base) ? theme : _themeOf(data, base),
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

final RegExp _hangul = RegExp('[가-힣]');
final RegExp _kana = RegExp('[぀-ヿ]');
final RegExp _han = RegExp('[一-鿿]');

/// Language a given base word belongs to, so that a `baseWord` of `'고양이'` is
/// not decorated with an English modifier. Only consulted when the caller left
/// the language out.
NicknameLanguage _detectLanguage(String word) {
  if (_hangul.hasMatch(word)) return NicknameLanguage.ko;
  if (_kana.hasMatch(word)) return NicknameLanguage.ja;
  if (_han.hasMatch(word)) return NicknameLanguage.zh;

  return NicknameLanguage.en;
}

/// Generate nicknames with every choice already resolved. `randNickname` and
/// `randNicknameDetails` are the two public shapes over this.
List<NicknameDetail> generateNicknameDetails({
  NicknameLanguage? language,
  NicknameTheme? theme,
  int count = 1,
  int style = 0,
  int? minLength,
  int? maxLength,
  bool includeModifier = true,
  String? wordSeparator,
  String? baseWord,
  String? startsWith,
  bool unique = false,
}) {
  final trimmedBase = (baseWord ?? '').trim();
  final settings = _Settings(
    theme: theme,
    style: resolveStyle(style),
    minLength: minLength,
    maxLength: maxLength,
    includeModifier: includeModifier,
    baseWord: trimmedBase,
    prefix: resolvePrefix(startsWith),
    separator: wordSeparator,
  );
  final resolvedLanguage =
      language ?? (trimmedBase.isNotEmpty ? _detectLanguage(trimmedBase) : null);

  return collect<NicknameDetail>(
    count: count,
    unique: unique,
    startsWith: settings.prefix,
    // Written out: `??` would otherwise infer `pick`'s type argument from the
    // nullable left-hand side, and hand back a `NicknameLanguage?`.
    draw: () {
      final NicknameLanguage code = resolvedLanguage ?? pick(nicknameLanguages);
      final built = _generateOne(code, settings);

      return NicknameDetail(
        nickname: built.words.join(_joinerOf(nicknameData[code]!, settings)),
        words: List<String>.unmodifiable(built.words),
        language: code,
        theme: built.theme,
      );
    },
    keyOf: (detail) => detail.nickname,
  );
}
