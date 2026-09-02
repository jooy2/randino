import { existsSync, readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import container from 'markdown-it-container';
import type { Plugin } from 'vite';
import {
	defineConfig,
	type HeadConfig,
	type MarkdownRenderer,
	type SiteData,
	type TransformContext,
	type UserConfig
} from 'vitepress';
import { withI18n } from 'vitepress-i18n';
import type { VitePressI18nOptions } from 'vitepress-i18n/types';
import { CODE_LANGUAGE_HEAD_SCRIPT, CODE_LANGUAGE_IDS } from './data/languages';
import { writeLlmsFiles } from './llms';
import { inlineLang } from './data/markdown';
import { localeBase, navGroupsFor, sidebarFor } from './data/sidebar';

const vitePressDir = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(vitePressDir, '..');
const rootDir = resolve(srcDir, '..');

const defaultLocale = 'en';
const supportLocales: string[] = [defaultLocale, 'ko'];

/**
 * The three packages, read off their own manifests rather than written out.
 *
 * They version independently and they are published to three registries under
 * names that only happen to agree today; one of them being wrong in the footer
 * is exactly the kind of thing nobody notices. No YAML or TOML parser for one
 * line each.
 */
const npmPackage = JSON.parse(
	readFileSync(resolve(rootDir, 'packages/javascript/package.json'), 'utf8')
) as { name: string; homepage: string; repository: { url: string } };

const pubName =
	readFileSync(resolve(rootDir, 'packages/dart/pubspec.yaml'), 'utf8').match(
		/^name:\s*(\S+)/m
	)?.[1] ?? 'randino';

const pypiName =
	readFileSync(resolve(rootDir, 'packages/python/pyproject.toml'), 'utf8').match(
		/^name\s*=\s*"([^"]+)"/m
	)?.[1] ?? 'randino';

const siteUrl = npmPackage.homepage.replace(/\/+$/, '');
const repoUrl = npmPackage.repository.url.replace(/\.git$/, '');
const npmUrl = `https://www.npmjs.com/package/${npmPackage.name}`;
const pubUrl = `https://pub.dev/packages/${pubName}`;
const pypiUrl = `https://pypi.org/project/${pypiName}/`;
const editLinkPattern = `${repoUrl}/edit/main/docs/:path`;
const socialImage = `${siteUrl}/512x512.png`;

/**
 * Where each package is published, in the order the language switch lists them.
 *
 * The navbar renders these as one **Packages** dropdown rather than as three
 * social-link icons beside GitHub: a registry is one destination, and four icons
 * in a row read as a toolbar rather than as the two or three places this site
 * actually sends a reader. `mark` is the logo the row is labelled with — the
 * registry's own, not the language's, because npm is not JavaScript — and `id`
 * is the code language it publishes. See `PackageLinks.vue`.
 */
const packageLinks = [
	{ id: 'js', registry: 'npm', mark: 'npm', url: npmUrl },
	{ id: 'dart', registry: 'pub.dev', mark: 'pubdev', url: pubUrl },
	{ id: 'py', registry: 'PyPI', mark: 'pypi', url: pypiUrl }
];

/**
 * The navbar, in every locale: the prose, the functions, and where to get them.
 *
 * **API** is a dropdown over the same pages the sidebar's function groups hold,
 * split the same way: what generates a name, a nickname or a word, what
 * decorates a string, and what answers a question about a language. Not split
 * by `name/` versus `nickname/` — a reader looking for `randNickname` is
 * looking for a function, not for the corner of the library it belongs to.
 * `navGroupsFor` is what keeps the menu and those sections in step.
 *
 * The sidebar's **Words** group, nested inside Generators beside **General**,
 * is the one left out — and it says so itself, with `sidebarOnly` on the group
 * rather than an omission here. Fourteen names for `randWord` with its argument
 * decided would double the menu and say nothing `randWord` does not; the
 * sidebar lists them, and the dropdown points at the function they all are.
 */
const navFor = (lang: string, labels: { demo: string; guide: string; packages: string }) => [
	{ text: labels.guide, link: `${localeBase(lang, defaultLocale)}guide/getting-started` },
	{ text: labels.demo, link: `${localeBase(lang, defaultLocale)}demo` },
	{
		text: 'API',
		items: navGroupsFor(['generators', 'decorators', 'utilities'], lang, defaultLocale)
	},
	{
		text: labels.packages,
		items: [{ component: 'PackageLinks', props: { links: packageLinks } }]
	}
];

/** The site's own sentence. Read twice: once by a crawler, once by `llms.txt`. */
const siteDescription =
	'Random person names and nicknames in the language you ask for — Korean, English, Japanese, Chinese and five more. One library, shipped for JavaScript, Dart and Python, with no runtime dependencies.';

