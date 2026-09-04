import type { WordLanguage, WordTheme } from '../../_types/global.js';
import { DE } from './de.js';
import { EN } from './en.js';
import { ES } from './es.js';
import { IT } from './it.js';
import { JA } from './ja.js';
import { KO } from './ko.js';
import { RU } from './ru.js';
import type { NounClass, SentenceLanguageData } from './types.js';
import { VI } from './vi.js';
import { ZH } from './zh.js';

/**
 * What each theme's nouns are, as far as a verb is concerned. The map is the
 * same in every language, because a theme is: `animal` names creatures wherever
 * it is written, and a verb that needs one can say so once.
 *
 * This is what keeps a sentence together. `먹는다` takes an `edible` object and
 * nothing else, so `사자가 사과를 먹는다` is a sentence the generator can build
 * and `사자가 철학을 먹는다` is not — no tag on any noun, and no rule per
 * language.
 */
export const THEME_CLASS: Record<WordTheme, NounClass> = {
	animal: 'creature',
	myth: 'creature',
	job: 'person',
	plant: 'plant',
	food: 'edible',
	drink: 'edible',
	object: 'thing',
	tool: 'thing',
	clothing: 'thing',
	product: 'thing',
	gem: 'thing',
	music: 'thing',
	vehicle: 'vehicle',
	place: 'place',
	nature: 'place',
	space: 'place',
	weather: 'event',
	sport: 'event',
	time: 'event',
	concept: 'abstract',
	emotion: 'abstract',
	finance: 'abstract',
	tech: 'abstract',
	color: 'abstract',
	body: 'body'
};

export const SENTENCE_DATA: Record<WordLanguage, SentenceLanguageData> = {
	en: EN,
	ko: KO,
	ja: JA,
	zh: ZH,
	vi: VI,
	es: ES,
	it: IT,
	de: DE,
	ru: RU
};
