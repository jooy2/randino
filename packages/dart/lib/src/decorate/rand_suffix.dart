import 'package:randino/src/decorate/attach.dart';
import 'package:randino/src/decorate/data/index.dart';

/// Appends a random token to [value], so that two people asking for the same
/// nickname at the same moment do not walk away with the same one.
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
}) =>
    value == null
        ? affixToken(length, charset)
        : attachOne(value, length, separator, charset, appendToken);
