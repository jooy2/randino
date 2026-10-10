// The organization generator: a company, a school, an office or an association
// that does not exist, written the way its language writes one.
//
// A name is a template from the language's data with its gaps filled, and a
// company may carry its legal form around the whole of it. Nothing here knows a
// language's word order: that is in the templates. A length range is met by
// setting aside the shapes that cannot land inside it before one is chosen, and
// by filling each gap from the entries that leave the gaps behind it room —
// see the JavaScript package's `organizationGenerator.ts`, which this mirrors.

import 'dart:math';

import 'package:randino/src/constants.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/organization/data/index.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';

// Draws spent on one result before settling for the closest. The shapes and the
// gaps are already chosen against the range, so what is left to miss is an
// invented stem, whose length is only roughly in hand.
const int _fitAttempts = 12;

// The company shape that is a stem and a legal form and nothing else.
const String _bare = '{stem}';

final RegExp _gap = RegExp(r'\{(stem|industry|place|number)\}');

/// One run of a template: the text the language writes, or a gap to fill.
class _Piece {
  const _Piece.text(String this.text) : slot = null;
  const _Piece.slot(String this.slot) : text = null;

  final String? text;
  final String? slot;
}

// A template is split once and kept: the same few dozen are read on every draw.
final Map<String, List<_Piece>> _pieceCache = <String, List<_Piece>>{};

List<_Piece> _piecesOf(String template) => _pieceCache.putIfAbsent(template, () {
  final pieces = <_Piece>[];
  var last = 0;

  for (final match in _gap.allMatches(template)) {
    if (match.start > last) {
      pieces.add(_Piece.text(template.substring(last, match.start)));
    }

    pieces.add(_Piece.slot(match.group(1)!));
    last = match.end;
  }

  if (last < template.length) {
    pieces.add(_Piece.text(template.substring(last)));
  }

  return List<_Piece>.unmodifiable(pieces);
});

/// The legal form a template writes around `{name}`, on its own: `Inc.` out of
/// `{name}, Inc.`, `ООО` out of `ООО «{name}»`.
String legalFormOf(String template) => template
    .replaceFirst('{name}', '')
    .replaceAll(RegExp('[«»]'), '')
    .replaceAll(RegExp(r'^[\s,]+|[\s,]+$'), '');

/// How many characters a legal form adds to the name it is written around.
int _overheadOf(String? form) => form == null ? 0 : form.length - '{name}'.length;

/// The entries of a pool that start with [prefix], or all of them for none.
List<String> _matching(List<String> pool, String prefix) {
  if (prefix.isEmpty) {
    return pool;
  }

  final lower = prefix.toLowerCase();

  return pool.where((entry) => entry.toLowerCase().startsWith(lower)).toList();
}

// Worked out once per pool: every one of them is a module constant.
final Map<List<String>, (int, int)> _spanCache = Map<List<String>, (int, int)>.identity();

(int, int) _spanOfPool(List<String> pool) => _spanCache.putIfAbsent(pool, () {
  if (pool.isEmpty) {
    return (0, 0);
  }

  var shortest = pool.first.length;
  var longest = pool.first.length;

  for (final entry in pool) {
    shortest = min(shortest, entry.length);
    longest = max(longest, entry.length);
  }

  return (shortest, longest);
});

/// What an invented stem of [count] syllables can come out at.
(int, int) _syllableSpan(OrganizationSynthesis syn, int count) {
  switch (syn) {
    case OrganizationPoolSynthesis():
      final (low, high) = _spanOfPool(syn.pool);
      final joins = (count - 1) * syn.joiner.length;

      return (count * low + joins, count * high + joins);
    case OrganizationSyllableSynthesis():
      final onset = _spanOfPool(syn.onset);
      final vowel = _spanOfPool(syn.vowel);
      final coda = _spanOfPool(syn.coda);

      return (count * (onset.$1 + vowel.$1) + coda.$1, count * (onset.$2 + vowel.$2) + coda.$2);
  }
}

// How many times a stem that spells a company is drawn again before it is kept.
const int _avoidAttempts = 8;

