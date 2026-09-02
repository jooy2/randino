// Which language a piece of text is written in, judged by its script alone.
// Internal — it answers one narrow question, for the decorators that have to
// match a value they were handed rather than one they generated.

import 'package:randino/src/types.dart';

final RegExp _hangul = RegExp('[가-힣]');
final RegExp _kana = RegExp('[぀-ヿ]');
final RegExp _han = RegExp('[一-鿿]');

/// The word language [text] is written in.
///
/// Han characters are read as Chinese unless kana appear alongside them, which
/// is the only signal a single word carries; anything else is English.
WordLanguage detectLanguage(String text) {
  if (_hangul.hasMatch(text)) return WordLanguage.ko;
  if (_kana.hasMatch(text)) return WordLanguage.ja;
  if (_han.hasMatch(text)) return WordLanguage.zh;

  return WordLanguage.en;
}
