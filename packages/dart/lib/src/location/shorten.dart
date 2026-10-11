// The short name a division goes by, which `short` writes in place of the one
// the country publishes.

import 'package:randino/src/location/data/short.dart';
import 'package:randino/src/types.dart';

/// A division's name the way `short` writes it. Internal.
///
/// `서울특별시` is `서울`, `충청북도` `충북`, and `수원시 장안구`, a city's
/// district written with its city, is `수원 장안`. A language with no rule
/// writes the name as it is.
String shortName(LocationLanguage language, LocationLevel level, String name) {
  final rule = locationShort[language];

  if (rule == null) {
    return name;
  }

  return name.split(' ').map((word) => _shortWord(rule, level, word)).join(' ');
}

/// One word of a name, its kind left off when enough of it is left.
String _shortWord(ShortRule rule, LocationLevel level, String word) {
  String? kind;

  for (final ending in rule.kinds[level] ?? const <String>[]) {
    if (word.endsWith(ending)) {
      kind = ending;
      break;
    }
  }

  if (kind == null || word.length - kind.length < rule.stem) {
    return word;
  }

  final stem = word.substring(0, word.length - kind.length);

  return level == LocationLevel.region && stem.length == 3 && rule.halves.contains(stem[2])
      ? stem[0] + stem[2]
      : stem;
}
