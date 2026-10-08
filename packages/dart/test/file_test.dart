import 'package:randino/randino.dart';
// Internal, but it is what a result is checked against.
import 'package:randino/src/file/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 6000;

void main() {
  group('File extension', () {
    test('randFileExtension returns one extension, dot included, by default', () {
      expect(randFileExtension().single, matches(RegExp(r'^\.[a-z0-9]+$')));
    });

    test('returns exactly `count` extensions', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randFileExtension(count: count), hasLength(count));
      }

      expect(randFileExtension(count: -3), isEmpty);
      expect(randFileExtension(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every extension is listed once, in lower case, in a category that exists', () {
      final seen = <String>{};

      for (final entry in fileExtensions) {
        expect(seen.add(entry.name), isTrue, reason: '${entry.name} is listed twice');
        expect(entry.name, matches(RegExp(r'^[a-z0-9]+$')));
        expect(entry.weight, inInclusiveRange(1, 5));
      }

      for (final category in FileCategory.values) {
        expect(fileExtensions.any((entry) => entry.category == category), isTrue);
      }
    });

    test('every extension is one the catalog holds, in its own category', () {
      for (final detail in randFileExtensionDetails(count: sample * 5)) {
        final entry = fileExtensions.firstWhere((each) => each.name == detail.name);

        expect(detail.category, entry.category);
        expect(detail.extension, '.${detail.name}');
      }
    });

    test('includeDot: false leaves the dot out', () {
      for (final detail in randFileExtensionDetails(includeDot: false, count: sample)) {
        expect(detail.extension, detail.name);
      }
    });

    test('category keeps to one kind of file or several', () {
      for (final category in FileCategory.values) {
        expect(
          randFileExtensionDetails(
            category: {category},
            count: sample,
          ).every((detail) => detail.category == category),
          isTrue,
          reason: category.name,
        );
      }

      expect(
        randFileExtensionDetails(
          category: {FileCategory.code, FileCategory.data},
          count: sample,
        ).every(
          (detail) => detail.category == FileCategory.code || detail.category == FileCategory.data,
        ),
        isTrue,
      );
    });

    test('the common extensions come up most often', () {
      final extensions = randFileExtension(count: large);
      double share(String extension) =>
          extensions.where((each) => each == extension).length / extensions.length;

      expect(share('.pdf'), greaterThan(share('.wpd')));
      expect(share('.png'), greaterThan(share('.psd')));
      expect(share('.pdf'), inExclusiveRange(0.01, 0.04));
    });

    test('unique never repeats an extension', () {
      final found = randFileExtension(category: {FileCategory.image}, unique: true, count: 100);
      final images = fileExtensions.where((entry) => entry.category == FileCategory.image).length;

      expect(found.toSet(), hasLength(found.length));
      expect(found.length, inInclusiveRange(9, images));
    });
  });
}
