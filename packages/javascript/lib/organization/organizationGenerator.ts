// The organization generator: a company, a school, an office or an association
// that does not exist, written the way its language writes one.
//
// A name is a template from the language's data with its gaps filled — a stem
// that is the organization's own, a word for what a company does, a city or a
// number where the language writes one — and a company may carry its legal form
// around the whole of it. Nothing here knows a language's word order: that is in
// the templates, so `Construcciones Valdecastro` and `Bergtal Bau` come out of the
// same code.
//
// A length range is met the way a nickname's is: the shapes that cannot land
// inside it are set aside before one is chosen, and each gap is then filled from
// the entries that leave the gaps behind it able to land there too. Drawing whole
// names until one fit missed most of what Korean, Japanese and Chinese were asked
// for, whose names are short enough that a long one is a particular template.

import {
	collect,
	languagesWriting,
	lengthBounds,
	resolveLength,
	resolvePrefix,
	resolveRandom,
	resolveRealism
} from '../_internal/generate.js';
import {
	capitalizeFirst,
	chance,
	pick,
	pickWeighted,
	randInt,
	withRandom
} from '../_internal/utils.js';
import { RAND_ORGANIZATION_LENGTH_MAX } from '../constants.js';
import type {
	OrganizationDetail,
	OrganizationIndustry,
	OrganizationIndustryOption,
	OrganizationType,
	RandOrganizationOptions,
	WordLanguage
} from '../_types/global.js';
import { WORD_LANGUAGES, resolveWordLanguage } from '../word/data/index.js';
import {
	ORGANIZATION_BARE_CHANCE,
	ORGANIZATION_DATA,
	ORGANIZATION_GENERIC_CHANCE,
	ORGANIZATION_INDUSTRIES,
	ORGANIZATION_LEGAL_FORM_CHANCE,
	ORGANIZATION_TYPE_WEIGHTS,
	resolveIndustry,
	resolveOrganizationTypes
} from './data/index.js';
import type {
	OrganizationLanguageData,
	OrganizationPool,
	OrganizationSynthesis
} from './data/types.js';

// Draws spent on one result before settling for the closest. The shapes and the
// gaps are already chosen against the range, so what is left to miss is an
// invented stem, whose length is only roughly in hand.
const FIT_ATTEMPTS = 12;

type Slot = 'stem' | 'industry' | 'place' | 'number';

/** One run of a template: the text the language writes, or a gap to fill. */
type Piece = { text: string } | { slot: Slot };

/** The shortest and the longest something can come out, in characters. */
type Span = readonly [number, number];

const GAP = /\{(stem|industry|place|number)\}/g;

// The company shape that is a stem and a legal form and nothing else.
const BARE = '{stem}';

// A template is split once and kept: the same few dozen are read on every draw.
const pieceCache = new Map<string, readonly Piece[]>();

/** A template as its runs of text and its gaps, in order. */
export function piecesOf(template: string): readonly Piece[] {
	let pieces = pieceCache.get(template);

	if (!pieces) {
		const parts: Piece[] = [];
		let last = 0;

		for (const match of template.matchAll(GAP)) {
			if (match.index > last) {
				parts.push({ text: template.slice(last, match.index) });
			}

			parts.push({ slot: match[1] as Slot });
			last = match.index + match[0].length;
		}

		if (last < template.length) {
			parts.push({ text: template.slice(last) });
		}

		pieces = parts;
		pieceCache.set(template, pieces);
	}

	return pieces;
}

/**
 * The legal form a template writes around `{name}`, on its own: `Inc.` out of
 * `{name}, Inc.`, `ООО` out of `ООО «{name}»`. Read off the template rather than
 * written beside it, so the two can never disagree.
 */
export function legalFormOf(template: string): string {
	return template
		.replace('{name}', '')
		.replace(/[«»]/g, '')
		.replace(/^[\s,]+|[\s,]+$/g, '');
}

/** How many characters a legal form adds to the name it is written around. */
function overheadOf(form: string | null): number {
	return form === null ? 0 : form.length - '{name}'.length;
}

/** The entries of a pool that start with `prefix`, or all of them for no prefix. */
function matching(pool: OrganizationPool, prefix: string): OrganizationPool {
	if (!prefix) {
		return pool;
	}

	const lower = prefix.toLowerCase();

	return pool.filter((entry) => entry.toLowerCase().startsWith(lower));
}

// Worked out once per pool: every one of them is a module constant.
const spanCache = new Map<OrganizationPool, Span>();

