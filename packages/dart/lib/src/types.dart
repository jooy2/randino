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

/// How common the words a result is built from have to be.
///
/// Each level holds the ones below it, so [common] is the pools with the rare
/// words left out, not a band of middling ones. The levels are a judgement made
/// per language about that language's own words — a word is basic because
/// people say it, not because what it names is familiar — and they only ever
/// narrow what is drawn: a word the caller required, an invented word and a
/// person's name are not the pools', and have no level.
enum RandVocabulary {
  /// The everyday words, which nearly every speaker uses and a child already
  /// knows — `사과`, `개`, `의사`, `apple`, `doctor`, `computer`.
  basic,

  /// Those and the words an adult speaker knows and uses now and then —
  /// `두더지`, `탐정`, `badger`, `interpreter`.
  common,

  /// Every word the pools hold, the specialist's and the dictionary's included
  /// — `탈륨`, `통메장이`, `thallium`, `cooper`. The default.
  full,
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

  /// Toys and games: 팽이, Kite.
  toy,

  /// Sounds and voices: 속삭임, Whisper.
  sound,

  /// People by age, kinship and character: 꼬마, Toddler.
  person,

  /// Furniture and furnishings: 요람, Hammock.
  furniture,
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
///
/// A sentence is headed by a [SentenceSlot.verb] or by a [SentenceSlot.state],
/// and a shape with neither is a copular one: it equates its subject to a
/// [SentenceSlot.date] or a [SentenceSlot.clock] instead.
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

  /// Where it is going: `시장으로`, `to the market`.
  ///
  /// Only a verb that goes somewhere or arrives can stand beside it.
  destination,

  /// When it happens: `새벽에`.
  time,

  /// How it is done: `조용히`.
  manner,

  /// How much a state holds, in front of it: `무척`, `very`.
  degree,

  /// How many of something: `사과 12개`.
  ///
  /// A noun phrase with a number and the counter its kind takes.
  quantity,

  /// How much: `100,000원`, `12,000 dollars`.
  money,

  /// What day: `2026년 9월 5일`, `September 5, 2026`.
  date,

  /// What time of day: `11시 40분`, `11:40`.
  clock,
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

/// When a sentence happened.
///
/// [present] is the form the pools are written in (`달린다`, `runs`); [past] is
/// the tense a story is told in (`달렸다`, `ran`). Every language writes it its
/// own way: Korean, Japanese, English, Spanish, Italian and German change the
/// verb, Russian changes it and makes it agree with the subject, and Chinese
/// and Vietnamese write a word beside it (`了`, `đã`) and leave the verb alone.
/// A result keeps one tense throughout.
enum SentenceTense {
  /// The form the pools are written in.
  present,

  /// The tense a story is told in.
  past,
}

/// The story a result of several sentences follows.
///
/// Each is a short sequence of things that happen, in an order that makes
/// sense, told with whatever words the language has for each of them. Which
/// stories a language can tell depends on the shapes it declares: German and
/// Russian carry no object, so they tell the ones with nothing in the hero's
/// hands.
enum SentenceStory {
  /// The hero goes somewhere, gets something to eat, comes home and eats it.
  errand,

  /// The hero is hungry, prepares something and eats it.
  meal,

  /// The hero looks for something, finds it and brings it back.
  search,

  /// The hero gets up, goes out, plays and comes home tired.
  outing,

  /// The hero makes something and sells it. People only.
  craft,

  /// The hero goes out and wanders, with nothing to carry.
  stroll,

  /// The day ends, the hero comes home and sleeps.
  evening,

  /// A person gets up, takes a thing out and sees to it. People only.
  chores,

  /// The hero carries something somewhere and hides it there.
  stash,

  /// The hero is at a loose end at home, and plays.
  idle,

  /// The place wakes before the hero does, and the day begins.
  waking,

  /// The hero gets something to eat somewhere and eats it there.
  picnic,

