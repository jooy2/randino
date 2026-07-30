import type { RandomNicknameOptions } from '../_types/global.js';
import { generateNicknameDetails } from './nicknameGenerator.js';

/**
 * Generate nicknames — the kind of handle someone would pick for a game or a
 * website. Each one is an everyday word (an animal, a thing, something in nature,
 * an idea) with a modifier in front of it or a second word behind it. Person
 * names are never used.
 *
 * @example
 * randomNickname({ language: 'ko', count: 3 });
 * // ['멋진사자', '파란물병', '고양이꼬리']
 * randomNickname({ language: 'en' });
 * // ['MistyOwl']
 * randomNickname({ language: 'ko', uniqueSuffix: true, count: 2 });
 * // ['달리는표범_gDe2C', '조용한노을_nVtRC']
 * randomNickname({ baseWord: '고양이', count: 3 });
 * // ['멋진고양이', '고양이발바닥', '파란고양이꼬리']
 */
export function randomNickname(options: RandomNicknameOptions = {}): string[] {
	return generateNicknameDetails(options).map((detail) => detail.nickname);
}
