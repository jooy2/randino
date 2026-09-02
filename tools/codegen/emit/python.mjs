// Emits the PyPI package's data files.
//
// Layout beyond the string literals and the comments is left to `ruff format` —
// `tools/codegen/index.mjs` runs it over what this writes.

import { banner, comment, snake, wrap } from '../render.mjs';

const pad = (depth) => '    '.repeat(depth);
const head = (source) => `${banner(source, '#').join('\n')}\n`;
const field = (name) => name.replace(/([A-Z])/g, (_, character) => `_${character.toLowerCase()}`);

/** A pool literal: one line where it fits, a triple-quoted string where it does not. */
function pool(value, helper, depth) {
	if (!value.includes('\n')) return `${helper}("${value}")`;

	const lines = value.split('\n').map((line) => `${pad(depth + 1)}${line}`);

	return `${helper}("""\n${lines.join('\n')}\n${pad(depth)}""")`;
}

const commented = (node, depth, out) => {
	if (node.comment) out.push(...comment(snake(node.comment), { marker: '#', indent: pad(depth) }));
};

const SYLLABLE_CONSTANT = {
	western: 'WESTERN_SYLLABLES',
	italian: 'ITALIAN_SYLLABLES',
	spanish: 'SPANISH_SYLLABLES',
	german: 'GERMAN_SYLLABLES',
	russian: 'RUSSIAN_SYLLABLES',
	vietnamese: 'VIETNAMESE_SYLLABLES'
};

const importLines = (modules) =>
	[...modules.entries()]
		.filter(([, names]) => names.size)
		.sort(([a], [b]) => (a < b ? -1 : 1))
		.map(([module, names]) => `from ${module} import ${[...names].sort().join(', ')}`);

export function word(code, { body }) {
	const language = body.get('language').value;
	const syn = body.get('syn');
	const kind = syn.value.get('kind').value;
	const synthesis = kind === 'pool' ? 'PoolSynthesis' : 'SyllableSynthesis';
	const modules = new Map([
		['randino._internal.parse', new Set(['words'])],
		['randino.word.data._types', new Set([synthesis, 'WordLanguageData'])]
	]);
	const out = [];

	out.push(`${code.toUpperCase()} = WordLanguageData(`);
	out.push(`${pad(1)}joiner="${body.get('joiner').value}",`);
	out.push(`${pad(1)}capitalize=${body.get('capitalize').value ? 'True' : 'False'},`);

	const modifiers = body.get('modifiers');

	commented(modifiers, 1, out);
	out.push(`${pad(1)}modifiers=${pool(modifiers.value, 'words', 1)},`);

	out.push(`${pad(1)}nouns={`);
	for (const [theme, node] of body.get('nouns').value) {
		out.push(`${pad(2)}"${theme}": ${pool(node.value, 'words', 2)},`);
	}
	out.push(`${pad(1)}},`);

	if (body.has('parts')) {
		const parts = body.get('parts');

		commented(parts, 1, out);
		out.push(`${pad(1)}parts=${pool(parts.value, 'words', 1)},`);
	}

	commented(syn, 1, out);
	out.push(`${pad(1)}syn=${synthesis}(`);

	if (kind === 'pool') {
		out.push(`${pad(2)}pool=${pool(syn.value.get('pool').value, 'words', 2)},`);
	} else {
		out.push(`${pad(2)}onset=${pool(syn.value.get('onset').value, 'words', 2)},`);
		out.push(`${pad(2)}vowel=${pool(syn.value.get('vowel').value, 'words', 2)},`);
		const empties = Array(syn.value.get('codaOpen').value).fill('""').join(', ');

		out.push(`${pad(2)}coda=(${empties}${empties ? ', ' : ''}*${pool(syn.value.get('coda').value, 'words', 2)}),`);
	}

	out.push(`${pad(2)}min_syllables=${syn.value.get('minSyllables').value},`);
	out.push(`${pad(2)}max_syllables=${syn.value.get('maxSyllables').value},`);
	out.push(`${pad(1)}),`);
	out.push(')');

	return `${head(`word/${code}.yaml`)}"""${language} nickname pools."""\n\n${importLines(modules).join('\n')}\n\n${out.join('\n')}\n`;
}

