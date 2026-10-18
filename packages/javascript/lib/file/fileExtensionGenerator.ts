// The file extension generator: an extension files are really saved with, the
// common ones most often.

import { collectFrom, keptOutcomes, resolveMany, resolveRandom } from '../_internal/generate.js';
import type { Outcome } from '../_internal/generate.js';
import { withRandom } from '../_internal/utils.js';
import type { FileExtensionDetail, RandFileExtensionOptions } from '../_types/global.js';
import { FILE_CATEGORIES, FILE_EXTENSIONS } from './data/index.js';

// The extensions each set of categories leaves, kept so a call does not filter the table again.
const kept = /*#__PURE__*/ new Map<string, readonly Outcome<(typeof FILE_EXTENSIONS)[number]>[]>();

export function generateFileExtensionDetails(
	options: RandFileExtensionOptions = {}
): FileExtensionDetail[] {
	const categories = resolveMany(options.category, FILE_CATEGORIES, FILE_CATEGORIES);
	const dot = options.includeDot === false ? '' : '.';
	const outcomes = keptOutcomes(kept, String(categories), () =>
		FILE_EXTENSIONS.filter((entry) => categories.includes(entry.category)).map((entry) => ({
			entry,
			weight: entry.weight
		}))
	);

	return withRandom(resolveRandom(options.random), () =>
		collectFrom(
			{ count: options.count, unique: options.unique },
			outcomes,
			(entry) => dot + entry.name,
			(entry) => ({
				extension: dot + entry.name,
				name: entry.name,
				category: entry.category,
				mimeType: entry.mimeType
			})
		)
	);
}
