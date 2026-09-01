/**
 * Builds `docs/<locale>/changelog.md` from the packages' own changelogs.
 *
 * The packages version independently and each keeps the changelog its registry
 * reads from its own root, so there is no single file to link to — and a
 * hand-maintained copy under `docs/` would be one more place to forget. Instead
 * all of them are read at build time and folded into one page, each inside the
 * `::: lang` block that shows it only to the reader who picked that package.
 *
 * The output is generated, so it is git-ignored and Prettier-ignored. Run
 * through `npm run changelog`, which `npm run dev` and `npm run build` both do
 * first.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rootDir = resolve(docsDir, '..');

const LOCALES = ['en', 'ko'];

const PACKAGES = [
	{ id: 'js', dir: 'packages/javascript', registry: 'npm', name: 'randino' },
	{ id: 'dart', dir: 'packages/dart', registry: 'pub.dev', name: 'randino' },
	{ id: 'py', dir: 'packages/python', registry: 'PyPI', name: 'randino' }
];

const STRINGS = {
	en: {
		title: 'Changelog',
		lede: 'Each package versions on its own, so the lists below do not line up — a release on one side is not a release on the others. Pick a package in the sidebar to read its changelog.',
		source: (registry, name) => `Released as \`${name}\` on ${registry}.`
	},
	ko: {
		title: '변경 내역',
		lede: '각 패키지는 독립적으로 버전을 관리하므로 아래 목록들의 버전 번호는 서로 일치하지 않습니다. 한쪽의 릴리스가 다른 쪽의 릴리스를 의미하지는 않습니다. 사이드바에서 패키지를 선택하면 해당 패키지의 변경 내역이 표시됩니다.',
		source: (registry, name) => `${registry} 패키지 이름은 \`${name}\`입니다.`
	}
};

/** The changelog body, with its own `# Changelog` heading dropped. */
async function bodyOf(dir) {
	const source = await readFile(resolve(rootDir, dir, 'CHANGELOG.md'), 'utf8');

	return source.replace(/^#\s+.*\r?\n/, '').trim();
}

async function main() {
	const bodies = await Promise.all(PACKAGES.map((pkg) => bodyOf(pkg.dir)));

	for (const locale of LOCALES) {
		const strings = STRINGS[locale];
		const sections = PACKAGES.map(
			(pkg, index) =>
				`::: lang ${pkg.id}\n\n${strings.source(pkg.registry, pkg.name)}\n\n${bodies[index]}\n\n:::`
		);

		const page = [
			'---',
			`title: ${strings.title}`,
			'---',
			'',
			`# ${strings.title}`,
			'',
			strings.lede,
			'',
			...sections,
			''
		].join('\n');

		const file = resolve(docsDir, locale, 'changelog.md');

		await mkdir(dirname(file), { recursive: true });
		await writeFile(file, page, 'utf8');
	}
}

await main();
