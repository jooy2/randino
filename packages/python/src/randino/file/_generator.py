"""The file extension generator: an extension files are really saved with, common ones most."""

from collections.abc import Callable

from randino._internal.generate import collect_from, kept_outcomes, resolve_many
from randino._internal.utils import with_random
from randino._types import FileExtensionDetail
from randino.file.data import FILE_CATEGORIES, FILE_EXTENSIONS, FileExtensionEntry

_KEPT: dict[str, list[tuple[FileExtensionEntry, float]]] = {}
"""The extensions each set of categories leaves, kept so a call does not work them out again."""


def generate_file_extension_details(
    *,
    category: object = "all",
    include_dot: object = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[FileExtensionDetail]:
    """Generate `count` file extensions, applied to every option."""
    categories = resolve_many(category, FILE_CATEGORIES, FILE_CATEGORIES)
    # `is False` rather than truthiness, the way the npm package reads it.
    dot = "" if include_dot is False else "."
    outcomes = kept_outcomes(
        _KEPT,
        ",".join(categories),
        lambda: [
            (entry, entry.weight) for entry in FILE_EXTENSIONS if entry.category in categories
        ],
    )

    with with_random(random):
        return collect_from(
            count=count,
            unique=unique,
            starts_with="",
            outcomes=outcomes,
            key_of=lambda entry: dot + entry.name,
            build=lambda entry: FileExtensionDetail(
                extension=dot + entry.name,
                name=entry.name,
                category=entry.category,
                mime_type=entry.mime_type,
            ),
        )
