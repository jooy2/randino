// The nickname generator itself. Internal — `randNickname` and
// `randNicknameDetails` are the public entry points.
//
// A nickname is a noun with something added to it: a modifier in front
// (멋진사자), a second noun behind (고양이꼬리), or both (파란고양이발바닥). The
// nouns are everyday words — animals, things, nature, ideas — and never person
// names, which is what keeps a nickname from reading like one.
//
// - `style` decides per word whether it comes out of a pool or is invented.
// - `minLength` / `maxLength` pick the shape first: a range too short for a
//   modifier drops that pattern instead of truncating a word.
// - `wordSeparator` decides what goes between the words, defaulting to the way
//   the language joins them.
// - `baseWord` pins the noun, so only the decoration varies.
//
// What used to be the fifth entry here, `uniqueSuffix`, is `randSuffix` now:
// attaching a token to a string was never a thing about nicknames.

import { capitalizeFirst, chance, clamp, pick, randInt } from '../_internal/utils.js';
import type {
	NicknameDetail,
	NicknameLanguage,
	NicknameTheme,
	NicknameThemeOption,
	RandNicknameOptions
} from '../_types/global.js';
import {
	NICKNAME_COUNT_MAX,
	NICKNAME_DATA,
	NICKNAME_LANGUAGES,
	NICKNAME_LENGTH_MAX,
	NICKNAME_LENGTH_MIN,
	NICKNAME_THEMES
} from './data/index.js';
import type { NicknameLanguageData, WordPool, WordSynthesis } from './data/types.js';

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

// Attempts spent looking for an invented word of the requested length.
const SYNTH_ATTEMPTS = 8;

type Bounds = Record<Slot, readonly [number, number]>;

// Everything a single nickname needs, with defaults already applied. The length
// bounds stay optional: left out, they are resolved per language and theme. So
// does the separator, which falls back to the language's own joiner.
type Settings = {
	theme: NicknameThemeOption;
	style: number;
	minLength?: number;
	maxLength?: number;
	includeModifier: boolean;
	baseWord: string;
	prefix: string;
	separator?: string;
};

/**
 * What goes between the words: the caller's separator, or the language's own
 * joiner. Its length is part of the nickname's, so every length calculation has
 * to go through here rather than reading `data.joiner` directly.
 */
function joinerOf(data: NicknameLanguageData, settings: Settings): string {
	return settings.separator ?? data.joiner;
}

function poolBounds(pool: WordPool): readonly [number, number] {
	let min = Infinity;
	let max = 0;

	for (const word of pool) {
		min = Math.min(min, word.length);
		max = Math.max(max, word.length);
	}

	return [min === Infinity ? 1 : min, max || 1];
}

// Pool bounds never change, so they are worth computing once per language/theme.
const boundsCache = new Map<string, Bounds>();

