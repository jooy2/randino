import 'package:randino/src/decorate/attach.dart';
import 'package:randino/src/decorate/data/index.dart';

/// Prepends a random token to [value]. The mirror of [randSuffix], for the
/// places where the distinguishing part belongs in front — a shard, a tenant, a
/// key that is sortable by nothing.
///
/// With [value] left out you get the bare token, which is the same thing
/// [randSuffix] hands back with no value: which side it would have landed on is
/// not decided yet.
///
/// ```dart
/// randPrefix(); // 'nVtRC'
/// randPrefix(value: '멋진사자'); // 'nVtRC_멋진사자'
/// randPrefix(value: 'order', length: 4, separator: '-'); // 'k3Rm-order'
/// ```
String randPrefix({
  String? value,
  int length = affixLengthDefault,
  String separator = affixSeparatorDefault,
  String? charset,
}) =>
    value == null
        ? affixToken(length, charset)
        : attachOne(value, length, separator, charset, prependToken);
