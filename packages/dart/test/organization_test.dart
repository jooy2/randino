import 'package:randino/randino.dart';
// The datasets are internal, but an organization is only well formed if it is
// one of their templates with its gaps filled from their pools — these are what
// tie the output back to them.
import 'package:randino/src/organization/data/index.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/organization/organization_generator.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 3000;

String escape(String text) => RegExp.escape(text);

String alternation(List<String> pool) {
  final sorted = [...pool]..sort((a, b) => b.length.compareTo(a.length));

  return '(?:${sorted.map(escape).join('|')})';
}

/// Every word a language's companies can carry for their business.
List<String> descriptorsOf(WordLanguage language) {
  final data = organizationData[language]!;

  return [
    ...data.generic,
    for (final industry in organizationIndustries) ...data.industries[industry]!,
  ];
}

/// A template as a pattern that matches what it can write.
RegExp patternOf(WordLanguage language, String template, String stem) {
  final data = organizationData[language]!;
  final source = template.splitMapJoin(
    RegExp(r'\{(stem|industry|place|number)\}'),
    onMatch:
        (match) => switch (match.group(1)) {
          'stem' => stem,
          'industry' => alternation(descriptorsOf(language)),
          'place' => alternation(data.places ?? const <String>[]),
          _ => '[1-9][0-9]*',
        },
    onNonMatch: escape,
  );

  return RegExp('^$source\$', unicode: true);
}

/// The patterns a detail's name may match: its kind's templates, and a stem
/// alone for a company.
List<RegExp> patternsFor(OrganizationDetail detail, String stem) => [
  for (final template in [
    ...organizationData[detail.language]!.templates[detail.type]!,
    if (detail.type == OrganizationType.company) '{stem}',
  ])
    patternOf(detail.language, template, stem),
];

/// The stem a detail's name was built from: the shortest one any template
/// that matches leaves, which is the one the most particular template left.
String? stemOf(OrganizationDetail detail) {
  final stems = [
    for (final pattern in patternsFor(detail, '(.+?)'))
      // A numbered template has no stem, and so no group to read.
      if (pattern.firstMatch(detail.name) case final match? when match.groupCount > 0)
        match.group(1)!,
  ];

  return stems.isEmpty ? null : stems.reduce((a, b) => b.length < a.length ? b : a);
}

/// Whether a name is one of its language's templates filled from its pools.
bool isWellFormed(OrganizationDetail detail) {
  final stems = alternation(organizationData[detail.language]!.stems);

  return patternsFor(detail, stems).any((pattern) => pattern.hasMatch(detail.name));
}

/// Whether the organization is the name with the legal form written around it.
bool wearsItsForm(OrganizationDetail detail) {
  if (detail.legalForm == null) {
    return detail.organization == detail.name;
  }

  return organizationData[detail.language]!.legalForms.any(
    (form) =>
        legalFormOf(form) == detail.legalForm &&
        form.replaceFirst('{name}', detail.name) == detail.organization,
  );
}

