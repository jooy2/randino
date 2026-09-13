// Writes the location datasets of all three packages out of the official files.
//
// Every other dataset in this repository is written by hand in the JavaScript
// package and ported from there. The locations cannot be: they are thousands of
// real administrative divisions, and the only trustworthy copy of them is the one
// the country itself publishes. So this reads those files and writes the same
// outline into each package, then runs each package's formatter over it.
//
// Usage: node tools/location/index.mjs <sources directory>
//
// The directory holds the files `tools/location/README.md` lists, under the
// names it gives them. They are not committed: each is a download from the
// publisher, and the README records which one and its checksum.
//
// Needs `npm ci` in `packages/javascript`, the Dart SDK on the path, and an
// editable install of `packages/python` (for `ruff`).

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const here = (...parts) => join(ROOT, ...parts);

const sources = process.argv[2];

if (!sources) {
	console.error('Usage: node tools/location/index.mjs <sources directory>');
	process.exit(2);
}

function source(name) {
	const path = resolve(sources, name);

	if (!existsSync(path)) {
		console.error(`Missing ${path}. See tools/location/README.md for where it comes from.`);
		process.exit(2);
	}

	// Composed, so a name compares equal to the one a caller types: the Gazetteer
	// writes `Utqiaġvik` as a `g` and a combining dot.
	return readFileSync(path, 'utf8').replace(/^\uFEFF/, '').normalize('NFC');
}

/** Fails the run rather than writing a dataset built on a file that changed shape. */
function check(condition, message) {
	if (!condition) {
		console.error(`tools/location: ${message}`);
		process.exit(1);
	}
}

// --- South Korea ------------------------------------------------------------

/**
 * 국토교통부_전국 법정동 (data.go.kr 15063424): one row per legal division, from
 * the province down to the village, with the name of every level in its own
 * column. Only the rows down to 읍·면·동 are kept; a 리 is the level the
 * privacy rule stops above.
 */
function readKorea() {
	const lines = source('ko-legal-dong.csv').split(/\r?\n/).filter(Boolean);
	const header = lines.shift().split(',');

	check(
		header.join(',') === '법정동코드,시도명,시군구명,읍면동명,리명,순번,생성일자',
		`ko-legal-dong.csv has new columns: ${header.join(',')}`
	);

	const rows = lines.map((line) => {
		const cells = line.split(',');

		check(cells.length === header.length, `a Korean row does not have seven cells: ${line}`);

		return { code: cells[0], region: cells[1], city: cells[2], district: cells[3], village: cells[4] };
	});

	const kept = rows.filter((row) => !row.village);
	const regions = kept.filter((row) => !row.city && !row.district);
	const cities = kept.filter((row) => row.city && !row.district);
	const districts = kept.filter((row) => row.district);

	// A city with 일반구 holds no 읍·면·동 of its own; its districts do. The file
	// writes a district as the city's name with the district's run straight on
	// (`수원시장안구`), where an address writes `수원시 장안구`.
	const holding = new Set(districts.map((row) => `${row.region}/${row.city}`));
	const parents = cities.filter((row) => !holding.has(`${row.region}/${row.city}`));

	for (const parent of parents) {
		check(
			cities.some((row) => row.region === parent.region && row.city.startsWith(parent.city) && row.city !== parent.city),
			`${parent.region} ${parent.city} holds no 읍·면·동 and no 일반구`
		);
	}

	const parentOf = (row) =>
		parents.find((parent) => parent.region === row.region && row.city.startsWith(parent.city) && row.city !== parent.city);
	const cityName = (row) => {
		const parent = parentOf(row);

		return parent ? `${parent.city} ${row.city.slice(parent.city.length)}` : row.city;
	};

	// 세종특별자치시 has no 기초자치단체. The file still gives it a 시군구 row
	// (`세종시`), which an address never writes, so its 읍·면·동 sit directly under
	// the region.
	const cityless = new Set(['세종특별자치시']);
	const tree = [];

	for (const region of regions) {
		const node = { name: region.region, children: [] };
		const leaves = districts.filter((row) => row.region === region.region);

		if (cityless.has(region.region)) {
			node.leaves = leaves.map((row) => row.district);
		} else {
			for (const city of cities) {
				if (city.region !== region.region || parents.includes(city)) continue;

				node.children.push({
					name: cityName(city),
					leaves: leaves.filter((row) => row.city === city.city).map((row) => row.district)
				});
			}

			check(
				leaves.every((row) => node.children.some((city) => city.leaves.includes(row.district))),
				`${region.region} has a 읍·면·동 under no city`
			);
		}

		tree.push(node);
	}

	for (const row of districts) {
		check(/^[가-힣0-9]+$/.test(row.district), `unexpected 읍·면·동 name: ${row.district}`);
		check(!row.district.includes('출장소'), `a branch office is listed as a division: ${row.district}`);
	}

	return tree;
}

