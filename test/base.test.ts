import assert from 'assert';
import { describe, it } from 'node:test';
import * as randnick from '../dist/index.js';

describe('base test', () => {
	it('all check success', async () => {
		// The package entry point is the API contract: everything documented in the
		// README has to be reachable from it, and nothing internal should leak.
		assert.deepStrictEqual(Object.keys(randnick).sort(), [
			'NAME_COUNT_MAX',
			'NAME_LANGUAGES',
			'NAME_LENGTH_MAX',
			'NAME_LENGTH_MIN',
			'nameLengthRange',
			'nameSupportsMiddleName',
			'nameSupportsRoman',
			'randomName',
			'randomNameDetails'
		]);

		assert.strictEqual(typeof randnick.randomName, 'function');
		assert.strictEqual(typeof randnick.randomNameDetails, 'function');
		assert.strictEqual(typeof randnick.nameLengthRange, 'function');
		assert.strictEqual(typeof randnick.nameSupportsMiddleName, 'function');
		assert.strictEqual(typeof randnick.nameSupportsRoman, 'function');
		assert.ok(Array.isArray(randnick.NAME_LANGUAGES));
		assert.strictEqual(randnick.NAME_LENGTH_MIN, 1);
		assert.strictEqual(randnick.NAME_LENGTH_MAX, 30);
		assert.strictEqual(randnick.NAME_COUNT_MAX, 10000);
	});
});
