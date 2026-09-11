"""Whether a language uses a middle name."""

from randino._types import NameLanguageOption
from randino.name.data import NAME_DATA, resolve_name_language


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
    wanted = resolve_name_language(language)

    if wanted == "all":
        return True

    return NAME_DATA[wanted].has_middle
