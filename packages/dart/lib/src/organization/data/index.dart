import 'package:randino/src/organization/data/de.dart';
import 'package:randino/src/organization/data/en.dart';
import 'package:randino/src/organization/data/es.dart';
import 'package:randino/src/organization/data/it.dart';
import 'package:randino/src/organization/data/ja.dart';
import 'package:randino/src/organization/data/ko.dart';
import 'package:randino/src/organization/data/ru.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/organization/data/vi.dart';
import 'package:randino/src/organization/data/zh.dart';
import 'package:randino/src/types.dart';

/// The kinds of organization, a business first and the institutions after it.
final List<OrganizationType> organizationTypes =
    List<OrganizationType>.unmodifiable(<OrganizationType>[
      OrganizationType.company,
      OrganizationType.nonprofit,
      OrganizationType.school,
      OrganizationType.government,
      OrganizationType.public,
    ]);

/// What a company can do, which is the word its name carries for it.
final List<OrganizationIndustry> organizationIndustries =
    List<OrganizationIndustry>.unmodifiable(<OrganizationIndustry>[
      OrganizationIndustry.tech,
      OrganizationIndustry.manufacturing,
      OrganizationIndustry.food,
      OrganizationIndustry.retail,
      OrganizationIndustry.finance,
      OrganizationIndustry.construction,
      OrganizationIndustry.logistics,
      OrganizationIndustry.media,
      OrganizationIndustry.health,
      OrganizationIndustry.energy,
    ]);

/// How often each kind comes up when more than one is in play, out of a
/// hundred. Internal.
const Map<OrganizationType, int> organizationTypeWeights = <OrganizationType, int>{
  OrganizationType.company: 40,
  OrganizationType.nonprofit: 15,
  OrganizationType.school: 20,
  OrganizationType.government: 10,
  OrganizationType.public: 15,
};

/// How often a company with no industry asked for is its stem and a legal form
/// and nothing else, as a percentage. Internal.
const int organizationBareChance = 20;

/// How often a company with no industry asked for carries a word that names
/// none, as a percentage. Internal.
const int organizationGenericChance = 25;

/// How often a company carries its legal form when the caller left it to
/// chance, as a percentage. Internal.
const int organizationLegalFormChance = 50;

/// The dataset behind each language. Internal.
final Map<WordLanguage, OrganizationLanguageData> organizationData = Map<
  WordLanguage,
  OrganizationLanguageData
>.unmodifiable(<WordLanguage, OrganizationLanguageData>{
  WordLanguage.en: en,
  WordLanguage.ko: ko,
  WordLanguage.ja: ja,
  WordLanguage.zh: zh,
  WordLanguage.vi: vi,
  WordLanguage.es: es,
  WordLanguage.it: it,
  WordLanguage.de: de,
  WordLanguage.ru: ru,
});