const vitePressI18nConfig: VitePressI18nOptions = {
	locales: supportLocales,
	rootLocale: defaultLocale,
	searchProvider: 'local',
	description: {
		en: siteDescription,
		ko: '요청한 언어로 사람 이름과 닉네임을 무작위로 생성합니다. 한국어, 영어, 일본어, 중국어를 포함한 9개 언어를 지원하며, JavaScript, Dart, Python 패키지로 제공되고 런타임 의존성이 없습니다.'
	},
	themeConfig: {
		en: {
			nav: navFor('en', { demo: 'Demo', guide: 'Guide', packages: 'Packages' }),
			sidebar: { '/': { items: sidebarFor('en', defaultLocale) } }
		},
		ko: {
			nav: navFor('ko', { demo: '데모', guide: '가이드', packages: '패키지' }),
			sidebar: { '/ko/': { items: sidebarFor('ko', defaultLocale) } }
		}
	}
};

/* ---------------------------------------------------------------------------
 * Search engines
 *
 * Two things a documentation site gets wrong by default, and both of them are
 * per page rather than per site:
 *
 * - **Every page ships the same description.** VitePress falls back to the
 *   site's own whenever a page declares none, so every page carries one sentence
 *   between them and not one of them says what it is about. There is already a
 *   better sentence on nearly every page — the first paragraph under the title —
 *   so it is read out of the source.
 * - **Nothing says the two locales are the same page.** Without `hreflang` a
 *   crawler has no reason to connect `/name/rand-name` to its Korean
 *   counterpart, and treats them as two documents competing for one query.
 * ------------------------------------------------------------------------- */

/** The BCP-47 tag the site itself declares for a locale — `en` → `en-US`. */
function langTagOf(siteData: SiteData, lang: string): string {
	return siteData.locales[lang === defaultLocale ? 'root' : lang]?.lang ?? lang;
}

/** `en/name/rand-name.md` → `/name/rand-name`. */
function pathOf(filePath: string): string {
	const [lang, ...rest] = filePath.split('/');
	const page = rest
		.join('/')
		.replace(/(^|\/)index\.md$/, '$1')
		.replace(/\.md$/, '');

	return `${localeBase(lang, defaultLocale)}${page}`;
}

/** Everything below the locale folder — the part two locales have in common. */
function pageOf(filePath: string): string {
	return filePath.split('/').slice(1).join('/');
}

/**
 * Inline Markdown and HTML dropped: a `<meta>` carries text and nothing else.
 *
 * `<Lang>` is resolved rather than stripped — dropping it leaves a hole in the
 * middle of the sentence, which is what a summary is made of. `_` is left alone
 * for the same reason: it is a separator inside `멋진사자_nVtRC` far more often
 * than it is emphasis, and the paragraphs this reads use `*` for that.
 */
function plainText(source: string): string {
	return inlineLang(source)
		.replace(/<[^>]+>/g, ' ')
		.replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
		.replace(/[`*]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Cut at a word boundary, to about what a result page will show whole. */
function clamp(text: string, limit = 160): string {
	if (text.length <= limit) {
		return text;
	}

	const cut = text.slice(0, limit);
	const boundary = cut.lastIndexOf(' ');

	return `${(boundary > 0 ? cut.slice(0, boundary) : cut).trimEnd()}…`;
}

/**
 * A page's own one-line summary: its first paragraph of prose, which is written
 * to be exactly this. Not the title, not a fenced example, not a container.
 */
function summaryOf(filePath: string): string | undefined {
	const file = resolve(srcDir, filePath);

	if (!existsSync(file)) {
		return undefined;
	}

	const source = readFileSync(file, 'utf8');

	for (const block of source.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').split(/\n\s*\n/)) {
		const trimmed = block.trim();

		if (!trimmed || /^[#<`:|>-]/.test(trimmed)) {
			continue;
		}

		const text = plainText(trimmed);

		if (text) {
			return clamp(text);
		}
	}

	return undefined;
}

/** The locales that actually have this page — a mirror is not a guarantee. */
function localesWith(filePath: string): string[] {
	const page = pageOf(filePath);

	return supportLocales.filter((lang) => existsSync(resolve(srcDir, lang, page)));
}

/** What the library is, for the one page in each locale that is about it. */
function structuredData(description: string, url: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareSourceCode',
		name: 'randino',
		description,
		url,
		codeRepository: repoUrl,
		programmingLanguage: ['TypeScript', 'Dart'],
		license: 'https://opensource.org/licenses/MIT',
		author: { '@type': 'Organization', name: 'CDGet', url: 'https://cdget.com' },
		sameAs: [repoUrl, npmUrl, pubUrl, pypiUrl]
	};
}

