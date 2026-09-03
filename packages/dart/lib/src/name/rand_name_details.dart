import 'package:randino/src/name/name_generator.dart';
import 'package:randino/src/types.dart';

/// Generate person names with both scripts and the choices behind each one.
///
/// Takes the same parameters as `randName` except `script` — every name is
/// returned in its native form and romanized at the same time. Useful when the
/// language is mixed, where [NameDetail.language] tells you what each name is,
/// or when you want to show a name next to its English pronunciation.
///
/// ```dart
/// randNameDetails(language: NameLanguage.ko);
/// // [NameDetail(김민준, Kim Minjun, ko, male)]
/// ```
List<NameDetail> randNameDetails({
  NameLanguage? language,
  NameGender? gender,
  int count = 1,
  RandRealism realism = RandRealism.real,
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
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  includeSurname: includeSurname,
  includeMiddleName: includeMiddleName,
  startsWith: startsWith,
  unique: unique,
);
