import 'package:randino/src/affix/attach.dart';
import 'package:randino/src/affix/data/index.dart';

/// Prepends a random token to [value]. The mirror of [randSuffix], for the
/// places where the distinguishing part belongs in front — a shard, a tenant, a
/// key that is sortable by nothing.
///
/// ```dart
/// randPrefix('멋진사자'); // 'nVtRC_멋진사자'
/// randPrefix('order', length: 4, separator: '-'); // 'k3Rm-order'
/// ```
String randPrefix(
  String value, {
  int length = affixLengthDefault,
  String separator = affixSeparatorDefault,
  String? charset,
}) => attachOne(value, length, separator, charset, prependToken);
