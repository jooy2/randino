// Internal shape of the per-language sentence datasets. Not part of the public
// API — consumers only ever see the option parameters and `SentenceDetail`.
//
// One dataset per language, beside `word/data` rather than inside it. The word
// pools hold nouns and the words that sit in front of them; a sentence needs
// what neither of those is — a verb in the form a sentence ends on, an adjective
// in the form a predicate takes, and the shapes the language's own grammar
// allows. So the nouns are still drawn from `word/data`, and everything a
// sentence adds to them lives here.

import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The kind of thing a noun names, which is what makes a sentence hold
/// together: a verb states the classes it accepts, and the nouns beside it are
/// drawn from those alone. `여우가 사과를 먹는다` and `여우가 철학을 먹는다`
/// differ by nothing else.
///
/// Derived from [WordTheme], so no noun carries a tag of its own — a theme is
/// already a slice of vocabulary, and which of these it falls into is the same
/// in every language. `themeClass` is where that map is written.
enum NounClass {
  /// Animals and the creatures of myth.
  creature,

  /// The trades and roles people hold.
  person,

  /// Plants.
  plant,

  /// Food and drink.
  edible,

  /// Objects, tools, clothes, what you buy, stones, instruments.
  thing,

  /// Things that carry you.
  vehicle,

  /// Places, nature, and what is out in space.
  place,

  /// Weather, sport, and the divisions of time — things that happen.
  event,

  /// Ideas, feelings, money, and the vocabulary of computing.
  idea,

  /// Parts of the body.
  body,
}

/// A form a predicate takes beside the one a plain statement ends on.
///
/// `question` is Korean `달리니` beside `달린다`, and English `run` beside
/// `runs`. A form rather than another pool: the same verbs, said differently.
/// Every form pool is index-aligned with `words`, so a verb keeps its meaning
/// across them and a word the caller required can be translated into the form
/// the sentence needs.
enum PredicateForm {
  /// The form a question ends on.
  question,
}

/// The forms a group declares, beside the plain statement its `words` are in.
typedef PredicateForms = Map<PredicateForm, WordPool>;

/// Verbs that take the same arguments.
///
/// Written as a group rather than one tagged entry per verb, because the tag is
/// the interesting part and a group of thirty verbs shares one: they all say
/// what can do the doing, and — when the verb is transitive — what it can be
/// done to.
class VerbGroup {
  /// Creates a group of verbs.
  const VerbGroup({
    required this.subject,
    required this.words,
    this.object,
    this.forms = const <PredicateForm, WordPool>{},
  });

  /// Classes a noun has to belong to to be the subject of these verbs.
  final List<NounClass> subject;

  /// Classes it can take as a direct object. Null for an intransitive group.
  final List<NounClass>? object;

  /// The verbs themselves, in the form a plain statement ends on.
  final WordPool words;

  /// The same verbs in another form, index-aligned with [words].
  ///
  /// Empty for a language whose verb does not change — Chinese, Vietnamese,
  /// Spanish, Italian and Russian ask a question with the mark alone.
  final PredicateForms forms;
}

/// Predicate adjectives that describe the same kinds of thing, grouped the way
/// verbs are.
///
/// Its own pool rather than `word/data`'s adjectives, which are written to sit
/// in front of a noun: Korean `파란` cannot end a sentence and `파랗다` cannot
/// start a noun phrase.
class StateGroup {
  /// Creates a group of predicate adjectives.
  const StateGroup({
    required this.subject,
    required this.words,
    this.forms = const <PredicateForm, WordPool>{},
  });

  /// Classes a noun has to belong to to be described by these.
  final List<NounClass> subject;

  /// The adjectives themselves, in the form a plain statement ends on.
  final WordPool words;

  /// The same adjectives in another form, index-aligned with [words].
  final PredicateForms forms;
}

/// One phrase of a shape, with whatever the language writes around it.
///
/// Both sides, because languages mark a phrase on either: Korean and Japanese
/// suffix a particle, English and Chinese put a preposition in front, and a
/// language can want both at once (Chinese `在` … `里`).
class SentencePart {
  /// Creates one phrase of a shape.
  const SentencePart(
    this.slot, {
    this.head,
    this.tail,
    this.tailAlt,
    this.modifiable = false,
    this.bare = false,
  });

  /// What this phrase does in the sentence.
  final SentenceSlot slot;

  /// Written in front of the phrase (`in`, `在`, `is`).
  final String? head;

  /// Written after it (`가`, `が`, `里`).
  final String? tail;

  /// Used instead of [tail] when the word in front of it ends on a consonant.
  ///
  /// That is the whole of Korean particle alternation — `사자가` beside
  /// `사슴이` — and a language whose particles do not alternate leaves it null.
  final String? tailAlt;

  /// Whether the phrase may carry a modifier when there is room for one.
  ///
  /// Off for a phrase that is already a fixed expression, which is every
  /// adverbial.
  final bool modifiable;

  /// Whether the phrase goes without the article the language would otherwise
  /// give it.
  ///
  /// Italian is why this exists: every Italian preposition merges with the
  /// article behind it (`in` + `la` is `nella`), so a phrase opening on one
  /// either carries the merged form or carries no article at all.
  final bool bare;
}

/// What a shape is for.
///
/// A frame with no mood is a statement, and a statement shape also serves an
/// exclamation and a sentence that trails off — those differ from it by the mark
/// and by what stands in front, not by the order of the words. A question is the
/// one that can differ, and only four of the nine languages need it to. The rest
/// declare no question shape and get their statement shapes back, which is the
/// same best-effort every other narrowing here makes.
enum SentenceMood {
  /// Says something, exclaims it, or trails off.
  statement,

