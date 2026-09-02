"""Decorators: what you attach to a string you already have."""

from randino.decorate.data import (
    AFFIX_CHARSET,
    AFFIX_LENGTH_DEFAULT,
    AFFIX_LENGTH_MAX,
    AFFIX_SEPARATOR_DEFAULT,
)
from randino.decorate.rand_modifier import rand_modifier
from randino.decorate.rand_prefix import rand_prefix
from randino.decorate.rand_suffix import rand_suffix

__all__ = [
    "AFFIX_CHARSET",
    "AFFIX_LENGTH_DEFAULT",
    "AFFIX_LENGTH_MAX",
    "AFFIX_SEPARATOR_DEFAULT",
    "rand_modifier",
    "rand_prefix",
    "rand_suffix",
]
