"""Bounds and defaults for `rand_suffix` and `rand_prefix`.

They are the nickname package's old `NICKNAME_SUFFIX_*` constants, which stopped
belonging to nicknames the moment the suffix became something you attach to any
string.
"""

__all__ = [
    "AFFIX_CHARSET",
    "AFFIX_LENGTH_DEFAULT",
    "AFFIX_LENGTH_MAX",
    "AFFIX_SEPARATOR_DEFAULT",
]

AFFIX_LENGTH_DEFAULT = 5
"""Characters in an affix when no `length` is asked for."""

AFFIX_LENGTH_MAX = 32
"""Upper bound for `length`."""

AFFIX_SEPARATOR_DEFAULT = "_"
"""Placed between the value and its affix when no `separator` is asked for."""

AFFIX_CHARSET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
"""Affix characters, minus the pairs that are easy to misread (0/O, 1/l/I).

These end up in names people read aloud and type back in.
"""
