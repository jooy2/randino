import assert from 'assert';
import { describe, it } from 'node:test';
import { DEVICE_TYPES, RAND_COUNT_MAX, randDevice } from '../dist/index.js';
// Internal, but they are what a result is checked against.
import { DEVICES } from '../dist/device/data/index.js';
import { writeDevice } from '../dist/device/deviceGenerator.js';

const SAMPLE = 60;

describe('Device', () => {
	it('randDevice returns one device by default', () => {
		const devices = randDevice();

		assert.strictEqual(devices.length, 1);
		assert.strictEqual(typeof devices[0], 'string');
	});

	it('returns exactly `count` devices', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randDevice({ count }).length, count);
		}

		assert.strictEqual(randDevice({ count: -3 }).length, 0);
		assert.strictEqual(randDevice({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every device in the catalog is well formed', () => {
		const seen = new Set<string>();

		for (const entry of DEVICES) {
			const key = `${entry.vendor} ${entry.model}`;

			assert.ok(!seen.has(key), `${key} is listed twice`);
			seen.add(key);
			assert.ok(DEVICE_TYPES.includes(entry.type), key);
			assert.ok(entry.year >= 2007 && entry.year <= 2025, key);
			assert.ok(entry.vendor.length > 0 && entry.model.length > 0, key);
			// A cell is trimmed, so a name never carries a stray space at either end.
			assert.strictEqual(entry.model, entry.model.trim(), key);
		}

		for (const type of DEVICE_TYPES) {
			assert.ok(DEVICES.filter((entry) => entry.type === type).length >= 40, type);
		}
	});

	it('every device is one the catalog holds, written as its detail says', () => {
		const written = new Set(DEVICES.flatMap((entry) => [writeDevice(entry, true), entry.model]));

		for (const detail of randDevice({ count: SAMPLE * 5, output: 'detail' })) {
			const entry = DEVICES.find(
				(each) => each.vendor === detail.vendor && each.model === detail.model
			)!;

			assert.ok(entry, detail.device);
			assert.ok(written.has(detail.device), detail.device);
			assert.strictEqual(detail.device, writeDevice(entry, true));
			assert.strictEqual(detail.type, entry.type);
			assert.strictEqual(detail.year, entry.year);
		}
	});

	it('the maker is written once, and left out when asked', () => {
		for (const detail of randDevice({ count: SAMPLE * 5, output: 'detail' })) {
			assert.ok(detail.device.startsWith(detail.vendor), detail.device);
			assert.ok(!detail.device.startsWith(`${detail.vendor} ${detail.vendor}`), detail.device);
		}

		for (const detail of randDevice({
			includeVendor: false,
			count: SAMPLE * 5,
			output: 'detail'
		})) {
			assert.strictEqual(detail.device, detail.model);
		}

		// A model that opens on its maker's name is the same either way.
		const xiaomi = DEVICES.find((entry) => entry.model === 'Xiaomi 14')!;

		assert.strictEqual(writeDevice(xiaomi, true), 'Xiaomi 14');
		assert.strictEqual(writeDevice(xiaomi, false), 'Xiaomi 14');
	});

	it('type keeps to one kind of device, or to the kinds named', () => {
		for (const type of DEVICE_TYPES) {
			assert.ok(
				randDevice({ type, count: SAMPLE, output: 'detail' }).every((each) => each.type === type)
			);
		}

		const mobile = new Set(
			randDevice({ type: ['phone', 'tablet'], count: SAMPLE * 3, output: 'detail' }).map(
				(each) => each.type
			)
		);

		assert.deepStrictEqual([...mobile].sort(), ['phone', 'tablet']);

		const every = new Set(
			randDevice({ count: SAMPLE * 5, output: 'detail' }).map((each) => each.type)
		);

		assert.strictEqual(every.size, DEVICE_TYPES.length);
	});

	it('a year range keeps to the devices released in it', () => {
		for (const detail of randDevice({
			minYear: 2015,
			maxYear: 2018,
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			assert.ok(detail.year >= 2015 && detail.year <= 2018, `${detail.device} ${detail.year}`);
		}

		const asOf = randDevice({
			type: 'phone',
			maxYear: 2010,
			unique: true,
			count: 100,
			includeVendor: false
		});

		assert.ok(asOf.includes('iPhone'));
		assert.ok(!asOf.includes('iPhone 4S'));
	});

	it('a year range nothing came out in answers with nothing', () => {
		assert.deepStrictEqual(randDevice({ maxYear: 2000, count: 5 }), []);
		assert.deepStrictEqual(randDevice({ minYear: 2030, count: 5 }), []);
		// The first laptop in the catalog is the 2008 MacBook Air.
		assert.deepStrictEqual(randDevice({ type: 'laptop', maxYear: 2007 }), []);
	});

	it('a year range the wrong way round keeps maxYear', () => {
		for (const detail of randDevice({
			minYear: 2024,
			maxYear: 2016,
			count: SAMPLE,
			output: 'detail'
		})) {
			assert.strictEqual(detail.year, 2016, detail.device);
		}
	});

	it('the value form is the device of each detail', () => {
		const seeded = () => {
			let state = 7;

			return () => {
				state = (state * 48271) % 2147483647;

				return state / 2147483647;
			};
		};

		assert.deepStrictEqual(
			randDevice({ count: SAMPLE, random: seeded() }),
			randDevice({ count: SAMPLE, random: seeded(), output: 'detail' }).map((each) => each.device)
		);
	});

	it('unique never repeats a device, and stops when the devices run out', () => {
		const expected = DEVICES.filter((entry) => entry.type === 'laptop' && entry.year === 2025);
		const devices = randDevice({ type: 'laptop', minYear: 2025, unique: true, count: 100 });

		assert.strictEqual(new Set(devices).size, devices.length);
		assert.deepStrictEqual(
			[...devices].sort(),
			expected.map((entry) => writeDevice(entry, true)).sort()
		);
	});
});
