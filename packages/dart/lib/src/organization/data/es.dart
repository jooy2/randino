// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/types.dart';

/// The Spanish organization dataset.
final OrganizationLanguageData es = OrganizationLanguageData(
  stems: words(r'''
    Valdeolmo Montealegre Peñaverde Robledal Fuentelaguna Riosol Valdecastro Castilnuevo
    Monteluz Prado_Alto Valleluna Arroyoclaro Vistalegre Bellamar Altozano Lomaverde
    Navalsol Peñaluna Villasol Fuentesol Riofresno Valdemora Sierra_Clara Montesol
    Costaluz Miravalle Llanoalto Olivar_Alto Campoclaro Robleda_Alta Torrealba
    Valdesierra Puentelargo Alcornal Encinar_del_Valle Las_Lomas El_Robledo Monteclaro
    Valfrío Rivaluz
  '''),
  syn: OrganizationSyllableSynthesis(
    onset: words(r'b c d f g l m n p r s t v br tr cl pl'),
    vowel: words(r'a e i o u a o ia io ue'),
    coda: ['', '', '', ...words(r'n s l r')],
    minSyllables: 2,
    maxSyllables: 3,
  ),
  industries: <OrganizationIndustry, List<String>>{
    OrganizationIndustry.tech: words(
      r'Tecnologías Sistemas Soluciones_Informáticas Software Electrónica Redes',
    ),
    OrganizationIndustry.manufacturing: words(
      r'Industrias Manufacturas Metalúrgica Química Talleres Plásticos',
    ),
    OrganizationIndustry.food: words(r'Alimentos Conservas Panadería Lácteos Bodegas Frutas'),
    OrganizationIndustry.retail: words(
      r'Comercial Distribuciones Almacenes Supermercados Suministros',
    ),
    OrganizationIndustry.finance: words(
      r'Inversiones Capital Finanzas Gestión_Patrimonial Seguros Asesores_Financieros',
    ),
    OrganizationIndustry.construction: words(
      r'Construcciones Inmobiliaria Promociones Arquitectura Obras_y_Reformas',
    ),
    OrganizationIndustry.logistics: words(r'Transportes Logística Mudanzas Mensajería Envíos'),
    OrganizationIndustry.media: words(
      r'Ediciones Comunicación Producciones Medios Publicidad Estudio',
    ),
    OrganizationIndustry.health: words(
      r'Laboratorios Farmacéutica Clínica Biotecnología Salud Ortopedia',
    ),
    OrganizationIndustry.energy: words(
      r'Energía Energías_Renovables Energía_Solar Eléctrica Eólica Combustibles',
    ),
  },
  generic: words(r'Grupo Corporación'),
  templates: <OrganizationType, List<String>>{
    OrganizationType.company: <String>['{industry} {stem}'],
    OrganizationType.nonprofit: <String>[
      'Fundación {stem}',
      'Asociación {stem}',
      'Asociación Cultural {stem}',
      'Asociación de Vecinos de {stem}',
      'Club Deportivo {stem}',
      'Banco de Alimentos de {stem}',
      'Peña {stem}',
    ],
    OrganizationType.school: <String>[
      'Escuela Infantil {stem}',
      'Colegio {stem}',
      'Colegio Público {stem}',
      'Instituto {stem}',
      'IES {stem}',
      'Liceo {stem}',
      'Universidad de {stem}',
    ],
    OrganizationType.government: <String>[
      'Ayuntamiento de {stem}',
      'Alcaldía de {stem}',
      'Municipalidad de {stem}',
      'Comisaría de {stem}',
      'Parque de Bomberos de {stem}',
      'Juzgado de Paz de {stem}',
      'Registro Civil de {stem}',
    ],
    OrganizationType.public: <String>[
      'Biblioteca Municipal de {stem}',
      'Hospital de {stem}',
      'Hospital General de {stem}',
      'Museo de {stem}',
      'Centro de Salud {stem}',
      'Centro Cultural {stem}',
      'Polideportivo Municipal de {stem}',
    ],
  },
  legalForms: <String>['{name}, S.A.', '{name}, S.L.', '{name}, S.A. de C.V.'],
);
