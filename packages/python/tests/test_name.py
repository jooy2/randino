"""Person names.

Output is random by definition, so the tests assert the properties every name must
have — script, structure, length, requested prefix — over a sample large enough that
a broken option cannot pass by luck.
"""

import re
import unicodedata
from collections.abc import Callable
from typing import get_args

from randino import (
    NAME_LANGUAGES,
    RAND_COUNT_MAX,
    RAND_LENGTH_MAX,
    RAND_LENGTH_MIN,
    NameLanguage,
    RandRealism,
    name_length_range,
    name_supports_middle_name,
    name_supports_roman,
    rand_name,
)
from randino._internal.parse import NameToken

# Internal, so they get their own checks: everything else about a generated name is
# random, but romanization is a pure function with known answers, and the pools are
# what the tests below hold the generator to.
from randino.name._romanize import romanize_hangul
from randino.name.data import NAME_DATA
from randino.name.data._types import NamePool

SAMPLE = 60
# For the checks that have to see a pool's rarest entry rather than its typical one,
# where sixty draws would miss it.
WIDE = 400


def joined(name: str, letter: Callable[[str], bool]) -> bool:
    """A name is a single part, or several joined by a single space."""
    parts = name.split(" ")

    return all(part and all(letter(char) for char in part) for part in parts)


def script(name: str) -> Callable[[str], bool]:
    r"""Characters Unicode names as belonging to one script.

    Python's `re` has no `\p{Script=…}`, and the character database answers the same
    question without a third-party regex engine.
    """
    return lambda char: unicodedata.name(char, "").startswith(f"{name} ")


SCRIPT: dict[NameLanguage, Callable[[str], bool]] = {
    "en": lambda name: joined(name, lambda char: char.isascii() and char.isalpha()),
    "ko": lambda name: bool(re.fullmatch(r"[가-힣]+", name)),
    "ja": lambda name: bool(re.fullmatch(r"[々぀-ヿ一-鿿]+", name)),
    "zh": lambda name: bool(re.fullmatch(r"[々一-鿿]+", name)),
    "it": lambda name: joined(name, script("LATIN")),
    "de": lambda name: joined(name, script("LATIN")),
    "ru": lambda name: joined(name, script("CYRILLIC")),
    "es": lambda name: joined(name, script("LATIN")),
    "vi": lambda name: joined(name, script("LATIN")),
}


def roman(name: str) -> bool:
    """A romanized name is ASCII letters, in space-separated parts."""
    return joined(name, lambda char: char.isascii() and char.isalpha())


def native(item: str | NameToken) -> str:
    """The native form of a pool entry."""
    return item if isinstance(item, str) else item.n


def pool_natives(pool: NamePool) -> list[str]:
    """Every native form in a pool."""
    return [native(item) for item in pool]


def surname_of(language: NameLanguage, name: str) -> str:
    """The CJK surname a name starts with, longest first so 山田 wins over 山."""
    pool = sorted(pool_natives(NAME_DATA[language].last), key=len, reverse=True)

    return next((entry for entry in pool if name.startswith(entry)), "")


def test_rand_name_returns_one_name_by_default() -> None:
    names = rand_name()

    assert len(names) == 1
    assert isinstance(names[0], str)
    assert names[0]


def test_rand_name_returns_exactly_count_names() -> None:
    assert len(rand_name(count=25)) == 25
    assert len(rand_name(count=1)) == 1
    # Out-of-range counts are clamped rather than rejected.
    assert len(rand_name(count=0)) == 0
    assert len(rand_name(count=-10)) == 0
    # A fractional count is floored rather than raising, the way the npm package does.
    assert len(rand_name(count=2.7)) == 2  # type: ignore[call-overload]
    assert len(rand_name(count=RAND_COUNT_MAX + 500)) == RAND_COUNT_MAX


def test_every_language_writes_names_in_its_own_script() -> None:
    for language in NAME_LANGUAGES:
        for name in rand_name(language=language, count=SAMPLE):
            assert SCRIPT[language](name), f"{language}: {name}"


def test_the_mixed_language_uses_every_language_it_knows() -> None:
    used = set()

    for detail in rand_name(output="detail", count=600):
        assert SCRIPT[detail.language](detail.native), detail.native
        used.add(detail.language)

    assert used == set(NAME_LANGUAGES)


def test_script_roman_romanizes_every_language_into_ascii() -> None:
    for language in NAME_LANGUAGES:
        for name in rand_name(language=language, count=SAMPLE, script="roman"):
            assert roman(name), f"{language}: {name}"


def test_script_roman_leaves_english_names_as_they_are() -> None:
    for detail in rand_name(output="detail", language="en", count=SAMPLE):
        assert detail.native == detail.roman

    assert name_supports_roman("en") is False
    assert name_supports_roman("ko") is True


