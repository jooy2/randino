import type { GpuDetail, RandGpuOptions } from '../_types/global.js';
import { generateGpuDetails } from './gpuGenerator.js';

/**
 * Generate real graphics processors, by the names their makers gave them.
 *
 * NVIDIA, AMD and Intel cards, laptop GPUs and integrated graphics for desktops
 * and laptops, and the GPUs inside the chips of phones and tablets from
 * Qualcomm, Arm and Samsung. `minYear` and `maxYear` keep to the parts whose
 * first cards or machines went on sale in those years.
 *
 * @example
 * randGpu(); // ['NVIDIA GeForce RTX 3060']
 * randGpu({ platform: 'mobile', count: 2 }); // ['Qualcomm Adreno 740', 'Arm Mali-G78']
 * randGpu({ platform: 'desktop', maxYear: 2010 }); // ['ATI Radeon HD 4870']
 * randGpu({ includeVendor: false }); // ['Radeon RX 7900 XTX']
 * randGpu({ vendor: 'NVIDIA', count: 2 }); // ['NVIDIA GeForce RTX 4070', 'NVIDIA GeForce GTX 1650']
 */
export function randGpu(options?: RandGpuOptions & { output?: 'value' }): string[];
/**
 * Generate graphics processors along with the maker, the model, the platform and
 * the year.
 *
 * `output: 'detail'` returns a `GpuDetail` per graphics processor instead of a
 * string.
 *
 * @example
 * randGpu({ output: 'detail' });
 * // [{ gpu: 'Intel Arc A770', vendor: 'Intel', model: 'Arc A770', platform: 'desktop', year: 2022 }]
 */
export function randGpu(options: RandGpuOptions & { output: 'detail' }): GpuDetail[];
export function randGpu(options: RandGpuOptions = {}): string[] | GpuDetail[] {
	const details = generateGpuDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.gpu);
}