// --- United States ----------------------------------------------------------

// The suffix the Gazetteer's `NAME` carries for each legal/statistical area
// description, which a place is never called by.
const LSAD_SUFFIX = {
	21: ' borough',
	25: ' city',
	37: ' municipality',
	43: ' town',
	47: ' village',
	53: ' city and borough',
	57: ' CDP',
	CG: ' consolidated government',
	CN: ' corporation',
	MG: ' metropolitan government',
	UC: ' urban county',
	UG: ' unified government'
};

// `00` is a consolidated government's balance, or a place whose name carries no
// description. Its suffix, when there is one, is one of these.
const BALANCE_SUFFIXES = [
	' city',
	' consolidated government',
	' metro government',
	' metropolitan government',
	' unified government'
];

/**
 * 2026 Gazetteer places (census.gov): every incorporated place and census
 * designated place, one row each, with the state as a USPS code. The states are
 * the fifty and the District of Columbia; Puerto Rico and the Island Areas each
 * have their own ISO 3166 code and are not the United States' states.
 */
function readUnitedStates() {
	const states = source('us-states.txt')
		.split(/\r?\n/)
		.filter(Boolean)
		.slice(1)
		.map((line) => line.split('|'))
		.filter(([, fips]) => Number(fips) <= 56)
		.map(([usps, , , name]) => ({ usps, name }));

	check(states.length === 51, `expected 50 states and DC, found ${states.length}`);

	const lines = source('us-places.txt').split(/\r?\n/).filter(Boolean);
	const header = lines.shift().split('|');

	check(header.slice(0, 7).join('|') === 'USPS|GEOID|GEOIDFQ|ANSICODE|NAME|LSAD|FUNCSTAT', `us-places.txt has new columns: ${header.join('|')}`);

	const byState = new Map(states.map((state) => [state.usps, new Set()]));

	for (const line of lines) {
		const [usps, , , , raw, lsad] = line.split('|');
		const places = byState.get(usps);

		if (!places) continue;

		let name = raw;

		if (lsad === '00') {
			name = name.replace(/ \(balance\)$/, '');

			const suffix = BALANCE_SUFFIXES.find((each) => name.endsWith(each));

			if (suffix) name = name.slice(0, -suffix.length);
		} else {
			const suffix = LSAD_SUFFIX[lsad];

			check(suffix !== undefined, `unknown LSAD ${lsad} on ${raw}`);
			check(raw.endsWith(suffix), `${raw} does not end with its LSAD description "${suffix.trim()}"`);
			name = raw.slice(0, -suffix.length);
		}

		// A parenthesis can be part of the name (`Village of Oak Creek (Big Park)`); a
		// balance left over is not.
		check(name && !name.includes('(balance)'), `could not clean the place name ${raw}`);
		places.add(name);
	}

	const collator = new Intl.Collator('en');

	return states.map((state) => ({
		name: state.name,
		children: [],
		leaves: [...byState.get(state.usps)].sort(collator.compare)
	}));
}

// --- Writing ----------------------------------------------------------------

const COUNTRIES = [
	{
		code: 'ko',
		constant: 'KO',
		country: '대한민국',
		order: 'largest-first',
		joiner: ' ',
		levels: ['region', 'city', 'district'],
		from: '국토교통부_전국 법정동 (data.go.kr 15063424), updated 2026-07-29',
		read: readKorea
	},
	{
		code: 'en',
		constant: 'EN',
		country: 'United States',
		order: 'smallest-first',
		joiner: ', ',
		levels: ['region', 'city'],
		from: 'U.S. Census Bureau, 2026 Gazetteer places and 2020 state codes',
		read: readUnitedStates
	}
];

// Leaves are written as whitespace-separated pools, the way every other dataset
// is, so a line holds as many as fit here.
const LINE_WIDTH = 80;

/**
 * A name as one whitespace-free token: `_` stands for a space, the way `words`
 * reads it. A character that means something to the outline or to one of the
 * three string literals it is written into stops the run instead.
 */
