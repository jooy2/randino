import type { NicknameDetail, RandNicknameOptions } from '../_types/global.js';
import { generateNicknameDetails } from './nicknameGenerator.js';

/**
 * Generate nicknames — the kind of handle someone would pick for a game or a
 * website. Each one is an everyday word (an animal, a thing, something in nature,
 * an idea) with a modifier in front of it or a second word behind it. Person
 * names are never used.
 *
 * @example
 * randNickname({ language: 'ko', count: 3 });
 * // ['멋진사자', '파란물병', '고양이꼬리']
 * randNickname({ language: 'en' });
 * // ['MistyOwl']
 * randSuffix(randNickname({ language: 'ko', count: 2 }));
 * // ['달리는표범_gDe2C', '조용한노을_nVtRC']
 * randNickname({ language: 'ko', wordSeparator: ' ', count: 2 });
 * // ['멋진 사자', '고양이 꼬리']
 * randNickname({ baseWord: '고양이', count: 3 });
 * // ['멋진고양이', '고양이발바닥', '파란고양이꼬리']
 */
export function randNickname(options?: RandNicknameOptions & { output?: 'value' }): string[];
/**
 * Generate nicknames along with the pieces each one was built from.
 *
 * `output: 'detail'` returns a `NicknameDetail` per nickname instead of a
 * string — the words in order, the language and the theme. Useful when you need
 * the words on their own, to highlight the base word or to group by theme.
 *
 * @example
 * randNickname({ language: 'ko', output: 'detail' });
 * // [{
 * //   nickname: '멋진사자',
 * //   words: ['멋진', '사자'],
 * //   language: 'ko',
 * //   theme: 'animal'
 * // }]
 */
export function randNickname(options: RandNicknameOptions & { output: 'detail' }): NicknameDetail[];
export function randNickname(options: RandNicknameOptions = {}): string[] | NicknameDetail[] {
	const details = generateNicknameDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.nickname);
}
