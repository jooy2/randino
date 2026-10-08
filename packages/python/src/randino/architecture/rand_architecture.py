"""Processor architectures, by the names a download page most often lists them under."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import ArchitectureDetail
from randino.architecture._generator import generate_architecture_details


@overload
def rand_architecture(
    *,
    include_rare: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_architecture(
    *,
    include_rare: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[ArchitectureDetail]: ...


def rand_architecture(
    *,
    include_rare: bool = False,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[ArchitectureDetail]:
    """Generate processor architectures: `x86_64`, `arm64`.

    64-bit x86 and Arm are nearly every draw, and the 32-bit `x86` and `armv7` the rest.

    Args:
        include_rare: Draw the architectures few machines run now and then as well: RISC-V,
            POWER, IBM Z, MIPS, LoongArch and SPARC, about one draw in twenty together.
        count: How many architectures to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same architecture twice. Returns fewer than `count` once
            they run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for names, `"detail"` for an `ArchitectureDetail` per result —
            the other names it goes by, its width and its line.

    Returns:
        A `list[str]`, or a `list[ArchitectureDetail]` when `output="detail"` — the
        overloads carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_architecture()
        ['x86_64']
        >>> rand_architecture(include_rare=True, count=3)
        ['x86_64', 'riscv64', 'arm64']
    """
    details = generate_architecture_details(
        include_rare=include_rare, count=count, unique=unique, random=random
    )

    if output == "detail":
        return details

    names: list[str] = [detail.architecture for detail in details]

    return names
