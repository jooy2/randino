import { resolveOption } from '../../_internal/generate.js';
import type { NameLanguage, NameLanguageOption } from '../../_types/global.js';
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

// Every value `language` accepts, and what an unknown one falls back to. The
// type rules one out and a JavaScript caller can still pass it; answering with
// `NAME_DATA['xx'].lengthSpec` names neither the option nor the value.
const NAME_LANGUAGE_OPTIONS: readonly NameLanguageOption[] = [...NAME_LANGUAGES, 'all'];

/** The caller's `language`, or `'all'` for one this package does not know. */
export function resolveNameLanguage(language: unknown): NameLanguageOption {
	return resolveOption(language, NAME_LANGUAGE_OPTIONS, 'all');
}
