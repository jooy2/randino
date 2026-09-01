# randName

Generates person names and returns `count` of them as strings, written in the script you asked for. Use [`randNameDetails`](./rand-name-details) when you want the native and romanized form of each name together.

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

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> default to the language's own range, which [`nameLengthRange`](./name-length-range) reports — and that fallback is resolved **per language**, so a mixed draw does not stretch a Korean name to fill a Spanish name's range.

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

randName({ language: 'vi', count: 3, includeMiddleName: true });
// ['Lý Thu Thảo', 'Phạm Quang Hùng', 'Dương Văn Phong']

randName({ language: 'ru', count: 2, gender: 'female', includeMiddleName: true });
// ['Людмила Николаевна Богданова', 'Марина Максимовна Богданова']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.en, count: 3, includeSurname: false);
// ['Rachel', 'Eliza', 'Tessa']

randName(language: NameLanguage.vi, count: 3, includeMiddleName: true);
// ['Lý Thu Thảo', 'Phạm Quang Hùng', 'Dương Văn Phong']

randName(
  language: NameLanguage.ru,
  count: 2,
  gender: NameGender.female,
  includeMiddleName: true,
);
// ['Людмила Николаевна Богданова', 'Марина Максимовна Богданова']
```

:::

::: lang py

```python
rand_name(language="en", count=3, include_surname=False)
# ['Rachel', 'Eliza', 'Tessa']

rand_name(language="vi", count=3, include_middle_name=True)
# ['Lý Thu Thảo', 'Phạm Quang Hùng', 'Dương Văn Phong']

rand_name(language="ru", count=2, gender="female", include_middle_name=True)
# ['Людмила Николаевна Богданова', 'Марина Максимовна Богданова']
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
randName({ language: 'ko', count: 3, startsWith: '이' });
// ['이예빈', '이우진', '이서현']

randName({ language: 'en', count: 3, startsWith: 'k' });
// ['Kayla Morgan', 'Keith Doyle', 'Kimberly Vaughn']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.ko, count: 3, startsWith: '이');
// ['이예빈', '이우진', '이서현']

randName(language: NameLanguage.en, count: 3, startsWith: 'k');
// ['Kayla Morgan', 'Keith Doyle', 'Kimberly Vaughn']
```

:::

::: lang py

```python
rand_name(language="ko", count=3, starts_with="이")
# ['이예빈', '이우진', '이서현']

rand_name(language="en", count=3, starts_with="k")
# ['Kayla Morgan', 'Keith Doyle', 'Kimberly Vaughn']
```

:::

A character no real name starts with still returns names rather than nothing: Latin and Cyrillic scripts invent one (`Q` → `Qivu Railooth`), and CJK scripts use the character as a name part of its own.

### Length

::: lang js

```javascript
randName({ language: 'ko', count: 3, minLength: 5, maxLength: 8 });
// ['남궁하윤서', '김서연아린', '박도윤하람']

randName({ language: 'en', count: 2, minLength: 20, maxLength: 25 });
// ['Josephine Adelaide Sinclair', 'Christina Genevieve Whitaker']
```

:::

::: lang dart

```dart
randName(language: NameLanguage.ko, count: 3, minLength: 5, maxLength: 8);
// ['남궁하윤서', '김서연아린', '박도윤하람']

randName(language: NameLanguage.en, count: 2, minLength: 20, maxLength: 25);
// ['Josephine Adelaide Sinclair', 'Christina Genevieve Whitaker']
```

:::

::: lang py

```python
rand_name(language="ko", count=3, min_length=5, max_length=8)
# ['남궁하윤서', '김서연아린', '박도윤하람']

rand_name(language="en", count=2, min_length=20, max_length=25)
# ['Josephine Adelaide Sinclair', 'Christina Genevieve Whitaker']
```

:::

The structure you asked for always wins. A range too narrow for the requested parts is answered with the closest name the generator can build, never by dropping the surname or middle name — see [how the options behave](./#length-is-counted-in-the-native-form).

## See also

- [`randNameDetails`](./rand-name-details) — the same names with both scripts and the choices behind them.
- [`nameLengthRange`](./name-length-range) — the range a name falls back to.
- [`nameSupportsMiddleName`](./name-supports-middle-name) and [`nameSupportsRoman`](./name-supports-roman) — the two questions about a language.
