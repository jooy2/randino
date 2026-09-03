import 'dart:io';

import 'package:randino/randino.dart';
import 'package:test/test.dart';

/// Every name `lib/randino.dart` exports, read out of its `show` clauses.
///
/// Dart has no way to ask a library what it exports at run time, so the source
/// is what gets asked. That is not a detour: the barrel's `show` clauses **are**
/// the API contract here — a symbol that reaches a caller without being listed
/// in one is a leak, and this reads the same list a reader of that file does.
Set<String> exportedNames() {
  final source = File('lib/randino.dart').readAsStringSync();
  final names = <String>{};

  for (final match in RegExp(r'show\s+([^;]+);').allMatches(source)) {
    for (final name in match.group(1)!.split(',')) {
      final trimmed = name.trim();

      if (trimmed.isNotEmpty) {
        names.add(trimmed);
      }
    }
  }

  return names;
}

void main() {
  group('base test', () {
    test('the package exports exactly its public API', () {
      // Everything documented on the site has to be reachable from the barrel,
      // and nothing internal should leak through it.
      expect(
        exportedNames().toList()..sort(),
        <String>[
          'LengthRange',
          'NameDetail',
          'NameGender',
          'NameLanguage',
          'NameScript',
          'NicknameDetail',
          'RandRealism',
          'WordDetail',
          'WordLanguage',
          'WordTheme',
          'affixCharset',
          'affixLengthDefault',
          'affixLengthMax',
          'affixSeparatorDefault',
          'nameLanguages',
          'nameLengthRange',
          'nameSupportsMiddleName',
          'nameSupportsRoman',
          'wordLanguages',
          'nicknameLengthRange',
          'wordThemes',
          'randName',
          'randNameDetails',
          'randNickname',
          'randNicknameDetails',
          'randAnimal',
          'randColor',
          'randConcept',
          'randFinance',
          'randFood',
          'randGem',
          'randJob',
          'randModifier',
          'randModifierAll',
          'randMusic',
          'randMyth',
          'randNature',
          'randObject',
          'randPlace',
          'randPlant',
          'randProduct',
          'randSport',
          'randTech',
          'randVehicle',
          'randCountMax',
          'randLengthMax',
          'randLengthMin',
          'randPrefix',
          'randPrefixAll',
          'randSuffix',
          'randSuffixAll',
          'randWord',
          'randWordDetails',
          'wordLengthRange',
        ]..sort(),
      );
    });

    test('every exported function answers', () {
      expect(randName(), hasLength(1));
      expect(randNameDetails()[0], isA<NameDetail>());
      expect(nameLengthRange(), isA<LengthRange>());
      expect(nameSupportsMiddleName(), isA<bool>());
      expect(nameSupportsRoman(), isA<bool>());

      expect(randNickname(), hasLength(1));
      expect(randNicknameDetails()[0], isA<NicknameDetail>());
      expect(nicknameLengthRange(), isA<LengthRange>());

      expect(randSuffix(value: 'a'), startsWith('a_'));
      expect(randPrefix(value: 'a'), endsWith('_a'));
      // The decorators work with nothing to decorate, which is what makes what
      // they attach available on its own.
      expect(randSuffix(), hasLength(affixLengthDefault));
      expect(randPrefix(), hasLength(affixLengthDefault));
      expect(randModifier(), isNotEmpty);
      expect(randModifier(value: '사자'), endsWith('사자'));
      expect(randModifierAll(const ['사자', '여우']), hasLength(2));
      expect(randSuffixAll(const ['a', 'b']), hasLength(2));
      expect(randPrefixAll(const ['a', 'b']), hasLength(2));

      expect(randWord(), hasLength(1));
      expect(randWordDetails()[0], isA<WordDetail>());
      expect(wordLengthRange(), isA<LengthRange>());
      expect(randAnimal(language: WordLanguage.ko), hasLength(1));
    });

    test('the bounds are the same numbers the JavaScript package uses', () {
      expect(nameLanguages, hasLength(9));
      // One set of bounds for every generator, rather than one set per
      // category holding the same numbers.
      expect(randLengthMin, 1);
      expect(randLengthMax, 40);
      expect(randCountMax, 10000);

      expect(wordLanguages, hasLength(4));
      expect(wordThemes, hasLength(17));

      expect(affixLengthDefault, 5);
      expect(affixLengthMax, 32);
      expect(affixSeparatorDefault, '_');
      expect(affixCharset, matches(RegExp(r'^[0-9A-Za-z]+$')));
    });

    test('the enums list every code the datasets hold', () {
      // The two lists and the two enums are written out separately, and a
      // language added to one and not the other is a language the generator can
      // be asked for and cannot produce.
      expect(nameLanguages.toSet(), NameLanguage.values.toSet());
      expect(wordLanguages.toSet(), WordLanguage.values.toSet());
      expect(wordThemes.toSet(), WordTheme.values.toSet());
    });

    test('LengthRange compares by value', () {
      expect(const LengthRange(1, 4), const LengthRange(1, 4));
      expect(const LengthRange(1, 4), isNot(const LengthRange(1, 5)));
      expect(const LengthRange(1, 4).hashCode, const LengthRange(1, 4).hashCode);
    });
  });
}
