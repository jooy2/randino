// Generated from `data/name/it.yaml` by `tools/codegen`.
// Edit that file and re-run the generator; edits here are overwritten.

import { words } from '../../_internal/parse.js';
import { ITALIAN_SYLLABLES } from './syllables.js';
import type { NameLanguageData } from './types.js';

export const IT: NameLanguageData = {
	order: 'given-first',
	joiner: ' ',
	hasMiddle: true,
	roman: 'fold',
	lengthSpec: { given: [5, 10], last: [5, 8], middle: [5, 9] },
	last: words(`
		Rossi Russo Ferrari Esposito Bianchi Romano Colombo Ricci Marino Greco Bruno
		Gallo Conti De Luca Costa Giordano Mancini Rizzo Lombardi Moretti Barbieri
		Fontana Santoro Mariani Rinaldi Caruso Ferrara Galli Martini Leone Longo Gentile
		Vitale Lombardo Serra Coppola Marchesi Parisi Villa Conte Farina Testa Grasso
		Palumbo Amato Sartori
	`),
	male: words(`
		Lorenzo Francesco Alessandro Andrea Matteo Leonardo Gabriele Riccardo Tommaso
		Edoardo Federico Davide Giuseppe Antonio Marco Luca Giovanni Stefano Simone
		Paolo Roberto Giorgio Nicola Salvatore Pietro Vincenzo Angelo Emanuele Michele
		Fabio Alessio Daniele Dario Enrico Filippo Gianluca Giacomo Luigi Mattia
		Maurizio Nicolò Pasquale Raffaele Umberto Carlo Claudio Domenico
	`),
	female: words(`
		Sofia Giulia Aurora Alice Ginevra Emma Giorgia Greta Martina Chiara Sara
		Beatrice Anna Francesca Elena Valentina Federica Elisa Alessia Ilaria Silvia
		Laura Marta Gaia Noemi Camilla Bianca Roberta Paola Lucia Antonella Arianna
		Carlotta Caterina Eleonora Emanuela Gabriella Giada Giovanna Ludovica Margherita
		Michela Nicoletta Rossella Serena Stefania Vittoria
	`),
	syn: ITALIAN_SYLLABLES
};
