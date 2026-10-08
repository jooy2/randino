"""The MIME type generator: a type files are really served as, by its commonest extension."""

from collections.abc import Callable

from randino._internal.generate import collect, resolve_many
from randino._internal.utils import pick_weighted, with_random
from randino._types import MimeTypeDetail
from randino.file.data import MIME_TOP_LEVELS, MIME_TYPE_ENTRIES


def generate_mime_type_details(
    *,
    type: object = "all",
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[MimeTypeDetail]:
    """Generate `count` MIME types, applied to every option."""
    types = resolve_many(type, MIME_TOP_LEVELS, MIME_TOP_LEVELS)
    # Worked out once per call rather than per draw.
    candidates = [entry for entry in MIME_TYPE_ENTRIES if entry.type in types]

    def draw() -> MimeTypeDetail:
        entry = pick_weighted(candidates, lambda each: each.weight)

        return MimeTypeDetail(
            mime_type=entry.mime_type,
            type=entry.type,
            subtype=entry.subtype,
            extensions=entry.extensions,
        )

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.mime_type,
        )
