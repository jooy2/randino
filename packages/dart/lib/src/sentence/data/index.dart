// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/sentence/data/de.dart';
import 'package:randino/src/sentence/data/en.dart';
import 'package:randino/src/sentence/data/es.dart';
import 'package:randino/src/sentence/data/it.dart';
import 'package:randino/src/sentence/data/ja.dart';
import 'package:randino/src/sentence/data/ko.dart';
import 'package:randino/src/sentence/data/ru.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/sentence/data/vi.dart';
import 'package:randino/src/sentence/data/zh.dart';
import 'package:randino/src/types.dart';

/// What each theme's nouns are, as far as a verb is concerned.
///
/// The map is the same in every language, because a theme is: `animal` names
/// creatures wherever it is written, and a verb that needs one can say so once.
///
/// This is what keeps a sentence together. `먹는다` takes an [NounClass.edible]
/// object and nothing else, so `여우가 사과를 먹는다` is a sentence the
/// generator can build and `여우가 철학을 먹는다` is not — no tag on any noun,
/// and no rule per language.
const Map<WordTheme, NounClass> themeClass = <WordTheme, NounClass>{
  WordTheme.animal: NounClass.creature,
  WordTheme.myth: NounClass.creature,
  WordTheme.job: NounClass.person,
  WordTheme.plant: NounClass.plant,
  WordTheme.food: NounClass.edible,
  WordTheme.drink: NounClass.edible,
  WordTheme.object: NounClass.thing,
  WordTheme.tool: NounClass.thing,
  WordTheme.clothing: NounClass.thing,
  WordTheme.product: NounClass.thing,
  WordTheme.gem: NounClass.thing,
  WordTheme.music: NounClass.thing,
  WordTheme.vehicle: NounClass.vehicle,
  WordTheme.place: NounClass.place,
  WordTheme.nature: NounClass.place,
  WordTheme.space: NounClass.place,
  WordTheme.weather: NounClass.event,
  WordTheme.sport: NounClass.event,
  WordTheme.time: NounClass.event,
  WordTheme.concept: NounClass.idea,
  WordTheme.emotion: NounClass.idea,
  WordTheme.finance: NounClass.idea,
  WordTheme.tech: NounClass.idea,
  WordTheme.color: NounClass.idea,
  WordTheme.body: NounClass.body,
};

/// The sentence dataset for each language the word pools cover.
final Map<WordLanguage, SentenceLanguageData> sentenceData = <WordLanguage, SentenceLanguageData>{
  WordLanguage.en: en,
  WordLanguage.ko: ko,
  WordLanguage.ja: ja,
  WordLanguage.zh: zh,
  WordLanguage.vi: vi,
  WordLanguage.es: es,
  WordLanguage.it: it,
  WordLanguage.de: de,
  WordLanguage.ru: ru,
};
