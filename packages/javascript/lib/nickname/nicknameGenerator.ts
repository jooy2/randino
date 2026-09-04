// The nickname generator itself. Internal — `randNickname` is the public entry
// point, in both of its output forms.
//
// A nickname is a noun with something added to it: a word for what it is like in
// front (멋진사자), one for what it is doing (웃는사자), a second noun behind
// (고양이꼬리), or a possessive between the two (사자의눈물). The nouns are the
// `word` category's pools — animals, things, nature, ideas — and never person
// names, which is what keeps a nickname from reading like one. Drawing one word
// is `word/wordGenerator`; putting several of them together is what this file is.
//
// - Which shapes exist is the language's own business, and `data.frames` is
//   where it says so. A shape carries its particles with it, so Chinese can put
//   的 between a verb and its noun where Korean needs nothing.
// - `realism` decides per word whether it comes out of a pool or is invented,
//   and which themes `theme: 'all'` spans — see `LOOSE_THEMES`.
// - `slots` names the shapes a caller will accept, by what they put beside the
//   noun. A language with no such shape answers with its closest.
// - `minLength` / `maxLength` pick the shape first: a range too short for a
//   modifier drops that frame instead of truncating a word.
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
	resolveRealism
} from '../_internal/generate.js';
import { pick } from '../_internal/utils.js';
import type {
	NicknameDetail,
	WordLanguage,
	WordSlot,
	WordSlotOption,
	WordTheme,
	WordThemeOption,
	RandNicknameOptions
} from '../_types/global.js';
import { LOOSE_THEMES, WORD_DATA, WORD_LANGUAGES, WORD_THEMES } from '../word/data/index.js';
import type { WordFrame, WordGender, WordLanguageData, WordPool } from '../word/data/types.js';
import { agree, drawWord, poolBounds, themeOf, themesOf } from '../word/wordGenerator.js';

// How many shapes to try before settling for the closest fit found.
const FIT_ATTEMPTS = 12;

type Bounds = Record<WordSlot, readonly [number, number]>;

// Everything a single nickname needs, with defaults already applied. The length
// bounds stay optional: left out, they are resolved per language and theme. So
// does the separator, which falls back to the language's own joiner.
type Settings = {
	theme: WordThemeOption;
	// The slots a shape may put beside the noun, normalized: a single slot has
	// become a one-entry set, and an empty set has become `'none'`.
	slots: readonly WordSlot[] | 'all' | 'none';
	// How often one part is invented rather than drawn, as a percentage.
	invent: number;
	// Whether the themes that make an awkward nickname are in play. Off at
	// `realism: 'real'`, which is what keeps `theme: 'all'` readable.
	loose: boolean;
	minLength?: number;
	maxLength?: number;
	prefix: string;
	separator?: string;
};

/**
 * The themes one nickname may draw from. `theme: 'all'` spans every theme a
 * nickname can carry, which at `realism: 'real'` is every theme but the loose
 * ones; a theme the caller named is always honoured.
 */
function themesFor(settings: Settings): readonly WordTheme[] {
	if (settings.theme !== 'all' || settings.loose) {
		return themesOf(settings.theme);
	}

	return WORD_THEMES.filter((theme) => !LOOSE_THEMES.includes(theme));
}

/**
 * Whether a shape is one the caller asked for: it uses at least one of the slots
 * they named. At least one rather than all of them, because the named slots are
 * a set to draw from — `['adjective', 'action']` asks for a modifier and leaves
 * the kind to chance, and no language has a shape carrying both.
 *
 * `'none'` reads the other way round, and matches the bare noun alone.
 */
function matchesSlots(frame: WordFrame, slots: readonly WordSlot[] | 'none'): boolean {
	return slots === 'none'
		? frame.slots.every((slot) => slot === 'noun')
		: frame.slots.some((slot) => slots.includes(slot));
}

