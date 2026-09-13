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
	/** Inside the home page's picker, on whichever card is the current choice. */
	languageCurrent: { ko: '선택됨', en: 'Selected' },
	/* `WordOptions.vue` — the table `randWord` and its twenty-nine themed forms share.
	   The option names themselves are not here, by the rule above; what is left is
	   the column headings and one sentence per option. */
	optionName: { ko: '옵션', en: 'Option' },
	optionType: { ko: '타입', en: 'Type' },
	optionDefault: { ko: '기본값', en: 'Default' },
	optionAbout: { ko: '설명', en: 'Description' },
	optionFromPools: { ko: '단어 풀', en: 'pools' },
	optionLanguage: {
		ko: '생성할 단어의 언어. 생략하면 언어마다 하나씩 골라 모두 섞습니다.',
		en: 'Language of the generated words. Left out, it picks one per word and mixes them all.'
	},
	optionTheme: {
		ko: '단어의 주제. 테마마다 같은 함수가 하나씩 따로 있습니다.',
		en: 'What the words are about. Each theme also has a function of its own.'
	},
	optionCount: {
		ko: '돌려줄 단어 개수. 0 … 10000으로 제한됩니다.',
		en: 'How many words to return. Clamped to 0 … 10000.'
	},
	optionRealism: {
		ko: 'real은 풀에서 단어를 뽑고, invented는 그 언어처럼 읽히기만 하는 단어를 만들어냅니다. mixed는 단어마다 정합니다.',
		en: 'real draws from the pools, invented builds words that only read like the language, and mixed decides per word.'
	},
	optionVocabulary: {
		ko: 'basic은 누구나 매일 쓰는 단어만, common은 거기에 어른이 이따금 쓰는 단어까지, full은 풀에 있는 모든 단어를 씁니다.',
		en: 'basic draws the everyday words, common those and the ones an adult uses now and then, full every word the pools hold.'
	},
	optionMinLength: {
		ko: '최소 글자 수. 생략하면 단어 풀이 담고 있는 범위를 따릅니다.',
		en: 'Minimum length in characters. Left out, it follows what the pools hold.'
	},
	optionMaxLength: {
		ko: '최대 글자 수. 풀이 만족시킬 수 없으면 가장 가까운 단어로 답합니다.',
		en: 'Maximum length in characters. A range the pool cannot serve is answered with the closest word.'
	},
	optionStartsWith: {
		ko: '이 글자로 시작하는 단어만 남깁니다.',
		en: 'Keep only words whose first character is this one.'
	},
	optionUnique: {
		ko: '같은 단어를 두 번 돌려주지 않습니다. 풀이 바닥나면 요청보다 적게 돌아옵니다.',
		en: 'Never return the same word twice. Returns fewer than asked once a pool runs out.'
	},
	optionRandom: {
		ko: '무작위성을 어디서 가져올지. 기본값은 각 언어의 일반 난수 생성기입니다.',
		en: "Where the randomness comes from. Defaults to the platform's ordinary generator."
	},
	optionOutput: {
		ko: '문자열, 또는 단어마다 WordDetail 하나.',
		en: 'Strings, or one WordDetail per word.'
	},
	/* `LocationOptions.vue` — the table `randLocation` and its four level functions
	   share. The column headings and `optionRandom` are the ones above. */
	optionNoBound: { ko: '제한 없음', en: 'no bound' },
	optionLocationLanguage: {
		ko: '어느 언어로, 곧 어느 나라의 위치를 쓸지. 생략하면 결과마다 하나씩 골라 섞습니다.',
		en: 'Which language, and so which country, the places are from. Left out, it picks one per result and mixes them.'
	},
	optionCountryLanguage: {
		ko: '국가 이름을 쓸 언어. 9개 언어 모두 됩니다. 생략하면 결과마다 하나씩 골라 섞습니다.',
		en: 'Language the country names are written in, any of the nine. Left out, it picks one per result and mixes them.'
	},
	optionCountryOutput: {
		ko: '문자열, 또는 결과마다 CountryDetail 하나.',
		en: 'Strings, or one CountryDetail per result.'
	},
	optionLevel: {
		ko: '어느 단계까지 쓸지. 그 단계가 없는 나라는 가진 단계 중 가장 낮은 곳에서 멈춥니다.',
		en: 'How far down the location goes. A country without that level stops at the deepest one it has.'
	},
	optionLocationCount: {
		ko: '돌려줄 결과 개수. 0 … 10000으로 제한됩니다.',
		en: 'How many results to return. Clamped to 0 … 10000.'
	},
	optionLocationMinLength: {
		ko: '최소 글자 수. 결과 문자열 전체의 길이입니다.',
		en: 'Minimum length in characters, of the whole string returned.'
	},
	optionLocationMaxLength: {
		ko: '최대 글자 수. 맞는 곳이 없으면 가장 가까운 길이의 위치로 답합니다.',
		en: 'Maximum length in characters. A range nothing fits is answered with the closest length there is.'
	},
	optionLocationStartsWith: {
		ko: '이 글자로 시작하는 결과만 남깁니다.',
		en: 'Keep only results whose first character is this one.'
	},
	optionLocationUnique: {
		ko: '같은 결과를 두 번 돌려주지 않습니다. 목록이 바닥나면 요청보다 적게 돌아옵니다.',
		en: 'Never return the same result twice. Returns fewer than asked once the list runs out.'
	},
	optionLocationOutput: {
		ko: '문자열, 또는 결과마다 LocationDetail 하나.',
		en: 'Strings, or one LocationDetail per result.'
	},
	/* The demo page. Its controls are labelled with the option names themselves,
	   so these are only the parts that are not identifiers. */
	demoNames: { ko: '사람 이름', en: 'Person names' },
	demoNicknames: { ko: '닉네임', en: 'Nicknames' },
	demoWords: { ko: '단어', en: 'Words' },
	demoSentences: { ko: '문장', en: 'Sentences' },
	demoLocations: { ko: '위치', en: 'Locations' },
	demoFunction: { ko: '함수', en: 'Function' },
	demoIncludeHint: {
		ko: '반드시 넣을 단어 (공백으로 구분)',
		en: 'words to include, separated by spaces'
	},
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
	demoNoLevel: {
		ko: '고른 언어에는 이 단계가 없습니다. 미국 위치는 도시에서 멈추고, 읍·면·동은 한국어에만 있습니다.',
		en: 'The language picked has no such level. US locations stop at the city, and only Korean has districts.'
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
