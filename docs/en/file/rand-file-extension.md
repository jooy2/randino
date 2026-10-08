# randFileExtension

Generates file extensions and returns `count` of them, each one an extension files are really saved with: `.pdf`, `.png`, `.mp4`, `.zip`, `.js`. The extensions nearly everybody meets come up most often, and the ones only a few programs write rarely. [`category`](#catalog) keeps to one kind of file or several, and <Lang js="includeDot" dart="includeDot" py="include_dot" code /> leaves the dot out.

An extension is written the same in every language, so `randFileExtension` takes no `language`.

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

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `category` | <Lang js="FileCategoryOption" dart="Set&lt;FileCategory&gt;?" py="FileCategoryOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Which kinds of file: one category, several, or every one of them. See [the catalog](#catalog). |
| <Lang js="includeDot" dart="includeDot" py="include_dot" code /> | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="true" dart="true" py="True" code /> | Write the dot in front: `.png` rather than `png`. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many extensions to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same extension twice. Returns fewer than `count` once they run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `FileExtensionDetail` per extension. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

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

A null or empty set draws every kind of file.

:::

::: lang py

```python
rand_file_extension(count=3)  # ['.pdf', '.png', '.mp4']
rand_file_extension(category="image", count=3)  # ['.png', '.jpg', '.webp']
rand_file_extension(category=("code", "data"), include_dot=False, count=3)  # ['js', 'json', 'py']
```

:::

## What it draws from {#catalog}

136 extensions in fourteen categories, every one written in lower case and every one in a single category. An extension that could mean two things is the one a developer means by it: `.ts` is TypeScript rather than an MPEG stream, and `.sql` is data. Two spellings of one format are both in where both are in use, such as `.jpg` and `.jpeg`.

Each extension has a weight from `5` for the ones nearly everybody meets to `1` for the ones only a few programs write, and the draw is over the extensions themselves rather than one category at a time. `.pdf`, one of the commonest, is about one draw in fifty.

| Category | What it holds | Weight 5–3 | Weight 2 | Weight 1 |
| --- | --- | --- | --- | --- |
| `document` | Documents | `.pdf`, `.docx`, `.txt` | `.doc`, `.rtf`, `.odt`, `.md` | `.tex`, `.pages`, `.wpd` |
| `spreadsheet` | Spreadsheets | `.xlsx`, `.csv` | `.xls`, `.ods` | `.numbers`, `.tsv` |
| `presentation` | Presentations | `.pptx` | — | `.ppt`, `.odp`, `.key` |
| `image` | Images | `.jpg`, `.png`, `.gif`, `.svg`, `.webp`, `.jpeg` | `.heic`, `.bmp`, `.tiff`, `.ico` | `.psd`, `.avif`, `.tif`, `.ai`, `.eps`, `.dng` |
| `audio` | Audio | `.mp3` | `.wav`, `.m4a`, `.aac`, `.flac`, `.ogg` | `.wma`, `.aiff`, `.opus`, `.mid` |
| `video` | Video | `.mp4` | `.mov`, `.avi`, `.mkv`, `.webm` | `.wmv`, `.flv`, `.m4v`, `.3gp`, `.mpeg` |
| `archive` | Archives | `.zip` | `.rar`, `.7z`, `.gz`, `.tar` | `.bz2`, `.xz`, `.tgz`, `.zst` |
| `code` | Source code | `.js`, `.html`, `.css`, `.py` | `.ts`, `.java`, `.c`, `.cpp`, `.php`, `.go`, `.rs`, `.rb`, `.swift`, `.kt`, `.sh`, `.cs` | `.h`, `.hpp`, `.scala`, `.lua`, `.pl`, `.r`, `.dart`, `.vue`, `.jsx`, `.tsx`, `.bat`, `.ps1` |
| `data` | Data and configuration | `.json`, `.xml` | `.yaml`, `.yml`, `.sql`, `.db`, `.sqlite`, `.log` | `.toml`, `.ini`, `.cfg`, `.plist`, `.parquet` |
| `executable` | Programs and installers | `.exe`, `.apk` | `.msi`, `.dmg`, `.ipa`, `.deb`, `.rpm` | `.jar`, `.bin`, `.appimage`, `.msix` |
| `font` | Fonts | — | `.ttf`, `.otf`, `.woff2` | `.woff`, `.eot` |
| `ebook` | E-books | — | `.epub` | `.mobi`, `.azw3` |
| `disk` | Disk images | — | `.iso` | `.img`, `.vhd`, `.vmdk`, `.qcow2` |
| `model` | 3D models | — | — | `.stl`, `.obj`, `.fbx`, `.glb`, `.gltf`, `.blend` |

The weights are written by hand in the order the extensions are common in, not measured from any one survey.

## The detail output {#the-detail-output}

The detail carries the extension without its dot, the kind of file it is and the MIME type it is served as.

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

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randFileExtension`.

:::

::: lang py

```python
rand_file_extension(output="detail")
# [FileExtensionDetail(extension='.png', name='png', category='image', mime_type='image/png')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `extension` | <Lang js="string" dart="String" py="str" code /> | The extension, as the value form returns it. |
| `name` | <Lang js="string" dart="String" py="str" code /> | The extension without its dot: `png`. |
| `category` | `FileCategory` | The kind of file it is: `image`. |
| <Lang js="mimeType" dart="mimeType" py="mime_type" code /> | <Lang js="string" dart="String" py="str" code /> | The MIME type a file with it is served as: `image/png`. See [`randMimeType`](./rand-mime-type#source) for where the types come from. |

## See also

- [`randWord`](../word/rand-word) — a word to name the file with.
- [`randMimeType`](./rand-mime-type) — the MIME types these extensions are served as.
- [`randAppStore`](../appstore/rand-app-store) — a store to get a program from.
