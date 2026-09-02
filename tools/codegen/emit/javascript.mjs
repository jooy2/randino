// Emits the npm package's data files.
//
// Layout beyond the string literals and the comments is left to prettier —
// `tools/codegen/index.mjs` runs it over what this writes.

import { banner, comment } from '../render.mjs';

const pad = (depth) => '\t'.repeat(depth);
const head = (source) => banner(source, '//');

/** A pool literal: one line where it fits, a template literal where it does not. */
function pool(value, helper, depth) {
	if (!value.includes('\n')) return `${helper}('${value}')`;

	const lines = value.split('\n').map((line) => `${pad(depth + 1)}${line}`);

	return `${helper}(\`\n${lines.join('\n')}\n${pad(depth)}\`)`;
}

const helperFor = (field, value) => {
	if (field === 'lastWeights') return 'weights';
	if (field === 'surnameRoman') return 'romanMap';

	return value.includes(':') ? 'tokens' : 'words';
};

const commented = (node, depth, out) => {
	if (node.comment) out.push(...comment(node.comment, { marker: '//', indent: pad(depth) }));
};

const SYLLABLE_CONSTANT = {
	western: 'WESTERN_SYLLABLES',
	italian: 'ITALIAN_SYLLABLES',
	spanish: 'SPANISH_SYLLABLES',
	german: 'GERMAN_SYLLABLES',
	russian: 'RUSSIAN_SYLLABLES',
	vietnamese: 'VIETNAMESE_SYLLABLES'
};

const imports = (helpers, extra) => {
	const lines = [];

	if (helpers.size) lines.push(`import { ${[...helpers].sort().join(', ')} } from '../../_internal/parse.js';`);
	lines.push(...extra);

	return lines;
};

export function word(code, { body }) {
	const out = [];

	out.push(`export const ${code.toUpperCase()}: WordLanguageData = {`);
	out.push(`${pad(1)}joiner: '${body.get('joiner').value}',`);
	out.push(`${pad(1)}capitalize: ${body.get('capitalize').value},`);

	const modifiers = body.get('modifiers');

	commented(modifiers, 1, out);
	out.push(`${pad(1)}modifiers: ${pool(modifiers.value, 'words', 1)},`);

	out.push(`${pad(1)}nouns: {`);
	const nouns = [...body.get('nouns').value];
	nouns.forEach(([theme, node], index) => {
		out.push(`${pad(2)}${theme}: ${pool(node.value, 'words', 2)}${index === nouns.length - 1 ? '' : ','}`);
	});
	out.push(`${pad(1)}},`);

	if (body.has('parts')) {
		const node = body.get('parts');

		commented(node, 1, out);
		out.push(`${pad(1)}parts: ${pool(node.value, 'words', 1)},`);
	}

	const syn = body.get('syn');

	commented(syn, 1, out);
	out.push(`${pad(1)}syn: {`);
	out.push(`${pad(2)}kind: '${syn.value.get('kind').value}',`);

	if (syn.value.get('kind').value === 'pool') {
		out.push(`${pad(2)}pool: ${pool(syn.value.get('pool').value, 'words', 2)},`);
	} else {
		out.push(`${pad(2)}onset: ${pool(syn.value.get('onset').value, 'words', 2)},`);
		out.push(`${pad(2)}vowel: ${pool(syn.value.get('vowel').value, 'words', 2)},`);
		const empties = Array(syn.value.get('codaOpen').value).fill("''").join(', ');

		out.push(`${pad(2)}coda: [${empties}${empties ? ', ' : ''}...${pool(syn.value.get('coda').value, 'words', 2)}],`);
	}

	out.push(`${pad(2)}minSyllables: ${syn.value.get('minSyllables').value},`);
	out.push(`${pad(2)}maxSyllables: ${syn.value.get('maxSyllables').value}`);
	out.push(`${pad(1)}}`);
	out.push('};');

	// Word pools are always plain words; only the name datasets need the others.
	const header = imports(new Set(['words']), [`import type { WordLanguageData } from './types.js';`]);

	return `${[...head(`word/${code}.yaml`), '', ...header].join('\n')}\n\n${out.join('\n')}\n`;
}

