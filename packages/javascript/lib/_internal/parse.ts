// Helpers that keep the datasets readable: pools are written as whitespace-
// separated strings inside a template literal instead of one array entry per
// line, which keeps a 120-name pool to a handful of lines.

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
