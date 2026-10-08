/** A language the generator can produce names in. */
export type NameLanguage = 'en' | 'ko' | 'ja' | 'zh' | 'it' | 'de' | 'ru' | 'es' | 'vi';

/** `'all'` mixes every supported language. */
export type NameLanguageOption = NameLanguage | 'all';

export type NameGender = 'male' | 'female';

/** `'all'` picks a gender per name. */
export type NameGenderOption = NameGender | 'all';

/**
 * How a name is written out:
 * - `native`: the language's own script (김민준, 佐藤陽斗, Иванов Иван).
 * - `roman`: the English pronunciation of the native form (Kim Minjun).
 */
export type NameScript = 'native' | 'roman';

/**
 * What a generator hands back:
 * - `value`: the finished strings, which is what most callers want.
 * - `detail`: an object per result, with the pieces it was built from.
 *
 * One option rather than a second function. `randNameDetails` used to be that
 * second function, and splitting one generator into two over its return type
 * meant every option had to be documented twice.
 */
export type RandOutput = 'value' | 'detail';

/**
 * How close to the real language a result stays:
 * - `real`: every part is drawn from the curated pools, and is a word or a name
 *   the language actually has. The default.
 * - `mixed`: decided per part, so one name can pair a real surname with an
 *   invented given name.
 * - `invented`: every part is built from the language's own sounds instead, so
 *   it reads like the language without being any of its words.
 *
 * Three levels rather than the 0-100 number this used to be. The decision is
 * taken per part and there is nothing between "always" and "half the time"
 * worth naming, so the numbers in between promised a precision that was not
 * there.
 */
export type RandRealism = 'real' | 'mixed' | 'invented';

/**
 * How common the words a result is built from have to be:
 * - `basic`: the everyday words, which nearly every speaker uses and a child
 *   already knows — `사과`, `개`, `의사`, `apple`, `doctor`, `computer`.
 * - `common`: those and the words an adult speaker knows and uses now and then —
 *   `두더지`, `탐정`, `badger`, `interpreter`.
 * - `full`: every word the pools hold, the specialist's and the dictionary's
 *   included — `탈륨`, `통메장이`, `thallium`, `cooper`. The default for `randWord`
 *   and `randNickname`, which are asked for a word; `randSentence` defaults to
 *   `common`, because a sentence is read.
 *
 * Each level holds the ones below it, so `common` is the pools with the rare
 * words left out, not a band of middling ones. The levels are a judgement made
 * per language about that language's own words — a word is basic because people
 * say it, not because what it names is familiar — and they only ever narrow what
 * is drawn: a word the caller required, an invented word and a person's name are
 * not the pools', and have no level.
 */
export type RandVocabulary = 'basic' | 'common' | 'full';

/**
 * The options every generator takes, whatever it generates. `randName`,
 * `randNickname` and `randWord` each add their own on top of these — a gender, a
 * theme, a word separator — but they all count, filter, deduplicate and report
 * the same way, so those options are described once here rather than three times.
 */
export interface RandCommonOptions {
	/** How many results to return. Default `1`, maximum `RAND_COUNT_MAX`. */
	count?: number;
	/**
	 * Whether the parts are drawn from the curated pools or invented to read like
	 * the language. `'mixed'` decides per part, not per batch. Default `'real'`.
	 */
	realism?: RandRealism;
	/** Minimum length of the result, in characters. Defaults to the language's own range. */
	minLength?: number;
	/** Maximum length of the result, in characters. Defaults to the language's own range. */
	maxLength?: number;
	/** Keep only results whose first character is this one. */
	startsWith?: string;
	/**
	 * Never return the same result twice. May return fewer than `count` once the
	 * pools run out of combinations. Default `false`.
	 */
	unique?: boolean;
	/** Strings, or one detail object per result. Default `'value'`. */
	output?: RandOutput;
	/**
	 * Where the randomness comes from: a function returning a number in `[0, 1)`,
	 * the way `Math.random` does. That is the default, and it is neither
	 * cryptographically secure nor reproducible — pass one of your own when you
	 * need either.
	 *
	 * ```javascript
	 * // Unguessable, for a value somebody must not be able to predict.
	 * const secure = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
	 *
	 * randSuffix('MistyOwl', { random: secure });
	 *
	 * // Or reproducible, for a fixture that has to come out the same every run.
	 * randName({ language: 'en', count: 3, random: seeded(42) });
	 * ```
	 *
	 * It is used for every draw the call makes, including the ones a generator
	 * makes through another — the name `randSentence` writes comes from here too.
	 */
	random?: () => number;
}

export interface RandNameOptions extends RandCommonOptions {
	/** Language of the generated names. `'all'` mixes every language. Default `'all'`. */
	language?: NameLanguageOption;
	/** Gender the given name is drawn from. Default `'all'`. */
	gender?: NameGenderOption;
	/** Include a surname. Default `true`. */
	includeSurname?: boolean;
	/** Include a middle name, for languages that use one. Default `false`. */
	includeMiddleName?: boolean;
	/** Script of the returned strings. Ignored when `output` is `'detail'`, which carries both. Default `'native'`. */
	script?: NameScript;
}

/** A generated name in both scripts, with the choices that produced it. */
export interface NameDetail {
	/** The name in its own script. */
	native: string;
	/** The English pronunciation of `native`. Identical to `native` for English. */
	roman: string;
	language: NameLanguage;
	gender: NameGender;
}

/**
 * A language the word pools cover, and so a language `randWord`, `randModifier`
 * and `randNickname` can work in. The same nine `NameLanguage` holds: what used
 * to keep a language out was word order or agreement between a modifier and its
 * noun, and both are the language's own data now — the shapes in its `frames`,
 * the endings in its `agreement`.
 */
export type WordLanguage = 'en' | 'ko' | 'ja' | 'zh' | 'vi' | 'es' | 'it' | 'de' | 'ru';

/** `'all'` mixes every supported language. */
export type WordLanguageOption = WordLanguage | 'all';

/**
 * What a word is about — animals (`사자`), everyday things (`물병`), nature
 * and its phenomena (`노을`), plants (`민들레`), stones and metals (`흑요석`),
 * ideas from the humanities and social world (`철학`), creatures out of myth
 * (`구미호`), the trades and roles people hold (`대장장이`), music (`교향곡`),
 * places (`광장`), food (`떡볶이`), sports (`양궁`), things that carry you
 * (`열기구`), things you buy (`이어폰`), colours (`주홍`), money and what is done
 * with it (`이자`), the vocabulary of computing (`캐시`), toys and games (`팽이`),
 * sounds (`속삭임`), people by age and kinship (`꼬마`), or furniture (`요람`).
 * Person names are never used.
 *
 * Each one is also a generator of its own — `animal` is `randAnimal`.
 */
