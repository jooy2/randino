// How a fictional name or place is written in every language at once.
//
// A fictional name is made up in Latin letters, and every other language writes
// it by its sound: `Artemis` is `아르테미스`, `アルテミス`, `阿尔忒弥斯` and
// `Артемис`. Five scripts cover the nine word languages, because English,
// Vietnamese, Spanish, Italian and German all keep a made-up name the way it is
// spelled. So every entry of the fictional datasets is one spelling per script,
// and a language only has to say which script it reads.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';

/// One word in each of the five scripts, at [latinScript], [hangulScript],
/// [kanaScript], [hanScript] and [cyrillicScript].
typedef Spelling = List<String>;

/// Where the Latin spelling sits in a [Spelling].
const int latinScript = 0;

/// Where the Hangul spelling sits in a [Spelling].
const int hangulScript = 1;

/// Where the katakana spelling sits in a [Spelling].
const int kanaScript = 2;

/// Where the hanzi spelling sits in a [Spelling].
const int hanScript = 3;

/// Where the Cyrillic spelling sits in a [Spelling].
const int cyrillicScript = 4;

/// The script each word language writes a fictional name in.
const Map<WordLanguage, int> scriptOfLanguage = <WordLanguage, int>{
  WordLanguage.en: latinScript,
  WordLanguage.vi: latinScript,
  WordLanguage.es: latinScript,
  WordLanguage.it: latinScript,
  WordLanguage.de: latinScript,
  WordLanguage.ko: hangulScript,
  WordLanguage.ja: kanaScript,
  WordLanguage.zh: hanScript,
  WordLanguage.ru: cyrillicScript,
};

/// What sits between a given name and a surname in each script. Japanese and
/// Chinese write a foreign name's parts apart with a dot of their own, where
/// every other script leaves a space: `エララ・ブラックウッド`, `埃拉拉·布莱克伍德`.
const List<String> nameJoiners = <String>[' ', ' ', '・', '·', ' '];

/// One row of a table whose last five cells are a spelling, and what comes
/// before them.
typedef SpelledRow = ({List<String> cells, Spelling spelling});

/// Split a table whose rows end on the five spellings of one word.
List<SpelledRow> spelledRows(String source) => <SpelledRow>[
  for (final cells in rows(source))
    (
      cells: cells.sublist(0, cells.length - 5),
      spelling: List<String>.unmodifiable(cells.sublist(cells.length - 5)),
    ),
];

// Hangul syllables are composed as (initial * 21 + vowel) * 28 + final, so a
// syllable with no final consonant is a multiple of 28 from the base, and the
// liquid `ㄹ` is the eighth final.
const int _hangulBase = 0xac00;
const int _hangulLast = 0xd7a3;
const int _hangulFinals = 28;
const int _hangulLiquid = 8;

/// [left] and [right] joined into one Korean word, for parts of one word
/// written apart: `에드` and `린` are `에들린`, `아` and `리아` are `알리아`.
///
/// Korean writes an English `l` between vowels, or after a consonant written
/// with a vowel of its own, as a doubled `ㄹ`: `Alice` is `앨리스` and `Hartley`
/// is `하틀리`. A part that starts with `l` is spelled for a word that starts
/// there, so the `ㄹ` it needs in front is added to the syllable before it, when
/// that syllable has no final consonant to stand in the way. An `r` keeps a
/// single `ㄹ` (`이스라`), which is why the rule asks the Latin spelling
/// ([rightLatin]) and not the Hangul one.
String _joinHangul(String left, String rightLatin, String right) {
  final code = left.isEmpty ? 0 : left.codeUnitAt(left.length - 1);
  final open =
      code >= _hangulBase && code <= _hangulLast && (code - _hangulBase) % _hangulFinals == 0;

  if (open && rightLatin.toLowerCase().startsWith('l')) {
    return left.substring(0, left.length - 1) + String.fromCharCode(code + _hangulLiquid) + right;
  }

  return left + right;
}

final RegExp _openEnd = RegExp(r'[aeiouy]$');

/// Whether two parts make one word that every script can write by joining them.
///
/// A part ending on the letter the next one starts with is spelled double in
/// English and written once in the other scripts — `Kallis` is `カリス`, never
/// `カルリス` — so the two cannot be joined part by part. Nor can an `sh` meet an
/// `l`, which Korean writes as one sound of its own: `Ashley` is `애슐리`, and
/// `애시` and `리` make `애실리`. And an open syllable is not followed by one that
/// starts the same way, which reads as a stutter (`Lalan`, `Raria`).
bool joinable(String left, String right) {
  final end = left.toLowerCase();
  final start = right.toLowerCase();

  if (end.isEmpty || start.isEmpty || end[end.length - 1] == start[0]) {
    return false;
  }

  if (_openEnd.hasMatch(end) && end[0] == start[0]) {
    return false;
  }

  return !(end.endsWith('sh') && start.startsWith('l'));
}

/// Parts joined into one word in every script. Each part is written for where
/// it sits, so the Latin and Cyrillic words only need their first letter
/// raised.
Spelling joinParts(List<Spelling> parts) {
  var latin = parts[0][latinScript];
  var hangul = parts[0][hangulScript];
  var kana = parts[0][kanaScript];
  var han = parts[0][hanScript];
  var cyrillic = parts[0][cyrillicScript];

  for (var i = 1; i < parts.length; i += 1) {
    final part = parts[i];

    hangul = _joinHangul(hangul, part[latinScript], part[hangulScript]);
    latin += part[latinScript];
    kana += part[kanaScript];
    han += part[hanScript];
    cyrillic += part[cyrillicScript];
  }

  return List<String>.unmodifiable(<String>[
    capitalizeFirst(latin.toLowerCase()),
    hangul,
    kana,
    han,
    capitalizeFirst(cyrillic.toLowerCase()),
  ]);
}

/// Whether [text] starts with [prefix], ignoring case. An empty prefix matches
/// anything.
bool leadsWith(String text, String prefix) =>
    prefix.isEmpty || text.toLowerCase().startsWith(prefix.toLowerCase());

/// How far a length is from a range, an overshoot counting half a character
/// worse.
double missBy(int length, int low, int high) =>
    length < low ? (low - length).toDouble() : (length > high ? length - high + 0.5 : 0.0);

/// The entries of [pool] whose text is between [low] and [high] characters
/// long, or the closest ones when none is. [textOf] is the text that is
/// measured.
List<T> fitting<T>(List<T> pool, String Function(T entry) textOf, int low, int high) {
  var best = double.infinity;
  var closest = <T>[];

  for (final entry in pool) {
    final miss = missBy(textOf(entry).length, low, high);

    if (miss < best) {
      best = miss;
      closest = <T>[entry];
    } else if (miss == best) {
      closest.add(entry);
    }
  }

  return closest;
}

/// The shortest and the longest text of a pool, in characters, `(0, 0)` for
/// none.
(int, int) spanOf(Iterable<String> texts) {
  int? low;
  var high = 0;

  for (final text in texts) {
    low = low == null || text.length < low ? text.length : low;
    high = text.length > high ? text.length : high;
  }

  return (low ?? 0, high);
}
