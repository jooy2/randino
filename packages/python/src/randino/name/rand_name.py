"""Generating person names, as strings or as details."""

from typing import Literal, overload

from randino._types import (
    NameDetail,
    NameGenderOption,
    NameLanguageOption,
    NameScript,
    RandOutput,
)
from randino.name._generator import generate_name_details


@overload
def rand_name(
    *,
    language: NameLanguageOption = ...,
    gender: NameGenderOption = ...,
    count: int = ...,
    style: int = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    include_surname: bool = ...,
    include_middle_name: bool = ...,
    script: NameScript = ...,
    starts_with: str = ...,
    unique: bool = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_name(
    *,
    language: NameLanguageOption = ...,
    gender: NameGenderOption = ...,
    count: int = ...,
    style: int = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    include_surname: bool = ...,
    include_middle_name: bool = ...,
    script: NameScript = ...,
    starts_with: str = ...,
    unique: bool = ...,
    output: Literal["detail"],
) -> list[NameDetail]: ...


def rand_name(
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
    output: RandOutput = "value",
) -> list[str] | list[NameDetail]:
    """Generate natural-looking person names.

    Returns `count` names as a list of strings written in the script given by
    `script` — or, with `output="detail"`, a `NameDetail` per name, carrying both
    scripts at once along with the language and gender behind it.

    Args:
        language: Language of the generated names. `"all"` mixes every language.
        gender: Pool the given name is drawn from. `"all"` picks one per name.
        count: How many names to return. Held inside `0`..`RAND_COUNT_MAX`.
        style: `0` draws names people actually carry, `100` invents new ones, and
            values in between mix the two.
        min_length: Minimum length of the native form, in characters. Defaults to
            the language's own range.
        max_length: Maximum length of the native form, in characters. Defaults to
            the language's own range.
        include_surname: Include a surname.
        include_middle_name: Include a middle name, for languages that use one.
        script: Script of the returned strings. Ignored when `output` is
            `"detail"`, which carries both.
        starts_with: Keep only names whose native form starts with this character.
        unique: Never return the same name twice. May return fewer than `count`
            names when the pool runs out of combinations.
        output: `"value"` for strings, `"detail"` for a `NameDetail` per name.

    Returns:
        A `list[str]`, or a `list[NameDetail]` when `output="detail"` — the
        overloads carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_name()
        ['Emma Clover']
        >>> rand_name(language="ko", count=3)
        ['김민준', '이서연', '박지호']
        >>> rand_name(language="ko", script="roman")
        ['Kim Minjun']
        >>> rand_name(language="en", gender="female", include_middle_name=True)
        ['Grace Amelia Bennett']
        >>> rand_name(language="ko", output="detail")
        [NameDetail(native='김민준', roman='Kim Minjun', language='ko', gender='male')]
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

    if output == "detail":
        return details

    return [detail.roman if script == "roman" else detail.native for detail in details]