export type WordTheme =
	| 'animal'
	| 'object'
	| 'nature'
	| 'plant'
	| 'gem'
	| 'concept'
	| 'myth'
	| 'job'
	| 'music'
	| 'place'
	| 'food'
	| 'sport'
	| 'vehicle'
	| 'product'
	| 'color'
	| 'finance'
	| 'tech'
	| 'weather'
	| 'space'
	| 'time'
	| 'emotion'
	| 'body'
	| 'clothing'
	| 'tool'
	| 'drink'
	| 'toy'
	| 'sound'
	| 'person'
	| 'furniture';

/** `'all'` draws from every theme. */
export type WordThemeOption = WordTheme | 'all';

export interface RandWordOptions extends RandCommonOptions {
	/** Language of the generated words. `'all'` mixes every language. Default `'all'`. */
	language?: WordLanguageOption;
	/** What the words should be about. Default `'all'`. */
	theme?: WordThemeOption;
	/** How common the words have to be. Default `'full'`, which is every word the pools hold. */
	vocabulary?: RandVocabulary;
}

/**
 * What the twenty-nine themed generators take — `RandWordOptions` without the
 * option they answer. `randAnimal({ theme: 'food' })` would be a contradiction,
 * so it does not type-check.
 */
export type RandThemedWordOptions = Omit<RandWordOptions, 'theme'>;

/** A generated word with where it came from. */
export interface WordDetail {
	/** The word itself. */
	word: string;
	language: WordLanguage;
	/**
	 * Theme the word belongs to, or `null` when it is not one the generator
	 * knows, which happens when it was invented.
	 */
	theme: WordTheme | null;
}

/**
 * What one word does inside a nickname. `noun` is the word every shape is built
 * around; the other three are what a shape may put beside it — a word for what
 * the noun is like, one for what it is doing, and a second noun behind it.
 */
export type WordSlot = 'adjective' | 'action' | 'noun' | 'part';

/**
 * Which shapes a nickname may take, named by the slots they put beside the noun.
 * A shape qualifies when it uses at least one of them, so an array is a set to
 * draw from rather than a list every shape has to satisfy: `['adjective',
 * 'action']` asks for a modifier and leaves the kind to chance.
 *
 * `'none'` asks for the bare noun, and `'all'` — the default — leaves the shape
 * to the language's own frame weights.
 */
export type WordSlotOption = WordSlot | readonly WordSlot[] | 'all' | 'none';

/** The two slots that can modify a noun, which is what `randModifier` draws. */
export type ModifierKind = Extract<WordSlot, 'adjective' | 'action'>;

export interface RandNicknameOptions extends RandCommonOptions {
	/** Language of the generated nicknames. `'all'` mixes every language. Default `'all'`. */
	language?: WordLanguageOption;
	/** What the nickname should be about. Default `'all'`. */
	theme?: WordThemeOption;
	/**
	 * How common the noun a nickname is built around has to be. Default `'full'`,
	 * which is every word the pools hold; the modifier in front of it is drawn as
	 * it always was.
	 */
	vocabulary?: RandVocabulary;
	/**
	 * Which shapes the nicknames may take. Default `'all'`, which is every shape
	 * the language declares, drawn by its own weights.
	 *
	 * A language declares its own shapes, so not every one of them can answer
	 * every request — Spanish has no trailing-noun shape, because `cola de gato`
	 * needs a preposition. Asking for one it does not have falls back to the
	 * closest shape it does, the way a length range too narrow for a shape is
	 * answered with the closest fit rather than an error. With `language: 'all'`,
	 * the languages that can answer are preferred over the ones that cannot.
	 */
	slots?: WordSlotOption;
	/**
	 * Placed between the words a nickname is built from (`'멋진 사자'`,
	 * `'misty-owl'`), and counted toward `minLength` / `maxLength`. Defaults to the
	 * way the language itself joins them, which is to run them together
	 * (`멋진사자`, `MistyOwl`).
	 */
	wordSeparator?: string;
}

/**
 * What `randSuffix` and `randPrefix` attach — the same three for both.
 *
 * `randModifier` is the third decorator and shares none of them: it attaches a
 * word rather than a token, so it takes `RandModifierOptions` instead.
 */
export interface RandAffixOptions {
	/** Characters in the token. Default `5`, maximum `32`. */
	length?: number;
	/** Placed between the value and its token. Default `'_'`. */
	separator?: string;
	/** Characters the token is drawn from. Defaults to alphanumerics without `0O1lI`. */
	charset?: string;
	/**
	 * Where the randomness comes from: a function returning a number in `[0, 1)`,
	 * the way `Math.random` does. That is the default, and it is neither
	 * cryptographically secure nor reproducible — pass one of your own when you
	 * need either.
	 *
	 * ```javascript
	 * // Unguessable, for a value somebody must not be able to predict.
	 * const secure = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
	 *
	 * randSuffix('MistyOwl', { random: secure });
	 *
	 * // Or reproducible, for a fixture that has to come out the same every run.
	 * randName({ language: 'en', count: 3, random: seeded(42) });
	 * ```
	 *
	 * It is used for every draw the call makes, including the ones a generator
	 * makes through another — the name `randSentence` writes comes from here too.
	 */
	random?: () => number;
}

/** What `randModifier` puts in front of a value. */
export interface RandModifierOptions {
	/**
	 * Language the modifier is drawn from. Left out, the script of the value
	 * picks it, so `'고양이'` is never handed an English modifier; with no value
	 * at all, or with `'all'`, every language is in play.
	 */
	language?: WordLanguageOption;
	/**
	 * Whether the modifier is one the language actually uses, or one invented to
	 * read like it. Default `'real'`.
	 */
	realism?: RandRealism;
	/**
	 * Whether the modifier says what the value is like (`멋진`, `Misty`) or what
	 * it is doing (`웃는`, `Laughing`). Default `'all'`, which draws from both.
	 */
	kind?: ModifierKind | 'all';
	/**
	 * Placed between the modifier and the value. Defaults to the way the language
	 * itself joins words, which is to run them together (`멋진사자`, `MistyOwl`).
	 */
	separator?: string;
	/**
	 * Where the randomness comes from: a function returning a number in `[0, 1)`,
	 * the way `Math.random` does. The same option every generator takes — see
	 * `RandCommonOptions`.
	 */
	random?: () => number;
}

