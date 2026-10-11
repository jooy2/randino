import 'package:randino/src/types.dart';

/// Every code a gender can be, in the order a form usually lists them.
/// Internal.
const List<GenderCode> genderCodes = <GenderCode>[
  GenderCode.male,
  GenderCode.female,
  GenderCode.nonbinary,
  GenderCode.unknown,
];

/// How often each code comes up, out of a hundred draws with every one of them
/// switched on. Internal.
///
/// A code that is switched off drops out and the rest keep their proportions,
/// so the two that are always on split evenly on their own, `unknown` is about
/// one draw in eleven beside them, and `nonbinary` about one in a hundred.
const Map<GenderCode, int> genderWeights = <GenderCode, int>{
  GenderCode.male: 45,
  GenderCode.female: 45,
  GenderCode.nonbinary: 1,
  GenderCode.unknown: 9,
};

/// Each code as a form in the language labels it. Internal.
///
/// The word a sign-up page or a table of records writes, rather than the noun
/// for a person. German writes `Divers`, the third option its own forms carry,
/// and Spanish, Italian and Russian write the adjective that agrees with their
/// word for the field.
const Map<WordLanguage, Map<GenderCode, String>> genderLabels =
    <WordLanguage, Map<GenderCode, String>>{
      WordLanguage.en: <GenderCode, String>{
        GenderCode.male: 'Male',
        GenderCode.female: 'Female',
        GenderCode.nonbinary: 'Non-binary',
        GenderCode.unknown: 'Unknown',
      },
      WordLanguage.ko: <GenderCode, String>{
        GenderCode.male: '남성',
        GenderCode.female: '여성',
        GenderCode.nonbinary: '논바이너리',
        GenderCode.unknown: '미상',
      },
      WordLanguage.ja: <GenderCode, String>{
        GenderCode.male: '男性',
        GenderCode.female: '女性',
        GenderCode.nonbinary: 'ノンバイナリー',
        GenderCode.unknown: '不明',
      },
      WordLanguage.zh: <GenderCode, String>{
        GenderCode.male: '男',
        GenderCode.female: '女',
        GenderCode.nonbinary: '非二元性别',
        GenderCode.unknown: '未知',
      },
      WordLanguage.vi: <GenderCode, String>{
        GenderCode.male: 'Nam',
        GenderCode.female: 'Nữ',
        GenderCode.nonbinary: 'Phi nhị nguyên giới',
        GenderCode.unknown: 'Không xác định',
      },
      WordLanguage.es: <GenderCode, String>{
        GenderCode.male: 'Masculino',
        GenderCode.female: 'Femenino',
        GenderCode.nonbinary: 'No binario',
        GenderCode.unknown: 'Desconocido',
      },
      WordLanguage.it: <GenderCode, String>{
        GenderCode.male: 'Maschile',
        GenderCode.female: 'Femminile',
        GenderCode.nonbinary: 'Non binario',
        GenderCode.unknown: 'Sconosciuto',
      },
      WordLanguage.de: <GenderCode, String>{
        GenderCode.male: 'Männlich',
        GenderCode.female: 'Weiblich',
        GenderCode.nonbinary: 'Divers',
        GenderCode.unknown: 'Unbekannt',
      },
      WordLanguage.ru: <GenderCode, String>{
        GenderCode.male: 'Мужской',
        GenderCode.female: 'Женский',
        GenderCode.nonbinary: 'Небинарный',
        GenderCode.unknown: 'Не указан',
      },
    };

/// Every identity `nonbinaryIdentity` draws from, most common first. Internal.
///
/// The ones the Gender Census offers as a checkbox that name a gender outside
/// the two. The census's other boxes describe something else (`trans`,
/// `queer`, `gender non-conforming`) or are another spelling of one here
/// (`enby`). An identity that belongs to one culture (two-spirit, hijra) is
/// left out, because a sample person drawn in any of nine languages has no
/// claim to it.
const List<NonbinaryIdentity> nonbinaryIdentities = <NonbinaryIdentity>[
  NonbinaryIdentity.nonbinary,
  NonbinaryIdentity.genderqueer,
  NonbinaryIdentity.genderfluid,
  NonbinaryIdentity.agender,
  NonbinaryIdentity.demigirl,
  NonbinaryIdentity.demiboy,
  NonbinaryIdentity.bigender,
];

/// How often each identity comes up. Internal.
///
/// The share of the Gender Census 2024 who ticked it, rounded to a whole
/// percent. One person could tick several, so the weights do not add up to a
/// hundred, and `pickWeighted` does not need them to.
const Map<NonbinaryIdentity, int> nonbinaryWeights = <NonbinaryIdentity, int>{
  NonbinaryIdentity.nonbinary: 60,
  NonbinaryIdentity.genderqueer: 33,
  NonbinaryIdentity.genderfluid: 25,
  NonbinaryIdentity.agender: 23,
  NonbinaryIdentity.demigirl: 7,
  NonbinaryIdentity.demiboy: 6,
  NonbinaryIdentity.bigender: 6,
};

