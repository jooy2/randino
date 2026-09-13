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

/** One division an outline names, and where it sits. */
export interface OutlineEntry {
	/**
	 * The division's name and the name of every division it sits inside, largest
	 * first, one per level down to its own. `null` for a level its branch skips.
	 */
	readonly path: readonly (string | null)[];
	/** The level the division itself is, as an index into the dataset's levels. */
	readonly depth: number;
	/** The shallowest level among the divisions directly inside it, or `null` for none. */
	readonly below: number | null;
}

/**
 * Split an outline of divisions, `levels` deep. A line `# name` opens a division
 * at the first level and `## name` one at the second; a line with no marker is a
 * pool of divisions at the last level, inside the division opened last. `_`
 * stands for a space, the way it does in `words`.
 *
 * A pool straight after a `#` line skips the levels between: 세종특별자치시 has no
 * 시·군·구, so its 읍·면·동 follow its own line.
 */
export function outline(source: string, levels: number): OutlineEntry[] {
	type Open = { path: (string | null)[]; depth: number; below: number | null };

	const entries: Open[] = [];
	// The division opened last at each level, down to the deepest one still open.
	const open: Open[] = [];

	const add = (name: string, depth: number, parent: Open | undefined) => {
		const path = parent ? [...parent.path] : [];

		while (path.length < depth) {
			path.push(null);
		}

		path.push(name.replace(/_/g, ' '));

		const entry: Open = { path, depth, below: null };

		if (parent) {
			parent.below = parent.below === null ? depth : Math.min(parent.below, depth);
		}

		entries.push(entry);

		return entry;
	};

	for (const line of source.split('\n')) {
		const text = line.trim();

		if (!text) {
			continue;
		}

		const marker = /^(#+) (\S+)$/.exec(text);

		if (marker) {
			const depth = marker[1].length - 1;

			open.length = depth;
			open.push(add(marker[2], depth, open[depth - 1]));
			continue;
		}

		for (const name of text.split(/\s+/)) {
			add(name, levels - 1, open[open.length - 1]);
		}
	}

	return entries;
}
