// Writes the length tables the three length helpers read, out of the pools.
//
// `wordLengthRange`, `nicknameLengthRange` and `sentenceLengthRange` report two
// numbers, and working them out at call time put every pool in the bundle of
// whoever imported one. So the numbers are measured here, once, and written into
// modules that hold no pool; the suites fail when a pool moves one of them.
//
// Usage: node tools/lengths/index.mjs
//
// Needs `npm ci` in `packages/javascript`.

import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const here = (...parts) => join(ROOT, ...parts);
const bin = (name) =>
	process.platform === 'win32' ? `node_modules/.bin/${name}.cmd` : `node_modules/.bin/${name}`;
const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: 'inherit' });

run(bin('tsx'), [here('tools/lengths/lengths.ts')], here('packages/javascript'));
run(
	bin('prettier'),
	['--write', 'lib/word/data/lengths.ts', 'lib/sentence/data/lengths.ts'],
	here('packages/javascript')
);
