// Reads the JavaScript package's datasets and writes them in the canonical shape
// `index.mjs` compares. See `tools/parity/README.md` for what canonical means.

import {
	RAND_COUNT_MAX,
	RAND_LENGTH_MAX,
	RAND_LENGTH_MIN,
	RAND_SENTENCE_LENGTH_MAX
} from '../../packages/javascript/lib/constants.js';
import {
	AFFIX_CHARSET,
	AFFIX_LENGTH_DEFAULT,
	AFFIX_LENGTH_MAX,
	AFFIX_SEPARATOR_DEFAULT
} from '../../packages/javascript/lib/decorate/data/index.js';
import { NAME_DATA, NAME_LANGUAGES } from '../../packages/javascript/lib/name/data/index.js';
import {
	AGENT_CLASSES,
	FIELD_RULES,
	INTERLUDES,
	OPPOSITES,
	SENTENCE_DATA,
	STORIES,
	THEME_CLASS
} from '../../packages/javascript/lib/sentence/data/index.js';
import type { StoryStep } from '../../packages/javascript/lib/sentence/data/index.js';
import type {
	ModifierGroup,
	PredicateTense,
	SentenceSpeech
} from '../../packages/javascript/lib/sentence/data/types.js';
import { KO_SURNAME_ROMAN } from '../../packages/javascript/lib/name/data/ko.js';
import {
	LOOSE_THEMES,
	WORD_DATA,
	WORD_LANGUAGES,
	WORD_THEMES
} from '../../packages/javascript/lib/word/data/index.js';

type Entry = string | { n: string; r: string };

const pool = (source: readonly Entry[] | undefined) =>
	source === undefined
		? null
		: source.map((entry) =>
				typeof entry === 'string' ? { n: entry, r: null } : { n: entry.n, r: entry.r }
			);

const list = (source: readonly string[] | undefined) => (source === undefined ? null : [...source]);

/** A first or second person in the canonical shape, with an empty map for no heads. */
const speech = (person: SentenceSpeech | undefined) =>
	person ? { subject: person.subject, head: person.head ?? '', heads: person.heads ?? {} } : null;

// Optional in one package and defaulted in another; written as a map of lists
// either way, so the shapes compare.
const forms = (source: Readonly<Record<string, readonly string[]>> | undefined) =>
	Object.fromEntries(Object.entries(source ?? {}).map(([key, pool]) => [key, [...pool]]));

const map = (source: Readonly<Record<string | number, unknown>> | undefined) =>
	source === undefined
		? null
		: Object.fromEntries(Object.entries(source).map(([key, value]) => [String(key), value]));

// A predicate's past forms, or null where the language's predicate does not change.
const tense = (source: PredicateTense | undefined) =>
	source === undefined ? null : { words: list(source.words), forms: forms(source.forms) };

// A group of modifiers or manners, narrowed by class and optionally by theme.
const groups = (source: readonly ModifierGroup[]) =>
	source.map((group) => ({
		subject: [...group.subject],
		themes: list(group.themes),
		words: list(group.words)
	}));

const rules = (
	source: Readonly<Record<string, readonly (readonly string[])[] | undefined>> | undefined
) =>
	source === undefined
		? null
		: Object.fromEntries(
				Object.entries(source).map(([gender, list]) => [
					gender,
					(list ?? []).map((rule) => [...rule])
				])
			);

// A story step. `field` is one or several in this package and always a list in the
// other two; `object` is a role name here and a flag there.
const step = (source: StoryStep) => ({
	kind: source.kind,
	fields:
		source.field === undefined
			? []
			: typeof source.field === 'string'
				? [source.field]
				: [...source.field],
	condition: source.condition ?? '',
	object: source.object ?? '',
	place: source.place ?? false,
	destination: source.destination ?? '',
	needs: [...(source.needs ?? [])],
	required: source.required ?? false,
	link: source.link ?? '',
	kinds: [...(source.kinds ?? [])],
	// Who an `other` step is about: the item, or the classes listed — one field
	// here and two in the ports, written as two everywhere.
	actor: source.actor === 'item' ? 'item' : '',
	actorClasses: Array.isArray(source.actor) ? [...source.actor] : [],
	actorThemes: list(source.actorThemes)
});

