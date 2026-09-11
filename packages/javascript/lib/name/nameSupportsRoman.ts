import type { NameLanguageOption } from '../_types/global.js';
import { NAME_DATA, NAME_LANGUAGES, resolveNameLanguage } from './data/index.js';
import type { NameLanguageData, NamePool } from './data/types.js';
import { fold } from './romanize.js';

const answers = new Map<string, boolean>();

/** Every pool a language writes a name out of, for the question below. */
function poolsOf(data: NameLanguageData): readonly (NamePool | undefined)[] {
	return [
		data.last,
		data.male,
		data.female,
		data.middleMale,
		data.middleFemale,
		data.givenMale,
		data.givenFemale
	];
}

/**
 * Whether the language writes a name that romanizes to something else.
 *
 * Read off the pools rather than off the language code. Hangul, Cyrillic and the
 * two scripts that carry their own reading always romanize to something else; a
 * Latin-script language only does when one of its names carries a mark that
 * folding takes off, and whether it does is a fact about the pools — Italian
 * writes five names in eight hundred that differ, and a Latin-script language
 * added tomorrow with no marks at all would differ in none.
 */
function differs(language: string): boolean {
	const cached = answers.get(language);

	if (cached !== undefined) {
		return cached;
	}

	const data = NAME_DATA[language as (typeof NAME_LANGUAGES)[number]];
	const folds = data.roman !== 'fold';
	const answer =
		folds ||
		poolsOf(data).some((pool) =>
			(pool ?? []).some((item) => {
				const native = typeof item === 'string' ? item : item.n;

				return fold(native) !== native;
			})
		);

	answers.set(language, answer);

	return answer;
}

/**
 * Whether `script: 'roman'` produces anything different from `script: 'native'`.
 * English names are already written in the Latin alphabet, so both scripts return
 * the same string.
 *
 * @example
 * nameSupportsRoman('ko'); // true
 * nameSupportsRoman('en'); // false
 */
export function nameSupportsRoman(language: NameLanguageOption = 'all'): boolean {
	const wanted = resolveNameLanguage(language);

	return wanted === 'all' ? NAME_LANGUAGES.some(differs) : differs(wanted);
}
