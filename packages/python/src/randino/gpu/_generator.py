"""The GPU generator: a real graphics processor, by the name its maker gave it.

Nothing is invented and nothing is weighted. Every option narrows the parts a draw may land
on, and every part left is as likely as the next.
"""

from collections.abc import Callable

from randino._internal.generate import collect, resolve_many, resolve_platforms, resolve_years
from randino._internal.utils import pick, with_random
from randino._types import GpuDetail, SystemPlatformOption
from randino.gpu.data import GPU_VENDORS, GPUS, GpuEntry


def write_gpu(entry: GpuEntry, include_vendor: bool) -> str:
    """Write `entry` with its maker in front, or alone."""
    return f"{entry.vendor} {entry.model}" if include_vendor else entry.model


def generate_gpu_details(
    *,
    platform: SystemPlatformOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    vendor: object = "all",
    include_vendor: bool = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[GpuDetail]:
    """Generate `count` graphics processors, applied to every option."""
    platforms = resolve_platforms(platform)
    low, high = resolve_years(min_year, max_year)
    vendors = resolve_many(vendor, GPU_VENDORS, GPU_VENDORS)
    # `is not False` rather than truthiness, the way the npm package reads it.
    with_vendor = include_vendor is not False
    # Worked out once per call rather than per draw: a call of ten thousand would
    # otherwise filter the catalog ten thousand times.
    candidates = [
        entry
        for entry in GPUS
        if entry.platform in platforms and entry.vendor in vendors and low <= entry.year <= high
    ]

    def draw() -> GpuDetail:
        entry = pick(candidates)

        return GpuDetail(
            gpu=write_gpu(entry, with_vendor),
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
            key_of=lambda detail: detail.gpu,
        )
