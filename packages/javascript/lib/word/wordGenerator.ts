// The word generator, and the word-drawing primitives the nickname generator
// builds on top of it.
//
// A word is one entry of one theme's pool — an animal, a thing, something in
// nature — or an invented one that only reads like the language. That is the
// whole of `randWord`; a nickname is what you get when several of these are put
// together, which is why the drawing lives here and the composing lives there.

import { chance, clamp, pick, randInt } from '../_internal/utils.js';
import {
	collect,
	drawLanguage,
	lengthBounds,
	resolveLength,
	resolvePrefix,
	resolveRealism
} from '../_internal/generate.js';
import { capitalizeFirst } from '../_internal/utils.js';
import type {
	ModifierKind,
	RandWordOptions,
	WordDetail,
	WordLanguage,
	WordTheme,
	WordThemeOption
} from '../_types/global.js';
import { WORD_DATA, WORD_LANGUAGES, WORD_THEMES } from './data/index.js';
import type { WordGender, WordLanguageData, WordPool, WordSynthesis } from './data/types.js';

// How many themes to try before settling for the closest word found.
const FIT_ATTEMPTS = 12;

/**
 * The decorating pool one draw may use: a word for what the noun is like, one
 * for what it is doing, or either. Built per call — every draw already walks the
 * pool it is given, so holding this one would save nothing worth the
 * bookkeeping.
 */
export function modifiersOf(data: WordLanguageData, kind: ModifierKind | 'all' = 'all'): WordPool {
	if (kind === 'adjective') {
		return data.adjectives;
	}

	return kind === 'action' ? data.actions : [...data.adjectives, ...data.actions];
}

/**
 * Whether a modifier follows the noun rather than leading it, which the
 * language's own frames already say: Vietnamese writes `mèo xanh`, the rest
 * write `파란 고양이`. Read from the frames rather than declared beside them, so
 * a language cannot state one order and compose in the other.
 */
export function modifierFollows(data: WordLanguageData): boolean {
	for (const frame of data.frames) {
		const noun = frame.slots.indexOf('noun');
		const modifier = frame.slots.indexOf('adjective');

		if (noun >= 0 && modifier >= 0) {
			return modifier > noun;
		}
	}

	return false;
}

/**
 * A modifier reshaped to agree with a noun of `gender`. The first rule whose
 * ending matches wins; a word none of them match is already right, which is how
 * Spanish `azul` stays `azul` beside both `gato` and `luna`.
 *
 * A language with no `agreement` hands the word straight back, so every
 * generator can call this without asking whether the language inflects.
 */
export function agree(
	data: WordLanguageData,
	word: string,
	gender: WordGender | undefined
): string {
	const rules = gender && data.agreement?.[gender];

	if (!rules) {
		return word;
	}

	for (const [ending, replacement] of rules) {
		if (word.endsWith(ending)) {
			return word.slice(0, word.length - ending.length) + replacement;
		}
	}

	return word;
}

/** Shortest and longest word in a pool. */
export function poolBounds(pool: WordPool): readonly [number, number] {
	let min = Infinity;
	let max = 0;

	for (const word of pool) {
		min = Math.min(min, word.length);
		max = Math.max(max, word.length);
	}

	return [min === Infinity ? 1 : min, max || 1];
}

/**
 * Shortest and longest entry of a pool, counting an empty entry as the zero it is.
 * `poolBounds` answers the same question for a pool of words, where an empty
 * result would mean nothing; a coda pool holds `''` on purpose.
 */
function pieceSpan(pool: WordPool): readonly [number, number] {
	let low = Infinity;
	let high = 0;

	for (const entry of pool) {
		low = Math.min(low, entry.length);
		high = Math.max(high, entry.length);
	}

	return [low === Infinity ? 0 : low, high];
}

/** What a word of `count` syllables can be, at its shortest and at its longest. */
function syllableSpan(syn: WordSynthesis & { kind: 'syllable' }, count: number) {
	const [onsetLow, onsetHigh] = pieceSpan(syn.onset);
	const [vowelLow, vowelHigh] = pieceSpan(syn.vowel);
	const [codaLow, codaHigh] = pieceSpan(syn.coda);

	return [
		count * (onsetLow + vowelLow) + codaLow,
		count * (onsetHigh + vowelHigh) + codaHigh
	] as const;
}

/**
 * Shortest and longest word the invention template can make, the way `poolBounds`
 * reports the same about a pool. What a caller asking for an invented word can be
 * given is decided here rather than by the pools, and a length budget measured
 * against the pools is wrong by however far the two differ — English invents at
 * most two syllables where its pools hold words of twelve letters.
 */
