// Writes the body of a GitHub release out of one package's `CHANGELOG.md`.
//
// Usage: node .github/scripts/release-notes.mjs javascript-v1.3.0 > notes.md
//
// The packages version independently, so a tag names the package as well as the
// version: `javascript-v1.3.0`, `dart-v1.3.0` or `python-v1.3.0`. The body is
// that version's section, from the line under its heading to the next `## `,
// with a link to every release under it. A section that is not ready is refused
// rather than published: one that is missing, one with no date, or one with
// nothing in it — which is what a tag on a commit that never cut the version
// would otherwise put on the release page.
//
// The links are read out of the npm package's `homepage` and `repository`, the
// same fields the documentation site derives its own URLs from.

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

// The tag prefix of each package, and the folder that holds its changelog.
const PACKAGES = {
	javascript: 'packages/javascript',
	dart: 'packages/dart',
	python: 'packages/python'
};

// The page on the documentation site that shows every package's changelog.
const DOCS_CHANGELOG = '/changelog';

// GitHub rejects a release body longer than this.
const BODY_MAX = 125000;

const tag = process.argv[2] ?? '';
const match = tag.match(/^([a-z]+)-v(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/);

if (!match || !(match[1] in PACKAGES)) {
	const examples = Object.keys(PACKAGES).map((name) => `${name}-v1.0.0`);

	throw new Error(`release-notes: "${tag}" is not a tag such as ${examples.join(', ')}`);
}

const [, name, version] = match;
const changelogPath = join(PACKAGES[name], 'CHANGELOG.md');
const lines = readFileSync(resolve(ROOT, changelogPath), 'utf8').split('\n');
const heading = `## ${version}`;
const start = lines.findIndex((line) => line === heading || line.startsWith(`${heading} `));

if (start === -1) {
	throw new Error(`release-notes: ${changelogPath} has no "${heading}" section`);
}

if (!/^## \S+ \(\d{4}-\d{2}-\d{2}\)$/.test(lines[start])) {
	throw new Error(
		`release-notes: "${lines[start]}" is not dated as "${heading} (YYYY-MM-DD)"; cut the release first`
	);
}

const next = lines.findIndex((line, index) => index > start && line.startsWith('## '));
const section = lines
	.slice(start + 1, next === -1 ? undefined : next)
	.join('\n')
	.trim();

if (section === '') {
	throw new Error(`release-notes: the ${version} section of ${changelogPath} is empty`);
}

const manifest = JSON.parse(
	readFileSync(resolve(ROOT, PACKAGES.javascript, 'package.json'), 'utf8')
);
const homepage = manifest.homepage.replace(/\/$/, '');
const repository = manifest.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
const docsLink = `[the changelog on the documentation site](${homepage}${DOCS_CHANGELOG})`;
const fileLink = `[\`${changelogPath}\` at this tag](${repository}/blob/${tag}/${changelogPath})`;
const footer = `Every release of this package is in ${docsLink} and in ${fileLink}.`;
const body = `${section}\n\n---\n\n${footer}\n`;

process.stdout.write(
	body.length <= BODY_MAX
		? body
		: `The list of changes is too long for a release page; read it in ${docsLink} or in ${fileLink}.\n`
);