void main() {
  group('Organization', () {
    test('randOrganization returns one organization by default', () {
      expect(randOrganization(), hasLength(1));
    });

    test('returns exactly `count` organizations', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randOrganization(count: count), hasLength(count));
      }

      expect(randOrganization(count: -3), isEmpty);
      expect(randOrganization(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every name is one of the templates of its language, filled from its pools', () {
      for (final language in WordLanguage.values) {
        for (final detail in randOrganizationDetails(language: language, count: sample * 3)) {
          expect(detail.language, language);
          expect(isWellFormed(detail), isTrue, reason: '${language.name}: ${detail.name}');
          expect(wearsItsForm(detail), isTrue, reason: '${language.name}: ${detail.organization}');
        }
      }
    });

    test('the value form is the whole organization', () {
      expect(
        randOrganization(
          language: WordLanguage.ru,
          type: {OrganizationType.company},
          includeLegalForm: true,
        ).first,
        matches(RegExp(r'^(ООО|АО|ПАО) «.+»$')),
      );
    });

    test('type narrows the kinds, one or several', () {
      for (final type in OrganizationType.values) {
        for (final detail in randOrganizationDetails(type: {type}, count: sample)) {
          expect(detail.type, type);
        }
      }

      expect(
        {
          for (final detail in randOrganizationDetails(
            type: {OrganizationType.school, OrganizationType.public},
            count: sample,
          ))
            detail.type,
        },
        <OrganizationType>{OrganizationType.school, OrganizationType.public},
      );
    });

    test('every kind comes up when none is named, companies most often', () {
      final counts = <OrganizationType, int>{};

      for (final detail in randOrganizationDetails(count: large)) {
        counts[detail.type] = (counts[detail.type] ?? 0) + 1;
      }

      expect(counts, hasLength(OrganizationType.values.length));
      expect(
        (counts.entries.toList()..sort((a, b) => b.value.compareTo(a.value))).first.key,
        OrganizationType.company,
      );
      expect(organizationTypeWeights.values.reduce((a, b) => a + b), 100);
    });

    test('an industry is carried by the name of the company, and asks for companies', () {
      for (final language in WordLanguage.values) {
        for (final industry in OrganizationIndustry.values) {
          final words = organizationData[language]!.industries[industry]!;

          for (final detail in randOrganizationDetails(
            language: language,
            industry: industry,
            count: 12,
          )) {
            expect(detail.type, OrganizationType.company);
            expect(detail.industry, industry);
            expect(words.any(detail.name.contains), isTrue, reason: detail.name);
          }
        }
      }
    });

    test('an industry narrows the companies among other kinds and leaves the rest alone', () {
      final details = randOrganizationDetails(
        type: {OrganizationType.company, OrganizationType.school},
        industry: OrganizationIndustry.food,
        count: sample * 2,
      );

      for (final detail in details) {
        expect(
          detail.industry,
          detail.type == OrganizationType.company ? OrganizationIndustry.food : null,
        );
      }

      expect(details.any((detail) => detail.type == OrganizationType.school), isTrue);
    });

    test('only a company carries an industry or a legal form', () {
      for (final detail in randOrganizationDetails(count: large)) {
        if (detail.type != OrganizationType.company) {
          expect(detail.industry, isNull, reason: detail.organization);
          expect(detail.legalForm, isNull, reason: detail.organization);
        }
      }
    });

    test(
      'includeLegalForm decides the legal form of every company, and null leaves it to chance',
      () {
        List<OrganizationDetail> companies(bool? includeLegalForm) => randOrganizationDetails(
          type: {OrganizationType.company},
          includeLegalForm: includeLegalForm,
          count: sample * 3,
        );

        expect(companies(true).every((detail) => detail.legalForm != null), isTrue);
        expect(companies(false).every((detail) => detail.legalForm == null), isTrue);

        final either = companies(null);

        expect(either.any((detail) => detail.legalForm != null), isTrue);
        expect(either.any((detail) => detail.legalForm == null), isTrue);
      },
    );

    test('a company named by its stem alone always carries a legal form', () {
      for (final detail in randOrganizationDetails(
        type: {OrganizationType.company},
        count: large,
      )) {
        if (detail.industry == null &&
            organizationData[detail.language]!.stems.contains(detail.name)) {
          expect(detail.legalForm, isNotNull, reason: detail.organization);
        }
      }

      for (final detail in randOrganizationDetails(
        type: {OrganizationType.company},
        includeLegalForm: false,
        count: sample * 3,
      )) {
        expect(organizationData[detail.language]!.stems.contains(detail.name), isFalse);
      }
    });

    test('startsWith reads the name, not a legal form in front of it', () {
      const leads = <WordLanguage, String>{
        WordLanguage.en: 'W',
        WordLanguage.ko: '해',
        WordLanguage.ja: '青',
        WordLanguage.zh: '新',
        WordLanguage.vi: 'C',
        WordLanguage.es: 'C',
        WordLanguage.it: 'C',
        WordLanguage.de: 'S',
        WordLanguage.ru: 'Ш',
      };

      for (final language in WordLanguage.values) {
        final startsWith = leads[language]!;
        final details = randOrganizationDetails(
          language: language,
          startsWith: startsWith,
          count: sample,
        );

        expect(details, hasLength(sample), reason: language.name);

        for (final detail in details) {
          expect(
            detail.name.toLowerCase().startsWith(startsWith.toLowerCase()),
            isTrue,
            reason: '${language.name}: ${detail.name}',
          );
        }
      }
    });

    test('a first character no stem starts with is answered with an invented one', () {
      final details = randOrganizationDetails(
        language: WordLanguage.ko,
        startsWith: '퐁',
        count: sample,
      );

      expect(details, hasLength(sample));
      expect(details.every((detail) => detail.name.startsWith('퐁')), isTrue);
      expect(randOrganization(language: WordLanguage.ko, startsWith: 'Q', count: 5), isEmpty);
    });

    test('realism invents the stem and nothing else', () {
      for (final language in WordLanguage.values) {
        final data = organizationData[language]!;
        var invented = 0;
        var withStems = 0;

        for (final detail in randOrganizationDetails(
          language: language,
          realism: RandRealism.invented,
          count: sample,
        )) {
          final stem = stemOf(detail);

          // A numbered school or station has no stem to invent.
          if (stem == null) {
            expect(isWellFormed(detail), isTrue, reason: detail.name);
            continue;
          }

          withStems += 1;

          if (!data.stems.contains(stem)) {
            invented += 1;
          }

          final syn = data.syn;

          if (syn is OrganizationPoolSynthesis) {
            final parts = syn.joiner.isEmpty ? stem.split('') : stem.split(syn.joiner);

            expect(parts.every(syn.pool.contains), isTrue, reason: '${language.name}: $stem');
          }
        }

        // A stem spelled at random can be one the language already holds (다솔).
        expect(invented, greaterThan(withStems * 0.8), reason: language.name);
      }
    });

    test('the length options bound the whole organization, legal form and all', () {
      for (final language in WordLanguage.values) {
        for (final organization in randOrganization(
          language: language,
          maxLength: 24,
          count: sample,
        )) {
          expect(organization.length, lessThanOrEqualTo(24), reason: organization);
        }

        for (final organization in randOrganization(
          language: language,
          minLength: 12,
          count: sample,
        )) {
          expect(organization.length, greaterThanOrEqualTo(12), reason: organization);
        }
      }

      // A range nothing reaches is answered with the closest, never with nothing.
      expect(randOrganization(language: WordLanguage.en, maxLength: 3, count: 5), hasLength(5));
    });

    test('the datasets are complete and every organization fits inside the ceiling', () {
      int longest(List<String> pool) =>
          pool.isEmpty ? 0 : pool.map((each) => each.length).reduce((a, b) => a > b ? a : b);

      for (final language in WordLanguage.values) {
        final data = organizationData[language]!;
        final words = descriptorsOf(language);

        expect(data.stems.length, greaterThanOrEqualTo(30));
        expect(data.stems.toSet(), hasLength(data.stems.length));
        expect(words.toSet(), hasLength(words.length));
        expect(data.legalForms.every((form) => form.contains('{name}')), isTrue);

        for (final industry in OrganizationIndustry.values) {
          expect(data.industries[industry]!.length, greaterThanOrEqualTo(4));
        }

        for (final template in data.templates[OrganizationType.company]!) {
          expect(template, contains('{industry}'));
        }

        final syn = data.syn;
        final made = switch (syn) {
          OrganizationPoolSynthesis() => syn.maxSyllables * (longest(syn.pool) + syn.joiner.length),
          OrganizationSyllableSynthesis() =>
            syn.maxSyllables * (longest(syn.onset) + longest(syn.vowel)) + longest(syn.coda),
        };
        final stem = longest(data.stems) > made ? longest(data.stems) : made;
        final form = longest(data.legalForms) - '{name}'.length;

        for (final type in OrganizationType.values) {
          expect(data.templates[type], isNotEmpty);

          for (final template in data.templates[type]!) {
            final filled = template
                .replaceFirst('{stem}', 'x' * stem)
                .replaceFirst('{industry}', 'x' * longest(words))
                .replaceFirst('{place}', 'x' * longest(data.places ?? const <String>[]))
                .replaceFirst('{number}', '${data.numbers?.$2 ?? ''}');
            final length = filled.length + (type == OrganizationType.company ? form : 0);

            expect(
              length,
              lessThanOrEqualTo(randOrganizationLengthMax),
              reason: '${language.name}: $template',
            );
          }
        }
      }
    });

    test('a null language mixes every language', () {
      expect({
        for (final detail in randOrganizationDetails(count: sample * 5)) detail.language,
      }, hasLength(WordLanguage.values.length));
    });

    test('an invented stem never spells a company the pool was trimmed against', () {
      // The pools leave out a syllable of each company two of their syllables
      // could spell, and a `startsWith` on that syllable put it back in front:
      // `동` gave `동아지방법원`, `辉` gave `辉瑞能源股份有限公司`.
      for (final language in wordLanguages) {
        final syn = organizationData[language]!.syn;

        if (syn is! OrganizationPoolSynthesis) continue;

        for (final brand in syn.avoid) {
          for (final realism in [RandRealism.real, RandRealism.invented]) {
            for (final name in randOrganization(
              language: language,
              startsWith: brand[0],
              realism: realism,
              count: 40,
            )) {
              expect(syn.avoid.any(name.contains), isFalse, reason: '${language.name}: $name');
            }
          }
        }
      }
    });

    test('unique never repeats an organization', () {
      final organizations = randOrganization(language: WordLanguage.en, unique: true, count: 300);

      expect(organizations.toSet(), hasLength(organizations.length));
    });
  });
}
