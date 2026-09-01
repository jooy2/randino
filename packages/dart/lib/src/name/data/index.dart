import 'package:randino/src/name/data/de.dart';
import 'package:randino/src/name/data/en.dart';
import 'package:randino/src/name/data/es.dart';
import 'package:randino/src/name/data/it.dart';
import 'package:randino/src/name/data/ja.dart';
import 'package:randino/src/name/data/ko.dart';
import 'package:randino/src/name/data/ru.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/name/data/vi.dart';
import 'package:randino/src/name/data/zh.dart';
import 'package:randino/src/types.dart';

/// Every language the name generator knows about. Leaving `language` out draws
/// from this list, so the order only matters for presentation.
final List<NameLanguage> nameLanguages = List<NameLanguage>.unmodifiable(<NameLanguage>[
  NameLanguage.en,
  NameLanguage.ko,
  NameLanguage.ja,
  NameLanguage.zh,
  NameLanguage.it,
  NameLanguage.de,
  NameLanguage.ru,
  NameLanguage.es,
  NameLanguage.vi,
]);

/// The dataset behind each language. Internal.
final Map<NameLanguage, NameLanguageData> nameData =
    Map<NameLanguage, NameLanguageData>.unmodifiable(<NameLanguage, NameLanguageData>{
      NameLanguage.en: en,
      NameLanguage.ko: ko,
      NameLanguage.ja: ja,
      NameLanguage.zh: zh,
      NameLanguage.it: it,
      NameLanguage.de: de,
      NameLanguage.ru: ru,
      NameLanguage.es: es,
      NameLanguage.vi: vi,
    });

/// Lower bound for `minLength` / `maxLength`, in characters of the native form.
const int nameLengthMin = 1;

/// Upper bound for `minLength` / `maxLength`, in characters of the native form.
const int nameLengthMax = 30;

/// Upper bound for `count`.
///
/// Generation is cheap, but an unbounded count with `unique: true` can spend a
/// long time re-drawing from an exhausted pool.
const int nameCountMax = 10000;
