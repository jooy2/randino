// Emits the pub.dev package's data files.
//
// Layout beyond the string literals and the comments is left to `dart format` —
// `tools/codegen/index.mjs` runs it over what this writes. The trailing commas
// are what make it break each argument onto its own line.

import { banner, comment } from '../render.mjs';

const pad = (depth) => '  '.repeat(depth);

/** A pool literal: one line where it fits, a raw multi-line string where it does not. */
function pool(value, helper, depth) {
	if (!value.includes('\n')) return `${helper}(r'${value}')`;

	const lines = value.split('\n').map((line) => `${pad(depth + 1)}${line}`);

	return `${helper}(r'''\n${lines.join('\n')}\n${pad(depth)}''')`;
}

const commented = (node, depth, out) => {
	if (node.comment) out.push(...comment(node.comment, { marker: '//', indent: pad(depth) }));
};

const SYLLABLE_CONSTANT = {
	western: 'westernSyllables',
	italian: 'italianSyllables',
	spanish: 'spanishSyllables',
	german: 'germanSyllables',
	russian: 'russianSyllables',
	vietnamese: 'vietnameseSyllables'
};

// Which language each shared template is written for, for its doc comment.
const SYLLABLE_LANGUAGE = {
	western: 'English',
	italian: 'Italian',
	spanish: 'Spanish',
	german: 'German',
	russian: 'Russian',
	vietnamese: 'Vietnamese'
};

const enumCase = (value) => value.replace(/-(.)/g, (_, character) => character.toUpperCase());

const file = (source, imports, lines) =>
	`${[...banner(source, '//'), '', ...[...imports].sort().map((path) => `import '${path}';`), ''].join('\n')}\n${lines.join('\n')}\n`;

export function word(code, { body }) {
	const imports = new Set([
		'package:randino/src/internal/parse.dart',
		'package:randino/src/types.dart',
		'package:randino/src/word/data/types.dart'
	]);
	const out = [];
	const language = body.get('language').value;

	out.push(`/// The ${language} nickname dataset.`);
	out.push(`final WordLanguageData ${code} = WordLanguageData(`);
	out.push(`${pad(1)}joiner: '${body.get('joiner').value}',`);
	out.push(`${pad(1)}capitalize: ${body.get('capitalize').value},`);

	const modifiers = body.get('modifiers');

	commented(modifiers, 1, out);
	out.push(`${pad(1)}modifiers: ${pool(modifiers.value, 'words', 1)},`);

	out.push(`${pad(1)}nouns: {`);
	for (const [theme, node] of body.get('nouns').value) {
		out.push(`${pad(2)}WordTheme.${theme}: ${pool(node.value, 'words', 2)},`);
	}
	out.push(`${pad(1)}},`);

	if (body.has('parts')) {
		const parts = body.get('parts');

		commented(parts, 1, out);
		out.push(`${pad(1)}parts: ${pool(parts.value, 'words', 1)},`);
	}

	const syn = body.get('syn');
	const kind = syn.value.get('kind').value;

	commented(syn, 1, out);
	out.push(`${pad(1)}syn: ${kind === 'pool' ? 'PoolSynthesis' : 'SyllableSynthesis'}(`);

	if (kind === 'pool') {
		out.push(`${pad(2)}pool: ${pool(syn.value.get('pool').value, 'words', 2)},`);
	} else {
		out.push(`${pad(2)}onset: ${pool(syn.value.get('onset').value, 'words', 2)},`);
		out.push(`${pad(2)}vowel: ${pool(syn.value.get('vowel').value, 'words', 2)},`);
		const empties = Array(syn.value.get('codaOpen').value).fill("''").join(', ');

		out.push(`${pad(2)}coda: [${empties}${empties ? ', ' : ''}...${pool(syn.value.get('coda').value, 'words', 2)}],`);
	}

	out.push(`${pad(2)}minSyllables: ${syn.value.get('minSyllables').value},`);
	out.push(`${pad(2)}maxSyllables: ${syn.value.get('maxSyllables').value},`);
	out.push(`${pad(1)}),`);
	out.push(');');

	return file(`word/${code}.yaml`, imports, out);
}

