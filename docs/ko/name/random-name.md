# randomName

사람 이름을 생성해서 `count`개의 문자열로 돌려줍니다. 표기는 요청한 문자 체계를 따릅니다. 각 이름의 고유 표기와 로마자 표기를 함께 받고 싶다면 [`randomNameDetails`](./random-name-details)를 쓰세요.

::: lang js

```javascript
import { randomName } from 'randino';

randomName();
// ['Emma Clover']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randomName();
// ['Emma Clover']
```

:::

::: lang py

```python
from randino import random_name

random_name()
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
| `style` | <Lang js="number" dart="int" py="int" code /> | `0` | `0`은 실제로 쓰이는 이름을, `100`은 새로 만들어낸 이름을 뽑습니다. 중간값은 이름마다, 요소마다 둘을 섞습니다. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어별_ | 고유 표기의 최소 글자 수. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어별_ | 고유 표기의 최대 글자 수. |
| <Lang js="includeSurname" dart="includeSurname" py="include_surname" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 성을 포함합니다. |
| <Lang js="includeMiddleName" dart="includeMiddleName" py="include_middle_name" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 중간 이름을 포함합니다. 중간 이름이 없는 언어에서는 무시됩니다. |
| `script` | `NameScript` | <Lang js="'native'" dart="NameScript.native" py="&quot;native&quot;" code /> | 반환되는 문자열의 문자 체계. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | 고유 표기가 이 글자로 시작하는 이름만 반환합니다. 첫 글자만 사용하고 대소문자는 구분하지 않습니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 이름을 두 번 반환하지 않습니다. 조합이 바닥나면 `count`보다 적게 반환할 수 있습니다. |

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />의 기본값은 각 언어의 고유 범위이며, 그 값은 [`nameLengthRange`](./name-length-range)가 알려 줍니다. 이 기본값은 **언어별로** 결정되므로, 여러 언어를 섞어도 한국어 이름이 스페인어 이름의 길이에 맞춰 늘어나지 않습니다.

## 예제

### 한 언어씩

::: lang js

```javascript
randomName({ language: 'ko', count: 3 });
// ['김태윤', '원동혁', '조진우']

randomName({ language: 'ja', count: 3 });
// ['山崎愛菜', '加藤楓乃', '吉田直人']

randomName({ language: 'ru', count: 2 });
// ['Дмитрий Соколов', 'Полина Морозова']
```

:::

::: lang dart

```dart
randomName(language: NameLanguage.ko, count: 3);
// ['김태윤', '원동혁', '조진우']

randomName(language: NameLanguage.ja, count: 3);
// ['山崎愛菜', '加藤楓乃', '吉田直人']

randomName(language: NameLanguage.ru, count: 2);
// ['Дмитрий Соколов', 'Полина Морозова']
```

:::

::: lang py

```python
random_name(language="ko", count=3)
# ['김태윤', '원동혁', '조진우']

random_name(language="ja", count=3)
# ['山崎愛菜', '加藤楓乃', '吉田直人']

random_name(language="ru", count=2)
# ['Дмитрий Соколов', 'Полина Морозова']
```

:::

언어를 생략하면 이름마다 9개 언어 중 하나를 골라서 생성합니다.

::: lang js

```javascript
randomName({ count: 5 });
// ['Nuria Ramírez', '조동민', 'Stella Reeves', 'Anna Mariani', 'Lê Phương']
```

:::

::: lang dart

```dart
randomName(count: 5);
// ['Nuria Ramírez', '조동민', 'Stella Reeves', 'Anna Mariani', 'Lê Phương']
```

:::

::: lang py

```python
random_name(count=5)
# ['Nuria Ramírez', '조동민', 'Stella Reeves', 'Anna Mariani', 'Lê Phương']
```

:::

### 이름의 구성 요소

::: lang js

```javascript
randomName({ language: 'en', count: 3, includeSurname: false });
// ['Rachel', 'Eliza', 'Tessa']

randomName({ language: 'vi', count: 3, includeMiddleName: true });
// ['Lý Thu Thảo', 'Phạm Quang Hùng', 'Dương Văn Phong']

randomName({ language: 'ru', count: 2, gender: 'female', includeMiddleName: true });
// ['Людмила Николаевна Богданова', 'Марина Максимовна Богданова']
```

:::

::: lang dart

```dart
randomName(language: NameLanguage.en, count: 3, includeSurname: false);
// ['Rachel', 'Eliza', 'Tessa']

randomName(language: NameLanguage.vi, count: 3, includeMiddleName: true);
// ['Lý Thu Thảo', 'Phạm Quang Hùng', 'Dương Văn Phong']

