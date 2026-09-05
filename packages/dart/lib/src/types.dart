/// Every type the package's public API is written in.
///
/// The options themselves are named parameters rather than an options object,
/// which is the one deliberate difference from the JavaScript package: an
/// option that is left out is written by not writing it, and `null` is what
/// stands in for that package's `'all'`.
library;

/// A language the name generator can produce names in.
///
/// Wherever one of these is optional, `null` means **every** language — the
/// generator picks one per name.
enum NameLanguage {
  /// English.
  en,

  /// Korean.
  ko,

  /// Japanese.
  ja,

  /// Chinese.
  zh,

  /// Italian.
  it,

  /// German.
  de,

  /// Russian.
  ru,

  /// Spanish.
  es,

  /// Vietnamese.
  vi,
}

/// Which pools a given name is drawn from.
///
/// Wherever one of these is optional, `null` means a gender is picked per name.
enum NameGender {
  /// Masculine given names, and the masculine form of anything that inflects.
  male,

  /// Feminine given names, and the feminine form of anything that inflects.
  female,
}

/// How a name is written out.
enum NameScript {
  /// The language's own script: 김민준, 佐藤陽斗, Иванов Иван.
  native,

  /// The English pronunciation of the native form: Kim Minjun.
  roman,
}

/// How close to the real language a result stays.
///
/// Three levels rather than the 0-100 number this used to be. The decision is
/// taken per part and there is nothing between "always" and "half the time"
/// worth naming, so the numbers in between promised a precision that was not
/// there.
enum RandRealism {
  /// Every part is drawn from the curated pools, and is a word or a name the
  /// language actually has. The default.
  real,

  /// Decided per part, so one name can pair a real surname with an invented
  /// given name.
  mixed,

  /// Every part is built from the language's own sounds instead, so it reads
  /// like the language without being any of its words.
  invented,
}

/// A language the word pools cover.
///
/// The same nine [NameLanguage] holds: what used to keep a language out was word
/// order or agreement between a modifier and its noun, and both are the
/// language's own data now — the shapes in its frames, the endings in its
/// agreement rules. Wherever one of these is optional, `null` means every
/// language.
enum WordLanguage {
  /// English.
  en,

  /// Korean.
  ko,

  /// Japanese.
  ja,

  /// Chinese.
  zh,

  /// Vietnamese.
  vi,

  /// Spanish.
  es,

  /// Italian.
  it,

  /// German.
  de,

  /// Russian.
  ru,
}

/// What a word is about.
///
/// Each one is also a generator of its own — [WordTheme.animal] is `randAnimal`.
/// Wherever one of these is optional, `null` means every theme. Person names
/// are never used, whichever theme is picked.
enum WordTheme {
  /// Animals: 사자, Lion.
  animal,

  /// Everyday things: 물병, Bottle.
  object,

  /// Nature and its phenomena: 노을, Sunset.
  nature,

  /// Plants, and their parts: 민들레, Acorn.
  plant,

  /// Stones, metals and gems: 흑요석, Bronze.
  gem,

  /// Ideas from the humanities and the social world: 철학, Freedom.
  concept,

  /// Creatures and things out of myth: 구미호, Phoenix.
  myth,

  /// The trades and roles people hold: 대장장이, Archer.
  job,

  /// Instruments, forms and terms: 교향곡, Sonata.
  music,

  /// Places you can walk into or up to: 광장, Lighthouse.
  place,

  /// Food and drink: 떡볶이, Cocoa.
  food,

  /// Sports, and what they are played for: 양궁, Trophy.
  sport,

  /// Things that carry you: 열기구, Tramcar.
  vehicle,

  /// Things you buy: 이어폰, Toaster.
  product,

  /// Colours: 주홍, Crimson.
  color,

  /// Money and what is done with it: 이자, Ledger.
  finance,

  /// The vocabulary of computing: 캐시, Server.
  tech,

  /// What the sky is doing: 소나기, Drizzle.
  weather,

  /// Beyond the sky: 은하, Comet.
  space,

  /// When something happens: 새벽, Twilight.
  time,

  /// What someone feels: 그리움, Longing.
  emotion,

