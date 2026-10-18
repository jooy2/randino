import {
	drawLanguage,
	resolveOptional,
	resolveRandom,
	resolveRealism
} from '../_internal/generate.js';
import { capitalizeFirst, withRandom } from '../_internal/utils.js';
import { detectLanguage } from '../_internal/script.js';
import type { RandModifierOptions, WordLanguage, WordLanguageOption } from '../_types/global.js';
import { WORD_LANGUAGE_OPTIONS, WORD_LANGUAGES } from '../word/data/index.js';
import { MODIFIER_DATA, NOUN_GENDERS } from '../word/data/modifiers/index.js';
import {
	agree,
	drawWord,
	genderOf,
	modifierFollows,
	modifierGlue,
	modifiersOf,
	poolBounds
} from '../word/wordGenerator.js';
import { firstArgument } from './attach.js';

// The Latin-script languages that carry a gender per noun, and so can answer
// whether a word is theirs in one lookup.
const INFLECTING: readonly WordLanguage[] = ['es', 'it', 'de'];

/**
 * The language a value is written in, for a caller who named none.
 *
 * The script answers it wherever the script says which: Hangul is Korean, kana
 * Japanese, han Chinese, Cyrillic Russian, and Latin with Vietnamese marks on it
 * Vietnamese. What is left is the Latin alphabet, which English, Spanish, Italian
 * and German share — so the three of those that carry a gender per noun are asked
 * whether the word is one of theirs, which is one lookup each. English is what
 * nobody claims.
 *
 * A word none of them holds and no script places is English, which is the most a
 * single word can be asked to say: `gato` is Spanish because Spanish has it, and
 * an invented Latin word is nobody's.
 */
function languageOf(value: string): WordLanguageOption {
	const byScript = detectLanguage(value);

	if (byScript !== 'en') {
		return byScript;
	}

	for (const code of INFLECTING) {
		const nouns = NOUN_GENDERS[code];

		if (nouns?.[value] || nouns?.[capitalizeFirst(value)]) {
			return code;
		}
	}

	return 'en';
}

// The modifiers alone, and the genders of the nouns where the modifier agrees with
// one: the rest of a language's nouns are no business of a decorator's. Put
// together once per language, so the caches that key on a language's data find
// it again on the next call.
const decoratorData = /*#__PURE__*/ new Map<WordLanguage, ReturnType<typeof joinData>>();

function joinData(language: WordLanguage) {
	return { ...MODIFIER_DATA[language], nounGender: NOUN_GENDERS[language] };
}

function dataOf(language: WordLanguage): ReturnType<typeof joinData> {
	let data = decoratorData.get(language);

	if (!data) {
		data = joinData(language);
		decoratorData.set(language, data);
	}

	return data;
}

/**
 * Draw one modifier, the separator to use, which side of the value it goes, and
 * the particle between them.
 */
function draw(
	value: string | undefined,
	options: RandModifierOptions
): [string, string, boolean, string] {
	// The language of the word being decorated, so that `'고양이'` is not handed
	// an English modifier. Only consulted when the caller left `language` out, or
	// named one this package does not know.
	const named = resolveOptional(options.language, WORD_LANGUAGE_OPTIONS);
	const requested = named ?? (value ? languageOf(value) : 'all');
	const language = drawLanguage(requested, WORD_LANGUAGES);
	const data = dataOf(language);
	const pool = modifiersOf(data, options.kind ?? 'all');
	const [min, max] = poolBounds(pool);
	const { word } = drawWord(data, pool, resolveRealism(options.realism), min, max, '');

	// A value the language knows is a noun whose gender it can look up, so the
	// modifier lands in the form that goes beside it. A value from anywhere else is
	// read by its ending, the way the language itself reads an unfamiliar word, and
	// a language that does not inflect has nothing to look up either way.
	const gender = value === undefined ? undefined : genderOf(data, value);
	// Chinese writes `的` after an action and nothing after an adjective, so a kind
	// left to chance is read off the word drawn. An invented word is neither, and
	// takes what an adjective takes.
	const adjectiveGlue = modifierGlue(data, 'adjective');
	const actionGlue = modifierGlue(data, 'action');
	const glue =
		adjectiveGlue === actionGlue
			? adjectiveGlue
			: options.kind === 'action' || (options.kind !== 'adjective' && data.actions.includes(word))
				? actionGlue
				: adjectiveGlue;

	return [agree(data, word, gender), options.separator ?? data.joiner, modifierFollows(data), glue];
}

/**
 * A modifier on its own — the attributive word a nickname puts in front of its
 * noun, with nothing in front of it yet.
 *
 * @example
 * randModifier({ language: 'ko' }); // '멋진'
 * randModifier({ language: 'en' }); // 'Misty'
 * randModifier({ language: 'ko', kind: 'action' }); // '웃는'
 */
export function randModifier(options?: RandModifierOptions): string;
/**
 * Puts a random modifier in front of a string: `'사자'` becomes `'멋진사자'`.
 *
 * This is what `randNickname`'s `includeModifier` used to be, and it stopped
 * being a nickname option for the same reason `randSuffix` did — decorating a
 * string was never a thing about nicknames. Give it a word from `randWord`, a
 * word of your own, or anything else you have.
 *
 * With no `language`, the script of the value picks one, so `'고양이'` is never
 * handed an English modifier.
 *
 * @example
 * randModifier('사자'); // '멋진사자'
 * randModifier('Owl', { separator: ' ' }); // 'Misty Owl'
 * randModifier(randWord({ language: 'ko', theme: 'animal' })[0]); // '조용한여우'
 */
export function randModifier(value: string, options?: RandModifierOptions): string;
/**
 * Puts a modifier in front of every string in the array — a fresh one each, not
 * one for the batch.
 *
 * @example
 * randModifier(randAnimal({ language: 'ko', count: 2 }));
 * // ['오래된곰', '영원한도마뱀']
 */
export function randModifier(value: string[], options?: RandModifierOptions): string[];
export function randModifier(
	value?: string | string[] | RandModifierOptions,
	options?: RandModifierOptions
): string | string[] {
	const { target, settings } = firstArgument<RandModifierOptions>(value, options, {});

	return withRandom(resolveRandom(settings.random), () => {
		if (target === undefined) {
			return draw(undefined, settings)[0];
		}

		const one = (item: string) => {
			const [word, separator, follows, glue] = draw(item, settings);

			// Vietnamese puts the modifier after the noun, and says so in its frames.
			// A particle attaches to the word in front of it, so a separator goes after
			// it: `沉睡的 狮子`, never `沉睡 的狮子`.
			return follows ? item + glue + separator + word : word + glue + separator + item;
		};

		return Array.isArray(target) ? target.map(one) : one(target);
	});
}
