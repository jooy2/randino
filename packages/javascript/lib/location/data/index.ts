import { resolveOption } from '../../_internal/generate.js';
import type {
	LocationLanguage,
	LocationLanguageOption,
	LocationLevel
} from '../../_types/global.js';
import { EN } from './en.js';
import { KO } from './ko.js';
import type { LocationLanguageData } from './types.js';

// Languages the location generators cover, and so the countries: a language
// writes the places of its own. Only countries that publish their divisions free
// of conditions are here — no attribution to carry, no licence to pass on — which
// is why this is two languages where the word pools are nine. See CLAUDE.md
// before adding one.
export const LOCATION_LANGUAGES: readonly LocationLanguage[] = ['en', 'ko'];

// How far down a location can go, largest first.
export const LOCATION_LEVELS: readonly LocationLevel[] = ['country', 'region', 'city', 'district'];

export const LOCATION_DATA: Record<LocationLanguage, LocationLanguageData> = {
	en: EN,
	ko: KO
};

const LOCATION_LANGUAGE_OPTIONS: readonly LocationLanguageOption[] = [...LOCATION_LANGUAGES, 'all'];

/** The caller's `language`, or `'all'` for one the location generators do not know. */
export function resolveLocationLanguage(language: unknown): LocationLanguageOption {
	return resolveOption(language, LOCATION_LANGUAGE_OPTIONS, 'all');
}

/** The caller's `level`, or `'district'` — as far down as any location goes — for an unknown one. */
export function resolveLevel(level: unknown): LocationLevel {
	return resolveOption(level, LOCATION_LEVELS, 'district');
}
