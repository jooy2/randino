import type { FileExtensionDetail, RandFileExtensionOptions } from '../_types/global.js';
import { generateFileExtensionDetails } from './fileExtensionGenerator.js';

/**
 * Generate file extensions files are really saved with: `.pdf`, `.png`, `.mp4`.
 *
 * The extensions nearly everybody meets come up most often, and the ones only a
 * few programs write rarely. `category` keeps to one kind of file or several,
 * and `includeDot: false` writes the extension without its dot.
 *
 * @example
 * randFileExtension(); // ['.pdf']
 * randFileExtension({ category: 'image', count: 3 }); // ['.png', '.jpg', '.webp']
 * randFileExtension({ category: ['code', 'data'], includeDot: false, count: 2 }); // ['js', 'json']
 */
export function randFileExtension(
	options?: RandFileExtensionOptions & { output?: 'value' }
): string[];
/**
 * Generate file extensions along with what kind of file each one is.
 *
 * `output: 'detail'` returns a `FileExtensionDetail` per extension instead of a
 * string.
 *
 * @example
 * randFileExtension({ output: 'detail' });
 * // [{ extension: '.png', name: 'png', category: 'image' }]
 */
export function randFileExtension(
	options: RandFileExtensionOptions & { output: 'detail' }
): FileExtensionDetail[];
export function randFileExtension(
	options: RandFileExtensionOptions = {}
): string[] | FileExtensionDetail[] {
	const details = generateFileExtensionDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.extension);
}
