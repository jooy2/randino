// The sentence datasets, one per language, and the two pieces of knowledge that
// are the same in every language: what kind of thing each theme names, and how a
// story goes.

import type { SentenceStory, SentenceType, WordLanguage, WordTheme } from '../../_types/global.js';
import { DE } from './de.js';
import { EN } from './en.js';
import { ES } from './es.js';
import { IT } from './it.js';
import { JA } from './ja.js';
import { KO } from './ko.js';
import { RU } from './ru.js';
import { VI } from './vi.js';
import { ZH } from './zh.js';
import type {
	Condition,
	ConnectiveKind,
	NounClass,
	SentenceLanguageData,
	VerbField
} from './types.js';

/**
 * Which class each theme's nouns belong to. Shared by every language, because a
 * theme is the same slice of vocabulary everywhere — an animal is a creature in
 * Korean and in Russian alike — and because a verb group that names a class is
 * what makes a sentence hold together.
 */
export const THEME_CLASS: Record<WordTheme, NounClass> = {
	animal: 'creature',
	myth: 'creature',
	job: 'person',
	person: 'person',
	plant: 'plant',
	food: 'edible',
	drink: 'edible',
	object: 'thing',
	tool: 'thing',
	clothing: 'thing',
	product: 'thing',
	gem: 'thing',
	music: 'thing',
	toy: 'thing',
	furniture: 'thing',
	vehicle: 'vehicle',
	place: 'place',
	nature: 'place',
	space: 'place',
	weather: 'event',
	sport: 'event',
	time: 'event',
	sound: 'event',
	concept: 'idea',
	emotion: 'idea',
	finance: 'idea',
	tech: 'idea',
	color: 'idea',
	body: 'body'
};

/** The classes a story can be about somebody in: the ones that act. */
export const AGENT_CLASSES: readonly NounClass[] = ['creature', 'person'];

/**
 * What each field needs to be true of the hero before it happens, what it leaves
 * true afterwards, and what it ends. This is the whole of a story's memory: a
 * step whose needs are not met is not written, so nobody eats what nobody has
 * picked up, and a connective that says "so" is written only where the sentence
 * before it left true what this one needed.
 *
 * `awake` is what almost everything needs and what `sleep` ends, which is why a
 * hero who has gone to sleep does nothing else in that story.
 */
export type FieldRule = {
	/** What has to be true of the hero for this to happen at all. */
	needs?: readonly Condition[];
	/** What is true of the hero once it has. */
	gives?: readonly Condition[];
	/** What is no longer true once it has. */
	takes?: readonly Condition[];
	/**
	 * What makes the hero do it, which is what a connective that says "so" is
	 * allowed to claim: a hungry hero who eats is a consequence, and a hero who
	 * eats because the sky darkened is not.
	 */
	after?: readonly Condition[];
};

