// Shared by `randSuffix` and `randPrefix`. Internal — the two of them differ by
// one line, which is the side the token lands on.

import { clamp, randToken } from '../_internal/utils.js';
import type { RandAffixOptions } from '../_types/global.js';
import {
	AFFIX_CHARSET,
	AFFIX_LENGTH_DEFAULT,
	AFFIX_LENGTH_MAX,
	AFFIX_SEPARATOR_DEFAULT
} from './data/index.js';

/**
 * Attaches a **freshly drawn** token to one string, or to every string in an
 * array — one token each rather than one for the batch, which is the whole
 * point of passing a generator's output here.
 */
export function attach(
	value: string | string[],
	options: RandAffixOptions,
	join: (value: string, token: string, separator: string) => string
): string | string[] {
	const length = clamp(Math.floor(options.length ?? AFFIX_LENGTH_DEFAULT), 1, AFFIX_LENGTH_MAX);
	const charset = options.charset || AFFIX_CHARSET;
	const separator = options.separator ?? AFFIX_SEPARATOR_DEFAULT;
	const one = (item: string) => join(item, randToken(length, charset), separator);

	return Array.isArray(value) ? value.map(one) : one(value);
}
