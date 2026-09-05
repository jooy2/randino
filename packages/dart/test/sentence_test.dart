import 'package:randino/randino.dart';
// The datasets are internal, but a sentence is only as good as the grammar
// behind it — these checks read the pools a sentence is allowed to draw from.
import 'package:randino/src/name/data/index.dart';
import 'package:randino/src/name/data/types.dart';
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
  WordLanguage.en: RegExp(r"^[A-Za-z' ,.?!…“”‘’]+$"),
  WordLanguage.ko: RegExp(r'^[가-힣 ,.?!…“”‘’]+$'),
  WordLanguage.ja: RegExp(r'^[々぀-ヿ一-鿿。、？！…「」『』]+$'),
  WordLanguage.zh: RegExp(r'^[々一-鿿。，？！…“”‘’]+$'),
  WordLanguage.vi: RegExp(r'^[a-zA-ZÀ-ỹ ,.?!…“”‘’]+$'),
  WordLanguage.es: RegExp(r'^[a-zA-ZÀ-ÿ ,.?!…¿¡«»“”]+$'),
  WordLanguage.it: RegExp(r"^[a-zA-ZÀ-ÿ' ,.?!…«»“”]+$"),
  WordLanguage.de: RegExp(r'^[a-zA-ZÀ-ÿß ,.?!…„“‚‘]+$'),
  WordLanguage.ru: RegExp(r'^[Ѐ-ӿ ,.?!…«»„“]+$'),
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

/// How a capitalizing language writes the first word of a sentence.
String upperFirst(String word) =>
    word.isEmpty ? word : word.substring(0, 1).toUpperCase() + word.substring(1);

/// Every subject pronoun the language can write, in both cases.
Set<String> pronounsOf(WordLanguage language) {
  final written = <String>[
    for (final pool in sentenceData[language]!.pronouns.values) ...pool,
  ].where((word) => word.isNotEmpty);

  return <String>{...written, ...written.map(upperFirst)};
}

/// Every noun a phrase could have been built around, as far as the pools can
/// tell — the same decomposition [explains] makes, kept instead of thrown away.
///
/// Every one of them rather than the first, because a word can be both a noun
/// and a modifier and two of them beside each other parse both ways: Vietnamese
/// `Sâu ấm` is a warm worm and a deep teapot, and only the generator knows which
/// it meant. Empty for a phrase built on a word no pool holds, which is what an
/// invented subject is.
Set<String> nounsIn(WordLanguage language, String phrase) {
  final space = sentenceData[language]!.space;
  final nouns = poolFor(language, SentenceSlot.subject);
  final modifiers = modifiersFor(language);
  final found = <String>{};
  var rest = phrase;

  for (final article in articlesFor(language)) {
    final opening = article.endsWith("'") ? article : article + space;

    if (rest.startsWith(opening)) {
      rest = rest.substring(opening.length);
      break;
    }
  }

  if (nouns.contains(rest)) found.add(rest);

  for (var at = 1; at < rest.length; at += 1) {
    if (space.isNotEmpty &&
        (at + space.length > rest.length || rest.substring(at, at + space.length) != space)) {
      continue;
    }

    final left = rest.substring(0, at);
    final right = rest.substring(at + space.length);

    if (modifiers.contains(left) && nouns.contains(right)) found.add(right);
    if (nouns.contains(left) && modifiers.contains(right)) found.add(left);
  }

  return found;
}

/// The theme whose pool holds a noun, in the form a sentence writes it.
WordTheme? themeOfNoun(WordLanguage language, String noun) {
  for (final theme in wordThemes) {
    if (wordData[language]!.nouns[theme]!.any((word) => plain(language, word) == noun)) {
      return theme;
    }
  }

  return null;
}

