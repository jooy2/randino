// A YAML reader for the subset `data/` is written in, and a writer for the same
// subset.
//
// Not a general YAML implementation, and deliberately not a dependency: the
// datasets need scalars, integer pairs, block scalars and nesting, and nothing
// else. What a real parser would add here is a package the repository would
// have to install before it can generate its own source.
//
// The one thing it does that a general parser would not is keep the comments.
// A comment above a field explains why that pool holds what it holds, and every
// package's copy of the data carries it — so the generator has to be able to
// read it back out and write it into all three.

import { wrap } from './render.mjs';

// Comments are wrapped to the same width in `data/` as in the generated files.
const COMMENT_COLUMNS = 78;

/** One value, with whatever comment was written above it. */
class Node {
	constructor(value, comment) {
		this.value = value;
		this.comment = comment;
	}
}

const scalar = (raw) => {
	if (raw === 'true') return true;
	if (raw === 'false') return false;
	if (/^-?\d+$/.test(raw)) return Number(raw);
	if (/^'.*'$/.test(raw)) return raw.slice(1, -1).replace(/''/g, "'");
	if (/^\[.*\]$/.test(raw)) {
		const inner = raw.slice(1, -1).trim();
		return inner === '' ? [] : inner.split(',').map((entry) => scalar(entry.trim()));
	}

	return raw;
};

const indentOf = (line) => line.length - line.trimStart().length;

/**
 * Reads the subset into a Map of Node, plus the file's own leading comment —
 * the block at the top that is followed by a blank line.
 */
export function parse(source) {
	const lines = source.split('\n');
	let cursor = 0;

	// The file's own comment block, if one is set off by a blank line.
	let header = null;
	const opening = [];

	while (cursor < lines.length && lines[cursor].startsWith('#')) {
		opening.push(lines[cursor++].replace(/^#\s?/, ''));
	}

	if (opening.length && lines[cursor]?.trim() === '') {
		header = opening.join('\n');
		cursor++;
	} else {
		cursor = 0;
	}

	function block(indent) {
		const map = new Map();
		let comment = [];

		while (cursor < lines.length) {
			const line = lines[cursor];

			if (line.trim() === '') {
				cursor++;
				comment = [];
				continue;
			}

			// A comment dedented past this block belongs to the block above, which
			// has to see it: it is the note explaining the field that follows.
			if (indentOf(line) < indent) break;

			if (line.trimStart().startsWith('#')) {
				comment.push(line.trim().replace(/^#\s?/, ''));
				cursor++;
				continue;
			}

			const match = /^([^:]+):\s*(.*)$/.exec(line.trim());

			if (!match) throw new Error(`Line ${cursor + 1} is not a key: ${line}`);

			const [, key, rest] = match;
			cursor++;

			if (rest === '|') {
				const text = [];

				while (cursor < lines.length && (lines[cursor].trim() === '' || indentOf(lines[cursor]) > indent)) {
					if (lines[cursor].trim() !== '') text.push(lines[cursor].slice(indent + 2));
					cursor++;
				}

				map.set(key, new Node(text.join('\n'), comment.length ? comment.join('\n') : null));
			} else if (rest === '') {
				map.set(key, new Node(block(indent + 2), comment.length ? comment.join('\n') : null));
			} else {
				map.set(key, new Node(scalar(rest), comment.length ? comment.join('\n') : null));
			}

			comment = [];
		}

		return map;
	}

	return { header, body: block(0) };
}

const quote = (value) => {
	if (typeof value === 'boolean' || typeof value === 'number') return String(value);
	if (Array.isArray(value)) return `[${value.map(quote).join(', ')}]`;
	// A bare string that could be read back as something else gets quoted; so
	// does one that is empty or carries leading or trailing space.
	if (value === '' || value !== value.trim() || /^(true|false|-?\d+|\[)/.test(value) || value.includes(': ')) {
		return `'${value.replace(/'/g, "''")}'`;
	}

	return value;
};

/** Writes a Map of Node back out in the same subset. */
export function stringify({ header, body }) {
	const out = [];
	// Comments are re-wrapped on the way out, so a sentence edited in place does
	// not have to be re-broken by hand.
	const commented = (text, pad) => wrap(text, COMMENT_COLUMNS).map((line) => `${pad}# ${line}`);

	if (header) {
		out.push(...commented(header, ''), '');
	}

	function write(map, indent) {
		const pad = ' '.repeat(indent);
		let first = true;

		for (const [key, node] of map) {
			if (node.comment) {
				if (!first) out.push('');
				out.push(...commented(node.comment, pad));
			}

			if (node.value instanceof Map) {
				out.push(`${pad}${key}:`);
				write(node.value, indent + 2);
			} else if (typeof node.value === 'string' && node.value.includes('\n')) {
				out.push(`${pad}${key}: |`);
				for (const line of node.value.split('\n')) out.push(`${pad}  ${line}`);
			} else {
				out.push(`${pad}${key}: ${quote(node.value)}`);
			}

			first = false;
		}
	}

	write(body, 0);

	return `${out.join('\n')}\n`;
}

export { Node };
