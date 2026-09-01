import 'package:randino/src/affix/data/index.dart';
import 'package:randino/src/internal/utils.dart';

/// One value with a **freshly drawn** token attached, on the side [join] puts
/// it. Internal — the four public functions differ by that one line and by
/// whether they map over a list.
String attachOne(
  String value,
  int length,
  String separator,
  String? charset,
  String Function(String value, String token, String separator) join,
) => join(
  value,
  randToken(
    clampInt(length, 1, affixLengthMax),
    (charset == null || charset.isEmpty) ? affixCharset : charset,
  ),
  separator,
);

/// The token goes behind the value.
String appendToken(String value, String token, String separator) => '$value$separator$token';

/// The token goes in front of it.
String prependToken(String value, String token, String separator) => '$token$separator$value';
