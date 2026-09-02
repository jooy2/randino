// Asserts that the three packages hold the same datasets.
//
// Each package keeps its own copy of the pools, written in its own language's
// syntax, and a change that lands on only one side is invisible until someone
// reads all three. This runs one dump per package, normalizes what only differs
// because the languages differ, and compares what is left.
//
// Usage: node tools/parity/index.mjs
//
// Each package has to be set up first — `npm ci` in `packages/javascript`,
// `dart pub get` in `packages/dart`, and an editable install of
// `packages/python`. The dumps say so themselves when they are not.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const here = (...parts) => join(ROOT, ...parts);

// Windows names its virtualenv scripts differently, and CI has the package on
// the interpreter's path instead of in a virtualenv at all.
function pythonBin() {
	if (process.env.PARITY_PYTHON) return process.env.PARITY_PYTHON;

	for (const candidate of [
		'packages/python/.venv/bin/python',
		'packages/python/.venv/Scripts/python.exe'
	]) {
		if (existsSync(here(candidate))) return here(candidate);
	}

	return process.platform === 'win32' ? 'python' : 'python3';
}

const PACKAGES = {
	javascript: {
		command: process.platform === 'win32' ? 'node_modules/.bin/tsx.cmd' : 'node_modules/.bin/tsx',
		args: [here('tools/parity/dump-javascript.ts')],
		cwd: here('packages/javascript'),
		setup: 'npm ci (in packages/javascript)'
	},
	dart: {
		command: 'dart',
		// `dart run` resolves `package:` imports from the script's own location,
		// and the script sits outside the package, so the config is passed in.
		args: [
			'run',
			`--packages=${here('packages/dart/.dart_tool/package_config.json')}`,
			here('tools/parity/dump_dart.dart')
		],
		cwd: ROOT,
		setup: 'dart pub get (in packages/dart)'
	},
	python: {
		command: pythonBin(),
		args: [here('tools/parity/dump_python.py')],
		cwd: ROOT,
		setup: 'pip install -e ".[dev]" (in packages/python)'
	}
};

function dump(name) {
	const { command, args, cwd, setup } = PACKAGES[name];

	try {
		return JSON.parse(
			execFileSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
		);
	} catch (error) {
		console.error(`Could not read the ${name} package's datasets. Set it up first: ${setup}\n`);
		console.error(error.stderr || error.message);
		process.exit(2);
	}
}

// Flattens to one entry per leaf, so a difference is reported at the field that
// actually differs rather than at the language that contains it.
function flatten(value, path = '', out = new Map()) {
	if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
		for (const key of Object.keys(value).sort())
			flatten(value[key], path ? `${path}.${key}` : key, out);
	} else {
		out.set(path, value);
	}

	return out;
}

// What differs between two pools, in the terms someone editing them thinks in:
// which entries are missing on each side, and whether the rest is out of order.
function poolDelta(mine, theirs) {
	const key = (entry) =>
		entry !== null && typeof entry === 'object'
			? `${entry.n}${entry.r ? `:${entry.r}` : ''}`
			: `${entry}`;
	const ours = mine.map(key);
	const yours = theirs.map(key);
	const missing = ours.filter((entry) => !yours.includes(entry));
	const extra = yours.filter((entry) => !ours.includes(entry));
	const notes = [];

	if (missing.length) notes.push(`missing: ${missing.join(' ')}`);
	if (extra.length) notes.push(`unexpected: ${extra.join(' ')}`);
	if (!notes.length) notes.push(`same ${ours.length} entries, different order`);

	return notes.join(' | ');
}

function compare(reference, candidate, name) {
	const mine = flatten(reference);
	const theirs = flatten(candidate);
	const paths = [...new Set([...mine.keys(), ...theirs.keys()])].sort();
	const failures = [];

	for (const path of paths) {
		const ours = mine.get(path);
		const yours = theirs.get(path);

		if (JSON.stringify(ours) === JSON.stringify(yours)) continue;

		if (!mine.has(path))
			failures.push(`${path}\n    only ${name} has it: ${JSON.stringify(yours)}`);
		else if (!theirs.has(path)) failures.push(`${path}\n    ${name} does not have it`);
		else if (Array.isArray(ours) && Array.isArray(yours))
			failures.push(`${path}\n    ${poolDelta(ours, yours)}`);
		else
			failures.push(
				`${path}\n    javascript: ${JSON.stringify(ours)}\n    ${name}: ${JSON.stringify(yours)}`
			);
	}

	return failures;
}

const reference = dump('javascript');
const fields = flatten(reference).size;
let failed = false;

for (const name of ['dart', 'python']) {
	const failures = compare(reference, dump(name), name);

	if (failures.length) {
		failed = true;
		console.error(`\n${name} differs from javascript in ${failures.length} of ${fields} fields:\n`);
		for (const failure of failures) console.error(`  ${failure}\n`);
	} else {
		console.log(`${name.padEnd(10)} matches javascript across all ${fields} fields`);
	}
}

if (failed) {
	console.error('The packages have drifted apart. The JavaScript package is the source of truth:');
	console.error('bring the others back to it, or change all three.\n');
	process.exit(1);
}
