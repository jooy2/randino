import type { NameLanguage } from '../../_types/global.js';
import { DE } from './de.js';
import { EN } from './en.js';
import { ES } from './es.js';
import { IT } from './it.js';
import { JA } from './ja.js';
import { KO } from './ko.js';
import { RU } from './ru.js';
import { VI } from './vi.js';
import { ZH } from './zh.js';
import type { NameLanguageData } from './types.js';

// Every language the name generator knows about. `language: 'all'` draws from
// this list, so the order only matters for presentation.
export const NAME_LANGUAGES: readonly NameLanguage[] = [
	'en',
	'ko',
	'ja',
	'zh',
	'it',
	'de',
	'ru',
	'es',
	'vi'
];

export const NAME_DATA: Record<NameLanguage, NameLanguageData> = {
	en: EN,
	ko: KO,
	ja: JA,
	zh: ZH,
	it: IT,
	de: DE,
	ru: RU,
	es: ES,
	vi: VI
};
