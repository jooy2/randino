"""Generating person names with both scripts and the choices behind each one."""

from randino._types import NameDetail, NameGenderOption, NameLanguageOption
from randino.name._generator import generate_name_details


def random_name_details(
    *,
    language: NameLanguageOption = "all",
    gender: NameGenderOption = "all",
    count: int = 1,
    style: int = 0,
    min_length: int | None = None,
    max_length: int | None = None,
    include_surname: bool = True,
    include_middle_name: bool = False,
    starts_with: str = "",
    unique: bool = False,
) -> list[NameDetail]:
    """Generate person names with both scripts and the choices behind each one.

    Takes the same options as `random_name`, except `script` — every name is
    returned in its native form and romanized at the same time. Useful when the
    language is mixed (`"all"`), where `language` tells you what each name is, or
    when you want to show a name next to its English pronunciation.

    Example:
        >>> random_name_details(language="ko")
        [NameDetail(native='김민준', roman='Kim Minjun', language='ko', gender='male')]
    """
    return generate_name_details(
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
