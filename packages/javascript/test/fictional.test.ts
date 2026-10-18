import assert from 'assert';
import { describe, it } from 'node:test';
import {
	RAND_COUNT_MAX,
	WORD_LANGUAGES,
	randFictionalCity,
	randFictionalCountry,
	randFictionalDistrict,
	randFictionalName,
	randFictionalRegion
} from '../dist/index.js';
import type {
	FictionalPlaceDetail,
	FictionalPlaceKind,
	LocationLevel,
	RandFictionalPlaceOptions,
	WordLanguage
} from '../dist/index.js';
// The datasets are internal, but a name is only well formed if it is spelled out
// of them — these are what tie the output back to them.
import {
	FICTIONAL_AVOID,
	FICTIONAL_AVOID_INSIDE,
	FICTIONAL_COMPOUNDS,
	FICTIONAL_GIVEN_NAMES,
	FICTIONAL_KINDS,
	FICTIONAL_PLACE_ENDINGS,
	FICTIONAL_PLACES,
	FICTIONAL_SURNAMES,
	FICTIONAL_SYLLABLES
} from '../dist/fictional/data/index.js';
import { compose, halvesFor, pools } from '../dist/fictional/pools.js';
import { joinParts, joinable, spelledRows } from '../dist/fictional/spelling.js';
import type { Spelling } from '../dist/fictional/spelling.js';
import { COUNTRIES } from '../dist/location/data/countries.js';
import { rows, words } from '../dist/_internal/parse.js';

const SAMPLE = 60;

const PLACES: Record<LocationLevel, (options?: RandFictionalPlaceOptions) => string[]> = {
	country: randFictionalCountry,
	region: randFictionalRegion,
	city: randFictionalCity,
	district: randFictionalDistrict
};

const LEVELS = Object.keys(PLACES) as LocationLevel[];

const placeDetails = (level: LocationLevel, options: RandFictionalPlaceOptions) =>
	PLACES[level]({
		...options,
		output: 'detail'
	} as RandFictionalPlaceOptions) as unknown as FictionalPlaceDetail[];

/** A source that makes the same draws every time it is made, for comparing two calls. */
function seeded(seed = 7): () => number {
	let state = seed;

	return () => {
		state = (state * 48271) % 2147483647;

		return state / 2147483647;
	};
}

