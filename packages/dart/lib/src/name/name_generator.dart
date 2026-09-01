// The name generator itself. Internal — `randName` and `randNameDetails`
// are the public entry points.
//
// - At the realistic end of `style`, names come out of the curated pools: whole
//   given names for CJK, given/surname pools for the other scripts.
// - Toward the abstract end they are invented instead — Latin and Cyrillic
//   scripts from syllable templates, CJK by combining given-name syllables.
// - The structure the caller asked for (surname, middle name, starting letter) is
//   always honoured. The length range is satisfied by re-drawing from the pools,
//   and only padded with extra middle names when no draw can reach the minimum.
// - Every name is produced in both scripts, native and romanized.

import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/name/data/index.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/name/name_length_range.dart';
import 'package:randino/src/name/romanize.dart';
import 'package:randino/src/types.dart';

// One name part, or a whole name, in both scripts.
class _Entry {
  const _Entry(this.n, this.r);

  final String n;
  final String r;
}

class _Parts {
  _Parts({required this.given, required this.surname, required this.middles});

  _Entry given;
  _Entry? surname;
  List<_Entry> middles;
}

// Everything a single name needs, with defaults already applied. The length
// bounds stay optional here: left out, they are resolved per language, so mixing
// languages does not stretch a Korean name to fill a Spanish name's range.
class _Settings {
  const _Settings({
    required this.gender,
    required this.includeSurname,
    required this.includeMiddleName,
    required this.minLength,
    required this.maxLength,
    required this.style,
    required this.prefix,
  });

  final NameGender? gender;
  final bool includeSurname;
  final bool includeMiddleName;
  final int? minLength;
  final int? maxLength;
  final int style;
  final String prefix;
}

// How many draws to spend looking for a name that lands inside the length range
// before settling for the closest one found.
const int _fitAttempts = 12;

// Draw weight for given-name lengths the language itself never uses, on the same
// 0-100 scale as `givenLenWeights`. Only in play once the range is stretched past
// those lengths, where it also floors the natural weights so that no real length
// ends up rarer than an invented one.
const int _stretchedLenWeight = 40;

// Draw weight for a surname the language's frequency table leaves out, on the
// same tenths-of-a-percent scale the tables are written in. Only languages that
// have a table are affected; the rest keep drawing surnames evenly.
const int _lastWeightDefault = 1;

/// Pool items whose native form begins with [prefix] (case-insensitive).
NamePool _startingWith(NamePool pool, String prefix) {
  final lower = prefix.toLowerCase();

  return pool.where((item) => item.n.toLowerCase().startsWith(lower)).toList(growable: false);
}

/// Draw one pool item. Surnames follow the language's own frequency table where
/// it has one, so 김 leads a fifth of the Korean names rather than a seventy-
/// fifth, and Nguyễn two Vietnamese names in five. Given names stay an even draw
/// — a curated pool is already a list of names in use, with no comparable skew.
NameEntry _pickPooled(NamePool pool, NameLanguageData data, NamePart part) {
  final table = part == NamePart.surname ? data.lastWeights : null;

  if (table == null) {
    return pick(pool);
  }

  return pickWeighted(pool, (item) => table[item.n] ?? _lastWeightDefault);
}

/// Pick one pool item as a native + romanized entry.
_Entry _pickEntry(NamePool pool, NameLanguageData data, NamePart part) {
  final item = _pickPooled(pool, data, part);
  final roman = item.r;

  if (roman != null) {
    return _Entry(item.n, roman);
  }

  return _Entry(item.n, romanize(data.roman, item.n, part));
}

// --- Invented names ---------------------------------------------------------