export function synthBounds(syn: WordSynthesis): readonly [number, number] {
	if (syn.kind === 'pool') {
		// One entry is one character, so the length is the number of entries.
		return [Math.max(1, syn.minSyllables), Math.max(1, syn.maxSyllables)];
	}

	const [low] = syllableSpan(syn, syn.minSyllables);
	const [, high] = syllableSpan(syn, syn.maxSyllables);

	return [Math.max(1, low), Math.max(1, high)];
}

/** The themes one draw may use. */
export function themesOf(theme: WordThemeOption): readonly WordTheme[] {
	return theme === 'all' ? WORD_THEMES : [theme];
}

/** Theme a word belongs to, across every theme of the language. */
export function themeOf(data: WordLanguageData, word: string): WordTheme | null {
	for (const theme of WORD_THEMES) {
		if (data.nouns[theme].includes(word)) {
			return theme;
		}
	}

	return null;
}

/**
 * A pool word of a length between `min` and `max`, starting with `prefix` when
 * one was asked for. Falls back to a looser fit rather than nothing, and returns
 * null only when no word starts with the requested character.
 */
export function pickWord(pool: WordPool, min: number, max: number, prefix: string): string | null {
	const candidates = prefix
		? pool.filter((word) => word.toLowerCase().startsWith(prefix.toLowerCase()))
		: pool;

	if (!candidates.length) {
		return null;
	}

	const fitting = candidates.filter((word) => word.length >= min && word.length <= max);

	if (fitting.length) {
		return pick(fitting);
	}

	const shortEnough = candidates.filter((word) => word.length <= max);

	if (shortEnough.length) {
		return pick(shortEnough);
	}

	const longEnough = candidates.filter((word) => word.length >= min);

	return pick(longEnough.length ? longEnough : candidates);
}

/** Build one invented word, as close to the requested length as the template allows. */
export function synthWord(syn: WordSynthesis, min: number, max: number, prefix: string): string {
	if (syn.kind === 'pool') {
		// One entry is one character, so the length is the number of entries.
		const low = Math.max(min, 1);
		const high = Math.max(low, max);
		const count = clamp(randInt(syn.minSyllables, syn.maxSyllables), low, high);
		let out = prefix;

		for (let i = out.length; i < count; i += 1) {
			// Avoid immediately repeating a character (狼狼).
			let next = pick(syn.pool);

			for (let tries = 0; tries < 3 && next === out.slice(-1); tries += 1) {
				next = pick(syn.pool);
			}

			out += next;
		}

		return out;
	}

	// Built against the length rather than sampled until something fits. Drawing
	// each piece at random and re-rolling the whole word missed a third of the
	// exact lengths English, Spanish, Italian, German and Russian were asked for:
	// the shortest and the longest word a template can spell need every piece to
	// come out that way at once, which random sampling almost never does.
	const counts: number[] = [];

	for (let count = syn.minSyllables; count <= syn.maxSyllables; count += 1) {
		const [low, high] = syllableSpan(syn, count);

		if (high >= min && low <= max) {
			counts.push(count);
		}
	}

	const syllables = counts.length ? pick(counts) : randInt(syn.minSyllables, syn.maxSyllables);
	// The pieces the word is spelled out of, in order. A requested first character
	// stands in for the opening onset, which is what makes `startsWith` work.
	const pieces: WordPool[] = [];

	for (let i = 0; i < syllables; i += 1) {
		pieces.push(i === 0 && prefix ? [prefix.toLowerCase()] : syn.onset);
		pieces.push(syn.vowel);
	}

	pieces.push(syn.coda);

	// What the pieces after each one can still add, so a piece is only chosen from
	// the lengths that leave the rest of the word able to land in the range.
	const restLow = new Array<number>(pieces.length + 1).fill(0);
	const restHigh = new Array<number>(pieces.length + 1).fill(0);

	for (let i = pieces.length - 1; i >= 0; i -= 1) {
		const [low, high] = pieceSpan(pieces[i]);

		restLow[i] = low + restLow[i + 1];
		restHigh[i] = high + restHigh[i + 1];
	}

	let word = '';

	for (let i = 0; i < pieces.length; i += 1) {
		word += fittingPiece(
			pieces[i],
			min - word.length - restHigh[i + 1],
			max - word.length - restLow[i + 1]
		);
	}

	return word;
}

