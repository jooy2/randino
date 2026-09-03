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
