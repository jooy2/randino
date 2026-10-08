import assert from 'assert';
import { describe, it } from 'node:test';
import { FILE_CATEGORIES, RAND_COUNT_MAX, randFileExtension } from '../dist/index.js';
// Internal, but it is what a result is checked against.
import { FILE_EXTENSIONS } from '../dist/file/data/index.js';

const SAMPLE = 60;
const LARGE = 6000;

describe('File extension', () => {
	it('randFileExtension returns one extension, dot included, by default', () => {
		const extensions = randFileExtension();

		assert.strictEqual(extensions.length, 1);
		assert.match(extensions[0], /^\.[a-z0-9]+$/);
	});

	it('returns exactly `count` extensions', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randFileExtension({ count }).length, count);
		}

		assert.strictEqual(randFileExtension({ count: -3 }).length, 0);
		assert.strictEqual(randFileExtension({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every extension is listed once, in lower case, in a category that exists', () => {
		const seen = new Set<string>();

		for (const entry of FILE_EXTENSIONS) {
			assert.ok(!seen.has(entry.name), `${entry.name} is listed twice`);
			seen.add(entry.name);
			assert.match(entry.name, /^[a-z0-9]+$/);
			assert.ok(FILE_CATEGORIES.includes(entry.category), entry.name);
			assert.ok(entry.weight >= 1 && entry.weight <= 5, entry.name);
			assert.match(
				entry.mimeType,
				/^(application|audio|font|image|model|text|video)\/[a-z0-9.+-]+$/
			);
		}

		for (const category of FILE_CATEGORIES) {
			assert.ok(
				FILE_EXTENSIONS.some((entry) => entry.category === category),
				`${category} holds an extension`
			);
		}
	});

	it('every extension is one the catalog holds, in its own category', () => {
		for (const detail of randFileExtension({ count: SAMPLE * 5, output: 'detail' })) {
			const entry = FILE_EXTENSIONS.find((each) => each.name === detail.name);

			assert.ok(entry, detail.extension);
			assert.strictEqual(detail.category, entry.category);
			assert.strictEqual(detail.mimeType, entry.mimeType);
			assert.strictEqual(detail.extension, `.${detail.name}`);
		}
	});

	it('an extension carries the MIME type its format is served as', () => {
		const mime = (name: string) => FILE_EXTENSIONS.find((entry) => entry.name === name)?.mimeType;

		assert.strictEqual(mime('pdf'), 'application/pdf');
		assert.strictEqual(mime('png'), 'image/png');
		assert.strictEqual(mime('jpg'), mime('jpeg'));
		assert.strictEqual(mime('mp4'), 'video/mp4');
		assert.strictEqual(mime('js'), 'text/javascript');
		assert.strictEqual(mime('ts'), 'text/plain', 'TypeScript is not an MPEG stream');
		assert.strictEqual(mime('woff2'), 'font/woff2');
	});

	it('includeDot: false leaves the dot out', () => {
		for (const detail of randFileExtension({
			includeDot: false,
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.strictEqual(detail.extension, detail.name);
		}
	});

	it('category keeps to one kind of file or several', () => {
		for (const category of FILE_CATEGORIES) {
			assert.ok(
				randFileExtension({ category, count: SAMPLE, output: 'detail' }).every(
					(detail) => detail.category === category
				),
				category
			);
		}

		const two = randFileExtension({ category: ['code', 'data'], count: SAMPLE, output: 'detail' });

		assert.ok(two.every((detail) => detail.category === 'code' || detail.category === 'data'));
		assert.ok(
			randFileExtension({ category: 'nope' as never, count: SAMPLE, output: 'detail' }).some(
				(detail) => detail.category !== 'code'
			),
			'an unknown category reads as all of them'
		);
	});

	it('the common extensions come up most often', () => {
		const extensions = randFileExtension({ count: LARGE });
		const share = (extension: string) =>
			extensions.filter((each) => each === extension).length / extensions.length;

		assert.ok(share('.pdf') > share('.wpd'));
		assert.ok(share('.png') > share('.psd'));
		assert.ok(share('.pdf') > 0.01 && share('.pdf') < 0.04);
	});

	it('unique never repeats an extension', () => {
		const found = randFileExtension({ category: 'image', unique: true, count: 100 });
		const images = FILE_EXTENSIONS.filter((entry) => entry.category === 'image').length;

		assert.strictEqual(new Set(found).size, found.length);
		assert.ok(found.length > 8 && found.length <= images);
	});
});
