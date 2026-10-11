import type { WordLanguage } from '../../../_types/global.js';
import type { WordGender, WordModifierData } from '../types.js';
import { DE_GENDER } from '../nouns/de.js';
import { ES_GENDER } from '../nouns/es.js';
import { IT_GENDER } from '../nouns/it.js';
import { RU_GENDER } from '../nouns/ru.js';
import { DE_MODIFIERS } from './de.js';
import { EN_MODIFIERS } from './en.js';
import { ES_MODIFIERS } from './es.js';
import { IT_MODIFIERS } from './it.js';
import { JA_MODIFIERS } from './ja.js';
import { KO_MODIFIERS } from './ko.js';
import { RU_MODIFIERS } from './ru.js';
import { VI_MODIFIERS } from './vi.js';
import { ZH_MODIFIERS } from './zh.js';

// Every language's modifiers, apart from its nouns, for `randModifier`.
export const MODIFIER_DATA: Record<WordLanguage, WordModifierData> = {
	en: EN_MODIFIERS,
	ko: KO_MODIFIERS,
	ja: JA_MODIFIERS,
	zh: ZH_MODIFIERS,
	vi: VI_MODIFIERS,
	es: ES_MODIFIERS,
	it: IT_MODIFIERS,
	de: DE_MODIFIERS,
	ru: RU_MODIFIERS
};

// The gender of every noun of the languages whose modifiers agree with one: the
// one thing a modifier needs of the nouns, and the reason those four languages'
// nouns come along where the other five's stay behind.
export const NOUN_GENDERS: Partial<Record<WordLanguage, Record<string, WordGender>>> = {
	es: ES_GENDER,
	it: IT_GENDER,
	de: DE_GENDER,
	ru: RU_GENDER
};
