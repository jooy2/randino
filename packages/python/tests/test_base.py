"""The package's export surface, and the promise that it depends on nothing."""

import ast
import pathlib
import re
import sys
from collections.abc import Callable
from random import Random
from typing import Any

import randino

# Internal, but every generator's length options go through it.
from randino._internal.generate import length_bounds

SOURCE = pathlib.Path(randino.__file__).parent


def test_the_package_exports_exactly_its_public_api() -> None:
    # `__all__` is the API contract: everything documented in the README has to be
    # reachable from it, and nothing internal should leak.
    assert sorted(randino.__all__) == [
        "AFFIX_CHARSET",
        "AFFIX_LENGTH_DEFAULT",
        "AFFIX_LENGTH_MAX",
        "AFFIX_SEPARATOR_DEFAULT",
        "LOCATION_LANGUAGES",
        "LOCATION_LEVELS",
        "LocationDetail",
        "LocationLanguage",
        "LocationLanguageOption",
        "LocationLevel",
        "ModifierKind",
        "NAME_LANGUAGES",
        "NameDetail",
        "NameGender",
        "NameGenderOption",
        "NameLanguage",
        "NameLanguageOption",
        "NameScript",
        "NicknameDetail",
        "RAND_COUNT_MAX",
        "RAND_LENGTH_MAX",
        "RAND_LENGTH_MIN",
        "RAND_LOCATION_LENGTH_MAX",
        "RAND_SENTENCE_COUNT_MAX",
        "RAND_SENTENCE_LENGTH_MAX",
        "RandRealism",
        "RandVocabulary",
        "SentenceDetail",
        "SentenceQuote",
        "SentenceShape",
        "SentenceShapeOption",
        "SentenceSlot",
        "SentenceSlotOption",
        "SentenceStory",
        "SentenceStyle",
        "SentenceTense",
        "SentenceType",
        "SentenceTypeOption",
        "WORD_LANGUAGES",
        "WORD_THEMES",
        "WordDetail",
        "WordLanguage",
        "WordLanguageOption",
        "WordSlot",
        "WordSlotOption",
        "WordTheme",
        "WordThemeOption",
        "name_length_range",
        "name_supports_middle_name",
        "name_supports_roman",
        "nickname_length_range",
        "rand_animal",
        "rand_body",
        "rand_city",
        "rand_clothing",
        "rand_color",
        "rand_concept",
        "rand_country",
        "rand_district",
        "rand_drink",
        "rand_emotion",
        "rand_finance",
        "rand_food",
        "rand_furniture",
        "rand_gem",
        "rand_job",
        "rand_location",
        "rand_modifier",
        "rand_music",
        "rand_myth",
        "rand_name",
        "rand_nature",
        "rand_nickname",
        "rand_object",
        "rand_person",
        "rand_place",
        "rand_plant",
        "rand_prefix",
        "rand_product",
        "rand_region",
        "rand_sentence",
        "rand_sound",
        "rand_space",
        "rand_sport",
        "rand_suffix",
        "rand_tech",
        "rand_time",
        "rand_tool",
        "rand_toy",
        "rand_vehicle",
        "rand_weather",
        "rand_word",
        "sentence_length_range",
        "word_length_range",
    ]

    for name in randino.__all__:
        assert hasattr(randino, name), f"{name} is exported but not defined"


