// How a result of several sentences decides what happens in each of them.
// Internal — `sentenceGenerator` asks this module for a plan and writes the
// sentences itself.
//
// A story here is a list of steps in an order a reader would accept, shared by
// every language (`data/index.ts`). What this module does is turn one of them
// into exactly as many sentences as the caller asked for: it keeps the steps
// every telling has, adds the optional ones as room allows, fills what is left
// with interludes, and decides which two neighbouring actions are written as one
// sentence. All of it against a small memory of what is true of the hero — what
// `FIELD_RULES` says each action needs and leaves behind — so that nobody eats
// what nobody picked up, and a "so" is written only where the sentence before it
// is actually the reason.

import { chance, pick, pickWeighted, randInt } from '../_internal/utils.js';
import type { SentenceStory, SentenceType, WordTheme } from '../_types/global.js';
import {
	AGENT_CLASSES,
	FIELD_RULES,
	INTERLUDES,
	OPPOSITES,
	STORIES,
	THEME_CLASS
} from './data/index.js';
import type { Story, StoryStep } from './data/index.js';
import type {
	Condition,
	ConnectiveKind,
	NounClass,
	SentenceLanguageData,
	StateGroup,
	VerbField,
	VerbGroup
} from './data/types.js';

// The most joins one result makes, against its sentence count: a story told in
// nothing but short sentences reads as stage directions, and `집에 돌아와서
// 사과를 먹었다` is what makes it prose, but every sentence a two-clause one is as
// monotonous as none. How many a telling makes is drawn between none and this.
const JOIN_SHARE = 0.5;

// How often a state sentence about a person becomes a line of their own, and how
// many of them one telling may have. A paragraph that speaks in every other line
// is a script, not a story.
const VOICE_CHANCE = 40;
const VOICE_MAX = 2;

/** What is true of the hero at one moment. */
export type StoryState = ReadonlySet<Condition>;

/**
 * One sentence of the plan: the step it tells, the field that was settled for
 * it, the condition a state sentence asserts, and how it relates to the sentence
 * in front of it.
 */
export type Beat = {
	step: StoryStep;
	/** The field the sentence draws its verb from. Null for a state sentence. */
	field: VerbField | null;
	/** The condition a state sentence says, drawn from what is true just then. */
	condition: Condition | null;
	/** What was true of the hero before this sentence. */
	before: StoryState;
	/** The kinds of connective this sentence may open on. */
	links: readonly ConnectiveKind[];
	/** The kinds this sentence may be beside a statement. */
	kinds: readonly SentenceType[];
	/** Whether this beat is the first or the second clause of one sentence. */
	join: 'first' | 'second' | null;
	/**
	 * Whether the hero says this one themselves: a state sentence quoted in the
	 * first person — `“배고프다.”` — rather than narrated. Only a person's, only
	 * after the first sentence, and only where the language can write it.
	 */
	voiced: boolean;
};

export type Plan = {
	story: Story;
	beats: Beat[];
	/** The theme the story's prop comes from, when it has one and the language can write it. */
	prop: WordTheme | null;
};

/** The fields a step may draw from, as a list. */
export function fieldsOf(step: StoryStep): readonly VerbField[] {
	return step.field === undefined ? [] : typeof step.field === 'string' ? [step.field] : step.field;
}

function has(state: StoryState, needs: readonly Condition[] | undefined): boolean {
	return (needs ?? []).every((condition) => state.has(condition));
}

/**
 * The verb groups of a field that can take this subject, and an object of this
 * theme. The theme rather than its class, because a group may narrow its object
 * to themes — `drink` takes an edible, and not a pretzel.
 */
export function groupsOf(
	data: SentenceLanguageData,
	field: VerbField,
	subject: NounClass,
	object: WordTheme | null,
	wantsObject: boolean
): readonly VerbGroup[] {
	return data.verbs.filter(
		(group) =>
			group.field === field &&
			group.subject.includes(subject) &&
			Boolean(group.object) === wantsObject &&
			(!wantsObject || object === null || takesTheme(group, object)) &&
			(!group.requires ||
				data.frames.some((frame) => frame.parts.some((part) => part.slot === group.requires)))
	);
}

