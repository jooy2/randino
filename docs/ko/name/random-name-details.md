# randomNameDetails

사람 이름을 생성하되 각 이름을 **두 문자 체계로 동시에** 돌려주고, 그 이름의 언어와 성별까지 함께 알려 줍니다. 이름 옆에 영어 발음을 같이 보여 줄 때 유용하고, 여러 언어를 섞을 때는 각 이름이 어느 언어인지 알기 위해 필요합니다.

::: lang js

```javascript
import { randomNameDetails } from 'randino';

randomNameDetails({ language: 'ko' });
// [{ native: '여미주', roman: 'Yeo Miju', language: 'ko', gender: 'female' }]
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randomNameDetails(language: NameLanguage.ko);
// [NameDetail(여미주, Yeo Miju, ko, female)]
```

:::

## 옵션

[`randomName`](./random-name)과 같은 옵션을 받되 **`script`만 제외됩니다**. 모든 이름이 고유 표기와 로마자 표기로 동시에 반환되므로 고를 것이 없습니다.

## 반환값

각 항목은 `NameDetail`입니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `native` | <Lang js="string" dart="String" code /> | 해당 언어의 문자로 쓴 이름. |
| `roman` | <Lang js="string" dart="String" code /> | `native`의 영어 발음. 영어에서는 `native`와 동일합니다. |
| `language` | `NameLanguage` | 이 이름이 생성된 언어. 여러 언어를 섞을 때 이 함수를 쓰는 이유입니다. |
| `gender` | `NameGender` | 이름을 뽑은 풀. |

## 예제

### 이름과 발음을 나란히

::: lang js

```javascript
for (const { native, roman } of randomNameDetails({ language: 'ja', count: 3 })) {
	console.log(`${native} (${roman})`);
}
// 山崎愛菜 (Yamazaki Aina)
// 加藤楓乃 (Kato Kaeno)
// 吉田直人 (Yoshida Naoto)
```

:::

::: lang dart

```dart
for (final detail in randomNameDetails(language: NameLanguage.ja, count: 3)) {
  print('${detail.native} (${detail.roman})');
}
// 山崎愛菜 (Yamazaki Aina)
// 加藤楓乃 (Kato Kaeno)
// 吉田直人 (Yoshida Naoto)
```

:::

### 섞인 결과가 무엇인지 알기

::: lang js

```javascript
randomNameDetails({ count: 3 });
// [
//   { native: '조동민', roman: 'Jo Dongmin', language: 'ko', gender: 'male' },
//   { native: 'Anna Mariani', roman: 'Anna Mariani', language: 'it', gender: 'female' },
//   { native: 'Иванов Иван', roman: 'Ivanov Ivan', language: 'ru', gender: 'male' }
// ]
```

:::

::: lang dart

```dart
randomNameDetails(count: 3);
// [
//   NameDetail(조동민, Jo Dongmin, ko, male),
//   NameDetail(Anna Mariani, Anna Mariani, it, female),
//   NameDetail(Иванов Иван, Ivanov Ivan, ru, male),
// ]
```

:::

### 성별이 겉으로 드러나는 경우

대부분의 언어는 이름이 어느 풀에서 왔는지 드러내지 않습니다. 러시아어는 예외입니다. 부칭과 성이 모두 굴절하기 때문에 선택 결과를 눈으로 확인할 수 있습니다.

::: lang js

```javascript
randomNameDetails({ language: 'ru', gender: 'female', includeMiddleName: true, count: 2 });
// [
//   { native: 'Людмила Николаевна Богданова', roman: 'Lyudmila Nikolaevna Bogdanova', … },
//   { native: 'Марина Максимовна Богданова', roman: 'Marina Maksimovna Bogdanova', … }
// ]
```

:::

::: lang dart

```dart
randomNameDetails(
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

## 함께 보기

- [`randomName`](./random-name) — 전체 옵션 표와, 같은 이름을 문자열로만 받는 방법.
- [지원 언어](../guide/languages#romanization) — 각 문자 체계가 영어 발음으로 옮겨지는 방식.
