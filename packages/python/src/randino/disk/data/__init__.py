"""The kinds of storage a machine has, and how much of it a drive holds."""

from randino._types import DiskType, SystemPlatform

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
