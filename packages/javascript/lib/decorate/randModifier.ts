import { drawLanguage, resolveRealism } from '../_internal/generate.js';
import { detectLanguage } from '../_internal/script.js';
import type { RandModifierOptions } from '../_types/global.js';
import { WORD_DATA, WORD_LANGUAGES } from '../word/data/index.js';
import { drawWord, modifierFollows, modifiersOf, poolBounds } from '../word/wordGenerator.js';
import { firstArgument } from './attach.js';

/** Draw one modifier, the separator to use, and which side of the value it goes. */
function draw(value: string | undefined, options: RandModifierOptions): [string, string, boolean] {
	// The language of the word being decorated, so that `'고양이'` is not handed
	// an English modifier. Only consulted when the caller left `language` out.
	const requested = options.language ?? (value ? detectLanguage(value) : 'all');
	const language = drawLanguage(requested, WORD_LANGUAGES);
	const data = WORD_DATA[language];
	const pool = modifiersOf(data);
	const [min, max] = poolBounds(pool);
	const { word } = drawWord(data, pool, resolveRealism(options.realism), min, max, '');

	return [word, options.separator ?? data.joiner, modifierFollows(data)];
}

/**
 * A modifier on its own — the attributive word a nickname puts in front of its
 * noun, with nothing in front of it yet.
 *
 * @example
 * randModifier({ language: 'ko' }); // '멋진'
 * randModifier({ language: 'en' }); // 'Misty'
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

	if (target === undefined) {
		return draw(undefined, settings)[0];
	}

	const one = (item: string) => {
		const [word, separator, follows] = draw(item, settings);

		// Vietnamese puts the modifier after the noun, and says so in its frames.
		return follows ? item + separator + word : word + separator + item;
	};

	return Array.isArray(target) ? target.map(one) : one(target);
}
