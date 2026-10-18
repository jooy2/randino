import assert from 'assert';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { sideEffectsIn, sideEffectsUnder } from '../scripts/check-side-effects.mjs';

/** What the check reports for one module's text, without the line numbers. */
function found(text: string): string[] {
	return sideEffectsIn('module.ts', text).map(({ what }: { what: string }) => what);
}

describe('Tree shaking', () => {
	it('no module in lib does anything on import', () => {
		// `sideEffects: false` is what lets a bundler drop the pools a caller never
		// reaches. This is what a bundler that does not read it decides by instead:
		// every module listed here goes into every bundle, whatever was imported.
		const lib = fileURLToPath(new URL('../lib', import.meta.url));

		assert.deepStrictEqual(
			sideEffectsUnder(lib).map(
				({ file, line, what }: { file: string; line: number; what: string }) =>
					`lib/${file}:${line}: ${what}`
			),
			[]
		);
	});

	it('the check reports what a bundler would keep', () => {
		// Each of these keeps its module in esbuild, Rollup or terser. A check that
		// stopped seeing them would pass everything above.
		assert.deepStrictEqual(found(`export const POOL = words('a b');`), [
			'a call without /*#__PURE__*/'
		]);
		assert.deepStrictEqual(found(`const kept = new Map();`), ['a call without /*#__PURE__*/']);
		assert.deepStrictEqual(found(`export const ALL = [...LANGUAGES, 'all'];`), ['a spread']);
		assert.deepStrictEqual(found(`export const EN = { ...MODIFIERS, nouns: [] };`), ['a spread']);
		assert.deepStrictEqual(found(`export const GENDER = NOUNS.gender;`), ['a property read']);
		assert.deepStrictEqual(found(`export const SCALE = { bytes: 1000 ** 3 };`), ['an operator']);
		assert.deepStrictEqual(found(`export const NOTE = \`\${NAME}!\`;`), ['an operator']);
		assert.deepStrictEqual(found(`import './setup.js';`), ['an import for its effects']);
		assert.deepStrictEqual(found(`setup();`), ['a statement that runs on import']);
		// The mark makes a call droppable, not its arguments.
		assert.deepStrictEqual(found(`export const POOL = /*#__PURE__*/ words(spell('a b'));`), [
			'a call without /*#__PURE__*/'
		]);
	});

	it('the check lets through what a bundler can drop', () => {
		assert.deepStrictEqual(
			found(`
				import { words } from './parse.js';
				export { EN } from './en.js';
				export const LIMIT = -1, NAME = 'x', FLAGS = [true, null, 'a'];
				export const SCALE = { units: UNITS, bytes: 1e9 };
				export const POOL = /*#__PURE__*/ words('a b');
				export const SPLIT = /*#__PURE__*/ words('a b').map((word) => word.length);
				const kept = /*#__PURE__*/ new Map<string, number>();
				let source: () => number = Math.random;
				export const EN = /*#__PURE__*/ ((): { nouns: readonly string[] } => ({
					...MODIFIERS,
					nouns: words(\`a b\`)
				}))();
				export function pick(): number {
					return kept.size + source();
				}
				export interface Shape { size: number }
			`),
			[]
		);
	});
});
