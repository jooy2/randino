# randOrganization

존재하지 않는 조직의 이름을 만들어 `count`개만큼 문자열로 돌려줍니다. 회사, 학교, 관공서, 공공기관, 단체를 그 언어가 해당 종류의 조직을 적는 방식대로 씁니다. 회사에는 `Inc.`, `(주)`, `GmbH` 같은 법인 형태가 붙을 수 있습니다. [`output: 'detail'`](#the-detail-output)을 주면 이름을 이룬 조각도 알려 줍니다.

::: lang js

```javascript
import { randOrganization } from 'randino';

randOrganization({ language: 'ko', count: 3 });
// ['(주)가람에너지', '윤슬교육지원청', '새솔홀딩스']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randOrganization(language: WordLanguage.ko, count: 3);
// [(주)가람에너지, 윤슬교육지원청, 새솔홀딩스]
```

:::

::: lang py

```python
from randino import rand_organization

rand_organization(language="ko", count=3)
# ['(주)가람에너지', '윤슬교육지원청', '새솔홀딩스']
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 아무것도 주지 않은 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 조직 이름의 언어. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />이면 결과마다 언어를 하나씩 고릅니다. |
| `type` | <Lang js="OrganizationTypeOption" dart="Set&lt;OrganizationType&gt;?" py="OrganizationTypeOption &#124; None" code /> | <Lang js="'all'" dart="null" py="None" code /> | 어떤 [종류](#kinds)의 조직인지. 생략하면 결과마다 종류를 고르며, 회사가 가장 자주 나옵니다. |
| `industry` | <Lang js="OrganizationIndustryOption" dart="OrganizationIndustry?" py="OrganizationIndustryOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 회사가 하는 일. [업종](#industries)을 보세요. |
| <Lang js="includeLegalForm" dart="includeLegalForm" py="include_legal_form" code /> | <Lang js="boolean" dart="bool?" py="bool &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 회사의 [법인 형태](#legal-forms)를 쓸지. 생략하면 회사마다 정합니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 조직 개수. `0` … `10000`으로 제한됩니다. |
| `realism` | `RandRealism` | <Lang js="`'real'`" dart="`RandRealism.real`" py="`\"real\"`" /> | [고유 이름](#names-nobody-has)을 데이터에 있는 낱말로 쓸지, 그 언어처럼 들리게 지어낼지. `mixed`는 결과마다 정합니다. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _제한 없음_ | 법인 형태까지 포함한 전체의 최소 글자 수. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _제한 없음_ | 전체의 최대 글자 수. `60`까지로 제한됩니다. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | 이름이 이 글자로 시작하는 조직만 남깁니다. 이름 앞에 붙은 법인 형태는 이름의 시작으로 치지 않습니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 조직을 두 번 돌려주지 않습니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 조직마다 `OrganizationDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 조직의 종류 {#kinds}

`type`에는 종류 하나, 또는 여러 종류를 줍니다. 생략하면 모든 종류가 나오며, 회사가 가장 자주 나옵니다.

| 종류         | 비율 | 한국어           | 영어                          |
| ------------ | ---: | ---------------- | ----------------------------- |
| `company`    |  40% | `(주)새솔테크`   | `Greenbriar Logistics Corp.`  |
| `school`     |  20% | `가람초등학교`   | `Oak Hollow University`       |
| `nonprofit`  |  15% | `새솔장학재단`   | `Lakemont Historical Society` |
| `public`     |  15% | `해솔시립도서관` | `Oakmont Public Library`      |
| `government` |  10% | `윤슬교육지원청` | `Westbrook Police Department` |

`public`은 관공서가 아니면서 공공을 위해 운영되는 기관입니다. 도서관, 병원, 박물관, 교통공사가 여기에 듭니다. `nonprofit`은 협회, 재단, 동호회 같은 단체입니다.

::: lang js

```javascript
randOrganization({ language: 'de', type: ['school', 'public'], count: 3 });
// ['Gymnasium Eschenhain', 'Berufsschule Rabenstein', 'Stadtbibliothek Tannenhof']
```

:::

::: lang dart

```dart
randOrganization(
  language: WordLanguage.de,
  type: {OrganizationType.school, OrganizationType.public},
  count: 3,
);
// [Gymnasium Eschenhain, Berufsschule Rabenstein, Stadtbibliothek Tannenhof]
```

:::

::: lang py

```python
rand_organization(language="de", type=("school", "public"), count=3)
# ['Gymnasium Eschenhain', 'Berufsschule Rabenstein', 'Stadtbibliothek Tannenhof']
```

:::

언어마다 종류별로 자기 어순과 낱말로 씁니다. 스페인어 회사는 업종을 이름 앞에 두고(`Construcciones Valdecastro`) 독일어 회사는 뒤에 둡니다(`Bergtal Bau`). 중국어 회사는 등록한 도시 이름으로 시작하고(`重庆恒远仓储有限责任公司`), 러시아어 학교·의원·소방서는 번호로 불립니다(`Гимназия № 135`). 독일어 협회는 `e.V.`를 이름의 일부로 씁니다(`Heimatverein Bergtal e.V.`).

## 업종 {#industries}

`industry`는 회사가 하는 일이며, 그 업종을 나타내는 낱말로 이름에 들어갑니다.

| 업종            | 영어                     | 한국어         |
| --------------- | ------------------------ | -------------- |
| `tech`          | Technologies, Software   | 테크, 정보통신 |
| `manufacturing` | Manufacturing, Precision | 정밀, 기계     |
| `food`          | Foods, Bakery            | 식품, 제과     |
| `retail`        | Trading, Mercantile      | 유통, 상사     |
| `finance`       | Capital, Investments     | 캐피탈, 투자   |
| `construction`  | Construction, Builders   | 건설, 건축     |
| `logistics`     | Logistics, Freight       | 물류, 운송     |
| `media`         | Media, Studios           | 미디어, 출판   |
| `health`        | Pharmaceuticals, Medical | 제약, 바이오   |
| `energy`        | Energy, Solar            | 에너지, 전력   |

업종은 회사에만 있으므로, `type`을 생략한 채 업종을 주면 회사만 나옵니다. `type`에 다른 종류도 함께 주면 그중 회사만 업종으로 좁히고 나머지는 그대로 둡니다.

::: lang js

```javascript
randOrganization({ language: 'en', industry: 'logistics', count: 3 });
// ['Greenbriar Logistics Corp.', 'Larkspur Courier, Inc.', 'Elmwood Courier LLC']
```

:::

::: lang dart

```dart
randOrganization(language: WordLanguage.en, industry: OrganizationIndustry.logistics, count: 3);
// [Greenbriar Logistics Corp., Larkspur Courier, Inc., Elmwood Courier LLC]
```

:::

::: lang py

```python
rand_organization(language="en", industry="logistics", count=3)
# ['Greenbriar Logistics Corp.', 'Larkspur Courier, Inc.', 'Elmwood Courier LLC']
```

:::

업종을 주지 않으면 회사는 열 가지 업종 중 하나를 고릅니다. 다만 다섯 곳 중 한 곳은 업종을 말하지 않는 낱말(`Holdings`, `그룹`, `集团`)을 달고, 또 다섯 곳 중 한 곳은 고유 이름과 법인 형태만으로 이루어집니다(`Larkspur, Inc.`). 이 두 경우는 업종을 알려 주지 않습니다.

## 법인 형태 {#legal-forms}

회사에는 그 언어가 쓰는 법인 형태가 이름 앞이나 뒤에 붙을 수 있습니다.

| 코드 | 법인 형태                                                      |
| ---- | -------------------------------------------------------------- |
| `en` | `Inc.`, `LLC`, `Corp.`, `Co.`, `Ltd.`                          |
| `ko` | `주식회사`, `(주)`, `유한회사`                                 |
| `ja` | `株式会社`, `有限会社`, `合同会社`                             |
| `zh` | `有限公司`, `股份有限公司`, `有限责任公司`                     |
| `vi` | `Công ty TNHH`, `Công ty Cổ phần`, `Công ty TNHH MTV`          |
| `es` | `S.A.`, `S.L.`, `S.A. de C.V.`                                 |
| `it` | `S.r.l.`, `S.p.A.`, `S.n.c.`, `S.a.s.`                         |
| `de` | `GmbH`, `AG`, `GmbH & Co. KG`, `KG`, `UG (haftungsbeschränkt)` |
| `ru` | `ООО`, `АО`, `ПАО`                                             |

<Lang js="includeLegalForm" dart="includeLegalForm" py="include_legal_form" code />을 생략하면 회사마다 반반의 확률로 정합니다. 켜면 모든 회사에 붙고, 끄면 어느 회사에도 붙지 않습니다. 끄면 고유 이름만으로 된 회사도 나오지 않는데, 법인 형태 없는 고유 이름은 회사로 알아보기 어렵기 때문입니다. 법인 형태는 회사에만 붙습니다.

::: lang js

```javascript
randOrganization({ language: 'ja', type: 'company', includeLegalForm: true, count: 3 });
// ['有限会社東雲キャピタル', '株式会社翔栄', '合同会社若葉乳業']
```

:::

::: lang dart

```dart
randOrganization(
  language: WordLanguage.ja,
  type: {OrganizationType.company},
  includeLegalForm: true,
  count: 3,
);
// [有限会社東雲キャピタル, 株式会社翔栄, 合同会社若葉乳業]
```

:::

::: lang py

```python
rand_organization(language="ja", type="company", include_legal_form=True, count=3)
# ['有限会社東雲キャピタル', '株式会社翔栄', '合同会社若葉乳業']
```

:::

## 실존하지 않는 이름 {#names-nobody-has}

모든 조직은 조각을 이어 만들었으므로 실제 조직이 아닙니다. 조직 고유의 이름 부분(`새솔테크`의 `새솔`)은 언어마다 누구의 상표도 아니도록 고른 목록에서 나옵니다. 목록의 어느 낱말도 단독으로든 업종 낱말을 붙여서든 널리 알려진 회사의 이름이 되지 않습니다. 회사 이름에 사람의 성도 쓰지 않습니다. 성 뒤에 법인 형태를 붙인 것이 바로 많은 유명 회사의 이름이라, 성을 뽑는 생성기는 그런 이름을 쓰게 됩니다.

그래도 흔한 이름은 어딘가의 작은 가게나 학교 이름과 겹칠 수 있습니다. `Riverside High School`이 수백 곳의 학교 이름인 것과 같습니다. 이것이 문제라면 `realism: 'invented'`를 주세요. 고유 이름을 그 언어의 소리로 지어내므로(`Caiwi, Inc.`, `솔람테크`), 그 언어처럼 읽히지만 어떤 낱말도 아닌 이름이 됩니다. 목록에 그 글자로 시작하는 이름이 없는 <Lang js="startsWith" dart="startsWith" py="starts_with" code />는 `realism`과 관계없이 그 글자로 시작하도록 지어낸 이름으로 답합니다.

## 길이 {#length}

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 법인 형태까지 포함한 전체 길이이며, 직접 주기 전에는 제한이 없습니다. 범위 안에 들어올 수 없는 모양은 고르기 전에 빼므로, 한국어 조직에 12자 이상을 요구하면 짧은 이름을 늘이지 않고 긴 종류를 씁니다(`주식회사 은빛그린에너지`). 어떤 조직도 닿지 않는 범위에는 가장 가까운 조직으로 답합니다. 가장 긴 이름이 40자를 넘기 때문에(`Công ty TNHH MTV Giải pháp Công nghệ Thịnh Vượng`) 상한은 `60`입니다.

## 상세 출력 {#the-detail-output}

::: lang js

```javascript
randOrganization({ language: 'ko', type: 'company', includeLegalForm: true, output: 'detail' });
// [{ organization: '(주)새솔테크', name: '새솔테크', legalForm: '(주)',
//    type: 'company', industry: 'tech', language: 'ko' }]
```

:::

::: lang dart

```dart
randOrganizationDetails(language: WordLanguage.ko, type: {OrganizationType.company}).first;
// OrganizationDetail((주)새솔테크, 새솔테크, (주), company, tech, ko)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randOrganization`과 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_organization(language="ko", type="company", include_legal_form=True, output="detail")
# [OrganizationDetail(organization='(주)새솔테크', name='새솔테크', legal_form='(주)',
#                     type='company', industry='tech', language='ko')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `organization` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 전체 이름. |
| `name` | <Lang js="string" dart="String" py="str" code /> | 법인 형태를 뺀 이름. 간판이나 목록에는 보통 이 이름을 씁니다. |
| <Lang js="legalForm" dart="legalForm" py="legal_form" code /> | <Lang js="string &#124; null" dart="String?" py="str &#124; None" code /> | 법인 형태만 따로. 없으면 <Lang js="null" dart="null" py="None" code />입니다. |
| `type` | `OrganizationType` | 조직의 종류. |
| `industry` | <Lang js="OrganizationIndustry &#124; null" dart="OrganizationIndustry?" py="OrganizationIndustry &#124; None" code /> | 이름이 말하는 회사의 업종. 이름이 업종을 말하지 않거나 회사가 아니면 <Lang js="null" dart="null" py="None" code />입니다. |
| `language` | `WordLanguage` | 조직 이름의 언어. |

## 함께 보기 {#see-also}

- [`randName`](../name/rand-name) — 그곳에서 일할 사람.
- [`randLocation`](../location/rand-location) — 조직이 있을 실제 장소.
