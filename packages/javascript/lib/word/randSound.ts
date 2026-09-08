import type { RandThemedWordOptions, WordDetail } from '../_types/global.js';
import { themedWord } from './wordGenerator.js';

/**
 * Sounds and voices, and the words a language has for them.
 *
 * `randWord({ theme: 'sound' })` with the theme already chosen; every other
 * option is the same.
 *
 * @example
 * randSound({ language: 'ko', count: 3 }); // ['속삭임', '함성', '바스락']
 * randSound({ language: 'en', count: 3 }); // ['Whisper', 'Chime', 'Rustle']
 */
export function randSound(options?: RandThemedWordOptions & { output?: 'value' }): string[];
/**
 * Sound words with the language and theme each one came from.
 *
 * @example
 * randSound({ language: 'ko', output: 'detail' });
 * // [{ word: '속삭임', language: 'ko', theme: 'sound' }]
 */
export function randSound(options: RandThemedWordOptions & { output: 'detail' }): WordDetail[];
export function randSound(options: RandThemedWordOptions = {}): string[] | WordDetail[] {
	return themedWord('sound', options);
}
