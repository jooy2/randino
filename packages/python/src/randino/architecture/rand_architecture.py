"""Processor architectures, by the names a download page most often lists them under."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import ArchitectureDetail, ArchitectureNaming, SystemPlatformOption
from randino.architecture._generator import generate_architecture_details


@overload
def rand_architecture(
    *,
    platform: SystemPlatformOption = ...,
    include_rare: bool = ...,
    naming: ArchitectureNaming = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_architecture(
    *,
    platform: SystemPlatformOption = ...,
    include_rare: bool = ...,
    naming: ArchitectureNaming = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[ArchitectureDetail]: ...


def rand_architecture(
    *,
    platform: SystemPlatformOption = "all",
    include_rare: bool = False,
    naming: ArchitectureNaming = "common",
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[ArchitectureDetail]:
    """Generate processor architectures: `x86_64`, `arm64`.

    64-bit x86 and Arm are nearly every draw, and the 32-bit `x86` and `armv7` the rest.

    Args:
        platform: `"desktop"` for desktops, laptops and servers, `"mobile"` for phones and
            tablets, or `"all"` for both. A phone is nearly always `arm64`, and the rare
            architectures are never a phone's.
        include_rare: Draw the architectures few machines run now and then as well: RISC-V,
            POWER, IBM Z, MIPS, LoongArch and SPARC, about one desktop draw in twenty
            together.
        naming: Whose names to write: `"common"`, `"debian"`, `"go"` or `"kernel"`.
            `"debian"` writes `amd64` where `"common"` writes `x86_64`, and `"kernel"`
            writes `aarch64` for `arm64`.
        count: How many architectures to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same architecture twice. Returns fewer than `count` once
            they run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for names, `"detail"` for an `ArchitectureDetail` per result —
            the common name, the other names it goes by, its width, its line and the
            platform.

    Returns:
        A `list[str]`, or a `list[ArchitectureDetail]` when `output="detail"` — the
        overloads carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_architecture()
        ['x86_64']
        >>> rand_architecture(platform="mobile")
        ['arm64']
        >>> rand_architecture(naming="debian", count=2)
        ['amd64', 'armhf']
        >>> rand_architecture(include_rare=True, count=3)
        ['x86_64', 'riscv64', 'arm64']
    """
    details = generate_architecture_details(
        platform=platform,
        include_rare=include_rare,
        naming=naming,
        count=count,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    names: list[str] = [detail.architecture for detail in details]

    return names
