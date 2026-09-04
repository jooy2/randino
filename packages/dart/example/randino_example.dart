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
  _sentences();
  _decorators();
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

  // `realism` is consulted per part, so `mixed` pairs real and invented ones.
  print(randName(language: NameLanguage.en, realism: RandRealism.invented, count: 3));
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

/// The decorators, attached to whatever you already have.
/// Sentences: a subject and something said about it, in the language's grammar.
void _sentences() {
  print('-- sentences --------------------------------------------------');

  print(randSentence(language: WordLanguage.en, count: 3));
  // [The brave lion runs quietly., The otter swims in the cove., The sky is blue.]

  print(randSentence(language: WordLanguage.ko, count: 2));
  // [검은 고양이가 숲에서 잠잔다., 여우가 사과를 먹는다.]

  // `shape` decides how much the sentence says, which is the closest thing it
  // has to an expected length.
  print(randSentence(language: WordLanguage.en, shape: SentenceShape.simple, count: 2));
  // [The gondola passes., The cattail is withered.]

  // German declares no object and no place: both would put the noun in a case
  // its own ending has to change for.
  print(randSentence(language: WordLanguage.de, count: 2));
  // [Ein blauer Wal schwimmt., Am Morgen schläft ein Wolf.]

  // Every word listed lands in every sentence.
  print(randSentence(language: WordLanguage.ko, include: <String>['사자', '조용히'], count: 2));
  // [멋진 사자가 조용히 멈춘다., 사자가 조용히 와플을 맛본다.]

  final detail = randSentenceDetails(language: WordLanguage.ko).first;

  print('${detail.sentence} <- ${detail.phrases} (${detail.theme?.name})');
  // 검은 고양이가 숲에서 잠잔다. <- [검은 고양이, 숲, 잠잔다] (animal)
}

void _decorators() {
  print('-- decorators -------------------------------------------------');

  print(randSuffix(value: '멋진사자')); // 멋진사자_nVtRC
  print(randPrefix(value: 'order-4021', length: 4, separator: '-')); // k3Rm-order-4021

  // Every decorator works with no value at all, handing back what it would
  // have attached.
  print(randSuffix()); // nVtRC
  print(randModifier()); // 멋진

  // A word instead of a token. This is what `includeModifier` used to be.
  print(randModifier(value: '사자')); // 멋진사자
  print(randModifierAll(randAnimal(language: WordLanguage.ko, count: 3)));
  // [오래된곰, 영원한도마뱀, 파란수달]

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
