# randName

사람 이름을 생성해서 `count`개의 문자열로 돌려줍니다. 표기는 요청한 문자 체계를 따릅니다. [`output: 'detail'`](#the-detail-output)을 주면 문자열 대신 각 이름의 고유 표기와 로마자 표기를, 그 이름의 언어·성별과 함께 돌려줍니다.

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

## 옵션

모든 옵션은 선택 사항이며, 위의 인자 없는 호출이 사용하는 값이 곧 기본값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | <Lang js="NameLanguageOption" dart="NameLanguage?" py="NameLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 생성할 이름의 언어. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 지원하는 모든 언어를 섞어서 이름마다 하나씩 고릅니다. |
| `gender` | <Lang js="NameGenderOption" dart="NameGender?" py="NameGenderOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 이름을 어느 풀에서 뽑을지. 생략하면 이름마다 성별을 하나씩 고릅니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 반환할 이름의 개수. `0` … `10000` 범위로 제한됩니다. |
| `realism` | `RandRealism` | <Lang js="`'real'`" dart="`RandRealism.real`" py="`\"real\"`" /> | `real`은 실제로 쓰이는 이름을, `invented`는 새로 만들어낸 이름을 뽑습니다. `mixed`는 요소마다 판단합니다. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어별_ | 고유 표기의 최소 글자 수. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어별_ | 고유 표기의 최대 글자 수. |
| <Lang js="includeSurname" dart="includeSurname" py="include_surname" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 성을 포함합니다. |
| <Lang js="includeMiddleName" dart="includeMiddleName" py="include_middle_name" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 중간 이름을 포함합니다. 중간 이름이 없는 언어에서는 무시됩니다. |
| `script` | `NameScript` | <Lang js="'native'" dart="NameScript.native" py="&quot;native&quot;" code /> | 반환되는 문자열의 문자 체계. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | 고유 표기가 이 글자로 시작하는 이름만 반환합니다. 첫 글자만 사용하고 대소문자는 구분하지 않습니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 이름을 두 번 반환하지 않습니다. 조합이 바닥나면 `count`보다 적게 반환할 수 있습니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 이름마다 하나의 `NameDetail`. Dart에는 이 파라미터가 없습니다. [상세 출력](#the-detail-output)을 참고하세요. |

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />의 기본값은 각 언어의 고유 범위이며, 그 값은 [`nameLengthRange`](./name-length-range)가 알려 줍니다. 이 기본값은 **언어별로** 결정되므로, 여러 언어를 섞어도 한국어 이름이 스페인어 이름의 길이에 맞춰 늘어나지 않습니다.

## 상세 출력 {#the-detail-output}

`output: 'detail'`은 문자열 대신 각 이름을 **두 문자 체계로 한 번에** 돌려주고, 그 이름의 언어와 성별도 함께 알려 줍니다. 이름과 영어 발음을 나란히 보여 줄 때 유용하며, 여러 언어를 섞어 뽑을 때는 각 이름이 무엇인지 알기 위해 필요합니다. 이 형태에서는 고를 것이 없으므로 `script`는 무시됩니다.

::: lang dart

Dart에는 인자에 따라 반환 타입이 달라지는 함수를 만들 방법이 없어서, 이 기능은 **별도 함수** `randNameDetails`로 되어 있습니다. `script`를 제외하면 `randName`과 같은 파라미터를 받습니다.

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

각 항목은 `NameDetail`입니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `native` | <Lang js="string" dart="String" py="str" code /> | 해당 언어의 문자로 쓴 이름. |
| `roman` | <Lang js="string" dart="String" py="str" code /> | `native`의 영어 발음. 영어에서는 `native`와 동일합니다. |
| `language` | `NameLanguage` | 이 이름이 생성된 언어. 여러 언어를 섞을 때 이 함수를 쓰는 이유입니다. |
| `gender` | `NameGender` | 이름을 뽑은 풀. |

## 예제

### 한 언어씩

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

언어를 생략하면 이름마다 9개 언어 중 하나를 골라서 생성합니다.

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

### 이름의 구성 요소

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

한국어, 일본어, 중국어에는 중간 이름이 없으므로 <Lang js="includeMiddleName" dart="includeMiddleName" py="include_middle_name" code />은 없는 이름을 만들어내는 대신 무시됩니다. [`nameSupportsMiddleName`](./name-supports-middle-name)이 이를 직접 알려 줍니다.

### 로마자 표기

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

영어는 이미 라틴 알파벳으로 쓰이기 때문에 로마자 표기를 해도 아무것도 바뀌지 않는 유일한 언어입니다. 이를 알려 주는 것이 [`nameSupportsRoman`](./name-supports-roman)입니다.

### 시작 글자

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

실제 이름 중에 그 글자로 시작하는 것이 없어도 빈 결과가 아니라 이름을 돌려줍니다. 라틴 문자와 키릴 문자는 이름을 만들어내고(`Q` → `Qivu Railooth`), 한중일 문자는 그 글자 자체를 이름의 한 요소로 씁니다.

### 길이

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

요청한 구조가 항상 우선합니다. 요청한 요소를 담기에 범위가 너무 좁으면, 성이나 중간 이름을 빼는 대신 생성기가 만들 수 있는 가장 가까운 이름을 돌려줍니다. 자세한 내용은 [옵션의 동작 방식](./#length)을 참고하세요.

### 이름과 발음을 나란히

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

### 섞인 결과가 무엇인지 알기

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

### 성별이 겉으로 드러나는 경우

대부분의 언어는 이름이 어느 풀에서 왔는지 드러내지 않습니다. 러시아어는 예외여서, 부칭과 성이 모두 굴절하므로 선택 결과를 눈으로 확인할 수 있습니다.

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

## 함께 보기

- [지원 언어](../guide/languages#romanization) — 각 문자 체계가 영어 발음으로 바뀌는 방식.
- [`nameLengthRange`](./name-length-range) — 이름이 기본값으로 쓰는 길이 범위.
- [`nameSupportsMiddleName`](./name-supports-middle-name)과 [`nameSupportsRoman`](./name-supports-roman) — 중간 이름과 로마자 표기를 지원하는지 알려 주는 두 함수.
