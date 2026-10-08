import type { CapacityScale } from '../../_internal/capacity.js';
import type { DiskType, DiskUnit, SystemPlatform } from '../../_types/global.js';

export const DISK_TYPES: readonly DiskType[] = ['hdd', 'ssd', 'sshd', 'emmc', 'ufs'];

/** How each kind of storage is written: the label a spec sheet uses, and the name behind it. */
export const DISK_TYPE_LABELS: Record<DiskType, { label: string; name: string }> = {
	hdd: { label: 'HDD', name: 'Hard Disk Drive' },
	ssd: { label: 'SSD', name: 'Solid State Drive' },
	sshd: { label: 'SSHD', name: 'Solid State Hybrid Drive' },
	emmc: { label: 'eMMC', name: 'Embedded MultiMediaCard' },
	ufs: { label: 'UFS', name: 'Universal Flash Storage' }
};

/**
 * How often each kind of storage comes up on each platform, out of a hundred.
 * A kind a platform does not use is left out of its row.
 *
 * Written by hand in the order the kinds are common in, not measured from any
 * one survey: an SSD is most desktops and laptops now and a hard disk most of the
 * rest, while a phone or a tablet stores to UFS or, older and cheaper, to eMMC —
 * which is also what a low-cost laptop is built with. `'all'` picks the platform
 * first, so the two come up about evenly.
 */
export const DISK_TYPE_WEIGHTS: Record<SystemPlatform, Partial<Record<DiskType, number>>> = {
	desktop: { ssd: 62, hdd: 33, sshd: 3, emmc: 2 },
	mobile: { ufs: 70, emmc: 30 }
};

export const DISK_UNITS: readonly DiskUnit[] = ['MB', 'GB', 'TB'];

/**
 * Every capacity a drive or a phone's storage is sold with, in gigabytes, and how
 * often each one comes up.
 *
 * The weights are written by hand in the order the sizes are common in, not
 * measured from any one survey: 256 GB, 512 GB and 1 TB are most of a sample, the
 * small flash of an old phone and the largest hard disks rare. The SATA sizes of
 * the first SSDs (120, 240 and 480 GB) and the 250 and 500 GB of the hard disks
 * beside them are in too.
 */
export const DISK_SCALE: CapacityScale<DiskUnit> = {
	units: DISK_UNITS,
	step: 1000,
	base: 'GB',
	reference: 'GB',
	bytes: 1000 ** 3,
	pool: [
		[16, 1],
		[32, 2],
		[64, 4],
		[120, 2],
		[128, 8],
		[240, 3],
		[250, 3],
		[256, 16],
		[480, 3],
		[500, 8],
		[512, 18],
		[1000, 18],
		[2000, 10],
		[3000, 2],
		[4000, 6],
		[6000, 2],
		[8000, 3],
		[10000, 1],
		[12000, 1],
		[14000, 0.5],
		[16000, 0.5],
		[18000, 0.5],
		[20000, 0.5],
		[22000, 0.3],
		[24000, 0.3]
	]
};
