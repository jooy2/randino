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
        "NAME_COUNT_MAX",
        "NAME_LANGUAGES",
        "NAME_LENGTH_MAX",
        "NAME_LENGTH_MIN",
        "NICKNAME_COUNT_MAX",
        "NICKNAME_LANGUAGES",
        "NICKNAME_LENGTH_MAX",
        "NICKNAME_LENGTH_MIN",
        "NICKNAME_SUFFIX_CHARSET",
        "NICKNAME_SUFFIX_LENGTH_MAX",
        "NICKNAME_THEMES",
        "NameDetail",
        "NameGender",
        "NameGenderOption",
        "NameLanguage",
        "NameLanguageOption",
        "NameScript",
        "NicknameDetail",
        "NicknameLanguage",
        "NicknameLanguageOption",
        "NicknameTheme",
        "NicknameThemeOption",
        "name_length_range",
        "name_supports_middle_name",
        "name_supports_roman",
        "nickname_length_range",
        "random_name",
        "random_name_details",
        "random_nickname",
        "random_nickname_details",
    ]

    for name in randino.__all__:
        assert hasattr(randino, name), f"{name} is exported but not defined"


def test_the_functions_are_callable_and_the_constants_are_what_they_claim() -> None:
    assert callable(randino.random_name)
    assert callable(randino.random_name_details)
    assert callable(randino.name_length_range)
    assert callable(randino.name_supports_middle_name)
    assert callable(randino.name_supports_roman)
    assert isinstance(randino.NAME_LANGUAGES, tuple)
    assert randino.NAME_LENGTH_MIN == 1
    assert randino.NAME_LENGTH_MAX == 30
    assert randino.NAME_COUNT_MAX == 10000

    assert callable(randino.random_nickname)
    assert callable(randino.random_nickname_details)
    assert callable(randino.nickname_length_range)
    assert isinstance(randino.NICKNAME_LANGUAGES, tuple)
    assert isinstance(randino.NICKNAME_THEMES, tuple)
    assert randino.NICKNAME_LENGTH_MIN == 1
    assert randino.NICKNAME_LENGTH_MAX == 40
    assert randino.NICKNAME_COUNT_MAX == 10000
    assert randino.NICKNAME_SUFFIX_LENGTH_MAX == 32
    assert re.fullmatch(r"[0-9A-Za-z]+", randino.NICKNAME_SUFFIX_CHARSET)


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
