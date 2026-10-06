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
