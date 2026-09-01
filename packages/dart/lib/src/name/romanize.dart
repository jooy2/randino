// Turns a native name into its "English pronunciation". Every language does this
// with plain data — the package has no dependencies:
// - Latin scripts strip their diacritics (José -> Jose, Müller -> Muller).
// - Cyrillic is transliterated character by character.
// - Hangul follows the Revised Romanization of Korean, including the sound
//   changes that happen between syllables (석민 -> seongmin, not seokmin).
// - Japanese and Chinese carry the reading on each token, so nothing to do here.

import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/name/data/ko.dart';
import 'package:randino/src/name/data/types.dart';

/// What each accented Latin character folds to.
///
/// The JavaScript package gets this from `String.prototype.normalize('NFD')`
/// plus a `\p{Diacritic}` strip, and **Dart has no Unicode normalization at
/// all** — not in the SDK and not without a dependency, which this package does
/// not take. So the table is written out.
///
/// Each line is `<replacement> <characters that fold to it>`, lower case; the
/// upper-case half is derived, which is what keeps `Đỗ` and `đỗ` from drifting
/// apart. It covers Latin-1 Supplement, Latin Extended-A and the Vietnamese
/// block in Latin Extended Additional — everything the pools hold today and the
/// rest of the two alphabets besides, so a name added tomorrow does not fall
/// through untouched. `test/name_test.dart` asserts that every pool folds to
/// ASCII, which is the check that actually holds this honest.
const String _foldSource = '''
a àáâãäåāăą ạảấầẩẫậắằẳẵặ
e èéêëēĕėęě ẹẻẽếềểễệ
i ìíîïĩīĭįı ỉị
o òóôõöøōŏőơ ọỏốồổỗộớờởỡợ
u ùúûüũūŭůűųư ụủứừửữự
y ýÿŷ ỳỵỷỹ
c çćĉċč
d ďđð
g ĝğġģ
h ĥħ
j ĵ
k ķĸ
l ĺļľŀł
n ñńņňŋ
r ŕŗř
s śŝşš
t țţťŧ
w ŵẁẃẅ
z źżž
ae æ
oe œ
ss ßẞ
th þ
''';

Map<String, String> _buildFold() {
  final map = <String, String>{};

  for (final line in _foldSource.trim().split('\n')) {
    final parts = line.trim().split(RegExp(r'\s+'));
    final plain = parts.first;

    for (final group in parts.skip(1)) {
      for (final rune in group.runes) {
        final char = String.fromCharCode(rune);
        // A character written upper case in the source (ẞ) takes the upper-case
        // replacement; everything else is lower case and derives its own pair.
        final isUpper = char == char.toUpperCase() && char != char.toLowerCase();

        map[char] = isUpper ? plain.toUpperCase() : plain;

        final upper = char.toUpperCase();

        if (!isUpper && upper.length == 1 && upper != char) {
          map[upper] = plain.toUpperCase();
        }
      }
    }
  }

  return Map<String, String>.unmodifiable(map);
}

final Map<String, String> _fold = _buildFold();

/// ASCII-fold a Latin-script string (José -> Jose, Müller -> Muller, Đỗ -> Do).
String fold(String value) {
  final buffer = StringBuffer();

  for (final rune in value.runes) {
    final char = String.fromCharCode(rune);

    buffer.write(_fold[char] ?? char);
  }

  return buffer.toString();
}

const Map<String, String> _cyrillic = <String, String>{
  'а': 'a',
  'б': 'b',
  'в': 'v',
  'г': 'g',
  'д': 'd',
  'е': 'e',
  'ё': 'yo',
  'ж': 'zh',
  'з': 'z',
  'и': 'i',
  'й': 'y',
  'к': 'k',
  'л': 'l',
  'м': 'm',
  'н': 'n',
  'о': 'o',
  'п': 'p',
  'р': 'r',
  'с': 's',
  'т': 't',
  'у': 'u',
  'ф': 'f',
  'х': 'kh',
  'ц': 'ts',
  'ч': 'ch',
  'ш': 'sh',
  'щ': 'shch',
  'ъ': '',
  'ы': 'y',
  'ь': '',
  'э': 'e',
  'ю': 'yu',
  'я': 'ya',
};

/// Char-level Cyrillic -> Latin transliteration, preserving initial capitals.
String translit(String value) {
  final buffer = StringBuffer();

  for (final rune in value.runes) {
    final char = String.fromCharCode(rune);
    final lower = char.toLowerCase();
    final base = _cyrillic[lower] ?? char;

    buffer.write(char == lower ? base : capitalizeFirst(base));
  }

  return buffer.toString();
}

// --- Hangul -----------------------------------------------------------------

const int _hangulFirst = 0xac00;
const int _hangulLast = 0xd7a3;

// Indexed by jamo position within a composed syllable.
const List<String> _onset = <String>[
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', //
  'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h',
];

const List<String> _nucleus = <String>[
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', //
  'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i',
];

const List<String> _coda = <String>[
  '', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', //
  'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', //
  't', 'ng', 't', 't', 'k', 't', 'p', 't',
];