/** One piece of an invented word, as close to the room left for it as the pool allows. */
function fittingPiece(pool: WordPool, low: number, high: number): string {
	const fitting = pool.filter((entry) => entry.length >= low && entry.length <= high);

	if (fitting.length) {
		return pick(fitting);
	}

	// Every piece that comes equally close, not the first of them: a room no piece
	// fits is the common case at the ends of a range, and taking the first turned
	// every such word into the same one.
	let closest: string[] = [];
	let bestDistance = Infinity;

	for (const entry of pool) {
		const distance =
			entry.length < low ? low - entry.length : entry.length > high ? entry.length - high : 0;

		if (distance < bestDistance) {
			bestDistance = distance;
			closest = [entry];
		} else if (distance === bestDistance) {
			closest.push(entry);
		}
	}

	return closest.length ? pick(closest) : '';
}

/**
 * One word out of `pool`, or an invented one. `missed` marks a word that had to
 * be invented because no real one started with the requested character — worth
 * another theme before settling for it.
 */
export type Drawn = { word: string; missed: boolean };

export function drawWord(
	data: WordLanguageData,
	pool: WordPool,
	invent: number,
	min: number,
	max: number,
	prefix: string
): Drawn {
	const made = chance(invent);
	const word = made ? null : pickWord(pool, min, max, prefix);
	const chosen = word ?? synthWord(data.syn, min, max, prefix);

	return {
		word: data.capitalize ? capitalizeFirst(chosen) : chosen,
		missed: !made && !word
	};
}

/**
 * Every length the language's pools hold, across the requested themes — the
 * fallback for an omitted `minLength` / `maxLength`, and what `wordLengthRange`
 * reports.
 */
export function naturalRange(
	language: WordLanguage,
	theme: WordThemeOption
): readonly [number, number] {
	const data = WORD_DATA[language];
	let min = Infinity;
	let max = 0;

	for (const each of themesOf(theme)) {
		const [low, high] = poolBounds(data.nouns[each]);

		min = Math.min(min, low);
		max = Math.max(max, high);
	}

	return [min, max];
}

type Settings = {
	theme: WordThemeOption;
	// How often one part is invented rather than drawn, as a percentage.
	invent: number;
	minLength?: number;
	maxLength?: number;
	prefix: string;
};

function generateOne(language: WordLanguage, settings: Settings): WordDetail {
	const data = WORD_DATA[language];
	const themes = themesOf(settings.theme);
	let best: WordDetail | null = null;
	let bestDistance = Infinity;

	for (let attempt = 0; attempt < FIT_ATTEMPTS; attempt += 1) {
		// One theme per word, so a mixed request spreads over all of them.
		const theme = pick(themes);
		const pool = data.nouns[theme];
		const [low, high] = poolBounds(pool);
		const [min, max] = lengthBounds(settings.minLength, settings.maxLength, low, high);
		const { word, missed } = drawWord(data, pool, settings.invent, min, max, settings.prefix);
		const detail: WordDetail = {
			word,
			language,
			// A drawn word came out of this theme; an invented one has to be looked
			// up, because it can spell a real word by accident.
			theme: pool.includes(word) ? theme : themeOf(data, word)
		};

		if (word.length >= min && word.length <= max && !missed) {
			return detail;
		}

		// Worth spending another attempt on: a real word may well start with the
		// requested character in one of the other themes.
		const distance =
			(word.length < min ? min - word.length : Math.max(0, word.length - max)) + (missed ? 1 : 0);

		if (distance < bestDistance) {
			bestDistance = distance;
			best = detail;
		}
	}

	return best!;
}

export function generateWordDetails(options: RandWordOptions = {}): WordDetail[] {
	const language = options.language ?? 'all';
	const settings: Settings = {
		theme: options.theme ?? 'all',
		invent: resolveRealism(options.realism),
		minLength: resolveLength(options.minLength),
		maxLength: resolveLength(options.maxLength),
		prefix: resolvePrefix(options.startsWith)
	};

	return collect(
		options,
		() => generateOne(drawLanguage(language, WORD_LANGUAGES), settings),
		(detail) => detail.word
	);
}

/** What every themed generator does: `randWord` with its theme already decided. */
export function themedWord(
	theme: WordTheme,
	options: Omit<RandWordOptions, 'theme'>
): string[] | WordDetail[] {
	const details = generateWordDetails({ ...options, theme });

	return options.output === 'detail' ? details : details.map((detail) => detail.word);
}
