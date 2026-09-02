// Generates every package's data files from `data/`.
//
// The datasets are the same words in three languages' syntax, so they are
// written once and emitted three times rather than edited three times. The
// generated files are committed: each package stays a plain library with no
// build step, and a contributor reading `packages/dart` finds the data there.
//
// Usage:
//   node tools/codegen/index.mjs           write the files
//   node tools/codegen/index.mjs --check   fail if they are not up to date
//
// Only the per-language data files are generated. The `index` files that
// register them are not: they are a line or two per language, they carry each
// language's own doc comments, and `tools/parity` already checks they agree.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as dart from './emit/dart.mjs';
import * as javascript from './emit/javascript.mjs';
import * as python from './emit/python.mjs';
import { parse } from './yaml.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const here = (...parts) => join(ROOT, ...parts);
const check = process.argv.includes('--check');

const TARGETS = [
	{
		emit: javascript,
		path: (kind, stem) => here('packages/javascript/lib', kind, 'data', `${stem}.ts`),
		format: {
			command: process.platform === 'win32' ? 'node_modules/.bin/prettier.cmd' : 'node_modules/.bin/prettier',
			args: ['--write', '--log-level', 'warn'],
			cwd: here('packages/javascript'),
			setup: 'npm ci (in packages/javascript)'
		}
	},
	{
		emit: dart,
		path: (kind, stem) => here('packages/dart/lib/src', kind, 'data', `${stem}.dart`),
		format: {
			command: 'dart',
			args: ['format', '--output=write'],
			cwd: here('packages/dart'),
			setup: 'the Dart SDK on PATH'
		}
	},
	{
		emit: python,
		path: (kind, stem) => here('packages/python/src/randino', kind, 'data', `${stem}.py`),
		format: {
			command: ruffBin(),
			args: ['format', '--quiet'],
			cwd: here('packages/python'),
			setup: 'pip install -e ".[dev]" (in packages/python)'
		}
	}
];

function ruffBin() {
	for (const candidate of ['packages/python/.venv/bin/ruff', 'packages/python/.venv/Scripts/ruff.exe']) {
		if (existsSync(here(candidate))) return here(candidate);
	}

	return 'ruff';
}

const sources = (kind) =>
	readdirSync(here('data', kind))
		.filter((entry) => entry.endsWith('.yaml'))
		.map((entry) => entry.replace(/\.yaml$/, ''))
		.sort();

// Emitted content, keyed by the file it belongs in.
const planned = new Map();

for (const kind of ['word', 'name']) {
	for (const stem of sources(kind)) {
		const document = parse(readFileSync(here('data', kind, `${stem}.yaml`), 'utf8'));

		for (const target of TARGETS) {
			// `syllables` is the one shared file: templates the languages point at
			// rather than a language of its own, so it takes no code.
			const content =
				stem === 'syllables' ? target.emit.syllables(document) : target.emit[kind](stem, document);

			planned.set(target.path(kind, stem), content);
		}
	}
}

// Every file is written before any formatter runs, so each formatter is invoked
// once. On `--check` the originals go back afterwards, whatever the result.
const original = new Map();

for (const [path, content] of planned) {
	original.set(path, existsSync(path) ? readFileSync(path, 'utf8') : null);
	writeFileSync(path, content);
}

let failed = false;

try {
	for (const target of TARGETS) {
		const paths = [...planned.keys()].filter((path) => path.startsWith(target.format.cwd));

		try {
			execFileSync(target.format.command, [...target.format.args, ...paths], {
				cwd: target.format.cwd,
				encoding: 'utf8',
				stdio: ['ignore', 'ignore', 'pipe']
			});
		} catch (error) {
			console.error(`Could not run the formatter for ${target.format.cwd}. Needs: ${target.format.setup}\n`);
			console.error(error.stderr || error.message);
			process.exit(2);
		}
	}

	const stale = [...planned.keys()].filter((path) => readFileSync(path, 'utf8') !== original.get(path));

	if (check) {
		if (stale.length) {
			failed = true;
			console.error(`${stale.length} generated file(s) do not match \`data/\`:\n`);
			for (const path of stale) console.error(`  ${path.slice(ROOT.length + 1)}`);
			console.error('\nRun `node tools/codegen/index.mjs` and commit the result.');
			console.error('If you edited one of these files by hand, move the change into `data/` instead.\n');
		} else {
			console.log(`${planned.size} generated files are up to date`);
		}
	} else {
		console.log(
			stale.length ? `${planned.size} files written, ${stale.length} changed` : `${planned.size} files written, none changed`
		);
	}
} finally {
	if (check) {
		for (const [path, content] of original) if (content !== null) writeFileSync(path, content);
	}
}

if (failed) process.exit(1);