// What a whole fictional name or place may hold, per language: the script, and
// the joiners and marks that script writes between and inside names.
const SCRIPT: Record<WordLanguage, RegExp> = {
	en: /^[A-Za-z' -]+$/,
	vi: /^[A-Za-zÀ-ỹ' -]+$/,
	es: /^[A-Za-zÁÉÍÓÚáéíóúñÑü' -]+$/,
	it: /^[A-Za-zÀ-ÿ' -]+$/,
	de: /^[A-Za-zÄÖÜäöüß' -]+$/,
	ko: /^[가-힣 ]+$/,
	ja: /^[ぁ-ゖァ-ヶー・一-龯]+$/,
	zh: /^[一-鿿·]+$/,
	ru: /^[А-Яа-яЁё -]+$/
};

// The column each script is in, and the pattern every spelling in it matches.
const SPELLING: readonly RegExp[] = [
	/^[A-Za-z]+$/,
	/^[가-힣]+$/,
	/^[ァ-ヶー]+$/,
	/^[一-鿿]+$/,
	/^[А-Яа-яЁё]+$/
];

const LATIN_LANGUAGES: readonly WordLanguage[] = ['en', 'vi', 'es', 'it', 'de'];

// Characters and places a well-known game, film or book made up, which no name
// may come out as. Not exhaustive — no list could be — but every one of them is
// a name a reader would recognize, and the datasets are checked against all of
// them.
const FAMOUS = new Set(
	words(`
	Aragorn Arwen Legolas Gandalf Frodo Bilbo Samwise Boromir Faramir Galadriel Elrond
	Saruman Sauron Gimli Eowyn Theoden Denethor Isildur Elendil Thranduil Gollum Smaug
	Daenerys Tyrion Cersei Jaime Sansa Arya Eddard Catelyn Joffrey Stannis Renly
	Viserys Rhaegar Aegon Jorah Davos Brienne Tormund Ygritte Margaery Olenna Loras
	Oberyn Tywin Varys Petyr Sandor Gregor Ramsay Melisandre Missandei
	Geralt Yennefer Ciri Triss Jaskier Vesemir Eskel Regis Emhyr
	Arthas Jaina Thrall Sylvanas Illidan Tyrande Malfurion Uther Anduin Varian Garrosh
	Medivh Khadgar Kaelthas Guldan Nerzhul Ragnaros Deathwing Alexstrasza
	Zelda Ganondorf Midna Impa Saria Mipha Revali Urbosa Sidon Hylia
	Aerith Tifa Sephiroth Squall Rinoa Zidane Tidus Yuna Lightning Noctis Lunafreya
	Riven Garen Draven Ezreal Katarina Lissandra Sejuani Syndra Kassadin
	Rosaria Mondstadt Liyue Inazuma Sumeru Fontaine Natlan Snezhnaya Teyvat
	Westeros Essos Winterfell Riverrun Highgarden Dorne Braavos Meereen Pentos
	Mordor Gondor Rohan Rivendell Isengard Moria Erebor Mirkwood Lothlorien Eriador Arnor
	Hyrule Termina Azeroth Stormwind Ironforge Orgrimmar Lordaeron Kalimdor Northrend
	Pandaria Draenor Dalaran Gilneas Stromgarde Duskwood Westfall Redridge Goldshire
	Moonbrook Lakeshire Northshire Darkshire Ashenvale Silverpine Winterspring
	Tamriel Skyrim Cyrodiil Morrowind Whiterun Riverwood Falkreath Windhelm Riften
	Markarth Winterhold Dawnstar Narnia Hogwarts Hogsmeade Temeria Nilfgaard Novigrad
	Redania Kaedwen Cintra Rivia Toussaint Ferelden Orlais Kirkwall Thedas Tevinter
	Faerun Waterdeep Neverwinter Eberron Krynn Golarion Tristram Westmarch Kurast
	Midgar Spira Ivalice Zanarkand Alexandria Lindblum Eorzea Ishgard
	Demacia Noxus Ionia Piltover Zaun Bilgewater Freljord Shurima Runeterra Valoran
	Fodlan Adrestia Faerghus Ylisse Plegia Hoshido Nohr Elibe Lycia Magvel Tellius
	Kanto Johto Hoenn Sinnoh Unova Kalos Alola Galar Paldea Blackthorn Cherrygrove
	Snowpoint Mossdeep Lilycove Oldale Veilstone Postwick
	Tatooine Naboo Alderaan Coruscant Hoth Endor Dagobah Corellia Mandalore Arrakis
	Oakvale Bowerstone Brightwall Albion Ravenholm Stormveil Limgrave Liurnia Caelid
	Hollywood Riverdale Smallville Gotham Springfield Sunnydale
`).map((name) => name.toLowerCase())
);

// Words no name may hold anywhere in it, in any script. The syllables and halves
// are chosen so that none comes out; this is what keeps it so.
const PROFANE: readonly string[] = [
	'fuck',
	'shit',
	'cunt',
	'dick',
	'cock',
	'anal',
	'anus',
	'piss',
	'slut',
	'whore',
	'nazi',
	'rape',
	'nigg',
	'fag',
	'tit',
	'cum',
	'porn',
	'시발',
	'씨발',
	'병신',
	'좆',
	'보지',
	'자지',
	'새끼',
	'존나',
	'섹스',
	'チンコ',
	'マンコ',
	'ウンコ',
	'セックス',
	'死',
	'屎',
	'尿',
	'屁',
	'粪',
	'妓',
	'奸',
	'淫',
	'贱',
	'хуй',
	'хуе',
	'пизд',
	'бля',
	'ебл',
	'ебал',
	'жоп',
	'сук',
	'срал',
	'говн',
	'мудак',
	'пидор',
	'дерьм'
];

// Every country's name in every word language, which no invented name may be.
const COUNTRY_NAMES: readonly Set<string>[] = (() => {
	const byScript = [
		new Set<string>(),
		new Set<string>(),
		new Set<string>(),
		new Set<string>(),
		new Set<string>()
	];
	const columns: Record<string, number> = {
		en: 0,
		vi: 0,
		es: 0,
		it: 0,
		de: 0,
		ko: 1,
		ja: 2,
		zh: 3,
		ru: 4
	};

	for (const cells of rows(COUNTRIES.table)) {
		COUNTRIES.languages.forEach((language, index) => {
			byScript[columns[language]].add(cells[index + 1].toLowerCase());
		});
	}

	return byScript;
})();

/** Every way `parts` can be joined into one word: one part from each list. */
function* everyWord(slots: readonly (readonly Spelling[])[]): Generator<Spelling[]> {
	if (!slots.length) {
		yield [];
		return;
	}

	for (const first of slots[0]) {
		for (const rest of everyWord(slots.slice(1))) {
			yield [first, ...rest];
		}
	}
}

/** Every shape an invented word can take, as the pools each of its parts is drawn from. */
function inventedShapes(): (readonly Spelling[])[][] {
	const { heads, middles, ends } = pools();
	const endings = spelledRows(FICTIONAL_PLACE_ENDINGS).map((row) => row.spelling);
	const shapes: (readonly Spelling[])[][] = [
		[heads, ends.male],
		[heads, middles, ends.male],
		[heads, ends.female],
		[heads, middles, ends.female],
		[heads, endings],
		[heads, middles, endings]
	];

	for (const use of ['s', 'r', 'c', 'd']) {
		const { fronts, backs } = halvesFor(use);

		shapes.push([fronts, backs]);
	}

	return shapes;
}

/**
 * Every word the shapes spell when their parts can be joined, before anything is
 * kept out, and the words the generators actually invent — the ones `compose`
 * keeps.
 */
const { joined: JOINED, invented: INVENTED } = (() => {
	const joined: Spelling[] = [];
	const invented: Spelling[] = [];

	for (const shape of inventedShapes()) {
		for (const parts of everyWord(shape)) {
			const latin = parts.map((part) => part[0]);

			if (shape.length === 2 && latin[0] === latin[1]) continue;
			if (!latin.every((part, i) => i === 0 || joinable(latin[i - 1], part))) continue;

			joined.push(joinParts(parts));

			const word = compose(parts);

			if (word) invented.push(word);
		}
	}

	return { joined, invented };
})();

/** What is wrong with a word, or `null` when nothing is. */
function problemWith(word: Spelling): string | null {
	for (let script = 0; script < 5; script += 1) {
		const text = word[script].toLowerCase();

		if (COUNTRY_NAMES[script].has(text)) return `${word[0]}: ${word[script]} is a country`;
		if (PROFANE.some((bad) => text.includes(bad))) {
			return `${word[0]}: ${word[script]} holds a word it must not`;
		}
	}

	if (FAMOUS.has(word[0].toLowerCase())) return `${word[0]} is a famous fictional name`;

	return null;
}

describe('Fictional names', () => {
	it('returns exactly `count` names, one by default', () => {
		assert.strictEqual(randFictionalName().length, 1);

		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randFictionalName({ count }).length, count);
		}

		assert.strictEqual(randFictionalName({ count: -3 }).length, 0);
		assert.strictEqual(randFictionalName({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
		assert.strictEqual(randFictionalName(null as never).length, 1);
	});

	it('writes each language in its own script', () => {
		for (const language of WORD_LANGUAGES) {
			for (const realism of ['real', 'invented'] as const) {
				for (const name of randFictionalName({
					language,
					realism,
					includeSurname: true,
					count: SAMPLE
				})) {
					assert.match(name, SCRIPT[language], `${language} ${name}`);
				}
			}
		}
	});

	it('writes a name in Latin letters the same way in every language that uses them', () => {
		for (const detail of randFictionalName({
			language: 'all',
			includeSurname: true,
			realism: 'mixed',
			count: SAMPLE,
			output: 'detail'
		})) {
			for (const language of LATIN_LANGUAGES) {
				assert.strictEqual(detail.forms[language], detail.forms.en);
			}
		}
	});

	it('a list returns every name in every language of it, keyed in the order asked', () => {
		const asked = ['ru', 'ko', 'en', 'ja'] as const;
		const forms = randFictionalName({ language: asked, includeSurname: true, count: SAMPLE });

		assert.strictEqual(forms.length, SAMPLE);

		for (const form of forms) {
			assert.deepStrictEqual(Object.keys(form), asked);

			for (const language of asked) {
				assert.match(form[language], SCRIPT[language], `${language} ${form[language]}`);
			}
		}

		// The detail is the same, drawn in the first language of the list.
		for (const detail of randFictionalName({ language: asked, count: SAMPLE, output: 'detail' })) {
			assert.deepStrictEqual(Object.keys(detail.forms), asked);
			assert.strictEqual(detail.language, 'ru');
			assert.strictEqual(detail.name, detail.forms.ru);
		}

		// One language, and `'all'`, are strings, and `'all'` draws a language per name.
		const seen = new Set<WordLanguage>();

		for (const detail of randFictionalName({ count: SAMPLE, output: 'detail' })) {
			assert.deepStrictEqual(Object.keys(detail.forms), [...WORD_LANGUAGES]);
			assert.strictEqual(detail.name, detail.forms[detail.language]);
			seen.add(detail.language);
		}

		assert.ok(seen.size > 1);
		assert.ok(randFictionalName({ count: 5 }).every((name) => typeof name === 'string'));
		assert.deepStrictEqual(
			Object.keys(randFictionalName({ language: 'ko', output: 'detail' })[0].forms),
			['ko']
		);
	});

	it('reads an unknown or empty language list as every language, and a repeated one once', () => {
		assert.deepStrictEqual(Object.keys(randFictionalName({ language: [] })[0]), [
			...WORD_LANGUAGES
		]);
		assert.deepStrictEqual(
			Object.keys(randFictionalName({ language: 'xx' as never, output: 'detail' })[0].forms),
			[...WORD_LANGUAGES]
		);
		assert.deepStrictEqual(Object.keys(randFictionalName({ language: ['ko', 'ko', 'en'] })[0]), [
			'ko',
			'en'
		]);
	});

	it('`realism: real` draws given names and surnames from the pools, of the right gender', () => {
		const { given, surnames } = pools();
		const latin = (pool: readonly Spelling[]) => new Set(pool.map((entry) => entry[0]));
		const male = latin(given.male);
		const female = latin(given.female);
		const family = latin(surnames);

		for (const gender of ['male', 'female'] as const) {
			for (const detail of randFictionalName({
				language: 'en',
				gender,
				includeSurname: true,
				count: SAMPLE,
				output: 'detail'
			})) {
				const [first, last] = detail.name.split(' ');

				assert.strictEqual(detail.gender, gender);
				assert.ok((gender === 'male' ? male : female).has(first), first);
				assert.ok(family.has(last), last);
			}
		}
	});

	it('writes a surname apart from the given name the way each script does', () => {
		const joiners: Partial<Record<WordLanguage, string>> = { ja: '・', zh: '·' };

		for (const language of WORD_LANGUAGES) {
			for (const name of randFictionalName({ language, includeSurname: true, count: SAMPLE })) {
				assert.strictEqual(name.split(joiners[language] ?? ' ').length, 2, name);
			}

			for (const name of randFictionalName({ language, count: SAMPLE })) {
				assert.ok(!name.includes(joiners[language] ?? ' '), name);
			}
		}
	});

	it('`startsWith` is the first character in the language the name is written in', () => {
		for (const [language, prefix] of [
			['en', 'A'],
			['ko', '아'],
			['ru', 'Э'],
			['zh', '阿']
		] as const) {
			for (const realism of ['real', 'mixed', 'invented'] as const) {
				const names = randFictionalName({ language, startsWith: prefix, realism, count: SAMPLE });

				assert.strictEqual(names.length, SAMPLE);

				for (const name of names) {
					assert.ok(name.startsWith(prefix), `${language} ${realism} ${name}`);
				}
			}
		}

		// Japanese spells a made-up name in katakana, so a hiragana prefix is read as one.
		for (const name of randFictionalName({ language: 'ja', startsWith: 'あ', count: SAMPLE })) {
			assert.ok(name.startsWith('ア'), name);
		}

		// A character no language writes is answered with nothing.
		assert.deepStrictEqual(randFictionalName({ startsWith: '!', count: 3 }), []);
		// A language that does not write it is left out of `'all'`.
		for (const detail of randFictionalName({ startsWith: 'B', count: SAMPLE, output: 'detail' })) {
			assert.ok(['en', 'vi', 'es', 'it', 'de'].includes(detail.language), detail.language);
		}

		// A list is read in its first language, and the rest only write the name.
		for (const form of randFictionalName({
			language: ['ko', 'en'],
			startsWith: '아',
			count: SAMPLE
		})) {
			assert.ok(form.ko.startsWith('아'), form.ko);
		}

		assert.deepStrictEqual(
			randFictionalName({ language: ['ko', 'en'], startsWith: 'B', count: 3 }),
			[]
		);
	});

	it('keeps to a length range the pools can meet', () => {
		for (const language of WORD_LANGUAGES) {
			for (const name of randFictionalName({
				language,
				minLength: 4,
				maxLength: 6,
				count: SAMPLE
			})) {
				assert.ok(name.length >= 4 && name.length <= 6, `${language} ${name}`);
			}
		}

		for (const name of randFictionalName({ includeSurname: true, minLength: 18, count: SAMPLE })) {
			assert.ok(name.length >= 18, name);
		}

		// Only the CJK languages write a name of two characters.
		for (const detail of randFictionalName({ maxLength: 2, count: SAMPLE, output: 'detail' })) {
			assert.ok(detail.name.length <= 2, detail.name);
		}

		// A list is measured in its first language, whatever the rest come out at.
		for (const form of randFictionalName({ language: ['ko', 'en'], maxLength: 2, count: SAMPLE })) {
			assert.ok(form.ko.length <= 2, form.ko);
		}
	});

	it('`unique` never returns the same name twice, in any language', () => {
		const details = randFictionalName({
			language: ['en', 'ko'],
			unique: true,
			count: 500,
			output: 'detail'
		});
		const keys = details.map((detail) => detail.forms.en);

		assert.strictEqual(new Set(keys).size, keys.length);
		// The pools hold fewer than five hundred, so it stops when they run out.
		assert.strictEqual(details.length, pools().given.male.length + pools().given.female.length);
	});

	it('a seeded source draws the same names twice', () => {
		const first = randFictionalName({
			count: 20,
			realism: 'mixed',
			includeSurname: true,
			random: seeded()
		});
		const second = randFictionalName({
			count: 20,
			realism: 'mixed',
			includeSurname: true,
			random: seeded()
		});

		assert.deepStrictEqual(first, second);
	});
});

const kinds = rows(FICTIONAL_KINDS);

describe('Fictional places', () => {
	const kindOf = new Map(kinds.map((cells) => [cells[0], cells]));
	const LETTER: Record<LocationLevel, string> = {
		country: 'n',
		region: 'r',
		city: 'c',
		district: 'd'
	};
	// The column of each language's templates, borrowed then translated.
	const COLUMN: Record<WordLanguage, [number, number]> = {
		en: [3, 3],
		ko: [4, 5],
		ja: [6, 7],
		zh: [8, 8],
		ru: [9, 10],
		vi: [3, 11],
		es: [3, 12],
		it: [3, 13],
		de: [3, 14]
	};

	it('returns exactly `count` places on every level', () => {
		for (const level of LEVELS) {
			assert.strictEqual(PLACES[level]().length, 1);
			assert.strictEqual(PLACES[level]({ count: 9 }).length, 9);
			assert.strictEqual(PLACES[level]({ count: -1 }).length, 0);
		}
	});

	it('a list returns every place in every language of it, keyed in the order asked', () => {
		const asked = ['zh', 'ko', 'es', 'en'] as const;

		for (const level of LEVELS) {
			const forms = PLACES[level]({
				language: asked,
				includeKind: true,
				count: SAMPLE
			}) as unknown as Record<(typeof asked)[number], string>[];

			assert.strictEqual(forms.length, SAMPLE);

			for (const form of forms) {
				assert.deepStrictEqual(Object.keys(form), asked);

				for (const language of asked) {
					assert.match(form[language], SCRIPT[language], `${level} ${language} ${form[language]}`);
				}
			}

			for (const detail of placeDetails(level, { language: asked, count: SAMPLE })) {
				assert.strictEqual(detail.language, 'zh');
				assert.strictEqual(detail.place, detail.forms.zh);
			}
		}

		// The function's own types follow the list: `form.ko` is a string.
		const [form] = randFictionalDistrict({ language: ['ko', 'en'] });

		assert.strictEqual(typeof form.ko, 'string');
		assert.strictEqual(typeof form.en, 'string');
	});

	it('writes each language in its own script', () => {
		for (const level of LEVELS) {
			for (const language of WORD_LANGUAGES) {
				for (const kindStyle of [undefined, 'borrowed', 'translated'] as const) {
					for (const place of PLACES[level]({
						language,
						kindStyle,
						realism: 'mixed',
						count: SAMPLE
					})) {
						assert.match(place, SCRIPT[language], `${level} ${language} ${place}`);
					}
				}
			}
		}
	});

	it('is the name written into the template its kind and language have', () => {
		for (const level of LEVELS) {
			for (const kindStyle of [undefined, 'borrowed', 'translated'] as const) {
				for (const detail of placeDetails(level, {
					kindStyle,
					includeKind: true,
					realism: 'mixed',
					count: SAMPLE
				})) {
					const cells = kindOf.get(detail.kind!)!;

					assert.ok(cells[1].includes(LETTER[level]), `${detail.kind} on ${level}`);

					for (const [code, place] of Object.entries(detail.forms) as [WordLanguage, string][]) {
						const borrowed = kindStyle ? kindStyle === 'borrowed' : cells[2] === 'borrowed';
						const template = cells[COLUMN[code][borrowed ? 0 : 1]];
						const name = detail.language === code ? detail.name : null;

						assert.ok(template.includes('{}'));

						const [before, after] = template.split('{}');

						assert.ok(place.startsWith(before) && place.endsWith(after), `${template} ${place}`);

						if (name) {
							assert.strictEqual(place, before + name + after);
						}
					}
				}
			}
		}
	});

	it('writes a country’s kind translated and a district’s borrowed, unless told otherwise', () => {
		const country = placeDetails('country', { language: 'ko', includeKind: true, count: SAMPLE });
		const district = placeDetails('district', { language: 'ko', includeKind: true, count: SAMPLE });

		assert.ok(country.some((detail) => /(왕국|제국|공화국|공국|연방)$/.test(detail.place)));
		assert.ok(district.some((detail) => /(파크|베이|힐스|스퀘어|마켓)$/.test(detail.place)));
		assert.ok(
			placeDetails('country', {
				language: 'ko',
				includeKind: true,
				kindStyle: 'borrowed',
				count: SAMPLE
			}).some((detail) => / (킹덤|엠파이어|리퍼블릭)$/.test(detail.place))
		);
		assert.ok(
			placeDetails('district', {
				language: 'ko',
				includeKind: true,
				kindStyle: 'translated',
				count: SAMPLE
			}).some((detail) => / (공원|광장|시장)$|만$/.test(detail.place))
		);
	});

	it('`includeKind` decides the kind, and leaving it out leaves it to chance', () => {
		for (const level of LEVELS) {
			for (const detail of placeDetails(level, { includeKind: false, count: SAMPLE })) {
				assert.strictEqual(detail.kind, null);
				assert.strictEqual(detail.place, detail.name);
			}

			for (const detail of placeDetails(level, { includeKind: true, count: SAMPLE })) {
				assert.notStrictEqual(detail.kind, null);
				assert.notStrictEqual(detail.place, detail.name);
			}

			const mixed = placeDetails(level, { count: 200 });

			assert.ok(mixed.some((detail) => detail.kind === null));
			assert.ok(mixed.some((detail) => detail.kind !== null));
		}
	});

	it('never writes a kind its name already says', () => {
		for (const level of LEVELS) {
			for (const detail of placeDetails(level, { language: 'en', includeKind: true, count: 400 })) {
				assert.ok(
					!detail.name.toLowerCase().includes(detail.kind!.replace(/s$/, '')),
					detail.place
				);
			}
		}
	});

	it('`startsWith` reads the name, not the kind in front of it', () => {
		for (const level of LEVELS) {
			for (const detail of placeDetails(level, {
				language: 'en',
				startsWith: 'E',
				includeKind: true,
				count: SAMPLE
			})) {
				assert.ok(detail.name.startsWith('E'), detail.place);
			}

			for (const detail of placeDetails(level, {
				language: 'ko',
				startsWith: '에',
				count: SAMPLE
			})) {
				assert.ok(detail.name.startsWith('에'), detail.place);
			}
		}
	});

	it('keeps to a length range the pools can meet', () => {
		for (const level of LEVELS) {
			for (const language of ['en', 'ko', 'es', 'ru'] as const) {
				for (const place of PLACES[level]({
					language,
					minLength: 8,
					maxLength: 14,
					count: SAMPLE
				})) {
					assert.ok(place.length >= 8 && place.length <= 14, `${level} ${language} ${place}`);
				}
			}
		}
	});

	it('`unique` never returns the same place twice', () => {
		for (const level of LEVELS) {
			const details = placeDetails(level, { language: ['en', 'ja'], unique: true, count: 300 });
			const keys = details.map((detail) => `${detail.forms.en}`);

			assert.strictEqual(new Set(keys).size, keys.length);
		}
	});

	it('a seeded source draws the same places twice', () => {
		for (const level of LEVELS) {
			const options = { count: 20, realism: 'mixed', random: seeded(11) } as const;

			assert.deepStrictEqual(
				PLACES[level](options),
				PLACES[level]({ ...options, random: seeded(11) })
			);
		}
	});
});

describe('Fictional datasets', () => {
	it('spells every entry in all five scripts', () => {
		const tables = [
			FICTIONAL_GIVEN_NAMES,
			FICTIONAL_SURNAMES,
			FICTIONAL_SYLLABLES,
			FICTIONAL_PLACE_ENDINGS,
			FICTIONAL_COMPOUNDS,
			FICTIONAL_PLACES
		];

		for (const table of tables) {
			for (const { cells, spelling } of spelledRows(table)) {
				assert.ok(cells.length >= 0);
				spelling.forEach((text, script) => {
					assert.match(text, SPELLING[script], `${spelling.join(' | ')}`);
				});
			}
		}
	});

	it('holds no name twice within a pool', () => {
		const { given, surnames } = pools();

		for (const pool of [
			given.male,
			given.female,
			surnames,
			spelledRows(FICTIONAL_PLACES).map((row) => row.spelling)
		]) {
			const latin = pool.map((entry) => entry[0]);

			assert.strictEqual(
				new Set(latin).size,
				latin.length,
				latin.filter((each, i) => latin.indexOf(each) !== i).join()
			);
		}
	});

	it('holds between a hundred and three hundred given names of each gender', () => {
		const { given, surnames } = pools();

		for (const pool of [given.male, given.female]) {
			assert.ok(pool.length >= 100 && pool.length <= 300, String(pool.length));
		}

		assert.ok(surnames.length >= 100);
	});

	it('writes every kind on a level, in every language, with one place for the name', () => {
		const codes: FictionalPlaceKind[] = [];

		for (const cells of kinds) {
			assert.strictEqual(cells.length, 15, cells[0]);
			assert.ok(['borrowed', 'translated'].includes(cells[2]), cells[0]);
			assert.ok(/^[nrcd]+$/.test(cells[1]), cells[0]);

			for (const template of cells.slice(3)) {
				assert.strictEqual(template.split('{}').length, 2, `${cells[0]} ${template}`);
			}

			codes.push(cells[0] as FictionalPlaceKind);
		}

		assert.strictEqual(new Set(codes).size, codes.length);

		for (const letter of 'nrcd') {
			assert.ok(kinds.filter((cells) => cells[1].includes(letter)).length >= 10, letter);
		}
	});

	it('offers every level a hundred names or more, with the ones it invents', () => {
		const counts: Record<string, number> = { n: 0, r: 0, c: 0, d: pools().surnames.length };

		for (const { cells } of spelledRows(FICTIONAL_PLACES)) {
			for (const letter of cells[0]) counts[letter] += 1;
		}

		assert.ok(counts.n >= 100, `country ${counts.n}`);
		assert.ok(counts.r >= 100, `region ${counts.r}`);
		assert.ok(counts.c >= 90, `city ${counts.c}`);
		assert.ok(counts.d >= 100, `district ${counts.d}`);
	});

	it('holds no real country, famous fictional name or bad word among its own names', () => {
		const { given, surnames } = pools();
		const all = [
			...given.male,
			...given.female,
			...surnames,
			...spelledRows(FICTIONAL_PLACES).map((row) => row.spelling)
		];

		for (const entry of all) {
			assert.strictEqual(problemWith(entry), null);
		}
	});

	it('invents nothing that is a real country, a famous fictional name or a bad word', () => {
		const problems = new Set<string>();

		// The shapes are large enough that a name is worth inventing.
		assert.ok(INVENTED.length > 50000, String(INVENTED.length));

		for (const word of INVENTED) {
			const problem = problemWith(word);

			if (problem) problems.add(problem);
		}

		assert.deepStrictEqual([...problems], []);
	});

	it('keeps out only what the shapes can make', () => {
		const made = new Set(JOINED.map((word) => word[0].toLowerCase()));

		for (const word of words(FICTIONAL_AVOID)) {
			assert.ok(made.has(word.toLowerCase()), word);
		}

		for (const run of words(FICTIONAL_AVOID_INSIDE)) {
			assert.ok(
				JOINED.some((word) => word.some((spelling) => spelling.toLowerCase().includes(run))),
				run
			);
		}
	});

	it('spells a joined word the way each script spells it', () => {
		const join = (...latin: string[]) => {
			const { heads, middles, ends } = pools();
			const all = [...heads, ...middles, ...ends.male, ...ends.female];

			return joinParts(latin.map((part) => all.find((entry) => entry[0] === part)!));
		};

		assert.deepStrictEqual(join('ed', 'lyn'), ['Edlyn', '에들린', 'エドリン', '埃德琳', 'Эдлин']);
		assert.deepStrictEqual(join('a', 'lia'), ['Alia', '알리아', 'アリア', '阿莉娅', 'Алия']);
		assert.deepStrictEqual(join('va', 'le', 'ria'), [
			'Valeria',
			'발레리아',
			'ヴァレリア',
			'瓦莱莉娅',
			'Валерия'
		]);
		// An `r` is one `ㄹ` and an `l` two.
		assert.strictEqual(join('is', 'ra')[1], '이스라');
		assert.strictEqual(join('is', 'lia')[1], '이슬리아');
		assert.strictEqual(joinable('kal', 'lis'), false);
		assert.strictEqual(joinable('ash', 'ley'), false);
	});
});
