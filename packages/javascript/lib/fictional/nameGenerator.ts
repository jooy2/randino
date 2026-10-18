// The fictional name generator: a name for a character in a story or a game,
// spelled in Latin letters first and written by its sound in every other script.
//
// A name is a given name and, when asked for, a family name. Each part is drawn
// from the pools or invented out of parts, decided per part the way `realism`
// decides it for `randName`, and every part carries its spelling in all five
// scripts, so writing a name in another language is reading another column.

import { collect, resolveOption, resolveRandom, resolveRealism } from '../_internal/generate.js';
import { pick, random, withRandom } from '../_internal/utils.js';
import type {
	FictionalNameDetail,
	NameGender,
	NameGenderOption,
	RandFictionalNameOptions,
	WordLanguage
} from '../_types/global.js';
import { prefixIn, resolveBase, scriptOf } from './options.js';
import type { FictionalBase } from './options.js';
import {
	drawWord,
	halvesFor,
	makeCompound,
	makeGiven,
	pools,
	spanIn,
	spelledMatching
} from './pools.js';
import type { Room } from './pools.js';
import { LATIN, NAME_JOINERS, missBy } from './spelling.js';
import type { Spelling } from './spelling.js';

// Draws spent on one name before settling for the closest to the length range.
// Each part is already drawn against the room the other leaves, so what is left
// to miss is an invented part, whose length is only roughly in hand.
const FIT_ATTEMPTS = 12;

const GENDERS: readonly NameGenderOption[] = ['male', 'female', 'all'];

type Settings = FictionalBase & {
	gender: NameGenderOption;
	surname: boolean;
	invent: number;
};

type Spans = { given: readonly [number, number]; surname: readonly [number, number] };

// Worked out once per gender, script and realism: every draw of a name with a
// surname or a length range reads them, and they only depend on the pools.
const spanCache = /*#__PURE__*/ new Map<string, Spans>();

/**
 * The shortest and the longest a given name, and a surname, can come out in one
 * script: the pools' names, the invented ones, or both, as `realism` draws them.
 */
function spansIn(gender: NameGender | 'all', script: number, invent: number): Spans {
	const key = `${gender}|${script}|${invent}`;
	const kept = spanCache.get(key);

	if (kept) {
		return kept;
	}

	const { given, heads, middles, ends, surnames } = pools();
	const { fronts, backs } = halvesFor('s');
	const genders: NameGender[] = gender === 'all' ? ['male', 'female'] : [gender];
	const real = invent < 100;
	const made = invent > 0;
	const givenSpans = genders.map((each) =>
		spanIn(
			real ? given[each] : [],
			made
				? [
						[heads, ends[each]],
						[heads, middles, ends[each]]
					]
				: [],
			script
		)
	);
	const spans: Spans = {
		given: [
			Math.min(...givenSpans.map((span) => span[0])),
			Math.max(...givenSpans.map((span) => span[1]))
		],
		surname: spanIn(real ? surnames : [], made ? [[fronts, backs]] : [], script)
	};

	spanCache.set(key, spans);

	return spans;
}

/** What a name in `script` can come out at under these settings. */
function rangeIn(
	script: number,
	gender: NameGender | 'all',
	settings: Pick<Settings, 'surname' | 'invent'>
): readonly [number, number] {
	const spans = spansIn(gender, script, settings.invent);

	if (!settings.surname) {
		return spans.given;
	}

	const joiner = NAME_JOINERS[script].length;

	return [spans.given[0] + joiner + spans.surname[0], spans.given[1] + joiner + spans.surname[1]];
}

/**
 * The gender of one name: the one asked for, or either of the two. With a
 * length range, a gender whose names cannot meet it in this script is passed
 * over while the other's can — Japanese writes a man's name no longer than
 * seven characters and a woman's up to eight.
 */
