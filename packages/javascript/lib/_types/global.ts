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
 * and `randNickname` can work in. Fewer than `NameLanguage`: a modifier has to
 * sit beside a noun exactly as it is written in the dictionary, which only reads
 * naturally in a language that asks for no agreement between the two. Word order
 * is no longer the obstacle it was — Vietnamese puts its modifier after the noun
 * and says so in its own frames.
 */
export type WordLanguage = 'en' | 'ko' | 'ja' | 'zh' | 'vi' | 'es' | 'it' | 'de';

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

export interface RandNicknameOptions extends RandCommonOptions {
	/** Language of the generated nicknames. `'all'` mixes every language. Default `'all'`. */
	language?: WordLanguageOption;
	/** What the nickname should be about. Default `'all'`. */
	theme?: WordThemeOption;
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
	language: WordLanguage;
	/**
	 * Theme the nickname's base word belongs to, or `null` when that word is not
	 * one the generator knows, which happens when it was invented.
	 */
	theme: WordTheme | null;
}
