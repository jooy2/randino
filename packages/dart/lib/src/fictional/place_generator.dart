// The fictional place generator: a country, a region, a city or a district of a
// world that does not exist, with or without the kind of place beside its name.
//
// A place is a name — drawn from the pools or invented, the way a fictional
// person's is — and maybe a kind out of `fictionalKinds`, each language writing
// the kind in its own template. The name is spelled in all five scripts and the
// kind in all nine languages, so writing a place in another language is reading
// another column, the way it is for a name.

import 'dart:math';

import 'package:randino/src/fictional/data/index.dart';
import 'package:randino/src/fictional/options.dart';
import 'package:randino/src/fictional/pools.dart';
import 'package:randino/src/fictional/spelling.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

// Draws spent on one place before settling for the closest to the length range.
const int _fitAttempts = 12;

/// The letter each level goes by in the datasets' first cell.
const Map<LocationLevel, String> _levelLetter = <LocationLevel, String>{
  LocationLevel.country: 'n',
  LocationLevel.region: 'r',
  LocationLevel.city: 'c',
  LocationLevel.district: 'd',
};

/// One kind of place, and how each language writes it.
final class _Kind {
  const _Kind({
    required this.code,
    required this.levels,
    required this.borrowed,
    required this.templates,
  });

  final FictionalPlaceKind code;

  final String levels;

  /// Whether a language borrows the kind's English word when `kindStyle` is
  /// left out.
  final bool borrowed;

  /// Each language's two templates for the kind: the English word borrowed,
  /// and its own word.
  final Map<WordLanguage, (String borrowed, String translated)> templates;
}

final class _PlacePools {
  const _PlacePools({required this.kinds, required this.stems, required this.endings});

  final List<_Kind> kinds;

  /// Each level's names, keyed by its letter.
  final Map<String, List<Spelling>> stems;

  /// Each level's endings for an invented name, keyed by its letter.
  final Map<String, List<Spelling>> endings;
}

final _PlacePools _placePools = _splitPlaces();

_PlacePools _splitPlaces() {
  final kinds = <_Kind>[
    for (final cells in rows(fictionalKinds))
      if (cells case [
        final code,
        final levels,
        final style,
        final en,
        final ko,
        final koT,
        final ja,
        final jaT,
        final zh,
        final ru,
        final ruT,
        final vi,
        final es,
        final it,
        final de,
      ])
        _Kind(
          code: FictionalPlaceKind.values.byName(code),
          levels: levels,
          borrowed: style == 'borrowed',
          templates: <WordLanguage, (String, String)>{
            WordLanguage.en: (en, en),
            WordLanguage.ko: (ko, koT),
            WordLanguage.ja: (ja, jaT),
            WordLanguage.zh: (zh, zh),
            WordLanguage.ru: (ru, ruT),
            WordLanguage.vi: (en, vi),
            WordLanguage.es: (en, es),
            WordLanguage.it: (en, it),
            WordLanguage.de: (en, de),
          },
        ),
  ];
  final stems = <String, List<Spelling>>{'n': [], 'r': [], 'c': [], 'd': []};
  final endings = <String, List<Spelling>>{'n': [], 'r': []};

  for (final (:cells, :spelling) in spelledRows(fictionalPlaces)) {
    for (final letter in cells[0].split('')) {
      stems[letter]?.add(spelling);
    }
  }

  // A district is named after a family as often as not, so it draws from the
  // surnames too; a surname the place pool already holds is one entry.
  final named = <String>{for (final stem in stems['d']!) stem[latinScript]};

  for (final surname in pools().surnames) {
    if (!named.contains(surname[latinScript])) {
      stems['d']!.add(surname);
    }
  }

  for (final (:cells, :spelling) in spelledRows(fictionalPlaceEndings)) {
    for (final letter in cells[0].split('')) {
      endings[letter]?.add(spelling);
    }
  }

  return _PlacePools(
    kinds: List<_Kind>.unmodifiable(kinds),
    stems: stems.map((letter, pool) => MapEntry(letter, List<Spelling>.unmodifiable(pool))),
    endings: endings.map((letter, pool) => MapEntry(letter, List<Spelling>.unmodifiable(pool))),
  );
}

/// The template a language writes a kind in, `{}` standing for the name.
String _templateOf(_Kind kind, WordLanguage language, FictionalKindStyle? style) {
  final borrowed = style == null ? kind.borrowed : style == FictionalKindStyle.borrowed;
  final (borrowedTemplate, translatedTemplate) = kind.templates[language]!;

  return borrowed ? borrowedTemplate : translatedTemplate;
}

