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
		Palumbo Amato Sartori Battaglia Rizzi Monti Fabbri Grassi Bernardi Silvestri
		Marchetti Pellegrini Palmieri Damico Orlando Piras Carbone Sorrentino Guerra
		Negri Ferretti Basile Riva Donati Mazza Valentini Rossetti Marini Guidi Pagano
		Bellini Ruggiero Sala Benedetti Barone Fiore Caputo Montanari Cattaneo Morelli
		Ferro Gatti Corti Milani Riccardi Poli Neri Vitali Merlo Landi Sanna Martinelli
		Martinez
	`),
	male: words(`
		Lorenzo Francesco Alessandro Andrea Matteo Leonardo Gabriele Riccardo Tommaso
		Edoardo Federico Davide Giuseppe Antonio Marco Luca Giovanni Stefano Simone
		Paolo Roberto Giorgio Nicola Salvatore Pietro Vincenzo Angelo Emanuele Michele
		Fabio Alessio Daniele Dario Enrico Filippo Gianluca Giacomo Luigi Mattia
		Maurizio Nicolò Pasquale Raffaele Umberto Carlo Claudio Domenico Cesare Ettore
		Fausto Gaetano Ignazio Silvio Corrado Massimo Sergio Valerio Vittorio Marcello
		Renato Aldo Guido Elio Ivano Fulvio Tiziano Ermanno Osvaldo Gennaro Rocco Alfio
		Ciro Nunzio Saverio Cosimo Vito Attilio Amedeo Arturo Bernardo Cristiano Dante
		Egidio Ferdinando Gastone Gioele Leandro Manlio Orlando Pierluigi Quirino
		Adriano Ercole Fiorenzo Lelio Ottavio
	`),
	female: words(`
		Sofia Giulia Aurora Alice Ginevra Emma Giorgia Greta Martina Chiara Sara
		Beatrice Anna Francesca Elena Valentina Federica Elisa Alessia Ilaria Silvia
		Laura Marta Gaia Noemi Camilla Bianca Roberta Paola Lucia Antonella Arianna
		Carlotta Caterina Eleonora Emanuela Gabriella Giada Giovanna Ludovica Margherita
		Michela Nicoletta Rossella Serena Stefania Vittoria Adriana Agnese Rosanna
		Cinzia Loredana Ornella Fiorella Gemma Iolanda Liliana Marilena Mirella Nadia
		Oriana Rita Sandra Tiziana Wanda Assunta Concetta Domenica Filomena Gilda Ida
		Lidia Luciana Marcella Palmira Renata Rosalia Santina Teodora Velia Zita Alba
		Ambra Azzurra Celeste Diletta Erica Flavia Isotta Lavinia Melania Simona
		Cristina Daniela Barbara Monica Teresa
	`),
	syn: ITALIAN_SYLLABLES
};
