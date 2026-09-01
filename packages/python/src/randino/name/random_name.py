"""Generating person names as plain strings."""

from randino._types import (
    NameDetail,
    NameGenderOption,
    NameLanguageOption,
    NameScript,
)
from randino.name._generator import generate_name_details


def random_name(
    *,
    language: NameLanguageOption = "all",
    gender: NameGenderOption = "all",
    count: int = 1,
    style: int = 0,
    min_length: int | None = None,
    max_length: int | None = None,
    include_surname: bool = True,
    include_middle_name: bool = False,
    script: NameScript = "native",
    starts_with: str = "",
    unique: bool = False,
) -> list[str]:
    """Generate natural-looking person names.

    Returns `count` names as a list of strings, written in the script given by
    `script`. Use `random_name_details` to get the native and romanized form of each
    name together.

    Args:
        language: Language of the generated names. `"all"` mixes every language.
        gender: Pool the given name is drawn from. `"all"` picks one per name.
        count: How many names to return. Held inside `0`..`NAME_COUNT_MAX`.
        style: `0` draws names people actually carry, `100` invents new ones, and
            values in between mix the two.
        min_length: Minimum length of the native form, in characters. Defaults to
            the language's own range.
        max_length: Maximum length of the native form, in characters. Defaults to
            the language's own range.
        include_surname: Include a surname.
        include_middle_name: Include a middle name, for languages that use one.
        script: Script of the returned strings.
        starts_with: Keep only names whose native form starts with this character.
        unique: Never return the same name twice. May return fewer than `count`
            names when the pool runs out of combinations.

    Example:
        >>> random_name()
        ['Emma Clover']
        >>> random_name(language="ko", count=3)
        ['김민준', '이서연', '박지호']
        >>> random_name(language="ko", script="roman")
        ['Kim Minjun']
        >>> random_name(language="en", gender="female", include_middle_name=True)
        ['Grace Amelia Bennett']
    """
    details: list[NameDetail] = generate_name_details(
        language=language,
        gender=gender,
        count=count,
        style=style,
        min_length=min_length,
        max_length=max_length,
        include_surname=include_surname,
        include_middle_name=include_middle_name,
        starts_with=starts_with,
        unique=unique,
    )

    return [detail.roman if script == "roman" else detail.native for detail in details]
