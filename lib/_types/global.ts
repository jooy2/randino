export type AnyValueObject = { [key: string]: any };

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
