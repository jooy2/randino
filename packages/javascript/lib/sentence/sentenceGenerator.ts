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
import { chance, clamp, pick, pickWeighted, randInt } from '../_internal/utils.js';
import { RAND_SENTENCE_COUNT_MAX, RAND_SENTENCE_LENGTH_MAX } from '../constants.js';
import type {
	NameGender,
	RandRealism,
	RandSentenceOptions,
	SentenceDetail,
	SentenceShapeOption,
	SentenceSlot,
	SentenceSlotOption,
	SentenceQuote,
	SentenceStyle,
	SentenceType,
	SentenceTypeOption,
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
import { drawName } from '../name/nameGenerator.js';
import { nameLengthRange } from '../name/nameLengthRange.js';
import { SENTENCE_DATA, THEME_CLASS } from './data/index.js';
import type {
	NounClass,
	PredicateForm,
	SentenceFrame,
	SentenceMark,
	SentenceMood,
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

// How often a sentence that draws a fresh subject draws it from the topic's own
// theme rather than from anywhere in the topic's class.
const THEME_CHANCE = 65;

/** The slots that are a noun phrase, and so draw from the word pools. */
const NOUN_SLOTS: readonly SentenceSlot[] = ['subject', 'object', 'place', 'quantity'];

function isNounSlot(slot: SentenceSlot): boolean {
	return NOUN_SLOTS.includes(slot);
}

/**
 * The class money belongs to, which is what decides the verbs it can stand
 * beside: an amount is an idea, so the verbs that remember and count one are the
 * verbs that can take it.
 */
const MONEY_CLASS: NounClass = 'idea';

/**
 * Whether a shape has anywhere a person's name could stand. A counted shape
 * makes its quantity the subject, and a copular one equates its subject to a day
 * — neither is a room for somebody.
 */
function carriesPerson(frame: SentenceFrame): boolean {
	return (
		subjectSlotOf(frame) !== 'quantity' && !frame.parts.some((part) => part.copula !== undefined)
	);
}

/**
 * Which slot this shape's subject stands in. Usually `subject`, and `quantity`
 * for a shape that counts the thing the sentence is about — `사과 12개가 익는다`
 * has no separate subject, and the counted phrase is what the verb agrees with.
 */
function subjectSlotOf(frame: SentenceFrame): SentenceSlot {
	return frame.parts.some((part) => part.slot === 'subject') ? 'subject' : 'quantity';
}

/** Whether a shape puts a noun phrase after its verb, counted or not. */
function takesObject(frame: SentenceFrame): boolean {
	const subject = subjectSlotOf(frame);

	return frame.parts.some(
		(part) =>
			part.slot === 'object' ||
			part.slot === 'money' ||
			(part.slot === 'quantity' && subject !== 'quantity')
	);
}

/** The digits of a number, grouped the way the language groups them. */
function grouped(value: number, group: string): string {
	return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, group);
}

/**
 * A date, written the way the language writes one. `Y`, `M`, `D` and `MMMM`
 * stand for the year, the month, the day and the month's name.
 */
function dateText(data: SentenceLanguageData): string {
	const calendar = data.calendar!;
	const [first, last] = calendar.years;
	const month = randInt(1, 12);
	// The month goes in last, because a month's name has letters in it that the
	// other two stand for: `März` would lose its `M` to the month number.
	const written = calendar.date
		.replace('Y', String(randInt(first, last)))
		.replace('D', String(randInt(1, 28)));

	return calendar.months
		? written.replace('MMMM', calendar.months[month - 1])
		: written.replace('M', String(month));
}

/** A clock time, likewise. `h` is the hour and `mm` the minute. */
function clockText(data: SentenceLanguageData): string {
	const calendar = data.calendar!;

	return calendar.clock
		.replace('h', String(randInt(0, 23)))
		.replace('mm', String(randInt(0, 59)).padStart(2, '0'));
}

/**
 * Shortest and longest either of them can be, for the budget. Measured by taking
 * the numbers out of the template and adding back the widest and narrowest each
 * of them can be written as.
 */
function calendarSpan(
	data: SentenceLanguageData,
	slot: 'date' | 'clock'
): readonly [number, number] {
	const calendar = data.calendar;

	if (!calendar) {
		return [1, 1];
	}

	if (slot === 'clock') {
		const fixed = calendar.clock.replace('h', '').replace('mm', '').length;

		return [fixed + 1 + 2, fixed + 2 + 2];
	}

	const fixed = (
		calendar.months ? calendar.date.replace('MMMM', '') : calendar.date.replace('M', '')
	)
		.replace('Y', '')
		.replace('D', '').length;
	const names = calendar.months ? poolBounds(calendar.months) : ([1, 2] as const);
	const years = [String(calendar.years[0]).length, String(calendar.years[1]).length];

	return [fixed + names[0] + years[0] + 1, fixed + names[1] + years[1] + 2];
}

/** What a counted phrase writes beside its noun, and what an amount writes. */
function countText(data: SentenceLanguageData, theme: WordTheme): string {
	const numeral = data.numeral!;
	const counter = numeral.counters[THEME_CLASS[theme]] ?? '';
	const [low, high] = numeral.count;
	const number = grouped(randInt(low, high), numeral.group);

	return counter ? number + numeral.gap + counter : number;
}

function moneyText(data: SentenceLanguageData): string {
	const numeral = data.numeral!;

	return grouped(pick(numeral.amounts), numeral.group) + numeral.gap + numeral.currency;
}

/** Shortest and longest a count can be, so a phrase can reserve room for one. */
function countSpan(data: SentenceLanguageData): readonly [number, number] {
	const numeral = data.numeral;

	if (!numeral) {
		return [0, 0];
	}

	const counters = Object.values(numeral.counters);
	const width = (value: number) => grouped(value, numeral.group).length;
	const counter = counters.length
		? [
				Math.min(...counters.map((word) => word.length)) + numeral.gap.length,
				Math.max(...counters.map((word) => word.length)) + numeral.gap.length
			]
		: [0, 0];

	return [
		data.space.length + width(numeral.count[0]) + counter[0],
		data.space.length + width(numeral.count[1]) + counter[1]
	];
}

/** The same for an amount, which is a phrase of its own rather than part of one. */
function moneySpan(data: SentenceLanguageData): readonly [number, number] {
	const numeral = data.numeral;

	if (!numeral) {
		return [1, 1];
	}

	const widths = numeral.amounts.map(
		(value) => grouped(value, numeral.group).length + numeral.gap.length + numeral.currency.length
	);

	return [Math.min(...widths), Math.max(...widths)];
}

type Settings = {
	theme: WordThemeOption;
	shape: SentenceShapeOption;
	// The parts a shape may carry, normalized: one slot has become a one-entry
	// set, and an empty set has become `'none'`.
	slots: readonly SentenceSlot[] | 'all' | 'none';
	// How often one word is invented rather than drawn, as a percentage.
	invent: number;
	// The same thing again, in the form `randName` takes it. A sentence that writes
	// a person's name hands the name generator the level the caller asked for.
	realism: RandRealism;
	minLength?: number;
	maxLength?: number;
	prefix: string;
	include: readonly string[];
	// How many sentences one result holds, clamped.
	sentences: number;
	// Whether a phrase about a person is written as a name.
	// Whether a sentence about a person writes a name, or null when the caller left
	// it to the generator, in which case it is decided once per result.
	includeName: boolean | null;
	// What the sentences may be doing, normalized to a set to draw from.
	types: readonly SentenceType[];
	// Which marks a quoted line takes, or undefined for the type's own default.
	quote?: SentenceQuote;
	// How the sentences address their reader, or null when the caller left it to
	// the generator.
	style: SentenceStyle | null;
};

// The kinds a quoted line can be. Somebody speaking is as often asking as
// telling, and often enough neither, so the mark is drawn rather than fixed.
const QUOTED_MARKS: readonly SentenceMark[] = ['statement', 'question', 'exclamation'];

// The kinds that are a line somebody says or thinks rather than prose about it.
const QUOTED_TYPES: readonly SentenceType[] = ['dialogue', 'thought'];

// The kinds prose about a quoted line can be. A line is answered by another line
// or by a sentence about it, and narration that asks or exclaims is a third voice
// in a scene that has two.
const NARRATION: readonly SentenceType[] = ['statement', 'trailing'];

// What each kind is worth against the others wherever the caller left the kind to
// chance. Prose is mostly statements: a paragraph that tells, asks, exclaims,
// trails off and quotes in equal measure is not a paragraph but a sampler of the
// six. A line somebody says comes next, because it is the one kind that carries a
// scene with it, and the two marked kinds are the rarest — a question is only
// worth reading when the sentences around it are not questions.
const TYPE_WEIGHT: Record<SentenceType, number> = {
	statement: 100,
	dialogue: 34,
	trailing: 16,
	question: 14,
	thought: 12,
	exclamation: 10
};

// The same for the mark a quoted line closes on, which is drawn rather than
// fixed: somebody speaking asks more often than a page of prose does, and still
// tells more often than either.
const MARK_WEIGHT: Record<SentenceMark, number> = {
	statement: 100,
	question: 34,
	exclamation: 22,
	trailing: 16
};

// How much more likely a quoted line is inside a result that opened on one.
// Speech is what a scene of speech is made of, and what the boost leaves room for
// is the prose between the lines — the only thing that keeps two of them from
// reading as one person talking to themselves.
const QUOTED_BOOST = 6;

// What one more of the same in a row costs, against everything but the plain
// statement a paragraph runs on. A second question straight after one reads as a
// quiz and a third exclamation as a shouting match, so each repeat is worth less
// than the last — damped rather than forbidden, because an exchange of two lines
// is a conversation and a run of ten is the tic.
const REPEAT_DAMP = 0.45;

// Every level, in the order they run from the voice of a book to the one most
// spoken Korean is in.
const STYLES: readonly SentenceStyle[] = ['plain', 'casual', 'polite', 'formal'];

// A line somebody says out loud is never 해라체 — that is the voice of a book,
// not of a person with a listener in front of them. A thought is the other way
// round: it is addressed to nobody, so it is never polite.
const SPOKEN_LEVELS: readonly SentenceStyle[] = ['casual', 'polite', 'formal'];
const THOUGHT_LEVELS: readonly SentenceStyle[] = ['plain', 'casual'];

/**
 * The level one line is said at. A level the caller named is used for every
 * line, quoted or not; without one, the result has a voice of its own and only
 * a quoted line steps outside it, because what a person says is not written the
 * way the sentence around it is.
 */
function styleFor(type: SentenceType, asked: SentenceStyle | null, voice: SentenceStyle) {
	if (asked) {
		return asked;
	}

	if (type === 'dialogue') {
		return pick(SPOKEN_LEVELS);
	}

	return type === 'thought' ? pick(THOUGHT_LEVELS) : voice;
}

/** The marks a quoted line is wrapped in, or null when nothing is quoted. */
function quoteFor(
	data: SentenceLanguageData,
	type: SentenceType,
	override: SentenceQuote | undefined
): readonly [string, string] | null {
	if (type !== 'dialogue' && type !== 'thought') {
		return null;
	}

	return data.quotes[override ?? (type === 'dialogue' ? 'double' : 'single')];
}

/** The one thing a shape has to match to answer a kind. */
function moodFor(mark: SentenceMark): SentenceMood {
	return mark === 'question' ? 'question' : 'statement';
}

/**
 * Everything one sentence of a result is drawn against: the room it has, what it
 * is doing, what it opens on, and — after the first — what it is about.
 */
type Draw = {
	budget: readonly [number, number];
	/** What the caller asked for, and what the detail reports. */
	type: SentenceType;
	/** The kind whose mark it closes on — its own, or the one it is quoting. */
	mark: SentenceMark;
	/** The quotation marks it is wrapped in, or null. */
	quote: readonly [string, string] | null;
	/** A connective or an interjection, `''` for neither. */
	opener: string;
	/** The level this line is said at, which a quoted one does not share. */
	style: SentenceStyle;
	/**
	 * The predicates and adverbials the result has already used, in their plain
	 * form. A verb group holds four words and a paragraph holds ten sentences, so
	 * this cannot always be honoured — what it does is spend the group before it
	 * starts over, rather than rolling `식습니다` three times in four lines.
	 */
	avoid: ReadonlySet<string>;
	follow: Follow | null;
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
	/** Whether that noun is a person's name, which is written bare wherever it goes. */
	named: boolean;
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
	/**
	 * The nouns the result has already put on the page, by the slot they stood in.
	 * A sentence with one of those slots writes what is here rather than drawing
	 * again — a paragraph whose place changes every line is not one paragraph.
	 */
	scene: ReadonlyMap<SentenceSlot, Requirement>;
};

/**
 * What the result has written so far, and the whole of what keeps the next
 * sentence from writing it again.
 *
 * A paragraph is not a set of draws that happened to land together, and every
 * field here is one of the ways that shows: the register it opened in, the kind
 * and the mark it has just used, what it opened those sentences on, and whether
 * the last of them named the topic instead of standing a pronoun where it was.
 */
type Flow = {
	/** The kind the result opened on, which is the register the rest of it keeps. */
	lead: SentenceType | null;
	/** The kind the sentence before this one was, and how many of it in a row. */
	last: SentenceType | null;
	run: number;
	/** The mark that sentence closed on, quoted or not. */
	mark: SentenceMark | null;
	/** Whether it opened on a connective or an interjection. */
	opened: boolean;
	/** Every one the result has already used, so that none of them is written twice. */
	openers: Set<string>;
	/** Whether it named the topic rather than standing a pronoun where it was. */
	repeated: boolean;
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
function framesFor(
	data: SentenceLanguageData,
	settings: Settings,
	mood: SentenceMood
): readonly SentenceFrame[] {
	// A language that writes its question with the mark alone declares no question
	// shape, and answers with the statement shapes it does have. That is not a
	// fallback so much as the point: `¿El león corre?` is the statement.
	const byMood = data.frames.filter((frame) => (frame.mood ?? 'statement') === mood);
	const moody = byMood.length
		? byMood
		: data.frames.filter((frame) => (frame.mood ?? 'statement') === 'statement');
	const moodly = moody.length ? moody : data.frames;
	// Two shapes have no room for a name. A counted one makes its quantity the
	// subject, and `서호 3명` counts somebody's name; a copular one equates its
	// subject to a day, and a person is not a day. Asked for a name, both are left
	// out rather than answered with a sentence that does not mean anything.
	const nameable = settings.includeName ? moodly.filter(carriesPerson) : moodly;
	const usable = nameable.length ? nameable : moodly;
	const bySlots =
		settings.slots === 'all'
			? usable
			: usable.filter((frame) => matchesSlots(frame, settings.slots as never));
	const allowed = bySlots.length ? bySlots : usable;

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
	pinned?: ReadonlyMap<SentenceSlot, Requirement>
): { plan: Plan; complete: boolean } {
	if (!requirements.length && !pinned?.size) {
		return { plan: EMPTY_PLAN, complete: true };
	}

	const plan: Plan = { phrase: new Map(), modifier: new Map() };
	let complete = true;

	// A sentence carrying on from another one is handed the phrases the result has
	// already put on the page — its subject, and the place it is happening in —
	// rather than asking for them, so each goes in its own slot before the greedy
	// placement below reaches for the first noun slot it can find.
	if (pinned) {
		for (const [slot, requirement] of pinned) {
			// The subject goes wherever this shape's subject goes, which in a counted
			// shape is its quantity: `사과 12개가 익는다` has no `subject` part, and a
			// topic pinned to one would have been dropped and drawn again.
			const wanted = slot === 'subject' ? subjectSlotOf(frame) : slot;
			const at = frame.parts.findIndex((part) => part.slot === wanted);

			if (at >= 0) {
				plan.phrase.set(at, requirement);
			}
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
		// Every form a predicate can take, not only the plain statement's: a question
		// form is a different length, and the shape is chosen against these.
		verb: span(
			data.verbs.flatMap((group) => [group.words, ...Object.values(group.forms ?? {}).map(endings)])
		),
		state: span(
			data.states.flatMap((group) => [
				group.words,
				...Object.values(group.forms ?? {}).map(endings)
			])
		),
		manner: span([data.manners]),
		time: span([data.times]),
		money: moneySpan(data),
		date: calendarSpan(data, 'date'),
		clock: calendarSpan(data, 'clock')
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
/**
 * How much room the copula takes on the phrase it is written onto, at its
 * shortest and its longest. Every form of it, because the level and the mood are
 * settled after the shape is.
 */
function copulaSpan(part: SentencePart, data: SentenceLanguageData): readonly [number, number] {
	if (!part.copula || !data.calendar) {
		return [0, 0];
	}

	const group = data.calendar.copula;
	const pools = [group.words, ...Object.values(group.forms ?? {}).map(endings)];
	let low = Infinity;
	let high = 0;

	for (const pool of pools) {
		const [min, max] = poolBounds(pool);

		low = Math.min(low, min);
		high = Math.max(high, max);
	}

	// A copula in front is a word of its own; one on the end is written onto the
	// phrase with nothing between them.
	const gap = part.copula === 'head' ? data.space.length : 0;

	return [low + gap, high + gap];
}

function partRange(
	part: SentencePart,
	data: SentenceLanguageData,
	bounds: Record<string, readonly [number, number]>
): readonly [number, number] {
	const space = data.space.length;
	const [copulaLow, copulaHigh] = copulaSpan(part, data);
	const head = (part.head ? part.head.length + space : 0) + copulaLow;
	const tail = Math.min(part.tail?.length ?? 0, part.tailAlt?.length ?? part.tail?.length ?? 0);
	const tailMax =
		Math.max(part.tail?.length ?? 0, part.tailAlt?.length ?? 0) + (copulaHigh - copulaLow);

	if (!isNounSlot(part.slot)) {
		const [low, high] = bounds[part.slot];

		return [head + low + tail, head + high + tailMax];
	}

	const [low, high] = bounds.noun;
	const [articleMin, articleMax] = part.bare ? [0, 0] : articleSpan(data);
	const article = (size: number) => (size ? size + space : 0);
	const modifier = part.modifiable ? bounds.modifier[1] + space : 0;
	// A counted phrase carries a number and the counter its kind takes, and no
	// article and no modifier — `12 apples`, never `the 12 red apples`.
	const [countLow, countHigh] = part.slot === 'quantity' ? countSpan(data) : [0, 0];

	return [
		head + article(articleMin) + low + countLow + tail,
		head + article(articleMax) + modifier + high + countHigh + tailMax
	];
}

/** Shortest and longest sentence a shape can produce. */
function frameRange(
	frame: SentenceFrame,
	data: SentenceLanguageData,
	bounds: Record<string, readonly [number, number]>
): readonly [number, number] {
	// Measured against the longest mark the language writes, so a shape is never
	// chosen for a range only the shortest one could have reached.
	const marks = Math.max(...Object.values(data.terminators).map((mark) => mark.length));
	const tag = frame.tag ? frame.tag.length + data.space.length : 0;
	let min = marks + tag;
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
	// A quantity is an object with a number on it, and an amount is an object of
	// the class money belongs to — unless the quantity is what the sentence is
	// about, in which case it is the subject and the verb takes nothing.
	const wantsObject = takesObject(frame);
	const wantsMoney = frame.parts.some((part) => part.slot === 'money');
	const subject = requiredAt(frame, plan, 'subject');
	const object = requiredAt(frame, plan, 'object');
	const verb = requiredAt(frame, plan, 'verb');

	const usable = data.verbs.filter((group) => {
		if (Boolean(group.object) !== wantsObject) {
			return false;
		}

		if (wantsMoney && !group.object?.includes(MONEY_CLASS)) {
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
	/** Whether that subject is a person's name. */
	named: boolean;
	/** The person names this sentence was written with, in order. */
	names: string[];
	/** The predicates and adverbials it used, in their plain form. */
	used: string[];
	/**
	 * The nouns this sentence put on the page that a later one keeps: where it is
	 * happening, and what it is about beside its subject. A paragraph whose place
	 * changes every line is not one paragraph.
	 */
	scene: Map<SentenceSlot, Requirement>;
	/** What this sentence is doing. Set once the draw it came from is known. */
	type: SentenceType;
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
	span: readonly [number, number],
	count: string
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

	// A counted phrase writes its number where the language puts it — behind the
	// noun in Korean, Japanese and Chinese, in front of it in Vietnamese, where the
	// classifier comes with it.
	if (count) {
		if (data.numeral?.order === 'before') {
			parts.unshift(count);
		} else {
			parts.push(count);
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

/**
 * A person's name for a phrase that has room for one, and the gender it carries.
 *
 * A bare given name rather than a full one: a sentence about someone uses the
 * name they are called by, and `randName`'s default would put a surname in every
 * clause. The gender is the one the name was drawn for, translated into the
 * gender a modifier and a predicate agree with — and carried even by a language
 * whose words agree with nothing, because a pronoun still has to pick between
 * `he` and `she`.
 */
function properName(
	language: WordLanguage,
	settings: Settings,
	prefix: string
): { text: string; gender: WordGender } {
	// No length range, on purpose. `randName` reads one as a licence to change the
	// name's structure: a CJK given name is stretched to fill a range longer than
	// its real ones, and an alphabetic language writes a second given name where
	// one will not reach — `心敏若花清嫣华娜华梅瑶` and `Annette Tanja`, each of them
	// one person. Both are the name generator answering a caller who asked for a
	// length; a sentence is asking for a name. `nameSpan` is what the budget
	// measured this phrase against, and an unsteered draw is what fits it.
	const drawn = drawName(language, {
		includeSurname: false,
		realism: settings.realism,
		startsWith: prefix
	});

	return { text: drawn.native, gender: nameGender(drawn.gender) };
}

function nameGender(gender: NameGender): WordGender {
	return gender === 'male' ? 'm' : 'f';
}

/** How long a given name of the language can be, which is what a phrase reserves. */
function nameSpan(language: WordLanguage): readonly [number, number] {
	return nameLengthRange(language, false);
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
	// A name can only stand where a person would, so asking for one narrows the
	// subject to the themes that name people. A theme the caller named themselves
	// still wins — `theme: 'animal'` with `includeName` is a sentence about a lion,
	// not about somebody the lion reminded us of.
	const wanted = settings.includeName ? themesForClasses(requested, ['person']) : requested;
	const themes = wanted.length ? wanted : requested;

	if (!follow?.topic.class) {
		return themes;
	}

	// A fresh subject is usually another noun of the topic's own theme rather than
	// of its wider class. The class is what a paragraph may not leave — a verb that
	// takes a creature takes every creature — but a paragraph that opens on a drink
	// and then works through every edible there is reads as a list of them.
	const own = follow.topic.theme;

	if (own && themes.includes(own) && chance(THEME_CHANCE)) {
		return [own];
	}

	const inClass = themesForClasses(themes, [follow.topic.class]);

	return inClass.length ? inClass : themes;
}

function generateOne(language: WordLanguage, settings: Settings, draw: Draw): Built {
	const follow = draw.follow;
	const budget = draw.budget;
	const wordData = WORD_DATA[language];
	const data = SENTENCE_DATA[language];
	const bounds = roomFor(language, settings.includeName);
	const allowed = framesFor(data, settings, moodFor(draw.mark));
	const requested = subjectThemesFor(settings, follow);
	// The words a caller required go in the first sentence — once in the result
	// rather than once in every sentence of it.
	const requirements = follow ? [] : settings.include.map((word) => classify(language, word));
	// What the result has already put on the page and this sentence keeps: its
	// subject when the topic is being named again, and every noun of its scene.
	const pinned = new Map<SentenceSlot, Requirement>(follow?.scene ?? []);

	if (follow?.reference === 'repeat') {
		pinned.set('subject', {
			word: follow.topic.noun,
			slots: ['subject'],
			theme: follow.topic.theme ?? undefined,
			known: follow.topic.theme !== null
		});
	}
	const [min, max] = budget;
	const plans = new Map(allowed.map((frame) => [frame, planFor(frame, requirements, pinned)]));
	// A shape is only worth drawing when the language has a predicate for it: a
	// `body` subject has no transitive verb in any language here, so a shape with
	// an object in it would have to fall back to a verb that means something else.
	const buildable = (frame: SentenceFrame): boolean => {
		const { plan, complete } = plans.get(frame)!;

		if (!complete) {
			return false;
		}

		// A copular shape equates its subject to a day, so it is worth drawing only
		// where the subject can be one: a match is on a Tuesday and a buggy is not.
		if (!frame.parts.some((part) => part.slot === 'state' || part.slot === 'verb')) {
			return themesForClasses(requested, data.calendar!.copula.subject).length > 0;
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
			draw
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
	draw: Draw
): Built {
	const follow = draw.follow;
	const themes = requested.length ? requested : WORD_THEMES;
	// A shape with a `state` part is headed by one and a shape with a `verb` part by
	// that; a shape with neither is a copular one, which equates its subject to the
	// date or the clock it carries and takes the language's copula for a predicate.
	const headed = frame.parts.some((part) => part.slot === 'state')
		? 'state'
		: frame.parts.some((part) => part.slot === 'verb')
			? 'verb'
			: 'copula';
	// A shape whose predicate has nothing to say about the requested subject only
	// gets this far when no shape of the language did, so the fallback is the same
	// best effort every other narrowing here makes.
	const groups =
		headed === 'copula'
			? [data.calendar!.copula as StateGroup | VerbGroup]
			: headed === 'state'
				? (stateGroupsFor(data, themes, frame, plan) as (StateGroup | VerbGroup)[])
				: (verbGroupsFor(data, frame, themes, plan) as (StateGroup | VerbGroup)[]);
	const group = pick(groups.length ? groups : headedFallback(data, frame, headed));
	// The same predicates, in the form this type of sentence ends on. Index-aligned
	// with `group.words`, which is what lets a required word be translated rather
	// than written out in the wrong form.
	const predicates = formOf(group, draw.mark, draw.style);
	const subjectThemes = themesForClasses(themes, group.subject);
	// Which part is the subject is the shape's business, not the slot's: a counted
	// shape has no `subject` part and its quantity is the subject. Looking for a
	// `subject` part regardless is how a word required into a counted subject lost
	// its theme, and `사과` came out as `사과 9명` — nine people's worth of apple.
	const subjectSlot = subjectSlotOf(frame);
	const subjectRequired = requiredAt(frame, plan, subjectSlot);
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
	const shape: { part: SentencePart; at: number }[] = [];

	frame.parts.forEach((part, at) => {
		if (part.slot !== 'subject' || pronoun === null) {
			shape.push({ part, at });

			return;
		}

		if (pronoun) {
			shape.push({ part, at });
		}
	});

	// Every phrase's theme is settled before any of them is drawn, because a length
	// budget is only as good as the pools it was measured against. Left to the loop,
	// each phrase was given the room the language's longest noun would need and
	// drew a word out of its own theme, which is how a sentence came out short of a
	// `minLength` the shape could otherwise have reached.
	const partThemes = shape.map(({ part, at }) =>
		isNounSlot(part.slot)
			? part.slot === subjectSlot
				? subjectTheme
				: (plan.phrase.get(at)?.theme ?? themeForPart(part.slot, group, themes))
			: null
	);
	// What a phrase writes instead of a noun phrase, when it writes one at all: a
	// pronoun standing in for the topic, the name a `repeat` carries forward, or a
	// fresh name for a phrase about a person. All three are bare words — no article,
	// no modifier, nothing but the word and whatever particle the frame puts after
	// it — and `''` marks the one that has to be drawn against the room it is given.
	const proper = shape.map(({ part, at }, i) => {
		if (part.slot === 'subject' && pronoun) {
			return pronoun;
		}

		if (part.slot === 'subject' && follow?.reference === 'repeat' && follow.topic.named) {
			return follow.topic.noun;
		}

		// A word the caller required holds its place against all of this. `include`
		// says the sentence has to contain it, and a name written over it would be a
		// sentence that does not.
		if (plan.phrase.has(at)) {
			return null;
		}

		// A person is one person. `사과 12개` counts apples, and `서호 3명` counts
		// somebody's name, which is not a thing a sentence says.
		if (part.slot === 'quantity') {
			return null;
		}

		const theme = partThemes[i];

		return settings.includeName && theme && THEME_CLASS[theme] === 'person' ? '' : null;
	});
	const parts = shape.map((entry, i) =>
		proper[i] === null
			? entry
			: { ...entry, part: { ...entry.part, modifiable: false, bare: true } }
	);
	// The same for the predicate: `bounds` spans every group the language has, and
	// one sentence draws from one of them. A word the caller required is narrower
	// still — its length is not a range at all, and neither is a pronoun's.
	const partBounds = parts.map(({ part, at }, i) => {
		const theme = partThemes[i];
		const required = plan.phrase.get(at);
		const written = proper[i] || required?.word;
		const exact = written ? ([written.length, written.length] as const) : null;

		if (theme) {
			const owed = plan.modifier.get(at);
			// A name that has still to be drawn is budgeted against the given names of
			// the language rather than against its nouns — `randName` invents from its
			// own syllables and draws from its own pools, and neither is this theme's.
			const span =
				proper[i] === '' ? nameSpan(language) : nounSpan(language, theme, settings.invent);

			return {
				...bounds,
				noun: exact ?? span,
				modifier: owed ? ([owed.word.length, owed.word.length] as const) : bounds.modifier
			};
		}

		if (part.slot === 'verb' || part.slot === 'state') {
			return { ...bounds, [part.slot]: exact ?? poolBounds(predicates) };
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
	const opener = draw.opener;
	const close = data.terminators[draw.mark];
	const open = data.openers?.[draw.mark] ?? '';
	const [quoteOpen, quoteClose] = draw.quote ?? ['', ''];
	const tag = frame.tag ? data.space + frame.tag : '';
	const spans = parts.map(({ part }, i) => {
		const [low, high] = partRange(part, data, partBounds[i]);
		const gap = i === 0 ? 0 : space;

		return [gap + low, gap + high] as const;
	});
	const written: string[] = [];
	const reported: string[] = [];
	const slots: SentenceSlot[] = [];
	const names: string[] = [];
	// The predicates and adverbials this sentence spends, for the next one to leave
	// alone.
	const spent: string[] = [];
	// The noun phrases this sentence drew for the slots a later one keeps.
	const drawn = new Map<SentenceSlot, Phrase>();
	let subject: Phrase | undefined;
	let named = false;
	// A pronoun says nothing about its own gender, and neither does a name carried
	// over, so what agrees with either agrees with the noun it stands for.
	let gender: WordGender | undefined = proper.some((word) => word)
		? follow?.topic.gender
		: undefined;
	let used =
		close.length +
		open.length +
		tag.length +
		quoteOpen.length +
		quoteClose.length +
		(opener ? opener.length + space : 0);

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
		const headCost = (part.head ? part.head.length + space : 0) + copulaSpan(part, data)[0];
		const tailCost = Math.min(
			part.tail?.length ?? 0,
			part.tailAlt?.length ?? part.tail?.length ?? 0
		);
		const overhead = gap + headCost + tailCost;
		const high = Math.max(1, max - used - overhead - restMin);
		const low = Math.max(1, min - used - overhead - restMax);
		let phrase: string;

		if (part.slot === 'money') {
			phrase = moneyText(data);
		} else if (proper[i] !== null) {
			// A bare proper noun, drawn now if it was not carried in. `high` and `low`
			// are what the phrase has room for, and the name generator fits them the
			// same way a noun would.
			if (proper[i]) {
				phrase = proper[i] as string;
			} else {
				const drawn = properName(language, settings, prefixable && i === 0 ? settings.prefix : '');

				phrase = drawn.text;
				names.push(drawn.text);

				if (part.slot === 'subject') {
					gender = drawn.gender;
				}
			}

			if (part.slot === 'subject') {
				named = true;
			}
		} else if (isNounSlot(part.slot)) {
			const required = plan.phrase.get(at);
			const owed = plan.modifier.get(at);
			const theme = partThemes[i]!;
			const [nounLow, nounHigh] = partBounds[i].noun;
			const [, articleMax] = part.bare ? [0, 0] : articleSpan(data);
			const counted = part.slot === 'quantity' ? countSpan(data)[1] : 0;
			const room = high - nounLow - counted;
			// A phrase whose share of the range is longer than any noun of its theme
			// takes a modifier whatever the roll says, which is the only way it can
			// reach it — the alternative is a sentence that quietly misses `minLength`.
			const needed = low > (articleMax ? articleMax + space : 0) + nounHigh;
			const modify =
				part.slot !== 'quantity' &&
				(part.modifiable ?? false) &&
				(Boolean(owed) || needed || (room >= bounds.modifier[0] + space && chance(modifyChance)));
			const built = nounPhrase(
				language,
				data,
				theme,
				required?.word,
				modify,
				// A counted phrase drops its article and takes no modifier: `12 apples`,
				// never `the 12 red apples`.
				part.slot === 'quantity' || (part.bare ?? false),
				owed?.word,
				settings.invent,
				prefixable && i === 0 ? settings.prefix : '',
				low,
				high,
				[nounLow, nounHigh],
				part.slot === 'quantity' ? countText(data, theme) : ''
			);

			phrase = built.text;

			if (part.slot === subjectSlot) {
				subject = built;
				gender = genderOf(wordData, capitalizeAsPool(wordData, built.noun));
			}

			// A place is where the result is happening and an object is what it is
			// about, so both are kept for the sentences that follow. A quantity is
			// not: `사과 12개` is an amount of something rather than a thing.
			if (part.slot === 'place' || part.slot === 'object') {
				drawn.set(part.slot, built);
			}
		} else {
			const drawn = predicateFor(
				part.slot,
				wordData,
				data,
				group.words,
				predicates,
				plan.phrase.get(at),
				gender,
				low,
				high,
				draw.avoid
			);

			phrase = drawn.text;

			if (drawn.base) {
				spent.push(drawn.base);
			}
		}

		// The opening capital belongs to whatever is written first, and that is the
		// phrase itself unless a connective or a preposition stands in front of it.
		// Applied here rather than to the finished string, so the phrase the detail
		// reports is the one the sentence actually shows.
		// The copula is written onto this phrase rather than beside it, on whichever
		// side the language puts it: `11시 40분이다` is one word and `is September 5`
		// is two. Its form comes from the same chain a verb's does, so a copular
		// question asks and a polite one is polite.
		const copula = part.copula ? oneOf(pick(predicates)) : '';
		const opens = data.capitalize && !written.length;
		// A copula in front still lets the phrase keep its own preposition, because
		// German says `ist am 5. März` and English `is on September 5`.
		const opener = [part.copula === 'head' ? copula : '', part.head ?? '']
			.filter(Boolean)
			.join(data.space);
		const head = opens && opener ? upper(opener) : opener;
		const text = opens && !opener ? upper(phrase) : phrase;
		const tail = (part.copula === 'tail' ? copula : '') + tailOf(part, text);

		if (head) {
			written.push(head);
		}

		written.push(text + tail);
		reported.push(text);
		slots.push(part.slot);
		used += gap + headCost + text.length + tail.length;

		// The opening capital belongs to the name too, so what the detail reports is
		// what the sentence shows.
		if (proper[i] === '' && text !== phrase) {
			names[names.length - 1] = text;
		}
	}

	// A sentence whose subject is a name carries that name forward; one whose
	// subject was dropped carries forward what it was already handed.
	const carried = named
		? reported[slots.indexOf('subject')]
		: (subject?.noun ?? (pronoun ? follow!.topic.noun : null));
	// Where this sentence happened and what it was about, for the next one. The
	// bare noun rather than the phrase, so the next sentence writes its own article
	// and may put a different modifier in front of the same place.
	const scene = new Map<SentenceSlot, Requirement>(follow?.scene ?? []);

	for (const [slot, entry] of drawn) {
		if (!scene.has(slot)) {
			scene.set(slot, {
				word: entry.noun,
				slots: [slot],
				theme: entry.theme ?? undefined,
				known: entry.theme !== null
			});
		}
	}

	return {
		// The opener is written against the first phrase rather than beside it —
		// Spanish `¿El león corre?`, never `¿ El león corre ?`.
		sentence: quoteOpen + open + written.join(data.space) + tag + close + quoteClose,
		phrases: reported,
		slots,
		names,
		used: spent,
		type: draw.type,
		scene,
		theme: named ? null : (subject?.theme ?? null),
		subject: carried ?? null,
		gender: subject || named ? gender : pronoun !== null ? follow!.topic.gender : undefined,
		named: named || (pronoun !== null && (follow?.topic.named ?? false))
	};
}

/** What a phrase that is not a noun phrase writes, and the word it is a form of. */
type Predicate = { text: string; base: string };

/**
 * The word a phrase that is not a noun phrase writes: the predicate, or an adverb.
 *
 * `avoid` holds what the result has already said, and the plain form is what it
 * holds: `끓습니까` and `끓어` are one verb said twice, so remembering the written
 * form would remember nothing. It is a preference and not a filter — the range
 * comes first, and a pool with nothing unused left inside it is drawn from as it
 * always was.
 */
function predicateFor(
	slot: SentenceSlot,
	wordData: WordLanguageData,
	data: SentenceLanguageData,
	base: WordPool,
	predicates: WordPool,
	required: Requirement | undefined,
	gender: WordGender | undefined,
	min: number,
	max: number,
	avoid: ReadonlySet<string>
): Predicate {
	const agreed = (word: string) =>
		slot === 'state' && data.predicateAgrees ? agree(wordData, word, gender) : word;

	if (required) {
		// A word the caller named is named in the form a statement ends on, and the
		// form pools are index-aligned so that it can be said the other way instead.
		const at = base.indexOf(required.word);

		return {
			text: agreed(at >= 0 ? (predicates[at] ?? required.word) : required.word),
			base: required.word
		};
	}

	if (slot === 'date') {
		return { text: dateText(data), base: '' };
	}

	if (slot === 'clock') {
		return { text: clockText(data), base: '' };
	}

	const pool = slot === 'manner' ? data.manners : slot === 'time' ? data.times : predicates;
	// A predicate is a form of the word at the same index of the group; an adverbial
	// is written whole and is its own plain form.
	const plainly = (at: number) => (pool === predicates ? (base[at] ?? pool[at]) : pool[at]);
	const low = Math.min(min, max);
	const fresh = pool.filter(
		(word, at) => !avoid.has(plainly(at)) && word.length >= low && word.length <= max
	);
	const drawn = fresh.length ? pick(fresh) : (pickWord(pool, low, max, '') ?? pick(pool));

	return { text: agreed(drawn), base: plainly(pool.indexOf(drawn)) };
}

/**
 * The predicates of a group, in the form this sentence ends on.
 *
 * Each level falls back along its own chain to the plain statement the `words`
 * already are, so a group declares only what its language actually writes.
 * Japanese declares `polite` alone and it serves the formal level and the
 * question too, because the `か` that asks is the frame's tag rather than part
 * of the verb.
 */
/**
 * Which form a level writes for each mood, best first, falling through to the
 * plain statement the group's `words` already are.
 *
 * A level a language does not declare costs nothing: every chain ends where it
 * started, which is why seven of the nine write the same sentence whatever the
 * caller asks for. `trailing` is a statement that stops early, so it ends on the
 * statement's form.
 */
const FORM_CHAIN: Record<SentenceStyle, Record<SentenceMark, readonly PredicateForm[]>> = {
	plain: {
		statement: [],
		trailing: [],
		question: ['question'],
		exclamation: ['exclamation']
	},
	casual: {
		statement: ['casual'],
		trailing: ['casual'],
		question: ['casual', 'question'],
		exclamation: ['casual', 'exclamation']
	},
	polite: {
		statement: ['polite'],
		trailing: ['polite'],
		question: ['polite', 'question'],
		exclamation: ['polite', 'exclamation']
	},
	formal: {
		statement: ['formal', 'polite'],
		trailing: ['formal', 'polite'],
		question: ['formalQuestion', 'formal', 'polite', 'question'],
		exclamation: ['formal', 'polite', 'exclamation']
	}
};

/**
 * One of the endings a form pool entry lists. `달리니|달리나|달리는가` is one
 * verb written three ways, and a sentence takes one of them; an entry with no
 * `|` in it is itself.
 */
function oneOf(entry: string): string {
	return entry.includes('|') ? pick(entry.split('|')) : entry;
}

/** Every ending an entry lists, which is what a length budget has to span. */
function endings(pool: WordPool): WordPool {
	return pool.flatMap((entry) => (entry.includes('|') ? entry.split('|') : [entry]));
}

function formOf(group: StateGroup | VerbGroup, mark: SentenceMark, style: SentenceStyle): WordPool {
	const forms = group.forms;

	for (const key of FORM_CHAIN[style][mark]) {
		const pool = forms?.[key];

		if (pool) {
			return pool.map(oneOf);
		}
	}

	return group.words;
}

function upper(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Whatever the language can head this shape with, when nothing narrower fits. */
function headedFallback(
	data: SentenceLanguageData,
	frame: SentenceFrame,
	headed: 'state' | 'verb' | 'copula'
): (StateGroup | VerbGroup)[] {
	if (headed === 'copula') {
		return [data.calendar!.copula];
	}

	if (headed === 'state') {
		return [...data.states];
	}

	return data.verbs.filter((group) => Boolean(group.object) === takesObject(frame));
}

/** The theme a phrase other than the subject draws from. */
function themeForPart(
	slot: SentenceSlot,
	group: VerbGroup | StateGroup,
	themes: readonly WordTheme[]
): WordTheme {
	if (slot === 'object' || slot === 'quantity') {
		const usable = themesForClasses(WORD_THEMES, (group as VerbGroup).object ?? []);

		return pick(usable.length ? usable : WORD_THEMES);
	}

	const places = themesForClasses(WORD_THEMES, ['place']);

	return pick(places.length ? places : themes);
}

/* --- Building the whole result --------------------------------------------- */

// How often a sentence that follows another one opens on a connective.
const CONNECTIVE_CHANCE = 40;

// How often an exclamation opens on an interjection. Higher than the connective's,
// because an exclamation with nothing in front of it is a statement wearing a mark.
const INTERJECTION_CHANCE = 65;

// What both of those are worth when the sentence before this one already opened on
// something. Two in a row read as a list of asides rather than as a paragraph.
const OPENER_DAMP = 0.4;

// How a sentence refers to the topic, against the other two ways of doing it.
const REFERENCE_WEIGHT: Record<Reference, number> = { repeat: 25, pronoun: 40, fresh: 35 };

// What naming the topic again is worth when the topic is a person's name. A name
// is the most conspicuous word in a sentence and the one a reader is least likely
// to lose track of, so prose names somebody once and then leaves them alone;
// `신우가 …. 신우는 …. 신우가 …` is a caption written three times.
const NAMED_DAMP = 0.6;

/** What the rest of the result is about, read off the sentence that opened it. */
function topicOf(built: Built): Topic | null {
	if (!built.subject) {
		return null;
	}

	return {
		noun: built.subject,
		theme: built.theme,
		// A name is in no pool and so has no theme, but it is a person all the same,
		// which is the whole of what a later sentence needs to stay on topic.
		class: built.named ? 'person' : built.theme ? THEME_CLASS[built.theme] : null,
		gender: built.gender,
		named: built.named
	};
}

/**
 * The pronouns the language can stand in for this topic with. A class its written
 * pronouns are wrong for is left with the empty entry alone — the language says
 * nothing where it can, and where it cannot, there is no pronoun to be had and
 * the sentence names the topic again instead.
 */
function pronounsFor(data: SentenceLanguageData, topic: Topic): WordPool {
	// A gendered pronoun is the one thing a `pronounless` class can still take, and
	// only where the topic carries a gender to choose it by. That is what the list
	// is about: `he` and `she` cannot stand for `the locksmith`, because nothing
	// says which of the two, and a name says. A language that declares no pool for
	// that gender has none to offer, so Korean still drops the subject rather than
	// writing `그것` about somebody.
	const gendered = topic.gender ? data.pronouns[topic.gender] : undefined;
	const pool = gendered ?? data.pronouns.n ?? [];

	if (!gendered && topic.class && data.pronounless?.includes(topic.class)) {
		return pool.filter((word) => !word);
	}

	return pool;
}

/**
 * How one sentence carries on from the one before it.
 *
 * `repeated` says whether that one already named the topic, and naming it again
 * straight afterwards is what makes a paragraph read as a caption written ten
 * times — worst of all with a person's name, which has no pronoun to alternate
 * with in the languages that leave their subject out.
 */
function followFor(
	data: SentenceLanguageData,
	topic: Topic,
	scene: ReadonlyMap<SentenceSlot, Requirement>,
	repeated: boolean
): Follow {
	const pronouns = pronounsFor(data, topic);
	// A person is an individual, not a kind of thing: a paragraph about Emma that
	// draws a `fresh` subject is a paragraph that quietly becomes about Sophie.
	// Every other topic can be another one of its own class.
	const ways: Reference[] = topic.named ? ['repeat', 'pronoun'] : ['repeat', 'pronoun', 'fresh'];
	const usable = pronouns.length ? ways : ways.filter((way) => way !== 'pronoun');
	const weightOf = (way: Reference) => {
		if (way !== 'repeat') {
			return REFERENCE_WEIGHT[way];
		}

		return REFERENCE_WEIGHT[way] * (repeated ? REPEAT_DAMP : 1) * (topic.named ? NAMED_DAMP : 1);
	};
	const reference = pickWeighted(usable, weightOf);

	return {
		topic,
		reference,
		pronoun: reference === 'pronoun' ? pick(pronouns) : '',
		scene
	};
}

/**
 * What a sentence opens on: an interjection when it is an exclamation, and a
 * connective when it follows another. Never both — a sentence that opened on two
 * things at once would be shouting its own footnote.
 *
 * `room` is what the sentence may be at its longest, and it is what decides
 * whether it opens on anything at all: what stands in front is written before a
 * whole sentence rather than instead of any part of it, so one longer than the
 * budget can spare is a sentence that overshoots by exactly its length. Russian
 * `тем временем` is thirteen characters, and a third of a range of seventy-five
 * has nowhere to put them.
 *
 * `flow` is the other half of the decision, and it is what makes an opener read
 * as one: never the same word twice in one result, and far less likely at all
 * when the sentence before this one already opened on something.
 */
function openerFor(
	data: SentenceLanguageData,
	mark: SentenceMark,
	following: boolean,
	room: number,
	shortest: number,
	flow: Flow
): string {
	const spare = room - data.space.length - shortest;
	const fitting = (pool: WordPool) =>
		pool.filter((word) => word.length <= spare && !flow.openers.has(word));
	const damp = flow.opened ? OPENER_DAMP : 1;

	if (mark === 'exclamation') {
		const usable = fitting(data.interjections);

		if (usable.length && chance(INTERJECTION_CHANCE * damp)) {
			return pick(usable);
		}
	}

	if (!following) {
		return '';
	}

	const usable = fitting(data.connectives);

	return usable.length && chance(CONNECTIVE_CHANCE * damp) ? pick(usable) : '';
}

/**
 * Every sentence of one result, in order.
 *
 * The range is shared out before the first of them is drawn, and the topic is
 * taken from that first sentence — so what follows is about the same thing rather
 * than another draw that happened to land beside it.
 */
/**
 * The kind this sentence is, and the kind whose mark it closes on, chosen
 * against the room it has.
 *
 * A shape is not always answerable in a narrow range: a question is a different
 * shape — Vietnamese writes `không` after the whole clause, English `Does` in
 * front of the subject — and a quoted line pays for its marks out of the same
 * budget. Drawing the kind first and discovering that afterwards is how
 * `‘Họa sĩ có ồn ào không?’` came out of a range of 12 to 17.
 *
 * A kind the caller named is still drawn when none of them fit, which is the
 * same best effort every other narrowing here makes.
 */
function kindFor(
	data: SentenceLanguageData,
	settings: Settings,
	bounds: Record<string, readonly [number, number]>,
	budget: readonly [number, number],
	flow: Flow
): readonly [SentenceType, SentenceMark] {
	// Both ends: a shape whose shortest is past the top of the budget overshoots
	// whatever it draws, and one whose longest is under the bottom falls short of
	// it however long the words are.
	const fits = (mark: SentenceMark, room: readonly [number, number]) =>
		framesFor(data, settings, moodFor(mark)).some((frame) => {
			const [low, high] = frameRange(frame, data, bounds);

			return low <= room[1] && high >= room[0];
		});
	const marksOf = (type: SentenceType) =>
		type === 'dialogue' || type === 'thought' ? QUOTED_MARKS : [type as SentenceMark];
	const roomOf = (type: SentenceType): readonly [number, number] => {
		const quote = quoteFor(data, type, settings.quote);
		const marks = quote ? quote[0].length + quote[1].length : 0;

		return [budget[0] - marks, budget[1] - marks];
	};
	// A paragraph stays in the register it opened in. Prose about a line may not
	// become one, so the narrated register is the closed half; a quoted one keeps
	// the prose that goes between its lines, because a line answered only by
	// another line is one person talking to themselves. Nothing to keep to on the
	// first sentence, which is where the register comes from.
	const lead = flow.lead;
	const family = lead
		? settings.types.filter((type) =>
				QUOTED_TYPES.includes(lead)
					? type === lead || NARRATION.includes(type)
					: !QUOTED_TYPES.includes(type)
			)
		: settings.types;
	const wanted = family.length ? family : settings.types;
	const usable = wanted.filter((type) => marksOf(type).some((mark) => fits(mark, roomOf(type))));
	const pool = usable.length ? usable : wanted;
	const type = pickWeighted(pool, (each) => typeWeight(each, flow));
	const marks = marksOf(type).filter((mark) => fits(mark, roomOf(type)));

	return [
		type,
		pickWeighted(marks.length ? marks : marksOf(type), (mark) => markWeight(mark, flow))
	];
}

/**
 * What one kind is worth here, in this result, after what it has already said.
 *
 * Two things move it off the flat weight. A result that opened on a quoted line
 * is a scene of speech, so the line it opened on outweighs the prose around it;
 * and a kind the sentence before this one already was is worth less each time it
 * comes round again, so that a run of them ends by itself. The plain statement is
 * the one thing exempt from that: a run of statements is what prose is.
 */
function typeWeight(type: SentenceType, flow: Flow): number {
	const quoted = flow.lead !== null && QUOTED_TYPES.includes(flow.lead);
	const base = TYPE_WEIGHT[type] * (quoted && type === flow.lead ? QUOTED_BOOST : 1);

	return type === flow.last && type !== 'statement' ? base * REPEAT_DAMP ** flow.run : base;
}

/** The same for the mark a quoted line closes on. */
function markWeight(mark: SentenceMark, flow: Flow): number {
	const base = MARK_WEIGHT[mark];

	return mark === flow.mark && mark !== 'statement' ? base * REPEAT_DAMP : base;
}

/**
 * Whether a result that writes a name can still land in the range the caller
 * asked for.
 *
 * A name is one word and no article — `Yvonne` where a noun phrase would write
 * `die schlanke Wolke` — so a named sentence is the shorter of the two by a wide
 * margin, and a range only the longer one can reach is a range a name cannot be
 * in. Asked for a name outright the generator writes one anyway, the same way it
 * answers a range too narrow for the parts it was told to carry; drawn, it is
 * one more thing to decide against the room.
 */
/**
 * The slot bounds this result is measured against: the language's own, with the
 * subject narrowed to a name when the result writes one.
 *
 * A name is one word and no article — `Yvonne` where a noun phrase would write
 * `die schlanke Wolke` — so a shape chosen against noun lengths is a shape a
 * named sentence cannot fill. Both the result's budget and the per-sentence
 * choice of shape read this rather than `slotBounds` directly.
 */
function roomFor(
	language: WordLanguage,
	includeName: boolean | null
): Record<string, readonly [number, number]> {
	const bounds = slotBounds(language);

	return includeName ? { ...bounds, subject: nameSpan(language) } : bounds;
}

function nameFits(
	data: SentenceLanguageData,
	frames: readonly SentenceFrame[],
	bounds: Record<string, readonly [number, number]>,
	settings: Settings,
	language: WordLanguage
): boolean {
	if (settings.minLength === undefined) {
		return true;
	}

	const count = settings.sentences;
	const gap = data.space.length * (count - 1);
	const [, natural] = naturalSpan(data, frames, roomFor(language, true));

	return settings.minLength <= natural * count + gap;
}

function generateResult(language: WordLanguage, settings: Settings): Built[] {
	const data = SENTENCE_DATA[language];
	const bounds = slotBounds(language);
	// Every shape any of the requested types could take, because the budget is
	// shared out before the first type is even drawn.
	// Every shape any of the requested kinds could take, because the budget is
	// shared out before the first of them is even drawn — and a quoted line can be
	// any kind at all, so its shapes are all of them.
	const frames = settings.types.flatMap((type) =>
		(type === 'dialogue' || type === 'thought' ? QUOTED_MARKS : [type as SentenceMark]).flatMap(
			(mark) => framesFor(data, settings, moodFor(mark))
		)
	);
	// A result either has a person in it or does not; deciding that per sentence
	// would put a name in one line of a paragraph and not the next. Settled here
	// because it takes the language's own name lengths to know whether a name can
	// answer the range that was asked for.
	const named =
		settings.includeName ?? (nameFits(data, frames, bounds, settings, language) && chance(50));
	const settled = settings.includeName === named ? settings : { ...settings, includeName: named };
	// And the budget is measured against what a named result actually writes: one
	// word where a noun phrase would have written an article, a modifier and a noun.
	const room = roomFor(language, named);
	const [shortest] = naturalSpan(data, frames, room);
	const [min, max] = boundsFor(data, frames, room, settled);
	const budgets = shareOut(min, max, settings.sentences, data.space.length);
	const built: Built[] = [];
	let topic: Topic | null = null;
	let scene: ReadonlyMap<SentenceSlot, Requirement> = new Map();
	// What the result has said so far — the register it opened in, and everything
	// the next sentence has to avoid saying the same way. The first sentence names
	// the subject itself, which is why `repeated` starts true.
	const flow: Flow = {
		lead: null,
		last: null,
		run: 0,
		mark: null,
		opened: false,
		openers: new Set(),
		repeated: true
	};
	// What the result has already said with its predicates and its adverbials.
	const spent = new Set<string>();
	// The result's own voice, settled once. A caller who named a level gets that
	// one throughout; one who did not gets a paragraph that is at least consistent
	// with itself, rather than a level rerolled every sentence.
	const voice = settings.style ?? pick(STYLES);

	for (let i = 0; i < settings.sentences; i += 1) {
		const budget = budgets[i];
		const [type, mark] = kindFor(data, settled, room, budget, flow);
		const follow = topic ? followFor(data, topic, scene, flow.repeated) : null;
		const draw: Draw = {
			budget,
			type,
			mark,
			quote: quoteFor(data, type, settings.quote),
			opener: openerFor(data, mark, follow !== null, budget[1], shortest, flow),
			style: styleFor(type, settings.style, voice),
			avoid: spent,
			follow
		};
		let one = generateOne(language, settled, draw);
		let opened = draw.opener;

		// `openerFor` reserves room against the shortest sentence the shapes could
		// spell, which is a floor no draw actually reaches — the shortest word of
		// every pool at once. When the sentence that came back could not be made
		// short enough to carry what it opens on after all, that is the part worth
		// giving up: it stands in front of the whole sentence rather than instead of
		// any piece of it.
		if (draw.opener && distanceFrom(one.sentence.length, budget) > 0) {
			const bare = generateOne(language, settled, { ...draw, opener: '' });

			if (distanceFrom(bare.sentence.length, budget) < distanceFrom(one.sentence.length, budget)) {
				one = bare;
				opened = '';
			}
		}

		built.push(one);
		scene = one.scene;

		for (const word of one.used) {
			spent.add(word);
		}

		flow.run = type === flow.last ? flow.run + 1 : 1;
		flow.last = type;
		flow.mark = mark;
		flow.opened = Boolean(opened);
		flow.lead ??= type;
		flow.repeated = follow ? follow.reference === 'repeat' : true;

		if (opened) {
			flow.openers.add(opened);
		}

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

/**
 * The caller's `type`, as the set one sentence is drawn from. Left out, or asked
 * for something none of these are, the set is every one of them: a sentence with
 * nothing said about it is as likely to ask as to tell.
 */
function resolveTypes(type: SentenceTypeOption | undefined): readonly SentenceType[] {
	const all: readonly SentenceType[] = [
		'statement',
		'question',
		'exclamation',
		'trailing',
		'dialogue',
		'thought'
	];

	if (type === undefined || type === 'all') {
		return all;
	}

	const wanted = typeof type === 'string' ? [type] : type;
	const usable = wanted.filter((each) => all.includes(each));

	return usable.length ? usable : all;
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
		sentences: clamp(Math.floor(options.sentences ?? 1), 1, RAND_SENTENCE_COUNT_MAX),
		realism: options.realism ?? 'real',
		includeName: typeof options.includeName === 'boolean' ? options.includeName : null,
		types: resolveTypes(options.type),
		quote: options.quote,
		style: STYLES.includes(options.style as SentenceStyle) ? (options.style as SentenceStyle) : null
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
				names: built.flatMap((one) => one.names),
				types: built.map((one) => one.type),
				language: code,
				// What the result is about is what its first sentence was about; the
				// ones after it stay inside that noun's class.
				theme: built[0].theme
			};
		},
		(detail) => detail.sentence
	);
}
