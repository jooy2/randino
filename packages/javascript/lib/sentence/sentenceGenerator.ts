// The sentence generator itself. Internal — `randSentence` is the public entry
// point, in both of its output forms.
//
// A sentence is a subject and something said about it: what it does (`사자가
// 달린다`), what it does it to (`여우가 사과를 먹는다`), or what it is like
// (`하늘은 파랗다`). The nouns are the `word` category's pools, the same ones a
// nickname is built from; everything a sentence needs beside them — a verb in
// the form a statement ends on, an adjective in the form a predicate takes, the
// adverbs, and the shapes the grammar allows — is `sentence/data`.
//
// Two things keep the result readable rather than a pile of words:
//
// - **The shapes belong to the language.** `data.frames` writes them out in the
//   language's own order, with the particle or preposition each phrase needs, so
//   Korean closes on its verb where English puts it second. A language whose
//   articles cannot mark an object simply declares no shape that has one.
// - **A verb states what it can take.** `VerbGroup` names the noun classes that
//   can be its subject and its object, and the nouns are drawn from those alone.
//   That is why `사자가 사과를 먹는다` comes out and `사자가 철학을 먹는다` does
//   not — no tag on any noun, because `THEME_CLASS` already knows what a theme
//   names.

import {
	collect,
	drawLanguage,
	lengthBounds,
	resolveLength,
	resolvePrefix,
	resolveRealism
} from '../_internal/generate.js';
import { endsWithConsonant } from '../_internal/script.js';
import { chance, pick } from '../_internal/utils.js';
import { RAND_SENTENCE_LENGTH_MAX } from '../constants.js';
import type {
	RandSentenceOptions,
	SentenceDetail,
	SentenceShapeOption,
	SentenceSlot,
	SentenceSlotOption,
	WordLanguage,
	WordTheme,
	WordThemeOption
} from '../_types/global.js';
import { WORD_DATA, WORD_LANGUAGES, WORD_THEMES } from '../word/data/index.js';
import type { WordGender, WordLanguageData, WordPool } from '../word/data/types.js';
import {
	agree,
	drawWord,
	modifierFollows,
	pickWord,
	poolBounds,
	themeOf
} from '../word/wordGenerator.js';
import { SENTENCE_DATA, THEME_CLASS } from './data/index.js';
import type {
	NounClass,
	SentenceFrame,
	SentenceLanguageData,
	SentencePart,
	StateGroup,
	VerbGroup
} from './data/types.js';

// How many sentences to build before settling for the closest fit found.
const FIT_ATTEMPTS = 14;

// How often a noun phrase that may carry a modifier is given one. Length can
// override it in both directions — see `modifyChanceFor`.
const MODIFY_CHANCE = 45;

/** The slots that are a noun phrase, and so draw from the word pools. */
const NOUN_SLOTS: readonly SentenceSlot[] = ['subject', 'object', 'place'];

function isNounSlot(slot: SentenceSlot): boolean {
	return NOUN_SLOTS.includes(slot);
}

type Settings = {
	theme: WordThemeOption;
	shape: SentenceShapeOption;
	// The parts a shape may carry, normalized: one slot has become a one-entry
	// set, and an empty set has become `'none'`.
	slots: readonly SentenceSlot[] | 'all' | 'none';
	// How often one word is invented rather than drawn, as a percentage.
	invent: number;
	minLength?: number;
	maxLength?: number;
	prefix: string;
	include: readonly string[];
};

/* --- Shapes ---------------------------------------------------------------- */

/**
 * How much a shape says, read off the shape itself rather than declared beside
 * it. Two phrases is a subject and its predicate and nothing else; every phrase
 * after that is one more thing the sentence has to say.
 */
export function shapeOf(frame: SentenceFrame): 'simple' | 'detailed' | 'complex' {
	if (frame.parts.length <= 2) {
		return 'simple';
	}

	return frame.parts.length === 3 ? 'detailed' : 'complex';
}

/**
 * Whether a shape is one the caller asked for: it carries at least one of the
 * parts they named. At least one rather than all of them, for the same reason a
 * nickname's `slots` reads that way — the named slots are a set to draw from.
 *
 * `'none'` reads the other way round, and matches a sentence that is a subject
 * and its predicate alone.
 */