  /// The hero loses what they carried, looks for it, and may or may not find it.
  mishap,

  /// The hero goes to see somebody, and they talk.
  visit,

  /// A person goes out, meets somebody, and the two of them talk — the story
  /// with the most lines in it. People only.
  chat,

  /// The hero goes out, sits down somewhere, and watches what happens around
  /// them — a sparrow, a passer-by, the light changing.
  watch,

  /// The weather turns while the hero is out; they wait it out and go on once
  /// it passes.
  shelter,

  /// Nothing happens to anybody. A place is described, and the things in it do
  /// what they do: the wind, the leaves, a bird, the evening.
  sketch,

  /// Something that is not a person or an animal changes over time — an apple
  /// ripens and cools, a sky darkens and deepens.
  passage,
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
/// Four levels, which is what a Korean speech level actually is. Korean has all
/// four; Japanese has two and maps onto them, [SentenceStyle.casual] being its
/// plain form and [SentenceStyle.polite] and [SentenceStyle.formal] both
/// `走ります`. Spanish, Italian, German and Russian have a T–V distinction, but
/// it lives in the second person and every sentence here is third; English has
/// no such form at all. In those seven all four levels write the same sentence.
enum SentenceStyle {
  /// The form a written statement takes: `사자가 달린다`, `猫が走る`.
  ///
  /// Nobody is being addressed; it is the voice of a book.
  plain,

  /// The form you use with someone you are close to: `사자가 달려`.
  casual,

  /// The same closeness, said politely: `사자가 달려요`.
  ///
  /// The warmest of the four, and the one most spoken Korean is in.
  polite,

  /// Polite and at a distance: `사자가 달립니다`, `猫が走ります`.
  formal,
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
    required this.tense,
    required this.story,
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

  /// The tense every sentence of the result is in.
  final SentenceTense tense;

  /// The story a result of several sentences followed, or null for a result of
  /// one sentence, which follows none.
  final SentenceStory? story;

  /// The language this sentence was generated in.
  final WordLanguage language;

  /// Theme the result's subject belongs to: its hero's in a story, and the
  /// first sentence's otherwise, which is what every sentence after it stays
  /// about.
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

/// A language the location generators can write in.
///
/// Each one writes the places of its own country — [ko] the divisions of South
/// Korea, [en] the states and places of the United States — and a language whose
/// country publishes no dataset that can be shipped without conditions is not
/// one of them. Wherever one of these is optional, `null` means every language.
enum LocationLanguage {
  /// English, which writes the places of the United States.
  en,

  /// Korean, which writes the places of South Korea.
  ko,
}

/// How far down a location goes, largest first.
///
/// Not every country has every level: the United States stops at [city]. Nothing
/// goes below [district], and no location ever names a street or a building, so
/// a result cannot point at anybody's address.
enum LocationLevel {
  /// The country itself: `대한민국`, `United States`.
  country,

  /// Its first-level division — a Korean 시·도, a US state.
  region,

  /// The division a city, county or district is — a Korean 시·군·구, a US city,
  /// town, village or census designated place.
  city,

  /// The division inside a city — a Korean 읍·면·동.
  district,
}

/// A generated location with every level it was built from.
class LocationDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const LocationDetail({
    required this.location,
    required this.language,
    required this.level,
    required this.country,
    required this.region,
    required this.city,
    required this.district,
  });

  /// What the value form returns: one division's name, or the whole location
  /// written out.
  final String location;

  /// The language, and so the country, this location was drawn from.
  final LocationLanguage language;

  /// The deepest level the result names.
  final LocationLevel level;

  /// The country, the way [language] writes its own.
  final String country;

  /// The first-level division, or `null` for a result that does not reach it.
  final String? region;

  /// The city, or `null` for a level the result does not reach, or one its
  /// country does not have there.
  final String? city;

  /// The district, or `null` for a level the result does not reach, or one its
  /// country does not have there.
  final String? district;

