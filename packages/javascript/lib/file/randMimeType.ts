import type { MimeTypeDetail, RandMimeTypeOptions } from '../_types/global.js';
import { generateMimeTypeDetails } from './mimeTypeGenerator.js';

/**
 * Generate MIME types files are really served as: `application/pdf`,
 * `image/png`, `video/mp4`.
 *
 * They are the types `randFileExtension`'s extensions carry, once each, and a
 * type is as common as its most common extension. `type` keeps to the
 * top-level types named, the part in front of the slash.
 *
 * @example
 * randMimeType(); // ['application/pdf']
 * randMimeType({ type: 'image', count: 3 }); // ['image/png', 'image/jpeg', 'image/webp']
 * randMimeType({ type: ['audio', 'video'], count: 2 }); // ['audio/mpeg', 'video/mp4']
 */
export function randMimeType(options?: RandMimeTypeOptions & { output?: 'value' }): string[];
/**
 * Generate MIME types along with their parts and the extensions they are saved
 * with.
 *
 * `output: 'detail'` returns a `MimeTypeDetail` per type instead of a string.
 *
 * @example
 * randMimeType({ output: 'detail' });
 * // [{ mimeType: 'image/jpeg', type: 'image', subtype: 'jpeg', extensions: ['jpg', 'jpeg'] }]
 */
export function randMimeType(options: RandMimeTypeOptions & { output: 'detail' }): MimeTypeDetail[];
export function randMimeType(options: RandMimeTypeOptions = {}): string[] | MimeTypeDetail[] {
	options ??= {};

	const details = generateMimeTypeDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.mimeType);
}
