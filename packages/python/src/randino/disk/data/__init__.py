"""The kinds of storage a machine has, and how much of it a drive holds."""

from randino._internal.capacity import CapacityPool, CapacityScale
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
)
"""How storage is measured: in powers of ten, the way a drive is sold."""

DISK_SIZES: dict[DiskType, CapacityPool] = {
    "hdd": (
        (120, 1),
        (250, 3),
        (500, 10),
        (1000, 18),
        (2000, 12),
        (3000, 3),
        (4000, 8),
        (6000, 3),
        (8000, 4),
        (10000, 1.5),
        (12000, 1.5),
        (14000, 1),
        (16000, 1),
        (18000, 1),
        (20000, 1),
        (22000, 0.5),
        (24000, 0.5),
    ),
    "ssd": (
        (32, 0.5),
        (64, 1),
        (120, 2),
        (128, 6),
        (240, 3),
        (250, 4),
        (256, 18),
        (480, 3),
        (500, 8),
        (512, 22),
        (1000, 22),
        (2000, 8),
        (4000, 2),
        (8000, 0.5),
    ),
    "sshd": (
        (250, 1),
        (500, 4),
        (1000, 8),
        (2000, 4),
        (3000, 1),
        (4000, 0.5),
    ),
    "emmc": (
        (16, 4),
        (32, 8),
        (64, 8),
        (128, 4),
    ),
    "ufs": (
        (32, 1),
        (64, 4),
        (128, 16),
        (256, 20),
        (512, 10),
        (1000, 3),
    ),
}
"""Every capacity each kind of storage is sold in, in gigabytes.

With how often each one comes up beside the others of that kind. A kind is sold in sizes of
its own, so a size is drawn from the kind's pool rather than from every size there is: a
hard disk is the only kind past 8 TB, an eMMC chip stops at 128 GB, and the 120, 240 and
480 GB of the first SATA SSDs are an SSD's alone. The weights are written by hand in the
order the sizes are common in, not measured from any one survey: 512 GB and 1 TB lead the
SSDs, 1 and 2 TB the hard disks, 128 and 256 GB the phones.
"""
