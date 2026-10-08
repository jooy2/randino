import { rows } from '../../_internal/parse.js';
import type { SystemPlatform } from '../../_types/global.js';

/** One screen size the catalog holds, and how often it comes up. */
export interface ResolutionEntry {
	platform: SystemPlatform;
	width: number;
	height: number;
	/** How often it comes up beside the other sizes of its platform, out of a hundred. */
	weight: number;
}

/** The separator a resolution is written with when the caller names none. */
export const RESOLUTION_SEPARATOR_DEFAULT = 'x';

/**
 * Every screen size the catalog holds, one per row: `platform | width x height |
 * weight`.
 *
 * The sizes are the ones a browser reports for a screen, which on a scaled
 * display is the size the system lays things out at rather than the panel's
 * pixels: a 1920x1080 laptop at 125% is `1536x864`, a 14-inch MacBook Pro
 * `1512x982`, and a phone is its portrait width first. The weights are written
 * by hand in the order the sizes are common in, not measured from any one
 * survey: 1920x1080 is about a quarter of the desktops, and on mobile the sizes
 * of the common iPhones and Android phones lead, with tablets after them. Each
 * platform's weights add up to a hundred.
 */
export const RESOLUTIONS: readonly ResolutionEntry[] = rows(`
	desktop | 1920x1080 | 26
	desktop | 1366x768 | 10
	desktop | 1536x864 | 10
	desktop | 2560x1440 | 9
	desktop | 1440x900 | 5
	desktop | 1280x720 | 4
	desktop | 1600x900 | 4
	desktop | 3840x2160 | 5
	desktop | 1280x800 | 3
	desktop | 1680x1050 | 3
	desktop | 1920x1200 | 3
	desktop | 2560x1600 | 3
	desktop | 1470x956 | 3
	desktop | 1512x982 | 3
	desktop | 1280x1024 | 2
	desktop | 3440x1440 | 2
	desktop | 1728x1117 | 2
	desktop | 1024x768 | 1
	desktop | 2560x1080 | 1
	desktop | 1360x768 | 1

	mobile | 360x800 | 12
	mobile | 390x844 | 10
	mobile | 412x915 | 9
	mobile | 393x852 | 8
	mobile | 414x896 | 6
	mobile | 375x812 | 5
	mobile | 375x667 | 5
	mobile | 430x932 | 5
	mobile | 393x873 | 4
	mobile | 360x780 | 4
	mobile | 428x926 | 4
	mobile | 384x854 | 3
	mobile | 360x740 | 3
	mobile | 402x874 | 3
	mobile | 440x956 | 2
	mobile | 360x640 | 2
	mobile | 320x568 | 1
	mobile | 768x1024 | 4
	mobile | 810x1080 | 3
	mobile | 820x1180 | 2
	mobile | 834x1194 | 2
	mobile | 800x1280 | 2
	mobile | 1024x1366 | 1
`).map(([platform, size, weight]) => {
	const [width, height] = size.split('x').map(Number);

	return { platform: platform as SystemPlatform, width, height, weight: Number(weight) };
});
