import assert from 'assert';
import { describe, it } from 'node:test';
import { RAND_COUNT_MAX, SYSTEM_PLATFORMS, randAppStore } from '../dist/index.js';
// Internal, but it is what a result is checked against.
import { APP_STORES } from '../dist/appstore/data/index.js';

const SAMPLE = 60;
const LARGE = 6000;

describe('App store', () => {
	it('randAppStore returns one store by default', () => {
		const stores = randAppStore();

		assert.strictEqual(stores.length, 1);
		assert.ok(APP_STORES.some((entry) => entry.full === stores[0]));
	});

	it('returns exactly `count` stores', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randAppStore({ count }).length, count);
		}

		assert.strictEqual(randAppStore({ count: -3 }).length, 0);
		assert.strictEqual(randAppStore({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every store is listed once, and each platform’s weights add up to a hundred', () => {
		const seen = new Set<string>();

		for (const entry of APP_STORES) {
			const key = `${entry.platform} ${entry.name}`;

			assert.ok(!seen.has(key), `${key} is listed twice`);
			seen.add(key);
			assert.ok(SYSTEM_PLATFORMS.includes(entry.platform), key);
			assert.ok(entry.weight > 0, key);
			assert.ok(entry.full.includes(entry.name), `${key}: the full name holds the name`);
		}

		for (const platform of SYSTEM_PLATFORMS) {
			const total = APP_STORES.filter((entry) => entry.platform === platform).reduce(
				(sum, entry) => sum + entry.weight,
				0
			);

			assert.strictEqual(total, 100, platform);
		}
	});

	it('every store is one the catalog holds, written by its full name or its own', () => {
		for (const detail of randAppStore({ count: SAMPLE * 5, output: 'detail' })) {
			const entry = APP_STORES.find(
				(each) => each.platform === detail.platform && each.name === detail.name
			);

			assert.ok(entry, detail.store);
			assert.strictEqual(detail.store, entry.full);
			assert.strictEqual(detail.company, entry.company);
		}

		for (const detail of randAppStore({ includeCompany: false, count: SAMPLE, output: 'detail' })) {
			assert.strictEqual(detail.store, detail.name);
		}
	});

	it('platform keeps to one kind of machine, and Google Play is never a desktop’s', () => {
		for (const platform of SYSTEM_PLATFORMS) {
			assert.ok(
				randAppStore({ platform, count: SAMPLE, output: 'detail' }).every(
					(detail) => detail.platform === platform
				)
			);
		}

		assert.ok(
			randAppStore({ platform: 'desktop', count: LARGE }).every(
				(store) => !store.includes('Google Play')
			)
		);

		const details = randAppStore({ count: LARGE, output: 'detail' });
		const desktop =
			details.filter((detail) => detail.platform === 'desktop').length / details.length;

		assert.ok(desktop > 0.45 && desktop < 0.55);
	});

	it('the common stores come up most often', () => {
		const phones = randAppStore({ platform: 'mobile', count: LARGE });
		const share = (store: string) => phones.filter((each) => each === store).length / phones.length;

		assert.ok(share('Google Play Store') > 0.38);
		assert.ok(share('Google Play Store') > share('Apple App Store'));
		assert.ok(share('Apple App Store') > share('Samsung Galaxy Store'));
		assert.ok(share('F-Droid') < 0.03);
	});

	it('unique never repeats a store', () => {
		const found = randAppStore({ unique: true, count: 100 });

		assert.strictEqual(new Set(found).size, found.length);
		assert.ok(found.length > 10 && found.length <= APP_STORES.length);
	});
});