/// The given names the language can write, by gender — the pools `randSentence`
/// reaches through `includeName`.
///
/// CJK languages keep whole given names under `givenMale` / `givenFemale`; the
/// others draw from `male` / `female`.
Set<String> givenNames(WordLanguage language, NameGender gender) {
  final data = nameData[NameLanguage.values.byName(language.name)]!;
  final pool =
      gender == NameGender.male ? (data.givenMale ?? data.male) : (data.givenFemale ?? data.female);

  return <String>{for (final entry in pool ?? const <NameEntry>[]) entry.n};
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
        final terminator = sentenceData[language]!.terminators[SentenceType.statement]!;

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

    test('a language with articles writes one, invented word or not', () {
      // An invented noun is in no pool, so it has no entry in `nounGender` — and
      // Spanish and Italian declare their articles under `m` and `f` alone, with
      // no `n` to fall back to. Both wrote no article at all in front of one
      // until the gender was read off the ending instead.
      for (final language in WordLanguage.values) {
        final articles = sentenceData[language]!.articles;

        if (articles == null) continue;

        final written = <String>{
          for (final rules in articles.values)
            for (final rule in rules) rule[1],
        };

        for (final realism in <RandRealism>[RandRealism.real, RandRealism.invented]) {
          for (final sentence in randSentence(
            language: language,
            realism: realism,
            count: sample,
          )) {
            final carries = written.any(
              // An elided article runs into the word behind it — `l'orso`.
              (article) =>
                  article.endsWith("'")
                      ? sentence.toLowerCase().contains(article)
                      : RegExp('(^|\\s)$article\\s', caseSensitive: false).hasMatch(sentence),
            );

            expect(carries, isTrue, reason: '$language $realism: $sentence');
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
      //
      // A miss is still possible and the assertion says so: German's shortest
      // shape tops out around seventeen characters and the same shape with a
      // modifier starts above twenty-two, so a window in between is one the
      // language has almost nothing to put in. What has to hold is that a miss is
      // rare and small. The bug this replaced missed by six characters one time
      // in forty.
      final misses = <String>[];
      var drawn = 0;

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
            drawn += 1;

            final over = sentence.length - maxLength;
            final distance = over > 0 ? over : minLength - sentence.length;

            if (distance <= 0) continue;

            final miss = '$language $minLength-$maxLength: $sentence (${sentence.length})';

            misses.add(miss);

            expect(distance <= 2, isTrue, reason: 'off by $distance: $miss');
          }
        }
      }

      expect(
        misses.length * 200 <= drawn,
        isTrue,
        reason: '${misses.length} of $drawn outside the range: ${misses.take(5).join(' | ')}',
      );
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

    test('`sentences` puts more than one sentence in one result', () {
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;

        for (final detail in randSentenceDetails(language: language, sentences: 3, count: 40)) {
          expect(detail.sentences, hasLength(3), reason: detail.sentence);
          expect(detail.sentences.join(data.space), detail.sentence);

          for (final sentence in detail.sentences) {
            expect(
              sentence,
              endsWith(data.terminators[SentenceType.statement]!),
              reason: '$language: $sentence',
            );
            expect(sentence, matches(script[language]!), reason: '$language: $sentence');
            // Every sentence closes exactly once, so two of them were never run
            // together into one entry.
            expect(
              sentence.split(data.terminators[SentenceType.statement]!).length - 1,
              1,
              reason: '$language: $sentence',
            );
            expect(sentence.contains('  '), isFalse, reason: '$language: $sentence');
          }
        }
      }

      for (final detail in randSentenceDetails(count: 20)) {
        expect(detail.sentences, hasLength(1));
        expect(detail.sentences.first, detail.sentence);
      }
    });

    test('`sentences` is clamped, and `count` still says how many strings there are', () {
      for (final each in const <List<int>>[
        <int>[0, 1],
        <int>[-3, 1],
        <int>[randSentenceCountMax + 5, randSentenceCountMax],
      ]) {
        for (final detail in randSentenceDetails(
          language: WordLanguage.ko,
          sentences: each[0],
          count: 10,
        )) {
          expect(detail.sentences, hasLength(each[1]), reason: detail.sentence);
        }
      }

      expect(randSentence(sentences: 4, count: 7), hasLength(7));
    });

    test('the length range describes the whole result, not one sentence of it', () {
      const ranges = <List<Object>>[
        <Object>[WordLanguage.ko, 2, 24, 40],
        <Object>[WordLanguage.ko, 3, 40, 60],
        <Object>[WordLanguage.en, 2, 40, 70],
        <Object>[WordLanguage.ja, 3, 24, 42],
        <Object>[WordLanguage.zh, 2, 14, 28],
        <Object>[WordLanguage.de, 2, 34, 60],
        <Object>[WordLanguage.ru, 3, 40, 75],
      ];

      for (final each in ranges) {
        final language = each[0] as WordLanguage;
        final sentences = each[1] as int;
        final minLength = each[2] as int;
        final maxLength = each[3] as int;

        for (final sentence in randSentence(
          language: language,
          sentences: sentences,
          minLength: minLength,
          maxLength: maxLength,
          count: sample,
        )) {
          expect(
            sentence.length,
            allOf(greaterThanOrEqualTo(minLength), lessThanOrEqualTo(maxLength)),
            reason: '$language x$sentences $minLength-$maxLength: $sentence',
          );
        }
      }
    });

    test('the sentences of one result are about the same kind of thing', () {
      // A paragraph is not three draws. Every sentence after the first names that
      // first subject again, stands a pronoun where it was, or draws another noun
      // of the same class — so a paragraph that opens on a creature never wanders
      // into an idea halfway through.
      for (final language in wordLanguages) {
        final pronouns = pronounsOf(language);

        for (final detail in randSentenceDetails(language: language, sentences: 3, count: 60)) {
          final theme = detail.theme;

          if (theme == null) continue;

          final wanted = themeClass[theme];
          var subjects = 0;

          for (var i = 0; i < detail.phrases.length; i += 1) {
            if (detail.slots[i] != SentenceSlot.subject) continue;

            subjects += 1;

            final phrase = detail.phrases[i];

            if (pronouns.contains(phrase)) continue;

            // Any of the three sentences can be the one a phrase opens, so both
            // cases are tried rather than only the first phrase of the result.
            final found = <String>{
              ...nounsIn(language, phrase),
              ...nounsIn(language, phrase.substring(0, 1).toLowerCase() + phrase.substring(1)),
            };
            final themes =
                found.map((noun) => themeOfNoun(language, noun)).whereType<WordTheme>().toList();

            expect(
              themes.isEmpty || themes.any((theme) => themeClass[theme] == wanted),
              isTrue,
              reason:
                  '$language: "$phrase" reads as $themes where the result is about a $wanted (${detail.sentence})',
            );
          }

          expect(subjects, greaterThanOrEqualTo(1), reason: detail.sentence);
        }
      }
    });

    test('a connective opens a sentence that follows another, and only one', () {
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;
        final openers = data.connectives
            .map((word) => (data.capitalize ? upperFirst(word) : word) + data.space)
            .toList(growable: false);
        var seen = 0;

        for (final detail in randSentenceDetails(language: language, sentences: 3, count: 120)) {
          expect(
            openers.any(detail.sentences.first.startsWith),
            isFalse,
            reason: '$language: the first sentence opens on a connective (${detail.sentence})',
          );

          seen +=
              detail.sentences.skip(1).where((sentence) => openers.any(sentence.startsWith)).length;
        }

        // And the language can actually write one, which is what makes the check
        // above worth anything.
        expect(seen, greaterThan(0), reason: '$language never wrote a connective');
      }
    });

    test('a language whose nouns carry a gender has a pronoun for each of them', () {
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;
        final genders = wordData[language]!.agreement?.keys.toList() ?? const <WordGender>[];

        expect(data.connectives, isNotEmpty, reason: '$language has no connectives');
        expect(
          data.pronouns[WordGender.n] != null || genders.isNotEmpty,
          isTrue,
          reason: '$language has no pronoun to fall back to',
        );

        for (final gender in genders) {
          expect(
            data.pronouns[gender] ?? data.pronouns[WordGender.n],
            isNotNull,
            reason: '$language: nothing stands in for a $gender subject',
          );
        }
      }
    });

    test('`includeName` writes a person\'s name where a sentence has room for one', () {
      for (final language in wordLanguages) {
        final space = sentenceData[language]!.space;

        for (final detail in randSentenceDetails(
          language: language,
          includeName: true,
          count: sample,
        )) {
          expect(detail.names, isNotEmpty, reason: '$language: no name in ${detail.sentence}');

          for (final name in detail.names) {
            expect(detail.phrases, contains(name), reason: '$language: $name is not a phrase');
            expect(detail.sentence, contains(name));
          }

          // A name is a bare proper noun, so nothing opens the phrase it stands in.
          final at = detail.slots.indexOf(SentenceSlot.subject);

          if (at >= 0 && detail.names.contains(detail.phrases[at])) {
            for (final article in articlesFor(language)) {
              expect(
                detail.sentence.contains('$article$space${detail.phrases[at]}'),
                isFalse,
                reason: '$language: "$article" in front of a name (${detail.sentence})',
              );
            }
          }
        }
      }

      // Off by default, and the pools are not reached at all.
      for (final detail in randSentenceDetails(count: 60)) {
        expect(detail.names, isEmpty, reason: detail.sentence);
      }
    });

    test('a name comes out of the language`s own given-name pools', () {
      for (final language in wordLanguages) {
        final known = <String>{
          ...givenNames(language, NameGender.male),
          ...givenNames(language, NameGender.female),
        };

        for (final detail in randSentenceDetails(
          language: language,
          includeName: true,
          count: sample,
        )) {
          for (final name in detail.names) {
            // English writes its pools capitalized and a sentence opens on a
            // capital, so the name is looked up the way the pool holds it.
            expect(
              known.contains(name) || known.contains(upperFirst(name)),
              isTrue,
              reason: '$language: "$name" is in no given-name pool (${detail.sentence})',
            );
          }
        }
      }
    });

    test('a theme the caller named wins over `includeName`', () {
      // A name can only stand where a person would. Asked for beside a theme that
      // names no people, the sentence is about that theme and carries no name.
      for (final detail in randSentenceDetails(
        language: WordLanguage.en,
        theme: WordTheme.animal,
        includeName: true,
        count: sample,
      )) {
        expect(detail.theme, WordTheme.animal, reason: detail.sentence);
        expect(detail.names, isEmpty, reason: detail.sentence);
      }
    });

    test('a predicate agrees with the gender of the name it describes', () {
      // The one thing a name has to carry beside its letters. Spanish, Italian and
      // Russian inflect a predicate adjective, and a name is in no pool for
      // `genderOf` to read a gender out of.
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;
        final lexicon = wordData[language]!;

        if (!data.predicateAgrees || lexicon.agreement == null) continue;

        final male = givenNames(language, NameGender.male);
        final female = givenNames(language, NameGender.female);
        final states = <String>[for (final group in data.states) ...group.words];
        final forms = <WordGender, Set<String>>{
          for (final gender in <WordGender>[WordGender.m, WordGender.f])
            gender: <String>{for (final word in states) agree(lexicon, word, gender)},
        };
        var checked = 0;

        for (final detail in randSentenceDetails(
          language: language,
          includeName: true,
          slots: <SentenceSlot>{SentenceSlot.state},
          count: 200,
        )) {
          final at = detail.slots.indexOf(SentenceSlot.state);
          final subject = detail.phrases[detail.slots.indexOf(SentenceSlot.subject)];

          if (at < 0 || !detail.names.contains(subject)) continue;

          final gender =
              male.contains(subject)
                  ? WordGender.m
                  : (female.contains(subject) ? WordGender.f : null);

          if (gender == null) continue;

          checked += 1;

          expect(
            forms[gender]!.contains(detail.phrases[at]),
            isTrue,
            reason:
                '$language: "${detail.phrases[at]}" does not agree with $subject (${detail.sentence})',
          );
        }

        expect(checked, greaterThan(0), reason: '$language: no named subject was described');
      }
    });

    test('Korean picks the particle a name asks for too', () {
      for (final detail in randSentenceDetails(
        language: WordLanguage.ko,
        includeName: true,
        count: 200,
      )) {
        final at = detail.slots.indexOf(SentenceSlot.subject);
        final name = detail.phrases[at];

        if (!detail.names.contains(name)) continue;

        final after = detail.sentence[detail.sentence.indexOf(name) + name.length];
        final last = name.codeUnitAt(name.length - 1);
        final coda = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 != 0;

        if (after == '가' || after == '는') {
          expect(coda, isFalse, reason: '$name$after (${detail.sentence})');
        }

        if (after == '이' || after == '은') {
          expect(coda, isTrue, reason: '$name$after (${detail.sentence})');
        }
      }
    });

    test('`type` decides what the sentence is doing, and what it closes on', () {
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;

        // The four a language writes a mark of its own for; a quoted line takes
        // the mark of whatever it quotes, and has its own test below.
        for (final type in <SentenceType>[
          SentenceType.statement,
          SentenceType.question,
          SentenceType.exclamation,
          SentenceType.trailing,
        ]) {
          for (final detail in randSentenceDetails(
            language: language,
            type: <SentenceType>{type},
            count: sample,
          )) {
            expect(detail.types, <SentenceType>[type], reason: detail.sentence);
            expect(
              detail.sentence,
              endsWith(data.terminators[type]!),
              reason: '$language $type: ${detail.sentence}',
            );
            expect(detail.sentence, matches(script[language]!), reason: detail.sentence);

            final opener = data.openers[type];

            if (opener != null) {
              expect(detail.sentence, startsWith(opener), reason: detail.sentence);
            }
          }
        }
      }

      // Statements by default, and the option decides per sentence when it is
      // given more than one to choose from.
      for (final detail in randSentenceDetails(count: 40)) {
        expect(detail.types, <SentenceType>[SentenceType.statement], reason: detail.sentence);
      }

      final seen = <SentenceType>{
        for (final detail in randSentenceDetails(
          language: WordLanguage.ko,
          type: SentenceType.values.toSet(),
          sentences: 3,
          count: 120,
        ))
          ...detail.types,
      };

      expect(seen, hasLength(SentenceType.values.length));
    });

    test('a quoted line is a sentence in the language`s own marks', () {
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;
        final marks = data.terminators.values.toList(growable: false);
        final pairs = <SentenceType, SentenceQuote>{
          SentenceType.dialogue: SentenceQuote.double,
          SentenceType.thought: SentenceQuote.single,
        };

        pairs.forEach((type, kind) {
          final open = data.quotes[kind]![0];
          final close = data.quotes[kind]![1];

          for (final detail in randSentenceDetails(
            language: language,
            type: <SentenceType>{type},
            count: sample,
          )) {
            expect(detail.types, <SentenceType>[type], reason: detail.sentence);
            expect(detail.sentence, startsWith(open), reason: '$language: ${detail.sentence}');
            expect(detail.sentence, endsWith(close), reason: '$language: ${detail.sentence}');
            expect(detail.sentence, matches(script[language]!), reason: detail.sentence);

            // What is quoted is a whole sentence, closed the way its own kind
            // closes — a spoken line is as often asking as telling.
            final inner = detail.sentence.substring(
              open.length,
              detail.sentence.length - close.length,
            );

            expect(
              marks.any(inner.endsWith),
              isTrue,
              reason: '$language: "$inner" closes on no mark',
            );
          }
        });
      }
    });

    test('a quoted line is as often asking as telling', () {
      // The mark under a quote is drawn per line rather than fixed, so a hundred
      // of them are not a hundred statements.
      final data = sentenceData[WordLanguage.en]!;
      final closes = <String>{};

      for (final sentence in randSentence(
        language: WordLanguage.en,
        type: <SentenceType>{SentenceType.dialogue},
        count: 200,
      )) {
        closes.add(sentence.substring(sentence.length - 2, sentence.length - 1));
      }

      expect(closes, contains(data.terminators[SentenceType.statement]));
      expect(closes, contains(data.terminators[SentenceType.question]));
      expect(closes, contains(data.terminators[SentenceType.exclamation]));
    });

    test('`quote` picks the marks, whatever the type', () {
      for (final language in wordLanguages) {
        final quotes = sentenceData[language]!.quotes;

        for (final kind in SentenceQuote.values) {
          final open = quotes[kind]![0];
          final close = quotes[kind]![1];

          for (final type in <SentenceType>[SentenceType.dialogue, SentenceType.thought]) {
            for (final sentence in randSentence(
              language: language,
              type: <SentenceType>{type},
              quote: kind,
              count: 20,
            )) {
              expect(sentence, startsWith(open), reason: '$language $type $kind: $sentence');
              expect(sentence, endsWith(close), reason: '$language $type $kind: $sentence');
            }
          }
        }

        // The two levels are two different pairs, or the option means nothing.
        expect(quotes[SentenceQuote.double], isNot(quotes[SentenceQuote.single]));
      }
    });

    test('a question is a shape, not a mark bolted onto a statement', () {
      // The languages whose grammar moves for a question say so in their own
      // frames, and the shape has to be one of those rather than the statement's.
      final carries = <WordLanguage, RegExp>{
        // English do-support, and the base form behind it.
        WordLanguage.en: RegExp(r'^(Does|Is) '),
        // Korean changes the ending on the predicate itself.
        WordLanguage.ko: RegExp(r'니\?$'),
        // A tag Japanese, Chinese and Vietnamese write after the whole clause.
        WordLanguage.ja: RegExp(r'か？$'),
        WordLanguage.zh: RegExp(r'吗？$'),
        WordLanguage.vi: RegExp(r'không\?$'),
      };

      carries.forEach((language, shape) {
        for (final sentence in randSentence(
          language: language,
          type: <SentenceType>{SentenceType.question},
          count: sample,
        )) {
          expect(sentence, matches(shape), reason: '$language: $sentence');
        }
      });

      // German moves its finite verb to the front, so the question opens on the
      // predicate or on the `ist` that stands in for one.
      final verbs = poolFor(WordLanguage.de, SentenceSlot.verb);

      for (final sentence in randSentence(
        language: WordLanguage.de,
        type: <SentenceType>{SentenceType.question},
        count: sample,
      )) {
        final first = sentence.split(' ').first.toLowerCase();

        expect(verbs.contains(first) || first == 'ist', isTrue, reason: 'de: $sentence');
      }
    });

    test('a question form pool is the same length as the words it restates', () {
      // Index-aligned is the whole contract: a verb keeps its meaning across the
      // forms, and a word the caller required is translated by its position.
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;
        final groups = <MapEntry<WordPool, PredicateForms>>[
          for (final group in data.verbs) MapEntry(group.words, group.forms),
          for (final group in data.states) MapEntry(group.words, group.forms),
        ];

        for (final group in groups) {
          group.value.forEach((form, pool) {
            expect(
              pool,
              hasLength(group.key.length),
              reason: '$language: the $form pool is ${pool.length} beside ${group.key.length}',
            );
            expect(pool.every((word) => word.isNotEmpty), isTrue, reason: '$language: a blank');
          });
        }
      }
    });

    test('a predicate is written in the form its type asks for', () {
      // The question form where the group declares one, and the plain words where
      // it does not — English states need none, because the shape moves `is` to
      // the front and leaves `green` alone.
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;
        final verbForms = <String>[
          for (final group in data.verbs) ...(group.forms[PredicateForm.question] ?? group.words),
        ];
        final stateForms = <String>[
          for (final group in data.states) ...(group.forms[PredicateForm.question] ?? group.words),
        ];
        final expected = <SentenceSlot, Set<String>>{
          SentenceSlot.verb: verbForms.toSet(),
          // A predicate adjective that agrees comes out in the form its subject
          // asked for, question or not.
          SentenceSlot.state:
              (data.predicateAgrees ? inflected(language, stateForms) : stateForms).toSet(),
        };

        for (final detail in randSentenceDetails(
          language: language,
          type: <SentenceType>{SentenceType.question},
          count: 120,
        )) {
          for (var i = 0; i < detail.phrases.length; i += 1) {
            final slot = detail.slots[i];

            if (slot != SentenceSlot.verb && slot != SentenceSlot.state) continue;

            final phrase = detail.phrases[i];
            final written =
                i == 0 ? phrase.substring(0, 1).toLowerCase() + phrase.substring(1) : phrase;
            final pool = expected[slot]!;

            expect(
              pool.contains(written) || pool.contains(phrase),
              isTrue,
              reason: '$language: "$phrase" is not the $slot form a question asks for',
            );
          }
        }
      }
    });

    test('`include` puts a required predicate in the form the type asks for', () {
      // The pools are index-aligned so that a word named in the statement form
      // can be said the other way rather than written out wrong.
      for (final sentence in randSentence(
        language: WordLanguage.ko,
        include: <String>['달린다'],
        type: <SentenceType>{SentenceType.question},
        count: 30,
      )) {
        expect(sentence, contains('달리니'), reason: sentence);
        expect(sentence.contains('달린다'), isFalse, reason: sentence);
      }

      for (final sentence in randSentence(
        language: WordLanguage.en,
        include: <String>['runs'],
        type: <SentenceType>{SentenceType.question},
        count: 30,
      )) {
        expect(sentence, matches(RegExp(r'\brun\b')), reason: sentence);
      }
    });

    test('an interjection opens an exclamation, and nothing else', () {
      for (final language in wordLanguages) {
        final data = sentenceData[language]!;
        final openers = data.interjections
            .map((word) => (data.capitalize ? upperFirst(word) : word) + data.space)
            .toList(growable: false);

        bool opens(String sentence) {
          final mark = data.openers[SentenceType.exclamation];
          final body = mark == null ? sentence : sentence.substring(mark.length);

          return openers.any(body.startsWith);
        }

        var seen = 0;

        for (final sentence in randSentence(
          language: language,
          type: <SentenceType>{SentenceType.exclamation},
          count: 120,
        )) {
          if (opens(sentence)) seen += 1;
        }

        expect(seen, greaterThan(0), reason: '$language never wrote an interjection');

        for (final sentence in randSentence(language: language, count: 120)) {
          expect(opens(sentence), isFalse, reason: '$language: a statement opened on one');
        }
      }
    });

    test('every language can write every type inside its own length range', () {
      for (final language in wordLanguages) {
        final range = sentenceLengthRange(language);

        for (final type in <SentenceType>[
          SentenceType.question,
          SentenceType.exclamation,
          SentenceType.trailing,
        ]) {
          for (final sentence in randSentence(
            language: language,
            type: <SentenceType>{type},
            count: 40,
          )) {
            expect(
              sentence.length,
              allOf(greaterThanOrEqualTo(range.min), lessThanOrEqualTo(range.max)),
              reason: '$language $type: $sentence (${sentence.length})',
            );
          }
        }
      }
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
