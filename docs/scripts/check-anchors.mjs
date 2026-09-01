/**
 * Fails the build on a `#fragment` link that points at no heading.
 *
 * VitePress checks that a linked *page* exists and stops there, which leaves the
 * half of a cross-reference that is easiest to get wrong unchecked. Korean makes
 * it worse than a typo risk: VitePress slugifies through `NFKD`, so a Hangul
 * heading's generated id is **decomposed jamo** while anything typed into a
 * Markdown link is composed — the two look identical in an editor, in a diff and
 * in a review, and the link silently scrolls nowhere.
 *
 * The fix for those is an explicit `{#ascii-anchor}` on the heading. This script
 * is what says when one is missing.
 *
 * Reads the built site, so it runs after `vitepress build`.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs-dist');

function pagesIn(dir) {
	const pages = [];

	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);

		if (statSync(full).isDirectory()) {
			pages.push(...pagesIn(full));
		} else if (entry.endsWith('.html')) {
			pages.push(full);
		}
	}

	return pages;
}

const pages = pagesIn(outDir);
const idsOf = new Map(
	pages.map((page) => [
		page,
		new Set(
			[...readFileSync(page, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(([, id]) =>
				decodeURIComponent(id)
			)
		)
	])
);

/** Every file a href could mean, in the order a static host would try them. */
function resolvePage(page, path) {
	const abs = path.startsWith('/') ? join(outDir, path) : normalize(join(dirname(page), path));

	return [`${abs}.html`, join(abs, 'index.html'), abs].find((file) => idsOf.has(file));
}

let checked = 0;
const broken = [];

for (const page of pages) {
	for (const [, href] of readFileSync(page, 'utf8').matchAll(/<a[^>]+href="([^"]+)"/g)) {
		if (href.startsWith('http') || !href.includes('#')) {
			continue;
		}

		const [path, hash] = href.split('#');

		if (!hash) {
			continue;
		}

		const target = path ? resolvePage(page, path) : page;

		checked += 1;

		if (!target) {
			broken.push(`${relative(outDir, page)} -> ${href} (no such page)`);
		} else if (!idsOf.get(target).has(decodeURIComponent(hash))) {
			broken.push(`${relative(outDir, page)} -> ${href} (no such heading)`);
		}
	}
}

if (broken.length) {
	console.error(`${broken.length} of ${checked} anchor links point at nothing:\n`);

	for (const line of broken) {
		console.error(`  ${line}`);
	}

	console.error(
		'\nA Korean heading needs an explicit `{#ascii-anchor}` to be linkable — see the\n' +
			'comment at the top of this file.'
	);
	process.exit(1);
}

console.log(`${checked} anchor links checked, all resolve.`);
