import 'package:randino/src/decorate/rand_modifier.dart';
import 'package:randino/src/types.dart';

/// [randModifier] over a list — a fresh modifier for each entry, not one for
/// the batch.
///
/// See `randSuffixAll` for why the list form is its own function.
///
/// ```dart
/// randModifierAll(randAnimal(language: WordLanguage.ko, count: 2));
/// // [오래된곰, 영원한도마뱀]
/// ```
List<String> randModifierAll(
  List<String> values, {
  WordLanguage? language,
  RandRealism realism = RandRealism.real,
  ModifierKind? kind,
  String? separator,
}) => [
  for (final value in values)
    randModifier(
      value: value,
      language: language,
      realism: realism,
      kind: kind,
      separator: separator,
    ),
];