/** Whether a verb group takes a noun of this theme as its object. */
export function takesTheme(group: VerbGroup, theme: WordTheme): boolean {
	return (
		(group.object?.includes(THEME_CLASS[theme]) ?? false) &&
		(!group.objectThemes || group.objectThemes.includes(theme))
	);
}

/**
 * The intransitive verb groups of a field that can take somebody else as their
 * subject: one of these classes, narrowed to these themes where the group narrows
 * itself. What an `other` step draws from.
 */
export function groupsForActor(
	data: SentenceLanguageData,
	field: VerbField,
	classes: readonly NounClass[],
	themes: readonly WordTheme[] | null
): readonly VerbGroup[] {
	return data.verbs.filter(
		(group) =>
			group.field === field &&
			!group.object &&
			group.subject.some((cls) => classes.includes(cls)) &&
			(!themes ||
				!group.subjectThemes ||
				themes.some((theme) => group.subjectThemes!.includes(theme))) &&
			(!group.requires ||
				data.frames.some((frame) => frame.parts.some((part) => part.slot === group.requires)))
	);
}

/** The classes an `other` step's actor may belong to: the item's, or the ones listed. */
export function actorClassesOf(step: StoryStep, item: WordTheme | null): readonly NounClass[] {
	if (step.actor === 'item') {
		return item ? [THEME_CLASS[item]] : [];
	}

	return step.actor ?? [];
}

/** The themes it may come from, or null for any of its classes. */
export function actorThemesOf(
	step: StoryStep,
	item: WordTheme | null
): readonly WordTheme[] | null {
	if (step.actor === 'item') {
		return item ? [item] : null;
	}

	return step.actorThemes ?? null;
}

/** The state groups that can describe this subject, and say this condition. */
export function statesOf(
	data: SentenceLanguageData,
	subject: NounClass,
	condition: Condition | null
): readonly StateGroup[] {
	return data.states.filter(
		(group) =>
			group.subject.includes(subject) &&
			(condition === null ? group.condition === undefined : group.condition === condition)
	);
}

/**
 * The fields of an action step the language can write for this hero, whose
 * needs the hero meets just now. The step's own order is kept, so the first of
 * `['buy', 'take', 'find']` is what a person does and the second what a fox does.
 */
function fieldsFor(
	data: SentenceLanguageData,
	step: StoryStep,
	hero: NounClass,
	item: WordTheme | null,
	prop: WordTheme | null,
	state: StoryState
): readonly VerbField[] {
	const subject = step.kind === 'scene' ? 'place' : hero;

	// A prop step with no prop to write is not a step: the sentence would draw
	// anything at all into the object slot.
	if (!has(state, step.needs) || (step.object === 'prop' && prop === null)) {
		return [];
	}

	// Somebody else's doing needs nothing of the hero, only a verb that takes
	// them — and, for the story's item, an item the story has to be about.
	if (step.kind === 'other') {
		const classes = actorClassesOf(step, item);
		const themes = actorThemesOf(step, item);

		return classes.length
			? fieldsOf(step).filter((field) => groupsForActor(data, field, classes, themes).length > 0)
			: [];
	}

	const object = step.object === 'prop' ? prop : item;

	return fieldsOf(step).filter(
		(field) =>
			has(state, FIELD_RULES[field].needs) &&
			groupsOf(data, field, subject, object, step.object !== undefined).length > 0
	);
}

/**
 * What a telling knows as it goes: what is true of the hero, which of it a step
 * of the story made true — as against what was simply true at the start — and
 * which conditions a sentence has already said.
 */
type Memory = {
	state: StoryState;
	given: ReadonlySet<Condition>;
	said: ReadonlySet<Condition>;
};

/**
 * The condition a state step says. A step that names one says that one; a step
 * that names none describes the hero as they are just now, with whichever of
 * the conditions the story itself brought about the language has a predicate
 * for — or, for a hero nothing is ever true of, a plain trait. Never one the
 * telling has already said: a hero who has been called hungry once is hungry.
 */
