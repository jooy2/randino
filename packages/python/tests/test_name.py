"""Person names.

Output is random by definition, so the tests assert the properties every name must
have — script, structure, length, requested prefix — over a sample large enough that
a broken option cannot pass by luck.
"""

import re
import unicodedata
from collections.abc import Callable

from randino import (
    NAME_COUNT_MAX,
    NAME_LANGUAGES,
    NameLanguage,
    name_length_range,
    name_supports_middle_name,
    name_supports_roman,
    random_name,
    random_name_details,
)
from randino._internal.parse import NameToken

# Internal, so they get their own checks: everything else about a generated name is
# random, but romanization is a pure function with known answers, and the pools are
# what the tests below hold the generator to.
from randino.name._romanize import romanize_hangul
from randino.name.data import NAME_DATA
from randino.name.data._types import NamePool

SAMPLE = 60


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


def test_random_name_returns_one_name_by_default() -> None:
    names = random_name()

    assert len(names) == 1
    assert isinstance(names[0], str)
    assert names[0]


def test_random_name_returns_exactly_count_names() -> None:
    assert len(random_name(count=25)) == 25
    assert len(random_name(count=1)) == 1
    # Out-of-range counts are clamped rather than rejected.
    assert len(random_name(count=0)) == 0
    assert len(random_name(count=-10)) == 0
    # A fractional count is floored rather than raising, the way the npm package does.
    assert len(random_name(count=2.7)) == 2  # type: ignore[arg-type]
    assert len(random_name(count=NAME_COUNT_MAX + 500)) == NAME_COUNT_MAX


def test_every_language_writes_names_in_its_own_script() -> None:
    for language in NAME_LANGUAGES:
        for name in random_name(language=language, count=SAMPLE):
            assert SCRIPT[language](name), f"{language}: {name}"


def test_the_mixed_language_uses_every_language_it_knows() -> None:
    used = set()

    for detail in random_name_details(count=600):
        assert SCRIPT[detail.language](detail.native), detail.native
        used.add(detail.language)

    assert used == set(NAME_LANGUAGES)


def test_script_roman_romanizes_every_language_into_ascii() -> None:
    for language in NAME_LANGUAGES:
        for name in random_name(language=language, count=SAMPLE, script="roman"):
            assert roman(name), f"{language}: {name}"


def test_script_roman_leaves_english_names_as_they_are() -> None:
    for detail in random_name_details(language="en", count=SAMPLE):
        assert detail.native == detail.roman

    assert name_supports_roman("en") is False
    assert name_supports_roman("ko") is True


def test_korean_surnames_use_their_conventional_romanization() -> None:
    for detail in random_name_details(language="ko", count=SAMPLE, starts_with="김"):
        assert detail.native.startswith("김")
        assert detail.roman.startswith("Kim ")


def test_include_surname_adds_or_drops_the_family_name() -> None:
    # A generous length range keeps the generator from padding the name with extra
    # parts to reach a minimum length, which is what is being counted.
    spaced = {"min_length": 1, "max_length": 30, "count": SAMPLE}

    for name in random_name(language="en", **spaced):  # type: ignore[arg-type]
        assert len(name.split(" ")) == 2, name

    for name in random_name(language="en", include_surname=False, **spaced):  # type: ignore[arg-type]
        assert len(name.split(" ")) == 1, name

    # Korean keeps its own default range: one syllable of surname plus two of given name.
    for name in random_name(language="ko", count=SAMPLE):
        assert len(name) == 3, name

    for name in random_name(language="ko", count=SAMPLE, include_surname=False):
        assert len(name) == 2, name


def test_include_middle_name_adds_one_where_the_language_has_one() -> None:
    names = random_name(
        language="en", count=SAMPLE, include_middle_name=True, min_length=1, max_length=30
    )

    for name in names:
        assert len(name.split(" ")) == 3, name

    # Korean, Japanese and Chinese names have no middle part, so the option is ignored
    # instead of inventing one.
    assert name_supports_middle_name("ko") is False
    assert name_supports_middle_name("en") is True

    for name in random_name(language="ko", count=SAMPLE, include_middle_name=True):
        assert len(name) == 3, name


