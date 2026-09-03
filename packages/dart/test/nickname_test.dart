import 'package:randino/randino.dart';
// The datasets are internal, but a nickname is only as good as the words it is
// built from — these checks are what keep person names out of them.
import 'package:randino/src/name/data/index.dart' as name_data;
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/word_generator.dart';
import 'package:test/test.dart';

const int sample = 60;

final Map<WordLanguage, RegExp> script = <WordLanguage, RegExp>{
  WordLanguage.en: RegExp(r'^[A-Za-z]+$'),
  WordLanguage.ko: RegExp(r'^[가-힣]+$'),
  WordLanguage.ja: RegExp(r'^[々぀-ヿ一-鿿]+$'),
  WordLanguage.zh: RegExp(r'^[々一-鿿]+$'),
};

/// Every word the language can put in a nickname.
List<String> allWords(WordLanguage language) {
  final data = wordData[language]!;

  return <String>[
    ...data.adjectives,
    ...data.actions,
    ...?data.parts,
    for (final theme in wordThemes) ...data.nouns[theme]!,
  ];
}

/// Every particle the language's frames can put between two words, longest first.
List<String> gluesOf(WordLanguage language) {
  final seen = <String>{''};

  for (final frame in wordData[language]!.frames) {
    seen.addAll(frame.glue ?? const <String>[]);
  }

  return seen.toList()..sort((a, b) => b.length - a.length);
}

/// True when the nickname is exactly its words in order, with nothing between
/// them but the separator and a particle the language allows.
///
/// Backtracks, because a particle and the first character of the next word can
/// be the same one (`의` in front of `의자`).
bool joinedBy(String nickname, List<String> words, List<String> glues, String separator) {
  if (words.isEmpty) {
    return nickname.isEmpty;
  }

  if (!nickname.startsWith(words.first)) {
    return false;
  }

  final rest = nickname.substring(words.first.length);

  if (words.length == 1) {
    return rest.isEmpty;
  }

  return glues.any(
    (glue) =>
        rest.startsWith('$glue$separator') &&
        joinedBy(
          rest.substring(glue.length + separator.length),
          words.sublist(1),
          glues,
          separator,
        ),
  );
}

List<String> nounsOf(WordLanguage language, [WordTheme? theme]) {
  final data = wordData[language]!;

  return theme != null
      ? data.nouns[theme]!
      : <String>[for (final each in wordThemes) ...data.nouns[each]!];
}

