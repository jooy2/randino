"""The CPU generator: a real processor, by the name its maker gave it.

Nothing is invented and nothing is weighted. Every option narrows the parts a draw may land
on, and every part left is as likely as the next.
"""

from collections.abc import Callable

from randino._internal.generate import collect, resolve_platforms, resolve_years
from randino._internal.utils import pick, with_random
from randino._types import CpuDetail, SystemPlatformOption
from randino.cpu.data import CPUS, CpuEntry


def write_cpu(entry: CpuEntry, include_vendor: bool) -> str:
    """Write `entry` with its maker in front, or alone."""
    return f"{entry.vendor} {entry.model}" if include_vendor else entry.model


def generate_cpu_details(
    *,
    platform: SystemPlatformOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    include_vendor: bool = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[CpuDetail]:
    """Generate `count` processors, applied to every option."""
    platforms = resolve_platforms(platform)
    low, high = resolve_years(min_year, max_year)
    # `is not False` rather than truthiness, the way the npm package reads it.
    with_vendor = include_vendor is not False
    # Worked out once per call rather than per draw: a call of ten thousand would
    # otherwise filter the catalog ten thousand times.
    candidates = [
        entry for entry in CPUS if entry.platform in platforms and low <= entry.year <= high
    ]

    def draw() -> CpuDetail:
        entry = pick(candidates)

        return CpuDetail(
            cpu=write_cpu(entry, with_vendor),
            vendor=entry.vendor,
            model=entry.model,
            platform=entry.platform,
            year=entry.year,
        )

    with with_random(random):
        return collect(
            count=count if candidates else 0,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.cpu,
        )
