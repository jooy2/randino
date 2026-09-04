import 'package:randino/randino.dart';
// The datasets are internal, but a sentence is only as good as the grammar
// behind it — these checks read the pools a sentence is allowed to draw from.
import 'package:randino/src/sentence/data/index.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/sentence/sentence_generator.dart';
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/data/types.dart';
import 'package:randino/src/word/word_generator.dart';
import 'package:test/test.dart';

const int sample = 60;

/// Everything a sentence of the language may be written with, punctuation aside.
final Map<WordLanguage, RegExp> script = <WordLanguage, RegExp>{
  WordLanguage.en: RegExp(r"^[A-Za-z' ,.]+$"),
  WordLanguage.ko: RegExp(r'^[가-힣 .]+$'),
  WordLanguage.ja: RegExp(r'^[々぀-ヿ一-鿿。]+$'),
  WordLanguage.zh: RegExp(r'^[々一-鿿。]+$'),
  WordLanguage.vi: RegExp(r'^[a-zA-ZÀ-ỹ ,.]+$'),
  WordLanguage.es: RegExp(r'^[a-zA-ZÀ-ÿ ,.]+$'),
  WordLanguage.it: RegExp(r"^[a-zA-ZÀ-ÿ' ,.]+$"),
  WordLanguage.de: RegExp(r'^[a-zA-ZÀ-ÿß ,.]+$'),
  WordLanguage.ru: RegExp(r'^[Ѐ-ӿ ,.]+$'),
};

/// A word as a sentence writes it — English stores its pools capitalized.
String plain(WordLanguage language, String word) =>
    wordData[language]!.capitalize ? word.substring(0, 1).toLowerCase() + word.substring(1) : word;

List<String> inflected(WordLanguage language, List<String> pool) {
  final data = wordData[language]!;
  final genders = data.agreement?.keys.toList() ?? const <WordGender>[];

  return <String>[
    ...pool,
    for (final gender in genders) ...pool.map((word) => agree(data, word, gender)),
  ];
}

/// Every word the language may put in a phrase of [slot].
Set<String> poolFor(WordLanguage language, SentenceSlot slot) {
  final data = sentenceData[language]!;

  switch (slot) {
    case SentenceSlot.verb:
      return <String>{for (final group in data.verbs) ...group.words};
    case SentenceSlot.state:
      final states = <String>[for (final group in data.states) ...group.words];

      return (data.predicateAgrees ? inflected(language, states) : states).toSet();
    case SentenceSlot.manner:
      return data.manners.toSet();
    case SentenceSlot.time:
      return data.times.toSet();
    default:
      return <String>{
        for (final theme in wordThemes)
          ...wordData[language]!.nouns[theme]!.map((word) => plain(language, word)),
      };
  }
}

/// The modifiers a noun phrase may carry, in every form they can take.
Set<String> modifiersFor(WordLanguage language) =>
    inflected(
      language,
      wordData[language]!.adjectives,
    ).map((word) => plain(language, word)).toSet();

List<String> articlesFor(WordLanguage language) {
  final articles = sentenceData[language]!.articles;

  if (articles == null) return const <String>[];

  return <String>[
    for (final rules in articles.values)
      for (final rule in rules) rule[1],
  ];
}

/// Whether a noun phrase is exactly what the generator is allowed to build: an
/// article, a noun, and at most one modifier on the side the language puts it.
///
/// Split by hand rather than on whitespace, because a pool entry can hold a
/// space of its own — Vietnamese `hơi thở` is one word — and Japanese and
/// Chinese write no space at all.
bool explains(WordLanguage language, String phrase) {
  final space = sentenceData[language]!.space;
  final nouns = poolFor(language, SentenceSlot.subject);
  final modifiers = modifiersFor(language);
  var rest = phrase;

  for (final article in articlesFor(language)) {
    final opening = article.endsWith("'") ? article : article + space;

    if (rest.startsWith(opening)) {
      rest = rest.substring(opening.length);
      break;
    }
  }

  if (nouns.contains(rest)) return true;

  for (var at = 1; at < rest.length; at += 1) {
    if (space.isNotEmpty &&
        (at + space.length > rest.length || rest.substring(at, at + space.length) != space)) {
      continue;
    }

    final left = rest.substring(0, at);
    final right = rest.substring(at + space.length);

    if ((modifiers.contains(left) && nouns.contains(right)) ||
        (nouns.contains(left) && modifiers.contains(right))) {
      return true;
    }
  }

  return false;
}

