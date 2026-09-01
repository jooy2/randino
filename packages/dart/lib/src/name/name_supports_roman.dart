import 'package:randino/src/types.dart';

/// Whether `NameScript.roman` produces anything different from
/// `NameScript.native`.
///
/// English names are already written in the Latin alphabet, so both scripts
/// return the same string.
///
/// ```dart
/// nameSupportsRoman(NameLanguage.ko); // true
/// nameSupportsRoman(NameLanguage.en); // false
/// ```
bool nameSupportsRoman([NameLanguage? language]) => language != NameLanguage.en;