function conditionFor(
	data: SentenceLanguageData,
	step: StoryStep,
	hero: NounClass,
	memory: Memory
): Condition | null | undefined {
	if (step.condition) {
		return statesOf(data, hero, step.condition).length && !memory.said.has(step.condition)
			? step.condition
			: undefined;
	}

	const current = [...memory.state].filter(
		(condition) =>
			memory.given.has(condition) &&
			!memory.said.has(condition) &&
			statesOf(data, hero, condition).length > 0
	);

	if (current.length) {
		return pick(current);
	}

	// A hero who acts is described by how they are, never by a trait pulled out of
	// nowhere in the middle of what they are doing; a thing a story is about has
	// nothing else to be described by.
	return !AGENT_CLASSES.includes(hero) && statesOf(data, hero, null).length ? null : undefined;
}

/**
 * Settle one step against the state: the field it uses and the condition it
 * says, or null when the language cannot write it here. Random where there is a
 * choice, so the same story is not told with the same verbs twice.
 */
function settle(
	data: SentenceLanguageData,
	step: StoryStep,
	hero: NounClass,
	item: WordTheme | null,
	prop: WordTheme | null,
	memory: Memory
): { field: VerbField | null; condition: Condition | null } | null {
	if (step.kind === 'state') {
		if (!has(memory.state, step.needs)) {
			return null;
		}

		const condition = conditionFor(data, step, hero, memory);

		return condition === undefined ? null : { field: null, condition };
	}

	const fields = fieldsFor(data, step, hero, item, prop, memory.state);

	return fields.length ? { field: fields[0], condition: null } : null;
}

/** What the telling knows after a settled step. */
function after(
	memory: Memory,
	step: StoryStep,
	settled: { field: VerbField | null; condition: Condition | null }
): Memory {
	const state = new Set(memory.state);
	const given = new Set(memory.given);
	const said = new Set(memory.said);

	// What the place or somebody else does changes nothing of the hero.
	if (settled.field && step.kind !== 'scene' && step.kind !== 'other') {
		const rule = FIELD_RULES[settled.field];

		for (const condition of rule.takes ?? []) {
			state.delete(condition);
		}

		for (const condition of rule.gives ?? []) {
			state.add(condition);
			given.add(condition);
			state.delete(OPPOSITES[condition]!);
		}
	}

	if (settled.condition) {
		state.add(settled.condition);
		given.add(settled.condition);
		said.add(settled.condition);
		state.delete(OPPOSITES[settled.condition]!);
	}

	return { state, given, said };
}

type Settled = {
	step: StoryStep;
	field: VerbField | null;
	condition: Condition | null;
	before: StoryState;
	/** What the story itself had made true by then, as against what was true at the start. */
	given: ReadonlySet<Condition>;
};

/**
 * Walk a sequence of steps from the story's start, settling each against the
 * state the ones before it left. Null when a step cannot be told where it
 * stands, which is what rejects an optional step that would take away what a
 * later required one needs.
 */
function walk(
	data: SentenceLanguageData,
	story: Story,
	steps: readonly StoryStep[],
	hero: NounClass,
	item: WordTheme | null,
	prop: WordTheme | null
): Settled[] | null {
	let memory: Memory = { state: new Set(story.start), given: new Set(), said: new Set() };
	const settled: Settled[] = [];

	for (const step of steps) {
		const one = settle(data, step, hero, item, prop, memory);

		if (!one) {
			return null;
		}

		settled.push({ step, ...one, before: memory.state, given: memory.given });
		memory = after(memory, step, one);
	}

	return settled;
}

/** Whether the language can tell this story about this hero at all. */
export function tellable(
	data: SentenceLanguageData,
	story: Story,
	hero: NounClass,
	item: WordTheme | null
): boolean {
	// A prop is never in a required step, so none is needed to tell the story.
	return (
		walk(
			data,
			story,
			story.steps.filter((step) => step.required),
			hero,
			item,
			null
		) !== null
	);
}

/**
 * The stories a result may follow: the ones about a hero of one of these
 * classes that the language can tell all the way through, narrowed to the one
 * the caller named when they named one that qualifies.
 */
