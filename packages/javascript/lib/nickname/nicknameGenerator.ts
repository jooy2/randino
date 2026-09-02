// The nickname generator itself. Internal — `randNickname` is the public entry
// point, in both of its output forms.
//
// A nickname is a noun with something added to it: a modifier in front
// (멋진사자), a second noun behind (고양이꼬리), or both (파란고양이발바닥). The
// nouns are the `word` category's pools — animals, things, nature, ideas — and
// never person names, which is what keeps a nickname from reading like one.
// Drawing one word is `word/wordGenerator`; putting several of them together is
// what this file is.
//
// - `style` decides per word whether it comes out of a pool or is invented.
// - `minLength` / `maxLength` pick the shape first: a range too short for a
//   modifier drops that pattern instead of truncating a word.
// - `wordSeparator` decides what goes between the words, defaulting to the way
//   the language joins them.
//
// What used to be the fifth entry here, `uniqueSuffix`, is `randSuffix` now:
// attaching a token to a string was never a thing about nicknames.

import {
	collect,
	drawLanguage,
	lengthBounds,
	resolveLength,
	resolvePrefix,
	resolveStyle
} from '../_internal/generate.js';
import { pick } from '../_internal/utils.js';
import type {
	NicknameDetail,
	WordLanguage,
	WordTheme,
	WordThemeOption,
	RandNicknameOptions
} from '../_types/global.js';
import { WORD_DATA, WORD_LANGUAGES, WORD_THEMES } from '../word/data/index.js';
import type { WordLanguageData, WordPool } from '../word/data/types.js';
import { drawWord, poolBounds, themeOf, themesOf } from '../word/wordGenerator.js';

type Slot = 'modifier' | 'noun' | 'part';

// The shapes a nickname can take, and how often each one is used. A bare noun
// stays rare on purpose — a modifier is what makes a nickname feel picked.
const PATTERNS: readonly { slots: readonly Slot[]; weight: number }[] = [
	{ slots: ['noun'], weight: 12 },
	{ slots: ['modifier', 'noun'], weight: 50 },
	{ slots: ['noun', 'part'], weight: 12 },
	{ slots: ['modifier', 'noun', 'part'], weight: 26 }
];

// How many shapes to try before settling for the closest fit found.
const FIT_ATTEMPTS = 12;

type Bounds = Record<Slot, readonly [number, number]>;

// Everything a single nickname needs, with defaults already applied. The length
// bounds stay optional: left out, they are resolved per language and theme. So
// does the separator, which falls back to the language's own joiner.
type Settings = {
	theme: WordThemeOption;
	style: number;
	minLength?: number;
	maxLength?: number;
	includeModifier: boolean;
	prefix: string;
	separator?: string;
};

/**
 * What goes between the words: the caller's separator, or the language's own
 * joiner. Its length is part of the nickname's, so every length calculation has
 * to go through here rather than reading `data.joiner` directly.
 */
function joinerOf(data: WordLanguageData, settings: Settings): string {
	return settings.separator ?? data.joiner;
}

// Pool bounds never change, so they are worth computing once per language/theme.
const boundsCache = new Map<string, Bounds>();

function slotBounds(language: WordLanguage, data: WordLanguageData, theme: WordTheme): Bounds {
	const key = `${language}:${theme}`;
	const cached = boundsCache.get(key);

	if (cached) {
		return cached;
	}

	const bounds: Bounds = {
		modifier: poolBounds(data.modifiers),
		noun: poolBounds(data.nouns[theme]),
		part: poolBounds(data.parts ?? [])
	};

	boundsCache.set(key, bounds);

	return bounds;
}

