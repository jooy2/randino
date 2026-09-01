import 'package:randino/src/name/name_generator.dart';
import 'package:randino/src/types.dart';

/// Generate person names with both scripts and the choices behind each one.
///
/// Takes the same parameters as `randomName` except `script` — every name is
/// returned in its native form and romanized at the same time. Useful when the
/// language is mixed, where [NameDetail.language] tells you what each name is,
/// or when you want to show a name next to its English pronunciation.
///
/// ```dart
/// randomNameDetails(language: NameLanguage.ko);
/// // [NameDetail(김민준, Kim Minjun, ko, male)]
/// ```
List<NameDetail> randomNameDetails({
  NameLanguage? language,
  NameGender? gender,
  int count = 1,
  int style = 0,
  int? minLength,
  int? maxLength,
  bool includeSurname = true,
  bool includeMiddleName = false,
  String? startsWith,
  bool unique = false,
}) => generateNameDetails(
  language: language,
  gender: gender,
  count: count,
  style: style,
  minLength: minLength,
  maxLength: maxLength,
  includeSurname: includeSurname,
  includeMiddleName: includeMiddleName,
  startsWith: startsWith,
  unique: unique,
);
