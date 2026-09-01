import assert from 'assert';
import { describe, it } from 'node:test';
import * as randino from '../dist/index.js';

describe('base test', () => {
	it('all check success', async () => {
		// The package entry point is the API contract: everything documented in the
		// README has to be reachable from it, and nothing internal should leak.
		assert.deepStrictEqual(Object.keys(randino).sort(), [
			'AFFIX_CHARSET',
			'AFFIX_LENGTH_DEFAULT',
			'AFFIX_LENGTH_MAX',
			'AFFIX_SEPARATOR_DEFAULT',
			'NAME_COUNT_MAX',
			'NAME_LANGUAGES',
			'NAME_LENGTH_MAX',
			'NAME_LENGTH_MIN',
			'NICKNAME_COUNT_MAX',
			'NICKNAME_LANGUAGES',
			'NICKNAME_LENGTH_MAX',
			'NICKNAME_LENGTH_MIN',
			'NICKNAME_THEMES',
			'nameLengthRange',
			'nameSupportsMiddleName',
			'nameSupportsRoman',
			'nicknameLengthRange',
			'randName',
			'randNameDetails',
			'randNickname',
			'randNicknameDetails',
			'randPrefix',
			'randSuffix'
		]);

		assert.strictEqual(typeof randino.randName, 'function');
		assert.strictEqual(typeof randino.randNameDetails, 'function');
		assert.strictEqual(typeof randino.nameLengthRange, 'function');
		assert.strictEqual(typeof randino.nameSupportsMiddleName, 'function');
		assert.strictEqual(typeof randino.nameSupportsRoman, 'function');
		assert.ok(Array.isArray(randino.NAME_LANGUAGES));
		assert.strictEqual(randino.NAME_LENGTH_MIN, 1);
		assert.strictEqual(randino.NAME_LENGTH_MAX, 30);
		assert.strictEqual(randino.NAME_COUNT_MAX, 10000);

		assert.strictEqual(typeof randino.randNickname, 'function');
		assert.strictEqual(typeof randino.randNicknameDetails, 'function');
		assert.strictEqual(typeof randino.nicknameLengthRange, 'function');
		assert.ok(Array.isArray(randino.NICKNAME_LANGUAGES));
		assert.ok(Array.isArray(randino.NICKNAME_THEMES));
		assert.strictEqual(randino.NICKNAME_LENGTH_MIN, 1);
		assert.strictEqual(randino.NICKNAME_LENGTH_MAX, 40);
		assert.strictEqual(randino.NICKNAME_COUNT_MAX, 10000);

		assert.strictEqual(typeof randino.randSuffix, 'function');
		assert.strictEqual(typeof randino.randPrefix, 'function');
		assert.strictEqual(randino.AFFIX_LENGTH_DEFAULT, 5);
		assert.strictEqual(randino.AFFIX_LENGTH_MAX, 32);
		assert.strictEqual(randino.AFFIX_SEPARATOR_DEFAULT, '_');
		assert.match(randino.AFFIX_CHARSET, /^[0-9A-Za-z]+$/);
	});
});
