"""MIME types: the ones the catalog's extensions carry, by their commonest extension."""

import re

from randino import MIME_TOP_LEVELS, RAND_COUNT_MAX, rand_file_extension, rand_mime_type

# Internal, but they are what a result is checked against.
from randino.file.data import FILE_EXTENSIONS, MIME_TYPE_ENTRIES

SAMPLE = 60
LARGE = 6000
MIME = re.compile(r"(application|audio|font|image|model|text|video)/[a-z0-9.+-]+")


def test_rand_mime_type_returns_one_mime_type_by_default() -> None:
    types = rand_mime_type()

    assert len(types) == 1
    assert MIME.fullmatch(types[0])


def test_returns_exactly_count_types() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_mime_type(count=count)) == count

    assert rand_mime_type(count=-3) == []
    assert len(rand_mime_type(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_type_is_one_an_extension_carries_listed_once_with_its_extensions() -> None:
    carried = {entry.mime_type for entry in FILE_EXTENSIONS}

    assert len(MIME_TYPE_ENTRIES) == len(carried)

    for entry in MIME_TYPE_ENTRIES:
        mine = [each for each in FILE_EXTENSIONS if each.mime_type == entry.mime_type]

        assert entry.extensions == tuple(each.name for each in mine)
        assert entry.weight == max(each.weight for each in mine)


def test_the_detail_splits_the_type_at_its_slash_and_lists_its_extensions() -> None:
    by_name = {entry.name: entry for entry in FILE_EXTENSIONS}

    for detail in rand_mime_type(count=SAMPLE * 5, output="detail"):
        assert MIME.fullmatch(detail.mime_type)
        assert detail.mime_type == f"{detail.type}/{detail.subtype}"
        assert detail.extensions

        for name in detail.extensions:
            assert by_name[name].mime_type == detail.mime_type


def test_type_keeps_to_the_top_level_types_named() -> None:
    for top in MIME_TOP_LEVELS:
        assert all(each.startswith(f"{top}/") for each in rand_mime_type(type=top, count=SAMPLE))

    both = rand_mime_type(type=("audio", "video"), count=SAMPLE)

    assert all(re.match(r"(audio|video)/", each) for each in both)


def test_a_type_shared_by_many_extensions_is_no_more_common_than_its_commonest_one() -> None:
    types = rand_mime_type(count=LARGE)

    def share(mime_type: str) -> float:
        return types.count(mime_type) / len(types)

    assert share("text/plain") < 0.06
    assert share("application/pdf") > share("application/vnd.wordperfect")


def test_an_extension_carries_the_mime_type_its_format_is_served_as() -> None:
    by_name = {entry.name: entry.mime_type for entry in FILE_EXTENSIONS}

    assert by_name["pdf"] == "application/pdf"
    assert by_name["jpg"] == by_name["jpeg"]
    assert by_name["ts"] == "text/plain"
    assert MIME.fullmatch(rand_file_extension(output="detail")[0].mime_type)


def test_unique_never_repeats_a_type() -> None:
    found = rand_mime_type(type="image", unique=True, count=100)

    assert len(set(found)) == len(found)
    assert len(found) > 5
