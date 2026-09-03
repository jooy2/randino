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
		Guerrero Cano Prieto Méndez Calvo Gallego Vidal León Herrera Márquez Peña
		Cabrera Flores Nieto Aguilar Pascual Herrero Montero Lorenzo Hidalgo Giménez
		Ibáñez Ferrer Durán Santana Benítez Vargas Mora Vega Soto Rojas Carrasco Soler
		Parra Esteban Bravo Gallardo Rueda Pardo Franco Espinosa Izquierdo Arias Crespo
		Reyes Campos Rivera Bermúdez Salazar Otero Redondo Sáez Lara Ossorio
	`),
	male: words(`
		Alejandro Daniel Pablo Hugo Álvaro Adrián David Mario Diego Javier Manuel Sergio
		Carlos Marcos Antonio José Juan Francisco Miguel Ángel Luis Fernando Jorge Raúl
		Rubén Iván Gonzalo Andrés Pedro Rafael Santiago Sebastián Nicolás Mateo Lucas
		Enrique Ricardo Roberto Alberto Eduardo Emilio Ignacio Joaquín Julián Ramón
		Salvador Guillermo César Cristian Ernesto Gustavo Héctor Jesús Julio Lorenzo
		Óscar Tomás Vicente Víctor Agustín Aurelio Benito Cayetano Domingo Esteban
		Felipe Gerardo Gregorio Isidro Jaime Leandro Leopoldo Marcelo Mauricio Norberto
		Octavio Patricio Rodolfo Rogelio Teodoro Ulises Valentín Amadeo Anselmo
		Bartolomé Casimiro Eloy Fabián Fidel Hilario Justino Máximo Nemesio Onésimo
		Prudencio Serafín Timoteo
	`),
	female: words(`
		Lucía María Paula Daniela Sara Carla Sofía Martina Alba Julia Claudia Elena
		Laura Marta Ana Isabel Carmen Cristina Natalia Andrea Rocío Nerea Irene Alicia
		Beatriz Patricia Raquel Nuria Silvia Eva Valeria Adriana Carolina Verónica
		Mercedes Pilar Teresa Rosario Manuela Josefa Antonia Gabriela Lorena Yolanda
		Esperanza Ainhoa Candela Ángela Blanca Catalina Clara Diana Dolores Elisa Emilia
		Estela Fátima Gloria Inés Juana Leticia Luisa Marina Mónica Olga Sonia Susana
		Amparo Araceli Begoña Consuelo Felisa Genoveva Herminia Jacinta Lourdes Macarena
		Milagros Montserrat Nieves Remedios Soledad Trinidad Aurora Casilda Covadonga
		Delia Elvira Florencia Guadalupe Higinia Leonor Marcela Obdulia Petra Rosalía
		Vicenta
	`),
	syn: SPANISH_SYLLABLES
};
