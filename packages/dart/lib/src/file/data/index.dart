import 'dart:math';

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/types.dart';

/// Every category, in the order the npm package lists them.
const List<FileCategory> fileCategories = FileCategory.values;

/// Every top-level type, in the order the npm package lists them.
const List<MimeTopLevel> mimeTopLevels = MimeTopLevel.values;

/// One extension the catalog holds, and how often it comes up. Internal.
class FileExtensionEntry {
  /// Creates an entry.
  const FileExtensionEntry({
    required this.name,
    required this.category,
    required this.weight,
    required this.mimeType,
  });

  /// The extension without its dot, in lower case: `png`.
  final String name;

  /// What kind of file it is.
  final FileCategory category;

  /// How often it comes up beside the rest: `5` for the commonest, `1` for the
  /// rarest.
  final num weight;

  /// The MIME type a file with it is served as: `image/png`.
  final String mimeType;
}

/// Every extension the catalog holds, one per row: `category | weight |
/// extension | MIME type`. Internal.
///
/// The MIME types are the ones mime-db 1.54.0 gives the extension, the
/// registered type where there are several; an extension with no settled type
/// is `text/plain` when the file is text and `application/octet-stream` when it
/// is binary. See the npm package's copy for the whole of the rule.
final List<FileExtensionEntry> fileExtensions = List<FileExtensionEntry>.unmodifiable(
  rows(r'''
  document | 5 | pdf | application/pdf
  document | 5 | docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document
  document | 5 | txt | text/plain
  document | 2 | doc | application/msword
  document | 2 | rtf | application/rtf
  document | 2 | odt | application/vnd.oasis.opendocument.text
  document | 2 | md | text/markdown
  document | 1 | tex | application/x-tex
  document | 1 | pages | application/vnd.apple.pages
  document | 1 | wpd | application/vnd.wordperfect
  spreadsheet | 4 | xlsx | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  spreadsheet | 4 | csv | text/csv
  spreadsheet | 2 | xls | application/vnd.ms-excel
  spreadsheet | 2 | ods | application/vnd.oasis.opendocument.spreadsheet
  spreadsheet | 1 | numbers | application/vnd.apple.numbers
  spreadsheet | 1 | tsv | text/tab-separated-values
  presentation | 3 | pptx | application/vnd.openxmlformats-officedocument.presentationml.presentation
  presentation | 1 | ppt | application/vnd.ms-powerpoint
  presentation | 1 | odp | application/vnd.oasis.opendocument.presentation
  presentation | 1 | key | application/vnd.apple.keynote
  image | 5 | jpg | image/jpeg
  image | 5 | png | image/png
  image | 3 | gif | image/gif
  image | 3 | svg | image/svg+xml
  image | 3 | webp | image/webp
  image | 3 | jpeg | image/jpeg
  image | 2 | heic | image/heic
  image | 2 | bmp | image/bmp
  image | 2 | tiff | image/tiff
  image | 2 | ico | image/vnd.microsoft.icon
  image | 1 | psd | image/vnd.adobe.photoshop
  image | 1 | avif | image/avif
  image | 1 | tif | image/tiff
  image | 1 | ai | application/postscript
  image | 1 | eps | application/postscript
  image | 1 | dng | image/x-adobe-dng
  audio | 4 | mp3 | audio/mpeg
  audio | 2 | wav | audio/wav
  audio | 2 | m4a | audio/mp4
  audio | 2 | aac | audio/aac
  audio | 2 | flac | audio/x-flac
  audio | 2 | ogg | audio/ogg
  audio | 1 | wma | audio/x-ms-wma
  audio | 1 | aiff | audio/x-aiff
  audio | 1 | opus | audio/ogg
  audio | 1 | mid | audio/midi
  video | 4 | mp4 | video/mp4
  video | 2 | mov | video/quicktime
  video | 2 | avi | video/x-msvideo
  video | 2 | mkv | video/x-matroska
  video | 2 | webm | video/webm
  video | 1 | wmv | video/x-ms-wmv
  video | 1 | flv | video/x-flv
  video | 1 | m4v | video/x-m4v
  video | 1 | 3gp | video/3gpp
  video | 1 | mpeg | video/mpeg
  archive | 4 | zip | application/zip
  archive | 2 | rar | application/vnd.rar
  archive | 2 | 7z | application/x-7z-compressed
  archive | 2 | gz | application/gzip
  archive | 2 | tar | application/x-tar
  archive | 1 | bz2 | application/x-bzip2
  archive | 1 | xz | application/x-xz
  archive | 1 | tgz | application/gzip
  archive | 1 | zst | application/zstd
  code | 3 | js | text/javascript
  code | 3 | html | text/html
  code | 3 | css | text/css
  code | 3 | py | text/plain
  code | 2 | ts | text/plain
  code | 2 | java | text/x-java-source
  code | 2 | c | text/x-c
  code | 2 | cpp | text/x-c
  code | 2 | php | application/x-httpd-php
  code | 2 | go | text/plain
  code | 2 | rs | text/plain
  code | 2 | rb | text/plain
  code | 2 | swift | text/plain
  code | 2 | kt | text/plain
  code | 2 | sh | application/x-sh
  code | 2 | cs | text/plain
  code | 1 | h | text/x-c
  code | 1 | hpp | text/plain
  code | 1 | scala | text/plain
  code | 1 | lua | text/x-lua
  code | 1 | pl | application/x-perl
  code | 1 | r | text/plain
  code | 1 | dart | application/vnd.dart
  code | 1 | vue | text/plain
  code | 1 | jsx | text/jsx
  code | 1 | tsx | text/plain
  code | 1 | bat | application/x-msdownload
  code | 1 | ps1 | text/plain
  data | 3 | json | application/json
  data | 3 | xml | application/xml
  data | 2 | yaml | text/yaml
  data | 2 | yml | text/yaml
  data | 2 | sql | application/sql
  data | 2 | db | application/octet-stream
  data | 2 | sqlite | application/vnd.sqlite3
  data | 2 | log | text/plain
  data | 1 | toml | application/toml
  data | 1 | ini | text/plain
  data | 1 | cfg | text/plain
  data | 1 | plist | application/octet-stream
  data | 1 | parquet | application/vnd.apache.parquet
  executable | 3 | exe | application/x-msdownload
  executable | 3 | apk | application/vnd.android.package-archive
  executable | 2 | msi | application/x-msdownload
  executable | 2 | dmg | application/x-apple-diskimage
  executable | 2 | ipa | application/octet-stream
  executable | 2 | deb | application/x-debian-package
  executable | 2 | rpm | application/x-redhat-package-manager
  executable | 1 | jar | application/java-archive
  executable | 1 | bin | application/octet-stream
  executable | 1 | appimage | application/octet-stream
  executable | 1 | msix | application/msix
  font | 2 | ttf | font/ttf
  font | 2 | otf | font/otf
  font | 2 | woff2 | font/woff2
  font | 1 | woff | font/woff
  font | 1 | eot | application/vnd.ms-fontobject
  ebook | 2 | epub | application/epub+zip
  ebook | 1 | mobi | application/x-mobipocket-ebook
  ebook | 1 | azw3 | application/vnd.amazon.mobi8-ebook
  disk | 2 | iso | application/x-iso9660-image
  disk | 1 | img | application/octet-stream
  disk | 1 | vhd | application/x-virtualbox-vhd
  disk | 1 | vmdk | application/x-virtualbox-vmdk
  disk | 1 | qcow2 | application/octet-stream
  model | 1 | stl | model/stl
  model | 1 | obj | model/obj
  model | 1 | fbx | application/vnd.autodesk.fbx
  model | 1 | glb | model/gltf-binary
  model | 1 | gltf | model/gltf+json
  model | 1 | blend | application/x-blender
''').map(
    (row) => FileExtensionEntry(
      name: row[2],
      category: FileCategory.values.byName(row[0]),
      weight: num.parse(row[1]),
      mimeType: row[3],
    ),
  ),
);

