/**
 * The handful of strings the docs' own components render.
 *
 * Page content is localised by living in `docs/ko` or `docs/en`. This file is
 * only for the chrome that is drawn in Vue rather than in Markdown — today that
 * is the language switch above the sidebar, and the demo page's own controls.
 *
 * Option names are **not** in here on purpose. `includeMiddleName` is what the
 * reader will type, so the demo labels its controls with the identifier rather
 * than with a translated noun — the same rule the reference pages follow for
 * headings. What is left to translate is the chrome around them.
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
	languageSelect: { ko: '언어 선택', en: 'Select a language' },
	/* The demo page. Its controls are labelled with the option names themselves,
	   so these are only the parts that are not identifiers. */
	demoNames: { ko: '사람 이름', en: 'Person names' },
	demoNicknames: { ko: '닉네임', en: 'Nicknames' },
	demoWords: { ko: '단어', en: 'Words' },
	demoGenerate: { ko: '생성', en: 'Generate' },
	demoCopy: { ko: '복사', en: 'Copy' },
	demoCopied: { ko: '복사됨', en: 'Copied' },
	demoDetails: { ko: '상세 정보 보기', en: 'Show details' },
	demoDecorate: { ko: '장식 함수', en: 'Decorator' },
	demoDecorateNone: { ko: '없음', en: 'none' },
	demoCall: { ko: '이 결과를 만든 호출', en: 'The call behind this' },
	demoEmpty: {
		ko: '조건에 맞는 결과가 없습니다. 길이 범위나 startsWith를 넓혀 보세요.',
		en: 'Nothing came back. Widen the length range, or the startsWith filter.'
	},
	demoShort: {
		ko: '요청한 개수보다 적게 나왔습니다. unique를 켜면 조합이 바닥났을 때 그렇게 됩니다.',
		en: 'Fewer than asked for — that is what `unique` does once the pools run out.'
	},
	demoLive: {
		ko: '이 페이지는 npm에 배포된 버전이 아니라 이 저장소의 JavaScript 패키지를 그대로 실행합니다.',
		en: "This page runs the repository's own JavaScript package, not a published build."
	}
} satisfies Record<string, Record<Locale, string>>;

export type StringKey = keyof typeof strings;

export function t(locale: Locale, key: StringKey): string {
	return strings[key][locale];
}
