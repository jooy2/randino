// The fictional datasets parsed into pools, and the drawing every fictional
// generator shares: a word from a pool, or one invented out of parts.
//
// The datasets are strings until a draw needs them, and each is split the first
// time one does, so importing the package costs nothing for a pool nobody asks
// for.

import { words } from '../_internal/parse.js';
import { chance, pick } from '../_internal/utils.js';
import type { NameGender } from '../_types/global.js';
import {
	FICTIONAL_AVOID,
	FICTIONAL_AVOID_INSIDE,
	FICTIONAL_COMPOUNDS,
	FICTIONAL_GIVEN_NAMES,
	FICTIONAL_MIDDLE_CHANCE,
	FICTIONAL_SURNAMES,
	FICTIONAL_SYLLABLES
} from './data/index.js';
import {
	LATIN,
	fitting,
	joinParts,
	joinable,
	leadsWith,
	missBy,
	spanOf,
	spelledRows
} from './spelling.js';
import type { Spelling } from './spelling.js';

/** A part that builds only some things: `uses` is the letters of what it may build. */
export type Tagged = { readonly uses: string; readonly spelling: Spelling };

type NamePools = {
	given: Readonly<Record<NameGender, readonly Spelling[]>>;
	surnames: readonly Spelling[];
	heads: readonly Spelling[];
	middles: readonly Spelling[];
	ends: Readonly<Record<NameGender, readonly Spelling[]>>;
	fronts: readonly Tagged[];
	backs: readonly Tagged[];
	avoid: ReadonlySet<string>;
	avoidInside: readonly string[];
};

let namePools: NamePools | undefined;

/** The name datasets, split the first time a draw needs them. */
export function pools(): NamePools {
	if (!namePools) {
		const given: Record<NameGender, Spelling[]> = { male: [], female: [] };
		const ends: Record<NameGender, Spelling[]> = { male: [], female: [] };
		const heads: Spelling[] = [];
		const middles: Spelling[] = [];
		const fronts: Tagged[] = [];
		const backs: Tagged[] = [];

		for (const { cells, spelling } of spelledRows(FICTIONAL_GIVEN_NAMES)) {
			given[cells[0] === 'f' ? 'female' : 'male'].push(spelling);
		}

		for (const { cells, spelling } of spelledRows(FICTIONAL_SYLLABLES)) {
			const role = cells[0];

			if (role === 'head') heads.push(spelling);
			else if (role === 'middle') middles.push(spelling);
			else ends[role === 'female' ? 'female' : 'male'].push(spelling);
		}

		for (const { cells, spelling } of spelledRows(FICTIONAL_COMPOUNDS)) {
			(cells[0] === 'front' ? fronts : backs).push({ uses: cells[1], spelling });
		}

		namePools = {
			given,
			surnames: spelledRows(FICTIONAL_SURNAMES).map((row) => row.spelling),
			heads,
			middles,
			ends,
			fronts,
			backs,
			avoid: new Set(words(FICTIONAL_AVOID).map((word) => word.toLowerCase())),
			avoidInside: words(FICTIONAL_AVOID_INSIDE)
		};
	}

	return namePools;
}

// The entries of a pool that lead with a prefix in one script, kept per pool:
// a call draws many results with the same prefix, and filtering a pool of two
// hundred names for each one of them is most of what a large call would cost.
const matchCache = /*#__PURE__*/ new WeakMap<readonly unknown[], Map<string, readonly unknown[]>>();

/** The entries of `pool` whose spelling in `script` starts with `prefix`, or all of them for none. */
export function matching<T>(
	pool: readonly T[],
	spellingOf: (entry: T) => Spelling,
	script: number,
	prefix: string
): readonly T[] {
	if (!prefix) {
		return pool;
	}

	let byPrefix = matchCache.get(pool);

	if (!byPrefix) {
		byPrefix = new Map();
		matchCache.set(pool, byPrefix);
	}

	const key = `${script}|${prefix}`;
	let found = byPrefix.get(key) as readonly T[] | undefined;

	if (!found) {
		found = pool.filter((entry) => leadsWith(spellingOf(entry)[script], prefix));
		byPrefix.set(key, found);
	}

	return found;
}

