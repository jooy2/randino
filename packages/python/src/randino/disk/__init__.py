"""Storage: the kind of drive a machine has, `SSD` or `UFS`, and how much it holds."""

from randino.disk.data import DISK_TYPES, DISK_UNITS
from randino.disk.rand_disk_size import rand_disk_size
from randino.disk.rand_disk_type import rand_disk_type

__all__ = ["DISK_TYPES", "DISK_UNITS", "rand_disk_size", "rand_disk_type"]