/** A generated nickname with the pieces it was built from. */
export interface NicknameDetail {
	/** The finished nickname. */
	nickname: string;
	/**
	 * The words the nickname is made of, in order — the words only. A shape that
	 * needs a particle between two of them carries it in `nickname` and nowhere
	 * here, so `사자의눈물` reports `['사자', '눈물']`.
	 */
	words: string[];
	/**
	 * What each word does in the shape, at the same index as `words` — the noun
	 * the nickname is built around, and whatever the shape put beside it.
	 */
	slots: WordSlot[];
	language: WordLanguage;
	/**
	 * Theme the nickname's base word belongs to, or `null` when that word is not
	 * one the generator knows, which happens when it was invented.
	 */
	theme: WordTheme | null;
}

/**
 * What one phrase does in a sentence:
 * - `subject`: who or what the sentence is about (`검은 고양이가`).
 * - `verb`: what the subject does (`잠잔다`).
 * - `object`: what it does it to (`사과를`).
 * - `state`: what it is like, where the sentence has no verb at all (`파랗다`).
 * - `place`: where it happens (`숲에서`).
 * - `destination`: where it is going (`시장으로`, `to the market`), which only a
 *   verb that goes somewhere or arrives can stand beside.
 * - `time`: when (`새벽에`).
 * - `manner`: how (`조용히`).
 * - `quantity`: how many of something (`사과 12개`), which is a noun phrase with a
 *   number and the counter its kind takes.
 * - `money`: how much (`100,000원`, `12,000 dollars`).
 * - `date`: what day (`2026년 9월 5일`, `September 5, 2026`).
 * - `clock`: what time of day (`11시 40분`, `11:40`).
 *
 * A sentence is headed by a `verb` or by a `state`, and a shape with neither is
 * a copular one: it equates its subject to a `date` or a `clock` instead.
 */
export type SentenceSlot =
	| 'subject'
	| 'verb'
	| 'object'
	| 'state'
	| 'place'
	| 'destination'
	| 'time'
	| 'manner'
	| 'degree'
	| 'quantity'
	| 'money'
	| 'date'
	| 'clock';

/**
 * Which shapes a sentence may take, named by the parts they carry beside the
 * subject. A shape qualifies when it uses at least one of them, the same way
 * `WordSlotOption` reads for a nickname: an array is a set to draw from rather
 * than a list every shape has to satisfy.
 *
 * `'none'` asks for the bare subject and its predicate, and `'all'` — the
 * default — leaves the shape to the language's own frame weights.
 */
export type SentenceSlotOption = SentenceSlot | readonly SentenceSlot[] | 'all' | 'none';

/**
 * How much a sentence says, which is the closest thing it has to an expected
 * length:
 * - `simple`: a subject and its predicate (`사자가 달린다`).
 * - `detailed`: one phrase more (`사자가 숲에서 달린다`).
 * - `complex`: two or more (`용감한 사자가 새벽에 숲에서 달린다`).
 *
 * `minLength` and `maxLength` bound the characters; this bounds the parts, which
 * is what a caller usually means by a short or a long sentence.
 */
export type SentenceShape = 'simple' | 'detailed' | 'complex';

/**
 * What a sentence is doing, which decides what it closes on and — where the
 * grammar needs it — the shape it takes:
 * - `statement`: says something (`사자가 달린다.`). The default.
 * - `question`: asks it (`사자가 달리니?`, `Does the lion run?`).
 * - `exclamation`: says it with feeling, usually behind an interjection
 *   (`와, 사자가 달린다!`).
 * - `trailing`: a statement that stops rather than ends (`사자가 달린다…`).
 * - `dialogue`: a line somebody says, in the language's own quotation marks
 *   (`“Does the lion run?”`, `「猫が走るか？」`).
 * - `thought`: the same, in the marks the language keeps for a second level.
 *
 * A question is a shape, not a punctuation mark bolted on: English writes
 * `Does the lion run?` and German `Läuft ein Wolf?`, and both are shapes their
 * own `frames` declare. A language whose question differs from its statement by
 * nothing but the mark declares none, and gets its statement shapes back.
 *
 * `dialogue` and `thought` are the two that are not shapes at all: what is quoted
 * is a sentence of one of the other kinds, drawn per line, because somebody
 * speaking asks more often than a page of prose does, and still tells more often
 * than either.
 */
export type SentenceType =
	'statement' | 'question' | 'exclamation' | 'trailing' | 'dialogue' | 'thought';

/**
 * Which pair of quotation marks a quoted line takes. Left out, `dialogue` takes
 * the language's first-level marks and `thought` the ones it keeps for a second
 * level — `“…”` beside `‘…’` in English, `«…»` beside `„…“` in Russian.
 */
export type SentenceQuote = 'double' | 'single';

/**
 * How a sentence addresses whoever is reading it. Four levels, coldest to
 * warmest in the middle two, which is what a Korean speech level actually is:
 * - `plain`: the form a written statement takes (`사자가 달린다`, `猫が走る`).
 *   Nobody is being addressed; it is the voice of a book.
 * - `casual`: the form you use with someone you are close to (`사자가 달려`).
 * - `polite`: the same closeness, said politely (`사자가 달려요`). The warmest of
 *   the four, and the one most spoken Korean is in.
 * - `formal`: polite and at a distance (`사자가 달립니다`, `猫が走ります`).
 *
 * Korean has all four. Japanese has two and maps onto them: `casual` is its
 * plain form and `polite` and `formal` are both `走ります`. Spanish, Italian,
 * German and Russian have a T–V distinction, but it lives in the second person
 * and every sentence here is third; English has no such form at all. In those
 * seven all four levels write exactly the same sentence.
 */
export type SentenceStyle = 'plain' | 'casual' | 'polite' | 'formal';

/**
 * When a sentence happened. `present` is the form the pools are written in
 * (`달린다`, `runs`); `past` is the tense a story is told in (`달렸다`, `ran`).
 *
 * Every language writes it its own way: Korean, Japanese, English, Spanish,
 * Italian and German change the verb, Russian changes it and makes it agree with
 * the subject, and Chinese and Vietnamese write a word beside it (`了`, `đã`) and
 * leave the verb alone. A result keeps one tense throughout.
 */
export type SentenceTense = 'present' | 'past';

