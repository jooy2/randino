/**
 * The programming languages randino ships for, and the one axis of this site
 * that is not a human language.
 *
 * A page says the same things about `randomName` whichever package a reader
 * installs — the same options, the same pools, the same reasons — and only the
 * code, the parameter shape and the install line differ. So the two are not two
 * sites and not two folders: they are one page with the parts that differ marked
 * up, and this file is what marks them.
 *
 * Adding a language is an entry here plus the `::: lang <id>` blocks on whatever
 * pages have something to say about it. Nothing else reads the list.
 */

export interface CodeLanguage {
	id: string;
	/** What the sidebar's switch shows. */
	label: string;
	/** The package name in that ecosystem's registry. */
	pkg: string;
	/** The fence language its code samples are written in. */
	fence: string;
	/**
	 * The brand's own colour, for the mark beside the label. The one place this
	 * site paints something that is not its own — because a logo in the wrong
	 * colour is a worse logo, and the mark identifies the choice here rather than
	 * decorating it.
	 */
	tint: string;
}

export const CODE_LANGUAGES: CodeLanguage[] = [
	{ id: 'js', label: 'JavaScript', pkg: 'randino', fence: 'javascript', tint: '#F7DF1E' },
	{ id: 'dart', label: 'Dart', pkg: 'randino', fence: 'dart', tint: '#0175C2' }
];

export const CODE_LANGUAGE_IDS: string[] = CODE_LANGUAGES.map((language) => language.id);

export const DEFAULT_CODE_LANGUAGE = 'js';

/**
 * Where the choice is remembered.
 *
 * Deliberately not in the URL. A reader who has picked Dart has picked it for
 * the whole site, and a query string would have to be carried by every link on
 * every page — including the ones written by hand in prose.
 */
export const CODE_LANGUAGE_STORAGE_KEY = 'randino-lang';

/**
 * The choice, applied to `<html>` before the page paints.
 *
 * This runs as a blocking inline script in `<head>` rather than from the app,
 * for the reason every no-flash theme switch does: the choice decides which half
 * of a page is displayed, and a reader who picked Dart would otherwise watch the
 * JavaScript half render and disappear. Written as a string because it has to be
 * inlined into the document rather than imported.
 */
export const CODE_LANGUAGE_HEAD_SCRIPT = `(function(){var i=${JSON.stringify(
	CODE_LANGUAGE_IDS
)},v;try{v=localStorage.getItem(${JSON.stringify(
	CODE_LANGUAGE_STORAGE_KEY
)})}catch(e){}document.documentElement.dataset.lang=i.indexOf(v)<0?${JSON.stringify(
	DEFAULT_CODE_LANGUAGE
)}:v})()`;
