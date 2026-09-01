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

export interface RandomNameOptions {
	/** Language of the generated names. `'all'` mixes every language. Default `'all'`. */
	language?: NameLanguageOption;
	/** Gender the given name is drawn from. Default `'all'`. */
	gender?: NameGenderOption;
	/** How many names to return. Default `1`, maximum `10000`. */
	count?: number;
	/**
	 * `0` draws names people actually carry, `100` invents new ones, and values in
	 * between mix the two. Default `0`.
	 */
	style?: number;
	/** Minimum length of the native form, in characters. Defaults to the language's own range. */
	minLength?: number;
	/** Maximum length of the native form, in characters. Defaults to the language's own range. */
	maxLength?: number;
	/** Include a surname. Default `true`. */
	includeSurname?: boolean;
	/** Include a middle name, for languages that use one. Default `false`. */
	includeMiddleName?: boolean;
	/** Script of the returned strings. Default `'native'`. */
	script?: NameScript;
	/** Keep only names whose native form starts with this character. */
	startsWith?: string;
	/**
	 * Never return the same name twice. May return fewer than `count` names when
	 * the pool runs out of combinations. Default `false`.
	 */
	unique?: boolean;
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
 * A language the nickname generator can build nicknames in. Fewer than
 * `NameLanguage`: a nickname joins a modifier to a noun, which only reads
 * naturally in languages that ask for no grammatical agreement.
 */
export type NicknameLanguage = 'en' | 'ko' | 'ja' | 'zh';

/** `'all'` mixes every supported language. */
export type NicknameLanguageOption = NicknameLanguage | 'all';

/**
 * What a nickname is about — animals (`사자`), everyday things (`물병`), nature
 * and its phenomena (`노을`), plants (`민들레`), stones and metals (`흑요석`),
 * ideas from the humanities and social world (`철학`), creatures out of myth
 * (`구미호`), the trades and roles people hold (`대장장이`), music (`교향곡`),
 * places (`광장`), food (`떡볶이`), sports (`양궁`), things that carry you
 * (`열기구`), or things you buy (`이어폰`). Person names are never used.
 */
export type NicknameTheme =
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
	| 'product';

/** `'all'` draws from every theme. */
export type NicknameThemeOption = NicknameTheme | 'all';

export interface RandomNicknameOptions {
	/** Language of the generated nicknames. `'all'` mixes every language. Default `'all'`. */
	language?: NicknameLanguageOption;
	/** What the nickname should be about. Default `'all'`. */
	theme?: NicknameThemeOption;
	/** How many nicknames to return. Default `1`, maximum `10000`. */
	count?: number;
	/**
	 * `0` builds nicknames out of real words, `100` invents words that only read
	 * like the language, and values in between mix the two. Default `0`.
	 */
	style?: number;
	/**
	 * Minimum length of the nickname, in characters, not counting the unique
	 * suffix. Defaults to the language's own range.
	 */
	minLength?: number;
	/** Maximum length of the nickname, in characters, not counting the unique suffix. */
	maxLength?: number;
	/** Decorate the noun with a modifier (`멋진사자` rather than `사자`). Default `true`. */
	includeModifier?: boolean;
	/**
	 * Placed between the words a nickname is built from (`'멋진 사자'`,
	 * `'misty-owl'`), and counted toward `minLength` / `maxLength`. Defaults to the
	 * way the language itself joins them, which is to run them together
	 * (`멋진사자`, `MistyOwl`).
	 */
	wordSeparator?: string;
	/**
	 * Build every nickname around this word instead of a random one, adding only
	 * the decoration — `'고양이'` gives `멋진고양이`, `고양이꼬리`, `파란고양이발바닥`.
	 */
	baseWord?: string;
	/**
	 * Append a random suffix so that two people asking at the same time do not end
	 * up with the same nickname (`멋진사자_nVtRC`). Default `false`.
	 */
	uniqueSuffix?: boolean;
	/** Characters in the unique suffix. Default `5`, maximum `32`. */
	uniqueSuffixLength?: number;
	/** Placed between the nickname and its unique suffix. Default `'_'`. */
	uniqueSuffixSeparator?: string;
	/** Characters the unique suffix is drawn from. Defaults to alphanumerics without `0O1lI`. */
	uniqueSuffixCharset?: string;
	/** Keep only nicknames whose first character is this one. */
	startsWith?: string;
	/**
	 * Never return the same nickname twice. May return fewer than `count`
	 * nicknames once the pools run out of combinations. Default `false`.
	 */
	unique?: boolean;
}

/** A generated nickname with the pieces it was built from. */
export interface NicknameDetail {
	/** The finished nickname, unique suffix included. */
	nickname: string;
	/** The words the nickname is made of, in order, without the unique suffix. */
	words: string[];
	/** The unique suffix, separator included. Empty when `uniqueSuffix` is off. */
	suffix: string;
	language: NicknameLanguage;
	/**
	 * Theme the nickname's base word belongs to, or `null` when that word is not
	 * one the generator knows — an invented one, or a `baseWord` of your own.
	 */
	theme: NicknameTheme | null;
}