function matchesSlots(frame: SentenceFrame, slots: readonly SentenceSlot[] | 'none'): boolean {
	if (slots === 'none') {
		return frame.parts.every(
			(part) => part.slot === 'subject' || part.slot === 'verb' || part.slot === 'state'
		);
	}

	return frame.parts.some((part) => slots.includes(part.slot));
}

/**
 * The shapes one sentence may take. Both filters fall back rather than fail: a
 * language that has no shape carrying what was asked for answers with the
 * closest it does have, the same best-effort a too-narrow length range gets.
 */
function framesFor(data: SentenceLanguageData, settings: Settings): readonly SentenceFrame[] {
	const bySlots =
		settings.slots === 'all'
			? data.frames
			: data.frames.filter((frame) => matchesSlots(frame, settings.slots as never));
	const allowed = bySlots.length ? bySlots : data.frames;

	if (settings.shape === 'all') {
		return allowed;
	}

	const byShape = allowed.filter((frame) => shapeOf(frame) === settings.shape);

	return byShape.length ? byShape : allowed;
}

/** Whether a language has a shape that answers the request at all. */
function carries(data: SentenceLanguageData, settings: Settings): boolean {
	if (
		settings.slots !== 'all' &&
		!data.frames.some((f) => matchesSlots(f, settings.slots as never))
	) {
		return false;
	}

	return settings.shape === 'all' || data.frames.some((frame) => shapeOf(frame) === settings.shape);
}

/**
 * The languages one draw may come from. `language: 'all'` prefers the ones whose
 * shapes answer the request, and — when words were required — the ones whose
 * pools actually hold them. When none of them can, every language is back in
 * play and each answers with its closest.
 */
function languagesFor(settings: Settings): readonly WordLanguage[] {
	const able = WORD_LANGUAGES.filter(
		(code) =>
			carries(SENTENCE_DATA[code], settings) &&
			settings.include.every((word) => classify(code, word).known)
	);

	if (able.length) {
		return able;
	}

	const shaped = WORD_LANGUAGES.filter((code) => carries(SENTENCE_DATA[code], settings));

	return shaped.length ? shaped : WORD_LANGUAGES;
}

/* --- Required words -------------------------------------------------------- */

/**
 * Where a required word can go, and what the generator knows about it.
 *
 * `slots` is a list rather than one entry, because a word can be more than one
 * thing: English `brave` closes a sentence as a predicate and opens a noun
 * phrase as a modifier, and which of the two it has to be depends on what the
 * other required words need. Best first, and the shape takes the first that is
 * still free.
 */
type Requirement = {
	word: string;
	slots: readonly (SentenceSlot | 'modifier')[];
	/** Set when the word is a noun the language knows, which fixes the subject's class. */
	theme?: WordTheme;
	/** False for a word found in none of the pools, which is used as a noun anyway. */
	known: boolean;
};

/** Which part of a shape each required word ends up in, by the part's index. */
type Plan = {
	/** The word a phrase has to be written with. */
	phrase: Map<number, Requirement>;
	/** The modifier a noun phrase has to carry. */
	modifier: Map<number, Requirement>;
};

const EMPTY_PLAN: Plan = { phrase: new Map(), modifier: new Map() };

/**
 * The pool's own spelling of `word`, or null when the pool does not hold it.
 * Matched without case, because English stores its pools capitalized and writes
 * them lowercase inside a sentence — a caller who read `lion` out of one is
 * asking for the same word the pool calls `Lion`.
 */
function entryOf(pool: WordPool, word: string): string | null {
	const lower = word.toLowerCase();

	return pool.find((entry) => entry.toLowerCase() === lower) ?? null;
}

