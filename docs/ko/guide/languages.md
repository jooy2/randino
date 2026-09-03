# 지원 언어

randino는 9개 언어로 텍스트를 생성하며, 각 언어는 고유한 단어 풀과 이름 순서, 로마자 표기 규칙을 가집니다. 모든 생성기는 언어를 받고, 지정하지 않으면 지원하는 모든 언어를 섞습니다.

| 코드 | 언어       | 표기       | 사람 이름 | 단어와 닉네임 |
| ---- | ---------- | ---------- | :-------: | :-----------: |
| `en` | 영어       | English    |    ✅     |      ✅       |
| `ko` | 한국어     | 한국어     |    ✅     |      ✅       |
| `ja` | 일본어     | 日本語     |    ✅     |      ✅       |
| `zh` | 중국어     | 中文       |    ✅     |      ✅       |
| `it` | 이탈리아어 | Italiano   |    ✅     |      ❌       |
| `de` | 독일어     | Deutsch    |    ✅     |      ❌       |
| `ru` | 러시아어   | Русский    |    ✅     |      ❌       |
| `es` | 스페인어   | Español    |    ✅     |      ❌       |
| `vi` | 베트남어   | Tiếng Việt |    ✅     |      ❌       |

::: lang js

코드는 문자열 리터럴이며, 런타임에는 `NAME_LANGUAGES`와 `WORD_LANGUAGES`로도 확인할 수 있습니다.

```javascript
import { NAME_LANGUAGES, WORD_LANGUAGES } from 'randino';

NAME_LANGUAGES; // ['en', 'ko', 'ja', 'zh', 'it', 'de', 'ru', 'es', 'vi']
WORD_LANGUAGES; // ['en', 'ko', 'ja', 'zh']
```

:::

::: lang dart

코드는 두 enum의 멤버이며, 목록은 `nameLanguages`와 `wordLanguages`로도 확인할 수 있습니다.

```dart
import 'package:randino/randino.dart';

NameLanguage.ko.name; // 'ko'
nameLanguages; // 표시 순서대로 나열된 모든 NameLanguage
wordLanguages; // [WordLanguage.en, .ko, .ja, .zh]
```

:::

::: lang py

코드는 `Literal` 타입이므로 존재하지 않는 코드는 타입 검사기가 거부하며, 목록은 런타임에도 `NAME_LANGUAGES`와 `WORD_LANGUAGES`로 확인할 수 있습니다.

```python
from randino import NAME_LANGUAGES, WORD_LANGUAGES

NAME_LANGUAGES  # ('en', 'ko', 'ja', 'zh', 'it', 'de', 'ru', 'es', 'vi')
WORD_LANGUAGES  # ('en', 'ko', 'ja', 'zh')
```

:::

## 사람 이름

각 언어는 세 가지를 결정합니다. 이름의 어느 부분이 앞에 오는지, 중간 이름이 있는지, 그리고 고유 문자 표기를 영어 발음으로 어떻게 옮기는지입니다.

| 코드 | 이름 순서 | 중간 이름   | 예시                            |
| ---- | --------- | ----------- | ------------------------------- |
| `en` | 이름 먼저 | 있음        | Paisley Lewis                   |
| `ko` | 성 먼저   | 없음        | 김태윤 → Kim Taeyun             |
| `ja` | 성 먼저   | 없음        | 山口直人 → Yamaguchi Naoto      |
| `zh` | 성 먼저   | 없음        | 赵勇轩 → Zhao Yongxuan          |
| `it` | 이름 먼저 | 있음        | Giorgia Mancini                 |
| `de` | 이름 먼저 | 있음        | Johanna Wolf                    |
| `ru` | 이름 먼저 | 있음 (부칭) | Иван Семёнов → Ivan Semyonov    |
| `es` | 이름 먼저 | 있음        | Gonzalo Martín → Gonzalo Martin |
| `vi` | 성 먼저   | 있음        | Đặng Quân → Dang Quan           |

한국어, 일본어, 중국어에는 중간 이름이 없으므로, 중간 이름 옵션은 없는 이름을 만들어내는 대신 그냥 무시됩니다. 이를 직접 확인하는 헬퍼가 있습니다: [`nameSupportsMiddleName`](../name/name-supports-middle-name).

### 로마자 표기 {#romanization}

로마자 표기는 번역이 아니라 **고유 표기의 영어 발음**이며, 문자 체계마다 방식이 다릅니다.

- **라틴 문자**는 발음 구별 부호를 떼어냅니다. `Pérez` → `Perez`, `Müller` → `Muller`, `Đỗ` → `Do`.
- **키릴 문자**는 글자 단위로 음역합니다. `Семёнов` → `Semyonov`.
- **한글**은 국어의 로마자 표기법을 따르며 음절 사이의 음운 변동까지 반영합니다. `석민`은 `Seokmin`이 아니라 `Seongmin`입니다. 성씨는 관용 표기를 사용해서 `김`은 `Gim`이 아니라 `Kim`이 됩니다.
- **일본어와 중국어**는 글자마다 읽는 법을 데이터에 함께 담고 있어서 `佐藤`는 `Sato`, `王`은 `Wang`이 됩니다.

영어는 로마자 표기를 해도 아무것도 바뀌지 않는 유일한 언어입니다. 이미 라틴 알파벳으로 쓰여 있기 때문입니다.

## 단어와 닉네임 {#words-and-nicknames}

단어 풀은 — 그리고 그 위에 있는 `randWord`, 25개 테마 함수, `randNickname`은 — 9개가 아니라 5개 언어만 지원하며, 이유는 작업량이 아니라 문법입니다. 수식어는 사전에 실린 그대로 명사 옆에 놓여야 하는데, 이 방식은 둘 사이에 문법적 일치를 요구하지 않는 언어에서만 자연스럽게 읽힙니다.

| 코드 | 언어     | 형태                   | 예시                 |
| ---- | -------- | ---------------------- | -------------------- |
| `ko` | 한국어   | 수식어, 뒤따르는 단어  | 멋진사자, 고양이꼬리 |
| `en` | 영어     | 수식어, 뒤따르는 단어  | MistyOwl, CatTail    |
| `ja` | 일본어   | 수식어 (연체형)        | 青いライオン, 星の影 |
| `zh` | 중국어   | 수식어, 동사 앞에는 的 | 快乐熊猫, 奔跑的狮子 |
| `vi` | 베트남어 | 수식어가 명사 **뒤에** | mèo xanh, đuôi mèo   |

어순은 더 이상 언어를 막는 이유가 아닙니다. 형태가 언어에 붙어 있으므로 베트남어는 자기 형태를 씁니다. 수식어는 명사 뒤에, 소유의 대상은 주인 앞에 옵니다.

아직 빠진 네 언어는 한 가지 이유로 빠져 있습니다. **이탈리아어, 스페인어, 러시아어, 독일어는 수식어가 명사에 따라 굴절합니다.** `gatto azzurro`와 `luna azzurra`, `blauer Wal`과 `blaue Katze`가 그렇습니다. 이를 지원하려면 모든 명사에 성을 표시하고 모든 수식어를 성별로 하나씩 저장해야 합니다. 일치가 반만 맞는 출력은 아예 없는 것보다 나쁘므로, 그 작업이 끝날 때까지는 기다립니다.

일본어와 중국어에서 명사와 명사를 이어 붙이려면 の와 的이 필요합니다. 조사 없이 붙이면 기준 단어가 추상적일 때 알아볼 수 없는 말이 되기 때문입니다.
