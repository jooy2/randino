"""The disk type generator: the kind of storage a machine has, by its platform."""

from collections.abc import Callable

from randino._internal.generate import collect, resolve_platforms
from randino._internal.utils import pick, pick_weighted, with_random
from randino._types import DiskTypeDetail, SystemPlatformOption
from randino.disk.data import DISK_TYPE_LABELS, DISK_TYPE_WEIGHTS, DISK_TYPES


def generate_disk_type_details(
    *,
    platform: SystemPlatformOption = "all",
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[DiskTypeDetail]:
    """Generate `count` kinds of storage, applied to every option."""
    platforms = resolve_platforms(platform)

    def draw() -> DiskTypeDetail:
        # The platform first, so `"all"` is half desktops and half phones, and eMMC —
        # which both use — is drawn by the platform it came up for.
        drawn = pick(platforms)
        weights = DISK_TYPE_WEIGHTS[drawn]
        code = pick_weighted([each for each in DISK_TYPES if each in weights], weights.__getitem__)
        label, name = DISK_TYPE_LABELS[code]

        return DiskTypeDetail(disk_type=label, code=code, name=name, platform=drawn)

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.disk_type,
        )