/// Each identity as the language writes it. Internal.
///
/// Most languages borrow the English word or spell it out in their own
/// script; Spanish and Vietnamese translate it (`Género fluido`, `Linh hoạt
/// giới`), and so does Chinese. German writes `Nichtbinär` here rather than
/// `Divers`, which is what a form offers and not what anybody calls
/// themselves.
const Map<WordLanguage, Map<NonbinaryIdentity, String>> nonbinaryLabels =
    <WordLanguage, Map<NonbinaryIdentity, String>>{
      WordLanguage.en: <NonbinaryIdentity, String>{
        NonbinaryIdentity.nonbinary: 'Non-binary',
        NonbinaryIdentity.genderqueer: 'Genderqueer',
        NonbinaryIdentity.genderfluid: 'Genderfluid',
        NonbinaryIdentity.agender: 'Agender',
        NonbinaryIdentity.demigirl: 'Demigirl',
        NonbinaryIdentity.demiboy: 'Demiboy',
        NonbinaryIdentity.bigender: 'Bigender',
      },
      WordLanguage.ko: <NonbinaryIdentity, String>{
        NonbinaryIdentity.nonbinary: '논바이너리',
        NonbinaryIdentity.genderqueer: '젠더퀴어',
        NonbinaryIdentity.genderfluid: '젠더플루이드',
        NonbinaryIdentity.agender: '에이젠더',
        NonbinaryIdentity.demigirl: '데미걸',
        NonbinaryIdentity.demiboy: '데미보이',
        NonbinaryIdentity.bigender: '바이젠더',
      },
      WordLanguage.ja: <NonbinaryIdentity, String>{
        NonbinaryIdentity.nonbinary: 'ノンバイナリー',
        NonbinaryIdentity.genderqueer: 'ジェンダークィア',
        NonbinaryIdentity.genderfluid: 'ジェンダーフルイド',
        NonbinaryIdentity.agender: 'アジェンダー',
        NonbinaryIdentity.demigirl: 'デミガール',
        NonbinaryIdentity.demiboy: 'デミボーイ',
        NonbinaryIdentity.bigender: 'バイジェンダー',
      },
      WordLanguage.zh: <NonbinaryIdentity, String>{
        NonbinaryIdentity.nonbinary: '非二元性别',
        NonbinaryIdentity.genderqueer: '性别酷儿',
        NonbinaryIdentity.genderfluid: '性别流动',
        NonbinaryIdentity.agender: '无性别',
        NonbinaryIdentity.demigirl: '半女性',
        NonbinaryIdentity.demiboy: '半男性',
        NonbinaryIdentity.bigender: '双性别',
      },
      WordLanguage.vi: <NonbinaryIdentity, String>{
        NonbinaryIdentity.nonbinary: 'Phi nhị nguyên giới',
        NonbinaryIdentity.genderqueer: 'Nghi hoặc giới',
        NonbinaryIdentity.genderfluid: 'Linh hoạt giới',
        NonbinaryIdentity.agender: 'Vô giới',
        NonbinaryIdentity.demigirl: 'Bán nữ',
        NonbinaryIdentity.demiboy: 'Bán nam',
        NonbinaryIdentity.bigender: 'Song giới',
      },
      WordLanguage.es: <NonbinaryIdentity, String>{
        NonbinaryIdentity.nonbinary: 'No binario',
        NonbinaryIdentity.genderqueer: 'Genderqueer',
        NonbinaryIdentity.genderfluid: 'Género fluido',
        NonbinaryIdentity.agender: 'Agénero',
        NonbinaryIdentity.demigirl: 'Demichica',
        NonbinaryIdentity.demiboy: 'Demichico',
        NonbinaryIdentity.bigender: 'Bigénero',
      },
      WordLanguage.it: <NonbinaryIdentity, String>{
        NonbinaryIdentity.nonbinary: 'Non binario',
        NonbinaryIdentity.genderqueer: 'Genderqueer',
        NonbinaryIdentity.genderfluid: 'Genderfluid',
        NonbinaryIdentity.agender: 'Agender',
        NonbinaryIdentity.demigirl: 'Demigirl',
        NonbinaryIdentity.demiboy: 'Demiboy',
        NonbinaryIdentity.bigender: 'Bigender',
      },
      WordLanguage.de: <NonbinaryIdentity, String>{
        NonbinaryIdentity.nonbinary: 'Nichtbinär',
        NonbinaryIdentity.genderqueer: 'Genderqueer',
        NonbinaryIdentity.genderfluid: 'Genderfluid',
        NonbinaryIdentity.agender: 'Agender',
        NonbinaryIdentity.demigirl: 'Demigirl',
        NonbinaryIdentity.demiboy: 'Demiboy',
        NonbinaryIdentity.bigender: 'Bigender',
      },
      WordLanguage.ru: <NonbinaryIdentity, String>{
        NonbinaryIdentity.nonbinary: 'Небинарный',
        NonbinaryIdentity.genderqueer: 'Гендерквир',
        NonbinaryIdentity.genderfluid: 'Гендерфлюид',
        NonbinaryIdentity.agender: 'Агендер',
        NonbinaryIdentity.demigirl: 'Демигерл',
        NonbinaryIdentity.demiboy: 'Демибой',
        NonbinaryIdentity.bigender: 'Бигендер',
      },
    };