/**
 * The shapes one nickname may take. A language declares its own, so not every
 * one of them can answer every request — Spanish has no trailing-noun shape,
 * because `cola de gato` needs a preposition. A request no shape of the language
 * matches leaves every shape in play, the way a length range too narrow for a
 * shape is answered with the closest fit rather than with nothing.
 */
function framesFor(data: WordLanguageData, settings: Settings): readonly WordFrame[] {
	const wanted = settings.slots;

	if (wanted === 'all') {
		return data.frames;
	}

	const matching = data.frames.filter((frame) => matchesSlots(frame, wanted));

	return matching.length ? matching : data.frames;
}

/** Whether a language has a shape that answers the request at all. */
function carries(data: WordLanguageData, settings: Settings): boolean {
	const wanted = settings.slots;

	return wanted === 'all' || data.frames.some((frame) => matchesSlots(frame, wanted));
}

/**
 * The languages one draw may come from. `language: 'all'` prefers the ones whose
 * shapes answer the request, so asking every language for a trailing noun does
 * not spend most of its draws on the four that have no such shape. When none of
 * them can, every language is back in play and each answers with its closest.
 */
function languagesFor(settings: Settings): readonly WordLanguage[] {
	if (settings.slots === 'all') {
		return WORD_LANGUAGES;
	}

	const able = WORD_LANGUAGES.filter((code) => carries(WORD_DATA[code], settings));

	return able.length ? able : WORD_LANGUAGES;
}

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
		adjective: poolBounds(data.adjectives),
		action: poolBounds(data.actions),
		noun: poolBounds(data.nouns[theme]),
		part: poolBounds(data.parts ?? [])
	};

	boundsCache.set(key, bounds);

	return bounds;
}

/**
 * What sits in front of the slot at `index`, in characters: the frame's own
 * particle for that gap, and then whatever joins the words. Nothing at all in
 * front of the first slot.
 */
function gapOf(frame: WordFrame, index: number, joiner: number): number {
	return index === 0 ? 0 : (frame.glue?.[index - 1]?.length ?? 0) + joiner;
}

/** Shortest and longest nickname a frame can produce. */
function frameRange(frame: WordFrame, bounds: Bounds, joiner: number): readonly [number, number] {
	let min = 0;
	let max = 0;

	for (let i = 0; i < frame.slots.length; i += 1) {
		const gap = gapOf(frame, i, joiner);

		min += gap + bounds[frame.slots[i]][0];
		max += gap + bounds[frame.slots[i]][1];
	}

	return [min, max];
}

function pickFrame(frames: readonly WordFrame[]): WordFrame {
	const total = frames.reduce((sum, frame) => sum + frame.weight, 0);
	let roll = Math.random() * total;

	for (const frame of frames) {
		roll -= frame.weight;

		if (roll <= 0) {
			return frame;
		}
	}

	return frames[frames.length - 1];
}

/** The pool one slot draws from. */
function poolOf(data: WordLanguageData, slot: WordSlot, nouns: WordPool): WordPool {
	switch (slot) {
		case 'adjective':
			return data.adjectives;
		case 'action':
			return data.actions;
		case 'part':
			// Only a frame of the language's own can ask for this, and one that does
			// is only written where the pool is.
			return data.parts!;
		default:
			return nouns;
	}
}

/** The finished string: the words in order, with the frame's particles between them. */
function assemble(words: readonly string[], frame: WordFrame, joiner: string): string {
	let out = '';

	for (let i = 0; i < words.length; i += 1) {
		out += (i === 0 ? '' : (frame.glue?.[i - 1] ?? '') + joiner) + words[i];
	}

	return out;
}

/**
 * Fill a frame with words. Each slot is given the room left once the slots after
 * it have been reserved theirs, so the last word can always close the gap to
 * `min` and nothing overshoots `max`.
 */
