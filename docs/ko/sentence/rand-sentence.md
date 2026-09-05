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
| `shape` | <Lang js="SentenceShapeOption" dart="SentenceShape?" py="SentenceShapeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 문장이 얼마나 많은 것을 말하는지. [얼마나 말할지](#how-much-it-says) 참고. |
| `slots` | <Lang js="SentenceSlotOption" dart="Set&lt;SentenceSlot&gt;?" py="SentenceSlotOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 주어 옆에 무엇을 두는지. [형태 고르기](#picking-the-shape) 참고. |
| `include` | <Lang js="string &#124; string[]" dart="List&lt;String&gt;" py="str &#124; Sequence[str]" code /> | <Lang js="—" dart="const []" py="()" code /> | 모든 문장에 반드시 들어가야 할 단어. [반드시 넣을 단어](#words-it-has-to-contain) 참고. |
| `sentences` | <Lang js="number" dart="int" py="int" code /> | `1` | 결과 하나에 담을 문장 수. [문장을 여러 개](#more-than-one-sentence) 참고. |
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
