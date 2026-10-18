// What the fictional generators share about their options: the languages a call
// writes in, and the prefix as each script spells it.

import 'package:randino/src/constants.dart';
import 'package:randino/src/fictional/spelling.dart';
import 'package:randino/src/internal/generate.dart';
import 'package:randino/src/internal/script.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/index.dart';

/// The languages a call asked for, in the order it asked for them: every word
/// language for a null or empty [language].
///
/// A set keeps the order it was written in, so `{WordLanguage.ru,
/// WordLanguage.ko}` is the order of a detail's `forms`, and a language named
/// twice is written once.
List<WordLanguage> resolveFictionalLanguages(Set<WordLanguage>? language) =>
    language == null || language.isEmpty
        ? wordLanguages
        : List<WordLanguage>.unmodifiable(language);

/// `startsWith` as a script spells it. Japanese writes a made-up name in
/// katakana, so a hiragana `あ` is read as the `ア` every name is spelled with.
String prefixIn(String prefix, int script) => script == kanaScript ? kanaLike(prefix, 'ア') : prefix;

/// What every fictional generator works out from the options before it draws.
final class FictionalBase {
  /// Creates the resolved options. Built by [resolveBase].
  const FictionalBase({
    required this.languages,
    required this.forms,
    required this.prefix,
    required this.bounds,
  });

  /// The languages a result may be written in. Empty when none can answer.
  final List<WordLanguage> languages;

  /// The languages every result is written in for the detail's `forms`.
  final List<WordLanguage> forms;

  /// The one character a result's name has to start with, or empty for none.
  final String prefix;

  /// The length range a result has to land in, or null for none.
  final LengthRange? bounds;
}

/// The languages, the prefix and the length range of a call. A language that
/// does not write the requested character is left out, and so is one whose own
/// range cannot meet the one asked for while another's can — [rangeOf] is that
/// language's range for this call.
FictionalBase resolveBase({
  required Set<WordLanguage>? language,
  required String? startsWith,
  required int? minLength,
  required int? maxLength,
  required LengthRange Function(WordLanguage language) rangeOf,
}) {
  final forms = resolveFictionalLanguages(language);
  final prefix = resolvePrefix(startsWith);
  final writing = languagesWriting<WordLanguage>(null, forms, prefix);

  return FictionalBase(
    languages: languagesFitting<WordLanguage>(writing, minLength, maxLength, rangeOf),
    forms: forms,
    prefix: prefix,
    bounds:
        minLength == null && maxLength == null
            ? null
            : lengthBounds(minLength, maxLength, 1, randLengthMax),
  );
}

/// The script [language] writes a fictional name in.
int scriptOf(WordLanguage language) => scriptOfLanguage[language]!;
