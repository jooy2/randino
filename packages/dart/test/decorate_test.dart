import 'package:randino/randino.dart';
// The decorating pools are internal, but what `randModifier` attaches has to
// come out of them, and they are the same pools the nickname generator uses.
import 'package:randino/src/word/data/index.dart';
import 'package:randino/src/word/word_generator.dart';
import 'package:test/test.dart';

/// Large enough that a broken option cannot pass by luck. The same number the
/// other two suites use.
const int sample = 60;

/// The default token: five characters, alphanumeric.
final RegExp token = RegExp(r'^[0-9A-Za-z]{5}$');

void main() {
  group('Decorate', () {
    test('randSuffix appends the token and randPrefix puts it in front', () {
      for (final word in randNickname(language: WordLanguage.en, count: sample)) {
        final suffixed = randSuffix(value: word);
        final prefixed = randPrefix(value: word);

        expect(suffixed, startsWith('${word}_'));
        expect(prefixed, endsWith('_$word'));
        expect(suffixed.length, word.length + 6);
        expect(prefixed.length, word.length + 6);

        final drawn = suffixed.substring(word.length + 1);

        expect(drawn, matches(token), reason: suffixed);

        // Not merely alphanumeric: the pairs that are easy to misread are out.
        for (final character in drawn.split('')) {
          expect(affixCharset, contains(character), reason: '$character in $suffixed');
        }
      }
    });

    test('the list forms attach one token per entry, not one for the batch', () {
      final words = randNickname(language: WordLanguage.ko, count: sample);
      final suffixed = randSuffixAll(words);
      final prefixed = randPrefixAll(words);

      expect(suffixed, hasLength(words.length));
      expect(prefixed, hasLength(words.length));

      for (var index = 0; index < words.length; index += 1) {
        expect(suffixed[index], startsWith('${words[index]}_'));
        expect(prefixed[index], endsWith('_${words[index]}'));
      }

      expect(randSuffixAll(const []), isEmpty);

      // Twelve characters, so that a collision is not what this is measuring.
      final tokens = randSuffixAll(List<String>.filled(2000, 'x'), length: 12);

      expect(tokens.toSet().length, 2000);
    });

    test('length, separator and charset are all configurable', () {
      for (var i = 0; i < sample; i += 1) {
        expect(
          randSuffix(value: 'Owl', length: 8, separator: '-'),
          matches(RegExp(r'^Owl-[0-9A-Za-z]{8}$')),
        );
        expect(
          randPrefix(value: 'Owl', length: 8, separator: '-'),
          matches(RegExp(r'^[0-9A-Za-z]{8}-Owl$')),
        );
        expect(
          randSuffix(value: '사자', length: 4, charset: '0123456789'),
          matches(RegExp(r'^사자_[0-9]{4}$')),
        );
        // An empty separator is a choice, not a missing value.
        expect(
          randSuffix(value: 'Owl', separator: '', length: 1),
          matches(RegExp(r'^Owl[0-9A-Za-z]$')),
        );
      }
    });

    test('length is clamped to at least one character and at most the maximum', () {
      expect(randSuffix(value: 'a', length: 0, separator: '').length, 2);
      expect(randSuffix(value: 'a', length: -5, separator: '').length, 2);
      expect(randSuffix(value: 'a', length: 999, separator: '').length, 1 + affixLengthMax);
    });

    test('attaches to anything, which is the reason it is not a nickname option', () {
      final names = randName(language: NameLanguage.ko, count: sample);
      final tagged = randSuffixAll(names);

      for (var index = 0; index < names.length; index += 1) {
        expect(tagged[index], startsWith('${names[index]}_'));
      }

      expect(
        randPrefix(value: 'order-4021', length: 4, separator: '-'),
        matches(RegExp(r'^[0-9A-Za-z]{4}-order-4021$')),
      );
    });

    test('with no value at all, the token is the whole answer', () {
      // What a decorator attaches is worth having on its own, so the value is
      // optional on all three of them.
      for (var i = 0; i < sample; i += 1) {
        expect(randSuffix(), matches(token));
        expect(randPrefix(), matches(token));
        expect(randSuffix(length: 8), matches(RegExp(r'^[0-9A-Za-z]{8}$')));
        expect(randPrefix(length: 4, charset: '0123456789'), matches(RegExp(r'^[0-9]{4}$')));
        // No value means no separator either — there is nothing to separate.
        expect(randSuffix(separator: '-'), isNot(contains('-')));
      }
    });

    test('randModifier puts a real modifier in front of the value', () {
      for (final language in wordLanguages) {
        final modifiers = modifiersOf(wordData[language]!).toSet();

        for (final word in randWord(language: language, count: sample)) {
          final decorated = randModifier(value: word, language: language);

          expect(decorated, endsWith(word), reason: decorated);
          expect(
            modifiers,
            contains(decorated.substring(0, decorated.length - word.length)),
            reason: '$decorated does not start with a $language modifier',
          );
        }
      }
    });

    test('randModifier on its own is the modifier', () {
      for (final language in wordLanguages) {
        final modifiers = modifiersOf(wordData[language]!).toSet();

        for (var i = 0; i < sample; i += 1) {
          expect(modifiers, contains(randModifier(language: language)), reason: '$language');
        }
      }

      // Every language shows up when none is asked for.
      final used = <WordLanguage>{};

      for (var i = 0; i < 400; i += 1) {
        final word = randModifier();

        for (final language in wordLanguages) {
          if (modifiersOf(wordData[language]!).contains(word)) {
            used.add(language);
          }
        }
      }

      expect(used, hasLength(wordLanguages.length));
    });

    test('randModifier follows the script of the value when no language is given', () {
      bool belongs(String word, WordLanguage language) =>
          modifiersOf(wordData[language]!).any(word.startsWith);

      final scripts = <String, WordLanguage>{
        '고양이': WordLanguage.ko,
        'ネコ': WordLanguage.ja,
        '熊猫': WordLanguage.zh,
        'Cat': WordLanguage.en,
      };

      for (final entry in scripts.entries) {
        for (var i = 0; i < 20; i += 1) {
          final decorated = randModifier(value: entry.key);

          expect(belongs(decorated, entry.value), isTrue, reason: decorated);
        }
      }

      // An explicit language wins over the guess.
      for (var i = 0; i < 20; i += 1) {
        expect(
          belongs(randModifier(value: '고양이', language: WordLanguage.en), WordLanguage.en),
          isTrue,
        );
      }
    });

    test('randModifier takes a separator, a realism and a list', () {
      for (var i = 0; i < sample; i += 1) {
        expect(
          randModifier(value: 'Owl', language: WordLanguage.en, separator: ' '),
          matches(RegExp(r'^[A-Za-z]+ Owl$')),
        );
        expect(
          randModifier(value: '사자', language: WordLanguage.ko, separator: '-'),
          matches(RegExp('^[가-힣]+-사자\$')),
        );
      }

      // An invented modifier is still in the language's script.
      final pool = modifiersOf(wordData[WordLanguage.ko]!).toSet();
      var drawn = 0;

      for (var i = 0; i < 200; i += 1) {
        final word = randModifier(language: WordLanguage.ko, realism: RandRealism.invented);

        expect(word, matches(RegExp('^[가-힣]+\$')), reason: word);

        if (pool.contains(word)) {
          drawn += 1;
        }
      }

      expect(drawn, lessThan(20));

      // A list gets a fresh modifier each, not one for the batch.
      final words = randAnimal(language: WordLanguage.ko, count: sample);
      final decorated = randModifierAll(words);

      expect(decorated, hasLength(words.length));

      for (var i = 0; i < words.length; i += 1) {
        expect(decorated[i], endsWith(words[i]), reason: decorated[i]);
      }

      expect(randModifierAll(const <String>[]), isEmpty);
    });
  });
}
