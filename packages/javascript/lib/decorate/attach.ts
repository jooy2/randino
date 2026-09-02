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
 * Tell a value from an options object in the first argument. Every decorator
 * takes both shapes: what it attaches is worth having on its own, so the value
 * is optional and `randSuffix({ length: 8 })` has to mean the options.
 */
export function firstArgument<T>(
	value: string | string[] | T | undefined,
	options: T | undefined,
	fallback: T
): { target: string | string[] | undefined; settings: T } {
	const isValue = typeof value === 'string' || Array.isArray(value);

	return {
		target: isValue ? (value as string | string[]) : undefined,
		settings: (isValue ? options : (value as T | undefined)) ?? fallback
	};
}

/**
 * Attaches a **freshly drawn** token to one string, or to every string in an
 * array — one token each rather than one for the batch, which is the whole
 * point of passing a generator's output here. With no value at all it hands
 * back the bare token, separator and all left off.
 */
export function attach(
	value: string | string[] | RandAffixOptions | undefined,
	options: RandAffixOptions | undefined,
	join: (value: string, token: string, separator: string) => string
): string | string[] {
	const { target, settings } = firstArgument<RandAffixOptions>(value, options, {});
	const length = clamp(Math.floor(settings.length ?? AFFIX_LENGTH_DEFAULT), 1, AFFIX_LENGTH_MAX);
	const charset = settings.charset || AFFIX_CHARSET;
	const separator = settings.separator ?? AFFIX_SEPARATOR_DEFAULT;
	const token = () => randToken(length, charset);

	if (target === undefined) {
		return token();
	}

	const one = (item: string) => join(item, token(), separator);

	return Array.isArray(target) ? target.map(one) : one(target);
}