/**
 * The half of the metadata that is different on every page. Only runs at build
 * time — `transformPageData` is what the dev server sees — so the tags below are
 * checked by reading a built page, not the preview.
 */
function transformHead({ pageData, siteData, title, description }: TransformContext): HeadConfig[] {
	const { filePath } = pageData;

	// A dynamic route, or the built-in 404: no source file, so no canonical URL
	// and nothing to point an alternate at.
	if (!filePath) {
		return [];
	}

	const lang = filePath.split('/')[0];
	const url = `${siteUrl}${pathOf(filePath)}`;
	const translations = localesWith(filePath);

	// Open Graph writes a BCP-47 tag with an underscore in it, and nothing else.
	const ogLocale = (of: string) => langTagOf(siteData, of).replace('-', '_');

	const head: HeadConfig[] = [
		['link', { rel: 'canonical', href: url }],
		['meta', { property: 'og:url', content: url }],
		['meta', { property: 'og:title', content: title }],
		['meta', { property: 'og:description', content: description }],
		['meta', { property: 'og:locale', content: ogLocale(lang) }],
		['meta', { name: 'twitter:title', content: title }],
		['meta', { name: 'twitter:description', content: description }]
	];

	for (const other of translations) {
		head.push([
			'link',
			{
				rel: 'alternate',
				hreflang: langTagOf(siteData, other),
				href: `${siteUrl}${pathOf(`${other}/${pageOf(filePath)}`)}`
			}
		]);

		if (other !== lang) {
			head.push(['meta', { property: 'og:locale:alternate', content: ogLocale(other) }]);
		}
	}

	// Which one a crawler should serve to a reader it cannot place. The default
	// locale is the one that is served from `/`.
	if (translations.includes(defaultLocale)) {
		head.push([
			'link',
			{
				rel: 'alternate',
				hreflang: 'x-default',
				href: `${siteUrl}${pathOf(`${defaultLocale}/${pageOf(filePath)}`)}`
			}
		]);
	}

	if (pageData.frontmatter.layout === 'home') {
		head.push([
			'script',
			{ type: 'application/ld+json' },
			JSON.stringify(structuredData(description, url))
		]);
	}

	return head;
}

/* ---------------------------------------------------------------------------
 * The demo page runs the real library
 *
 * `/demo` calls `randName` and `randNickname` in the reader's browser, and it
 * calls **this repository's** copy of them rather than a published one. Two
 * lines make that work, and both are here rather than in the component:
 *
 * - The alias points the bare specifier `randino` at the package's TypeScript
 *   entry point. Depending on `randino` from npm instead would pin the demo to
 *   the last release, so a page documenting an option added since would demo a
 *   build that does not have it — the exact drift this site exists to avoid.
 * - The plugin below rewrites the package's own `./x.js` imports to `./x.ts`.
 *   Those extensions are deliberate (the built ESM needs them at run time) and
 *   Vite cannot resolve them against source files on its own.
 * ------------------------------------------------------------------------- */

const packageSrc = resolve(rootDir, 'packages/javascript/lib');

const randinoSource: Plugin = {
	name: 'randino-source',
	enforce: 'pre',
	resolveId(source, importer) {
		if (!importer || !source.startsWith('.') || !source.endsWith('.js')) {
			return null;
		}

		return importer.split('?')[0].startsWith(packageSrc)
			? resolve(dirname(importer.split('?')[0]), source.replace(/\.js$/, '.ts'))
			: null;
	}
};

