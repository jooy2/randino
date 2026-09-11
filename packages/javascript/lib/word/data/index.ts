import { resolveOption } from '../../_internal/generate.js';
import type {
	WordLanguage,
	WordLanguageOption,
	WordTheme,
	WordThemeOption
} from '../../_types/global.js';
import { DE } from './de.js';
import { EN } from './en.js';
import { ES } from './es.js';
import { IT } from './it.js';
import { JA } from './ja.js';
import { KO } from './ko.js';
import type { WordLanguageData } from './types.js';
import { RU } from './ru.js';
import { VI } from './vi.js';
import { ZH } from './zh.js';

// Languages the word pools cover — the same nine the name generator knows. A
// modifier has to sit beside a noun in the form that language puts it in, which
// each of them says in its own `frames` and `agreement` rather than in a rule
// here: Vietnamese writes `mèo xanh`, German `blauer Wal`. See CLAUDE.md before
// adding one.
export const WORD_LANGUAGES: readonly WordLanguage[] = [
	'en',
	'ko',
	'ja',
	'zh',
	'vi',
	'es',
	'it',
	'de',
	'ru'
];

// What the words can be about. Person names are deliberately absent.
export const WORD_THEMES: readonly WordTheme[] = [
	'animal',
	'object',
	'nature',
	'plant',
	'gem',
	'concept',
	'myth',
	'job',
	'music',
	'place',
	'food',
	'sport',
	'vehicle',
	'product',
	'color',
	'finance',
	'tech',
	'weather',
	'space',
	'time',
	'emotion',
	'body',
	'clothing',
	'tool',
	'drink',
	'toy',
	'sound',
	'person',
	'furniture'
];

/**
 * Themes a nickname only reaches once `realism` loosens. Every one of them is a
 * word theme like any other, and `randWord` draws from them at any level; what
 * they are not is a slice of vocabulary you can put a modifier in front of and
 * still have something anybody would type — `멋진대출`, `BraveInvoice` and
 * `奔跑的服务器` read as a joke rather than a handle.
 *
 * So `randNickname` leaves them out of `theme: 'all'` at `realism: 'real'` and
 * puts them back at `'mixed'` and `'invented'`. An explicit theme is always
 * honoured: asking for `finance` and getting something else would be the option
 * not working.
 */
export const LOOSE_THEMES: readonly WordTheme[] = ['color', 'finance', 'tech'];

export const WORD_DATA: Record<WordLanguage, WordLanguageData> = {
	en: EN,
	ko: KO,
	ja: JA,
	zh: ZH,
	vi: VI,
	es: ES,
	it: IT,
	de: DE,
	ru: RU
};

// Every value `language` and `theme` accept, and what an unknown one falls back
// to. The types rule one out and a JavaScript caller can still pass it;
// answering with `WORD_DATA['xx'].nouns` names neither the option nor the value.
const WORD_LANGUAGE_OPTIONS: readonly WordLanguageOption[] = [...WORD_LANGUAGES, 'all'];
const WORD_THEME_OPTIONS: readonly WordThemeOption[] = [...WORD_THEMES, 'all'];

/** The caller's `language`, or `'all'` for one this package does not know. */
export function resolveWordLanguage(language: unknown): WordLanguageOption {
	return resolveOption(language, WORD_LANGUAGE_OPTIONS, 'all');
}

/** The caller's `theme`, or `'all'` for one this package does not know. */
export function resolveTheme(theme: unknown): WordThemeOption {
	return resolveOption(theme, WORD_THEME_OPTIONS, 'all');
}
