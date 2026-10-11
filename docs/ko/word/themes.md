# 테마

테마는 수식어를 앞에 붙일 수 있는 일상 어휘의 한 묶음입니다. 모두 37개이고, 모든 언어가 모든 테마를 채우며, **한 단어는 정확히 하나의 테마에만 속합니다.** 생성 결과가 보고하는 테마가 모호해지지 않는 이유가 이것입니다.

테마 하나하나가 그 자체로 생성 함수이기도 합니다. `randWord`는 테마를 옵션으로 받고, 표 세 번째 열의 37개 함수는 테마를 미리 정해 둔 같은 생성기이며, `randNickname`도 같은 단어 풀 위에서 동작합니다.

| 테마 | 함수 | 담고 있는 것 | 한국어 | 영어 |
| --- | --- | --- | --- | --- |
| `animal` | [`randAnimal`](./rand-animal) | 동물 | 사자, 고양이 | Lion, Cat |
| `object` | [`randObject`](./rand-object) | 손 닿는 사물 | 물병, 우산 | Bottle, Umbrella |
| `nature` | [`randNature`](./rand-nature) | 자연과 자연 현상 | 하늘, 파도 | Sky, River |
| `plant` | [`randPlant`](./rand-plant) | 식물과 그 부분 | 민들레, 솔방울 | Dandelion, Acorn |
| `gem` | [`randGem`](./rand-gem) | 돌, 금속, 보석 | 흑요석, 청동 | Obsidian, Bronze |
| `concept` | [`randConcept`](./rand-concept) | 학문 용어와 인문·사회의 개념 | 철학, 자유 | Philosophy, Truth |
| `myth` | [`randMyth`](./rand-myth) | 마법과 신화를 이루는 것 | 부적, 저주 | Rune, Elixir |
| `monster` | [`randMonster`](./rand-monster) | 신화와 민담, 판타지 속 생명체 | 구미호, 도깨비 | Dragon, Golem |
| `job` | [`randJob`](./rand-job) | 직업과 역할 | 대장장이, 항해사 | Blacksmith, Archer |
| `music` | [`randMusic`](./rand-music) | 악기, 악보, 연주 | 거문고, 악보 | Cello, Melody |
| `genre` | [`randGenre`](./rand-genre) | 음악의 장르와 곡의 형식 | 재즈, 교향곡 | Techno, Sonata |
| `place` | [`randPlace`](./rand-place) | 건물이 아닌 장소 | 광장, 골목 | Harbor, Plaza |
| `building` | [`randBuilding`](./rand-building) | 건물과 그 안의 공간, 매물의 종류 | 도서관, 오피스텔 | Lighthouse, Library |
| `food` | [`randFood`](./rand-food) | 완성된 음식 | 떡볶이, 김밥 | Dumpling, Pancake |
| `ingredient` | [`randIngredient`](./rand-ingredient) | 요리의 재료 | 간장, 밀가루 | Cinnamon, Butter |
| `vegetable` | [`randVegetable`](./rand-vegetable) | 채소 | 당근, 시금치 | Carrot, Spinach |
| `fruit` | [`randFruit`](./rand-fruit) | 과일 | 복숭아, 수박 | Apple, Peach |
| `sport` | [`randSport`](./rand-sport) | 스포츠와 그 목표물 | 양궁, 트로피 | Archery, Trophy |
| `vehicle` | [`randVehicle`](./rand-vehicle) | 사람을 실어 나르는 것 | 열기구, 전차 | Airship, Streetcar |
| `product` | [`randProduct`](./rand-product) | 사서 쓰는 물건 | 이어폰, 냉장고 | Earbuds, Toaster |
| `beauty` | [`randBeauty`](./rand-beauty) | 화장품과 피부·머리·손톱 관리 | 립스틱, 로션 | Lipstick, Mascara |
| `color` | [`randColor`](./rand-color) | 색 이름 | 주홍, 쪽빛 | Crimson, Ocher |
| `finance` | [`randFinance`](./rand-finance) | 돈과 돈으로 하는 일 | 이자, 환율 | Ledger, Yield |
| `tech` | [`randTech`](./rand-tech) | 컴퓨터와 그 사이의 망 | 서버, 캐시 | Server, Subnet |
| `weather` | [`randWeather`](./rand-weather) | 하늘이 하는 일 | 소나기, 무지개 | Drizzle, Gale |
| `space` | [`randSpace`](./rand-space) | 하늘 너머 | 은하, 혜성 | Galaxy, Nebula |
| `planet` | [`randPlanet`](./rand-planet) | 행성의 이름 | 화성, 세드나 | Jupiter, Sedna |
| `time` | [`randTime`](./rand-time) | 일이 일어나는 때 | 새벽, 정오 | Twilight, Epoch |
| `emotion` | [`randEmotion`](./rand-emotion) | 사람이 느끼는 것 | 그리움, 설렘 | Longing, Relief |
| `body` | [`randBody`](./rand-body) | 몸의 부위 | 손목, 심장 | Wrist, Sinew |
| `clothing` | [`randClothing`](./rand-clothing) | 입는 것 | 두루마기, 양말 | Cardigan, Linen |
| `tool` | [`randTool`](./rand-tool) | 손으로 다루는 연장 | 대패, 곡괭이 | Chisel, Trowel |
| `drink` | [`randDrink`](./rand-drink) | 마실 것 | 식혜, 보리차 | Cider, Cordial |
| `toy` | [`randToy`](./rand-toy) | 장난감과 놀이 | 팽이, 연 | Kite, Yoyo |
| `sound` | [`randSound`](./rand-sound) | 소리, 목소리, 의성어 | 속삭임, 함성 | Whisper, Hum |
| `person` | [`randPerson`](./rand-person) | 나이, 관계, 성격으로 부르는 사람 | 꼬마, 이웃 | Toddler, Neighbor |
| `furniture` | [`randFurniture`](./rand-furniture) | 가구와 살림살이 | 흔들의자, 요람 | Hammock, Cradle |