void main() {
  group('Sentence', () {
    test('randSentence returns one sentence by default', () {
      final sentences = randSentence();

      expect(sentences, hasLength(1));
      expect(sentences.first, isNotEmpty);
    });

    test('randSentence returns exactly `count` sentences', () {
      expect(randSentence(count: 25), hasLength(25));
      expect(randSentence(count: 0), isEmpty);
      expect(randSentence(count: -10), isEmpty);
      expect(randSentence(count: randCountMax + 500), hasLength(randCountMax));
    });

    test('every language writes sentences in its own script, and closes them', () {
      for (final language in wordLanguages) {
        final terminator = sentenceData[language]!.terminator;

        for (final realism in RandRealism.values) {
          for (final sentence in randSentence(
            language: language,
            realism: realism,
            count: sample,
          )) {
            expect(sentence, matches(script[language]!), reason: '$language: $sentence');
            expect(sentence, endsWith(terminator), reason: '$language: $sentence');
            expect(sentence.contains('  '), isFalse, reason: '$language: $sentence');
            expect(sentence.contains(' .'), isFalse, reason: '$language: $sentence');
          }
        }
      }
    });

    test('a language that capitalizes opens its sentences on a capital', () {
      for (final language in wordLanguages) {
        if (!sentenceData[language]!.capitalize) continue;

        for (final sentence in randSentence(language: language, count: sample)) {
          expect(sentence.substring(0, 1), sentence.substring(0, 1).toUpperCase());
        }
      }
    });

    test('the mixed language uses every language it knows', () {
      final used = <WordLanguage>{};

      for (final detail in randSentenceDetails(count: 600)) {
        expect(detail.sentence, matches(script[detail.language]!));
        used.add(detail.language);
      }

      expect(used, hasLength(wordLanguages.length));
    });

    test('every phrase is written out of the language`s own pools', () {
      for (final language in wordLanguages) {
        final fixed = <SentenceSlot, Set<String>>{
          for (final slot in <SentenceSlot>[
            SentenceSlot.verb,
            SentenceSlot.state,
            SentenceSlot.manner,
            SentenceSlot.time,
          ])
            slot: poolFor(language, slot),
        };

        for (final detail in randSentenceDetails(language: language, count: 200)) {
          expect(detail.phrases, hasLength(detail.slots.length));

          for (var i = 0; i < detail.phrases.length; i += 1) {
            final phrase = detail.phrases[i];
            final slot = detail.slots[i];
            // Only the opening phrase can have been capitalized, and it is put
            // back the way the pools hold it before being looked up.
            final written =
                i == 0 ? phrase.substring(0, 1).toLowerCase() + phrase.substring(1) : phrase;
            final pool = fixed[slot];

            if (pool != null) {
              expect(
                pool.contains(written) || pool.contains(phrase),
                isTrue,
                reason: '$language: $phrase is not in the ${slot.name} pools (${detail.sentence})',
              );

              continue;
            }

            expect(
              explains(language, written),
              isTrue,
              reason:
                  '$language: $phrase is not a ${slot.name} the pools can build '
                  '(${detail.sentence})',
            );
          }
        }
      }
    });

    test('the phrases appear in the sentence, in order', () {
      for (final language in wordLanguages) {
        for (final detail in randSentenceDetails(language: language, count: 120)) {
          var at = 0;

          for (final phrase in detail.phrases) {
            final found = detail.sentence.indexOf(phrase, at);

            expect(found >= at, isTrue, reason: '$language: $phrase in ${detail.sentence}');
            at = found + phrase.length;
          }
        }
      }
    });

    test('a sentence has one predicate, and it is a verb or a state', () {
      for (final language in wordLanguages) {
        for (final detail in randSentenceDetails(language: language, count: 120)) {
          final predicates = detail.slots.where(
            (slot) => slot == SentenceSlot.verb || slot == SentenceSlot.state,
          );

          expect(predicates, hasLength(1), reason: detail.sentence);
          expect(detail.slots, contains(SentenceSlot.subject), reason: detail.sentence);
        }
      }
    });

    test('a verb only takes the subject and object its group allows', () {
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;

        for (final detail in randSentenceDetails(language: language, count: 200)) {
          final at = detail.slots.indexOf(SentenceSlot.verb);
          final theme = detail.theme;

          if (at < 0 || theme == null) continue;

          final transitive = detail.slots.contains(SentenceSlot.object);
          // A verb can sit in more than one group, so the sentence is right when
          // one of its groups accounts for it.
          final groups = data.verbs.where(
            (group) =>
                group.words.contains(detail.phrases[at]) && (group.object != null) == transitive,
          );

          expect(groups, isNotEmpty, reason: '$language: ${detail.sentence}');
          expect(
            groups.any((group) => group.subject.contains(themeClass[theme])),
            isTrue,
            reason: '$language: ${theme.name} cannot be the subject (${detail.sentence})',
          );
        }
      }
    });

    test('Korean picks the particle its noun asks for', () {
      const alternating = <String, String>{'가': '이', '를': '을', '는': '은'};

      for (final detail in randSentenceDetails(language: WordLanguage.ko, count: 300)) {
        for (final phrase in detail.phrases) {
          final ends = detail.sentence.indexOf(phrase) + phrase.length;

          if (ends >= detail.sentence.length) continue;

          final after = detail.sentence.substring(ends, ends + 1);
          final last = phrase.codeUnitAt(phrase.length - 1);
          final coda = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 != 0;

          if (alternating.containsKey(after)) {
            expect(coda, isFalse, reason: '$phrase$after needs ${alternating[after]}');
          }

          if (alternating.containsValue(after) && after != '은') {
            expect(coda, isTrue, reason: '$phrase$after needs the other form');
          }
        }
      }
    });

    test('`theme` decides what the subject is about', () {
      for (final theme in wordThemes) {
        for (final detail in randSentenceDetails(
          language: WordLanguage.ko,
          theme: theme,
          count: 20,
        )) {
          expect(detail.theme, theme, reason: detail.sentence);
        }
      }
    });

    test('`shape` decides how much the sentence says', () {
      for (final language in wordLanguages) {
        for (final shape in SentenceShape.values) {
          expect(
            sentenceData[language]!.frames.any((frame) => shapeOf(frame) == shape),
            isTrue,
            reason: '$language has no ${shape.name} shape',
          );

          for (final detail in randSentenceDetails(language: language, shape: shape, count: 30)) {
            final parts = detail.phrases.length;
            final actual =
                parts <= 2
                    ? SentenceShape.simple
                    : parts == 3
                    ? SentenceShape.detailed
                    : SentenceShape.complex;

            expect(actual, shape, reason: '$language: ${detail.sentence}');
          }
        }
      }
    });

    test('`slots` decides what the sentence carries beside its subject', () {
      for (final slot in <SentenceSlot>[
        SentenceSlot.object,
        SentenceSlot.place,
        SentenceSlot.time,
        SentenceSlot.manner,
        SentenceSlot.state,
      ]) {
        for (final language in wordLanguages) {
          final able = sentenceData[language]!.frames.any(
            (frame) => frame.parts.any((part) => part.slot == slot),
          );

          if (!able) continue;

          for (final detail in randSentenceDetails(
            language: language,
            slots: <SentenceSlot>{slot},
            count: 30,
          )) {
            expect(detail.slots, contains(slot), reason: '$language: ${detail.sentence}');
          }
        }
      }

      for (final detail in randSentenceDetails(slots: const <SentenceSlot>{}, count: 120)) {
        expect(detail.phrases.length <= 2, isTrue, reason: detail.sentence);
      }
    });

    test('`include` puts every word it was given into every sentence', () {
      const cases = <(WordLanguage, List<String>)>[
        (WordLanguage.ko, <String>['사자']),
        (WordLanguage.ko, <String>['사자', '조용히']),
        (WordLanguage.ko, <String>['멋진', '사자', '조용히']),
        (WordLanguage.en, <String>['lion']),
        (WordLanguage.en, <String>['brave', 'lion', 'quietly']),
        (WordLanguage.ja, <String>['猫']),
        (WordLanguage.zh, <String>['狮子']),
        (WordLanguage.es, <String>['gato']),
        (WordLanguage.de, <String>['Wolf']),
        (WordLanguage.ru, <String>['кит']),
        (WordLanguage.it, <String>['gatto']),
        (WordLanguage.vi, <String>['mèo']),
      ];

      for (final (language, include) in cases) {
        for (final sentence in randSentence(language: language, include: include, count: 40)) {
          for (final word in include) {
            expect(
              sentence.toLowerCase().contains(word.toLowerCase()),
              isTrue,
              reason: '$language: $word missing from $sentence',
            );
          }
        }
      }
    });

    test('`include` takes a word the pools have never heard of', () {
      for (final sentence in randSentence(
        language: WordLanguage.ko,
        include: const <String>['깜냥이'],
        count: 30,
      )) {
        expect(sentence, contains('깜냥이'));
      }
    });

    test('`include` picks the language the word is written in', () {
      for (final detail in randSentenceDetails(include: const <String>['고양이'], count: 40)) {
        expect(detail.language, WordLanguage.ko, reason: detail.sentence);
        expect(detail.sentence, contains('고양이'));
      }
    });

    test('a narrow range is met too, anywhere in the language`s own range', () {
      // The wide ranges below are met by most shapes the language has. A narrow
      // one is what caught the budget measuring a phrase against every pool of
      // the language rather than the one it draws from.
      //
      // Swept across what the language is observed to produce rather than across
      // `sentenceLengthRange`, whose ends are the shortest and longest sentence
      // the shapes could spell — the very top of it needs the longest word of
      // every pool at once, which is a fit no draw is going to find.
      for (final language in WordLanguage.values) {
        final seen = randSentence(
          language: language,
          count: 400,
        ).map((sentence) => sentence.length).toList(growable: false)..sort();
        final lowest = seen[(seen.length * 0.05).floor()];
        final highest = seen[(seen.length * 0.95).floor()];
        final step = (highest - lowest) ~/ 8 < 2 ? 2 : (highest - lowest) ~/ 8;

        for (var minLength = lowest; minLength + 5 <= highest; minLength += step) {
          final maxLength = highest < minLength + 5 ? highest : minLength + 5;

          for (final sentence in randSentence(
            language: language,
            minLength: minLength,
            maxLength: maxLength,
            count: 30,
          )) {
            expect(
              sentence.length >= minLength && sentence.length <= maxLength,
              isTrue,
              reason: '$language $minLength-$maxLength: $sentence (${sentence.length})',
            );
          }
        }
      }
    });

    test('sentences respect the length range', () {
      const ranges = <(WordLanguage, int, int)>[
        (WordLanguage.ko, 8, 16),
        (WordLanguage.ko, 20, 34),
        (WordLanguage.en, 14, 30),
        (WordLanguage.en, 40, 70),
        (WordLanguage.ja, 6, 14),
        (WordLanguage.zh, 5, 12),
        (WordLanguage.vi, 12, 28),
        (WordLanguage.es, 14, 34),
        (WordLanguage.it, 14, 34),
        (WordLanguage.de, 14, 34),
        (WordLanguage.ru, 10, 26),
      ];

      for (final (language, minLength, maxLength) in ranges) {
        for (final sentence in randSentence(
          language: language,
          minLength: minLength,
          maxLength: maxLength,
          count: sample,
        )) {
          expect(
            sentence.length >= minLength && sentence.length <= maxLength,
            isTrue,
            reason: '$language $minLength-$maxLength: $sentence (${sentence.length})',
          );
        }
      }
    });

    test('sentences start with `startsWith`', () {
      const cases = <(WordLanguage, String)>[
        (WordLanguage.ko, '사'),
        (WordLanguage.ja, '空'),
        (WordLanguage.zh, '雨'),
      ];

      for (final (language, prefix) in cases) {
        final sentences = randSentence(language: language, startsWith: prefix, count: 20);

        expect(sentences, isNotEmpty, reason: '$language $prefix');

        for (final sentence in sentences) {
          expect(sentence, startsWith(prefix));
        }
      }
    });

    test('`unique` never repeats a sentence', () {
      final sentences = randSentence(language: WordLanguage.ko, unique: true, count: 300);

      expect(sentences.toSet(), hasLength(sentences.length));
    });

    test('the detail form reports what the sentence was built from', () {
      for (final detail in randSentenceDetails(language: WordLanguage.en, count: sample)) {
        expect(detail.sentence, isNotEmpty);
        expect(detail.language, WordLanguage.en);
        expect(detail.phrases.length >= 2, isTrue);
        expect(detail.phrases, hasLength(detail.slots.length));
        // The frames are the language's own, so what the detail hands out is a
        // copy that cannot reach into them.
        expect(() => detail.slots.add(SentenceSlot.verb), throwsUnsupportedError);
      }
    });

    test('sentenceLengthRange reports what the language can produce', () {
      for (final language in wordLanguages) {
        final range = sentenceLengthRange(language);

        expect(range.min >= 1 && range.min < range.max, isTrue, reason: '$language: $range');

        for (final sentence in randSentence(language: language, count: sample)) {
          expect(
            sentence.length >= range.min && sentence.length <= range.max,
            isTrue,
            reason: '$language: $sentence (${sentence.length}) outside $range',
          );
        }
      }
    });

    test('every noun class the frames can ask for has a predicate to go with it', () {
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;
        final subjects = <NounClass>{for (final group in data.verbs) ...group.subject};
        final described = <NounClass>{for (final group in data.states) ...group.subject};

        for (final theme in wordThemes) {
          final noun = themeClass[theme];

          expect(subjects, contains(noun), reason: '$language: no verb takes a $noun subject');
          expect(described, contains(noun), reason: '$language: no state describes a $noun');
        }
      }
    });
  });
}
