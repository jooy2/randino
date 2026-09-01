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
          'NicknameLanguage',
          'NicknameTheme',
          'nameCountMax',
          'nameLanguages',
          'nameLengthMax',
          'nameLengthMin',
          'nameLengthRange',
          'nameSupportsMiddleName',
          'nameSupportsRoman',
          'nicknameCountMax',
          'nicknameLanguages',
          'nicknameLengthMax',
          'nicknameLengthMin',
          'nicknameLengthRange',
          'nicknameSuffixCharset',
          'nicknameSuffixLengthMax',
          'nicknameThemes',
          'randName',
          'randNameDetails',
          'randNickname',
          'randNicknameDetails',
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
    });

    test('the bounds are the same numbers the JavaScript package uses', () {
      expect(nameLanguages, hasLength(9));
      expect(nameLengthMin, 1);
      expect(nameLengthMax, 30);
      expect(nameCountMax, 10000);

      expect(nicknameLanguages, hasLength(4));
      expect(nicknameThemes, hasLength(14));
      expect(nicknameLengthMin, 1);
      expect(nicknameLengthMax, 40);
      expect(nicknameCountMax, 10000);
      expect(nicknameSuffixLengthMax, 32);
      expect(nicknameSuffixCharset, matches(RegExp(r'^[0-9A-Za-z]+$')));
    });

    test('the enums list every code the datasets hold', () {
      // The two lists and the two enums are written out separately, and a
      // language added to one and not the other is a language the generator can
      // be asked for and cannot produce.
      expect(nameLanguages.toSet(), NameLanguage.values.toSet());
      expect(nicknameLanguages.toSet(), NicknameLanguage.values.toSet());
      expect(nicknameThemes.toSet(), NicknameTheme.values.toSet());
    });

    test('LengthRange compares by value', () {
      expect(const LengthRange(1, 4), const LengthRange(1, 4));
      expect(const LengthRange(1, 4), isNot(const LengthRange(1, 5)));
      expect(const LengthRange(1, 4).hashCode, const LengthRange(1, 4).hashCode);
    });
  });
}
