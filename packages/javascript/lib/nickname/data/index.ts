import type { NicknameLanguage, NicknameTheme } from '../../_types/global.js';
import { EN } from './en.js';
import { JA } from './ja.js';
import { KO } from './ko.js';
import type { NicknameLanguageData } from './types.js';
import { ZH } from './zh.js';

// Languages the nickname generator knows about. Fewer than the name generator:
// a nickname joins a modifier to a noun, which only works without grammatical
// agreement — see CLAUDE.md before adding one.
export const NICKNAME_LANGUAGES: readonly NicknameLanguage[] = ['en', 'ko', 'ja', 'zh'];

// What a nickname can be about. Person names are deliberately absent.
export const NICKNAME_THEMES: readonly NicknameTheme[] = [
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
	'product'
];

export const NICKNAME_DATA: Record<NicknameLanguage, NicknameLanguageData> = {
	en: EN,
	ko: KO,
	ja: JA,
	zh: ZH
};