  /// Asks it, in a shape the language's grammar actually moves for.
  question,
}

/// One shape a sentence can take, written in the order the language puts it in.
///
/// Per language rather than shared, and for the same reason a nickname's frames
/// are: Korean closes on its verb where English puts it second, and a language
/// whose articles cannot mark an object has no shape that carries one.
class SentenceFrame {
  /// Creates a sentence shape.
  const SentenceFrame(this.parts, this.weight, {this.mood = SentenceMood.statement, this.tag});

  /// The phrases, in the order the language writes them.
  final List<SentencePart> parts;

  /// How often this shape is used, against the other frames of the language.
  final int weight;

  /// What the shape is for. A statement unless it says otherwise.
  final SentenceMood mood;

  /// Written after the last phrase and before the terminator, with the
  /// language's own space in front of it.
  ///
  /// That is Chinese `吗`, Japanese `か` and Vietnamese `không` — none of which
  /// is a phrase, and none of which any slot could carry.
  final String? tag;
}

/// The article a noun takes, by its gender and by how the word right after the
/// article begins.
///
/// Each rule is `[prefix, article]`; the first whose prefix matches wins, and
/// `''` matches anything, which is how Italian picks `l'` before a vowel, `lo`
/// before `s` plus a consonant, and `il` for the rest. A language whose nouns
/// carry no gender writes every rule under [WordGender.n], which is what the
/// lookup falls back to.
typedef SentenceArticles = Map<WordGender, List<List<String>>>;

/// The subject pronoun a later sentence refers to the topic with, by the topic's
/// gender.
///
/// Nominative only, because a subject is never in another case. `''` is a real
/// entry and means the language writes no subject at all, which is what Korean,
/// Japanese, Chinese, Spanish and Italian actually do in a second sentence about
/// the same thing. The lookup falls back to [WordGender.n] the way
/// [SentenceArticles] does, so a language whose pronoun does not inflect writes
/// one rule.
typedef SentencePronouns = Map<WordGender, WordPool>;

/// Everything the sentence generator knows about one language.
class SentenceLanguageData {
  /// Creates a sentence dataset.
  const SentenceLanguageData({
    required this.space,
    required this.capitalize,
    required this.terminators,
    required this.verbs,
    required this.states,
    required this.manners,
    required this.times,
    required this.connectives,
    required this.interjections,
    required this.pronouns,
    required this.frames,
    this.articles,
    this.predicateAgrees = false,
    this.pronounless = const <NounClass>[],
    this.openers = const <SentenceType, String>{},
  });

  /// Placed between the phrases, and between the words inside one.
  ///
  /// A space in every language that writes one, and nothing in Japanese and
  /// Chinese. Not `word/data`'s joiner, which runs a nickname's words together
  /// on purpose: `멋진사자` is a handle, and `멋진 사자가 달린다` is a sentence.
  final String space;

  /// Whether the sentence opens on a capital letter.
  final bool capitalize;

  /// What a sentence of each type closes on.
  final Map<SentenceType, String> terminators;

  /// What it opens on, for a language that marks the type at both ends.
  ///
  /// Spanish `¿` and `¡` are the only ones here, and every other language leaves
  /// it empty.
  final Map<SentenceType, String> openers;

  /// The article a noun phrase opens with. Null for a language with no articles.
  final SentenceArticles? articles;

  /// Whether a predicate adjective agrees with its subject the way an
  /// attributive one does.
  ///
  /// Spanish, Italian and Russian inflect both; German inflects only the
  /// attributive form, so `der Wal ist blau` keeps the base word.
  final bool predicateAgrees;

  /// The verbs, grouped by what they can take.
  final List<VerbGroup> verbs;

  /// The predicate adjectives, grouped by what they can describe.
  final List<StateGroup> states;

  /// How something is done, written as the language writes it (`조용히`).
  final WordPool manners;

  /// When it happens, written whole, particle and all (`새벽에`).
  final WordPool times;

  /// What a sentence opens on when it follows another one of the same result
  /// (`그리고`, `and then`, `そして`).
  ///
  /// Written whole, so a language that needs a comma after it writes the comma.
  final WordPool connectives;

  /// What an exclamation opens on (`와,`, `Wow,`, `ああ、`).
  ///
  /// Written whole, comma and all, because where the comma goes is the
  /// language's business. Exclamations alone: a statement that opened on one
  /// would be reading itself aloud, and a question has its own mark to do the
  /// work.
  final WordPool interjections;

  /// How a later sentence refers to the topic without naming it again.
  final SentencePronouns pronouns;

  /// Noun classes the language's written pronouns are wrong for.
  ///
  /// A sentence about one of them leaves the subject out where the language can,
  /// and names the topic again where it cannot. English is the reason it exists:
  /// `he` and `she` need a person's gender, which a job noun does not carry, and
  /// `they` needs a plural verb the pools are not written in — so an English
  /// sentence about a person names it again. The languages whose written pronoun
  /// is inanimate — `그것`, `それ`, `它`, `nó` — list `person` too, and drop the
  /// subject instead, which is what they would do anyway. Empty for a language
  /// whose pronouns stand for anything.
  final List<NounClass> pronounless;

  /// The shapes a sentence of this language can take.
  final List<SentenceFrame> frames;
}
