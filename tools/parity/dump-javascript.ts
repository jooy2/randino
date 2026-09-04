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
	SENTENCE_DATA,
	THEME_CLASS
} from '../../packages/javascript/lib/sentence/data/index.js';
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

const map = (source: Readonly<Record<string | number, unknown>> | undefined) =>
	source === undefined
		? null
		: Object.fromEntries(Object.entries(source).map(([key, value]) => [String(key), value]));

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
						genderRules: data.genderRules
							? data.genderRules.map((rule) => [...rule])
							: null,
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
			data: Object.fromEntries(
				Object.entries(SENTENCE_DATA).map(([code, data]) => [
					code,
					{
						space: data.space,
						capitalize: data.capitalize,
						terminator: data.terminator,
						// Optional in one package and defaulted in another; written the same
						// way here either way, so the shapes compare.
						predicateAgrees: data.predicateAgrees ?? false,
						articles: data.articles
							? Object.fromEntries(
									Object.entries(data.articles).map(([gender, rules]) => [
										gender,
										(rules ?? []).map((rule) => [...rule])
									])
								)
							: null,
						verbs: data.verbs.map((group) => ({
							subject: [...group.subject],
							object: list(group.object),
							words: list(group.words)
						})),
						states: data.states.map((group) => ({
							subject: [...group.subject],
							words: list(group.words)
						})),
						manners: list(data.manners),
						times: list(data.times),
						frames: data.frames.map((frame) => ({
							parts: frame.parts.map((part) => ({
								slot: part.slot,
								head: part.head ?? '',
								tail: part.tail ?? '',
								tailAlt: part.tailAlt ?? '',
								modifiable: part.modifiable ?? false,
								bare: part.bare ?? false
							})),
							weight: frame.weight
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
