# randSentence

Generates whole sentences and returns `count` of them as strings. Each one is a subject and something said about it, written the way the language writes it — the particle a Korean noun asks for, the article an Italian noun opens on, the second position a German verb never gives up. With [`output: 'detail'`](#the-detail-output) it reports the phrases it used instead.

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

The words are the same everyday vocabulary [`randWord`](../word/rand-word) draws from, and **person names are never used**. What a sentence adds to them is the grammar: see [Sentences](./) for how the shapes and the verbs decide what can stand where.

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Language of the generated sentences. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> mixes every supported language, picking one per sentence. |
| `theme` | <Lang js="WordThemeOption" dart="WordTheme?" py="WordThemeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | What the sentence's **subject** is about. See [Themes](../word/themes). |
| `shape` | <Lang js="SentenceShapeOption" dart="SentenceShape?" py="SentenceShapeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | How much the sentence says. See [How much it says](#how-much-it-says). |
| `slots` | <Lang js="SentenceSlotOption" dart="Set&lt;SentenceSlot&gt;?" py="SentenceSlotOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Which parts it carries beside the subject. See [Picking the shape](#picking-the-shape). |
| `include` | <Lang js="string &#124; string[]" dart="List&lt;String&gt;" py="str &#124; Sequence[str]" code /> | <Lang js="—" dart="const []" py="()" code /> | Words every sentence has to contain. See [Words it has to contain](#words-it-has-to-contain). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many sentences to return. Clamped to `0` … `10000`. |
| `realism` | `RandRealism` | <Lang js="`'real'`" dart="`RandRealism.real`" py="`\"real\"`" /> | `real` uses real words, `invented` builds words that only read like the language, and `mixed` decides per word. The grammar stays real either way. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _language_ | Minimum length in characters, punctuation included. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _language_ | Maximum length in characters. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | Keep only sentences whose first character is this one. In a language that writes articles, that character is the article's. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same sentence twice. May return fewer than `count`. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `SentenceDetail` per sentence. Dart has no such parameter — see [the detail output](#the-detail-output). |

Both length bounds are clamped to <Lang js="RAND_SENTENCE_LENGTH_MAX" dart="randSentenceLengthMax" py="RAND_SENTENCE_LENGTH_MAX" code /> rather than to the ceiling the other generators use. A sentence is many words where a name, a word and a nickname are at most three.

## Every language

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

All nine of them, and each writes its own punctuation: `。` closes a Japanese or Chinese sentence, `.` the rest.

## How much it says {#how-much-it-says}

`shape` picks how many phrases the sentence has, which is the closest thing it has to an expected length. `minLength` and `maxLength` bound the characters; this bounds the parts.

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

`simple` is a subject and its predicate, `detailed` one phrase more, and `complex` two or more.

## Picking the shape {#picking-the-shape}

`slots` names the parts a shape may carry **beside its subject**, and the shapes that carry none of them are dropped. A shape qualifies when it uses at least one, so naming two asks for either and leaves the choice to chance.

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

// The empty set is what `'none'` spells in the other two packages.
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

**A language answers with what it has.** The shapes are the language's own, so not every one of them can answer every request. German declares no `object` and Russian no `place`: both would put the noun in a case its own ending has to change for, and the pools hold one form of each word. Asking for one falls back to every shape the language does have, the same way a length range too narrow for a shape is answered with the closest fit rather than with an error.

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

With no language named, the ones that can answer are preferred over the ones that cannot.

## Words it has to contain {#words-it-has-to-contain}

`include` lists words every sentence has to hold, each at least once. A word the pools know goes in the phrase it belongs to — a noun becomes the subject, a verb the predicate, an adverb the manner — and a word from anywhere else is used as a noun.

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

A word can be more than one thing, and which it becomes depends on the rest. English `brave` closes a sentence as a predicate and opens a noun phrase as a modifier; asked for beside `quietly` it takes the modifier slot, because the shape that has a predicate adjective has nowhere to put an adverb.

Two things follow from that. A sentence has room for **as many words as it has phrases**, so asking for more than the longest shape can carry places what fits and leaves the rest out. And with no `language`, the languages whose pools actually hold every word you named are preferred, so `include: '고양이'` produces Korean.

## The detail output {#the-detail-output}

`output: 'detail'` reports the pieces each sentence was built from — the phrases in order, what each of them does, the language and the subject's theme — instead of returning a string.

::: lang dart

Dart spells this as a **second function**, `randSentenceDetails`, because it has no way to make one function's return type depend on an argument. It takes the same parameters as `randSentence`.

:::

::: lang js

```javascript
randSentence({ language: 'ko', output: 'detail', count: 1 });
// [{
//   sentence: '그리핀이 자줏빛 숲에서 총명한 고량주를 삼킨다.',
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
#                 phrases=('그리핀', '자줏빛 숲', '총명한 고량주', '삼킨다'),
#                 slots=('subject', 'place', 'object', 'verb'),
#                 language='ko', theme='myth')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `sentence` | <Lang js="string" dart="String" py="str" code /> | The finished sentence, punctuation and all. |
| `phrases` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | The phrases it is made of, in order — without the particles. |
| `slots` | <Lang js="SentenceSlot[]" dart="List&lt;SentenceSlot&gt;" py="tuple[SentenceSlot, ...]" code /> | What each phrase does, at the same index as `phrases`. |
| `language` | `WordLanguage` | The language this sentence was generated in. |
| `theme` | <Lang js="WordTheme &#124; null" dart="WordTheme?" py="WordTheme &#124; None" code /> | Theme of the subject, or null when that word is not one the generator knows. |

`phrases` holds the phrases and nothing else. The particle or preposition that marks one lives in `sentence` alone, so `그리핀이 …` reports `그리핀` and joining the phrases back together does not reproduce the sentence. Read `sentence` for the finished string, and `phrases` for what it was built from.

Every sentence has exactly one `subject` and exactly one predicate, and that predicate is a `verb` or a `state` — never both.

## A theme for the subject

`theme` narrows what the sentence is **about**, which means its subject; the object and the place are drawn from whatever the verb allows.

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

## Invented words, real grammar

`realism` decides where the **words** come from and nothing else. The particles, the articles and the shapes are the language's own at every level, so an invented sentence is still a sentence.

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

## See also

- [Sentences](./) — the shapes, the noun classes, and what each language can write.
- [`sentenceLengthRange`](./sentence-length-range) — every length a language's sentences can take.
- [`randWord`](../word/rand-word) — the vocabulary a sentence is built from, on its own.
