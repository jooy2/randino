import 'package:randino/src/constants.dart';
import 'package:randino/src/internal/utils.dart';
import 'package:randino/src/name/data/index.dart';
import 'package:randino/src/types.dart';

/// Natural length range of a full name in the given language, in characters of
/// the native form.
///
/// This is what `randName` falls back to when `minLength` or `maxLength` is
/// omitted, and it describes only the parts that are switched on — so leaving
/// the surname out relaxes the range instead of forcing the given name to
/// stretch and fill it. A null [language] spans every language at once.
///
/// ```dart
/// nameLengthRange(language: NameLanguage.ko); // LengthRange(2, 3)
/// nameLengthRange(language: NameLanguage.ko, includeSurname: false); // LengthRange(1, 2)
/// nameLengthRange(language: NameLanguage.en); // LengthRange(7, 21)
/// ```
LengthRange nameLengthRange({
  NameLanguage? language,
  bool includeSurname = true,
  bool includeMiddleName = false,
}) {
  final languages = language == null ? nameLanguages : <NameLanguage>[language];
  var min = 1 << 30;
  var max = 0;

  for (final code in languages) {
    final data = nameData[code]!;
    final spec = data.lengthSpec;
    var low = spec.given.min;
    var high = spec.given.max;

    // Each part beyond the first brings the joiner with it: one space for the
    // space-separated scripts, nothing for CJK.
    if (includeSurname) {
      low += spec.last.min + data.joiner.length;
      high += spec.last.max + data.joiner.length;
    }

    if (includeMiddleName && data.hasMiddle) {
      low += spec.middle.min + data.joiner.length;
      high += spec.middle.max + data.joiner.length;
    }

    if (low < min) min = low;
    if (high > max) max = high;
  }

  return LengthRange(
    clampInt(min, randLengthMin, randLengthMax),
    clampInt(max, randLengthMin, randLengthMax),
  );
}
