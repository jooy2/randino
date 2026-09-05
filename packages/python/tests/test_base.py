"""The package's export surface, and the promise that it depends on nothing."""

import ast
import pathlib
import re
import sys

import randino

SOURCE = pathlib.Path(randino.__file__).parent


def test_the_package_exports_exactly_its_public_api() -> None:
    # `__all__` is the API contract: everything documented in the README has to be
    # reachable from it, and nothing internal should leak.
    assert sorted(randino.__all__) == [
        "AFFIX_CHARSET",
        "AFFIX_LENGTH_DEFAULT",
        "AFFIX_LENGTH_MAX",
        "AFFIX_SEPARATOR_DEFAULT",
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
        "RAND_SENTENCE_COUNT_MAX",
        "RAND_SENTENCE_LENGTH_MAX",
        "RandRealism",
        "SentenceDetail",
        "SentenceShape",
        "SentenceShapeOption",
        "SentenceSlot",
        "SentenceSlotOption",
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
        "rand_clothing",
        "rand_color",
        "rand_concept",
        "rand_drink",
        "rand_emotion",
        "rand_finance",
        "rand_food",
        "rand_gem",
        "rand_job",
        "rand_modifier",
        "rand_music",
        "rand_myth",
        "rand_name",
        "rand_nature",
        "rand_nickname",
        "rand_object",
        "rand_place",
        "rand_plant",
        "rand_prefix",
        "rand_product",
        "rand_sentence",
        "rand_space",
        "rand_sport",
        "rand_suffix",
        "rand_tech",
        "rand_time",
        "rand_tool",
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
