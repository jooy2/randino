import { resolveOption } from '../../_internal/generate.js';
import type { NameLanguage, NameLanguageOption } from '../../_types/global.js';
import type { NameSpec } from './types.js';

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

/**
 * What each language's names are like, apart from the names themselves: the
 * order and the joiner, whether there is a middle name, how a name is romanized,
 * the measured span of each part, and whether romanizing changes any name.
 *
 * Kept apart from the pools so that `nameLengthRange`, `nameSupportsMiddleName`
 * and `nameSupportsRoman` bundle without them. Each language's dataset spreads
 * its own entry, so nothing here is written twice; `romanizes` is the one field
 * the pools could answer, and `test/name.test.ts` checks it against them.
 */
export const NAME_SPECS: Record<NameLanguage, NameSpec> = {
	en: {
		order: 'given-first',
		joiner: ' ',
		hasMiddle: true,
		roman: 'fold',
		lengthSpec: { given: [3, 10], last: [3, 10], middle: [3, 10] },
		romanizes: false
	},
	ko: {
		order: 'family-first',
		joiner: '',
		hasMiddle: false,
		roman: 'hangul',
		lengthSpec: { given: [1, 2], last: [1, 1], middle: [0, 0] },
		romanizes: true
	},
	ja: {
		order: 'family-first',
		joiner: '',
		hasMiddle: false,
		roman: 'token',
		lengthSpec: { given: [2, 3], last: [1, 3], middle: [0, 0] },
		romanizes: true
	},
	zh: {
		order: 'family-first',
		joiner: '',
		hasMiddle: false,
		roman: 'token',
		lengthSpec: { given: [1, 2], last: [1, 1], middle: [0, 0] },
		romanizes: true
	},
	it: {
		order: 'given-first',
		joiner: ' ',
		hasMiddle: true,
		roman: 'fold',
		lengthSpec: { given: [3, 10], last: [4, 10], middle: [3, 10] },
		romanizes: true
	},
	de: {
		order: 'given-first',
		joiner: ' ',
		hasMiddle: true,
		roman: 'fold',
		lengthSpec: { given: [3, 10], last: [4, 10], middle: [3, 10] },
		romanizes: true
	},
	ru: {
		order: 'given-first',
		joiner: ' ',
		hasMiddle: true,
		roman: 'translit',
		lengthSpec: { given: [3, 11], last: [4, 11], middle: [5, 14] },
		romanizes: true
	},
	es: {
		order: 'given-first',
		joiner: ' ',
		hasMiddle: true,
		roman: 'fold',
		lengthSpec: { given: [3, 10], last: [3, 9], middle: [3, 10] },
		romanizes: true
	},
	vi: {
		order: 'family-first',
		joiner: ' ',
		hasMiddle: true,
		roman: 'fold',
		lengthSpec: { given: [1, 6], last: [2, 6], middle: [2, 6] },
		romanizes: true
	}
};

// Every value `language` accepts, and what an unknown one falls back to. The
// type rules one out and a JavaScript caller can still pass it; answering with
// `NAME_SPECS['xx'].lengthSpec` names neither the option nor the value.
const NAME_LANGUAGE_OPTIONS: readonly NameLanguageOption[] = [...NAME_LANGUAGES, 'all'];

/** The caller's `language`, or `'all'` for one this package does not know. */
export function resolveNameLanguage(language: unknown): NameLanguageOption {
	return resolveOption(language, NAME_LANGUAGE_OPTIONS, 'all');
}
