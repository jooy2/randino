"""Whether romanizing a language's names changes anything."""

from randino._types import NameLanguageOption


def name_supports_roman(language: NameLanguageOption = "all") -> bool:
    """Whether `script="roman"` produces anything different from `script="native"`.

    English names are already written in the Latin alphabet, so both scripts return
    the same string.

    Example:
        >>> name_supports_roman("ko")
        True
        >>> name_supports_roman("en")
        False
    """
    return language != "en"
