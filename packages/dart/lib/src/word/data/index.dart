import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/en.dart';
import 'package:randino/src/word/data/ja.dart';
import 'package:randino/src/word/data/ko.dart';
import 'package:randino/src/word/data/types.dart';
import 'package:randino/src/word/data/vi.dart';
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
  WordLanguage.vi,
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
  WordTheme.weather,
  WordTheme.space,
  WordTheme.time,
  WordTheme.emotion,
  WordTheme.body,
  WordTheme.clothing,
  WordTheme.tool,
  WordTheme.drink,
]);

/// Themes a nickname only reaches once `realism` loosens.
///
/// Every one of them is a word theme like any other, and `randWord` draws from
/// them at any level; what they are not is a slice of vocabulary you can put a
/// modifier in front of and still have something anybody would type —
/// `멋진대출`, `BraveInvoice` and `奔跑的服务器` read as a joke rather than a
/// handle.
///
/// So `randNickname` leaves them out of a null `theme` at `RandRealism.real`
/// and puts them back at `mixed` and `invented`. A theme the caller named is
/// always honoured: asking for `finance` and getting something else would be
/// the parameter not working.
const List<WordTheme> looseThemes = <WordTheme>[WordTheme.color, WordTheme.finance, WordTheme.tech];

/// The dataset behind each language. Internal.
final Map<WordLanguage, WordLanguageData> wordData =
    Map<WordLanguage, WordLanguageData>.unmodifiable(<WordLanguage, WordLanguageData>{
      WordLanguage.en: en,
      WordLanguage.ko: ko,
      WordLanguage.ja: ja,
      WordLanguage.zh: zh,
      WordLanguage.vi: vi,
    });
