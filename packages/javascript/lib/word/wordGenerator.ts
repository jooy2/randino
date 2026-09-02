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
	resolveStyle
} from '../_internal/generate.js';
import { capitalizeFirst } from '../_internal/utils.js';
import type {
	RandWordOptions,
	WordDetail,
	WordLanguage,
	WordTheme,
	WordThemeOption
} from '../_types/global.js';
import { WORD_DATA, WORD_LANGUAGES, WORD_THEMES } from './data/index.js';
import type { WordLanguageData, WordPool, WordSynthesis } from './data/types.js';

// How many themes to try before settling for the closest word found.
const FIT_ATTEMPTS = 12;

// Attempts spent looking for an invented word of the requested length.
const SYNTH_ATTEMPTS = 8;

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

	let best = '';
	let bestDistance = Infinity;

	for (let attempt = 0; attempt < SYNTH_ATTEMPTS; attempt += 1) {
		const syllables = randInt(syn.minSyllables, syn.maxSyllables);
		let word = '';

		for (let i = 0; i < syllables; i += 1) {
			word += (i === 0 && prefix ? prefix.toLowerCase() : pick(syn.onset)) + pick(syn.vowel);

			if (i === syllables - 1) {
				word += pick(syn.coda);
			}
		}

		if (word.length >= min && word.length <= max) {
			return word;
		}

		const distance = word.length < min ? min - word.length : word.length - max;

		if (distance < bestDistance) {
			bestDistance = distance;
			best = word;
		}
	}

	return best;
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
	style: number,
	min: number,
	max: number,
	prefix: string
): Drawn {
	const invent = chance(style);
	const word = invent ? null : pickWord(pool, min, max, prefix);
	const chosen = word ?? synthWord(data.syn, min, max, prefix);

	return {
		word: data.capitalize ? capitalizeFirst(chosen) : chosen,
		missed: !invent && !word
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
	style: number;
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
		const { word, missed } = drawWord(data, pool, settings.style, min, max, settings.prefix);
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
		style: resolveStyle(options.style),
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
