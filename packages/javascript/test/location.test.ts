import assert from 'assert';
import { describe, it } from 'node:test';
import {
	LOCATION_LANGUAGES,
	RAND_COUNT_MAX,
	WORD_LANGUAGES,
	randCity,
	randCountry,
	randDistrict,
	randLocation,
	randRegion
} from '../dist/index.js';
import type {
	LocationDetail,
	LocationLanguage,
	LocationLevel,
	WordLanguage
} from '../dist/index.js';
// The datasets are internal, but a location is only real if it is one of theirs —
// these are what tie the output back to the outline each language ships.
import { outline } from '../dist/_internal/parse.js';
import { COUNTRIES } from '../dist/location/data/countries.js';
import { LOCATION_DATA } from '../dist/location/data/index.js';

const SAMPLE = 60;

// What one division's name may be written with. Korean names carry a digit where
// the division does (`종로1가`); US names carry the punctuation their own
// official names do (`O'Fallon`, `Winston-Salem`, `St. Louis`).
const NAME: Record<LocationLanguage, RegExp> = {
	ko: /^[가-힣0-9]+(?: [가-힣0-9]+)?$/,
	en: /^[\p{Script=Latin}0-9 .,'()/-]+$/u
};

// The script a country's name opens on, per word language.
const OPENS: Record<WordLanguage, RegExp> = {
	en: /^\p{Script=Latin}/u,
	ko: /^[가-힣]/,
	ja: /^[぀-ヿ一-鿿]/,
	zh: /^[一-鿿]/,
	vi: /^\p{Script=Latin}/u,
	es: /^\p{Script=Latin}/u,
	it: /^\p{Script=Latin}/u,
	de: /^\p{Script=Latin}/u,
	ru: /^\p{Script=Cyrillic}/u
};

/** The country table as rows of `[code, name, name, …]`. */
const COUNTRY_ROWS = COUNTRIES.table
	.trim()
	.split('\n')
	.map((line: string) => line.trim().split('|'));

/** Every country's name in one language, by its code. */
function countriesIn(language: WordLanguage): Map<string, string> {
	const column = COUNTRIES.languages.indexOf(language) + 1;

	return new Map(COUNTRY_ROWS.map((row: string[]) => [row[0], row[column]]));
}

const DEPTH: Record<LocationLevel, number> = { country: 0, region: 1, city: 2, district: 3 };

type Place = { region: string; city: string | null; district: string | null };

/** Every division a language's outline holds, in the order it holds them. */
function placesOf(language: LocationLanguage): Place[] {
	const data = LOCATION_DATA[language];

	return outline(data.outline, data.levels.length).map((entry) => {
		const place: Place = { region: '', city: null, district: null };

		data.levels.forEach((level, depth) => {
			const name = entry.path[depth] ?? null;

			if (level === 'region') place.region = name ?? '';
			else place[level] = name;
		});

		return place;
	});
}

function keyOf(place: Place): string {
	return [place.region, place.city ?? '', place.district ?? ''].join('/');
}

const LISTED: Record<LocationLanguage, Place[]> = { ko: placesOf('ko'), en: placesOf('en') };

const PLACES: Record<LocationLanguage, Map<string, Place>> = {
	ko: new Map(LISTED.ko.map((place) => [keyOf(place), place])),
	en: new Map(LISTED.en.map((place) => [keyOf(place), place]))
};

/** What a detail writes out, rebuilt from its own levels. */
function written(detail: LocationDetail): string {
	const data = LOCATION_DATA[detail.language];
	const parts = [detail.country, detail.region, detail.city, detail.district].filter(
		(part): part is string => part !== null
	);

	return (data.order === 'largest-first' ? parts : parts.reverse()).join(data.joiner);
}

describe('Location', () => {
	it('randLocation returns one location by default', () => {
		const locations = randLocation();

		assert.strictEqual(locations.length, 1);
		assert.strictEqual(typeof locations[0], 'string');
	});

	it('every generator returns exactly `count` results', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randLocation({ count }).length, count);
			assert.strictEqual(randCountry({ count }).length, count);
			assert.strictEqual(randRegion({ count }).length, count);
			assert.strictEqual(randCity({ count }).length, count);
			assert.strictEqual(randDistrict({ count }).length, count);
		}

		assert.strictEqual(randLocation({ count: -3 }).length, 0);
		assert.strictEqual(randRegion({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('a location is written out from its own levels, in the order its language writes one', () => {
		for (const language of LOCATION_LANGUAGES) {
			for (const detail of randLocation({ language, count: SAMPLE, output: 'detail' })) {
				assert.strictEqual(detail.language, language);
				assert.strictEqual(detail.country, LOCATION_DATA[language].country);
				assert.strictEqual(detail.location, written(detail), detail.location);
			}
		}

		assert.match(randLocation({ language: 'ko' })[0], /^대한민국 /);
		assert.match(randLocation({ language: 'en' })[0], /, United States$/);
	});

	it('every division is one the dataset holds, inside the division written beside it', () => {
		for (const language of LOCATION_LANGUAGES) {
			for (const detail of randLocation({ language, count: SAMPLE * 5, output: 'detail' })) {
				const place = PLACES[language].get(keyOf(detail as Place));

				assert.ok(place, `${language}: ${detail.location} is not in the outline`);

				for (const name of [detail.region, detail.city, detail.district]) {
					if (name !== null) assert.match(name, NAME[language], detail.location);
				}
			}
		}
	});

	it('level says how far down a location goes, and stops at the deepest one its country has', () => {
		for (const level of ['country', 'region', 'city', 'district'] as const) {
			for (const detail of randLocation({
				language: 'ko',
				level,
				count: SAMPLE,
				output: 'detail'
			})) {
				// 세종특별자치시 has no 시·군·구, so a location asked for a city can stop at
				// the region; nothing ever goes past the level asked for.
				assert.ok(DEPTH[detail.level] <= DEPTH[level], detail.location);
				assert.strictEqual(detail.district === null, level !== 'district');
				assert.strictEqual(detail.region === null, level === 'country');
			}
		}

		for (const detail of randLocation({ language: 'en', count: SAMPLE, output: 'detail' })) {
			assert.strictEqual(detail.level, 'city');
			assert.strictEqual(detail.district, null);
		}

		assert.deepStrictEqual(randLocation({ language: 'en', level: 'country', count: 2 }), [
			'United States',
			'United States'
		]);
	});

	it('includeCountry: false writes a location without its country, and the detail keeps it', () => {
		for (const language of LOCATION_LANGUAGES) {
			const data = LOCATION_DATA[language];

			for (const detail of randLocation({
				language,
				includeCountry: false,
				count: SAMPLE,
				output: 'detail'
			})) {
				const parts = [detail.region, detail.city, detail.district].filter(
					(part): part is string => part !== null
				);

				assert.strictEqual(
					detail.location,
					(data.order === 'largest-first' ? parts : parts.reverse()).join(data.joiner)
				);
				assert.strictEqual(detail.country, data.country);
				assert.ok(!detail.location.includes(data.country), detail.location);
			}
		}

		// A location at the country level is the country, so it is written either way.
		assert.deepStrictEqual(
			randLocation({ language: 'en', level: 'country', includeCountry: false }),
			['United States']
		);

		// `startsWith` and the length options read the string that is written.
		for (const location of randLocation({
			language: 'ko',
			includeCountry: false,
			startsWith: '서',
			count: SAMPLE
		})) {
			assert.match(location, /^서울특별시 /);
		}

		for (const location of randLocation({
			language: 'ko',
			includeCountry: false,
			maxLength: 10,
			count: SAMPLE
		})) {
			assert.ok(location.length <= 10, location);
		}
	});

	it('a region with no city is still a location at the city level', () => {
		// Every city-level location of that exact length, which is few enough for the
		// draws `unique` allows to reach all of them.
		const locations = randLocation({
			language: 'ko',
			level: 'city',
			minLength: '대한민국 세종특별자치시'.length,
			maxLength: '대한민국 세종특별자치시'.length,
			unique: true,
			count: 1000
		});

		assert.ok(locations.includes('대한민국 세종특별자치시'));
	});

	it('each level has a generator of its own, and it hands back that level alone', () => {
		const generators = { region: randRegion, city: randCity, district: randDistrict } as const;

		for (const [level, generate] of Object.entries(generators)) {
			for (const detail of generate({ count: SAMPLE, output: 'detail' })) {
				assert.strictEqual(detail.level, level);
				assert.strictEqual(detail.location, detail[level as keyof typeof generators]);
				assert.ok(PLACES[detail.language].has(keyOf(detail as Place)), detail.location);
			}
		}
	});

	it('randCountry names every ISO 3166-1 country, in every word language', () => {
		assert.strictEqual(COUNTRY_ROWS.length, 249);
		assert.strictEqual(new Set(COUNTRY_ROWS.map((row: string[]) => row[0])).size, 249);
		assert.deepStrictEqual([...COUNTRIES.languages].sort(), [...WORD_LANGUAGES].sort());

		for (const row of COUNTRY_ROWS) {
			assert.match(row[0], /^[A-Z]{2}$/);
			assert.strictEqual(row.length, COUNTRIES.languages.length + 1, row[0]);
		}

		for (const language of WORD_LANGUAGES) {
			const named = countriesIn(language);

			for (const detail of randCountry({ language, count: SAMPLE, output: 'detail' })) {
				assert.strictEqual(detail.language, language);
				assert.strictEqual(named.get(detail.code), detail.country, `${language}: ${detail.code}`);
				assert.match(detail.country, OPENS[language], detail.country);
			}

			// Unique by name, and two countries a language names alike would be one.
			assert.strictEqual(
				randCountry({ language, unique: true, count: 300 }).length,
				new Set(named.values()).size
			);
		}
	});

	it('randCountry mixes every word language, not only the ones with divisions', () => {
		const languages = new Set(randCountry({ count: 300, output: 'detail' }).map((d) => d.language));

		assert.deepStrictEqual([...languages].sort(), [...WORD_LANGUAGES].sort());
		assert.deepStrictEqual(
			randCountry({ language: 'de', startsWith: 'Ö', count: 3, unique: true }),
			['Österreich']
		);

		for (const name of randCountry({ language: 'ru', maxLength: 5, count: SAMPLE })) {
			assert.ok(name.length <= 5, name);
		}
	});

	it('a location opens on the name the country table gives its country', () => {
		// `randLocation` and `randCountry` read one table, so they cannot spell a country two ways.
		assert.strictEqual(LOCATION_DATA.ko.country, countriesIn('ko').get('KR'));
		assert.strictEqual(LOCATION_DATA.en.country, countriesIn('en').get('US'));
		assert.deepStrictEqual(randLocation({ language: 'ko', level: 'country' }), ['대한민국']);
	});

	it('a level the country does not have is answered with nothing, and `all` skips that country', () => {
		assert.deepStrictEqual(randDistrict({ language: 'en', count: 5 }), []);

		for (const detail of randDistrict({ count: SAMPLE, output: 'detail' })) {
			assert.strictEqual(detail.language, 'ko');
		}
	});

	it('the mixed language uses every language it knows', () => {
		const languages = new Set(randCity({ count: SAMPLE, output: 'detail' }).map((d) => d.language));

		assert.deepStrictEqual([...languages].sort(), [...LOCATION_LANGUAGES].sort());
	});

	it('an unknown language or level falls back to the default', () => {
		const detail = randLocation({
			language: 'ja' as never,
			level: 'street' as never,
			output: 'detail'
		})[0];

		assert.ok(LOCATION_LANGUAGES.includes(detail.language));
		assert.strictEqual(detail.level === 'district' || detail.language === 'en', true);
	});

	it('startsWith leads every result with the requested character', () => {
		for (const city of randCity({ language: 'en', startsWith: 'Z', count: SAMPLE })) {
			assert.match(city, /^Z/);
		}

		for (const district of randDistrict({ startsWith: '역', count: SAMPLE })) {
			assert.match(district, /^역/);
		}

		// Matched without regard to case, the way every generator matches it.
		assert.match(randRegion({ language: 'en', startsWith: 'n' })[0], /^N/);
	});

	it('a startsWith no language can write, or no division begins with, is answered with nothing', () => {
		assert.deepStrictEqual(randLocation({ language: 'ko', startsWith: 'Q' }), []);
		assert.deepStrictEqual(randCity({ startsWith: 'ж' }), []);
		// Every Korean location opens on the country, so no other character can lead one.
		assert.deepStrictEqual(randLocation({ language: 'ko', startsWith: '서' }), []);
		// And a language that cannot answer is out before a draw, rather than half the draws.
		assert.strictEqual(randCity({ startsWith: 'Z', count: 10 }).length, 10);
	});

	it('results stay inside the requested length range', () => {
		for (const city of randCity({ language: 'en', minLength: 5, maxLength: 6, count: SAMPLE })) {
			assert.ok(city.length >= 5 && city.length <= 6, city);
		}

		for (const location of randLocation({ language: 'ko', maxLength: 16, count: SAMPLE })) {
			assert.ok(location.length <= 16, location);
		}
	});

	it('a range nothing fits is answered with the closest division, not with none', () => {
		const longest = LISTED.en.reduce((most, place) => Math.max(most, place.city?.length ?? 0), 0);

		for (const city of randCity({ language: 'en', minLength: 60, count: 5 })) {
			assert.strictEqual(city.length, longest);
		}

		// An overshoot is worse than an undershoot of the same size.
		for (const region of randRegion({ language: 'ko', maxLength: 2, count: 5 })) {
			assert.strictEqual(region.length, 3, region);
		}
	});

	it('unique never repeats a result, and stops when the pool runs out', () => {
		const regions = randRegion({ language: 'en', unique: true, count: SAMPLE });

		assert.strictEqual(new Set(regions).size, regions.length);
		assert.strictEqual(regions.length, 51);
	});

	it('the Korean dataset stops above the 리, and writes a city district after its city', () => {
		const places = LISTED.ko;
		const regions = places.filter((place) => place.city === null && place.district === null);
		const cities = new Set(places.map((place) => place.city).filter(Boolean));

		assert.strictEqual(regions.length, 16);

		for (const place of places) {
			if (place.district) assert.match(place.district, /(?:동|읍|면|가|로)$/, place.district);
			if (place.district) assert.doesNotMatch(place.district, /리$|출장소/, place.district);
		}

		for (const city of cities) {
			// `수원시장안구` is how the file writes it and not how an address does.
			assert.doesNotMatch(city!, /시\S+구$/, city!);
		}

		assert.ok(cities.has('수원시 장안구'));
		// 세종특별자치시 has no 시·군·구, and its 읍·면·동 sit directly under it.
		assert.ok(
			places.some(
				(place) => place.region === '세종특별자치시' && place.city === null && place.district
			)
		);
		assert.ok(!places.some((place) => place.region === '세종특별자치시' && place.city !== null));
	});

	it('the US dataset is the fifty states and DC, with each place named the way it is called', () => {
		const places = LISTED.en;
		const regions = new Set(places.map((place) => place.region));

		assert.strictEqual(regions.size, 51);
		assert.ok(regions.has('District of Columbia'));
		assert.ok(!regions.has('Puerto Rico'));

		const seen = new Set<string>();

		for (const place of places) {
			if (!place.city) continue;

			assert.doesNotMatch(
				place.city,
				/ (?:city|town|village|borough|CDP|municipality)$|\(balance\)/,
				place.city
			);

			const key = `${place.region}/${place.city}`;

			assert.ok(!seen.has(key), `${key} is listed twice`);
			seen.add(key);
		}
	});
});
