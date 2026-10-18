// What the fictional generators share about their options: the languages a call
// writes in, and the prefix as each script spells it.

import {
	languagesFitting,
	languagesWriting,
	lengthBounds,
	resolveLength,
	resolveMany,
	resolvePrefix
} from '../_internal/generate.js';
import { kanaLike } from '../_internal/script.js';
import type { RandCommonOptions, WordLanguage } from '../_types/global.js';
import { RAND_LENGTH_MAX } from '../constants.js';
import { WORD_LANGUAGES } from '../word/data/index.js';
import { KANA, SCRIPT_OF } from './spelling.js';

/**
 * The languages a call asked for, in the order it asked for them: every word
 * language for `'all'`, for nothing, and for a list that names none of them.
 * A language named twice is written once.
 */
export function resolveFictionalLanguages(option: unknown): readonly WordLanguage[] {
	return [...new Set(resolveMany(option, WORD_LANGUAGES, WORD_LANGUAGES))];
}

/**
 * `startsWith` as a script spells it. Japanese writes a made-up name in
 * katakana, so a hiragana `あ` is read as the `ア` every name is spelled with.
 */
export function prefixIn(prefix: string, script: number): string {
	return script === KANA ? kanaLike(prefix, 'ア') : prefix;
}

/** What every fictional generator works out from the options before it draws. */
export type FictionalBase = {
	/** The languages a result may be written in. Empty when none can answer. */
	languages: readonly WordLanguage[];
	/** The languages every result is written in for the detail's `forms`. */
	forms: readonly WordLanguage[];
	prefix: string;
	/** The length range a result has to land in, or `null` for none. */
	bounds: readonly [number, number] | null;
};

/**
 * The languages, the prefix and the length range of a call. A language that
 * does not write the requested character is left out, and so is one whose own
 * range cannot meet the one asked for while another's can — `rangeOf` is that
 * language's range for this call.
 */
export function resolveBase(
	options: RandCommonOptions & { language?: unknown },
	rangeOf: (language: WordLanguage) => readonly [number, number]
): FictionalBase {
	const forms = resolveFictionalLanguages(options.language);
	const prefix = resolvePrefix(options.startsWith);
	const minLength = resolveLength(options.minLength);
	const maxLength = resolveLength(options.maxLength);
	const writing = languagesWriting('all', forms, prefix);

	return {
		languages: languagesFitting(writing, minLength, maxLength, rangeOf),
		forms,
		prefix,
		bounds:
			minLength === undefined && maxLength === undefined
				? null
				: lengthBounds(minLength, maxLength, 1, RAND_LENGTH_MAX)
	};
}

/** The script a language writes a fictional name in. */
export function scriptOf(language: WordLanguage): number {
	return SCRIPT_OF[language];
}
