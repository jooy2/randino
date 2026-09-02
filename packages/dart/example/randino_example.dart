// A tour of everything `package:randino/randino.dart` exports.
//
// Run it with `dart run example/randino_example.dart`. Every line prints
// something different each time — that is the point of the library — so the
// output in the comments is one draw rather than the answer.

import 'package:randino/randino.dart';

void main() {
  _names();
  _words();
  _nicknames();
  _affixes();
  _questionsAboutALanguage();
}

/// Person names: the kind somebody actually carries.
void _names() {
  print('-- names ------------------------------------------------------');

  // Every parameter is optional, so the shortest call there is returns one name
  // in one of the nine languages.
  print(randName()); // [Emma Clover]

  print(randName(language: NameLanguage.ko, count: 3)); // [김태윤, 원동혁, 조진우]
  print(randName(language: NameLanguage.ja, count: 3)); // [佐藤 陽菜, 鈴木 大翔, 田中 結衣]

  // Russian is the language where `gender` is visible from the outside: its
  // patronymic and its surname both inflect.
  print(
    randName(language: NameLanguage.ru, gender: NameGender.female, includeMiddleName: true),
  ); // [Людмила Николаевна Богданова]

  // `style` is consulted per part, so 50 mixes real and invented ones.
  print(randName(language: NameLanguage.en, style: 100, count: 3));
  // [Deder Kuvoun, Jaihil Brouvinn, Thoowoun Wiatou]

  // Both scripts at once, plus the choices behind each name.
  final detail = randNameDetails(language: NameLanguage.ko).first;

  print('${detail.native} / ${detail.roman} (${detail.gender.name})');
  // 김서준 / Kim Seojun (male)
}

/// Words: the everyday vocabulary the nicknames are built from, on its own.
void _words() {
  print('-- words ------------------------------------------------------');

  print(randWord(language: WordLanguage.ko, theme: WordTheme.animal, count: 3));
  // [여우, 고래, 수달]

  // Every theme is also a function of its own.
  print(randAnimal(language: WordLanguage.en, count: 3)); // [Otter, Falcon, Lynx]
  print(randFood(language: WordLanguage.ko, count: 3)); // [떡볶이, 녹차, 만두]

  final word = randWordDetails(language: WordLanguage.ko, theme: WordTheme.plant).first;

  print('${word.word} (${word.language.name}, ${word.theme?.name})');
  // 민들레 (ko, plant)
}

/// Nicknames: the handle somebody would pick for a game or a website.
void _nicknames() {
  print('-- nicknames --------------------------------------------------');

  print(randNickname(language: WordLanguage.ko, count: 3));
  // [오래된곰, 영원한도마뱀, 귀여운신화다발]

  print(randNickname(language: WordLanguage.en, theme: WordTheme.animal, count: 3));
  // [StarfishFeather, RegalShark, MistyGooseFlock]

  // A separator replaces the way the language joins its words, and counts
  // toward the length range.
  print(randNickname(language: WordLanguage.en, wordSeparator: '-', count: 3));
  // [Soft-Bat, Genial-Moose-Cove, Dreamy-Umbrella-Halo]

  final detail = randNicknameDetails(language: WordLanguage.ko).first;

  print('${detail.nickname} <- ${detail.words} (${detail.theme?.name})');
  // 오래된발견 <- [오래된, 발견] (concept)
}

/// Random tokens, attached to whatever you already have.
void _affixes() {
  print('-- affixes ----------------------------------------------------');

  print(randSuffix('멋진사자')); // 멋진사자_nVtRC
  print(randPrefix('order-4021', length: 4, separator: '-')); // k3Rm-order-4021

  // A fresh token per entry, which is what makes a batch of nicknames
  // collision-free rather than merely unlikely to collide.
  print(randSuffixAll(randNickname(language: WordLanguage.ko, count: 3)));
  // [달력_U7aNZ, 금빛독수리다발_AVcCV, 조용한바구니_RUKAP]
}

/// The helpers, which answer a question about a language instead of generating.
void _questionsAboutALanguage() {
  print('-- what a language can do -------------------------------------');

  print(nameLengthRange(language: NameLanguage.ko)); // LengthRange(3, 3)
  print(nameLengthRange(language: NameLanguage.en, includeMiddleName: true)); // LengthRange(12, 24)
  print(nameSupportsMiddleName(NameLanguage.ko)); // false
  print(nameSupportsRoman(NameLanguage.en)); // false
  print(nicknameLengthRange(language: WordLanguage.ko)); // LengthRange(1, 12)
  print(wordLengthRange(language: WordLanguage.ko)); // LengthRange(1, 4)

  print(
    '${nameLanguages.length} name languages, '
    '${wordLanguages.length} word languages, '
    '${wordThemes.length} themes',
  );
  // 9 name languages, 4 word languages, 14 themes
}
