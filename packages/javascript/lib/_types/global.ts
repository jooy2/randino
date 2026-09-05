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
 * with it (`이자`), or the vocabulary of computing (`캐시`). Person names are
 * never used.
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
	| 'drink';

/** `'all'` draws from every theme. */
export type WordThemeOption = WordTheme | 'all';

export interface RandWordOptions extends RandCommonOptions {
	/** Language of the generated words. `'all'` mixes every language. Default `'all'`. */
	language?: WordLanguageOption;
	/** What the words should be about. Default `'all'`. */
	theme?: WordThemeOption;
}

/**
 * What the twenty-five themed generators take — `RandWordOptions` without the
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
 * - `time`: when (`새벽에`).
 * - `manner`: how (`조용히`).
 * - `quantity`: how many of something (`사과 12 개`), which is a noun phrase with a
 *   number and the counter its kind takes.
 * - `money`: how much (`100,000 원`, `12,000 dollars`).
 *
 * A sentence is headed by a `verb` or by a `state`, never by both.
 */
export type SentenceSlot =
	'subject' | 'verb' | 'object' | 'state' | 'place' | 'time' | 'manner' | 'quantity' | 'money';

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
 * speaking is as often asking as telling.
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
	 * What the sentences are doing — saying something, asking it, exclaiming it, or
	 * trailing off. Default `'statement'`, and an array or `'all'` decides per
	 * sentence.
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
	 * A connective a sentence opens on is not a phrase and is not in here.
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
	language: WordLanguage;
	/**
	 * Theme the result's subject belongs to — the first sentence's, which is what
	 * every sentence after it stays about. `null` when that word is not one the
	 * generator knows, which happens when it was invented or was handed in through
	 * `include`.
	 */
	theme: WordTheme | null;
}