  /// Parts of a body: 손목, Shoulder.
  body,

  /// What people wear: 두루마기, Cardigan.
  clothing,

  /// What a hand works with: 대패, Chisel.
  tool,

  /// Something to drink: 식혜, Cider.
  drink,
}

/// What one word does inside a nickname.
///
/// [noun] is the word every shape is built around; the other three are what a
/// shape may put beside it. `randNickname`'s `slots` names the ones it may use,
/// and [NicknameDetail.slots] reports the ones it did.
enum WordSlot {
  /// Says what the noun is like: 멋진, Brave, 青い.
  adjective,

  /// Says what the noun is doing: 웃는, Laughing, 踊る.
  action,

  /// The nickname's base word, out of one theme's pool.
  noun,

  /// A trailing noun, joined to the base word.
  part,
}

/// The two slots that can modify a noun, which is what `randModifier` draws.
///
/// A separate enum rather than a subset of [WordSlot], because Dart cannot
/// narrow one: `randModifier(kind: WordSlot.noun)` would have to be an error at
/// run time, and this way it is one at compile time.
enum ModifierKind {
  /// Says what the value is like: 멋진, Misty.
  adjective,

  /// Says what the value is doing: 웃는, Laughing.
  action,
}

/// A span of lengths in characters, inclusive at both ends.
class LengthRange {
  /// Creates a range from [min] to [max], both inclusive.
  const LengthRange(this.min, this.max);

  /// The shortest length in the range.
  final int min;

  /// The longest length in the range.
  final int max;

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is LengthRange && other.min == min && other.max == max);

  @override
  int get hashCode => Object.hash(min, max);

  @override
  String toString() => 'LengthRange($min, $max)';
}

/// A generated name in both scripts, with the choices that produced it.
class NameDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const NameDetail({
    required this.native,
    required this.roman,
    required this.language,
    required this.gender,
  });

  /// The name in its own script.
  final String native;

  /// The English pronunciation of [native]. Identical to it for English.
  final String roman;

  /// The language this name was generated in.
  final NameLanguage language;

  /// The gender the given name was drawn from.
  final NameGender gender;

  @override
  String toString() => 'NameDetail($native, $roman, ${language.name}, ${gender.name})';
}

/// A generated word with where it came from.
class WordDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const WordDetail({required this.word, required this.language, required this.theme});

  /// The word itself.
  final String word;

  /// The language this word was drawn from.
  final WordLanguage language;

  /// Theme the word belongs to, or `null` when it is not one the generator
  /// knows, which happens when it was invented.
  final WordTheme? theme;

  @override
  String toString() => 'WordDetail($word, ${language.name}, ${theme?.name})';
}

/// What one phrase does in a sentence.
enum SentenceSlot {
  /// Who or what the sentence is about: `검은 고양이가`.
  subject,

  /// What the subject does: `잠잔다`.
  verb,

  /// What it does it to: `사과를`.
  object,

  /// What it is like, where the sentence has no verb at all: `파랗다`.
  state,

  /// Where it happens: `숲에서`.
  place,

  /// When it happens: `새벽에`.
  time,

  /// How it is done: `조용히`.
  manner,
}

/// How much a sentence says, which is the closest thing it has to an expected
/// length.
///
/// `minLength` and `maxLength` bound the characters; this bounds the parts,
/// which is what a caller usually means by a short or a long sentence.
enum SentenceShape {
  /// A subject and its predicate: `사자가 달린다`.
  simple,

  /// One phrase more: `사자가 숲에서 달린다`.
  detailed,

  /// Two or more: `용감한 사자가 새벽에 숲에서 달린다`.
  complex,
}

/// What a sentence is doing, which decides what it closes on and — where the
/// grammar needs it — the shape it takes.
///
/// A question is a shape, not a punctuation mark bolted on: English writes
/// `Does the lion run?` and German `Läuft ein Wolf?`, and both are shapes their
/// own frames declare. A language whose question differs from its statement by
/// nothing but the mark declares none, and gets its statement shapes back.
enum SentenceType {
  /// Says something: `사자가 달린다.`
  statement,

  /// Asks it: `사자가 달리니?`, `Does the lion run?`
  question,