/**
 * The story a result of several sentences follows. Each is a short sequence of
 * things that happen, in an order that makes sense, told with whatever words the
 * language has for each of them:
 * - `errand`: the hero goes somewhere, gets something to eat, comes home and eats it.
 * - `meal`: the hero is hungry, prepares something and eats it.
 * - `search`: the hero looks for something, finds it and brings it back.
 * - `outing`: the hero gets up, goes out, plays and comes home tired.
 * - `craft`: the hero makes something and sells it. People only.
 * - `stroll`: the hero goes out and wanders, with nothing to carry.
 * - `evening`: the day ends, the hero comes home and sleeps.
 * - `chores`: a person gets up, takes a thing out and sees to it. People only.
 * - `stash`: the hero carries something somewhere and hides it there.
 * - `idle`: the hero is at a loose end at home, and plays.
 * - `waking`: the place wakes before the hero does, and the day begins.
 * - `picnic`: the hero gets something to eat somewhere and eats it there.
 * - `mishap`: the hero loses what they carried, looks for it, and may or may not find it.
 * - `visit`: the hero goes to see somebody, and they talk.
 * - `chat`: a person goes out, meets somebody, and the two of them talk — the
 *   story with the most lines in it. People only.
 * - `watch`: the hero goes out, sits down somewhere, and watches what happens
 *   around them — a sparrow, a passer-by, the light changing.
 * - `shelter`: the weather turns while the hero is out; they wait it out and
 *   go on once it passes.
 * - `sketch`: nothing happens to anybody. A place is described, and the things
 *   in it do what they do: the wind, the leaves, a bird, the evening.
 * - `passage`: something that is not a person or an animal changes over time —
 *   an apple ripens and cools, a sky darkens and deepens.
 *
 * Which stories a language can tell depends on the shapes it declares: German and
 * Russian carry no object, so they tell the ones with nothing in the hero's hands.
 */
export type SentenceStory =
	| 'errand'
	| 'meal'
	| 'search'
	| 'outing'
	| 'craft'
	| 'stroll'
	| 'evening'
	| 'chores'
	| 'stash'
	| 'idle'
	| 'waking'
	| 'picnic'
	| 'mishap'
	| 'visit'
	| 'chat'
	| 'watch'
	| 'shelter'
	| 'sketch'
	| 'passage';

/**
 * Which of them a result may be. An array is a set to draw from, decided per
 * sentence, and `'all'` is every one of them.
 */
export type SentenceTypeOption = SentenceType | readonly SentenceType[] | 'all';

/** `'all'` leaves the shape to the language's own frame weights. */
export type SentenceShapeOption = SentenceShape | 'all';

export interface RandSentenceOptions extends RandCommonOptions {
	/** Language of the generated sentences. `'all'` mixes every language. Default `'all'`. */
	language?: WordLanguageOption;
	/** What the sentence's subject is about. Default `'all'`. */
	theme?: WordThemeOption;
	/**
	 * How common the nouns have to be — the subject, the object, the place, the
	 * thing a story is about. Default `'common'`, which is every word the pools
	 * hold but the rare ones; `'full'` is the pools as they are. The verbs, the
	 * modifiers and the adverbials are the sentence data's own and are drawn as
	 * they always were.
	 */
	vocabulary?: RandVocabulary;
	/** How much the sentence says. Default `'all'`. */
	shape?: SentenceShapeOption;
	/**
	 * Which shapes the sentences may take, by the parts they carry beside the
	 * subject. Default `'all'`.
	 *
	 * A language declares its own shapes, so not every one of them can answer
	 * every request — German has no `object` shape, because an accusative noun
	 * phrase needs a case its articles would have to carry. Asking for one it
	 * does not have falls back to the closest shape it does, and with
	 * `language: 'all'` the languages that can answer are preferred.
	 */
	slots?: SentenceSlotOption;
	/**
	 * Words the sentence has to contain, each at least once. A word the language's
	 * pools hold is put in the phrase it belongs to, so `include: '사자'` makes it
	 * the subject and `include: '달린다'` makes it the verb; a word from anywhere
	 * else is used as a noun.
	 *
	 * A sentence has room for as many of them as it has phrases, so asking for
	 * more words than the longest shape can carry places what fits and drops the
	 * rest. With `sentences` above 1 the words go in the first of them, which is
	 * what puts each of them in the result once rather than once per sentence.
	 */
	include?: string | readonly string[];
	/**
	 * What the sentences are doing — saying something, asking it, exclaiming it,
	 * quoting somebody, or trailing off. Left out, or given more than one, the kind
	 * is decided per sentence.
	 *
	 * That decision is weighted rather than even, because prose is: a statement is
	 * far and away the most likely, a line somebody says comes next, and a question
	 * or an exclamation is the rarest of them. Naming one kind still gets you that
	 * kind and nothing else.
	 *
	 * A language answers with what it has: five of the nine write a question with
	 * nothing but the mark, and the four that need more — English's do-support,
	 * German's verb moving to the front, Korean's and Japanese's endings — say so in
	 * their own shapes.
	 */
	type?: SentenceTypeOption;
	/**
	 * Which quotation marks a `'dialogue'` or a `'thought'` is written in. Left
	 * out, dialogue takes the language's first-level marks and thought its
	 * second-level ones. Ignored by every other type.
	 */
	quote?: SentenceQuote;
	/**
	 * How the sentence addresses its reader. Drawn per result when left out, so
	 * that two calls are not the same voice twice.
	 *
	 * Korean and Japanese are the two languages this changes: `달린다` becomes
	 * `달려`, `달려요` or `달립니다`, question and exclamation included (`달려요?`,
	 * `달리는구나!`). The other seven write the same sentence at every level,
	 * which is what their grammar actually does with politeness in the third
	 * person.
	 */
	style?: SentenceStyle;
	/**
	 * When it happened. Drawn per result when left out, so that a paragraph is told
	 * in one tense throughout and two calls are not always the same one.
	 *
	 * `'past'` is how a story is told: `여우가 시장으로 갔다`, `The fox went to the
	 * market`. Every language writes it the way its own grammar does — a changed
	 * verb, a verb that agrees with its subject, or a word beside a verb that does
	 * not change — and a required predicate is translated into the tense the
	 * sentence is in, the same way it is translated into its mood and level.
	 */
	tense?: SentenceTense;
	/**
	 * Which story a result of several sentences tells. Drawn per result when left
	 * out, from the stories the language can tell about the subject asked for.
	 *
	 * With `sentences` above 1 the sentences are not several draws about one
	 * subject but one sequence of things that happen: the hero goes somewhere,
	 * finds something there, brings it back, and what each sentence says follows
	 * from what the ones before it said. Ignored by a result of one sentence,
	 * which has no story to follow.
	 */
	story?: SentenceStory;
	/**
	 * Whether a sentence about a person writes a generated name where that person
	 * would go — `Emma runs quietly.`, `민준이 조용히 달린다.` Default `false`.
	 *
	 * Turning it on narrows the subject to the themes that name people, so that the
	 * sentence has somewhere to put one; a `theme` you named yourself is still
	 * honoured, and a sentence about a lion stays about a lion. The name is a bare
	 * given name — no article and no modifier — and it carries its own gender, so
	 * what agrees with a subject agrees with it.
	 *
	 * Off by default because it is the one option that reaches the person-name
	 * pools: a caller who never asks for a name never pays for them. It does not
	 * weaken the rule that a nickname is never built from a person name — this is a
	 * sentence, and you asked.
	 */
	includeName?: boolean;
	/**
	 * How many sentences one result holds. Default `1`, maximum
	 * `RAND_SENTENCE_COUNT_MAX`.
	 *
	 * They come back as one string rather than as separate results — `count` is
	 * still how many strings there are — and they are about the same thing: a
	 * later sentence names the first one's subject again, refers to it with a
	 * pronoun, or draws a fresh subject of the same kind, and may open on a
	 * connective.
	 *
	 * A result reads as one short story rather than as several draws that landed
	 * together. The sentences follow a `story`: the hero goes somewhere, does
	 * something there, comes back, and what one sentence leaves true is what the
	 * next one builds on — a hero eats what an earlier sentence had them buy, and
	 * rests once a sentence has said they are tired. The place and the thing stay
	 * the same throughout, the time of day only moves forward, a connective claims
	 * only what the sentences around it can carry, and two things that happen one
	 * after the other are sometimes written as one sentence (`집으로 돌아와서 사과를
	 * 먹었다`). It keeps the tense, the level and the register it opened in, spends
	 * its verbs before it repeats one, names a person and then leaves them alone,
	 * and never opens two of its sentences on the same word.
	 *
	 * Not every story is about somebody doing things: one describes a place and
	 * what moves in it, one has the hero sit and watch. Somebody else may turn up
	 * in any of them — a passer-by, the person met — and do something of their
	 * own. Whether anybody speaks is drawn per result: a paragraph may be narrated
	 * all the way through, quote a line or two, or carry a short exchange, in
	 * which a person says what they feel, what they just did, or what they make
	 * of the thing in front of them, and somebody answers.
	 *
	 * `minLength` and `maxLength` describe the whole string whatever this is, so
	 * the range is shared out across the sentences before any of them is drawn.
	 */
	sentences?: number;
}

