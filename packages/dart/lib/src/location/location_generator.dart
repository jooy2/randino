// The location generator: one real division, or a whole location written out,
// drawn from the outline a language's dataset carries.
//
// Nothing here invents. A draw is an index into a list of divisions the country
// itself published, and every option narrows that list rather than shaping what
// is drawn from it — which is what keeps a Korean 동 inside the 구 it belongs to.

import 'dart:math';

import 'package:randino/src/constants.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/location/data/countries.dart';
import 'package:randino/src/location/data/index.dart';
import 'package:randino/src/location/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';

/// What one draw hands back.
enum LocationForm {
  /// A single division's name, the way `randCity` returns one.
  unit,

  /// Every level down to the division written out the way the language writes a
  /// location, the way `randLocation` returns one.
  path,
}

/// The last narrowing asked of a list, and what it came to.
class _Narrowed {
  const _Narrowed(this.key, this.indexes);

  final String key;
  final List<int> indexes;
}

/// What a draw may land on, written out.
///
/// The text is worked out once, because every length and `startsWith` filter
/// reads it and a US list is thirty-two thousand of them.
abstract class _Texts {
  List<String> texts = const <String>[];
  int shortest = 0;
  int longest = 0;

  // The last narrowing asked of this list, which is the one a loop of single
  // draws asks again: filtering thirty-two thousand names is not free, and a
  // caller drawing one at a time would pay it every call.
  _Narrowed? narrowed;
}

/// The divisions one kind of draw may land on.
class _Pool extends _Texts {
  _Pool(this.data, this.language, this.form, this.withCountry, this.entries);

  final LocationLanguageData data;
  final LocationLanguage language;
  final LocationForm form;

  // Whether a location written out opens on its country. A single division's
  // name has no country to leave out.
  final bool withCountry;

  // `null` for the country, which the outline does not hold.
  final List<OutlineEntry?> entries;
}

// Parsed once per dataset, on the first draw that needs it rather than at import:
// importing the package should not cost a split of every division it ships.
final Expando<List<OutlineEntry>> _entryCache = Expando<List<OutlineEntry>>('locationEntries');

List<OutlineEntry> _entriesOf(LocationLanguageData data) =>
    _entryCache[data] ??= outline(data.outline, data.levels.length);

/// Which of the four levels an outline depth is, as an index into
/// [locationLevels].
int _rankOf(LocationLanguageData data, int depth) => locationLevels.indexOf(data.levels[depth]);

/// The divisions a draw at [level] may land on.
///
/// A single division is one at exactly that level, so a country without the
/// level has none. A location written out stops at the deepest level the country
/// has at or above the one asked for, and at any division with nothing inside it
/// at that depth: `randLocation(level: LocationLevel.city)` has to be able to
/// reach 세종특별자치시, which has no 시·군·구 and whose branch stops at the
/// region.
List<OutlineEntry?> _entriesAt(LocationLanguageData data, LocationForm form, LocationLevel level) {
  final wanted = locationLevels.indexOf(level);

  if (wanted == 0) {
    return const <OutlineEntry?>[null];
  }

  final entries = _entriesOf(data);

  if (form == LocationForm.unit) {
    return entries.where((entry) => _rankOf(data, entry.depth) == wanted).toList(growable: false);
  }

  var limit = -1;

  for (var depth = 0; depth < data.levels.length; depth += 1) {
    if (_rankOf(data, depth) <= wanted) {
      limit = depth;
    }
  }

  return entries
      .where((entry) {
        final below = entry.below;

        return entry.depth == limit || (entry.depth < limit && (below == null || below > limit));
      })
      .toList(growable: false);
}

/// One result, built fresh per draw so a caller can never reach the pool's own
/// lists.
LocationDetail _detailOf(_Pool pool, OutlineEntry? entry) {
  final data = pool.data;

  if (entry == null) {
    return LocationDetail(
      location: data.country,
      language: pool.language,
      level: LocationLevel.country,
      country: data.country,
      region: null,
      city: null,
      district: null,
    );
  }

  final named = <LocationLevel, String?>{};

  for (var depth = 0; depth < data.levels.length; depth += 1) {
    named[data.levels[depth]] = depth < entry.path.length ? entry.path[depth] : null;
  }

  final String location;

  if (pool.form == LocationForm.unit) {
    location = entry.path[entry.depth]!;
  } else {
    final parts = <String>[if (pool.withCountry) data.country, ...entry.path.nonNulls];

    location = (data.order == LocationOrder.largestFirst ? parts : parts.reversed).join(
      data.joiner,
    );
  }

  return LocationDetail(
    location: location,
    language: pool.language,
    level: data.levels[entry.depth],
    country: data.country,
    region: named[LocationLevel.region],
    city: named[LocationLevel.city],
    district: named[LocationLevel.district],
  );
}

