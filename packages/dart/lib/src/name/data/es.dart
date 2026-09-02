// Generated from `data/name/es.yaml` by `tools/codegen`.
// Edit that file and re-run the generator; edits here are overwritten.

import 'package:randino/src/name/data/syllables.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/types.dart';

/// The Spanish name dataset.
final NameLanguageData es = NameLanguageData(
  order: NameOrder.givenFirst,
  joiner: ' ',
  hasMiddle: true,
  roman: RomanMode.fold,
  lengthSpec: NameLengthSpec(
    given: LengthRange(6, 10),
    last: LengthRange(5, 10),
    middle: LengthRange(6, 10),
  ),
  last: pool(r'''
    García Rodríguez González Fernández López Martínez Sánchez Pérez Gómez Martín
    Jiménez Ruiz Hernández Díaz Moreno Álvarez Romero Alonso Gutiérrez Navarro
    Torres Domínguez Vázquez Ramos Gil Ramírez Serrano Blanco Molina Castro Ortega
    Rubio Delgado Marín Sanz Núñez Iglesias Medina Garrido Cortés Santos Lozano
    Guerrero Cano Prieto Méndez
  '''),
  male: pool(r'''
    Alejandro Daniel Pablo Hugo Álvaro Adrián David Mario Diego Javier Manuel Sergio
    Carlos Marcos Antonio José Juan Francisco Miguel Ángel Luis Fernando Jorge Raúl
    Rubén Iván Gonzalo Andrés Pedro Rafael Santiago Sebastián Nicolás Mateo Lucas
    Enrique Ricardo Roberto Alberto Eduardo Emilio Ignacio Joaquín Julián Ramón
    Salvador Guillermo
  '''),
  female: pool(r'''
    Lucía María Paula Daniela Sara Carla Sofía Martina Alba Julia Claudia Elena
    Laura Marta Ana Isabel Carmen Cristina Natalia Andrea Rocío Nerea Irene Alicia
    Beatriz Patricia Raquel Nuria Silvia Eva Valeria Adriana Carolina Verónica
    Mercedes Pilar Teresa Rosario Manuela Josefa Antonia Gabriela Lorena Yolanda
    Esperanza Ainhoa Candela
  '''),
  syn: spanishSyllables,
);