function buildWords(
	data: WordLanguageData,
	frame: WordFrame,
	bounds: Bounds,
	nouns: WordPool,
	settings: Settings,
	min: number,
	max: number
): { words: string[]; missed: boolean } {
	const joiner = joinerOf(data, settings).length;
	const words: string[] = [];
	const nounAt = frame.slots.indexOf('noun');
	// A language that inflects has to know the noun's gender before it draws a
	// modifier, and its frames may put the modifier first (`blauer Wal`). So the
	// noun is drawn ahead of its turn and waits for the slot it belongs to; its
	// length is then exact rather than a range, which keeps the length fitting as
	// tight as it is for every other language.
	const early =
		data.agreement && nounAt > 0
			? drawWord(data, nouns, settings.invent, bounds.noun[0], bounds.noun[1], '')
			: null;
	const span = (index: number): readonly [number, number] =>
		early && index === nounAt ? [early.word.length, early.word.length] : bounds[frame.slots[index]];
	let gender: WordGender | undefined = early ? data.nounGender?.[early.word] : undefined;
	let missed = false;
	let used = 0;

	for (let i = 0; i < frame.slots.length; i += 1) {
		const gap = gapOf(frame, i, joiner);
		let restMin = 0;
		let restMax = 0;

		for (let rest = i + 1; rest < frame.slots.length; rest += 1) {
			const restGap = gapOf(frame, rest, joiner);

			restMin += span(rest)[0] + restGap;
			restMax += span(rest)[1] + restGap;
		}

		const low = Math.max(1, min - used - gap - restMax);
		const high = Math.max(low, max - used - gap - restMin);
		const slot = frame.slots[i];
		const pool = poolOf(data, slot, nouns);
		const chosen =
			early && i === nounAt
				? early
				: drawWord(data, pool, settings.invent, low, high, i === 0 ? settings.prefix : '');
		// A language that inflects makes its modifiers agree with the noun, which
		// is why the noun is in hand before any of them is drawn.
		const word = slot === 'noun' ? chosen.word : agree(data, chosen.word, gender);

		if (slot === 'noun' && !early) {
			gender = data.nounGender?.[chosen.word];
		}

		missed = missed || chosen.missed;
		used += gap + word.length;
		words.push(word);
	}

	return { words, missed };
}

// --- Per-nickname generation ------------------------------------------------

/**
 * True when one word ends on the character the next one starts with (石霜 + 霜雨).
 * Only meaningful where the two run straight together — a particle or a capital
 * between them reads fine, and plenty of real words double a character inside
 * themselves (씩씩한, Sunny).
 */
function hasBoundaryRepeat(words: readonly string[], frame: WordFrame): boolean {
	for (let i = 1; i < words.length; i += 1) {
		if (!frame.glue?.[i - 1] && words[i - 1].slice(-1) === words[i].charAt(0)) {
			return true;
		}
	}

	return false;
}

/**
 * Length range for one language and theme: what the caller asked for, falling
 * back to everything the language's frames can produce.
 */
function boundsFor(
	data: WordLanguageData,
	frames: readonly WordFrame[],
	bounds: Bounds,
	settings: Settings
): readonly [number, number] {
	const joiner = joinerOf(data, settings).length;
	let naturalMin = Infinity;
	let naturalMax = 0;

	for (const frame of frames) {
		const [low, high] = frameRange(frame, bounds, joiner);

		naturalMin = Math.min(naturalMin, low);
		naturalMax = Math.max(naturalMax, high);
	}

	return lengthBounds(settings.minLength, settings.maxLength, naturalMin, naturalMax);
}

/**
 * Every length a language can produce, across all of its themes — the fallback
 * for an omitted `minLength` / `maxLength`, and what `nicknameLengthRange`
 * reports. Kept here so it is derived from the same frames and pools the
 * generator actually draws from.
 */
