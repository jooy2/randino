// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/types.dart';

/// The Italian organization dataset.
final OrganizationLanguageData it = OrganizationLanguageData(
  stems: words(r'''
    Valfiorita Colleverde Pratobello Borgoalto Fontechiara Poggio_Alto Rivabella
    Montelieto Valserena Castelluce Roccabella Bosco_Alto Valdirose Collesole
    Fiumebianco Prato_Fiorito Borgo_Sereno Lago_Chiaro Casalverde Vallerosa Pietraluce
    Sorgentina Valgioiosa Rocca_Serena Monterosso_Alto Campofiorito Torrelunga
    Selvachiara Pianverde Rivachiara Castelvento Poggiolieto Colle_Ameno Fontebella
    Valdisole Borgofiorito Montesereno Prato_Lungo Querceto Olmeda
  '''),
  syn: OrganizationSyllableSynthesis(
    onset: words(r'b c d f g l m n p r s t v br tr gr st ch'),
    vowel: words(r'a e i o u a o ia io'),
    coda: ['', '', '', '', ...words(r'n l r')],
    minSyllables: 2,
    maxSyllables: 3,
  ),
  industries: <OrganizationIndustry, List<String>>{
    OrganizationIndustry.tech: words(r'Tecnologie Sistemi Informatica Elettronica Software Reti'),
    OrganizationIndustry.manufacturing: words(
      r'Industrie Officine_Meccaniche Meccanica Chimica Metallurgica Plastica',
    ),
    OrganizationIndustry.food: words(r'Alimentari Pastificio Caseificio Conserve Forno Oleificio'),
    OrganizationIndustry.retail: words(r'Commerciale Distribuzione Magazzini Forniture Ingrosso'),
    OrganizationIndustry.finance: words(
      r'Finanziaria Investimenti Capitali Assicurazioni Gestioni_Patrimoniali',
    ),
    OrganizationIndustry.construction: words(
      r'Costruzioni Edilizia Immobiliare Impresa_Edile Restauri',
    ),
    OrganizationIndustry.logistics: words(
      r'Trasporti Logistica Spedizioni Autotrasporti Traslochi',
    ),
    OrganizationIndustry.media: words(r'Edizioni Comunicazione Produzioni Media Pubblicità Studio'),
    OrganizationIndustry.health: words(
      r'Farmaceutica Laboratori Biotecnologie Medicale Sanità Ortopedia',
    ),
    OrganizationIndustry.energy: words(
      r'Energia Energie_Rinnovabili Energia_Solare Elettrica Eolica Combustibili',
    ),
  },
  generic: words(r'Gruppo'),
  templates: <OrganizationType, List<String>>{
    OrganizationType.company: <String>['{industry} {stem}'],
    OrganizationType.nonprofit: <String>[
      'Fondazione {stem}',
      'Associazione {stem}',
      'Associazione Culturale {stem}',
      'Associazione Sportiva {stem}',
      'Pro Loco {stem}',
      'Circolo {stem}',
      'Croce Verde {stem}',
    ],
    OrganizationType.school: <String>[
      "Scuola dell'Infanzia {stem}",
      'Scuola Primaria {stem}',
      'Istituto Comprensivo {stem}',
      'Liceo Scientifico {stem}',
      'Liceo Classico {stem}',
      'Istituto Tecnico {stem}',
      'Università di {stem}',
    ],
    OrganizationType.government: <String>[
      'Comune di {stem}',
      'Questura di {stem}',
      'Prefettura di {stem}',
      'Tribunale di {stem}',
      'Polizia Locale di {stem}',
      'Stazione Carabinieri di {stem}',
    ],
    OrganizationType.public: <String>[
      'Biblioteca Comunale di {stem}',
      'Ospedale Civile di {stem}',
      'Museo Civico di {stem}',
      'Teatro Comunale di {stem}',
      'Centro Sportivo Comunale di {stem}',
      'Azienda Sanitaria di {stem}',
    ],
  },
  legalForms: <String>['{name} S.r.l.', '{name} S.p.A.', '{name} S.n.c.', '{name} S.a.s.'],
);
