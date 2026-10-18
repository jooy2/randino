"""Fictional names and places: spelled in Latin letters first, written by their sound elsewhere.

The walk over every word the shapes can invent, against the real countries, the famous
fictional names and the obscenities, is the JavaScript suite's: the tables are generated
from the same source, and `tools/parity` keeps the copies identical.
"""

import re
from collections.abc import Callable
from typing import Any, cast, get_args

from randino import (
    RAND_COUNT_MAX,
    WORD_LANGUAGES,
    FictionalKindStyle,
    FictionalPlaceDetail,
    FictionalPlaceKind,
    LocationLevel,
    NameGender,
    RandRealism,
    WordLanguage,
    rand_fictional_city,
    rand_fictional_country,
    rand_fictional_district,
    rand_fictional_name,
    rand_fictional_region,
)

# The datasets are internal, but a name is only well formed if it is spelled out of them —
# these are what tie the output back to them.
from randino._internal.table import rows
from randino.fictional._pools import pools
from randino.fictional._spelling import Spelling, join_parts, joinable, spelled_rows
from randino.fictional.data import (
    FICTIONAL_COMPOUNDS,
    FICTIONAL_GIVEN_NAMES,
    FICTIONAL_KINDS,
    FICTIONAL_PLACE_ENDINGS,
    FICTIONAL_PLACES,
    FICTIONAL_SURNAMES,
    FICTIONAL_SYLLABLES,
)

SAMPLE = 60

PLACES: dict[LocationLevel, Callable[..., list[str]]] = {
    "country": rand_fictional_country,
    "region": rand_fictional_region,
    "city": rand_fictional_city,
    "district": rand_fictional_district,
}

LEVELS: tuple[LocationLevel, ...] = ("country", "region", "city", "district")

KIND_STYLES: tuple[FictionalKindStyle | None, ...] = (None, "borrowed", "translated")


def place_details(level: LocationLevel, **options: Any) -> list[FictionalPlaceDetail]:
    """The detail form of a level's generator."""
    generate = cast(Callable[..., list[FictionalPlaceDetail]], PLACES[level])

    return generate(output="detail", **options)


def place_forms(level: LocationLevel, **options: Any) -> list[dict[WordLanguage, str]]:
    """The list form of a level's generator: one dict per place, keyed by language."""
    generate = cast(Callable[..., list[dict[WordLanguage, str]]], PLACES[level])

    return generate(**options)


def seeded(seed: int = 7) -> Callable[[], float]:
    """A source that makes the same draws every time it is made, for comparing two calls."""
    state = seed

    def draw() -> float:
        nonlocal state
        state = (state * 48271) % 2147483647

        return state / 2147483647

    return draw


# What a whole fictional name or place may hold, per language: the script, and the joiners
# and marks that script writes between and inside names.
SCRIPT: dict[WordLanguage, re.Pattern[str]] = {
    "en": re.compile(r"[A-Za-z' -]+"),
    "vi": re.compile(r"[A-Za-zÀ-ỹ' -]+"),
    "es": re.compile(r"[A-Za-zÁÉÍÓÚáéíóúñÑü' -]+"),
    "it": re.compile(r"[A-Za-zÀ-ÿ' -]+"),
    "de": re.compile(r"[A-Za-zÄÖÜäöüß' -]+"),
    "ko": re.compile(r"[가-힣 ]+"),
    "ja": re.compile(r"[ぁ-ゖァ-ヶー・一-龯]+"),
    "zh": re.compile(r"[一-鿿·]+"),
    "ru": re.compile(r"[А-Яа-яЁё -]+"),
}

# The column each script is in, and the pattern every spelling in it matches.
SPELLING: tuple[re.Pattern[str], ...] = (
    re.compile(r"[A-Za-z]+"),
    re.compile(r"[가-힣]+"),
    re.compile(r"[ァ-ヶー]+"),
    re.compile(r"[一-鿿]+"),
    re.compile(r"[А-Яа-яЁё]+"),
)

LATIN_LANGUAGES: tuple[WordLanguage, ...] = ("en", "vi", "es", "it", "de")

KINDS = rows(FICTIONAL_KINDS)

KIND_OF = {cells[0]: cells for cells in KINDS}