/// A stem nobody chose, spelled the way the language spells one, of a syllable
/// count that can land between [low] and [high] where one can.
String inventStem(OrganizationSynthesis syn, String prefix, [num low = 0, num high = 1 << 30]) {
  final counts = <int>[
    for (var count = syn.minSyllables; count <= syn.maxSyllables; count += 1)
      if (_syllableSpan(syn, count).$2 >= low && _syllableSpan(syn, count).$1 <= high) count,
  ];
  final count = counts.isNotEmpty ? pick(counts) : randInt(syn.minSyllables, syn.maxSyllables);

  switch (syn) {
    case OrganizationPoolSynthesis():
      final firsts = _matching(syn.pool, prefix);
      final first = firsts.isNotEmpty ? pick(firsts) : prefix;
      var stem = first;

      // A stem that spells a company the pool was trimmed against is drawn again
      // from its second syllable on. The first may be the caller's own character,
      // which is how `startsWith: '동'` put `동` back in front of `아`.
      for (var attempt = 0; attempt < _avoidAttempts; attempt += 1) {
        final parts = <String>[first];

        while (parts.length < count) {
          var next = pick(syn.pool);

          // The same syllable twice in a row reads as a stutter (솔솔, 瑞瑞).
          for (var tries = 0; tries < 3 && next == parts.last; tries += 1) {
            next = pick(syn.pool);
          }

          parts.add(next);
        }

        stem = parts.join(syn.joiner);

        if (!syn.avoid.any(stem.contains)) break;
      }

      return stem;
    case OrganizationSyllableSynthesis():
      final word = StringBuffer();

      for (var i = 0; i < count; i += 1) {
        word.write(i == 0 && prefix.isNotEmpty ? prefix.toLowerCase() : pick(syn.onset));
        word.write(pick(syn.vowel));
      }

      word.write(pick(syn.coda));

      return capitalizeFirst(word.toString());
  }
}

/// How far a length is from a range, an overshoot counting half a character worse.
double _missBy(int length, (num, num) bounds) {
  final (low, high) = bounds;

  return length < low ? (low - length).toDouble() : (length > high ? length - high + 0.5 : 0.0);
}

/// An entry of [pool] between [low] and [high] characters long, or the closest
/// there is when none is — `null` only for an empty pool.
String? _fitting(List<String> pool, num low, num high) {
  if (pool.isEmpty) {
    return null;
  }

  final inside = pool.where((entry) => entry.length >= low && entry.length <= high).toList();

  if (inside.isNotEmpty) {
    return pick(inside);
  }

  var closest = <String>[];
  var best = double.infinity;

  for (final entry in pool) {
    final miss = _missBy(entry.length, (low, high));

    if (miss < best) {
      best = miss;
      closest = <String>[entry];
    } else if (miss == best) {
      closest.add(entry);
    }
  }

  return pick(closest);
}

class _Settings {
  const _Settings({
    required this.types,
    required this.industry,
    required this.legalForm,
    required this.invent,
    required this.prefix,
    required this.bounds,
  });

  final List<OrganizationType> types;
  // `null` is every industry.
  final OrganizationIndustry? industry;
  // `null` leaves a company's legal form to chance.
  final bool? legalForm;
  final int invent;
  final String prefix;
  final LengthRange? bounds;
}

// Every word that says what a company does, per language.
final Map<OrganizationLanguageData, List<String>> _descriptorCache =
    Map<OrganizationLanguageData, List<String>>.identity();

List<String> _everyDescriptor(OrganizationLanguageData data) =>
    _descriptorCache.putIfAbsent(data, () {
      return List<String>.unmodifiable(<String>[
        ...data.generic,
        for (final industry in organizationIndustries) ...data.industries[industry]!,
      ]);
    });

List<String> _descriptorsFor(OrganizationLanguageData data, OrganizationIndustry? wanted) =>
    wanted == null ? _everyDescriptor(data) : data.industries[wanted]!;

final Map<OrganizationLanguageData, List<String>> _numberCache =
    Map<OrganizationLanguageData, List<String>>.identity();

/// The numbers a `{number}` gap can be, as text.
List<String> _numbersOf(OrganizationLanguageData data) => _numberCache.putIfAbsent(data, () {
  final (low, high) = data.numbers ?? (1, 1);

  return List<String>.unmodifiable(<String>[for (var n = low; n <= high; n += 1) '$n']);
});

