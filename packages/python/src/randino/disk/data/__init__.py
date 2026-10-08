"""The kinds of storage a machine has, and how much of it a drive holds."""

from randino._internal.capacity import CapacityScale
from randino._types import DiskType, DiskUnit, SystemPlatform

DISK_TYPES: tuple[DiskType, ...] = ("hdd", "ssd", "sshd", "emmc", "ufs")
"""Every kind of storage, in the order the catalog lists them."""

DISK_TYPE_LABELS: dict[DiskType, tuple[str, str]] = {
    "hdd": ("HDD", "Hard Disk Drive"),
    "ssd": ("SSD", "Solid State Drive"),
    "sshd": ("SSHD", "Solid State Hybrid Drive"),
    "emmc": ("eMMC", "Embedded MultiMediaCard"),
    "ufs": ("UFS", "Universal Flash Storage"),
}
"""How each kind of storage is written: the label a spec sheet uses, and the name behind it."""

DISK_TYPE_WEIGHTS: dict[SystemPlatform, dict[DiskType, int]] = {
    "desktop": {"ssd": 62, "hdd": 33, "sshd": 3, "emmc": 2},
    "mobile": {"ufs": 70, "emmc": 30},
}
"""How often each kind of storage comes up on each platform, out of a hundred.

Written by hand in the order the kinds are common in, not measured from any one survey:
an SSD is most desktops and laptops now and a hard disk most of the rest, while a phone or
a tablet stores to UFS or, older and cheaper, to eMMC — which is also what a low-cost
laptop is built with. `"all"` picks the platform first, so the two come up about evenly.
"""

DISK_UNITS: tuple[DiskUnit, ...] = ("MB", "GB", "TB")
"""Every unit storage is written in, smallest first."""

DISK_SCALE: CapacityScale[DiskUnit] = CapacityScale(
    units=DISK_UNITS,
    step=1000,
    base="GB",
    reference="GB",
    bytes=1000**3,
    pool=(
        (16, 1),
        (32, 2),
        (64, 4),
        (120, 2),
        (128, 8),
        (240, 3),
        (250, 3),
        (256, 16),
        (480, 3),
        (500, 8),
        (512, 18),
        (1000, 18),
        (2000, 10),
        (3000, 2),
        (4000, 6),
        (6000, 2),
        (8000, 3),
        (10000, 1),
        (12000, 1),
        (14000, 0.5),
        (16000, 0.5),
        (18000, 0.5),
        (20000, 0.5),
        (22000, 0.3),
        (24000, 0.3),
    ),
)
"""Every capacity a drive or a phone's storage is sold with, in gigabytes.

With how often each one comes up. The weights are written by hand in the order the sizes
are common in, not measured from any one survey: 256 GB, 512 GB and 1 TB are most of a
sample, the small flash of an old phone and the largest hard disks rare. The SATA sizes of
the first SSDs (120, 240 and 480 GB) and the 250 and 500 GB of the hard disks beside them
are in too.
"""