LETTER: dict[LocationLevel, str] = {"country": "n", "region": "r", "city": "c", "district": "d"}

# The column of each language's templates, borrowed then translated.
COLUMN: dict[WordLanguage, tuple[int, int]] = {
    "en": (3, 3),
    "ko": (4, 5),
    "ja": (6, 7),
    "zh": (8, 8),
    "ru": (9, 10),
    "vi": (3, 11),
    "es": (3, 12),
    "it": (3, 13),
    "de": (3, 14),
}


def latin_of(pool: tuple[Spelling, ...]) -> set[str]:
    """The Latin spellings of a pool."""
    return {entry[0] for entry in pool}


# Names


def test_rand_fictional_name_returns_exactly_count_names_one_by_default() -> None:
    assert len(rand_fictional_name()) == 1

    for count in (0, 1, 7, 25):
        assert len(rand_fictional_name(count=count)) == count

    assert rand_fictional_name(count=-3) == []
    assert len(rand_fictional_name(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_writes_each_name_in_its_language_s_own_script() -> None:
    realisms: tuple[RandRealism, ...] = ("real", "invented")

    for language in WORD_LANGUAGES:
        for realism in realisms:
            for name in rand_fictional_name(
                language=language, realism=realism, include_surname=True, count=SAMPLE
            ):
                assert SCRIPT[language].fullmatch(name), (language, name)


def test_writes_a_name_in_latin_letters_the_same_way_in_every_language_that_uses_them() -> None:
    for detail in rand_fictional_name(
        language="all", include_surname=True, realism="mixed", count=SAMPLE, output="detail"
    ):
        for language in LATIN_LANGUAGES:
            assert detail.forms[language] == detail.forms["en"]


def test_a_list_returns_every_name_in_every_language_of_it_keyed_in_the_order_asked() -> None:
    asked: list[WordLanguage] = ["ru", "ko", "en", "ja"]
    forms = rand_fictional_name(language=asked, include_surname=True, count=SAMPLE)

    assert len(forms) == SAMPLE

    for form in forms:
        assert list(form) == asked

        for language in asked:
            assert SCRIPT[language].fullmatch(form[language]), (language, form[language])

    # A tuple is a list too.
    assert list(rand_fictional_name(language=("ja", "en"))[0]) == ["ja", "en"]

    # The detail is the same, drawn in the first language of the list.
    for detail in rand_fictional_name(language=asked, count=SAMPLE, output="detail"):
        assert list(detail.forms) == asked
        assert detail.language == "ru"
        assert detail.name == detail.forms["ru"]

    # One language, and `"all"`, are strings, and `"all"` draws a language per name.
    seen: set[WordLanguage] = set()

    for detail in rand_fictional_name(count=SAMPLE, output="detail"):
        assert list(detail.forms) == list(WORD_LANGUAGES)
        assert detail.name == detail.forms[detail.language]
        seen.add(detail.language)

    assert len(seen) > 1
    assert all(isinstance(name, str) for name in rand_fictional_name(count=5))
    assert all(isinstance(name, str) for name in rand_fictional_name(language="ko", count=5))
    assert list(rand_fictional_name(language="ko", output="detail")[0].forms) == ["ko"]


def test_reads_an_unknown_or_empty_language_list_as_every_language_and_a_repeated_one_once() -> (
    None
):
    loose: Any = rand_fictional_name

    assert list(rand_fictional_name(language=[])[0]) == list(WORD_LANGUAGES)
    assert list(loose(language="xx", output="detail")[0].forms) == list(WORD_LANGUAGES)
    assert list(loose(language=[None, "xx"])[0]) == list(WORD_LANGUAGES)
    assert list(rand_fictional_name(language=["ko", "ko", "en"])[0]) == ["ko", "en"]


def test_real_draws_given_names_and_surnames_from_the_pools_of_the_right_gender() -> None:
    data = pools()
    male = latin_of(data.given["male"])
    female = latin_of(data.given["female"])
    family = latin_of(data.surnames)

    genders: tuple[tuple[NameGender, set[str]], ...] = (("male", male), ("female", female))

    for gender, given in genders:
        for detail in rand_fictional_name(
            language="en", gender=gender, include_surname=True, count=SAMPLE, output="detail"
        ):
            first, last = detail.name.split(" ")

            assert detail.gender == gender
            assert first in given, first
            assert last in family, last


def test_writes_a_surname_apart_from_the_given_name_the_way_each_script_does() -> None:
    joiners: dict[str, str] = {"ja": "・", "zh": "·"}

    for language in WORD_LANGUAGES:
        joiner = joiners.get(language, " ")

        for name in rand_fictional_name(language=language, include_surname=True, count=SAMPLE):
            assert len(name.split(joiner)) == 2, name

        for name in rand_fictional_name(language=language, count=SAMPLE):
            assert joiner not in name, name


def test_starts_with_is_the_first_character_in_the_language_the_name_is_written_in() -> None:
    asked: tuple[tuple[WordLanguage, str], ...] = (
        ("en", "A"),
        ("ko", "아"),
        ("ru", "Э"),
        ("zh", "阿"),
    )
    realisms: tuple[RandRealism, ...] = ("real", "mixed", "invented")

    for language, prefix in asked:
        for realism in realisms:
            names = rand_fictional_name(
                language=language, starts_with=prefix, realism=realism, count=SAMPLE
            )

            assert len(names) == SAMPLE

            for name in names:
                assert name.startswith(prefix), (language, realism, name)

    # Japanese spells a made-up name in katakana, so a hiragana prefix is read as one.
    for name in rand_fictional_name(language="ja", starts_with="あ", count=SAMPLE):
        assert name.startswith("ア"), name

    # A character no language writes is answered with nothing.
    assert rand_fictional_name(starts_with="!", count=3) == []

    # A language that does not write it is left out of `"all"`.
    for detail in rand_fictional_name(starts_with="B", count=SAMPLE, output="detail"):
        assert detail.language in LATIN_LANGUAGES, detail.language

    # A list is read in its first language, and the rest only write the name.
    for form in rand_fictional_name(language=["ko", "en"], starts_with="아", count=SAMPLE):
        assert form["ko"].startswith("아"), form["ko"]

    assert rand_fictional_name(language=["ko", "en"], starts_with="B", count=3) == []


def test_a_name_keeps_to_a_length_range_the_pools_can_meet() -> None:
    for language in WORD_LANGUAGES:
        for name in rand_fictional_name(
            language=language, min_length=4, max_length=6, count=SAMPLE
        ):
            assert 4 <= len(name) <= 6, (language, name)

    for name in rand_fictional_name(include_surname=True, min_length=18, count=SAMPLE):
        assert len(name) >= 18, name

    # Only the CJK languages write a name of two characters.
    for detail in rand_fictional_name(max_length=2, count=SAMPLE, output="detail"):
        assert len(detail.name) <= 2, detail.name

    # A list is measured in its first language, whatever the rest come out at.
    for form in rand_fictional_name(language=["ko", "en"], max_length=2, count=SAMPLE):
        assert len(form["ko"]) <= 2, form["ko"]


def test_unique_never_returns_the_same_name_twice_in_any_language() -> None:
    details = rand_fictional_name(language=["en", "ko"], unique=True, count=500, output="detail")
    keys = [detail.forms["en"] for detail in details]

    assert len(set(keys)) == len(keys)
    # The pools hold fewer than five hundred, so it stops when they run out.
    assert len(details) == len(pools().given["male"]) + len(pools().given["female"])


def test_a_seeded_source_draws_the_same_names_twice() -> None:
    def draw() -> list[str]:
        return rand_fictional_name(count=20, realism="mixed", include_surname=True, random=seeded())

    assert draw() == draw()


# Places


def test_returns_exactly_count_places_on_every_level() -> None:
    for level in LEVELS:
        assert len(PLACES[level]()) == 1
        assert len(PLACES[level](count=9)) == 9
        assert PLACES[level](count=-1) == []


def test_a_list_returns_every_place_in_every_language_of_it_keyed_in_the_order_asked() -> None:
    asked: list[WordLanguage] = ["zh", "ko", "es", "en"]

    for level in LEVELS:
        forms = place_forms(level, language=asked, include_kind=True, count=SAMPLE)

        assert len(forms) == SAMPLE

        for form in forms:
            assert list(form) == asked

            for language in asked:
                assert SCRIPT[language].fullmatch(form[language]), (level, language, form)

        for detail in place_details(level, language=asked, count=SAMPLE):
            assert detail.language == "zh"
            assert detail.place == detail.forms["zh"]

    # The functions' own types follow the list: `form["ko"]` is a string.
    form = rand_fictional_district(language=["ko", "en"])[0]

    assert isinstance(form["ko"], str)
    assert isinstance(form["en"], str)
    assert isinstance(rand_fictional_country(language=("ko", "en"))[0]["en"], str)
    assert isinstance(rand_fictional_region(language=["ko"])[0]["ko"], str)
    assert isinstance(rand_fictional_city(language=["ru", "en"])[0]["ru"], str)


def test_writes_each_place_in_its_language_s_own_script() -> None:
    for level in LEVELS:
        for language in WORD_LANGUAGES:
            for kind_style in KIND_STYLES:
                for place in PLACES[level](
                    language=language, kind_style=kind_style, realism="mixed", count=SAMPLE
                ):
                    assert SCRIPT[language].fullmatch(place), (level, language, place)


def test_a_place_is_its_name_written_into_the_template_of_its_kind_and_language() -> None:
    for level in LEVELS:
        for kind_style in KIND_STYLES:
            for detail in place_details(
                level, kind_style=kind_style, include_kind=True, realism="mixed", count=SAMPLE
            ):
                assert detail.kind is not None
                cells = KIND_OF[detail.kind]

                assert LETTER[level] in cells[1], (detail.kind, level)

                for code, place in detail.forms.items():
                    borrowed = kind_style == "borrowed" if kind_style else cells[2] == "borrowed"
                    template = cells[COLUMN[code][0 if borrowed else 1]]

                    assert "{}" in template

                    before, after = template.split("{}")

                    assert place.startswith(before) and place.endswith(after), (template, place)

                    if code == detail.language:
                        assert place == before + detail.name + after


def test_writes_a_country_s_kind_translated_and_a_district_s_borrowed_unless_told_otherwise() -> (
    None
):
    country = place_details("country", language="ko", include_kind=True, count=SAMPLE)
    district = place_details("district", language="ko", include_kind=True, count=SAMPLE)

    assert any(re.search(r"(왕국|제국|공화국|공국|연방)$", each.place) for each in country)
    assert any(re.search(r"(파크|베이|힐스|스퀘어|마켓)$", each.place) for each in district)
    assert any(
        re.search(r" (킹덤|엠파이어|리퍼블릭)$", each.place)
        for each in place_details(
            "country", language="ko", include_kind=True, kind_style="borrowed", count=SAMPLE
        )
    )
    assert any(
        re.search(r" (공원|광장|시장)$|만$", each.place)
        for each in place_details(
            "district", language="ko", include_kind=True, kind_style="translated", count=SAMPLE
        )
    )


def test_include_kind_decides_the_kind_and_leaving_it_out_leaves_it_to_chance() -> None:
    for level in LEVELS:
        for detail in place_details(level, include_kind=False, count=SAMPLE):
            assert detail.kind is None
            assert detail.place == detail.name

        for detail in place_details(level, include_kind=True, count=SAMPLE):
            assert detail.kind is not None
            assert detail.place != detail.name

        mixed = place_details(level, count=200)

        assert any(detail.kind is None for detail in mixed)
        assert any(detail.kind is not None for detail in mixed)


def test_never_writes_a_kind_its_name_already_says() -> None:
    for level in LEVELS:
        for detail in place_details(level, language="en", include_kind=True, count=400):
            assert detail.kind is not None
            said = detail.kind[:-1] if detail.kind.endswith("s") else detail.kind

            assert said not in detail.name.lower(), detail.place


def test_starts_with_reads_the_name_not_the_kind_in_front_of_it() -> None:
    for level in LEVELS:
        for detail in place_details(
            level, language="en", starts_with="E", include_kind=True, count=SAMPLE
        ):
            assert detail.name.startswith("E"), detail.place

        for detail in place_details(level, language="ko", starts_with="에", count=SAMPLE):
            assert detail.name.startswith("에"), detail.place


def test_a_place_keeps_to_a_length_range_the_pools_can_meet() -> None:
    languages: tuple[WordLanguage, ...] = ("en", "ko", "es", "ru")

    for level in LEVELS:
        for language in languages:
            for place in PLACES[level](
                language=language, min_length=8, max_length=14, count=SAMPLE
            ):
                assert 8 <= len(place) <= 14, (level, language, place)


def test_unique_never_returns_the_same_place_twice() -> None:
    for level in LEVELS:
        details = place_details(level, language=["en", "ja"], unique=True, count=300)
        keys = [detail.forms["en"] for detail in details]

        assert len(set(keys)) == len(keys)


def test_a_seeded_source_draws_the_same_places_twice() -> None:
    for level in LEVELS:
        assert PLACES[level](count=20, realism="mixed", random=seeded(11)) == PLACES[level](
            count=20, realism="mixed", random=seeded(11)
        )


# Datasets


def test_spells_every_entry_in_all_five_scripts() -> None:
    tables = (
        FICTIONAL_GIVEN_NAMES,
        FICTIONAL_SURNAMES,
        FICTIONAL_SYLLABLES,
        FICTIONAL_PLACE_ENDINGS,
        FICTIONAL_COMPOUNDS,
        FICTIONAL_PLACES,
    )

    for table in tables:
        for row in spelled_rows(table):
            for script, text in enumerate(row.spelling):
                assert SPELLING[script].fullmatch(text), row.spelling


def test_holds_no_name_twice_within_a_pool() -> None:
    data = pools()

    for pool in (
        data.given["male"],
        data.given["female"],
        data.surnames,
        tuple(row.spelling for row in spelled_rows(FICTIONAL_PLACES)),
    ):
        latin = [entry[0] for entry in pool]
        repeated = sorted({each for each in latin if latin.count(each) > 1})

        assert not repeated, repeated


def test_holds_between_a_hundred_and_three_hundred_given_names_of_each_gender() -> None:
    data = pools()

    for pool in (data.given["male"], data.given["female"]):
        assert 100 <= len(pool) <= 300, len(pool)

    assert len(data.surnames) >= 100


def test_writes_every_kind_on_a_level_in_every_language_with_one_place_for_the_name() -> None:
    codes: list[str] = []

    for cells in KINDS:
        assert len(cells) == 15, cells[0]
        assert cells[2] in ("borrowed", "translated"), cells[0]
        assert re.fullmatch(r"[nrcd]+", cells[1]), cells[0]

        for template in cells[3:]:
            assert len(template.split("{}")) == 2, (cells[0], template)

        codes.append(cells[0])

    assert len(set(codes)) == len(codes)
    # The type names every kind the table holds, and nothing else.
    assert sorted(codes) == sorted(get_args(FictionalPlaceKind))

    for letter in "nrcd":
        assert len([cells for cells in KINDS if letter in cells[1]]) >= 10, letter


def test_offers_every_level_a_hundred_names_or_more_with_the_ones_it_invents() -> None:
    counts = {"n": 0, "r": 0, "c": 0, "d": len(pools().surnames)}

    for row in spelled_rows(FICTIONAL_PLACES):
        for letter in row.cells[0]:
            counts[letter] += 1

    assert counts["n"] >= 100, counts
    assert counts["r"] >= 100, counts
    assert counts["c"] >= 90, counts
    assert counts["d"] >= 100, counts


def test_spells_a_joined_word_the_way_each_script_spells_it() -> None:
    data = pools()
    every = (*data.heads, *data.middles, *data.ends["male"], *data.ends["female"])

    def join(*latin: str) -> Spelling:
        return join_parts([next(entry for entry in every if entry[0] == part) for part in latin])

    assert join("ed", "lyn") == ("Edlyn", "에들린", "エドリン", "埃德琳", "Эдлин")
    assert join("a", "lia") == ("Alia", "알리아", "アリア", "阿莉娅", "Алия")
    assert join("va", "le", "ria") == ("Valeria", "발레리아", "ヴァレリア", "瓦莱莉娅", "Валерия")
    # An `r` is one `ㄹ` and an `l` two.
    assert join("is", "ra")[1] == "이스라"
    assert join("is", "lia")[1] == "이슬리아"
    assert joinable("kal", "lis") is False
    assert joinable("ash", "ley") is False
