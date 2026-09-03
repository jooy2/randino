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
/// Fewer than [NameLanguage]: a modifier has to sit beside a noun exactly as it
/// is written in the dictionary, which only reads naturally in a language that
/// asks for no agreement between the two. Word order is no longer the obstacle
/// it was — Vietnamese puts its modifier after the noun and says so in its own
/// frames. Wherever one of these is optional, `null` means every language.
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

/// A generated nickname with the pieces it was built from.
class NicknameDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const NicknameDetail({
    required this.nickname,
    required this.words,
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

  /// The language this nickname was generated in.
  final WordLanguage language;

  /// Theme the nickname's base word belongs to, or `null` when that word is not
  /// one the generator knows, which happens when it was invented.
  final WordTheme? theme;

  @override
  String toString() => 'NicknameDetail($nickname, $words, ${language.name}, ${theme?.name})';
}
