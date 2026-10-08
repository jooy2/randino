"""Every file extension the catalog holds, and how often each one comes up."""

from dataclasses import dataclass

from randino._internal.table import rows
from randino._types import FileCategory

FILE_CATEGORIES: tuple[FileCategory, ...] = (
    "document",
    "spreadsheet",
    "presentation",
    "image",
    "audio",
    "video",
    "archive",
    "code",
    "data",
    "executable",
    "font",
    "ebook",
    "disk",
    "model",
)
"""Every category, in the order the npm package lists them."""


@dataclass(frozen=True, slots=True)
class FileExtensionEntry:
    """One extension the catalog holds."""

    name: str
    """The extension without its dot, in lower case: `png`."""

    category: FileCategory
    """What kind of file it is."""

    weight: float
    """How often it comes up beside the rest: `5` for the commonest, `1` for the rarest."""


FILE_EXTENSIONS: tuple[FileExtensionEntry, ...] = tuple(
    FileExtensionEntry(name=name, category=row[0], weight=float(row[1]))  # type: ignore[arg-type]
    for row in rows("""
document | 5 | pdf docx txt
document | 2 | doc rtf odt md
document | 1 | tex pages wpd
spreadsheet | 4 | xlsx csv
spreadsheet | 2 | xls ods
spreadsheet | 1 | numbers tsv
presentation | 3 | pptx
presentation | 1 | ppt odp key
image | 5 | jpg png
image | 3 | gif svg webp jpeg
image | 2 | heic bmp tiff ico
image | 1 | psd avif tif ai eps raw
audio | 4 | mp3
audio | 2 | wav m4a aac flac ogg
audio | 1 | wma aiff opus mid
video | 4 | mp4
video | 2 | mov avi mkv webm
video | 1 | wmv flv m4v 3gp mpeg
archive | 4 | zip
archive | 2 | rar 7z gz tar
archive | 1 | bz2 xz tgz zst
code | 3 | js html css py
code | 2 | ts java c cpp php go rs rb swift kt sh cs
code | 1 | h hpp scala lua pl r dart vue jsx tsx bat ps1
data | 3 | json xml
data | 2 | yaml yml sql db sqlite log
data | 1 | toml ini cfg plist parquet
executable | 3 | exe apk
executable | 2 | msi dmg ipa deb rpm
executable | 1 | jar bin appimage msix
font | 2 | ttf otf woff2
font | 1 | woff eot
ebook | 2 | epub
ebook | 1 | mobi azw3
disk | 2 | iso
disk | 1 | img vhd vmdk qcow2
model | 1 | stl obj fbx glb gltf blend
""")
    for name in row[2].split()
)
"""Every extension the catalog holds, one row per category and weight.

Each is an extension files are really saved with, in lower case, and each is in one
category only: `.ts` is TypeScript here and not a video stream, and `.sql` is data. The
weights are written by hand, from `5` for the extensions nearly everybody meets to `1` for
the ones only a few programs write.
"""
