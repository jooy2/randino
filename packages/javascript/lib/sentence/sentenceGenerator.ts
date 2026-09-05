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
import { chance, clamp, pick } from '../_internal/utils.js';
import { RAND_SENTENCE_COUNT_MAX, RAND_SENTENCE_LENGTH_MAX } from '../constants.js';
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
	genderOf,
	modifierFollows,
	pickWord,
	poolBounds,
	synthBounds,
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
	// How many sentences one result holds, clamped.
	sentences: number;
};

/**
 * What the sentences of one result are about: the first sentence's subject, and
 * everything a later one needs to keep talking about it.
 *
 * A paragraph is not three draws, and this is the whole of the difference. The
 * class is what a fresh subject stays inside, the noun is what naming it again
 * writes, and the gender is what a pronoun and an agreeing predicate need.
 */
type Topic = {
	/** The subject noun as the first sentence wrote it. */
	noun: string;
	theme: WordTheme | null;
	/** The class its theme falls into. Null when the noun is one no pool holds. */
	class: NounClass | null;
	gender: WordGender | undefined;
};

/**
 * How a sentence that follows another refers to what the two of them are about:
 * `'repeat'` names the topic again, `'pronoun'` stands in for it — with the empty
 * string where the language drops its subject — and `'fresh'` draws another noun
 * of the same class.
 */
type Reference = 'repeat' | 'pronoun' | 'fresh';

