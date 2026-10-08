# randPhone

Generates phone numbers and returns `count` of them, written the way their country writes them: `010-4821-3967` in Korea, `(415) 726-0193` in the United States, `8 (912) 345-67-89` in Russia. Each number opens on a block the country's numbering plan gives out, so it reads as a real number, and the digits after it are random. [`includeCountryCode`](#formats) writes the international form, [`separator`](#formats) replaces the country's own punctuation, and [`output: 'detail'`](#the-detail-output) adds the E.164 form.

::: warning A drawn number can be somebody's

A number opens on a block that is really in use and ends on random digits, so it can be in service and belong to a real person or business. That is a coincidence of the draw and nothing more: randino knows no subscriber, holds no list of real numbers and checks none. Use the numbers as sample data, in a form, a fixture or a mockup, and **never to call, text or message anybody**, to sign anybody up for anything, or for anything else that could reach or harm whoever a number happens to belong to. Where a screen or a page has to show a number somebody might dial, ask for a [fictional one](#fictional-numbers), and see [using the numbers](#using-the-numbers).

:::

A number is written by its country rather than in a language, so `randPhone` takes a `country` and no `language`.

::: lang js

```javascript
import { randPhone } from 'randino';

randPhone({ country: 'KR' });
// ['010-4821-3967']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randPhone(country: PhoneCountry.kr);
// [010-4821-3967]
```

:::

::: lang py

```python
from randino import rand_phone

rand_phone(country="KR")
# ['010-4821-3967']
```

:::

## Options

Every option is optional, and the defaults are what `randPhone()` with nothing passed uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `country` | <Lang js="PhoneCountryOption" dart="PhoneCountry?" py="PhoneCountryOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Which country's numbers. See [countries](#countries). |
| `type` | <Lang js="PhoneTypeOption" dart="PhoneType?" py="PhoneTypeOption" code /> | <Lang js="'mobile'" dart="PhoneType.mobile" py="&quot;mobile&quot;" code /> | `mobile`, `landline`, or <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> for either, decided per number. |
| <Lang js="includeCountryCode" dart="includeCountryCode" py="include_country_code" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Write the number the way it is dialled from abroad. See [formats](#formats). |
| `separator` | <Lang js="string" dart="String?" py="str &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | What goes between the groups of digits, in place of the country's own punctuation. See [formats](#formats). |
| `fictional` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Keep to the numbers a country sets aside for fiction, which nobody is given. See [fictional numbers](#fictional-numbers). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many numbers to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same number twice. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `PhoneDetail` per number. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

Mobile numbers are the default because they are what a sample person writes on a form. In the United States the two types are written alike and drawn from the same area codes, so `type` decides nothing there but the detail.

::: lang js

```javascript
randPhone({ country: 'US', count: 3 }); // ['(415) 726-0193', '(917) 384-5520', '(312) 940-2271']
randPhone({ country: 'JP', type: 'landline', count: 2 }); // ['03-5412-7788', '045-321-6540']
randPhone({ type: 'all', count: 3 }); // ['0151 23456789', '0755 2345 6789', '612 34 56 78']
```

:::

::: lang dart

```dart
randPhone(country: PhoneCountry.us, count: 3); // [(415) 726-0193, (917) 384-5520, (312) 940-2271]
randPhone(country: PhoneCountry.jp, type: PhoneType.landline, count: 2); // [03-5412-7788, 045-321-6540]
randPhone(type: null, count: 3); // [0151 23456789, 0755 2345 6789, 612 34 56 78]
```

A null `type` is either type, the way a null enum is every one of them everywhere else in the package; `PhoneType.mobile` is what the parameter defaults to.

:::

::: lang py

```python
rand_phone(country="US", count=3)  # ['(415) 726-0193', '(917) 384-5520', '(312) 940-2271']
rand_phone(country="JP", type="landline", count=2)  # ['03-5412-7788', '045-321-6540']
rand_phone(type="all", count=3)  # ['0151 23456789', '0755 2345 6789', '612 34 56 78']
```

:::

## Countries {#countries}

One country for each language the word pools cover, by its ISO 3166-1 alpha-2 code.

::: lang js

The code is read regardless of case, so `'kr'` is `'KR'`.

:::

::: lang dart

Each country is a `PhoneCountry`, and `PhoneCountry.kr.code` is `'KR'`.

:::

::: lang py

The code is read regardless of case, so `"kr"` is `"KR"`.

:::

| Code | Country | Calling code | Mobile | Landline |
| --- | --- | --- | --- | --- |
| `US` | United States | `+1` | `(415) 726-0193` | `(212) 846-0147` |
| `KR` | South Korea | `+82` | `010-4821-3967` | `02-3456-7890`, `031-234-5678` |
| `JP` | Japan | `+81` | `090-3718-2046` | `03-5412-7788`, `045-321-6540` |
| `CN` | China | `+86` | `138 2873 1496` | `010 6512 3456`, `0755 2345 6789` |
| `VN` | Vietnam | `+84` | `091 234 5678` | `024 3826 1234`, `0236 382 1234` |
| `ES` | Spain | `+34` | `612 34 56 78` | `912 34 56 78` |
| `IT` | Italy | `+39` | `347 123 4567` | `06 4123 5678`, `011 523 4567` |
| `DE` | Germany | `+49` | `0151 23456789`, `0171 2345678` | `030 23456789`, `0221 2345678` |
| `RU` | Russia | `+7` | `8 (912) 345-67-89` | `8 (495) 323-45-67` |

A mobile number opens on a block the country gives its operators, and a landline on the area code of a real city: Seoul and the sixteen provinces and cities of Korea, Tokyo and Osaka, Beijing and Shenzhen, Rome and Milan. The lists are the country's numbering plan at the level of the blocks it gives out, and nothing finer, since a plan does not say which numbers inside a block are in service. In the United States the area codes are long-standing ones of the fifty states and DC, never Canada's or the Caribbean's, and the exchange is never a service code like `411` nor `555`.

## Formats {#formats}

Left as they are, the options write the number the way the country writes it at home, trunk prefix and punctuation included. <Lang js="includeCountryCode" dart="includeCountryCode" py="include_country_code" code /> writes it the way it is dialled from abroad instead: a `+`, the calling code, and the number without the trunk prefix the country dials at home, so `010` becomes `10` and Russia's `8` disappears. Italy is the exception that keeps its `0`, because there the `0` of a landline is part of the number.

`separator` replaces the country's punctuation with one string between every group. `''` writes the digits alone, which with <Lang js="includeCountryCode" dart="includeCountryCode" py="include_country_code" code /> is E.164, the form an SMS gateway or a database column expects.

| Options | Korea | United States | Russia |
| --- | --- | --- | --- |
| Neither | `010-4821-3967` | `(415) 726-0193` | `8 (912) 345-67-89` |
| <Lang js="includeCountryCode" dart="includeCountryCode" py="include_country_code" code /> | `+82 10-4821-3967` | `+1 415-726-0193` | `+7 912 345-67-89` |
| `separator: ''` | `01048213967` | `4157260193` | `89123456789` |
| both, with `''` | `+821048213967` | `+14157260193` | `+79123456789` |
| `separator: '.'` | `010.4821.3967` | `415.726.0193` | `8.912.345.67.89` |

::: lang js

```javascript
randPhone({ country: 'KR', includeCountryCode: true }); // ['+82 10-4821-3967']
randPhone({ country: 'KR', separator: '' }); // ['01048213967']
randPhone({ country: 'KR', includeCountryCode: true, separator: '' }); // ['+821048213967']
randPhone({ country: 'US', separator: '-' }); // ['415-726-0193']
```

:::

::: lang dart

```dart
randPhone(country: PhoneCountry.kr, includeCountryCode: true); // [+82 10-4821-3967]
randPhone(country: PhoneCountry.kr, separator: ''); // [01048213967]
randPhone(country: PhoneCountry.kr, includeCountryCode: true, separator: ''); // [+821048213967]
randPhone(country: PhoneCountry.us, separator: '-'); // [415-726-0193]
```

:::

::: lang py

```python
rand_phone(country="KR", include_country_code=True)  # ['+82 10-4821-3967']
rand_phone(country="KR", separator="")  # ['01048213967']
rand_phone(country="KR", include_country_code=True, separator="")  # ['+821048213967']
rand_phone(country="US", separator="-")  # ['415-726-0193']
```

:::

The trunk prefix keeps the place its country gives it when a separator replaces the punctuation: on the first group in Korea (`010-…`), and a group of its own in Russia (`8-912-…`).

## Fictional numbers {#fictional-numbers}

`fictional` keeps to the numbers a country sets aside for films, television and books. Nobody is ever given one, so a reader who dials a number off a screen or a page reaches nobody. Two of the nine countries reserve any:

| Country | Mobile | Landline | Set aside by |
| --- | --- | --- | --- |
| `US` | `(415) 555-0100` to `555-0199` | the same | NANPA, in every area code |
| `DE` | `0171 3920000` to `3920099`, `0176 04069000` to `04069099` | a thousand numbers each in Berlin (`030 23125…`), Hamburg (`040 66969…`), Frankfurt (`069 90009…`), Munich (`089 99998…`) and Cologne (`0221 4710…`) | the Bundesnetzagentur, as its drama numbers |

The other seven reserve none, so naming one of them with `fictional` returns no numbers at all rather than real ones, and leaving `country` out draws from the United States and Germany alone. The forms are the same forms: <Lang js="includeCountryCode" dart="includeCountryCode" py="include_country_code" code /> and `separator` write a fictional number the way they write any other.

::: lang js

```javascript
randPhone({ country: 'US', fictional: true, count: 2 }); // ['(415) 555-0147', '(917) 555-0182']
randPhone({ country: 'DE', type: 'landline', fictional: true }); // ['030 23125418']
randPhone({ fictional: true, count: 2 }); // ['0176 04069031', '(212) 555-0109']
randPhone({ country: 'KR', fictional: true }); // []
```

:::

::: lang dart

```dart
randPhone(country: PhoneCountry.us, fictional: true, count: 2); // [(415) 555-0147, (917) 555-0182]
randPhone(country: PhoneCountry.de, type: PhoneType.landline, fictional: true); // [030 23125418]
randPhone(fictional: true, count: 2); // [0176 04069031, (212) 555-0109]
randPhone(country: PhoneCountry.kr, fictional: true); // []
```

:::

::: lang py

```python
rand_phone(country="US", fictional=True, count=2)  # ['(415) 555-0147', '(917) 555-0182']
rand_phone(country="DE", type="landline", fictional=True)  # ['030 23125418']
rand_phone(fictional=True, count=2)  # ['0176 04069031', '(212) 555-0109']
rand_phone(country="KR", fictional=True)  # []
```

:::

Korea's film council sets aside a handful of numbers too, but it publishes them with their last four digits hidden, so there is nothing whole to draw from.

## The detail output {#the-detail-output}

::: lang js

```javascript
randPhone({ country: 'JP', output: 'detail' });
// [{
//   phone: '090-3718-2046',
//   e164: '+819037182046',
//   country: 'JP',
//   callingCode: '81',
//   type: 'mobile'
// }]
```

:::

::: lang dart

```dart
randPhoneDetails(country: PhoneCountry.jp).first;
// PhoneDetail(090-3718-2046, +819037182046, JP, mobile)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randPhone`.

:::

::: lang py

```python
rand_phone(country="JP", output="detail")
# [PhoneDetail(phone='090-3718-2046', e164='+819037182046', country='JP',
#              calling_code='81', type='mobile')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `phone` | <Lang js="string" dart="String" py="str" code /> | The number, written the way the options asked for. |
| `e164` | <Lang js="string" dart="String" py="str" code /> | The same number in E.164, whatever the options: `+819037182046`. |
| `country` | `PhoneCountry` | The country the number is for. |
| <Lang js="callingCode" dart="callingCode" py="calling_code" code /> | <Lang js="string" dart="String" py="str" code /> | The calling code without the `+`: `'81'`. |
| `type` | `PhoneType` | `mobile` or `landline`. |

`e164` is the one to store when a number is shown in more than one way: every other form can be written from it, and it is the same however `phone` was formatted.

## Using the numbers {#using-the-numbers}

randino draws a number from the shape of a country's numbering plan and random digits. It does not look numbers up, does not know who holds them, and cannot tell a number in service from one that is not, so **any resemblance to a real number is a coincidence of the draw**. A number that turns out to be real is still only a sample value.

- Use the numbers where nothing is sent to them: a sign-up form under test, a seeded database, a screenshot, a mockup.
- Where a number will be seen by people who might dial it — a screenshot, a demo, a printed page — use [`fictional`](#fictional-numbers), which keeps to the US and German numbers nobody is given.
- When a test sends a text message or places a call, send it to a number you own, or to the test numbers your SMS or telephony provider sets aside, never to one drawn here.
- Do not use the numbers to reach, harass, spam, defraud or impersonate anybody, to get past a verification step, or for any other malicious purpose. Whoever a drawn number belongs to never agreed to be part of your data.

## See also

- [`randName`](../name/rand-name) — a name to go with the number.
- [`randLocation`](../location/rand-location) — a real place in Korea or the United States, to go with a number there.