export function storiesFor(
	data: SentenceLanguageData,
	heroes: readonly NounClass[],
	asked: SentenceStory | null
): readonly Story[] {
	const able = STORIES.filter(
		(story) =>
			story.hero.some((hero) => heroes.includes(hero)) &&
			heroClassesFor(data, story, heroes).length > 0
	);
	const named = asked ? able.filter((story) => story.name === asked) : able;

	return named.length ? named : able;
}

/** The classes of `heroes` this story can be told about in this language. */
export function heroClassesFor(
	data: SentenceLanguageData,
	story: Story,
	heroes: readonly NounClass[]
): readonly NounClass[] {
	return story.hero.filter(
		(hero) =>
			heroes.includes(hero) &&
			(story.item ? itemThemesFor(data, story, hero).length > 0 : tellable(data, story, hero, null))
	);
}

/**
 * The themes the story's item may come from, for this hero: every theme of the
 * classes the story names that the language can tell the whole story with.
 */
export function itemThemesFor(
	data: SentenceLanguageData,
	story: Story,
	hero: NounClass
): readonly WordTheme[] {
	const themes = (Object.keys(THEME_CLASS) as WordTheme[]).filter(
		(theme) =>
			(story.item ?? []).includes(THEME_CLASS[theme]) &&
			(!story.itemThemes || story.itemThemes.includes(theme))
	);

	return themes.filter((theme) => tellable(data, story, hero, theme));
}

/**
 * The themes the story's prop may come from, for this hero: every theme of the
 * classes the story names that some verb of every prop step takes. Empty for a
 * story with no prop, and for a language that cannot write one of its steps —
 * German and Russian, which carry no object at all.
 */
export function propThemesFor(
	data: SentenceLanguageData,
	story: Story,
	hero: NounClass
): readonly WordTheme[] {
	const steps = story.steps.filter((step) => step.object === 'prop');

	if (!story.prop || !steps.length) {
		return [];
	}

	return (Object.keys(THEME_CLASS) as WordTheme[]).filter(
		(theme) =>
			story.prop!.includes(THEME_CLASS[theme]) &&
			(!story.propThemes || story.propThemes.includes(theme)) &&
			steps.every((step) =>
				fieldsOf(step).some((field) => groupsOf(data, field, hero, theme, true).length > 0)
			)
	);
}

// The fields a step may be told twice in one story. Going, arriving, rising,
// sleeping and getting hold of the thing happen once; the rest is what a hero
// does in between.
const REPEATABLE_FIELDS: readonly VerbField[] = [
	'express',
	'think',
	'wait',
	'look',
	'play',
	'move',
	'talk',
	'search',
	'tend',
	'change'
];

/** Whether a step can happen a second time in one telling. */
function repeatable(step: StoryStep): boolean {
	return (
		step.destination === undefined &&
		(step.kind !== 'act' || fieldsOf(step).every((field) => REPEATABLE_FIELDS.includes(field)))
	);
}

/** Whether a step is something the hero does, which is what two clauses share. */
function isAction(step: StoryStep): boolean {
	return step.kind === 'act';
}

/**
 * The connectives a sentence may open on, by what it claims. A causal one is
 * kept only where the story has given it a reason: what this sentence needs, or
 * what makes a hero do it, is true because an earlier sentence made it so — a
 * hero who was called tired and then rests is a consequence, and one who rests
 * out of nowhere is not — or the sentence before it was the scene changing,
 * which is a reason to go home. Anything else is left to the quiet kinds, which
 * any continuation can carry.
 */
function linksFor(previous: Settled | null, current: Settled): readonly ConnectiveKind[] {
	const asked = current.step.link;

	if (!previous) {
		return [];
	}

	if (asked === 'causal') {
		const rule = current.field ? FIELD_RULES[current.field] : undefined;
		const reasons =
			current.step.kind === 'state'
				? [current.condition!]
				: [...(rule?.needs ?? []), ...(rule?.after ?? [])];
		const motivated = reasons.some(
			(condition) => current.before.has(condition) && current.given.has(condition)
		);
		// A state sentence is a consequence of what brought the condition about, and
		// a fresh condition is what the sentence before it left behind.
		const followed =
			current.step.kind === 'state' &&
			previous.field !== null &&
			(FIELD_RULES[previous.field].gives ?? []).includes(current.condition!);

		return motivated || followed || previous.step.kind === 'scene'
			? ['causal']
			: ['additive', 'temporal'];
	}

	return asked ? [asked] : ['additive', 'temporal'];
}

