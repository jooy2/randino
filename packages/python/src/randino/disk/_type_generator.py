"""The disk type generator: the kind of storage a machine has, by its platform."""

from collections.abc import Callable

from randino._internal.generate import collect_from, kept_outcomes, resolve_platforms
from randino._internal.utils import shares, with_random
from randino._types import DiskType, DiskTypeDetail, SystemPlatform, SystemPlatformOption
from randino.disk.data import DISK_TYPE_LABELS, DISK_TYPE_WEIGHTS, DISK_TYPES

_KEPT: dict[str, list[tuple[tuple[SystemPlatform, DiskType], float]]] = {}
"""The kinds each set of platforms uses, kept so a call does not work them out again."""


def generate_disk_type_details(
    *,
    platform: SystemPlatformOption = "all",
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[DiskTypeDetail]:
    """Generate `count` kinds of storage, applied to every option."""
    platforms = resolve_platforms(platform)

    def listed() -> list[tuple[tuple[SystemPlatform, DiskType], float]]:
        # The platform first, so `"all"` is half desktops and half phones, and eMMC — which
        # both use — is drawn by the platform it came up for.
        outcomes: list[tuple[tuple[SystemPlatform, DiskType], float]] = []

        for each in platforms:
            weights = DISK_TYPE_WEIGHTS[each]
            codes = [code for code in DISK_TYPES if code in weights]

            for code, share in zip(codes, shares(codes, weights.__getitem__), strict=True):
                outcomes.append(((each, code), share / len(platforms)))

        return outcomes

    outcomes = kept_outcomes(_KEPT, ",".join(platforms), listed)

    def build(entry: tuple[SystemPlatform, DiskType]) -> DiskTypeDetail:
        drawn, code = entry
        label, name = DISK_TYPE_LABELS[code]

        return DiskTypeDetail(disk_type=label, code=code, name=name, platform=drawn)

    with with_random(random):
        return collect_from(
            count=count,
            unique=unique,
            starts_with="",
            outcomes=outcomes,
            key_of=lambda entry: DISK_TYPE_LABELS[entry[1]][0],
            build=build,
        )
