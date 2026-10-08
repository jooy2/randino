"""Every processor architecture, what it is, and how often it comes up."""

from typing import NamedTuple

from randino._types import Architecture

ARCHITECTURES: tuple[Architecture, ...] = (
    "x86_64",
    "arm64",
    "x86",
    "armv7",
    "riscv64",
    "ppc64le",
    "s390x",
    "mips64",
    "loongarch64",
    "sparc64",
)
"""Every architecture, the four common ones first."""


class ArchitectureData(NamedTuple):
    """What an architecture is, and how often it comes up."""

    family: str
    """The line it belongs to."""

    bits: int
    """`32` or `64`."""

    weight: float
    """How often it comes up, out of a hundred for the four common ones."""

    rare: bool
    """Whether it comes up only with `include_rare`."""

    aliases: tuple[str, ...]
    """The other names it goes by."""


ARCHITECTURE_DATA: dict[Architecture, ArchitectureData] = {
    "x86_64": ArchitectureData("x86", 64, 46, False, ("amd64", "x64")),
    "arm64": ArchitectureData("arm", 64, 40, False, ("aarch64",)),
    "x86": ArchitectureData("x86", 32, 8, False, ("i386", "ia32", "i686")),
    "armv7": ArchitectureData("arm", 32, 6, False, ("armhf", "armv7l")),
    "riscv64": ArchitectureData("riscv", 64, 0.8, True, ()),
    "ppc64le": ArchitectureData("power", 64, 0.8, True, ("ppc64el",)),
    "s390x": ArchitectureData("s390", 64, 0.8, True, ()),
    "mips64": ArchitectureData("mips", 64, 0.8, True, ()),
    "loongarch64": ArchitectureData("loongarch", 64, 0.8, True, ("loong64",)),
    "sparc64": ArchitectureData("sparc", 64, 0.8, True, ("sparcv9",)),
}
"""Every architecture's line, width, weight and other names.

The weights are out of a hundred for the four common ones, written by hand in the order
they are common in: 64-bit x86 and Arm are nearly every machine, the 32-bit two what is
left of the old ones. Each rare one is a fraction, so the six together are about one draw
in twenty when asked for. The aliases are in the order they are met: Debian's and Go's,
then Windows' and Node's, then the kernel's or the compiler's.
"""
