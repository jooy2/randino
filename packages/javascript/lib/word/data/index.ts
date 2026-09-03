import type { WordLanguage, WordTheme } from '../../_types/global.js';
import { EN } from './en.js';
import { JA } from './ja.js';
import { KO } from './ko.js';
import type { WordLanguageData } from './types.js';
import { ZH } from './zh.js';

// Languages the word pools cover. Fewer than the name generator: a modifier has
// to sit in front of a noun exactly as it is written in the dictionary, which
// only works without grammatical agreement — see CLAUDE.md before adding one.
export const WORD_LANGUAGES: readonly WordLanguage[] = ['en', 'ko', 'ja', 'zh'];

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
	'drink'
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
	zh: ZH
};
