"""Amounts of memory a machine is really sold with: `16 GB`, `512 MB`, `12 GB LPDDR5X`."""

from randino.ram.data import RAM_TYPES, RAM_UNITS
from randino.ram.rand_ram import rand_ram

__all__ = ["RAM_TYPES", "RAM_UNITS", "rand_ram"]
