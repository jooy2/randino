"""The natural length range of a full name."""

from randino._internal.utils import clamp
from randino._types import NameLanguageOption
from randino.constants import RAND_LENGTH_MAX, RAND_LENGTH_MIN
from randino.name.data import NAME_DATA, NAME_LANGUAGES


def name_length_range(
    language: NameLanguageOption = "all",
    include_surname: bool = True,
    include_middle_name: bool = False,
) -> tuple[int, int]:
    """Natural length range of a full name, in characters of the native form.

    This is what `rand_name` falls back to when `min_length` or `max_length` is
    omitted, and it describes only the parts that are switched on — so leaving the
    surname out relaxes the range instead of forcing the given name to stretch and
    fill it.

    Example:
        >>> name_length_range("ko")
        (2, 3)
        >>> name_length_range("ko", False)
        (1, 2)
        >>> name_length_range("en")
        (7, 21)
    """
    languages = NAME_LANGUAGES if language == "all" else (language,)
    low = RAND_LENGTH_MAX
    high = 0

    for code in languages:
        data = NAME_DATA[code]
        given, last, middle = data.length_spec.given, data.length_spec.last, data.length_spec.middle
        shortest, longest = given

        # Each part beyond the first brings the joiner with it: one space for the
        # space-separated scripts, nothing for CJK.
        if include_surname:
            shortest += last[0] + len(data.joiner)
            longest += last[1] + len(data.joiner)

        if include_middle_name and data.has_middle:
            shortest += middle[0] + len(data.joiner)
            longest += middle[1] + len(data.joiner)

        low = min(low, shortest)
        high = max(high, longest)

    return (
        clamp(low, RAND_LENGTH_MIN, RAND_LENGTH_MAX),
        clamp(high, RAND_LENGTH_MIN, RAND_LENGTH_MAX),
    )
