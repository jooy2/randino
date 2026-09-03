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
	'tech'
];

export const WORD_DATA: Record<WordLanguage, WordLanguageData> = {
	en: EN,
	ko: KO,
	ja: JA,
	zh: ZH
};