/** The shapes available for the current options, in the order they are weighted. */
function usablePatterns(
	data: WordLanguageData,
	settings: Settings
): readonly { slots: readonly Slot[]; weight: number }[] {
	const usable = PATTERNS.filter(({ slots }) => {
		if (!settings.includeModifier && slots.includes('modifier')) return false;
		if (!data.parts && slots.includes('part')) return false;

		return true;
	});

	// Options can rule out every shape — a language with no `parts` pool and no
	// modifier allowed, say. The bare noun is then the only answer.
	return usable.length ? usable : [{ slots: ['noun'], weight: 1 }];
}

/** Shortest and longest nickname a shape can produce. */
function patternRange(
	slots: readonly Slot[],
	bounds: Bounds,
	joiner: number
): readonly [number, number] {
	const gaps = (slots.length - 1) * joiner;
	let min = gaps;
	let max = gaps;

	for (const slot of slots) {
		min += bounds[slot][0];
		max += bounds[slot][1];
	}

	return [min, max];
}

function pickPattern(
	patterns: readonly { slots: readonly Slot[]; weight: number }[]
): readonly Slot[] {
	const total = patterns.reduce((sum, pattern) => sum + pattern.weight, 0);
	let roll = Math.random() * total;

	for (const pattern of patterns) {
		roll -= pattern.weight;

		if (roll <= 0) {
			return pattern.slots;
		}
	}

	return patterns[patterns.length - 1].slots;
}

/**
 * Fill a shape with words. Each slot is given the room left once the slots after
 * it have been reserved theirs, so the last word can always close the gap to
 * `min` and nothing overshoots `max`.
 */
function buildWords(
	data: WordLanguageData,
	slots: readonly Slot[],
	bounds: Bounds,
	nouns: WordPool,
	settings: Settings,
	min: number,
	max: number
): { words: string[]; missed: boolean } {
	const joiner = joinerOf(data, settings).length;
	const words: string[] = [];
	let missed = false;
	let used = 0;

	for (let i = 0; i < slots.length; i += 1) {
		const gap = i > 0 ? joiner : 0;
		let restMin = 0;
		let restMax = 0;

		for (let rest = i + 1; rest < slots.length; rest += 1) {
			restMin += bounds[slots[rest]][0] + joiner;
			restMax += bounds[slots[rest]][1] + joiner;
		}

		const low = Math.max(1, min - used - gap - restMax);
		const high = Math.max(low, max - used - gap - restMin);
		const slot = slots[i];
		const pool = slot === 'modifier' ? data.modifiers : slot === 'part' ? data.parts! : nouns;
		const chosen = drawWord(data, pool, settings.style, low, high, i === 0 ? settings.prefix : '');

		missed = missed || chosen.missed;
		used += gap + chosen.word.length;
		words.push(chosen.word);
	}

	return { words, missed };
}

// --- Per-nickname generation ------------------------------------------------

/**
 * True when one word ends on the character the next one starts with (石霜 + 霜雨).
 * Only meaningful where words run together with neither a separator nor a
 * capital between them — plenty of real words double a character inside
 * themselves (씩씩한, Sunny).
 */
function hasBoundaryRepeat(words: readonly string[]): boolean {
	for (let i = 1; i < words.length; i += 1) {
		if (words[i - 1].slice(-1) === words[i].charAt(0)) {
			return true;
		}
	}

	return false;
}

/**
 * Length range for one language and theme: what the caller asked for, falling
 * back to everything the available shapes can produce.
 */
function boundsFor(
	data: WordLanguageData,
	bounds: Bounds,
	patterns: readonly { slots: readonly Slot[]; weight: number }[],
	settings: Settings
): readonly [number, number] {
	let naturalMin = Infinity;
	let naturalMax = 0;

	for (const { slots } of patterns) {
		const [low, high] = patternRange(slots, bounds, joinerOf(data, settings).length);

		naturalMin = Math.min(naturalMin, low);
		naturalMax = Math.max(naturalMax, high);
	}

	return lengthBounds(settings.minLength, settings.maxLength, naturalMin, naturalMax);
}

