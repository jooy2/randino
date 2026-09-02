"""Person names: `김민준`, `Emma Clover`, `Иванов Иван`."""

from randino.name.data import NAME_LANGUAGES
from randino.name.name_length_range import name_length_range
from randino.name.name_supports_middle_name import name_supports_middle_name
from randino.name.name_supports_roman import name_supports_roman
from randino.name.rand_name import rand_name

__all__ = [
    "NAME_LANGUAGES",
    "name_length_range",
    "name_supports_middle_name",
    "name_supports_roman",
    "rand_name",
]