/// What one gap can come out at.
(int, int) _gapSpan(String slot, OrganizationLanguageData data, _Settings settings) {
  switch (slot) {
    case 'stem':
      final real = _spanOfPool(data.stems);
      final made = (
        _syllableSpan(data.syn, data.syn.minSyllables).$1,
        _syllableSpan(data.syn, data.syn.maxSyllables).$2,
      );

      if (settings.invent <= 0) {
        return real;
      }

      return settings.invent >= 100 ? made : (min(real.$1, made.$1), max(real.$2, made.$2));
    case 'industry':
      return _spanOfPool(_descriptorsFor(data, settings.industry));
    case 'place':
      return _spanOfPool(data.places ?? const <String>[]);
    default:
      final (low, high) = data.numbers ?? (1, 1);

      return ('$low'.length, '$high'.length);
  }
}

(int, int) _pieceSpan(_Piece piece, OrganizationLanguageData data, _Settings settings) =>
    piece.text != null
        ? (piece.text!.length, piece.text!.length)
        : _gapSpan(piece.slot!, data, settings);

/// What a template can come out at, its text and every gap together.
(int, int) _templateSpan(String template, OrganizationLanguageData data, _Settings settings) {
  var low = 0;
  var high = 0;

  for (final piece in _piecesOf(template)) {
    final (shortest, longest) = _pieceSpan(piece, data, settings);

    low += shortest;
    high += longest;
  }

  return (low, high);
}

/// Whether a template can put the prefix first, before any of it is drawn.
bool _leadsWith(String template, OrganizationLanguageData data, _Settings settings) {
  final prefix = settings.prefix;
  final pieces = _piecesOf(template);

  if (prefix.isEmpty || pieces.isEmpty) {
    return true;
  }

  final first = pieces.first;

  if (first.text != null) {
    return first.text!.toLowerCase().startsWith(prefix.toLowerCase());
  }

  switch (first.slot) {
    case 'stem':
      // A stem can always be invented to start with it.
      return true;
    case 'industry':
      return _matching(_descriptorsFor(data, settings.industry), prefix).isNotEmpty;
    case 'place':
      return _matching(data.places ?? const <String>[], prefix).isNotEmpty;
    default:
      return _matching(_numbersOf(data), prefix).isNotEmpty;
  }
}

/// One shape a result can take: a template, and the legal forms it may be
/// written in.
class _Shape {
  const _Shape(this.template, this.forms);

  final String template;
  final List<String?> forms;
}

/// The legal forms of a shape that let it land inside the range.
List<String?> _formsThatFit(_Shape shape, OrganizationLanguageData data, _Settings settings) {
  final bounds = settings.bounds;

  if (bounds == null) {
    return shape.forms;
  }

  final (low, high) = _templateSpan(shape.template, data, settings);

  return shape.forms.where((form) {
    final extra = _overheadOf(form);

    return high + extra >= bounds.min && low + extra <= bounds.max;
  }).toList();
}

/// What one language can answer a call with, worked out once per call.
class _Plan {
  const _Plan(this.language, this.data, this.shapes, this.types);

  final WordLanguage language;
  final OrganizationLanguageData data;
  final Map<OrganizationType, List<_Shape>> shapes;
  final List<OrganizationType> types;
}

_Plan _planFor(WordLanguage language, _Settings settings) {
  final data = organizationData[language]!;
  final shapes = <OrganizationType, List<_Shape>>{};
  final fitting = <OrganizationType>[];
  final forms =
      settings.legalForm == true
          ? <String?>[...data.legalForms]
          : settings.legalForm == false
          ? <String?>[null]
          : <String?>[null, ...data.legalForms];

  for (final type in settings.types) {
    final company = type == OrganizationType.company;
    final listed = <_Shape>[
      for (final template in data.templates[type]!)
        if (_leadsWith(template, data, settings))
          _Shape(template, company ? forms : const <String?>[null]),
    ];

    // A company named by its stem alone says nothing about its business, so it
    // is only one when no industry was asked for, and it always takes a legal
    // form, so it is never one when legal forms were turned off.
    if (company && settings.industry == null && settings.legalForm != false) {
      listed.add(_Shape(_bare, data.legalForms));
    }

    final fit =
        <_Shape>[
          for (final shape in listed) _Shape(shape.template, _formsThatFit(shape, data, settings)),
        ].where((shape) => shape.forms.isNotEmpty).toList();

    if (fit.isNotEmpty) {
      fitting.add(type);
    }

    shapes[type] = fit.isNotEmpty ? fit : listed;
  }

  final types = settings.types.where((type) => shapes[type]!.isNotEmpty).toList();

  return _Plan(language, data, shapes, fitting.isNotEmpty ? fitting : types);
}