::: lang js

```javascript
import { WORD_THEMES, randFood, randWord } from 'randino';

WORD_THEMES;
// ['animal', 'object', 'nature', 'plant', 'gem', 'concept', 'myth', 'monster',
//  'job', 'music', 'genre', 'place', 'building', 'food', 'ingredient',
//  'vegetable', 'fruit', 'sport', 'vehicle', 'product', 'beauty', 'color',
//  'finance', 'tech', 'weather', 'space', 'planet', 'time', 'emotion', 'body',
//  'clothing', 'tool', 'drink', 'toy', 'sound', 'person', 'furniture']

randWord({ theme: 'food', language: 'en', count: 3 });
// ['Dumpling', 'Pretzel', 'Pancake']

randFood({ language: 'en', count: 3 }); // 같은 결과
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

wordThemes; // 표시 순서대로 나열된 모든 WordTheme

randWord(theme: WordTheme.food, language: WordLanguage.en, count: 3);
// [Dumpling, Pretzel, Pancake]

randFood(language: WordLanguage.en, count: 3); // 같은 결과
```

:::

::: lang py

```python
from randino import WORD_THEMES, rand_food, rand_word

WORD_THEMES
# ('animal', 'object', 'nature', 'plant', 'gem', 'concept', 'myth', 'monster',
#  'job', 'music', 'genre', 'place', 'building', 'food', 'ingredient',
#  'vegetable', 'fruit', 'sport', 'vehicle', 'product', 'beauty', 'color',
#  'finance', 'tech', 'weather', 'space', 'planet', 'time', 'emotion', 'body',
#  'clothing', 'tool', 'drink', 'toy', 'sound', 'person', 'furniture')

rand_word(theme="food", language="en", count=3)
# ['Dumpling', 'Pretzel', 'Pancake']

rand_food(language="en", count=3)  # 같은 결과
```

