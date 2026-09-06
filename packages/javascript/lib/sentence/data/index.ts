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
	plant: 'plant',
	food: 'edible',
	drink: 'edible',
	object: 'thing',
	tool: 'thing',
	clothing: 'thing',
	product: 'thing',
	gem: 'thing',
	music: 'thing',
	vehicle: 'vehicle',
	place: 'place',
	nature: 'place',
	space: 'place',
	weather: 'event',
	sport: 'event',
	time: 'event',
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
	eat: {
		needs: ['awake', 'holding'],
		gives: ['full'],
		takes: ['hungry', 'holding'],
		after: ['hungry']
	},
	drink: {
		needs: ['awake', 'holding'],
		gives: ['full'],
		takes: ['hungry', 'holding'],
		after: ['hungry']
	},
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
 *   (`숲이 조용해졌다`), which is the one step whose subject is not the hero.
 *
 * `object`, `place` and `destination` name the story's own nouns rather than
 * themes: the `item` is one thing throughout, the `place` is where it all happens
 * and `home` is where the hero comes back to. A part the shape has room for is
 * written with that noun, and one it has no room for is left out rather than
 * drawn afresh.
 */
export type StoryStep = {
	kind: 'act' | 'state' | 'scene';
	field?: VerbField | readonly VerbField[];
	condition?: Condition;
	object?: 'item';
	place?: boolean;
	destination?: 'place' | 'home';
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
	/** Classes the thing the story is about may belong to, for a story with one. */
	item?: readonly NounClass[];
	/**
	 * The themes it may come from, when the classes are too wide: a craftsman
	 * makes a bowl and not a melody, though both are things.
	 */
	itemThemes?: readonly WordTheme[];
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
		start: ['awake', 'hungry', 'home'],
		weight: 20,
		steps: [
			{ kind: 'state', condition: 'hungry' },
			{ kind: 'act', field: 'go', destination: 'place', required: true },
			{ kind: 'act', field: 'look', object: 'item', place: true },
			{ kind: 'act', field: ['buy', 'take', 'find'], object: 'item', place: true, required: true },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{ kind: 'act', field: 'cook', object: 'item' },
			{ kind: 'act', field: ['eat', 'drink'], object: 'item', required: true, link: 'causal' },
			{ kind: 'state', condition: 'full', link: 'causal' },
			{ kind: 'act', field: ['rest', 'sleep'], link: 'temporal', kinds: ['trailing'] }
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
			{ kind: 'act', field: 'express' },
			{ kind: 'act', field: ['rest', 'sleep'], link: 'temporal', kinds: ['trailing'] }
		]
	},
	{
		name: 'search',
		hero: AGENT_CLASSES,
		item: ['thing', 'plant'],
		itemThemes: ['object', 'tool', 'clothing', 'gem', 'plant'],
		start: ['awake', 'restless', 'home'],
		weight: 16,
		steps: [
			{ kind: 'state', condition: 'restless' },
			{ kind: 'act', field: 'search', place: true, required: true },
			{ kind: 'act', field: 'wait', place: true },
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
			{ kind: 'act', field: 'rest', link: 'temporal', kinds: ['trailing'] }
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
			{ kind: 'scene', field: 'change', link: 'temporal' },
			{ kind: 'state', condition: 'tired', link: 'causal' },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{ kind: 'act', field: ['rest', 'sleep'], link: 'causal', kinds: ['trailing'] }
		]
	},
	{
		name: 'craft',
		hero: ['person'],
		item: ['thing'],
		itemThemes: ['object', 'tool', 'clothing', 'product', 'gem'],
		start: ['awake', 'rested', 'home'],
		weight: 12,
		steps: [
			{ kind: 'act', field: 'go', destination: 'place' },
			{ kind: 'act', field: 'make', object: 'item', place: true, required: true },
			{ kind: 'act', field: 'tend', object: 'item', link: 'temporal' },
			{ kind: 'act', field: 'look', object: 'item' },
			{ kind: 'act', field: ['sell', 'carry'], object: 'item', required: true, link: 'temporal' },
			{ kind: 'state', condition: 'content', link: 'causal' },
			{ kind: 'act', field: 'arrive', destination: 'home', link: 'temporal' },
			{ kind: 'act', field: 'rest', link: 'temporal', kinds: ['trailing'] }
		]
	},
	{
		name: 'stroll',
		hero: AGENT_CLASSES,
		start: ['awake', 'rested', 'home'],
		weight: 12,
		steps: [
			{ kind: 'act', field: 'go', destination: 'place', required: true },
			{ kind: 'act', field: 'move', place: true, required: true, link: 'additive' },
			{ kind: 'act', field: ['wait', 'express'], place: true },
			{ kind: 'act', field: 'play', place: true },
			{ kind: 'scene', field: 'change', link: 'temporal' },
			{ kind: 'act', field: 'think' },
			{ kind: 'state', condition: 'tired', link: 'causal' },
			{ kind: 'act', field: 'arrive', destination: 'home', required: true, link: 'temporal' },
			{ kind: 'act', field: ['rest', 'sleep'], link: 'causal', kinds: ['trailing'] }
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
	{ kind: 'act', field: 'look', object: 'item', needs: ['holding'] }
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
