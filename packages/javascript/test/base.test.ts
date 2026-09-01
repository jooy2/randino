import assert from 'assert';
import { describe, it } from 'node:test';
import * as randino from '../dist/index.js';

describe('base test', () => {
	it('all check success', async () => {
		// The package entry point is the API contract: everything documented in the
		// README has to be reachable from it, and nothing internal should leak.
		assert.deepStrictEqual(Object.keys(randino).sort(), [
			'NAME_COUNT_MAX',
			'NAME_LANGUAGES',
			'NAME_LENGTH_MAX',
			'NAME_LENGTH_MIN',
			'NICKNAME_COUNT_MAX',
			'NICKNAME_LANGUAGES',
			'NICKNAME_LENGTH_MAX',
			'NICKNAME_LENGTH_MIN',
			'NICKNAME_SUFFIX_CHARSET',
			'NICKNAME_SUFFIX_LENGTH_MAX',
			'NICKNAME_THEMES',
			'nameLengthRange',
			'nameSupportsMiddleName',
			'nameSupportsRoman',
			'nicknameLengthRange',
			'randomName',
			'randomNameDetails',
			'randomNickname',
			'randomNicknameDetails'
		]);

		assert.strictEqual(typeof randino.randomName, 'function');
		assert.strictEqual(typeof randino.randomNameDetails, 'function');
		assert.strictEqual(typeof randino.nameLengthRange, 'function');
		assert.strictEqual(typeof randino.nameSupportsMiddleName, 'function');
		assert.strictEqual(typeof randino.nameSupportsRoman, 'function');
		assert.ok(Array.isArray(randino.NAME_LANGUAGES));
		assert.strictEqual(randino.NAME_LENGTH_MIN, 1);
		assert.strictEqual(randino.NAME_LENGTH_MAX, 30);
		assert.strictEqual(randino.NAME_COUNT_MAX, 10000);

		assert.strictEqual(typeof randino.randomNickname, 'function');
		assert.strictEqual(typeof randino.randomNicknameDetails, 'function');
		assert.strictEqual(typeof randino.nicknameLengthRange, 'function');
		assert.ok(Array.isArray(randino.NICKNAME_LANGUAGES));
		assert.ok(Array.isArray(randino.NICKNAME_THEMES));
		assert.strictEqual(randino.NICKNAME_LENGTH_MIN, 1);
		assert.strictEqual(randino.NICKNAME_LENGTH_MAX, 40);
		assert.strictEqual(randino.NICKNAME_COUNT_MAX, 10000);
		assert.strictEqual(randino.NICKNAME_SUFFIX_LENGTH_MAX, 32);
		assert.match(randino.NICKNAME_SUFFIX_CHARSET, /^[0-9A-Za-z]+$/);
	});
});
