import type { CapacityPool, CapacityScale } from '../../_internal/capacity.js';
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

/** How storage is measured: in powers of ten, the way a drive is sold. */
export const DISK_SCALE: CapacityScale<DiskUnit> = {
	units: DISK_UNITS,
	step: 1000,
	base: 'GB',
	reference: 'GB',
	bytes: 1e9
};

/**
 * Every capacity each kind of storage is sold in, in gigabytes, and how often
 * each one comes up beside the others of that kind.
 *
 * A kind is sold in sizes of its own, so a size is drawn from the kind's pool
 * rather than from every size there is: a hard disk is the only kind past 8 TB,
 * an eMMC chip stops at 128 GB, and the 120, 240 and 480 GB of the first SATA
 * SSDs are an SSD's alone. The weights are written by hand in the order the
 * sizes are common in, not measured from any one survey: 512 GB and 1 TB lead
 * the SSDs, 1 and 2 TB the hard disks, 128 and 256 GB the phones.
 */
export const DISK_SIZES: Record<DiskType, CapacityPool> = {
	hdd: [
		[120, 1],
		[250, 3],
		[500, 10],
		[1000, 18],
		[2000, 12],
		[3000, 3],
		[4000, 8],
		[6000, 3],
		[8000, 4],
		[10000, 1.5],
		[12000, 1.5],
		[14000, 1],
		[16000, 1],
		[18000, 1],
		[20000, 1],
		[22000, 0.5],
		[24000, 0.5]
	],
	ssd: [
		[32, 0.5],
		[64, 1],
		[120, 2],
		[128, 6],
		[240, 3],
		[250, 4],
		[256, 18],
		[480, 3],
		[500, 8],
		[512, 22],
		[1000, 22],
		[2000, 8],
		[4000, 2],
		[8000, 0.5]
	],
	sshd: [
		[250, 1],
		[500, 4],
		[1000, 8],
		[2000, 4],
		[3000, 1],
		[4000, 0.5]
	],
	emmc: [
		[16, 4],
		[32, 8],
		[64, 8],
		[128, 4]
	],
	ufs: [
		[32, 1],
		[64, 4],
		[128, 16],
		[256, 20],
		[512, 10],
		[1000, 3]
	]
};
