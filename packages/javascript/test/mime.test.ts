import assert from 'assert';
import { describe, it } from 'node:test';
import { MIME_TOP_LEVELS, RAND_COUNT_MAX, randMimeType } from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { FILE_EXTENSIONS, mimeTypeEntries } from '../dist/file/data/index.js';

const SAMPLE = 60;
const LARGE = 6000;
const MIME = /^(application|audio|font|image|model|text|video)\/[a-z0-9.+-]+$/;

describe('MIME type', () => {
	it('randMimeType returns one MIME type by default', () => {
		const types = randMimeType();

		assert.strictEqual(types.length, 1);
		assert.match(types[0], MIME);
	});

	it('returns exactly `count` types', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randMimeType({ count }).length, count);
		}

		assert.strictEqual(randMimeType({ count: -3 }).length, 0);
		assert.strictEqual(randMimeType({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every type is one an extension carries, listed once with all of its extensions', () => {
		const entries = mimeTypeEntries();
		const carried = new Set(FILE_EXTENSIONS.map((entry) => entry.mimeType));

		assert.strictEqual(entries.length, carried.size);

		for (const entry of entries) {
			assert.deepStrictEqual(
				entry.extensions,
				FILE_EXTENSIONS.filter((each) => each.mimeType === entry.mimeType).map((each) => each.name)
			);
			assert.strictEqual(
				entry.weight,
				Math.max(
					...FILE_EXTENSIONS.filter((each) => each.mimeType === entry.mimeType).map(
						(each) => each.weight
					)
				)
			);
		}
	});

	it('the detail splits the type at its slash and lists its extensions', () => {
		for (const detail of randMimeType({ count: SAMPLE * 5, output: 'detail' })) {
			assert.match(detail.mimeType, MIME);
			assert.strictEqual(detail.mimeType, `${detail.type}/${detail.subtype}`);
			assert.ok(detail.extensions.length > 0);

			for (const name of detail.extensions) {
				assert.strictEqual(
					FILE_EXTENSIONS.find((entry) => entry.name === name)?.mimeType,
					detail.mimeType
				);
			}
		}
	});

	it('type keeps to the top-level types named', () => {
		for (const type of MIME_TOP_LEVELS) {
			assert.ok(
				randMimeType({ type, count: SAMPLE }).every((mime) => mime.startsWith(`${type}/`)),
				type
			);
		}

		assert.ok(
			randMimeType({ type: ['audio', 'video'], count: SAMPLE }).every((mime) =>
				/^(audio|video)\//.test(mime)
			)
		);
	});

	it('a type shared by many extensions is no more common than its commonest one', () => {
		const types = randMimeType({ count: LARGE });
		const share = (mime: string) => types.filter((each) => each === mime).length / types.length;

		assert.ok(share('text/plain') < 0.06);
		assert.ok(share('application/pdf') > share('application/vnd.wordperfect'));
	});

	it('the detail hands out a copy of the extensions', () => {
		const [detail] = randMimeType({ type: 'image', output: 'detail' });

		detail.extensions.push('nope');

		assert.ok(mimeTypeEntries().every((entry) => !entry.extensions.includes('nope')));
	});

	it('unique never repeats a type', () => {
		const found = randMimeType({ type: 'image', unique: true, count: 100 });

		assert.strictEqual(new Set(found).size, found.length);
		assert.ok(found.length > 5);
	});
});
