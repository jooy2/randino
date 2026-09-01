"""The natural length range of a full name."""

from randino._internal.utils import clamp
from randino._types import NameLanguageOption
from randino.name.data import NAME_DATA, NAME_LANGUAGES, NAME_LENGTH_MAX, NAME_LENGTH_MIN


def name_length_range(
    language: NameLanguageOption = "all",
    include_surname: bool = True,
    include_middle_name: bool = False,
) -> tuple[int, int]:
    """Natural length range of a full name, in characters of the native form.

    This is what `random_name` falls back to when `min_length` or `max_length` is
    omitted, and it describes only the parts that are switched on — so leaving the
    surname out relaxes the range instead of forcing the given name to stretch and
    fill it.

    Example:
        >>> name_length_range("ko")
        (3, 3)
        >>> name_length_range("ko", False)
        (2, 2)
        >>> name_length_range("en")
        (8, 16)
    """
    languages = NAME_LANGUAGES if language == "all" else (language,)
    low = NAME_LENGTH_MAX
    high = 0

    for code in languages:
        data = NAME_DATA[code]
        given, last, middle = data.length_spec.given, data.length_spec.last, data.length_spec.middle
        shortest, longest = given

        if include_surname:
            shortest += last[0]
            longest += last[1]

        if include_middle_name and data.has_middle:
            shortest += middle[0]
            longest += middle[1]

        low = min(low, shortest)
        high = max(high, longest)

    return (
        clamp(low, NAME_LENGTH_MIN, NAME_LENGTH_MAX),
        clamp(high, NAME_LENGTH_MIN, NAME_LENGTH_MAX),
    )
