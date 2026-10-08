// Reads the JavaScript package's datasets and writes them in the canonical shape
// `index.mjs` compares. See `tools/parity/README.md` for what canonical means.

import {
	AGE_BANDS,
	AGE_CURVE,
	AGE_GROUPS,
	AGE_MAX_DEFAULT
} from '../../packages/javascript/lib/age/data/index.js';
import { APP_STORES } from '../../packages/javascript/lib/appstore/data/index.js';
import {
	ARCHITECTURES,
	ARCHITECTURE_DATA
} from '../../packages/javascript/lib/architecture/data/index.js';
import {
	RAND_AGE_MAX,
	RAND_COUNT_MAX,
	RAND_LENGTH_MAX,
	RAND_LENGTH_MIN,
	RAND_LOCATION_LENGTH_MAX,
	RAND_ORGANIZATION_LENGTH_MAX,
	RAND_SENTENCE_LENGTH_MAX,
	SYSTEM_PLATFORMS
} from '../../packages/javascript/lib/constants.js';
import {
	DATE_CEILING,
	DATE_FLOOR,
	DATE_FORMAT_DEFAULT,
	DATE_MAX_DEFAULT,
	DATE_MIN_DEFAULT,
	DATE_NAMES,
	DATE_UNITS
} from '../../packages/javascript/lib/date/data/index.js';
import { outline } from '../../packages/javascript/lib/_internal/parse.js';
import {
	AFFIX_CHARSET,
	AFFIX_LENGTH_DEFAULT,
	AFFIX_LENGTH_MAX,
	AFFIX_SEPARATOR_DEFAULT
} from '../../packages/javascript/lib/decorate/data/index.js';
import { CPUS } from '../../packages/javascript/lib/cpu/data/index.js';
import { DEVICES, DEVICE_TYPES } from '../../packages/javascript/lib/device/data/index.js';
import {
	DISK_SCALE,
	DISK_TYPES,
	DISK_TYPE_LABELS,
	DISK_TYPE_WEIGHTS
} from '../../packages/javascript/lib/disk/data/index.js';
import { GPUS } from '../../packages/javascript/lib/gpu/data/index.js';
import {
	GENDER_CODES,
	GENDER_LABELS,
	GENDER_WEIGHTS
} from '../../packages/javascript/lib/gender/data/index.js';
import { COUNTRIES } from '../../packages/javascript/lib/location/data/countries.js';
import {
	LOCATION_DATA,
	LOCATION_LANGUAGES,
	LOCATION_LEVELS
} from '../../packages/javascript/lib/location/data/index.js';
import { NAME_DATA, NAME_LANGUAGES } from '../../packages/javascript/lib/name/data/index.js';
import {
	ORGANIZATION_BARE_CHANCE,
	ORGANIZATION_DATA,
	ORGANIZATION_GENERIC_CHANCE,
	ORGANIZATION_INDUSTRIES,
	ORGANIZATION_LEGAL_FORM_CHANCE,
	ORGANIZATION_TYPE_WEIGHTS,
	ORGANIZATION_TYPES
} from '../../packages/javascript/lib/organization/data/index.js';
import { OS_FAMILIES, OS_RELEASES } from '../../packages/javascript/lib/os/data/index.js';
import { RAM_SCALE } from '../../packages/javascript/lib/ram/data/index.js';
import {
	RESOLUTIONS,
	RESOLUTION_SEPARATOR_DEFAULT
} from '../../packages/javascript/lib/resolution/data/index.js';
import {
	CALVER_SCHEMES,
	VERSION_FORMATS,
	VERSION_PARTS,
	VERSION_PRERELEASES,
	VERSION_PRERELEASE_CHANCE,
	VERSION_YEAR_CEILING,
	VERSION_YEAR_FLOOR,
	VERSION_YEAR_MAX_DEFAULT,
	VERSION_YEAR_MIN_DEFAULT
} from '../../packages/javascript/lib/version/data/index.js';
import {
	PHONE_COUNTRIES,
	PHONE_DATA,
	PHONE_TYPES
} from '../../packages/javascript/lib/phone/data/index.js';
import {
	AGENT_CLASSES,
	FIELD_RULES,
	INTERLUDES,
	OPPOSITES,
	SENTENCE_DATA,
	STORIES,
	THEME_CLASS
} from '../../packages/javascript/lib/sentence/data/index.js';
import type { PhoneShape } from '../../packages/javascript/lib/phone/data/index.js';
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

