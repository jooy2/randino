"""Real devices: `Apple iPhone 15`, `Samsung Galaxy Tab S9`, `Lenovo ThinkPad T14 Gen 3`."""

from randino.device.data import DEVICE_TYPES, DEVICE_VENDORS
from randino.device.rand_device import rand_device

__all__ = ["DEVICE_TYPES", "DEVICE_VENDORS", "rand_device"]
