import type { RandAffixOptions } from '../_types/global.js';
import { attach } from './attach.js';

/**
 * A random token on its own, with nothing to attach it to.
 *
 * @example
 * randSuffix(); // 'nVtRC'
 * randSuffix({ length: 8 }); // 'k3Rm9dQx'
 */
export function randSuffix(options?: RandAffixOptions): string;
/**
 * Appends a random token to a string, so that two people asking for the same
 * nickname at the same moment are very unlikely to walk away with the same one.
 *
 * **Not for anything that has to be unguessable.** The token comes from
 * `Math.random`, which is not a cryptographically secure source: its state can
 * be recovered from a handful of outputs, so the tokens that follow can be
 * worked out. Nor is it collision-free — five characters of the default charset
 * is 601,692,057 tokens, and a collision becomes likely somewhere around thirty
 * thousand of them. Use `crypto.getRandomValues` for a session token, an invite
 * code or a key nobody may enumerate, and a database constraint where a value
 * has to be unique with certainty.
 *
 * @example
 * randSuffix('멋진사자'); // '멋진사자_nVtRC'
 * randSuffix('MistyOwl', { length: 8, separator: '-' }); // 'MistyOwl-k3Rm9dQx'
 */
export function randSuffix(value: string, options?: RandAffixOptions): string;
/**
 * Appends a random token to every string in the array — a fresh one each, not
 * one for the batch, which is what a generator's output is usually passed here
 * for.
 *
 * @example
 * randSuffix(randNickname({ language: 'ko', count: 2 }));
 * // ['오래된곰_AVcCV', '영원한도마뱀_RUKAP']
 */
export function randSuffix(value: string[], options?: RandAffixOptions): string[];
export function randSuffix(
	value?: string | string[] | RandAffixOptions,
	options?: RandAffixOptions
): string | string[] {
	return attach(value, options, (item, token, separator) => item + separator + token);
}