console.log(
	JSON.stringify({
		constants: {
			randCountMax: RAND_COUNT_MAX,
			randLengthMin: RAND_LENGTH_MIN,
			randLengthMax: RAND_LENGTH_MAX,
			randSentenceLengthMax: RAND_SENTENCE_LENGTH_MAX,
			affixLengthDefault: AFFIX_LENGTH_DEFAULT,
			affixLengthMax: AFFIX_LENGTH_MAX,
			affixSeparatorDefault: AFFIX_SEPARATOR_DEFAULT,
			affixCharset: AFFIX_CHARSET
		},
		word: {
			languages: [...WORD_LANGUAGES],
			themes: [...WORD_THEMES],
			looseThemes: [...LOOSE_THEMES],
			data: Object.fromEntries(
				Object.entries(WORD_DATA).map(([code, data]) => [
					code,
					{
						joiner: data.joiner,
						capitalize: data.capitalize,
						adjectives: list(data.adjectives),
						actions: list(data.actions),
						parts: list(data.parts),
						nounGender: map(data.nounGender),
						genderRules: data.genderRules ? data.genderRules.map((rule) => [...rule]) : null,
						agreement: data.agreement
							? Object.fromEntries(
									Object.entries(data.agreement).map(([gender, rules]) => [
										gender,
										(rules ?? []).map((rule) => [...rule])
									])
								)
							: null,
						frames: data.frames.map((frame) => ({
							slots: [...frame.slots],
							// Optional in one package and defaulted in another; written as a
							// list either way so the shapes compare.
							glue: [...(frame.glue ?? [])],
							weight: frame.weight
						})),
						nouns: Object.fromEntries(
							Object.entries(data.nouns).map(([theme, words]) => [theme, list(words)])
						),
						syn:
							data.syn.kind === 'syllable'
								? {
										kind: 'syllable',
										onset: list(data.syn.onset),
										vowel: list(data.syn.vowel),
										coda: list(data.syn.coda),
										minSyllables: data.syn.minSyllables,
										maxSyllables: data.syn.maxSyllables
									}
								: {
										kind: 'pool',
										pool: list(data.syn.pool),
										minSyllables: data.syn.minSyllables,
										maxSyllables: data.syn.maxSyllables
									}
					}
				])
			)
		},
		sentence: {
			themeClass: map(THEME_CLASS),
			agentClasses: [...AGENT_CLASSES],
			fieldRules: Object.fromEntries(
				Object.entries(FIELD_RULES).map(([field, rule]) => [
					field,
					{
						needs: [...(rule.needs ?? [])],
						gives: [...(rule.gives ?? [])],
						takes: [...(rule.takes ?? [])],
						after: [...(rule.after ?? [])]
					}
				])
			),
			opposites: map(OPPOSITES),
			stories: STORIES.map((story) => ({
				name: story.name,
				hero: [...story.hero],
				item: list(story.item),
				itemThemes: list(story.itemThemes),
				prop: list(story.prop),
				propThemes: list(story.propThemes),
				heroThemes: list(story.heroThemes),
				lines: story.lines ?? 0,
				start: [...story.start],
				steps: story.steps.map(step),
				weight: story.weight
			})),
			interludes: INTERLUDES.map(step),
			data: Object.fromEntries(
				Object.entries(SENTENCE_DATA).map(([code, data]) => [
					code,
					{
						space: data.space,
						capitalize: data.capitalize,
						terminators: map(data.terminators),
						// Optional in one package and defaulted in another; written as a
						// map either way so the shapes compare.
						openers: map(data.openers ?? {}),
						quotes: Object.fromEntries(
							Object.entries(data.quotes).map(([kind, pair]) => [kind, [...pair]])
						),
						// Optional in one package and defaulted in another; written the same
						// way here either way, so the shapes compare.
						predicateAgrees: data.predicateAgrees ?? false,
						pastAgreement: rules(data.pastAgreement),
						pastMark: data.pastMark
							? { head: data.pastMark.head ?? '', tail: data.pastMark.tail ?? '' }
							: null,
						join: data.join ? { form: data.join.form ?? '', word: data.join.word ?? '' } : null,
						articles: rules(data.articles),
						verbs: data.verbs.map((group) => ({
							subject: [...group.subject],
							object: list(group.object),
							field: group.field,
							subjectThemes: list(group.subjectThemes),
							subjectTraits: list(group.subjectTraits),
							subjectWithout: list(group.subjectWithout),
							objectThemes: list(group.objectThemes),
							objectTraits: list(group.objectTraits),
							objectWithout: list(group.objectWithout),
							requires: group.requires ?? '',
							condition: group.condition ?? '',
							words: list(group.words),
							forms: forms(group.forms),
							past: tense(group.past)
						})),
						states: data.states.map((group) => ({
							subject: [...group.subject],
							subjectThemes: list(group.subjectThemes),
							condition: group.condition ?? '',
							head: group.head ?? '',
							pastHead: group.pastHead ?? '',
							words: list(group.words),
							forms: forms(group.forms),
							past: tense(group.past)
						})),
						modifiers: groups(data.modifiers),
						manners: groups(data.manners),
						times: {
							day: list(data.times.day),
							any: list(data.times.any),
							past: list(data.times.past),
							present: list(data.times.present),
							habitual: list(data.times.habitual)
						},
						homes: list(data.homes),
						replies: data.replies
							? Object.fromEntries(
									Object.entries(data.replies).map(([level, pools]) => [
										level,
										Object.fromEntries(
											Object.entries(pools ?? {}).map(([cue, pool]) => [cue, list(pool)])
										)
									])
								)
							: null,
						degrees: list(data.degrees),
						connectives: Object.fromEntries(
							Object.entries(data.connectives).map(([kind, pool]) => [kind, list(pool)])
						),
						traits: data.traits
							? Object.fromEntries(
									Object.entries(data.traits).map(([trait, pool]) => [trait, list(pool)])
								)
							: null,
						interjections: list(data.interjections),
						pronouns: Object.fromEntries(
							Object.entries(data.pronouns).map(([gender, pool]) => [gender, list(pool)])
						),
						// Optional in one package and defaulted in another; written as a list
						// either way so the shapes compare.
						pronounless: [...(data.pronounless ?? [])],
						objectPronouns: data.objectPronouns
							? {
									words: Object.fromEntries(
										Object.entries(data.objectPronouns.words).map(([gender, pool]) => [
											gender,
											list(pool)
										])
									),
									clitic: data.objectPronouns.clitic ?? false
								}
							: null,
						speech: speech(data.speech),
						listener: speech(data.listener),
						homecomings: data.homecomings
							? Object.fromEntries(
									Object.entries(data.homecomings).map(([level, pool]) => [level, list(pool)])
								)
							: null,
						placeHeads: data.placeHeads
							? Object.fromEntries(
									Object.entries(data.placeHeads).map(([head, pool]) => [head, list(pool)])
								)
							: null,
						numeral: data.numeral
							? {
									order: data.numeral.order,
									counters: map(data.numeral.counters),
									count: [...data.numeral.count],
									currency: data.numeral.currency,
									amounts: [...data.numeral.amounts],
									group: data.numeral.group,
									gap: data.numeral.gap
								}
							: null,
						calendar: data.calendar
							? {
									date: data.calendar.date,
									months: list(data.calendar.months),
									clock: data.calendar.clock,
									years: [...data.calendar.years],
									copula: {
										subject: [...data.calendar.copula.subject],
										words: list(data.calendar.copula.words),
										forms: forms(data.calendar.copula.forms),
										past: tense(data.calendar.copula.past)
									}
								}
							: null,
						frames: data.frames.map((frame) => ({
							parts: frame.parts.map((part) => ({
								slot: part.slot,
								head: part.head ?? '',
								pastHead: part.pastHead ?? '',
								tail: part.tail ?? '',
								tailAlt: part.tailAlt ?? '',
								tailLiquid: part.tailLiquid ?? '',
								modifiable: part.modifiable ?? false,
								bare: part.bare ?? false,
								copula: part.copula ?? ''
							})),
							weight: frame.weight,
							mood: frame.mood ?? 'statement',
							tag: frame.tag ?? '',
							fields: list(frame.fields)
						}))
					}
				])
			)
		},
		name: {
			languages: [...NAME_LANGUAGES],
			koSurnameRoman: map(KO_SURNAME_ROMAN),
			data: Object.fromEntries(
				Object.entries(NAME_DATA).map(([code, data]) => [
					code,
					{
						order: data.order,
						joiner: data.joiner,
						hasMiddle: data.hasMiddle,
						roman: data.roman,
						lengthSpec: {
							given: [...data.lengthSpec.given],
							last: [...data.lengthSpec.last],
							middle: [...data.lengthSpec.middle]
						},
						last: pool(data.last),
						lastWeights: map(data.lastWeights),
						male: pool(data.male),
						female: pool(data.female),
						middleMale: pool(data.middleMale),
						middleFemale: pool(data.middleFemale),
						givenMale: pool(data.givenMale),
						givenFemale: pool(data.givenFemale),
						givenLenWeights: map(data.givenLenWeights),
						firstMale: pool(data.firstMale),
						restMale: pool(data.restMale),
						firstFemale: pool(data.firstFemale),
						restFemale: pool(data.restFemale),
						syn: data.syn
							? {
									onset: list(data.syn.onset),
									vowel: list(data.syn.vowel),
									coda: list(data.syn.coda),
									minSyllables: data.syn.minSyllables,
									maxSyllables: data.syn.maxSyllables
								}
							: null
					}
				])
			)
		}
	})
);