/** The shortest and the longest entry of a pool, `[0, 0]` for an empty one. */
function spanOfPool(pool: OrganizationPool): Span {
	let span = spanCache.get(pool);

	if (!span) {
		span = pool.length
			? [
					Math.min(...pool.map((entry) => entry.length)),
					Math.max(...pool.map((entry) => entry.length))
				]
			: [0, 0];
		spanCache.set(pool, span);
	}

	return span;
}

/** What an invented stem of `count` syllables can come out at. */
function syllableSpan(syn: OrganizationSynthesis, count: number): Span {
	if (syn.kind === 'pool') {
		const [low, high] = spanOfPool(syn.pool);
		const joins = (count - 1) * syn.joiner.length;

		return [count * low + joins, count * high + joins];
	}

	const onset = spanOfPool(syn.onset);
	const vowel = spanOfPool(syn.vowel);
	const coda = spanOfPool(syn.coda);

	return [count * (onset[0] + vowel[0]) + coda[0], count * (onset[1] + vowel[1]) + coda[1]];
}

// How many times a stem that spells a company is drawn again before it is kept.
const AVOID_ATTEMPTS = 8;

/**
 * A stem nobody chose, spelled the way the language spells one, of a syllable
 * count that can land between `low` and `high` where one can. A requested first
 * character stands in for the first sound, or picks the first syllable, which is
 * what lets `startsWith` reach past the stems the data holds.
 */
export function inventStem(
	syn: OrganizationSynthesis,
	prefix: string,
	low = 0,
	high = Infinity
): string {
	const counts: number[] = [];

	for (let count = syn.minSyllables; count <= syn.maxSyllables; count += 1) {
		const [shortest, longest] = syllableSpan(syn, count);

		if (longest >= low && shortest <= high) {
			counts.push(count);
		}
	}

	const count = counts.length ? pick(counts) : randInt(syn.minSyllables, syn.maxSyllables);

	if (syn.kind === 'pool') {
		const firsts = matching(syn.pool, prefix);
		const first = firsts.length ? pick(firsts) : prefix;
		let stem = first;

		// A stem that spells a company the pool was trimmed against is drawn again
		// from its second syllable on. The first may be the caller's own character,
		// which is how `startsWith: '동'` put `동` back in front of `아`.
		for (let attempt = 0; attempt < AVOID_ATTEMPTS; attempt += 1) {
			const parts = [first];

			while (parts.length < count) {
				let next = pick(syn.pool);

				// The same syllable twice in a row reads as a stutter (솔솔, 瑞瑞).
				for (let tries = 0; tries < 3 && next === parts[parts.length - 1]; tries += 1) {
					next = pick(syn.pool);
				}

				parts.push(next);
			}

			stem = parts.join(syn.joiner);

			if (!syn.avoid.some((brand) => stem.includes(brand))) {
				break;
			}
		}

		return stem;
	}

	let word = '';

	for (let i = 0; i < count; i += 1) {
		word += i === 0 && prefix ? prefix.toLowerCase() : pick(syn.onset);
		word += pick(syn.vowel);
	}

	return capitalizeFirst(word + pick(syn.coda));
}

/**
 * An entry of `pool` between `low` and `high` characters long, or the closest
 * there is when none is — `null` only for an empty pool.
 */
function fitting(pool: OrganizationPool, low: number, high: number): string | null {
	if (!pool.length) {
		return null;
	}

	const inside = pool.filter((entry) => entry.length >= low && entry.length <= high);

	if (inside.length) {
		return pick(inside);
	}

	let closest: string[] = [];
	let best = Infinity;

	for (const entry of pool) {
		const miss = missBy(entry.length, [low, high]);

		if (miss < best) {
			best = miss;
			closest = [entry];
		} else if (miss === best) {
			closest.push(entry);
		}
	}

	return pick(closest);
}

/** How far a length is from a range, an overshoot counting half a character worse. */
function missBy(length: number, [min, max]: Span): number {
	return length < min ? min - length : length > max ? length - max + 0.5 : 0;
}

type Settings = {
	types: readonly OrganizationType[];
	industry: OrganizationIndustryOption;
	// `null` leaves a company's legal form to chance.
	legalForm: boolean | null;
	invent: number;
	prefix: string;
	bounds: Span | null;
};

// Every word that says what a company does, across the industries and the words
// that name none, per language — what an `{industry}` gap can be when none was
// asked for.
const descriptorCache = new WeakMap<OrganizationLanguageData, OrganizationPool>();

function everyDescriptor(data: OrganizationLanguageData): OrganizationPool {
	let pool = descriptorCache.get(data);

	if (!pool) {
		pool = [
			...data.generic,
			...ORGANIZATION_INDUSTRIES.flatMap((industry) => data.industries[industry])
		];
		descriptorCache.set(data, pool);
	}

	return pool;
}

