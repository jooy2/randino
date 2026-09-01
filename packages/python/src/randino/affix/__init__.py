"""Random tokens attached to strings you already have."""

from randino.affix.data import (
    AFFIX_CHARSET,
    AFFIX_LENGTH_DEFAULT,
    AFFIX_LENGTH_MAX,
    AFFIX_SEPARATOR_DEFAULT,
)
from randino.affix.rand_prefix import rand_prefix
from randino.affix.rand_suffix import rand_suffix

__all__ = [
    "AFFIX_CHARSET",
    "AFFIX_LENGTH_DEFAULT",
    "AFFIX_LENGTH_MAX",
    "AFFIX_SEPARATOR_DEFAULT",
    "rand_prefix",
    "rand_suffix",
]
