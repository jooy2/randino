// Internal shape of the per-language organization datasets. Not part of the
// public API — callers only ever see the parameters and `OrganizationDetail`.

import 'package:randino/src/types.dart';

/// How a stem is spelled when `realism` asks for an invented one.
sealed class OrganizationSynthesis {
  /// Creates a synthesis template.
  const OrganizationSynthesis({required this.minSyllables, required this.maxSyllables});

  /// Fewest syllables in an invented stem.
  final int minSyllables;

  /// Most syllables in an invented stem.
  final int maxSyllables;
}

/// Onset and vowel, repeated, then one closing coda, written as one capitalized
/// word (`Valorin`) — for the alphabetic scripts.
class OrganizationSyllableSynthesis extends OrganizationSynthesis {
  /// Creates a syllable template.
  const OrganizationSyllableSynthesis({
    required this.onset,
    required this.vowel,
    required this.coda,
    required super.minSyllables,
    required super.maxSyllables,
  });

  /// Consonants a syllable can open with.
  final List<String> onset;

  /// Vowels a syllable is built around.
  final List<String> vowel;

  /// Endings the stem can close on. An empty entry leaves it open.
  final List<String> coda;
}

/// Whole syllables or characters out of a list, joined by [joiner] — nothing
/// for Korean, Japanese and Chinese (`솔람`, `瑞峰`), a space for Vietnamese,
/// whose syllables are written apart (`Lộc Phát`).
class OrganizationPoolSynthesis extends OrganizationSynthesis {
  /// Creates a syllable-pool template.
  const OrganizationPoolSynthesis({
    required this.pool,
    required this.joiner,
    required super.minSyllables,
    required super.maxSyllables,
  });

  /// The syllables to draw from.
  final List<String> pool;

  /// What goes between two of them.
  final String joiner;
}

/// One language's organizations: the stems a name is made from, the words that
/// say what a company does, and the shapes each kind of organization takes.
///
/// A template is written in the language's own order with a gap for each part:
/// `{stem}`, `{industry}`, `{place}` and `{number}`. See the JavaScript
/// package's `organization/data/types.ts` for what each one is.
class OrganizationLanguageData {
  /// Creates a dataset.
  const OrganizationLanguageData({
    required this.stems,
    required this.syn,
    this.places,
    this.numbers,
    required this.industries,
    required this.generic,
    required this.templates,
    required this.legalForms,
  });

  /// The organization's own name, the part nothing else decides.
  final List<String> stems;

  /// How a stem is invented when `realism` asks for one.
  final OrganizationSynthesis syn;

  /// Cities a company name may open on, for the language whose names do.
  final List<String>? places;

  /// The range a `{number}` is drawn from, for the language that numbers its
  /// institutions.
  final (int, int)? numbers;

  /// The words that say what a company does, per industry.
  final Map<OrganizationIndustry, List<String>> industries;

  /// Words a company name carries that say nothing about its business.
  final List<String> generic;

  /// The shapes each kind of organization takes.
  final Map<OrganizationType, List<String>> templates;

  /// A company's legal forms, each written around `{name}`.
  final List<String> legalForms;
}