/** What an `{industry}` gap can be, for the industry the caller asked for. */
function descriptorsFor(data: OrganizationLanguageData, wanted: OrganizationIndustryOption) {
	return wanted === 'all' ? everyDescriptor(data) : data.industries[wanted];
}

const numberCache = new WeakMap<OrganizationLanguageData, OrganizationPool>();

/** The numbers a `{number}` gap can be, as text. */
function numbersOf(data: OrganizationLanguageData): OrganizationPool {
	let numbers = numberCache.get(data);

	if (!numbers) {
		const [low, high] = data.numbers ?? [1, 1];
		const written: string[] = [];

		for (let number = low; number <= high; number += 1) {
			written.push(String(number));
		}

		numbers = written;
		numberCache.set(data, numbers);
	}

	return numbers;
}

/** What one gap can come out at. */
function gapSpan(slot: Slot, data: OrganizationLanguageData, settings: Settings): Span {
	switch (slot) {
		case 'stem': {
			const real = spanOfPool(data.stems);
			const made: Span = [
				syllableSpan(data.syn, data.syn.minSyllables)[0],
				syllableSpan(data.syn, data.syn.maxSyllables)[1]
			];

			if (settings.invent <= 0) {
				return real;
			}

			return settings.invent >= 100
				? made
				: [Math.min(real[0], made[0]), Math.max(real[1], made[1])];
		}
		case 'industry':
			return spanOfPool(descriptorsFor(data, settings.industry));
		case 'place':
			return spanOfPool(data.places ?? []);
		case 'number': {
			const [low, high] = data.numbers ?? [1, 1];

			return [String(low).length, String(high).length];
		}
	}
}

/** What a template can come out at, its text and every gap together. */
function templateSpan(template: string, data: OrganizationLanguageData, settings: Settings): Span {
	let low = 0;
	let high = 0;

	for (const piece of piecesOf(template)) {
		const [shortest, longest] =
			'text' in piece
				? [piece.text.length, piece.text.length]
				: gapSpan(piece.slot, data, settings);

		low += shortest;
		high += longest;
	}

	return [low, high];
}

/** Whether a template can put `prefix` first, before any of it is drawn. */
function leadsWith(template: string, data: OrganizationLanguageData, settings: Settings): boolean {
	const { prefix } = settings;
	const first = piecesOf(template)[0];

	if (!prefix || !first) {
		return true;
	}

	if ('text' in first) {
		return first.text.toLowerCase().startsWith(prefix.toLowerCase());
	}

	switch (first.slot) {
		case 'stem':
			// A stem can always be invented to start with it.
			return true;
		case 'industry':
			return matching(descriptorsFor(data, settings.industry), prefix).length > 0;
		case 'place':
			return matching(data.places ?? [], prefix).length > 0;
		case 'number':
			return matching(numbersOf(data), prefix).length > 0;
	}
}

/** One shape a result can take: a template, and the legal forms it may be written in. */
type Shape = { template: string; forms: readonly (string | null)[] };

/** The legal forms of a shape that let it land inside the range, which is all of them with no range. */
function formsThatFit(
	shape: Shape,
	data: OrganizationLanguageData,
	settings: Settings
): readonly (string | null)[] {
	if (!settings.bounds) {
		return shape.forms;
	}

	const [low, high] = templateSpan(shape.template, data, settings);
	const [min, max] = settings.bounds;

	return shape.forms.filter((form) => {
		const extra = overheadOf(form);

		return high + extra >= min && low + extra <= max;
	});
}

/**
 * What one language can answer a call with: per kind, the shapes that can lead
 * with the requested character and land inside the range, each in the legal
 * forms that let it land there.
 *
 * Worked out once per call, because nothing in it depends on a draw. A kind with
 * no shape that fits the range is left out while another kind has one, and when
 * none has, every shape stays in: a range nothing reaches is answered with the
 * closest result, the way every generator answers one.
 */
type Plan = {
	language: WordLanguage;
	data: OrganizationLanguageData;
	shapes: Partial<Record<OrganizationType, readonly Shape[]>>;
	types: readonly OrganizationType[];
};

