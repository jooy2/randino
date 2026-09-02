// Generated from `data/name/syllables.yaml` by `tools/codegen`.
// Edit that file and re-run the generator; edits here are overwritten.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/name/data/types.dart';

// Syllable templates used at the abstract end of the style range. Names built
// from these are invented rather than drawn from a pool, so they should read as
// plausible for the language without matching anyone real.

/// Invented-name template for English.
final SyllableSet westernSyllables = SyllableSet(
  onset: words(r'b c d f g h j k l m n p r s t v w br cl dr fr gr st th tr ch'),
  vowel: words(r'a e i o u ae ai ea ee ia ie oo ou'),
  // The two empty entries make an open syllable the most likely ending.
  coda: ['', '', ...words(r'n l r s th ll nn ne ra na la')],
  minSyllables: 2,
  maxSyllables: 3,
);

/// Invented-name template for Italian.
final SyllableSet italianSyllables = SyllableSet(
  onset: words(r'b c d f g l m n p r s t v z br gr tr'),
  vowel: words(r'a e i o ia io ie'),
  coda: ['', '', ...words(r'no na ni lo ra ri llo nti ano')],
  minSyllables: 2,
  maxSyllables: 3,
);

/// Invented-name template for Spanish.
final SyllableSet spanishSyllables = SyllableSet(
  onset: words(r'b c d f g j l m n p r s t v z br gr'),
  vowel: words(r'a e i o u ia ie ue'),
  coda: ['', '', ...words(r'n s z no na lo ro les ndo')],
  minSyllables: 2,
  maxSyllables: 3,
);

/// Invented-name template for German.
final SyllableSet germanSyllables = SyllableSet(
  onset: words(r'b d f g h k l m n r s t w sch st br kl'),
  vowel: words(r'a e i o u ei ie au eu'),
  coda: ['', ...words(r'n r l s ch rt ng mann ner')],
  minSyllables: 2,
  maxSyllables: 3,
);

/// Invented-name template for Russian.
final SyllableSet russianSyllables = SyllableSet(
  onset: words(r'б в г д к л м н п р с т ф х ч ш'),
  vowel: words(r'а е и о у я ю'),
  coda: ['', '', ...words(r'н в р л с й к')],
  minSyllables: 2,
  maxSyllables: 3,
);

/// Invented-name template for Vietnamese.
final SyllableSet vietnameseSyllables = SyllableSet(
  onset: words(r'b c d h l m n ng nh ph q t th tr v x'),
  vowel: words(r'a e i o u ai ao ie uy oa'),
  coda: ['', ...words(r'n nh ng m c t p')],
  minSyllables: 1,
  maxSyllables: 2,
);
