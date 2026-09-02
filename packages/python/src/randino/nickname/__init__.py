"""Nicknames: `멋진사자`, `MistyOwl` — handles, never person names."""

from randino.nickname.data import NICKNAME_LANGUAGES, NICKNAME_THEMES
from randino.nickname.nickname_length_range import nickname_length_range
from randino.nickname.rand_nickname import rand_nickname

__all__ = [
    "NICKNAME_LANGUAGES",
    "NICKNAME_THEMES",
    "nickname_length_range",
    "rand_nickname",
]