def test_korean_surnames_use_their_conventional_romanization() -> None:
    for detail in rand_name(output="detail", language="ko", count=SAMPLE, starts_with="김"):
        assert detail.native.startswith("김")
        assert detail.roman.startswith("Kim ")


def test_include_surname_adds_or_drops_the_family_name() -> None:
    # A generous length range keeps the generator from padding the name with extra
    # parts to reach a minimum length, which is what is being counted.
    spaced = {"min_length": 1, "max_length": 30, "count": SAMPLE}

    for name in rand_name(language="en", **spaced):  # type: ignore[call-overload]
        assert len(name.split(" ")) == 2, name

    for name in rand_name(language="en", include_surname=False, **spaced):  # type: ignore[call-overload]
        assert len(name.split(" ")) == 1, name

    # Korean writes one syllable of surname in front of one or two of given name.
    # Pinning the length is what makes the surname countable: at three syllables the
    # given name is two, and dropping the surname leaves two.
    for name in rand_name(language="ko", count=SAMPLE, min_length=3, max_length=3):
        assert len(name) == 3, name

    for name in rand_name(
        language="ko", count=SAMPLE, include_surname=False, min_length=2, max_length=2
    ):
        assert len(name) == 2, name


def test_include_middle_name_adds_one_where_the_language_has_one() -> None:
    names = rand_name(
        language="en", count=SAMPLE, include_middle_name=True, min_length=1, max_length=30
    )

    for name in names:
        assert len(name.split(" ")) == 3, name

    # Korean, Japanese and Chinese names have no middle part, so the option is ignored
    # instead of inventing one.
    assert name_supports_middle_name("ko") is False
    assert name_supports_middle_name("en") is True

    low, high = name_length_range("ko")

    for name in rand_name(language="ko", count=SAMPLE, include_middle_name=True):
        assert low <= len(name) <= high, name
        assert len(name.split(" ")) == 1, name


def test_gender_picks_the_pools_the_name_is_drawn_from() -> None:
    options = {"language": "ru", "min_length": 1, "max_length": 40, "count": SAMPLE}

    # Russian is the one language whose middle name and surname are inflected for
    # gender, which makes the choice verifiable.
    for name in rand_name(gender="male", include_middle_name=True, **options):  # type: ignore[call-overload]
        middle = name.split(" ")[1]
        assert middle.endswith("ич"), name

    for name in rand_name(gender="female", include_middle_name=True, **options):  # type: ignore[call-overload]
        _, middle, surname = name.split(" ")
        assert middle.endswith("на"), name
        assert surname.endswith("а"), name

    genders = {
        detail.gender
        for detail in rand_name(
            output="detail", language="ru", min_length=1, max_length=40, count=200
        )
    }
    assert genders == {"female", "male"}

    for detail in rand_name(output="detail", gender="female", **options):  # type: ignore[call-overload]
        assert detail.gender == "female"


def test_names_stay_inside_the_requested_length_range() -> None:
    ranges: list[tuple[NameLanguage, int, int]] = [
        ("ko", 3, 3),
        ("ko", 2, 2),
        ("ko", 5, 8),
        ("ja", 3, 5),
        ("zh", 2, 3),
        ("en", 8, 16),
        ("en", 20, 25),
        ("ru", 12, 20),
        ("vi", 5, 13),
    ]

    for language, low, high in ranges:
        for name in rand_name(language=language, min_length=low, max_length=high, count=SAMPLE):
            assert low <= len(name) <= high, f"{language} {low}-{high}: {name} ({len(name)})"


def test_the_default_range_is_what_the_pools_can_actually_produce() -> None:
    # `length_spec` is the one hand-written number in a language's dataset, and a
    # wrong one is silent: too narrow and the generator re-draws real names away, too
    # wide and it aims at lengths nothing can spell. `en` used to declare given names
    # of four to eight characters over a pool that runs from three to ten.
    def span_of(pool: NamePool) -> tuple[int, int]:
        lengths = [len(item if isinstance(item, str) else item.n) for item in pool]

        return min(lengths), max(lengths)

    for language in NAME_LANGUAGES:
        data = NAME_DATA[language]

        # Checked against the pools where the pools are the whole story. A CJK given
        # name is capped by its weight table as well — Japanese holds one-character
        # given names and never draws one — and a Russian surname comes out longer
        # than the pool entry it was feminized from.
        if data.given_len_weights is None:
            assert data.male is not None
            assert data.female is not None
            given = span_of((*data.male, *data.female))

            assert name_length_range(language, False) == given, language

            if data.roman != "translit":
                last = span_of(data.last)
                gap = len(data.joiner)

                assert name_length_range(language) == (
                    given[0] + last[0] + gap,
                    given[1] + last[1] + gap,
                ), language

        # And whatever is switched on, a draw let loose of the range still lands
        # inside the one the language declares.
        for include_middle_name in (False, True):
            low, high = name_length_range(language, True, include_middle_name)

            for name in rand_name(
                language=language,
                include_middle_name=include_middle_name,
                min_length=RAND_LENGTH_MIN,
                max_length=RAND_LENGTH_MAX,
                count=WIDE,
            ):
                assert low <= len(name) <= high, f"{language}: {name} ({len(name)})"


