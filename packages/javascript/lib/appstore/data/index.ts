import { rows } from '../../_internal/parse.js';
import type { SystemPlatform } from '../../_types/global.js';

/** One store the catalog holds, and how often it comes up. */
export interface AppStoreEntry {
	platform: SystemPlatform;
	/** How often it comes up beside the other stores of its platform, out of a hundred. */
	weight: number;
	company: string;
	/** The store's own name: `App Store`, `Galaxy Store`. */
	name: string;
	/** The name with its company, where the store is known by one: `Apple App Store`. */
	full: string;
}

/**
 * Every store the catalog holds, one per row: `platform | weight | company |
 * name | full name`.
 *
 * Only stores that sell or hand out apps for a platform's own system are in, and
 * only ones still open. A phone's stores are the system's own and the makers'
 * (Google Play, Apple's App Store, Samsung's, Huawei's, Xiaomi's) and the
 * independent ones that ship on their own (Amazon, ONE store, Aptoide,
 * F-Droid); a desktop's are the system stores and the stores games are bought
 * from. Google Play is a phone's alone, since no desktop system ships it. The
 * weights are written by hand in the order the stores are common in, not
 * measured, and each platform's add up to a hundred.
 */
export const APP_STORES: readonly AppStoreEntry[] = rows(`
	mobile | 45 | Google | Google Play | Google Play Store
	mobile | 35 | Apple | App Store | Apple App Store
	mobile | 6 | Samsung | Galaxy Store | Samsung Galaxy Store
	mobile | 5 | Huawei | AppGallery | Huawei AppGallery
	mobile | 3 | Amazon | Amazon Appstore | Amazon Appstore
	mobile | 2 | Xiaomi | GetApps | Xiaomi GetApps
	mobile | 2 | ONE store | ONE store | ONE store
	mobile | 1 | Aptoide | Aptoide | Aptoide
	mobile | 1 | F-Droid | F-Droid | F-Droid

	desktop | 30 | Microsoft | Microsoft Store | Microsoft Store
	desktop | 25 | Valve | Steam | Steam
	desktop | 20 | Apple | Mac App Store | Mac App Store
	desktop | 8 | Epic Games | Epic Games Store | Epic Games Store
	desktop | 4 | GOG | GOG.com | GOG.com
	desktop | 4 | Canonical | Snap Store | Snap Store
	desktop | 3 | Electronic Arts | EA app | EA app
	desktop | 3 | Ubisoft | Ubisoft Connect | Ubisoft Connect
	desktop | 3 | MacPaw | Setapp | Setapp
`).map(([platform, weight, company, name, full]) => ({
	platform: platform as SystemPlatform,
	weight: Number(weight),
	company,
	name,
	full
}));
