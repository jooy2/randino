// The MIME type generator: a type files are really served as, drawn by how
// common its most common extension is.

import { collect, resolveMany, resolveRandom } from '../_internal/generate.js';
import { pickWeighted, withRandom } from '../_internal/utils.js';
import type { MimeTypeDetail, RandMimeTypeOptions } from '../_types/global.js';
import { MIME_TOP_LEVELS, mimeTypeEntries } from './data/index.js';

export function generateMimeTypeDetails(options: RandMimeTypeOptions = {}): MimeTypeDetail[] {
	const types = resolveMany(options.type, MIME_TOP_LEVELS, MIME_TOP_LEVELS);
	// Worked out once per call rather than per draw.
	const candidates = mimeTypeEntries().filter((entry) => types.includes(entry.type));

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: options.count, unique: options.unique },
			() => {
				const entry = pickWeighted(candidates, (each) => each.weight);

				return {
					mimeType: entry.mimeType,
					type: entry.type,
					subtype: entry.subtype,
					extensions: [...entry.extensions]
				};
			},
			(detail) => detail.mimeType
		)
	);
}