function planFor(language: WordLanguage, settings: Settings): Plan {
	const data = ORGANIZATION_DATA[language];
	const shapes: Partial<Record<OrganizationType, readonly Shape[]>> = {};
	const fitting: OrganizationType[] = [];
	const forms =
		settings.legalForm === true
			? data.legalForms
			: settings.legalForm === false
				? [null]
				: [null, ...data.legalForms];

	for (const type of settings.types) {
		const company = type === 'company';
		const listed: Shape[] = data.templates[type]
			.filter((template) => leadsWith(template, data, settings))
			.map((template) => ({ template, forms: company ? forms : [null] }));

		// A company named by its stem alone says nothing about its business, so it
		// is only one when no industry was asked for, and it always takes a legal
		// form, so it is never one when legal forms were turned off.
		if (company && settings.industry === 'all' && settings.legalForm !== false) {
			listed.push({ template: BARE, forms: data.legalForms });
		}

		const fit = listed
			.map((shape) => ({ template: shape.template, forms: formsThatFit(shape, data, settings) }))
			.filter((shape) => shape.forms.length > 0);

		if (fit.length) {
			fitting.push(type);
		}

		shapes[type] = fit.length ? fit : listed;
	}

	const types = settings.types.filter((type) => (shapes[type]?.length ?? 0) > 0);

	return {
		language,
		data,
		shapes,
		types: fitting.length ? fitting : types
	};
}

/** Which shape to draw: a stem alone a fifth of the time when it is in play, a template otherwise. */
function chooseShape(shapes: readonly Shape[]): Shape {
	const bare = shapes.find((shape) => shape.template === BARE);
	const templated = shapes.filter((shape) => shape !== bare);

	if (bare && (!templated.length || chance(ORGANIZATION_BARE_CHANCE))) {
		return bare;
	}

	return pick(templated);
}

/** Which of a shape's legal forms to write: none or one by a coin flip when both are possible. */
function chooseForm(shape: Shape): string | null {
	const written = shape.forms.filter((form): form is string => form !== null);

	if (!written.length) {
		return null;
	}

	return shape.forms.includes(null) && !chance(ORGANIZATION_LEGAL_FORM_CHANCE)
		? null
		: pick(written);
}

type Descriptor = { word: string; industry: OrganizationIndustry | null };

/**
 * The word that says what a company does, and the industry it says. With none
 * asked for, a quarter of the companies that carry such a word — a fifth of all
 * of them, since a fifth are a bare stem — carry one that names no industry
 * (`Group`, `홀딩스`) and the rest one industry's word, so the industries come up
 * alike rather than in proportion to how many words each one has.
 */
function descriptorFor(
	data: OrganizationLanguageData,
	wanted: OrganizationIndustryOption,
	prefix: string,
	low: number,
	high: number
): Descriptor | null {
	if (wanted !== 'all') {
		const word = fitting(matching(data.industries[wanted], prefix), low, high);

		return word === null ? null : { word, industry: wanted };
	}

	const generic = chance(ORGANIZATION_GENERIC_CHANCE);
	const industry = generic ? null : pick(ORGANIZATION_INDUSTRIES);
	const pool = matching(generic ? data.generic : data.industries[industry!], prefix);
	const word = pool.length ? fitting(pool, low, high) : null;

	if (word !== null && word.length >= low && word.length <= high) {
		return { word, industry };
	}

	// Nothing of the one drawn starts with the character or fits the room, so the
	// word is drawn from all of them and the industry is whichever it belongs to.
	const entries: Descriptor[] = [
		...matching(data.generic, prefix).map((each) => ({ word: each, industry: null })),
		...ORGANIZATION_INDUSTRIES.flatMap((each) =>
			matching(data.industries[each], prefix).map((entry) => ({ word: entry, industry: each }))
		)
	];
	const chosen = fitting(
		entries.map((entry) => entry.word),
		low,
		high
	);

	return chosen === null ? null : pick(entries.filter((entry) => entry.word === chosen));
}

/**
 * A template with its gaps filled, each from the entries that leave the gaps
 * behind it room to land the whole between `low` and `high`. `null` when the
 * requested first character cannot lead it after all.
 */
