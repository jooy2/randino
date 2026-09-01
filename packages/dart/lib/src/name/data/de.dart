// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/name/data/syllables.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/types.dart';

/// The German name dataset.
final NameLanguageData de = NameLanguageData(
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
    Lukas Leon Finn Paul Jonas Elias Ben Noah Luis Felix Maximilian Julian Moritz
    David Tim Jan Niklas Philipp Sebastian Alexander Michael Thomas Andreas Stefan
    Martin Florian Matthias Daniel Christian Markus Emil Anton Theo Oskar Jakob
    Johannes Friedrich Wilhelm Heinrich Georg Konrad Ludwig Karl Otto Joachim Fabian
    Linus Erik
  '''),
  female: pool(r'''
    Mia Emma Hannah Emilia Sofia Lena Lea Marie Anna Laura Julia Sarah Lisa Katharina
    Johanna Charlotte Clara Amelie Leonie Frida Greta Ida Melina Nele Paula Sophie
    Antonia Helena Nora Maria Luisa Mathilda Theresa Elisabeth Ingrid Ursula Gisela
    Renate Monika Petra Brigitte Christa Sabine Claudia Stefanie Franziska Magdalena
    Annika
  '''),
  last: pool(r'''
    Müller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Hoffmann Schäfer
    Koch Bauer Richter Klein Wolf Schröder Neumann Schwarz Zimmermann Braun Krüger
    Hofmann Hartmann Lange Werner Krause Lehmann Köhler Herrmann Schmitz Walter Meier
    König Mayer Huber Kaiser Fuchs Peters Scholz Möller Jung Hahn Vogel Roth Berger
  '''),
  syn: germanSyllables,
);
