// Internal shape of the per-language name datasets. These types are not part of
// the public API — consumers only ever see `RandNameOptions` / `NameDetail`.

// A name part that carries its own romanization (Japanese kanji, Chinese hanzi).
export type NameToken = { n: string; r: string };

export type NamePool = readonly (string | NameToken)[];

// How a language's native strings become "English pronunciation":
// - fold: strip diacritics (Latin scripts).
// - hangul: surname via map, given name via Revised Romanization.
// - translit: char-level Cyrillic -> Latin.
// - token: read the romanization off each NameToken.
export type RomanMode = 'fold' | 'hangul' | 'translit' | 'token';

export type SyllableSet = {
	onset: readonly string[];
	vowel: readonly string[];
	coda: readonly string[];
	minSyllables: number;
	maxSyllables: number;
};

// Character span of each part of a full name, joiner included. Summing the parts
// that are actually switched on yields a default length range that matches the
// requested structure, so turning a surname or middle name off relaxes the range
// instead of forcing the remaining parts to stretch and fill it.
export type NameLengthSpec = {
	given: readonly [number, number];
	last: readonly [number, number];
	middle: readonly [number, number];
};

export type NameLanguageData = {
	order: 'given-first' | 'family-first';
	// Joins native parts: '' for CJK (김민준), ' ' for space-separated scripts.
	joiner: string;
	hasMiddle: boolean;
	roman: RomanMode;
	lengthSpec: NameLengthSpec;
	last: NamePool;
	// How likely each surname is relative to the others, for languages whose
	// surnames are steeply distributed (Korean, Chinese, Vietnamese). Written in
	// tenths of a percent of the population; surnames the table leaves out keep
	// `LAST_WEIGHT_DEFAULT`. Omit the field entirely to draw surnames evenly.
	lastWeights?: Readonly<Record<string, number>>;
	// Western realistic given-name pools.
	male?: NamePool;
	female?: NamePool;
	middleMale?: NamePool;
	middleFemale?: NamePool;
	// CJK realistic given names, kept whole.
	givenMale?: NamePool;
	givenFemale?: NamePool;
	// CJK relative likelihood of a given name being N syllables long, used when
	// the requested length range leaves room for more than one option.
	givenLenWeights?: Readonly<Record<number, number>>;
	// CJK invented given names: first syllable + (k - 1) following syllables.
	firstMale?: NamePool;
	restMale?: NamePool;
	firstFemale?: NamePool;
	restFemale?: NamePool;
	// Western/Vietnamese invented-name synthesis, for `realism: 'invented'`.
	syn?: SyllableSet;
};
