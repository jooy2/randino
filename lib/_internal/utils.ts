// Small shared helpers. Internal only — nothing here is exported from the package.

/** Random entry of a non-empty array. */
export function pick<T>(items: readonly T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

/**
 * Random entry of a non-empty array, drawn in proportion to `weightOf`. Falls
 * back to an even draw when every weight is zero, so a caller never has to check
 * that its weight table covers the pool.
 */
export function pickWeighted<T>(items: readonly T[], weightOf: (item: T) => number): T {
	let total = 0;

	for (const item of items) {
		total += Math.max(0, weightOf(item));
	}

	if (total <= 0) {
		return pick(items);
	}

	let roll = Math.random() * total;

	for (const item of items) {
		roll -= Math.max(0, weightOf(item));

		if (roll < 0) {
			return item;
		}
	}

	return items[items.length - 1];
}

/** Random integer between `min` and `max`, both inclusive. */
export function randInt(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min + 1));
}

/** True with a `percent` chance (`0` never, `100` always). */
export function chance(percent: number): boolean {
	return Math.random() * 100 < percent;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export function capitalizeFirst(value: string): string {
	return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

/** Random string of `length` characters drawn from `charset`. */
export function randomToken(length: number, charset: string): string {
	let out = '';

	for (let i = 0; i < length; i += 1) {
		out += charset.charAt(Math.floor(Math.random() * charset.length));
	}

	return out;
}
