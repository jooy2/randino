// Which language a piece of text is written in, judged by its script alone.
// Internal — it answers one narrow question, for the decorators that have to
// match a value they were handed rather than one they generated, and for the
// `startsWith` that has to be a character the language actually writes.

import 'package:randino/src/types.dart';

final RegExp _hangul = RegExp('[가-힣]');
final RegExp _kana = RegExp('[぀-ヿ]');
final RegExp _han = RegExp('[一-鿿]');
final RegExp _cyrillic = RegExp(r'\p{Script=Cyrillic}', unicode: true);
final RegExp _latin = RegExp(r'\p{Script=Latin}', unicode: true);
// Vietnamese shares the Latin alphabet with English, and is told apart by the
// letters and tone marks English never uses. A Vietnamese word carrying none of
// them reads as English, which is the most a single word can be asked to say.
final RegExp _vietnamese = RegExp('[\u00C0-\u024F\u1EA0-\u1EF9]');

/// The word language [text] is written in.
///
/// Han characters are read as Chinese unless kana appear alongside them, which
/// is the only signal a single word carries; Cyrillic is Russian, a Latin word
/// with Vietnamese marks on it is Vietnamese, and anything else is English.
///
/// Spanish, Italian and German share the Latin alphabet with English and with
/// each other, so no script tells them apart — a caller who wants one of those
/// names it. `randModifier` asks their pools instead, which is a question about
/// the word rather than about its script and so does not belong here.
WordLanguage detectLanguage(String text) {
  if (_hangul.hasMatch(text)) return WordLanguage.ko;
  if (_kana.hasMatch(text)) return WordLanguage.ja;
  if (_han.hasMatch(text)) return WordLanguage.zh;
  if (_cyrillic.hasMatch(text)) return WordLanguage.ru;
  if (_vietnamese.hasMatch(text)) return WordLanguage.vi;

  return WordLanguage.en;
}

// The scripts the nine languages are written in, by the code both
// [NameLanguage] and [WordLanguage] spell the same way, so one table answers for
// both.
//
// Written out rather than read off the pools because no pool answers it
// reliably: Japanese nouns are kanji and katakana at once, so the first entry of
// a pool says nothing about the rest of it.
final Map<String, List<RegExp>> _scripts = <String, List<RegExp>>{
  'en': <RegExp>[_latin],
  'ko': <RegExp>[_hangul],
  'ja': <RegExp>[_kana, _han],
  'zh': <RegExp>[_han],
  'vi': <RegExp>[_latin],
  'es': <RegExp>[_latin],
  'it': <RegExp>[_latin],
  'de': <RegExp>[_latin],
  'ru': <RegExp>[_cyrillic],
};

/// Whether [language] writes the script [text] is in, which is what a requested
/// first character has to be before a generator can lead anything with it.
///
/// A character from another script is one the language can never begin a word
/// with, and putting it there anyway is how `randName(language:
/// NameLanguage.ko, startsWith: 'Q')` used to answer `Q대겸` — a Latin letter
/// glued to a Korean given name, in two scripts and in neither language.
bool writesScript(String language, String text) {
  final scripts = _scripts[language];

  if (text.isEmpty || scripts == null) {
    return true;
  }

  return scripts.any((script) => script.hasMatch(text));
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

// The final consonant `ㄹ` is the eighth of the twenty-seven a syllable can
// close on, and the one Korean treats as a vowel for one particle: `마을로`,
// never `마을으로`.
const int _hangulLiquid = 8;

/// Whether [text] ends on the Korean liquid `ㄹ`, which is the one coda the
/// particle `로` does not alternate for: `시장으로` and `마을로`, both from one
/// particle. Anything that is not a Hangul syllable reports false.
bool endsWithLiquid(String text) {
  final trimmed = text.trimRight();

  if (trimmed.isEmpty) return false;

  final code = trimmed.runes.last;

  return code >= _hangulBase &&
      code <= _hangulLast &&
      (code - _hangulBase) % _hangulFinals == _hangulLiquid;
}
