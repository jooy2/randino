// The gender generator: one of two codes, or of four with both options on, and
// the label a form in the language writes for it, or for `nonbinary` with
// `nonbinaryIdentity` on, the identity a person names themselves by.

import { collect, resolveRandom } from '../_internal/generate.js';
import { pick, pickWeighted, withRandom } from '../_internal/utils.js';
import type { GenderCode, GenderDetail, RandGenderOptions } from '../_types/global.js';
import { WORD_LANGUAGES, resolveWordLanguage } from '../word/data/index.js';
import {
	GENDER_CODES,
	GENDER_LABELS,
	GENDER_WEIGHTS,
	NONBINARY_IDENTITIES,
	NONBINARY_LABELS,
	NONBINARY_WEIGHTS
} from './data/index.js';

/** The codes a call may answer with: the two that are always on, and whichever of the others it asked for. */
function codesFor(options: RandGenderOptions): readonly GenderCode[] {
	return GENDER_CODES.filter(
		(code) =>
			(code !== 'unknown' || options.includeUnknown === true) &&
			(code !== 'nonbinary' || options.includeNonbinary === true)
	);
}

export function generateGenderDetails(options: RandGenderOptions = {}): GenderDetail[] {
	const language = resolveWordLanguage(options.language);
	const languages = language === 'all' ? WORD_LANGUAGES : [language];
	const codes = codesFor(options);
	const identity = options.nonbinaryIdentity === true;

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: options.count, unique: options.unique },
			() => {
				const code = pickWeighted(codes, (each) => GENDER_WEIGHTS[each]);
				const drawn = pick(languages);
				// Drawn after the language and only for `nonbinary`, so a call without
				// the option makes the same draws it always made.
				const named =
					code === 'nonbinary' && identity
						? pickWeighted(NONBINARY_IDENTITIES, (each) => NONBINARY_WEIGHTS[each])
						: null;

				return {
					gender: named === null ? GENDER_LABELS[drawn][code] : NONBINARY_LABELS[drawn][named],
					code,
					language: drawn,
					identity: named
				};
			},
			(detail) => detail.gender
		)
	);
}
