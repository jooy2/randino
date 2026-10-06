import { words } from '../../_internal/parse.js';
import type { OrganizationLanguageData } from './types.js';

export const IT: OrganizationLanguageData = {
	// Place-like names, the kind a town, a school and a firm all borrow. Some are
	// real villages somewhere, the way a place name usually is; what is left out
	// is every name a well-known company or brand already carries (Valbruna,
	// Belvedere, Acquaviva).
	stems: words(`
		Valfiorita Colleverde Pratobello Borgoalto Fontechiara Poggio_Alto Rivabella
		Montelieto Valserena Castelluce Roccabella Bosco_Alto Valdirose Collesole
		Fiumebianco Prato_Fiorito Borgo_Sereno Lago_Chiaro Casalverde Vallerosa
		Pietraluce Sorgentina Valgioiosa Rocca_Serena Monterosso_Alto Campofiorito
		Torrelunga Selvachiara Pianverde Rivachiara Castelvento Poggiolieto Colle_Ameno
		Fontebella Valdisole Borgofiorito Montesereno Prato_Lungo Querceto Olmeda
	`),
	syn: {
		kind: 'syllable',
		onset: words('b c d f g l m n p r s t v br tr gr st ch'),
		vowel: words('a e i o u a o ia io'),
		coda: ['', '', '', '', ...words('n l r')],
		minSyllables: 2,
		maxSyllables: 3
	},
	// Italian puts the business in front of the name: `Costruzioni Colleverde`.
	industries: {
		tech: words('Tecnologie Sistemi Informatica Elettronica Software Reti'),
		manufacturing: words('Industrie Officine_Meccaniche Meccanica Chimica Metallurgica Plastica'),
		food: words('Alimentari Pastificio Caseificio Conserve Forno Oleificio'),
		retail: words('Commerciale Distribuzione Magazzini Forniture Ingrosso'),
		finance: words('Finanziaria Investimenti Capitali Assicurazioni Gestioni_Patrimoniali'),
		construction: words('Costruzioni Edilizia Immobiliare Impresa_Edile Restauri'),
		logistics: words('Trasporti Logistica Spedizioni Autotrasporti Traslochi'),
		media: words('Edizioni Comunicazione Produzioni Media Pubblicità Studio'),
		health: words('Farmaceutica Laboratori Biotecnologie Medicale Sanità Ortopedia'),
		energy: words('Energia Energie_Rinnovabili Energia_Solare Elettrica Eolica Combustibili')
	},
	generic: words('Gruppo'),
	templates: {
		company: ['{industry} {stem}'],
		school: [
			"Scuola dell'Infanzia {stem}",
			'Scuola Primaria {stem}',
			'Istituto Comprensivo {stem}',
			'Liceo Scientifico {stem}',
			'Liceo Classico {stem}',
			'Istituto Tecnico {stem}',
			'Università di {stem}'
		],
		government: [
			'Comune di {stem}',
			'Questura di {stem}',
			'Prefettura di {stem}',
			'Tribunale di {stem}',
			'Polizia Locale di {stem}',
			'Stazione Carabinieri di {stem}'
		],
		public: [
			'Biblioteca Comunale di {stem}',
			'Ospedale Civile di {stem}',
			'Museo Civico di {stem}',
			'Teatro Comunale di {stem}',
			'Centro Sportivo Comunale di {stem}',
			'Azienda Sanitaria di {stem}'
		],
		nonprofit: [
			'Fondazione {stem}',
			'Associazione {stem}',
			'Associazione Culturale {stem}',
			'Associazione Sportiva {stem}',
			'Pro Loco {stem}',
			'Circolo {stem}',
			'Croce Verde {stem}'
		]
	},
	legalForms: ['{name} S.r.l.', '{name} S.p.A.', '{name} S.n.c.', '{name} S.a.s.']
};
