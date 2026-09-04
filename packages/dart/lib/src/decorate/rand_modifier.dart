import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/script.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/word_generator.dart';

/// Draws one modifier, and reports the separator its language joins with.
///
/// Internal — shared by [randModifier] and `randModifierAll`.
(String, String, bool) drawModifier(
  String? value,
  WordLanguage? language,
  RandRealism realism,
  ModifierKind? kind,
  String? separator,
) {
  // The language of the word being decorated, so that '고양이' is not handed an
  // English modifier. Only consulted when the caller left the language out.
  final WordLanguage code =
      language ?? (value == null ? pick(wordLanguages) : detectLanguage(value));
  final data = wordData[code]!;
  final pool = modifiersOf(data, kind);
  final bounds = poolBounds(pool);
  final drawn = drawWord(data, pool, resolveRealism(realism), bounds.min, bounds.max, '');
  // A value the language knows is a noun whose gender it can look up, so the
  // modifier lands in the form that goes beside it. A value from anywhere else
  // has no gender to agree with, and `agree` hands the base form back.
  final gender = value == null ? null : data.nounGender?[value];

  return (agree(data, drawn.word, gender), separator ?? data.joiner, modifierFollows(data));
}

/// Puts a random modifier in front of [value]: `'사자'` becomes `'멋진사자'`.
///
/// This is what `randNickname`'s `includeModifier` used to be, and it stopped
/// being a nickname parameter for the same reason `randSuffix` did — decorating
/// a string was never a thing about nicknames. Give it a word from `randWord`,
/// a word of your own, or anything else you have.
///
/// With [value] left out you get the modifier on its own. With [language] left
/// out, the script of the value picks one; with no value either, every language
/// is in play. [realism] decides whether the modifier is one the language
/// actually uses or one invented to read like it, and [kind] whether it says
/// what the value is like or what it is doing — left out, both are in play.
/// [separator] defaults to the way the language joins words, which is to run
/// them together.
///
/// ```dart
/// randModifier(); // '멋진'
/// randModifier(value: '사자'); // '멋진사자'
/// randModifier(value: 'Owl', separator: ' '); // 'Misty Owl'
/// randModifier(kind: ModifierKind.action); // '웃는'
/// ```
String randModifier({
  String? value,
  WordLanguage? language,
  RandRealism realism = RandRealism.real,
  ModifierKind? kind,
  String? separator,
}) {
  final (word, joiner, follows) = drawModifier(value, language, realism, kind, separator);

  if (value == null) return word;

  // Vietnamese puts the modifier after the noun, and says so in its frames.
  return follows ? '$value$joiner$word' : '$word$joiner$value';
}