// Ref: https://vitepress.dev/reference/site-config
const vitePressConfig: UserConfig = {
	title: 'randino',
	lastUpdated: true,
	outDir: '../docs-dist',
	cleanUrls: true,
	metaChunk: true,
	/**
	 * The default locale is served from `/`, not from `/{lang}/`.
	 *
	 * This has to agree with two other things or every sidebar link 404s:
	 * `vitepress-i18n` puts the root locale in `locales.root` (no path prefix),
	 * and `data/sidebar.ts` resolves its links against `/`. The rewrite is what
	 * actually moves `docs/{defaultLocale}/**` there. Every other locale keeps its
	 * folder as its prefix. Switching `defaultLocale` swings all three together.
	 */
	rewrites: {
		[`${defaultLocale}/:rest*`]: ':rest*'
	},
	head: [
		// PNG first for anything modern, `favicon.ico` behind it for the browsers
		// and the Windows surfaces that still ask for one by that name.
		['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/logo-32.png' }],
		['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/logo-16.png' }],
		['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		// Its own file rather than one of the square marks: iOS composites a
		// transparent home-screen icon on black, so this one has its background
		// painted in.
		['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
		['meta', { name: 'theme-color', content: '#0b173d' }],
		// The half of the metadata that is the same on every page. The other half —
		// the canonical URL, the title, the description, the locale alternates — is
		// per page and lives in `transformHead`.
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:site_name', content: 'randino' }],
		['meta', { property: 'og:image', content: socialImage }],
		['meta', { property: 'og:image:width', content: '512' }],
		['meta', { property: 'og:image:height', content: '512' }],
		['meta', { property: 'og:image:alt', content: 'randino' }],
		// `summary` and not `summary_large_image`: the image is a square mark, and a
		// wide card would letterbox it into a strip of background.
		['meta', { name: 'twitter:card', content: 'summary' }],
		['meta', { name: 'twitter:image', content: socialImage }],
		// Which package's half of every page is displayed, applied to `<html>`
		// before the first paint. See `data/languages.ts`.
		['script', {}, CODE_LANGUAGE_HEAD_SCRIPT]
	],
	sitemap: {
		hostname: siteUrl
	},
	vite: {
		plugins: [randinoSource],
		resolve: {
			alias: { randino: resolve(packageSrc, 'index.ts') }
		},
		// The package sits outside `docs/`, which the dev server will not serve from
		// unless it is told to.
		server: { fs: { allow: [rootDir] } }
	},
	/**
	 * The three files that are written rather than committed.
	 *
	 * `robots.txt` exists to name the sitemap, and the sitemap's own URL is
	 * already derived from the package manifest — a copy of that host sitting in
	 * `public/` would be one more place to forget when the site moves. `llms.txt`
	 * and `llms-full.txt` are generated for the same reason, at more length: see
	 * the comment at the top of `llms.ts`.
	 */
	async buildEnd({ outDir }) {
		await writeFile(
			resolve(outDir, 'robots.txt'),
			`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
		);

		await writeLlmsFiles({
			outDir,
			srcDir,
			siteUrl,
			repoUrl,
			description: siteDescription,
			summaryOf,
			packages: packageLinks.map(({ registry, url }) => ({ registry, url }))
		});
	},
	/**
	 * A description that is about this page rather than about the library. Runs in
	 * the dev server as well as in the build, which is what makes it the right
	 * place for the description — `transformHead` would have to repeat the
	 * fallback chain VitePress already applies to `pageData.description`.
	 */
	transformPageData(pageData) {
		if (!pageData.description && pageData.filePath) {
			pageData.description = summaryOf(pageData.filePath) ?? '';
		}
	},
	transformHead,
	/**
	 * `::: lang js` … `:::` — the block that only one package sees.
	 *
	 * Both packages' blocks are in the document and CSS displays one of them,
	 * which is what makes the switch instant and what keeps the two halves from
	 * being two pages that drift apart. It also means the search index carries
	 * both, so a reader looking up `NameLanguage.ko` finds the page whichever
	 * package they had selected.
	 */
	markdown: {
		config(md: MarkdownRenderer) {
			md.use(container, 'lang', {
				validate: (params: string) => /^lang(\s+\S+)+$/.test(params.trim()),
				render(tokens: { nesting: number; info: string }[], index: number) {
					const token = tokens[index];

					if (token.nesting !== 1) {
						return '</div>\n';
					}

					// `::: lang dart`, and `::: lang js dart` for a block both of them want
					// but a third language would not.
					const wanted = token.info
						.trim()
						.split(/\s+/)
						.slice(1)
						.filter((id) => CODE_LANGUAGE_IDS.includes(id));

					return `<div class="randino-lang" data-lang="${wanted.join(' ')}">\n`;
				}
			});
		}
	},
	themeConfig: {
		logo: { src: '/logo-32.png', width: 24, height: 24 },
		/**
		 * `h2` and `h3`, nested. A reference page is one `h2` — Options — with a
		 * dozen `h3`s under it, and at the default depth the outline lists four
		 * words for a page that is ten screens long.
		 */
		outline: { level: [2, 3] },
		editLink: {
			pattern: editLinkPattern
		},
		/*
		 * The source, and only the source. The three registries used to sit here too,
		 * which put four icons in a corner that also holds the locale switch and the
		 * appearance toggle — they are in the navbar's Packages menu now, where each
		 * one gets a name instead of being a logo the reader has to recognise.
		 */
		socialLinks: [{ icon: 'github', link: repoUrl }],
		footer: {
			message: 'Released under the MIT License',
			copyright: '© <a href="https://cdget.com">CDGet</a>'
		}
	}
};

export default defineConfig(withI18n(vitePressConfig, vitePressI18nConfig));
