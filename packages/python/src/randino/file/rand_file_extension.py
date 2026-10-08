"""File extensions files are really saved with: `.pdf`, `.png`, `.mp4`."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import FileCategoryOption, FileExtensionDetail
from randino.file._generator import generate_file_extension_details


@overload
def rand_file_extension(
    *,
    category: FileCategoryOption = ...,
    include_dot: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_file_extension(
    *,
    category: FileCategoryOption = ...,
    include_dot: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[FileExtensionDetail]: ...


def rand_file_extension(
    *,
    category: FileCategoryOption = "all",
    include_dot: bool = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[FileExtensionDetail]:
    """Generate file extensions files are really saved with: `.pdf`, `.png`, `.mp4`.

    The extensions nearly everybody meets come up most often, and the ones only a few
    programs write rarely.

    Args:
        category: Which kinds of file: one category, a sequence of them, or `"all"`.
        include_dot: Write the dot in front: `.png` rather than `png`.
        count: How many extensions to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same extension twice. Returns fewer than `count` once
            they run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for a `FileExtensionDetail` per result —
            the extension without its dot and its category.

    Returns:
        A `list[str]`, or a `list[FileExtensionDetail]` when `output="detail"` — the
        overloads carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_file_extension()
        ['.pdf']
        >>> rand_file_extension(category="image", count=3)
        ['.png', '.jpg', '.webp']
        >>> rand_file_extension(category=("code", "data"), include_dot=False, count=2)
        ['js', 'json']
    """
    details = generate_file_extension_details(
        category=category, include_dot=include_dot, count=count, unique=unique, random=random
    )

    if output == "detail":
        return details

    extensions: list[str] = [detail.extension for detail in details]

    return extensions