/// Build a pronounceable invented part from syllable templates. [prefix]
/// replaces the first onset, so a requested starting letter that no real name
/// uses still leads a name that reads naturally (Q -> "Quen").
String _synthToken(SyllableSet syn, String prefix) {
  final syllables = randInt(syn.minSyllables, syn.maxSyllables);
  final buffer = StringBuffer();

  for (var i = 0; i < syllables; i += 1) {
    buffer.write((i == 0 && prefix.isNotEmpty ? prefix.toLowerCase() : pick(syn.onset)));
    buffer.write(pick(syn.vowel));

    if (i == syllables - 1) {
      buffer.write(pick(syn.coda));
    }
  }

  return capitalizeFirst(buffer.toString());
}

_Entry _synthEntry(NameLanguageData data, String prefix) {
  final n = _synthToken(data.syn!, prefix);

  return _Entry(n, romanize(data.roman, n, NamePart.given));
}

/// Pick the part that leads the full name when the caller asked for a starting
/// character. Prefers a real name that already starts with it; otherwise invents
/// one (Latin/Cyrillic) or uses the character verbatim (CJK, where any syllable
/// is a usable name part — so 앙 + 지수 -> 앙지수).
_Entry _leadEntry(NameLanguageData data, NamePool pool, NamePart part, String prefix) {
  final matches = _startingWith(pool, prefix);

  if (matches.isNotEmpty) {
    return _pickEntry(matches, data, part);
  }

  if (data.syn != null) {
    return _synthEntry(data, prefix);
  }

  return _Entry(prefix, romanize(data.roman, prefix, part));
}

// --- CJK given names --------------------------------------------------------

/// Compose an invented CJK given name of exactly [length] syllables.
_Entry _composeGiven(NameLanguageData data, bool isMale, int length, String prefix) {
  final firstPool = (isMale ? data.firstMale : data.firstFemale)!;
  final restPool = (isMale ? data.restMale : data.restFemale)!;

  final matches = prefix.isNotEmpty ? _startingWith(firstPool, prefix) : firstPool;
  final parts = <NameEntry>[matches.isNotEmpty ? pick(matches) : NameEntry(prefix)];

  for (var i = 1; i < length; i += 1) {
    // Avoid immediately repeating the previous syllable (e.g. 敏敏).
    var part = pick(restPool);

    for (var tries = 0; tries < 3 && part.n == parts[parts.length - 1].n; tries += 1) {
      part = pick(restPool);
    }

    parts.add(part);
  }

  final n = parts.map((part) => part.n).join();

  if (data.roman == RomanMode.hangul) {
    return _Entry(n, capitalizeFirst(romanizeHangul(n)));
  }

  // Kanji and hanzi carry their own reading, but a syllable the caller passed to
  // `startsWith` has none — fall back to the character itself rather than
  // dropping it from the romanization.
  final r = parts.map((part) => part.r ?? part.n).join();

  return _Entry(n, capitalizeFirst(r));
}

/// A real CJK given name that fits the length range, or null when the pool holds
/// none. The length follows the language's own distribution, but only over the
/// lengths the pool can actually serve: rolling a length first and then looking
/// it up would drop through to an invented name at `style: 0` whenever the pool
/// has no real name of that length — Korean lists three-syllable given names in
/// its weights and holds none, so one name in twenty-five came out invented.
_Entry? _curatedGiven(NameLanguageData data, bool isMale, int min, int max, String prefix) {
  final pool = isMale ? data.givenMale : data.givenFemale;

  if (pool == null) {
    return null;
  }

  var candidates = pool
      .where((item) => item.n.length >= min && item.n.length <= max)
      .toList(growable: false);

  if (prefix.isNotEmpty) {
    candidates = _startingWith(candidates, prefix);
  }

  if (candidates.isEmpty) {
    return null;
  }

  final available = candidates.map((item) => item.n.length).toSet();
  final length = _pickGivenLength(data, min, max, available);
  final fitting = candidates.where((item) => item.n.length == length).toList(growable: false);

  return _pickEntry(fitting.isNotEmpty ? fitting : candidates, data, NamePart.given);
}

