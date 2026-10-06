import type { OrganizationDetail, RandOrganizationOptions } from '../_types/global.js';
import { generateOrganizationDetails } from './organizationGenerator.js';

/**
 * Generate the names of organizations that do not exist: companies, schools,
 * government offices, public institutions and associations, written the way the
 * language writes each of them.
 *
 * A name is built from a stem that is nobody's brand, a word for what a company
 * does, and the shape the language gives that kind of organization. A company
 * may carry its legal form — `Inc.`, `(주)`, `GmbH`, `ООО` — and with no `type`
 * asked for, companies come up most often.
 *
 * @example
 * randOrganization({ language: 'ko', count: 3 });
 * // ['(주)새솔테크', '가람초등학교', '해솔구청']
 * randOrganization({ language: 'en', type: 'company', industry: 'logistics' });
 * // ['Westbrook Freight, Inc.']
 * randOrganization({ language: 'de', type: ['school', 'public'], count: 2 });
 * // ['Gymnasium Lindenberg', 'Stadtwerke Bergtal']
 */
export function randOrganization(
	options?: RandOrganizationOptions & { output?: 'value' }
): string[];
/**
 * Generate organizations along with the pieces each name was built from.
 *
 * `output: 'detail'` returns an `OrganizationDetail` per organization: the name
 * with and without its legal form, the form itself, its kind and its industry.
 *
 * @example
 * randOrganization({ language: 'ko', type: 'company', output: 'detail' });
 * // [{ organization: '(주)새솔테크', name: '새솔테크', legalForm: '(주)',
 * //    type: 'company', industry: 'tech', language: 'ko' }]
 */
export function randOrganization(
	options: RandOrganizationOptions & { output: 'detail' }
): OrganizationDetail[];
export function randOrganization(
	options: RandOrganizationOptions = {}
): string[] | OrganizationDetail[] {
	const details = generateOrganizationDetails(options);

	return options.output === 'detail' ? details : details.map((detail) => detail.organization);
}
