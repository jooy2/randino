// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/name/data/syllables.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/types.dart';

/// The Italian name dataset.
final NameLanguageData it = NameLanguageData(
  order: NameOrder.givenFirst,
  joiner: ' ',
  hasMiddle: true,
  roman: RomanMode.fold,
  lengthSpec: NameLengthSpec(
    given: LengthRange(5, 10),
    last: LengthRange(5, 8),
    middle: LengthRange(5, 9),
  ),
  male: pool(r'''
    Lorenzo Francesco Alessandro Andrea Matteo Leonardo Gabriele Riccardo Tommaso
    Edoardo Federico Davide Giuseppe Antonio Marco Luca Giovanni Stefano Simone Paolo
    Roberto Giorgio Nicola Salvatore Pietro Vincenzo Angelo Emanuele Michele Fabio
    Alessio Daniele Dario Enrico Filippo Gianluca Giacomo Luigi Mattia Maurizio Nicolò
    Pasquale Raffaele Umberto Carlo Claudio Domenico
  '''),
  female: pool(r'''
    Sofia Giulia Aurora Alice Ginevra Emma Giorgia Greta Martina Chiara Sara Beatrice
    Anna Francesca Elena Valentina Federica Elisa Alessia Ilaria Silvia Laura Marta
    Gaia Noemi Camilla Bianca Roberta Paola Lucia Antonella Arianna Carlotta Caterina
    Eleonora Emanuela Gabriella Giada Giovanna Ludovica Margherita Michela Nicoletta
    Rossella Serena Stefania Vittoria
  '''),
  last: pool(r'''
    Rossi Russo Ferrari Esposito Bianchi Romano Colombo Ricci Marino Greco Bruno Gallo
    Conti De_Luca Costa Giordano Mancini Rizzo Lombardi Moretti Barbieri Fontana
    Santoro Mariani Rinaldi Caruso Ferrara Galli Martini Leone Longo Gentile Vitale
    Lombardo Serra Coppola Marchesi Parisi Villa Conte Farina Testa Grasso Palumbo
    Amato Sartori
  '''),
  syn: italianSyllables,
);
