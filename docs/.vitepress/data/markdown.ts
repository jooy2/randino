import { t } from './i18n';
import { isPhrase, isVariants, wordOptionRows, type OptionCell } from './wordOptions';

/**
 * The one transform two very different readers both need.
 *
 * `<Lang js="…" dart="…" py="…" />` puts every package's spelling of a phrase in
 * the document and lets CSS show one. That works in a browser and nowhere else:
 * a `<meta name="description">` and a `.txt` file are both plain text, and both
 * would otherwise get the phrase three times or — once the tags are stripped —
 * not at all, leaving a sentence like "falls back to when  or  is omitted".
 *
 * The JavaScript variant is the one kept, for the reason it is kept everywhere
 * else: the npm package is the reference implementation and the other two are
 * ports of it.
 */

/** `<Lang js="minLength" py="min_length" code />` → `` `minLength` ``. */
export function inlineLang(markdown: string): string {
	return markdown.replace(/<Lang\s+([^>]*?)\/>/g, (_, attrs: string) => {
		const js = attrs.match(/\bjs="([^"]*)"/)?.[1];

		if (js === undefined) {
			return '';
		}

		return /\bcode\b/.test(attrs) ? `\`${js}\`` : js;
	});
}

/**
 * `<WordOptions />` → the option table it draws, as Markdown.
 *
 * The component is the site's copy of that table and this is the text file's:
 * `llms-full.txt` has no Vue to render a component and no CSS to hide a
 * variant, so the row would otherwise arrive as the literal tag and the reader
 * would be told a page has options and not which ones. Both come off the same
 * rows in `data/wordOptions.ts`, in the JavaScript spelling for the reason
 * everything else in that file is.
 */
export function wordOptionsTable(theme: boolean): string {
	const cell = (value: OptionCell): string => {
		if (isPhrase(value)) {
			return `_${t('en', value.i18n)}_`;
		}

		const text = isVariants(value) ? value.js : value;

		return text ? `\`${text}\`` : '—';
	};

	const rows = wordOptionRows(theme)
		// A row no JavaScript spelling exists for is a row the npm package has not
		// got, which is the half this file keeps.
		.filter((row) => row.type.js)
		.map(
			(row) =>
				`| ${cell(row.name)} | ${cell(row.type)} | ${cell(row.fallback)} | ${t('en', row.about)} |`
		);

	return [
		`| ${t('en', 'optionName')} | ${t('en', 'optionType')} | ${t('en', 'optionDefault')} | ${t('en', 'optionAbout')} |`,
		'| --- | --- | --- | --- |',
		...rows
	].join('\n');
}
