/**
 * The options `randWord` and its twenty-five themed forms take, as data.
 *
 * Fifteen pages document the same table, in two locales, with three packages'
 * types in every cell — so it is written once here and drawn from two places:
 * `theme/components/WordOptions.vue` for the site, and `wordOptionsTable` in
 * `markdown.ts` for `llms-full.txt`, which has no CSS to hide a variant with
 * and no Vue to render a component.
 *
 * Adding an option to the generator is one row here. Writing it out in Markdown
 * instead would be thirty edits, and the thirtieth is the one that gets missed.
 */

import type { StringKey } from './i18n';

/** A cell whose text differs per package. A package left out has none. */
export interface OptionVariants {
	js?: string;
	dart?: string;
	py?: string;
}

/**
 * One string when every package spells it the same, variants when they differ,
 * or a key when the cell is prose rather than code.
 */
export type OptionCell = string | OptionVariants | { i18n: StringKey };

export interface WordOptionRow {
	name: OptionCell;
	type: OptionVariants;
	/** What the option falls back to when it is left out. */
	fallback: OptionCell;
	/** One sentence, in `i18n.ts` so that both locales have it. */
	about: StringKey;
	/**
	 * Packages the row applies to at all, space-separated, for `data-lang`.
	 * Omitted means every one of them.
	 */
	langs?: string;
	/** Only `randWord` takes this one; the twenty-five answer it instead. */
	themeOnly?: boolean;
}

export function isVariants(cell: OptionCell): cell is OptionVariants {
	return typeof cell === 'object' && !('i18n' in cell);
}

export function isPhrase(cell: OptionCell): cell is { i18n: StringKey } {
	return typeof cell === 'object' && 'i18n' in cell;
}

export const WORD_OPTIONS: readonly WordOptionRow[] = [
	{
		name: 'language',
		type: { js: 'WordLanguageOption', dart: 'WordLanguage?', py: 'WordLanguageOption' },
		fallback: { js: "'all'", dart: 'null', py: '"all"' },
		about: 'optionLanguage'
	},
	{
		name: 'theme',
		type: { js: 'WordThemeOption', dart: 'WordTheme?', py: 'WordThemeOption' },
		fallback: { js: "'all'", dart: 'null', py: '"all"' },
		about: 'optionTheme',
		themeOnly: true
	},
	{
		name: 'count',
		type: { js: 'number', dart: 'int', py: 'int' },
		fallback: '1',
		about: 'optionCount'
	},
	{
		name: 'style',
		type: { js: 'number', dart: 'int', py: 'int' },
		fallback: '0',
		about: 'optionStyle'
	},
	{
		name: { js: 'minLength', dart: 'minLength', py: 'min_length' },
		type: { js: 'number', dart: 'int?', py: 'int | None' },
		fallback: { i18n: 'optionFromPools' },
		about: 'optionMinLength'
	},
	{
		name: { js: 'maxLength', dart: 'maxLength', py: 'max_length' },
		type: { js: 'number', dart: 'int?', py: 'int | None' },
		fallback: { i18n: 'optionFromPools' },
		about: 'optionMaxLength'
	},
	{
		name: { js: 'startsWith', dart: 'startsWith', py: 'starts_with' },
		type: { js: 'string', dart: 'String?', py: 'str' },
		fallback: { js: '—', dart: 'null', py: '""' },
		about: 'optionStartsWith'
	},
	{
		name: 'unique',
		type: { js: 'boolean', dart: 'bool', py: 'bool' },
		fallback: { js: 'false', dart: 'false', py: 'False' },
		about: 'optionUnique'
	},
	{
		// Dart has no `output` at all — the detail form is its own function there —
		// so the row is dropped for it rather than shown with two empty cells.
		// `randWordDetails` is named in the `::: lang dart` block on every page.
		name: 'output',
		type: { js: 'RandOutput', py: 'RandOutput' },
		fallback: { js: "'value'", py: '"value"' },
		about: 'optionOutput',
		langs: 'js py'
	}
];

/** The rows a page shows: every one, minus `theme` where the function answers it. */
export function wordOptionRows(theme: boolean): readonly WordOptionRow[] {
	return theme ? WORD_OPTIONS : WORD_OPTIONS.filter((row) => !row.themeOnly);
}
