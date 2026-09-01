# 테마

테마는 수식어를 앞에 붙일 수 있는 일상 어휘의 한 묶음입니다. 모두 14개이고, 모든 언어가 모든 테마를 채우며, **한 단어는 정확히 하나의 테마에만 속합니다.** 닉네임이 보고하는 테마가 모호해지지 않는 이유가 이것입니다.

| 테마      | 담고 있는 것                      | 한국어           | 영어               |
| --------- | --------------------------------- | ---------------- | ------------------ |
| `animal`  | 동물                              | 사자, 고양이     | Lion, Cat          |
| `object`  | 손 닿는 사물                      | 물병, 우산       | Bottle, Umbrella   |
| `nature`  | 자연과 자연 현상                  | 하늘, 노을       | Sky, Dawn          |
| `plant`   | 식물과 그 부분                    | 민들레, 솔방울   | Dandelion, Acorn   |
| `gem`     | 돌, 금속, 보석                    | 흑요석, 청동     | Obsidian, Bronze   |
| `concept` | 학문 용어와 인문·사회의 개념      | 철학, 자유       | Philosophy, Truth  |
| `myth`    | 신화 속 존재와 사물               | 구미호, 불사조   | Phoenix, Rune      |
| `job`     | 직업과 역할                       | 대장장이, 항해사 | Blacksmith, Archer |
| `music`   | 악기, 형식, 용어                  | 교향곡, 거문고   | Cello, Sonata      |
| `place`   | 걸어 들어가거나 올라갈 수 있는 곳 | 광장, 골목       | Lighthouse, Plaza  |
| `food`    | 음식과 음료                       | 떡볶이, 녹차     | Dumpling, Cocoa    |
| `sport`   | 스포츠와 그 목표물                | 양궁, 트로피     | Archery, Trophy    |
| `vehicle` | 사람을 실어 나르는 것             | 열기구, 전차     | Airship, Tramcar   |
| `product` | 사서 쓰는 물건                    | 이어폰, 냉장고   | Earbuds, Toaster   |

::: lang js

```javascript
import { NICKNAME_THEMES, randomNickname } from 'randino';

NICKNAME_THEMES;
// ['animal', 'object', 'nature', 'plant', 'gem', 'concept', 'myth', 'job',
//  'music', 'place', 'food', 'sport', 'vehicle', 'product']

randomNickname({ theme: 'food', language: 'ko', count: 3 });
// ['달콤한떡볶이', '고소한녹차', '새콤한딸기']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

nicknameThemes; // 표시 순서대로 나열된 모든 NicknameTheme

randomNickname(theme: NicknameTheme.food, language: NicknameLanguage.ko, count: 3);
// ['달콤한떡볶이', '고소한녹차', '새콤한딸기']
```

:::

테마를 생략하면 닉네임마다 테마를 하나씩 무작위로 골라 뽑으므로, 한 번에 여러 개를 만들면 14개 테마에 고르게 퍼집니다.

## 테마가 지키는 규칙

**테마는 서로 겹치지 않습니다.** 한 단어가 두 테마에 있으면 `baseWord`가 보고할 테마가 모호해지고, `randomNicknameDetails`가 호출자가 요청한 적 없는 테마를 알려 주게 됩니다. 새 테마가 기존 테마의 단어를 가져갈 때는 복사가 아니라 **이동**합니다. `place`는 `concept`에 있던 장소 열두 개를 가져갔고, `vehicle`은 `object`에서 자전거와 기차를, `plant`는 `nature`에서 꽃과 나무를, `music`은 `object`에서 악기를 가져갔습니다. 두 뜻이 정말 다른 단어일 때는 이동 대신 이름을 바꿉니다. 영어에서 장난감 구슬을 `Marbles`로 바꾼 덕분에 `gem`이 `Marble`을 유지할 수 있었습니다.

**사람 이름은 쓰지 않고, 이름으로만 쓰이는 단어도 쓰지 않습니다.** 영어는 사람 이름 풀과 자동으로 대조하므로 `job`에 `Knight`, `Baker`, `Hunter`가 없고 `plant`에 `Rose`나 `Ivy`가 없습니다. 한국어와 일본어는 같은 검사를 적용할 수 없습니다. 하늘, 별, 森은 이름으로도 쓰이는 일상 명사이기 때문입니다. 그래도 그 앞에 수식어가 붙으면 누구의 이름도 아닙니다.

**풀 크기가 고르지 않은 것은 의도된 것입니다.** 대부분의 테마는 언어마다 60개 이상의 명사를 담고 있지만, `gem`, `sport`, `vehicle`, `product`는 각각 약 55, 46, 43, 36개입니다. 세상에 그만큼밖에 없고, 비슷한 말로 풀을 부풀리면 짧은 풀보다 나쁘게 읽힙니다.

## 테마는 어디서 오는가

| 기준 단어의 출처        | `theme`이 보고하는 값                     |
| ----------------------- | ----------------------------------------- |
| 테마에서 뽑음           | 그 테마                                   |
| `baseWord`로 직접 지정  | 14개 테마 전체에서 찾아낸, 그 단어의 테마 |
| 높은 `style`로 만들어냄 | null — 우연히 실제 단어를 이루지 않는 한  |

마지막 줄은 버그가 아니라 실제로 일어나는 우연입니다. `나` + `비`는 `나비`가 되므로, 만들어낸 한국어 닉네임이 `theme`을 `animal`로 보고할 수 있습니다. [`randomNicknameDetails`](./random-nickname-details#about-theme)를 참고하세요.

## 함께 보기

- [`randomNickname`](./random-nickname) — 테마를 고르는 곳.
- [상수](../reference/constants) — 런타임에서의 테마 목록.
