"""The CPU generator: a real processor, by the name its maker gave it.

Nothing is invented and nothing is weighted. Every option narrows the parts a draw may land
on, and every part left is as likely as the next.
"""

from collections.abc import Callable

from randino._internal.generate import (
    collect_from,
    kept_outcomes,
    resolve_many,
    resolve_platforms,
    resolve_years,
)
from randino._internal.utils import with_random
from randino._types import CpuDetail, SystemPlatformOption
from randino.cpu.data import CPU_VENDORS, CPUS, CpuEntry


def write_cpu(entry: CpuEntry, include_vendor: bool) -> str:
    """Write `entry` with its maker in front, or alone."""
    return f"{entry.vendor} {entry.model}" if include_vendor else entry.model


_KEPT: dict[str, list[tuple[CpuEntry, float]]] = {}
"""The parts each set of options leaves, kept so a call does not work them out again."""


def generate_cpu_details(
    *,
    platform: SystemPlatformOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    vendor: object = "all",
    include_vendor: bool = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[CpuDetail]:
    """Generate `count` processors, applied to every option."""
    platforms = resolve_platforms(platform)
    low, high = resolve_years(min_year, max_year)
    vendors = resolve_many(vendor, CPU_VENDORS, CPU_VENDORS)
    # `is not False` rather than truthiness, the way the npm package reads it.
    with_vendor = include_vendor is not False
    outcomes = kept_outcomes(
        _KEPT,
        f"{','.join(platforms)}|{','.join(vendors)}|{low}|{high}",
        lambda: [
            (entry, 1.0)
            for entry in CPUS
            if entry.platform in platforms and entry.vendor in vendors and low <= entry.year <= high
        ],
    )

    with with_random(random):
        return collect_from(
            count=count,
            unique=unique,
            starts_with="",
            outcomes=outcomes,
            key_of=lambda entry: write_cpu(entry, with_vendor),
            build=lambda entry: CpuDetail(
                cpu=write_cpu(entry, with_vendor),
                vendor=entry.vendor,
                model=entry.model,
                platform=entry.platform,
                year=entry.year,
            ),
        )
