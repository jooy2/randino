# randDate

날짜를 만들어 `count`개만큼 돌려줍니다. 각 날짜는 범위 안에서 고르게 뽑고, UTC나 지정한 [오프셋](#time-zones)으로 씁니다. 기본 범위는 1900년부터 2099년까지이고, 기본 [형식](#formats)은 ISO 8601입니다. [`unit`](#units)을 주면 날짜를 쓰는 대신 연도부터 밀리초까지 중 한 단위를 숫자로 돌려주고, [`output: 'detail'`](#the-detail-output)을 주면 모든 단위를 한꺼번에 돌려줍니다.

날짜의 숫자에는 언어가 없습니다. [형식](#formats)이 쓸 수 있는 월과 요일의 이름에는 언어가 있으므로, [`language`](#names)로 어느 언어로 쓸지 정합니다. 따로 정하지 않으면 영어입니다.

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

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| <Lang js="minDate" dart="minDate" py="min_date" code /> | <Lang js="DateInput" dart="DateTime?" py="DateInput &#124; None" code /> | `1900-01-01` | 돌려줄 가장 이른 날짜. [범위](#the-range)를 보세요. |
| <Lang js="maxDate" dart="maxDate" py="max_date" code /> | <Lang js="DateInput" dart="DateTime?" py="DateInput &#124; None" code /> | `2099-12-31` | 돌려줄 가장 늦은 날짜. 그날의 마지막 밀리초까지 포함합니다. [범위](#the-range)를 보세요. |
| `format` | <Lang js="string" dart="String" py="str" code /> | `YYYY-MM-DDTHH:mm:ss.SSSZ` | 날짜를 쓰는 방식. [형식](#formats)을 보세요. |
| <Lang js="utcOffset" dart="utcOffset" py="utc_offset" code /> | <Lang js="string &#124; number" dart="Duration?" py="str &#124; timedelta &#124; None" code /> | UTC | 날짜를 쓸 UTC 기준 오프셋. [UTC 오프셋](#time-zones)을 보세요. |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'en'" dart="WordLanguage.en" py="&quot;en&quot;" code /> | 월 이름, 요일 이름, 오전·오후를 쓸 언어. [이름](#names)을 보세요. |
| `unit` | <Lang js="DateUnit" py="DateUnit &#124; None" code /> | <Lang js="—" py="None" code /> | 날짜마다 한 단위를 숫자로 돌려줍니다. Dart에서는 별도 함수입니다. [단위](#units)를 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 날짜 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 쓴 날짜가 같으면 같은 결과이고, <Lang js="unit" dart="randDateUnit" py="unit" code />으로 단위를 고르면 그 단위의 값이 같을 때 같은 결과입니다. 범위가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, `unit`을 주면 숫자, 또는 날짜마다 `DateDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 범위 {#the-range}

<Lang js="minDate" dart="minDate" py="min_date" code />부터 <Lang js="maxDate" dart="maxDate" py="max_date" code />까지의 모든 밀리초가 같은 확률로 나옵니다. 양 끝도 포함합니다.

::: lang js

경계는 문자열, `Date`, 또는 `1970-01-01T00:00:00.000Z` 이후의 밀리초 수입니다. 문자열은 연도만 쓴 것부터 밀리초까지 쓴 것까지의 ISO 8601이고, 한 순간이 아니라 **구간을 가리킵니다**. `'2024'`는 그해 전체이고 `'2024-03-15'`는 그날 하루 전체입니다. 범위는 <Lang js="minDate" dart="minDate" py="min_date" code /> 구간의 첫 밀리초에서 시작해 <Lang js="maxDate" dart="maxDate" py="max_date" code /> 구간의 마지막 밀리초에서 끝납니다. 그래서 `maxDate: '2024-12-31'`은 그날 0시에서 멈추지 않고 그날 밤까지 이어집니다.

```javascript
randDate({ minDate: '2024-01-01', maxDate: '2024-12-31', format: 'YYYY-MM-DD', count: 3 });
// ['2024-07-09', '2024-02-27', '2024-11-30']

randDate({ minDate: '2024-03', maxDate: '2024-03', count: 2 });
// ['2024-03-18T22:41:06.517Z', '2024-03-02T09:13:45.090Z']

randDate({ minDate: '2024-03-15T09:00', maxDate: '2024-03-15T17:59', format: 'HH:mm' });
// ['13:27']
```

문자열은 [`utcOffset`](#time-zones)으로 읽고, 따로 정하지 않으면 UTC입니다. 자체 오프셋이 붙은 문자열은 그 오프셋으로 읽습니다. `'2024-03-15T09:00+09:00'`은 서울의 오전 9시이고, UTC로는 0시입니다. `Date`와 숫자는 그것이 담은 순간 하나이고 앞뒤로 구간이 없으므로, `maxDate: new Date()`는 호출한 그 순간에서 멈춥니다. `new Date(2024, 0, 1)`은 실행하는 컴퓨터의 시간대로 본 자정이라 컴퓨터마다 다른 순간이 됩니다. 달력의 날짜를 뜻한다면 `'2024-01-01'`로 쓰세요.

날짜가 아닌 문자열(`'2024-02-30'`, `'tomorrow'`)과 유효하지 않은 `Date`는 경계를 생략한 것으로 읽습니다.

:::

::: lang dart

경계는 `DateTime`이고, 로컬이든 UTC든 그것이 담은 순간 하나입니다. `DateTime.utc(2024, 12, 31)`을 <Lang js="maxDate" dart="maxDate" py="max_date" code />로 주면 그날 0시에서 멈추므로, 하루 전체를 넣으려면 마지막 밀리초까지 씁니다.

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

`DateTime(2024)`는 실행하는 컴퓨터의 시간대로 본 자정이라 컴퓨터마다 다른 순간이 됩니다. 달력의 날짜를 뜻한다면 `DateTime.utc(2024)`로 쓰세요. `maxDate: DateTime.now()`는 호출한 그 순간에서 멈춥니다.

:::

::: lang py

경계는 문자열, `datetime`, `date`입니다. 문자열은 연도만 쓴 것부터 밀리초까지 쓴 것까지의 ISO 8601이고, 한 순간이 아니라 **구간을 가리킵니다**. `"2024"`는 그해 전체이고 `"2024-03-15"`는 그날 하루 전체입니다. 범위는 <Lang js="minDate" dart="minDate" py="min_date" code /> 구간의 첫 밀리초에서 시작해 <Lang js="maxDate" dart="maxDate" py="max_date" code /> 구간의 마지막 밀리초에서 끝납니다. 그래서 `max_date="2024-12-31"`은 그날 0시에서 멈추지 않고 그날 밤까지 이어집니다. `date`도 문자열처럼 [`utc_offset`](#time-zones)으로 본 그날 하루 전체입니다.

```python
rand_date(min_date="2024-01-01", max_date="2024-12-31", format="YYYY-MM-DD", count=3)
# ['2024-07-09', '2024-02-27', '2024-11-30']

rand_date(min_date="2024-03", max_date="2024-03", count=2)
# ['2024-03-18T22:41:06.517Z', '2024-03-02T09:13:45.090Z']

rand_date(min_date="2024-03-15T09:00", max_date="2024-03-15T17:59", format="HH:mm")
# ['13:27']
```

문자열은 [`utc_offset`](#time-zones)으로 읽고, 따로 정하지 않으면 UTC입니다. 자체 오프셋이 붙은 문자열은 그 오프셋으로 읽습니다. `"2024-03-15T09:00+09:00"`은 서울의 오전 9시이고, UTC로는 0시입니다. `datetime`은 그것이 담은 순간입니다. 시간대가 있는 값은 그 시간대로, 시간대가 없는 값은 `datetime.timestamp`처럼 실행하는 컴퓨터의 시간대로 읽으므로, `max_date=datetime.now()`는 호출한 그 순간에서 멈춥니다.

날짜가 아닌 문자열(`"2024-02-30"`, `"tomorrow"`)은 경계를 생략한 것으로 읽습니다.

:::

생략하면 <Lang js="minDate" dart="minDate" py="min_date" code />는 `1900-01-01`이고 <Lang js="maxDate" dart="maxDate" py="max_date" code />는 `2099-12-31`이 끝나는 순간입니다. 생략한 경계는 직접 쓴 경계와 부딪히지 않습니다. 2099년보다 늦은 <Lang js="minDate" dart="minDate" py="min_date" code />만 주면 끝이 9999년으로 바뀌고, 1900년보다 이른 <Lang js="maxDate" dart="maxDate" py="max_date" code />만 주면 시작이 1년으로 바뀝니다. 기본값은 오늘을 기준으로 잡은 구간이 아니라 고정된 날짜이므로, 시드를 정한 `random`은 실행할 때마다 같은 날짜를 돌려줍니다.

모든 범위는 네 자리 연도로 쓸 수 있는 1년부터 9999년 사이로 제한됩니다. 범위를 거꾸로 주면 <Lang js="maxDate" dart="maxDate" py="max_date" code />를 지킵니다. 다른 생성 함수의 길이 옵션이 최댓값을 지키는 것과 같은 이유로, 호출하는 쪽이 보통 붙들고 있는 쪽이 최댓값이기 때문입니다.

## 형식 {#formats}

`format`은 날짜를 쓰는 방식입니다. 아래 토큰은 날짜의 한 부분으로 바뀌고, `[`와 `]` 사이의 글자는 그대로 쓰며, 나머지 글자도 그대로 씁니다.

| 토큰   | 쓰는 값           | 예        |
| ------ | ----------------- | --------- |
| `YYYY` | 연도, 네 자리     | `2024`    |
| `YY`   | 연도, 두 자리     | `24`      |
| `MMMM` | 월 이름           | `March`   |
| `MMM`  | 짧은 월 이름      | `Mar`     |
| `MM`   | 월, 두 자리       | `03`      |
| `M`    | 월                | `3`       |
| `DD`   | 일, 두 자리       | `05`      |
| `D`    | 일                | `5`       |
| `dddd` | 요일 이름         | `Tuesday` |
| `ddd`  | 짧은 요일 이름    | `Tue`     |
| `HH`   | 시, 00~23         | `19`      |
| `H`    | 시, 0~23          | `19`      |
| `hh`   | 시, 01~12         | `07`      |
| `h`    | 시, 1~12          | `7`       |
| `mm`   | 분, 두 자리       | `08`      |
| `m`    | 분                | `8`       |
| `ss`   | 초, 두 자리       | `09`      |
| `s`    | 초                | `9`       |
| `SSS`  | 밀리초, 세 자리   | `045`     |
| `A`    | 오전 또는 오후    | `PM`      |
| `a`    | 같은 것, 소문자   | `pm`      |
| `Z`    | 오프셋, UTC는 `Z` | `+09:00`  |
| `ZZ`   | 콜론 없는 오프셋  | `+0900`   |

기본값 `YYYY-MM-DDTHH:mm:ss.SSSZ`는 ISO 8601입니다. `T`는 토큰이 아니어서 그대로 쓰이고, `Z`는 ISO 8601처럼 UTC에서는 `Z`를, 그 밖에서는 오프셋을 씁니다.

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

토큰인 글자는 어디에 있든 바뀝니다. 대괄호 밖의 `Day`는 `D`와 `a`가 모두 토큰이라 `5amy`가 됩니다. 영어 단어는 대괄호로 감싸세요. 한글은 토큰이 아니므로 그대로 써도 됩니다. 아무것도 쓰지 않는 형식 `''`는 기본값으로 읽습니다.

## 9개 언어의 이름 {#names}

`MMMM`, `MMM`, `dddd`, `ddd`, `A`, `a`는 숫자가 아니라 낱말을 쓰고, 어느 언어의 낱말인지는 `language`가 정합니다. 단어 풀이 다루는 9개 언어 중 하나이고, 생략하면 영어입니다. 형식은 한 언어로 쓰는 것이므로, 이름도 9개 언어를 섞지 않고 한 언어를 따릅니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />을 주면 날짜마다 언어를 하나씩 고르고, 상세 출력의 `language`가 어느 언어였는지 알려 줍니다.

| 언어 | `MMMM`  | `MMM` | `dddd`  | `ddd` | `A`   |
| ---- | ------- | ----- | ------- | ----- | ----- |
| `en` | March   | Mar   | Friday  | Fri   | PM    |
| `ko` | 3월     | 3월   | 금요일  | 금    | 오후  |
| `ja` | 3月     | 3月   | 金曜日  | 金    | 午後  |
| `zh` | 三月    | 3月   | 星期五  | 周五  | 下午  |
| `vi` | tháng 3 | thg 3 | Thứ Sáu | T6    | CH    |
| `es` | marzo   | mar   | viernes | vie   | p. m. |
| `it` | marzo   | mar   | venerdì | ven   | PM    |
| `de` | März    | März  | Freitag | Fr.   | PM    |
| `ru` | марта   | мар.  | пятница | пт    | PM    |

각 이름은 그 언어가 날짜 안에서 쓰는 형태입니다. 스페인어와 이탈리아어의 월은 소문자로 쓰고, 러시아어의 월은 생격으로 씁니다(`август`가 아니라 `14 августа`). 베트남어의 월은 `tháng 3`입니다. 글에서 24시간제를 쓰는 언어도 형식이 요구하면 `AM`과 `PM`을 씁니다.

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

## 단위 {#units}

::: lang js

`unit`을 주면 날짜를 쓰는 대신 날짜마다 한 단위를 숫자로 돌려줍니다.

```javascript
randDate({ unit: 'minute', count: 5 }); // [37, 4, 52, 19, 0]
randDate({ unit: 'month', count: 5 }); // [11, 3, 3, 8, 1]
randDate({ unit: 'year', minDate: '2000', maxDate: '2009', count: 3 }); // [2004, 2000, 2007]
```

:::

::: lang dart

`randDateUnit`은 날짜를 쓰는 대신 날짜마다 한 단위를 숫자로 돌려줍니다. Dart에서는 인자에 따라 한 함수의 반환 타입을 바꿀 수 없어서 별도 함수이고, `format`을 뺀 나머지는 `randDate`와 같은 매개변수를 받습니다.

```dart
randDateUnit(DateUnit.minute, count: 5); // [37, 4, 52, 19, 0]
randDateUnit(DateUnit.month, count: 5); // [11, 3, 3, 8, 1]
randDateUnit(DateUnit.year, minDate: DateTime.utc(2000), maxDate: DateTime.utc(2009, 12, 31), count: 3); // [2004, 2000, 2007]
```

:::

::: lang py

`unit`을 주면 날짜를 쓰는 대신 날짜마다 한 단위를 `int`로 돌려줍니다.

```python
rand_date(unit="minute", count=5)  # [37, 4, 52, 19, 0]
rand_date(unit="month", count=5)  # [11, 3, 3, 8, 1]
rand_date(unit="year", min_date="2000", max_date="2009", count=3)  # [2004, 2000, 2007]
```

:::

| 단위          | 값     |
| ------------- | ------ |
| `year`        | 1~9999 |
| `month`       | 1~12   |
| `day`         | 1~31   |
| `hour`        | 0~23   |
| `minute`      | 0~59   |
| `second`      | 0~59   |
| `millisecond` | 0~999  |

단위는 범위에서 뽑은 날짜에서 읽어 냅니다. 그래서 범위를 벗어나지 않습니다. `09:00`부터 `17:59` 사이에서 뽑은 시는 9~~17이고, 2024년 2월에서 뽑은 일은 1~~29입니다. 같은 이유로 달력의 단위는 확률이 고르지 않습니다. 31일이 있는 달은 일곱 개뿐이라 `day`의 31은 1보다 드물게 나오고, `month`는 그달의 날수에 비례해 나와서 2월이 가장 드뭅니다. 하루의 시각을 이루는 단위는 고르게 나옵니다.

`unique`는 단위의 값에 적용되므로, 서로 다른 분을 100개 달라고 하면 60개가 돌아옵니다.

## 상세 출력 {#the-detail-output}

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

`unit`은 상세 출력을 바꾸지 않습니다. 어느 쪽이든 날짜 전체가 돌아옵니다.

:::

::: lang dart

```dart
final detail = randDateDetails().first;

detail.date; // 1987-06-21T08:14:51.302Z
detail.timestamp; // 551261691302
detail[DateUnit.hour]; // 8
detail.weekday; // 7
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randDate`와 같은 매개변수를 받고, `detail[unit]`으로 `DateUnit`에 해당하는 단위 하나를 읽습니다.

:::

::: lang py

```python
rand_date(output="detail")
# [DateDetail(date='1987-06-21T08:14:51.302Z', timestamp=551261691302, year=1987,
#             month=6, day=21, hour=8, minute=14, second=51, millisecond=302,
#             weekday=7, language='en')]
```

`unit`은 상세 출력을 바꾸지 않습니다. 어느 쪽이든 날짜 전체가 돌아옵니다.

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `date` | <Lang js="string" dart="String" py="str" code /> | `format`으로 쓴 날짜. |
| `timestamp` | <Lang js="number" dart="int" py="int" code /> | `1970-01-01T00:00:00.000Z` 이후의 밀리초. 그 이전은 음수입니다. |
| `year`, `month`, `day` | <Lang js="number" dart="int" py="int" code /> | 달력의 날짜. `month`는 1~12입니다. |
| `hour`, `minute`, `second`, `millisecond` | <Lang js="number" dart="int" py="int" code /> | 하루의 시각. |
| `weekday` | <Lang js="number" dart="int" py="int" code /> | 요일. ISO 8601처럼 월요일 `1`부터 일요일 `7`까지 셉니다. |
| `language` | `WordLanguage` | `date`의 이름을 쓴 언어. |

<Lang js="new Date(detail.timestamp)" dart="DateTime.fromMillisecondsSinceEpoch(detail.timestamp, isUtc: true)" py="datetime.fromtimestamp(detail.timestamp / 1000, timezone.utc)" code />로 각 언어의 날짜 타입으로 되돌릴 수 있습니다.

## UTC 오프셋 {#time-zones}

<Lang js="utcOffset" dart="utcOffset" py="utc_offset" code />로 오프셋을 정하지 않으면 날짜는 UTC로 씁니다. 오프셋을 정하면 날짜의 모든 부분, 즉 일, 시, 요일, 모든 `unit`을 그 시계로 읽고, 형식의 `Z`가 그 오프셋을 씁니다. 그래서 기본 형식은 `Z` 자리에 `+09:00`을 씁니다. 상세 출력의 `timestamp`는 어느 쪽이든 같은 순간입니다.

::: lang js

```javascript
randDate({ utcOffset: '+09:00' }); // ['1987-06-21T17:14:51.302+09:00']
randDate({ utcOffset: 540, format: 'YYYY-MM-DD HH:mm' }); // ['2031-03-05 04:40']
randDate({ utcOffset: '-05:00', minDate: '2024-03-15', maxDate: '2024-03-15', format: 'HH:mm Z' });
// ['21:17 -05:00']
```

`utcOffset`은 `'+09:00'`, `'+0900'`, `'+09'`, `'Z'` 같은 문자열이나, UTC에서 동쪽으로 몇 분인지를 나타내는 숫자입니다.

:::

::: lang dart

```dart
randDate(utcOffset: Duration(hours: 9)); // [1987-06-21T17:14:51.302+09:00]
randDate(utcOffset: Duration(hours: 9), format: 'YYYY-MM-DD HH:mm'); // [2031-03-05 04:40]
randDate(utcOffset: Duration(hours: -5), minDate: DateTime.utc(2024, 3, 15, 5), maxDate: DateTime.utc(2024, 3, 16, 4, 59), format: 'HH:mm Z');
// [21:17 -05:00]
```

`utcOffset`은 `Duration`이고, 분 단위로 자릅니다. `DateTime` 경계는 어느 쪽이든 순간이므로, Dart에서 오프셋이 바꾸는 것은 기본 범위와 날짜의 부분이고, 직접 쓴 경계는 정확히 그 순간을 가리킵니다.

:::

::: lang py

```python
rand_date(utc_offset="+09:00")  # ['1987-06-21T17:14:51.302+09:00']
rand_date(utc_offset=timedelta(hours=9), format="YYYY-MM-DD HH:mm")  # ['2031-03-05 04:40']
rand_date(utc_offset="-05:00", min_date="2024-03-15", max_date="2024-03-15", format="HH:mm Z")
# ['21:17 -05:00']
```

`utc_offset`은 `"+09:00"`, `"+0900"`, `"+09"`, `"Z"` 같은 문자열이나 `timedelta`이고, 분 단위로 자릅니다.

:::

범위도 오프셋을 따라 움직입니다. 범위의 양 끝이 달력의 날짜이기 때문입니다. 생략하면 날짜를 쓰는 시계로 1900년부터 2099년까지이고, `+14:00`에서도 `-12:00`에서도 1년부터 9999년을 벗어난 연도는 쓰지 않습니다.

시간대 이름이 아니라 오프셋을 받습니다. 시간대는 날짜에 따라, 세계 여러 곳에서는 1년에 두 번 오프셋이 바뀌는데, Dart에는 그 규칙을 읽을 표가 없습니다. 세 패키지가 똑같이 지킬 수 있는 것은 고정된 오프셋뿐입니다. 하루 이상의 오프셋은 어느 시계도 쓰지 않는 값이라 UTC로 읽습니다. 시간대 고유의 규칙이 필요하면 상세 출력의 `timestamp`를 각 언어의 날짜 타입에 넘겨 그쪽에서 형식을 맞추세요.

## 함께 보기 {#see-also}

- [`randAge`](../age/rand-age) — 생년월일까지는 필요 없을 때 쓰는 나이.
- [`randName`](../name/rand-name) — 날짜와 함께 쓸 이름.
