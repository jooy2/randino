import type { NicknameDetail, RandNicknameOptions } from '../_types/global.js';
import { generateNicknameDetails } from './nicknameGenerator.js';

/**
 * Generate nicknames along with the pieces each one was built from. Takes the same
 * options as `randNickname`. Useful when you need the words on their own — to
 * highlight the base word, to group by theme, or to store the unique suffix
 * separately from the nickname.
 *
 * @example
 * randNicknameDetails({ language: 'ko', uniqueSuffix: true });
 * // [{
 * //   nickname: '멋진사자_gDe2C',
 * //   words: ['멋진', '사자'],
 * //   suffix: '_gDe2C',
 * //   language: 'ko',
 * //   theme: 'animal'
 * // }]
 */
export function randNicknameDetails(options: RandNicknameOptions = {}): NicknameDetail[] {
	return generateNicknameDetails(options);
}