// A phone plan per type, every optional field of a shape written out.
const phonePlans = (plans: Readonly<Record<string, readonly PhoneShape[]>>) =>
	Object.fromEntries(
		PHONE_TYPES.map((type) => [
			type,
			plans[type].map((shape) => ({
				prefixes: [...shape.prefixes],
				lead: shape.lead ?? '',
				groups: [...shape.groups],
				avoid: [...(shape.avoid ?? [])],
				trunk: shape.trunk ?? null
			}))
		])
	);

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
		fields: list(group.fields),
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
			randLocationLengthMax: RAND_LOCATION_LENGTH_MAX,
			randAgeMax: RAND_AGE_MAX,
			randOrganizationLengthMax: RAND_ORGANIZATION_LENGTH_MAX,
			affixLengthDefault: AFFIX_LENGTH_DEFAULT,
			affixLengthMax: AFFIX_LENGTH_MAX,
			affixSeparatorDefault: AFFIX_SEPARATOR_DEFAULT,
			affixCharset: AFFIX_CHARSET,
			systemPlatforms: [...SYSTEM_PLATFORMS]
		},
		// Each band and each point of the curve is a pair, written as a two-entry list
		// in all three — a tuple in Python and a record in Dart.
		age: {
			groups: [...AGE_GROUPS],
			bands: Object.fromEntries(AGE_GROUPS.map((group) => [group, [...AGE_BANDS[group]]])),
			curve: AGE_CURVE.map(([age, weight]) => [age, weight]),
			maxDefault: AGE_MAX_DEFAULT
		},
		date: {
			units: [...DATE_UNITS],
			floor: DATE_FLOOR,
			ceiling: DATE_CEILING,
			minDefault: DATE_MIN_DEFAULT,
			maxDefault: DATE_MAX_DEFAULT,
			formatDefault: DATE_FORMAT_DEFAULT,
			names: Object.fromEntries(
				Object.entries(DATE_NAMES).map(([code, names]) => [
					code,
					{
						months: [...names.months],
						monthsShort: [...names.monthsShort],
						weekdays: [...names.weekdays],
						weekdaysShort: [...names.weekdaysShort],
						meridiem: [...names.meridiem],
						meridiemLower: [...names.meridiemLower]
					}
				])
			)
		},
		// A synthesis carries its `kind` tag, and a language without places or numbers
		// writes them as null, the way every other optional field is written.
		organization: {
			types: [...ORGANIZATION_TYPES],
			industries: [...ORGANIZATION_INDUSTRIES],
			typeWeights: { ...ORGANIZATION_TYPE_WEIGHTS },
			bareChance: ORGANIZATION_BARE_CHANCE,
			genericChance: ORGANIZATION_GENERIC_CHANCE,
			legalFormChance: ORGANIZATION_LEGAL_FORM_CHANCE,
			data: Object.fromEntries(
				Object.entries(ORGANIZATION_DATA).map(([code, data]) => [
					code,
					{
						stems: [...data.stems],
						syn:
							data.syn.kind === 'pool'
								? {
										kind: 'pool',
										pool: [...data.syn.pool],
										joiner: data.syn.joiner,
										minSyllables: data.syn.minSyllables,
										maxSyllables: data.syn.maxSyllables
									}
								: {
										kind: 'syllable',
										onset: [...data.syn.onset],
										vowel: [...data.syn.vowel],
										coda: [...data.syn.coda],
										minSyllables: data.syn.minSyllables,
										maxSyllables: data.syn.maxSyllables
									},
						places: list(data.places),
						numbers: data.numbers ? [...data.numbers] : null,
						industries: Object.fromEntries(
							ORGANIZATION_INDUSTRIES.map((each) => [each, [...data.industries[each]]])
						),
						generic: [...data.generic],
						templates: Object.fromEntries(
							ORGANIZATION_TYPES.map((type) => [type, [...data.templates[type]]])
						),
						legalForms: [...data.legalForms]
					}
				])
			)
		},
		// A shape's optional fields are written out, so a lead, an avoid list or a
		// trunk one package leaves unset and another sets shows up as a difference.
		phone: {
			countries: [...PHONE_COUNTRIES],
			types: [...PHONE_TYPES],
			data: Object.fromEntries(
				PHONE_COUNTRIES.map((code) => {
					const data = PHONE_DATA[code];

					return [
						code,
						{
							callingCode: data.callingCode,
							trunk: data.trunk,
							national: data.national,
							international: data.international,
							plans: phonePlans(data.plans),
							fiction: data.fiction ? phonePlans(data.fiction) : null
						}
					];
				})
			)
		},
		gender: {
			codes: [...GENDER_CODES],
			weights: { ...GENDER_WEIGHTS },
			labels: GENDER_LABELS
		},
		architecture: {
			architectures: [...ARCHITECTURES],
			data: ARCHITECTURE_DATA
		},
		// One entry per screen size, keyed by its platform and the size itself.
		resolution: {
			separator: RESOLUTION_SEPARATOR_DEFAULT,
			sizes: Object.fromEntries(
				RESOLUTIONS.map((entry) => [
					`${entry.platform} ${entry.width}x${entry.height}`,
					entry.weight
				])
			)
		},
		// One entry per store, keyed by its platform and its own name.
		appStore: Object.fromEntries(
			APP_STORES.map((entry) => [
				`${entry.platform} ${entry.name}`,
				{ weight: entry.weight, company: entry.company, full: entry.full }
			])
		),
		version: {
			formats: [...VERSION_FORMATS],
			parts: VERSION_PARTS,
			prereleases: VERSION_PRERELEASES,
			prereleaseChance: VERSION_PRERELEASE_CHANCE,
			calverSchemes: Object.fromEntries(CALVER_SCHEMES.map((each) => [each.scheme, each.weight])),
			years: {
				minDefault: VERSION_YEAR_MIN_DEFAULT,
				maxDefault: VERSION_YEAR_MAX_DEFAULT,
				floor: VERSION_YEAR_FLOOR,
				ceiling: VERSION_YEAR_CEILING
			}
		},
		// One entry per processor, keyed by its maker and model, the way the devices are.
		cpu: Object.fromEntries(
			CPUS.map((entry) => [
				`${entry.vendor} ${entry.model}`,
				{ platform: entry.platform, year: entry.year }
			])
		),
		// One entry per graphics processor, keyed the same way.
		gpu: Object.fromEntries(
			GPUS.map((entry) => [
				`${entry.vendor} ${entry.model}`,
				{ platform: entry.platform, year: entry.year }
			])
		),
		// One entry per device, keyed by its maker and model, so a device one package
		// holds and another does not is reported as itself.
		device: {
			types: [...DEVICE_TYPES],
			devices: Object.fromEntries(
				DEVICES.map((entry) => [
					`${entry.vendor} ${entry.model}`,
					{ type: entry.type, year: entry.year }
				])
			)
		},
		disk: {
			types: [...DISK_TYPES],
			labels: DISK_TYPE_LABELS,
			weights: DISK_TYPE_WEIGHTS,
			scale: {
				units: [...DISK_SCALE.units],
				step: DISK_SCALE.step,
				base: DISK_SCALE.base,
				reference: DISK_SCALE.reference,
				bytes: DISK_SCALE.bytes,
				pool: DISK_SCALE.pool.map(([size, weight]) => [size, weight])
			}
		},
		// The scale and the pool as written: every size with its weight, in the unit
		// the pool is kept in.
		ram: {
			units: [...RAM_SCALE.units],
			step: RAM_SCALE.step,
			base: RAM_SCALE.base,
			reference: RAM_SCALE.reference,
			bytes: RAM_SCALE.bytes,
			pool: RAM_SCALE.pool.map(([size, weight]) => [size, weight])
		},
		// One entry per release, keyed by its line and version, so a release one
		// package holds and another does not is reported as itself. A build is
		// `year text`, the way the table groups them.
		os: {
			families: OS_FAMILIES,
			releases: Object.fromEntries(
				OS_RELEASES.map((release) => [
					`${release.family} ${release.version}`,
					{
						year: release.year,
						template: release.template,
						name: release.name,
						editions: [...release.editions],
						builds: release.builds.map((build) => `${build.year} ${build.text}`)
					}
				])
			)
		},
		// The outline is compared as each package parses it rather than as the text
		// it is written in, so a parser that reads `_` or a skipped level differently
		// shows up here even though the three strings are the same generated text.
		location: {
			languages: [...LOCATION_LANGUAGES],
			levels: [...LOCATION_LEVELS],
			// One row per country, `[code, name, name, …]`, split the way the package splits it.
			countries: {
				languages: [...COUNTRIES.languages],
				rows: COUNTRIES.table
					.split('\n')
					.map((line) => line.trim())
					.filter(Boolean)
					.map((line) => line.split('|'))
			},
			data: Object.fromEntries(
				Object.entries(LOCATION_DATA).map(([code, data]) => [
					code,
					{
						country: data.country,
						order: data.order,
						joiner: data.joiner,
						levels: [...data.levels],
						entries: outline(data.outline, data.levels.length).map((entry) => ({
							path: [...entry.path],
							depth: entry.depth,
							below: entry.below
						}))
					}
				])
			)
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
						levels: { basic: list(data.levels.basic), rare: list(data.levels.rare) },
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
