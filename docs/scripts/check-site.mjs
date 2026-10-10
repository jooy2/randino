/**
 * Fails the build on three mistakes nothing else catches.
 *
 * - A component tag or a `::: lang` block left in `llms.txt` or `llms-full.txt`.
 *   Those files are plain text flattened out of the pages, and a tag the
 *   flattening missed reaches every reader of them as markup.
 * - A page that is in neither `llms.txt` nor, so, the menu. `llms.txt` is written
 *   from `data/sidebar.ts`, so a page missing from it is a page the menu leaves
 *   out: it builds, and nobody finds it.
 * - A constant the npm package exports that the constants page does not name.
 *
 * Reads the built site, so it runs after `vitepress build`.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(docsDir, '../docs-dist');
const libDir = resolve(docsDir, '../packages/javascript/lib');
const problems = [];

function markdownIn(dir) {
	const pages = [];

	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);

		if (statSync(full).isDirectory()) {
			pages.push(...markdownIn(full));
		} else if (entry.endsWith('.md')) {
			pages.push(full);
		}
	}

	return pages;
}

// 1. Nothing but text in the files a model reads.
for (const file of ['llms.txt', 'llms-full.txt']) {
	const text = readFileSync(join(outDir, file), 'utf8');

	text.split('\n').forEach((line, index) => {
		if (/<[A-Z][A-Za-z]*[\s/>]/.test(line) || /^::: lang\b/.test(line)) {
			problems.push(`${file}:${index + 1} keeps markup: ${line.slice(0, 80)}`);
		}
	});
}

// 2. Every page in the menu, which is what `llms.txt` is written from.
const listed = new Set(
	[
		...readFileSync(join(outDir, 'llms.txt'), 'utf8').matchAll(/\]\(https?:\/\/[^/)]+\/([^)#]*)\)/g)
	].map(([, path]) => path.replace(/\.html$/, '').replace(/\/$/, '/index'))
);

for (const page of markdownIn(join(docsDir, 'en'))) {
	const path = relative(join(docsDir, 'en'), page).replace(/\.md$/, '');

	if (path !== 'index' && !listed.has(path)) {
		problems.push(`en/${path}.md is not in the menu`);
	}
}

// 3. Every exported constant on the constants page, in both locales. The public
// names are the ones `lib/index.ts` re-exports: `constants.ts` and what each
// category's own `index.ts` hands on.
const exported = new Set();
const entry = readFileSync(join(libDir, 'index.ts'), 'utf8');

for (const [, path] of entry.matchAll(/export \* from '\.\/([^']+)\.js'/g)) {
	const source = readFileSync(join(libDir, `${path}.ts`), 'utf8');

	for (const [, names] of source.matchAll(/export \{([^}]*)\} from/g)) {
		for (const name of names.split(',').map((each) => each.trim().replace(/^type\s+/, ''))) {
			if (/^[A-Z][A-Z0-9_]+$/.test(name)) {
				exported.add(name);
			}
		}
	}

	for (const [, name] of source.matchAll(/export const ([A-Z][A-Z0-9_]+)/g)) {
		exported.add(name);
	}
}

for (const locale of ['en', 'ko']) {
	const page = readFileSync(join(docsDir, locale, 'reference/constants.md'), 'utf8');

	for (const name of exported) {
		if (!page.includes(name)) {
			problems.push(`${locale}/reference/constants.md does not name ${name}`);
		}
	}
}

if (problems.length) {
	console.error(problems.join('\n'));
	process.exit(1);
}

console.log(
	`llms files clean, ${listed.size} pages in the menu, ${exported.size} constants documented.`
);
