// The phone number generator: a block the country's numbering plan gives out,
// the digits after it, and the number written the way the country writes one.
//
// What is drawn and how it is written are kept apart. A number is its groups of
// digits, and the national form, the international form and E.164 are three
// ways of writing the same groups — which is why a separator can replace the
// country's own punctuation without the number changing underneath it.

import { collect, resolveOption, resolveRandom } from '../_internal/generate.js';
import { pick, pickWeighted, randInt, withRandom } from '../_internal/utils.js';
import type {
	PhoneCountry,
	PhoneCountryOption,
	PhoneDetail,
	PhoneType,
	PhoneTypeOption,
	RandPhoneOptions
} from '../_types/global.js';
import { PHONE_COUNTRIES, PHONE_DATA, PHONE_TYPES } from './data/index.js';
import type { PhoneCountryData, PhoneShape } from './data/index.js';

// A group that keeps landing on an avoided value is given up on after this many
// draws. Nine values out of eight hundred never get close to it.
const AVOID_ATTEMPTS = 20;

/** A pattern with every `x`, `n` and `N` replaced by a digit it allows. */
function fill(pattern: string): string {
	let out = '';

	for (const mark of pattern) {
		out +=
			mark === 'x'
				? randInt(0, 9)
				: mark === 'n'
					? randInt(1, 9)
					: mark === 'N'
						? randInt(2, 9)
						: mark;
	}

	return out;
}

/** How many first groups a shape can write: its prefixes, times what its lead can add. */
function openings(shape: PhoneShape): number {
	let span = shape.prefixes.length;

	for (const mark of shape.lead ?? '') {
		span *= mark === 'x' ? 10 : mark === 'n' ? 9 : mark === 'N' ? 8 : 1;
	}

	return span;
}

/** A group drawn from its pattern, never one of the values the shape avoids. */
function drawGroup(pattern: string, avoid: readonly string[] | undefined): string {
	let group = fill(pattern);

	for (let attempt = 1; avoid?.includes(group) && attempt < AVOID_ATTEMPTS; attempt += 1) {
		group = fill(pattern);
	}

	return group;
}

/** A template with its trunk and its groups put in, in order. */
function writeTemplate(template: string, trunk: string, groups: readonly string[]): string {
	let next = 0;

	return template.replace(/[T#]/g, (mark) => (mark === 'T' ? trunk : groups[next++]));
}

/**
 * The national form's groups, joined by the caller's separator rather than by
 * the country's punctuation. The trunk goes where the country's own template
 * puts it: attached to the first group (`010`), or a group of its own (`8`).
 */
function joinNational(
	template: string,
	trunk: string,
	groups: readonly string[],
	separator: string
): string {
	if (!trunk) {
		return groups.join(separator);
	}

	return template.includes('T#')
		? [trunk + groups[0], ...groups.slice(1)].join(separator)
		: [trunk, ...groups].join(separator);
}

/** The number `options` asked for, in the form they asked for it. */
function write(
	data: PhoneCountryData,
	trunk: string,
	groups: readonly string[],
	includeCountryCode: boolean,
	separator: string | null
): string {
	if (includeCountryCode) {
		return separator === null
			? `+${data.callingCode} ${writeTemplate(data.international, '', groups)}`
			: `+${data.callingCode}${separator}${groups.join(separator)}`;
	}

	return separator === null
		? writeTemplate(data.national, trunk, groups)
		: joinNational(data.national, trunk, groups, separator);
}

/**
 * The caller's `country`, read regardless of case: `'kr'` is a code people write,
 * and answering it with every country would ignore what they plainly meant.
 */
export function resolvePhoneCountry(country: unknown): PhoneCountryOption {
	const code = typeof country === 'string' ? country.toUpperCase() : country;

	return resolveOption<PhoneCountryOption>(code, PHONE_COUNTRIES, 'all');
}

function resolvePhoneType(type: unknown): PhoneTypeOption {
	return resolveOption<PhoneTypeOption>(type, [...PHONE_TYPES, 'all'], 'mobile');
}

export function generatePhoneDetails(options: RandPhoneOptions = {}): PhoneDetail[] {
	const country = resolvePhoneCountry(options.country);
	const type = resolvePhoneType(options.type);
	const countries = country === 'all' ? PHONE_COUNTRIES : [country];
	const includeCountryCode = options.includeCountryCode === true;
	const separator = typeof options.separator === 'string' ? options.separator : null;

	return withRandom(resolveRandom(options.random), () =>
		collect(
			// Only the options a number has: a `startsWith` slipped past the types would
			// otherwise filter numbers by their first digit, or by their `+`.
			{ count: options.count, unique: options.unique },
			() => {
				const code: PhoneCountry = pick(countries);
				const kind: PhoneType = type === 'all' ? pick(PHONE_TYPES) : type;
				const data = PHONE_DATA[code];
				// Every opening the plan can write is as likely as any other, so a shape
				// listing sixteen area codes comes up sixteen times as often as one listing one,
				// and Spain's `6xx` ten times as often as its `71x`.
				const shape: PhoneShape = pickWeighted(data.plans[kind], openings);
				const groups = [
					pick(shape.prefixes) + fill(shape.lead ?? ''),
					...shape.groups.map((pattern) => drawGroup(pattern, shape.avoid))
				];

				return {
					phone: write(data, shape.trunk ?? data.trunk, groups, includeCountryCode, separator),
					e164: `+${data.callingCode}${groups.join('')}`,
					country: code,
					callingCode: data.callingCode,
					type: kind
				};
			},
			(detail) => detail.phone
		)
	);
}
