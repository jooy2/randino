import 'package:randino/src/affix/attach.dart';
import 'package:randino/src/affix/data/index.dart';

/// [randPrefix] over a list — a fresh token for each entry, not one for the
/// batch. See [randSuffixAll] for why the list form is its own function.
///
/// ```dart
/// randPrefixAll(randNickname(language: NicknameLanguage.en, count: 2));
/// // ['AVcCV_MistyOwl', 'RUKAP_RustyBoot']
/// ```
List<String> randPrefixAll(
  List<String> values, {
  int length = affixLengthDefault,
  String separator = affixSeparatorDefault,
  String? charset,
}) => [for (final value in values) attachOne(value, length, separator, charset, prependToken)];
