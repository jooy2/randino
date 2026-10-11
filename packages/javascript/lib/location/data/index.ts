import type { LocationLanguage } from '../../_types/global.js';
import { EN } from './en.js';
import { KO } from './ko.js';
import type { LocationLanguageData } from './types.js';

// The public constants and the option readers live apart from the outlines, so
// that importing one of them, or `randRegion`, reaches none of the outlines.
export {
	LOCATION_LANGUAGES,
	LOCATION_LEVELS,
	resolveLevel,
	resolveLocationLanguage
} from './constants.js';

export const LOCATION_DATA: Record<LocationLanguage, LocationLanguageData> = {
	en: EN,
	ko: KO
};
