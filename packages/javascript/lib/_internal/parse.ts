// Helpers that keep the datasets readable: pools are written as whitespace-
// separated strings inside a template literal instead of one array entry per
// line, which keeps a 120-name pool to a handful of lines.

import type { PredicateForm, PredicateTense } from '../sentence/data/types.js';
import type { WordGender, WordPool } from '../word/data/types.js';

/**
 * Split a whitespace-separated pool. `_` stands for a space inside a single
 * entry, so multi-word names survive the split (`De_Luca` -> `De Luca`).
 */
export function words(source: string): readonly string[] {
	return source
		.trim()
		.split(/\s+/)
		.map((word) => word.replace(/_/g, ' '));
}

/**
 * Split a `theme -> \`gato:m luna:f\`` map into the pools and the gender lookup
 * the two of them share. One pass over one source, so a language that inflects
 * still writes each noun exactly once.
 */
export function taggedNouns<T extends string>(
	source: Record<T, string>
): { pools: Record<T, WordPool>; gender: Record<string, WordGender> } {
	const pools = {} as Record<T, WordPool>;
	const gender: Record<string, WordGender> = {};

	for (const theme of Object.keys(source) as T[]) {
		pools[theme] = words(source[theme]).map((entry) => {
			const at = entry.lastIndexOf(':');
			const word = entry.slice(0, at);

			gender[word] = entry.slice(at + 1) as WordGender;

			return word;
		});
	}

	return { pools, gender };
}

/**
 * Split a whitespace-separated pool of `native:roman` pairs, for scripts whose
 * characters carry their own reading (Japanese kanji, Chinese hanzi).
 */
export function tokens(source: string): readonly { n: string; r: string }[] {
	return words(source).map((pair) => {
		const [n, r] = pair.split(':');
		return { n, r };
	});
}

/**
 * Split a whitespace-separated pool of `native:weight` pairs into a lookup, for
 * pools whose entries are not equally likely (surname frequency). Entries left
 * out of the source keep whatever default the caller falls back to.
 */
export function weights(source: string): Record<string, number> {
	const map: Record<string, number> = {};

	for (const { n, r } of tokens(source)) {
		map[n] = Number(r);
	}

	return map;
}

/** Build a native -> romanization lookup from `native:roman` pairs. */
export function romanMap(source: string): Record<string, string> {
	const map: Record<string, string> = {};

	for (const { n, r } of tokens(source)) {
		map[n] = r;
	}

	return map;
}

/**
 * Every form of a tense from one pool of stems and one ending per form, for a
 * language whose endings are the same whatever the stem: a Korean past stem
 * closes on `ㅆ`, so `달렸` takes `다`, `니`, `구나`, `어요` and `습니다` exactly
 * the way `걸었` does. An ending may list alternatives with `|` between them, and
 * each stem gets every one of them, so the pools stay index-aligned with the
 * present-tense `words` the stems were written for.
 */
export function conjugate(
	stems: string,
	endings: { statement: string } & Partial<Record<PredicateForm, string>>
): PredicateTense {
	const bases = words(stems);
	const attach = (ending: string): readonly string[] =>
		bases.map((stem) =>
			ending
				.split('|')
				.map((each) => stem + each)
				.join('|')
		);
	const forms: Partial<Record<PredicateForm, readonly string[]>> = {};

	for (const key of Object.keys(endings) as (keyof typeof endings)[]) {
		if (key !== 'statement') {
			forms[key] = attach(endings[key]!);
		}
	}

	return { words: attach(endings.statement), forms };
}
