// Reads the Dart package's datasets and writes them in the canonical shape
// `index.mjs` compares. See `tools/parity/README.md` for what canonical means.
//
// The file sits outside the package, so `dart run` cannot resolve `package:`
// imports from its own location — `index.mjs` passes the package's config with
// `--packages`. Keeping it here rather than in `packages/dart/tool` is what
// keeps the three dumps side by side.

import 'dart:convert';

import 'package:randino/src/constants.dart';
import 'package:randino/src/decorate/data/index.dart';
import 'package:randino/src/name/data/index.dart';
import 'package:randino/src/name/data/ko.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/data/types.dart';

/// Flattens a name pool: a plain entry carries no reading, a token does.
List<Map<String, String?>>? pool(NamePool? source) => source
    ?.map((entry) => <String, String?>{'n': entry.n, 'r': entry.r})
    .toList();

/// Flattens a word pool.
List<String>? listed(List<String>? source) => source?.toList();

/// Flattens a lookup, keyed by string so a syllable count compares as one.
Map<String, Object>? mapped(Map<Object, Object>? source) =>
    source?.map((key, value) => MapEntry('$key', value));

/// The name order, in the spelling the npm package writes it in.
String orderOf(NameOrder order) =>
    order == NameOrder.givenFirst ? 'given-first' : 'family-first';

/// The syllable set every language builds invented parts from.
Map<String, Object?> synOf(SyllableSet syn) => <String, Object?>{
  'onset': syn.onset,
  'vowel': syn.vowel,
  'coda': syn.coda,
  'minSyllables': syn.minSyllables,
  'maxSyllables': syn.maxSyllables,
};

void main() {
  final word = <String, Object?>{
    for (final entry in wordData.entries)
      entry.key.name: <String, Object?>{
        'joiner': entry.value.joiner,
        'capitalize': entry.value.capitalize,
        'adjectives': listed(entry.value.adjectives),
        'actions': listed(entry.value.actions),
        'parts': listed(entry.value.parts),
        // Optional in one package and defaulted in another; written as a list
        // either way so the shapes compare.
        'frames': <Object?>[
          for (final frame in entry.value.frames)
            <String, Object?>{
              'slots': <String>[for (final slot in frame.slots) slot.name],
              'glue': <String>[...?frame.glue],
              'weight': frame.weight,
            },
        ],
        'nouns': <String, Object?>{
          for (final noun in entry.value.nouns.entries)
            noun.key.name: listed(noun.value),
        },
        // The npm package tags the two shapes with `kind`; here they are two
        // classes, so the tag is written back out for the comparison.
        'syn': switch (entry.value.syn) {
          SyllableSynthesis(:final onset, :final vowel, :final coda) =>
            <String, Object?>{
              'kind': 'syllable',
              'onset': onset,
              'vowel': vowel,
              'coda': coda,
              'minSyllables': entry.value.syn.minSyllables,
              'maxSyllables': entry.value.syn.maxSyllables,
            },
          PoolSynthesis(:final pool) => <String, Object?>{
            'kind': 'pool',
            'pool': pool,
            'minSyllables': entry.value.syn.minSyllables,
            'maxSyllables': entry.value.syn.maxSyllables,
          },
        },
      },
  };

  final name = <String, Object?>{
    for (final entry in nameData.entries)
      entry.key.name: <String, Object?>{
        'order': orderOf(entry.value.order),
        'joiner': entry.value.joiner,
        'hasMiddle': entry.value.hasMiddle,
        'roman': entry.value.roman.name,
        'lengthSpec': <String, Object?>{
          'given': <int>[
            entry.value.lengthSpec.given.min,
            entry.value.lengthSpec.given.max,
          ],
          'last': <int>[
            entry.value.lengthSpec.last.min,
            entry.value.lengthSpec.last.max,
          ],
          'middle': <int>[
            entry.value.lengthSpec.middle.min,
            entry.value.lengthSpec.middle.max,
          ],
        },
        'last': pool(entry.value.last),
        'lastWeights': mapped(entry.value.lastWeights),
        'male': pool(entry.value.male),
        'female': pool(entry.value.female),
        'middleMale': pool(entry.value.middleMale),
        'middleFemale': pool(entry.value.middleFemale),
        'givenMale': pool(entry.value.givenMale),
        'givenFemale': pool(entry.value.givenFemale),
        'givenLenWeights': mapped(entry.value.givenLenWeights),
        'firstMale': pool(entry.value.firstMale),
        'restMale': pool(entry.value.restMale),
        'firstFemale': pool(entry.value.firstFemale),
        'restFemale': pool(entry.value.restFemale),
        'syn': entry.value.syn == null ? null : synOf(entry.value.syn!),
      },
  };

  print(
    jsonEncode(<String, Object?>{
      'constants': <String, Object?>{
        'randCountMax': randCountMax,
        'randLengthMin': randLengthMin,
        'randLengthMax': randLengthMax,
        'affixLengthDefault': affixLengthDefault,
        'affixLengthMax': affixLengthMax,
        'affixSeparatorDefault': affixSeparatorDefault,
        'affixCharset': affixCharset,
      },
      'word': <String, Object?>{
        'languages': <String>[
          for (final language in wordLanguages) language.name,
        ],
        'themes': <String>[for (final theme in wordThemes) theme.name],
        'data': word,
      },
      'name': <String, Object?>{
        'languages': <String>[
          for (final language in nameLanguages) language.name,
        ],
        'koSurnameRoman': koSurnameRoman,
        'data': name,
      },
    }),
  );
}
