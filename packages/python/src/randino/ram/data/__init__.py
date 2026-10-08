"""Every amount of memory a machine is sold with, and how often each one comes up."""

from randino._internal.capacity import CapacityScale
from randino._types import RamUnit

RAM_UNITS: tuple[RamUnit, ...] = ("MB", "GB")
"""Every unit memory is written in, smallest first."""

RAM_SCALE: CapacityScale[RamUnit] = CapacityScale(
    units=RAM_UNITS,
    step=1024,
    base="MB",
    reference="GB",
    bytes=1024 * 1024,
    pool=(
        (512, 2),
        (1024, 3),
        (2048, 5),
        (3072, 4),
        (4096, 12),
        (6144, 8),
        (8192, 24),
        (12288, 10),
        (16384, 22),
        (18432, 1),
        (24576, 4),
        (32768, 12),
        (36864, 1),
        (49152, 2),
        (65536, 5),
        (98304, 1),
        (131072, 2),
        (196608, 0.3),
        (262144, 0.3),
        (524288, 0.2),
        (1048576, 0.1),
    ),
)
"""Every amount of memory a phone, a laptop, a desktop or a workstation is sold with.

In megabytes, with how often each one comes up. The weights are written by hand in the
order the sizes are common in, not measured from any one survey: 8 and 16 GB are most of a
sample, 4 and 32 GB after them, the sizes of older phones and of workstations rare. The odd
ones are real too — 3 and 6 GB phones, 18 and 36 GB Macs, 24 and 48 GB laptops with two
unequal modules.
"""
