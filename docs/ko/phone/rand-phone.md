# randPhone

전화번호를 만들어 `count`개만큼 돌려줍니다. 번호는 그 나라가 쓰는 방식으로 씁니다. 한국은 `010-4821-3967`, 미국은 `(415) 726-0193`, 러시아는 `8 (912) 345-67-89`입니다. 모든 번호는 그 나라의 번호 계획이 실제로 배정하는 대역으로 시작하므로 진짜 번호처럼 읽히고, 그 뒤의 숫자는 무작위입니다. [`includeCountryCode`](#formats)는 국제 형식으로 쓰고, [`separator`](#formats)는 그 나라의 구두점을 바꾸며, [`output: 'detail'`](#the-detail-output)은 E.164 형식을 함께 돌려줍니다.

::: warning 뽑은 번호가 누군가의 번호일 수 있습니다

번호는 실제로 쓰이는 대역으로 시작하고 무작위 숫자로 끝나므로, 개통된 번호이고 실제 개인이나 업체의 번호일 수 있습니다. 이는 무작위 추첨에서 생긴 우연일 뿐입니다. randino는 어떤 가입자도 알지 못하고, 실제 번호 목록을 갖고 있지 않으며, 번호를 확인하지도 않습니다. 번호는 입력 폼, 테스트 데이터, 화면 시안 같은 샘플 데이터로만 쓰고, **어떤 번호로도 전화하거나 문자·메시지를 보내지 마세요**. 누군가를 어떤 서비스에 가입시키는 일, 그 밖에 번호의 주인에게 닿거나 피해를 줄 수 있는 어떤 용도로도 쓰면 안 됩니다. [번호를 쓸 때](#using-the-numbers)를 보세요.

:::

전화번호는 언어가 아니라 나라가 정하는 방식으로 쓰므로, `randPhone`은 `language` 대신 `country`를 받습니다.

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

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 아무것도 넘기지 않은 `randPhone()`이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `country` | <Lang js="PhoneCountryOption" dart="PhoneCountry?" py="PhoneCountryOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 어느 나라의 번호인지. [국가](#countries)를 보세요. |
| `type` | <Lang js="PhoneTypeOption" dart="PhoneType?" py="PhoneTypeOption" code /> | <Lang js="'mobile'" dart="PhoneType.mobile" py="&quot;mobile&quot;" code /> | `mobile`(휴대전화), `landline`(유선전화), 또는 번호마다 둘 중 하나를 고르는 <Lang js="'all'" dart="null" py="&quot;all&quot;" code />. |
| <Lang js="includeCountryCode" dart="includeCountryCode" py="include_country_code" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 해외에서 걸 때의 형식으로 씁니다. [형식](#formats)을 보세요. |
| `separator` | <Lang js="string" dart="String?" py="str &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 그 나라의 구두점 대신 숫자 묶음 사이에 넣을 문자열. [형식](#formats)을 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 번호 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 번호를 두 번 돌려주지 않습니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 번호마다 `PhoneDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

샘플 인물이 폼에 적는 번호는 보통 휴대전화이므로 기본값은 휴대전화입니다. 미국은 두 종류를 같은 형식으로 쓰고 같은 지역 번호에서 뽑으므로, 거기서 `type`이 바꾸는 것은 상세 출력뿐입니다.

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

패키지의 다른 곳에서 null 열거값이 "모두"를 뜻하듯, `type`이 null이면 두 종류 중 하나를 뽑습니다. 매개변수의 기본값은 `PhoneType.mobile`입니다.

:::

::: lang py

```python
rand_phone(country="US", count=3)  # ['(415) 726-0193', '(917) 384-5520', '(312) 940-2271']
rand_phone(country="JP", type="landline", count=2)  # ['03-5412-7788', '045-321-6540']
rand_phone(type="all", count=3)  # ['0151 23456789', '0755 2345 6789', '612 34 56 78']
```

:::

## 국가 {#countries}

단어 풀이 다루는 언어마다 나라 하나씩이고, ISO 3166-1 alpha-2 코드로 고릅니다.

::: lang js

코드는 대소문자를 가리지 않으므로 `'kr'`도 `'KR'`입니다.

:::

::: lang dart

각 나라는 `PhoneCountry`이고, `PhoneCountry.kr.code`는 `'KR'`입니다.

:::

::: lang py

코드는 대소문자를 가리지 않으므로 `"kr"`도 `"KR"`입니다.

:::

| 코드 | 나라 | 국가 번호 | 휴대전화 | 유선전화 |
| --- | --- | --- | --- | --- |
| `US` | 미국 | `+1` | `(415) 726-0193` | `(212) 846-0147` |
| `KR` | 대한민국 | `+82` | `010-4821-3967` | `02-3456-7890`, `031-234-5678` |
| `JP` | 일본 | `+81` | `090-3718-2046` | `03-5412-7788`, `045-321-6540` |
| `CN` | 중국 | `+86` | `138 2873 1496` | `010 6512 3456`, `0755 2345 6789` |
| `VN` | 베트남 | `+84` | `091 234 5678` | `024 3826 1234`, `0236 382 1234` |
| `ES` | 스페인 | `+34` | `612 34 56 78` | `912 34 56 78` |
| `IT` | 이탈리아 | `+39` | `347 123 4567` | `06 4123 5678`, `011 523 4567` |
| `DE` | 독일 | `+49` | `0151 23456789`, `0171 2345678` | `030 23456789`, `0221 2345678` |
| `RU` | 러시아 | `+7` | `8 (912) 345-67-89` | `8 (495) 323-45-67` |

휴대전화 번호는 그 나라가 통신사에 배정하는 대역으로 시작하고, 유선전화 번호는 실제 도시의 지역 번호로 시작합니다. 한국은 서울과 나머지 16개 시·도, 일본은 도쿄와 오사카, 중국은 베이징과 선전, 이탈리아는 로마와 밀라노 같은 식입니다. 이 목록은 그 나라의 번호 계획을 대역 단위까지만 옮긴 것입니다. 번호 계획은 대역 안의 어느 번호가 개통됐는지 알려 주지 않기 때문입니다. 미국의 지역 번호는 50개 주와 워싱턴 D.C.에서 오래 써 온 것만 담았고, 캐나다나 카리브해 지역의 번호는 넣지 않았습니다. 국번은 `411` 같은 서비스 번호나 `555`가 되지 않습니다.

## 형식 {#formats}

옵션을 그대로 두면 그 나라 안에서 쓰는 방식대로, 국내 식별번호와 구두점까지 포함해 씁니다. <Lang js="includeCountryCode" dart="includeCountryCode" py="include_country_code" code />를 켜면 해외에서 걸 때의 형식으로 씁니다. `+`와 국가 번호를 앞에 붙이고, 국내에서만 누르는 식별번호를 뺍니다. 그래서 `010`은 `10`이 되고 러시아의 `8`은 사라집니다. 이탈리아만은 `0`을 남기는데, 이탈리아 유선전화의 `0`은 번호의 일부이기 때문입니다.

`separator`는 그 나라의 구두점을 모든 숫자 묶음 사이의 문자열 하나로 바꿉니다. `''`를 주면 숫자만 쓰고, <Lang js="includeCountryCode" dart="includeCountryCode" py="include_country_code" code />와 함께 쓰면 문자 발송 서비스나 데이터베이스 열이 기대하는 E.164 형식이 됩니다.

| 옵션 | 한국 | 미국 | 러시아 |
| --- | --- | --- | --- |
| 둘 다 없음 | `010-4821-3967` | `(415) 726-0193` | `8 (912) 345-67-89` |
| <Lang js="includeCountryCode" dart="includeCountryCode" py="include_country_code" code /> | `+82 10-4821-3967` | `+1 415-726-0193` | `+7 912 345-67-89` |
| `separator: ''` | `01048213967` | `4157260193` | `89123456789` |
| 둘 다, `''`로 | `+821048213967` | `+14157260193` | `+79123456789` |
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

구분자로 구두점을 바꿔도 국내 식별번호는 그 나라가 두는 자리에 그대로 있습니다. 한국은 첫 묶음에 붙고(`010-…`), 러시아는 따로 한 묶음이 됩니다(`8-912-…`).

## 상세 출력 {#the-detail-output}

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

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randPhone`과 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_phone(country="JP", output="detail")
# [PhoneDetail(phone='090-3718-2046', e164='+819037182046', country='JP',
#              calling_code='81', type='mobile')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `phone` | <Lang js="string" dart="String" py="str" code /> | 옵션이 정한 방식대로 쓴 번호. |
| `e164` | <Lang js="string" dart="String" py="str" code /> | 옵션과 관계없이 E.164로 쓴 같은 번호. `+819037182046`처럼 씁니다. |
| `country` | `PhoneCountry` | 번호가 속한 나라. |
| <Lang js="callingCode" dart="callingCode" py="calling_code" code /> | <Lang js="string" dart="String" py="str" code /> | `+`를 뺀 국가 번호. `'81'`처럼 씁니다. |
| `type` | `PhoneType` | `mobile` 또는 `landline`. |

번호를 여러 방식으로 보여 줘야 한다면 `e164`를 저장하세요. 다른 모든 형식을 여기서 다시 쓸 수 있고, `phone`을 어떻게 썼든 값이 같습니다.

## 번호를 쓸 때 {#using-the-numbers}

randino는 나라별 번호 계획의 모양과 무작위 숫자로 번호를 뽑습니다. 번호를 조회하지 않고, 누가 그 번호를 쓰는지 알지 못하며, 개통된 번호와 그렇지 않은 번호를 구별하지도 못합니다. 그러므로 **실제 번호와 같은 번호가 나온다면 그것은 무작위 추첨에서 생긴 우연**입니다. 실제 번호로 밝혀진 번호도 샘플 값일 뿐입니다.

- 번호로 아무것도 보내지 않는 곳에서만 쓰세요. 테스트 중인 가입 폼, 시드 데이터베이스, 스크린숏, 화면 시안이 그런 곳입니다.
- 테스트에서 문자를 보내거나 전화를 건다면, 직접 가진 번호나 문자·전화 서비스 업체가 테스트용으로 정해 둔 번호로 보내세요. 여기서 뽑은 번호로는 보내지 마세요.
- 누군가에게 연락하거나, 괴롭히거나, 스팸을 보내거나, 사기를 치거나, 다른 사람을 사칭하거나, 본인 인증을 우회하는 일처럼 악의적인 목적으로 번호를 쓰지 마세요. 뽑힌 번호의 주인은 여러분의 데이터에 들어가는 데 동의한 적이 없습니다.

## 함께 보기 {#see-also}

- [`randName`](../name/rand-name) — 번호와 함께 쓸 이름.
- [`randLocation`](../location/rand-location) — 한국이나 미국 번호와 함께 쓸 실제 장소.
