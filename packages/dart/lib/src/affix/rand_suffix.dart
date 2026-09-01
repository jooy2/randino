import 'package:randino/src/affix/attach.dart';
import 'package:randino/src/affix/data/index.dart';

/// Appends a random token to [value], so that two people asking for the same
/// nickname at the same moment do not walk away with the same one.
///
/// [length] is clamped to `1..32`. [charset] defaults to alphanumerics without
/// `0O1lI`, the pairs that are easy to misread.
///
/// ```dart
/// randSuffix('멋진사자'); // '멋진사자_nVtRC'
/// randSuffix('MistyOwl', length: 8, separator: '-'); // 'MistyOwl-k3Rm9dQx'
/// ```
String randSuffix(
  String value, {
  int length = affixLengthDefault,
  String separator = affixSeparatorDefault,
  String? charset,
}) => attachOne(value, length, separator, charset, appendToken);
