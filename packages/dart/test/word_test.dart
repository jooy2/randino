import 'package:randino/randino.dart';
// The datasets are internal, but a word generator is only as good as the pools
// behind it — these checks are what tie the output back to them.
import 'package:randino/src/word/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;

final Map<WordLanguage, RegExp> script = <WordLanguage, RegExp>{
  WordLanguage.en: RegExp(r'^[A-Za-z]+$'),
  WordLanguage.ko: RegExp(r'^[가-힣]+$'),
  WordLanguage.ja: RegExp(r'^[々぀-ヿ一-鿿]+$'),
  WordLanguage.zh: RegExp(r'^[々一-鿿]+$'),
};

/// The themed generator for each theme, which is what the seventeen of them are.
final Map<WordTheme, List<String> Function({WordLanguage? language, int count})>
themed = <WordTheme, List<String> Function({WordLanguage? language, int count})>{
  WordTheme.animal:
      ({WordLanguage? language, int count = 1}) => randAnimal(language: language, count: count),
  WordTheme.object:
      ({WordLanguage? language, int count = 1}) => randObject(language: language, count: count),
  WordTheme.nature:
      ({WordLanguage? language, int count = 1}) => randNature(language: language, count: count),
  WordTheme.plant:
      ({WordLanguage? language, int count = 1}) => randPlant(language: language, count: count),
  WordTheme.gem:
      ({WordLanguage? language, int count = 1}) => randGem(language: language, count: count),
  WordTheme.concept:
      ({WordLanguage? language, int count = 1}) => randConcept(language: language, count: count),
  WordTheme.myth:
      ({WordLanguage? language, int count = 1}) => randMyth(language: language, count: count),
  WordTheme.job:
      ({WordLanguage? language, int count = 1}) => randJob(language: language, count: count),
  WordTheme.music:
      ({WordLanguage? language, int count = 1}) => randMusic(language: language, count: count),
  WordTheme.place:
      ({WordLanguage? language, int count = 1}) => randPlace(language: language, count: count),
  WordTheme.food:
      ({WordLanguage? language, int count = 1}) => randFood(language: language, count: count),
  WordTheme.sport:
      ({WordLanguage? language, int count = 1}) => randSport(language: language, count: count),
  WordTheme.vehicle:
      ({WordLanguage? language, int count = 1}) => randVehicle(language: language, count: count),
  WordTheme.product:
      ({WordLanguage? language, int count = 1}) => randProduct(language: language, count: count),
  WordTheme.color:
      ({WordLanguage? language, int count = 1}) => randColor(language: language, count: count),
  WordTheme.finance:
      ({WordLanguage? language, int count = 1}) => randFinance(language: language, count: count),
  WordTheme.tech:
      ({WordLanguage? language, int count = 1}) => randTech(language: language, count: count),
};

List<String> poolOf(WordLanguage language, [WordTheme? theme]) {
  final data = wordData[language]!;

  return theme != null
      ? data.nouns[theme]!
      : <String>[for (final each in wordThemes) ...data.nouns[each]!];
}

