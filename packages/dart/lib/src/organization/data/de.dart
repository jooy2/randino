// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/types.dart';

/// The German organization dataset.
final OrganizationLanguageData de = OrganizationLanguageData(
  stems: words(r'''
    Lindenhof Bergtal Sonnenberg Eichenwald Rosenau Birkenfeld Tannenhof Waldeck
    Lindenberg Falkenstein Adlerhorst Nordlicht Buchenau Erlenbach Fichtenau Haselbach
    Lerchenfeld Mühlental Quellental Rabenstein Silbertal Ulmenhof Weidenau Wiesental
    Ahornfeld Brunnental Felsenau Hainbach Kieselbach Morgenrot Sternfeld Eschenhain
    Talwiese Rotbuche Kranichsee Moosgrund Bachwiese Hochfeld Grünau Ostheide
  '''),
  syn: OrganizationSyllableSynthesis(
    onset: words(r'b br d f g h k kl l m n r s sch st t w'),
    vowel: words(r'a e i o u a e ei au ie'),
    coda: ['', ...words(r'n r l rt nd ck ng ld')],
    minSyllables: 2,
    maxSyllables: 2,
  ),
  industries: <OrganizationIndustry, List<String>>{
    OrganizationIndustry.tech: words(
      r'Software Systemtechnik Elektronik Informatik Digital Netzwerke',
    ),
    OrganizationIndustry.manufacturing: words(
      r'Maschinenbau Metallbau Präzisionstechnik Chemie Werkzeugbau Kunststofftechnik',
    ),
    OrganizationIndustry.food: words(r'Lebensmittel Backwaren Feinkost Molkerei Brauerei Mühle'),
    OrganizationIndustry.retail: words(r'Handel Handelshaus Großhandel Versand Warenhaus'),
    OrganizationIndustry.finance: words(
      r'Finanz Vermögensverwaltung Beteiligungen Versicherungsmakler Capital',
    ),
    OrganizationIndustry.construction: words(
      r'Bau Hochbau Tiefbau Immobilien Bauträger Architekten',
    ),
    OrganizationIndustry.logistics: words(r'Logistik Spedition Transporte Kurierdienst Umzüge'),
    OrganizationIndustry.media: words(r'Medien Verlag Werbeagentur Filmproduktion Kommunikation'),
    OrganizationIndustry.health: words(r'Pharma Medizintechnik Biotech Labor Gesundheit'),
    OrganizationIndustry.energy: words(r'Energie Solartechnik Windkraft Energietechnik Gas'),
  },
  generic: words(r'Gruppe Holding International'),
  templates: <OrganizationType, List<String>>{
    OrganizationType.company: <String>['{stem} {industry}'],
    OrganizationType.nonprofit: <String>[
      'Stiftung {stem}',
      'Bürgerstiftung {stem}',
      'Förderverein {stem} e.V.',
      'Heimatverein {stem} e.V.',
      'Kunstverein {stem} e.V.',
      'Sportverein {stem} e.V.',
      'Freundeskreis {stem} e.V.',
    ],
    OrganizationType.school: <String>[
      'Kindergarten {stem}',
      'Grundschule {stem}',
      'Realschule {stem}',
      'Gymnasium {stem}',
      'Gesamtschule {stem}',
      'Berufsschule {stem}',
      'Hochschule {stem}',
      'Universität {stem}',
    ],
    OrganizationType.government: <String>[
      'Stadtverwaltung {stem}',
      'Gemeindeverwaltung {stem}',
      'Bürgeramt {stem}',
      'Polizeiinspektion {stem}',
      'Freiwillige Feuerwehr {stem}',
      'Finanzamt {stem}',
      'Amtsgericht {stem}',
    ],
    OrganizationType.public: <String>[
      'Stadtbibliothek {stem}',
      'Klinikum {stem}',
      'Kreiskrankenhaus {stem}',
      'Stadtwerke {stem}',
      'Heimatmuseum {stem}',
      'Volkshochschule {stem}',
      'Verkehrsbetriebe {stem}',
    ],
  },
  legalForms: <String>[
    '{name} GmbH',
    '{name} AG',
    '{name} GmbH & Co. KG',
    '{name} KG',
    '{name} UG (haftungsbeschränkt)',
  ],
);