export const FIELD_RULES: Record<VerbField, FieldRule> = {
	rise: { gives: ['awake', 'rested'], takes: ['asleep', 'tired'] },
	go: { needs: ['awake'], gives: ['away'], takes: ['home'], after: ['restless', 'hungry'] },
	arrive: { needs: ['awake'], gives: ['home'], takes: ['away'], after: ['tired', 'full'] },
	move: { needs: ['awake'], gives: ['tired'], takes: ['rested'], after: ['restless'] },
	wait: { needs: ['awake'] },
	rest: { needs: ['awake'], gives: ['rested'], takes: ['tired'], after: ['tired', 'full'] },
	sleep: {
		needs: ['awake'],
		gives: ['asleep'],
		takes: ['awake', 'tired'],
		after: ['tired', 'full']
	},
	express: { needs: ['awake'], after: ['content', 'full'] },
	play: {
		needs: ['awake'],
		gives: ['tired', 'content'],
		takes: ['rested', 'restless'],
		after: ['restless', 'rested']
	},
	think: { needs: ['awake'], after: ['restless'] },
	look: { needs: ['awake'], after: ['restless'] },
	search: { needs: ['awake'], after: ['restless'] },
	find: { needs: ['awake'], gives: ['holding', 'content'], takes: ['restless'] },
	take: { needs: ['awake'], gives: ['holding'], after: ['hungry'] },
	carry: { needs: ['awake', 'holding'] },
	hide: { needs: ['awake', 'holding'], takes: ['holding'] },
	make: { needs: ['awake'], gives: ['holding'] },
	tend: { needs: ['awake', 'holding'] },
	sell: { needs: ['awake', 'holding'], takes: ['holding'] },
	buy: { needs: ['awake'], gives: ['holding'], after: ['hungry'] },
	cook: { needs: ['awake', 'holding'], after: ['hungry'] },
	// A meal leaves the hero full and pleased, which is what they show afterwards.
	eat: {
		needs: ['awake', 'holding'],
		gives: ['full', 'content'],
		takes: ['hungry', 'holding'],
		after: ['hungry']
	},
	drink: {
		needs: ['awake', 'holding'],
		gives: ['full', 'content'],
		takes: ['hungry', 'holding'],
		after: ['hungry']
	},
	// Losing what one holds is what makes a hero restless enough to search.
	lose: { needs: ['awake', 'holding'], gives: ['restless'], takes: ['holding', 'content'] },
	meet: { needs: ['awake'], gives: ['content'], takes: ['restless'], after: ['restless'] },
	talk: { needs: ['awake'], after: ['content'] },
	change: {}
};

/**
 * The condition each one rules out. Saying the hero is full is saying they are
 * no longer hungry, so a state sentence ends the opposite of what it asserts.
 */
export const OPPOSITES: Partial<Record<Condition, Condition>> = {
	awake: 'asleep',
	asleep: 'awake',
	hungry: 'full',
	full: 'hungry',
	tired: 'rested',
	rested: 'tired',
	away: 'home',
	home: 'away',
	content: 'restless',
	restless: 'content'
};

/**
 * One thing that happens in a story.
 *
 * - `act`: the hero does something, drawn from the `field` — or from the first of
 *   several the language has a verb for that takes this hero.
 * - `state`: the hero is described, with a predicate that says `condition`, which
 *   the story then knows to be true.
 * - `scene`: the place the story is happening in does something of its own
 *   (`숲이 조용해졌다`), which is a step whose subject is not the hero.
 * - `other`: somebody or something else does — the person the hero met, a
 *   sparrow on the fence, the wind. `actor` says who: the story's item (`'item'`,
 *   for a story whose item is a person) or a fresh noun of the classes listed,
 *   narrowed to `actorThemes`. What they do changes nothing of the hero's state.
 *
 * `object`, `place` and `destination` name the story's own nouns rather than
 * themes: the `item` is one thing throughout, the `place` is where it all happens
 * and `home` is where the hero comes back to. A part the shape has room for is
 * written with that noun, and one it has no room for is left out rather than
 * drawn afresh.
 */
export type StoryStep = {
	kind: 'act' | 'state' | 'scene' | 'other';
	field?: VerbField | readonly VerbField[];
	condition?: Condition;
	/**
	 * Who an `other` step is about: the story's item, or a fresh noun of one of
	 * these classes. Left out by every other kind of step.
	 */
	actor?: 'item' | readonly NounClass[];
	/** The themes a fresh actor may come from, when its classes are too wide. */
	actorThemes?: readonly WordTheme[];
	/**
	 * The noun in the object slot: the thing the story is about, or its prop — a
	 * second thing the hero picks up or looks at on the way, which is never what
	 * the story needs and so is never in a required step.
	 */
	object?: 'item' | 'prop';
	place?: boolean;
	/**
	 * Where the hero goes: the story's place, home, or `'elsewhere'` — a fresh
	 * place the story moves on to, which is its place from then on.
	 */
	destination?: 'place' | 'home' | 'elsewhere';
	/**
	 * What has to be true of the hero for this step, beside what its field needs.
	 * An interlude that has the hero look at the thing needs them to be holding
	 * one, where `look` on its own does not.
	 */
	needs?: readonly Condition[];
	/** A step every telling of the story has. The rest are drawn as room allows. */
	required?: boolean;
	/** What a connective in front of this sentence may claim about the last one. */
	link?: ConnectiveKind;
	/** Kinds this sentence may be beside a statement. */
	kinds?: readonly SentenceType[];
};

