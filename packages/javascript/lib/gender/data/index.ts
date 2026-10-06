import type { GenderCode, WordLanguage } from '../../_types/global.js';

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
