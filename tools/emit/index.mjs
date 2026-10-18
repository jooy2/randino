// Writes the Dart and Python sentence and fictional datasets out of the
// JavaScript ones.
//
// The JavaScript package is the source of truth, and the other two hold a copy
// of every sentence dataset in their own syntax. Editing three copies of one
// pool by hand is how they drift, so this regenerates the two ports from the
// reference and runs each package's formatter over what it wrote.
//
// Usage: node tools/emit/index.mjs
//
// Needs `npm ci` in `packages/javascript`, the Dart SDK on the path, and an
// editable install of `packages/python` (for `ruff`). `tools/parity` is what
// checks the result.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const here = (...parts) => join(ROOT, ...parts);

function ruffBin() {
	for (const candidate of [
		'packages/python/.venv/bin/ruff',
		'packages/python/.venv/Scripts/ruff.exe'
	]) {
		if (existsSync(here(candidate))) return here(candidate);
	}

	return 'ruff';
}

const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: 'inherit' });

const tsx = process.platform === 'win32' ? 'node_modules/.bin/tsx.cmd' : 'node_modules/.bin/tsx';

for (const script of ['sentence-data.ts', 'fictional-data.ts']) {
	run(tsx, [here('tools/emit', script)], here('packages/javascript'));
}

run('dart', ['format', 'lib/src/sentence/data', 'lib/src/fictional/data'], here('packages/dart'));
run(
	ruffBin(),
	['format', 'src/randino/sentence/data', 'src/randino/fictional/data'],
	here('packages/python')
);
