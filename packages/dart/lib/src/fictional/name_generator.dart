// The fictional name generator: a name for a character in a story or a game,
// spelled in Latin letters first and written by its sound in every other script.
//
// A name is a given name and, when asked for, a family name. Each part is drawn
// from the pools or invented out of parts, decided per part the way `realism`
// decides it for `randName`, and every part carries its spelling in all five
// scripts, so writing a name in another language is reading another column.

import 'dart:math';

import 'package:randino/src/fictional/options.dart';
import 'package:randino/src/fictional/pools.dart';
import 'package:randino/src/fictional/spelling.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

// Draws spent on one name before settling for the closest to the length range.
// Each part is already drawn against the room the other leaves, so what is left
// to miss is an invented part, whose length is only roughly in hand.
const int _fitAttempts = 12;

const List<NameGender> _bothGenders = <NameGender>[NameGender.male, NameGender.female];

final class _Settings {
  const _Settings({
    required this.base,
    required this.gender,
    required this.surname,
    required this.invent,
  });

  final FictionalBase base;

  /// Null for either gender.
  final NameGender? gender;

  final bool surname;

  final int invent;
}

typedef _Spans = ({(int, int) given, (int, int) surname});

// Worked out once per gender, script and realism: every draw of a name with a
// surname or a length range reads them, and they only depend on the pools.
final Map<String, _Spans> _spanCache = <String, _Spans>{};

/// The shortest and the longest a given name, and a surname, can come out in
/// one script: the pools' names, the invented ones, or both, as `realism` draws
/// them. A null [gender] is either.
_Spans _spansIn(NameGender? gender, int script, int invent) =>
    _spanCache.putIfAbsent('${gender?.name ?? 'all'}|$script|$invent', () {
      final kept = pools();
      final halves = halvesFor('s');
      final genders = gender == null ? _bothGenders : <NameGender>[gender];
      final real = invent < 100;
      final made = invent > 0;
      final givenSpans = <(int, int)>[
        for (final each in genders)
          spanIn(
            real ? kept.given[each]! : const <Spelling>[],
            made
                ? <List<List<Spelling>>>[
                  <List<Spelling>>[kept.heads, kept.ends[each]!],
                  <List<Spelling>>[kept.heads, kept.middles, kept.ends[each]!],
                ]
                : const <List<List<Spelling>>>[],
            script,
          ),
      ];

      return (
        given: (
          givenSpans.map((span) => span.$1).reduce(min),
          givenSpans.map((span) => span.$2).reduce(max),
        ),
        surname: spanIn(
          real ? kept.surnames : const <Spelling>[],
          made
              ? <List<List<Spelling>>>[
                <List<Spelling>>[halves.fronts, halves.backs],
              ]
              : const <List<List<Spelling>>>[],
          script,
        ),
      );
    });

/// What a name in [script] can come out at under these settings.
LengthRange _rangeIn(int script, NameGender? gender, bool surname, int invent) {
  final spans = _spansIn(gender, script, invent);

  if (!surname) {
    return LengthRange(spans.given.$1, spans.given.$2);
  }

  final joiner = nameJoiners[script].length;

  return LengthRange(
    spans.given.$1 + joiner + spans.surname.$1,
    spans.given.$2 + joiner + spans.surname.$2,
  );
}

/// The gender of one name: the one asked for, or either of the two. With a
/// length range, a gender whose names cannot meet it in this script is passed
/// over while the other's can — Japanese writes a man's name no longer than
/// seven characters and a woman's up to eight.
NameGender _genderFor(int script, _Settings settings) {
  final asked = settings.gender;

  if (asked != null) {
    return asked;
  }

  final bounds = settings.base.bounds;
  final fitting =
      bounds == null
          ? _bothGenders
          : _bothGenders.where((gender) {
            final range = _rangeIn(script, gender, settings.surname, settings.invent);

            return range.max >= bounds.min && range.min <= bounds.max;
          }).toList();

  return fitting.length == 1
      ? fitting[0]
      : (randDouble() < 0.5 ? NameGender.male : NameGender.female);
}

/// One name and the string it is told apart from others by, whatever language
/// it is written in.
typedef _Drawn = ({FictionalNameDetail detail, String key});

_Drawn? _draft(WordLanguage language, _Settings settings) {
  final script = scriptOf(language);
  final prefix = prefixIn(settings.base.prefix, script);
  final gender = _genderFor(script, settings);
  final kept = pools();
  final bounds = settings.base.bounds;
  Spelling? surname;
  Room? room = bounds == null ? null : (low: bounds.min, high: bounds.max);

  if (settings.surname) {
    final joiner = nameJoiners[script].length;
    final spans = _spansIn(gender, script, settings.invent);
    // The surname takes the room a given name of any length still leaves, so
    // that the given name drawn after it has somewhere to land.
    final Room? surnameRoom =
        bounds == null
            ? null
            : (
              low: bounds.min - joiner - spans.given.$2,
              high: bounds.max - joiner - spans.given.$1,
            );
    final drawn = drawWord(
      kept.surnames,
      () => makeCompound('s', script, '', surnameRoom),
      settings.invent,
      script,
      '',
      surnameRoom,
    );

    if (drawn == null) {
      return null;
    }

    surname = drawn;
    room =
        bounds == null
            ? null
            : (
              low: bounds.min - joiner - drawn[script].length,
              high: bounds.max - joiner - drawn[script].length,
            );
  }

  final givenRoom = room;
  final first = drawWord(
    spelledMatching(kept.given[gender]!, script, prefix),
    () => makeGiven(gender, script, prefix, givenRoom),
    settings.invent,
    script,
    prefix,
    givenRoom,
  );

  if (first == null) {
    return null;
  }

  final family = surname;

  String write(WordLanguage code) {
    final at = scriptOf(code);

    return family == null ? first[at] : first[at] + nameJoiners[at] + family[at];
  }

  return (
    detail: FictionalNameDetail(
      name: write(language),
      gender: gender,
      language: language,
      forms: Map<WordLanguage, String>.unmodifiable(<WordLanguage, String>{
        for (final code in settings.base.forms) code: write(code),
      }),
    ),
    key: family == null ? first[latinScript] : '${first[latinScript]} ${family[latinScript]}',
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

    final miss = bounds == null ? 0.0 : missBy(drawn.detail.name.length, bounds.min, bounds.max);

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

/// What `randFictionalName`, `randFictionalNameForms` and
/// `randFictionalNameDetails` all do.
///
/// [listed] draws every name in the first language of [language] and writes it
/// in the rest; otherwise each name is drawn in one language of it.
List<FictionalNameDetail> generateFictionalNameDetails({
  Set<WordLanguage>? language,
  bool listed = false,
  NameGender? gender,
  bool includeSurname = false,
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
      rangeOf: (code) => _rangeIn(scriptOf(code), gender, includeSurname, invent),
    ),
    gender: gender,
    surname: includeSurname,
    invent: invent,
  );

  if (settings.base.languages.isEmpty) {
    return <FictionalNameDetail>[];
  }

  final results = withRandom(
    random,
    () => collect<_Drawn?>(
      count: count,
      unique: unique,
      // `startsWith` is checked as each name is drawn: a Japanese name is
      // spelled in katakana, and a hiragana prefix has to match it.
      startsWith: '',
      draw: () => _generateOne(pick(settings.base.languages), settings),
      keyOf: (drawn) => drawn?.detail.name ?? '',
      uniqueOf: (drawn) => drawn?.key ?? '',
    ),
  );

  return <FictionalNameDetail>[
    for (final drawn in results)
      if (drawn != null) drawn.detail,
  ];
}
