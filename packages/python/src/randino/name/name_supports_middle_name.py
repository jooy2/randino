"""Whether a language uses a middle name."""

from randino._types import NameLanguageOption
from randino.name.data import NAME_DATA


def name_supports_middle_name(language: NameLanguageOption = "all") -> bool:
    """Whether the language uses a middle name.

    `include_middle_name` is ignored for languages that do not — Korean, Japanese
    and Chinese names have no middle part.

    Example:
        >>> name_supports_middle_name("en")
        True
        >>> name_supports_middle_name("ko")
        False
    """
    if language == "all":
        return True

    data = NAME_DATA.get(language)

    return bool(data and data.has_middle)