/** A generated sentence with the pieces it was built from. */
export interface SentenceDetail {
	/** The finished result, punctuation and all — every sentence of it, joined. */
	sentence: string;
	/**
	 * One entry per sentence. A single entry unless `sentences` asked for more,
	 * and `sentence` is always these joined by the language's own space.
	 */
	sentences: string[];
	/**
	 * The phrases the sentence is made of, in order — a phrase and its modifier,
	 * without the particle or preposition that marks it. So `검은 고양이가 잠잔다`
	 * reports `['검은 고양이', '잠잔다']`.
	 *
	 * One flat list across every sentence of the result, the same way `slots` is.
	 * A connective a sentence opens on is not a phrase and is not in here, and
	 * neither is a line somebody answers with (`“그러게.”`, `“Really?”`), which is
	 * written whole and is built from no phrase at all.
	 */
	phrases: string[];
	/** What each phrase does in the sentence, at the same index as `phrases`. */
	slots: SentenceSlot[];
	/**
	 * The person names the result was written with, in order, and empty unless
	 * `includeName` asked for them. Every one of them is also a phrase.
	 */
	names: string[];
	/** What each sentence is doing, at the same index as `sentences`. */
	types: SentenceType[];
	/** The tense every sentence of the result is in. */
	tense: SentenceTense;
	/**
	 * The story a result of several sentences followed, or `null` for a result of
	 * one sentence, which follows none.
	 */
	story: SentenceStory | null;
	language: WordLanguage;
	/**
	 * Theme the result's subject belongs to — the first sentence's, which is what
	 * every sentence after it stays about. `null` when that word is not one the
	 * generator knows, which happens when it was invented or was handed in through
	 * `include`.
	 */
	theme: WordTheme | null;
}

/**
 * A language the location generators can write in. Each one writes the places of
 * its own country — `ko` the divisions of South Korea, `en` the states and places
 * of the United States — and a language whose country publishes no dataset that
 * can be shipped without conditions is not one of them.
 */
export type LocationLanguage = 'en' | 'ko';

/** `'all'` mixes every language the location generators support. */
export type LocationLanguageOption = LocationLanguage | 'all';

/**
 * How far down a location goes, largest first:
 * - `country`: the country itself (`대한민국`, `United States`).
 * - `region`: its first-level division — a Korean 시·도, a US state.
 * - `city`: the division a city, county or district is — a Korean 시·군·구, a US
 *   city, town, village or census designated place.
 * - `district`: the division inside a city — a Korean 읍·면·동.
 *
 * Not every country has every level: the United States stops at `city`. Nothing
 * goes below `district`, and no location ever names a street or a building, so a
 * result cannot point at anybody's address.
 */
export type LocationLevel = 'country' | 'region' | 'city' | 'district';

/**
 * What the location generators take. `realism` is not among them: a location is
 * a real place or it is not a location, so there is nothing to invent.
 */
export interface RandLocationUnitOptions extends Omit<RandCommonOptions, 'realism'> {
	/** Language, and so country, of the places. `'all'` mixes every one. Default `'all'`. */
	language?: LocationLanguageOption;
}

/**
 * What `randCountry` takes. Its `language` is any word language rather than a
 * location language: every country has a name in all nine, where only some of
 * them have divisions to draw.
 */
export interface RandCountryOptions extends Omit<RandCommonOptions, 'realism'> {
	/** Language the country names are written in. `'all'` mixes every one. Default `'all'`. */
	language?: WordLanguageOption;
}

/** A generated country with the code it is known by. */
export interface CountryDetail {
	/** The country's name, as the language writes it. */
	country: string;
	/** Its ISO 3166-1 alpha-2 code, which is the same whatever the language. */
	code: string;
	language: WordLanguage;
}

export interface RandLocationOptions extends RandLocationUnitOptions {
	/**
	 * How far down the location goes. A country without that level stops at the
	 * deepest one it has. Default `'district'`, which is as far as any goes.
	 */
	level?: LocationLevel;
	/**
	 * Open the location on its country. Default `true`. A caller who fixed
	 * `language` already knows the country, and `false` writes `경기도 수원시 장안구`
	 * rather than `대한민국 경기도 수원시 장안구`; the detail still reports `country`.
	 * The length options and `startsWith` read the string without it. A location
	 * at `level: 'country'` is the country, and writes it either way.
	 */
	includeCountry?: boolean;
}

/** A generated location with every level it was built from. */
export interface LocationDetail {
	/** What the value form returns: one division's name, or the whole location written out. */
	location: string;
	language: LocationLanguage;
	/** The deepest level the result names. */
	level: LocationLevel;
	country: string;
	/** `null` for a level the result does not reach, or one its country does not have there. */
	region: string | null;
	city: string | null;
	district: string | null;
}