/** Everything a sentence after the first one is built with. */
type Follow = {
	topic: Topic;
	reference: Reference;
	/** What a `'pronoun'` reference writes; `''` where the language writes nothing. */
	pronoun: string;
	/** The connective the sentence opens on, `''` for none. */
	opener: string;
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
	requirements: readonly Requirement[],
	subject?: Requirement
): { plan: Plan; complete: boolean } {
	if (!requirements.length && !subject) {
		return { plan: EMPTY_PLAN, complete: true };
	}

	const plan: Plan = { phrase: new Map(), modifier: new Map() };
	let complete = true;

	// A sentence carrying on about the topic is handed its subject rather than
	// asking for it, so it goes in the subject's own phrase before the greedy
	// placement below reaches for the first noun slot it can find.
	if (subject) {
		const at = frame.parts.findIndex((part) => part.slot === 'subject');

		if (at >= 0) {
			plan.phrase.set(at, subject);
		}
	}

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
const spanCache = new Map<string, readonly [number, number]>();
const agreedCache = new Map<string, readonly string[]>();

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

/**
 * Shortest and longest noun one phrase can actually be given, which is not the
 * same question `poolBounds` answers: at `realism: 'invented'` the word comes out
 * of the language's syllable template rather than its pools, and English invents
 * at most two syllables where its pools hold words of twelve letters. A budget
 * measured against the wrong one of those is a `minLength` the phrase cannot
 * reach.
 */
function nounSpan(
	language: WordLanguage,
	theme: WordTheme,
	invent: number
): readonly [number, number] {
	const key = `${language}:${theme}:${invent}`;
	const cached = spanCache.get(key);

	if (cached) {
		return cached;
	}

	const [poolLow, poolHigh] = poolBounds(nounsOf(language, theme));
	const [synLow, synHigh] = synthBounds(WORD_DATA[language].syn);
	// `'mixed'` draws from both, so both lengths are on the table.
	const span: readonly [number, number] =
		invent >= 100
			? [synLow, synHigh]
			: invent <= 0
				? [poolLow, poolHigh]
				: [Math.min(poolLow, synLow), Math.max(poolHigh, synHigh)];

	spanCache.set(key, span);

	return span;
}

/**
 * The modifiers of a language, in the form they take beside a noun of `gender`.
 *
 * Written out rather than agreed after the fact, because a length budget has to
 * see the word the sentence will actually carry: German `blau` is `blauer` in
 * front of a masculine noun, and choosing by the four letters and writing the six
 * is how a sentence quietly stepped outside its range.
 */
function agreedModifiers(
	language: WordLanguage,
	gender: WordGender | undefined
): readonly string[] {
	const wordData = WORD_DATA[language];

	if (!gender || !wordData.agreement) {
		return wordData.adjectives;
	}

	const key = `${language}:${gender}`;
	const cached = agreedCache.get(key);

	if (cached) {
		return cached;
	}

	const agreed = wordData.adjectives.map((word) => agree(wordData, word, gender));

	agreedCache.set(key, agreed);

	return agreed;
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
	const genders: (WordGender | undefined)[] = wordData.agreement
		? [undefined, ...(Object.keys(wordData.agreement) as WordGender[])]
		: [undefined];
	const bounds = {
		noun: span(WORD_THEMES.map((theme) => nounsOf(language, theme))),
		modifier: span(genders.map((gender) => agreedModifiers(language, gender))),
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

/** The shortest and longest sentence a set of shapes can produce. */
function naturalSpan(
	data: SentenceLanguageData,
	frames: readonly SentenceFrame[],
	bounds: Record<string, readonly [number, number]>
): readonly [number, number] {
	let min = Infinity;
	let max = 0;

	for (const frame of frames) {
		const [low, high] = frameRange(frame, data, bounds);

		min = Math.min(min, low);
		max = Math.max(max, high);
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

	return naturalSpan(data, data.frames, slotBounds(language));
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

function pickFrame(
	frames: readonly SentenceFrame[],
	boost?: (frame: SentenceFrame) => number
): SentenceFrame {
	const weightOf = (frame: SentenceFrame) => frame.weight * (boost ? boost(frame) : 1);
	const total = frames.reduce((sum, frame) => sum + weightOf(frame), 0);
	let roll = Math.random() * total;

	for (const frame of frames) {
		roll -= weightOf(frame);

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

/** One noun phrase, and the noun it was built around. */
type Phrase = { text: string; noun: string; theme: WordTheme | null };

type Built = {
	sentence: string;
	phrases: string[];
	slots: SentenceSlot[];
	theme: WordTheme | null;
	/** The subject noun as written, which is what the next sentence carries on about. */
	subject: string | null;
	/** Its gender, for the pronoun and the agreement of whatever follows. */
	gender: WordGender | undefined;
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
	max: number,
	span: readonly [number, number]
): Phrase {
	const wordData = WORD_DATA[language];
	const pool = nounsOf(language, theme);
	const space = data.space.length;
	const [, nounMax] = span;
	const [modMin, modMax] = poolBounds(wordData.adjectives);
	// Measured against the base forms, because the noun that decides the gender has
	// not been drawn yet; the modifier itself is chosen from the agreed pool below.
	const [, articleMax] = bare ? [0, 0] : articleSpan(data);
	const overhead = articleMax ? articleMax + space : 0;
	const modCost = modify ? modMin + space : 0;
	const high = Math.max(1, Math.min(nounMax, max - overhead - modCost));
	const low = Math.max(1, min - overhead - (modify ? modMax + space : 0));
	const drawn =
		forced ??
		plain(wordData, drawWord(wordData, pool, invent, Math.min(low, high), high, prefix).word);
	const gender = genderOf(wordData, capitalizeAsPool(wordData, drawn));
	const parts = [drawn];

	if (modify) {
		const room = max - overhead - drawn.length - space;
		const want = min - overhead - drawn.length - space;
		const agreed = agreedModifiers(language, gender);
		const modifier =
			(forcedModifier ? agree(wordData, forcedModifier, gender) : null) ??
			plain(
				wordData,
				pickWord(
					agreed,
					Math.max(1, Math.min(want, room)),
					Math.max(1, Math.min(modMax, room)),
					''
				) ?? pick(agreed)
			);

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

/**
 * The themes a sentence may draw its subject from. A sentence carrying on about
 * a topic stays inside the topic's own class, which is what makes a paragraph
 * read as one rather than as three draws that happened to land together.
 */
function subjectThemesFor(settings: Settings, follow: Follow | null): readonly WordTheme[] {
	const requested = themesOf(settings.theme);

	if (!follow?.topic.class) {
		return requested;
	}

	const inClass = themesForClasses(requested, [follow.topic.class]);

	return inClass.length ? inClass : requested;
}

function generateOne(
	language: WordLanguage,
	settings: Settings,
	budget: readonly [number, number],
	follow: Follow | null
): Built {
	const wordData = WORD_DATA[language];
	const data = SENTENCE_DATA[language];
	const bounds = slotBounds(language);
	const allowed = framesFor(data, settings);
	const requested = subjectThemesFor(settings, follow);
	// The words a caller required go in the first sentence — once in the result
	// rather than once in every sentence of it.
	const requirements = follow ? [] : settings.include.map((word) => classify(language, word));
	const carried =
		follow?.reference === 'repeat'
			? ({
					word: follow.topic.noun,
					slots: ['subject'],
					theme: follow.topic.theme ?? undefined,
					known: follow.topic.theme !== null
				} as Requirement)
			: undefined;
	const [min, max] = budget;
	const plans = new Map(allowed.map((frame) => [frame, planFor(frame, requirements, carried)]));
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
		// After a miss, a shape whose own range runs past the requested one in the
		// direction that was missed is four times as likely. Weighted rather than
		// filtered: a shape that missed by two characters can still make it on the
		// next draw, and dropping it left a language whose short shape was the only
		// one in range settling for whatever it had.
		const frame = pickFrame(
			usable,
			attempt > 0 && bestDistance > 0
				? (candidate) => {
						const [low, high] = frameRange(candidate, data, bounds);

						return (bestTooLong ? low <= min : high >= max) ? 4 : 1;
					}
				: undefined
		);
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
			max,
			follow
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

/**
 * The length range one whole result has to land in — every sentence of it and the
 * spaces between them, because that is what `minLength` and `maxLength` describe.
 *
 * The ceiling is per sentence rather than per result: a paragraph of ten is ten
 * sentences long, and capping it at what one of them may be would answer the ask
 * with ten sentences of twenty characters.
 */
function boundsFor(
	data: SentenceLanguageData,
	frames: readonly SentenceFrame[],
	bounds: Record<string, readonly [number, number]>,
	settings: Settings
): [number, number] {
	const count = settings.sentences;
	const gap = data.space.length * (count - 1);
	const [naturalMin, naturalMax] = naturalSpan(data, frames, bounds);

	return lengthBounds(
		settings.minLength,
		settings.maxLength,
		naturalMin * count + gap,
		naturalMax * count + gap,
		RAND_SENTENCE_LENGTH_MAX * count + gap
	);
}

/** How far a length falls outside a range, and `0` when it is inside it. */
function distanceFrom(length: number, [low, high]: readonly [number, number]): number {
	return length > high ? length - high : Math.max(0, low - length);
}

/**
 * The result's range, shared out over its sentences. The joins between them come
 * off the top and the last sentence absorbs the rounding, so the shares add back
 * up to exactly what the caller asked for rather than to one character less.
 */
function shareOut(
	min: number,
	max: number,
	count: number,
	space: number
): readonly (readonly [number, number])[] {
	if (count === 1) {
		return [[min, max]];
	}

	const gap = space * (count - 1);
	const split = (total: number): number[] => {
		const body = Math.max(count, total - gap);
		const each = Math.floor(body / count);
		const shares = new Array<number>(count).fill(each);

		shares[count - 1] = body - each * (count - 1);

		return shares;
	};
	const mins = split(min);
	const maxs = split(max);

	return mins.map((low, i) => [Math.max(1, low), Math.max(low, maxs[i])] as const);
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
	max: number,
	follow: Follow | null
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
	// A sentence carrying on about the topic stands a pronoun where its subject
	// would go, and the languages that drop their subject stand nothing there at
	// all — in which case the phrase is not in the shape to carry an article, a
	// modifier or a particle. Written out as its own list so that every budget
	// below is measured against what the sentence actually writes; `at` is the
	// index back into the frame, which is what the plan is keyed by.
	const pronoun = follow?.reference === 'pronoun' ? follow.pronoun : null;
	const parts: { part: SentencePart; at: number }[] = [];

	frame.parts.forEach((part, at) => {
		if (part.slot !== 'subject' || pronoun === null) {
			parts.push({ part, at });

			return;
		}

		if (pronoun) {
			parts.push({ part: { ...part, modifiable: false, bare: true }, at });
		}
	});

	// Every phrase's theme is settled before any of them is drawn, because a length
	// budget is only as good as the pools it was measured against. Left to the loop,
	// each phrase was given the room the language's longest noun would need and
	// drew a word out of its own theme, which is how a sentence came out short of a
	// `minLength` the shape could otherwise have reached.
	const partThemes = parts.map(({ part, at }) =>
		isNounSlot(part.slot)
			? part.slot === 'subject'
				? subjectTheme
				: (plan.phrase.get(at)?.theme ?? themeForPart(part.slot, group, themes))
			: null
	);
	// The same for the predicate: `bounds` spans every group the language has, and
	// one sentence draws from one of them. A word the caller required is narrower
	// still — its length is not a range at all, and neither is a pronoun's.
	const partBounds = parts.map(({ part, at }, i) => {
		const theme = partThemes[i];
		const required = plan.phrase.get(at);
		const written = part.slot === 'subject' && pronoun ? pronoun : required?.word;
		const exact = written ? ([written.length, written.length] as const) : null;

		if (theme) {
			const owed = plan.modifier.get(at);

			return {
				...bounds,
				noun: exact ?? nounSpan(language, theme, settings.invent),
				modifier: owed ? ([owed.word.length, owed.word.length] as const) : bounds.modifier
			};
		}

		if (part.slot === 'verb' || part.slot === 'state') {
			return { ...bounds, [part.slot]: exact ?? poolBounds(group.words) };
		}

		return exact ? { ...bounds, [part.slot]: exact } : bounds;
	});
	// Only a shape that opens on a noun phrase with nothing in front of it can
	// honour `startsWith`; anywhere else the sentence opens on an article, a
	// preposition or an adverbial, and `collect` filters what does not match. A
	// sentence after the first one never opens the result, so it never carries it.
	const first = parts[0].part;
	const prefixable = !follow && isNounSlot(first.slot) && !first.head && !data.articles;
	const space = data.space.length;
	const opener = follow?.opener ?? '';
	const spans = parts.map(({ part }, i) => {
		const [low, high] = partRange(part, data, partBounds[i]);
		const gap = i === 0 ? 0 : space;

		return [gap + low, gap + high] as const;
	});
	const written: string[] = [];
	const reported: string[] = [];
	const slots: SentenceSlot[] = [];
	let subject: Phrase | undefined;
	// A pronoun says nothing about its own gender, so what agrees with it agrees
	// with the noun it stands for.
	let gender: WordGender | undefined = pronoun ? follow!.topic.gender : undefined;
	let used = data.terminator.length + (opener ? opener.length + space : 0);

	if (opener) {
		written.push(data.capitalize ? upper(opener) : opener);
	}

	for (let i = 0; i < parts.length; i += 1) {
		const { part, at } = parts[i];
		let restMin = 0;
		let restMax = 0;

		for (let rest = i + 1; rest < parts.length; rest += 1) {
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

		if (part.slot === 'subject' && pronoun) {
			phrase = pronoun;
		} else if (isNounSlot(part.slot)) {
			const required = plan.phrase.get(at);
			const owed = plan.modifier.get(at);
			const theme = partThemes[i]!;
			const [nounLow, nounHigh] = partBounds[i].noun;
			const [, articleMax] = part.bare ? [0, 0] : articleSpan(data);
			const room = high - nounLow;
			// A phrase whose share of the range is longer than any noun of its theme
			// takes a modifier whatever the roll says, which is the only way it can
			// reach it — the alternative is a sentence that quietly misses `minLength`.
			const needed = low > (articleMax ? articleMax + space : 0) + nounHigh;
			const modify =
				(part.modifiable ?? false) &&
				(Boolean(owed) || needed || (room >= bounds.modifier[0] + space && chance(modifyChance)));
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
				high,
				[nounLow, nounHigh]
			);

			phrase = built.text;

			if (part.slot === 'subject') {
				subject = built;
				gender = genderOf(wordData, capitalizeAsPool(wordData, built.noun));
			}
		} else {
			phrase = predicateFor(
				part.slot,
				wordData,
				data,
				group,
				plan.phrase.get(at),
				gender,
				low,
				high
			);
		}

		// The opening capital belongs to whatever is written first, and that is the
		// phrase itself unless a connective or a preposition stands in front of it.
		// Applied here rather than to the finished string, so the phrase the detail
		// reports is the one the sentence actually shows.
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
		theme: subject?.theme ?? null,
		subject: subject?.noun ?? (pronoun ? follow!.topic.noun : null),
		gender: subject ? gender : pronoun !== null ? follow!.topic.gender : undefined
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

/* --- Building the whole result --------------------------------------------- */

// How often a sentence that follows another one opens on a connective.
const CONNECTIVE_CHANCE = 40;

// How a sentence refers to the topic, against the other two ways of doing it.
const REFERENCE_WEIGHT: Record<Reference, number> = { repeat: 25, pronoun: 40, fresh: 35 };

/** What the rest of the result is about, read off the sentence that opened it. */
function topicOf(built: Built): Topic | null {
	if (!built.subject) {
		return null;
	}

	return {
		noun: built.subject,
		theme: built.theme,
		class: built.theme ? THEME_CLASS[built.theme] : null,
		gender: built.gender
	};
}

/**
 * The pronouns the language can stand in for this topic with. A class its written
 * pronouns are wrong for is left with the empty entry alone — the language says
 * nothing where it can, and where it cannot, there is no pronoun to be had and
 * the sentence names the topic again instead.
 */
function pronounsFor(data: SentenceLanguageData, topic: Topic): WordPool {
	const pool = data.pronouns[topic.gender ?? 'n'] ?? data.pronouns.n ?? [];

	if (topic.class && data.pronounless?.includes(topic.class)) {
		return pool.filter((word) => !word);
	}

	return pool;
}

/**
 * How one sentence carries on from the one before it.
 *
 * `room` is what this sentence may be at its longest, and it is what decides
 * whether it opens on a connective at all: a connective is written in front of a
 * whole sentence rather than instead of any part of it, so one longer than the
 * budget can spare is a sentence that overshoots by exactly its length. Russian
 * `тем временем` is thirteen characters, and a third of a range of seventy-five
 * has nowhere to put them.
 */
function followFor(
	data: SentenceLanguageData,
	topic: Topic,
	room: number,
	shortest: number
): Follow {
	const pronouns = pronounsFor(data, topic);
	const usable: Reference[] = pronouns.length
		? ['repeat', 'pronoun', 'fresh']
		: ['repeat', 'fresh'];
	const spare = room - data.space.length - shortest;
	const openers = data.connectives.filter((word) => word.length <= spare);
	const total = usable.reduce((sum, each) => sum + REFERENCE_WEIGHT[each], 0);
	let roll = Math.random() * total;
	let reference = usable[usable.length - 1];

	for (const each of usable) {
		roll -= REFERENCE_WEIGHT[each];

		if (roll <= 0) {
			reference = each;
			break;
		}
	}

	return {
		topic,
		reference,
		pronoun: reference === 'pronoun' ? pick(pronouns) : '',
		opener: openers.length && chance(CONNECTIVE_CHANCE) ? pick(openers) : ''
	};
}

/**
 * Every sentence of one result, in order.
 *
 * The range is shared out before the first of them is drawn, and the topic is
 * taken from that first sentence — so what follows is about the same thing rather
 * than another draw that happened to land beside it.
 */
function generateResult(language: WordLanguage, settings: Settings): Built[] {
	const data = SENTENCE_DATA[language];
	const bounds = slotBounds(language);
	const frames = framesFor(data, settings);
	const [shortest] = naturalSpan(data, frames, bounds);
	const [min, max] = boundsFor(data, frames, bounds, settings);
	const budgets = shareOut(min, max, settings.sentences, data.space.length);
	const built: Built[] = [];
	let topic: Topic | null = null;

	for (let i = 0; i < settings.sentences; i += 1) {
		const follow = topic ? followFor(data, topic, budgets[i][1], shortest) : null;
		let one = generateOne(language, settings, budgets[i], follow);

		// `followFor` reserves room for the connective against the shortest sentence
		// the shapes could spell, which is a floor no draw actually reaches — the
		// shortest word of every pool at once. When the sentence that came back could
		// not be made short enough to carry the connective after all, the connective
		// is the part worth giving up: it is written in front of the whole sentence
		// rather than instead of any piece of it.
		if (follow?.opener && distanceFrom(one.sentence.length, budgets[i]) > 0) {
			const bare = generateOne(language, settings, budgets[i], { ...follow, opener: '' });

			if (
				distanceFrom(bare.sentence.length, budgets[i]) <
				distanceFrom(one.sentence.length, budgets[i])
			) {
				one = bare;
			}
		}

		built.push(one);

		if (!topic) {
			topic = topicOf(one);
		}
	}

	return built;
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
		include: resolveInclude(options.include),
		sentences: clamp(Math.floor(options.sentences ?? 1), 1, RAND_SENTENCE_COUNT_MAX)
	};
}

export function generateSentenceDetails(options: RandSentenceOptions = {}): SentenceDetail[] {
	const settings = resolveSettings(options);
	const language = options.language ?? 'all';

	return collect(
		options,
		() => {
			const code = drawLanguage(language, languagesFor(settings));
			const data = SENTENCE_DATA[code];
			const built = generateResult(code, settings);

			return {
				sentence: built.map((one) => one.sentence).join(data.space),
				sentences: built.map((one) => one.sentence),
				phrases: built.flatMap((one) => one.phrases),
				slots: built.flatMap((one) => one.slots),
				language: code,
				// What the result is about is what its first sentence was about; the
				// ones after it stay inside that noun's class.
				theme: built[0].theme
			};
		},
		(detail) => detail.sentence
	);
}
