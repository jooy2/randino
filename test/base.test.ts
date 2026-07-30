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

		assert.strictEqual(typeof randnick.randomName, 'function');
		assert.strictEqual(typeof randnick.randomNameDetails, 'function');
		assert.strictEqual(typeof randnick.nameLengthRange, 'function');
		assert.strictEqual(typeof randnick.nameSupportsMiddleName, 'function');
		assert.strictEqual(typeof randnick.nameSupportsRoman, 'function');
		assert.ok(Array.isArray(randnick.NAME_LANGUAGES));
		assert.strictEqual(randnick.NAME_LENGTH_MIN, 1);
		assert.strictEqual(randnick.NAME_LENGTH_MAX, 30);
		assert.strictEqual(randnick.NAME_COUNT_MAX, 10000);

		assert.strictEqual(typeof randnick.randomNickname, 'function');
		assert.strictEqual(typeof randnick.randomNicknameDetails, 'function');
		assert.strictEqual(typeof randnick.nicknameLengthRange, 'function');
		assert.ok(Array.isArray(randnick.NICKNAME_LANGUAGES));
		assert.ok(Array.isArray(randnick.NICKNAME_THEMES));
		assert.strictEqual(randnick.NICKNAME_LENGTH_MIN, 1);
		assert.strictEqual(randnick.NICKNAME_LENGTH_MAX, 40);
		assert.strictEqual(randnick.NICKNAME_COUNT_MAX, 10000);
		assert.strictEqual(randnick.NICKNAME_SUFFIX_LENGTH_MAX, 32);
		assert.match(randnick.NICKNAME_SUFFIX_CHARSET, /^[0-9A-Za-z]+$/);
	});
});