/**
 * Every length a language can produce, across all of its themes — the fallback
 * for an omitted `minLength` / `maxLength`, and what `nicknameLengthRange`
 * reports. Kept here so it is derived from the same shapes and pools the
 * generator actually draws from.
 */
export function naturalRange(
	language: WordLanguage,
	includeModifier: boolean,
	separator?: string
): readonly [number, number] {
	const data = WORD_DATA[language];
	const settings: Settings = {
		theme: 'all',
		style: 0,
		includeModifier,
		prefix: '',
		separator
	};
	const patterns = usablePatterns(data, settings);
	const joiner = joinerOf(data, settings).length;
	let min = Infinity;
	let max = 0;

	for (const theme of WORD_THEMES) {
		const bounds = slotBounds(language, data, theme);

		for (const { slots } of patterns) {
			const [low, high] = patternRange(slots, bounds, joiner);

			min = Math.min(min, low);
			max = Math.max(max, high);
		}
	}

	return [min, max];
}

type Built = { words: string[]; theme: WordTheme | null };

function generateOne(language: WordLanguage, settings: Settings): Built {
	const data = WORD_DATA[language];
	const themes = themesOf(settings.theme);
	const patterns = usablePatterns(data, settings);
	const joiner = joinerOf(data, settings);
	let best: Built | null = null;
	let bestDistance = Infinity;

	for (let attempt = 0; attempt < FIT_ATTEMPTS; attempt += 1) {
		// One theme per nickname, so a mixed request spreads over all of them.
		const theme = pick(themes);
		const nouns = data.nouns[theme];
		const bounds = slotBounds(language, data, theme);
		const [min, max] = boundsFor(data, bounds, patterns, settings);
		// Prefer a shape that can actually land inside the range.
		const fitting = patterns.filter(({ slots }) => {
			const [low, high] = patternRange(slots, bounds, joiner.length);

			return high >= min && low <= max;
		});
		const slots = pickPattern(fitting.length ? fitting : patterns);
		const { words, missed } = buildWords(data, slots, bounds, nouns, settings, min, max);
		const base = words[slots.indexOf('noun')];
		const built: Built = {
			words,
			// Only a word the generator knows carries a theme. A drawn word came out
			// of this theme; an invented one has to be looked up, because it can
			// spell a real word by accident.
			theme: nouns.includes(base) ? theme : themeOf(data, base)
		};
		const length = words.join(joiner).length;
		// Worth spending another attempt on, but not worth failing over: a real word
		// may well start with the requested character in one of the other themes,
		// and another draw will not stutter across the word boundary.
		const rough = missed || (!joiner && !data.capitalize && hasBoundaryRepeat(words));

		if (length >= min && length <= max && !rough) {
			return built;
		}

		const distance = (length < min ? min - length : Math.max(0, length - max)) + (rough ? 1 : 0);

		if (distance < bestDistance) {
			bestDistance = distance;
			best = built;
		}
	}

	return best!;
}

/** Resolve the caller's options into the settings a single nickname is built from. */
function resolveSettings(options: RandNicknameOptions): Settings {
	return {
		theme: options.theme ?? 'all',
		style: resolveStyle(options.style),
		minLength: resolveLength(options.minLength),
		maxLength: resolveLength(options.maxLength),
		includeModifier: options.includeModifier ?? true,
		prefix: resolvePrefix(options.startsWith),
		separator: options.wordSeparator
	};
}

export function generateNicknameDetails(options: RandNicknameOptions = {}): NicknameDetail[] {
	const settings = resolveSettings(options);
	const language = options.language ?? 'all';

	return collect(
		options,
		() => {
			const code = drawLanguage(language, WORD_LANGUAGES);
			const { words, theme } = generateOne(code, settings);

			return {
				nickname: words.join(joinerOf(WORD_DATA[code], settings)),
				words,
				language: code,
				theme
			};
		},
		(detail) => detail.nickname
	);
}
