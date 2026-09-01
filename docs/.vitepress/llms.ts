/**
 * `llms.txt` and `llms-full.txt`, written at build time rather than committed.
 *
 * The convention (llmstxt.org) asks for a short, link-shaped index of a site at
 * `/llms.txt`, with the whole thing flattened into one file beside it. Both are
 * **generated**, for the same reason `robots.txt` is: a hand-written index of a
 * documentation site is a second table of contents, and the second one is the
 * one that goes stale. `data/sidebar.ts` is already the site's menu, and every
 * page already opens with a sentence written to be its summary — so adding a
 * page adds it here too, and there is nothing to remember.
 *
 * Both files are **English and JavaScript**. Not a shortcut: llms.txt has no
 * notion of locales, and this site's Korean pages are translations of these
 * ones rather than different documents. The three packages are the same
 * decision — the npm package is the reference implementation, so the `::: lang`
 * blocks are flattened to its half and the mapping to the other two is stated
 * once at the top instead of being repeated on every code sample.
 */

import { existsSync, readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { inlineLang } from './data/markdown';
import { SIDEBAR } from './data/sidebar';

export interface LlmsOptions {
	/** Where the built site is being written. */
	outDir: string;
	/** `docs/`, which the locale folders sit in. */
	srcDir: string;
	/** The site's own origin, with no trailing slash. */
	siteUrl: string;
	repoUrl: string;
	/** The site description, used as the file's one-line summary. */
	description: string;
	/** A page's first paragraph of prose — the same one the `<meta>` tags use. */
	summaryOf: (filePath: string) => string | undefined;
	/** Where each package is published, for the Optional section. */
	packages: { registry: string; url: string }[];
}

/** `guide/getting-started` → `/guide/getting-started`; an index page → `/name/`. */
function urlOf(siteUrl: string, path: string): string {
	return `${siteUrl}/${path}`;
}

/** `name/` is a folder's index page; everything else is a file. */
function sourceOf(path: string): string {
	return path.endsWith('/') ? `en/${path}index.md` : `en/${path}.md`;
}

/**
 * Every relative link made absolute, against the page it was written on.
 *
 * `[Themes](./themes)` resolves in a browser because the reader is standing on
 * a URL. Nobody reading `llms-full.txt` is standing anywhere.
 */
function absoluteLinks(markdown: string, pageUrl: string): string {
	return markdown.replace(/\]\((?!https?:|mailto:)([^)]+)\)/g, (whole, href: string) => {
		try {
			return `](${new URL(href, pageUrl).toString()})`;
		} catch {
			return whole;
		}
	});
}

/**
 * One page, with the parts only a browser can show taken out.
 *
 * The `::: lang` container keeps every package's version of a block in the
 * document and lets CSS display one. A text file has no CSS, so the JavaScript
 * one is kept and the others are dropped — printing all three would read as one
 * contradictory API.
 */
function flatten(markdown: string): string {
	return (
		inlineLang(markdown)
			// Frontmatter is the page's metadata, not its content.
			.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
			// `::: lang js dart` … `:::` — kept when JavaScript is one of them.
			.replace(/^::: lang ([^\n]*)\n([\s\S]*?)\n:::$/gm, (_, langs: string, body: string) =>
				langs.trim().split(/\s+/).includes('js') ? body.trim() : ''
			)
			// The demo is a Vue component; in a text file it is nothing at all.
			.replace(/^<Demo\s*\/>$/gm, '')
			// Whatever the removals left behind.
			.replace(/\n{3,}/g, '\n\n')
			.trim()
	);
}

const PREAMBLE = [
	'randino generates two things and keeps them apart on purpose. **Person names** read like names',
	'a person actually carries (김민준, Emma Clover) and are meant for sample data. **Nicknames** are',
	'the handles someone would pick for a game or a website (멋진사자, MistyOwl); they are built from',
	'everyday words and never from person names.',
	'',
	'The same library ships as three packages — `randino` on npm, on pub.dev and on PyPI — generating',
	'the same output from the same datasets. **Everything below is the JavaScript package**, which is',
	'the reference implementation. The other two differ only in how options are passed: Dart takes',
	'named parameters (`randName(language: NameLanguage.ko)`), and Python takes keyword arguments with',
	'snake_case names (`rand_name(language="ko")`, `min_length`, `include_middle_name`).',
	'',
	'Every page below also exists in Korean at the same path under `/ko/`.'
].join('\n');

export async function writeLlmsFiles(options: LlmsOptions): Promise<void> {
	const { outDir, srcDir, siteUrl, repoUrl, description, summaryOf, packages } = options;

	const index: string[] = [`# randino`, '', `> ${description}`, '', PREAMBLE, ''];
	const full: string[] = [
		'# randino — full documentation',
		'',
		`> ${description}`,
		'',
		PREAMBLE,
		''
	];

	for (const group of SIDEBAR) {
		index.push(`## ${group.en}`, '');

		for (const page of group.items) {
			const source = sourceOf(page.path);
			const url = urlOf(siteUrl, page.path);
			const summary = summaryOf(source);

			index.push(`- [${page.en}](${url})${summary ? `: ${summary}` : ''}`);

			const file = resolve(srcDir, source);

			if (existsSync(file)) {
				// The page keeps its own `#` heading; the source line goes under it,
				// which is where a reader of one of these files expects to find it.
				const body = absoluteLinks(flatten(readFileSync(file, 'utf8')), `${url}`);
				const [heading, ...rest] = body.split('\n');

				full.push('---', '', heading, '', `Source: ${url}`, '', rest.join('\n').trim(), '');
			}
		}

		index.push('');
	}

	index.push(
		'## Optional',
		'',
		`- [Full documentation as one file](${siteUrl}/llms-full.txt): every page above, concatenated.`,
		`- [Source repository](${repoUrl}): the datasets, the three packages and this site.`,
		...packages.map(({ registry, url }) => `- [${registry}](${url}): the published package.`),
		''
	);

	await writeFile(resolve(outDir, 'llms.txt'), `${index.join('\n').trimEnd()}\n`);
	await writeFile(resolve(outDir, 'llms-full.txt'), `${full.join('\n').trimEnd()}\n`);
}
