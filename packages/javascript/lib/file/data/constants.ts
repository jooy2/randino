// The category's public constants, apart from the catalog they describe: a
// catalog is built by a call at the top of its module, which a bundler has to
// keep, so a constant beside it brought the whole catalog along.

import type { FileCategory, MimeTopLevel } from '../../_types/global.js';

export const FILE_CATEGORIES: readonly FileCategory[] = [
	'document',
	'spreadsheet',
	'presentation',
	'image',
	'audio',
	'video',
	'archive',
	'code',
	'data',
	'executable',
	'font',
	'ebook',
	'disk',
	'model'
];

/** The top-level media types the catalog's MIME types come under. */
export const MIME_TOP_LEVELS: readonly MimeTopLevel[] = [
	'application',
	'audio',
	'font',
	'image',
	'model',
	'text',
	'video'
];
