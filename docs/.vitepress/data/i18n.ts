/**
 * The handful of strings the docs' own components render.
 *
 * Page content is localised by living in `docs/ko` or `docs/en`. This file is
 * only for the chrome that is drawn in Vue rather than in Markdown — today that
 * is the package switch above the sidebar and the note a page shows when it has
 * nothing to say for the selected package.
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
	languageLabel: { ko: '패키지', en: 'Package' },
	languageHint: {
		ko: '이 선택은 사이트 전체의 코드 예제에 적용됩니다.',
		en: 'The choice applies to every code sample on the site.'
	}
} satisfies Record<string, Record<Locale, string>>;

export type StringKey = keyof typeof strings;

export function t(locale: Locale, key: StringKey): string {
	return strings[key][locale];
}
