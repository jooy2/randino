"""The gender generator: one of two codes, or of four, and the label a form writes for it.

With `nonbinary_identity` on, a `nonbinary` gender is written as the identity a person names
themselves by instead.
"""

from collections.abc import Callable

from randino._internal.generate import collect_from
from randino._internal.utils import shares, with_random
from randino._types import (
    GenderCode,
    GenderDetail,
    NonbinaryIdentity,
    WordLanguage,
    WordLanguageOption,
)
from randino.gender.data import (
    GENDER_CODES,
    GENDER_LABELS,
    GENDER_WEIGHTS,
    NONBINARY_IDENTITIES,
    NONBINARY_LABELS,
    NONBINARY_WEIGHTS,
)
from randino.word.data import WORD_LANGUAGES, resolve_word_language


def generate_gender_details(
    *,
    language: WordLanguageOption = "all",
    count: int = 1,
    include_unknown: bool = False,
    include_nonbinary: bool = False,
    nonbinary_identity: bool = False,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[GenderDetail]:
    """Generate `count` genders, applied to every option."""
    resolved = resolve_word_language(language)
    languages: tuple[WordLanguage, ...] = WORD_LANGUAGES if resolved == "all" else (resolved,)
    # The two that are always on, and whichever of the others the call asked for. `is
    # True` rather than truthiness, the way the npm package reads them: a value the type
    # rules out does not switch a code on.
    codes = [
        code
        for code in GENDER_CODES
        if (code != "unknown" or include_unknown is True)
        and (code != "nonbinary" or include_nonbinary is True)
    ]
    identity = nonbinary_identity is True

    # The code by its weight, the language evenly, and for `nonbinary` with the option on,
    # the identity by its own weight.
    identity_shares = shares(NONBINARY_IDENTITIES, lambda each: NONBINARY_WEIGHTS[each])
    outcomes: list[tuple[tuple[GenderCode, WordLanguage, NonbinaryIdentity | None], float]] = []

    for code, share in zip(codes, shares(codes, lambda each: GENDER_WEIGHTS[each]), strict=True):
        forms: list[tuple[NonbinaryIdentity | None, float]] = (
            list(zip(NONBINARY_IDENTITIES, identity_shares, strict=True))
            if code == "nonbinary" and identity
            else [(None, 1.0)]
        )

        for drawn in languages:
            for named, form_share in forms:
                outcomes.append(((code, drawn, named), share * form_share / len(languages)))

    def label(entry: tuple[GenderCode, WordLanguage, NonbinaryIdentity | None]) -> str:
        code, drawn, named = entry

        return GENDER_LABELS[drawn][code] if named is None else NONBINARY_LABELS[drawn][named]

    with with_random(random):
        return collect_from(
            count=count,
            unique=unique,
            starts_with="",
            outcomes=outcomes,
            key_of=label,
            build=lambda entry: GenderDetail(
                gender=label(entry), code=entry[0], language=entry[1], identity=entry[2]
            ),
        )
