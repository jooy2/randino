import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/file/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 6000;
final RegExp mime = RegExp(r'^(application|audio|font|image|model|text|video)/[a-z0-9.+-]+$');

void main() {
  group('MIME type', () {
    test('randMimeType returns one MIME type by default', () {
      expect(randMimeType().single, matches(mime));
    });

    test('returns exactly `count` types', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randMimeType(count: count), hasLength(count));
      }

      expect(randMimeType(count: -3), isEmpty);
      expect(randMimeType(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every type is one an extension carries, listed once with all of its extensions', () {
      final carried = {for (final entry in fileExtensions) entry.mimeType};

      expect(mimeTypeEntries, hasLength(carried.length));

      for (final entry in mimeTypeEntries) {
        final mine = fileExtensions.where((each) => each.mimeType == entry.mimeType);

        expect(entry.extensions, [for (final each in mine) each.name]);
        expect(entry.weight, mine.map((each) => each.weight).reduce((a, b) => a > b ? a : b));
      }
    });

    test('the detail splits the type at its slash and lists its extensions', () {
      for (final detail in randMimeTypeDetails(count: sample * 5)) {
        expect(detail.mimeType, matches(mime));
        expect(detail.mimeType, '${detail.type.name}/${detail.subtype}');
        expect(detail.extensions, isNotEmpty);

        for (final name in detail.extensions) {
          expect(
            fileExtensions.firstWhere((entry) => entry.name == name).mimeType,
            detail.mimeType,
          );
        }
      }
    });

    test('type keeps to the top-level types named', () {
      for (final type in MimeTopLevel.values) {
        expect(
          randMimeType(
            type: {type},
            count: sample,
          ).every((each) => each.startsWith('${type.name}/')),
          isTrue,
          reason: type.name,
        );
      }
    });

    test('a type shared by many extensions is no more common than its commonest one', () {
      final types = randMimeType(count: large);
      double share(String mimeType) =>
          types.where((each) => each == mimeType).length / types.length;

      expect(share('text/plain'), lessThan(0.06));
      expect(share('application/pdf'), greaterThan(share('application/vnd.wordperfect')));
    });

    test('an extension carries the MIME type its format is served as', () {
      String mimeOf(String name) => fileExtensions.firstWhere((each) => each.name == name).mimeType;

      expect(mimeOf('pdf'), 'application/pdf');
      expect(mimeOf('jpg'), mimeOf('jpeg'));
      expect(mimeOf('ts'), 'text/plain');
      expect(randFileExtensionDetails().first.mimeType, matches(mime));
    });

    test('unique never repeats a type', () {
      final found = randMimeType(type: {MimeTopLevel.image}, unique: true, count: 100);

      expect(found.toSet(), hasLength(found.length));
      expect(found.length, greaterThan(5));
    });
  });
}
