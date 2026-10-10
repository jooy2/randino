import assert from 'assert';
import { describe, it } from 'node:test';
import {
	ORGANIZATION_INDUSTRIES,
	ORGANIZATION_TYPES,
	RAND_COUNT_MAX,
	RAND_ORGANIZATION_LENGTH_MAX,
	WORD_LANGUAGES,
	randOrganization
} from '../dist/index.js';
import type { OrganizationDetail, OrganizationType, WordLanguage } from '../dist/index.js';
// The datasets are internal, but an organization is only well formed if it is
// one of their templates with its gaps filled from their pools — these are what
// tie the output back to them.
import { ORGANIZATION_DATA, ORGANIZATION_TYPE_WEIGHTS } from '../dist/organization/data/index.js';
import { legalFormOf } from '../dist/organization/organizationGenerator.js';

const SAMPLE = 60;
const LARGE = 3000;

function escape(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function alternation(pool: readonly string[]): string {
	return `(?:${[...pool]
		.sort((a, b) => b.length - a.length)
		.map(escape)
		.join('|')})`;
}

/** Every word a language's companies can carry for their business. */
function descriptorsOf(language: WordLanguage): string[] {
	const data = ORGANIZATION_DATA[language];

	return [...data.generic, ...ORGANIZATION_INDUSTRIES.flatMap((each) => data.industries[each])];
}

/**
 * A template as a pattern that matches what it can write. `stem` is what a stem
 * may be: the language's own stems, or anything at all for an invented one, in
 * which case the stem is captured.
 */
function patternOf(language: WordLanguage, template: string, stem: string): RegExp {
	const data = ORGANIZATION_DATA[language];
	const source = template
		.split(/(\{stem\}|\{industry\}|\{place\}|\{number\})/)
		.map((part) => {
			switch (part) {
				case '{stem}':
					return stem;
				case '{industry}':
					return alternation(descriptorsOf(language));
				case '{place}':
					return alternation(data.places ?? []);
				case '{number}':
					return '[1-9][0-9]*';
				default:
					return escape(part);
			}
		})
		.join('');

	return new RegExp(`^${source}$`, 'u');
}

/** The patterns a detail's name may match: its kind's templates, and a stem alone for a company. */
function patternsFor(detail: OrganizationDetail, stem: string): RegExp[] {
	const templates = [...ORGANIZATION_DATA[detail.language].templates[detail.type]];

	if (detail.type === 'company') {
		templates.push('{stem}');
	}

	return templates.map((template) => patternOf(detail.language, template, stem));
}

/**
 * The stem a detail's name was built from, read back out of the template it
 * matches. Where more than one does — `{stem}외국어고등학교` and `{stem}고등학교` —
 * the shortest stem is the one the more particular template left.
 */
function stemOf(detail: OrganizationDetail): string | null {
	const stems = patternsFor(detail, '(.+?)')
		.map((pattern) => detail.name.match(pattern)?.[1])
		.filter((stem): stem is string => stem !== undefined);

	return stems.length ? stems.reduce((a, b) => (b.length < a.length ? b : a)) : null;
}

/** Whether a name is one of its language's templates filled from its pools. */
function isWellFormed(detail: OrganizationDetail): boolean {
	const stems = alternation(ORGANIZATION_DATA[detail.language].stems);

	return patternsFor(detail, stems).some((pattern) => pattern.test(detail.name));
}

/** Whether `organization` is `name` with `legalForm` written around it the way the language does. */
function wearsItsForm(detail: OrganizationDetail): boolean {
	if (detail.legalForm === null) {
		return detail.organization === detail.name;
	}

	return ORGANIZATION_DATA[detail.language].legalForms.some(
		(form) =>
			legalFormOf(form) === detail.legalForm &&
			form.replace('{name}', detail.name) === detail.organization
	);
}

describe('Organization', () => {
	it('randOrganization returns one organization by default', () => {
		const organizations = randOrganization();

		assert.strictEqual(organizations.length, 1);
		assert.strictEqual(typeof organizations[0], 'string');
	});

	it('returns exactly `count` organizations', () => {
		for (const count of [0, 1, 7, 25]) {
			assert.strictEqual(randOrganization({ count }).length, count);
		}

		assert.strictEqual(randOrganization({ count: -3 }).length, 0);
		assert.strictEqual(randOrganization({ count: RAND_COUNT_MAX + 5 }).length, RAND_COUNT_MAX);
	});

	it('every name is one of the templates of its language, filled from its pools', () => {
		for (const language of WORD_LANGUAGES) {
			for (const detail of randOrganization({ language, count: SAMPLE * 3, output: 'detail' })) {
				assert.strictEqual(detail.language, language);
				assert.ok(isWellFormed(detail), `${language}: ${detail.name}`);
				assert.ok(wearsItsForm(detail), `${language}: ${detail.organization}`);
			}
		}
	});

	it('the value form is the whole organization', () => {
		for (const organization of randOrganization({ language: 'ko', count: SAMPLE })) {
			assert.ok(organization.length > 0);
		}

		assert.match(
			randOrganization({ language: 'ru', type: 'company', includeLegalForm: true })[0],
			/^(ООО|АО|ПАО) «.+»$/
		);
	});

	it('type narrows the kinds, one or several', () => {
		for (const type of ORGANIZATION_TYPES) {
			for (const detail of randOrganization({ type, count: SAMPLE, output: 'detail' })) {
				assert.strictEqual(detail.type, type);
			}
		}

		const kinds = new Set(
			randOrganization({ type: ['school', 'public'], count: SAMPLE, output: 'detail' }).map(
				(detail) => detail.type
			)
		);

		assert.deepStrictEqual([...kinds].sort(), ['public', 'school']);
	});

	it('every kind comes up when none is named, companies most often', () => {
		const counts = new Map<OrganizationType, number>();

		for (const detail of randOrganization({ count: LARGE, output: 'detail' })) {
			counts.set(detail.type, (counts.get(detail.type) ?? 0) + 1);
		}

		assert.strictEqual(counts.size, ORGANIZATION_TYPES.length);

		const most = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];

		assert.strictEqual(most, 'company');
		assert.strictEqual(
			Object.values(ORGANIZATION_TYPE_WEIGHTS).reduce((sum, weight) => sum + weight, 0),
			100
		);
	});

	it('an industry is carried by the name of the company, and asks for companies', () => {
		for (const language of WORD_LANGUAGES) {
			for (const industry of ORGANIZATION_INDUSTRIES) {
				const words = ORGANIZATION_DATA[language].industries[industry];

				for (const detail of randOrganization({
					language,
					industry,
					count: 12,
					output: 'detail'
				})) {
					assert.strictEqual(detail.type, 'company');
					assert.strictEqual(detail.industry, industry);
					assert.ok(
						words.some((word) => detail.name.includes(word)),
						`${language} ${industry}: ${detail.name}`
					);
				}
			}
		}
	});

	it('an industry narrows the companies among other kinds and leaves the rest alone', () => {
		const details = randOrganization({
			type: ['company', 'school'],
			industry: 'food',
			count: SAMPLE * 2,
			output: 'detail'
		});

		for (const detail of details) {
			assert.strictEqual(detail.industry, detail.type === 'company' ? 'food' : null);
		}

		assert.ok(details.some((detail) => detail.type === 'school'));
	});

	it('only a company carries an industry or a legal form', () => {
		for (const detail of randOrganization({ count: LARGE, output: 'detail' })) {
			if (detail.type !== 'company') {
				assert.strictEqual(detail.industry, null, detail.organization);
				assert.strictEqual(detail.legalForm, null, detail.organization);
			}
		}
	});

	it('includeLegalForm decides the legal form of every company, and left out leaves it to chance', () => {
		const companies = (includeLegalForm?: boolean) =>
			randOrganization({ type: 'company', includeLegalForm, count: SAMPLE * 3, output: 'detail' });

		assert.ok(companies(true).every((detail) => detail.legalForm !== null));
		assert.ok(companies(false).every((detail) => detail.legalForm === null));

		const either = companies();

		assert.ok(either.some((detail) => detail.legalForm !== null));
		assert.ok(either.some((detail) => detail.legalForm === null));
	});

	it('a company named by its stem alone always carries a legal form', () => {
		for (const detail of randOrganization({ type: 'company', count: LARGE, output: 'detail' })) {
			if (
				detail.industry === null &&
				ORGANIZATION_DATA[detail.language].stems.includes(detail.name)
			) {
				assert.notStrictEqual(detail.legalForm, null, detail.organization);
			}
		}

		for (const detail of randOrganization({
			type: 'company',
			includeLegalForm: false,
			count: SAMPLE * 3,
			output: 'detail'
		})) {
			assert.ok(!ORGANIZATION_DATA[detail.language].stems.includes(detail.name), detail.name);
		}
	});

	it('startsWith reads the name, not a legal form in front of it', () => {
		const leads: Record<WordLanguage, string> = {
			en: 'W',
			ko: '해',
			ja: '青',
			zh: '新',
			vi: 'C',
			es: 'C',
			it: 'C',
			de: 'S',
			ru: 'Ш'
		};

		for (const language of WORD_LANGUAGES) {
			const startsWith = leads[language];
			const details = randOrganization({ language, startsWith, count: SAMPLE, output: 'detail' });

			assert.strictEqual(details.length, SAMPLE, language);

			for (const detail of details) {
				assert.ok(
					detail.name.toLowerCase().startsWith(startsWith.toLowerCase()),
					`${language} ${startsWith}: ${detail.name}`
				);
			}
		}
	});

	it('a first character no stem starts with is answered with an invented one', () => {
		const names = randOrganization({ language: 'ko', startsWith: '퐁', count: SAMPLE });

		assert.strictEqual(names.length, SAMPLE);
		assert.ok(
			names.every((name) => name.replace(/^주식회사 |^유한회사 |^\(주\)/, '').startsWith('퐁'))
		);
		assert.deepStrictEqual(randOrganization({ language: 'ko', startsWith: 'Q', count: 5 }), []);
	});

	it('realism invents the stem and nothing else', () => {
		for (const language of WORD_LANGUAGES) {
			const { stems, syn } = ORGANIZATION_DATA[language];
			let invented = 0;
			const details = randOrganization({
				language,
				realism: 'invented',
				count: SAMPLE,
				output: 'detail'
			});

			let withStems = 0;

			for (const detail of details) {
				const stem = stemOf(detail);

				// A numbered school or station has no stem to invent.
				if (stem === null) {
					assert.ok(isWellFormed(detail), `${language}: ${detail.name} is no template's`);
					continue;
				}

				withStems += 1;

				if (!stems.includes(stem)) {
					invented += 1;
				}

				if (syn.kind === 'pool') {
					assert.ok(
						stem.split(syn.joiner || '').every((part) => syn.pool.includes(part)),
						`${language}: ${stem}`
					);
				}
			}

			// A stem spelled at random can be one the language already holds (다솔).
			assert.ok(invented > withStems * 0.8, `${language}: ${invented} of ${withStems}`);
		}
	});

	it('the length options bound the whole organization, legal form and all', () => {
		for (const language of WORD_LANGUAGES) {
			for (const organization of randOrganization({
				language,
				maxLength: 24,
				count: SAMPLE
			})) {
				assert.ok(organization.length <= 24, `${language}: ${organization}`);
			}

			for (const organization of randOrganization({ language, minLength: 12, count: SAMPLE })) {
				assert.ok(organization.length >= 12, `${language}: ${organization}`);
			}
		}

		// A range nothing reaches is answered with the closest, never with nothing.
		assert.strictEqual(randOrganization({ language: 'en', maxLength: 3, count: 5 }).length, 5);
	});

	it('the datasets are complete and every organization fits inside the ceiling', () => {
		for (const language of WORD_LANGUAGES) {
			const data = ORGANIZATION_DATA[language];
			const words = descriptorsOf(language);
			const longest = (pool: readonly string[]) => Math.max(0, ...pool.map((each) => each.length));

			assert.ok(data.stems.length >= 30, `${language} has too few stems`);
			assert.strictEqual(new Set(data.stems).size, data.stems.length, `${language} repeats a stem`);
			assert.strictEqual(new Set(words).size, words.length, `${language} repeats a business word`);
			assert.ok(data.legalForms.every((form) => form.includes('{name}')));

			for (const industry of ORGANIZATION_INDUSTRIES) {
				assert.ok(data.industries[industry].length >= 4, `${language} ${industry}`);
			}

			for (const template of data.templates.company) {
				assert.ok(template.includes('{industry}'), `${language}: ${template}`);
			}

			const stem = Math.max(
				longest(data.stems),
				data.syn.kind === 'pool'
					? data.syn.maxSyllables * (longest(data.syn.pool) + data.syn.joiner.length)
					: data.syn.maxSyllables * (longest(data.syn.onset) + longest(data.syn.vowel)) +
							longest(data.syn.coda)
			);
			const form = longest(data.legalForms) - '{name}'.length;

			for (const type of ORGANIZATION_TYPES) {
				assert.ok(data.templates[type].length > 0, `${language} has no ${type}`);

				for (const template of data.templates[type]) {
					const filled = template
						.replace('{stem}', 'x'.repeat(stem))
						.replace('{industry}', 'x'.repeat(longest(words)))
						.replace('{place}', 'x'.repeat(longest(data.places ?? [])))
						.replace('{number}', String(data.numbers?.[1] ?? ''));
					const length = filled.length + (type === 'company' ? form : 0);

					assert.ok(
						length <= RAND_ORGANIZATION_LENGTH_MAX,
						`${language}: ${template} can run to ${length}`
					);
				}
			}
		}
	});

	it('a language writes its own organizations, and language: all mixes them', () => {
		const languages = new Set(
			randOrganization({ count: SAMPLE * 5, output: 'detail' }).map((detail) => detail.language)
		);

		assert.strictEqual(languages.size, WORD_LANGUAGES.length);
	});

	it('an invented stem never spells a company the pool was trimmed against', () => {
		// The pools leave out a syllable of each company two of their syllables
		// could spell, and a `startsWith` on that syllable put it back in front:
		// `동` gave `동아지방법원`, `辉` gave `辉瑞能源股份有限公司`.
		for (const [language, data] of Object.entries(ORGANIZATION_DATA)) {
			if (data.syn.kind !== 'pool') {
				continue;
			}

			const { avoid } = data.syn;

			for (const brand of avoid) {
				for (const realism of ['real', 'invented'] as const) {
					for (const name of randOrganization({
						language: language as WordLanguage,
						startsWith: brand[0],
						realism,
						count: 40
					})) {
						assert.ok(!avoid.some((each) => name.includes(each)), `${language}: ${name}`);
					}
				}
			}
		}
	});

	it('unique never repeats an organization', () => {
		const organizations = randOrganization({ language: 'en', unique: true, count: 300 });

		assert.strictEqual(new Set(organizations).size, organizations.length);
	});
});
