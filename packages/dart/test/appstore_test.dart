import 'package:randino/randino.dart';
// Internal, but it is what a result is checked against.
import 'package:randino/src/appstore/data/index.dart';
import 'package:test/test.dart';

const int sample = 60;
const int large = 6000;

void main() {
  group('App store', () {
    test('randAppStore returns one store by default', () {
      final store = randAppStore().single;

      expect(appStores.any((entry) => entry.full == store), isTrue);
    });

    test('returns exactly `count` stores', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randAppStore(count: count), hasLength(count));
      }

      expect(randAppStore(count: -3), isEmpty);
      expect(randAppStore(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every store is listed once, and each platform’s weights add up to a hundred', () {
      final seen = <String>{};

      for (final entry in appStores) {
        final key = '${entry.platform.name} ${entry.name}';

        expect(seen.add(key), isTrue, reason: '$key is listed twice');
        expect(entry.weight, greaterThan(0));
        expect(entry.full, contains(entry.name));
      }

      for (final platform in SystemPlatform.values) {
        expect(
          appStores
              .where((entry) => entry.platform == platform)
              .fold<num>(0, (sum, entry) => sum + entry.weight),
          100,
        );
      }
    });

    test('every store is one the catalog holds, written by its full name or its own', () {
      for (final detail in randAppStoreDetails(count: sample * 5)) {
        final entry = appStores.firstWhere(
          (each) => each.platform == detail.platform && each.name == detail.name,
        );

        expect(detail.store, entry.full);
        expect(detail.company, entry.company);
      }

      for (final detail in randAppStoreDetails(includeCompany: false, count: sample)) {
        expect(detail.store, detail.name);
      }
    });

    test('platform keeps to one kind of machine, and Google Play is never a desktop’s', () {
      for (final platform in SystemPlatform.values) {
        expect(
          randAppStoreDetails(
            platform: platform,
            count: sample,
          ).every((detail) => detail.platform == platform),
          isTrue,
        );
      }

      expect(
        randAppStore(
          platform: SystemPlatform.desktop,
          count: large,
        ).any((store) => store.contains('Google Play')),
        isFalse,
      );

      final details = randAppStoreDetails(count: large);
      final desktop =
          details.where((detail) => detail.platform == SystemPlatform.desktop).length /
          details.length;

      expect(desktop, inExclusiveRange(0.45, 0.55));
    });

    test('the common stores come up most often', () {
      final phones = randAppStore(platform: SystemPlatform.mobile, count: large);
      double share(String store) => phones.where((each) => each == store).length / phones.length;

      expect(share('Google Play Store'), greaterThan(0.38));
      expect(share('Google Play Store'), greaterThan(share('Apple App Store')));
      expect(share('Apple App Store'), greaterThan(share('Samsung Galaxy Store')));
      expect(share('F-Droid'), lessThan(0.03));
    });

    test('unique never repeats a store', () {
      final found = randAppStore(unique: true, count: 100);

      expect(found.toSet(), hasLength(found.length));
      expect(found.length, inInclusiveRange(11, appStores.length));
    });
  });
}
