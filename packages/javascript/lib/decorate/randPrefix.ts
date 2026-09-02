import type { RandAffixOptions } from '../_types/global.js';
import { attach } from './attach.js';

/**
 * A random token on its own — the same one `randSuffix` hands back with no
 * value, since which side it would have landed on is not decided yet.
 *
 * @example
 * randPrefix(); // 'nVtRC'
 * randPrefix({ length: 4, charset: '0123456789' }); // '4021'
 */
export function randPrefix(options?: RandAffixOptions): string;
/**
 * Prepends a random token to a string. The mirror of `randSuffix`, for the
 * places where the distinguishing part belongs in front — a shard, a tenant, a
 * sortable-by-nothing key.
 *
 * @example
 * randPrefix('멋진사자'); // 'nVtRC_멋진사자'
 * randPrefix('order', { length: 4, separator: '-' }); // 'k3Rm-order'
 */
export function randPrefix(value: string, options?: RandAffixOptions): string;
/**
 * Prepends a random token to every string in the array — a fresh one each, not
 * one for the batch.
 *
 * @example
 * randPrefix(randNickname({ language: 'en', count: 2 }));
 * // ['AVcCV_MistyOwl', 'RUKAP_RustyBoot']
 */
export function randPrefix(value: string[], options?: RandAffixOptions): string[];
export function randPrefix(
	value?: string | string[] | RandAffixOptions,
	options?: RandAffixOptions
): string | string[] {
	return attach(value, options, (item, token, separator) => token + separator + item);
}
