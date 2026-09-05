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
import 'package:randino/src/sentence/data/index.dart';
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
        'nounGender': entry.value.nounGender == null
            ? null
            : <String, Object?>{
                for (final g in entry.value.nounGender!.entries) g.key: g.value.name,
              },
        'genderRules': entry.value.genderRules == null
            ? null
            : <Object?>[
                for (final rule in entry.value.genderRules!) <String>[rule.$1, rule.$2.name],
              ],
        'agreement': entry.value.agreement == null
            ? null
            : <String, Object?>{
                for (final g in entry.value.agreement!.entries)
                  g.key.name: <Object?>[for (final rule in g.value) <String>[...rule]],
              },
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

  final sentence = <String, Object?>{
    for (final entry in sentenceData.entries)
      entry.key.name: <String, Object?>{
        'space': entry.value.space,
        'capitalize': entry.value.capitalize,
        'terminators': <String, Object?>{
          for (final t in entry.value.terminators.entries) t.key.name: t.value,
        },
        // Optional in one package and defaulted in another; written as a map
        // either way so the shapes compare.
        'openers': <String, Object?>{
          for (final t in entry.value.openers.entries) t.key.name: t.value,
        },
        'quotes': <String, Object?>{
          for (final q in entry.value.quotes.entries) q.key.name: <String>[...q.value],
        },
        // Optional in one package and defaulted in another; written the same way
        // here either way, so the shapes compare.
        'predicateAgrees': entry.value.predicateAgrees,
        'articles': entry.value.articles == null
            ? null
            : <String, Object?>{
                for (final g in entry.value.articles!.entries)
                  g.key.name: <Object?>[for (final rule in g.value) <String>[...rule]],
              },
        'verbs': <Object?>[
          for (final group in entry.value.verbs)
            <String, Object?>{
              'subject': <String>[for (final noun in group.subject) noun.name],
              'object': group.object == null
                  ? null
                  : <String>[for (final noun in group.object!) noun.name],
              'words': listed(group.words),
              'forms': <String, Object?>{
                for (final f in group.forms.entries) f.key.name: listed(f.value),
              },
            },
        ],
        'states': <Object?>[
          for (final group in entry.value.states)
            <String, Object?>{
              'subject': <String>[for (final noun in group.subject) noun.name],
              'words': listed(group.words),
              'forms': <String, Object?>{
                for (final f in group.forms.entries) f.key.name: listed(f.value),
              },
            },
        ],
        'manners': listed(entry.value.manners),
        'times': listed(entry.value.times),
        'connectives': listed(entry.value.connectives),
        'interjections': listed(entry.value.interjections),
        'pronouns': <String, Object?>{
          for (final g in entry.value.pronouns.entries) g.key.name: listed(g.value),
        },
        // Optional in one package and defaulted in another; written as a list
        // either way so the shapes compare.
        'pronounless': <String>[for (final noun in entry.value.pronounless) noun.name],
        'numeral': entry.value.numeral == null
            ? null
            : <String, Object?>{
                'order': entry.value.numeral!.order.name,
                'counters': <String, Object?>{
                  for (final c in entry.value.numeral!.counters.entries) c.key.name: c.value,
                },
                'count': <int>[entry.value.numeral!.count.min, entry.value.numeral!.count.max],
                'currency': entry.value.numeral!.currency,
                'amounts': <int>[...entry.value.numeral!.amounts],
                'group': entry.value.numeral!.group,
                'gap': entry.value.numeral!.gap,
              },
        'calendar': entry.value.calendar == null
            ? null
            : <String, Object?>{
                'date': entry.value.calendar!.date,
                'months': entry.value.calendar!.months == null
                    ? null
                    : listed(entry.value.calendar!.months!),
                'clock': entry.value.calendar!.clock,
                'years': <int>[
                  entry.value.calendar!.years.min,
                  entry.value.calendar!.years.max,
                ],
                'copula': <String, Object?>{
                  'subject': <String>[
                    for (final noun in entry.value.calendar!.copula.subject) noun.name,
                  ],
                  'words': listed(entry.value.calendar!.copula.words),
                  'forms': <String, Object?>{
                    for (final f in entry.value.calendar!.copula.forms.entries)
                      f.key.name: listed(f.value),
                  },
                },
              },
        'frames': <Object?>[
          for (final frame in entry.value.frames)
            <String, Object?>{
              'parts': <Object?>[
                for (final part in frame.parts)
                  <String, Object?>{
                    'slot': part.slot.name,
                    'head': part.head ?? '',
                    'tail': part.tail ?? '',
                    'tailAlt': part.tailAlt ?? '',
                    'modifiable': part.modifiable,
                    'bare': part.bare,
                    'copula': part.copula?.name ?? '',
                  },
              ],
              'weight': frame.weight,
              'mood': frame.mood.name,
              'tag': frame.tag ?? '',
            },
        ],
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
        'randSentenceLengthMax': randSentenceLengthMax,
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
        'looseThemes': <String>[for (final theme in looseThemes) theme.name],
        'data': word,
      },
      'sentence': <String, Object?>{
        'themeClass': <String, Object?>{
          for (final entry in themeClass.entries) entry.key.name: entry.value.name,
        },
        'data': sentence,
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
