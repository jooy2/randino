# randSentence

Generates whole sentences and returns `count` of them as strings. Each one is a subject and something said about it, written the way the language writes it: the particle a Korean noun asks for, the article an Italian noun opens on, the second position a German verb holds. With [`output: 'detail'`](#the-detail-output) it reports the phrases it used instead.

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
| `type` | <Lang js="SentenceTypeOption" dart="Set&lt;SentenceType&gt;?" py="SentenceTypeOption" code /> | drawn | What the sentence is doing. See [Asking, exclaiming, trailing off](#asking-exclaiming-trailing-off). |
| `quote` | <Lang js="SentenceQuote" dart="SentenceQuote?" py="SentenceQuote &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Which marks a quoted line takes. See [Dialogue and thought](#dialogue-and-thought). |
| `style` | `SentenceStyle` | drawn | The speech level it is written at. See [The speech level](#politeness). |
| `shape` | <Lang js="SentenceShapeOption" dart="SentenceShape?" py="SentenceShapeOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | How much the sentence says. See [How much it says](#how-much-it-says). |
| `slots` | <Lang js="SentenceSlotOption" dart="Set&lt;SentenceSlot&gt;?" py="SentenceSlotOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Which parts it carries beside the subject. See [Picking the shape](#picking-the-shape), [Counting, and money](#counting-and-money) and [A day and a time](#a-day-and-a-time). |
| `include` | <Lang js="string &#124; string[]" dart="List&lt;String&gt;" py="str &#124; Sequence[str]" code /> | <Lang js="—" dart="const []" py="()" code /> | Words every sentence has to contain. See [Words it has to contain](#words-it-has-to-contain). |
| `sentences` | <Lang js="number" dart="int" py="int" code /> | `1` | How many sentences one result holds. See [More than one sentence](#more-than-one-sentence). |
| <Lang js="includeName" dart="includeName" py="include_name" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | drawn | Write a person's name where the sentence has room for one. See [A person's name](#a-persons-name). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many sentences to return. Clamped to `0` … `10000`. |
| `realism` | `RandRealism` | <Lang js="`'real'`" dart="`RandRealism.real`" py="`\"real\"`" /> | `real` uses real words, `invented` builds words that only read like the language, and `mixed` decides per word. The grammar stays real either way. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _language_ | Minimum length in characters, punctuation included. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _language_ | Maximum length in characters. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | Keep only sentences whose first character is this one. In a language that writes articles, that character is the article's. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same sentence twice. May return fewer than `count`. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `SentenceDetail` per sentence. Dart has no such parameter — see [the detail output](#the-detail-output). |

Both length bounds are clamped to <Lang js="RAND_SENTENCE_LENGTH_MAX" dart="randSentenceLengthMax" py="RAND_SENTENCE_LENGTH_MAX" code /> **per sentence** rather than to the ceiling the other generators use. A sentence is many words where a name, a word and a nickname are at most three, and a result of ten of them is allowed ten times that.

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

## How many phrases a sentence carries {#how-much-it-says}

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

A language answers with what it has. The shapes are the language's own, so not every one of them can answer every request. German declares no `object` and Russian no `place`: both would put the noun in a case its own ending has to change for, and the pools hold one form of each word. Asking for one falls back to every shape the language does have, the same way a length range too narrow for a shape is answered with the closest fit rather than with an error.

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

## Counting and money {#counting-and-money}

A shape can carry two more parts, asked for through `slots` like every other one. A `quantity` is a noun phrase with a number and the counter its kind takes; `money` is an amount and what the language counts it in.

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

Four languages count, and they are the four with a classifier. The counter comes from the noun's class: `마리` for a creature, `대` for a vehicle, `그루` for a plant. Korean, Japanese and Chinese put the number behind the noun; Vietnamese puts it in front, classifier and all.

| Language            | Counts | Names an amount |
| ------------------- | ------ | --------------- |
| `ko` `ja` `zh` `vi` | ✅     | ✅              |
| `en` `es` `it`      | —      | ✅              |
| `de` `ru`           | —      | —               |

English, Spanish and Italian do not count. A plural rule applied to these pools produces `12 sadnesses`, `12 bacons` and `12 goggleses`, because most nouns in them cannot be counted at all and nothing in the data says which can. A classifier language has no such problem: `슬픔 12가지` is twelve kinds of sadness, and the classifier is what makes the abstraction countable. So the counted shape is exactly the languages that have one.

German and Russian do neither. An amount stands where an object does, and neither declares an object shape, because both would put the noun in a case its own ending has to change for. That is the same rule that has kept them from declaring an object shape all along.

A counted phrase drops its article and takes no modifier: `12 apples`, never `the 12 red apples`. The thousands are grouped the way the language groups them, with `,` in English, Korean, Japanese and Chinese and `.` in Vietnamese, Spanish and Italian.

What stands between the digits and what they count is the language's own too. Korean attaches the counter and the currency to the number (`6개`, `300,000원`), and so do Japanese and Chinese, which write no space anywhere. Vietnamese, English, Spanish and Italian keep the space: `6 con`, `500 dollars`.

## A day and a time {#a-day-and-a-time}

Two more parts a shape can carry: a **date** is what day and a **clock** what time of day, both written the way the language writes them.

::: lang js

```javascript
randSentence({ language: 'ko', slots: 'date', count: 2 });
// ['2024년 5월 12일에 촉촉한 모래톱이 깊어지죠.', '비는 2027년 9월 19일입니다.']

randSentence({ language: 'en', slots: 'clock', count: 2 });
// ['At 13:24, the sherbet remains.', 'The torrent is at 3:26.']

randSentence({ language: 'de', slots: 'date', count: 2 });
// ['Ein Pokal ist am 9. November 2028.', 'Ein verworrenes Hockey ist am 7. März 2028.']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.ko, slots: {SentenceSlot.date}, count: 2);
// [2024년 5월 12일에 촉촉한 모래톱이 깊어지죠., 비는 2027년 9월 19일입니다.]

randSentence(language: WordLanguage.en, slots: {SentenceSlot.clock}, count: 2);
// [At 13:24, the sherbet remains., The torrent is at 3:26.]

randSentence(language: WordLanguage.de, slots: {SentenceSlot.date}, count: 2);
// [Ein Pokal ist am 9. November 2028., Ein verworrenes Hockey ist am 7. März 2028.]
```

:::

::: lang py

```python
rand_sentence(language="ko", slots="date", count=2)
# ['2024년 5월 12일에 촉촉한 모래톱이 깊어지죠.', '비는 2027년 9월 19일입니다.']

rand_sentence(language="en", slots="clock", count=2)
# ['At 13:24, the sherbet remains.', 'The torrent is at 3:26.']

rand_sentence(language="de", slots="date", count=2)
# ['Ein Pokal ist am 9. November 2028.', 'Ein verworrenes Hockey ist am 7. März 2028.']
```

:::

A date is word order as much as it is digits. `2026년 9월 5일` runs largest to smallest, `ngày 5 tháng 9 năm 2026` runs the other way with a word in front of every part, and `5. September 2026` names its month and puts a full stop after the day. Each language writes its own template, and the five that name their months list them.

Either can stand two ways: as an adverbial (`2026년 9월 5일에 사자가 달린다`, `On September 5, 2026, the lion runs`), or as what the sentence equates its subject to (`면접은 11시 40분이다.`, `The match is at 11:40.`).

The second of those is a copular shape, and it is the only shape with neither a verb nor a state in it. The copula is a predicate like any other. It states the classes its subject may belong to (a thing that happens on a day is an event, not a lion), and it takes the form the level and the mood ask for, so Korean writes `이다`, `이야`, `이에요` and `입니다` and asks with `이니?`.

Where the copula stands is the language's business. Korean and Japanese write it onto the end of what it equates the subject to (`11시 40분이다` is one word); English, Chinese, Vietnamese, Spanish, Italian and German write it as a word of its own in front, and keep the preposition the phrase would carry anyway (`ist am 5. März`).

Russian declares no calendar, so asking for one falls back the way any unanswerable ask does. It equates a subject to a day with a dash rather than a word, and a dash does not change for a question or for a level, so declaring one would be a shape the language cannot write.

## Words it has to contain {#words-it-has-to-contain}

`include` lists words every sentence has to hold, each at least once. A word the pools know goes in the phrase it belongs to: a noun becomes the subject, a verb the predicate, an adverb the manner. A word from anywhere else is used as a noun.

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

## What a sentence does {#asking-exclaiming-trailing-off}

`type` says what the sentence is doing: `'statement'`, `'question'`, `'exclamation'`, `'trailing'` (a statement that stops rather than ends), plus the two quoted kinds below. Left out, one of the six is drawn per sentence. Name one, a set of them, or `'all'`.

That draw is weighted rather than even, because prose is. A statement is far and away the most likely, a line somebody says comes next, and a question or an exclamation is the rarest of the six. Naming a kind yourself still gets you that kind and nothing else.

::: lang js

```javascript
randSentence({ language: 'en', type: 'question', count: 2 });
// ['Does the delphinium spread in the halfmoon?', 'Does the evening brighten in the obelisk?']

randSentence({ language: 'en', type: 'exclamation', count: 2 });
// ['Well, the chai boils in the mesa!', 'Wow, the loud sinew heals!']

randSentence({ language: 'en', type: 'trailing', count: 2 });
// ['In summer, the amber frappe melts…', 'The zesty dumpling cools…']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, type: {SentenceType.question}, count: 2);
// [Does the delphinium spread in the halfmoon?, Does the evening brighten in the obelisk?]

randSentence(language: WordLanguage.en, type: {SentenceType.exclamation}, count: 2);
// [Well, the chai boils in the mesa!, Wow, the loud sinew heals!]

randSentence(language: WordLanguage.en, type: {SentenceType.trailing}, count: 2);
// [In summer, the amber frappe melts…, The zesty dumpling cools…]
```

:::

::: lang py

```python
rand_sentence(language="en", type="question", count=2)
# ['Does the delphinium spread in the halfmoon?', 'Does the evening brighten in the obelisk?']

rand_sentence(language="en", type="exclamation", count=2)
# ['Well, the chai boils in the mesa!', 'Wow, the loud sinew heals!']

rand_sentence(language="en", type="trailing", count=2)
# ['In summer, the amber frappe melts…', 'The zesty dumpling cools…']
```

:::

A question is a shape of its own rather than a mark added to a statement, which is why the do-support is not a branch in the code. English declares a shape whose auxiliary stands in front of the subject, and the verb falls back to its base form. German moves its finite verb to where nothing else stands, Korean changes the ending on the predicate itself, and Japanese, Chinese and Vietnamese add a tag (`か`, `吗`, `không`) after the whole clause.

| Language | How it asks |  |
| --- | --- | --- |
| `en` | do-support, and the base form behind it | `Does the delphinium spread?` |
| `de` | the finite verb moves to the front | `Fliegt ein düsteres Kaninchen sorgsam?` |
| `ko` | the ending on the predicate changes | `베고니아가 시드니?` |
| `ja` `zh` `vi` | a tag after the clause | `侦探在遥远北极星里靠近吗？` |
| `es` `it` `ru` | the mark alone | `¿El vino vívido se estropea en la sabana?` |

In the three languages on the last row the question is the statement, so they declare no question shape and get their statement shapes back. Spanish marks both ends, which is what its `¿` and `¡` are.

An exclamation usually opens on an interjection, because one without anything in front of it is a statement wearing a mark. A statement never opens on one, and a question has its own mark to do the work.

::: lang js

```javascript
randSentence({ language: 'ko', type: 'exclamation', count: 2 });
// ['저런, 두꺼운 황사가 깊어진다!', '오, 여름에 해뜰녘이 초원에서 짙어진다!']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.ko, type: {SentenceType.exclamation}, count: 2);
// [저런, 두꺼운 황사가 깊어진다!, 오, 여름에 해뜰녘이 초원에서 짙어진다!]
```

:::

::: lang py

```python
rand_sentence(language="ko", type="exclamation", count=2)
# ['저런, 두꺼운 황사가 깊어진다!', '오, 여름에 해뜰녘이 초원에서 짙어진다!']
```

:::

Asking for more than one type decides per sentence, so a paragraph can ask something and then answer it. `SentenceDetail.types` reports which each one was.

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

A word you named through `include` comes out in the form the type asks for: `include: '달린다'` with `type: 'question'` writes `달리니?`, not `달린다?`. The forms are stored beside the plain words rather than instead of them, one for one, which is what makes the translation possible.

## The speech level {#politeness}

`style` is the speech level the sentence is written at. Four of them, which is what a Korean speech level actually is:

| Level      | Korean      | What it is                                                  |
| ---------- | ----------- | ----------------------------------------------------------- |
| `'plain'`  | 해라체      | The voice of a book. Nobody is being addressed.             |
| `'casual'` | 해체 (반말) | What you say to someone you are close to.                   |
| `'polite'` | 해요체      | The same closeness, said politely. The warmest of the four. |
| `'formal'` | 합쇼체      | Polite and at a distance.                                   |

Left out, the level is drawn per result, so two calls are not the same voice twice. Name one and every sentence of the result is written at it.

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

The level reaches the mood as well as the ending. 해체 and 해요체 have no separate question or exclamation, since `달려` asks and tells alike and only the mark after it differs, so those two levels write one form for everything. 해라체 and 합쇼체 do change, and they change differently: 해라체 asks with `-니`, `-나` and `-(으)ㄴ가` and exclaims with `-구나`, `-네` and `-군`, while 합쇼체 turns `달립니다` into `달립니까`.

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

A Korean question has more than one ending, and a pool entry says so. The form pools stay index-aligned with the plain words, which is what lets a required word be translated by its position, and an entry lists its endings with `|` between them: `달리니|달리나|달리는가` is one verb written three ways. One of them is drawn per sentence.

Japanese has two levels and maps onto the four. `'casual'` is its plain form and `'polite'` and `'formal'` are both `走ります`; `か` does the asking at every level, because it is the frame's tag rather than part of the verb.

The other seven write the same sentence at every level. Spanish, Italian, German and Russian have a T–V distinction, but it lives in the second person and every sentence here is third, so `el león corre` is what you say to anybody. English has no such form at all. Those seven declare no level, and `style` changes nothing in them.

## Dialogue and thought {#dialogue-and-thought}

`'dialogue'` and `'thought'` are the two types that are not shapes. Both wrap a sentence in the language's own quotation marks, and what they wrap is drawn per line. Somebody speaking asks more often than a page of prose does, and still tells more often than they ask.

::: lang js

```javascript
randSentence({ language: 'en', type: 'dialogue', count: 2 });
// ['“The stout profit is endless!”', '“Does the blue intuition remain?”']

randSentence({ language: 'ja', type: 'dialogue', count: 2 });
// ['「組版工は速いか？」', '「芒が伸びるか？」']

randSentence({ language: 'en', type: 'thought', count: 2 });
// ['‘Is the tangled kraken restless?’', '‘Does the bronze torch age?’']
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.en, type: {SentenceType.dialogue}, count: 2);
// [“The stout profit is endless!”, “Does the blue intuition remain?”]

randSentence(language: WordLanguage.ja, type: {SentenceType.dialogue}, count: 2);
// [「組版工は速いか？」, 「芒が伸びるか？」]

randSentence(language: WordLanguage.en, type: {SentenceType.thought}, count: 2);
// [‘Is the tangled kraken restless?’, ‘Does the bronze torch age?’]
```

:::

::: lang py

```python
rand_sentence(language="en", type="dialogue", count=2)
# ['“The stout profit is endless!”', '“Does the blue intuition remain?”']

rand_sentence(language="ja", type="dialogue", count=2)
# ['「組版工は速いか？」', '「芒が伸びるか？」']

rand_sentence(language="en", type="thought", count=2)
# ['‘Is the tangled kraken restless?’', '‘Does the bronze torch age?’']
```

:::

The marks are the language's, and they are not close to universal. Dialogue takes the first level and thought the second:

| Language            | First level | Second level |
| ------------------- | ----------- | ------------ |
| `en` `ko` `zh` `vi` | `“…”`       | `‘…’`        |
| `ja`                | `「…」`     | `『…』`      |
| `es` `it`           | `«…»`       | `“…”`        |
| `de`                | `„…“`       | `‚…‘`        |
| `ru`                | `«…»`       | `„…“`        |

Chinese takes the curly quotes rather than the corner brackets: these pools are written in simplified Chinese, and horizontal simplified text uses `“”`, while `「」` is what Taiwan and Hong Kong write. German opens low and closes high, which is why its pair is not symmetrical.

`quote` overrides which pair is used, whatever the type, so a thought can carry the first-level marks and a line of dialogue the second.

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

There is no speech tag. `…라고 그는 말했다` needs a speaker, which [`includeName`](#a-persons-name) has, and a verb of speaking, which none of the nine languages' pools hold. What you get is the line, not who said it.

## More than one sentence {#more-than-one-sentence}

`sentences` puts more than one sentence in one result. They come back as a single string, `count` is still how many strings there are, and they are about the same thing rather than being that many separate draws.

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

The first sentence sets the topic, and every sentence after it stays on it. It names that subject again, stands a pronoun where it was, or draws a fresh noun of the same kind, so a paragraph that opens on a creature never wanders into an idea halfway through. It may also open on a connective (`But`, `하지만`, `そして`).

A person is not a kind of thing. A paragraph about Emma is about Emma: it names her again or stands a pronoun where she was, and never draws somebody else of the same kind. That last one would be a paragraph that quietly becomes about Sophie.

It keeps its scene too. A place the first sentence named is where the rest of it happens, and a thing it was about is the thing it stays about. A later sentence writes its own article and may put a different modifier in front, so `in the icy hamlet` becomes `in the hamlet`, not `in the vault`.

And it stays in the register it opened in. Prose about a line never becomes one, so a narrated paragraph never quotes. A quoted one is lines with prose between them: two people talking take turns, and one person saying four things in a row is a paragraph missing everything that happened while they said them. What that prose may not be is a third voice, so it tells rather than asks.

A connective only claims what the two sentences can carry. Each one is tagged by what it says about the sentence in front of it, and three of the four can open any continuation: time passed, here is one more thing, this cuts against that. The fourth cannot. `so`, `therefore`, `그러므로` and `だから` say this sentence follows from the last one, which is only true when the two are about the same thing and this one is telling rather than asking. `그러므로 금빛 하이볼이 식죠?` after a sentence about a pretzel is a consequence of nothing.

| Claim           | English               | Korean               | Japanese             |
| --------------- | --------------------- | -------------------- | -------------------- |
| one more thing  | `and then`, `besides` | `그리고`, `게다가`   | `そして`, `また`     |
| time passed     | `meanwhile`, `later`  | `이윽고`, `마침내`   | `やがて`, `その後`   |
| against that    | `but`, `however`      | `하지만`, `그러나`   | `しかし`, `けれども` |
| because of that | `so`, `therefore`     | `그래서`, `그러므로` | `だから`, `つまり`   |

A language declares only the kinds it can write. German has none for time passed: `dann` and `danach` are adverbs, and an adverb in the first position moves the finite verb, so the five coordinating conjunctions are all it can open a clause with.

Nothing in a paragraph is said twice over. A kind the sentence before it already was is less likely each time it comes round again, so a run of questions ends by itself; a verb group is spent before it starts over, rather than closing three of four lines on the same word; a person is named and then left alone; a fresh subject usually comes from the topic's own theme rather than from anywhere in its class; and no two sentences of one result open on the same connective or interjection.

Each language handles the pronoun its own way. English writes `it`; Korean, Japanese, Chinese, Spanish and Italian leave the subject out entirely, which is what they actually do in a second sentence; German and Russian pick it by the noun's gender. A language whose written pronoun cannot stand for a person names the topic again instead: English `he` and `she` need a gender the word pools do not carry, and `그것`, `それ`, `它` and `nó` are inanimate.

A name is the exception, because it is the one subject that does carry a gender. `Philip counts the prime. He forgets it in the supernova.` is English standing `he` where `the locksmith` could only ever be named again. A language that writes no gendered pronoun is unaffected: Korean drops the subject rather than saying `그것` about somebody.

The length range describes the whole string, whatever the sentence count. It is shared out across the sentences before any of them is drawn, and the last one takes the rounding.

::: lang js

```javascript
randSentence({ language: 'ko', sentences: 3, minLength: 40, maxLength: 55 });
// ['반달이 함께 깊어진다. 그리고 별똥별이 역에서 물든다. 아침에 그것이 조용해진다.'] // 45 characters
```

:::

::: lang dart

```dart
randSentence(language: WordLanguage.ko, sentences: 3, minLength: 40, maxLength: 55);
// [반달이 함께 깊어진다. 그리고 별똥별이 역에서 물든다. 아침에 그것이 조용해진다.] // 45 characters
```

:::

::: lang py

```python
rand_sentence(language="ko", sentences=3, min_length=40, max_length=55)
# ['반달이 함께 깊어진다. 그리고 별똥별이 역에서 물든다. 아침에 그것이 조용해진다.']  # 45 characters
```

:::

`include` goes in the first sentence, which puts each word in the result once rather than once per sentence. `sentences` is clamped to <Lang js="RAND_SENTENCE_COUNT_MAX" dart="randSentenceCountMax" py="RAND_SENTENCE_COUNT_MAX" code />, which is ten.

## A person's name {#a-persons-name}

Every other generator here keeps person names out on purpose. A nickname is never built from one, and that rule is the whole point of keeping names and words apart. A sentence is the exception: <Lang js="includeName" py="include_name" dart="includeName" code /> writes a generated name where the sentence has room for a person.

Left out, it is a coin flip per result rather than per sentence, because a paragraph either has a person in it or does not. Set it yourself and that answer stands.

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

It is a bare given name rather than a full one or a noun phrase: no article, no modifier, and the particle Korean puts after it chosen from its own last character the way any other word's is (`소한이`, `은영이`). It carries the gender it was drawn for, so a Spanish, Italian or Russian predicate agrees with it, as in `Celeste è affamata` beside `Ivano è raro`. That gender is the one thing the generator could not read off a name, since a name is in none of the word pools.

A name only stands where a person could. Turning the option on narrows the subject to the themes that name people, so that the sentence has somewhere to put one. A `theme` you named yourself still wins, and then no name is written at all:

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

`SentenceDetail.names` reports the names a result was written with, and a named subject reports <Lang js="theme: null" dart="theme: null" py="theme=None" code />, because a name belongs to no theme.

::: warning It costs 22 KB, whether you use it or not

The option reaches the person-name pools, and a synchronous API has no dynamic import to hide behind, so a bundle that includes `randSentence` at all includes them. Bundling only `randSentence` with esbuild and gzipping: **122.5 KB before, 144.5 KB after**, `+22.0 KB` or `+18%`. The sentence generator already carries the whole word pools, which is 110 KB of that, and the name pools are the 22 KB beside them.

If you never write a name and the size matters, there is nothing to do about it in this version except not to import `randSentence`.

:::

## The detail output {#the-detail-output}

`output: 'detail'` reports the pieces each sentence was built from instead of returning a string: the phrases in order, what each of them does, the language, and the subject's theme.

::: lang dart

Dart spells this as a **second function**, `randSentenceDetails`, because it has no way to make one function's return type depend on an argument. It takes the same parameters as `randSentence`.

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

| Field | Type | Description |
| --- | --- | --- |
| `sentence` | <Lang js="string" dart="String" py="str" code /> | The finished result, punctuation and all — every sentence of it, joined. |
| `sentences` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | One entry per sentence. A single entry unless `sentences` asked for more. |
| `phrases` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | The phrases it is made of, in order — without the particles. One flat list across every sentence. |
| `slots` | <Lang js="SentenceSlot[]" dart="List&lt;SentenceSlot&gt;" py="tuple[SentenceSlot, ...]" code /> | What each phrase does, at the same index as `phrases`. |
| `names` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, ...]" code /> | The person names the result was written with, in order. Empty unless `includeName` asked for them. |
| `types` | <Lang js="SentenceType[]" dart="List&lt;SentenceType&gt;" py="tuple[SentenceType, ...]" code /> | What each sentence is doing, at the same index as `sentences`. |
| `language` | `WordLanguage` | The language this sentence was generated in. |
| `theme` | <Lang js="WordTheme &#124; null" dart="WordTheme?" py="WordTheme &#124; None" code /> | Theme of the subject — the first sentence's, which is what the rest stay about. Null when that word is not one the generator knows. |

`phrases` holds the phrases and nothing else. The particle or preposition that marks one lives in `sentence` alone, so `그리핀이 …` reports `그리핀` and joining the phrases back together does not reproduce the sentence. Read `sentence` for the finished string, and `phrases` for what it was built from.

Every sentence has exactly one `subject` and exactly one predicate, and that predicate is either a `verb` or a `state`, never both.

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
