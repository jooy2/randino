"""File extensions: real ones, the common ones most often."""

import re

from randino import FILE_CATEGORIES, RAND_COUNT_MAX, rand_file_extension

# Internal, but it is what a result is checked against.
from randino.file.data import FILE_EXTENSIONS

SAMPLE = 60
LARGE = 6000


def test_rand_file_extension_returns_one_extension_dot_included_by_default() -> None:
    extensions = rand_file_extension()

    assert len(extensions) == 1
    assert re.fullmatch(r"\.[a-z0-9]+", extensions[0])


def test_returns_exactly_count_extensions() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_file_extension(count=count)) == count

    assert rand_file_extension(count=-3) == []
    assert len(rand_file_extension(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_extension_is_listed_once_in_lower_case_in_a_category_that_exists() -> None:
    seen: set[str] = set()

    for entry in FILE_EXTENSIONS:
        assert entry.name not in seen, f"{entry.name} is listed twice"
        seen.add(entry.name)
        assert re.fullmatch(r"[a-z0-9]+", entry.name)
        assert entry.category in FILE_CATEGORIES
        assert 1 <= entry.weight <= 5

    for category in FILE_CATEGORIES:
        assert any(entry.category == category for entry in FILE_EXTENSIONS), category


def test_every_extension_is_one_the_catalog_holds_in_its_own_category() -> None:
    entries = {entry.name: entry for entry in FILE_EXTENSIONS}

    for detail in rand_file_extension(count=SAMPLE * 5, output="detail"):
        assert detail.category == entries[detail.name].category
        assert detail.extension == f".{detail.name}"


def test_include_dot_false_leaves_the_dot_out() -> None:
    for detail in rand_file_extension(include_dot=False, count=SAMPLE, output="detail"):
        assert detail.extension == detail.name


def test_category_keeps_to_one_kind_of_file_or_several() -> None:
    for category in FILE_CATEGORIES:
        details = rand_file_extension(category=category, count=SAMPLE, output="detail")

        assert all(detail.category == category for detail in details), category

    two = rand_file_extension(category=("code", "data"), count=SAMPLE, output="detail")

    assert all(detail.category in ("code", "data") for detail in two)


def test_the_common_extensions_come_up_most_often() -> None:
    extensions = rand_file_extension(count=LARGE)

    def share(extension: str) -> float:
        return extensions.count(extension) / len(extensions)

    assert share(".pdf") > share(".wpd")
    assert share(".png") > share(".psd")
    assert 0.01 < share(".pdf") < 0.04


def test_unique_never_repeats_an_extension() -> None:
    found = rand_file_extension(category="image", unique=True, count=100)
    images = sum(entry.category == "image" for entry in FILE_EXTENSIONS)

    assert len(set(found)) == len(found)
    assert 8 < len(found) <= images
