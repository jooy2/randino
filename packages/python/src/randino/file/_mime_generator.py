"""The MIME type generator: a type files are really served as, by its commonest extension."""

from collections.abc import Callable

from randino._internal.generate import collect_from, kept_outcomes, resolve_many
from randino._internal.utils import with_random
from randino._types import MimeTypeDetail
from randino.file.data import MIME_TOP_LEVELS, MIME_TYPE_ENTRIES, MimeTypeEntry

_KEPT: dict[str, list[tuple[MimeTypeEntry, float]]] = {}
"""The types each set of top levels leaves, kept so a call does not work them out again."""


def generate_mime_type_details(
    *,
    type: object = "all",
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[MimeTypeDetail]:
    """Generate `count` MIME types, applied to every option."""
    types = resolve_many(type, MIME_TOP_LEVELS, MIME_TOP_LEVELS)
    outcomes = kept_outcomes(
        _KEPT,
        ",".join(types),
        lambda: [(entry, entry.weight) for entry in MIME_TYPE_ENTRIES if entry.type in types],
    )

    with with_random(random):
        return collect_from(
            count=count,
            unique=unique,
            starts_with="",
            outcomes=outcomes,
            key_of=lambda entry: entry.mime_type,
            build=lambda entry: MimeTypeDetail(
                mime_type=entry.mime_type,
                type=entry.type,
                subtype=entry.subtype,
                extensions=entry.extensions,
            ),
        )
