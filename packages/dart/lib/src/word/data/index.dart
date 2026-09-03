import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/en.dart';
import 'package:randino/src/word/data/ja.dart';
import 'package:randino/src/word/data/ko.dart';
import 'package:randino/src/word/data/types.dart';
import 'package:randino/src/word/data/zh.dart';

/// Languages the word pools cover.
///
/// Fewer than the name generator: a modifier has to sit in front of a noun
/// exactly as it is written in the dictionary, which only works without
/// grammatical agreement — see CLAUDE.md before adding one.
final List<WordLanguage> wordLanguages = List<WordLanguage>.unmodifiable(<WordLanguage>[
  WordLanguage.en,
  WordLanguage.ko,
  WordLanguage.ja,
  WordLanguage.zh,
]);

/// What the words can be about. Person names are deliberately absent.
final List<WordTheme> wordThemes = List<WordTheme>.unmodifiable(<WordTheme>[
  WordTheme.animal,
  WordTheme.object,
  WordTheme.nature,
  WordTheme.plant,
  WordTheme.gem,
  WordTheme.concept,
  WordTheme.myth,
  WordTheme.job,
  WordTheme.music,
  WordTheme.place,
  WordTheme.food,
  WordTheme.sport,
  WordTheme.vehicle,
  WordTheme.product,
  WordTheme.color,
  WordTheme.finance,
  WordTheme.tech,
]);

/// The dataset behind each language. Internal.
final Map<WordLanguage, WordLanguageData> wordData =
    Map<WordLanguage, WordLanguageData>.unmodifiable(<WordLanguage, WordLanguageData>{
      WordLanguage.en: en,
      WordLanguage.ko: ko,
      WordLanguage.ja: ja,
      WordLanguage.zh: zh,
    });