export function name(code, { body }) {
	const imports = new Set(['package:randino/src/name/data/types.dart', 'package:randino/src/types.dart']);
	const out = [];
	const language = body.get('language').value;

	if (body.has('surnameRoman')) {
		const node = body.get('surnameRoman');

		imports.add('package:randino/src/internal/parse.dart');
		commented(node, 0, out);
		out.push(`/// Conventional romanization of the ${language} surnames in the pool.`);
		out.push(`final Map<String, String> ${code}SurnameRoman = ${pool(node.value, 'romanMap', 0)};`);
		out.push('');
	}

	out.push(`/// The ${language} name dataset.`);
	out.push(`final NameLanguageData ${code} = NameLanguageData(`);
	out.push(`${pad(1)}order: NameOrder.${enumCase(body.get('order').value)},`);
	out.push(`${pad(1)}joiner: '${body.get('joiner').value}',`);
	out.push(`${pad(1)}hasMiddle: ${body.get('hasMiddle').value},`);
	out.push(`${pad(1)}roman: RomanMode.${body.get('roman').value},`);

	const spec = body.get('lengthSpec').value;

	out.push(`${pad(1)}lengthSpec: NameLengthSpec(`);
	for (const part of ['given', 'last', 'middle']) {
		out.push(`${pad(2)}${part}: LengthRange(${spec.get(part).value.join(', ')}),`);
	}
	out.push(`${pad(1)}),`);

	if (body.has('givenLenWeights')) {
		const node = body.get('givenLenWeights');
		const pairs = [...node.value].map(([length, weight]) => `${length}: ${weight.value}`);

		commented(node, 1, out);
		out.push(`${pad(1)}givenLenWeights: {${pairs.join(', ')}},`);
	}

	const fields = ['lastWeights', 'last', 'male', 'female', 'middleMale', 'middleFemale',
		'givenMale', 'givenFemale', 'firstMale', 'restMale', 'firstFemale', 'restFemale'];

	for (const field of fields) {
		const node = body.get(field);

		if (!node) continue;

		let helper = 'pool';

		if (field === 'lastWeights') {
			helper = 'weightMap';
			imports.add('package:randino/src/internal/parse.dart');
		} else if (node.value.includes(':')) {
			helper = 'tokenPool';
		}

		commented(node, 1, out);
		out.push(`${pad(1)}${field}: ${pool(node.value, helper, 1)},`);
	}

	if (body.has('syn')) {
		imports.add('package:randino/src/name/data/syllables.dart');
		out.push(`${pad(1)}syn: ${SYLLABLE_CONSTANT[body.get('syn').value]},`);
	}

	out.push(');');

	return file(`name/${code}.yaml`, imports, out);
}

export function syllables({ header, body }) {
	const imports = new Set([
		'package:randino/src/internal/parse.dart',
		'package:randino/src/name/data/types.dart'
	]);
	const out = [];

	out.push(...comment(header, { marker: '//', indent: '' }));

	for (const [key, node] of body) {
		const set = node.value;
		const empties = Array(set.get('codaOpen').value).fill("''").join(', ');

		out.push('');
		out.push(`/// Invented-name template for ${SYLLABLE_LANGUAGE[key]}.`);
		out.push(`final SyllableSet ${SYLLABLE_CONSTANT[key]} = SyllableSet(`);
		out.push(`${pad(1)}onset: ${pool(set.get('onset').value, 'words', 1)},`);
		out.push(`${pad(1)}vowel: ${pool(set.get('vowel').value, 'words', 1)},`);
		commented(set.get('codaOpen'), 1, out);
		out.push(`${pad(1)}coda: [${empties}${empties ? ', ' : ''}...${pool(set.get('coda').value, 'words', 1)}],`);
		out.push(`${pad(1)}minSyllables: ${set.get('minSyllables').value},`);
		out.push(`${pad(1)}maxSyllables: ${set.get('maxSyllables').value},`);
		out.push(');');
	}

	return file('name/syllables.yaml', imports, out);
}
