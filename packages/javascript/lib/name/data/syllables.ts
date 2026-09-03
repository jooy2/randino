// Syllable templates used when `realism` calls for an invented name. Names built
// from these are invented rather than drawn from a pool, so they should read as
// plausible for the language without matching anyone real.

import { words } from '../../_internal/parse.js';
import type { SyllableSet } from './types.js';

export const WESTERN_SYLLABLES: SyllableSet = {
	onset: words('b c d f g h j k l m n p r s t v w br cl dr fr gr st th tr ch'),
	vowel: words('a e i o u ae ai ea ee ia ie oo ou'),
	// The two empty entries make an open syllable the most likely ending.
	coda: ['', '', ...words('n l r s th ll nn ne ra na la')],
	minSyllables: 2,
	maxSyllables: 3
};

export const ITALIAN_SYLLABLES: SyllableSet = {
	onset: words('b c d f g l m n p r s t v z br gr tr'),
	vowel: words('a e i o ia io ie'),
	coda: ['', '', ...words('no na ni lo ra ri llo nti ano')],
	minSyllables: 2,
	maxSyllables: 3
};

export const SPANISH_SYLLABLES: SyllableSet = {
	onset: words('b c d f g j l m n p r s t v z br gr'),
	vowel: words('a e i o u ia ie ue'),
	coda: ['', '', ...words('n s z no na lo ro les ndo')],
	minSyllables: 2,
	maxSyllables: 3
};

export const GERMAN_SYLLABLES: SyllableSet = {
	onset: words('b d f g h k l m n r s t w sch st br kl'),
	vowel: words('a e i o u ei ie au eu'),
	coda: ['', ...words('n r l s ch rt ng mann ner')],
	minSyllables: 2,
	maxSyllables: 3
};

export const RUSSIAN_SYLLABLES: SyllableSet = {
	onset: words('б в г д к л м н п р с т ф х ч ш'),
	vowel: words('а е и о у я ю'),
	coda: ['', '', ...words('н в р л с й к')],
	minSyllables: 2,
	maxSyllables: 3
};

export const VIETNAMESE_SYLLABLES: SyllableSet = {
	onset: words('b c d h l m n ng nh ph q t th tr v x'),
	vowel: words('a e i o u ai ao ie uy oa'),
	coda: ['', ...words('n nh ng m c t p')],
	minSyllables: 1,
	maxSyllables: 2
};