/// A template with the name written in.
String _fill(String template, String name) => template.split('{}').join(name);

final class _Settings {
  const _Settings({
    required this.base,
    required this.level,
    required this.kind,
    required this.style,
    required this.invent,
  });

  final FictionalBase base;

  final LocationLevel level;

  /// Null leaves the kind to chance.
  final bool? kind;

  final FictionalKindStyle? style;

  final int invent;
}

/// A name invented for a place on [level], out of syllables or out of two
/// halves.
Spelling? _makeStem(LocationLevel level, int script, String prefix, Room? room) {
  final letter = _levelLetter[level]!;

  if (!chance(fictionalSyllableChance[level]!)) {
    return makeCompound(letter, script, prefix, room);
  }

  // A district built from syllables is named like a person: `Kalira Park`.
  if (level == LocationLevel.district) {
    return makeGiven(chance(50) ? NameGender.female : NameGender.male, script, prefix, room);
  }

  final kept = pools();
  final endings = _placePools.endings[letter]!;

  return assemble(
    chance(fictionalMiddleChance)
        ? <List<Spelling>>[kept.heads, kept.middles, endings]
        : <List<Spelling>>[kept.heads, endings],
    script,
    prefix,
    room,
  );
}

// What a name for a place on each level can come out at in each script, for
// the names the pools hold, the invented ones, or both, as `realism` draws them.
final Map<String, (int, int)> _stemSpanCache = <String, (int, int)>{};

(int, int) _stemSpan(LocationLevel level, int script, int invent) =>
    _stemSpanCache.putIfAbsent('${level.name}|$script|$invent', () {
      final letter = _levelLetter[level]!;
      final kept = pools();
      final halves = halvesFor(letter);
      final syllables = fictionalSyllableChance[level]!;
      final shapes = <List<List<Spelling>>>[];

      if (invent > 0 && syllables < 100) {
        shapes.add(<List<Spelling>>[halves.fronts, halves.backs]);
      }

      if (invent > 0 && syllables > 0) {
        final closing =
            level == LocationLevel.district
                ? <Spelling>[...kept.ends[NameGender.male]!, ...kept.ends[NameGender.female]!]
                : _placePools.endings[letter]!;

        shapes
          ..add(<List<Spelling>>[kept.heads, closing])
          ..add(<List<Spelling>>[kept.heads, kept.middles, closing]);
      }

      return spanIn(invent < 100 ? _placePools.stems[letter]! : const <Spelling>[], shapes, script);
    });

final Map<LocationLevel, List<_Kind>> _kindCache = <LocationLevel, List<_Kind>>{};

/// The kinds a place on [level] may be.
List<_Kind> _kindsOn(LocationLevel level) => _kindCache.putIfAbsent(level, () {
  final letter = _levelLetter[level]!;

  return List<_Kind>.unmodifiable(_placePools.kinds.where((kind) => kind.levels.contains(letter)));
});

/// What a place on [level] in [language] can come out at, with or without a
/// kind: [kind] true always has one, false never, and null either.
LengthRange _rangeOf(
  WordLanguage language,
  LocationLevel level,
  bool? kind,
  FictionalKindStyle? style,
  int invent,
) {
  final (low, high) = _stemSpan(level, scriptOf(language), invent);
  final overheads = <int>[
    for (final each in _kindsOn(level)) _templateOf(each, language, style).length - 2,
  ];
  final withKind = kind != false;
  final withoutKind = kind != true;

  return LengthRange(
    withoutKind ? low : low + overheads.reduce(min),
    withKind ? high + overheads.reduce(max) : high,
  );
}

/// The kind written beside a place, or null for none.
_Kind? _chooseKind(WordLanguage language, _Settings settings) {
  final kinds = _kindsOn(settings.level);
  final bounds = settings.base.bounds;

  if (bounds == null) {
    return (settings.kind ?? chance(fictionalKindChance[settings.level]!)) ? pick(kinds) : null;
  }

  // A kind whose template leaves no name able to land inside the range is
  // passed over while another one leaves some, and when the range can only be
  // met with a kind or only without one, a kind left to chance is decided by
  // the range.
  final (low, high) = _stemSpan(settings.level, scriptOf(language), settings.invent);
  final fitting = kinds
      .where((kind) {
        final overhead = _templateOf(kind, language, settings.style).length - 2;

        return overhead + high >= bounds.min && overhead + low <= bounds.max;
      })
      .toList(growable: false);
  final bare = high >= bounds.min && low <= bounds.max;
  final include =
      settings.kind ??
      (fitting.isNotEmpty && !bare
          ? true
          : (fitting.isEmpty && bare ? false : chance(fictionalKindChance[settings.level]!)));

  return include ? pick(fitting.isNotEmpty ? fitting : kinds) : null;
}