/// A stem alone a fifth of the time when it is in play, a template otherwise.
_Shape _chooseShape(List<_Shape> shapes) {
  final bare = shapes.where((shape) => shape.template == _bare).firstOrNull;
  final templated = shapes.where((shape) => shape != bare).toList();

  if (bare != null && (templated.isEmpty || chance(organizationBareChance))) {
    return bare;
  }

  return pick(templated);
}

/// Which of a shape's legal forms to write: none or one by a coin flip when
/// both are possible.
String? _chooseForm(_Shape shape) {
  final written = shape.forms.whereType<String>().toList();

  if (written.isEmpty) {
    return null;
  }

  return shape.forms.contains(null) && !chance(organizationLegalFormChance) ? null : pick(written);
}

/// The word that says what a company does, and the industry it says.
(String, OrganizationIndustry?)? _descriptorFor(
  OrganizationLanguageData data,
  OrganizationIndustry? wanted,
  String prefix,
  num low,
  num high,
) {
  if (wanted != null) {
    final word = _fitting(_matching(data.industries[wanted]!, prefix), low, high);

    return word == null ? null : (word, wanted);
  }

  final generic = chance(organizationGenericChance);
  final industry = generic ? null : pick(organizationIndustries);
  final pool = _matching(generic ? data.generic : data.industries[industry]!, prefix);
  final word = pool.isNotEmpty ? _fitting(pool, low, high) : null;

  if (word != null && word.length >= low && word.length <= high) {
    return (word, industry);
  }

  // Nothing of the one drawn starts with the character or fits the room, so the
  // word is drawn from all of them and the industry is whichever it belongs to.
  final entries = <(String, OrganizationIndustry?)>[
    for (final each in _matching(data.generic, prefix)) (each, null),
    for (final each in organizationIndustries)
      for (final entry in _matching(data.industries[each]!, prefix)) (entry, each),
  ];
  final chosen = _fitting([for (final entry in entries) entry.$1], low, high);

  return chosen == null ? null : pick(entries.where((entry) => entry.$1 == chosen).toList());
}

/// A template with its gaps filled, each from the entries that leave the gaps
/// behind it room to land the whole between [low] and [high].
(String, OrganizationIndustry?)? _fill(
  String template,
  _Plan plan,
  _Settings settings,
  num low,
  num high,
) {
  final data = plan.data;
  final pieces = _piecesOf(template);
  final restLow = List<int>.filled(pieces.length + 1, 0);
  final restHigh = List<int>.filled(pieces.length + 1, 0);

  for (var i = pieces.length - 1; i >= 0; i -= 1) {
    final (shortest, longest) = _pieceSpan(pieces[i], data, settings);

    restLow[i] = shortest + restLow[i + 1];
    restHigh[i] = longest + restHigh[i + 1];
  }

  final name = StringBuffer();
  OrganizationIndustry? industry;

  for (var i = 0; i < pieces.length; i += 1) {
    final piece = pieces[i];

    if (piece.text != null) {
      name.write(piece.text);
      continue;
    }

    // Only the first gap has to lead with the requested character.
    final prefix = i == 0 ? settings.prefix : '';
    final roomLow = low - name.length - restHigh[i + 1];
    final roomHigh = high - name.length - restLow[i + 1];
    String? value;

    switch (piece.slot) {
      case 'stem':
        final stems = _matching(data.stems, prefix);

        // A first character no stem starts with is answered with an invented
        // stem that does, the way `randWord` answers one.
        value =
            chance(settings.invent) || stems.isEmpty
                ? inventStem(data.syn, prefix, roomLow, roomHigh)
                : _fitting(stems, roomLow, roomHigh);
      case 'industry':
        final descriptor = _descriptorFor(data, settings.industry, prefix, roomLow, roomHigh);

        value = descriptor?.$1;
        industry = descriptor?.$2;
      case 'place':
        value = _fitting(_matching(data.places ?? const <String>[], prefix), roomLow, roomHigh);
      default:
        value = _fitting(_matching(_numbersOf(data), prefix), roomLow, roomHigh);
    }

    if (value == null) {
      return null;
    }

    name.write(value);
  }

  return (name.toString(), industry);
}

