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
export const NICKNAME_THEMES: readonly NicknameTheme[] = ['animal', 'object', 'nature', 'concept'];

export const NICKNAME_DATA: Record<NicknameLanguage, NicknameLanguageData> = {
	en: EN,
	ko: KO,
	ja: JA,
	zh: ZH
};

// Bounds for `minLength` / `maxLength`, in characters of the nickname itself —
// the unique suffix is not counted.
export const NICKNAME_LENGTH_MIN = 1;
export const NICKNAME_LENGTH_MAX = 40;

export const NICKNAME_COUNT_MAX = 10000;

// Bounds for `uniqueSuffixLength`.
export const NICKNAME_SUFFIX_LENGTH_MAX = 32;

// Suffix characters, minus the pairs that are easy to misread (0/O, 1/l/I).
export const NICKNAME_SUFFIX_CHARSET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