def test_the_functions_are_callable_and_the_constants_are_what_they_claim() -> None:
    assert callable(randino.rand_name)
    # One function, two return shapes — the option is the API, so it is asserted
    # here rather than only in the category's own suite.
    assert isinstance(randino.rand_name(output="detail")[0].roman, str)
    assert isinstance(randino.rand_nickname(output="detail")[0].words, tuple)
    assert callable(randino.name_length_range)
    assert callable(randino.name_supports_middle_name)
    assert callable(randino.name_supports_roman)
    assert isinstance(randino.NAME_LANGUAGES, tuple)
    # One set of bounds for every generator, rather than one set per category
    # holding the same numbers.
    assert randino.RAND_LENGTH_MIN == 1
    assert randino.RAND_LENGTH_MAX == 40
    assert randino.RAND_COUNT_MAX == 10000
    # A sentence is many words rather than at most three, so it is the one generator
    # with a length ceiling of its own — and the one that puts more than one result in
    # a string.
    assert randino.RAND_SENTENCE_LENGTH_MAX == 200
    assert randino.RAND_SENTENCE_COUNT_MAX == 10

    assert callable(randino.rand_nickname)
    assert callable(randino.nickname_length_range)
    assert isinstance(randino.WORD_LANGUAGES, tuple)
    assert isinstance(randino.WORD_THEMES, tuple)

    # One generator per theme, and the theme list is what says how many.
    assert callable(randino.rand_word)
    assert callable(randino.word_length_range)
    assert isinstance(randino.rand_animal(language="ko")[0], str)
    assert randino.rand_product(output="detail")[0].theme == "product"

    assert callable(randino.rand_suffix)
    assert callable(randino.rand_prefix)
    assert callable(randino.rand_modifier)
    # The decorators work with nothing to decorate, which is what makes what they
    # attach available on its own.
    assert isinstance(randino.rand_suffix(), str)
    assert isinstance(randino.rand_prefix(), str)
    assert isinstance(randino.rand_modifier(), str)
    assert randino.AFFIX_LENGTH_DEFAULT == 5
    assert randino.AFFIX_LENGTH_MAX == 32
    assert randino.AFFIX_SEPARATOR_DEFAULT == "_"
    assert re.fullmatch(r"[0-9A-Za-z]+", randino.AFFIX_CHARSET)

    # A location written out is every level of it at once, so it has a length ceiling of
    # its own, and one generator per level below it.
    assert isinstance(randino.rand_location(language="ko")[0], str)
    assert len(randino.rand_location(output="detail")[0].country) > 0
    assert randino.rand_city(language="en", output="detail")[0].level == "city"
    assert randino.RAND_LOCATION_LENGTH_MAX == 100
    assert randino.LOCATION_LEVELS == ("country", "region", "city", "district")


def test_the_package_imports_nothing_outside_the_standard_library() -> None:
    # Zero runtime dependencies is a hard constraint, not a preference — it is why
    # the Hangul romanizer is written out rather than pulled in. A stray `import` is
    # the one way that promise breaks without anything else failing.
    allowed = sys.stdlib_module_names | {"randino"}
    imported: dict[str, str] = {}

    for path in sorted(SOURCE.rglob("*.py")):
        tree = ast.parse(path.read_text(encoding="utf-8"))

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imported[alias.name.split(".")[0]] = path.name
            elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
                imported[node.module.split(".")[0]] = path.name

    outside = {module: where for module, where in imported.items() if module not in allowed}

    assert not outside, f"randino must not depend on anything: {outside}"


def test_the_package_ships_its_type_marker() -> None:
    # Without `py.typed`, PEP 561 tells type checkers to ignore every annotation in
    # here, and the package silently reads as untyped to everyone installing it.
    assert (SOURCE / "py.typed").is_file()


