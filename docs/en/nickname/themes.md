# Themes

A theme is a slice of everyday vocabulary that a modifier can sit in front of. There are fourteen of them, every language fills every one, and **a word belongs to exactly one** — which is what makes the theme a nickname reports unambiguous.

| Theme     | What it holds                        | Korean           | English            |
| --------- | ------------------------------------ | ---------------- | ------------------ |
| `animal`  | animals                              | 사자, 고양이     | Lion, Cat          |
| `object`  | things within reach                  | 물병, 우산       | Bottle, Umbrella   |
| `nature`  | nature and its phenomena             | 하늘, 노을       | Sky, Dawn          |
| `plant`   | plants, and their parts              | 민들레, 솔방울   | Dandelion, Acorn   |
| `gem`     | stones, metals and gems              | 흑요석, 청동     | Obsidian, Bronze   |
| `concept` | terms, and ideas from the humanities | 철학, 자유       | Philosophy, Truth  |
| `myth`    | creatures and things out of myth     | 구미호, 불사조   | Phoenix, Rune      |
| `job`     | the trades and roles people hold     | 대장장이, 항해사 | Blacksmith, Archer |
| `music`   | instruments, forms and terms         | 교향곡, 거문고   | Cello, Sonata      |
| `place`   | places you can walk into or up to    | 광장, 골목       | Lighthouse, Plaza  |
| `food`    | food and drink                       | 떡볶이, 녹차     | Dumpling, Cocoa    |
| `sport`   | sports, and what they are played for | 양궁, 트로피     | Archery, Trophy    |
| `vehicle` | things that carry you                | 열기구, 전차     | Airship, Tramcar   |
| `product` | things you buy                       | 이어폰, 냉장고   | Earbuds, Toaster   |

::: lang js

```javascript
import { NICKNAME_THEMES, randNickname } from 'randino';

NICKNAME_THEMES;
// ['animal', 'object', 'nature', 'plant', 'gem', 'concept', 'myth', 'job',
//  'music', 'place', 'food', 'sport', 'vehicle', 'product']

randNickname({ theme: 'food', language: 'ko', count: 3 });
// ['달콤한떡볶이', '고소한녹차', '새콤한딸기']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nicknameThemes; // every NicknameTheme, in presentation order

randNickname(theme: NicknameTheme.food, language: NicknameLanguage.ko, count: 3);
// ['달콤한떡볶이', '고소한녹차', '새콤한딸기']
```

:::

::: lang py

```python
from randino import NICKNAME_THEMES, rand_nickname

NICKNAME_THEMES
# ('animal', 'object', 'nature', 'plant', 'gem', 'concept', 'myth', 'job',
#  'music', 'place', 'food', 'sport', 'vehicle', 'product')

rand_nickname(theme="food", language="ko", count=3)
# ['달콤한떡볶이', '고소한녹차', '새콤한딸기']
```

:::

Leave the theme out and each nickname draws from one theme picked at random, so a batch spreads across all fourteen.

## The rules a theme follows

**Themes are disjoint.** A word in two of them would make the reported theme ambiguous for a <Lang js="baseWord" dart="baseWord" py="base_word" code />, and would make the detail output name a theme the caller never asked about. When a new theme claims a word an older one already held, the word **moves** rather than being copied: `place` took the twelve places that were sitting in `concept`, `vehicle` took the bicycle and the train out of `object`, `plant` took the flowers and the trees out of `nature`, and `music` took the instruments out of `object`. Where the two senses are genuinely different words, the word is renamed instead — the English toy became `Marbles` so that `gem` could keep `Marble`.

**No person names, and no word that is only a name.** For English this is enforced against the person-name pools automatically, which is why `job` has no `Knight`, `Baker` or `Hunter` and `plant` no `Rose` or `Ivy`. Korean and Japanese cannot be held to the same check — 하늘, 별 and 森 are everyday nouns that happen also to be names — but a modifier in front of one is still nobody's name.

**Pool sizes are uneven on purpose.** Most themes hold sixty or more nouns per language; `gem`, `sport`, `vehicle` and `product` hold roughly 55, 46, 43 and 36. The world simply has fewer of those, and padding a pool with near-synonyms reads worse than a shorter pool.

## Where a theme comes from

| Where the base word came from | What `theme` reports |
| --- | --- |
| Drawn from a theme | That theme |
| Given as <Lang js="baseWord" dart="baseWord" py="base_word" code /> | The theme that holds it, looked up across all fourteen |
| Invented at a high `style` | Null — unless it happens to spell a real word |

That last row is a real coincidence rather than a bug: `나` + `비` spells `나비`, so an invented Korean nickname can come back with `theme` set to `animal`. See [About `theme`](./rand-nickname#about-theme).

## See also

- [`randNickname`](./rand-nickname) — where the theme is chosen.
- [Constants](../reference/constants) — the theme list at runtime.