const self = (spelling: Spelling) => spelling;

/** Spellings that lead with `prefix` in `script`, for a pool of bare spellings. */
export function spelledMatching(
	pool: readonly Spelling[],
	script: number,
	prefix: string
): readonly Spelling[] {
	return matching(pool, self, script, prefix);
}

/**
 * Parts joined into one word, or `null` when two of them cannot be joined part
 * by part, or the word is one the datasets keep out: `FICTIONAL_AVOID` as a
 * whole, `FICTIONAL_AVOID_INSIDE` anywhere in any of its spellings.
 */
export function compose(parts: readonly Spelling[]): Spelling | null {
	for (let i = 1; i < parts.length; i += 1) {
		if (!joinable(parts[i - 1][LATIN], parts[i][LATIN])) {
			return null;
		}
	}

	const word = joinParts(parts);
	const { avoid, avoidInside } = pools();

	if (avoid.has(word[LATIN].toLowerCase())) {
		return null;
	}

	for (const spelling of word) {
		const lower = spelling.toLowerCase();

		if (avoidInside.some((run) => lower.includes(run))) {
			return null;
		}
	}

	return word;
}

// How many times an invented word is put together before the closest one made is
// kept. A pair that cannot be joined, a word to avoid and a length outside the
// range are each drawn again, and each is a small share of the draws.
const INVENT_ATTEMPTS = 16;

/** The length range a word has to land in, or `null` for none. */
export type Room = readonly [number, number] | null;

/**
 * A word `make` puts together that leads with `prefix` in `script` and lands
 * inside `room`, or the closest it made when none did — `null` when it made
 * nothing at all. The prefix is checked on the word rather than on its first
 * part, because joining can change how a script writes the first part: `아` and
 * `라` are `알라`.
 */
export function invent(
	make: () => Spelling | null,
	script: number,
	prefix: string,
	room: Room
): Spelling | null {
	let best: Spelling | null = null;
	let bestMiss = Infinity;

	for (let attempt = 0; attempt < INVENT_ATTEMPTS; attempt += 1) {
		const word = make();

		if (!word || !leadsWith(word[script], prefix)) {
			continue;
		}

		const miss = room ? missBy(word[script].length, room[0], room[1]) : 0;

		if (miss === 0) {
			return word;
		}

		if (miss < bestMiss) {
			best = word;
			bestMiss = miss;
		}
	}

	return best;
}

/**
 * A word for one part of a result: one out of `pool` (already narrowed to the
 * prefix), or one `make` invents, the second `invent` times in a hundred, and
 * whenever the pool has nothing to offer. An invented word that cannot be made to
 * lead with the prefix falls back to the pool.
 */
export function drawWord(
	pool: readonly Spelling[],
	make: () => Spelling | null,
	inventChance: number,
	script: number,
	prefix: string,
	room: Room
): Spelling | null {
	if (chance(inventChance) || !pool.length) {
		const made = invent(make, script, prefix, room);

		if (made) {
			return made;
		}
	}

	if (!pool.length) {
		return null;
	}

	return pick(room ? fitting(pool, (entry) => entry[script], room[0], room[1]) : pool);
}

// The shortest and the longest entry of a slot in each script, kept per slot.
const slotSpans = /*#__PURE__*/ new WeakMap<readonly Spelling[], [number, number][]>();

function slotSpan(slot: readonly Spelling[], script: number): [number, number] {
	let spans = slotSpans.get(slot);

	if (!spans) {
		spans = [0, 1, 2, 3, 4].map((each) => spanOf(slot.map((entry) => entry[each])));
		slotSpans.set(slot, spans);
	}

	return spans[script];
}

