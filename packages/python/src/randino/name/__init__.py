"""Person names: `김민준`, `Emma Clover`, `Иванов Иван`."""

from randino.name.data import (
    NAME_COUNT_MAX,
    NAME_LANGUAGES,
    NAME_LENGTH_MAX,
    NAME_LENGTH_MIN,
)
from randino.name.name_length_range import name_length_range
from randino.name.name_supports_middle_name import name_supports_middle_name
from randino.name.name_supports_roman import name_supports_roman
from randino.name.rand_name import rand_name
from randino.name.rand_name_details import rand_name_details

__all__ = [
    "NAME_COUNT_MAX",
    "NAME_LANGUAGES",
    "NAME_LENGTH_MAX",
    "NAME_LENGTH_MIN",
    "name_length_range",
    "name_supports_middle_name",
    "name_supports_roman",
    "rand_name",
    "rand_name_details",
]
