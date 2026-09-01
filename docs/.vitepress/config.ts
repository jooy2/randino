import { existsSync, readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import container from 'markdown-it-container';
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
import { localeBase, navGroupFor, sidebarFor } from './data/sidebar';

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
 * Dart's own logo, for the pub.dev link in the navbar.
 *
 * A social link's icon is either a name VitePress ships or an SVG string, and
 * there is no name for pub.dev. `currentColor` on the path is what lets the
 * navbar hover it like the icons beside it.
 */
const dartIcon =
	'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
	'<title>pub.dev</title>' +
	'<path fill="currentColor" d="M4.105 4.105S9.158 1.58 11.684.316a3.1 3.1 0 0 1 1.481-.315c.766.047 ' +
	'1.677.788 1.677.788L24 9.948v9.789h-4.263V24H9.789l-9-9C.303 14.5 0 13.795 0 13.105c0-.319.18-.818' +
	'.316-1.105zm.679.679v11.787c.002.543.021 1.024.498 1.508L10.204 23h8.533v-4.263zm12.055-.678c-.899' +
	'-.896-1.809-1.78-2.74-2.643c-.302-.267-.567-.468-1.07-.462c-.37.014-.87.195-.87.195L6.341 4.105z"/>' +
	'</svg>';

/** Python's own logo, for the PyPI link in the navbar — see `dartIcon`. */
const pypiIcon =
	'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
	'<title>PyPI</title>' +
	'<path fill="currentColor" d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2' +
	'-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8' +
	'.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17' +
	'l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05' +
	'-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06' +
	'.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58' +
	'-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09' +
	'.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36' +
	'.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45' +
	'-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31' +
	'-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14' +
	'-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64' +
	'.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59' +
	'-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 ' +
	'14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23' +
	'-.41-.08-.41.08z"/>' +
	'</svg>';

/**
 * The navbar, in every locale: the prose, and then the functions.
 *
 * **API** is a dropdown over the same pages the sidebar's API group holds, and
 * it is one list rather than a Person names menu and a Nicknames menu — a reader
 * looking for `randomNickname` is looking for a function, not for the half of
 * the library it belongs to. `navGroupFor` is what keeps the two in step.
 */
const navFor = (lang: string, guide: string) => [
	{ text: guide, link: `${localeBase(lang, defaultLocale)}guide/getting-started` },
	{ text: 'API', items: navGroupFor('api', lang, defaultLocale) }
];

const vitePressI18nConfig: VitePressI18nOptions = {
	locales: supportLocales,
	rootLocale: defaultLocale,
	searchProvider: 'local',
	description: {
		en: 'Random person names and nicknames in the language you ask for — Korean, English, Japanese, Chinese and five more. One library, shipped for JavaScript, Dart and Python, with no runtime dependencies.',
		ko: '요청한 언어로 사람 이름과 닉네임을 무작위로 생성합니다. 한국어, 영어, 일본어, 중국어를 포함한 9개 언어를 지원하며, JavaScript, Dart, Python 패키지로 제공되고 런타임 의존성이 없습니다.'
	},
	themeConfig: {
		en: {
			nav: navFor('en', 'Guide'),
			sidebar: { '/': { items: sidebarFor('en', defaultLocale) } }
		},
		ko: {
			nav: navFor('ko', '가이드'),
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
 *   crawler has no reason to connect `/name/random-name` to its Korean
 *   counterpart, and treats them as two documents competing for one query.
 * ------------------------------------------------------------------------- */

/** The BCP-47 tag the site itself declares for a locale — `en` → `en-US`. */
function langTagOf(siteData: SiteData, lang: string): string {
	return siteData.locales[lang === defaultLocale ? 'root' : lang]?.lang ?? lang;
}

/** `en/name/random-name.md` → `/name/random-name`. */
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

/** Inline Markdown and HTML dropped: a `<meta>` carries text and nothing else. */
function plainText(source: string): string {
	return source
		.replace(/<[^>]+>/g, ' ')
		.replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
		.replace(/[`*_]/g, '')
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
	/**
	 * `robots.txt`, written rather than committed. It exists to name the sitemap,
	 * and the sitemap's own URL is already derived from the package manifest — a
	 * copy of that host sitting in `public/` would be one more place to forget
	 * when the site moves.
	 */
	async buildEnd({ outDir }) {
		await writeFile(
			resolve(outDir, 'robots.txt'),
			`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
		);
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
		 * One per place the library is published, plus the source. VitePress knows
		 * npm and GitHub by name and has never heard of pub.dev, so that one arrives
		 * as a drawing.
		 */
		socialLinks: [
			{ icon: 'npm', link: npmUrl },
			{ icon: { svg: dartIcon }, link: pubUrl, ariaLabel: 'pub.dev' },
			{ icon: { svg: pypiIcon }, link: pypiUrl, ariaLabel: 'PyPI' },
			{ icon: 'github', link: repoUrl }
		],
		footer: {
			message: 'Released under the MIT License',
			copyright: '© <a href="https://cdget.com">CDGet</a>'
		}
	}
};

export default defineConfig(withI18n(vitePressConfig, vitePressI18nConfig));
