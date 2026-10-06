import { words } from '../../_internal/parse.js';
import type { OrganizationLanguageData } from './types.js';

export const EN: OrganizationLanguageData = {
	// Place-like names, the kind a town, a school and a firm all borrow. Any one
	// of them can name a real small business somewhere, the way Riverside does;
	// what is left out is every name a well-known company already carries
	// (Juniper, Ironwood, Evergreen, Vertex).
	stems: words(`
		Alder_Creek Ashbury Birchwood Blue_Heron Briar_Ridge Cedar_Grove Copper_Ridge
		Crestview Eastbrook Elmwood Fairhaven Fox_Hollow Glenwood Granite_Peak Greenbriar
		Harbor_Point Kestrel Lakemont Larkspur Maple_Ridge Millbrook Northfield Oak_Hollow
		Oakmont Pine_Hollow Quarry_Hill Ravenwood Red_Maple Riverbend Sandpiper Silver_Birch
		Stonebridge Summerfield Thornbury Timber_Creek Westbrook Whitfield Willow_Bend
		Wrenfield
	`),
	syn: {
		kind: 'syllable',
		onset: words('b br c cl d dr f fl g gr h k l m n p pr r s st t tr v w'),
		vowel: words('a e i o u a e o ai ea io'),
		coda: ['', '', ...words('n r s x l nt rk ll')],
		minSyllables: 2,
		maxSyllables: 3
	},
	industries: {
		tech: words('Technologies Software Systems Labs Digital Data Electronics Networks'),
		manufacturing: words(
			'Manufacturing Machine_Works Precision Fabrication Tooling Plastics Steel'
		),
		food: words('Foods Bakery Farms Provisions Creamery Beverages Kitchen'),
		retail: words('Supply Trading Outfitters Mercantile Market Goods Retail'),
		finance: words(
			'Capital Financial Advisors Investments Wealth_Management Insurance Asset_Management'
		),
		construction: words('Construction Builders Homes Contracting Development Engineering Realty'),
		logistics: words('Logistics Freight Shipping Transport Moving Express Courier'),
		media: words('Media Studios Press Publishing Productions Broadcasting Creative'),
		health: words('Health Medical Pharmaceuticals Biotech Therapeutics Diagnostics Care'),
		energy: words('Energy Power Solar Utilities Wind Fuels Renewables')
	},
	generic: words('Group Holdings Partners Enterprises International Industries'),
	templates: {
		company: ['{stem} {industry}'],
		school: [
			'{stem} Elementary School',
			'{stem} Middle School',
			'{stem} High School',
			'{stem} Academy',
			'{stem} College',
			'{stem} University',
			'University of {stem}',
			'{stem} Community College',
			'{stem} Preparatory School',
			'{stem} Primary School'
		],
		government: [
			'{stem} City Hall',
			'{stem} Police Department',
			'{stem} Fire Department',
			"{stem} County Sheriff's Office",
			'{stem} Municipal Court',
			'{stem} Department of Public Works',
			'{stem} Town Council',
			"{stem} County Clerk's Office"
		],
		public: [
			'{stem} Public Library',
			'{stem} Transit Authority',
			'{stem} Water Authority',
			'{stem} Housing Authority',
			'{stem} Regional Medical Center',
			'{stem} General Hospital',
			'{stem} Museum of Art',
			'{stem} Community Health Center'
		],
		nonprofit: [
			'{stem} Foundation',
			'{stem} Society',
			'{stem} Historical Society',
			'{stem} Arts Council',
			'{stem} Community Association',
			'Friends of {stem}',
			'{stem} Food Bank',
			'{stem} Animal Rescue',
			'{stem} Youth League'
		]
	},
	legalForms: ['{name}, Inc.', '{name} LLC', '{name} Corp.', '{name} Co.', '{name} Ltd.']
};
