/**
 * The handful of strings the docs' own components render.
 *
 * Page content is localised by living in `docs/ko` or `docs/en`. This file is
 * only for the chrome that is drawn in Vue rather than in Markdown — today that
 * is the language switch above the sidebar: its label, the line inside it that
 * says how far the choice reaches, and the word its menu is opened by.
 */

export type Locale = 'ko' | 'en';

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Which language to render, taken from the page's own `lang`.
 *
 * Deliberately not derived from VitePress's `localeIndex`: that is `root` for
 * whichever locale is currently the default, so reading it would silently mean
 * "Korean" or "English" depending on a setting in `config.ts`. The BCP-47 tag on
 * the page says what the page actually is.
 */
export function localeOf(lang: string | undefined): Locale {
	return lang?.startsWith('ko') ? 'ko' : DEFAULT_LOCALE;
}

const strings = {
	/*
	 * "Languages" rather than "Packages", which is what this said while the switch
	 * was three stacked options. The control offers JavaScript, Dart and Python —
	 * the languages randino ships for — and the registry each one is published to
	 * is a different question, answered by the navbar's Packages menu.
	 */
	languageLabel: { ko: '언어', en: 'Languages' },
	languageHint: {
		ko: '이 선택은 사이트 전체의 코드 예제에 적용됩니다.',
		en: 'The choice applies to every code sample on the site.'
	},
	/** On the button, for a reader who reaches it without seeing the label. */
	languageSelect: { ko: '언어 선택', en: 'Select a language' }
} satisfies Record<string, Record<Locale, string>>;

export type StringKey = keyof typeof strings;

export function t(locale: Locale, key: StringKey): string {
	return strings[key][locale];
}
