// Sizes of memory and storage: a pool of real capacities, the units they are
// written in, and the candidates `randRam` and `randDiskSize` both draw from.
//
// A size is always one a machine is really sold with, and it is only ever
// written in a unit it is a whole number of: 512 MB of memory is never `0.5 GB`,
// and a 500 GB drive is never `0.5 TB`. Asking for a unit leaves out the sizes
// that are not whole in it rather than rounding them into a size nobody sells.

import { finite } from './generate.js';

/** How one kind of size is measured: its units, and the pool it draws from. */
export interface CapacityScale<U extends string> {
	/** The units, smallest first, each `step` times the one before it. */
	units: readonly U[];
	/** How many of one unit make the next: `1024` for memory, `1000` for storage. */
	step: number;
	/** The unit `pool` is written in. */
	base: U;
	/** The unit `minSize` and `maxSize` are read in when the unit is `'auto'`. */
	reference: U;
	/** How many bytes one `base` unit is. */
	bytes: number;
	/** Every size there is, in `base`, with how often it comes up. */
	pool: readonly (readonly [number, number])[];
}

/** A size a call may land on, with the unit it is written in. */
export interface CapacityCandidate<U extends string> {
	size: number;
	weight: number;
	unit: U;
	value: number;
}

/**
 * `size`, given in the scale's base unit, as a number of `unit`. Multiplied for a
 * smaller unit and divided for a larger one, never multiplied by a fraction, so a
 * size that is whole in a unit comes out exactly whole.
 */
export function inUnit<U extends string>(scale: CapacityScale<U>, size: number, unit: U): number {
	const steps = scale.units.indexOf(scale.base) - scale.units.indexOf(unit);

	return steps >= 0 ? size * scale.step ** steps : size / scale.step ** -steps;
}

/** The largest unit `size` is a whole number of — what `'auto'` writes it in. */
export function fitUnit<U extends string>(scale: CapacityScale<U>, size: number): U {
	for (let i = scale.units.length - 1; i > 0; i -= 1) {
		if (Number.isInteger(inUnit(scale, size, scale.units[i]))) {
			return scale.units[i];
		}
	}

	return scale.units[0];
}

/**
 * The sizes one call may land on, each in the unit it is written in.
 *
 * A named unit keeps to the sizes that are whole in it. `minSize` and `maxSize`
 * are read in that unit, or in the scale's reference unit for `'auto'`, and keep
 * to the sizes inside them, both ends included. Nothing is fitted afterwards, so
 * a range no real size is inside is answered with nothing.
 */
export function capacityCandidates<U extends string>(
	scale: CapacityScale<U>,
	unit: U | 'auto',
	minSize: unknown,
	maxSize: unknown
): CapacityCandidate<U>[] {
	const bound = unit === 'auto' ? scale.reference : unit;
	// As written, not floored: `minSize: 1.5` in terabytes is no terabyte, and
	// `maxSize: 0.5` in gigabytes is 512 MB.
	const high = finite(maxSize);
	const asked = finite(minSize);
	// A range the wrong way round keeps `maxSize`, the way a length range keeps
	// `maxLength`: it is the bound a caller is usually holding to.
	const low = asked !== undefined && high !== undefined ? Math.min(asked, high) : asked;
	const candidates: CapacityCandidate<U>[] = [];

	for (const [size, weight] of scale.pool) {
		const written = unit === 'auto' ? fitUnit(scale, size) : unit;
		const value = inUnit(scale, size, written);
		const measured = inUnit(scale, size, bound);

		if (!Number.isInteger(value)) continue;
		if (low !== undefined && measured < low) continue;
		if (high !== undefined && measured > high) continue;

		candidates.push({ size, weight, unit: written, value });
	}

	return candidates;
}

/** A size written out: `16 GB`, or `16` without its unit. */
export function writeCapacity(value: number, unit: string, includeUnit: boolean): string {
	return includeUnit ? `${value} ${unit}` : String(value);
}
