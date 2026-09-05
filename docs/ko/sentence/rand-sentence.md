# randSentence

문장을 만들어 `count`개를 문자열로 돌려줍니다. 각 문장은 주어와 그에 대해 말하는 것으로 이루어지며, 그 언어가 실제로 쓰는 방식으로 적힙니다. 한국어 명사가 요구하는 조사, 이탈리아어 명사가 앞에 두는 관사, 독일어 동사가 절대 내주지 않는 두 번째 자리까지 그렇습니다. [`output: 'detail'`](#the-detail-output)을 주면 문자열 대신 사용한 구를 함께 알려줍니다.

::: lang js

```javascript
import { randSentence } from 'randino';

randSentence();
// ['The satin ranger dances in the plush harborside.']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randSentence();
// ['The satin ranger dances in the plush harborside.']
```

:::

::: lang py

```python
from randino import rand_sentence

rand_sentence()
# ['The satin ranger dances in the plush harborside.']
```

:::

단어는 [`randWord`](../word/rand-word)가 뽑는 것과 같은 일상 어휘이며, **사람 이름은 쓰지 않습니다.** 문장이 거기에 더하는 것은 문법입니다. 형태와 동사가 무엇을 어디에 세울지 정하는 방식은 [문장](./)에서 설명합니다.

## 옵션 {#options}

모든 옵션은 선택이며, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 생성할 문장의 언어. <Lang js="'all'" dart="null" py="&quot;all&quot;" code />은 문장마다 하나씩 골라 모든 언어를 섞습니다. |
| `theme` | <Lang js="WordThemeOption" dart="WordTheme?" py="WordThemeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 문장의 **주어**가 무엇에 관한 것인지. [테마](../word/themes) 참고. |
| `type` | <Lang js="SentenceTypeOption" dart="Set&lt;SentenceType&gt;?" py="SentenceTypeOption" code /> | <Lang js="'statement'" dart="null" py="&quot;statement&quot;" code /> | 문장이 무엇을 하는지. [묻고, 외치고, 말끝을 흐리기](#asking-exclaiming-trailing-off) 참고. |
| `quote` | <Lang js="SentenceQuote" dart="SentenceQuote?" py="SentenceQuote &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 인용된 문장이 어떤 따옴표를 쓸지. [대사와 생각](#dialogue-and-thought) 참고. |
| `style` | `SentenceStyle` | 무작위 | 어느 화계로 쓸지. [화계](#politeness) 참고. |
| `shape` | <Lang js="SentenceShapeOption" dart="SentenceShape?" py="SentenceShapeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 문장이 얼마나 많은 것을 말하는지. [얼마나 말할지](#how-much-it-says) 참고. |
| `slots` | <Lang js="SentenceSlotOption" dart="Set&lt;SentenceSlot&gt;?" py="SentenceSlotOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 주어 옆에 무엇을 두는지. [형태 고르기](#picking-the-shape)와 [수량과 금액](#counting-and-money) 참고. |
| `include` | <Lang js="string &#124; string[]" dart="List&lt;String&gt;" py="str &#124; Sequence[str]" code /> | <Lang js="—" dart="const []" py="()" code /> | 모든 문장에 반드시 들어가야 할 단어. [반드시 넣을 단어](#words-it-has-to-contain) 참고. |
| `sentences` | <Lang js="number" dart="int" py="int" code /> | `1` | 결과 하나에 담을 문장 수. [문장을 여러 개](#more-than-one-sentence) 참고. |
| <Lang js="includeName" dart="includeName" py="include_name" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 사람이 설 자리에 사람 이름을 씁니다. [사람 이름](#a-persons-name) 참고. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 문장 개수. `0` … `10000`으로 제한됩니다. |
| `realism` | `RandRealism` | <Lang js="`'real'`" dart="`RandRealism.real`" py="`\"real\"`" /> | `real`은 실제 단어를, `invented`는 그 언어처럼 읽히기만 하는 단어를 씁니다. `mixed`는 단어마다 정합니다. 문법은 어느 쪽이든 실제 그대로입니다. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어_ | 문장 부호를 포함한 최소 글자 수. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _언어_ | 최대 글자 수. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | 이 글자로 시작하는 문장만 남깁니다. 관사를 쓰는 언어에서는 그 글자가 관사의 첫 글자입니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 문장을 두 번 돌려주지 않습니다. `count`보다 적게 돌아올 수 있습니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 문장마다 `SentenceDetail` 하나. Dart에는 이 옵션이 없습니다. [상세 출력](#the-detail-output) 참고. |

두 길이 옵션은 다른 생성기가 쓰는 상한이 아니라 **문장 하나당** <Lang js="RAND_SENTENCE_LENGTH_MAX" dart="randSentenceLengthMax" py="RAND_SENTENCE_LENGTH_MAX" code />으로 제한됩니다. 이름과 단어와 닉네임은 길어야 세 단어지만 문장은 여러 단어이고, 열 문장짜리 결과에는 그 열 배까지 허용됩니다.

## 모든 언어 {#every-language}

::: lang js

```javascript
randSentence({ language: 'ko', count: 3 });
// ['베이글은 짜다.', '커다란 조종사가 밀물에서 파란 요구르트를 굽는다.', '기상학자가 다시 톱을 닦는다.']

randSentence({ language: 'ja', count: 3 });
// ['さっき作業着が揺れる。', '昼に紫が派手な海王星で消える。', 'ハンバーガーが暗礁で冷める。']

randSentence({ language: 'zh', count: 3 });
// ['周末肉丸沸腾。', '巨乌贼又品尝朱红椰汁。', '明亮眼球总是移动。']

randSentence({ language: 'de', count: 3 });
// ['Eine junge Umlaufbahn fließt kaum.', 'Ein Nudelgericht kocht.', 'Eine Milz bebt.']

randSentence({ language: 'ru', count: 3 });
// ['Полый коньяк остывает.', 'Тимьян снова вянет.', 'Спутанный юпитер едва светлеет.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.ko, count: 3);
// [베이글은 짜다., 커다란 조종사가 밀물에서 파란 요구르트를 굽는다., 기상학자가 다시 톱을 닦는다.]

randSentence(language: WordLanguage.ja, count: 3);
// [さっき作業着が揺れる。, 昼に紫が派手な海王星で消える。, ハンバーガーが暗礁で冷める。]

randSentence(language: WordLanguage.zh, count: 3);
// [周末肉丸沸腾。, 巨乌贼又品尝朱红椰汁。, 明亮眼球总是移动。]

randSentence(language: WordLanguage.de, count: 3);
// [Eine junge Umlaufbahn fließt kaum., Ein Nudelgericht kocht., Eine Milz bebt.]

randSentence(language: WordLanguage.ru, count: 3);
// [Полый коньяк остывает., Тимьян снова вянет., Спутанный юпитер едва светлеет.]
```

:::

::: lang py

```python
rand_sentence(language="ko", count=3)
# ['베이글은 짜다.', '커다란 조종사가 밀물에서 파란 요구르트를 굽는다.', '기상학자가 다시 톱을 닦는다.']

rand_sentence(language="ja", count=3)
# ['さっき作業着が揺れる。', '昼に紫が派手な海王星で消える。', 'ハンバーガーが暗礁で冷める。']

rand_sentence(language="zh", count=3)
# ['周末肉丸沸腾。', '巨乌贼又品尝朱红椰汁。', '明亮眼球总是移动。']

rand_sentence(language="de", count=3)
# ['Eine junge Umlaufbahn fließt kaum.', 'Ein Nudelgericht kocht.', 'Eine Milz bebt.']

rand_sentence(language="ru", count=3)
# ['Полый коньяк остывает.', 'Тимьян снова вянет.', 'Спутанный юпитер едва светлеет.']
```

:::

아홉 언어 모두 지원하며, 문장 부호도 각자의 것을 씁니다. 일본어와 중국어는 `。`로, 나머지는 `.`으로 끝납니다.

## 얼마나 말할지 {#how-much-it-says}

`shape`는 문장에 구가 몇 개 들어갈지를 고릅니다. 예상 길이에 가장 가까운 옵션입니다. `minLength`와 `maxLength`가 글자 수를 정한다면 이쪽은 구의 개수를 정합니다.

::: lang js

```javascript
randSentence({ language: 'en', shape: 'simple', count: 3 });
// ['The halftrack slides.', 'The pilsner is cold.', 'The blunt canoeing deepens.']

randSentence({ language: 'en', shape: 'detailed', count: 3 });
// ['At night, the oak spreads.', 'The wily steppe brightens quickly.', 'The sprig wilts in the wild sunspot.']

randSentence({ language: 'en', shape: 'complex', count: 3 });
// ['The cheerful naga shares the americano in the sandy steppe.', 'The crab counts the hockey in the planetarium.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, shape: SentenceShape.simple, count: 3);
// [The halftrack slides., The pilsner is cold., The blunt canoeing deepens.]

randSentence(language: WordLanguage.en, shape: SentenceShape.detailed, count: 3);
// [At night, the oak spreads., The wily steppe brightens quickly.]

randSentence(language: WordLanguage.en, shape: SentenceShape.complex, count: 3);
// [The cheerful naga shares the americano in the sandy steppe.]
```

:::

::: lang py

```python
rand_sentence(language="en", shape="simple", count=3)
# ['The halftrack slides.', 'The pilsner is cold.', 'The blunt canoeing deepens.']

rand_sentence(language="en", shape="detailed", count=3)
# ['At night, the oak spreads.', 'The wily steppe brightens quickly.']

rand_sentence(language="en", shape="complex", count=3)
# ['The cheerful naga shares the americano in the sandy steppe.']
```

:::

`simple`은 주어와 서술어뿐이고, `detailed`는 구가 하나 더 붙으며, `complex`는 둘 이상 붙습니다.

## 형태 고르기 {#picking-the-shape}

`slots`는 **주어 옆에** 어떤 구가 올 수 있는지를 지정하며, 그중 아무것도 쓰지 않는 형태는 빠집니다. 하나라도 쓰면 통과하므로, 둘을 적으면 그중 아무거나 나오고 선택은 우연에 맡깁니다.

::: lang js

```javascript
randSentence({ language: 'en', slots: 'object', count: 3 });
// ['The earthworm warms the nightcap.', 'The timid sorcerer builds the corduroy.']

randSentence({ language: 'en', slots: 'place', count: 3 });
// ['At dawn, the monorail sways in the bronze galaxy.', 'The cosmos darkens in the lunation.']

randSentence({ language: 'en', slots: 'state', count: 3 });
// ['The saffron is vague.', 'The weekend is dark.', 'The resolve is obvious.']

randSentence({ language: 'en', slots: 'none', count: 3 });
// ['The pearly hummus cools.', 'The litter passes.', 'The restless sleigh departs.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, slots: {SentenceSlot.object}, count: 3);
// [The earthworm warms the nightcap., The timid sorcerer builds the corduroy.]

randSentence(language: WordLanguage.en, slots: {SentenceSlot.place}, count: 3);
// [At dawn, the monorail sways in the bronze galaxy.]

randSentence(language: WordLanguage.en, slots: {SentenceSlot.state}, count: 3);
// [The saffron is vague., The weekend is dark., The resolve is obvious.]

// 빈 집합이 다른 두 패키지의 `'none'`에 해당합니다.
randSentence(language: WordLanguage.en, slots: {}, count: 3);
// [The pearly hummus cools., The litter passes., The restless sleigh departs.]
```

:::

::: lang py

```python
rand_sentence(language="en", slots="object", count=3)
# ['The earthworm warms the nightcap.', 'The timid sorcerer builds the corduroy.']

rand_sentence(language="en", slots="place", count=3)
# ['At dawn, the monorail sways in the bronze galaxy.']

rand_sentence(language="en", slots="state", count=3)
# ['The saffron is vague.', 'The weekend is dark.', 'The resolve is obvious.']

rand_sentence(language="en", slots="none", count=3)
# ['The pearly hummus cools.', 'The litter passes.', 'The restless sleigh departs.']
```

:::

**언어는 자기가 가진 것으로 답합니다.** 형태는 각 언어의 것이므로 모든 요청에 답할 수 있는 것은 아닙니다. 독일어에는 `object`가, 러시아어에는 `place`가 없습니다. 둘 다 명사 자체의 어미가 바뀌는 격을 요구하는데 단어 풀은 형태를 하나씩만 담기 때문입니다. 그런 요청은 그 언어가 가진 모든 형태로 되돌아갑니다. 길이 범위가 너무 좁을 때 오류 대신 가장 가까운 것을 주는 것과 같습니다.

::: lang js

```javascript
randSentence({ language: 'de', slots: 'object', count: 3 });
// ['Im Frühling blüht eine Chrysantheme noch.', 'Eine neue Träne bebt.', 'Ein Kefir kühlt.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.de, slots: {SentenceSlot.object}, count: 3);
// [Im Frühling blüht eine Chrysantheme noch., Eine neue Träne bebt., Ein Kefir kühlt.]
```

:::

::: lang py

```python
rand_sentence(language="de", slots="object", count=3)
# ['Im Frühling blüht eine Chrysantheme noch.', 'Eine neue Träne bebt.', 'Ein Kefir kühlt.']
```

:::

언어를 지정하지 않으면 답할 수 있는 언어가 그렇지 못한 언어보다 먼저 뽑힙니다.

## 수량과 금액 {#counting-and-money}

형태가 담을 수 있는 부분이 둘 늘었고, 다른 모든 부분과 똑같이 `slots`로 요청합니다. **quantity**는 숫자와 그 종류가 취하는 수량사가 붙은 명사구이고, **money**는 금액과 그 언어가 돈을 세는 단위입니다.

::: lang js

```javascript
randSentence({ language: 'ko', slots: 'quantity', count: 2 });
// ['파란 문어가 녹차 6개를 줍는다.', '파리가 감주 6개를 굽는다.']

randSentence({ language: 'vi', slots: 'quantity', count: 2 });
// ['Kỹ sư hẹp lau 7 cái thư.', '4 chiếc xe nôi chạy.']

randSentence({ language: 'en', slots: 'money', count: 2 });
// ['The silversmith describes 1,000 dollars.', 'The hollow magistrate remembers 500 dollars.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.ko, slots: {SentenceSlot.quantity}, count: 2);
// [파란 문어가 녹차 6개를 줍는다., 파리가 감주 6개를 굽는다.]

randSentence(language: WordLanguage.vi, slots: {SentenceSlot.quantity}, count: 2);
// [Kỹ sư hẹp lau 7 cái thư., 4 chiếc xe nôi chạy.]

randSentence(language: WordLanguage.en, slots: {SentenceSlot.money}, count: 2);
// [The silversmith describes 1,000 dollars., The hollow magistrate remembers 500 dollars.]
```

:::

::: lang py

```python
rand_sentence(language="ko", slots="quantity", count=2)
# ['파란 문어가 녹차 6개를 줍는다.', '파리가 감주 6개를 굽는다.']

rand_sentence(language="vi", slots="quantity", count=2)
# ['Kỹ sư hẹp lau 7 cái thư.', '4 chiếc xe nôi chạy.']

rand_sentence(language="en", slots="money", count=2)
# ['The silversmith describes 1,000 dollars.', 'The hollow magistrate remembers 500 dollars.']
```

:::

**수량을 세는 언어는 넷이고, 그 넷은 수량사를 가진 언어입니다.** 수량사는 명사의 부류에서 옵니다. 부류를 둔 보람이 여기 있습니다. 생물은 `마리`, 탈것은 `대`, 나무는 `그루`. 한국어·일본어·중국어는 숫자를 명사 뒤에 두고, 베트남어는 수량사까지 함께 앞에 둡니다.

| 언어                | 수량 | 금액 |
| ------------------- | ---- | ---- |
| `ko` `ja` `zh` `vi` | ✅   | ✅   |
| `en` `es` `it`      | —    | ✅   |
| `de` `ru`           | —    | —    |

**영어·스페인어·이탈리아어가 수량을 세지 않는 이유는 복수형 규칙이 아닙니다.** 복수형 규칙 자체는 쓰기 쉽습니다. 문제는 그 규칙이 이 풀에서 만들어 내는 것이 `12 sadnesses`, `12 bacons`, `12 goggleses`라는 점입니다. 이 풀의 명사 대부분은 애초에 셀 수 없고, 어느 것이 셀 수 있는지 데이터 어디에도 적혀 있지 않습니다. 수량사를 가진 언어에는 그런 문제가 없습니다. `슬픔 12 가지`는 열두 가지 슬픔이고, 추상명사를 셀 수 있게 만드는 것이 바로 수량사입니다. 그래서 수량 형태는 정확히 수량사를 가진 언어들의 것입니다.

**독일어와 러시아어는 둘 다 없습니다.** 금액은 목적어 자리에 서는데, 두 언어 모두 목적어 형태를 선언하지 않습니다. 명사가 제 어미를 바꿔야 하는 격이 필요하기 때문이고, 이는 처음부터 두 언어가 목적어 형태를 두지 않은 것과 같은 이유입니다.

**수량 명사구는 관사를 떼고 수식어를 붙이지 않습니다.** `12 apples`이지 `the 12 red apples`이 아닙니다. 그리고 천 단위 구분은 그 언어의 방식대로입니다. 영어·한국어·일본어·중국어는 `,`, 베트남어·스페인어·이탈리아어는 `.`입니다.

**숫자와 그것이 세는 것 사이도 언어마다 다릅니다.** 한국어는 단위와 화폐를 숫자에 붙여 씁니다. `6개`, `300,000원`처럼요. 일본어와 중국어는 애초에 띄어쓰기가 없으니 마찬가지입니다. 베트남어·영어·스페인어·이탈리아어는 띄어 씁니다. `6 con`, `500 dollars`.

## 반드시 넣을 단어 {#words-it-has-to-contain}

`include`에 적은 단어는 모든 문장에 한 번 이상 들어갑니다. 풀이 아는 단어는 제자리에 들어갑니다. 명사는 주어가 되고, 동사는 서술어가 되며, 부사는 방법을 나타내는 자리로 갑니다. 풀에 없는 단어는 명사로 씁니다.

::: lang js

```javascript
randSentence({ language: 'en', include: 'lion', count: 3 });
// ['The genial lion finds the grumpy vest.', 'The noble lion is new.', 'The narrow lion crawls in the ancient pulsar.']

randSentence({ language: 'en', include: ['brave', 'lion', 'quietly'], count: 3 });
// ['The brave lion walks quietly.', 'The brave lion dozes quietly.', 'The brave lion swims quietly.']

randSentence({ language: 'ko', include: ['사자', '조용히'], count: 2 });
// ['눈꽃 사자가 조용히 뻔뻔한 토스터를 옮긴다.', '사자가 조용히 다가온다.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, include: <String>['lion'], count: 3);
// [The genial lion finds the grumpy vest., The noble lion is new.]

randSentence(
  language: WordLanguage.en,
  include: <String>['brave', 'lion', 'quietly'],
  count: 3,
);
// [The brave lion walks quietly., The brave lion dozes quietly.]

randSentence(language: WordLanguage.ko, include: <String>['사자', '조용히'], count: 2);
// [눈꽃 사자가 조용히 뻔뻔한 토스터를 옮긴다., 사자가 조용히 다가온다.]
```

:::

::: lang py

```python
rand_sentence(language="en", include="lion", count=3)
# ['The genial lion finds the grumpy vest.', 'The noble lion is new.']

rand_sentence(language="en", include=["brave", "lion", "quietly"], count=3)
# ['The brave lion walks quietly.', 'The brave lion dozes quietly.']

rand_sentence(language="ko", include=["사자", "조용히"], count=2)
# ['눈꽃 사자가 조용히 뻔뻔한 토스터를 옮긴다.', '사자가 조용히 다가온다.']
```

:::

한 단어가 여러 자리에 들어갈 수 있고, 어느 쪽이 될지는 나머지 단어에 달렸습니다. 영어 `brave`는 서술어로 문장을 끝맺기도 하고 명사구를 여는 수식어가 되기도 합니다. `quietly`와 함께 요청하면 수식어 자리를 잡습니다. 서술어로 형용사를 쓰는 형태에는 부사를 놓을 자리가 없기 때문입니다.

여기서 두 가지가 따라옵니다. 문장은 **구의 개수만큼** 단어를 담을 수 있으므로, 가장 긴 형태가 감당하는 것보다 많이 요청하면 들어가는 것만 넣고 나머지는 빠집니다. 그리고 `language`를 지정하지 않으면 적은 단어를 모두 가진 언어가 먼저 뽑히므로, `include: '고양이'`는 한국어 문장을 만듭니다.

## 묻고, 외치고, 말끝을 흐리기 {#asking-exclaiming-trailing-off}

`type`은 문장이 무엇을 하는지 정합니다. 기본값 `'statement'`가 지금까지의 전부이고, 나머지 셋은 `'question'`, `'exclamation'`, 그리고 끝나는 대신 멈추는 문장인 `'trailing'`입니다.

::: lang js

```javascript
randSentence({ language: 'en', type: 'question', count: 2 });
// ['Does the delphinium spread in the halfmoon?', 'Does the evening brighten in the obelisk?']

randSentence({ language: 'ko', type: 'exclamation', count: 2 });
// ['저런, 두꺼운 황사가 깊어진다!', '오, 여름에 해뜰녘이 초원에서 짙어진다!']

randSentence({ language: 'ko', type: 'trailing', count: 2 });
// ['십종경기는 넓다…', '로켓이 반짝인다…']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, type: {SentenceType.question}, count: 2);
// [Does the delphinium spread in the halfmoon?, Does the evening brighten in the obelisk?]

randSentence(language: WordLanguage.ko, type: {SentenceType.exclamation}, count: 2);
// [저런, 두꺼운 황사가 깊어진다!, 오, 여름에 해뜰녘이 초원에서 짙어진다!]

randSentence(language: WordLanguage.ko, type: {SentenceType.trailing}, count: 2);
// [십종경기는 넓다…, 로켓이 반짝인다…]
```

:::

::: lang py

```python
rand_sentence(language="en", type="question", count=2)
# ['Does the delphinium spread in the halfmoon?', 'Does the evening brighten in the obelisk?']

rand_sentence(language="ko", type="exclamation", count=2)
# ['저런, 두꺼운 황사가 깊어진다!', '오, 여름에 해뜰녘이 초원에서 짙어진다!']

rand_sentence(language="ko", type="trailing", count=2)
# ['십종경기는 넓다…', '로켓이 반짝인다…']
```

:::

**의문문은 문장부호를 갖다 붙인 것이 아니라 하나의 형태입니다.** 생성기의 나머지가 따르는 규칙 그대로이고, do-support가 코드의 분기가 아닌 이유이기도 합니다. 영어는 조동사가 주어 앞에 서는 형태를 선언하고, 동사는 기본형으로 돌아갑니다. 독일어는 정동사를 아무것도 서 있지 않은 첫 자리로 옮기고, 한국어는 서술어의 어미를 바꿉니다. 일본어·중국어·베트남어는 절 전체 뒤에 `か`, `吗`, `không` 같은 꼬리표를 붙입니다.

| 언어           | 어떻게 묻는가                     |                                             |
| -------------- | --------------------------------- | ------------------------------------------- |
| `en`           | do-support, 그리고 그 뒤의 기본형 | `Does the delphinium spread?`               |
| `de`           | 정동사가 맨 앞으로                | `Fliegt ein düsteres Kaninchen sorgsam?`    |
| `ko`           | 서술어의 어미가 바뀜              | `베고니아가 시드니?`                        |
| `ja` `zh` `vi` | 절 뒤의 꼬리표                    | `侦探在遥远北极星里靠近吗？`                |
| `es` `it` `ru` | 문장부호만                        | `¿El vino vívido se estropea en la sabana?` |

마지막 줄은 대충 넘긴 것이 아닙니다. 그 셋에서는 의문문이 **곧** 평서문이라서 의문형을 아예 선언하지 않고 평서형을 그대로 돌려받습니다. 어떤 형태에도 너무 좁은 길이 범위가 이미 받는 것과 같은 최선의 처리입니다. 스페인어는 양쪽 끝을 모두 표시하는데, `¿`와 `¡`가 그것입니다.

**감탄문은 대개 감탄사로 시작합니다.** 앞에 아무것도 없는 감탄문은 문장부호만 걸친 평서문이기 때문입니다. 평서문은 감탄사로 시작하지 않고, 의문문에는 제 몫을 하는 문장부호가 이미 있습니다.

여러 타입을 요청하면 문장마다 정해집니다. 한 문단이 무언가를 묻고 스스로 답할 수 있다는 뜻이고, `SentenceDetail.types`가 각각 무엇이었는지 알려 줍니다.

::: lang js

```javascript
randSentence({ language: 'en', type: 'all', sentences: 3 });
// ['Does the spectrum spread in the cosmic meteor? But does the copper rapture gather? The spectrum remains…']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, type: SentenceType.values.toSet(), sentences: 3);
// [Does the spectrum spread in the cosmic meteor? But does the copper rapture gather? The spectrum remains…]
```

:::

::: lang py

```python
rand_sentence(language="en", type="all", sentences=3)
# ['Does the spectrum spread in the cosmic meteor? But does the copper rapture gather? The spectrum remains…']
```

:::

`include`로 지정한 단어는 타입이 요구하는 형태로 나옵니다. `include: '달린다'`에 `type: 'question'`이면 `달린다?`가 아니라 `달리니?`입니다. 각 형태는 평서형을 대신하는 것이 아니라 그 옆에 하나씩 짝지어 저장되고, 그것이 이 변환을 가능하게 합니다.

## 화계 {#politeness}

`style`은 문장을 어느 화계로 쓸지 정합니다. 네 단계이고, 한국어의 화계가 실제로 그렇습니다.

| 값         | 화계        | 어떤 말투인가                                      |
| ---------- | ----------- | -------------------------------------------------- |
| `'plain'`  | 해라체      | 글의 목소리. 듣는 사람이 없습니다.                 |
| `'casual'` | 해체 (반말) | 가까운 사이에 하는 말.                             |
| `'polite'` | 해요체      | 같은 거리에서 높여 말한 것. 넷 중 가장 다정합니다. |
| `'formal'` | 합쇼체      | 높이되 거리를 둔 말.                               |

**지정하지 않으면 결과마다 하나를 뽑습니다.** 두 번 부르면 두 번 다 같은 목소리가 나오지는 않습니다. 지정하면 그 결과의 모든 문장이 그 화계로 쓰입니다.

::: lang js

```javascript
randSentence({ language: 'ko', style: 'plain', count: 2 });
// ['포도밭이 청량한 별자리에서 물든다.', '주먹이 저린다.']

randSentence({ language: 'ko', style: 'casual', count: 2 });
// ['계란은 고소해.', '노란 카멜레온이 찹쌀떡을 씹어.']

randSentence({ language: 'ko', style: 'polite', count: 2 });
// ['고래 6마리가 어슬렁대죠.', '체온이 떨려요.']

randSentence({ language: 'ko', style: 'formal', count: 2 });
// ['마차가 약국에서 흔들립니다.', '등산복이 서서히 반짝입니다.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.ko, style: SentenceStyle.plain, count: 2);
// [포도밭이 청량한 별자리에서 물든다., 주먹이 저린다.]

randSentence(language: WordLanguage.ko, style: SentenceStyle.casual, count: 2);
// [계란은 고소해., 노란 카멜레온이 찹쌀떡을 씹어.]

randSentence(language: WordLanguage.ko, style: SentenceStyle.polite, count: 2);
// [고래 6마리가 어슬렁대죠., 체온이 떨려요.]

randSentence(language: WordLanguage.ko, style: SentenceStyle.formal, count: 2);
// [마차가 약국에서 흔들립니다., 등산복이 서서히 반짝입니다.]
```

:::

::: lang py

```python
rand_sentence(language="ko", style="plain", count=2)
# ['포도밭이 청량한 별자리에서 물든다.', '주먹이 저린다.']

rand_sentence(language="ko", style="casual", count=2)
# ['계란은 고소해.', '노란 카멜레온이 찹쌀떡을 씹어.']

rand_sentence(language="ko", style="polite", count=2)
# ['고래 6마리가 어슬렁대죠.', '체온이 떨려요.']

rand_sentence(language="ko", style="formal", count=2)
# ['마차가 약국에서 흔들립니다.', '등산복이 서서히 반짝입니다.']
```

:::

**화계는 어미만이 아니라 서법까지 바꿉니다.** 해체와 해요체는 의문형과 감탄형이 따로 없습니다. `달려`는 묻는 말이기도 하고 하는 말이기도 하며 뒤에 붙는 문장부호만 다릅니다. 그래서 이 둘은 모든 서법에 형태 하나를 씁니다. 해라체와 합쇼체는 움직이고, 움직이는 방식이 서로 다릅니다. 해라체는 `-니`, `-나`, `-(으)ㄴ가`로 묻고 `-구나`, `-네`, `-군`으로 감탄하며, 합쇼체는 `달립니다`를 `달립니까`로 바꿉니다.

::: lang js

```javascript
randSentence({ language: 'ko', style: 'plain', type: 'question', count: 2 });
// ['치안판사가 귀여운 당김음을 닦나?', '발랄한 음료가 무지개 별무리에서 끓는가?']

randSentence({ language: 'ko', style: 'plain', type: 'exclamation', count: 2 });
// ['저런, 매콤한 목련이 뿌리내리는구나!', '저런, 어선이 귀여운 그림자에서 달리네!']
```

:::

::: lang dart

```dart
randSentence(
  language: WordLanguage.ko,
  style: SentenceStyle.plain,
  type: {SentenceType.question},
  count: 2,
);
// [치안판사가 귀여운 당김음을 닦나?, 발랄한 음료가 무지개 별무리에서 끓는가?]

randSentence(
  language: WordLanguage.ko,
  style: SentenceStyle.plain,
  type: {SentenceType.exclamation},
  count: 2,
);
// [저런, 매콤한 목련이 뿌리내리는구나!, 저런, 어선이 귀여운 그림자에서 달리네!]
```

:::

::: lang py

```python
rand_sentence(language="ko", style="plain", type="question", count=2)
# ['치안판사가 귀여운 당김음을 닦나?', '발랄한 음료가 무지개 별무리에서 끓는가?']

rand_sentence(language="ko", style="plain", type="exclamation", count=2)
# ['저런, 매콤한 목련이 뿌리내리는구나!', '저런, 어선이 귀여운 그림자에서 달리네!']
```

:::

**한국어 의문형은 어미가 하나가 아니고, 풀의 항목이 그것을 적습니다.** 형태 풀은 평서형과 자리를 맞춰 저장됩니다. 지정한 단어를 자리로 찾아 바꿀 수 있는 이유가 그것입니다. 그러면서 한 항목이 `|`로 여러 어미를 적습니다. `달리니|달리나|달리는가`는 동사 하나를 세 가지로 쓴 것이고, 문장마다 그중 하나가 뽑힙니다.

**일본어는 두 단계이고 네 단계에 맞춰집니다.** `'casual'`은 보통체이고 `'polite'`와 `'formal'`은 둘 다 `走ります`입니다. 묻는 일은 어느 화계에서든 `か`가 하는데, 동사의 일부가 아니라 형태(frame)의 꼬리이기 때문입니다.

**나머지 일곱 언어는 어느 화계에서도 같은 문장을 씁니다. 빠진 것이 아닙니다.** 스페인어·이탈리아어·독일어·러시아어에는 T–V 구분이 있지만 그것은 2인칭의 일이고 여기 문장은 전부 3인칭입니다. `el león corre`는 누구에게든 그렇게 말합니다. 영어에는 그런 형태가 아예 없습니다. 없는 것을 지어내는 대신 이 일곱은 화계를 선언하지 않고, `style`은 아무것도 바꾸지 않습니다.

## 대사와 생각 {#dialogue-and-thought}

`'dialogue'`와 `'thought'`는 형태가 아예 아닌 두 타입입니다. 둘 다 문장을 그 언어의 따옴표로 감싸고, 감싸는 대상은 줄마다 새로 뽑힙니다. 말하는 사람은 이야기하는 만큼이나 자주 묻기 때문입니다.

::: lang js

```javascript
randSentence({ language: 'en', type: 'dialogue', count: 2 });
// ['“The stout profit is endless!”', '“Does the blue intuition remain?”']

randSentence({ language: 'ja', type: 'dialogue', count: 2 });
// ['「組版工は速いか？」', '「芒が伸びるか？」']

randSentence({ language: 'ko', type: 'thought', count: 2 });
// ['‘대나무는 푸르다!’', '‘산뜻한 혜성은 밝니?’']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, type: {SentenceType.dialogue}, count: 2);
// [“The stout profit is endless!”, “Does the blue intuition remain?”]

randSentence(language: WordLanguage.ja, type: {SentenceType.dialogue}, count: 2);
// [「組版工は速いか？」, 「芒が伸びるか？」]

randSentence(language: WordLanguage.ko, type: {SentenceType.thought}, count: 2);
// [‘대나무는 푸르다!’, ‘산뜻한 혜성은 밝니?’]
```

:::

::: lang py

```python
rand_sentence(language="en", type="dialogue", count=2)
# ['“The stout profit is endless!”', '“Does the blue intuition remain?”']

rand_sentence(language="ja", type="dialogue", count=2)
# ['「組版工は速いか？」', '「芒が伸びるか？」']

rand_sentence(language="ko", type="thought", count=2)
# ['‘대나무는 푸르다!’', '‘산뜻한 혜성은 밝니?’']
```

:::

**따옴표는 그 언어의 것이고, 결코 만국 공통이 아닙니다.** 대사는 1차 따옴표를, 생각은 2차 따옴표를 씁니다.

| 언어                | 1차     | 2차     |
| ------------------- | ------- | ------- |
| `en` `ko` `zh` `vi` | `“…”`   | `‘…’`   |
| `ja`                | `「…」` | `『…』` |
| `es` `it`           | `«…»`   | `“…”`   |
| `de`                | `„…“`   | `‚…‘`   |
| `ru`                | `«…»`   | `„…“`   |

중국어는 낫표가 아니라 굽은 따옴표를 씁니다. 이 풀은 간체자로 쓰여 있고, 가로쓰기 간체 중국어는 `“”`를 씁니다. `「」`는 대만과 홍콩의 것입니다. 독일어는 아래에서 열고 위에서 닫기 때문에 짝이 대칭이 아닙니다.

`quote`는 타입과 무관하게 어떤 짝을 쓸지 덮어씁니다. 생각을 1차 따옴표로 크게 외치게 할 수도, 대사를 2차 따옴표로 속삭이게 할 수도 있습니다.

::: lang js

```javascript
randSentence({ language: 'ru', type: 'thought', quote: 'double' });
// ['«Эх, беспокойный торт ненадолго кипит!»']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.ru, type: {SentenceType.thought}, quote: SentenceQuote.double);
// [«Эх, беспокойный торт ненадолго кипит!»]
```

:::

::: lang py

```python
rand_sentence(language="ru", type="thought", quote="double")
# ['«Эх, беспокойный торт ненадолго кипит!»']
```

:::

**인용 표지는 없습니다.** `…라고 그는 말했다`에는 말한 사람이 필요하고 그것은 [`includeName`](#a-persons-name)이 가지고 있지만, 말하는 동사는 아홉 언어 어느 풀에도 없습니다. 돌려받는 것은 대사 자체이지, 누가 말했는지가 아닙니다.

## 문장을 여러 개 {#more-than-one-sentence}

`sentences`는 **결과 하나**에 문장을 여러 개 담습니다. 문자열 하나로 돌아오고 — 문자열이 몇 개인지는 여전히 `count`가 정합니다 — 그 문장들은 따로 뽑은 것이 아니라 같은 것에 관한 이야기입니다.

::: lang js

```javascript
randSentence({ language: 'en', sentences: 3, count: 2 });
// ['Tomorrow, the gentle shepherd stretches. The juggler guards the wild coda. But the cheerful miner walks softly.',
//  'The temperance remains in the avalanche. Later the temperance gathers. It lingers once more.']

randSentence({ language: 'ko', sentences: 3 });
// ['수상한 단술이 익는다. 하지만 옅은 단술이 식는다. 순진한 단술이 식는다.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, sentences: 3, count: 2);
// [Tomorrow, the gentle shepherd stretches. The juggler guards the wild coda. But the cheerful miner walks softly.,
//  The temperance remains in the avalanche. Later the temperance gathers. It lingers once more.]

randSentence(language: WordLanguage.ko, sentences: 3);
// [수상한 단술이 익는다. 하지만 옅은 단술이 식는다. 순진한 단술이 식는다.]
```

:::

::: lang py

```python
rand_sentence(language="en", sentences=3, count=2)
# ['Tomorrow, the gentle shepherd stretches. The juggler guards the wild coda. But the cheerful miner walks softly.',
#  'The temperance remains in the avalanche. Later the temperance gathers. It lingers once more.']

rand_sentence(language="ko", sentences=3)
# ['수상한 단술이 익는다. 하지만 옅은 단술이 식는다. 순진한 단술이 식는다.']
```

:::

**화제는 첫 문장이 정합니다.** 뒤따르는 문장은 그 주어를 다시 부르거나, 그 자리에 대명사를 세우거나, 같은 부류의 다른 명사를 뽑습니다. 생물로 시작한 문단이 중간에 개념으로 새지 않는다는 뜻입니다. 접속사(`But`, `하지만`, `そして`)로 시작하기도 합니다.

대명사를 어떻게 쓸지는 언어마다 다릅니다. 영어는 `it`을 쓰고, 한국어·일본어·중국어·스페인어·이탈리아어는 주어를 아예 생략합니다. 두 번째 문장에서 실제로 그렇게 쓰기 때문입니다. 독일어와 러시아어는 명사의 성에 따라 고릅니다. 사람을 가리킬 수 없는 대명사만 가진 언어 — 영어의 `he`/`she`는 풀에 없는 성이 필요하고 `그것`, `それ`, `它`, `nó`는 무생물입니다 — 는 대신 화제를 다시 부릅니다.

**길이 범위는 문장 수와 무관하게 문자열 전체를 가리킵니다.** 어느 문장도 뽑기 전에 범위를 나눠 갖고, 나머지는 마지막 문장이 떠안습니다.

::: lang js

```javascript
randSentence({ language: 'ko', sentences: 3, minLength: 40, maxLength: 55 });
// ['반달이 함께 깊어진다. 그리고 별똥별이 역에서 물든다. 아침에 그것이 조용해진다.'] // 45자
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.ko, sentences: 3, minLength: 40, maxLength: 55);
// [반달이 함께 깊어진다. 그리고 별똥별이 역에서 물든다. 아침에 그것이 조용해진다.] // 45자
```

:::

::: lang py

```python
rand_sentence(language="ko", sentences=3, min_length=40, max_length=55)
# ['반달이 함께 깊어진다. 그리고 별똥별이 역에서 물든다. 아침에 그것이 조용해진다.']  # 45자
```

:::

`include`에 적은 단어는 첫 문장에 들어갑니다. 문장마다 한 번씩이 아니라 결과에 한 번씩 넣기 위해서입니다. `sentences`는 <Lang js="RAND_SENTENCE_COUNT_MAX" dart="randSentenceCountMax" py="RAND_SENTENCE_COUNT_MAX" code />인 10으로 제한됩니다. 열 문장이면 이미 한 문단입니다.

## 사람 이름 {#a-persons-name}

여기 있는 다른 생성기는 사람 이름을 일부러 피합니다. 닉네임은 사람 이름으로 만들지 않고, 그 규칙이야말로 이름과 단어를 갈라 둔 이유입니다. 문장만 예외이고, 그것도 직접 요청했을 때뿐입니다. <Lang js="includeName" py="include_name" dart="includeName" code />은 문장에 사람이 설 자리가 있을 때 생성한 이름을 씁니다.

::: lang js

```javascript
randSentence({ language: 'en', includeName: true, count: 3 });
// ['Callum drinks the round rye.', 'Gavin crawls.', 'Veronica paints the plunger neatly.']

randSentence({ language: 'ko', includeName: true, count: 3 });
// ['소한이 날아오른다.', '종현이 심벌즈를 판다.', '은영이 어슬렁댄다.']

randSentence({ language: 'es', includeName: true, count: 3 });
// ['Hilario imagina la duda.', 'Adrián calienta la uva redonda.', 'Santiago rueda.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, includeName: true, count: 3);
// [Callum drinks the round rye., Gavin crawls., Veronica paints the plunger neatly.]

randSentence(language: WordLanguage.ko, includeName: true, count: 3);
// [소한이 날아오른다., 종현이 심벌즈를 판다., 은영이 어슬렁댄다.]

randSentence(language: WordLanguage.es, includeName: true, count: 3);
// [Hilario imagina la duda., Adrián calienta la uva redonda., Santiago rueda.]
```

:::

::: lang py

```python
rand_sentence(language="en", include_name=True, count=3)
# ['Callum drinks the round rye.', 'Gavin crawls.', 'Veronica paints the plunger neatly.']

rand_sentence(language="ko", include_name=True, count=3)
# ['소한이 날아오른다.', '종현이 심벌즈를 판다.', '은영이 어슬렁댄다.']

rand_sentence(language="es", include_name=True, count=3)
# ['Hilario imagina la duda.', 'Adrián calienta la uva redonda.', 'Santiago rueda.']
```

:::

**성 없는 이름 하나**입니다. 명사구가 아니라서 관사도 수식어도 붙지 않고, 한국어 조사는 다른 단어와 똑같이 이름의 마지막 글자를 보고 고릅니다(`소한이`, `은영이`). 뽑을 때 정해진 성별을 그대로 지니고 있어서 스페인어·이탈리아어·러시아어의 서술 형용사가 이름에 맞춰 굴절합니다. `Celeste è affamata` 옆에 `Ivano è raro`처럼요. 이름은 어느 단어 풀에도 없으니 생성기가 성별을 읽어 낼 곳이 달리 없고, 이것이 이름이 글자 말고 지녀야 할 유일한 정보입니다.

**이름은 사람이 설 수 있는 자리에만 섭니다.** 이 옵션을 켜면 주어가 사람을 가리키는 테마로 좁혀져 문장에 이름을 둘 자리가 생깁니다. 직접 지정한 `theme`이 우선이고, 그때는 이름이 아예 쓰이지 않습니다.

::: lang js

```javascript
randSentence({ language: 'en', theme: 'animal', includeName: true, count: 2 });
// ['The wildebeest is lazy.', 'Yesterday, the moose stops.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, theme: WordTheme.animal, includeName: true, count: 2);
// [The wildebeest is lazy., Yesterday, the moose stops.]
```

:::

::: lang py

```python
rand_sentence(language="en", theme="animal", include_name=True, count=2)
# ['The wildebeest is lazy.', 'Yesterday, the moose stops.']
```

:::

`SentenceDetail.names`는 결과에 쓰인 이름을 알려 줍니다. 주어가 이름이면 <Lang js="theme: null" dart="theme: null" py="theme=None" code />입니다. 이름은 어느 테마에도 속하지 않으니까요.

::: warning 쓰든 쓰지 않든 22 KB가 늡니다 이 옵션은 사람 이름 풀에 손을 대는데, 동기 API에는 동적 import로 숨길 자리가 없습니다. 그래서 `randSentence`를 포함하는 번들은 이름 풀도 함께 포함합니다. esbuild로 `randSentence`만 번들하고 gzip한 결과는 **이전 122.5 KB, 이후 144.5 KB**로 `+22.0 KB`, `+18%`입니다. 문장 생성기는 이미 단어 풀 전체를 들고 있고 그것이 110 KB이며, 이름 풀은 그 옆의 22 KB입니다.

이름을 쓸 일이 없고 크기가 중요하다면, 이 버전에서 할 수 있는 일은 `randSentence`를 가져오지 않는 것뿐입니다. :::

## 상세 출력 {#the-detail-output}

`output: 'detail'`은 문자열 대신 각 문장을 이루는 요소를 알려줍니다. 순서대로의 구, 각 구가 하는 일, 언어, 그리고 주어의 테마입니다.

::: lang dart

Dart에서는 이것이 **별도 함수** `randSentenceDetails`입니다. 인자에 따라 반환 타입을 바꿀 방법이 없기 때문입니다. 인자는 `randSentence`와 같습니다.

:::

::: lang js

```javascript
randSentence({ language: 'ko', output: 'detail', count: 1 });
// [{
//   sentence: '그리핀이 자줏빛 숲에서 총명한 고량주를 삼킨다.',
//   sentences: ['그리핀이 자줏빛 숲에서 총명한 고량주를 삼킨다.'],
//   phrases: ['그리핀', '자줏빛 숲', '총명한 고량주', '삼킨다'],
//   slots: ['subject', 'place', 'object', 'verb'],
//   language: 'ko',
//   theme: 'myth'
// }]
```

:::

::: lang dart

```dart
randSentenceDetails(language: WordLanguage.ko).first;
// SentenceDetail(그리핀이 자줏빛 숲에서 총명한 고량주를 삼킨다.,
//                [그리핀, 자줏빛 숲, 총명한 고량주, 삼킨다], ko, myth)
randSentenceDetails(language: WordLanguage.ko).first.slots;
// [SentenceSlot.subject, SentenceSlot.place, SentenceSlot.object, SentenceSlot.verb]
```

:::

::: lang py

```python
rand_sentence(language="ko", output="detail", count=1)
# [SentenceDetail(sentence='그리핀이 자줏빛 숲에서 총명한 고량주를 삼킨다.',
#                 sentences=('그리핀이 자줏빛 숲에서 총명한 고량주를 삼킨다.',),
#                 phrases=('그리핀', '자줏빛 숲', '총명한 고량주', '삼킨다'),
#                 slots=('subject', 'place', 'object', 'verb'),
#                 language='ko', theme='myth')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `sentence` | <Lang js="string" dart="String" py="str" code /> | 문장 부호까지 포함한 완성된 결과. 모든 문장을 이어 붙인 것입니다. |
| `sentences` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | 문장마다 하나씩. `sentences`로 더 요청하지 않았다면 항목 하나입니다. |
| `phrases` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | 문장을 이루는 구를 순서대로. 조사는 빠져 있습니다. 모든 문장을 통틀어 한 줄로 이어집니다. |
| `slots` | <Lang js="SentenceSlot[]" dart="List&lt;SentenceSlot&gt;" py="tuple[SentenceSlot, ...]" code /> | 각 구가 하는 일. `phrases`와 같은 인덱스입니다. |
| `names` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | 결과에 쓰인 사람 이름을 순서대로. `includeName`으로 요청하지 않았다면 비어 있습니다. |
| `types` | <Lang js="SentenceType[]" dart="List&lt;SentenceType&gt;" py="tuple[SentenceType, ...]" code /> | 각 문장이 무엇을 하는지. `sentences`와 같은 자리입니다. |
| `language` | `WordLanguage` | 이 문장을 만든 언어. |
| `theme` | <Lang js="WordTheme &#124; null" dart="WordTheme?" py="WordTheme &#124; None" code /> | 주어의 테마. 첫 문장의 것이고, 나머지 문장이 계속 이야기하는 대상입니다. 생성기가 모르는 단어면 null입니다. |

`phrases`에는 구만 들어 있습니다. 구를 표시하는 조사나 전치사는 `sentence`에만 있으므로, `그리핀이 …`는 `그리핀`으로 보고되고 구를 다시 이어 붙여도 원래 문장이 되지 않습니다. 완성된 문자열은 `sentence`에서, 그 문장을 이루는 요소는 `phrases`에서 읽으세요.

모든 문장에는 `subject`가 정확히 하나, 서술어가 정확히 하나 있습니다. 그 서술어는 `verb`이거나 `state`이며, 둘 다인 경우는 없습니다.

## 주어의 테마 {#a-theme-for-the-subject}

`theme`은 문장이 **무엇에 관한 것인지**를 좁히며, 그것은 곧 주어를 뜻합니다. 목적어와 장소는 동사가 허용하는 것에서 뽑습니다.

::: lang js

```javascript
randSentence({ language: 'en', theme: 'animal', count: 3 });
// ['The hippo sleeps in the starburst.', 'The sparrow approaches in the lightyear.', 'The puppy swallows the calm springwater briefly.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, theme: WordTheme.animal, count: 3);
// [The hippo sleeps in the starburst., The sparrow approaches in the lightyear.]
```

:::

::: lang py

```python
rand_sentence(language="en", theme="animal", count=3)
# ['The hippo sleeps in the starburst.', 'The sparrow approaches in the lightyear.']
```

:::

## 지어낸 단어, 실제 문법 {#invented-words-real-grammar}

`realism`은 **단어**가 어디서 오는지만 정합니다. 조사도 관사도 형태도 모든 층위에서 그 언어의 것이므로, 지어낸 단어로 된 문장도 여전히 문장입니다.

::: lang js

```javascript
randSentence({ language: 'ko', realism: 'invented', count: 3 });
// ['수줍은 노오가 안개 파저멜을 챙긴다.', '터패가 민다에서 젤보피를 꿈꾼다.', '한겨울 코델피가 뿌리내린다.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.ko, realism: RandRealism.invented, count: 3);
// [수줍은 노오가 안개 파저멜을 챙긴다., 터패가 민다에서 젤보피를 꿈꾼다.]
```

:::

::: lang py

```python
rand_sentence(language="ko", realism="invented", count=3)
# ['수줍은 노오가 안개 파저멜을 챙긴다.', '터패가 민다에서 젤보피를 꿈꾼다.']
```

:::

## 함께 보기 {#see-also}

- [문장](./) — 형태, 명사 부류, 그리고 각 언어가 쓸 수 있는 것.
- [`sentenceLengthRange`](./sentence-length-range) — 한 언어의 문장이 가질 수 있는 모든 길이.
- [`randWord`](../word/rand-word) — 문장을 이루는 어휘 그 자체.
