import 'dart:io';

import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but every generator's length options go through it.
import 'package:randino/src/internal/generate.dart';
import 'package:test/test.dart';

/// Every name `lib/randino.dart` exports, read out of its `show` clauses.
///
/// Dart has no way to ask a library what it exports at run time, so the source
/// is what gets asked. That is not a detour: the barrel's `show` clauses **are**
/// the API contract here — a symbol that reaches a caller without being listed
/// in one is a leak, and this reads the same list a reader of that file does.
Set<String> exportedNames() {
  final source = File('lib/randino.dart').readAsStringSync();
  final names = <String>{};

  for (final match in RegExp(r'show\s+([^;]+);').allMatches(source)) {
    for (final name in match.group(1)!.split(',')) {
      final trimmed = name.trim();

      if (trimmed.isNotEmpty) {
        names.add(trimmed);
      }
    }
  }

  return names;
}

void main() {
  group('base test', () {
    test('the package exports exactly its public API', () {
      // Everything documented on the site has to be reachable from the barrel,
      // and nothing internal should leak through it.
      expect(
        exportedNames().toList()..sort(),
        <String>[
          'AgeDetail',
          'AgeDistribution',
          'AgeGroup',
          'CountryDetail',
          'DateDetail',
          'DateUnit',
          'GenderCode',
          'GenderDetail',
          'LengthRange',
          'LocationDetail',
          'LocationLanguage',
          'LocationLevel',
          'ModifierKind',
          'NameDetail',
          'NameGender',
          'NameLanguage',
          'NameScript',
          'NicknameDetail',
          'OrganizationDetail',
          'OrganizationIndustry',
          'OrganizationType',
          'PhoneCountry',
          'PhoneDetail',
          'PhoneType',
          'RandRealism',
          'RandVocabulary',
          'SentenceDetail',
          'SentenceQuote',
          'SentenceShape',
          'SentenceType',
          'SentenceSlot',
          'SentenceStory',
          'SentenceStyle',
          'SentenceTense',
          'WordDetail',
          'WordLanguage',
          'WordSlot',
          'WordTheme',
          'affixCharset',
          'affixLengthDefault',
          'affixLengthMax',
          'affixSeparatorDefault',
          'ageGroups',
          'dateUnits',
          'locationLanguages',
          'locationLevels',
          'nameLanguages',
          'nameLengthRange',
          'nameSupportsMiddleName',
          'nameSupportsRoman',
          'organizationIndustries',
          'organizationTypes',
          'phoneCountries',
          'phoneTypes',
          'wordLanguages',
          'nicknameLengthRange',
          'sentenceLengthRange',
          'wordThemes',
          'randAge',
          'randAgeDetails',
          'randAgeMax',
          'randAnimal',
          'randBody',
          'randCity',
          'randCityDetails',
          'randClothing',
          'randColor',
          'randConcept',
          'randCountMax',
          'randCountry',
          'randCountryDetails',
          'randDate',
          'randDateDetails',
          'randDateUnit',
          'randDistrict',
          'randDistrictDetails',
          'randDrink',
          'randEmotion',
          'randFinance',
          'randFood',
          'randFurniture',
          'randGender',
          'randGenderDetails',
          'randGem',
          'randJob',
          'randLengthMax',
          'randLengthMin',
          'randLocation',
          'randLocationDetails',
          'randLocationLengthMax',
          'randSentenceCountMax',
          'randSentenceLengthMax',
          'randModifier',
          'randModifierAll',
          'randMusic',
          'randMyth',
          'randName',
          'randNameDetails',
          'randNature',
          'randNickname',
          'randNicknameDetails',
          'randObject',
          'randOrganization',
          'randOrganizationDetails',
          'randOrganizationLengthMax',
          'randPerson',
          'randPhone',
          'randPhoneDetails',
          'randPlace',
          'randPlant',
          'randPrefix',
          'randPrefixAll',
          'randProduct',
          'randRegion',
          'randRegionDetails',
          'randSentence',
          'randSound',
          'randSentenceDetails',
          'randSpace',
          'randSport',
          'randSuffix',
          'randSuffixAll',
          'randTech',
          'randTime',
          'randTool',
          'randToy',
          'randVehicle',
          'randWeather',
          'randWord',
          'randWordDetails',
          'wordLengthRange',
        ]..sort(),
      );
    });

    test('every exported function answers', () {
      expect(randName(), hasLength(1));
      expect(randNameDetails()[0], isA<NameDetail>());
      expect(nameLengthRange(), isA<LengthRange>());
      expect(nameSupportsMiddleName(), isA<bool>());
      expect(nameSupportsRoman(), isA<bool>());

      expect(randNickname(), hasLength(1));
      expect(randNicknameDetails()[0], isA<NicknameDetail>());
      expect(nicknameLengthRange(), isA<LengthRange>());

      expect(randSuffix(value: 'a'), startsWith('a_'));
      expect(randPrefix(value: 'a'), endsWith('_a'));
      // The decorators work with nothing to decorate, which is what makes what
      // they attach available on its own.
      expect(randSuffix(), hasLength(affixLengthDefault));
      expect(randPrefix(), hasLength(affixLengthDefault));
      expect(randModifier(), isNotEmpty);
      expect(randModifier(value: '사자'), endsWith('사자'));
      expect(randModifierAll(const ['사자', '여우']), hasLength(2));
      expect(randSuffixAll(const ['a', 'b']), hasLength(2));
      expect(randPrefixAll(const ['a', 'b']), hasLength(2));

      expect(randWord(), hasLength(1));
      expect(randWordDetails()[0], isA<WordDetail>());
      expect(wordLengthRange(), isA<LengthRange>());

      // A sentence is many words rather than at most three, so it is the one
      // generator with a length ceiling of its own.
      expect(randSentence(), hasLength(1));
      expect(randSentenceDetails()[0], isA<SentenceDetail>());
      expect(sentenceLengthRange(), isA<LengthRange>());
      expect(randSentenceLengthMax, 200);
      expect(randSentenceCountMax, 10);
      expect(randAnimal(language: WordLanguage.ko), hasLength(1));

      // A location written out is every level of it at once, so it has a length
      // ceiling of its own, and one generator per level below it.
      expect(randLocation(language: LocationLanguage.ko), hasLength(1));
      expect(randLocationDetails()[0].country, isNotEmpty);
      expect(randCountry(), hasLength(1));
      expect(randCountryDetails()[0], isA<CountryDetail>());
      expect(randRegion(), hasLength(1));
      expect(randRegionDetails()[0], isA<LocationDetail>());
      expect(randCity(), hasLength(1));
      expect(randCityDetails(language: LocationLanguage.en)[0].level, LocationLevel.city);
      expect(randDistrict(), hasLength(1));
      expect(randDistrictDetails()[0], isA<LocationDetail>());
      expect(randLocationLengthMax, 100);
      expect(locationLevels, <LocationLevel>[
        LocationLevel.country,
        LocationLevel.region,
        LocationLevel.city,
        LocationLevel.district,
      ]);

      // An age is a number rather than a string, and its groups are what `group`
      // accepts.
      expect(randAge(), hasLength(1));
      expect(randAgeDetails()[0], isA<AgeDetail>());
      expect(randAgeMax, 120);
      expect(ageGroups, <AgeGroup>[AgeGroup.child, AgeGroup.teen, AgeGroup.adult, AgeGroup.senior]);

      // A date is a string written by `format`, and one part of it is a number,
      // which in Dart is a function of its own.
      expect(randDate(), hasLength(1));
      expect(randDateUnit(DateUnit.minute).single, isA<int>());
      expect(randDateDetails()[0], isA<DateDetail>());
      expect(dateUnits, DateUnit.values);

      expect(randGender(), hasLength(1));
      expect(randGenderDetails(language: WordLanguage.en)[0].language, WordLanguage.en);

      // An organization can be a name, a word for its business and a legal form
      // at once, so it has a length ceiling of its own.
      expect(randOrganization(), hasLength(1));
      expect(randOrganizationDetails()[0].name, isNotEmpty);
      expect(randOrganizationLengthMax, 60);
      expect(organizationTypes, <OrganizationType>[
        OrganizationType.company,
        OrganizationType.nonprofit,
        OrganizationType.school,
        OrganizationType.government,
        OrganizationType.public,
      ]);
      expect(organizationIndustries, hasLength(10));

      // A phone number is written by its country, one country per word
      // language.
      expect(randPhone(), hasLength(1));
      expect(randPhoneDetails()[0].e164, startsWith('+'));
      expect(phoneCountries, hasLength(wordLanguages.length));
      expect(phoneTypes, <PhoneType>[PhoneType.mobile, PhoneType.landline]);
    });

    test('the bounds are the same numbers the JavaScript package uses', () {
      expect(nameLanguages, hasLength(9));
      // One set of bounds for every generator, rather than one set per
      // category holding the same numbers.
      expect(randLengthMin, 1);
      expect(randLengthMax, 40);
      expect(randCountMax, 10000);

      expect(wordLanguages, hasLength(9));
      expect(wordThemes, hasLength(29));

      expect(affixLengthDefault, 5);
      expect(affixLengthMax, 32);
      expect(affixSeparatorDefault, '_');
      expect(affixCharset, matches(RegExp(r'^[0-9A-Za-z]+$')));
    });

    test('the enums list every code the datasets hold', () {
      // The two lists and the two enums are written out separately, and a
      // language added to one and not the other is a language the generator can
      // be asked for and cannot produce.
      expect(nameLanguages.toSet(), NameLanguage.values.toSet());
      expect(wordLanguages.toSet(), WordLanguage.values.toSet());
      expect(wordThemes.toSet(), WordTheme.values.toSet());
      expect(locationLanguages.toSet(), LocationLanguage.values.toSet());
      expect(locationLevels.toSet(), LocationLevel.values.toSet());
      expect(ageGroups.toSet(), AgeGroup.values.toSet());
      expect(organizationTypes.toSet(), OrganizationType.values.toSet());
      expect(organizationIndustries.toSet(), OrganizationIndustry.values.toSet());
    });

    test('a length range the wrong way round keeps maxLength', () {
      // `maxLength` is the bound a caller is holding to — a field limit, a column
      // width — where `minLength` only shapes how a result reads. `(30, 5)` used
      // to read as `(30, 30)`.
      expect(lengthBounds(30, 5, 3, 10), const LengthRange(5, 5));
      expect(lengthBounds(5, 30, 3, 10), const LengthRange(5, 30));

      for (final word in randWord(
        language: WordLanguage.en,
        minLength: 30,
        maxLength: 5,
        count: 60,
      )) {
        expect(word.length, lessThanOrEqualTo(5), reason: word);
      }
    });

    test('`random` is where every draw of a call comes from', () {
      // One source, threaded through everything the call reaches — which for
      // `randSentence` is the word pools, the story planner and the name
      // generator. Two calls with the same seed have to agree on all of it.
      void twice(String Function() draw) => expect(draw(), draw());

      twice(() => randName(language: NameLanguage.en, count: 5, random: Random(42)).join());
      twice(() => randWord(language: WordLanguage.ko, count: 5, random: Random(42)).join());
      twice(() => randAnimal(language: WordLanguage.en, count: 5, random: Random(42)).join());
      twice(() => randNickname(language: WordLanguage.en, count: 5, random: Random(42)).join());
      twice(
        () =>
            randSentence(
              language: WordLanguage.ko,
              count: 3,
              sentences: 3,
              random: Random(42),
            ).join(),
      );
      twice(() => randSuffix(value: 'MistyOwl', random: Random(42)));
      twice(() => randPrefix(value: 'MistyOwl', random: Random(42)));
      twice(() => randModifier(value: '사자', random: Random(42)));
      twice(() => randLocation(count: 5, random: Random(42)).join());
      twice(
        () =>
            randCity(
              language: LocationLanguage.en,
              maxLength: 8,
              count: 5,
              random: Random(42),
            ).join(),
      );
      twice(() => randAge(count: 5, random: Random(42)).join(','));
      twice(() => randDate(count: 5, random: Random(42)).join());
      twice(() => randDateUnit(DateUnit.minute, count: 5, random: Random(42)).join(','));
      twice(() => randPhone(count: 5, random: Random(42)).join());
      twice(() => randPhone(count: 5, fictional: true, random: Random(42)).join());
      twice(() => randGender(count: 5, includeUnknown: true, random: Random(42)).join());
      twice(() => randOrganization(count: 5, random: Random(42)).join('|'));
      twice(() => randOrganization(count: 5, maxLength: 20, random: Random(42)).join('|'));
      twice(() => randSuffixAll(const ['a', 'b'], random: Random(42)).join());
      twice(() => randModifierAll(const ['사자', '여우'], random: Random(42)).join());

      // Two different seeds are two different answers, so the source is actually
      // what the draws are coming from.
      expect(
        randName(language: NameLanguage.en, count: 5, random: Random(1)),
        isNot(randName(language: NameLanguage.en, count: 5, random: Random(2))),
      );

      // And the package's own source is put back afterwards.
      expect(randName(count: 5), isNot(randName(count: 5)));
    });

    test('LengthRange compares by value', () {
      expect(const LengthRange(1, 4), const LengthRange(1, 4));
      expect(const LengthRange(1, 4), isNot(const LengthRange(1, 5)));
      expect(const LengthRange(1, 4).hashCode, const LengthRange(1, 4).hashCode);
    });
  });
}