  @override
  String toString() =>
      'LocationDetail($location, ${language.name}, ${level.name}, '
      '$country, $region, $city, $district)';
}

/// A generated country with the code it is known by.
class CountryDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const CountryDetail({required this.country, required this.code, required this.language});

  /// The country's name, as [language] writes it.
  final String country;

  /// Its ISO 3166-1 alpha-2 code, which is the same whatever the language.
  final String code;

  /// The language the name was written in.
  final WordLanguage language;

  @override
  String toString() => 'CountryDetail($country, $code, ${language.name})';
}

/// Which part of a life an age falls in.
enum AgeGroup {
  /// 0 to 12.
  child,

  /// 13 to 19, the ages that end in "-teen".
  teen,

  /// 20 to 64.
  adult,

  /// 65 and over, the age most pension and statistics systems count old age
  /// from.
  senior,
}

/// How likely each age is.
enum AgeDistribution {
  /// Along a curve shaped like a population, so a draw lands on a young adult
  /// far more often than on a child or somebody past seventy. The default.
  population,

  /// Every age in the range as often as any other.
  uniform,
}

/// A generated age with the part of a life it falls in.
class AgeDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const AgeDetail({required this.age, required this.group});

  /// The age, in whole years.
  final int age;

  /// The part of a life [age] falls in.
  final AgeGroup group;

  @override
  String toString() => 'AgeDetail($age, ${group.name})';
}

/// A gender as a code, the same in every language.
enum GenderCode {
  /// The same code `NameGender.male` is.
  male,

  /// The same code `NameGender.female` is.
  female,

  /// The third option a form offers beside the two.
  nonbinary,

  /// Not stated — what a record holds when nobody gave an answer.
  unknown,
}

/// A generated gender in its language, with the code behind it.
class GenderDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const GenderDetail({required this.gender, required this.code, required this.language});

  /// The label a form in [language] writes: `여성`, `Female`, `Weiblich`.
  final String gender;

  /// The same gender as a code, which is the same whatever the language.
  final GenderCode code;

  /// The language the label is written in.
  final WordLanguage language;

  @override
  String toString() => 'GenderDetail($gender, ${code.name}, ${language.name})';
}

/// What kind of organization a name is for.
enum OrganizationType {
  /// A business: `Westbrook Logistics, Inc.`, `(주)새솔테크`.
  company,

  /// An association, a foundation or a club: `새솔장학재단`,
  /// `Heimatverein Bergtal e.V.`.
  nonprofit,

  /// From a kindergarten to a university: `가람초등학교`, `Westbrook High School`.
  school,

  /// An office of the state or a town: `해솔구청`, `Ayuntamiento de Valdecastro`.
  government,

  /// An institution run for the public that is not an office — a library, a
  /// hospital, a transit authority: `새솔시립도서관`, `Stadtwerke Lindenhof`.
  public,
}

/// What a company does, which is the word its name carries for it.
enum OrganizationIndustry {
  /// `Technologies`, `테크`.
  tech,

  /// `Manufacturing`, `정밀`.
  manufacturing,

  /// `Foods`, `식품`.
  food,

  /// `Trading`, `유통`.
  retail,

  /// `Capital`, `투자`.
  finance,

  /// `Construction`, `건설`.
  construction,

  /// `Freight`, `물류`.
  logistics,

  /// `Media`, `미디어`.
  media,

  /// `Pharmaceuticals`, `제약`.
  health,

  /// `Energy`, `에너지`.
  energy,
}