/**
 * Plan a telling of `story` in exactly `count` sentences.
 *
 * The required steps come first, then optional steps are added wherever the
 * state allows and a later step still holds, then interludes fill what is left.
 * Some neighbouring actions are then joined into one sentence, and the plan is
 * topped up again for each join, so the count comes out exact. A story that has
 * fewer required steps than the caller wants sentences is padded; one that has
 * more is cut where it stands.
 */
export function plan(
	data: SentenceLanguageData,
	story: Story,
	hero: NounClass,
	item: WordTheme | null,
	count: number,
	joinable: boolean
): Plan | null {
	const required = story.steps.filter((step) => step.required);
	// The prop is drawn once per telling, the way the item is drawn once per story.
	const props = propThemesFor(data, story, hero);
	const prop = props.length ? pick(props) : null;
	let chosen: StoryStep[] = required.slice(0, count);
	let settled = walk(data, story, chosen, hero, item, prop);

	if (!settled) {
		return null;
	}

	// Two clauses in one sentence need the room for two clauses. `joinable` is
	// the caller's range saying whether there is any: a result asked to be short is
	// one whose sentences are better left whole and separate.
	const canJoin = joinable && data.join !== undefined;
	// How many two-clause sentences this telling aims for. Drawn once, so that a
	// paragraph is not all of one or all of the other.
	let joins = canJoin && count > 1 ? randInt(0, Math.floor(count * JOIN_SHARE)) : 0;

	// Add steps until the telling is one longer than its sentence count for every
	// join it will make — or until nothing more can be added, in which case the
	// joins give way.
	const grow = (again: boolean): boolean => {
		// What may still go in: the story's own optional steps and the interludes,
		// each once — or, when every one of them is in and the count is not reached,
		// any of them a second time, because ten sentences about a bowl of soup are
		// ten sentences whatever the soup has left to do.
		const optional = story.steps.filter(
			(step) =>
				!step.required &&
				(again ? !chosen.includes(step) || repeatable(step) : !chosen.includes(step))
		);
		const own: (() => StoryStep[])[] = [];
		const filler: (() => StoryStep[])[] = [];

		// An optional step goes back where the story wrote it. Interludes have to
		// wait until the story's own steps are used up, so that a telling is padded
		// with what the story says before it is padded with what any story could.
		for (const step of optional) {
			own.push(() => {
				const at = story.steps.indexOf(step);
				const before = chosen.filter((each) => story.steps.indexOf(each) < at);
				const rest = chosen.filter((each) => story.steps.indexOf(each) >= at);

				return [...before, step, ...rest];
			});
		}

		// An interlude goes anywhere after the opening sentence, and each kind of
		// interlude goes in once.
		for (const step of INTERLUDES) {
			if ((step.object === 'item' && !story.item) || (!again && chosen.includes(step))) {
				continue;
			}

			filler.push(() => {
				const at = randInt(1, chosen.length);

				return [...chosen.slice(0, at), step, ...chosen.slice(at)];
			});
		}

		// Shuffled within each list, so the same story is not padded the same way
		// twice.
		const shuffle = (list: (() => StoryStep[])[]) => {
			for (let i = list.length - 1; i > 0; i -= 1) {
				const j = randInt(0, i);

				[list[i], list[j]] = [list[j], list[i]];
			}
		};

		shuffle(own);
		shuffle(filler);

		for (const attempt of [...own, ...filler]) {
			const candidate = attempt();

			if (!candidate) {
				continue;
			}

			const walked = walk(data, story, candidate, hero, item, prop);

			if (walked) {
				chosen = candidate;
				settled = walked;

				return true;
			}
		}

		return false;
	};

	while (chosen.length < count + joins) {
		if (!grow(false) && !grow(true)) {
			// Nothing more to add: every join that has no step to pay for it is
			// given up, and what is left is what there is.
			joins = Math.max(0, chosen.length - count);
			break;
		}
	}

	// A telling that cannot reach its count is not a telling of this story.
	if (chosen.length < count) {
		return null;
	}

	// Which neighbouring actions become one sentence. Every pair that could is a
	// candidate, and the draw decides, up to the number the telling paid for.
	const joined = new Set<number>();
	const pairs: number[] = [];

	for (let i = 0; i + 1 < settled!.length; i += 1) {
		if (isAction(settled![i].step) && isAction(settled![i + 1].step)) {
			pairs.push(i);
		}
	}

	for (let i = pairs.length - 1; i > 0; i -= 1) {
		const j = randInt(0, i);

		[pairs[i], pairs[j]] = [pairs[j], pairs[i]];
	}

	for (const at of pairs) {
		if (joined.size >= joins) {
			break;
		}

		if (!joined.has(at - 1) && !joined.has(at + 1)) {
			joined.add(at);
		}
	}

	// A join that was paid for and not made leaves the telling one sentence long;
	// the steps that were only ever padding come off the end first. A step whose
	// removal breaks a later step's needs stays: `take` was optional, and `eat`
	// after it is not.
	while (settled!.length - joined.size > count) {
		let trimmed: Settled[] | null = null;
		let at = -1;
		// The join a trimmed clause was one half of, given up with it: the other
		// clause is a sentence of its own then.
		let unjoined = -1;

		for (let i = settled!.length - 1; i >= 0 && !trimmed; i -= 1) {
			if (settled![i].step.required || joined.has(i) || joined.has(i - 1)) {
				continue;
			}

			const without = [...chosen.slice(0, i), ...chosen.slice(i + 1)];

			trimmed = walk(data, story, without, hero, item, prop);
			at = i;
		}

		// Nothing stands alone: every optional step left is one clause of a
		// two-clause sentence, and a join is not worth a sentence the caller did not
		// ask for. One clause goes, and its join with it.
		for (let i = settled!.length - 1; i >= 0 && !trimmed; i -= 1) {
			if (settled![i].step.required || !(joined.has(i) || joined.has(i - 1))) {
				continue;
			}

			const without = [...chosen.slice(0, i), ...chosen.slice(i + 1)];

			trimmed = walk(data, story, without, hero, item, prop);
			at = i;
			unjoined = joined.has(i) ? i : i - 1;
		}

		if (!trimmed) {
			break;
		}

		chosen.splice(at, 1);
		settled = trimmed;

		if (unjoined >= 0) {
			joined.delete(unjoined);
		}

		const shifted = new Set<number>();

		for (const each of joined) {
			shifted.add(each > at ? each - 1 : each);
		}

		joined.clear();

		for (const each of shifted) {
			joined.add(each);
		}
	}

	let voiced = 0;
	const beats: Beat[] = settled!.map((one, i) => {
		// A person says some of what is true of them in their own words: a state
		// sentence after the first, in a language that writes the first person, is
		// now and then a line the story quotes rather than narrates.
		const voice =
			hero === 'person' &&
			data.speech !== undefined &&
			i > 0 &&
			one.step.kind === 'state' &&
			one.condition !== null &&
			voiced < VOICE_MAX &&
			chance(VOICE_CHANCE);

		if (voice) {
			voiced += 1;
		}

		return {
			step: one.step,
			field: one.field,
			condition: one.condition,
			before: one.before,
			links: linksFor(i > 0 ? settled![i - 1] : null, one),
			// A kind beside the statement is the step's own, and `trailing` is kept for
			// the sentence that closes the result — a paragraph that trails off in the
			// middle has not trailed off.
			kinds: (one.step.kinds ?? []).filter(
				(kind) => kind !== 'trailing' || i === settled!.length - 1
			),
			join: joined.has(i) ? 'first' : joined.has(i - 1) ? 'second' : null,
			voiced: voice
		};
	});

	return { story, beats, prop };
}

/** One story out of several, by weight. */
export function pickStory(stories: readonly Story[]): Story {
	return pickWeighted(stories, (story) => story.weight);
}