/**
 * Which part of a life an age falls in:
 * - `child`: 0 to 12.
 * - `teen`: 13 to 19, the ages that end in "-teen".
 * - `adult`: 20 to 64.
 * - `senior`: 65 and over, the age most pension and statistics systems count
 *   old age from.
 */
export type AgeGroup = 'child' | 'teen' | 'adult' | 'senior';

/**
 * Which groups an age may fall in. An array is a set to draw from, so
 * `['adult', 'senior']` is any age from 20 up, and `'all'` is every one of them.
 */
export type AgeGroupOption = AgeGroup | readonly AgeGroup[] | 'all';

/**
 * How likely each age is:
 * - `population`: along a curve shaped like a population, so a draw lands on a
 *   young adult far more often than on a child or somebody past seventy. The
 *   default.
 * - `uniform`: every age in the range as often as any other.
 */
export type AgeDistribution = 'population' | 'uniform';

/**
 * What `randAge` takes. An age is a number, so it has no language, no length and
 * no first character, and none of the options that ask about those.
 */
export interface RandAgeOptions extends Pick<
	RandCommonOptions,
	'count' | 'unique' | 'output' | 'random'
> {
	/** The youngest age to return, in whole years. Default `0`, minimum `0`. */
	minAge?: number;
	/**
	 * The oldest age to return, in whole years. Default `100`, or `RAND_AGE_MAX`
	 * when `minAge` is above 100; maximum `RAND_AGE_MAX`. A range the wrong way
	 * round keeps `maxAge`.
	 */
	maxAge?: number;
	/**
	 * Which part of a life the ages come from. Default `'all'`.
	 *
	 * It narrows the range rather than replacing it, so `group: 'adult'` with
	 * `maxAge: 30` is 20 to 30. A group with no age inside the range is not one
	 * the range can answer, and the range wins: the ages come from `minAge` to
	 * `maxAge` as though no group had been named.
	 */
	group?: AgeGroupOption;
	/** How likely each age is. Default `'population'`. */
	distribution?: AgeDistribution;
}

/** A generated age with the part of a life it falls in. */
export interface AgeDetail {
	/** The age, in whole years. */
	age: number;
	group: AgeGroup;
}

/**
 * A gender as a code, the same in every language:
 * - `male` and `female`, the same two codes `NameGender` uses.
 * - `nonbinary`: the third option a form offers beside them.
 * - `unknown`: not stated — what a record holds when nobody gave an answer.
 */
export type GenderCode = 'male' | 'female' | 'nonbinary' | 'unknown';

/**
 * What `randGender` takes. A gender is one of four labels, so it has no length,
 * no first character to ask for and nothing to invent.
 */
export interface RandGenderOptions extends Pick<
	RandCommonOptions,
	'count' | 'unique' | 'output' | 'random'
> {
	/** Language the labels are written in. `'all'` mixes every language. Default `'all'`. */
	language?: WordLanguageOption;
	/**
	 * Answer `unknown` now and then, about one draw in eleven — a record whose
	 * gender was never stated. Default `false`.
	 */
	includeUnknown?: boolean;
	/**
	 * Answer `nonbinary` now and then, about one draw in a hundred — rarely, the
	 * way it comes up in a population. Default `false`.
	 */
	includeNonbinary?: boolean;
}

/** A generated gender in its language, with the code behind it. */
export interface GenderDetail {
	/** The label a form in the language writes: `여성`, `Female`, `Weiblich`. */
	gender: string;
	/** The same gender as a code, which is the same whatever the language. */
	code: GenderCode;
	language: WordLanguage;
}

/**
 * What kind of organization a name is for:
 * - `company`: a business (`Westbrook Logistics, Inc.`, `(주)새솔테크`).
 * - `nonprofit`: an association, a foundation or a club (`새솔장학재단`,
 *   `Heimatverein Bergtal e.V.`).
 * - `school`: from a kindergarten to a university (`가람초등학교`, `Westbrook High School`).
 * - `government`: an office of the state or a town (`해솔구청`, `Ayuntamiento de Valdecastro`).
 * - `public`: an institution run for the public that is not an office — a
 *   library, a hospital, a transit authority (`새솔시립도서관`, `Stadtwerke Lindenhof`).
 */
export type OrganizationType = 'company' | 'nonprofit' | 'school' | 'government' | 'public';

/**
 * Which kinds a result may be. An array is a set to draw from, decided per
 * result, and `'all'` is every one of them.
 */
export type OrganizationTypeOption = OrganizationType | readonly OrganizationType[] | 'all';

/**
 * What a company does, which is the word its name carries for it: `tech` writes
 * `Technologies` or `테크`, `logistics` writes `Freight` or `물류`.
 */
export type OrganizationIndustry =
	| 'tech'
	| 'manufacturing'
	| 'food'
	| 'retail'
	| 'finance'
	| 'construction'
	| 'logistics'
	| 'media'
	| 'health'
	| 'energy';

/** `'all'` draws an industry per company, or a word that names none. */
export type OrganizationIndustryOption = OrganizationIndustry | 'all';

export interface RandOrganizationOptions extends RandCommonOptions {
	/** Language of the organizations. `'all'` mixes every language. Default `'all'`. */
	language?: WordLanguageOption;
	/**
	 * Which kinds of organization. Default `'all'`, which draws a kind per result,
	 * companies most often.
	 */
	type?: OrganizationTypeOption;
	/**
	 * What the companies do. Default `'all'`. An industry is a company's, so naming
	 * one with `type` left out asks for companies; with `type` naming other kinds
	 * too, it narrows the companies among them and leaves the rest alone.
	 */
	industry?: OrganizationIndustryOption;
	/**
	 * Write a company's legal form — `Inc.`, `(주)`, `GmbH`, `ООО`. Left out, it is
	 * decided per company. Only a company carries one: the other kinds never do.
	 */
	includeLegalForm?: boolean;
}

/** A generated organization with the pieces it was built from. */
export interface OrganizationDetail {
	/** What the value form returns: the whole name, legal form and all. */
	organization: string;
	/** The name without its legal form: `새솔테크` for `(주)새솔테크`. */
	name: string;
	/** The legal form, as the language writes it (`(주)`, `Inc.`, `ООО`), or `null` for none. */
	legalForm: string | null;
	type: OrganizationType;
	/**
	 * The industry the name says the company is in, or `null` when it says none —
	 * a word like `Group`, a company named by its stem alone, or any other kind of
	 * organization.
	 */
	industry: OrganizationIndustry | null;
	language: WordLanguage;
}

/**
 * One part of a date, largest first. Named as `unit`, it is the one part
 * `randDate` hands back, as a number: `minute` is `0` to `59`, `month` is `1` to
 * `12`.
 */
