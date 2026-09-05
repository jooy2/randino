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
    given: LengthRange(3, 10),
    last: LengthRange(4, 10),
    middle: LengthRange(3, 10),
  ),
  last: pool(r'''
    Müller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Hoffmann
    Schäfer Koch Bauer Richter Klein Wolf Schröder Neumann Schwarz Zimmermann Braun
    Krüger Hofmann Hartmann Lange Werner Krause Lehmann Köhler Herrmann Schmitz
    Walter Meier König Mayer Huber Kaiser Fuchs Peters Scholz Möller Jung Hahn Vogel
    Roth Berger Winkler Beck Frank Keller Franke Albrecht Schulze Schmitt Maier
    Schmid Lang Weiß Sommer Haas Schreiber Graf Dietrich Ziegler Kuhn Pohl Engel
    Horn Busch Bergmann Voigt Sauer Arnold Wolff Pfeiffer Kraus Böhm Simon Ernst
    Riedel Hansen Nowak Barth Kern Krieger Fritz Voss Hein Brandt Seidel Stein
    Reuter Hummel Wenzel
  '''),
  male: pool(r'''
    Lukas Leon Finn Paul Jonas Elias Ben Noah Luis Felix Maximilian Julian Moritz
    David Tim Jan Niklas Philipp Sebastian Alexander Michael Thomas Andreas Stefan
    Martin Florian Matthias Daniel Christian Markus Emil Anton Theo Oskar Jakob
    Johannes Friedrich Wilhelm Heinrich Georg Konrad Ludwig Karl Otto Joachim Fabian
    Linus Erik Bernd Christoph Dirk Frank Gerhard Hans Heinz Helmut Holger Jens
    Jürgen Klaus Manfred Marcel Norbert Oliver Ralf Rainer Rolf Rudolf Sven Thorsten
    Ulrich Uwe Volker Wolfgang Detlef Eckhard Gunnar Hartmut Heiko Hubert Ingo
    Reinhard Siegfried Torsten Waldemar Winfried Bastian Clemens Dennis Gregor
    Hendrik Kilian Lennart Marius Roland
  '''),
  female: pool(r'''
    Mia Emma Hannah Emilia Sofia Lena Lea Marie Anna Laura Julia Sarah Lisa
    Katharina Johanna Charlotte Clara Amelie Leonie Frida Greta Ida Melina Nele
    Paula Sophie Antonia Helena Nora Maria Luisa Mathilda Theresa Elisabeth Ingrid
    Ursula Gisela Renate Monika Petra Brigitte Christa Sabine Claudia Stefanie
    Franziska Magdalena Annika Angelika Anja Annette Beate Birgit Christiane
    Cornelia Doris Elke Gabriele Hannelore Heike Helga Jutta Karin Katrin Kerstin
    Manuela Margarete Marion Martina Melanie Nicole Silke Simone Susanne Sylvia
    Tanja Verena Waltraud Bettina Dagmar Edith Gudrun Heidrun Ilse Kathrin Rosemarie
    Sigrid Ulrike Yvonne Astrid Britta Carina Constanze Dorothea Elfriede Wiebke
  '''),
  syn: germanSyllables,
);
