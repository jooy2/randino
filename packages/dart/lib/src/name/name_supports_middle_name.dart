import 'package:randino/src/name/data/index.dart';
import 'package:randino/src/types.dart';

/// Whether the language uses a middle name.
///
/// `includeMiddleName` is ignored for languages that do not — Korean, Japanese
/// and Chinese names have no middle part. A null [language] answers for the
/// mixed draw, where some of the languages do.
///
/// ```dart
/// nameSupportsMiddleName(NameLanguage.en); // true
/// nameSupportsMiddleName(NameLanguage.ko); // false
/// ```
bool nameSupportsMiddleName([NameLanguage? language]) =>
    language == null || nameData[language]!.hasMiddle;