/**
 * One part out of each slot, joined into a word that leads with `prefix` in
 * `script` — the first slot is narrowed to it — and lands inside `room` where the
 * slots can reach it: each part is drawn from the entries that leave the slots
 * after it able to land the whole word there. `null` when the word cannot be
 * joined or is one to keep out.
 */
export function assemble(
	slots: readonly (readonly Spelling[])[],
	script: number,
	prefix: string,
	room: Room
): Spelling | null {
	const parts: Spelling[] = [];
	let length = 0;

	for (let i = 0; i < slots.length; i += 1) {
		let pool = i === 0 ? spelledMatching(slots[0], script, prefix) : slots[i];

		if (room) {
			let restLow = 0;
			let restHigh = 0;

			for (let j = i + 1; j < slots.length; j += 1) {
				const [low, high] = slotSpan(slots[j], script);

				restLow += low;
				restHigh += high;
			}

			const fit = pool.filter((entry) => {
				const reach = length + entry[script].length;

				return reach + restLow <= room[1] && reach + restHigh >= room[0];
			});

			// A slot nothing of which fits is drawn from whole, and the word comes out
			// as close as the rest of it can bring it.
			if (fit.length) {
				pool = fit;
			}
		}

		if (!pool.length) {
			return null;
		}

		const part = pick(pool);

		parts.push(part);
		length += part[script].length;
	}

	return compose(parts);
}

/** A given name put together out of syllables, for one gender: `Al` + `dric`, `Va` + `le` + `ria`. */
export function makeGiven(
	gender: NameGender,
	script: number,
	prefix: string,
	room: Room
): Spelling | null {
	const { heads, middles, ends } = pools();

	return assemble(
		chance(FICTIONAL_MIDDLE_CHANCE) ? [heads, middles, ends[gender]] : [heads, ends[gender]],
		script,
		prefix,
		room
	);
}

// The halves that may build each kind of thing, kept by the letter that names it.
const halvesCache = /*#__PURE__*/ new Map<string, { fronts: Spelling[]; backs: Spelling[] }>();

/** The fronts and backs that may build `use`: `s` a surname, `r` a region, `c` a city, `d` a district. */
export function halvesFor(use: string): { fronts: Spelling[]; backs: Spelling[] } {
	let halves = halvesCache.get(use);

	if (!halves) {
		const { fronts, backs } = pools();

		halves = {
			fronts: fronts.filter((part) => part.uses.includes(use)).map((part) => part.spelling),
			backs: backs.filter((part) => part.uses.includes(use)).map((part) => part.spelling)
		};
		halvesCache.set(use, halves);
	}

	return halves;
}

/** A word put together out of a front and a back that may build `use`: `Raven` + `ford`. */
export function makeCompound(
	use: string,
	script: number,
	prefix: string,
	room: Room
): Spelling | null {
	const { fronts, backs } = halvesFor(use);
	const word = assemble([fronts, backs], script, prefix, room);

	// A half that is both a front and a back (`stone`) is not joined to itself.
	return word && fronts.some((front) => front[LATIN] + front[LATIN] === word[LATIN].toLowerCase())
		? null
		: word;
}

/** The shortest and longest a part can come out in one script, the pool's and the invented ones together. */
export function spanIn(
	pool: readonly Spelling[],
	madeOf: readonly (readonly (readonly Spelling[])[])[],
	script: number
): [number, number] {
	let [low, high] = pool.length ? spanOf(pool.map((entry) => entry[script])) : [Infinity, 0];

	for (const shape of madeOf) {
		let shortest = 0;
		let longest = 0;

		for (const slot of shape) {
			const [slotLow, slotHigh] = spanOf(slot.map((entry) => entry[script]));

			shortest += slotLow;
			longest += slotHigh;
		}

		low = Math.min(low, shortest);
		high = Math.max(high, longest);
	}

	return [low === Infinity ? 0 : low, high];
}
