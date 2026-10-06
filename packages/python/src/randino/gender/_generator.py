"""The gender generator: one of two codes, or of four, and the label a form writes for it."""

from collections.abc import Callable

from randino._internal.generate import collect
from randino._internal.utils import pick, pick_weighted, with_random
from randino._types import GenderDetail, WordLanguage, WordLanguageOption
from randino.gender.data import GENDER_CODES, GENDER_LABELS, GENDER_WEIGHTS
from randino.word.data import WORD_LANGUAGES, resolve_word_language


def generate_gender_details(
    *,
    language: WordLanguageOption = "all",
    count: int = 1,
    include_unknown: bool = False,
    include_nonbinary: bool = False,
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

    def draw() -> GenderDetail:
        code = pick_weighted(codes, lambda each: GENDER_WEIGHTS[each])
        drawn = pick(languages)

        return GenderDetail(gender=GENDER_LABELS[drawn][code], code=code, language=drawn)

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.gender,
        )
