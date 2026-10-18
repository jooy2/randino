// The MIME type generator: a type files are really served as, drawn by how
// common its most common extension is.

import { collectFrom, keptOutcomes, resolveMany, resolveRandom } from '../_internal/generate.js';
import type { Outcome } from '../_internal/generate.js';
import { withRandom } from '../_internal/utils.js';
import type { MimeTypeDetail, RandMimeTypeOptions } from '../_types/global.js';
import { MIME_TOP_LEVELS, mimeTypeEntries } from './data/index.js';

// The types each set of top levels leaves, kept so a call does not work them out again.
const kept = /*#__PURE__*/ new Map<
	string,
	readonly Outcome<ReturnType<typeof mimeTypeEntries>[number]>[]
>();

export function generateMimeTypeDetails(options: RandMimeTypeOptions = {}): MimeTypeDetail[] {
	const types = resolveMany(options.type, MIME_TOP_LEVELS, MIME_TOP_LEVELS);
	const outcomes = keptOutcomes(kept, String(types), () =>
		mimeTypeEntries()
			.filter((entry) => types.includes(entry.type))
			.map((entry) => ({ entry, weight: entry.weight }))
	);

	return withRandom(resolveRandom(options.random), () =>
		collectFrom(
			{ count: options.count, unique: options.unique },
			outcomes,
			(entry) => entry.mimeType,
			(entry) => ({
				mimeType: entry.mimeType,
				type: entry.type,
				subtype: entry.subtype,
				extensions: [...entry.extensions]
			})
		)
	);
}
