"""Storage: the kind of drive a machine has, `SSD` or `UFS`."""

from randino.disk.data import DISK_TYPES
from randino.disk.rand_disk_type import rand_disk_type

__all__ = ["DISK_TYPES", "rand_disk_type"]
