/**
 * The options `randFictionalCountry`, `randFictionalRegion`, `randFictionalCity`
 * and `randFictionalDistrict` take, as data.
 *
 * Four pages document the same table, in two locales, with three packages' types
 * in every cell — the same trade `locationOptions.ts` makes, drawn the same two
 * ways: `theme/components/FictionalPlaceOptions.vue` for the site, and
 * `fictionalPlaceOptionsTable` in `markdown.ts` for `llms-full.txt`.
 */

import type { StringKey } from './i18n';
import type { OptionCell, OptionVariants } from './wordOptions';

export interface FictionalPlaceOptionRow {
	name: OptionCell;
	type: OptionVariants;
	/** What the option falls back to when it is left out. */
	fallback: OptionCell;
	/** One sentence, in `i18n.ts` so that both locales have it. */
	about: StringKey;
	/** Packages the row applies to at all, space-separated, for `data-lang`. */
	langs?: string;
}

export const FICTIONAL_PLACE_OPTIONS: readonly FictionalPlaceOptionRow[] = [
	{
		name: 'language',
		type: {
			js: 'FictionalLanguageOption',
			dart: 'WordLanguage?',
			py: 'FictionalLanguageOption'
		},
		fallback: { js: "'all'", dart: 'null', py: '"all"' },
		about: 'optionFictionalLanguage'
	},
	{
		name: { js: 'includeKind', dart: 'includeKind', py: 'include_kind' },
		type: { js: 'boolean', dart: 'bool?', py: 'bool | None' },
		fallback: { js: '—', dart: 'null', py: 'None' },
		about: 'optionIncludeKind'
	},
	{
		name: { js: 'kindStyle', dart: 'kindStyle', py: 'kind_style' },
		type: {
			js: 'FictionalKindStyle',
			dart: 'FictionalKindStyle?',
			py: 'FictionalKindStyle | None'
		},
		fallback: { js: '—', dart: 'null', py: 'None' },
		about: 'optionKindStyle'
	},
	{
		name: 'count',
		type: { js: 'number', dart: 'int', py: 'int' },
		fallback: '1',
		about: 'optionLocationCount'
	},
	{
		name: 'realism',
		type: { js: 'RandRealism', dart: 'RandRealism', py: 'RandRealism' },
		fallback: { js: "'real'", dart: 'RandRealism.real', py: '"real"' },
		about: 'optionFictionalRealism'
	},
	{
		name: { js: 'minLength', dart: 'minLength', py: 'min_length' },
		type: { js: 'number', dart: 'int?', py: 'int | None' },
		fallback: { i18n: 'optionNoBound' },
		about: 'optionLocationMinLength'
	},
	{
		name: { js: 'maxLength', dart: 'maxLength', py: 'max_length' },
		type: { js: 'number', dart: 'int?', py: 'int | None' },
		fallback: { i18n: 'optionNoBound' },
		about: 'optionFictionalMaxLength'
	},
	{
		name: { js: 'startsWith', dart: 'startsWith', py: 'starts_with' },
		type: { js: 'string', dart: 'String?', py: 'str' },
		fallback: { js: '—', dart: 'null', py: '""' },
		about: 'optionFictionalStartsWith'
	},
	{
		name: 'unique',
		type: { js: 'boolean', dart: 'bool', py: 'bool' },
		fallback: { js: 'false', dart: 'false', py: 'False' },
		about: 'optionFictionalUnique'
	},
	{
		name: 'random',
		type: { js: '() => number', dart: 'Random?', py: 'Callable[[], float] | None' },
		fallback: { js: '—', dart: 'null', py: 'None' },
		about: 'optionRandom'
	},
	{
		// Dart has no `output`; the detail form is a `…Details` function there.
		name: 'output',
		type: { js: 'RandOutput', py: 'RandOutput' },
		fallback: { js: "'value'", py: '"value"' },
		about: 'optionFictionalOutput',
		langs: 'js py'
	}
];
