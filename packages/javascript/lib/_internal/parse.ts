// Helpers that keep the datasets readable: pools are written as whitespace-
// separated strings inside a template literal instead of one array entry per
// line, which keeps a 120-name pool to a handful of lines.

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
