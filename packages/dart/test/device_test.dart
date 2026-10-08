import 'dart:math';

import 'package:randino/randino.dart';
// Internal, but they are what a result is checked against.
import 'package:randino/src/device/data/index.dart';
import 'package:randino/src/device/device_generator.dart';
import 'package:test/test.dart';

const int sample = 60;

void main() {
  group('Device', () {
    test('randDevice returns one device by default', () {
      expect(randDevice(), hasLength(1));
    });

    test('returns exactly `count` devices', () {
      for (final count in <int>[0, 1, 7, 25]) {
        expect(randDevice(count: count), hasLength(count));
      }

      expect(randDevice(count: -3), isEmpty);
      expect(randDevice(count: randCountMax + 5), hasLength(randCountMax));
    });

    test('every device in the catalog is well formed', () {
      final seen = <String>{};

      for (final entry in devices) {
        final key = '${entry.vendor} ${entry.model}';

        expect(seen.add(key), isTrue, reason: '$key is listed twice');
        expect(entry.year, inInclusiveRange(2007, 2025), reason: key);
        expect(entry.vendor, isNotEmpty, reason: key);
        expect(entry.model, entry.model.trim(), reason: key);
      }

      for (final type in DeviceType.values) {
        expect(
          devices.where((entry) => entry.type == type).length,
          greaterThanOrEqualTo(40),
          reason: type.name,
        );
      }
    });

    test('every device is one the catalog holds, written as its detail says', () {
      for (final detail in randDeviceDetails(count: sample * 5)) {
        final entry = devices.firstWhere(
          (each) => each.vendor == detail.vendor && each.model == detail.model,
        );

        expect(detail.device, writeDevice(entry, true));
        expect(detail.type, entry.type);
        expect(detail.year, entry.year);
      }
    });

    test('the maker is written once, and left out when asked', () {
      for (final detail in randDeviceDetails(count: sample * 5)) {
        expect(detail.device, startsWith(detail.vendor));
        expect(detail.device.startsWith('${detail.vendor} ${detail.vendor}'), isFalse);
      }

      for (final detail in randDeviceDetails(includeVendor: false, count: sample * 5)) {
        expect(detail.device, detail.model);
      }

      // A model that opens on its maker's name is the same either way.
      final xiaomi = devices.firstWhere((entry) => entry.model == 'Xiaomi 14');

      expect(writeDevice(xiaomi, true), 'Xiaomi 14');
      expect(writeDevice(xiaomi, false), 'Xiaomi 14');
    });

    test('type keeps to one kind of device, or to the kinds named', () {
      for (final type in DeviceType.values) {
        expect(
          randDeviceDetails(type: {type}, count: sample).every((each) => each.type == type),
          isTrue,
        );
      }

      expect(
        {
          for (final detail in randDeviceDetails(
            type: {DeviceType.phone, DeviceType.tablet},
            count: sample * 3,
          ))
            detail.type,
        },
        {DeviceType.phone, DeviceType.tablet},
      );

      expect({
        for (final detail in randDeviceDetails(count: sample * 5)) detail.type,
      }, hasLength(DeviceType.values.length));
    });

    test('a year range keeps to the devices released in it', () {
      for (final detail in randDeviceDetails(minYear: 2015, maxYear: 2018, count: sample * 3)) {
        expect(detail.year, inInclusiveRange(2015, 2018), reason: detail.device);
      }

      final asOf = randDevice(
        type: {DeviceType.phone},
        maxYear: 2010,
        unique: true,
        count: 100,
        includeVendor: false,
      );

      expect(asOf, contains('iPhone'));
      expect(asOf, isNot(contains('iPhone 4S')));
    });

    test('a year range nothing came out in answers with nothing', () {
      expect(randDevice(maxYear: 2000, count: 5), isEmpty);
      expect(randDevice(minYear: 2030, count: 5), isEmpty);
      // The first laptop in the catalog is the 2008 MacBook Air.
      expect(randDevice(type: {DeviceType.laptop}, maxYear: 2007), isEmpty);
    });

    test('a year range the wrong way round keeps maxYear', () {
      for (final detail in randDeviceDetails(minYear: 2024, maxYear: 2016, count: sample)) {
        expect(detail.year, 2016, reason: detail.device);
      }
    });

    test('the value form is the device of each detail', () {
      expect(randDevice(count: sample, random: Random(7)), <String>[
        for (final detail in randDeviceDetails(count: sample, random: Random(7))) detail.device,
      ]);
    });

    test('unique never repeats a device, and stops when the devices run out', () {
      final expected = {
        for (final entry in devices)
          if (entry.type == DeviceType.laptop && entry.year == 2025) writeDevice(entry, true),
      };
      final found = randDevice(type: {DeviceType.laptop}, minYear: 2025, unique: true, count: 100);

      expect(found.toSet(), hasLength(found.length));
      expect(found.toSet(), expected);
    });
  });
}