/// A generated organization with the pieces it was built from.
class OrganizationDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const OrganizationDetail({
    required this.organization,
    required this.name,
    required this.legalForm,
    required this.type,
    required this.industry,
    required this.language,
  });

  /// What the value form returns: the whole name, legal form and all.
  final String organization;

  /// The name without its legal form: `새솔테크` for `(주)새솔테크`.
  final String name;

  /// The legal form, as the language writes it (`(주)`, `Inc.`, `ООО`), or
  /// `null` for none.
  final String? legalForm;

  /// The kind of organization.
  final OrganizationType type;

  /// The industry the name says the company is in, or `null` when it says none
  /// — a word like `Group`, a company named by its stem alone, or any other
  /// kind of organization.
  final OrganizationIndustry? industry;

  /// The language the organization is written in.
  final WordLanguage language;

  @override
  String toString() =>
      'OrganizationDetail($organization, $name, $legalForm, ${type.name}, '
      '${industry?.name}, ${language.name})';
}

/// One part of a date, largest first.
///
/// `randDateUnit` hands back the part it is given, as a number: `minute` is `0`
/// to `59`, `month` is `1` to `12`.
enum DateUnit {
  /// `1` to `9999`, inside the range.
  year,

  /// `1` to `12`.
  month,

  /// `1` to `31`.
  day,

  /// `0` to `23`.
  hour,

  /// `0` to `59`.
  minute,

  /// `0` to `59`.
  second,

  /// `0` to `999`.
  millisecond,
}

/// A generated date with every part it was built from. All of them are UTC.
class DateDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const DateDetail({
    required this.date,
    required this.timestamp,
    required this.year,
    required this.month,
    required this.day,
    required this.hour,
    required this.minute,
    required this.second,
    required this.millisecond,
    required this.weekday,
    required this.language,
  });

  /// The date as `format` writes it — what `randDate` returns.
  final String date;

  /// Milliseconds since `1970-01-01T00:00:00.000Z`, negative before it.
  final int timestamp;

  /// The year.
  final int year;

  /// `1` to `12`.
  final int month;

  /// `1` to `31`.
  final int day;

  /// `0` to `23`.
  final int hour;

  /// `0` to `59`.
  final int minute;

  /// `0` to `59`.
  final int second;

  /// `0` to `999`.
  final int millisecond;

  /// The day of the week, `1` for Monday to `7` for Sunday, the way ISO 8601
  /// and `DateTime.weekday` count it.
  final int weekday;

  /// The language the names in [date] are written in.
  final WordLanguage language;

  /// The part [unit] names.
  int operator [](DateUnit unit) => switch (unit) {
    DateUnit.year => year,
    DateUnit.month => month,
    DateUnit.day => day,
    DateUnit.hour => hour,
    DateUnit.minute => minute,
    DateUnit.second => second,
    DateUnit.millisecond => millisecond,
  };

  @override
  String toString() => 'DateDetail($date, $timestamp)';
}

/// A country `randPhone` writes numbers for: one for each language the word
/// pools cover — the United States for English, Korea for Korean, and so on.
enum PhoneCountry {
  /// The United States, `+1`.
  us,

  /// South Korea, `+82`.
  kr,

  /// Japan, `+81`.
  jp,

  /// China, `+86`.
  cn,

  /// Vietnam, `+84`.
  vn,

  /// Spain, `+34`.
  es,

  /// Italy, `+39`.
  it,

  /// Germany, `+49`.
  de,

  /// Russia, `+7`.
  ru;

  /// The ISO 3166-1 alpha-2 code: `KR` for [kr].
  String get code => name.toUpperCase();
}

/// What a number is for.
enum PhoneType {
  /// A mobile phone, from the blocks the country gives its operators.
  mobile,

  /// A fixed line, behind the area code of a real city. The United States
  /// writes both the same way, so there the two are drawn from the same area
  /// codes.
  landline,
}

/// A generated phone number with the pieces it was built from.
class PhoneDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const PhoneDetail({
    required this.phone,
    required this.e164,
    required this.country,
    required this.callingCode,
    required this.type,
  });

  /// What `randPhone` returns, written the way the parameters asked for.
  final String phone;

  /// The same number in E.164, the one form every system accepts:
  /// `+821023456789`.
  final String e164;

  /// The country the number is for.
  final PhoneCountry country;

  /// The country calling code, without the `+`: `'82'`.
  final String callingCode;

  /// What the number is for.
  final PhoneType type;

  @override
  String toString() => 'PhoneDetail($phone, $e164, ${country.code}, ${type.name})';
}