:::

테마를 생략하면 결과마다 테마를 하나씩 무작위로 골라 뽑으므로, 한 번에 여러 개를 만들면 37개 테마에 고르게 퍼집니다.

`randNickname`은 예외입니다. 기본 `realism`에서는 `color`, `finance`, `tech`를 빼고 34개만 돕니다. 색이나 대출 앞에 수식어가 붙으면 핸들이 아니라 농담으로 읽히기 때문입니다. `realism`을 풀면 다시 들어오고, 테마를 직접 지정하면 어느 `realism`에서든 나옵니다. [닉네임 동작 방식](../nickname/#realism-invents-words-rather-than-drawing-them)에 자세히 있습니다.

## 테마가 지키는 규칙

**테마는 서로 겹치지 않습니다.** 한 단어가 두 테마에 있으면 보고되는 테마가 모호해지고, 상세 출력이 호출자가 요청한 적 없는 테마를 알려 주게 됩니다. 새 테마가 기존 테마의 단어를 가져갈 때는 복사가 아니라 **이동**합니다. `place`는 `concept`에 있던 장소 열두 개를 가져갔고, `vehicle`은 `object`에서 자전거와 기차를, `plant`는 `nature`에서 꽃과 나무를, `music`은 `object`에서 악기를, `toy`는 같은 곳에서 팽이와 주사위를, `furniture`는 `product`에서 옷장과 책장을, `monster`는 `myth`에서 생명체를 모두, `genre`는 `music`에서 음악의 갈래를, `building`은 `place`에서 건물과 그 안의 공간을, `ingredient`·`vegetable`·`fruit`는 `food`에서 완성된 음식이 아닌 것을, `beauty`는 `product`에서 화장품을, `planet`은 `space`에서 행성 이름을 가져갔습니다. 두 뜻이 정말 다른 단어일 때는 이동 대신 이름을 바꿉니다. 영어에서 장난감 구슬을 `Marbles`로 바꾼 덕분에 `gem`이 `Marble`을 유지할 수 있었습니다.

**사람 이름은 쓰지 않고, 이름으로만 쓰이는 단어도 쓰지 않습니다.** 영어는 사람 이름 풀과 자동으로 대조하므로 `job`에 `Knight`, `Baker`, `Hunter`가 없고 `plant`에 `Rose`나 `Ivy`가 없습니다. 한국어와 일본어는 같은 검사를 적용할 수 없습니다. 하늘, 별, 森은 이름으로도 쓰이는 일상 명사이기 때문입니다. 그래도 그 앞에 수식어가 붙으면 누구의 이름도 아닙니다.

**풀 크기가 고르지 않은 것은 의도된 것입니다.** 테마 대부분은 언어마다 명사를 100개 이상 담고 있고, 그보다 훨씬 적은 테마도 몇 개 있습니다. 어휘 자체가 그만큼밖에 없는 갈래가 있고(`planet`은 이름이 붙은 행성만큼만 담을 수 있습니다), 비슷한 말로 풀을 부풀리면 짧은 풀보다 나쁘게 읽힙니다.

## 보고되는 테마

| 단어의 출처                      | `theme`이 보고하는 값                    |
| -------------------------------- | ---------------------------------------- |
| 테마에서 뽑음                    | 그 테마                                  |
| `realism: 'invented'`로 만들어냄 | null — 우연히 실제 단어를 이루지 않는 한 |

마지막 줄은 버그가 아니라 실제로 일어나는 우연입니다. 음절 템플릿이 이따금 `Snake`를 만들어내므로, 만들어낸 단어가 `theme`을 `animal`로 보고하기도 합니다.

## 함께 보기

- [`randWord`](./rand-word) — 테마가 속한 생성 함수와, 그 옆의 37개 함수.
- [`randNickname`](../nickname/rand-nickname) — 같은 단어 풀을 조합하는 쪽.
- [상수](../reference/constants) — 런타임에서의 테마 목록.
