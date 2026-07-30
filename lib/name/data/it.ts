import { words } from '../../_internal/parse.js';
import { ITALIAN_SYLLABLES } from './syllables.js';
import type { NameLanguageData } from './types.js';

export const IT: NameLanguageData = {
	order: 'given-first',
	joiner: ' ',
	hasMiddle: true,
	roman: 'fold',
	lengthSpec: { given: [5, 10], last: [5, 8], middle: [5, 9] },
	male: words(`
		Lorenzo Francesco Alessandro Andrea Matteo Leonardo Gabriele Riccardo Tommaso
		Edoardo Federico Davide Giuseppe Antonio Marco Luca Giovanni Stefano Simone Paolo
		Roberto Giorgio Nicola Salvatore Pietro Vincenzo Angelo Emanuele Michele Fabio
	`),
	female: words(`
		Sofia Giulia Aurora Alice Ginevra Emma Giorgia Greta Martina Chiara Sara Beatrice
		Anna Francesca Elena Valentina Federica Elisa Alessia Ilaria Silvia Laura Marta
		Gaia Noemi Camilla Bianca Roberta Paola Lucia
	`),
	last: words(`
		Rossi Russo Ferrari Esposito Bianchi Romano Colombo Ricci Marino Greco Bruno Gallo
		Conti De_Luca Costa Giordano Mancini Rizzo Lombardi Moretti Barbieri Fontana
		Santoro Mariani Rinaldi Caruso Ferrara Galli Martini Leone
	`),
	syn: ITALIAN_SYLLABLES
};