/// One MIME type, and the extensions a file of it is saved with. Internal.
class MimeTypeEntry {
  /// Creates an entry.
  const MimeTypeEntry({
    required this.mimeType,
    required this.type,
    required this.subtype,
    required this.extensions,
    required this.weight,
  });

  /// The type: `image/jpeg`.
  final String mimeType;

  /// The part in front of the slash.
  final MimeTopLevel type;

  /// The part behind it.
  final String subtype;

  /// The extensions without their dots, in the catalog's order.
  final List<String> extensions;

  /// The weight of its most common extension.
  final num weight;
}

/// Every MIME type the extensions carry, once each. A type is as common as its
/// most common extension rather than all of them together. Internal.
final List<MimeTypeEntry> mimeTypeEntries = () {
  final order = <String>[];
  final names = <String, List<String>>{};
  final weights = <String, num>{};

  for (final entry in fileExtensions) {
    if (!names.containsKey(entry.mimeType)) {
      order.add(entry.mimeType);
      names[entry.mimeType] = <String>[];
      weights[entry.mimeType] = entry.weight;
    }

    names[entry.mimeType]!.add(entry.name);
    weights[entry.mimeType] = max(weights[entry.mimeType]!, entry.weight);
  }

  return List<MimeTypeEntry>.unmodifiable([
    for (final mimeType in order)
      MimeTypeEntry(
        mimeType: mimeType,
        type: MimeTopLevel.values.byName(mimeType.split('/').first),
        subtype: mimeType.split('/').last,
        extensions: List<String>.unmodifiable(names[mimeType]!),
        weight: weights[mimeType]!,
      ),
  ]);
}();