export function naturalRange(
	language: WordLanguage,
	separator?: string
): readonly [number, number] {
	const data = WORD_DATA[language];
	const settings: Settings = {
		theme: 'all',
		slots: 'all',
		invent: 0,
		loose: true,
		prefix: '',
		separator
	};
	const joiner = joinerOf(data, settings).length;
	let min = Infinity;
	let max = 0;

	for (const theme of WORD_THEMES) {
		const bounds = slotBounds(language, data, theme);

		for (const frame of data.frames) {
			const [low, high] = frameRange(frame, bounds, joiner);

			min = Math.min(min, low);
			max = Math.max(max, high);
		}
	}

	return [min, max];
}

type Built = {
	words: string[];
	slots: WordSlot[];
	nickname: string;
	theme: WordTheme | null;
};

function generateOne(language: WordLanguage, settings: Settings): Built {
	const data = WORD_DATA[language];
	const themes = themesFor(settings);
	// The shapes the caller allowed, which is every one of the language's unless
	// they asked. Neither the theme nor the length range changes them, so this is
	// settled once rather than per attempt.
	const allowed = framesFor(data, settings);
	const joiner = joinerOf(data, settings);
	let best: Built | null = null;
	let bestDistance = Infinity;

	for (let attempt = 0; attempt < FIT_ATTEMPTS; attempt += 1) {
		// One theme per nickname, so a mixed request spreads over all of them.
		const theme = pick(themes);
		const nouns = data.nouns[theme];
		const bounds = slotBounds(language, data, theme);
		const [min, max] = boundsFor(data, allowed, bounds, settings);
		// Prefer a shape that can actually land inside the range.
		const fitting = allowed.filter((frame) => {
			const [low, high] = frameRange(frame, bounds, joiner.length);

			return high >= min && low <= max;
		});
		const frame = pickFrame(fitting.length ? fitting : allowed);
		const { words, missed } = buildWords(data, frame, bounds, nouns, settings, min, max);
		const base = words[frame.slots.indexOf('noun')];
		const nickname = assemble(words, frame, joiner);
		const built: Built = {
			words,
			// A copy, so that a caller reading the detail cannot reach into the
			// language's own frame and change the shape for everyone after them.
			slots: [...frame.slots],
			nickname,
			// Only a word the generator knows carries a theme. A drawn word came out
			// of this theme; an invented one has to be looked up, because it can
			// spell a real word by accident.
			theme: nouns.includes(base) ? theme : themeOf(data, base)
		};
		// Worth spending another attempt on, but not worth failing over: a real word
		// may well start with the requested character in one of the other themes,
		// and another draw will not stutter across the word boundary.
		const rough = missed || (!joiner && !data.capitalize && hasBoundaryRepeat(words, frame));

		if (nickname.length >= min && nickname.length <= max && !rough) {
			return built;
		}

		const distance =
			(nickname.length < min ? min - nickname.length : Math.max(0, nickname.length - max)) +
			(rough ? 1 : 0);

		if (distance < bestDistance) {
			bestDistance = distance;
			best = built;
		}
	}

	return best!;
}

/**
 * The caller's `slots`, in the form the generator wants: one slot becomes a
 * one-entry set, and an empty set asks the same thing `'none'` does, since
 * neither leaves any slot allowed beside the noun.
 */
function resolveSlots(slots: WordSlotOption | undefined): Settings['slots'] {
	if (slots === undefined) {
		return 'all';
	}

	if (slots === 'all' || slots === 'none') {
		return slots;
	}

	const wanted = typeof slots === 'string' ? [slots] : slots;

	return wanted.length ? wanted : 'none';
}

/** Resolve the caller's options into the settings a single nickname is built from. */
function resolveSettings(options: RandNicknameOptions): Settings {
	return {
		theme: options.theme ?? 'all',
		slots: resolveSlots(options.slots),
		invent: resolveRealism(options.realism),
		loose: (options.realism ?? 'real') !== 'real',
		minLength: resolveLength(options.minLength),
		maxLength: resolveLength(options.maxLength),
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
			const code = drawLanguage(language, languagesFor(settings));
			const { words, slots, nickname, theme } = generateOne(code, settings);

			return { nickname, words, slots, language: code, theme };
		},
		(detail) => detail.nickname
	);
}