  /// Says it with feeling, usually behind an interjection: `와, 사자가 달린다!`
  exclamation,

  /// A statement that stops rather than ends: `사자가 달린다…`
  trailing,

  /// A line somebody says, in the language's own quotation marks.
  ///
  /// `“Does the lion run?”`, `「猫が走るか？」`. What is quoted is a sentence of
  /// one of the other kinds, drawn per line, because somebody speaking is as
  /// often asking as telling.
  dialogue,

  /// The same, in the marks the language keeps for a second level.
  thought,
}

/// Which pair of quotation marks a quoted line takes.
///
/// Left out, [SentenceType.dialogue] takes the language's first-level marks and
/// [SentenceType.thought] the ones it keeps for a second level — `“…”` beside
/// `‘…’` in English, `«…»` beside `„…“` in Russian.
enum SentenceQuote {
  /// The language's first-level marks.
  double,

  /// The ones it keeps for a quote inside one.
  single,
}

/// How a sentence addresses whoever is reading it.
///
/// Korean and Japanese are the whole of it. Spanish, Italian, German and Russian
/// have a T–V distinction, but it lives in the second person and every sentence
/// here is third; English has no such form at all. In those five,
/// [SentenceStyle.polite] writes exactly what [SentenceStyle.plain] does.
enum SentenceStyle {
  /// The form a written statement takes: `사자가 달린다`, `猫が走る`.
  plain,

  /// The form you would use speaking to somebody: `사자가 달립니다`, `猫が走ります`.
  polite,
}

/// A generated sentence with the pieces it was built from.
class SentenceDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const SentenceDetail({
    required this.sentence,
    required this.sentences,
    required this.phrases,
    required this.slots,
    required this.names,
    required this.types,
    required this.language,
    required this.theme,
  });

  /// The finished result, punctuation and all — every sentence of it, joined.
  final String sentence;

  /// One entry per sentence.
  ///
  /// A single entry unless `sentences` asked for more, and [sentence] is always
  /// these joined by the language's own space.
  final List<String> sentences;

  /// The phrases the sentence is made of, in order — a phrase and its modifier,
  /// without the particle or preposition that marks it. So `검은 고양이가
  /// 잠잔다` reports `['검은 고양이', '잠잔다']`.
  ///
  /// One flat list across every sentence of the result, the same way [slots] is.
  /// A connective a sentence opens on is not a phrase and is not in here.
  final List<String> phrases;

  /// What each phrase does in the sentence, at the same index as [phrases].
  final List<SentenceSlot> slots;

  /// The person names the result was written with, in order.
  ///
  /// Empty unless `includeName` asked for them. Every one of them is also a
  /// phrase.
  final List<String> names;

  /// What each sentence is doing, at the same index as [sentences].
  final List<SentenceType> types;

  /// The language this sentence was generated in.
  final WordLanguage language;

  /// Theme the result's subject belongs to — the first sentence's, which is what
  /// every sentence after it stays about.
  ///
  /// Null when that word is not one the generator knows, which happens when it
  /// was invented or was handed in through `include`.
  final WordTheme? theme;

  @override
  String toString() => 'SentenceDetail($sentence, $phrases, ${language.name}, ${theme?.name})';
}

/// A generated nickname with the pieces it was built from.
class NicknameDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const NicknameDetail({
    required this.nickname,
    required this.words,
    required this.slots,
    required this.language,
    required this.theme,
  });

  /// The finished nickname.
  final String nickname;

  /// The words the nickname is made of, in order — the words only.
  ///
  /// A shape that needs a particle between two of them carries it in [nickname]
  /// and nowhere here, so `사자의눈물` reports `['사자', '눈물']`.
  final List<String> words;

  /// What each word does in the shape, at the same index as [words] — the noun
  /// the nickname is built around, and whatever the shape put beside it.
  final List<WordSlot> slots;

  /// The language this nickname was generated in.
  final WordLanguage language;

  /// Theme the nickname's base word belongs to, or `null` when that word is not
  /// one the generator knows, which happens when it was invented.
  final WordTheme? theme;

  @override
  String toString() => 'NicknameDetail($nickname, $words, ${language.name}, ${theme?.name})';
}
