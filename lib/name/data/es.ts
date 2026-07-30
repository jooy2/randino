import { words } from './parse.js';
import { SPANISH_SYLLABLES } from './syllables.js';
import type { NameLanguageData } from './types.js';

export const ES: NameLanguageData = {
	order: 'given-first',
	joiner: ' ',
	hasMiddle: true,
	roman: 'fold',
	lengthSpec: { given: [6, 10], last: [5, 10], middle: [6, 10] },
	male: words(`
		Alejandro Daniel Pablo Hugo Álvaro Adrián David Mario Diego Javier Manuel Sergio
		Carlos Marcos Antonio José Juan Francisco Miguel Ángel Luis Fernando Jorge Raúl
		Rubén Iván Gonzalo Andrés Pedro Rafael
	`),
	female: words(`
		Lucía María Paula Daniela Sara Carla Sofía Martina Alba Julia Claudia Elena Laura
		Marta Ana Isabel Carmen Cristina Natalia Andrea Rocío Nerea Irene Alicia Beatriz
		Patricia Raquel Nuria Silvia Eva
	`),
	last: words(`
		García Rodríguez González Fernández López Martínez Sánchez Pérez Gómez Martín
		Jiménez Ruiz Hernández Díaz Moreno Álvarez Romero Alonso Gutiérrez Navarro Torres
		Domínguez Vázquez Ramos Gil Ramírez Serrano Blanco Molina Castro
	`),
	syn: SPANISH_SYLLABLES
};