export type Story = {
	name: SentenceStory;
	/** Classes the hero may belong to. */
	hero: readonly NounClass[];
	/**
	 * The themes the hero may come from, when the classes are too wide: a sketch
	 * is of a forest or a market, not of Pluto, though all three are the `place`
	 * class.
	 */
	heroThemes?: readonly WordTheme[];
	/**
	 * The most lines one telling may quote — what somebody says or thinks, and
	 * what somebody answers. Left out for the usual two; a story about two people
	 * talking allows more.
	 */
	lines?: number;
	/** Classes the thing the story is about may belong to, for a story with one. */
	item?: readonly NounClass[];
	/**
	 * The themes it may come from, when the classes are too wide: a craftsman
	 * makes a bowl and not a melody, though both are things.
	 */
	itemThemes?: readonly WordTheme[];
	/**
	 * Classes a second thing may belong to, for a story that has a step with
	 * `object: 'prop'`: a tool picked up before the making, something looked at
	 * on the way. Narrowed to `propThemes` the way the item is.
	 */
	prop?: readonly NounClass[];
	propThemes?: readonly WordTheme[];
	/** What is true of the hero before the first sentence. */
	start: readonly Condition[];
	steps: readonly StoryStep[];
	/** How often this story is told, against the others the hero could be in. */
	weight: number;
};

/**
 * The stories, written once for every language. Each is an order of events a
 * reader would accept, with the steps a telling may leave out marked as such; what
 * a step becomes in words is the language's business, and what it may be
 * followed by is `FIELD_RULES`'.
 *
 * A story's required steps alone have to satisfy their own needs, so that a
 * telling cut down to them still holds together; `test/sentence.test.ts` walks
 * each of them to check.
 */
