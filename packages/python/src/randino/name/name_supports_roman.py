"""Whether romanizing a language's names changes anything."""

from randino._types import NameLanguage, NameLanguageOption
from randino.name._romanize import fold
from randino.name.data import NAME_DATA, NAME_LANGUAGES, resolve_name_language
from randino.name.data._types import NameLanguageData, NamePool

_ANSWERS: dict[NameLanguage, bool] = {}


def _pools_of(data: NameLanguageData) -> tuple[NamePool | None, ...]:
    """Every pool a language writes a name out of, for the question below."""
    return (
        data.last,
        data.male,
        data.female,
        data.middle_male,
        data.middle_female,
        data.given_male,
        data.given_female,
    )


def _differs(language: NameLanguage) -> bool:
    """Whether the language writes a name that romanizes to something else.

    Read off the pools rather than off the language code. Hangul, Cyrillic and the two
    scripts that carry their own reading always romanize to something else; a
    Latin-script language only does when one of its names carries a mark that folding
    takes off, and whether it does is a fact about the pools — a Latin-script language
    added tomorrow with no marks at all would differ in none.
    """
    cached = _ANSWERS.get(language)

    if cached is not None:
        return cached

    data = NAME_DATA[language]
    answer = data.roman != "fold" or any(
        fold(native) != native
        for pool in _pools_of(data)
        for native in (item if isinstance(item, str) else item.n for item in pool or ())
    )
    _ANSWERS[language] = answer

    return answer


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
    wanted = resolve_name_language(language)

    if wanted == "all":
        return any(_differs(code) for code in NAME_LANGUAGES)

    return _differs(wanted)
