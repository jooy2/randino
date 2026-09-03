import { words } from '../../_internal/parse.js';
import { SPANISH_SYLLABLES } from './syllables.js';
import type { NameLanguageData } from './types.js';

export const ES: NameLanguageData = {
	order: 'given-first',
	joiner: ' ',
	hasMiddle: true,
	roman: 'fold',
	lengthSpec: { given: [6, 10], last: [5, 10], middle: [6, 10] },
	last: words(`
		García Rodríguez González Fernández López Martínez Sánchez Pérez Gómez Martín
		Jiménez Ruiz Hernández Díaz Moreno Álvarez Romero Alonso Gutiérrez Navarro
		Torres Domínguez Vázquez Ramos Gil Ramírez Serrano Blanco Molina Castro Ortega
		Rubio Delgado Marín Sanz Núñez Iglesias Medina Garrido Cortés Santos Lozano
		Guerrero Cano Prieto Méndez
	`),
	male: words(`
		Alejandro Daniel Pablo Hugo Álvaro Adrián David Mario Diego Javier Manuel Sergio
		Carlos Marcos Antonio José Juan Francisco Miguel Ángel Luis Fernando Jorge Raúl
		Rubén Iván Gonzalo Andrés Pedro Rafael Santiago Sebastián Nicolás Mateo Lucas
		Enrique Ricardo Roberto Alberto Eduardo Emilio Ignacio Joaquín Julián Ramón
		Salvador Guillermo
	`),
	female: words(`
		Lucía María Paula Daniela Sara Carla Sofía Martina Alba Julia Claudia Elena
		Laura Marta Ana Isabel Carmen Cristina Natalia Andrea Rocío Nerea Irene Alicia
		Beatriz Patricia Raquel Nuria Silvia Eva Valeria Adriana Carolina Verónica
		Mercedes Pilar Teresa Rosario Manuela Josefa Antonia Gabriela Lorena Yolanda
		Esperanza Ainhoa Candela
	`),
	syn: SPANISH_SYLLABLES
};
