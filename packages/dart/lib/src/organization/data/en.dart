// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/types.dart';

/// The English organization dataset.
final OrganizationLanguageData en = OrganizationLanguageData(
  stems: words(r'''
    Alder_Creek Ashbury Birchwood Blue_Heron Briar_Ridge Cedar_Grove Copper_Ridge
    Crestview Eastbrook Elmwood Fairhaven Fox_Hollow Glenwood Granite_Peak Greenbriar
    Harbor_Point Kestrel Lakemont Larkspur Maple_Ridge Millbrook Northfield Oak_Hollow
    Oakmont Pine_Hollow Quarry_Hill Ravenwood Red_Maple Riverbend Sandpiper Silver_Birch
    Stonebridge Summerfield Thornbury Timber_Creek Westbrook Whitfield Willow_Bend
    Wrenfield
  '''),
  syn: OrganizationSyllableSynthesis(
    onset: words(r'b br c cl d dr f fl g gr h k l m n p pr r s st t tr v w'),
    vowel: words(r'a e i o u a e o ai ea io'),
    coda: ['', '', ...words(r'n r s x l nt rk ll')],
    minSyllables: 2,
    maxSyllables: 3,
  ),
  industries: <OrganizationIndustry, List<String>>{
    OrganizationIndustry.tech: words(
      r'Technologies Software Systems Labs Digital Data Electronics Networks',
    ),
    OrganizationIndustry.manufacturing: words(
      r'Manufacturing Machine_Works Precision Fabrication Tooling Plastics Steel',
    ),
    OrganizationIndustry.food: words(r'Foods Bakery Farms Provisions Creamery Beverages Kitchen'),
    OrganizationIndustry.retail: words(r'Supply Trading Outfitters Mercantile Market Goods Retail'),
    OrganizationIndustry.finance: words(
      r'Capital Financial Advisors Investments Wealth_Management Insurance Asset_Management',
    ),
    OrganizationIndustry.construction: words(
      r'Construction Builders Homes Contracting Development Engineering Realty',
    ),
    OrganizationIndustry.logistics: words(
      r'Logistics Freight Shipping Transport Moving Express Courier',
    ),
    OrganizationIndustry.media: words(
      r'Media Studios Press Publishing Productions Broadcasting Creative',
    ),
    OrganizationIndustry.health: words(
      r'Health Medical Pharmaceuticals Biotech Therapeutics Diagnostics Care',
    ),
    OrganizationIndustry.energy: words(r'Energy Power Solar Utilities Wind Fuels Renewables'),
  },
  generic: words(r'Group Holdings Partners Enterprises International Industries'),
  templates: <OrganizationType, List<String>>{
    OrganizationType.company: <String>['{stem} {industry}'],
    OrganizationType.nonprofit: <String>[
      '{stem} Foundation',
      '{stem} Society',
      '{stem} Historical Society',
      '{stem} Arts Council',
      '{stem} Community Association',
      'Friends of {stem}',
      '{stem} Food Bank',
      '{stem} Animal Rescue',
      '{stem} Youth League',
    ],
    OrganizationType.school: <String>[
      '{stem} Elementary School',
      '{stem} Middle School',
      '{stem} High School',
      '{stem} Academy',
      '{stem} College',
      '{stem} University',
      'University of {stem}',
      '{stem} Community College',
      '{stem} Preparatory School',
      '{stem} Primary School',
    ],
    OrganizationType.government: <String>[
      '{stem} City Hall',
      '{stem} Police Department',
      '{stem} Fire Department',
      "{stem} County Sheriff's Office",
      '{stem} Municipal Court',
      '{stem} Department of Public Works',
      '{stem} Town Council',
      "{stem} County Clerk's Office",
    ],
    OrganizationType.public: <String>[
      '{stem} Public Library',
      '{stem} Transit Authority',
      '{stem} Water Authority',
      '{stem} Housing Authority',
      '{stem} Regional Medical Center',
      '{stem} General Hospital',
      '{stem} Museum of Art',
      '{stem} Community Health Center',
    ],
  },
  legalForms: <String>['{name}, Inc.', '{name} LLC', '{name} Corp.', '{name} Co.', '{name} Ltd.'],
);