export type DateUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

/**
 * One end of the range a date is drawn from:
 * - a string in ISO 8601 form, from `'2024'` down to
 *   `'2024-03-15T14:07:32.481+09:00'`. It is UTC unless it carries an offset, and
 *   it names a span rather than an instant: `'2024-03'` is all of March, so as
 *   `maxDate` it reaches the last millisecond of the month.
 * - a `Date`, which is the instant it holds.
 * - a number, the milliseconds since `1970-01-01T00:00:00.000Z`.
 */
export type DateInput = string | Date | number;

/**
 * What `randDate` takes. A date is written by `format` rather than in a
 * language, and the range bounds it in place of a length, so none of the options
 * that ask about those are here.
 */
export interface RandDateOptions extends Pick<
	RandCommonOptions,
	'count' | 'unique' | 'output' | 'random'
> {
	/**
	 * The earliest date to return. Default `'1900-01-01'`, or the first day of the
	 * year 1 when `maxDate` is earlier than that. Held inside the years 1 to 9999.
	 */
	minDate?: DateInput;
	/**
	 * The latest date to return. Default the end of `'2099-12-31'`, or the end of
	 * the year 9999 when `minDate` is later than that. A range the wrong way round
	 * keeps `maxDate`.
	 */
	maxDate?: DateInput;
	/**
	 * Return one part of each date, as a number, instead of the date written out.
	 * The part is read off a drawn date, so it keeps to the range: `'day'` is `31`
	 * less often than `1`, the way a calendar has it.
	 */
	unit?: DateUnit;
	/**
	 * How the date is written, at `utcOffset`. `YYYY`, `YY`, `MMMM`, `MMM`, `MM`,
	 * `M`, `DD`, `D`, `dddd`, `ddd`, `HH`, `H`, `hh`, `h`, `mm`, `m`, `ss`, `s`,
	 * `SSS`, `A`, `a`, `Z` and `ZZ` are replaced, text inside `[` `]` is written as
	 * it is, and so is everything else. Default `'YYYY-MM-DDTHH:mm:ss.SSSZ'`,
	 * which is ISO 8601: `2024-03-15T14:07:32.481Z`, or `…+09:00` at an offset.
	 */
	format?: string;
	/**
	 * The offset from UTC the dates are written at: `'+09:00'`, `'-05:30'`, `'Z'`,
	 * or a number of minutes east of UTC (`540`). Every part of a date is read at
	 * it, a string bound with no offset of its own is read at it, and `Z` in a
	 * format writes it. Default UTC. An offset rather than a zone's name: a zone
	 * changes its offset with the date, and the Dart package has no table of the
	 * rules to read one from.
	 */
	utcOffset?: string | number;
	/**
	 * The language `MMMM`, `MMM`, `dddd`, `ddd`, `A` and `a` write their words in:
	 * `March` or `3월`, `Friday` or `金曜日`, `PM` or `오후`. Default `'en'`. A format
	 * is written in one language, so the names keep to one rather than mixing
	 * nine into it; `'all'` picks a language per date.
	 */
	language?: WordLanguageOption;
}

/** A generated date with every part it was built from. All of them are UTC. */
export interface DateDetail {
	/** The date as `format` writes it — what the value form returns when no `unit` is named. */
	date: string;
	/** Milliseconds since `1970-01-01T00:00:00.000Z`, negative before it. */
	timestamp: number;
	year: number;
	/** `1` to `12`. */
	month: number;
	/** `1` to `31`. */
	day: number;
	/** `0` to `23`. */
	hour: number;
	/** `0` to `59`. */
	minute: number;
	/** `0` to `59`. */
	second: number;
	/** `0` to `999`. */
	millisecond: number;
	/** The day of the week, `1` for Monday to `7` for Sunday, the way ISO 8601 counts it. */
	weekday: number;
	/** The language the names in `date` are written in. */
	language: WordLanguage;
}

/**
 * A country `randPhone` writes numbers for, by its ISO 3166-1 alpha-2 code: one
 * for each language the word pools cover — the United States for English, Korea
 * for Korean, and so on.
 */
export type PhoneCountry = 'US' | 'KR' | 'JP' | 'CN' | 'VN' | 'ES' | 'IT' | 'DE' | 'RU';

/** `'all'` mixes every country. */
export type PhoneCountryOption = PhoneCountry | 'all';

/**
 * What a number is for:
 * - `mobile`: a mobile phone, from the blocks the country gives its operators.
 * - `landline`: a fixed line, behind the area code of a real city.
 *
 * The United States and its neighbours write both the same way, so there the two
 * are drawn from the same area codes.
 */
export type PhoneType = 'mobile' | 'landline';

/** `'all'` draws a mobile number or a landline per result. */
export type PhoneTypeOption = PhoneType | 'all';

/**
 * What `randPhone` takes. A number is written by its country rather than in a
 * language, so it has no `language`, no length and nothing to invent.
 */
export interface RandPhoneOptions extends Pick<
	RandCommonOptions,
	'count' | 'unique' | 'output' | 'random'
> {
	/** Which country's numbers. `'all'` mixes every one. Default `'all'`. */
	country?: PhoneCountryOption;
	/** Mobile numbers, landlines, or either. Default `'mobile'`. */
	type?: PhoneTypeOption;
	/**
	 * Write the number the way it is dialled from abroad: `+82 10-2345-6789` rather
	 * than `010-2345-6789`. The trunk prefix the country dials at home is dropped.
	 * Default `false`.
	 */
	includeCountryCode?: boolean;
	/**
	 * What goes between the groups of digits, in place of the country's own way of
	 * writing them. `''` writes the digits alone, which with `includeCountryCode`
	 * is E.164: `+821023456789`. Left out, each country writes its own:
	 * `010-2345-6789`, `(212) 846-0147`, `8 (912) 345-67-89`.
	 */
	separator?: string;
	/**
	 * Keep to the numbers a country sets aside for films, books and examples,
	 * which are never given to a subscriber: `555-0100` to `555-0199` in the
	 * United States, the drama numbers of the Bundesnetzagentur in Germany. The
	 * other seven countries reserve none, so a call naming one of them returns no
	 * numbers at all rather than real ones, and `'all'` narrows to the two that
	 * do. Default `false`.
	 */
	fictional?: boolean;
}

/** A generated phone number with the pieces it was built from. */
export interface PhoneDetail {
	/** What the value form returns, written the way the options asked for. */
	phone: string;
	/** The same number in E.164, the one form every system accepts: `+821023456789`. */
	e164: string;
	country: PhoneCountry;
	/** The country calling code, without the `+`: `'82'`. */
	callingCode: string;
	type: PhoneType;
}

