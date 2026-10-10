// The category's public constants, apart from the catalog they describe: a
// catalog is built by a call at the top of its module, which a bundler has to
// keep, so a constant beside it brought the whole catalog along.

import type { PhoneCountry, PhoneType } from '../../_types/global.js';

// Every country a number can be for, in the order of `WORD_LANGUAGES`: the
// country each word language is spoken in first.
export const PHONE_COUNTRIES: readonly PhoneCountry[] = [
	'US',
	'KR',
	'JP',
	'CN',
	'VN',
	'ES',
	'IT',
	'DE',
	'RU'
];

export const PHONE_TYPES: readonly PhoneType[] = ['mobile', 'landline'];
