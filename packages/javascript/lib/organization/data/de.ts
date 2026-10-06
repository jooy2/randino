import { words } from '../../_internal/parse.js';
import type { OrganizationLanguageData } from './types.js';

export const DE: OrganizationLanguageData = {
	// Place-like names, the kind a town, a school and a firm all borrow. Some are
	// real villages somewhere, the way a place name usually is; what is left out
	// is every name a well-known company or brand already carries (Rosenthal,
	// Edelweiss, Bergquell).
	stems: words(`
		Lindenhof Bergtal Sonnenberg Eichenwald Rosenau Birkenfeld Tannenhof Waldeck
		Lindenberg Falkenstein Adlerhorst Nordlicht Buchenau Erlenbach Fichtenau
		Haselbach Lerchenfeld Mühlental Quellental Rabenstein Silbertal Ulmenhof Weidenau
		Wiesental Ahornfeld Brunnental Felsenau Hainbach Kieselbach Morgenrot Sternfeld
		Eschenhain Talwiese Rotbuche Kranichsee Moosgrund Bachwiese Hochfeld Grünau
		Ostheide
	`),
	syn: {
		kind: 'syllable',
		onset: words('b br d f g h k kl l m n r s sch st t w'),
		vowel: words('a e i o u a e ei au ie'),
		coda: ['', ...words('n r l rt nd ck ng ld')],
		minSyllables: 2,
		maxSyllables: 2
	},
	industries: {
		tech: words('Software Systemtechnik Elektronik Informatik Digital Netzwerke'),
		manufacturing: words(
			'Maschinenbau Metallbau Präzisionstechnik Chemie Werkzeugbau Kunststofftechnik'
		),
		food: words('Lebensmittel Backwaren Feinkost Molkerei Brauerei Mühle'),
		retail: words('Handel Handelshaus Großhandel Versand Warenhaus'),
		finance: words('Finanz Vermögensverwaltung Beteiligungen Versicherungsmakler Capital'),
		construction: words('Bau Hochbau Tiefbau Immobilien Bauträger Architekten'),
		logistics: words('Logistik Spedition Transporte Kurierdienst Umzüge'),
		media: words('Medien Verlag Werbeagentur Filmproduktion Kommunikation'),
		health: words('Pharma Medizintechnik Biotech Labor Gesundheit'),
		energy: words('Energie Solartechnik Windkraft Energietechnik Gas')
	},
	generic: words('Gruppe Holding International'),
	templates: {
		company: ['{stem} {industry}'],
		school: [
			'Kindergarten {stem}',
			'Grundschule {stem}',
			'Realschule {stem}',
			'Gymnasium {stem}',
			'Gesamtschule {stem}',
			'Berufsschule {stem}',
			'Hochschule {stem}',
			'Universität {stem}'
		],
		government: [
			'Stadtverwaltung {stem}',
			'Gemeindeverwaltung {stem}',
			'Bürgeramt {stem}',
			'Polizeiinspektion {stem}',
			'Freiwillige Feuerwehr {stem}',
			'Finanzamt {stem}',
			'Amtsgericht {stem}'
		],
		public: [
			'Stadtbibliothek {stem}',
			'Klinikum {stem}',
			'Kreiskrankenhaus {stem}',
			'Stadtwerke {stem}',
			'Heimatmuseum {stem}',
			'Volkshochschule {stem}',
			'Verkehrsbetriebe {stem}'
		],
		// A registered association writes `e.V.` as part of its name, so it is here
		// rather than among the legal forms, which are a company's.
		nonprofit: [
			'Stiftung {stem}',
			'Bürgerstiftung {stem}',
			'Förderverein {stem} e.V.',
			'Heimatverein {stem} e.V.',
			'Kunstverein {stem} e.V.',
			'Sportverein {stem} e.V.',
			'Freundeskreis {stem} e.V.'
		]
	},
	legalForms: [
		'{name} GmbH',
		'{name} AG',
		'{name} GmbH & Co. KG',
		'{name} KG',
		'{name} UG (haftungsbeschränkt)'
	]
};
