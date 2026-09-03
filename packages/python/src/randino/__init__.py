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
    RandRealism,
    WordDetail,
    WordLanguage,
    WordLanguageOption,
    WordTheme,
    WordThemeOption,
)
from randino.constants import RAND_COUNT_MAX, RAND_LENGTH_MAX, RAND_LENGTH_MIN
from randino.decorate import (
    AFFIX_CHARSET,
    AFFIX_LENGTH_DEFAULT,
    AFFIX_LENGTH_MAX,
    AFFIX_SEPARATOR_DEFAULT,
    rand_modifier,
    rand_prefix,
    rand_suffix,
)
from randino.name import (
    NAME_LANGUAGES,
    name_length_range,
    name_supports_middle_name,
    name_supports_roman,
    rand_name,
)
from randino.nickname import nickname_length_range, rand_nickname
from randino.word import (
    WORD_LANGUAGES,
    WORD_THEMES,
    rand_animal,
    rand_color,
    rand_concept,
    rand_finance,
    rand_food,
    rand_gem,
    rand_job,
    rand_music,
    rand_myth,
    rand_nature,
    rand_object,
    rand_place,
    rand_plant,
    rand_product,
    rand_sport,
    rand_tech,
    rand_vehicle,
    rand_word,
    word_length_range,
)

__all__ = [
    "AFFIX_CHARSET",
    "AFFIX_LENGTH_DEFAULT",
    "AFFIX_LENGTH_MAX",
    "AFFIX_SEPARATOR_DEFAULT",
    "NAME_LANGUAGES",
    "RAND_COUNT_MAX",
    "RAND_LENGTH_MAX",
    "RAND_LENGTH_MIN",
    "WORD_LANGUAGES",
    "WORD_THEMES",
    "NameDetail",
    "NameGender",
    "NameGenderOption",
    "NameLanguage",
    "NameLanguageOption",
    "NameScript",
    "NicknameDetail",
    "RandRealism",
    "WordDetail",
    "WordLanguage",
    "WordLanguageOption",
    "WordTheme",
    "WordThemeOption",
    "name_length_range",
    "name_supports_middle_name",
    "name_supports_roman",
    "nickname_length_range",
    "rand_animal",
    "rand_color",
    "rand_concept",
    "rand_finance",
    "rand_food",
    "rand_gem",
    "rand_job",
    "rand_modifier",
    "rand_music",
    "rand_myth",
    "rand_name",
    "rand_nature",
    "rand_nickname",
    "rand_object",
    "rand_place",
    "rand_plant",
    "rand_prefix",
    "rand_product",
    "rand_sport",
    "rand_suffix",
    "rand_tech",
    "rand_vehicle",
    "rand_word",
    "word_length_range",
]