/** What a required word is, judged by every pool it appears in. */
function classify(language: WordLanguage, word: string): Requirement {
	const wordData = WORD_DATA[language];
	const data = SENTENCE_DATA[language];
	const slots: (SentenceSlot | 'modifier')[] = [];
	let written = word;
	let theme: WordTheme | undefined;

	for (const each of WORD_THEMES) {
		const entry = entryOf(wordData.nouns[each], word);

		if (entry) {
			written = plain(wordData, entry);
			theme = each;
			slots.push('subject');
			break;
		}
	}

	for (const group of data.verbs) {
		const entry = entryOf(group.words, word);

		if (entry) {
			written = entry;
			slots.push('verb');
			break;
		}
	}

	for (const group of data.states) {
		const entry = entryOf(group.words, word);

		if (entry) {
			written = entry;
			slots.push('state');
			break;
		}
	}

	const manner = entryOf(data.manners, word);

	if (manner) {
		written = manner;
		slots.push('manner');
	}

	const time = entryOf(data.times, word);

	if (time) {
		written = time;
		slots.push('time');
	}

	const modifier = entryOf(wordData.adjectives, word) ?? entryOf(wordData.actions, word);

	if (modifier) {
		written = plain(wordData, modifier);
		slots.push('modifier');
	}

	// A word from outside the pools is still a word the caller asked for. It goes
	// in as a noun, which is the one slot that takes any word without a form of
	// its own to be in.
	return slots.length
		? { word: written, slots, theme, known: true }
		: { word, slots: ['subject'], known: false };
}

/**
 * Where each required word goes in this shape, and whether the shape had room
 * for all of them. Greedy: a word takes the first of its own slots that is still
 * free, which is enough because the lists are short and ordered by how specific
 * the reading is.
 */
function planFor(
	frame: SentenceFrame,
	requirements: readonly Requirement[]
): { plan: Plan; complete: boolean } {
	if (!requirements.length) {
		return { plan: EMPTY_PLAN, complete: true };
	}

	const plan: Plan = { phrase: new Map(), modifier: new Map() };
	let complete = true;

	for (const requirement of requirements) {
		const placed = requirement.slots.some((slot) => {
			if (slot === 'modifier') {
				const at = frame.parts.findIndex((part, i) => part.modifiable && !plan.modifier.has(i));

				if (at < 0) {
					return false;
				}

				plan.modifier.set(at, requirement);

				return true;
			}

			// A noun goes wherever a noun goes, so a required subject can land in the
			// object phrase of a shape whose subject is already spoken for.
			const wanted = isNounSlot(slot) ? NOUN_SLOTS : [slot];
			const at = frame.parts.findIndex(
				(part, i) => wanted.includes(part.slot) && !plan.phrase.has(i)
			);

			if (at < 0) {
				return false;
			}

			plan.phrase.set(at, requirement);

			return true;
		});

		complete = complete && placed;
	}

	return { plan, complete };
}

/** The word a shape's `slot` was required to use, if any. */
function requiredAt(frame: SentenceFrame, plan: Plan, slot: SentenceSlot): Requirement | undefined {
	for (const [at, requirement] of plan.phrase) {
		if (frame.parts[at].slot === slot) {
			return requirement;
		}
	}

	return undefined;
}

/* --- Pools and bounds ------------------------------------------------------ */

// Pools and their bounds never change, so they are worth holding on to.
const nounCache = new Map<string, WordPool>();
const boundsCache = new Map<string, Record<string, readonly [number, number]>>();

/**
 * The nouns of one theme a sentence may use. A language that inflects leaves out
 * the nouns with no singular: `ножницы` and `Jeans` would need a plural verb
 * beside them, and a verb pool written twice over is a lot of data for a dozen
 * words.
 */
function nounsOf(language: WordLanguage, theme: WordTheme): WordPool {
	const key = `${language}:${theme}`;
	const cached = nounCache.get(key);

	if (cached) {
		return cached;
	}

	const data = WORD_DATA[language];
	const pool = data.nounGender
		? data.nouns[theme].filter((word) => {
				const gender = data.nounGender![word];

				return gender !== 'p' && gender !== 'fp';
			})
		: data.nouns[theme];
	const usable = pool.length ? pool : data.nouns[theme];

	nounCache.set(key, usable);

	return usable;
}

/** Shortest and longest word each kind of slot can contribute, over every theme. */
function slotBounds(language: WordLanguage): Record<string, readonly [number, number]> {
	const cached = boundsCache.get(language);

	if (cached) {
		return cached;
	}

	const wordData = WORD_DATA[language];
	const data = SENTENCE_DATA[language];
	const span = (pools: readonly WordPool[]): readonly [number, number] => {
		let min = Infinity;
		let max = 0;

		for (const pool of pools) {
			const [low, high] = poolBounds(pool);

			min = Math.min(min, low);
			max = Math.max(max, high);
		}

		return [min === Infinity ? 1 : min, max || 1];
	};
	const bounds = {
		noun: span(WORD_THEMES.map((theme) => nounsOf(language, theme))),
		modifier: span([wordData.adjectives]),
		verb: span(data.verbs.map((group) => group.words)),
		state: span(data.states.map((group) => group.words)),
		manner: span([data.manners]),
		time: span([data.times])
	};

	boundsCache.set(language, bounds);

	return bounds;
}

