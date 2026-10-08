import type { DiskType, SystemPlatform } from '../../_types/global.js';

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