export const STORIES: readonly Story[] = [
	{
		name: 'errand',
		hero: AGENT_CLASSES,
		item: ['edible'],
		// Something else on the stall, looked at and left there.
		prop: ['edible'],
		start: ['awake', 'hungry', 'home'],
		weight: 20,
		steps: [
			{ kind: 'state', condition: 'hungry' },
			{ kind: 'act', field: 'go', destination: 'place', required: true },
			{ kind: 'act', field: 'look', object: 'prop', place: true, link: 'additive' },
			{ kind: 'act', field: 'look', object: 'item', place: true },
			// Somebody at the market, doing what people at a market do.
			{
				kind: 'other',
				actor: ['person'],
				field: ['talk', 'express', 'wait', 'move'],
				link: 'additive'
			},
			{ kind: 'act', field: ['buy', 'take', 'find'], object: 'item', place: true, required: true },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{ kind: 'act', field: 'cook', object: 'item' },
			{ kind: 'act', field: ['eat', 'drink'], object: 'item', required: true, link: 'causal' },
			{ kind: 'state', condition: 'full', link: 'causal' },
			{
				kind: 'act',
				field: ['express', 'think', 'rest'],
				link: 'temporal',
				kinds: ['trailing', 'exclamation']
			}
		]
	},
	{
		name: 'meal',
		hero: AGENT_CLASSES,
		item: ['edible'],
		start: ['awake', 'hungry', 'home'],
		weight: 14,
		steps: [
			{ kind: 'state', condition: 'hungry', required: true },
			{ kind: 'act', field: ['take', 'find'], object: 'item', required: true, link: 'causal' },
			{ kind: 'act', field: 'cook', object: 'item' },
			{ kind: 'act', field: 'look', object: 'item' },
			{ kind: 'act', field: ['eat', 'drink'], object: 'item', required: true, link: 'temporal' },
			{ kind: 'state', condition: 'full', link: 'causal' },
			{ kind: 'act', field: 'express', kinds: ['exclamation'] },
			{ kind: 'act', field: ['think', 'play'], link: 'temporal', kinds: ['trailing'] }
		]
	},
	{
		name: 'search',
		hero: AGENT_CLASSES,
		item: ['thing', 'plant'],
		itemThemes: ['object', 'tool', 'clothing', 'gem', 'plant'],
		// What the search turns up first, which is not what it was for.
		prop: ['thing'],
		propThemes: ['object', 'clothing'],
		start: ['awake', 'restless', 'home'],
		weight: 16,
		steps: [
			{ kind: 'state', condition: 'restless' },
			{ kind: 'act', field: 'search', place: true, required: true },
			{ kind: 'act', field: 'look', object: 'prop', place: true, link: 'additive' },
			{ kind: 'act', field: 'wait', place: true },
			{ kind: 'act', field: 'go', destination: 'elsewhere', link: 'temporal' },
			{
				kind: 'act',
				field: 'find',
				object: 'item',
				place: true,
				required: true,
				kinds: ['exclamation']
			},
			{ kind: 'act', field: ['carry', 'take'], object: 'item', link: 'temporal' },
			{ kind: 'act', field: 'arrive', destination: 'home', link: 'temporal' },
			{ kind: 'act', field: 'hide', object: 'item' },
			{ kind: 'state', condition: 'content', link: 'causal' },
			{
				kind: 'act',
				field: ['think', 'express'],
				link: 'temporal',
				kinds: ['trailing', 'exclamation']
			}
		]
	},
	{
		name: 'outing',
		hero: AGENT_CLASSES,
		item: ['plant', 'thing'],
		start: ['asleep', 'rested', 'home'],
		weight: 18,
		steps: [
			{ kind: 'act', field: 'rise', required: true },
			{ kind: 'act', field: 'go', destination: 'place', required: true, link: 'temporal' },
			{ kind: 'act', field: ['move', 'play'], place: true, link: 'additive' },
			{ kind: 'act', field: 'look', object: 'item', place: true },
			{ kind: 'act', field: 'wait', place: true },
			{ kind: 'act', field: 'go', destination: 'elsewhere', link: 'temporal' },
			{ kind: 'scene', field: 'change', link: 'temporal' },
			{ kind: 'state', condition: 'tired', link: 'causal' },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{ kind: 'act', field: ['rest', 'sleep', 'express'], link: 'causal', kinds: ['trailing'] }
		]
	},
	{
		name: 'craft',
		hero: ['person'],
		item: ['thing'],
		itemThemes: ['object', 'tool', 'clothing', 'product', 'gem'],
		// The tool in hand before the making.
		prop: ['thing'],
		propThemes: ['tool'],
		start: ['awake', 'rested', 'home'],
		weight: 12,
		steps: [
			{ kind: 'act', field: 'go', destination: 'place' },
			{ kind: 'act', field: 'take', object: 'prop', place: true, link: 'additive' },
			{ kind: 'act', field: 'make', object: 'item', place: true, required: true },
			{ kind: 'act', field: 'tend', object: 'item', link: 'temporal' },
			{ kind: 'act', field: 'look', object: 'item' },
			{ kind: 'act', field: ['sell', 'carry'], object: 'item', required: true, link: 'temporal' },
			{ kind: 'state', condition: 'content', link: 'causal' },
			{ kind: 'act', field: 'arrive', destination: 'home', link: 'temporal' },
			{
				kind: 'act',
				field: ['express', 'think'],
				link: 'temporal',
				kinds: ['trailing', 'exclamation']
			}
		]
	},
	{
		name: 'stroll',
		hero: AGENT_CLASSES,
		// Something seen on the way.
		prop: ['plant', 'thing'],
		propThemes: ['plant', 'object'],
		start: ['awake', 'rested', 'home'],
		weight: 12,
		steps: [
			{ kind: 'act', field: 'go', destination: 'place', required: true },
			{ kind: 'act', field: 'move', place: true, required: true, link: 'additive' },
			{ kind: 'act', field: 'look', object: 'prop', place: true },
			{ kind: 'act', field: 'go', destination: 'elsewhere', link: 'temporal' },
			{ kind: 'act', field: ['wait', 'express'], place: true },
			{ kind: 'act', field: 'play', place: true },
			{ kind: 'scene', field: 'change', link: 'temporal' },
			{ kind: 'act', field: 'think' },
			{ kind: 'state', condition: 'tired', link: 'causal' },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{
				kind: 'act',
				field: ['rest', 'sleep', 'think', 'express'],
				link: 'causal',
				kinds: ['trailing']
			}
		]
	},
	{
		name: 'evening',
		hero: AGENT_CLASSES,
		item: ['edible'],
		start: ['awake', 'away', 'holding'],
		weight: 12,
		steps: [
			{ kind: 'scene', field: 'change', required: true },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'causal' },
			{ kind: 'act', field: ['eat', 'drink'], object: 'item', link: 'temporal' },
			{ kind: 'act', field: 'express' },
			{ kind: 'act', field: 'think' },
			{ kind: 'state', condition: 'tired' },
			{ kind: 'act', field: 'sleep', required: true, link: 'temporal' },
			{ kind: 'scene', field: 'change', link: 'temporal', kinds: ['trailing'] }
		]
	},
	{
		// A day at home: a person gets up, takes a thing out and sees to it.
		name: 'chores',
		hero: ['person'],
		item: ['thing'],
		itemThemes: ['object', 'tool', 'clothing'],
		start: ['asleep', 'rested', 'home'],
		weight: 12,
		steps: [
			{ kind: 'act', field: 'rise', required: true },
			{ kind: 'act', field: 'take', object: 'item', required: true, link: 'temporal' },
			{ kind: 'act', field: 'look', object: 'item' },
			{ kind: 'act', field: 'tend', object: 'item', required: true, link: 'additive' },
			{ kind: 'act', field: 'carry', object: 'item', link: 'temporal' },
			{ kind: 'state', condition: 'content', link: 'causal' },
			{
				kind: 'act',
				field: ['express', 'think'],
				link: 'temporal',
				kinds: ['trailing', 'exclamation']
			}
		]
	},
	{
		// The hero carries something somewhere and hides it there.
		name: 'stash',
		hero: AGENT_CLASSES,
		item: ['edible', 'thing'],
		start: ['awake', 'rested', 'home', 'holding'],
		weight: 12,
		steps: [
			{ kind: 'act', field: 'carry', object: 'item', required: true },
			{ kind: 'act', field: 'go', destination: 'place', required: true, link: 'temporal' },
			{ kind: 'act', field: 'look', object: 'item', place: true },
			{ kind: 'act', field: 'hide', object: 'item', place: true, required: true, link: 'temporal' },
			{ kind: 'act', field: 'wait', place: true },
			{ kind: 'scene', field: 'change', link: 'temporal' },
			{ kind: 'act', field: 'think', link: 'additive' },
			{ kind: 'act', field: 'arrive', destination: 'home', link: 'temporal' },
			{ kind: 'state', condition: 'content', link: 'causal', kinds: ['trailing'] }
		]
	},
	{
		// Nothing happens: the hero is at a loose end, and plays.
		name: 'idle',
		hero: AGENT_CLASSES,
		// Something in the room.
		prop: ['thing'],
		propThemes: ['object', 'music'],
		start: ['awake', 'rested', 'home'],
		weight: 10,
		steps: [
			{ kind: 'state', condition: 'restless' },
			{ kind: 'act', field: 'wait', required: true },
			{ kind: 'act', field: 'look', object: 'prop', link: 'additive' },
			{ kind: 'act', field: 'think', link: 'additive' },
			{ kind: 'act', field: 'play', required: true, link: 'temporal' },
			{ kind: 'act', field: 'express', link: 'causal', kinds: ['exclamation'] },
			{ kind: 'state', condition: 'content', link: 'causal' },
			{ kind: 'act', field: ['rest', 'think'], link: 'temporal', kinds: ['trailing'] }
		]
	},
	{
		// The place wakes before the hero does, and the day begins.
		name: 'waking',
		hero: AGENT_CLASSES,
		start: ['asleep', 'rested', 'home'],
		weight: 10,
		steps: [
			{ kind: 'scene', field: 'change', required: true },
			{ kind: 'act', field: 'rise', required: true, link: 'temporal' },
			{ kind: 'act', field: 'express', link: 'additive' },
			{ kind: 'act', field: ['move', 'play'], link: 'additive' },
			{ kind: 'act', field: 'think' },
			{ kind: 'act', field: 'wait', link: 'temporal' },
			{ kind: 'scene', field: 'change', link: 'temporal', kinds: ['trailing'] }
		]
	},
	{
		// The hero eats out: gets something somewhere and eats it there.
		name: 'picnic',
		hero: AGENT_CLASSES,
		item: ['edible'],
		// Something else on the stall, looked at and left there.
		prop: ['edible'],
		start: ['awake', 'hungry', 'home'],
		weight: 12,
		steps: [
			{ kind: 'act', field: 'go', destination: 'place', required: true },
			{ kind: 'act', field: 'look', object: 'prop', place: true, link: 'additive' },
			{ kind: 'act', field: ['buy', 'take', 'find'], object: 'item', place: true, required: true },
			{ kind: 'act', field: 'go', destination: 'elsewhere', link: 'temporal' },
			{ kind: 'act', field: 'look', object: 'item' },
			{
				kind: 'act',
				field: ['eat', 'drink'],
				object: 'item',
				place: true,
				required: true,
				link: 'temporal'
			},
			{ kind: 'state', condition: 'full', link: 'causal' },
			{ kind: 'act', field: 'express', link: 'causal', kinds: ['exclamation'] },
			{ kind: 'scene', field: 'change', link: 'temporal' },
			{ kind: 'act', field: 'arrive', destination: 'home', link: 'temporal' },
			{ kind: 'act', field: ['think', 'express'], kinds: ['trailing'] }
		]
	},
	{
		// The hero loses what they carried, looks for it, and may or may not find it.
		name: 'mishap',
		hero: AGENT_CLASSES,
		item: ['thing', 'edible'],
		itemThemes: ['object', 'tool', 'clothing', 'gem', 'food'],
		start: ['awake', 'rested', 'home', 'holding'],
		weight: 12,
		steps: [
			{ kind: 'act', field: 'carry', object: 'item', link: 'additive' },
			{ kind: 'act', field: 'go', destination: 'place', required: true },
			{
				kind: 'act',
				field: 'lose',
				object: 'item',
				place: true,
				required: true,
				link: 'temporal'
			},
			{ kind: 'state', condition: 'restless', link: 'causal' },
			{ kind: 'act', field: 'search', place: true, required: true, link: 'causal' },
			{ kind: 'act', field: 'wait', place: true },
			{
				kind: 'act',
				field: 'find',
				object: 'item',
				place: true,
				link: 'temporal',
				kinds: ['exclamation']
			},
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{
				kind: 'act',
				field: ['express', 'think', 'rest'],
				link: 'temporal',
				kinds: ['trailing', 'exclamation']
			}
		]
	},
	{
		// The hero goes to see somebody, and they talk. The person met is the thing
		// this story is about.
		name: 'visit',
		hero: AGENT_CLASSES,
		item: ['person'],
		start: ['awake', 'rested', 'home'],
		weight: 12,
		steps: [
			{ kind: 'act', field: 'go', destination: 'place', required: true },
			{ kind: 'act', field: 'meet', object: 'item', place: true, required: true, link: 'temporal' },
			// The person met, doing something of their own.
			{ kind: 'other', actor: 'item', field: ['express', 'talk', 'wait'], link: 'additive' },
			{ kind: 'act', field: 'talk', link: 'additive' },
			{ kind: 'act', field: 'express', link: 'causal', kinds: ['exclamation'] },
			{ kind: 'act', field: 'wait', place: true },
			{ kind: 'state', condition: 'content', link: 'causal' },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{ kind: 'act', field: ['think', 'express'], link: 'temporal', kinds: ['trailing'] }
		]
	},
	{
		// Two people talk. The hero goes out, meets somebody, and what the two of
		// them say to each other is most of the story — it is the one that allows
		// the most lines, and the person met is the one who answers them.
		name: 'chat',
		hero: ['person'],
		item: ['person'],
		// Something at the place, looked at while they talk.
		prop: ['thing', 'plant', 'edible'],
		propThemes: ['object', 'plant', 'food', 'drink'],
		lines: 5,
		start: ['awake', 'rested', 'home'],
		weight: 14,
		steps: [
			{ kind: 'act', field: 'go', destination: 'place', required: true },
			{ kind: 'act', field: 'meet', object: 'item', place: true, required: true, link: 'temporal' },
			{ kind: 'other', actor: 'item', field: ['express', 'talk'], link: 'additive' },
			{ kind: 'state', condition: 'content', link: 'causal' },
			{ kind: 'act', field: 'talk', required: true, link: 'additive' },
			{ kind: 'act', field: 'look', object: 'prop', place: true },
			{
				kind: 'other',
				actor: 'item',
				field: ['express', 'talk', 'wait', 'move'],
				link: 'additive'
			},
			{ kind: 'act', field: 'express', link: 'causal', kinds: ['exclamation'] },
			{ kind: 'act', field: 'talk', link: 'temporal' },
			{ kind: 'act', field: 'wait', place: true },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{ kind: 'act', field: ['think', 'express'], link: 'temporal', kinds: ['trailing'] }
		]
	},
	{
		// The hero goes out, sits down somewhere, and watches: what turns up, what
		// the light does. The hero does little, and that is the point of it.
		name: 'watch',
		hero: AGENT_CLASSES,
		// Something seen from where they sit.
		prop: ['plant', 'thing'],
		propThemes: ['plant', 'object'],
		start: ['awake', 'rested', 'home'],
		weight: 14,
		steps: [
			{ kind: 'act', field: 'go', destination: 'place', required: true },
			{ kind: 'act', field: 'rest', place: true, required: true, link: 'temporal' },
			{
				kind: 'other',
				actor: ['creature'],
				actorThemes: ['animal'],
				field: ['move', 'play', 'wait', 'express', 'rest'],
				link: 'additive'
			},
			{ kind: 'act', field: 'look', object: 'prop', place: true },
			{ kind: 'scene', field: 'change', link: 'temporal' },
			{
				kind: 'other',
				actor: ['person'],
				field: ['move', 'talk', 'express', 'wait', 'play'],
				link: 'additive'
			},
			{ kind: 'act', field: 'think', link: 'additive' },
			{ kind: 'state', condition: 'rested', link: 'causal' },
			{ kind: 'scene', field: 'change', link: 'temporal' },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{ kind: 'act', field: ['express', 'think', 'sleep'], link: 'temporal', kinds: ['trailing'] }
		]
	},
	{
		// The weather turns while the hero is out. They wait it out, and go on
		// once it has passed.
		name: 'shelter',
		hero: AGENT_CLASSES,
		start: ['awake', 'rested', 'home'],
		weight: 12,
		steps: [
			{ kind: 'act', field: 'go', destination: 'place', required: true },
			{ kind: 'act', field: ['move', 'play', 'wait'], place: true, link: 'additive' },
			{
				kind: 'other',
				actor: ['event'],
				actorThemes: ['weather'],
				field: 'change',
				required: true,
				link: 'temporal'
			},
			{ kind: 'act', field: 'wait', place: true, required: true, link: 'causal' },
			{ kind: 'act', field: ['think', 'express'], link: 'additive' },
			{
				kind: 'other',
				actor: ['event'],
				actorThemes: ['weather'],
				field: 'change',
				link: 'temporal'
			},
			{ kind: 'scene', field: 'change', link: 'temporal' },
			{ kind: 'act', field: ['move', 'play'], place: true, link: 'causal' },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{ kind: 'act', field: ['rest', 'express', 'think'], link: 'temporal', kinds: ['trailing'] }
		]
	},
	{
		// Nothing happens to anybody. A place is described, and the things in it do
		// what they do — the wind, the leaves, a bird, the evening. The hero is the
		// place, and nobody is the story's subject for long.
		name: 'sketch',
		hero: ['place'],
		heroThemes: ['place', 'nature'],
		start: [],
		weight: 16,
		steps: [
			{ kind: 'state', required: true },
			{
				kind: 'other',
				actor: ['event'],
				actorThemes: ['weather'],
				field: 'change',
				link: 'additive'
			},
			{
				kind: 'other',
				actor: ['creature'],
				actorThemes: ['animal'],
				field: ['move', 'rest', 'express', 'wait', 'play', 'sleep'],
				link: 'additive'
			},
			{ kind: 'act', field: 'change', required: true, link: 'temporal' },
			{ kind: 'other', actor: ['plant'], field: 'change', link: 'additive' },
			{ kind: 'other', actor: ['event'], actorThemes: ['time'], field: 'change', link: 'temporal' },
			{
				kind: 'other',
				actor: ['creature', 'person'],
				actorThemes: ['animal', 'job', 'person'],
				field: ['move', 'rest', 'wait', 'sleep', 'express'],
				link: 'temporal'
			},
			{ kind: 'act', field: 'change', link: 'temporal' },
			{ kind: 'state', link: 'causal', kinds: ['trailing'] }
		]
	},
	{
		name: 'passage',
		hero: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
		start: [],
		weight: 10,
		steps: [
			{ kind: 'state' },
			{ kind: 'act', field: ['change', 'move'], required: true },
			{ kind: 'act', field: ['change', 'move'], required: true, link: 'temporal' },
			{ kind: 'act', field: ['change', 'move'], link: 'temporal' },
			{ kind: 'state', link: 'causal', kinds: ['trailing'] }
		]
	}
];