/** The longest and shortest article the language can open a phrase with. */
function articleSpan(data: SentenceLanguageData): readonly [number, number] {
	if (!data.articles) {
		return [0, 0];
	}

	let min = Infinity;
	let max = 0;

	for (const rules of Object.values(data.articles)) {
		for (const [, article] of rules ?? []) {
			min = Math.min(min, article.length);
			max = Math.max(max, article.length);
		}
	}

	return [min === Infinity ? 0 : min, max];
}

/** What one part adds to the sentence, at its shortest and at its longest. */
function partRange(
	part: SentencePart,
	data: SentenceLanguageData,
	bounds: Record<string, readonly [number, number]>
): readonly [number, number] {
	const space = data.space.length;
	const head = part.head ? part.head.length + space : 0;
	const tail = Math.min(part.tail?.length ?? 0, part.tailAlt?.length ?? part.tail?.length ?? 0);
	const tailMax = Math.max(part.tail?.length ?? 0, part.tailAlt?.length ?? 0);

	if (!isNounSlot(part.slot)) {
		const [low, high] = bounds[part.slot];

		return [head + low + tail, head + high + tailMax];
	}

	const [low, high] = bounds.noun;
	const [articleMin, articleMax] = part.bare ? [0, 0] : articleSpan(data);
	const article = (size: number) => (size ? size + space : 0);
	const modifier = part.modifiable ? bounds.modifier[1] + space : 0;

	return [
		head + article(articleMin) + low + tail,
		head + article(articleMax) + modifier + high + tailMax
	];
}

/** Shortest and longest sentence a shape can produce. */
function frameRange(
	frame: SentenceFrame,
	data: SentenceLanguageData,
	bounds: Record<string, readonly [number, number]>
): readonly [number, number] {
	let min = data.terminator.length;
	let max = min;

	for (let i = 0; i < frame.parts.length; i += 1) {
		const gap = i === 0 ? 0 : data.space.length;
		const [low, high] = partRange(frame.parts[i], data, bounds);

		min += gap + low;
		max += gap + high;
	}

	return [min, max];
}

/**
 * Every sentence length the language can produce — the fallback for an omitted
 * `minLength` / `maxLength`, and what `sentenceLengthRange` reports. Derived from
 * the same frames and pools the generator draws from.
 */
export function naturalRange(language: WordLanguage): readonly [number, number] {
	const data = SENTENCE_DATA[language];
	const bounds = slotBounds(language);
	let min = Infinity;
	let max = 0;

	for (const frame of data.frames) {
		const [low, high] = frameRange(frame, data, bounds);

		min = Math.min(min, low);
		max = Math.max(max, high);
	}

	return [min, max];
}

/* --- Choosing the words ---------------------------------------------------- */

/** The themes one sentence may draw its subject from. */
function themesOf(theme: WordThemeOption): readonly WordTheme[] {
	return theme === 'all' ? WORD_THEMES : [theme];
}

/** The themes among `themes` whose nouns are one of `classes`. */
function themesForClasses(
	themes: readonly WordTheme[],
	classes: readonly NounClass[]
): readonly WordTheme[] {
	return themes.filter((theme) => classes.includes(THEME_CLASS[theme]));
}