def test_a_maximum_the_pools_can_meet_is_never_overshot() -> None:
    # A range no draw landed inside used to be answered by padding the name with a
    # whole extra given name, so an exact ten characters came back as
    # `Rosemarie Gabriele`.
    ranges: list[tuple[NameLanguage, bool, int, int]] = [
        ("en", True, 7, 10),
        ("de", True, 8, 11),
        ("it", True, 8, 11),
        ("es", True, 7, 10),
        ("ru", True, 8, 11),
        ("vi", True, 4, 6),
        ("de", False, 10, 10),
        ("en", False, 8, 8),
        ("it", False, 10, 10),
    ]

    for realism in ("real", "mixed", "invented"):
        for language, include_surname, low, high in ranges:
            for name in rand_name(
                language=language,
                include_surname=include_surname,
                realism=realism,
                min_length=low,
                max_length=high,
                count=SAMPLE,
            ):
                assert len(name) <= high, f"{language} {realism} {low}-{high}: {name}"

    # A minimum no single given name can reach is where the padding used to fire.
    # Drawn names only: a syllable template can spell a longer word than any pool
    # holds, and one character over is then genuinely the closest the generator can
    # come.
    beyond: list[tuple[NameLanguage, int]] = [("en", 12), ("de", 12), ("it", 12), ("ru", 14)]

    for language, length in beyond:
        for name in rand_name(
            language=language,
            include_surname=False,
            min_length=length,
            max_length=length,
            count=SAMPLE,
        ):
            assert len(name) <= length, f"{language} {length}: {name}"


def test_an_exact_length_the_pools_hold_is_drawn_not_approached() -> None:
    # Twelve even draws will not turn up the one ten-character German given name by
    # chance. When they miss, each part is drawn from the lengths that can still land
    # inside the range instead.
    exact: list[tuple[NameLanguage, int]] = [
        ("de", 10),
        ("en", 8),
        ("it", 9),
        ("es", 9),
        ("ru", 10),
        ("vi", 5),
    ]

    for language, length in exact:
        for name in rand_name(
            language=language,
            include_surname=False,
            min_length=length,
            max_length=length,
            count=SAMPLE,
        ):
            assert len(name) == length, f"{language}: {name}"


def test_omitted_length_bounds_fall_back_to_the_language_default() -> None:
    assert name_length_range("ko") == (2, 3)
    assert name_length_range("ko", False) == (1, 2)
    assert name_length_range("en") == (7, 21)
    assert name_length_range("en", False) == (3, 10)
    assert name_length_range("en", True, True) == (11, 32)
    # A middle name the language does not have cannot widen the range.
    assert name_length_range("ko", True, True) == (2, 3)

    for language in NAME_LANGUAGES:
        low, high = name_length_range(language)

        for name in rand_name(language=language, count=SAMPLE):
            assert low <= len(name) <= high, f"{language}: {name}"


def test_starts_with_leads_every_name_with_the_requested_character() -> None:
    for name in rand_name(language="en", count=SAMPLE, starts_with="k"):
        assert name[0] in "Kk", name

    for name in rand_name(language="ko", count=SAMPLE, starts_with="김"):
        assert name.startswith("김"), name

    # The character leads the given name when there is no surname to lead with.
    for name in rand_name(language="ko", count=SAMPLE, include_surname=False, starts_with="김"):
        assert name.startswith("김"), name

    # A letter no real name starts with is answered with an invented name rather than
    # an empty result.
    for name in rand_name(language="en", count=SAMPLE, starts_with="Q"):
        assert name.startswith("Q"), name
        assert roman(name), name

    # Only the first character of a longer string is used.
    for name in rand_name(language="en", count=10, starts_with="Beck"):
        assert name.startswith("B"), name


def test_realism_invents_names_without_breaking_the_script_or_the_structure() -> None:
    for realism in get_args(RandRealism):
        for language in NAME_LANGUAGES:
            for name in rand_name(language=language, realism=realism, count=20):
                assert SCRIPT[language](name), f"{language} @ {realism}: {name}"

    # The abstract end should mostly leave the curated pools behind.
    realistic = set(rand_name(language="en", realism="real", count=400))
    abstract = rand_name(language="en", realism="invented", count=100)
    overlap = sum(1 for name in abstract if name in realistic)

    assert overlap < 10, f"too many invented names look curated: {overlap}"