/**
 * Which kind of machine a system value belongs to:
 * - `desktop`: a PC, a laptop included — what runs Windows, macOS or Linux.
 * - `mobile`: a phone or a tablet — what runs Android, iOS or iPadOS.
 */
export type SystemPlatform = 'desktop' | 'mobile';

/** `'all'` draws from both. */
export type SystemPlatformOption = SystemPlatform | 'all';

/**
 * What `randOs` takes. An operating system is a real release with a real name,
 * so it has no language, no length and nothing to invent.
 */
export interface RandOsOptions extends Pick<
	RandCommonOptions,
	'count' | 'unique' | 'output' | 'random'
> {
	/** Desktop systems, mobile ones, or both. Default `'all'`. */
	platform?: SystemPlatformOption;
	/**
	 * The earliest year a release may have come out in. With `includeBuild`, the
	 * year the build or point release came out in. Default none.
	 */
	minYear?: number;
	/**
	 * The latest year a release may have come out in — `2015` is what was out by
	 * the end of 2015. With `includeBuild`, the year the build or point release
	 * came out in. A range the wrong way round keeps `maxYear`. Default none.
	 */
	maxYear?: number;
	/**
	 * Write the version after the name: `Windows 11` rather than `Windows`. Left
	 * off, the build and the edition go with it, because neither means anything
	 * without the version they belong to. Default `true`.
	 */
	includeVersion?: boolean;
	/**
	 * Write the build or the point release where the release has them: `Windows 11
	 * 23H2 (Build 22631)`, `macOS Sonoma 14.5`, `Android 14 (API 34)`. A release
	 * with none is written at its version. Default `false`.
	 */
	includeBuild?: boolean;
	/**
	 * Write an edition where the release has them: `Windows 11 Pro`, `Ubuntu
	 * Server 24.04 LTS`, `Fedora Workstation 40`. A release with none — macOS,
	 * Android, iOS — is written without one. Default `false`.
	 */
	includeEdition?: boolean;
}

/** A generated operating system with the pieces it was written from. */
export interface OsDetail {
	/** The system as the value form returns it: `Windows 11 Pro 23H2 (Build 22631)`. */
	os: string;
	/** The name without a version: `Windows`, `macOS`, `Mac OS X`, `Ubuntu`. */
	name: string;
	/** The release's version: `11`, `14`, `22.04`, `XP`. `null` with `includeVersion: false`. */
	version: string | null;
	/** The build or point release written, as it is written: `23H2 (Build 22631)`, `14.5`. */
	build: string | null;
	/** The edition written: `Pro`, `Server`. */
	edition: string | null;
	platform: SystemPlatform;
	/** The year the release came out, or the build when one is written. */
	year: number;
}

/**
 * What kind of device a model is:
 * - `phone`: a smartphone, and the handful of phones before them that carried a
 *   model name a sample is likely to want (`BlackBerry Bold 9000`).
 * - `tablet`: a tablet, a detachable two-in-one such as the Surface Pro included.
 * - `laptop`: a laptop. A desktop PC is left out on purpose: it is mostly built
 *   from parts and has no model name of its own.
 */
export type DeviceType = 'phone' | 'tablet' | 'laptop';

/**
 * Which kinds of device to draw. An array is a set to draw from, so `['phone',
 * 'tablet']` is any mobile device, and `'all'` is every one of them.
 */
export type DeviceTypeOption = DeviceType | readonly DeviceType[] | 'all';

/**
 * What `randDevice` takes. A device is a real model with a real name, so it has
 * no language, no length and nothing to invent.
 */
export interface RandDeviceOptions extends Pick<
	RandCommonOptions,
	'count' | 'unique' | 'output' | 'random'
> {
	/** Which kinds of device. Default `'all'`. */
	type?: DeviceTypeOption;
	/** The earliest year a device may have been released in. Default none. */
	minYear?: number;
	/**
	 * The latest year a device may have been released in — `2015` is what was out
	 * by the end of 2015. A range the wrong way round keeps `maxYear`. Default none.
	 */
	maxYear?: number;
	/**
	 * Write the maker in front of the model: `Apple iPhone 15` rather than `iPhone
	 * 15`. A model whose name already opens on its maker's (`Xiaomi 14`, `OnePlus
	 * 12`) is written the same either way. Default `true`.
	 */
	includeVendor?: boolean;
}

/** A generated device with the pieces it was written from. */
export interface DeviceDetail {
	/** The device as the value form returns it: `Samsung Galaxy S24 Ultra`. */
	device: string;
	/** Who makes it: `Samsung`. */
	vendor: string;
	/** The model's own name: `Galaxy S24 Ultra`. */
	model: string;
	type: DeviceType;
	/** The year the device was released. */
	year: number;
}

/**
 * A unit memory is written in. Memory counts in powers of two, so a gigabyte
 * here is 1024 megabytes — the way an operating system reports it.
 */
export type RamUnit = 'MB' | 'GB';

/**
 * `'auto'` writes each size in the largest unit it is a whole number of:
 * `16 GB`, but `512 MB`.
 */
export type RamUnitOption = RamUnit | 'auto';

/**
 * What `randRam` takes. Memory is a size, so it has no language, no length and
 * no first character to ask for.
 */
export interface RandRamOptions extends Pick<
	RandCommonOptions,
	'count' | 'unique' | 'output' | 'random'
> {
	/**
	 * The unit the sizes are written in. A named unit keeps to the sizes that are a
	 * whole number of it, so `'GB'` never writes the 512 MB a phone once had as
	 * `0.5 GB`. Default `'auto'`.
	 */
	unit?: RamUnitOption;
	/**
	 * Write the unit after the number: `16 GB` rather than `16`. Left off with
	 * `unit: 'auto'`, every size is written in gigabytes, because a bare `512` and
	 * a bare `16` would otherwise be in two different units. Default `true`.
	 */
	includeUnit?: boolean;
	/**
	 * The smallest size to return, in `unit` — in gigabytes when `unit` is
	 * `'auto'`. Default none.
	 */
	minSize?: number;
	/**
	 * The largest size to return, in `unit` — in gigabytes when `unit` is
	 * `'auto'`. A range the wrong way round keeps `maxSize`, and a range no real
	 * size is inside returns nothing. Default none.
	 */
	maxSize?: number;
}

/** A generated amount of memory, in the unit it was written in and in bytes. */
export interface RamDetail {
	/** The size as the value form returns it: `16 GB`. */
	ram: string;
	/** The number written: `16`. */
	value: number;
	unit: RamUnit;
	/** The same size in bytes, counted in powers of two: `17179869184`. */
	bytes: number;
}
