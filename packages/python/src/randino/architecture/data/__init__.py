"""Every processor architecture, what it is, how often it comes up, and what it is called."""

from typing import NamedTuple

from randino._types import Architecture, ArchitectureNaming, SystemPlatform

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

ARCHITECTURE_NAMINGS: tuple[ArchitectureNaming, ...] = ("common", "debian", "go", "kernel")
"""Every naming an architecture can be written by, the common one first."""


class ArchitectureData(NamedTuple):
    """What an architecture is, how often it comes up, and what it is called."""

    family: str
    """The line it belongs to."""

    bits: int
    """`32` or `64`."""

    weights: dict[SystemPlatform, float]
    """How often it comes up on each platform it runs on, out of a hundred for the common ones.

    A platform it is not found on is left out.
    """

    rare: bool
    """Whether it comes up only with `include_rare`."""

    names: dict[ArchitectureNaming, str]
    """The name each naming other than `common` writes it by."""

    aliases: tuple[str, ...]
    """The other names it goes by. Every name in `names` that is not the common one is here."""


ARCHITECTURE_DATA: dict[Architecture, ArchitectureData] = {
    "x86_64": ArchitectureData(
        family="x86",
        bits=64,
        weights={"desktop": 80},
        rare=False,
        names={"debian": "amd64", "go": "amd64", "kernel": "x86_64"},
        aliases=("amd64", "x64"),
    ),
    "arm64": ArchitectureData(
        family="arm",
        bits=64,
        weights={"desktop": 14, "mobile": 84},
        rare=False,
        names={"debian": "arm64", "go": "arm64", "kernel": "aarch64"},
        aliases=("aarch64",),
    ),
    "x86": ArchitectureData(
        family="x86",
        bits=32,
        weights={"desktop": 5, "mobile": 2},
        rare=False,
        names={"debian": "i386", "go": "386", "kernel": "i686"},
        aliases=("i386", "386", "ia32", "i686"),
    ),
    "armv7": ArchitectureData(
        family="arm",
        bits=32,
        weights={"desktop": 1, "mobile": 14},
        rare=False,
        names={"debian": "armhf", "go": "arm", "kernel": "armv7l"},
        aliases=("armhf", "arm", "armv7l"),
    ),
    "riscv64": ArchitectureData(
        family="riscv",
        bits=64,
        weights={"desktop": 0.8},
        rare=True,
        names={"debian": "riscv64", "go": "riscv64", "kernel": "riscv64"},
        aliases=(),
    ),
    "ppc64le": ArchitectureData(
        family="power",
        bits=64,
        weights={"desktop": 0.8},
        rare=True,
        names={"debian": "ppc64el", "go": "ppc64le", "kernel": "ppc64le"},
        aliases=("ppc64el",),
    ),
    "s390x": ArchitectureData(
        family="s390",
        bits=64,
        weights={"desktop": 0.8},
        rare=True,
        names={"debian": "s390x", "go": "s390x", "kernel": "s390x"},
        aliases=(),
    ),
    "mips64": ArchitectureData(
        family="mips",
        bits=64,
        weights={"desktop": 0.8},
        rare=True,
        # Debian's only 64-bit MIPS port, and the Loongson machines most of them are, are
        # little-endian.
        names={"debian": "mips64el", "go": "mips64le", "kernel": "mips64"},
        aliases=("mips64el", "mips64le"),
    ),
    "loongarch64": ArchitectureData(
        family="loongarch",
        bits=64,
        weights={"desktop": 0.8},
        rare=True,
        names={"debian": "loong64", "go": "loong64", "kernel": "loongarch64"},
        aliases=("loong64",),
    ),
    "sparc64": ArchitectureData(
        family="sparc",
        bits=64,
        weights={"desktop": 0.8},
        rare=True,
        names={"debian": "sparc64", "go": "sparc64", "kernel": "sparc64"},
        aliases=("sparcv9",),
    ),
}
"""Every architecture's line, width, weights and names.

The weights are out of a hundred for the four common ones on each platform, written by hand
in the order they are common in: a desktop or a laptop is mostly 64-bit x86 and a phone
nearly always 64-bit Arm, with the 32-bit two what is left of the old ones. Each rare one is
a fraction, and only a desktop's — a workstation or a server is not a phone — so the six
together are about one desktop draw in twenty when asked for. The aliases are in the order
they are met: Debian's and Go's, then Windows' and Node's, then the kernel's or the
compiler's.
"""