void main() {
  group('Nickname', () {
    test('randNickname returns one nickname by default', () {
      final nicknames = randNickname();

      expect(nicknames.length, 1);
      expect(nicknames[0], isNotEmpty);
    });

    test('randNickname returns exactly `count` nicknames', () {
      expect(randNickname(count: 25).length, 25);
      expect(randNickname(count: 0).length, 0);
      expect(randNickname(count: -10).length, 0);
      expect(randNickname(count: randCountMax + 500).length, randCountMax);
    });

    test('every language writes nicknames in its own script', () {
      for (final language in wordLanguages) {
        for (final nickname in randNickname(language: language, count: sample)) {
          expect(nickname, matches(script[language]!), reason: '${language.name}: $nickname');
        }

        for (final nickname in randNickname(
          language: language,
          count: sample,
          realism: RandRealism.invented,
        )) {
          expect(
            nickname,
            matches(script[language]!),
            reason: '${language.name} invented: $nickname',
          );
        }
      }
    });

    test('the mixed language uses every language it knows', () {
      final used = <WordLanguage>{};

      for (final detail in randNicknameDetails(count: 400)) {
        expect(detail.nickname, matches(script[detail.language]!), reason: detail.nickname);
        used.add(detail.language);
      }

      expect(used.length, wordLanguages.length);
    });

    test('every language fills every theme', () {
      // The JavaScript package gets this from its type — `nouns` is a
      // `Record<WordTheme, WordPool>` there, and a language that skipped one
      // would not compile. A Dart `Map` will happily be missing a key, so the
      // check has to be a test.
      for (final language in wordLanguages) {
        for (final theme in wordThemes) {
          expect(
            wordData[language]!.nouns[theme],
            isNotEmpty,
            reason: '${language.name} has no ${theme.name} pool',
          );
        }
      }
    });

    test('nicknames are built from real words, and never from names', () {
      for (final language in wordLanguages) {
        final pool = allWords(language).toSet();

        for (final detail in randNicknameDetails(language: language, count: 200)) {
          expect(detail.words, isNotEmpty, reason: detail.nickname);

          for (final word in detail.words) {
            expect(
              pool,
              contains(word),
              reason: '${language.name}: $word is not in the word pools',
            );
          }
        }
      }

      // English person names are distinct words from English common nouns, so the
      // two sets must not meet — this is what stops an `Emma` or a `Bennett` from
      // being added to a nickname pool by accident. Korean and Japanese cannot be
      // held to that: 하늘, 별 and 森 are everyday nouns that also happen to be
      // names, and `아름다운하늘` is still nobody's name.
      final en = name_data.nameData[NameLanguage.en]!;
      final names = <String>{
        ...?en.male?.map((entry) => entry.n),
        ...?en.female?.map((entry) => entry.n),
        ...en.last.map((entry) => entry.n),
      };

      for (final word in allWords(WordLanguage.en)) {
        expect(names, isNot(contains(word)), reason: '$word is a person name, not a nickname word');
      }
    });

    test('every nickname is a word with something added to it', () {
      final details = randNicknameDetails(language: WordLanguage.ko, count: 200);
      final modifiers = modifiersOf(wordData[WordLanguage.ko]!).toSet();
      final decorated =
          details
              .where((detail) => detail.words.length > 1 || modifiers.contains(detail.words[0]))
              .length;

      // A bare word is allowed, but a decorated one is the point.
      expect(
        decorated,
        greaterThan(details.length * 0.5),
        reason: 'only $decorated of ${details.length} were decorated',
      );
      expect(details.any((detail) => modifiers.contains(detail.words[0])), isTrue);
      expect(details.any((detail) => detail.words.length == 3), isTrue);
    });

    test('theme decides what the nickname is about', () {
      for (final theme in wordThemes) {
        for (final language in wordLanguages) {
          final nouns = nounsOf(language, theme);

          for (final detail in randNicknameDetails(language: language, theme: theme, count: 40)) {
            expect(detail.theme, theme, reason: detail.nickname);
            expect(
              detail.words.any(nouns.contains),
              isTrue,
              reason: '${detail.nickname} has no ${theme.name} word',
            );
          }
        }
      }

      final themes = randNicknameDetails(count: 400).map((detail) => detail.theme).toSet();

      expect(themes, wordThemes.toSet());
    });

    test('a word belongs to exactly one theme', () {
      // Two themes claiming one word make `theme` ambiguous, and
      // make `randNicknameDetails` report a theme the caller never asked about.
      for (final language in wordLanguages) {
        final owner = <String, WordTheme>{};

        for (final theme in wordThemes) {
          for (final word in nounsOf(language, theme)) {
            final held = owner[word];

            expect(
              held,
              isNull,
              reason: '${language.name}: $word is in both ${held?.name} and ${theme.name}',
            );
            owner[word] = theme;
          }
        }
      }
    });

    test('nicknames stay inside the requested length range', () {
      const ranges = <(WordLanguage, int, int)>[
        (WordLanguage.ko, 2, 3),
        (WordLanguage.ko, 4, 6),
        (WordLanguage.ko, 8, 10),
        (WordLanguage.en, 4, 8),
        (WordLanguage.en, 10, 16),
        (WordLanguage.en, 18, 24),
        (WordLanguage.ja, 2, 4),
        (WordLanguage.zh, 2, 4),
      ];

      for (final (language, minLength, maxLength) in ranges) {
        for (final nickname in randNickname(
          language: language,
          minLength: minLength,
          maxLength: maxLength,
          count: sample,
        )) {
          expect(
            nickname.length,
            inInclusiveRange(minLength, maxLength),
            reason: '${language.name} $minLength-$maxLength: $nickname',
          );
        }
      }
    });

    test('omitted length bounds fall back to what the language can produce', () {
      expect(nicknameLengthRange(language: WordLanguage.zh), const LengthRange(2, 8));
      expect(nicknameLengthRange(language: WordLanguage.ko), const LengthRange(1, 13));
      expect(nicknameLengthRange(language: WordLanguage.en), const LengthRange(3, 31));

      for (final language in wordLanguages) {
        final range = nicknameLengthRange(language: language);

        for (final realism in <RandRealism>[RandRealism.real, RandRealism.invented]) {
          for (final nickname in randNickname(
            language: language,
            realism: realism,
            count: sample,
          )) {
            expect(
              nickname.length,
              inInclusiveRange(range.min, range.max),
              reason: '${language.name} @ ${realism.name}: $nickname',
            );
          }
        }
      }
    });

    test('wordSeparator goes between the words', () {
      for (final language in wordLanguages) {
        for (final wordSeparator in <String>['', ' ', '-', '::']) {
          for (final detail in randNicknameDetails(
            language: language,
            wordSeparator: wordSeparator,
            count: sample,
          )) {
            expect(
              joinedBy(detail.nickname, detail.words, gluesOf(language), wordSeparator),
              isTrue,
              reason: "${language.name} '$wordSeparator': ${detail.nickname}",
            );

            for (final word in detail.words) {
              expect(word, matches(script[language]!), reason: '${language.name}: $word');
            }
          }
        }
      }

      // Omitted, it falls back to the way the language joins its words, which is
      // to run them together.
      for (final detail in randNicknameDetails(count: sample)) {
        expect(
          joinedBy(detail.nickname, detail.words, gluesOf(detail.language), ''),
          isTrue,
          reason: detail.nickname,
        );
      }

      // The separator is part of the nickname, so it counts toward the length.
      expect(
        nicknameLengthRange(language: WordLanguage.ko, wordSeparator: '-'),
        const LengthRange(1, 15),
      );
      expect(
        nicknameLengthRange(language: WordLanguage.en, wordSeparator: ' '),
        const LengthRange(3, 33),
      );

      const cases = <(WordLanguage, String, int, int)>[
        (WordLanguage.ko, ' ', 5, 8),
        (WordLanguage.en, '-', 8, 14),
        (WordLanguage.zh, '::', 6, 9),
      ];

      for (final (language, wordSeparator, minLength, maxLength) in cases) {
        for (final nickname in randNickname(
          language: language,
          wordSeparator: wordSeparator,
          minLength: minLength,
          maxLength: maxLength,
          count: sample,
        )) {
          expect(
            nickname.length,
            inInclusiveRange(minLength, maxLength),
            reason: "${language.name} '$wordSeparator' $minLength-$maxLength: $nickname",
          );
        }
      }
    });

    test('startsWith leads every nickname with the requested character', () {
      for (final nickname in randNickname(
        language: WordLanguage.ko,
        count: sample,
        startsWith: '파',
      )) {
        expect(nickname, startsWith('파'), reason: nickname);
      }

      for (final nickname in randNickname(
        language: WordLanguage.en,
        count: sample,
        startsWith: 'b',
      )) {
        expect(nickname, matches(RegExp('^[Bb]')), reason: nickname);
      }

      // A character no real word starts with is answered with an invented one.
      for (final nickname in randNickname(language: WordLanguage.en, count: 20, startsWith: 'Z')) {
        expect(nickname, matches(RegExp(r'^Z[A-Za-z]+$')), reason: nickname);
      }
    });

    test('realism invents words instead of drawing them', () {
      final pool = allWords(WordLanguage.ko).toSet();
      final invented = randNicknameDetails(
        language: WordLanguage.ko,
        realism: RandRealism.invented,
        count: 200,
      );
      final drawn = invented.where((detail) => detail.words.any(pool.contains)).length;

      expect(drawn, lessThan(20), reason: '$drawn of 200 still came from the pools');

      for (final detail in invented) {
        expect(detail.nickname, matches(script[WordLanguage.ko]!), reason: detail.nickname);

        // An invented word can spell a real one by accident (나 + 비 -> 나비), and
        // the theme is then reported rather than hidden — but it has to be true.
        final theme = detail.theme;

        if (theme != null) {
          expect(
            detail.words.any(nounsOf(WordLanguage.ko, theme).contains),
            isTrue,
            reason: detail.nickname,
          );
        }
      }

      // Halfway, both kinds of word show up.
      final mixed = randNicknameDetails(
        language: WordLanguage.ko,
        realism: RandRealism.mixed,
        count: 200,
      );

      expect(mixed.any((detail) => detail.words.every(pool.contains)), isTrue);
      expect(mixed.any((detail) => !detail.words.any(pool.contains)), isTrue);

      // Out-of-range values are clamped rather than rejected.
      // Every level is accepted, and the enum is what rules the rest out.
      for (final realism in RandRealism.values) {
        expect(randNickname(language: WordLanguage.ko, realism: realism, count: 5).length, 5);
      }
    });

    test('unique never repeats a nickname', () {
      final nicknames = randNickname(language: WordLanguage.ko, count: 2000, unique: true);

      expect(nicknames.toSet().length, nicknames.length);

      // One theme in one language, held to two characters, is a small enough
      // pool that the request runs out of combinations and returns fewer
      // instead of looping.
      final limited = randNickname(
        language: WordLanguage.zh,
        theme: WordTheme.animal,
        maxLength: 2,
        count: 400,
        unique: true,
      );

      expect(limited.toSet().length, limited.length);
      expect(
        limited.length,
        lessThan(400),
        reason: 'expected the pool to run out: ${limited.length}',
      );
    });

    test('randNicknameDetails reports the pieces it used', () {
      for (final detail in randNicknameDetails(count: 100)) {
        final joiner = wordData[detail.language]!.joiner;

        expect(joinedBy(detail.nickname, detail.words, gluesOf(detail.language), joiner), isTrue);
        expect(wordLanguages, contains(detail.language));
        expect(detail.theme == null || wordThemes.contains(detail.theme), isTrue);
      }
    });
  });
}
