import type { ArchitectureDetail, RandArchitectureOptions } from '../_types/global.js';
import { generateArchitectureDetails } from './architectureGenerator.js';

/**
 * Generate processor architectures, by the names a download page most often lists
 * them under: `x86_64`, `arm64`.
 *
 * 64-bit x86 and Arm are nearly every draw, and the 32-bit `x86` and `armv7`
 * the rest. `includeRare` adds RISC-V, POWER, IBM Z, MIPS, LoongArch and SPARC,
 * about one draw in twenty together.
 *
 * @example
 * randArchitecture(); // ['x86_64']
 * randArchitecture({ count: 3 }); // ['arm64', 'x86_64', 'x86_64']
 * randArchitecture({ includeRare: true, count: 3 }); // ['x86_64', 'riscv64', 'arm64']
 */
export function randArchitecture(
	options?: RandArchitectureOptions & { output?: 'value' }
): string[];
/**
 * Generate architectures along with their other names, their width and their line.
 *
 * `output: 'detail'` returns an `ArchitectureDetail` per architecture instead of
 * a string.
 *
 * @example
 * randArchitecture({ output: 'detail' });
 * // [{ architecture: 'x86_64', aliases: ['amd64', 'x64'], bits: 64, family: 'x86', rare: false }]
 */
export function randArchitecture(
	options: RandArchitectureOptions & { output: 'detail' }
): ArchitectureDetail[];
export function randArchitecture(
	options: RandArchitectureOptions = {}
): string[] | ArchitectureDetail[] {
	options ??= {};

	const details = generateArchitectureDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.architecture);
}
