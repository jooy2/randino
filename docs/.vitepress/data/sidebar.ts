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
 * **The groups are not the folders.** `name/` and `nickname/` are two folders
 * because the two generators are two things, but a reader looking for the
 * function they are about to call does not care which folder it lives in — they
 * want the list of callable functions in one place. So the four generators and
 * the helper pages are one **API** group, the prose that explains how the
 * options behave is under **Guide**, and the folder a page sits in decides
 * nothing but its URL.
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
	/** Only for a group the navbar also renders — see `navGroupFor`. */
	id?: string;
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
			{ path: 'guide/languages', en: 'Supported languages', ko: '지원 언어' },
			{ path: 'name/', en: 'Person names', ko: '사람 이름' },
			{ path: 'nickname/', en: 'Nicknames', ko: '닉네임' }
		]
	},
	{
		id: 'api',
		en: 'API',
		ko: 'API',
		items: [
			{ path: 'name/random-name', en: 'randomName', ko: 'randomName' },
			{
				path: 'name/random-name-details',
				en: 'randomNameDetails',
				ko: 'randomNameDetails'
			},
			{ path: 'nickname/random-nickname', en: 'randomNickname', ko: 'randomNickname' },
			{
				path: 'nickname/random-nickname-details',
				en: 'randomNicknameDetails',
				ko: 'randomNicknameDetails'
			},
			{ path: 'name/name-length-range', en: 'nameLengthRange', ko: 'nameLengthRange' },
			{
				path: 'name/name-supports-middle-name',
				en: 'nameSupportsMiddleName',
				ko: 'nameSupportsMiddleName'
			},
			{
				path: 'name/name-supports-roman',
				en: 'nameSupportsRoman',
				ko: 'nameSupportsRoman'
			},
			{
				path: 'nickname/nickname-length-range',
				en: 'nicknameLengthRange',
				ko: 'nicknameLengthRange'
			}
		]
	},
	{
		en: 'Reference',
		ko: '레퍼런스',
		items: [
			{ path: 'nickname/themes', en: 'Themes', ko: '테마' },
			{ path: 'reference/constants', en: 'Constants', ko: '상수' },
			{ path: 'changelog', en: 'Changelog', ko: '변경 내역' }
		]
	}
];

/** `/` for the default locale, `/{lang}/` for every other one. */
export function localeBase(lang: string, defaultLocale: string): string {
	return lang === defaultLocale ? '/' : `/${lang}/`;
}

function labelOf(entry: SidebarGroup | SidebarPage, lang: string): string {
	return lang === 'ko' ? entry.ko : entry.en;
}

export function sidebarFor(lang: string, defaultLocale: string) {
	const base = localeBase(lang, defaultLocale);

	return SIDEBAR.map((group) => ({
		text: labelOf(group, lang),
		items: group.items.map((page) => ({
			text: labelOf(page, lang),
			link: `${base}${page.path}`
		}))
	}));
}

/**
 * One group's pages again, as the items of a navbar dropdown.
 *
 * The navbar's API menu and the sidebar's API group are the same list, so they
 * are the same list — a menu that quietly stops matching the section it points
 * into is the kind of thing that is only noticed by the reader.
 */
export function navGroupFor(id: string, lang: string, defaultLocale: string) {
	const base = localeBase(lang, defaultLocale);
	const group = SIDEBAR.find((entry) => entry.id === id);

	if (!group) {
		throw new Error(`No sidebar group is marked \`id: '${id}'\``);
	}

	return group.items.map((page) => ({
		text: labelOf(page, lang),
		link: `${base}${page.path}`
	}));
}