/// How many syllables the given name should have. Inside the lengths the
/// language actually uses, follow its natural distribution. A range stretched
/// past them is a deliberate ask for names the language does not have — realism
/// is gone either way, so spread the draw over the whole range and leave the
/// common lengths only a bump, rather than capping at the longest length the
/// table happens to list.
///
/// [available] restricts the draw to the lengths a curated pool holds.
/// Stretching is off in that case: the pool, not the range, is what the caller
/// gets.
int _pickGivenLength(NameLanguageData data, int min, int max, [Set<int>? available]) {
  final weights = data.givenLenWeights;

  if (weights != null) {
    final longest = weights.keys.reduce((a, b) => a > b ? a : b);
    final stretched = available == null && max > longest;
    final options = <List<int>>[];

    for (var length = min; length <= max; length += 1) {
      if (available != null && !available.contains(length)) {
        continue;
      }

      final natural = weights[length] ?? 0;
      final weight = stretched && natural < _stretchedLenWeight ? _stretchedLenWeight : natural;

      if (weight > 0) {
        options.add(<int>[length, weight]);
      }
    }

    // A pool can hold a length the weight table does not list. Draw evenly over
    // what it holds rather than falling through to a fixed length outside it.
    if (options.isEmpty && available != null) {
      for (final length in available) {
        options.add(<int>[length, 1]);
      }
    }

    final total = options.fold<int>(0, (sum, option) => sum + option[1]);

    if (total > 0) {
      var roll = randDouble() * total;

      for (final option in options) {
        roll -= option[1];

        if (roll <= 0) {
          return option[0];
        }
      }
    }
  }

  return clampInt(2, min, max);
}

// --- Assembly ---------------------------------------------------------------

_Entry _assemble(NameLanguageData data, _Parts parts) {
  final sequence =
      data.order == NameOrder.familyFirst
          ? <_Entry?>[parts.surname, ...parts.middles, parts.given]
          : <_Entry?>[parts.given, ...parts.middles, parts.surname];
  final kept = sequence.whereType<_Entry>().toList(growable: false);

  return _Entry(
    kept.map((entry) => entry.n).join(data.joiner),
    kept.map((entry) => entry.r).join(' '),
  );
}

/// True when the surname is the part the full name starts with.
bool _surnameLeads(NameLanguageData data, bool includeSurname) =>
    data.order == NameOrder.familyFirst && includeSurname;

// --- Per-name generation ----------------------------------------------------

_Entry _generateCjk(
  NameLanguageData data,
  _Settings settings,
  bool isMale,
  int minLength,
  int maxLength,
) {
  final prefix = settings.prefix;
  final leadsWithSurname = _surnameLeads(data, settings.includeSurname);

  _Entry? surname;

  if (settings.includeSurname) {
    surname =
        leadsWithSurname
            ? _leadEntry(data, data.last, NamePart.surname, prefix)
            : _pickEntry(data.last, data, NamePart.surname);
  }

  var surnameLength = surname != null ? surname.n.length : 0;
  var min = minLength - surnameLength;
  min = min < 1 ? 1 : min;
  var max = maxLength - surnameLength;

  if (max < min && surname != null) {
    // A multi-character surname alone overflows the range — drop it.
    surname = null;
    surnameLength = 0;
    min = minLength < 1 ? 1 : minLength;
    max = maxLength < min ? min : maxLength;
  }

  max = max < min ? min : max;

  final givenPrefix = leadsWithSurname ? '' : prefix;

  _Entry drawGiven() {
    if (!chance(settings.style)) {
      final real = _curatedGiven(data, isMale, min, max, givenPrefix);

      if (real != null) {
        return real;
      }
    }

    return _composeGiven(data, isMale, _pickGivenLength(data, min, max), givenPrefix);
  }

  // Re-draw when the given name repeats the surname syllable (서 + 서연 -> 서서연).
  var given = drawGiven();

  for (var tries = 0; tries < 4 && surname != null && given.n.startsWith(surname.n); tries += 1) {
    given = drawGiven();
  }

  return _assemble(data, _Parts(given: given, surname: surname, middles: <_Entry>[]));
}

