import type { AgeDetail, RandAgeOptions } from '../_types/global.js';
import { generateAgeDetails } from './ageGenerator.js';

/**
 * Generate ages for sample people, in whole years.
 *
 * The draw follows a curve shaped like a population rather than an even spread,
 * so young adults come up far more often than children or anybody past seventy.
 * `distribution: 'uniform'` draws every age in the range alike instead.
 *
 * @example
 * randAge(); // [34]
 * randAge({ count: 5 }); // [27, 8, 41, 63, 30]
 * randAge({ minAge: 18, count: 3 }); // [22, 45, 31]
 * randAge({ group: 'senior', count: 3 }); // [71, 66, 80]
 */
export function randAge(options?: RandAgeOptions & { output?: 'value' }): number[];
/**
 * Generate ages along with the part of a life each one falls in.
 *
 * `output: 'detail'` returns an `AgeDetail` per age instead of a number.
 *
 * @example
 * randAge({ output: 'detail' }); // [{ age: 16, group: 'teen' }]
 */
export function randAge(options: RandAgeOptions & { output: 'detail' }): AgeDetail[];
export function randAge(options: RandAgeOptions = {}): number[] | AgeDetail[] {
	const details = generateAgeDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.age);
}