function slotBounds(
	language: NicknameLanguage,
	data: NicknameLanguageData,
	theme: NicknameTheme
): Bounds {
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
	data: NicknameLanguageData,
	settings: Settings
): readonly { slots: readonly Slot[]; weight: number }[] {
	const baseLeads =
		!!settings.baseWord &&
		settings.baseWord.toLowerCase().startsWith(settings.prefix.toLowerCase());
	const usable = PATTERNS.filter(({ slots }) => {
		if (!settings.includeModifier && slots.includes('modifier')) return false;
		if (!data.parts && slots.includes('part')) return false;
		// A given base word is the noun, so something has to be added to it —
		// otherwise every nickname would come back as the word itself.
		if (settings.baseWord && slots.length < 2) return false;
		// The starting character has to land on a word the generator is free to
		// choose, unless the given base word happens to start with it already.
		if (settings.prefix && settings.baseWord && slots[0] === 'noun' && !baseLeads) return false;

		return true;
	});

	// Options can rule out every shape — a base word with nothing allowed to
	// decorate it, say. The word on its own is then the only answer.
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

// --- Word selection ---------------------------------------------------------

/**
 * A pool word of a length between `min` and `max`, starting with `prefix` when
 * one was asked for. Falls back to a looser fit rather than nothing, and returns
 * null only when no word starts with the requested character.
 */
function pickWord(pool: WordPool, min: number, max: number, prefix: string): string | null {
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
function synthWord(syn: WordSynthesis, min: number, max: number, prefix: string): string {
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

// `missed` marks a word that had to be invented because no real one started with
// the requested character — worth another shape or theme before settling for it.
type Chosen = { word: string; missed: boolean };

function pickSlotWord(
	data: NicknameLanguageData,
	slot: Slot,
	nouns: WordPool,
	settings: Settings,
	min: number,
	max: number,
	prefix: string
): Chosen {
	if (slot === 'noun' && settings.baseWord) {
		const base = settings.baseWord;

		return { word: data.capitalize ? capitalizeFirst(base) : base, missed: false };
	}

	const pool = slot === 'modifier' ? data.modifiers : slot === 'part' ? data.parts! : nouns;
	const invent = chance(settings.style);
	const word = invent ? null : pickWord(pool, min, max, prefix);
	const chosen = word ?? synthWord(data.syn, min, max, prefix);

	return {
		word: data.capitalize ? capitalizeFirst(chosen) : chosen,
		missed: !invent && !word
	};
}

/**
 * Fill a shape with words. Each slot is given the room left once the slots after
 * it have been reserved theirs, so the last word can always close the gap to
 * `min` and nothing overshoots `max`.
 */
function buildWords(
	data: NicknameLanguageData,
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
		const chosen = pickSlotWord(
			data,
			slots[i],
			nouns,
			settings,
			low,
			high,
			i === 0 ? settings.prefix : ''
		);

		missed = missed || chosen.missed;
		used += gap + chosen.word.length;
		words.push(chosen.word);
	}

	return { words, missed };
}

// --- Per-nickname generation ------------------------------------------------

function themesOf(theme: NicknameThemeOption): readonly NicknameTheme[] {
	return theme === 'all' ? NICKNAME_THEMES : [theme];
}

/** Theme a word belongs to, across every theme of the language. */
function themeOf(data: NicknameLanguageData, word: string): NicknameTheme | null {
	for (const theme of NICKNAME_THEMES) {
		if (data.nouns[theme].includes(word)) {
			return theme;
		}
	}

	return null;
}

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
function lengthBounds(
	data: NicknameLanguageData,
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

	const min = clamp(settings.minLength ?? naturalMin, NICKNAME_LENGTH_MIN, NICKNAME_LENGTH_MAX);
	const max = clamp(settings.maxLength ?? naturalMax, NICKNAME_LENGTH_MIN, NICKNAME_LENGTH_MAX);

	return [min, Math.max(min, max)];
}

/**
 * Every length a language can produce, across all of its themes — the fallback
 * for an omitted `minLength` / `maxLength`, and what `nicknameLengthRange`
 * reports. Kept here so it is derived from the same shapes and pools the
 * generator actually draws from.
 */
export function naturalRange(
	language: NicknameLanguage,
	includeModifier: boolean,
	separator?: string
): readonly [number, number] {
	const data = NICKNAME_DATA[language];
	const settings: Settings = {
		theme: 'all',
		style: 0,
		includeModifier,
		baseWord: '',
		prefix: '',
		separator
	};
	const patterns = usablePatterns(data, settings);
	const joiner = joinerOf(data, settings).length;
	let min = Infinity;
	let max = 0;

	for (const theme of NICKNAME_THEMES) {
		const bounds = slotBounds(language, data, theme);

		for (const { slots } of patterns) {
			const [low, high] = patternRange(slots, bounds, joiner);

			min = Math.min(min, low);
			max = Math.max(max, high);
		}
	}

	return [min, max];
}

type Built = { words: string[]; theme: NicknameTheme | null };

function generateOne(language: NicknameLanguage, settings: Settings): Built {
	const data = NICKNAME_DATA[language];
	const themes = themesOf(settings.theme);
	const patterns = usablePatterns(data, settings);
	const joiner = joinerOf(data, settings);
	let best: Built | null = null;
	let bestDistance = Infinity;

	for (let attempt = 0; attempt < FIT_ATTEMPTS; attempt += 1) {
		// One theme per nickname, so a mixed request spreads over all of them.
		const theme = pick(themes);
		const nouns = data.nouns[theme];
		const cached = slotBounds(language, data, theme);
		// A given base word takes the noun's place, so it also takes over its
		// bounds — never write that into the cache.
		const bounds: Bounds = settings.baseWord
			? { ...cached, noun: [settings.baseWord.length, settings.baseWord.length] }
			: cached;

		const [min, max] = lengthBounds(data, bounds, patterns, settings);
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
			// of this theme; a given base word has to be looked up, and an invented
			// one is found nowhere.
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
	const baseWord = (options.baseWord ?? '').trim();

	return {
		theme: options.theme ?? 'all',
		style: clamp(options.style ?? 0, 0, 100),
		minLength: options.minLength === undefined ? undefined : Math.floor(options.minLength),
		maxLength: options.maxLength === undefined ? undefined : Math.floor(options.maxLength),
		includeModifier: options.includeModifier ?? true,
		baseWord,
		prefix: (options.startsWith ?? '').trim().slice(0, 1),
		separator: options.wordSeparator
	};
}

const HANGUL = /[가-힣]/;
const KANA = /[぀-ヿ]/;
const HAN = /[一-鿿]/;

/**
 * Language a given base word belongs to, so that `baseWord: '고양이'` is not
 * decorated with an English modifier. Only consulted when the caller left
 * `language` out.
 */
function detectLanguage(word: string): NicknameLanguage {
	if (HANGUL.test(word)) return 'ko';
	if (KANA.test(word)) return 'ja';
	if (HAN.test(word)) return 'zh';

	return 'en';
}

export function generateNicknameDetails(options: RandNicknameOptions = {}): NicknameDetail[] {
	const settings = resolveSettings(options);
	const language =
		options.language ?? (settings.baseWord ? detectLanguage(settings.baseWord) : 'all');
	const count = clamp(Math.floor(options.count ?? 1), 0, NICKNAME_COUNT_MAX);
	const unique = options.unique ?? false;
	const prefix = settings.prefix.toLowerCase();

	const seen = new Set<string>();
	const nicknames: NicknameDetail[] = [];
	const maxAttempts = count * 50 + 500;
	let attempts = 0;

	while (nicknames.length < count && attempts < maxAttempts) {
		attempts += 1;

		const code = language === 'all' ? pick(NICKNAME_LANGUAGES) : language;
		const { words, theme } = generateOne(code, settings);
		const word = words.join(joinerOf(NICKNAME_DATA[code], settings));

		if (!word) continue;
		if (prefix && !word.toLowerCase().startsWith(prefix)) continue;

		if (unique) {
			if (seen.has(word)) continue;

			seen.add(word);
		}

		nicknames.push({ nickname: word, words, language: code, theme });
	}

	return nicknames;
}
