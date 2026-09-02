// Line breaking, shared by the three emitters.
//
// Pools and comments are the two things a code formatter will not lay out for
// us: prettier, `dart format` and `ruff format` all leave the inside of a string
// literal alone, and none of them re-wraps a comment. Everything else about the
// generated files is left to those formatters.

// East Asian characters take two columns in a fixed-width font, and the pools
// are wrapped to what they look like rather than to how many characters they
// are — which is why the Korean pools break at around forty words and the
// English ones at around twelve.
const WIDE =
	/[ᄀ-ᅟ⺀-〾ぁ-㏿㐀-䶿一-鿿ꀀ-꓏가-힣豈-﫿︰-﹯＀-｠￠-￦]/;

/** How wide a string looks, in columns. */
export function width(text) {
	let total = 0;

	for (const character of text) total += WIDE.test(character) ? 2 : 1;

	return total;
}

/** Greedy word wrap to a column budget. */
export function wrap(text, columns) {
	const lines = [];
	let line = '';

	for (const word of text.split(/\s+/).filter(Boolean)) {
		if (line === '') line = word;
		else if (width(line) + 1 + width(word) <= columns) line += ` ${word}`;
		else {
			lines.push(line);
			line = word;
		}
	}

	if (line !== '') lines.push(line);

	return lines;
}

// The pools were laid out by hand at roughly this width, and every package
// copied the same line breaks — so wrapping the content rather than the source
// line keeps all three identical whatever each language indents by.
export const POOL_COLUMNS = 80;

/** A pool's lines, ready to be indented and dropped into a string literal. */
export const poolLines = (source) => wrap(source, POOL_COLUMNS);

// Comments are wrapped to their own width for the same reason pools are: every
// package carries the same sentence, and wrapping the text rather than the
// source line keeps the three copies breaking in the same places.
const COMMENT_COLUMNS = 78;

/** A comment's lines, each already carrying its indent and marker. */
export function comment(text, { marker, indent }) {
	return text
		.split('\n')
		.flatMap((paragraph) => wrap(paragraph, COMMENT_COLUMNS))
		.map((line) => `${indent}${marker} ${line}`.trimEnd());
}

/** `startsWith` reads as `starts_with` in the package that spells it that way. */
export const snake = (text) =>
	text.replace(/`([a-z][A-Za-z0-9]*)`/g, (match, identifier) =>
		/[A-Z]/.test(identifier) ? `\`${identifier.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`)}\`` : match
	);

/**
 * The line every generated file opens with. The check in
 * `tools/codegen/index.mjs` is what enforces it, but somebody reading the file
 * should not have to know the check exists.
 */
export const banner = (source, marker) => [
	`${marker} Generated from \`data/${source}\` by \`tools/codegen\`.`,
	`${marker} Edit that file and re-run the generator; edits here are overwritten.`
];
