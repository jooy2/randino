import type { GenderCode, NonbinaryIdentity, WordLanguage } from '../../_types/global.js';

// Every code a gender can be, in the order a form usually lists them.
export const GENDER_CODES: readonly GenderCode[] = ['male', 'female', 'nonbinary', 'unknown'];

/**
 * How often each code comes up, out of a hundred draws with every one of them
 * switched on. A code that is switched off drops out and the rest keep their
 * proportions, so the two that are always on split evenly on their own, `unknown`
 * is about one draw in eleven beside them, and `nonbinary` about one in a
 * hundred: rare, the way it is in a population, and still there to be seen.
 */
export const GENDER_WEIGHTS: Record<GenderCode, number> = {
	male: 45,
	female: 45,
	nonbinary: 1,
	unknown: 9
};

/**
 * Each code as a form in the language labels it: the word a sign-up page or a
 * table of records writes, rather than the noun for a person. German writes
 * `Divers`, the third option its own forms carry, and Spanish, Italian and
 * Russian write the adjective that agrees with their word for the field
 * (`sexo`, `genere`, `пол`), which is how a form in those languages reads.
 */
export const GENDER_LABELS: Record<WordLanguage, Record<GenderCode, string>> = {
	en: { male: 'Male', female: 'Female', nonbinary: 'Non-binary', unknown: 'Unknown' },
	ko: { male: '남성', female: '여성', nonbinary: '논바이너리', unknown: '미상' },
	ja: { male: '男性', female: '女性', nonbinary: 'ノンバイナリー', unknown: '不明' },
	zh: { male: '男', female: '女', nonbinary: '非二元性别', unknown: '未知' },
	vi: { male: 'Nam', female: 'Nữ', nonbinary: 'Phi nhị nguyên giới', unknown: 'Không xác định' },
	es: { male: 'Masculino', female: 'Femenino', nonbinary: 'No binario', unknown: 'Desconocido' },
	it: { male: 'Maschile', female: 'Femminile', nonbinary: 'Non binario', unknown: 'Sconosciuto' },
	de: { male: 'Männlich', female: 'Weiblich', nonbinary: 'Divers', unknown: 'Unbekannt' },
	ru: { male: 'Мужской', female: 'Женский', nonbinary: 'Небинарный', unknown: 'Не указан' }
};

/**
 * Every identity `nonbinaryIdentity` draws from, most common first: the ones
 * the Gender Census offers as a checkbox that name a gender outside the two.
 * The census's other boxes describe something else (`trans`, `queer`, `gender
 * non-conforming`) or are another spelling of one here (`enby`). An identity
 * that belongs to one culture (two-spirit, hijra) is left out, because a
 * sample person drawn in any of nine languages has no claim to it.
 */
export const NONBINARY_IDENTITIES: readonly NonbinaryIdentity[] = [
	'nonbinary',
	'genderqueer',
	'genderfluid',
	'agender',
	'demigirl',
	'demiboy',
	'bigender'
];

/**
 * How often each identity comes up: the share of the Gender Census 2024 who
 * ticked it, rounded to a whole percent. One person could tick several, so the
 * weights do not add up to a hundred, and `pickWeighted` does not need them to.
 */
export const NONBINARY_WEIGHTS: Record<NonbinaryIdentity, number> = {
	nonbinary: 60,
	genderqueer: 33,
	genderfluid: 25,
	agender: 23,
	demigirl: 7,
	demiboy: 6,
	bigender: 6
};

/**
 * Each identity as the language writes it. Most languages borrow the English
 * word or spell it out in their own script; Spanish and Vietnamese translate
 * it (`Género fluido`, `Linh hoạt giới`), and so does Chinese. German writes
 * `Nichtbinär` here rather than `Divers`, which is what a form offers and not
 * what anybody calls themselves.
 */
export const NONBINARY_LABELS: Record<WordLanguage, Record<NonbinaryIdentity, string>> = {
	en: {
		nonbinary: 'Non-binary',
		genderqueer: 'Genderqueer',
		genderfluid: 'Genderfluid',
		agender: 'Agender',
		demigirl: 'Demigirl',
		demiboy: 'Demiboy',
		bigender: 'Bigender'
	},
	ko: {
		nonbinary: '논바이너리',
		genderqueer: '젠더퀴어',
		genderfluid: '젠더플루이드',
		agender: '에이젠더',
		demigirl: '데미걸',
		demiboy: '데미보이',
		bigender: '바이젠더'
	},
	ja: {
		nonbinary: 'ノンバイナリー',
		genderqueer: 'ジェンダークィア',
		genderfluid: 'ジェンダーフルイド',
		agender: 'アジェンダー',
		demigirl: 'デミガール',
		demiboy: 'デミボーイ',
		bigender: 'バイジェンダー'
	},
	zh: {
		nonbinary: '非二元性别',
		genderqueer: '性别酷儿',
		genderfluid: '性别流动',
		agender: '无性别',
		demigirl: '半女性',
		demiboy: '半男性',
		bigender: '双性别'
	},
	vi: {
		nonbinary: 'Phi nhị nguyên giới',
		genderqueer: 'Nghi hoặc giới',
		genderfluid: 'Linh hoạt giới',
		agender: 'Vô giới',
		demigirl: 'Bán nữ',
		demiboy: 'Bán nam',
		bigender: 'Song giới'
	},
	es: {
		nonbinary: 'No binario',
		genderqueer: 'Genderqueer',
		genderfluid: 'Género fluido',
		agender: 'Agénero',
		demigirl: 'Demichica',
		demiboy: 'Demichico',
		bigender: 'Bigénero'
	},
	it: {
		nonbinary: 'Non binario',
		genderqueer: 'Genderqueer',
		genderfluid: 'Genderfluid',
		agender: 'Agender',
		demigirl: 'Demigirl',
		demiboy: 'Demiboy',
		bigender: 'Bigender'
	},
	de: {
		nonbinary: 'Nichtbinär',
		genderqueer: 'Genderqueer',
		genderfluid: 'Genderfluid',
		agender: 'Agender',
		demigirl: 'Demigirl',
		demiboy: 'Demiboy',
		bigender: 'Bigender'
	},
	ru: {
		nonbinary: 'Небинарный',
		genderqueer: 'Гендерквир',
		genderfluid: 'Гендерфлюид',
		agender: 'Агендер',
		demigirl: 'Демигерл',
		demiboy: 'Демибой',
		bigender: 'Бигендер'
	}
};
