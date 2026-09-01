/**
 * The menu, written out rather than derived from the folder tree.
 *
 * `vitepress-sidebar` would build it from the files, and for a site of a dozen
 * reference pages that trade is the wrong way round: the generator has to be
 * told the order through frontmatter, told the group names through index pages,
 * and then post-processed anyway wherever a Korean heading is not what the
 * English folder is called. Written out, the two locales are one structure with
 * two label columns — which is also what stops them from drifting into
 * different shapes.
 *
 * Every `path` here has to exist as `en/<path>.md` **and** `ko/<path>.md`, or
 * VitePress fails the build on a dead link. That is the check, and it is why
 * there is no "optional page" in this file.
 */

export interface SidebarPage {
	/** Path under the locale folder, without the extension. */
	path: string;
	en: string;
	ko: string;
}

export interface SidebarGroup {
	en: string;
	ko: string;
	items: SidebarPage[];
}

export const SIDEBAR: SidebarGroup[] = [
	{
		en: 'Guide',
		ko: '가이드',
		items: [
			{ path: 'guide/getting-started', en: 'Getting started', ko: '시작하기' },
			{ path: 'guide/languages', en: 'Supported languages', ko: '지원 언어' }
		]
	},
	{
		en: 'Person names',
		ko: '사람 이름',
		items: [{ path: 'name/', en: 'Overview', ko: '개요' }]
	},
	{
		en: 'Nicknames',
		ko: '닉네임',
		items: [{ path: 'nickname/', en: 'Overview', ko: '개요' }]
	}
];

/** `/` for the default locale, `/{lang}/` for every other one. */
export function localeBase(lang: string, defaultLocale: string): string {
	return lang === defaultLocale ? '/' : `/${lang}/`;
}

export function sidebarFor(lang: string, defaultLocale: string) {
	const base = localeBase(lang, defaultLocale);
	const label = (entry: SidebarGroup | SidebarPage) => (lang === 'ko' ? entry.ko : entry.en);

	return SIDEBAR.map((group) => ({
		text: label(group),
		items: group.items.map((page) => ({
			text: label(page),
			link: `${base}${page.path}`
		}))
	}));
}
