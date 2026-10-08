# randFileExtension

파일 확장자를 `count`개만큼 돌려줍니다. `.pdf`, `.png`, `.mp4`, `.zip`, `.js`처럼 실제로 파일을 저장할 때 쓰는 확장자만 나옵니다. 누구나 아는 확장자일수록 자주 나오고, 몇몇 프로그램만 쓰는 확장자는 드물게 나옵니다. [`category`](#catalog)로 한 종류나 여러 종류의 파일만 고를 수 있고, <Lang js="includeDot" dart="includeDot" py="include_dot" code />로 앞의 점을 뺄 수 있습니다.

확장자는 어느 언어에서나 같게 쓰므로 `randFileExtension`은 `language`를 받지 않습니다.

::: lang js

```javascript
import { randFileExtension } from 'randino';

randFileExtension();
// ['.pdf']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randFileExtension();
// [.pdf]
```

:::

::: lang py

```python
from randino import rand_file_extension

rand_file_extension()
# ['.pdf']
```

:::

## 옵션 {#options}

모든 옵션은 생략할 수 있고, 기본값은 위의 빈 호출이 쓰는 값입니다.

| 옵션 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `category` | <Lang js="FileCategoryOption" dart="Set&lt;FileCategory&gt;?" py="FileCategoryOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | 파일의 종류. 분류 하나, 여러 분류, 또는 전부를 줄 수 있습니다. [뽑는 범위](#catalog)를 보세요. |
| <Lang js="includeDot" dart="includeDot" py="include_dot" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | 앞에 점을 씁니다. `png` 대신 `.png`로 씁니다. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | 돌려줄 확장자 개수. `0` … `10000`으로 제한됩니다. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | 같은 결과를 두 번 돌려주지 않습니다. 확장자가 바닥나면 `count`보다 적게 돌아옵니다. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | 문자열, 또는 확장자마다 `FileExtensionDetail` 하나. Dart에는 이 매개변수가 없습니다. [상세 출력](#the-detail-output)을 보세요. |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | 무작위성을 어디서 가져올지. [난수원 고르기](../guide/getting-started#choosing-the-source)를 보세요. 기본값은 각 언어의 일반 난수 생성기입니다. |

::: lang js

```javascript
randFileExtension({ count: 3 }); // ['.pdf', '.png', '.mp4']
randFileExtension({ category: 'image', count: 3 }); // ['.png', '.jpg', '.webp']
randFileExtension({ category: ['code', 'data'], includeDot: false, count: 3 }); // ['js', 'json', 'py']
```

:::

::: lang dart

```dart
randFileExtension(count: 3); // [.pdf, .png, .mp4]
randFileExtension(category: {FileCategory.image}, count: 3); // [.png, .jpg, .webp]
randFileExtension(category: {FileCategory.code, FileCategory.data}, includeDot: false, count: 3); // [js, json, py]
```

null이나 빈 집합을 주면 모든 종류에서 뽑습니다.

:::

::: lang py

```python
rand_file_extension(count=3)  # ['.pdf', '.png', '.mp4']
rand_file_extension(category="image", count=3)  # ['.png', '.jpg', '.webp']
rand_file_extension(category=("code", "data"), include_dot=False, count=3)  # ['js', 'json', 'py']
```

:::

## 뽑는 범위 {#catalog}

14개 분류에 확장자 136개가 들어 있습니다. 모두 소문자로 쓰고, 확장자 하나는 한 분류에만 들어갑니다. 두 가지로 읽히는 확장자는 개발자가 흔히 뜻하는 쪽으로 넣었습니다. `.ts`는 MPEG 스트림이 아니라 TypeScript이고, `.sql`은 데이터입니다. 한 형식의 두 표기가 모두 쓰이면 둘 다 넣었습니다(`.jpg`와 `.jpeg`).

확장자마다 가중치가 있습니다. 누구나 아는 확장자가 `5`, 몇몇 프로그램만 쓰는 확장자가 `1`입니다. 분류를 먼저 고르지 않고 확장자 전체에서 바로 뽑으며, 가장 흔한 축에 드는 `.pdf`는 50번에 한 번꼴로 나옵니다.

| 분류 | 담는 것 | 가중치 5–3 | 가중치 2 | 가중치 1 |
| --- | --- | --- | --- | --- |
| `document` | 문서 | `.pdf`, `.docx`, `.txt` | `.doc`, `.rtf`, `.odt`, `.md` | `.tex`, `.pages`, `.wpd` |
| `spreadsheet` | 스프레드시트 | `.xlsx`, `.csv` | `.xls`, `.ods` | `.numbers`, `.tsv` |
| `presentation` | 프레젠테이션 | `.pptx` | — | `.ppt`, `.odp`, `.key` |
| `image` | 이미지 | `.jpg`, `.png`, `.gif`, `.svg`, `.webp`, `.jpeg` | `.heic`, `.bmp`, `.tiff`, `.ico` | `.psd`, `.avif`, `.tif`, `.ai`, `.eps`, `.dng` |
| `audio` | 오디오 | `.mp3` | `.wav`, `.m4a`, `.aac`, `.flac`, `.ogg` | `.wma`, `.aiff`, `.opus`, `.mid` |
| `video` | 동영상 | `.mp4` | `.mov`, `.avi`, `.mkv`, `.webm` | `.wmv`, `.flv`, `.m4v`, `.3gp`, `.mpeg` |
| `archive` | 압축 파일 | `.zip` | `.rar`, `.7z`, `.gz`, `.tar` | `.bz2`, `.xz`, `.tgz`, `.zst` |
| `code` | 소스 코드 | `.js`, `.html`, `.css`, `.py` | `.ts`, `.java`, `.c`, `.cpp`, `.php`, `.go`, `.rs`, `.rb`, `.swift`, `.kt`, `.sh`, `.cs` | `.h`, `.hpp`, `.scala`, `.lua`, `.pl`, `.r`, `.dart`, `.vue`, `.jsx`, `.tsx`, `.bat`, `.ps1` |
| `data` | 데이터와 설정 | `.json`, `.xml` | `.yaml`, `.yml`, `.sql`, `.db`, `.sqlite`, `.log` | `.toml`, `.ini`, `.cfg`, `.plist`, `.parquet` |
| `executable` | 실행 파일과 설치 파일 | `.exe`, `.apk` | `.msi`, `.dmg`, `.ipa`, `.deb`, `.rpm` | `.jar`, `.bin`, `.appimage`, `.msix` |
| `font` | 글꼴 | — | `.ttf`, `.otf`, `.woff2` | `.woff`, `.eot` |
| `ebook` | 전자책 | — | `.epub` | `.mobi`, `.azw3` |
| `disk` | 디스크 이미지 | — | `.iso` | `.img`, `.vhd`, `.vmdk`, `.qcow2` |
| `model` | 3D 모델 | — | — | `.stl`, `.obj`, `.fbx`, `.glb`, `.gltf`, `.blend` |

가중치는 확장자가 흔한 순서대로 직접 정한 값이며, 특정 조사를 측정한 수치가 아닙니다.

## 상세 출력 {#the-detail-output}

상세 출력에는 점을 뺀 확장자, 파일의 종류, 전송될 때의 MIME 타입이 들어 있습니다.

::: lang js

```javascript
randFileExtension({ output: 'detail' });
// [{ extension: '.png', name: 'png', category: 'image', mimeType: 'image/png' }]
```

:::

::: lang dart

```dart
randFileExtensionDetails().first; // FileExtensionDetail(.png, image)
```

Dart에는 오버로드도 유니언 타입도 없어서, 상세 출력은 별도 함수입니다. `randFileExtension`과 같은 매개변수를 받습니다.

:::

::: lang py

```python
rand_file_extension(output="detail")
# [FileExtensionDetail(extension='.png', name='png', category='image', mime_type='image/png')]
```

:::

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `extension` | <Lang js="string" dart="String" py="str" code /> | 값 출력이 돌려주는 문자열. |
| `name` | <Lang js="string" dart="String" py="str" code /> | 점을 뺀 확장자: `png`. |
| `category` | `FileCategory` | 파일의 종류: `image`. |
| <Lang js="mimeType" dart="mimeType" py="mime_type" code /> | <Lang js="string" dart="String" py="str" code /> | 그 확장자의 파일이 전송될 때의 MIME 타입: `image/png`. 타입을 어디서 가져왔는지는 [`randMimeType`](./rand-mime-type#source)을 보세요. |

## 함께 보기 {#see-also}

- [`randWord`](../word/rand-word) — 파일 이름으로 쓸 단어.
- [`randMimeType`](./rand-mime-type) — 이 확장자들의 MIME 타입.
- [`randAppStore`](../appstore/rand-app-store) — 프로그램을 받을 스토어.