export function name(code, { body }) {
	const language = body.get('language').value;
	const modules = new Map([
		['randino._internal.parse', new Set()],
		['randino.name.data._types', new Set(['NameLanguageData', 'NameLengthSpec'])],
		['randino.name.data.syllables', new Set()]
	]);
	const parse = modules.get('randino._internal.parse');
	const out = [];
	const constant = code.toUpperCase();

	if (body.has('surnameRoman')) {
		const node = body.get('surnameRoman');

		parse.add('roman_map');
		commented(node, 0, out);
		out.push(`${constant}_SURNAME_ROMAN = ${pool(node.value, 'roman_map', 0)}`);
		out.push('');
	}

	out.push(`${constant} = NameLanguageData(`);
	out.push(`${pad(1)}order="${body.get('order').value}",`);
	out.push(`${pad(1)}joiner="${body.get('joiner').value}",`);
	out.push(`${pad(1)}has_middle=${body.get('hasMiddle').value ? 'True' : 'False'},`);
	out.push(`${pad(1)}roman="${body.get('roman').value}",`);

	const spec = body.get('lengthSpec').value;
	const range = (part) => `${part}=(${spec.get(part).value.join(', ')})`;

	out.push(`${pad(1)}length_spec=NameLengthSpec(${['given', 'last', 'middle'].map(range).join(', ')}),`);

	if (body.has('givenLenWeights')) {
		const node = body.get('givenLenWeights');
		const pairs = [...node.value].map(([length, weight]) => `${length}: ${weight.value}`);

		commented(node, 1, out);
		out.push(`${pad(1)}given_len_weights={${pairs.join(', ')}},`);
	}

	const fields = ['lastWeights', 'last', 'male', 'female', 'middleMale', 'middleFemale',
		'givenMale', 'givenFemale', 'firstMale', 'restMale', 'firstFemale', 'restFemale'];

	for (const key of fields) {
		const node = body.get(key);

		if (!node) continue;

		const helper = key === 'lastWeights' ? 'weights' : node.value.includes(':') ? 'tokens' : 'words';

		parse.add(helper);
		commented(node, 1, out);
		out.push(`${pad(1)}${field(key)}=${pool(node.value, helper, 1)},`);
	}

	if (body.has('syn')) {
		const referenced = SYLLABLE_CONSTANT[body.get('syn').value];

		modules.get('randino.name.data.syllables').add(referenced);
		out.push(`${pad(1)}syn=${referenced},`);
	}

	out.push(')');

	return `${head(`name/${code}.yaml`)}"""${language} name pools."""\n\n${importLines(modules).join('\n')}\n\n${out.join('\n')}\n`;
}

export function syllables({ header, body }) {
	const modules = new Map([
		['randino._internal.parse', new Set(['words'])],
		['randino.name.data._types', new Set(['SyllableSet'])]
	]);
	const out = [];
	// Google-convention docstring: a summary line, a blank line, then the rest.
	const [summary, ...rest] = header.replace(/\n/g, ' ').split(/(?<=\.)\s+/);
	const doc = rest.length
		? `"""${summary}\n\n${wrap(rest.join(' '), 84).join('\n')}\n"""`
		: `"""${header}"""`;

	for (const [key, node] of body) {
		const set = node.value;
		const empties = Array(set.get('codaOpen').value).fill('""').join(', ');

		if (out.length) out.push('');
		out.push(`${SYLLABLE_CONSTANT[key]} = SyllableSet(`);
		out.push(`${pad(1)}onset=${pool(set.get('onset').value, 'words', 1)},`);
		out.push(`${pad(1)}vowel=${pool(set.get('vowel').value, 'words', 1)},`);
		commented(set.get('codaOpen'), 1, out);
		out.push(`${pad(1)}coda=(${empties}${empties ? ', ' : ''}*${pool(set.get('coda').value, 'words', 1)}),`);
		out.push(`${pad(1)}min_syllables=${set.get('minSyllables').value},`);
		out.push(`${pad(1)}max_syllables=${set.get('maxSyllables').value},`);
		out.push(')');
	}

	return `${head('name/syllables.yaml')}${doc}\n\n${importLines(modules).join('\n')}\n\n${out.join('\n')}\n`;
}