/// A kind's code as a name would hold it: `moors` is in `Highmoor` as `moor`.
String _stemOfCode(FictionalPlaceKind code) =>
    code.name.endsWith('s') ? code.name.substring(0, code.name.length - 1) : code.name;

/// One place and the string it is told apart from others by, whatever language
/// it is written in.
typedef _Drawn = ({FictionalPlaceDetail detail, String key});

_Drawn? _draft(WordLanguage language, _Settings settings) {
  final script = scriptOf(language);
  final prefix = prefixIn(settings.base.prefix, script);
  final kind = _chooseKind(language, settings);
  final overhead = kind == null ? 0 : _templateOf(kind, language, settings.style).length - 2;
  final bounds = settings.base.bounds;
  final Room? room =
      bounds == null ? null : (low: bounds.min - overhead, high: bounds.max - overhead);
  final letter = _levelLetter[settings.level]!;
  final stem = drawWord(
    spelledMatching(_placePools.stems[letter]!, script, prefix),
    () => _makeStem(settings.level, script, prefix, room),
    settings.invent,
    script,
    prefix,
    room,
  );

  // A kind the name already says is drawn again: `Port Galeport`, `Highmoor
  // Moors`.
  if (stem == null ||
      (kind != null && stem[latinScript].toLowerCase().contains(_stemOfCode(kind.code)))) {
    return null;
  }

  String write(WordLanguage code) {
    final name = stem[scriptOf(code)];

    return kind == null ? name : _fill(_templateOf(kind, code, settings.style), name);
  }

  return (
    detail: FictionalPlaceDetail(
      place: write(language),
      name: stem[script],
      kind: kind?.code,
      level: settings.level,
      language: language,
      forms: Map<WordLanguage, String>.unmodifiable(<WordLanguage, String>{
        for (final code in settings.base.forms) code: write(code),
      }),
    ),
    key: '${stem[latinScript]}|${kind?.code.name ?? ''}',
  );
}

_Drawn? _generateOne(WordLanguage language, _Settings settings) {
  _Drawn? best;
  var bestMiss = double.infinity;
  final bounds = settings.base.bounds;

  for (var attempt = 0; attempt < _fitAttempts; attempt += 1) {
    final drawn = _draft(language, settings);

    if (drawn == null) {
      continue;
    }

    final miss = bounds == null ? 0.0 : missBy(drawn.detail.place.length, bounds.min, bounds.max);

    if (miss == 0) {
      return drawn;
    }

    if (miss < bestMiss) {
      best = drawn;
      bestMiss = miss;
    }
  }

  return best;
}

/// What the four fictional place generators and their `…Forms` and detail forms
/// all do, for the places on [level].
///
/// [listed] draws every place in the first language of [language] and writes it
/// in the rest; otherwise each place is drawn in one language of it.
List<FictionalPlaceDetail> generateFictionalPlaceDetails(
  LocationLevel level, {
  Set<WordLanguage>? language,
  bool listed = false,
  bool? includeKind,
  FictionalKindStyle? kindStyle,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
  Random? random,
}) {
  final invent = resolveRealism(realism);
  final settings = _Settings(
    base: resolveBase(
      language: language,
      listed: listed,
      startsWith: startsWith,
      minLength: minLength,
      maxLength: maxLength,
      rangeOf: (code) => _rangeOf(code, level, includeKind, kindStyle, invent),
    ),
    level: level,
    kind: includeKind,
    style: kindStyle,
    invent: invent,
  );

  if (settings.base.languages.isEmpty) {
    return <FictionalPlaceDetail>[];
  }

  final results = withRandom(
    random,
    () => collect<_Drawn?>(
      count: count,
      unique: unique,
      // `startsWith` is the place's name, not its kind, and is checked as each
      // place is drawn: `Kingdom of Edlin` starts with `E`.
      startsWith: '',
      draw: () => _generateOne(pick(settings.base.languages), settings),
      keyOf: (drawn) => drawn?.detail.place ?? '',
      uniqueOf: (drawn) => drawn?.key ?? '',
    ),
  );

  return <FictionalPlaceDetail>[
    for (final drawn in results)
      if (drawn != null) drawn.detail,
  ];
}