/// Which kind of machine a system value belongs to.
enum SystemPlatform {
  /// A PC, a laptop included — what runs Windows, macOS or Linux.
  desktop,

  /// A phone or a tablet — what runs Android, iOS or iPadOS.
  mobile,
}

/// A generated operating system with the pieces it was written from.
class OsDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const OsDetail({
    required this.os,
    required this.name,
    required this.version,
    required this.build,
    required this.edition,
    required this.platform,
    required this.year,
  });

  /// The system as `randOs` returns it: `Windows 11 Pro 23H2 (Build 22631)`.
  final String os;

  /// The name without a version: `Windows`, `macOS`, `Mac OS X`, `Ubuntu`.
  final String name;

  /// The release's version: `11`, `14`, `22.04`, `XP`. Null with
  /// `includeVersion: false`.
  final String? version;

  /// The build or point release written, as it is written: `23H2 (Build
  /// 22631)`, `14.5`.
  final String? build;

  /// The edition written: `Pro`, `Server`.
  final String? edition;

  /// The kind of machine the system runs on.
  final SystemPlatform platform;

  /// The year the release came out, or the build when one is written.
  final int year;

  @override
  String toString() => 'OsDetail($os, ${platform.name}, $year)';
}

/// What kind of device a model is.
enum DeviceType {
  /// A smartphone, and the handful of phones before them that carried a model
  /// name a sample is likely to want.
  phone,

  /// A tablet, a detachable two-in-one such as the Surface Pro included.
  tablet,

  /// A laptop. A desktop PC is left out on purpose: it is mostly built from
  /// parts and has no model name of its own.
  laptop,
}

/// A generated device with the pieces it was written from.
class DeviceDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const DeviceDetail({
    required this.device,
    required this.vendor,
    required this.model,
    required this.type,
    required this.year,
  });

  /// The device as `randDevice` returns it: `Samsung Galaxy S24 Ultra`.
  final String device;

  /// Who makes it: `Samsung`.
  final String vendor;

  /// The model's own name: `Galaxy S24 Ultra`.
  final String model;

  /// What kind of device it is.
  final DeviceType type;

  /// The year the device was released.
  final int year;

  @override
  String toString() => 'DeviceDetail($device, ${type.name}, $year)';
}

/// A unit memory is written in. Memory counts in powers of two, so a gigabyte
/// here is 1024 megabytes — the way an operating system reports it.
enum RamUnit {
  /// Megabytes.
  mb('MB'),

  /// Gigabytes, 1024 megabytes each.
  gb('GB');

  const RamUnit(this.label);

  /// The unit as it is written after a size: `MB`, `GB`.
  final String label;
}

/// A generated amount of memory, in the unit it was written in and in bytes.
class RamDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const RamDetail({
    required this.ram,
    required this.value,
    required this.unit,
    required this.bytes,
  });

  /// The size as `randRam` returns it: `16 GB`.
  final String ram;

  /// The number written: `16`.
  final int value;

  /// The unit the size is written in.
  final RamUnit unit;

  /// The same size in bytes, counted in powers of two: `17179869184`.
  final int bytes;

  @override
  String toString() => 'RamDetail($ram, $bytes)';
}

/// What kind of storage a machine has.
enum DiskType {
  /// A hard disk drive, spinning platters.
  hdd,

  /// A solid-state drive, flash memory behind SATA or NVMe.
  ssd,

  /// A solid-state hybrid drive, a hard disk with a flash cache.
  sshd,

  /// Embedded MultiMediaCard flash, soldered to the board — older phones, cheap
  /// tablets and laptops.
  emmc,

  /// Universal Flash Storage, what a phone or a tablet stores to now.
  ufs,
}

