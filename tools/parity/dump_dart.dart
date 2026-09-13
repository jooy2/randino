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
import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/location/data/index.dart';
import 'package:randino/src/location/data/types.dart';
import 'package:randino/src/name/data/index.dart';
import 'package:randino/src/name/data/ko.dart';
import 'package:randino/src/name/data/types.dart';
import 'package:randino/src/sentence/data/index.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/data/types.dart';

/// Flattens a name pool: a plain entry carries no reading, a token does.
List<Map<String, String?>>? pool(NamePool? source) => source
    ?.map((entry) => <String, String?>{'n': entry.n, 'r': entry.r})
    .toList();

/// Flattens a word pool.
List<String>? listed(List<String>? source) => source?.toList();

/// A first or second person in the canonical shape, with an empty map for no heads.
Map<String, Object?>? speech(SentenceSpeech? person) => person == null
    ? null
    : <String, Object?>{
        'subject': person.subject,
        'head': person.head ?? '',
        'heads': person.heads ?? const <String, String>{},
      };

/// A predicate's past forms, or null where the language's predicate does not change.
Map<String, Object?>? tense(PredicateTense? source) => source == null
    ? null
    : <String, Object?>{
        'words': listed(source.words),
        'forms': <String, Object?>{
          for (final f in source.forms.entries) f.key.name: listed(f.value),
        },
      };

/// A group of modifiers or manners, narrowed by class and optionally by theme.
List<Object?> groups(List<ModifierGroup> source) => <Object?>[
  for (final group in source)
    <String, Object?>{
      'subject': <String>[for (final noun in group.subject) noun.name],
      'themes': group.themes == null
          ? null
          : <String>[for (final theme in group.themes!) theme.name],
      'fields': group.fields == null
          ? null
          : <String>[for (final field in group.fields!) field.name],
      'words': listed(group.words),
    },
];

/// Agreement rules per gender, as lists of `[ending, replacement]` pairs.
Map<String, Object?>? rules(Map<WordGender, List<List<String>>>? source) =>
    source == null
    ? null
    : <String, Object?>{
        for (final g in source.entries)
          g.key.name: <Object?>[
            for (final rule in g.value) <String>[...rule],
          ],
      };

