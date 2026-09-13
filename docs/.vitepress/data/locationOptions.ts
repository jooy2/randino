/**
 * The options `randLocation` and its four level functions take, as data.
 *
 * Five pages document the same table, in two locales, with three packages' types
 * in every cell — the same trade `wordOptions.ts` makes for `randWord`, drawn the
 * same two ways: `theme/components/LocationOptions.vue` for the site, and
 * `locationOptionsTable` in `markdown.ts` for `llms-full.txt`.
 */

import type { StringKey } from './i18n';
import type { OptionCell, OptionVariants } from './wordOptions';

export interface LocationOptionRow {
	name: OptionCell;
	type: OptionVariants;
	/** What the option falls back to when it is left out. */
	fallback: OptionCell;
	/** One sentence, in `i18n.ts` so that both locales have it. */
	about: StringKey;
	/** Packages the row applies to at all, space-separated, for `data-lang`. */
	langs?: string;
	/** Only `randLocation` takes this one; the four level functions answer it. */
	levelOnly?: boolean;
}

/** `randCountry` takes any word language: every country has a name in all nine. */
const COUNTRY_LANGUAGE: LocationOptionRow = {
	name: 'language',
	type: { js: 'WordLanguageOption', dart: 'WordLanguage?', py: 'WordLanguageOption' },
	fallback: { js: "'all'", dart: 'null', py: '"all"' },
	about: 'optionCountryLanguage'
};

export const LOCATION_OPTIONS: readonly LocationOptionRow[] = [
	{
		name: 'language',
		type: { js: 'LocationLanguageOption', dart: 'LocationLanguage?', py: 'LocationLanguageOption' },
		fallback: { js: "'all'", dart: 'null', py: '"all"' },
		about: 'optionLocationLanguage'
	},
	{
		name: 'level',
		type: { js: 'LocationLevel', dart: 'LocationLevel', py: 'LocationLevel' },
		fallback: { js: "'district'", dart: 'LocationLevel.district', py: '"district"' },
		about: 'optionLevel',
		levelOnly: true
	},
	{
		name: 'count',
		type: { js: 'number', dart: 'int', py: 'int' },
		fallback: '1',
		about: 'optionLocationCount'
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
		about: 'optionLocationMaxLength'
	},
	{
		name: { js: 'startsWith', dart: 'startsWith', py: 'starts_with' },
		type: { js: 'string', dart: 'String?', py: 'str' },
		fallback: { js: '—', dart: 'null', py: '""' },
		about: 'optionLocationStartsWith'
	},
	{
		name: 'unique',
		type: { js: 'boolean', dart: 'bool', py: 'bool' },
		fallback: { js: 'false', dart: 'false', py: 'False' },
		about: 'optionLocationUnique'
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
		about: 'optionLocationOutput',
		langs: 'js py'
	}
];

/**
 * The rows a page shows: every one, minus `level` where the function answers it,
 * and with `randCountry`'s wider `language` on its page.
 */
export function locationOptionRows(level: boolean, country = false): readonly LocationOptionRow[] {
	const rows = level ? LOCATION_OPTIONS : LOCATION_OPTIONS.filter((row) => !row.levelOnly);

	return country
		? rows.map((row) =>
				row.about === 'optionLocationLanguage'
					? COUNTRY_LANGUAGE
					: row.about === 'optionLocationOutput'
						? { ...row, about: 'optionCountryOutput' }
						: row
			)
		: rows;
}
