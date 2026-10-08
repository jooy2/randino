# randMimeType

Generates MIME types and returns `count` of them, each one a type files are really served as: `application/pdf`, `image/png`, `video/mp4`. They are the types [`randFileExtension`](./rand-file-extension)'s extensions carry, once each, and a type is as common as its most common extension. [`type`](#types) keeps to the top-level types named, the part in front of the slash.

A MIME type is written the same in every language, so `randMimeType` takes no `language`.

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

## Options

Every option is optional, and the defaults are what the empty call above uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | <Lang js="MimeTopLevelOption" dart="Set&lt;MimeTopLevel&gt;?" py="MimeTopLevelOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Which top-level types: one, several, or every one of them. See [top-level types](#types). |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many types to return. Clamped to `0` … `10000`. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same type twice. Returns fewer than `count` once they run out. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or a `MimeTypeDetail` per type. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## Top-level types {#types}

The part in front of the slash is one of seven, and each holds the types of the extensions that are served as it:

| Top-level type | Types | Share | Examples                                                 |
| -------------- | ----: | ----: | -------------------------------------------------------- |
| `application`  |    52 |   48% | `application/pdf`, `application/zip`, `application/json` |
| `audio`        |     9 |    9% | `audio/mpeg`, `audio/wav`                                |
| `font`         |     4 |    4% | `font/woff2`, `font/ttf`                                 |
| `image`        |    12 |   15% | `image/png`, `image/jpeg`, `image/svg+xml`               |
| `model`        |     4 |    2% | `model/gltf-binary`, `model/stl`                         |
| `text`         |    12 |   15% | `text/plain`, `text/html`, `text/csv`                    |
| `video`        |    10 |    9% | `video/mp4`, `video/webm`                                |

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

A null or empty set draws every top-level type.

:::

::: lang py

```python
rand_mime_type(type="image", count=3)  # ['image/png', 'image/jpeg', 'image/webp']
rand_mime_type(type=("audio", "video"), count=2)  # ['audio/mpeg', 'video/mp4']
```

:::

## Where the types come from {#source}

Each extension carries the type [mime-db](https://github.com/jshttp/mime-db) 1.54.0 gives it. mime-db is the list web servers and their libraries serve files by, gathered from IANA, Apache and nginx. Where it gives an extension several types, the one IANA registered is used, and a specific type is preferred over `application/octet-stream`. Five extensions mime-db does not map take the type IANA registered for their format: `.zst`, `.sqlite`, `.parquet`, `.tgz` and `.azw3`.

An extension with no settled type is `text/plain` when the file is text and `application/octet-stream` when it is binary. Most of the source code is in the first group: `.ts`, `.go`, `.rs`, `.py` and others have no registered type, and mime-db's `video/mp2t` for `.ts` belongs to another format. Because a dozen extensions share `text/plain`, a type is as common as its most common extension rather than all of them together, so `text/plain` comes up no more often than `.txt` makes it.

## The detail output {#the-detail-output}

The detail splits the type at its slash and lists the extensions a file of it is saved with.

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

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randMimeType`.

:::

::: lang py

```python
rand_mime_type(output="detail")
# [MimeTypeDetail(mime_type='image/jpeg', type='image', subtype='jpeg', extensions=('jpg', 'jpeg'))]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| <Lang js="mimeType" dart="mimeType" py="mime_type" code /> | <Lang js="string" dart="String" py="str" code /> | The type, as the value form returns it. |
| `type` | `MimeTopLevel` | The part in front of the slash: `image`. |
| `subtype` | <Lang js="string" dart="String" py="str" code /> | The part behind it: `jpeg`. |
| `extensions` | <Lang js="string[]" dart="List&lt;String&gt;" py="tuple[str, …]" code /> | The extensions a file of it is saved with, without their dots. |

## See also

- [`randFileExtension`](./rand-file-extension) — the extensions these types come from, each with its type in the detail.