function fill(
	template: string,
	plan: Plan,
	settings: Settings,
	low: number,
	high: number
): { name: string; industry: OrganizationIndustry | null } | null {
	const { data } = plan;
	const pieces = piecesOf(template);
	// What the pieces after each one can still add.
	const restLow = new Array<number>(pieces.length + 1).fill(0);
	const restHigh = new Array<number>(pieces.length + 1).fill(0);

	for (let i = pieces.length - 1; i >= 0; i -= 1) {
		const piece = pieces[i];
		const [shortest, longest] =
			'text' in piece
				? [piece.text.length, piece.text.length]
				: gapSpan(piece.slot, data, settings);

		restLow[i] = shortest + restLow[i + 1];
		restHigh[i] = longest + restHigh[i + 1];
	}

	let name = '';
	let industry: OrganizationIndustry | null = null;

	for (let i = 0; i < pieces.length; i += 1) {
		const piece = pieces[i];

		if ('text' in piece) {
			name += piece.text;
			continue;
		}

		// Only the first gap has to lead with the requested character.
		const prefix = i === 0 ? settings.prefix : '';
		const room: Span = [low - name.length - restHigh[i + 1], high - name.length - restLow[i + 1]];
		let value: string | null;

		if (piece.slot === 'stem') {
			const stems = matching(data.stems, prefix);

			value =
				chance(settings.invent) || !stems.length
					? // A first character no stem starts with is answered with an
						// invented stem that does, the way `randWord` answers one.
						inventStem(data.syn, prefix, room[0], room[1])
					: fitting(stems, room[0], room[1]);
		} else if (piece.slot === 'industry') {
			const descriptor = descriptorFor(data, settings.industry, prefix, room[0], room[1]);

			value = descriptor?.word ?? null;
			industry = descriptor?.industry ?? null;
		} else if (piece.slot === 'place') {
			value = fitting(matching(data.places ?? [], prefix), room[0], room[1]);
		} else {
			value = fitting(matching(numbersOf(data), prefix), room[0], room[1]);
		}

		if (value === null) {
			return null;
		}

		name += value;
	}

	return { name, industry };
}

/** One draw, before its length is checked; `null` when the prefix could not lead it. */
function draft(plan: Plan, settings: Settings): OrganizationDetail | null {
	const { language } = plan;
	const type = pickWeighted(plan.types, (each) => ORGANIZATION_TYPE_WEIGHTS[each]);
	const shape = chooseShape(plan.shapes[type] ?? []);
	const form = chooseForm(shape);
	const extra = overheadOf(form);
	const [min, max] = settings.bounds ?? [0, Infinity];
	const filled = fill(shape.template, plan, settings, min - extra, max - extra);

	if (!filled) {
		return null;
	}

	const { name, industry } = filled;

	if (settings.prefix && !name.toLowerCase().startsWith(settings.prefix.toLowerCase())) {
		return null;
	}

	return {
		organization: form ? form.replace('{name}', name) : name,
		name,
		legalForm: form ? legalFormOf(form) : null,
		type,
		industry: type === 'company' ? industry : null,
		language
	};
}

function generateOne(plan: Plan, settings: Settings): OrganizationDetail | null {
	let best: OrganizationDetail | null = null;
	let bestMiss = Infinity;

	for (let attempt = 0; attempt < FIT_ATTEMPTS; attempt += 1) {
		const detail = draft(plan, settings);

		if (!detail) {
			continue;
		}

		const miss = settings.bounds ? missBy(detail.organization.length, settings.bounds) : 0;

		if (miss === 0) {
			return detail;
		}

		if (miss < bestMiss) {
			bestMiss = miss;
			best = detail;
		}
	}

	return best;
}

export function generateOrganizationDetails(
	options: RandOrganizationOptions = {}
): OrganizationDetail[] {
	const language = resolveWordLanguage(options.language);
	const industry = resolveIndustry(options.industry);
	// An industry is a company's, so naming one with no kind named asks for
	// companies; with kinds named, it narrows the companies among them.
	const types =
		options.type === undefined && industry !== 'all'
			? (['company'] as const)
			: resolveOrganizationTypes(options.type);
	const minLength = resolveLength(options.minLength);
	const maxLength = resolveLength(options.maxLength);
	const settings: Settings = {
		types,
		industry,
		legalForm: typeof options.includeLegalForm === 'boolean' ? options.includeLegalForm : null,
		invent: resolveRealism(options.realism),
		prefix: resolvePrefix(options.startsWith),
		bounds:
			minLength === undefined && maxLength === undefined
				? null
				: lengthBounds(
						minLength,
						maxLength,
						1,
						RAND_ORGANIZATION_LENGTH_MAX,
						RAND_ORGANIZATION_LENGTH_MAX
					)
	};
	// A language that does not write the requested character, and one with no
	// shape of the requested kinds that can lead with it, are out before a draw.
	const plans = languagesWriting(language, WORD_LANGUAGES, settings.prefix)
		.map((code) => planFor(code, settings))
		.filter((plan) => plan.types.length > 0);

	if (!plans.length) {
		return [];
	}

	const results = withRandom(resolveRandom(options.random), () =>
		collect(
			// `startsWith` is the name's, and checked in `draft`: a legal form written
			// in front of a name is not where the name starts.
			{ count: options.count, unique: options.unique },
			() => generateOne(pick(plans), settings),
			(detail) => detail?.organization ?? ''
		)
	);

	return results.filter((detail): detail is OrganizationDetail => detail !== null);
}
