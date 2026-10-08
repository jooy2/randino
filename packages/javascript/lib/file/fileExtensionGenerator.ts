// The file extension generator: an extension files are really saved with, the
// common ones most often.

import { collect, resolveMany, resolveRandom } from '../_internal/generate.js';
import { pickWeighted, withRandom } from '../_internal/utils.js';
import type { FileExtensionDetail, RandFileExtensionOptions } from '../_types/global.js';
import { FILE_CATEGORIES, FILE_EXTENSIONS } from './data/index.js';

export function generateFileExtensionDetails(
	options: RandFileExtensionOptions = {}
): FileExtensionDetail[] {
	const categories = resolveMany(options.category, FILE_CATEGORIES, FILE_CATEGORIES);
	const dot = options.includeDot === false ? '' : '.';
	// Worked out once per call rather than per draw.
	const candidates = FILE_EXTENSIONS.filter((entry) => categories.includes(entry.category));

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: options.count, unique: options.unique },
			() => {
				const entry = pickWeighted(candidates, (each) => each.weight);

				return { extension: dot + entry.name, name: entry.name, category: entry.category };
			},
			(detail) => detail.extension
		)
	);
}