// A final consonant in front of a vowel moves into the next syllable's onset.
// `[keep, moved]`: complex finals leave their first half behind (닭이 -> dalgi),
// and a silent ㅎ moves nothing (좋아 -> joa).
const List<List<String>> _liaison = <List<String>>[
  <String>['', ''],
  <String>['', 'g'],
  <String>['', 'kk'],
  <String>['k', 's'],
  <String>['', 'n'],
  <String>['n', 'j'],
  <String>['', 'n'],
  <String>['', 'd'],
  <String>['', 'r'],
  <String>['l', 'g'],
  <String>['l', 'm'],
  <String>['l', 'b'],
  <String>['l', 's'],
  <String>['l', 't'],
  <String>['l', 'p'],
  <String>['', 'r'],
  <String>['', 'm'],
  <String>['', 'b'],
  <String>['p', 's'],
  <String>['', 's'],
  <String>['', 'ss'],
  <String>['ng', ''],
  <String>['', 'j'],
  <String>['', 'ch'],
  <String>['', 'k'],
  <String>['', 't'],
  <String>['', 'p'],
  <String>['', ''],
];

// Onset indexes worth branching on.
const int _onsetN = 2;
const int _onsetR = 5;
const int _onsetM = 6;
const int _onsetEmpty = 11;

// Final consonants grouped by the sound they end on, which is what the
// assimilation rules key off.
const Set<int> _codaK = <int>{1, 2, 3, 9, 24};
const Set<int> _codaT = <int>{7, 19, 20, 22, 23, 25, 27};
const Set<int> _codaP = <int>{14, 17, 18, 26};
const Set<int> _codaL = <int>{8, 11, 12, 13, 15};
const Set<int> _codaNasal = <int>{10, 16, 21};
// Finals containing ㅎ, which aspirates the following consonant (좋고 -> joko).
const Map<int, String> _codaH = <int, String>{6: 'n', 15: 'l', 27: ''};
const Map<int, String> _aspirated = <int, String>{0: 'k', 3: 't', 9: 'ss', 12: 'ch'};

class _Syllable {
  const _Syllable(this.onset, this.nucleus, this.coda);

  final int onset;
  final int nucleus;
  final int coda;
}

_Syllable? _decompose(int code) {
  if (code < _hangulFirst || code > _hangulLast) {
    return null;
  }

  final offset = code - _hangulFirst;

  return _Syllable(offset ~/ 588, (offset % 588) ~/ 28, offset % 28);
}

/// Romanize one final consonant against the syllable that follows it. Returns
/// the sound the current syllable ends on plus an onset override for the next.
(String, String?) _romanizeCoda(int coda, _Syllable? next) {
  if (coda == 0) {
    return ('', null);
  }

  if (next == null) {
    return (_coda[coda], null);
  }

  final onset = next.onset;

  // A vowel-initial syllable pulls the final consonant across.
  if (onset == _onsetEmpty) {
    final moved = _liaison[coda];

    return (moved[0], moved[1]);
  }

  // ㅎ in the final aspirates the next consonant (놓다 -> nota).
  if (_codaH.containsKey(coda) && _aspirated.containsKey(onset)) {
    return (_codaH[coda]!, _aspirated[onset]!);
  }

  // Nasalization: a stop in front of ㄴ or ㅁ becomes the matching nasal.
  if (onset == _onsetN || onset == _onsetM) {
    if (_codaK.contains(coda)) return ('ng', null);
    if (_codaT.contains(coda)) return ('n', null);
    if (_codaP.contains(coda)) return ('m', null);
    // ㄹ + ㄴ assimilates the other way around (실내 -> sillae).
    if (_codaL.contains(coda) && onset == _onsetN) return ('l', 'l');

    return (_coda[coda], null);
  }

  // ㄹ either doubles after another ㄹ (별로 -> byeollo) or turns into ㄴ.
  if (onset == _onsetR) {
    if (_codaL.contains(coda)) return ('l', 'l');
    if (coda == 4) return ('l', 'l');
    if (_codaK.contains(coda)) return ('ng', 'n');
    if (_codaT.contains(coda)) return ('n', 'n');
    if (_codaP.contains(coda)) return ('m', 'n');
    if (_codaNasal.contains(coda)) return (_coda[coda], 'n');
  }

  return (_coda[coda], null);
}

/// Romanize Hangul text with the Revised Romanization of Korean. Characters
/// that are not composed Hangul syllables are passed through untouched.
String romanizeHangul(String text) {
  final codes = text.runes.toList(growable: false);
  final syllables = codes.map(_decompose).toList(growable: false);
  final buffer = StringBuffer();
  String? override;

  for (var i = 0; i < codes.length; i += 1) {
    final current = syllables[i];

    if (current == null) {
      buffer.writeCharCode(codes[i]);
      override = null;
      continue;
    }

    final (coda, nextOnset) = _romanizeCoda(
      current.coda,
      i + 1 < syllables.length ? syllables[i + 1] : null,
    );

    buffer.write((override ?? _onset[current.onset]) + _nucleus[current.nucleus] + coda);
    override = nextOnset;
  }

  return buffer.toString();
}

// --- Entry point ------------------------------------------------------------

/// Which part of a full name is being romanized. Only Hangul cares: a surname
/// has a conventional spelling that Revised Romanization would not produce.
enum NamePart {
  /// The family name.
  surname,

  /// The given name, and anything else.
  given,
}

/// Romanize a native name part according to its language's romanization mode.
String romanize(RomanMode mode, String value, NamePart part) {
  switch (mode) {
    case RomanMode.fold:
      return fold(value);
    case RomanMode.translit:
      return translit(value);
    case RomanMode.hangul:
      return part == NamePart.surname
          ? (koSurnameRoman[value] ?? capitalizeFirst(romanizeHangul(value)))
          : capitalizeFirst(romanizeHangul(value));
    case RomanMode.token:
      return value;
  }
}