void main() {
  group('Word', () {
    test('randWord returns one word by default', () {
      final words = randWord();

      expect(words, hasLength(1));
      expect(words.first, isNotEmpty);
    });

    test('randWord returns exactly `count` words', () {
      expect(randWord(count: 25), hasLength(25));
      expect(randWord(count: 0), isEmpty);
      expect(randWord(count: -10), isEmpty);
      expect(randWord(count: randCountMax + 500), hasLength(randCountMax));
    });

    test('every language writes its words in its own script', () {
      for (final language in wordLanguages) {
        for (final word in randWord(language: language, count: sample)) {
          expect(word, matches(script[language]!), reason: '$language: $word');
        }

        for (final word in randWord(
          language: language,
          count: sample,
          realism: RandRealism.invented,
        )) {
          expect(word, matches(script[language]!), reason: '$language invented: $word');
        }
      }
    });

    test('the mixed language uses every language it knows', () {
      final used = randWordDetails(count: 400).map((detail) => detail.language).toSet();

      expect(used, hasLength(wordLanguages.length));
    });

    test('a drawn word comes out of the pools, and reports the theme that holds it', () {
      for (final language in wordLanguages) {
        final pool = poolOf(language).toSet();

        for (final detail in randWordDetails(language: language, count: 200)) {
          expect(pool, contains(detail.word), reason: '$language: ${detail.word}');
          expect(detail.theme, isNotNull, reason: detail.word);
          expect(poolOf(language, detail.theme), contains(detail.word), reason: detail.word);
        }
      }
    });

    test('theme narrows the pool to that one theme', () {
      for (final theme in wordThemes) {
        for (final language in wordLanguages) {
          final nouns = poolOf(language, theme);

          for (final detail in randWordDetails(language: language, theme: theme, count: 40)) {
            expect(detail.theme, theme, reason: detail.word);
            expect(nouns, contains(detail.word), reason: '${detail.word} is not a $theme word');
          }
        }
      }

      final themes = randWordDetails(count: 400).map((detail) => detail.theme).toSet();

      expect(themes, wordThemes.toSet());
    });

    test('there is one generator per theme, and it is that theme', () {
      // A theme added to `wordThemes` without a generator beside it is the
      // failure this catches — the table above would be missing a key.
      expect(themed.keys.toSet(), wordThemes.toSet());

      for (final theme in wordThemes) {
        for (final language in wordLanguages) {
          final nouns = poolOf(language, theme);

          for (final word in themed[theme]!(language: language, count: 20)) {
            expect(nouns, contains(word), reason: '$theme: $word');
          }
        }
      }
    });

    test('words stay inside the requested length range', () {
      final ranges = <(WordLanguage, WordTheme, int, int)>[
        (WordLanguage.ko, WordTheme.animal, 2, 3),
        (WordLanguage.ko, WordTheme.food, 2, 4),
        (WordLanguage.en, WordTheme.animal, 3, 6),
        (WordLanguage.en, WordTheme.object, 6, 9),
        (WordLanguage.ja, WordTheme.nature, 2, 4),
        (WordLanguage.zh, WordTheme.plant, 2, 3),
      ];

      for (final (language, theme, minLength, maxLength) in ranges) {
        for (final word in randWord(
          language: language,
          theme: theme,
          minLength: minLength,
          maxLength: maxLength,
          count: sample,
        )) {
          expect(
            word.length,
            inInclusiveRange(minLength, maxLength),
            reason: '$language/$theme $minLength-$maxLength: $word',
          );
        }
      }
    });

    test('omitted length bounds fall back to what the pools hold', () {
      expect(wordLengthRange(language: WordLanguage.zh), const LengthRange(2, 3));
      expect(wordLengthRange(language: WordLanguage.ko), const LengthRange(1, 4));
      expect(wordLengthRange(language: WordLanguage.en), const LengthRange(3, 11));

      for (final language in wordLanguages) {
        final range = wordLengthRange(language: language);

        for (final word in randWord(language: language, count: sample)) {
          expect(word.length, inInclusiveRange(range.min, range.max), reason: '$language: $word');
        }

        // A theme is a pool of its own, so its range sits inside the language's.
        for (final theme in wordThemes) {
          final span = wordLengthRange(language: language, theme: theme);

          expect(span.min, greaterThanOrEqualTo(range.min), reason: '$language/$theme');
          expect(span.max, lessThanOrEqualTo(range.max), reason: '$language/$theme');
        }
      }
    });

    test('startsWith leads every word with the requested character', () {
      for (final word in randWord(language: WordLanguage.ko, count: sample, startsWith: '바')) {
        expect(word, startsWith('바'), reason: word);
      }

      for (final word in randWord(language: WordLanguage.en, count: sample, startsWith: 'b')) {
        expect(word, matches(RegExp('^[Bb]')), reason: word);
      }

      // A character no real word starts with is answered with an invented one.
      for (final word in randWord(
        language: WordLanguage.en,
        theme: WordTheme.gem,
        count: 20,
        startsWith: 'Z',
      )) {
        expect(word, matches(RegExp(r'^Z[A-Za-z]+$')), reason: word);
      }
    });

    test('realism invents words instead of drawing them', () {
      final pool = poolOf(WordLanguage.ko).toSet();
      final invented = randWordDetails(
        language: WordLanguage.ko,
        realism: RandRealism.invented,
        count: 200,
      );
      final drawn = invented.where((detail) => pool.contains(detail.word));

      expect(drawn.length, lessThan(20));

      for (final detail in invented) {
        expect(detail.word, matches(script[WordLanguage.ko]!), reason: detail.word);

        // An invented word can spell a real one by accident (나 + 비 -> 나비), and
        // the theme is then reported rather than hidden — but it has to be true.
        if (detail.theme != null) {
          expect(poolOf(WordLanguage.ko, detail.theme), contains(detail.word));
        }
      }

      // Halfway, both kinds of word show up.
      final mixed = randWordDetails(
        language: WordLanguage.ko,
        realism: RandRealism.mixed,
        count: 200,
      );

      expect(mixed.any((detail) => pool.contains(detail.word)), isTrue);
      expect(mixed.any((detail) => !pool.contains(detail.word)), isTrue);

      // Out-of-range values are clamped rather than rejected.
      // Every level is accepted, and the enum is what rules the rest out.
      for (final realism in RandRealism.values) {
        expect(randWord(language: WordLanguage.ko, realism: realism, count: 5), hasLength(5));
      }
    });

    test('unique never repeats a word', () {
      final words = randWord(language: WordLanguage.ko, count: 400, unique: true);

      expect(words.toSet(), hasLength(words.length));

      // One theme in one language is a pool of a few dozen words, so the request
      // runs out and returns fewer instead of looping.
      final limited = randWord(
        language: WordLanguage.zh,
        theme: WordTheme.sport,
        count: 400,
        unique: true,
      );

      expect(limited.toSet(), hasLength(limited.length));
      expect(limited.length, lessThan(400));
    });
  });
}
