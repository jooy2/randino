import { resolveMany, resolveOption } from '../../_internal/generate.js';
import type {
	OrganizationIndustry,
	OrganizationIndustryOption,
	OrganizationType,
	WordLanguage
} from '../../_types/global.js';
import { DE } from './de.js';
import { EN } from './en.js';
import { ES } from './es.js';
import { IT } from './it.js';
import { JA } from './ja.js';
import { KO } from './ko.js';
import { RU } from './ru.js';
import type { OrganizationLanguageData } from './types.js';
import { VI } from './vi.js';
import { ZH } from './zh.js';

// The kinds of organization, a business first and the institutions after it.
export const ORGANIZATION_TYPES: readonly OrganizationType[] = [
	'company',
	'nonprofit',
	'school',
	'government',
	'public'
];

// What a company can do, which is the word its name carries for it.
export const ORGANIZATION_INDUSTRIES: readonly OrganizationIndustry[] = [
	'tech',
	'manufacturing',
	'food',
	'retail',
	'finance',
	'construction',
	'logistics',
	'media',
	'health',
	'energy'
];

/**
 * How often each kind comes up when more than one is in play, out of a hundred.
 * A business is the most common organization a sample needs, and a government
 * office the least.
 */
export const ORGANIZATION_TYPE_WEIGHTS: Record<OrganizationType, number> = {
	company: 40,
	nonprofit: 15,
	school: 20,
	government: 10,
	public: 15
};

/**
 * How often a company with no industry asked for is its stem and a legal form
 * and nothing else (`Westbrook, Inc.`, `주식회사 새솔`), as a percentage. The
 * shape always takes a legal form, because a stem on its own is not recognizably
 * a company.
 */
export const ORGANIZATION_BARE_CHANCE = 20;

/**
 * How often a company with no industry asked for carries a word that names none
 * (`Group`, `홀딩스`, `集团`) rather than one that does, as a percentage.
 */
export const ORGANIZATION_GENERIC_CHANCE = 25;

/** How often a company carries its legal form when the caller left it to chance, as a percentage. */
export const ORGANIZATION_LEGAL_FORM_CHANCE = 50;

export const ORGANIZATION_DATA: Record<WordLanguage, OrganizationLanguageData> = {
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

/** The caller's `type` as the kinds it names, or every kind for `'all'` and anything unknown. */
export function resolveOrganizationTypes(type: unknown): readonly OrganizationType[] {
	return resolveMany(type, ORGANIZATION_TYPES, ORGANIZATION_TYPES);
}

const INDUSTRY_OPTIONS: readonly OrganizationIndustryOption[] = [...ORGANIZATION_INDUSTRIES, 'all'];

/** The caller's `industry`, or `'all'` for one this package does not know. */
export function resolveIndustry(industry: unknown): OrganizationIndustryOption {
	return resolveOption(industry, INDUSTRY_OPTIONS, 'all');
}
