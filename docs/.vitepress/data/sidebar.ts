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
 * function they are about to call does not care which folder it lives in. The
 * split here is by what a function *is*, one level down inside **API**:
 * **Generators** hand back names, nicknames and words out of nothing, **Word
 * themes** are the fourteen of them that answer `theme` rather than taking it,
 * **Decorators** attach something to a string you already have, and
 * **Utilities** answer a question about a language. The folder a page sits in
 * decides nothing but its URL.
 *
 * **Word themes is its own group and not fourteen more Generators.** They are
 * one generator with an argument decided, so listing them beside `randWord`
 * would bury it; and they are the group the navbar's API dropdown leaves out,
 * because fourteen entries in a menu is a wall rather than a menu. Every other
 * group is in both.
 *
 * **Behaviour** holds the prose explaining how a generator's options behave,
 * where there is enough of it to be its own page — `randName` and
 * `randNickname` have one each, `randWord` does not. It is a group of its own
 * rather than more entries under Guide, because it grows alongside Generators
 * and Guide does not.
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

/** A section of the menu. Its `items` are pages, or — one level down — sections. */
export interface SidebarGroup {
	/** Only for a group the navbar also renders — see `navGroupsFor`. */
	id?: string;
	en: string;
	ko: string;
	items: (SidebarPage | SidebarGroup)[];
}

/** The two are told apart by `path`, which only a page has. */
function isPage(entry: SidebarPage | SidebarGroup): entry is SidebarPage {
	return 'path' in entry;
}

export const SIDEBAR: SidebarGroup[] = [
	{
		en: 'Guide',
		ko: '가이드',
		items: [
			{ path: 'demo', en: 'Demo', ko: '데모' },
			{ path: 'guide/getting-started', en: 'Getting started', ko: '시작하기' },
			{ path: 'guide/languages', en: 'Supported languages', ko: '지원 언어' }
		]
	},
	{
		en: 'API',
		ko: 'API',
		items: [
			{
				id: 'generators',
				en: 'Generators',
				ko: '생성 함수',
				items: [
					{ path: 'name/rand-name', en: 'randName', ko: 'randName' },
					{ path: 'nickname/rand-nickname', en: 'randNickname', ko: 'randNickname' },
					{ path: 'word/rand-word', en: 'randWord', ko: 'randWord' }
				]
			},
			{
				id: 'word-themes',
				en: 'Word themes',
				ko: '단어 테마',
				items: [
					{ path: 'word/rand-animal', en: 'randAnimal', ko: 'randAnimal' },
					{ path: 'word/rand-object', en: 'randObject', ko: 'randObject' },
					{ path: 'word/rand-nature', en: 'randNature', ko: 'randNature' },
					{ path: 'word/rand-plant', en: 'randPlant', ko: 'randPlant' },
					{ path: 'word/rand-gem', en: 'randGem', ko: 'randGem' },
					{ path: 'word/rand-concept', en: 'randConcept', ko: 'randConcept' },
					{ path: 'word/rand-myth', en: 'randMyth', ko: 'randMyth' },
					{ path: 'word/rand-job', en: 'randJob', ko: 'randJob' },
					{ path: 'word/rand-music', en: 'randMusic', ko: 'randMusic' },
					{ path: 'word/rand-place', en: 'randPlace', ko: 'randPlace' },
					{ path: 'word/rand-food', en: 'randFood', ko: 'randFood' },
					{ path: 'word/rand-sport', en: 'randSport', ko: 'randSport' },
					{ path: 'word/rand-vehicle', en: 'randVehicle', ko: 'randVehicle' },
					{ path: 'word/rand-product', en: 'randProduct', ko: 'randProduct' }
				]
			},
			{
				id: 'decorators',
				en: 'Decorators',
				ko: '장식 함수',
				items: [
					{ path: 'decorate/rand-suffix', en: 'randSuffix', ko: 'randSuffix' },
					{ path: 'decorate/rand-prefix', en: 'randPrefix', ko: 'randPrefix' },
					{ path: 'decorate/rand-modifier', en: 'randModifier', ko: 'randModifier' }
				]
			},
			{
				id: 'utilities',
				en: 'Utilities',
				ko: '유틸리티',
				items: [
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
					},
					{ path: 'word/word-length-range', en: 'wordLengthRange', ko: 'wordLengthRange' }
				]
			}
		]
	},
	{
		en: 'Behaviour',
		ko: '동작 방식',
		items: [
			{ path: 'name/', en: 'Person names', ko: '사람 이름' },
			{ path: 'nickname/', en: 'Nicknames', ko: '닉네임' }
		]
	},
	{
		en: 'Reference',
		ko: '레퍼런스',
		items: [
			{ path: 'word/themes', en: 'Themes', ko: '테마' },
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

	/** A page becomes a link, a group becomes a section holding more of both. */
	const entryFor = (entry: SidebarPage | SidebarGroup): object =>
		isPage(entry)
			? { text: labelOf(entry, lang), link: `${base}${entry.path}` }
			: { text: labelOf(entry, lang), items: entry.items.map(entryFor) };

	return SIDEBAR.map(entryFor);
}

/** The group marked with this `id`, however deep it sits. */
function groupById(entries: (SidebarPage | SidebarGroup)[], id: string): SidebarGroup | undefined {
	for (const entry of entries) {
		if (isPage(entry)) {
			continue;
		}

		if (entry.id === id) {
			return entry;
		}

		const nested = groupById(entry.items, id);

		if (nested) {
			return nested;
		}
	}

	return undefined;
}

/**
 * Some of the groups again, as the sections of one navbar dropdown.
 *
 * The navbar's API menu and the sidebar's two function groups are the same
 * lists, so they are the same lists — a menu that quietly stops matching the
 * section it points into is the kind of thing only the reader notices.
 */
export function navGroupsFor(ids: string[], lang: string, defaultLocale: string) {
	const base = localeBase(lang, defaultLocale);

	return ids.map((id) => {
		const group = groupById(SIDEBAR, id);

		if (!group) {
			throw new Error(`No sidebar group is marked \`id: '${id}'\``);
		}

		return {
			text: labelOf(group, lang),
			items: group.items.filter(isPage).map((page) => ({
				text: labelOf(page, lang),
				link: `${base}${page.path}`
			}))
		};
	});
}
