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