export function name(code, { body }) {
	const helpers = new Set();
	const extra = [];
	const out = [];
	const constant = code.toUpperCase();

	// `surnameRoman` is its own export, ahead of the dataset that uses it.
	if (body.has('surnameRoman')) {
		const node = body.get('surnameRoman');

		helpers.add('romanMap');
		commented(node, 0, out);
		out.push(`export const ${constant}_SURNAME_ROMAN: Record<string, string> = ${pool(node.value, 'romanMap', 0)};`);
		out.push('');
	}

	out.push(`export const ${constant}: NameLanguageData = {`);
	out.push(`${pad(1)}order: '${body.get('order').value}',`);
	out.push(`${pad(1)}joiner: '${body.get('joiner').value}',`);
	out.push(`${pad(1)}hasMiddle: ${body.get('hasMiddle').value},`);
	out.push(`${pad(1)}roman: '${body.get('roman').value}',`);

	const spec = body.get('lengthSpec').value;
	const range = (part) => `${part}: [${spec.get(part).value.join(', ')}]`;

	out.push(`${pad(1)}lengthSpec: { ${['given', 'last', 'middle'].map(range).join(', ')} },`);

	if (body.has('givenLenWeights')) {
		const node = body.get('givenLenWeights');
		const pairs = [...node.value].map(([length, weight]) => `${length}: ${weight.value}`);

		commented(node, 1, out);
		out.push(`${pad(1)}givenLenWeights: { ${pairs.join(', ')} },`);
	}

	const fields = ['lastWeights', 'last', 'male', 'female', 'middleMale', 'middleFemale',
		'givenMale', 'givenFemale', 'firstMale', 'restMale', 'firstFemale', 'restFemale'];

	for (const field of fields) {
		const node = body.get(field);

		if (!node) continue;

		const helper = helperFor(field, node.value);

		helpers.add(helper);
		commented(node, 1, out);
		out.push(`${pad(1)}${field}: ${pool(node.value, helper, 1)},`);
	}

	if (body.has('syn')) {
		const referenced = SYLLABLE_CONSTANT[body.get('syn').value];

		extra.push(`import { ${referenced} } from './syllables.js';`);
		out.push(`${pad(1)}syn: ${referenced}`);
	} else {
		// Drop the trailing comma from whatever the last field turned out to be.
		out[out.length - 1] = out[out.length - 1].replace(/,$/, '');
	}

	out.push('};');
	extra.push(`import type { NameLanguageData } from './types.js';`);

	return `${[...head(`name/${code}.yaml`), '', ...imports(helpers, extra)].join('\n')}\n\n${out.join('\n')}\n`;
}

export function syllables({ header, body }) {
	const out = [];

	out.push(...head('name/syllables.yaml'), '');
	out.push(...comment(header, { marker: '//', indent: '' }));
	out.push('');
	out.push(`import { words } from '../../_internal/parse.js';`);
	out.push(`import type { SyllableSet } from './types.js';`);

	for (const [key, node] of body) {
		const set = node.value;
		const empties = Array(set.get('codaOpen').value).fill("''").join(', ');

		out.push('');
		out.push(`export const ${SYLLABLE_CONSTANT[key]}: SyllableSet = {`);
		out.push(`${pad(1)}onset: ${pool(set.get('onset').value, 'words', 1)},`);
		out.push(`${pad(1)}vowel: ${pool(set.get('vowel').value, 'words', 1)},`);
		commented(set.get('codaOpen'), 1, out);
		out.push(`${pad(1)}coda: [${empties}${empties ? ', ' : ''}...${pool(set.get('coda').value, 'words', 1)}],`);
		out.push(`${pad(1)}minSyllables: ${set.get('minSyllables').value},`);
		out.push(`${pad(1)}maxSyllables: ${set.get('maxSyllables').value}`);
		out.push('};');
	}

	return `${out.join('\n')}\n`;
}