function genderFor(script: number, settings: Settings): NameGender {
	if (settings.gender !== 'all') {
		return settings.gender;
	}

	const both: NameGender[] = ['male', 'female'];
	const bounds = settings.bounds;
	const fitting = bounds
		? both.filter((gender) => {
				const [low, high] = rangeIn(script, gender, settings);

				return high >= bounds[0] && low <= bounds[1];
			})
		: both;

	return fitting.length === 1 ? fitting[0] : random() < 0.5 ? 'male' : 'female';
}

/** One name and the string it is told apart from others by, whatever language it is written in. */
type Drawn = { detail: FictionalNameDetail; key: string };

function draft(language: WordLanguage, settings: Settings): Drawn | null {
	const script = scriptOf(language);
	const prefix = prefixIn(settings.prefix, script);
	const gender = genderFor(script, settings);
	const { given, surnames } = pools();
	const bounds = settings.bounds;
	let surname: Spelling | null = null;
	let room: Room = bounds;

	if (settings.surname) {
		const joiner = NAME_JOINERS[script].length;
		const spans = spansIn(gender, script, settings.invent);
		// The surname takes the room a given name of any length still leaves, so
		// that the given name drawn after it has somewhere to land.
		const surnameRoom: Room = bounds
			? [bounds[0] - joiner - spans.given[1], bounds[1] - joiner - spans.given[0]]
			: null;

		surname = drawWord(
			surnames,
			() => makeCompound('s', script, '', surnameRoom),
			settings.invent,
			script,
			'',
			surnameRoom
		);

		if (!surname) {
			return null;
		}

		room = bounds
			? [bounds[0] - joiner - surname[script].length, bounds[1] - joiner - surname[script].length]
			: null;
	}

	const first = drawWord(
		spelledMatching(given[gender], script, prefix),
		() => makeGiven(gender, script, prefix, room),
		settings.invent,
		script,
		prefix,
		room
	);

	if (!first) {
		return null;
	}

	const write = (code: WordLanguage) => {
		const at = scriptOf(code);

		return surname ? first[at] + NAME_JOINERS[at] + surname[at] : first[at];
	};
	const forms: Partial<Record<WordLanguage, string>> = {};

	for (const code of settings.forms) {
		forms[code] = write(code);
	}

	return {
		detail: { name: write(language), gender, language, forms },
		key: surname ? `${first[LATIN]} ${surname[LATIN]}` : first[LATIN]
	};
}

function generateOne(language: WordLanguage, settings: Settings): Drawn | null {
	let best: Drawn | null = null;
	let bestMiss = Infinity;

	for (let attempt = 0; attempt < FIT_ATTEMPTS; attempt += 1) {
		const drawn = draft(language, settings);

		if (!drawn) {
			continue;
		}

		const miss = settings.bounds
			? missBy(drawn.detail.name.length, settings.bounds[0], settings.bounds[1])
			: 0;

		if (miss === 0) {
			return drawn;
		}

		if (miss < bestMiss) {
			best = drawn;
			bestMiss = miss;
		}
	}

	return best;
}

export function generateFictionalNameDetails(
	options: RandFictionalNameOptions = {}
): FictionalNameDetail[] {
	const own = {
		gender: resolveOption(options.gender, GENDERS, 'all'),
		surname: options.includeSurname === true,
		invent: resolveRealism(options.realism)
	};
	const settings: Settings = {
		...resolveBase(options, (language) => rangeIn(scriptOf(language), own.gender, own)),
		...own
	};

	if (!settings.languages.length) {
		return [];
	}

	const results = withRandom(resolveRandom(options.random), () =>
		collect(
			// `startsWith` is checked as each name is drawn: a Japanese name is spelled
			// in katakana, and a hiragana prefix has to match it.
			{ count: options.count, unique: options.unique },
			() => generateOne(pick(settings.languages), settings),
			(drawn) => drawn?.detail.name ?? '',
			(drawn) => drawn?.key ?? ''
		)
	);

	return results.flatMap((drawn) => (drawn ? [drawn.detail] : []));
}
