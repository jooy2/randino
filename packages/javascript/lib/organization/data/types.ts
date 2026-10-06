// Internal shape of the per-language organization datasets. Not part of the
// public API — consumers only ever see the options and `OrganizationDetail`.

import type { OrganizationIndustry, OrganizationType } from '../../_types/global.js';

export type OrganizationPool = readonly string[];

/**
 * How a stem is spelled when `realism` asks for an invented one:
 * - `syllable`: onset and vowel, repeated, then one closing coda, written as one
 *   capitalized word (`Valorin`) — for the alphabetic scripts.
 * - `pool`: whole syllables or characters out of a list, joined by `joiner` —
 *   nothing for Korean, Japanese and Chinese (`솔람`, `瑞峰`), a space for
 *   Vietnamese, whose syllables are written apart (`Lộc Hưng`).
 */
export type OrganizationSynthesis =
	| {
			kind: 'syllable';
			onset: OrganizationPool;
			vowel: OrganizationPool;
			coda: OrganizationPool;
			minSyllables: number;
			maxSyllables: number;
	  }
	| {
			kind: 'pool';
			pool: OrganizationPool;
			joiner: string;
			minSyllables: number;
			maxSyllables: number;
	  };

/**
 * One language's organizations: the stems a name is made from, the words that
 * say what a company does, and the shapes each kind of organization takes.
 *
 * A template is written in the language's own order with a gap for each part:
 * `{stem}` the organization's own name, `{industry}` the word for its business,
 * `{place}` a city it opens on, `{number}` the number a Russian school or fire
 * station is known by. Every company template has an `{industry}`, because a
 * company named by its stem alone is decided in the generator rather than
 * written out — it is the one shape that always takes a legal form.
 */
export type OrganizationLanguageData = {
	/**
	 * The organization's own name, the part nothing else decides. Chosen to be
	 * nobody's brand: none of them is a well-known company's name, alone or with a
	 * word from `industries` behind it.
	 */
	stems: OrganizationPool;
	/** How a stem is invented when `realism` asks for one. */
	syn: OrganizationSynthesis;
	/** Cities a company name may open on, for the language whose names do: Chinese. */
	places?: OrganizationPool;
	/** The range a `{number}` is drawn from, for the language that numbers its institutions: Russian. */
	numbers?: readonly [number, number];
	/** The words that say what a company does, per industry. */
	industries: Record<OrganizationIndustry, OrganizationPool>;
	/** Words a company name carries that say nothing about its business: `Group`, `홀딩스`. */
	generic: OrganizationPool;
	/** The shapes each kind of organization takes. */
	templates: Record<OrganizationType, readonly string[]>;
	/** A company's legal forms, each written around `{name}` the way the language places it. */
	legalForms: readonly string[];
};