/// A story step, in the shape every package writes.
Map<String, Object?> step(StoryStep source) => <String, Object?>{
  'kind': source.kind.name,
  'fields': <String>[for (final field in source.fields) field.name],
  'condition': source.condition?.name ?? '',
  'object': source.object?.name ?? '',
  'place': source.place,
  'destination': source.destination?.name ?? '',
  'needs': <String>[for (final c in source.needs) c.name],
  'required': source.required,
  'link': source.link?.name ?? '',
  'kinds': <String>[for (final kind in source.kinds) kind.name],
  'actor': source.actor?.name ?? '',
  'actorClasses': <String>[for (final noun in source.actorClasses ?? const <NounClass>[]) noun.name],
  'actorThemes': source.actorThemes == null
      ? null
      : <String>[for (final theme in source.actorThemes!) theme.name],
};

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
                for (final g in entry.value.nounGender!.entries)
                  g.key: g.value.name,
              },
        'genderRules': entry.value.genderRules == null
            ? null
            : <Object?>[
                for (final rule in entry.value.genderRules!)
                  <String>[rule.$1, rule.$2.name],
              ],
        'agreement': entry.value.agreement == null
            ? null
            : <String, Object?>{
                for (final g in entry.value.agreement!.entries)
                  g.key.name: <Object?>[
                    for (final rule in g.value) <String>[...rule],
                  ],
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
        'levels': <String, Object?>{
          'basic': listed(entry.value.levels.basic),
          'rare': listed(entry.value.levels.rare),
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
          for (final q in entry.value.quotes.entries)
            q.key.name: <String>[...q.value],
        },
        // Optional in one package and defaulted in another; written the same way
        // here either way, so the shapes compare.
        'predicateAgrees': entry.value.predicateAgrees,
        'pastAgreement': rules(entry.value.pastAgreement),
        'pastMark': entry.value.pastMark == null
            ? null
            : <String, Object?>{
                'head': entry.value.pastMark!.head ?? '',
                'tail': entry.value.pastMark!.tail ?? '',
              },
        'join': entry.value.join == null
            ? null
            : <String, Object?>{
                'form': entry.value.join!.form?.name ?? '',
                'word': entry.value.join!.word ?? '',
              },
        'articles': rules(entry.value.articles),
        'verbs': <Object?>[
          for (final group in entry.value.verbs)
            <String, Object?>{
              'subject': <String>[for (final noun in group.subject) noun.name],
              'object': group.object == null
                  ? null
                  : <String>[for (final noun in group.object!) noun.name],
              'field': group.field.name,
              'subjectThemes': group.subjectThemes == null
                  ? null
                  : <String>[
                      for (final theme in group.subjectThemes!) theme.name,
                    ],
              'subjectTraits': group.subjectTraits == null
                  ? null
                  : <String>[
                      for (final trait in group.subjectTraits!) trait.name,
                    ],
              'subjectWithout': group.subjectWithout == null
                  ? null
                  : <String>[
                      for (final trait in group.subjectWithout!) trait.name,
                    ],
              'objectThemes': group.objectThemes == null
                  ? null
                  : <String>[
                      for (final theme in group.objectThemes!) theme.name,
                    ],
              'objectTraits': group.objectTraits == null
                  ? null
                  : <String>[
                      for (final trait in group.objectTraits!) trait.name,
                    ],
              'objectWithout': group.objectWithout == null
                  ? null
                  : <String>[
                      for (final trait in group.objectWithout!) trait.name,
                    ],
              'requires': group.requires?.name ?? '',
              'condition': group.condition?.name ?? '',
              'words': listed(group.words),
              'forms': <String, Object?>{
                for (final f in group.forms.entries)
                  f.key.name: listed(f.value),
              },
              'past': tense(group.past),
            },
        ],
        'states': <Object?>[
          for (final group in entry.value.states)
            <String, Object?>{
              'subject': <String>[for (final noun in group.subject) noun.name],
              'subjectThemes': group.subjectThemes == null
                  ? null
                  : <String>[
                      for (final theme in group.subjectThemes!) theme.name,
                    ],
              'condition': group.condition?.name ?? '',
              'head': group.head ?? '',
              'pastHead': group.pastHead ?? '',
              'words': listed(group.words),
              'forms': <String, Object?>{
                for (final f in group.forms.entries)
                  f.key.name: listed(f.value),
              },
              'past': tense(group.past),
            },
        ],
        'modifiers': groups(entry.value.modifiers),
        'manners': groups(entry.value.manners),
        'times': <String, Object?>{
          'day': listed(entry.value.times.day),
          'any': listed(entry.value.times.any),
          'past': listed(entry.value.times.past),
          'present': listed(entry.value.times.present),
          'habitual': listed(entry.value.times.habitual),
        },
        'homes': listed(entry.value.homes),
        'replies': entry.value.replies == null
            ? null
            : <String, Object?>{
                for (final level in entry.value.replies!.entries)
                  level.key.name: <String, Object?>{
                    for (final cue in level.value.entries) cue.key.name: listed(cue.value),
                  },
              },
        'degrees': listed(entry.value.degrees),
        'connectives': <String, Object?>{
          for (final k in entry.value.connectives.entries)
            k.key.name: listed(k.value),
        },
        'traits': entry.value.traits == null
            ? null
            : <String, Object?>{
                for (final t in entry.value.traits!.entries)
                  t.key.name: listed(t.value),
              },
        'interjections': listed(entry.value.interjections),
        'pronouns': <String, Object?>{
          for (final g in entry.value.pronouns.entries)
            g.key.name: listed(g.value),
        },
        // Optional in one package and defaulted in another; written as a list
        // either way so the shapes compare.
        'pronounless': <String>[
          for (final noun in entry.value.pronounless) noun.name,
        ],
        'objectPronouns': entry.value.objectPronouns == null
            ? null
            : <String, Object?>{
                'words': <String, Object?>{
                  for (final g in entry.value.objectPronouns!.words.entries)
                    g.key.name: listed(g.value),
                },
                'clitic': entry.value.objectPronouns!.clitic,
              },
        'speech': speech(entry.value.speech),
        'listener': speech(entry.value.listener),
        'homecomings': entry.value.homecomings == null
            ? null
            : <String, Object?>{
                for (final level in entry.value.homecomings!.entries)
                  level.key.name: listed(level.value),
              },
        'placeHeads': entry.value.placeHeads == null
            ? null
            : <String, Object?>{
                for (final h in entry.value.placeHeads!.entries) h.key: listed(h.value),
              },
        'numeral': entry.value.numeral == null
            ? null
            : <String, Object?>{
                'order': entry.value.numeral!.order.name,
                'counters': <String, Object?>{
                  for (final c in entry.value.numeral!.counters.entries)
                    c.key.name: c.value,
                },
                'count': <int>[
                  entry.value.numeral!.count.min,
                  entry.value.numeral!.count.max,
                ],
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
                    for (final noun in entry.value.calendar!.copula.subject)
                      noun.name,
                  ],
                  'words': listed(entry.value.calendar!.copula.words),
                  'forms': <String, Object?>{
                    for (final f in entry.value.calendar!.copula.forms.entries)
                      f.key.name: listed(f.value),
                  },
                  'past': tense(entry.value.calendar!.copula.past),
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
                    'pastHead': part.pastHead ?? '',
                    'tail': part.tail ?? '',
                    'tailAlt': part.tailAlt ?? '',
                    'tailLiquid': part.tailLiquid ?? '',
                    'modifiable': part.modifiable,
                    'bare': part.bare,
                    'copula': part.copula?.name ?? '',
                  },
              ],
              'weight': frame.weight,
              'mood': frame.mood.name,
              'tag': frame.tag ?? '',
              'fields': frame.fields == null
                  ? null
                  : <String>[for (final field in frame.fields!) field.name],
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
        'randLocationLengthMax': randLocationLengthMax,
        'affixLengthDefault': affixLengthDefault,
        'affixLengthMax': affixLengthMax,
        'affixSeparatorDefault': affixSeparatorDefault,
        'affixCharset': affixCharset,
      },
      // The outline is compared as each package parses it rather than as the text
      // it is written in, so a parser that reads `_` or a skipped level differently
      // shows up here even though the three strings are the same generated text.
      'location': <String, Object?>{
        'languages': <String>[
          for (final language in locationLanguages) language.name,
        ],
        'levels': <String>[for (final level in locationLevels) level.name],
        'data': <String, Object?>{
          for (final entry in locationData.entries)
            entry.key.name: <String, Object?>{
              'country': entry.value.country,
              'order': entry.value.order == LocationOrder.largestFirst
                  ? 'largest-first'
                  : 'smallest-first',
              'joiner': entry.value.joiner,
              'levels': <String>[
                for (final level in entry.value.levels) level.name,
              ],
              'entries': <Object?>[
                for (final each in outline(
                  entry.value.outline,
                  entry.value.levels.length,
                ))
                  <String, Object?>{
                    'path': <String?>[...each.path],
                    'depth': each.depth,
                    'below': each.below,
                  },
              ],
            },
        },
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
          for (final entry in themeClass.entries)
            entry.key.name: entry.value.name,
        },
        'agentClasses': <String>[for (final noun in agentClasses) noun.name],
        'fieldRules': <String, Object?>{
          for (final entry in fieldRules.entries)
            entry.key.name: <String, Object?>{
              'needs': <String>[for (final c in entry.value.needs) c.name],
              'gives': <String>[for (final c in entry.value.gives) c.name],
              'takes': <String>[for (final c in entry.value.takes) c.name],
              'after': <String>[for (final c in entry.value.after) c.name],
            },
        },
        'opposites': <String, Object?>{
          for (final entry in opposites.entries)
            entry.key.name: entry.value.name,
        },
        'stories': <Object?>[
          for (final story in stories)
            <String, Object?>{
              'name': story.name.name,
              'hero': <String>[for (final noun in story.hero) noun.name],
              'item': story.item == null
                  ? null
                  : <String>[for (final noun in story.item!) noun.name],
              'itemThemes': story.itemThemes == null
                  ? null
                  : <String>[for (final theme in story.itemThemes!) theme.name],
              'prop': story.prop == null
                  ? null
                  : <String>[for (final noun in story.prop!) noun.name],
              'propThemes': story.propThemes == null
                  ? null
                  : <String>[for (final theme in story.propThemes!) theme.name],
              'heroThemes': story.heroThemes == null
                  ? null
                  : <String>[for (final theme in story.heroThemes!) theme.name],
              'lines': story.lines ?? 0,
              'start': <String>[for (final c in story.start) c.name],
              'steps': <Object?>[for (final each in story.steps) step(each)],
              'weight': story.weight,
            },
        ],
        'interludes': <Object?>[for (final each in interludes) step(each)],
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
