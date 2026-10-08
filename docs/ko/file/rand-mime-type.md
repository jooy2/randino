# randMimeType

MIME 타입을 `count`개만큼 돌려줍니다. `application/pdf`, `image/png`, `video/mp4`처럼 실제로 파일을 전송할 때 쓰는 타입만 나옵니다. [`randFileExtension`](./rand-file-extension)의 확장자들이 가진 타입을 하나씩 모은 것이며, 각 타입은 그 타입을 쓰는 확장자 중 가장 흔한 것만큼 자주 나옵니다. [`type`](#types)으로 슬래시 앞부분인 최상위 타입을 고를 수 있습니다.

MIME 타입은 어느 언어에서나 같게 쓰므로 `randMimeType`은 `language`를 받지 않습니다.

::: lang js

```javascript
import { randMimeType } from 'randino';

randMimeType();
// ['application/pdf']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randMimeType();
// [application/pdf]
```

:::

::: lang py

```python
from randino import rand_mime_type

rand_mime_type()
# ['application/pdf']
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `type` | <Lang js="MimeTopLevelOption" dart="Set&lt;MimeTopLevel&gt;?" py="MimeTopLevelOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 최상위 타입. 하나, 여러 개, 또는 전부를 줄 수 있습니다. [최상위 타입](#types)을 보세요. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 타입 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 타입이 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 타입마다 `MimeTypeDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

## 최상위 타입 {#types}

슬래시 앞부분은 일곱 가지 중 하나이고, 각각 그렇게 전송되는 확장자들의 타입을 담습니다.

| 최상위 타입   | 타입 수 | 비중 | 예                                                       |
| ------------- | ------: | ---: | -------------------------------------------------------- |
| `application` |      52 |  48% | `application/pdf`, `application/zip`, `application/json` |
| `audio`       |       9 |   9% | `audio/mpeg`, `audio/wav`                                |
| `font`        |       4 |   4% | `font/woff2`, `font/ttf`                                 |
| `image`       |      12 |  15% | `image/png`, `image/jpeg`, `image/svg+xml`               |
| `model`       |       4 |   2% | `model/gltf-binary`, `model/stl`                         |
| `text`        |      12 |  15% | `text/plain`, `text/html`, `text/csv`                    |
| `video`       |      10 |   9% | `video/mp4`, `video/webm`                                |

::: lang js

```javascript
randMimeType({ type: 'image', count: 3 }); // ['image/png', 'image/jpeg', 'image/webp']
randMimeType({ type: ['audio', 'video'], count: 2 }); // ['audio/mpeg', 'video/mp4']
```

:::

::: lang dart

```dart
randMimeType(type: {MimeTopLevel.image}, count: 3); // [image/png, image/jpeg, image/webp]
randMimeType(type: {MimeTopLevel.audio, MimeTopLevel.video}, count: 2); // [audio/mpeg, video/mp4]
```

null이나 빈 집합을 주면 모든 최상위 타입에서 뽑습니다.

:::

::: lang py

```python
rand_mime_type(type="image", count=3)  # ['image/png', 'image/jpeg', 'image/webp']
rand_mime_type(type=("audio", "video"), count=2)  # ['audio/mpeg', 'video/mp4']
```

:::

## 타입의 출처 {#source}

확장자마다 [mime-db](https://github.com/jshttp/mime-db) 1.54.0이 주는 타입을 붙였습니다. mime-db는 웹 서버와 그 라이브러리가 파일을 전송할 때 쓰는 목록으로, IANA, Apache, nginx의 자료를 모은 것입니다. 한 확장자에 타입이 여럿이면 IANA에 등록된 타입을 쓰고, `application/octet-stream`보다는 구체적인 타입을 고릅니다. mime-db에 확장자가 연결되지 않은 다섯 개는 그 형식으로 IANA에 등록된 타입을 씁니다. `.zst`, `.sqlite`, `.parquet`, `.tgz`, `.azw3`입니다.

정해진 타입이 없는 확장자는 텍스트 파일이면 `text/plain`, 바이너리 파일이면 `application/octet-stream`입니다. 소스 코드 대부분이 앞쪽입니다. `.ts`, `.go`, `.rs`, `.py` 등은 등록된 타입이 없고, mime-db가 `.ts`에 주는 `video/mp2t`는 다른 형식의 타입입니다. `text/plain`을 쓰는 확장자가 열 개가 넘으므로, 타입의 빈도는 그 확장자들을 모두 더한 값이 아니라 가장 흔한 확장자 하나의 값을 따릅니다. 그래서 `text/plain`은 `.txt`만큼만 나옵니다.

## 상세 출력 {#the-detail-output}

상세 출력에는 슬래시에서 나눈 타입의 두 부분과, 그 타입으로 저장되는 확장자가 들어 있습니다.

::: lang js

```javascript
randMimeType({ output: 'detail' });
// [{ mimeType: 'image/jpeg', type: 'image', subtype: 'jpeg', extensions: ['jpg', 'jpeg'] }]
```

:::

::: lang dart

```dart
randMimeTypeDetails().first; // MimeTypeDetail(image/jpeg)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randMimeType`과 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_mime_type(output="detail")
# [MimeTypeDetail(mime_type='image/jpeg', type='image', subtype='jpeg', extensions=('jpg', 'jpeg'))]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| <Lang js="mimeType" dart="mimeType" py="mime_type" code /> | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `type` | `MimeTopLevel` | 슬래시 앞부분: `image`. |
| `subtype` | <Lang js="string" dart="String" py="str" code /> | 슬래시 뒷부분: `jpeg`. |
| `extensions` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, …]" code /> | 그 타입으로 저장되는 확장자. 점은 뺍니다. |

## 함께 보기 {#see-also}

- [`randFileExtension`](./rand-file-extension) — 이 타입들의 출처인 확장자. 상세 출력에 각 확장자의 타입이 들어 있습니다.
