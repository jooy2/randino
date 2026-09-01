import type { NicknameDetail, RandNicknameOptions } from '../_types/global.js';
import { generateNicknameDetails } from './nicknameGenerator.js';

/**
 * Generate nicknames along with the pieces each one was built from. Takes the same
 * options as `randNickname`. Useful when you need the words on their own — to
 * highlight the base word, or to group by theme.
 *
 * @example
 * randNicknameDetails({ language: 'ko' });
 * // [{
 * //   nickname: '멋진사자',
 * //   words: ['멋진', '사자'],
 * //   language: 'ko',
 * //   theme: 'animal'
 * // }]
 */
export function randNicknameDetails(options: RandNicknameOptions = {}): NicknameDetail[] {
	return generateNicknameDetails(options);
}
