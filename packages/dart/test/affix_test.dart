import 'package:randino/randino.dart';
import 'package:test/test.dart';

/// Large enough that a broken option cannot pass by luck. The same number the
/// other two suites use.
const int sample = 60;

/// The default token: five characters, alphanumeric.
final RegExp token = RegExp(r'^[0-9A-Za-z]{5}$');

void main() {
  group('Affix', () {
    test('randSuffix appends the token and randPrefix puts it in front', () {
      for (final word in randNickname(language: WordLanguage.en, count: sample)) {
        final suffixed = randSuffix(word);
        final prefixed = randPrefix(word);

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
          randSuffix('Owl', length: 8, separator: '-'),
          matches(RegExp(r'^Owl-[0-9A-Za-z]{8}$')),
        );
        expect(
          randPrefix('Owl', length: 8, separator: '-'),
          matches(RegExp(r'^[0-9A-Za-z]{8}-Owl$')),
        );
        expect(
          randSuffix('사자', length: 4, charset: '0123456789'),
          matches(RegExp(r'^사자_[0-9]{4}$')),
        );
        // An empty separator is a choice, not a missing value.
        expect(randSuffix('Owl', separator: '', length: 1), matches(RegExp(r'^Owl[0-9A-Za-z]$')));
      }
    });

    test('length is clamped to at least one character and at most the maximum', () {
      expect(randSuffix('a', length: 0, separator: '').length, 2);
      expect(randSuffix('a', length: -5, separator: '').length, 2);
      expect(randSuffix('a', length: 999, separator: '').length, 1 + affixLengthMax);
    });

    test('attaches to anything, which is the reason it is not a nickname option', () {
      final names = randName(language: NameLanguage.ko, count: sample);
      final tagged = randSuffixAll(names);

      for (var index = 0; index < names.length; index += 1) {
        expect(tagged[index], startsWith('${names[index]}_'));
      }

      expect(
        randPrefix('order-4021', length: 4, separator: '-'),
        matches(RegExp(r'^[0-9A-Za-z]{4}-order-4021$')),
      );
    });
  });
}
