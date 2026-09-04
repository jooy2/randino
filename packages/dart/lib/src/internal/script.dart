// Which language a piece of text is written in, judged by its script alone.
// Internal — it answers one narrow question, for the decorators that have to
// match a value they were handed rather than one they generated.

import 'package:randino/src/types.dart';

final RegExp _hangul = RegExp('[가-힣]');
final RegExp _kana = RegExp('[぀-ヿ]');
final RegExp _han = RegExp('[一-鿿]');
// Vietnamese shares the Latin alphabet with English, and is told apart by the
// letters and tone marks English never uses. A Vietnamese word carrying none of
// them reads as English, which is the most a single word can be asked to say.
final RegExp _vietnamese = RegExp('[\u00C0-\u024F\u1EA0-\u1EF9]');

/// The word language [text] is written in.
///
/// Han characters are read as Chinese unless kana appear alongside them, which
/// is the only signal a single word carries; a Latin word with Vietnamese marks
/// on it is Vietnamese, and anything else is English.
WordLanguage detectLanguage(String text) {
  if (_hangul.hasMatch(text)) return WordLanguage.ko;
  if (_kana.hasMatch(text)) return WordLanguage.ja;
  if (_han.hasMatch(text)) return WordLanguage.zh;
  if (_vietnamese.hasMatch(text)) return WordLanguage.vi;

  return WordLanguage.en;
}

// Hangul syllables are composed as (initial * 21 + vowel) * 28 + final, so the
// remainder is the final consonant, and 0 means there is none.
const int _hangulBase = 0xac00;
const int _hangulLast = 0xd7a3;
const int _hangulFinals = 28;

final RegExp _letter = RegExp(r'\p{Letter}', unicode: true);
final RegExp _vowels = RegExp('[aeiouàáâãäåèéêëìíîïòóôõöùúûüыаеёиоуэюяıəăâêôơư]');

/// Whether [text] ends on a consonant, which is what a language whose particles
/// alternate needs to know: Korean writes `사자가` and `사슴이` for the same
/// particle, by whether the syllable in front of it closes on one.
///
/// Answered by the script rather than per language. A Hangul syllable carries
/// its final consonant in its code point; a Latin or Cyrillic word is judged by
/// its last letter; a script that writes no vowels of its own — Han, kana — has
/// no answer to give and reports false, which is also what its particles need,
/// since they do not alternate.
bool endsWithConsonant(String text) {
  final trimmed = text.trimRight();

  if (trimmed.isEmpty) return false;

  final last = trimmed.substring(trimmed.length - 1);
  final code = last.runes.first;

  if (code >= _hangulBase && code <= _hangulLast) {
    return (code - _hangulBase) % _hangulFinals != 0;
  }

  return _letter.hasMatch(last) && !_vowels.hasMatch(last.toLowerCase());
}