randomName(
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
random_name(language="en", count=3, include_surname=False)
# ['Rachel', 'Eliza', 'Tessa']

random_name(language="vi", count=3, include_middle_name=True)
# ['Lý Thu Thảo', 'Phạm Quang Hùng', 'Dương Văn Phong']

random_name(language="ru", count=2, gender="female", include_middle_name=True)
# ['Людмила Николаевна Богданова', 'Марина Максимовна Богданова']
```

:::

한국어, 일본어, 중국어에는 중간 이름이 없으므로 <Lang js="includeMiddleName" dart="includeMiddleName" py="include_middle_name" code />은 없는 이름을 만들어내는 대신 무시됩니다. [`nameSupportsMiddleName`](./name-supports-middle-name)이 이를 직접 알려 줍니다.

### 로마자 표기

::: lang js

```javascript
randomName({ language: 'ko', count: 3, script: 'roman' });
// ['Kim Minjun', 'Won Donghyeok', 'Jo Jinu']

randomName({ language: 'ja', count: 3, script: 'roman' });
// ['Yamazaki Aina', 'Kato Kaeno', 'Yoshida Naoyato']
```

:::

::: lang dart

```dart
randomName(language: NameLanguage.ko, count: 3, script: NameScript.roman);
// ['Kim Minjun', 'Won Donghyeok', 'Jo Jinu']

randomName(language: NameLanguage.ja, count: 3, script: NameScript.roman);
// ['Yamazaki Aina', 'Kato Kaeno', 'Yoshida Naoyato']
```

:::

::: lang py

```python
random_name(language="ko", count=3, script="roman")
# ['Kim Minjun', 'Won Donghyeok', 'Jo Jinu']

random_name(language="ja", count=3, script="roman")
# ['Yamazaki Aina', 'Kato Kaeno', 'Yoshida Naoyato']
```

:::

영어는 이미 라틴 알파벳으로 쓰이기 때문에 로마자 표기를 해도 아무것도 바뀌지 않는 유일한 언어입니다. 이를 알려 주는 것이 [`nameSupportsRoman`](./name-supports-roman)입니다.

### 시작 글자

::: lang js

```javascript
randomName({ language: 'ko', count: 3, startsWith: '이' });
// ['이예빈', '이우진', '이서현']

randomName({ language: 'en', count: 3, startsWith: 'k' });
// ['Kayla Morgan', 'Keith Doyle', 'Kimberly Vaughn']
```

:::

::: lang dart

```dart
randomName(language: NameLanguage.ko, count: 3, startsWith: '이');
// ['이예빈', '이우진', '이서현']

randomName(language: NameLanguage.en, count: 3, startsWith: 'k');
// ['Kayla Morgan', 'Keith Doyle', 'Kimberly Vaughn']
```

:::

::: lang py

```python
random_name(language="ko", count=3, starts_with="이")
# ['이예빈', '이우진', '이서현']

random_name(language="en", count=3, starts_with="k")
# ['Kayla Morgan', 'Keith Doyle', 'Kimberly Vaughn']
```

:::

실제 이름 중에 그 글자로 시작하는 것이 없어도 빈 결과가 아니라 이름을 돌려줍니다. 라틴 문자와 키릴 문자는 이름을 만들어내고(`Q` → `Qivu Railooth`), 한중일 문자는 그 글자 자체를 이름의 한 요소로 씁니다.

### 길이

::: lang js

```javascript
randomName({ language: 'ko', count: 3, minLength: 5, maxLength: 8 });
// ['남궁하윤서', '김서연아린', '박도윤하람']

randomName({ language: 'en', count: 2, minLength: 20, maxLength: 25 });
// ['Josephine Adelaide Sinclair', 'Christina Genevieve Whitaker']
```

:::

::: lang dart

```dart
randomName(language: NameLanguage.ko, count: 3, minLength: 5, maxLength: 8);
// ['남궁하윤서', '김서연아린', '박도윤하람']

randomName(language: NameLanguage.en, count: 2, minLength: 20, maxLength: 25);
// ['Josephine Adelaide Sinclair', 'Christina Genevieve Whitaker']
```

:::

::: lang py

```python
random_name(language="ko", count=3, min_length=5, max_length=8)
# ['남궁하윤서', '김서연아린', '박도윤하람']

random_name(language="en", count=2, min_length=20, max_length=25)
# ['Josephine Adelaide Sinclair', 'Christina Genevieve Whitaker']
```

:::

요청한 구조가 항상 우선합니다. 요청한 요소를 담기에 범위가 너무 좁으면, 성이나 중간 이름을 빼는 대신 생성기가 만들 수 있는 가장 가까운 이름을 돌려줍니다. 자세한 내용은 [옵션의 동작 방식](./#length)을 참고하세요.

## 함께 보기

- [`randomNameDetails`](./random-name-details) — 같은 이름을 두 문자 체계와 선택 정보까지 함께.
- [`nameLengthRange`](./name-length-range) — 이름이 기본값으로 쓰는 길이 범위.
- [`nameSupportsMiddleName`](./name-supports-middle-name)과 [`nameSupportsRoman`](./name-supports-roman) — 언어에 대한 두 가지 질문.
