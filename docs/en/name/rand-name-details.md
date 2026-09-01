# randNameDetails

Generates person names and returns each one in **both scripts** at once, along with the language and gender behind it. Useful when you want to show a name next to its English pronunciation, and necessary when the language is mixed and you need to know what each name is.

::: lang js

```javascript
import { randNameDetails } from 'randino';

randNameDetails({ language: 'ko' });
// [{ native: '여미주', roman: 'Yeo Miju', language: 'ko', gender: 'female' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randNameDetails(language: NameLanguage.ko);
// [NameDetail(여미주, Yeo Miju, ko, female)]
```

:::

::: lang py

```python
from randino import rand_name_details

rand_name_details(language="ko")
# [NameDetail(native='여미주', roman='Yeo Miju', language='ko', gender='female')]
```

:::

## Options

The same options as [`randName`](./rand-name), **except `script`** — every name is returned in its native form and romanized at the same time, so there is nothing to choose.

## What you get back

::: lang js

Each entry is a `NameDetail`:

:::

::: lang dart

Each entry is a `NameDetail`:

:::

::: lang py

Each entry is a `NameDetail`, a frozen dataclass:

:::

| Field | Type | Description |
| --- | --- | --- |
| `native` | <Lang js="string" dart="String" py="str" code /> | The name in its own script. |
| `roman` | <Lang js="string" dart="String" py="str" code /> | The English pronunciation of `native`. Identical to it for English. |
| `language` | `NameLanguage` | The language this name was generated in — the reason to reach for this function when the draw is mixed. |
| `gender` | `NameGender` | The pools the given name was drawn from. |

## Examples

### A name next to its pronunciation

::: lang js

```javascript
for (const { native, roman } of randNameDetails({ language: 'ja', count: 3 })) {
	console.log(`${native} (${roman})`);
}
// 山崎愛菜 (Yamazaki Aina)
// 加藤楓乃 (Kato Kaeno)
// 吉田直人 (Yoshida Naoto)
```

:::

::: lang dart

```dart
for (final detail in randNameDetails(language: NameLanguage.ja, count: 3)) {
  print('${detail.native} (${detail.roman})');
}
// 山崎愛菜 (Yamazaki Aina)
// 加藤楓乃 (Kato Kaeno)
// 吉田直人 (Yoshida Naoto)
```

:::

::: lang py

```python
for detail in rand_name_details(language="ja", count=3):
    print(f"{detail.native} ({detail.roman})")
# 山崎愛菜 (Yamazaki Aina)
# 加藤楓乃 (Kato Kaeno)
# 吉田直人 (Yoshida Naoto)
```

:::

### Knowing what a mixed draw produced

::: lang js

```javascript
randNameDetails({ count: 3 });
// [
//   { native: '조동민', roman: 'Jo Dongmin', language: 'ko', gender: 'male' },
//   { native: 'Anna Mariani', roman: 'Anna Mariani', language: 'it', gender: 'female' },
//   { native: 'Иванов Иван', roman: 'Ivanov Ivan', language: 'ru', gender: 'male' }
// ]
```

:::

::: lang dart

```dart
randNameDetails(count: 3);
// [
//   NameDetail(조동민, Jo Dongmin, ko, male),
//   NameDetail(Anna Mariani, Anna Mariani, it, female),
//   NameDetail(Иванов Иван, Ivanov Ivan, ru, male),
// ]
```

:::

::: lang py

```python
rand_name_details(count=3)
# [
#     NameDetail(native='조동민', roman='Jo Dongmin', language='ko', gender='male'),
#     NameDetail(native='Anna Mariani', roman='Anna Mariani', language='it', gender='female'),
#     NameDetail(native='Иванов Иван', roman='Ivanov Ivan', language='ru', gender='male'),
# ]
```

:::

### Gender, where it is observable

Most languages do not show which pool a given name came from. Russian does — its patronymic and its surname both inflect — which is what makes the choice verifiable there:

::: lang js

```javascript
randNameDetails({ language: 'ru', gender: 'female', includeMiddleName: true, count: 2 });
// [
//   { native: 'Людмила Николаевна Богданова', roman: 'Lyudmila Nikolaevna Bogdanova', … },
//   { native: 'Марина Максимовна Богданова', roman: 'Marina Maksimovna Bogdanova', … }
// ]
```

:::

::: lang dart

```dart
randNameDetails(
  language: NameLanguage.ru,
  gender: NameGender.female,
  includeMiddleName: true,
  count: 2,
);
// [
//   NameDetail(Людмила Николаевна Богданова, Lyudmila Nikolaevna Bogdanova, ru, female),
//   NameDetail(Марина Максимовна Богданова, Marina Maksimovna Bogdanova, ru, female),
// ]
```

:::

::: lang py

```python
rand_name_details(language="ru", gender="female", include_middle_name=True, count=2)
# [
#     NameDetail(native='Людмила Николаевна Богданова', roman='Lyudmila Nikolaevna Bogdanova', …),
#     NameDetail(native='Марина Максимовна Богданова', roman='Marina Maksimovna Bogdanova', …),
# ]
```

:::

## See also

- [`randName`](./rand-name) — the full option table, and the same names as plain strings.
- [Supported languages](../guide/languages#romanization) — how each script becomes an English pronunciation.
