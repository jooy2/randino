# randCountry

Generates country names and returns `count` of them as strings: every country and territory ISO 3166-1 gives a code, 249 of them, named the way the language names it. With [`output: 'detail'`](#the-detail-output) it reports the code each one is known by.

Every word language has a name for every country, so this takes any of the nine, where [`randLocation`](./rand-location) and the other level functions write only the languages whose countries publish their divisions.

::: lang js

```javascript
import { randCountry } from 'randino';

randCountry({ language: 'ko', count: 3 }); // ['아르헨티나', '방글라데시', '세인트키츠 네비스']
randCountry({ language: 'en', count: 2 }); // ['Gibraltar', 'Burkina Faso']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randCountry(language: WordLanguage.ko, count: 3); // [아르헨티나, 방글라데시, 세인트키츠 네비스]
randCountry(language: WordLanguage.en, count: 2); // [Gibraltar, Burkina Faso]
```

:::

::: lang py

```python
from randino import rand_country

rand_country(language="ko", count=3)  # ['아르헨티나', '방글라데시', '세인트키츠 네비스']
rand_country(language="en", count=2)  # ['Gibraltar', 'Burkina Faso']
```

:::

## Options

<LocationOptions country />

## Which countries {#which-countries}

The list is ISO 3166-1's, as the tz database carries it: sovereign states and the territories ISO codes on their own, such as Greenland, Hong Kong and Antarctica. Codes ISO only reserves, such as `XK`, are not in it. Any list of countries is a position on a few places, and following the standard every country picker already uses is the one that can be explained without taking a new one.

The names are Wikidata's labels in each language. They are the names the language's own encyclopedia uses, so they mix common and official forms the way that encyclopedia does: `대한민국` beside `미국`, `США` in Russian. A name that starts in lower case mid-sentence is written with a capital, and the one country with no label in a language, Jersey in Vietnamese, Spanish, Italian and German, is written the way those languages write it, `Jersey`.

Every country is drawn as often as any other. `unique` compares the names, so `language: 'all'` with `unique` stops at the names that differ, and `Andorra` counts once however many languages spell it that way.

## The detail output {#the-detail-output}

::: lang js

```javascript
randCountry({ language: 'ja', output: 'detail' });
// [{ country: 'サウジアラビア', code: 'SA', language: 'ja' }]
```

:::

::: lang dart

```dart
randCountryDetails(language: WordLanguage.ja).first.code; // SA
```

Dart has neither overloads nor union types, so the detail form is its own function.

:::

::: lang py

```python
rand_country(language="ja", output="detail")
# [CountryDetail(country='サウジアラビア', code='SA', language='ja')]
```

:::

`code` is the ISO 3166-1 alpha-2 code, which is the same whatever the language the name is in.

## See also

- [`randLocation`](./rand-location) — a place inside the language's own country, with the country on top.
- [`randRegion`](./rand-region) — the level below the country.
