import 'package:randino/src/nickname/data/en.dart';
import 'package:randino/src/nickname/data/ja.dart';
import 'package:randino/src/nickname/data/ko.dart';
import 'package:randino/src/nickname/data/types.dart';
import 'package:randino/src/nickname/data/zh.dart';
import 'package:randino/src/types.dart';

/// Languages the nickname generator knows about.
///
/// Fewer than the name generator: a nickname joins a modifier to a noun, which
/// only works without grammatical agreement — see CLAUDE.md before adding one.
final List<NicknameLanguage> nicknameLanguages = List<NicknameLanguage>.unmodifiable(
  <NicknameLanguage>[
    NicknameLanguage.en,
    NicknameLanguage.ko,
    NicknameLanguage.ja,
    NicknameLanguage.zh,
  ],
);

/// What a nickname can be about. Person names are deliberately absent.
final List<NicknameTheme> nicknameThemes = List<NicknameTheme>.unmodifiable(<NicknameTheme>[
  NicknameTheme.animal,
  NicknameTheme.object,
  NicknameTheme.nature,
  NicknameTheme.plant,
  NicknameTheme.gem,
  NicknameTheme.concept,
  NicknameTheme.myth,
  NicknameTheme.job,
  NicknameTheme.music,
  NicknameTheme.place,
  NicknameTheme.food,
  NicknameTheme.sport,
  NicknameTheme.vehicle,
  NicknameTheme.product,
]);

/// The dataset behind each language. Internal.
final Map<NicknameLanguage, NicknameLanguageData> nicknameData =
    Map<NicknameLanguage, NicknameLanguageData>.unmodifiable(
      <NicknameLanguage, NicknameLanguageData>{
        NicknameLanguage.en: en,
        NicknameLanguage.ko: ko,
        NicknameLanguage.ja: ja,
        NicknameLanguage.zh: zh,
      },
    );

/// Lower bound for `minLength` / `maxLength`, in characters.
const int nicknameLengthMin = 1;

/// Upper bound for `minLength` / `maxLength`, in characters.
const int nicknameLengthMax = 40;

/// Upper bound for `count`.
const int nicknameCountMax = 10000;
