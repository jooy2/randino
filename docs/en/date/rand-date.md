# randDate

Generates dates and returns `count` of them, each drawn evenly from a range and written out in UTC. The default range is the years 1900 to 2099, and the default [format](#formats) is ISO 8601. With [`unit`](#units) it returns one part of each date as a number instead, from the year down to the millisecond, and with [`output: 'detail'`](#the-detail-output) it returns every part at once.

The numbers in a date need no language. The month and weekday names a [format](#formats) can ask for do, so [`language`](#names) says which one writes them, English unless you name another.

::: lang js

```javascript
import { randDate } from 'randino';

randDate();
// ['1987-06-21T08:14:51.302Z']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randDate();
// [1987-06-21T08:14:51.302Z]
```

:::

::: lang py

```python
from randino import rand_date

rand_date()
# ['1987-06-21T08:14:51.302Z']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| <Lang js="minDate" dart="minDate" py="min_date" code /> | <Lang js="DateInput" dart="DateTime?" py="DateInput &#124; None" code /> | `1900-01-01` | The earliest date to return. See [the range](#the-range). |
| <Lang js="maxDate" dart="maxDate" py="max_date" code /> | <Lang js="DateInput" dart="DateTime?" py="DateInput &#124; None" code /> | `2099-12-31` | The latest date to return, up to the last millisecond of that day. See [the range](#the-range). |
| `format` | <Lang js="string" dart="String" py="str" code /> | `YYYY-MM-DDTHH:mm:ss.SSSZ` | How each date is written. See [formats](#formats). |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'en'" dart="WordLanguage.en" py="&quot;en&quot;" code /> | The language month names, weekday names and `AM` / `PM` are written in. See [names](#names). |
| `unit` | <Lang js="DateUnit" py="DateUnit &#124; None" code /> | <Lang js="—" py="None" code /> | Return one part of each date as a number. Dart spells this as a function of its own — see [units](#units). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many dates to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same result twice: the same written date, or the same part when <Lang js="unit" dart="randDateUnit" py="unit" code /> names one. Returns fewer than `count` once the range runs out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, numbers with `unit`, or a `DateDetail` per date. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## The range {#the-range}

Every millisecond from <Lang js="minDate" dart="minDate" py="min_date" code /> to <Lang js="maxDate" dart="maxDate" py="max_date" code /> is as likely as any other, both ends included.

::: lang js

A bound is a string, a `Date` or a number of milliseconds since `1970-01-01T00:00:00.000Z`. A string is ISO 8601, from a year on its own down to the millisecond, and it **names a span** rather than an instant: `'2024'` is the whole year and `'2024-03-15'` the whole day. The range starts at the first millisecond of <Lang js="minDate" dart="minDate" py="min_date" code /> and ends at the last millisecond of <Lang js="maxDate" dart="maxDate" py="max_date" code />, so `maxDate: '2024-12-31'` reaches the evening of New Year's Eve rather than stopping at its first minute.

```javascript
randDate({ minDate: '2024-01-01', maxDate: '2024-12-31', format: 'YYYY-MM-DD', count: 3 });
// ['2024-07-09', '2024-02-27', '2024-11-30']

randDate({ minDate: '2024-03', maxDate: '2024-03', count: 2 });
// ['2024-03-18T22:41:06.517Z', '2024-03-02T09:13:45.090Z']

randDate({ minDate: '2024-03-15T09:00', maxDate: '2024-03-15T17:59', format: 'HH:mm' });
// ['13:27']
```

A string is UTC unless it carries an offset: `'2024-03-15T09:00+09:00'` is nine in the morning in Seoul, which is midnight in UTC. A `Date` and a number are the instant they hold, with no span around it, so `maxDate: new Date()` stops at the moment of the call. `new Date(2024, 0, 1)` is midnight in the machine's own time zone, which is a different instant on every machine; write `'2024-01-01'` for the calendar day.

A string that is not a date — `'2024-02-30'`, `'tomorrow'` — and an invalid `Date` are read as though the bound were left out.

:::

::: lang dart

A bound is a `DateTime`, and it is the instant it holds, local or UTC. `DateTime.utc(2024, 12, 31)` as <Lang js="maxDate" dart="maxDate" py="max_date" code /> stops at that midnight, so write the last millisecond to take the whole day in:

```dart
randDate(
  minDate: DateTime.utc(2024),
  maxDate: DateTime.utc(2024, 12, 31, 23, 59, 59, 999),
  format: 'YYYY-MM-DD',
  count: 3,
);
// [2024-07-09, 2024-02-27, 2024-11-30]

randDate(minDate: DateTime.utc(2024, 3, 15, 9), maxDate: DateTime.utc(2024, 3, 15, 17, 59), format: 'HH:mm');
// [13:27]
```

`DateTime(2024)` is midnight in the machine's own time zone, which is a different instant on every machine; write `DateTime.utc(2024)` for the calendar day. `maxDate: DateTime.now()` stops at the moment of the call.

:::

::: lang py

A bound is a string, a `datetime` or a `date`. A string is ISO 8601, from a year on its own down to the millisecond, and it **names a span** rather than an instant: `"2024"` is the whole year and `"2024-03-15"` the whole day. The range starts at the first millisecond of <Lang js="minDate" dart="minDate" py="min_date" code /> and ends at the last millisecond of <Lang js="maxDate" dart="maxDate" py="max_date" code />, so `max_date="2024-12-31"` reaches the evening of New Year's Eve rather than stopping at its first minute. A `date` is the same whole day in UTC.

```python
rand_date(min_date="2024-01-01", max_date="2024-12-31", format="YYYY-MM-DD", count=3)
# ['2024-07-09', '2024-02-27', '2024-11-30']

rand_date(min_date="2024-03", max_date="2024-03", count=2)
# ['2024-03-18T22:41:06.517Z', '2024-03-02T09:13:45.090Z']

rand_date(min_date="2024-03-15T09:00", max_date="2024-03-15T17:59", format="HH:mm")
# ['13:27']
```

A string is UTC unless it carries an offset: `"2024-03-15T09:00+09:00"` is nine in the morning in Seoul, which is midnight in UTC. A `datetime` is the instant it holds: an aware one in its own zone, and a naive one in the machine's, the way `datetime.timestamp` reads it, so `max_date=datetime.now()` stops at the moment of the call.

A string that is not a date — `"2024-02-30"`, `"tomorrow"` — is read as though the bound were left out.

:::

Left out, <Lang js="minDate" dart="minDate" py="min_date" code /> is `1900-01-01` and <Lang js="maxDate" dart="maxDate" py="max_date" code /> the end of `2099-12-31`. A bound left out never contradicts the one you wrote: <Lang js="minDate" dart="minDate" py="min_date" code /> alone past 2099 moves the end to the year 9999, and <Lang js="maxDate" dart="maxDate" py="max_date" code /> alone before 1900 moves the start to the year 1. The defaults are fixed dates rather than a span around today, so a seeded `random` returns the same dates on every run.

Every range is held inside the years 1 to 9999, which is what a year of four digits can hold. A range the wrong way round keeps <Lang js="maxDate" dart="maxDate" py="max_date" code />, the bound a caller is usually holding to, the same way the length options of the other generators keep their maximum.

## Formats {#formats}

`format` writes each date. The tokens below are replaced by a part of the date, text inside `[` and `]` is written as it is, and everything else is written as it is too.

| Token  | Writes                        | Example   |
| ------ | ----------------------------- | --------- |
| `YYYY` | The year, four digits         | `2024`    |
| `YY`   | The year, two digits          | `24`      |
| `MMMM` | The month's name              | `March`   |
| `MMM`  | The month's short name        | `Mar`     |
| `MM`   | The month, two digits         | `03`      |
| `M`    | The month                     | `3`       |
| `DD`   | The day, two digits           | `05`      |
| `D`    | The day                       | `5`       |
| `dddd` | The day of the week's name    | `Tuesday` |
| `ddd`  | Its short name                | `Tue`     |
| `HH`   | The hour, 00 to 23            | `19`      |
| `H`    | The hour, 0 to 23             | `19`      |
| `hh`   | The hour, 01 to 12            | `07`      |
| `h`    | The hour, 1 to 12             | `7`       |
| `mm`   | The minute, two digits        | `08`      |
| `m`    | The minute                    | `8`       |
| `ss`   | The second, two digits        | `09`      |
| `s`    | The second                    | `9`       |
| `SSS`  | The millisecond, three digits | `045`     |
| `A`    | Before or after noon          | `PM`      |
| `a`    | The same, in lower case       | `pm`      |

The default, `YYYY-MM-DDTHH:mm:ss.SSSZ`, is ISO 8601 in UTC: neither `T` nor `Z` is a token, so both are written as they are.

::: lang js

```javascript
randDate({ format: 'YYYY-MM-DD HH:mm:ss' }); // ['1958-11-27 06:02:41']
randDate({ format: 'YYYY년 M월 D일' }); // ['2031년 3월 4일']
randDate({ format: 'MM/DD/YYYY hh:mm A' }); // ['08/14/1993 04:26 PM']
randDate({ format: '[Week of] YYYY-MM-DD' }); // ['Week of 2012-05-19']
```

:::

::: lang dart

```dart
randDate(format: 'YYYY-MM-DD HH:mm:ss'); // [1958-11-27 06:02:41]
randDate(format: 'YYYY년 M월 D일'); // [2031년 3월 4일]
randDate(format: 'MM/DD/YYYY hh:mm A'); // [08/14/1993 04:26 PM]
randDate(format: '[Week of] YYYY-MM-DD'); // [Week of 2012-05-19]
```

:::

::: lang py

```python
rand_date(format="YYYY-MM-DD HH:mm:ss")  # ['1958-11-27 06:02:41']
rand_date(format="YYYY년 M월 D일")  # ['2031년 3월 4일']
rand_date(format="MM/DD/YYYY hh:mm A")  # ['08/14/1993 04:26 PM']
rand_date(format="[Week of] YYYY-MM-DD")  # ['Week of 2012-05-19']
```

:::

A letter that is a token is replaced wherever it stands, so `Day` outside brackets comes out as `5amy`: both `D` and `a` are tokens. Put any word in brackets. A format that writes nothing at all, `''`, is read as the default.

## Names in nine languages {#names}

`MMMM`, `MMM`, `dddd`, `ddd`, `A` and `a` write words rather than numbers, and `language` says which language writes them. It is one of the nine the word pools cover, and English when left out: a format is written in one language, so the names keep to one rather than mixing nine into it. <Lang js="'all'" dart="A null language" py="&quot;all&quot;" code /> picks one per date, which is what the detail's `language` reports.

| Language | `MMMM`  | `MMM` | `dddd`  | `ddd` | `A`   |
| -------- | ------- | ----- | ------- | ----- | ----- |
| `en`     | March   | Mar   | Friday  | Fri   | PM    |
| `ko`     | 3월     | 3월   | 금요일  | 금    | 오후  |
| `ja`     | 3月     | 3月   | 金曜日  | 金    | 午後  |
| `zh`     | 三月    | 3月   | 星期五  | 周五  | 下午  |
| `vi`     | tháng 3 | thg 3 | Thứ Sáu | T6    | CH    |
| `es`     | marzo   | mar   | viernes | vie   | p. m. |
| `it`     | marzo   | mar   | venerdì | ven   | PM    |
| `de`     | März    | März  | Freitag | Fr.   | PM    |
| `ru`     | марта   | мар.  | пятница | пт    | PM    |

Each name is the form the language writes inside a date. Spanish and Italian months are in lower case, Russian months are in the genitive (`14 августа`, not `август`), and a Vietnamese month is `tháng 3`. The languages that keep to a 24-hour clock in writing still have `AM` and `PM` for a format that asks for them.

::: lang js

```javascript
randDate({ format: 'dddd, MMMM D, YYYY' }); // ['Saturday, May 19, 2012']
randDate({ format: 'YYYY년 M월 D일 dddd A h:mm', language: 'ko' }); // ['2031년 3월 4일 화요일 오후 7:40']
randDate({ format: 'YYYY年M月D日(ddd)', language: 'ja' }); // ['1993年8月14日(土)']
randDate({ format: 'D MMMM YYYY', language: 'ru' }); // ['14 августа 1993']
randDate({ format: 'dddd, D. MMMM YYYY', language: 'de' }); // ['Samstag, 14. August 1993']
```

:::

::: lang dart

```dart
randDate(format: 'dddd, MMMM D, YYYY'); // [Saturday, May 19, 2012]
randDate(format: 'YYYY년 M월 D일 dddd A h:mm', language: WordLanguage.ko); // [2031년 3월 4일 화요일 오후 7:40]
randDate(format: 'YYYY年M月D日(ddd)', language: WordLanguage.ja); // [1993年8月14日(土)]
randDate(format: 'D MMMM YYYY', language: WordLanguage.ru); // [14 августа 1993]
randDate(format: 'dddd, D. MMMM YYYY', language: WordLanguage.de); // [Samstag, 14. August 1993]
```

:::

::: lang py

```python
rand_date(format="dddd, MMMM D, YYYY")  # ['Saturday, May 19, 2012']
rand_date(format="YYYY년 M월 D일 dddd A h:mm", language="ko")  # ['2031년 3월 4일 화요일 오후 7:40']
rand_date(format="YYYY年M月D日(ddd)", language="ja")  # ['1993年8月14日(土)']
rand_date(format="D MMMM YYYY", language="ru")  # ['14 августа 1993']
rand_date(format="dddd, D. MMMM YYYY", language="de")  # ['Samstag, 14. August 1993']
```

:::

## Units {#units}

::: lang js

`unit` returns one part of each date as a number rather than the date written out.

```javascript
randDate({ unit: 'minute', count: 5 }); // [37, 4, 52, 19, 0]
randDate({ unit: 'month', count: 5 }); // [11, 3, 3, 8, 1]
randDate({ unit: 'year', minDate: '2000', maxDate: '2009', count: 3 }); // [2004, 2000, 2007]
```

:::

::: lang dart

`randDateUnit` returns one part of each date as a number rather than the date written out. It is a function of its own because Dart has no way to make one function's return type depend on an argument, and it takes the same parameters as `randDate` but `format`.

```dart
randDateUnit(DateUnit.minute, count: 5); // [37, 4, 52, 19, 0]
randDateUnit(DateUnit.month, count: 5); // [11, 3, 3, 8, 1]
randDateUnit(DateUnit.year, minDate: DateTime.utc(2000), maxDate: DateTime.utc(2009, 12, 31), count: 3); // [2004, 2000, 2007]
```

:::

::: lang py

`unit` returns one part of each date as an `int` rather than the date written out.

```python
rand_date(unit="minute", count=5)  # [37, 4, 52, 19, 0]
rand_date(unit="month", count=5)  # [11, 3, 3, 8, 1]
rand_date(unit="year", min_date="2000", max_date="2009", count=3)  # [2004, 2000, 2007]
```

:::

| Unit          | Values    |
| ------------- | --------- |
| `year`        | 1 to 9999 |
| `month`       | 1 to 12   |
| `day`         | 1 to 31   |
| `hour`        | 0 to 23   |
| `minute`      | 0 to 59   |
| `second`      | 0 to 59   |
| `millisecond` | 0 to 999  |

The part is read off a date drawn from the range, which is what keeps it inside the range: an hour drawn between `09:00` and `17:59` is 9 to 17, and a day drawn from February 2024 is 1 to 29. It is also why the parts of a calendar are not all equally likely: `day` is 31 less often than 1, since only seven months have one, and `month` comes up in proportion to its days, so February is the rarest. The parts of a time of day come up evenly.

`unique` applies to the part, so asking for a hundred unique minutes returns sixty.

## The detail output {#the-detail-output}

::: lang js

```javascript
randDate({ output: 'detail' });
// [{
//   date: '1987-06-21T08:14:51.302Z',
//   timestamp: 551261691302,
//   year: 1987,
//   month: 6,
//   day: 21,
//   hour: 8,
//   minute: 14,
//   second: 51,
//   millisecond: 302,
//   weekday: 7,
//   language: 'en'
// }]
```

`unit` does not change the detail: it is the whole date either way.

:::

::: lang dart

```dart
final detail = randDateDetails().first;

detail.date; // 1987-06-21T08:14:51.302Z
detail.timestamp; // 551261691302
detail[DateUnit.hour]; // 8
detail.weekday; // 7
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randDate`, and `detail[unit]` reads one part by its `DateUnit`.

:::

::: lang py

```python
rand_date(output="detail")
# [DateDetail(date='1987-06-21T08:14:51.302Z', timestamp=551261691302, year=1987,
#             month=6, day=21, hour=8, minute=14, second=51, millisecond=302,
#             weekday=7, language='en')]
```

`unit` does not change the detail: it is the whole date either way.

:::

| Field | Type | Description |
| --- | --- | --- |
| `date` | <Lang js="string" dart="String" py="str" code /> | The date as `format` writes it. |
| `timestamp` | <Lang js="number" dart="int" py="int" code /> | Milliseconds since `1970-01-01T00:00:00.000Z`, negative before it. |
| `year`, `month`, `day` | <Lang js="number" dart="int" py="int" code /> | The calendar date, with `month` from 1 to 12. |
| `hour`, `minute`, `second`, `millisecond` | <Lang js="number" dart="int" py="int" code /> | The time of day. |
| `weekday` | <Lang js="number" dart="int" py="int" code /> | The day of the week, `1` for Monday to `7` for Sunday, the way ISO 8601 counts it. |
| `language` | `WordLanguage` | The language the names in `date` are written in. |

<Lang js="new Date(detail.timestamp)" dart="DateTime.fromMillisecondsSinceEpoch(detail.timestamp, isUtc: true)" py="datetime.fromtimestamp(detail.timestamp / 1000, timezone.utc)" code /> turns the detail back into the platform's own date.

## Time zones

Every date is drawn and written in UTC, and every part of the detail is a UTC part. A date drawn in the machine's own zone would come out differently on two machines from the same seed, and an hour skipped by a daylight-saving change would be a date no clock ever showed. To show a date in a zone of your own, pass its timestamp to the platform's own date type and format it there.

## See also

- [`randAge`](../age/rand-age) — an age, where a date of birth is more than you need.
- [`randName`](../name/rand-name) — a name to go with the date.
