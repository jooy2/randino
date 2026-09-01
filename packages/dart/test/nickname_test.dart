import 'package:randino/randino.dart';
// The datasets are internal, but a nickname is only as good as the words it is
// built from — these checks are what keep person names out of them.
import 'package:randino/src/name/data/index.dart' as name_data;
import 'package:randino/src/nickname/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;

final Map<NicknameLanguage, RegExp> script = <NicknameLanguage, RegExp>{
  NicknameLanguage.en: RegExp(r'^[A-Za-z]+$'),
  NicknameLanguage.ko: RegExp(r'^[가-힣]+$'),
  NicknameLanguage.ja: RegExp(r'^[々぀-ヿ一-鿿]+$'),
  NicknameLanguage.zh: RegExp(r'^[々一-鿿]+$'),
};

/// Every word the language can put in a nickname.
List<String> allWords(NicknameLanguage language) {
  final data = nicknameData[language]!;

  return <String>[
    ...data.modifiers,
    ...?data.parts,
    for (final theme in nicknameThemes) ...data.nouns[theme]!,
  ];
}

List<String> nounsOf(NicknameLanguage language, [NicknameTheme? theme]) {
  final data = nicknameData[language]!;

  return theme != null
      ? data.nouns[theme]!
      : <String>[for (final each in nicknameThemes) ...data.nouns[each]!];
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
      expect(randNickname(count: nicknameCountMax + 500).length, nicknameCountMax);
    });

    test('every language writes nicknames in its own script', () {
      for (final language in nicknameLanguages) {
        for (final nickname in randNickname(language: language, count: sample)) {
          expect(nickname, matches(script[language]!), reason: '${language.name}: $nickname');
        }

        for (final nickname in randNickname(language: language, count: sample, style: 100)) {
          expect(
            nickname,
            matches(script[language]!),
            reason: '${language.name} invented: $nickname',
          );
        }
      }
    });

    test('the mixed language uses every language it knows', () {
      final used = <NicknameLanguage>{};

      for (final detail in randNicknameDetails(count: 400)) {
        expect(detail.nickname, matches(script[detail.language]!), reason: detail.nickname);
        used.add(detail.language);
      }

      expect(used.length, nicknameLanguages.length);
    });

    test('every language fills every theme', () {
      // The JavaScript package gets this from its type — `nouns` is a
      // `Record<NicknameTheme, WordPool>` there, and a language that skipped one
      // would not compile. A Dart `Map` will happily be missing a key, so the
      // check has to be a test.
      for (final language in nicknameLanguages) {
        for (final theme in nicknameThemes) {
          expect(
            nicknameData[language]!.nouns[theme],
            isNotEmpty,
            reason: '${language.name} has no ${theme.name} pool',
          );
        }
      }
    });

    test('nicknames are built from real words, and never from names', () {
      for (final language in nicknameLanguages) {
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

      for (final word in allWords(NicknameLanguage.en)) {
        expect(names, isNot(contains(word)), reason: '$word is a person name, not a nickname word');
      }
    });

    test('every nickname is a word with something added to it', () {
      final details = randNicknameDetails(language: NicknameLanguage.ko, count: 200);
      final modifiers = nicknameData[NicknameLanguage.ko]!.modifiers.toSet();
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

    test('includeModifier: false leaves the word undecorated', () {
      for (final language in nicknameLanguages) {
        final parts = nicknameData[language]!.parts ?? const <String>[];

        for (final detail in randNicknameDetails(
          language: language,
          count: sample,
          includeModifier: false,
        )) {
          // A noun, and at most one trailing word behind it. Note that a few
          // words serve as both modifier and noun (무지개, Marble), so the check
          // has to be structural rather than "is not a modifier".
          expect(detail.words.length, lessThanOrEqualTo(2), reason: detail.nickname);
          expect(nounsOf(language), contains(detail.words[0]), reason: detail.nickname);

          if (detail.words.length == 2) {
            expect(parts, contains(detail.words[1]), reason: detail.nickname);
          }
        }
      }
    });

    test('theme decides what the nickname is about', () {
      for (final theme in nicknameThemes) {
        for (final language in nicknameLanguages) {
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

      expect(themes, nicknameThemes.toSet());
    });

    test('a word belongs to exactly one theme', () {
      // Two themes claiming one word make `theme` ambiguous for `baseWord`, and
      // make `randNicknameDetails` report a theme the caller never asked about.
      for (final language in nicknameLanguages) {
        final owner = <String, NicknameTheme>{};

        for (final theme in nicknameThemes) {
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
      const ranges = <(NicknameLanguage, int, int)>[
        (NicknameLanguage.ko, 2, 3),
        (NicknameLanguage.ko, 4, 6),
        (NicknameLanguage.ko, 8, 10),
        (NicknameLanguage.en, 4, 8),
        (NicknameLanguage.en, 10, 16),
        (NicknameLanguage.en, 18, 24),
        (NicknameLanguage.ja, 2, 4),
        (NicknameLanguage.zh, 2, 4),
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
      expect(nicknameLengthRange(language: NicknameLanguage.zh), const LengthRange(2, 5));
      expect(nicknameLengthRange(language: NicknameLanguage.ko), const LengthRange(1, 12));
      // Without a modifier the upper end drops to a noun plus a trailing word.
      expect(
        nicknameLengthRange(language: NicknameLanguage.ko, includeModifier: false),
        const LengthRange(1, 8),
      );

      for (final language in nicknameLanguages) {
        final range = nicknameLengthRange(language: language);

        for (final style in <int>[0, 100]) {
          for (final nickname in randNickname(language: language, style: style, count: sample)) {
            expect(
              nickname.length,
              inInclusiveRange(range.min, range.max),
              reason: '${language.name} @ $style: $nickname',
            );
          }
        }
      }
    });

    test('wordSeparator goes between the words', () {
      for (final language in nicknameLanguages) {
        for (final wordSeparator in <String>['', ' ', '-', '::']) {
          for (final detail in randNicknameDetails(
            language: language,
            wordSeparator: wordSeparator,
            count: sample,
          )) {
            expect(
              detail.nickname,
              detail.words.join(wordSeparator),
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
        expect(detail.nickname, detail.words.join(), reason: detail.nickname);
      }

      // The separator is part of the nickname, so it counts toward the length.
      expect(
        nicknameLengthRange(language: NicknameLanguage.ko, wordSeparator: '-'),
        const LengthRange(1, 14),
      );
      expect(
        nicknameLengthRange(language: NicknameLanguage.en, wordSeparator: ' '),
        const LengthRange(3, 32),
      );

      const cases = <(NicknameLanguage, String, int, int)>[
        (NicknameLanguage.ko, ' ', 5, 8),
        (NicknameLanguage.en, '-', 8, 14),
        (NicknameLanguage.zh, '::', 6, 9),
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

      // The unique suffix keeps its own separator.
      for (final nickname in randNickname(
        language: NicknameLanguage.en,
        wordSeparator: '-',
        uniqueSuffix: true,
        count: 20,
      )) {
        expect(
          nickname,
          matches(RegExp(r'^[A-Za-z]+(-[A-Za-z]+)*_[0-9A-Za-z]{5}$')),
          reason: nickname,
        );
      }
    });

    test('uniqueSuffix appends a token that the length options ignore', () {
      for (final detail in randNicknameDetails(
        language: NicknameLanguage.ko,
        count: sample,
        uniqueSuffix: true,
        minLength: 4,
        maxLength: 6,
      )) {
        expect(detail.suffix, matches(RegExp(r'^_[0-9A-Za-z]{5}$')), reason: detail.nickname);
        expect(detail.words.join() + detail.suffix, detail.nickname);
        // The range covers the nickname, not the suffix.
        final word = detail.nickname.substring(0, detail.nickname.length - detail.suffix.length);

        expect(word.length, inInclusiveRange(4, 6), reason: detail.nickname);
        expect(word, matches(script[NicknameLanguage.ko]!), reason: detail.nickname);
      }

      // The token is what makes a nickname collision-free rather than unlikely.
      final many = randNickname(language: NicknameLanguage.ko, count: 2000, uniqueSuffix: true);

      expect(many.toSet().length, 2000);
    });

    test('the unique suffix is configurable', () {
      for (final nickname in randNickname(
        language: NicknameLanguage.en,
        count: 20,
        uniqueSuffix: true,
        uniqueSuffixLength: 8,
        uniqueSuffixSeparator: '-',
      )) {
        expect(nickname, matches(RegExp(r'^[A-Za-z]+-[0-9A-Za-z]{8}$')), reason: nickname);
      }

      for (final nickname in randNickname(
        language: NicknameLanguage.ko,
        count: 20,
        uniqueSuffix: true,
        uniqueSuffixLength: 4,
        uniqueSuffixCharset: '0123456789',
      )) {
        expect(nickname, matches(RegExp(r'^[가-힣]+_[0-9]{4}$')), reason: nickname);
      }

      // An empty separator is a valid choice, and lengths are clamped.
      for (final nickname in randNickname(
        language: NicknameLanguage.en,
        count: 20,
        uniqueSuffix: true,
        uniqueSuffixSeparator: '',
        uniqueSuffixLength: 0,
      )) {
        expect(nickname, matches(RegExp(r'^[A-Za-z]+[0-9A-Za-z]$')), reason: nickname);
      }

      // No suffix unless it was asked for.
      for (final detail in randNicknameDetails(count: 20, uniqueSuffixLength: 8)) {
        expect(detail.suffix, isEmpty);
      }
    });

    test('baseWord keeps the word and varies only the decoration', () {
      final details = randNicknameDetails(baseWord: '고양이', count: 100);

      for (final detail in details) {
        expect(detail.nickname, contains('고양이'), reason: detail.nickname);
        expect(detail.words, contains('고양이'), reason: detail.nickname);
        // Something is always added, or the answer would be the input.
        expect(detail.words.length, greaterThan(1), reason: detail.nickname);
        // The word decides the language when none was given.
        expect(detail.language, NicknameLanguage.ko);
        // 고양이 is one of the generator's own animal words, so its theme is known.
        expect(detail.theme, NicknameTheme.animal);
        expect(detail.nickname, matches(script[NicknameLanguage.ko]!), reason: detail.nickname);
      }

      expect(details.map((detail) => detail.nickname).toSet().length, greaterThan(20));

      // A word the generator does not know belongs to no theme.
      for (final detail in randNicknameDetails(baseWord: '뿌꾸', count: 20)) {
        expect(detail.theme, isNull);
        expect(detail.nickname, contains('뿌꾸'), reason: detail.nickname);
      }

      // Each script picks the language that goes with it.
      expect(randNicknameDetails(baseWord: 'Cat')[0].language, NicknameLanguage.en);
      expect(randNicknameDetails(baseWord: 'ネコ')[0].language, NicknameLanguage.ja);
      expect(randNicknameDetails(baseWord: '熊猫')[0].language, NicknameLanguage.zh);
      // An explicit language wins over the guess.
      expect(
        randNicknameDetails(baseWord: '고양이', language: NicknameLanguage.en)[0].language,
        NicknameLanguage.en,
      );

      // A base word longer than the language's natural range is not truncated.
      for (final nickname in randNickname(baseWord: '고양이발바닥무늬', count: 20)) {
        expect(nickname, contains('고양이발바닥무늬'), reason: nickname);
      }
    });

    test('startsWith leads every nickname with the requested character', () {
      for (final nickname in randNickname(
        language: NicknameLanguage.ko,
        count: sample,
        startsWith: '파',
      )) {
        expect(nickname, startsWith('파'), reason: nickname);
      }

      for (final nickname in randNickname(
        language: NicknameLanguage.en,
        count: sample,
        startsWith: 'b',
      )) {
        expect(nickname, matches(RegExp('^[Bb]')), reason: nickname);
      }

      // A character no real word starts with is answered with an invented one.
      for (final nickname in randNickname(
        language: NicknameLanguage.en,
        count: 20,
        startsWith: 'Z',
      )) {
        expect(nickname, matches(RegExp(r'^Z[A-Za-z]+$')), reason: nickname);
      }
    });

    test('style invents words instead of drawing them', () {
      final pool = allWords(NicknameLanguage.ko).toSet();
      final invented = randNicknameDetails(language: NicknameLanguage.ko, style: 100, count: 200);
      final drawn = invented.where((detail) => detail.words.any(pool.contains)).length;

      expect(drawn, lessThan(20), reason: '$drawn of 200 still came from the pools');

      for (final detail in invented) {
        expect(detail.nickname, matches(script[NicknameLanguage.ko]!), reason: detail.nickname);

        // An invented word can spell a real one by accident (나 + 비 -> 나비), and
        // the theme is then reported rather than hidden — but it has to be true.
        final theme = detail.theme;

        if (theme != null) {
          expect(
            detail.words.any(nounsOf(NicknameLanguage.ko, theme).contains),
            isTrue,
            reason: detail.nickname,
          );
        }
      }

      // Halfway, both kinds of word show up.
      final mixed = randNicknameDetails(language: NicknameLanguage.ko, style: 50, count: 200);

      expect(mixed.any((detail) => detail.words.every(pool.contains)), isTrue);
      expect(mixed.any((detail) => !detail.words.any(pool.contains)), isTrue);

      // Out-of-range values are clamped rather than rejected.
      for (final style in <int>[-50, 500]) {
        expect(randNickname(language: NicknameLanguage.ko, style: style, count: 5).length, 5);
      }
    });

    test('unique never repeats a nickname', () {
      final nicknames = randNickname(language: NicknameLanguage.ko, count: 2000, unique: true);

      expect(nicknames.toSet().length, nicknames.length);

      // A single word plus one theme is a small pool, so the request runs out of
      // combinations and returns fewer instead of looping.
      final limited = randNickname(
        language: NicknameLanguage.zh,
        theme: NicknameTheme.animal,
        includeModifier: false,
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
      for (final detail in randNicknameDetails(count: 100, uniqueSuffix: true)) {
        final joiner = nicknameData[detail.language]!.joiner;

        expect(detail.words.join(joiner) + detail.suffix, detail.nickname);
        expect(nicknameLanguages, contains(detail.language));
        expect(detail.theme == null || nicknameThemes.contains(detail.theme), isTrue);
      }
    });
  });
}
