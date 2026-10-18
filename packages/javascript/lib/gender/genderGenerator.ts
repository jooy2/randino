// The gender generator: one of two codes, or of four with both options on, and
// the label a form in the language writes for it, or for `nonbinary` with
// `nonbinaryIdentity` on, the identity a person names themselves by.

import { collectFrom, keptOutcomes, resolveRandom } from '../_internal/generate.js';
import type { Outcome } from '../_internal/generate.js';
import { shares, withRandom } from '../_internal/utils.js';
import type {
	GenderCode,
	GenderDetail,
	NonbinaryIdentity,
	RandGenderOptions,
	WordLanguage
} from '../_types/global.js';
import { WORD_LANGUAGES, resolveWordLanguage } from '../word/data/index.js';
import {
	GENDER_CODES,
	GENDER_LABELS,
	GENDER_WEIGHTS,
	NONBINARY_IDENTITIES,
	NONBINARY_LABELS,
	NONBINARY_WEIGHTS
} from './data/index.js';

/** One result a call may land on: a code, the language it is written in, and its identity. */
type Drawn = { code: GenderCode; language: WordLanguage; identity: NonbinaryIdentity | null };

// The labels each set of options allows, kept so a call does not work them out again.
const kept = /*#__PURE__*/ new Map<string, readonly Outcome<Drawn>[]>();

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

	// The code by its weight, the language evenly, and for `nonbinary` with the
	// option on, the identity by its own weight.
	const outcomes = keptOutcomes(kept, `${languages}|${codes}|${identity}`, () => {
		const identityShares = shares(NONBINARY_IDENTITIES, (each) => NONBINARY_WEIGHTS[each]);

		return shares(codes, (each) => GENDER_WEIGHTS[each]).flatMap((share, index) => {
			const code = codes[index];
			const forms: { identity: NonbinaryIdentity | null; share: number }[] =
				code === 'nonbinary' && identity
					? NONBINARY_IDENTITIES.map((each, at) => ({ identity: each, share: identityShares[at] }))
					: [{ identity: null, share: 1 }];

			return languages.flatMap((language): Outcome<Drawn>[] =>
				forms.map((each) => ({
					entry: { code, language, identity: each.identity },
					weight: (share * each.share) / languages.length
				}))
			);
		});
	});
	const label = ({ code, language, identity: named }: Drawn) =>
		named === null ? GENDER_LABELS[language][code] : NONBINARY_LABELS[language][named];

	return withRandom(resolveRandom(options.random), () =>
		collectFrom({ count: options.count, unique: options.unique }, outcomes, label, (drawn) => ({
			gender: label(drawn),
			code: drawn.code,
			language: drawn.language,
			identity: drawn.identity
		}))
	);
}
