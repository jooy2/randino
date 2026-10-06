import 'dart:math';

import 'package:randino/src/organization/organization_generator.dart';
import 'package:randino/src/types.dart';

/// [randOrganization], along with the pieces each name was built from: the
/// name with and without its legal form, the form itself, its kind and its
/// industry.
///
/// Dart has neither overloads nor union types, so the detail form is its own
/// function rather than the `output` option the npm and PyPI packages take.
///
/// ```dart
/// randOrganizationDetails(language: WordLanguage.ko, type: {OrganizationType.company}).first;
/// // OrganizationDetail((주)새솔테크, 새솔테크, (주), company, tech, ko)
/// ```
List<OrganizationDetail> randOrganizationDetails({
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
}) => generateOrganizationDetails(
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
);
