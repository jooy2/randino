"""randino — random person names and nicknames, per language, with no dependencies.

Two separate concerns, deliberately. `rand_name` produces names a person could
actually carry (`김민준`, `Emma Clover`); `rand_nickname` produces the handle
someone would pick for a game or a website (`멋진사자`, `MistyOwl`), built from
everyday words and never from person names.

Example:
    >>> from randino import rand_name, rand_nickname
    >>> rand_name(language="ko", count=3)
    ['김민준', '이서연', '박지호']
    >>> rand_nickname(language="en")
    ['MistyOwl']
"""

from randino._types import (
    NameDetail,
    NameGender,
    NameGenderOption,
    NameLanguage,
    NameLanguageOption,
    NameScript,
    NicknameDetail,
    NicknameLanguage,
    NicknameLanguageOption,
    NicknameTheme,
    NicknameThemeOption,
)
from randino.name import (
    NAME_COUNT_MAX,
    NAME_LANGUAGES,
    NAME_LENGTH_MAX,
    NAME_LENGTH_MIN,
    name_length_range,
    name_supports_middle_name,
    name_supports_roman,
    rand_name,
    rand_name_details,
)
from randino.nickname import (
    NICKNAME_COUNT_MAX,
    NICKNAME_LANGUAGES,
    NICKNAME_LENGTH_MAX,
    NICKNAME_LENGTH_MIN,
    NICKNAME_SUFFIX_CHARSET,
    NICKNAME_SUFFIX_LENGTH_MAX,
    NICKNAME_THEMES,
    nickname_length_range,
    rand_nickname,
    rand_nickname_details,
)

__all__ = [
    "NAME_COUNT_MAX",
    "NAME_LANGUAGES",
    "NAME_LENGTH_MAX",
    "NAME_LENGTH_MIN",
    "NICKNAME_COUNT_MAX",
    "NICKNAME_LANGUAGES",
    "NICKNAME_LENGTH_MAX",
    "NICKNAME_LENGTH_MIN",
    "NICKNAME_SUFFIX_CHARSET",
    "NICKNAME_SUFFIX_LENGTH_MAX",
    "NICKNAME_THEMES",
    "NameDetail",
    "NameGender",
    "NameGenderOption",
    "NameLanguage",
    "NameLanguageOption",
    "NameScript",
    "NicknameDetail",
    "NicknameLanguage",
    "NicknameLanguageOption",
    "NicknameTheme",
    "NicknameThemeOption",
    "name_length_range",
    "name_supports_middle_name",
    "name_supports_roman",
    "nickname_length_range",
    "rand_name",
    "rand_name_details",
    "rand_nickname",
    "rand_nickname_details",
]
