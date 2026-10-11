import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Creatures of myth, folklore and fantasy: dragons and fairies, ghosts and
 * the undead, gods, giants and aliens — every being that is no animal and no
 * person.
 *
 * `randWord({ theme: 'monster' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randMonster({ language: 'ko', count: 3 }); // ['도깨비', '구미호', '슬라임']
 * randMonster({ language: 'en', count: 3 }); // ['Dragon', 'Vampire', 'Golem']
 */
export function randMonster(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Monster words with the language and theme each one came from.
 *
 * @example
 * randMonster({ language: 'ko', output: 'detail' });
 * // [{ word: '도깨비', language: 'ko', theme: 'monster' }]
 */
export function randMonster(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randMonster(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	options ??= {};

	return themedWord('monster', options);
}
