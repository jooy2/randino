import 'dart:math';

import 'package:randino/src/decorate/attach.dart';
import 'package:randino/src/decorate/data/index.dart';
import 'package:randino/src/internal/utils.dart';

/// Appends a random token to [value], so that two people asking for the same
/// nickname at the same moment are very unlikely to walk away with the same one.
///
/// **Not for anything that has to be unguessable.** The token comes from
/// `dart:math`'s `Random`, which is not a cryptographically secure source: its
/// state can be recovered from a handful of outputs, so the tokens that follow
/// can be worked out. Nor is it collision-free — five characters of the default
/// charset is 601,692,057 tokens, and a collision becomes likely somewhere
/// around thirty thousand of them. Use `Random.secure()` for a session token, an
/// invite code or a key nobody may enumerate, and a database constraint where a
/// value has to be unique with certainty.
///
/// With [value] left out you get the bare token, separator and all left off —
/// what a decorator attaches is worth having on its own. That is why [value] is
/// named here rather than positional: Dart cannot combine an optional
/// positional parameter with named ones, and every other option had to stay.
///
/// [length] is clamped to `1..32`. [charset] defaults to alphanumerics without
/// `0O1lI`, the pairs that are easy to misread.
///
/// ```dart
/// randSuffix(); // 'nVtRC'
/// randSuffix(value: '멋진사자'); // '멋진사자_nVtRC'
/// randSuffix(value: 'MistyOwl', length: 8, separator: '-'); // 'MistyOwl-k3Rm9dQx'
/// ```
String randSuffix({
  String? value,
  int length = affixLengthDefault,
  String separator = affixSeparatorDefault,
  String? charset,

  /// Where the randomness comes from: `Random.secure()` for a token nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => withRandom(
  random,
  () =>
      value == null
          ? affixToken(length, charset)
          : attachOne(value, length, separator, charset, appendToken),
);
