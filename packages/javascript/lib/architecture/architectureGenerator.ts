// The architecture generator: what a machine's processor runs, by the name a
// toolchain writes it, mostly x86 and Arm.

import { collect, resolveOption, resolvePlatforms, resolveRandom } from '../_internal/generate.js';
import { pick, pickWeighted, withRandom } from '../_internal/utils.js';
import type {
	Architecture,
	ArchitectureDetail,
	ArchitectureNaming,
	RandArchitectureOptions
} from '../_types/global.js';
import { ARCHITECTURES, ARCHITECTURE_DATA, ARCHITECTURE_NAMINGS } from './data/index.js';

/** `architecture` by the names `naming` writes. */
export function writeArchitecture(architecture: Architecture, naming: ArchitectureNaming): string {
	return naming === 'common' ? architecture : ARCHITECTURE_DATA[architecture].names[naming];
}

/**
 * Every name `architecture` goes by but `written`, the common one first where it
 * is not the one written. Debian and Go share most of their names, so a name is
 * listed once however many namings write it.
 */
export function aliasesOf(architecture: Architecture, written: string): string[] {
	return [architecture, ...ARCHITECTURE_DATA[architecture].aliases].filter(
		(name) => name !== written
	);
}

export function generateArchitectureDetails(
	options: RandArchitectureOptions = {}
): ArchitectureDetail[] {
	const includeRare = options.includeRare === true;
	const naming = resolveOption(options.naming, ARCHITECTURE_NAMINGS, 'common');
	// The architectures each platform may land on, worked out once per call. A
	// platform none of them runs on is left out, so `'all'` never draws a platform
	// it then has nothing to write for.
	const candidates = resolvePlatforms(options.platform)
		.map((platform) => ({
			platform,
			architectures: ARCHITECTURES.filter((architecture) => {
				const data = ARCHITECTURE_DATA[architecture];

				return data.weights[platform] !== undefined && (includeRare || !data.rare);
			})
		}))
		.filter((each) => each.architectures.length > 0);

	return withRandom(resolveRandom(options.random), () =>
		collect(
			{ count: candidates.length ? options.count : 0, unique: options.unique },
			() => {
				// The platform first, so `'all'` is half desktops and half phones.
				const { platform, architectures } = pick(candidates);
				const architecture = pickWeighted(
					architectures,
					(each) => ARCHITECTURE_DATA[each].weights[platform]!
				);
				const { bits, family, rare } = ARCHITECTURE_DATA[architecture];
				const written = writeArchitecture(architecture, naming);

				return {
					architecture: written,
					code: architecture,
					aliases: aliasesOf(architecture, written),
					bits,
					family,
					rare,
					platform
				};
			},
			(detail) => detail.architecture
		)
	);
}