def test_an_option_the_types_rule_out_falls_back_rather_than_raising() -> None:
    """Every option that takes one of a fixed set falls back to its default.

    The `Literal` types rule each of these out and an unchecked caller can still pass
    them. Each used to reach a pool lookup or a float conversion and raise from
    somewhere that named neither the option nor the value.

    Reached through `Any` on purpose: the caller this is about is the one the types do
    not describe, and writing each call out with its own `type: ignore` would be two
    dozen ignores whose codes drift with every release of the type checker.
    """
    loose: Any = randino
    asks: list[Callable[[], object]] = [
        lambda: loose.rand_name(language="xx"),
        lambda: loose.rand_name(gender="other"),
        lambda: loose.rand_name(count=float("nan")),
        lambda: loose.rand_name(min_length=float("nan")),
        lambda: loose.rand_word(theme="nope"),
        lambda: loose.rand_word(language="xx"),
        lambda: loose.rand_nickname(theme="nope"),
        lambda: loose.rand_nickname(slots=123),
        lambda: loose.rand_sentence(language="xx"),
        lambda: loose.rand_sentence(type=123),
        lambda: loose.rand_sentence(include=123),
        lambda: loose.rand_sentence(include=[None]),
        lambda: loose.rand_sentence(slots=123),
        lambda: loose.rand_sentence(shape="huge"),
        lambda: loose.rand_sentence(story="nope"),
        lambda: loose.rand_sentence(style="shouty"),
        lambda: loose.rand_sentence(tense="future"),
        lambda: loose.rand_sentence(sentences=float("nan")),
        lambda: loose.name_length_range("xx"),
        lambda: loose.word_length_range("xx"),
        lambda: loose.nickname_length_range("xx"),
        lambda: loose.sentence_length_range("xx"),
        lambda: loose.name_supports_middle_name("xx"),
        lambda: loose.rand_location(language="xx"),
        lambda: loose.rand_location(level="street"),
        lambda: loose.rand_location(min_length=float("nan")),
        lambda: loose.rand_city(language="ja"),
    ]

    for ask in asks:
        ask()

    # And the fallback is the option's own default, not silence: `count=nan` asked for
    # one name and used to hand back none.
    assert len(loose.rand_name(count=float("nan"))) == 1
    # A token of no length is not a token.
    assert len(loose.rand_suffix("x", length=float("nan"))) == len("x_") + 5


def test_a_length_range_the_wrong_way_round_keeps_max_length() -> None:
    # `max_length` is the bound a caller is holding to — a field limit, a column width —
    # where `min_length` only shapes how a result reads. `(30, 5)` used to read as
    # `(30, 30)`.
    assert length_bounds(30, 5, 3, 10) == (5, 5)
    assert length_bounds(5, 30, 3, 10) == (5, 30)

    for word in randino.rand_word(language="en", min_length=30, max_length=5, count=60):
        assert len(word) <= 5, word


def test_random_is_where_every_draw_of_a_call_comes_from() -> None:
    """One source, threaded through everything the call reaches.

    For `rand_sentence` that is the word pools, the story planner and the name
    generator. Two calls with the same seed have to agree on all of it.
    """

    def twice(draw: Callable[[], object]) -> None:
        assert draw() == draw()

    twice(lambda: randino.rand_name(language="en", count=5, random=Random(42).random))
    twice(lambda: randino.rand_word(language="ko", count=5, random=Random(42).random))
    twice(lambda: randino.rand_animal(language="en", count=5, random=Random(42).random))
    twice(lambda: randino.rand_nickname(language="en", count=5, random=Random(42).random))
    twice(
        lambda: randino.rand_sentence(language="ko", count=3, sentences=3, random=Random(42).random)
    )
    twice(lambda: randino.rand_suffix("MistyOwl", random=Random(42).random))
    twice(lambda: randino.rand_prefix("MistyOwl", random=Random(42).random))
    twice(lambda: randino.rand_modifier("사자", random=Random(42).random))
    twice(lambda: randino.rand_modifier(["사자", "여우"], random=Random(42).random))
    twice(lambda: randino.rand_location(count=5, random=Random(42).random))
    twice(lambda: randino.rand_city(language="en", max_length=8, count=5, random=Random(42).random))

    # Two different seeds are two different answers, so the source is actually what
    # the draws are coming from.
    assert randino.rand_name(language="en", count=5, random=Random(1).random) != randino.rand_name(
        language="en", count=5, random=Random(2).random
    )

    # And the package's own source is put back afterwards.
    assert randino.rand_name(count=5) != randino.rand_name(count=5)
