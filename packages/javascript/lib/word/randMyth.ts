import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Magic and what myth is made of: spells, curses, prophecies, relics, potions
 * and the realms of myth. The creatures are `randMonster`.
 *
 * `randWord({ theme: 'myth' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randMyth({ language: 'ko', count: 3 }); // ['저주', '부적', '용궁']
 * randMyth({ language: 'en', count: 3 }); // ['Curse', 'Amulet', 'Elixir']
 */
export function randMyth(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Myth words with the language and theme each one came from.
 *
 * @example
 * randMyth({ language: 'ko', output: 'detail' });
 * // [{ word: '저주', language: 'ko', theme: 'myth' }]
 */
export function randMyth(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randMyth(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	options ??= {};

	return themedWord('myth', options);
}
