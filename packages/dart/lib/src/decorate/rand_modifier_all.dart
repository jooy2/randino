import 'dart:math';

import 'package:randino/src/decorate/rand_modifier.dart';
import 'package:randino/src/internal/utils.dart';
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

  /// Where the randomness comes from: `Random.secure()` for a word nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => withRandom(
  random,
  () => [
    for (final value in values)
      randModifier(
        value: value,
        language: language,
        realism: realism,
        kind: kind,
        separator: separator,
      ),
  ],
);