function pickFrame(frames: readonly SentenceFrame[]): SentenceFrame {
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

/**
 * The verb group one sentence uses: transitive exactly when the shape has an
 * object, able to take the subject the shape will be given, and — when a word
 * was required — the group that word belongs to.
 */
function verbGroupsFor(
	data: SentenceLanguageData,
	frame: SentenceFrame,
	themes: readonly WordTheme[],
	plan: Plan
): readonly VerbGroup[] {
	const wantsObject = frame.parts.some((part) => part.slot === 'object');
	const subject = requiredAt(frame, plan, 'subject');
	const object = requiredAt(frame, plan, 'object');
	const verb = requiredAt(frame, plan, 'verb');

	const usable = data.verbs.filter((group) => {
		if (Boolean(group.object) !== wantsObject) {
			return false;
		}

		if (verb && !group.words.includes(verb.word)) {
			return false;
		}

		if (subject?.theme && !group.subject.includes(THEME_CLASS[subject.theme])) {
			return false;
		}

		if (object?.theme && !group.object?.includes(THEME_CLASS[object.theme])) {
			return false;
		}

		return (
			themesForClasses(themes, group.subject).length > 0 &&
			(!group.object || themesForClasses(WORD_THEMES, group.object).length > 0)
		);
	});

	return usable;
}

/** The same, for a shape headed by an adjective rather than a verb. */
function stateGroupsFor(
	data: SentenceLanguageData,
	themes: readonly WordTheme[],
	frame: SentenceFrame,
	plan: Plan
): readonly StateGroup[] {
	const subject = requiredAt(frame, plan, 'subject');
	const state = requiredAt(frame, plan, 'state');

	return data.states.filter((group) => {
		if (state && !group.words.includes(state.word)) {
			return false;
		}

		if (subject?.theme && !group.subject.includes(THEME_CLASS[subject.theme])) {
			return false;
		}

		return themesForClasses(themes, group.subject).length > 0;
	});
}

/* --- Building one sentence ------------------------------------------------- */

type Phrase = { text: string; noun?: string; theme?: WordTheme | null };

type Built = {
	sentence: string;
	phrases: string[];
	slots: SentenceSlot[];
	theme: WordTheme | null;
};

/** The article a phrase opens with, by the noun's gender and the word after it. */
function articleFor(
	data: SentenceLanguageData,
	gender: WordGender | undefined,
	next: string
): string {
	const rules = data.articles?.[gender ?? 'n'] ?? data.articles?.n;

	if (!rules) {
		return '';
	}

	const lower = next.toLowerCase();

	for (const [prefix, article] of rules) {
		if (lower.startsWith(prefix)) {
			return article;
		}
	}

	return '';
}

/** A word as a sentence writes it — English stores its pools capitalized. */
function plain(wordData: WordLanguageData, word: string): string {
	return wordData.capitalize ? word.charAt(0).toLowerCase() + word.slice(1) : word;
}

/** The other way round, for looking a written word back up in the pools. */
function capitalizeAsPool(wordData: WordLanguageData, word: string): string {
	return wordData.capitalize ? upper(word) : word;
}

/**
 * Build one noun phrase: an article where the language uses one, the noun, and a
 * modifier on the side the language's own frames put it.
 *
 * `min` and `max` are what the whole phrase has to land in. The article is
 * reserved before the noun is drawn — its length is not known until the noun's
 * gender is, so the longest one the language has is what gets set aside — and
 * whatever the noun leaves over is what the modifier is drawn to fit.
 */
function nounPhrase(
	language: WordLanguage,
	data: SentenceLanguageData,
	theme: WordTheme,
	forced: string | undefined,
	modify: boolean,
	bare: boolean,
	forcedModifier: string | undefined,
	invent: number,
	prefix: string,
	min: number,
	max: number
): Phrase {
	const wordData = WORD_DATA[language];
	const pool = nounsOf(language, theme);
	const space = data.space.length;
	const [, nounMax] = poolBounds(pool);
	const [modMin, modMax] = poolBounds(wordData.adjectives);
	const [, articleMax] = bare ? [0, 0] : articleSpan(data);
	const overhead = articleMax ? articleMax + space : 0;
	const modCost = modify ? modMin + space : 0;
	const high = Math.max(1, Math.min(nounMax, max - overhead - modCost));
	const low = Math.max(1, min - overhead - (modify ? modMax + space : 0));
	const drawn =
		forced ??
		plain(wordData, drawWord(wordData, pool, invent, Math.min(low, high), high, prefix).word);
	const gender = wordData.nounGender?.[capitalizeAsPool(wordData, drawn)];
	const parts = [drawn];

	if (modify) {
		const room = max - overhead - drawn.length - space;
		const want = min - overhead - drawn.length - space;
		const chosen =
			forcedModifier ??
			plain(
				wordData,
				pickWord(
					wordData.adjectives,
					Math.max(1, Math.min(want, room)),
					Math.max(1, Math.min(modMax, room)),
					''
				) ?? pick(wordData.adjectives)
			);
		const modifier = agree(wordData, chosen, gender);

		if (modifierFollows(wordData)) {
			parts.push(modifier);
		} else {
			parts.unshift(modifier);
		}
	}

	const article = bare ? '' : articleFor(data, gender, parts[0]);
	// An elided article carries its own boundary — `l'orso`, never `l' orso`.
	const written = article.endsWith("'")
		? article + parts.join(data.space)
		: [...(article ? [article] : []), ...parts].join(data.space);

	return {
		text: written,
		noun: drawn,
		// Compared in the form the sentence writes rather than the form the pool
		// stores, which is the same word for every language but English.
		theme: pool.some((entry) => plain(wordData, entry) === drawn)
			? theme
			: themeOf(wordData, capitalizeAsPool(wordData, drawn))
	};
}

/** The particle a part writes after its phrase, in the form the phrase asks for. */
function tailOf(part: SentencePart, phrase: string): string {
	if (part.tailAlt && endsWithConsonant(phrase)) {
		return part.tailAlt;
	}

	return part.tail ?? '';
}

/**
 * How often a noun phrase carries a modifier on this attempt. The first attempt
 * leaves it to chance; after that, a sentence that overshot the range drops its
 * modifiers and one that fell short takes them everywhere, which is how the
 * length range picks the shape rather than truncating a word.
 */
function modifyChanceFor(distance: number, tooLong: boolean): number {
	if (distance === 0) {
		return MODIFY_CHANCE;
	}

	return tooLong ? 0 : 100;
}

function generateOne(language: WordLanguage, settings: Settings): Built {
	const wordData = WORD_DATA[language];
	const data = SENTENCE_DATA[language];
	const bounds = slotBounds(language);
	const allowed = framesFor(data, settings);
	const requested = themesOf(settings.theme);
	const requirements = settings.include.map((word) => classify(language, word));
	const [min, max] = boundsFor(data, allowed, bounds, settings);
	const plans = new Map(allowed.map((frame) => [frame, planFor(frame, requirements)]));
	// A shape is only worth drawing when the language has a predicate for it: a
	// `body` subject has no transitive verb in any language here, so a shape with
	// an object in it would have to fall back to a verb that means something else.
	const buildable = (frame: SentenceFrame): boolean => {
		const { plan, complete } = plans.get(frame)!;

		if (!complete) {
			return false;
		}

		return frame.parts.some((part) => part.slot === 'state')
			? stateGroupsFor(data, requested, frame, plan).length > 0
			: verbGroupsFor(data, frame, requested, plan).length > 0;
	};
	// Prefer a shape that can land inside the range, then one that has somewhere to
	// put every word the caller required, and settle for any of them after that.
	const fitting = allowed.filter((frame) => {
		const [low, high] = frameRange(frame, data, bounds);

		return high >= min && low <= max && buildable(frame);
	});
	const loose = allowed.filter(buildable);
	const usable = fitting.length ? fitting : loose.length ? loose : allowed;
	let best: Built | null = null;
	let bestDistance = Infinity;
	let bestTooLong = false;

	for (let attempt = 0; attempt < FIT_ATTEMPTS; attempt += 1) {
		const frame = pickFrame(usable);
		const modifyChance = modifyChanceFor(attempt === 0 ? 0 : bestDistance, bestTooLong);
		const built = compose(
			language,
			wordData,
			data,
			frame,
			plans.get(frame)!.plan,
			requested,
			settings,
			modifyChance,
			bounds,
			min,
			max
		);

		if (built.sentence.length >= min && built.sentence.length <= max) {
			return built;
		}

		const over = built.sentence.length - max;
		const distance = over > 0 ? over : min - built.sentence.length;

		if (distance < bestDistance) {
			bestDistance = distance;
			bestTooLong = over > 0;
			best = built;
		}
	}

	return best!;
}

/** The length range one sentence has to land in. */
function boundsFor(
	data: SentenceLanguageData,
	frames: readonly SentenceFrame[],
	bounds: Record<string, readonly [number, number]>,
	settings: Settings
): [number, number] {
	let naturalMin = Infinity;
	let naturalMax = 0;

	for (const frame of frames) {
		const [low, high] = frameRange(frame, data, bounds);

		naturalMin = Math.min(naturalMin, low);
		naturalMax = Math.max(naturalMax, high);
	}

	return lengthBounds(
		settings.minLength,
		settings.maxLength,
		naturalMin,
		naturalMax,
		RAND_SENTENCE_LENGTH_MAX
	);
}

/**
 * Fill a shape and write it out.
 *
 * The predicate is settled first, because it is what decides which nouns can
 * stand beside it. The phrases themselves are then drawn in the order the frame
 * gives, each one against the room left once the phrases behind it have reserved
 * their shortest — which is how a narrow range drops a modifier rather than
 * overshooting a word, and how the subject's gender is in hand before the
 * adjective that has to agree with it.
 */
function compose(
	language: WordLanguage,
	wordData: WordLanguageData,
	data: SentenceLanguageData,
	frame: SentenceFrame,
	plan: Plan,
	requested: readonly WordTheme[],
	settings: Settings,
	modifyChance: number,
	bounds: Record<string, readonly [number, number]>,
	min: number,
	max: number
): Built {
	const themes = requested.length ? requested : WORD_THEMES;
	const headed = frame.parts.some((part) => part.slot === 'state') ? 'state' : 'verb';
	// A shape whose predicate has nothing to say about the requested subject only
	// gets this far when no shape of the language did, so the fallback is the same
	// best effort every other narrowing here makes.
	const groups =
		headed === 'state'
			? (stateGroupsFor(data, themes, frame, plan) as (StateGroup | VerbGroup)[])
			: (verbGroupsFor(data, frame, themes, plan) as (StateGroup | VerbGroup)[]);
	const group = pick(groups.length ? groups : headedFallback(data, frame, headed));
	const subjectThemes = themesForClasses(themes, group.subject);
	const subjectRequired = requiredAt(frame, plan, 'subject');
	// A theme the caller named is honoured even when no verb group of the language
	// has anything to say about it, the same way a shape it cannot make falls back
	// rather than being answered with something else entirely.
	const subjectTheme =
		subjectRequired?.theme ?? pick(subjectThemes.length ? subjectThemes : themes);
	// Only a shape that opens on a noun phrase with nothing in front of it can
	// honour `startsWith`; anywhere else the sentence opens on an article, a
	// preposition or an adverbial, and `collect` filters what does not match.
	const first = frame.parts[0];
	const prefixable = isNounSlot(first.slot) && !first.head && !data.articles;
	const space = data.space.length;
	const spans = frame.parts.map((part, i) => {
		const [low, high] = partRange(part, data, bounds);
		const gap = i === 0 ? 0 : space;

		return [gap + low, gap + high] as const;
	});
	const written: string[] = [];
	const reported: string[] = [];
	const slots: SentenceSlot[] = [];
	let subject: Phrase | undefined;
	let gender: WordGender | undefined;
	let used = data.terminator.length;

	for (let i = 0; i < frame.parts.length; i += 1) {
		const part = frame.parts[i];
		let restMin = 0;
		let restMax = 0;

		for (let rest = i + 1; rest < frame.parts.length; rest += 1) {
			restMin += spans[rest][0];
			restMax += spans[rest][1];
		}

		const gap = i === 0 ? 0 : space;
		const headCost = part.head ? part.head.length + space : 0;
		const tailCost = Math.min(
			part.tail?.length ?? 0,
			part.tailAlt?.length ?? part.tail?.length ?? 0
		);
		const overhead = gap + headCost + tailCost;
		const high = Math.max(1, max - used - overhead - restMin);
		const low = Math.max(1, min - used - overhead - restMax);
		let phrase: string;

		if (isNounSlot(part.slot)) {
			const required = plan.phrase.get(i);
			const owed = plan.modifier.get(i);
			const theme =
				part.slot === 'subject'
					? subjectTheme
					: (required?.theme ?? themeForPart(part.slot, group, themes));
			const room = high - poolBounds(nounsOf(language, theme))[0];
			const modify =
				(part.modifiable ?? false) &&
				(Boolean(owed) || (room >= bounds.modifier[0] + space && chance(modifyChance)));
			const built = nounPhrase(
				language,
				data,
				theme,
				required?.word,
				modify,
				part.bare ?? false,
				owed?.word,
				settings.invent,
				prefixable && i === 0 ? settings.prefix : '',
				low,
				high
			);

			phrase = built.text;

			if (part.slot === 'subject') {
				subject = built;
				gender = wordData.nounGender?.[capitalizeAsPool(wordData, built.noun!)];
			}
		} else {
			phrase = predicateFor(
				part.slot,
				wordData,
				data,
				group,
				plan.phrase.get(i),
				gender,
				low,
				high
			);
		}

		// The opening capital belongs to whatever is written first, and that is the
		// phrase itself unless a preposition stands in front of it. Applied here
		// rather than to the finished string, so the phrase the detail reports is
		// the one the sentence actually shows.
		const opens = data.capitalize && !written.length;
		const head = opens && part.head ? upper(part.head) : part.head;
		const text = opens && !part.head ? upper(phrase) : phrase;
		const tail = tailOf(part, text);

		if (head) {
			written.push(head);
		}

		written.push(text + tail);
		reported.push(text);
		slots.push(part.slot);
		used += gap + headCost + text.length + tail.length;
	}

	return {
		sentence: written.join(data.space) + data.terminator,
		phrases: reported,
		slots,
		theme: subject?.theme ?? null
	};
}

/** The word a phrase that is not a noun phrase writes: the predicate, or an adverb. */
function predicateFor(
	slot: SentenceSlot,
	wordData: WordLanguageData,
	data: SentenceLanguageData,
	group: StateGroup | VerbGroup,
	required: Requirement | undefined,
	gender: WordGender | undefined,
	min: number,
	max: number
): string {
	const agreed = (word: string) =>
		slot === 'state' && data.predicateAgrees ? agree(wordData, word, gender) : word;

	if (required) {
		return agreed(required.word);
	}

	const pool =
		slot === 'manner' ? data.manners : slot === 'time' ? data.times : (group.words as WordPool);

	return agreed(pickWord(pool, Math.min(min, max), max, '') ?? pick(pool));
}

function upper(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Whatever the language can head this shape with, when nothing narrower fits. */
function headedFallback(
	data: SentenceLanguageData,
	frame: SentenceFrame,
	headed: 'state' | 'verb'
): (StateGroup | VerbGroup)[] {
	if (headed === 'state') {
		return [...data.states];
	}

	const wantsObject = frame.parts.some((part) => part.slot === 'object');

	return data.verbs.filter((group) => Boolean(group.object) === wantsObject);
}

/** The theme a phrase other than the subject draws from. */
function themeForPart(
	slot: SentenceSlot,
	group: VerbGroup | StateGroup,
	themes: readonly WordTheme[]
): WordTheme {
	if (slot === 'object') {
		const usable = themesForClasses(WORD_THEMES, (group as VerbGroup).object ?? []);

		return pick(usable.length ? usable : WORD_THEMES);
	}

	const places = themesForClasses(WORD_THEMES, ['place']);

	return pick(places.length ? places : themes);
}

/* --- The public entry point's engine --------------------------------------- */

/**
 * The caller's `slots`, in the form the generator wants: one slot becomes a
 * one-entry set, and an empty set asks the same thing `'none'` does.
 */
function resolveSlots(slots: SentenceSlotOption | undefined): Settings['slots'] {
	if (slots === undefined || slots === 'all' || slots === 'none') {
		return slots ?? 'all';
	}

	const wanted = typeof slots === 'string' ? [slots] : slots;

	return wanted.length ? wanted : 'none';
}

/** The caller's `include`, as a list with the blanks taken out. */
function resolveInclude(include: RandSentenceOptions['include']): readonly string[] {
	if (include === undefined) {
		return [];
	}

	const listed = typeof include === 'string' ? [include] : include;

	return listed.map((word) => word.trim()).filter(Boolean);
}

function resolveSettings(options: RandSentenceOptions): Settings {
	return {
		theme: options.theme ?? 'all',
		shape: options.shape ?? 'all',
		slots: resolveSlots(options.slots),
		invent: resolveRealism(options.realism),
		minLength: resolveLength(options.minLength),
		maxLength: resolveLength(options.maxLength),
		prefix: resolvePrefix(options.startsWith),
		include: resolveInclude(options.include)
	};
}

export function generateSentenceDetails(options: RandSentenceOptions = {}): SentenceDetail[] {
	const settings = resolveSettings(options);
	const language = options.language ?? 'all';

	return collect(
		options,
		() => {
			const code = drawLanguage(language, languagesFor(settings));
			const { sentence, phrases, slots, theme } = generateOne(code, settings);

			return { sentence, phrases, slots, language: code, theme };
		},
		(detail) => detail.sentence
	);
}
