import { words } from '../../_internal/parse.js';
import { GERMAN_SYLLABLES } from './syllables.js';
import type { NameLanguageData } from './types.js';

export const DE: NameLanguageData = {
	order: 'given-first',
	joiner: ' ',
	hasMiddle: true,
	roman: 'fold',
	lengthSpec: { given: [5, 10], last: [5, 8], middle: [5, 9] },
	male: words(`
		Lukas Leon Finn Paul Jonas Elias Ben Noah Luis Felix Maximilian Julian Moritz
		David Tim Jan Niklas Philipp Sebastian Alexander Michael Thomas Andreas Stefan
		Martin Florian Matthias Daniel Christian Markus
	`),
	female: words(`
		Mia Emma Hannah Emilia Sofia Lena Lea Marie Anna Laura Julia Sarah Lisa Katharina
		Johanna Charlotte Clara Amelie Leonie Frida Greta Ida Melina Nele Paula Sophie
		Antonia Helena Nora Maria
	`),
	last: words(`
		Müller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Hoffmann Schäfer
		Koch Bauer Richter Klein Wolf Schröder Neumann Schwarz Zimmermann Braun Krüger
		Hofmann Hartmann Lange Werner Krause Lehmann Köhler Herrmann
	`),
	syn: GERMAN_SYLLABLES
};
