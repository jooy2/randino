import 'package:randino/src/internal/parse.dart';
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

/// How a language names the parts of a date that a format writes as words.
/// Internal.
class DateNames {
  /// Creates a language's names.
  const DateNames({
    required this.months,
    required this.monthsShort,
    required this.weekdays,
    required this.weekdaysShort,
    required this.meridiem,
    required this.meridiemLower,
  });

  /// `MMMM`, January first.
  final List<String> months;

  /// `MMM`.
  final List<String> monthsShort;

  /// `dddd`, Monday first, the way ISO 8601 counts a week.
  final List<String> weekdays;

  /// `ddd`.
  final List<String> weekdaysShort;

  /// `A`, before noon and after it.
  final List<String> meridiem;

  /// `a`. The same as [meridiem] in a language that has no case.
  final List<String> meridiemLower;
}

/// Every word language's names for the parts of a date. Internal.
///
/// Each is written the way the language writes it inside a date rather than on
/// its own: Spanish and Italian months in lower case, Russian ones in the
/// genitive (`5 марта`), and a Vietnamese month as `tháng 3`. Ported from the
/// JavaScript package's `date/data/index.ts`.
final Map<WordLanguage, DateNames> dateNames = <WordLanguage, DateNames>{
  WordLanguage.en: DateNames(
    months: words(
      'January February March April May June July August September October November December',
    ),
    monthsShort: words('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'),
    weekdays: words('Monday Tuesday Wednesday Thursday Friday Saturday Sunday'),
    weekdaysShort: words('Mon Tue Wed Thu Fri Sat Sun'),
    meridiem: words('AM PM'),
    meridiemLower: words('am pm'),
  ),
  WordLanguage.ko: DateNames(
    months: words('1월 2월 3월 4월 5월 6월 7월 8월 9월 10월 11월 12월'),
    monthsShort: words('1월 2월 3월 4월 5월 6월 7월 8월 9월 10월 11월 12월'),
    weekdays: words('월요일 화요일 수요일 목요일 금요일 토요일 일요일'),
    weekdaysShort: words('월 화 수 목 금 토 일'),
    meridiem: words('오전 오후'),
    meridiemLower: words('오전 오후'),
  ),
  WordLanguage.ja: DateNames(
    months: words('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月'),
    monthsShort: words('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月'),
    weekdays: words('月曜日 火曜日 水曜日 木曜日 金曜日 土曜日 日曜日'),
    weekdaysShort: words('月 火 水 木 金 土 日'),
    meridiem: words('午前 午後'),
    meridiemLower: words('午前 午後'),
  ),
  WordLanguage.zh: DateNames(
    months: words('一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月'),
    monthsShort: words('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月'),
    weekdays: words('星期一 星期二 星期三 星期四 星期五 星期六 星期日'),
    weekdaysShort: words('周一 周二 周三 周四 周五 周六 周日'),
    meridiem: words('上午 下午'),
    meridiemLower: words('上午 下午'),
  ),
  WordLanguage.vi: DateNames(
    months: words(
      'tháng_1 tháng_2 tháng_3 tháng_4 tháng_5 tháng_6 tháng_7 tháng_8 tháng_9 tháng_10 tháng_11 tháng_12',
    ),
    monthsShort: words(
      'thg_1 thg_2 thg_3 thg_4 thg_5 thg_6 thg_7 thg_8 thg_9 thg_10 thg_11 thg_12',
    ),
    weekdays: words('Thứ_Hai Thứ_Ba Thứ_Tư Thứ_Năm Thứ_Sáu Thứ_Bảy Chủ_Nhật'),
    weekdaysShort: words('T2 T3 T4 T5 T6 T7 CN'),
    meridiem: words('SA CH'),
    meridiemLower: words('SA CH'),
  ),
  WordLanguage.es: DateNames(
    months: words(
      'enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre',
    ),
    monthsShort: words('ene feb mar abr may jun jul ago sept oct nov dic'),
    weekdays: words('lunes martes miércoles jueves viernes sábado domingo'),
    weekdaysShort: words('lun mar mié jue vie sáb dom'),
    meridiem: words('a._m. p._m.'),
    meridiemLower: words('a._m. p._m.'),
  ),
  WordLanguage.it: DateNames(
    months: words(
      'gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre',
    ),
    monthsShort: words('gen feb mar apr mag giu lug ago set ott nov dic'),
    weekdays: words('lunedì martedì mercoledì giovedì venerdì sabato domenica'),
    weekdaysShort: words('lun mar mer gio ven sab dom'),
    meridiem: words('AM PM'),
    meridiemLower: words('am pm'),
  ),
  WordLanguage.de: DateNames(
    months: words(
      'Januar Februar März April Mai Juni Juli August September Oktober November Dezember',
    ),
    monthsShort: words('Jan. Feb. März Apr. Mai Juni Juli Aug. Sept. Okt. Nov. Dez.'),
    weekdays: words('Montag Dienstag Mittwoch Donnerstag Freitag Samstag Sonntag'),
    weekdaysShort: words('Mo. Di. Mi. Do. Fr. Sa. So.'),
    meridiem: words('AM PM'),
    meridiemLower: words('am pm'),
  ),
  WordLanguage.ru: DateNames(
    months: words(
      'января февраля марта апреля мая июня июля августа сентября октября ноября декабря',
    ),
    monthsShort: words('янв. февр. мар. апр. мая июн. июл. авг. сент. окт. нояб. дек.'),
    weekdays: words('понедельник вторник среда четверг пятница суббота воскресенье'),
    weekdaysShort: words('пн вт ср чт пт сб вс'),
    meridiem: words('AM PM'),
    meridiemLower: words('am pm'),
  ),
};
