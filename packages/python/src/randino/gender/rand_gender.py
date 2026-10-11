"""Genders for sample people, written the way a form in the language labels them."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import GenderDetail, WordLanguageOption
from randino.gender._generator import generate_gender_details


@overload
def rand_gender(
    *,
    language: WordLanguageOption = ...,
    count: int = ...,
    include_unknown: bool = ...,
    include_nonbinary: bool = ...,
    nonbinary_identity: bool = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_gender(
    *,
    language: WordLanguageOption = ...,
    count: int = ...,
    include_unknown: bool = ...,
    include_nonbinary: bool = ...,
    nonbinary_identity: bool = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[GenderDetail]: ...


def rand_gender(
    *,
    language: WordLanguageOption = "all",
    count: int = 1,
    include_unknown: bool = False,
    include_nonbinary: bool = False,
    nonbinary_identity: bool = False,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[GenderDetail]:
    """Generate genders for sample people, written the way a form in the language labels them.

    Male and female, evenly, by default. `include_unknown` adds a gender nobody stated, and
    `include_nonbinary` a third gender, much more rarely. `nonbinary_identity` writes that
    third gender as the identity a person names themselves by (`Genderfluid`, `Agender`)
    rather than as the option a form offers.

    Args:
        language: Language the labels are written in. `"all"` mixes every language.
        count: How many genders to return. Held inside `0`..`RAND_COUNT_MAX`.
        include_unknown: Answer `"unknown"` now and then, about one draw in eleven — a
            record whose gender was never stated.
        include_nonbinary: Answer `"nonbinary"` now and then, about one draw in a hundred.
        nonbinary_identity: Write `"nonbinary"` as the identity a person names themselves
            by (`Genderfluid`, `에이젠더`, `Nichtbinär`) rather than as the option a form
            offers (`Non-binary`, `Divers`). Ignored unless `include_nonbinary` is on.
        unique: Never return the same label twice. Returns fewer than `count` once the
            labels run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for labels, `"detail"` for a `GenderDetail` per gender — the
            label, the code behind it, its language and, with `nonbinary_identity`, the
            identity a `"nonbinary"` label writes.

    Returns:
        A `list[str]`, or a `list[GenderDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_gender(language="ko", count=3)
        ['여성', '남성', '여성']
        >>> rand_gender(language="en", include_unknown=True, count=3)
        ['Male', 'Unknown', 'Female']
        >>> rand_gender(language="en", include_nonbinary=True, nonbinary_identity=True)
        ['Genderqueer']
        >>> rand_gender(language="ko", output="detail")
        [GenderDetail(gender='여성', code='female', language='ko', identity=None)]
    """
    details = generate_gender_details(
        language=language,
        count=count,
        include_unknown=include_unknown,
        include_nonbinary=include_nonbinary,
        nonbinary_identity=nonbinary_identity,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    return [detail.gender for detail in details]
