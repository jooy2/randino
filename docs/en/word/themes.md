# Themes

A theme is a slice of everyday vocabulary that a modifier can sit in front of. There are twenty-five of them, every language fills every one, and **a word belongs to exactly one** — which is what makes the theme a word reports unambiguous.

Each theme is also a generator of its own. `randWord` takes the theme as an option; the twenty-five functions in the third column are the same generator with the theme already chosen, and `randNickname` builds on the same pools.

| Theme | Function | What it holds | Korean | English |
| --- | --- | --- | --- | --- |
| `animal` | [`randAnimal`](./rand-animal) | animals | 사자, 고양이 | Lion, Cat |
| `object` | [`randObject`](./rand-object) | things within reach | 물병, 우산 | Bottle, Umbrella |
| `nature` | [`randNature`](./rand-nature) | nature and its phenomena | 하늘, 노을 | Sky, Dawn |
| `plant` | [`randPlant`](./rand-plant) | plants, and their parts | 민들레, 솔방울 | Dandelion, Acorn |
| `gem` | [`randGem`](./rand-gem) | stones, metals and gems | 흑요석, 청동 | Obsidian, Bronze |
| `concept` | [`randConcept`](./rand-concept) | terms, and ideas from the humanities | 철학, 자유 | Philosophy, Truth |
| `myth` | [`randMyth`](./rand-myth) | creatures and things out of myth | 구미호, 불사조 | Phoenix, Rune |
| `job` | [`randJob`](./rand-job) | the trades and roles people hold | 대장장이, 항해사 | Blacksmith, Archer |
| `music` | [`randMusic`](./rand-music) | instruments, forms and terms | 교향곡, 거문고 | Cello, Sonata |
| `place` | [`randPlace`](./rand-place) | places you can walk into or up to | 광장, 골목 | Lighthouse, Plaza |
| `food` | [`randFood`](./rand-food) | food and drink | 떡볶이, 녹차 | Dumpling, Cocoa |
| `sport` | [`randSport`](./rand-sport) | sports, and what they are played for | 양궁, 트로피 | Archery, Trophy |
| `vehicle` | [`randVehicle`](./rand-vehicle) | things that carry you | 열기구, 전차 | Airship, Tramcar |
| `product` | [`randProduct`](./rand-product) | things you buy | 이어폰, 냉장고 | Earbuds, Toaster |
| `color` | [`randColor`](./rand-color) | colours, plain and storied | 주홍, 쪽빛 | Crimson, Ocher |
| `finance` | [`randFinance`](./rand-finance) | money, and what is done with it | 이자, 환율 | Ledger, Yield |
| `tech` | [`randTech`](./rand-tech) | computers, and the networks between them | 서버, 캐시 | Server, Subnet |
| `weather` | [`randWeather`](./rand-weather) | what the sky is doing | 소나기, 무지개 | Drizzle, Gale |
| `space` | [`randSpace`](./rand-space) | what is beyond the sky | 은하, 혜성 | Galaxy, Nebula |
| `time` | [`randTime`](./rand-time) | when something happens | 새벽, 한여름 | Twilight, Epoch |
| `emotion` | [`randEmotion`](./rand-emotion) | what someone feels | 그리움, 설렘 | Longing, Relief |
| `body` | [`randBody`](./rand-body) | the parts of a body | 손목, 심장 | Wrist, Sinew |
| `clothing` | [`randClothing`](./rand-clothing) | what people wear | 두루마기, 양말 | Cardigan, Linen |
| `tool` | [`randTool`](./rand-tool) | what a hand works with | 대패, 곡괭이 | Chisel, Trowel |
| `drink` | [`randDrink`](./rand-drink) | something to drink | 식혜, 보리차 | Cider, Cordial |

::: lang js

```javascript
import { WORD_THEMES, randFood, randWord } from 'randino';

WORD_THEMES;
// ['animal', 'object', 'nature', 'plant', 'gem', 'concept', 'myth', 'job',
//  'music', 'place', 'food', 'sport', 'vehicle', 'product']

randWord({ theme: 'food', language: 'en', count: 3 });
// ['Dumpling', 'Cocoa', 'Pancake']

randFood({ language: 'en', count: 3 }); // the same thing
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

wordThemes; // every WordTheme, in presentation order

randWord(theme: WordTheme.food, language: WordLanguage.en, count: 3);
// [Dumpling, Cocoa, Pancake]

randFood(language: WordLanguage.en, count: 3); // the same thing
```

:::

::: lang py

```python
from randino import WORD_THEMES, rand_food, rand_word

WORD_THEMES
# ('animal', 'object', 'nature', 'plant', 'gem', 'concept', 'myth', 'job',
#  'music', 'place', 'food', 'sport', 'vehicle', 'product')

rand_word(theme="food", language="en", count=3)
# ['Dumpling', 'Cocoa', 'Pancake']

rand_food(language="en", count=3)  # the same thing
```

:::

Leave the theme out and each result draws from one theme picked at random, so a batch spreads across all twenty-five.

`randNickname` is the exception: at the default `realism` it spans twenty-two of them, leaving out `color`, `finance` and `tech`, because a word in front of a colour or a loan reads as a joke rather than a handle. Loosening `realism` puts them back, and naming one of them works at any realism. See [How a nickname behaves](../nickname/#realism-invents-words-rather-than-drawing-them).

## The rules a theme follows

**Themes are disjoint.** A word in two of them would make the reported theme ambiguous, and would make the detail output name a theme the caller never asked about. When a new theme claims a word an older one already held, the word **moves** rather than being copied: `place` took the twelve places that were sitting in `concept`, `vehicle` took the bicycle and the train out of `object`, `plant` took the flowers and the trees out of `nature`, and `music` took the instruments out of `object`. Where the two senses are genuinely different words, the word is renamed instead — the English toy became `Marbles` so that `gem` could keep `Marble`.

**No person names, and no word that is only a name.** For English this is enforced against the person-name pools automatically, which is why `job` has no `Knight`, `Baker` or `Hunter` and `plant` no `Rose` or `Ivy`. Korean and Japanese cannot be held to the same check — 하늘, 별 and 森 are everyday nouns that happen also to be names — but a modifier in front of one is still nobody's name.

**Pool sizes are uneven on purpose.** Most themes hold sixty or more nouns per language; `gem`, `sport`, `vehicle` and `product` hold roughly 55, 46, 43 and 36. The world simply has fewer of those, and padding a pool with near-synonyms reads worse than a shorter pool.

## Where a theme comes from

| Where the word came from          | What `theme` reports                          |
| --------------------------------- | --------------------------------------------- |
| Drawn from a theme                | That theme                                    |
| Invented at `realism: 'invented'` | Null — unless it happens to spell a real word |

That last row is a real coincidence rather than a bug: the syllable templates spell `Snake` now and then, so an invented word can come back with `theme` set to `animal`.

## See also

- [`randWord`](./rand-word) — the generator the theme belongs to, and the twenty-five functions beside it.
- [`randNickname`](../nickname/rand-nickname) — the same pools, put together.
- [Constants](../reference/constants) — the theme list at runtime.