// One pool per language, form, level and whether it opens on the country, each
// built the first time it is drawn from.
final Expando<Map<String, _Pool>> _poolCache = Expando<Map<String, _Pool>>('locationPools');

_Pool _poolOf(LocationLanguage language, LocationForm form, LocationLevel level, bool withCountry) {
  final data = locationData[language]!;
  final byKind = _poolCache[data] ??= <String, _Pool>{};
  final key = '${form.name}:${level.name}:$withCountry';
  final cached = byKind[key];

  if (cached != null) {
    return cached;
  }

  final pool = _Pool(data, language, form, withCountry, _entriesAt(data, form, level));
  final texts = List<String>.unmodifiable(
    pool.entries.map((entry) => _detailOf(pool, entry).location),
  );
  final (shortest, longest) = _spanOf(texts);

  pool
    ..texts = texts
    ..shortest = shortest
    ..longest = longest;
  byKind[key] = pool;

  return pool;
}

/// Shortest and longest of a list of texts, `(0, 0)` for none.
(int, int) _spanOf(List<String> texts) {
  var shortest = 1 << 30;
  var longest = 0;

  for (final text in texts) {
    if (text.length < shortest) shortest = text.length;
    if (text.length > longest) longest = text.length;
  }

  return texts.isEmpty ? (0, 0) : (shortest, longest);
}

/// The indexes of a pool one call may draw from once `startsWith` and the length
/// range have had their say, or `null` for all of them when neither was asked.
///
/// A range nothing in the pool fits is answered with the divisions closest to it
/// rather than with none, the way every other generator answers one — and an
/// overshoot counts half a character worse than an undershoot, because
/// `maxLength` is the bound a caller is usually holding to.
List<int>? _narrow(_Texts pool, String prefix, int? minLength, int? maxLength) {
  if (prefix.isEmpty && minLength == null && maxLength == null) {
    return null;
  }

  final key = '$prefix|$minLength|$maxLength';
  final narrowed = pool.narrowed;

  if (narrowed != null && narrowed.key == key) {
    return narrowed.indexes;
  }

  final indexes = _narrowAfresh(pool, prefix, minLength, maxLength);

  pool.narrowed = _Narrowed(key, indexes);

  return indexes;
}

List<int> _narrowAfresh(_Texts pool, String prefix, int? minLength, int? maxLength) {
  final lower = prefix.toLowerCase();
  final matching = <int>[];

  for (var index = 0; index < pool.texts.length; index += 1) {
    if (lower.isEmpty || pool.texts[index].toLowerCase().startsWith(lower)) {
      matching.add(index);
    }
  }

  if (minLength == null && maxLength == null) {
    return List<int>.unmodifiable(matching);
  }

  final bounds = lengthBounds(
    minLength,
    maxLength,
    pool.shortest,
    pool.longest,
    ceiling: randLocationLengthMax,
  );

  double missBy(int index) {
    final length = pool.texts[index].length;

    return length < bounds.min
        ? (bounds.min - length).toDouble()
        : length > bounds.max
        ? length - bounds.max + 0.5
        : 0;
  }

  var best = double.infinity;
  final closest = <int>[];

  for (final index in matching) {
    final miss = missBy(index);

    if (miss < best) {
      best = miss;
      closest
        ..clear()
        ..add(index);
    } else if (miss == best) {
      closest.add(index);
    }
  }

  return List<int>.unmodifiable(closest);
}

/// A language's pool, and the indexes of it a call may draw from.
class _Candidate<P extends _Texts> {
  const _Candidate(this.pool, this.indexes);

  final P pool;

  // `null` for every entry of the pool.
  final List<int>? indexes;
}