/**
 * What a telling may put between the steps of its story when it is asked for
 * more sentences than the story has: the hero described as they are just now,
 * doing something that changes nothing, or the place doing something of its own.
 */
export const INTERLUDES: readonly StoryStep[] = [
	{ kind: 'state', link: 'causal' },
	{ kind: 'act', field: ['express', 'wait', 'think'], link: 'additive' },
	{ kind: 'act', field: 'look', object: 'item', needs: ['holding'] },
	// Out of the house, the hero may move about where they are, and the place may
	// do something of its own. At home neither: a scene is the place the story is
	// happening in, and a home story has none.
	{ kind: 'act', field: ['move', 'play'], place: true, needs: ['away'], link: 'additive' },
	{ kind: 'scene', field: 'change', needs: ['away'], link: 'temporal' },
	// And somebody else is about: a passer-by, a bird on a fence.
	{
		kind: 'other',
		actor: ['creature', 'person'],
		actorThemes: ['animal', 'job', 'person'],
		field: ['move', 'express', 'wait', 'talk', 'play'],
		needs: ['away'],
		link: 'additive'
	}
];

export const SENTENCE_DATA: Record<WordLanguage, SentenceLanguageData> = {
	en: EN,
	ko: KO,
	ja: JA,
	zh: ZH,
	vi: VI,
	es: ES,
	it: IT,
	de: DE,
	ru: RU
};