def test_gender_picks_the_pools_the_name_is_drawn_from() -> None:
    options = {"language": "ru", "min_length": 1, "max_length": 40, "count": SAMPLE}

    # Russian is the one language whose middle name and surname are inflected for
    # gender, which makes the choice verifiable.
    for name in random_name(gender="male", include_middle_name=True, **options):  # type: ignore[arg-type]
        middle = name.split(" ")[1]
        assert middle.endswith("ич"), name

    for name in random_name(gender="female", include_middle_name=True, **options):  # type: ignore[arg-type]
        _, middle, surname = name.split(" ")
        assert middle.endswith("на"), name
        assert surname.endswith("а"), name

    genders = {
        detail.gender
        for detail in random_name_details(language="ru", min_length=1, max_length=40, count=200)
    }
    assert genders == {"female", "male"}

    for detail in random_name_details(gender="female", **options):  # type: ignore[arg-type]
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
        for name in random_name(language=language, min_length=low, max_length=high, count=SAMPLE):
            assert low <= len(name) <= high, f"{language} {low}-{high}: {name} ({len(name)})"


def test_omitted_length_bounds_fall_back_to_the_language_default() -> None:
    assert name_length_range("ko") == (3, 3)
    assert name_length_range("ko", False) == (2, 2)
    assert name_length_range("en") == (8, 16)
    assert name_length_range("en", False) == (4, 8)
    assert name_length_range("en", True, True) == (12, 24)
    # A middle name the language does not have cannot widen the range.
    assert name_length_range("ko", True, True) == (3, 3)

    for language in NAME_LANGUAGES:
        low, high = name_length_range(language)

        for name in random_name(language=language, count=SAMPLE):
            assert low <= len(name) <= high, f"{language}: {name}"


def test_starts_with_leads_every_name_with_the_requested_character() -> None:
    for name in random_name(language="en", count=SAMPLE, starts_with="k"):
        assert name[0] in "Kk", name

    for name in random_name(language="ko", count=SAMPLE, starts_with="김"):
        assert name.startswith("김"), name

    # The character leads the given name when there is no surname to lead with.
    for name in random_name(language="ko", count=SAMPLE, include_surname=False, starts_with="김"):
        assert name.startswith("김"), name

    # A letter no real name starts with is answered with an invented name rather than
    # an empty result.
    for name in random_name(language="en", count=SAMPLE, starts_with="Q"):
        assert name.startswith("Q"), name
        assert roman(name), name

    # Only the first character of a longer string is used.
    for name in random_name(language="en", count=10, starts_with="Beck"):
        assert name.startswith("B"), name


def test_style_invents_names_without_breaking_the_script_or_the_structure() -> None:
    for style in (0, 50, 100, -20, 500):
        for language in NAME_LANGUAGES:
            for name in random_name(language=language, style=style, count=20):
                assert SCRIPT[language](name), f"{language} @ {style}: {name}"

    # The abstract end should mostly leave the curated pools behind.
    realistic = set(random_name(language="en", style=0, count=400))
    abstract = random_name(language="en", style=100, count=100)
    overlap = sum(1 for name in abstract if name in realistic)

    assert overlap < 10, f"too many invented names look curated: {overlap}"


def test_style_zero_stays_inside_the_curated_pools() -> None:
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

        for name in random_name(language=language, style=0, count=300, **bounds):  # type: ignore[arg-type]
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
        names = random_name(language=language, style=0, count=2000)

        return sum(1 for name in names if name.startswith(surname)) / len(names)

    assert share("ko", "김") > 0.12, "Korean surnames are not weighted"
    assert share("vi", "Nguyễn") > 0.25, "Vietnamese surnames are not weighted"
    assert share("zh", "王") > 0.05, "Chinese surnames are not weighted"


def test_unique_never_repeats_a_name() -> None:
    names = random_name(language="ko", count=400, unique=True)

    assert len(set(names)) == len(names)
    # Korean given names are a closed pool, so a request this large runs out of
    # combinations and returns fewer names instead of looping forever. Keep the count
    # comfortably above the pool, or growing the pool turns this into a failure that
    # reads like a bug in `unique`.
    limited = random_name(language="ko", count=800, unique=True, include_surname=False)

    assert len(set(limited)) == len(limited)
    assert len(limited) < 800, f"expected the pool to run out: {len(limited)}"


def test_random_name_details_reports_both_scripts_and_the_choices_made() -> None:
    for detail in random_name_details(language="ja", count=SAMPLE):
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