/// What every location generator does: a draw at one [level], in one [form].
///
/// A null [language] means every language the location generators know.
List<LocationDetail> generateLocationDetails({
  required LocationForm form,
  required LocationLevel level,
  LocationLanguage? language,
  int count = 1,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
  bool includeCountry = true,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) {
  final prefix = resolvePrefix(startsWith);
  // A location at the country level is the country: leaving it out would leave
  // nothing, so the option only reaches the levels below it.
  final withCountry = form == LocationForm.unit || level == LocationLevel.country || includeCountry;

  // A language that cannot write the requested first character, and one with
  // nothing at the requested level, are out before a draw is made — so asking
  // every language for a 읍·면·동 draws Korean rather than spending half the
  // draws on English, which has none.
  final candidates = <_Candidate<_Pool>>[];

  for (final code in languagesWriting(language, locationLanguages, prefix)) {
    final pool = _poolOf(code, form, level, withCountry);
    final indexes =
        pool.entries.isEmpty ? const <int>[] : _narrow(pool, prefix, minLength, maxLength);

    if (indexes == null || indexes.isNotEmpty) {
      candidates.add(_Candidate(pool, indexes));
    }
  }

  if (candidates.isEmpty) {
    return <LocationDetail>[];
  }

  return withRandom(
    random,
    () => collect<LocationDetail>(
      count: count,
      unique: unique,
      startsWith: prefix,
      draw: () {
        final candidate = pick(candidates);
        final pool = candidate.pool;
        final indexes = candidate.indexes;
        final index = indexes != null ? pick(indexes) : randInt(0, pool.entries.length - 1);

        return _detailOf(pool, pool.entries[index]);
      },
      keyOf: (detail) => detail.location,
    ),
  );
}

/* --- Countries ------------------------------------------------------------ */

/// Every country's name in one language, with the code each one is known by.
class _CountryPool extends _Texts {
  _CountryPool(this.language, this.codes);

  final WordLanguage language;
  final List<String> codes;
}

// Split out of the table the first time a language is drawn from, never at
// import.
final Map<WordLanguage, _CountryPool> _countryCache = <WordLanguage, _CountryPool>{};

_CountryPool _countryPoolOf(WordLanguage language) {
  final cached = _countryCache[language];

  if (cached != null) {
    return cached;
  }

  final column = countries.languages.indexOf(language) + 1;
  final codes = <String>[];
  final texts = <String>[];

  for (final line in countries.table.split('\n')) {
    final cells = line.trim().split('|');

    if (cells.length > column) {
      codes.add(cells[0]);
      texts.add(cells[column]);
    }
  }

  final (shortest, longest) = _spanOf(texts);
  final pool = _CountryPool(language, List<String>.unmodifiable(codes));

  pool
    ..texts = List<String>.unmodifiable(texts)
    ..shortest = shortest
    ..longest = longest;
  _countryCache[language] = pool;

  return pool;
}

/// Countries in any word language: the ISO 3166-1 list, each named the way the
/// language names it.
///
/// Unlike the divisions, which only some languages have, every country has a
/// name in all nine — so this reads [language] as a word language, and a null
/// one means every word language.
List<CountryDetail> generateCountryDetails({
  WordLanguage? language,
  int count = 1,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) {
  final prefix = resolvePrefix(startsWith);
  final candidates = <_Candidate<_CountryPool>>[];

  for (final code in languagesWriting(language, wordLanguages, prefix)) {
    final pool = _countryPoolOf(code);
    final indexes = _narrow(pool, prefix, minLength, maxLength);

    if (indexes == null || indexes.isNotEmpty) {
      candidates.add(_Candidate(pool, indexes));
    }
  }

  if (candidates.isEmpty) {
    return <CountryDetail>[];
  }

  return withRandom(
    random,
    () => collect<CountryDetail>(
      count: count,
      unique: unique,
      startsWith: prefix,
      draw: () {
        final candidate = pick(candidates);
        final pool = candidate.pool;
        final indexes = candidate.indexes;
        final index = indexes != null ? pick(indexes) : randInt(0, pool.codes.length - 1);

        return CountryDetail(
          country: pool.texts[index],
          code: pool.codes[index],
          language: pool.language,
        );
      },
      keyOf: (detail) => detail.country,
    ),
  );
}
