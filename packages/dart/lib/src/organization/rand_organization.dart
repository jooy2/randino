import 'dart:math';

import 'package:randino/src/organization/organization_generator.dart';
import 'package:randino/src/types.dart';

/// Generate the names of organizations that do not exist: companies, schools,
/// government offices, public institutions and associations, written the way
/// the language writes each of them.
///
/// A name is built from a stem that is nobody's brand, a word for what a
/// company does, and the shape the language gives that kind of organization. A
/// company may carry its legal form — `Inc.`, `(주)`, `GmbH`, `ООО` — and
/// [includeLegalForm] left null decides it per company.
///
/// A null or empty [type] draws a kind per result, companies most often. An
/// [industry] is a company's: naming one with [type] left null asks for
/// companies, and with [type] naming other kinds too, it narrows the companies
/// among them. [startsWith] reads the name without its legal form, and
/// [minLength] and [maxLength] the whole organization.
///
/// ```dart
/// randOrganization(language: WordLanguage.ko, count: 3);
/// // [(주)새솔테크, 가람초등학교, 해솔구청]
/// randOrganization(
///   language: WordLanguage.en,
///   type: {OrganizationType.company},
///   industry: OrganizationIndustry.logistics,
/// );
/// // [Westbrook Freight, Inc.]
/// ```
List<String> randOrganization({
  WordLanguage? language,
  Set<OrganizationType>? type,
  OrganizationIndustry? industry,
  bool? includeLegalForm,
  int count = 1,
  RandRealism realism = RandRealism.real,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => [
  for (final detail in generateOrganizationDetails(
    language: language,
    type: type,
    industry: industry,
    includeLegalForm: includeLegalForm,
    count: count,
    realism: realism,
    minLength: minLength,
    maxLength: maxLength,
    startsWith: startsWith,
    unique: unique,
    random: random,
  ))
    detail.organization,
];