/// A generated kind of storage, with its code and its name written out.
class DiskTypeDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const DiskTypeDetail({
    required this.diskType,
    required this.code,
    required this.name,
    required this.platform,
  });

  /// The label as `randDiskType` returns it: `SSD`, `eMMC`.
  final String diskType;

  /// The same kind as a code.
  final DiskType code;

  /// The label written out: `Solid State Drive`, `Universal Flash Storage`.
  final String name;

  /// The kind of machine it was drawn for.
  final SystemPlatform platform;

  @override
  String toString() => 'DiskTypeDetail($diskType, ${platform.name})';
}

/// A unit storage is written in. A drive is sold in powers of ten, so a
/// terabyte here is 1000 gigabytes — the way the box and the spec sheet count
/// it.
enum DiskUnit {
  /// Megabytes.
  mb('MB'),

  /// Gigabytes, 1000 megabytes each.
  gb('GB'),

  /// Terabytes, 1000 gigabytes each.
  tb('TB');

  const DiskUnit(this.label);

  /// The unit as it is written after a size: `GB`, `TB`.
  final String label;
}

/// A generated drive capacity, in the unit it was written in and in bytes.
class DiskSizeDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const DiskSizeDetail({
    required this.size,
    required this.value,
    required this.unit,
    required this.bytes,
  });

  /// The size as `randDiskSize` returns it: `1 TB`.
  final String size;

  /// The number written: `1`.
  final int value;

  /// The unit the size is written in.
  final DiskUnit unit;

  /// The same size in bytes, counted in powers of ten: `1000000000000`.
  final int bytes;

  @override
  String toString() => 'DiskSizeDetail($size, $bytes)';
}

/// A generated processor with the pieces it was written from.
class CpuDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const CpuDetail({
    required this.cpu,
    required this.vendor,
    required this.model,
    required this.platform,
    required this.year,
  });

  /// The processor as `randCpu` returns it: `AMD Ryzen 7 7800X3D`.
  final String cpu;

  /// Who makes it: `AMD`.
  final String vendor;

  /// The processor's own name: `Ryzen 7 7800X3D`.
  final String model;

  /// The kind of machine it is built into.
  final SystemPlatform platform;

  /// The year the first machines with it went on sale.
  final int year;

  @override
  String toString() => 'CpuDetail($cpu, ${platform.name}, $year)';
}

/// A generated graphics processor with the pieces it was written from.
class GpuDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const GpuDetail({
    required this.gpu,
    required this.vendor,
    required this.model,
    required this.platform,
    required this.year,
  });

  /// The graphics processor as `randGpu` returns it: `NVIDIA GeForce RTX 4090`.
  final String gpu;

  /// Who sells it under their name: `NVIDIA`.
  final String vendor;

  /// The graphics processor's own name: `GeForce RTX 4090`.
  final String model;

  /// The kind of machine it is built into.
  final SystemPlatform platform;

  /// The year the first cards or machines with it went on sale.
  final int year;

  @override
  String toString() => 'GpuDetail($gpu, ${platform.name}, $year)';
}

/// A generated processor architecture with what it is known by elsewhere.
class ArchitectureDetail {
  /// Creates a detail record. Returned by the generator; there is rarely a
  /// reason to build one by hand outside a test.
  const ArchitectureDetail({
    required this.architecture,
    required this.aliases,
    required this.bits,
    required this.family,
    required this.rare,
  });

  /// The architecture as `randArchitecture` returns it: `x86_64`.
  final String architecture;

  /// The other names it goes by: `amd64` in Debian and Go, `x64` in Windows
  /// and Node.
  final List<String> aliases;

  /// `32` or `64`.
  final int bits;

  /// The line it belongs to: `x86`, `arm`, `riscv`, `power`, `s390`, `mips`,
  /// `loongarch`, `sparc`.
  final String family;

  /// Whether it is one of the architectures `includeRare` adds.
  final bool rare;

  @override
  String toString() => 'ArchitectureDetail($architecture, $bits)';
}