final RegExp _ruMasculine = RegExp(r'[оеё]в$|ин$|ын$');

// Named, because a Cyrillic 'а' written straight after a `$surname` in an
// interpolation is indistinguishable from a typo in either direction.
const String _ruFeminine = 'а';

/// Feminize a masculine Russian surname (Иванов -> Иванова, ...ский -> ...ская).
String _feminizeRu(String surname) {
  if (surname.endsWith('ский')) return '${surname.substring(0, surname.length - 2)}ая';
  if (surname.endsWith('ой')) return '${surname.substring(0, surname.length - 2)}ая';
  if (_ruMasculine.hasMatch(surname)) return '$surname$_ruFeminine';

  return surname;
}

/// Draw one structurally complete space-separated name, ignoring the length
/// range.
_Parts _drawParts(NameLanguageData data, _Settings settings, bool isMale) {
  final givenPool = (isMale ? data.male : data.female)!;
  final leadsWithSurname = _surnameLeads(data, settings.includeSurname);
  final givenPrefix = leadsWithSurname ? '' : settings.prefix;

  _Entry given;

  if (data.syn != null && chance(settings.style)) {
    given = _synthEntry(data, givenPrefix);
  } else if (givenPrefix.isNotEmpty) {
    given = _leadEntry(data, givenPool, NamePart.given, givenPrefix);
  } else {
    given = _pickEntry(givenPool, data, NamePart.given);
  }

  _Entry? surname;

  if (settings.includeSurname) {
    final surnamePrefix = leadsWithSurname ? settings.prefix : '';

    if (data.syn != null && chance(settings.style)) {
      surname = _synthEntry(data, surnamePrefix);
    } else if (surnamePrefix.isNotEmpty) {
      surname = _leadEntry(data, data.last, NamePart.surname, surnamePrefix);
    } else {
      var native = _pickPooled(data.last, data, NamePart.surname).n;

      if (data.roman == RomanMode.translit && !isMale) {
        native = _feminizeRu(native);
      }

      surname = _Entry(native, romanize(data.roman, native, NamePart.surname));
    }
  }

  final middles = <_Entry>[];

  if (settings.includeMiddleName && data.hasMiddle) {
    final middlePool = isMale ? (data.middleMale ?? givenPool) : (data.middleFemale ?? givenPool);
    // Languages without a dedicated middle-name pool reuse given names, so
    // re-draw rather than hand out "Levi Levi Cole".
    var middle = _pickEntry(middlePool, data, NamePart.given);

    for (var tries = 0; tries < 4 && middle.n == given.n; tries += 1) {
      middle = _pickEntry(middlePool, data, NamePart.given);
    }

    middles.add(middle);
  }

  return _Parts(given: given, surname: surname, middles: middles);
}

