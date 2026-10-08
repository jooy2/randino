"""MIME types files are really served as: `application/pdf`, `image/png`, `video/mp4`."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import MimeTopLevelOption, MimeTypeDetail
from randino.file._mime_generator import generate_mime_type_details


@overload
def rand_mime_type(
    *,
    type: MimeTopLevelOption = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_mime_type(
    *,
    type: MimeTopLevelOption = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[MimeTypeDetail]: ...


def rand_mime_type(
    *,
    type: MimeTopLevelOption = "all",
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[MimeTypeDetail]:
    """Generate MIME types files are really served as: `application/pdf`, `image/png`.

    They are the types `rand_file_extension`'s extensions carry, once each, and a type is
    as common as its most common extension.

    Args:
        type: Which top-level types, the part in front of the slash: one, a sequence of
            them, or `"all"`.
        count: How many types to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same type twice. Returns fewer than `count` once they
            run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for a `MimeTypeDetail` per result — the
            two parts of the type and the extensions it is saved with.

    Returns:
        A `list[str]`, or a `list[MimeTypeDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_mime_type()
        ['application/pdf']
        >>> rand_mime_type(type="image", count=3)
        ['image/png', 'image/jpeg', 'image/webp']
    """
    details = generate_mime_type_details(type=type, count=count, unique=unique, random=random)

    if output == "detail":
        return details

    mime_types: list[str] = [detail.mime_type for detail in details]

    return mime_types
