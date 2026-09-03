import 'package:randino/src/name/name_generator.dart';
import 'package:randino/src/types.dart';

/// Generate natural-looking person names.
///
/// Returns [count] names, written in the script given by [script]. Use
/// `randNameDetails` to get the native and romanized form of each name
/// together.
///
/// Every parameter is optional. A null [language] mixes every supported
/// language, picking one per name, and a null [gender] picks one per name;
/// [minLength] and [maxLength] fall back to the language's own range, which
/// `nameLengthRange` reports.
///
/// ```dart
/// randName(); // ['Emma Clover']
/// randName(language: NameLanguage.ko, count: 3); // ['김민준', '이서연', '박지호']
/// randName(language: NameLanguage.ko, script: NameScript.roman); // ['Kim Minjun']
/// randName(
///   language: NameLanguage.en,
///   gender: NameGender.female,
///   includeMiddleName: true,
/// ); // ['Grace Amelia Bennett']
/// ```
List<String> randName({
  NameLanguage? language,
  NameGender? gender,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  bool includeSurname = true,
  bool includeMiddleName = false,
  NameScript script = NameScript.native,
  String? startsWith,
  bool unique = false,
}) =>
    generateNameDetails(
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
    ).map((detail) => script == NameScript.roman ? detail.roman : detail.native).toList();
