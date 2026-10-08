// The architecture generator: what a machine's processor runs, by the name a
// toolchain writes it, mostly x86 and Arm.

import { collect, resolveRandom } from '../_internal/generate.js';
import { pickWeighted, withRandom } from '../_internal/utils.js';
import type { ArchitectureDetail, RandArchitectureOptions } from '../_types/global.js';
import { ARCHITECTURES, ARCHITECTURE_DATA } from './data/index.js';

export function generateArchitectureDetails(
	options: RandArchitectureOptions = {}
): ArchitectureDetail[] {
	const includeRare = options.includeRare === true;
	const candidates = ARCHITECTURES.filter(
		(architecture) => includeRare || !ARCHITECTURE_DATA[architecture].rare
	);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: options.count, unique: options.unique },
			() => {
				const architecture = pickWeighted(candidates, (each) => ARCHITECTURE_DATA[each].weight);
				const { aliases, bits, family, rare } = ARCHITECTURE_DATA[architecture];

				return { architecture, aliases: [...aliases], bits, family, rare };
			},
			(detail) => detail.architecture
		)
	);
}