/// One draw, before its length is checked; `null` when the prefix could not
/// lead it.
OrganizationDetail? _draft(_Plan plan, _Settings settings) {
  final type = pickWeighted(plan.types, (each) => organizationTypeWeights[each]!);
  final shape = _chooseShape(plan.shapes[type]!);
  final form = _chooseForm(shape);
  final extra = _overheadOf(form);
  final bounds = settings.bounds;
  final filled = _fill(
    shape.template,
    plan,
    settings,
    bounds == null ? 0 : bounds.min - extra,
    bounds == null ? double.infinity : bounds.max - extra,
  );

  if (filled == null) {
    return null;
  }

  final (name, industry) = filled;

  if (settings.prefix.isNotEmpty && !name.toLowerCase().startsWith(settings.prefix.toLowerCase())) {
    return null;
  }

  return OrganizationDetail(
    organization: form == null ? name : form.replaceFirst('{name}', name),
    name: name,
    legalForm: form == null ? null : legalFormOf(form),
    type: type,
    industry: type == OrganizationType.company ? industry : null,
    language: plan.language,
  );
}

OrganizationDetail? _generateOne(_Plan plan, _Settings settings) {
  OrganizationDetail? best;
  var bestMiss = double.infinity;

  for (var attempt = 0; attempt < _fitAttempts; attempt += 1) {
    final detail = _draft(plan, settings);

    if (detail == null) {
      continue;
    }

    final bounds = settings.bounds;
    final miss =
        bounds == null ? 0.0 : _missBy(detail.organization.length, (bounds.min, bounds.max));

    if (miss == 0) {
      return detail;
    }

    if (miss < bestMiss) {
      bestMiss = miss;
      best = detail;
    }
  }

  return best;
}

/// What `randOrganization` and `randOrganizationDetails` both do.
List<OrganizationDetail> generateOrganizationDetails({
  WordLanguage? language,
  Set<OrganizationType>? type,
  OrganizationIndustry? industry,
  bool? includeLegalForm,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
  Random? random,
}) {
  // An industry is a company's, so naming one with no kind named asks for
  // companies; with kinds named, it narrows the companies among them.
  final types =
      type == null || type.isEmpty
          ? (industry != null ? <OrganizationType>[OrganizationType.company] : organizationTypes)
          : organizationTypes.where(type.contains).toList();
  final settings = _Settings(
    types: types,
    industry: industry,
    legalForm: includeLegalForm,
    invent: resolveRealism(realism),
    prefix: resolvePrefix(startsWith),
    bounds:
        minLength == null && maxLength == null
            ? null
            : lengthBounds(
              minLength,
              maxLength,
              1,
              randOrganizationLengthMax,
              ceiling: randOrganizationLengthMax,
            ),
  );
  // A language that does not write the requested character, and one with no
  // shape of the requested kinds that can lead with it, are out before a draw.
  final plans =
      [
        for (final code in languagesWriting(language, wordLanguages, settings.prefix))
          _planFor(code, settings),
      ].where((plan) => plan.types.isNotEmpty).toList();

  if (plans.isEmpty) {
    return <OrganizationDetail>[];
  }

  final results = withRandom(
    random,
    () => collect<OrganizationDetail?>(
      count: count,
      unique: unique,
      // `startsWith` is the name's, and checked in `_draft`: a legal form written
      // in front of a name is not where the name starts.
      startsWith: '',
      draw: () => _generateOne(pick(plans), settings),
      keyOf: (detail) => detail?.organization ?? '',
    ),
  );

  return results.whereType<OrganizationDetail>().toList();
}
