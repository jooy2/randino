import { rows } from '../../_internal/parse.js';
import type { FileCategory } from '../../_types/global.js';

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

/** One extension the catalog holds, and how often it comes up. */
export interface FileExtensionEntry {
	/** The extension without its dot, in lower case: `png`. */
	name: string;
	category: FileCategory;
	/** How often it comes up beside the rest: `5` for the commonest, `1` for the rarest. */
	weight: number;
}

/**
 * Every extension the catalog holds, one row per category and weight:
 * `category | weight | extensions`.
 *
 * Each is an extension files are really saved with, in lower case, and each is
 * in one category only: `.ts` is TypeScript here and not a video stream, and
 * `.sql` is data. Two spellings of one format are both in where both are in use
 * (`.jpg` and `.jpeg`, `.tif` and `.tiff`, `.yaml` and `.yml`). The weights are
 * written by hand, from `5` for the extensions nearly everybody meets (`.pdf`,
 * `.png`, `.jpg`) to `1` for the ones only a few programs write.
 */
export const FILE_EXTENSIONS: readonly FileExtensionEntry[] = rows(`
	document | 5 | pdf docx txt
	document | 2 | doc rtf odt md
	document | 1 | tex pages wpd
	spreadsheet | 4 | xlsx csv
	spreadsheet | 2 | xls ods
	spreadsheet | 1 | numbers tsv
	presentation | 3 | pptx
	presentation | 1 | ppt odp key
	image | 5 | jpg png
	image | 3 | gif svg webp jpeg
	image | 2 | heic bmp tiff ico
	image | 1 | psd avif tif ai eps raw
	audio | 4 | mp3
	audio | 2 | wav m4a aac flac ogg
	audio | 1 | wma aiff opus mid
	video | 4 | mp4
	video | 2 | mov avi mkv webm
	video | 1 | wmv flv m4v 3gp mpeg
	archive | 4 | zip
	archive | 2 | rar 7z gz tar
	archive | 1 | bz2 xz tgz zst
	code | 3 | js html css py
	code | 2 | ts java c cpp php go rs rb swift kt sh cs
	code | 1 | h hpp scala lua pl r dart vue jsx tsx bat ps1
	data | 3 | json xml
	data | 2 | yaml yml sql db sqlite log
	data | 1 | toml ini cfg plist parquet
	executable | 3 | exe apk
	executable | 2 | msi dmg ipa deb rpm
	executable | 1 | jar bin appimage msix
	font | 2 | ttf otf woff2
	font | 1 | woff eot
	ebook | 2 | epub
	ebook | 1 | mobi azw3
	disk | 2 | iso
	disk | 1 | img vhd vmdk qcow2
	model | 1 | stl obj fbx glb gltf blend
`).flatMap(([category, weight, names]) =>
	names.split(/\s+/).map((name) => ({
		name,
		category: category as FileCategory,
		weight: Number(weight)
	}))
);