function token(name) {
	check(
		name.trim() === name && !/[\t\n_#`$\\"]|'''|\s{2}/.test(name),
		`a name the outline cannot carry: ${JSON.stringify(name)}`
	);

	return name.replace(/ /g, '_');
}

/** The outline one dataset carries, indented the way its package indents. */
function outlineOf(tree, indent) {
	const out = [];
	const pool = (names) => {
		let line = '';

		for (const name of names) {
			const word = token(name);

			if (line && line.length + 1 + word.length > LINE_WIDTH) {
				out.push(indent + line);
				line = word;
			} else {
				line = line ? `${line} ${word}` : word;
			}
		}

		if (line) out.push(indent + line);
	};

	for (const region of tree) {
		out.push(`${indent}# ${token(region.name)}`);

		if (region.leaves) pool(region.leaves);

		for (const city of region.children) {
			out.push(`${indent}## ${token(city.name)}`);
			pool(city.leaves);
		}
	}

	return out.join('\n');
}

function count(tree) {
	let cities = 0;
	let leaves = 0;

	for (const region of tree) {
		leaves += region.leaves?.length ?? 0;
		cities += region.children.length;

		for (const city of region.children) leaves += city.leaves.length;
	}

	return { regions: tree.length, cities, leaves };
}

const GENERATED = 'Generated by `tools/location` from the publisher\'s own file. Do not edit by hand;';

function writeJavaScript(country, tree) {
	const body = [
		`// ${GENERATED}`,
		`// regenerate instead. Source: ${country.from}.`,
		'',
		"import type { LocationLanguageData } from './types.js';",
		'',
		`export const ${country.constant}: LocationLanguageData = {`,
		`\tcountry: '${country.country}',`,
		`\torder: '${country.order}',`,
		`\tjoiner: '${country.joiner}',`,
		`\tlevels: [${country.levels.map((level) => `'${level}'`).join(', ')}],`,
		'\toutline: `',
		outlineOf(tree, '\t\t'),
		'\t`',
		'};',
		''
	];

	writeFileSync(here(`packages/javascript/lib/location/data/${country.code}.ts`), body.join('\n'));
}

const DART_ORDER = { 'largest-first': 'largestFirst', 'smallest-first': 'smallestFirst' };

function writeDart(country, tree) {
	const body = [
		`// ${GENERATED}`,
		`// regenerate instead. Source: ${country.from}.`,
		'',
		"import 'package:randino/src/location/data/types.dart';",
		"import 'package:randino/src/types.dart';",
		'',
		`/// The ${country.country} location dataset.`,
		`final LocationLanguageData ${country.code} = LocationLanguageData(`,
		`  country: '${country.country}',`,
		`  order: LocationOrder.${DART_ORDER[country.order]},`,
		`  joiner: '${country.joiner}',`,
		`  levels: <LocationLevel>[${country.levels.map((level) => `LocationLevel.${level}`).join(', ')}],`,
		"  outline: r'''",
		outlineOf(tree, '    '),
		"  ''',",
		');',
		''
	];

	writeFileSync(here(`packages/dart/lib/src/location/data/${country.code}.dart`), body.join('\n'));
}

function writePython(country, tree) {
	const body = [
		`"""The ${country.country} location dataset.`,
		'',
		`${GENERATED} regenerate instead.`,
		`Source: ${country.from}.`,
		'"""',
		'',
		'from randino.location.data._types import LocationLanguageData',
		'',
		`${country.constant} = LocationLanguageData(`,
		`    country="${country.country}",`,
		`    order="${country.order}",`,
		`    joiner="${country.joiner}",`,
		`    levels=(${country.levels.map((level) => `"${level}"`).join(', ')}),`,
		'    outline="""',
		outlineOf(tree, '        '),
		'    """,',
		')',
		''
	];

	writeFileSync(here(`packages/python/src/randino/location/data/${country.code}.py`), body.join('\n'));
}

for (const directory of [
	'packages/javascript/lib/location/data',
	'packages/dart/lib/src/location/data',
	'packages/python/src/randino/location/data'
]) {
	mkdirSync(here(directory), { recursive: true });
}

for (const country of COUNTRIES) {
	const tree = country.read();

	writeJavaScript(country, tree);
	writeDart(country, tree);
	writePython(country, tree);
	console.log(country.code, count(tree));
}

function ruffBin() {
	for (const candidate of ['packages/python/.venv/bin/ruff', 'packages/python/.venv/Scripts/ruff.exe']) {
		if (existsSync(here(candidate))) return here(candidate);
	}

	return 'ruff';
}

const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: 'inherit' });

run(
	process.platform === 'win32' ? 'node_modules/.bin/prettier.cmd' : 'node_modules/.bin/prettier',
	['--write', 'lib/location/data'],
	here('packages/javascript')
);
run('dart', ['format', 'lib/src/location/data'], here('packages/dart'));
run(ruffBin(), ['format', 'src/randino/location/data'], here('packages/python'));
