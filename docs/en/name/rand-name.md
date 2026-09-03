# randName

Generates person names and returns `count` of them as strings, written in the script you asked for — or, with [`output: 'detail'`](#the-detail-output), the native and romanized form of each name together with the language and gender behind it.

::: lang js

```javascript
import { randName } from 'randino';

randName();
// ['Emma Clover']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randName();
// ['Emma Clover']
```

:::

::: lang py

```python
from randino import rand_name

rand_name()
# ['Emma Clover']
```

:::

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | <Lang js="NameLanguageOption" dart="NameLanguage?" py="NameLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Language of the generated names. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> mixes every supported language, picking one per name. |
| `gender` | <Lang js="NameGenderOption" dart="NameGender?" py="NameGenderOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Which pools the given name is drawn from. Left out, a gender is picked per name. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many names to return. Clamped to `0` … `10000`. |
| `style` | <Lang js="number" dart="int" py="int" code /> | `0` | `0` draws names people actually carry, `100` invents new ones, and anything between mixes the two per name and per part. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _language_ | Minimum length of the native form, in characters. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _language_ | Maximum length of the native form, in characters. |
| <Lang js="includeSurname" dart="includeSurname" py="include_surname" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Include the family name. |
| <Lang js="includeMiddleName" dart="includeMiddleName" py="include_middle_name" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Include a middle name. Ignored for languages that have none. |
| `script` | `NameScript` | <Lang js="'native'" dart="NameScript.native" py="&quot;native&quot;" code /> | The script the returned strings are written in. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | Keep only names whose native form starts with this character. Only the first character is used, and the match is case-insensitive. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same name twice. May return fewer than `count` once the pools run out of combinations. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `NameDetail` per name. Dart has no such parameter — see [the detail output](#the-detail-output). |

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> default to the language's own range, which [`nameLengthRange`](./name-length-range) reports — and that fallback is resolved **per language**, so a mixed draw does not stretch a Korean name to fill a Spanish name's range.

## The detail output

`output: 'detail'` returns each name in **both scripts** at once, with the language and gender behind it, instead of a string. Useful for showing a name next to its English pronunciation, and necessary when the draw is mixed and you need to know what each name is. `script` has nothing left to choose there, so it is ignored.

::: lang dart

Dart spells this as a **second function**, `randNameDetails`, because it has no way to make one function's return type depend on an argument. It takes the same parameters as `randName` except `script`.

:::

::: lang js

```javascript
import { randName } from 'randino';

randName({ language: 'ko', output: 'detail' });
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
from randino import rand_name

rand_name(language="ko", output="detail")
# [NameDetail(native='여미주', roman='Yeo Miju', language='ko', gender='female')]
```

:::

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

### One language at a time

::: lang js

```javascript
randName({ language: 'ko', count: 3 });
// ['김태윤', '원동혁', '조진우']

randName({ language: 'ja', count: 3 });
// ['山崎愛菜', '加藤楓乃', '吉田直人']

randName({ language: 'ru', count: 2 });
// ['Дмитрий Соколов', 'Полина Морозова']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.ko, count: 3);
// ['김태윤', '원동혁', '조진우']

randName(language: NameLanguage.ja, count: 3);
// ['山崎愛菜', '加藤楓乃', '吉田直人']

randName(language: NameLanguage.ru, count: 2);
// ['Дмитрий Соколов', 'Полина Морозова']
```

:::

::: lang py

```python
rand_name(language="ko", count=3)
# ['김태윤', '원동혁', '조진우']

rand_name(language="ja", count=3)
# ['山崎愛菜', '加藤楓乃', '吉田直人']

rand_name(language="ru", count=2)
# ['Дмитрий Соколов', 'Полина Морозова']
```

:::

Leave the language out and every name comes from one of the nine, picked per name:

::: lang js

```javascript
randName({ count: 5 });
// ['Nuria Ramírez', '조동민', 'Stella Reeves', 'Anna Mariani', 'Lê Phương']
```

:::

::: lang dart

```dart
randName(count: 5);
// ['Nuria Ramírez', '조동민', 'Stella Reeves', 'Anna Mariani', 'Lê Phương']
```

:::

::: lang py

```python
rand_name(count=5)
# ['Nuria Ramírez', '조동민', 'Stella Reeves', 'Anna Mariani', 'Lê Phương']
```

:::

### The parts of a name

::: lang js

```javascript
randName({ language: 'en', count: 3, includeSurname: false });
// ['Rachel', 'Eliza', 'Tessa']

randName({ language: 'en', count: 3, includeMiddleName: true });
// ['Danielle Sylvia Owens', 'Gloria Harriet Norton', 'Peyton Beatrix Owens']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.en, count: 3, includeSurname: false);
// ['Rachel', 'Eliza', 'Tessa']

randName(language: NameLanguage.en, count: 3, includeMiddleName: true);
// ['Danielle Sylvia Owens', 'Gloria Harriet Norton', 'Peyton Beatrix Owens']
```

:::

::: lang py

```python
rand_name(language="en", count=3, include_surname=False)
# ['Rachel', 'Eliza', 'Tessa']

rand_name(language="en", count=3, include_middle_name=True)
# ['Danielle Sylvia Owens', 'Gloria Harriet Norton', 'Peyton Beatrix Owens']
```

:::

Korean, Japanese and Chinese have no middle part, so <Lang js="includeMiddleName" dart="includeMiddleName" py="include_middle_name" code /> is ignored for them rather than inventing one. [`nameSupportsMiddleName`](./name-supports-middle-name) answers that directly.

### Romanized output

::: lang js

```javascript
randName({ language: 'ko', count: 3, script: 'roman' });
// ['Kim Minjun', 'Won Donghyeok', 'Jo Jinu']

randName({ language: 'ja', count: 3, script: 'roman' });
// ['Yamazaki Aina', 'Kato Kaeno', 'Yoshida Naoyato']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.ko, count: 3, script: NameScript.roman);
// ['Kim Minjun', 'Won Donghyeok', 'Jo Jinu']

randName(language: NameLanguage.ja, count: 3, script: NameScript.roman);
// ['Yamazaki Aina', 'Kato Kaeno', 'Yoshida Naoyato']
```

:::

::: lang py

```python
rand_name(language="ko", count=3, script="roman")
# ['Kim Minjun', 'Won Donghyeok', 'Jo Jinu']

rand_name(language="ja", count=3, script="roman")
# ['Yamazaki Aina', 'Kato Kaeno', 'Yoshida Naoyato']
```

:::

English is the one language where this changes nothing — the names are already in the Latin alphabet, which is what [`nameSupportsRoman`](./name-supports-roman) reports.

### A starting character

::: lang js

```javascript
randName({ language: 'en', count: 3, startsWith: 'k' });
// ['Kayla Morgan', 'Keith Doyle', 'Kimberly Vaughn']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.en, count: 3, startsWith: 'k');
// ['Kayla Morgan', 'Keith Doyle', 'Kimberly Vaughn']
```

:::

::: lang py

```python
rand_name(language="en", count=3, starts_with="k")
# ['Kayla Morgan', 'Keith Doyle', 'Kimberly Vaughn']
```

:::

A character no real name starts with still returns names rather than nothing: Latin and Cyrillic scripts invent one (`Q` → `Qivu Railooth`), and CJK scripts use the character as a name part of its own.

### Length

::: lang js

```javascript
randName({ language: 'en', count: 2, minLength: 20, maxLength: 25 });
// ['Josephine Adelaide Sinclair', 'Christina Genevieve Whitaker']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.en, count: 2, minLength: 20, maxLength: 25);
// ['Josephine Adelaide Sinclair', 'Christina Genevieve Whitaker']
```

:::

::: lang py

```python
rand_name(language="en", count=2, min_length=20, max_length=25)
# ['Josephine Adelaide Sinclair', 'Christina Genevieve Whitaker']
```

:::

The structure you asked for always wins. A range too narrow for the requested parts is answered with the closest name the generator can build, never by dropping the surname or middle name — see [how the options behave](./#length-is-counted-in-the-native-form).

### A name next to its pronunciation

::: lang js

```javascript
for (const { native, roman } of randName({ language: 'ja', count: 3, output: 'detail' })) {
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
for detail in rand_name(language="ja", count=3, output="detail"):
    print(f"{detail.native} ({detail.roman})")
# 山崎愛菜 (Yamazaki Aina)
# 加藤楓乃 (Kato Kaeno)
# 吉田直人 (Yoshida Naoto)
```

:::

### Knowing what a mixed draw produced

::: lang js

```javascript
randName({ count: 3, output: 'detail' });
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
rand_name(count=3, output="detail")
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
randName({ language: 'ru', gender: 'female', includeMiddleName: true, count: 2, output: 'detail' });
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
rand_name(language="ru", gender="female", include_middle_name=True, count=2, output="detail")
# [
#     NameDetail(native='Людмила Николаевна Богданова', roman='Lyudmila Nikolaevna Bogdanova', …),
#     NameDetail(native='Марина Максимовна Богданова', roman='Marina Maksimovna Bogdanova', …),
# ]
```

:::

## See also

- [Supported languages](../guide/languages#romanization) — how each script becomes an English pronunciation.
- [`nameLengthRange`](./name-length-range) — the range a name falls back to.
- [`nameSupportsMiddleName`](./name-supports-middle-name) and [`nameSupportsRoman`](./name-supports-roman) — the two questions about a language.
