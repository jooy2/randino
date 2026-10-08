"""Real phones, tablets and laptops, by the names their makers gave them."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import DeviceDetail, DeviceTypeOption
from randino.device._generator import generate_device_details


@overload
def rand_device(
    *,
    type: DeviceTypeOption = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    include_vendor: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_device(
    *,
    type: DeviceTypeOption = ...,
    min_year: int | None = ...,
    max_year: int | None = ...,
    include_vendor: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[DeviceDetail]: ...


def rand_device(
    *,
    type: DeviceTypeOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    include_vendor: bool = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[DeviceDetail]:
    """Generate real phones, tablets and laptops, by the names their makers gave them.

    Every model is one that came out, written with its generation or year where the line
    is told apart by one: `iPad (10th generation)`, `ThinkPad X1 Carbon Gen 11`,
    `MacBook Air (M2, 2022)`.

    Args:
        type: `"phone"`, `"tablet"`, `"laptop"`, a sequence of them, or `"all"`.
        min_year: The earliest year a device may have been released in.
        max_year: The latest year a device may have been released in — `2015` is what was
            out by the end of 2015. A range the wrong way round keeps `max_year`.
        include_vendor: Write the maker in front of the model: `Apple iPhone 15` rather
            than `iPhone 15`. A model whose name already opens on its maker's
            (`Xiaomi 14`) is written the same either way.
        count: How many devices to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same device twice. Returns fewer than `count` once the
            catalog runs out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for a `DeviceDetail` per device — the
            maker, the model, the kind and the year.

    Returns:
        A `list[str]`, or a `list[DeviceDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got. Empty when no
        device was released inside the year range.

    Example:
        >>> rand_device()
        ['Samsung Galaxy S24 Ultra']
        >>> rand_device(type="laptop", count=2)
        ['Lenovo ThinkPad T14 Gen 3', 'Apple MacBook Air (M2, 2022)']
        >>> rand_device(type="phone", include_vendor=False)
        ['Pixel 8 Pro']
    """
    details = generate_device_details(
        type=type,
        min_year=min_year,
        max_year=max_year,
        include_vendor=include_vendor,
        count=count,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.device for detail in details]
