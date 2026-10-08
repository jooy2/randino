import 'package:randino/src/types.dart';

/// The parts of a date, largest first.
final List<DateUnit> dateUnits = List<DateUnit>.unmodifiable(DateUnit.values);

/// The earliest instant a date may be, `0001-01-01T00:00:00.000Z`, as
/// milliseconds since the epoch. Internal.
///
/// Every package can hold a year of four digits and Python can hold no more, so
/// a range is held inside the years 1 to 9999 rather than inside what Dart's own
/// `DateTime` reaches.
const int dateFloor = -62135596800000;

/// The latest instant a date may be, `9999-12-31T23:59:59.999Z`. Internal.
const int dateCeiling = 253402300799999;

/// Where the range starts when `minDate` is left out, `1900-01-01T00:00:00.000Z`.
/// Internal.
///
/// Written out rather than counted back from today, so that a seeded `random`
/// hands back the same dates on every run.
const int dateMinDefault = -2208988800000;

/// Where the range ends when `maxDate` is left out, `2099-12-31T23:59:59.999Z`.
/// Internal.
const int dateMaxDefault = 4102444799999;

/// ISO 8601 in UTC, the way `DateTime.toIso8601String` writes a UTC date.
/// Internal.
const String dateFormatDefault = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
