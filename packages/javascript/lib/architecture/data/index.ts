import type { Architecture } from '../../_types/global.js';

export const ARCHITECTURES: readonly Architecture[] = [
	'x86_64',
	'arm64',
	'x86',
	'armv7',
	'riscv64',
	'ppc64le',
	's390x',
	'mips64',
	'loongarch64',
	'sparc64'
];

/** What an architecture is, and how often it comes up. */
export interface ArchitectureData {
	family: string;
	bits: number;
	/**
	 * How often it comes up, out of a hundred for the four common ones. Written by
	 * hand in the order they are common in: 64-bit x86 and Arm are nearly every
	 * machine, the 32-bit two what is left of the old ones. Each rare one is a
	 * fraction, so the six together are about one draw in twenty when asked for.
	 */
	weight: number;
	rare: boolean;
	/**
	 * The other names it goes by, in the order they are met: Debian's and Go's,
	 * then Windows' and Node's, then the kernel's or the compiler's.
	 */
	aliases: readonly string[];
}

export const ARCHITECTURE_DATA: Record<Architecture, ArchitectureData> = {
	x86_64: { family: 'x86', bits: 64, weight: 46, rare: false, aliases: ['amd64', 'x64'] },
	arm64: { family: 'arm', bits: 64, weight: 40, rare: false, aliases: ['aarch64'] },
	x86: { family: 'x86', bits: 32, weight: 8, rare: false, aliases: ['i386', 'ia32', 'i686'] },
	armv7: { family: 'arm', bits: 32, weight: 6, rare: false, aliases: ['armhf', 'armv7l'] },
	riscv64: { family: 'riscv', bits: 64, weight: 0.8, rare: true, aliases: [] },
	ppc64le: { family: 'power', bits: 64, weight: 0.8, rare: true, aliases: ['ppc64el'] },
	s390x: { family: 's390', bits: 64, weight: 0.8, rare: true, aliases: [] },
	mips64: { family: 'mips', bits: 64, weight: 0.8, rare: true, aliases: [] },
	loongarch64: { family: 'loongarch', bits: 64, weight: 0.8, rare: true, aliases: ['loong64'] },
	sparc64: { family: 'sparc', bits: 64, weight: 0.8, rare: true, aliases: ['sparcv9'] }
};
