"""Every amount of memory a machine is sold with, and the kinds of memory it was sold as."""

from dataclasses import dataclass

from randino._internal.capacity import CapacityPool, CapacityScale
from randino._internal.table import rows
from randino._types import RamType, RamUnit, SystemPlatform

RAM_UNITS: tuple[RamUnit, ...] = ("MB", "GB")
"""Every unit memory is written in, smallest first."""

RAM_TYPES: tuple[RamType, ...] = (
    "DDR",
    "DDR2",
    "DDR3",
    "DDR4",
    "DDR5",
    "LPDDR",
    "LPDDR2",
    "LPDDR3",
    "LPDDR4",
    "LPDDR4X",
    "LPDDR5",
    "LPDDR5X",
)
"""Every kind of memory, the desktop ones first, each line oldest first."""

RAM_SCALE: CapacityScale[RamUnit] = CapacityScale(
    units=RAM_UNITS,
    step=1024,
    base="MB",
    reference="GB",
    bytes=1024 * 1024,
)
"""How memory is measured: in powers of two, as an operating system reports it."""

RAM_SIZES: dict[SystemPlatform, CapacityPool] = {
    "desktop": (
        (512, 1),
        (1024, 2),
        (2048, 4),
        (3072, 1),
        (4096, 10),
        (6144, 1),
        (8192, 24),
        (12288, 2),
        (16384, 26),
        (18432, 1),
        (24576, 4),
        (32768, 14),
        (36864, 1),
        (49152, 2),
        (65536, 6),
        (98304, 1),
        (131072, 2),
        (196608, 0.3),
        (262144, 0.3),
        (524288, 0.2),
        (1048576, 0.1),
    ),
    "mobile": (
        (512, 2),
        (1024, 4),
        (2048, 8),
        (3072, 8),
        (4096, 14),
        (6144, 14),
        (8192, 22),
        (12288, 16),
        (16384, 8),
        (18432, 0.5),
        (24576, 1),
    ),
}
"""Every amount of memory a machine of each platform is sold with, in megabytes.

With how often each one comes up. The weights are written by hand in the order the sizes
are common in, not measured from any one survey: 8 and 16 GB are most of a sample, 4 and
32 GB after them, the sizes of the oldest machines and of workstations rare. The odd ones
are real too — 3 and 6 GB phones, 18 and 36 GB Macs, 24 and 48 GB laptops with two unequal
modules. A phone's stop at 24 GB.
"""


@dataclass(frozen=True, slots=True)
class RamTypeSize:
    """A size a kind of memory came in, and the first year a machine came with it."""

    size: int
    """The size, in megabytes."""

    first_year: int
    """The first year a machine of the platform was sold with this much of it.

    The kind's own first year unless the size came later.
    """


@dataclass(frozen=True, slots=True)
class RamTypeEntry:
    """One kind of memory, on one platform."""

    type: RamType
    """The kind of memory."""

    platform: SystemPlatform
    """The kind of machine it is found in."""

    first_year: int
    """The first year machines of the platform were sold with it."""

    last_year: int | None
    """The last year they were, or None while they still are."""

    weight: float
    """How often it comes up beside the other kinds of the platform, out of a hundred."""

    sizes: tuple[RamTypeSize, ...]
    """The sizes machines of the platform were sold with in it, smallest first."""


def _size(cell: str, first_year: int) -> RamTypeSize:
    """One size of a row, `16` or `512@2013`, turned from gigabytes into megabytes."""
    size, _, since = cell.partition("@")

    return RamTypeSize(
        size=round(float(size) * 1024), first_year=int(since) if since else first_year
    )


def _entry(row: tuple[str, ...]) -> RamTypeEntry:
    """One row of the table, its sizes turned from gigabytes into megabytes."""
    return RamTypeEntry(
        type=row[0],  # type: ignore[arg-type]
        platform=row[1],  # type: ignore[arg-type]
        first_year=int(row[2]),
        last_year=int(row[3]) if row[3] else None,
        weight=float(row[4]),
        sizes=tuple(_size(cell, int(row[2])) for cell in row[5].split()),
    )


RAM_TYPE_ENTRIES: tuple[RamTypeEntry, ...] = tuple(
    _entry(row)
    for row in rows("""
DDR     | desktop | 2000 | 2006 | 1  | 0.5@2002 1@2002 2@2002
DDR2    | desktop | 2004 | 2010 | 2  | 0.5@2005 1@2005 2@2005 3@2006 4@2005 8@2005
DDR3    | desktop | 2008 | 2017 | 8  | 1@2009 2 3@2009 4 6@2009 8@2009 12@2009 16@2009 24@2010 32@2009 48@2012 64@2012 128@2013 256@2013 512@2013
DDR4    | desktop | 2014 |      | 34 | 4 8 12@2015 16 24@2016 32 48@2017 64 96@2017 128 192 256 512 1024@2015
DDR5    | desktop | 2021 |      | 30 | 8 16 24@2022 32 48@2023 64 96@2023 128 192@2023 256@2023 512@2023 1024@2024
LPDDR3  | desktop | 2013 | 2020 | 2  | 4 8 16@2014
LPDDR4X | desktop | 2018 |      | 6  | 4 8 16@2019 32@2019
LPDDR5  | desktop | 2021 |      | 8  | 8@2022 16 18@2023 24@2022 32 36@2023 48@2023 64 96@2023 128@2022 192@2023 256@2025 512@2025
LPDDR5X | desktop | 2023 |      | 9  | 8@2024 16 24@2024 32 36@2024 48@2024 64 96@2026 128@2024

LPDDR   | mobile  | 2010 | 2011 | 1  | 0.5
LPDDR2  | mobile  | 2011 | 2015 | 3  | 0.5 1 2@2012
LPDDR3  | mobile  | 2013 | 2018 | 6  | 1 2 3 4@2015
LPDDR4  | mobile  | 2015 | 2020 | 10 | 2 3 4 6@2016
LPDDR4X | mobile  | 2017 |      | 30 | 2 3 4 6 8 12@2019
LPDDR5  | mobile  | 2020 |      | 25 | 6 8 12 16 18@2021
LPDDR5X | mobile  | 2022 |      | 25 | 8 12 16 24@2023
""")
)
"""Every kind of memory, with its platform, its years and its sizes, one per row.

`type | platform | from | to | weight | sizes in gigabytes`

`to` is empty while machines are still sold with it. A size that came later than the kind
itself carries its own first year, `512@2013`: a year range keeps to the sizes out by then
as well as to the kinds, so a desktop of 2010 is never handed a workstation's half a
terabyte of DDR3. The year of a kind and of each size is the first one a maker's own spec
sheet shows — Apple's tech specs, Lenovo's PSREF, HP's QuickSpecs, a phone maker's
specification page — and a size no spec sheet showed in a kind is left out of it rather
than guessed at. The years are those the standard was in new machines, from the first that
shipped with it to the point its successor had replaced it in all but a few: DDR4 from
Intel's Haswell-E in 2014, DDR5 from Alder Lake in 2021, LPDDR5X from the phones of late
2022. A laptop built on a phone's memory — a MacBook Air, a Snapdragon laptop — is under
`desktop`, with the sizes laptops came in. The weights are written by hand in the order the
kinds are common in among the machines in use now, so DDR4 and DDR5 lead the desktops and
LPDDR4X and LPDDR5 the phones.
"""
