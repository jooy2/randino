"""Nicknames: `멋진사자`, `MistyOwl` — handles, never person names."""

from randino.nickname.data import (
    NICKNAME_COUNT_MAX,
    NICKNAME_LANGUAGES,
    NICKNAME_LENGTH_MAX,
    NICKNAME_LENGTH_MIN,
    NICKNAME_SUFFIX_CHARSET,
    NICKNAME_SUFFIX_LENGTH_MAX,
    NICKNAME_THEMES,
)
from randino.nickname.nickname_length_range import nickname_length_range
from randino.nickname.rand_nickname import rand_nickname
from randino.nickname.rand_nickname_details import rand_nickname_details

__all__ = [
    "NICKNAME_COUNT_MAX",
    "NICKNAME_LANGUAGES",
    "NICKNAME_LENGTH_MAX",
    "NICKNAME_LENGTH_MIN",
    "NICKNAME_SUFFIX_CHARSET",
    "NICKNAME_SUFFIX_LENGTH_MAX",
    "NICKNAME_THEMES",
    "nickname_length_range",
    "rand_nickname",
    "rand_nickname_details",
]