def test_realism_real_stays_inside_the_curated_pools() -> None:
    # The realistic end promises names people actually carry, so a rolled given name
    # length the pool cannot serve has to be re-rolled rather than invented. Ranges
    # here are ones the pools can satisfy; asking for a length no real name has (a
    # three-syllable Korean given name) is a different request.
    cases: list[tuple[NameLanguage, dict[str, int]]] = [
        ("ko", {}),
        ("ko", {"min_length": 2, "max_length": 5}),
        ("ja", {}),
        ("zh", {}),
        ("zh", {"min_length": 2, "max_length": 3}),
    ]

    for language, bounds in cases:
        data = NAME_DATA[language]
        assert data.given_male is not None and data.given_female is not None
        given = set(pool_natives(data.given_male) + pool_natives(data.given_female))

        for name in rand_name(language=language, realism="real", count=300, **bounds):  # type: ignore[call-overload]
            surname = surname_of(language, name)

            assert surname, f"{language}: no curated surname leads {name}"
            assert name[len(surname) :] in given, (
                f"{language} @ {bounds}: {name} is not a curated name"
            )


def test_surnames_follow_the_frequency_table_of_the_languages_that_have_one() -> None:
    # A table entry that no longer matches the pool silently degrades to the default
    # weight, which reads as "the weighting stopped working".
    for language in NAME_LANGUAGES:
        data = NAME_DATA[language]

        if data.last_weights is None:
            continue

        pool = set(pool_natives(data.last))

        for surname in data.last_weights:
            assert surname in pool, f"{language}: {surname} is weighted but not in the pool"

    # Shares the table aims for: 김 ~23%, Nguyễn ~41%, 王 ~11%. The thresholds sit far
    # enough below to be unreachable by chance, and an even draw over the pool (1.3% /
    # 3.3% / 2.2%) cannot come near any of them.
    def share(language: NameLanguage, surname: str) -> float:
        names = rand_name(language=language, realism="real", count=2000)

        return sum(1 for name in names if name.startswith(surname)) / len(names)

    assert share("ko", "김") > 0.12, "Korean surnames are not weighted"
    assert share("vi", "Nguyễn") > 0.25, "Vietnamese surnames are not weighted"
    assert share("zh", "王") > 0.05, "Chinese surnames are not weighted"


def test_unique_never_repeats_a_name() -> None:
    names = rand_name(language="ko", count=400, unique=True)

    assert len(set(names)) == len(names)
    # Korean given names are a closed pool, so a request this large runs out of
    # combinations and returns fewer names instead of looping forever. Keep the count
    # comfortably above the pool, or growing the pool turns this into a failure that
    # reads like a bug in `unique`.
    limited = rand_name(language="ko", count=800, unique=True, include_surname=False)

    assert len(set(limited)) == len(limited)
    assert len(limited) < 800, f"expected the pool to run out: {len(limited)}"


def test_output_detail_reports_both_scripts_and_the_choices_made() -> None:
    # Written out rather than going through the helper, so that the overload
    # itself is what a type checker sees.
    for detail in rand_name(language="ja", count=SAMPLE, output="detail"):
        assert detail.language == "ja"
        assert SCRIPT["ja"](detail.native), detail.native
        assert roman(detail.roman), detail.roman
        assert detail.gender in ("male", "female")


def test_romanize_hangul_follows_the_revised_romanization_of_korean() -> None:
    cases = [
        ("민준", "minjun"),
        ("서연", "seoyeon"),
        ("하은", "haeun"),
        ("한결", "hangyeol"),
        ("지훈", "jihun"),
        ("슬기", "seulgi"),
        ("별", "byeol"),
        ("다온", "daon"),
        ("하람", "haram"),
        ("광수", "gwangsu"),
        ("혜진", "hyejin"),
        ("아름", "areum"),
        ("하늘", "haneul"),
        ("채원", "chaewon"),
        ("지율", "jiyul"),
        ("영희", "yeonghui"),
        # A final consonant in front of a vowel moves into the next syllable.
        ("은우", "eunu"),
        ("백은", "baegeun"),
        # Sound changes between syllables.
        ("석민", "seongmin"),
        ("성록", "seongnok"),
        ("슬나", "seulla"),
        ("좋고", "joko"),
        # Anything that is not a composed syllable is passed through.
        ("Kim 민준", "Kim minjun"),
    ]

    for hangul, expected in cases:
        assert romanize_hangul(hangul) == expected, hangul