_Entry _generateSpaced(
  NameLanguageData data,
  _Settings settings,
  bool isMale,
  int minLength,
  int maxLength,
) {
  // Re-draw rather than trim: shortening a name by dropping parts would throw
  // away the surname or middle name the caller explicitly asked for.
  _Parts? best;
  var bestDistance = 1 << 30;

  for (var attempt = 0; attempt < _fitAttempts; attempt += 1) {
    final parts = _drawParts(data, settings, isMale);
    final length = _assemble(data, parts).n.length;

    if (length >= minLength && length <= maxLength) {
      return _assemble(data, parts);
    }

    final distance = length < minLength ? minLength - length : length - maxLength;

    if (distance < bestDistance) {
      bestDistance = distance;
      best = parts;
    }
  }

  final parts = best!;
  // Still short of the minimum: pad with extra given names, English-style.
  final givenPool = (isMale ? data.male : data.female)!;
  final required = parts.middles.length;
  final used = <String>{parts.given.n, ...parts.middles.map((entry) => entry.n)};

  for (var guard = 0; guard < 16; guard += 1) {
    final length = _assemble(data, parts).n.length;

    if (length >= minLength) {
      break;
    }

    // Pad with a part that still leaves the name inside the range, and that is
    // not in the name already — "Paul Paul Vincent Edwards" reads as a mistake.
    final room = maxLength - length - data.joiner.length;
    final fits = givenPool.where((item) => item.n.length <= room).toList(growable: false);
    final fresh = fits.where((item) => !used.contains(item.n)).toList(growable: false);
    final pad = _pickEntry(
      fresh.isNotEmpty
          ? fresh
          : fits.isNotEmpty
          ? fits
          : givenPool,
      data,
      NamePart.given,
    );

    used.add(pad.n);
    parts.middles.add(pad);
  }

  // Padding can overshoot; drop pads back off, never the requested middle name.
  while (_assemble(data, parts).n.length > maxLength && parts.middles.length > required) {
    final popped = parts.middles.removeLast();

    if (_assemble(data, parts).n.length < minLength) {
      parts.middles.add(popped);
      break;
    }
  }

  return _assemble(data, parts);
}

/// Length range for one language: what the caller asked for, falling back to the
/// language's own natural range for whichever bound was left out.
LengthRange _lengthBounds(NameLanguage language, _Settings settings) {
  final natural = nameLengthRange(
    language: language,
    includeSurname: settings.includeSurname,
    includeMiddleName: settings.includeMiddleName,
  );
  final min = clampInt(settings.minLength ?? natural.min, nameLengthMin, nameLengthMax);
  final max = clampInt(settings.maxLength ?? natural.max, nameLengthMin, nameLengthMax);

  return LengthRange(min, max < min ? min : max);
}

NameDetail _generateOne(NameLanguage language, _Settings settings) {
  final data = nameData[language]!;
  final gender = settings.gender ?? (randDouble() < 0.5 ? NameGender.male : NameGender.female);
  final isMale = gender == NameGender.male;
  final bounds = _lengthBounds(language, settings);
  final entry =
      data.joiner.isEmpty
          ? _generateCjk(data, settings, isMale, bounds.min, bounds.max)
          : _generateSpaced(data, settings, isMale, bounds.min, bounds.max);

  return NameDetail(native: entry.n, roman: entry.r, language: language, gender: gender);
}

/// Generate names with every choice already resolved. `randName` and
/// `randNameDetails` are the two public shapes over this.
List<NameDetail> generateNameDetails({
  NameLanguage? language,
  NameGender? gender,
  int count = 1,
  int style = 0,
  int? minLength,
  int? maxLength,
  bool includeSurname = true,
  bool includeMiddleName = false,
  String? startsWith,
  bool unique = false,
}) {
  final resolvedCount = clampInt(count, 0, nameCountMax);
  final settings = _Settings(
    gender: gender,
    includeSurname: includeSurname,
    includeMiddleName: includeMiddleName,
    minLength: minLength,
    maxLength: maxLength,
    style: clampInt(style, 0, 100),
    prefix: (startsWith ?? '').trim().isEmpty ? '' : (startsWith ?? '').trim().substring(0, 1),
  );
  final prefix = settings.prefix.toLowerCase();

  final seen = <String>{};
  final names = <NameDetail>[];
  // Generous enough that a plain request always fills up, while still ending a
  // `unique` request whose pool has run out of combinations.
  final maxAttempts = resolvedCount * 50 + 500;
  var attempts = 0;

  while (names.length < resolvedCount && attempts < maxAttempts) {
    attempts += 1;

    final detail = _generateOne(language ?? pick(nameLanguages), settings);

    if (detail.native.isEmpty) continue;
    if (prefix.isNotEmpty && !detail.native.toLowerCase().startsWith(prefix)) continue;

    if (unique) {
      if (seen.contains(detail.native)) continue;

      seen.add(detail.native);
    }

    names.add(detail);
  }

  return names;
}
