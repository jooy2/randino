# randFictionalName

소설이나 게임의 등장인물 이름을 만들어 `count`개만큼 문자열로 돌려줍니다. 한 나라 실제 사람들의 이름이 아니라, 소설·게임·TRPG가 등장인물에게 붙이는 이름입니다. 이름은 영미권 이름을 비롯해 라틴 문자로 먼저 정해지고, 다른 언어에서는 소리대로 적습니다. 그래서 `Artemis`는 한국어로 `아르테미스`, 일본어로 `アルテミス`입니다. [언어 목록](#several-languages)을 주면 이름마다 그 모든 언어로 적은 결과를 언어 코드별로 돌려줍니다. 한 인물을 플레이어마다 자기 언어로 보여 주는 게임에 쓰라는 기능입니다.

::: lang js

```javascript
import { randFictionalName } from 'randino';

randFictionalName({ language: 'en', count: 3 }); // ['Alice', 'Arsis', 'Emily']
randFictionalName({ language: 'ko', gender: 'female', count: 3 }); // ['앨리스', '트리아', '베리']
randFictionalName({ language: 'ja', includeSurname: true }); // ['アスター・シンクレア']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFictionalName(language: WordLanguage.en, count: 3); // [Alice, Arsis, Emily]
randFictionalName(language: WordLanguage.ko, gender: NameGender.female, count: 3);
// [앨리스, 트리아, 베리]
randFictionalName(language: WordLanguage.ja, includeSurname: true); // [アスター・シンクレア]
```

:::

::: lang py

```python
from randino import rand_fictional_name

rand_fictional_name(language="en", count=3)  # ['Alice', 'Arsis', 'Emily']
rand_fictional_name(language="ko", gender="female", count=3)  # ['앨리스', '트리아', '베리']
rand_fictional_name(language="ja", include_surname=True)  # ['アスター・シンクレア']
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 아무것도 주지 않은 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | <Lang js="FictionalLanguageOption" dart="WordLanguage?" py="FictionalLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 이름을 쓸 언어. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />은 이름마다 하나를 고르고, [목록](#several-languages)을 주면 이름마다 목록의 모든 언어로 적습니다. |
| `gender` | <Lang js="NameGenderOption" dart="NameGender?" py="NameGenderOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 남자 이름, 여자 이름, 또는 이름마다 둘 중 하나. |
| <Lang js="includeSurname" dart="includeSurname" py="include_surname" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 이름 뒤에 성을 붙입니다. 이야기 속 인물은 대개 이름 하나로 불리므로 기본은 꺼져 있습니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 이름 개수. `0` … `10000`으로 제한됩니다. |
| `realism` | `RandRealism` | <Lang js="`'real'`" dart="`RandRealism.real`" py="`\"real\"`" /> | 각 부분을 데이터에 있는 이름에서 뽑을지, 음절을 이어 [새로 만들지](#invented-names). `mixed`는 부분마다 정합니다. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _제한 없음_ | 성까지 포함한 전체 이름의 최소 길이. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _제한 없음_ | 전체 이름의 최대 길이. `40`으로 제한됩니다. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | 이 글자로 시작하는 이름만 남깁니다. 이름을 적은 언어의 글자로 비교합니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 이름을 두 번 돌려주지 않습니다. 언어만 다른 같은 이름도 하나로 셉니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 이름마다 `FictionalNameDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 등장인물의 이름 {#a-name-for-a-character}

[`randName`](../name/rand-name)은 한 나라 사람들이 실제로 쓰는 이름을 만들고, `realism: 'invented'`에서도 그 언어처럼 읽히는 이름(`김두다`, `Patrick Silver`)을 지어냅니다. [`randNickname`](../nickname/rand-nickname)은 일상 단어로 닉네임을 만듭니다. 이 함수는 이야기가 등장인물에게 붙이는 이름을 만듭니다. `Alice`, `Arsis`, `Berry`, `Tria`, `Emily` 같은 이름입니다.

대부분은 영어, 웨일스어, 아일랜드어, 북유럽, 그리스, 라틴 이름처럼 실제로 쓰는 이름이고, 나머지는 그 옆에 놓일 만하게 지어낸 이름입니다. 이야기 속 인물들도 대개 이 둘이 섞여 있습니다. 유명한 작품 하나에만 속한 이름은 넣지 않았습니다. `Arwen`, `Yennefer`, `Arthas`는 그 작품의 이름이라 빠졌고, `Guinevere`, `Artemis`, `Freya`는 아서왕 전설과 그리스·북유럽 신화가 모두의 이야기라서 들어 있습니다.

남자 이름이 약 220개, 여자 이름이 약 230개, 성이 약 150개입니다.

## 모든 언어로 같은 이름 {#one-name-in-every-language}

지어낸 이름은 어느 언어로 적어도 같은 이름입니다. 라틴 문자로 정해 두고, 다른 언어는 번역 소설이나 현지화한 게임처럼 소리대로 적습니다.

| 언어                         | `Artemis`    | `Elara Blackwood`        |
| ---------------------------- | ------------ | ------------------------ |
| `en`, `vi`, `es`, `it`, `de` | `Artemis`    | `Elara Blackwood`        |
| `ko`                         | `아르테미스` | `엘라라 블랙우드`        |
| `ja`                         | `アルテミス` | `エララ・ブラックウッド` |
| `zh`                         | `阿尔忒弥斯` | `埃拉拉·布莱克伍德`      |
| `ru`                         | `Артемис`    | `Элара Блэквуд`          |

영어, 베트남어, 스페인어, 이탈리아어, 독일어는 지어낸 이름을 철자 그대로 씁니다. 일본어와 중국어는 다른 외국 이름처럼 이름과 성 사이에 가운뎃점을 찍습니다. 표기는 글자를 하나씩 옮긴 것이 아니라 그 언어 독자가 그 이름에 기대하는 표기입니다. `Alice`는 `앨리스`, `Элис`이고, 중국어에서 여자 이름은 여자 이름에 쓰는 글자를 씁니다(`爱丽丝`).

`startsWith`는 이름을 적은 언어의 첫 글자로 비교합니다. `startsWith: '아'`는 `아`로 시작하는 한국어 이름을 찾습니다. 일본어는 이 이름들을 가타카나로 적으므로, 히라가나로 주면 같은 가타카나로 읽습니다. `あ`로 `アリス`를 찾습니다.

## 여러 언어로 한 번에 {#several-languages}

게임이나 책은 같은 인물을 플레이어마다 그 사람의 언어로 보여 줍니다. 그래서 `language`에는 목록도 줄 수 있고, 목록을 주면 이름마다 목록의 모든 언어로 적은 결과를 준 순서대로 언어 코드에 담아 돌려줍니다.

::: lang js

```javascript
randFictionalName({ language: ['ko', 'en', 'ja'], count: 2 });
// [{ ko: '아르테미스', en: 'Artemis', ja: 'アルテミス' },
//  { ko: '앨리스', en: 'Alice', ja: 'アリス' }]
```

반환 타입도 목록을 따릅니다. `form.ko`는 `string`이고, 요청하지 않은 언어는 읽을 수 없습니다.

:::

::: lang dart

```dart
randFictionalNameForms({WordLanguage.ko, WordLanguage.en, WordLanguage.ja}, count: 2);
// [{WordLanguage.ko: 아르테미스, WordLanguage.en: Artemis, WordLanguage.ja: アルテミス},
//  {WordLanguage.ko: 앨리스, WordLanguage.en: Alice, WordLanguage.ja: アリス}]
```

Dart는 인자에 따라 반환 타입을 바꿀 수 없어서 목록은 별도 함수 `randFictionalNameForms`로 받습니다. 언어를 첫 인자로 받고, 나머지는 `randFictionalName`과 같은 이름 있는 매개변수입니다. 집합은 적은 순서를 유지하고, 그 순서가 각 맵의 순서입니다.

:::

::: lang py

```python
rand_fictional_name(language=["ko", "en", "ja"], count=2)
# [{'ko': '아르테미스', 'en': 'Artemis', 'ja': 'アルテミス'},
#  {'ko': '앨리스', 'en': 'Alice', 'ja': 'アリス'}]
```

:::

이름은 목록의 첫 언어로 뽑고 나머지 언어로 옮겨 적습니다. 그래서 `startsWith`와 길이 범위는 첫 언어를 기준으로 봅니다. 한국어로 시작하는 목록에 `maxLength: 4`를 주면 영어 표기가 몇 글자가 되든 한국어 이름을 네 글자 이하로 맞춥니다. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />은 목록이 아니라서, 다른 생성 함수처럼 이름마다 언어 하나를 고릅니다. `unique`는 이름 자체를 비교하므로 `Artemis`와 `아르테미스`는 하나로 셉니다.

## 지어낸 이름 {#invented-names}

`realism: 'invented'`는 이름을 뽑는 대신 음절을 이어 만듭니다. 첫 음절, 많아야 하나인 가운데 음절, 그리고 남자 이름인지 여자 이름인지 정하는 끝 음절입니다. `Al`과 `dric`은 `Aldric`, `Va`, `le`, `ria`는 `Valeria`가 됩니다. 음절마다 모든 문자의 표기를 갖고 있어서, 지어낸 이름도 아홉 언어로 한꺼번에 적힙니다. `Ed`와 `lyn`은 `Edlyn`, `에들린`, `エドリン`, `埃德琳`, `Эдлин`입니다. 성은 `Black`과 `wood`처럼 영어 단어 두 개를 이어 같은 방식으로 만듭니다.

이렇게 만들 수 있는 이름은 수만 개입니다. 아홉 언어 어디에서도 실제 나라 이름이 되지 않고, 유명한 등장인물이나 지명이 되지 않고, 어느 언어로도 욕설로 읽히지 않습니다. 테스트가 만들 수 있는 이름을 전부 확인해서 이를 지킵니다. `realism: 'mixed'`는 부분마다 정하므로, 데이터에 있는 이름에 지어낸 성이 붙을 수 있습니다.

::: lang js

```javascript
randFictionalName({ language: 'en', realism: 'invented', count: 5 });
// ['Ganora', 'Ordan', 'Ralyn', 'Melmus', 'Serseran']
randFictionalName({ language: 'ko', realism: 'invented', count: 3 }); // ['말마르', '칼피란', '에르노르']
```

:::

::: lang dart

```dart
randFictionalName(language: WordLanguage.en, realism: RandRealism.invented, count: 5);
// [Ganora, Ordan, Ralyn, Melmus, Serseran]
```

:::

::: lang py

```python
rand_fictional_name(language="en", realism="invented", count=5)
# ['Ganora', 'Ordan', 'Ralyn', 'Melmus', 'Serseran']
```

:::

데이터에 그 글자로 시작하는 이름이 없으면 `realism`과 상관없이 그 글자로 시작하는 이름을 지어서 답합니다.

## 길이 {#length}

<Lang js="minLength" dart="minLength" py="min_length" code />와 <Lang js="maxLength" dart="maxLength" py="max_length" code />는 이름을 적은 언어 기준으로 성까지 포함한 전체 길이입니다. 맞을 때까지 다시 뽑지 않고, 처음부터 범위에 들어가도록 고릅니다. 성은 이름이 들어갈 자리를 남기도록 고르고, 그 언어에서 남자 이름과 여자 이름 중 한쪽만 범위에 닿으면 그쪽을 씁니다. 여러 언어를 섞을 때는 범위에 닿지 못하는 언어를 빼고, 아무것도 닿지 않으면 가장 가까운 길이의 이름으로 답합니다.

## 상세 출력 {#the-detail-output}

::: lang js

```javascript
randFictionalName({ language: ['en', 'zh'], includeSurname: true, output: 'detail' });
// [{ name: 'Elara Blackwood', gender: 'female', language: 'en',
//    forms: { en: 'Elara Blackwood', zh: '埃拉拉·布莱克伍德' } }]
```

:::

::: lang dart

```dart
randFictionalNameDetails(language: {WordLanguage.en, WordLanguage.zh}, includeSurname: true).first;
// FictionalNameDetail(Elara Blackwood, female, en, {en: Elara Blackwood, zh: 埃拉拉·布莱克伍德})
```

Dart에는 오버로드도 유니언 타입도 없어서 상세 출력은 별도 함수입니다. `randFictionalName`과 같은 매개변수를 받되, `language`는 집합입니다. 언어 하나를 주거나, 다른 두 패키지의 목록처럼 `forms`를 여러 언어로 받으려면 여러 개를 줍니다.

:::

::: lang py

```python
rand_fictional_name(language=["en", "zh"], include_surname=True, output="detail")
# [FictionalNameDetail(name='Elara Blackwood', gender='female', language='en',
#                      forms={'en': 'Elara Blackwood', 'zh': '埃拉拉·布莱克伍德'})]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `name` | <Lang js="string" dart="String" py="str" code /> | `language`로 적은 이름. 언어 하나를 준 호출이 돌려주는 문자열입니다. |
| `gender` | `NameGender` | 남자 이름인지 여자 이름인지. |
| `language` | `WordLanguage` | `name`을 적은 언어. 고른 언어이거나 목록의 첫 언어입니다. |
| `forms` | <Lang js="Partial&lt;Record&lt;WordLanguage, string&gt;&gt;" dart="Map&lt;WordLanguage, String&gt;" py="dict[WordLanguage, str]" code /> | 요청한 모든 언어로 적은 같은 이름. 요청한 순서대로 담기며, 목록을 준 호출이 돌려주는 값입니다. |

이름이 실제 사람이나 어떤 작품의 인물과 우연히 같을 수 있습니다. [면책 조항](../guide/disclaimer#coincidence)을 보세요.

## 함께 보기 {#see-also}

- [`randFictionalCountry`](./rand-fictional-country)를 비롯한 장소 함수: 인물이 사는 세계의 지도.
- [`randName`](../name/rand-name): 한 언어의 실제 사람 이름.
- [`randNickname`](../nickname/rand-nickname): 일상 단어로 만든 닉네임.
