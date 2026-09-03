import { words } from '../../_internal/parse.js';
import { GERMAN_SYLLABLES } from './syllables.js';
import type { NameLanguageData } from './types.js';

export const DE: NameLanguageData = {
	order: 'given-first',
	joiner: ' ',
	hasMiddle: true,
	roman: 'fold',
	lengthSpec: { given: [5, 10], last: [5, 8], middle: [5, 9] },
	last: words(`
		Müller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Hoffmann
		Schäfer Koch Bauer Richter Klein Wolf Schröder Neumann Schwarz Zimmermann Braun
		Krüger Hofmann Hartmann Lange Werner Krause Lehmann Köhler Herrmann Schmitz
		Walter Meier König Mayer Huber Kaiser Fuchs Peters Scholz Möller Jung Hahn Vogel
		Roth Berger Winkler Beck Frank Keller Franke Albrecht Schulze Schmitt Maier
		Schmid Lang Weiß Sommer Haas Schreiber Graf Dietrich Ziegler Kuhn Pohl Engel
		Horn Busch Bergmann Voigt Sauer Arnold Wolff Pfeiffer Kraus Böhm Simon Ernst
		Riedel Hansen Nowak Barth Kern Krieger Fritz Voss Hein Brandt Seidel Stein
		Reuter Hummel Wenzel
	`),
	male: words(`
		Lukas Leon Finn Paul Jonas Elias Ben Noah Luis Felix Maximilian Julian Moritz
		David Tim Jan Niklas Philipp Sebastian Alexander Michael Thomas Andreas Stefan
		Martin Florian Matthias Daniel Christian Markus Emil Anton Theo Oskar Jakob
		Johannes Friedrich Wilhelm Heinrich Georg Konrad Ludwig Karl Otto Joachim Fabian
		Linus Erik Bernd Christoph Dirk Frank Gerhard Hans Heinz Helmut Holger Jens
		Jürgen Klaus Manfred Marcel Norbert Oliver Ralf Rainer Rolf Rudolf Sven Thorsten
		Ulrich Uwe Volker Wolfgang Detlef Eckhard Gunnar Hartmut Heiko Hubert Ingo
		Reinhard Siegfried Torsten Waldemar Winfried Bastian Clemens Dennis Gregor
		Hendrik Kilian Lennart Marius Roland
	`),
	female: words(`
		Mia Emma Hannah Emilia Sofia Lena Lea Marie Anna Laura Julia Sarah Lisa
		Katharina Johanna Charlotte Clara Amelie Leonie Frida Greta Ida Melina Nele
		Paula Sophie Antonia Helena Nora Maria Luisa Mathilda Theresa Elisabeth Ingrid
		Ursula Gisela Renate Monika Petra Brigitte Christa Sabine Claudia Stefanie
		Franziska Magdalena Annika Angelika Anja Annette Beate Birgit Christiane
		Cornelia Doris Elke Gabriele Hannelore Heike Helga Jutta Karin Katrin Kerstin
		Manuela Margarete Marion Martina Melanie Nicole Silke Simone Susanne Sylvia
		Tanja Verena Waltraud Bettina Dagmar Edith Gudrun Heidrun Ilse Kathrin Rosemarie
		Sigrid Ulrike Yvonne Astrid Britta Carina Constanze Dorothea Elfriede Wiebke
	`),
	syn: GERMAN_SYLLABLES
};
