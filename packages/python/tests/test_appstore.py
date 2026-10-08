"""App stores: real ones, by the name each is known by, the common ones most often."""

from randino import RAND_COUNT_MAX, SYSTEM_PLATFORMS, rand_app_store

# Internal, but it is what a result is checked against.
from randino.appstore.data import APP_STORES

SAMPLE = 60
LARGE = 6000


def test_rand_app_store_returns_one_store_by_default() -> None:
    stores = rand_app_store()

    assert len(stores) == 1
    assert any(entry.full == stores[0] for entry in APP_STORES)


def test_returns_exactly_count_stores() -> None:
    for count in (0, 1, 7, 25):
        assert len(rand_app_store(count=count)) == count

    assert rand_app_store(count=-3) == []
    assert len(rand_app_store(count=RAND_COUNT_MAX + 5)) == RAND_COUNT_MAX


def test_every_store_is_listed_once_and_each_platforms_weights_add_up_to_a_hundred() -> None:
    seen: set[str] = set()

    for entry in APP_STORES:
        key = f"{entry.platform} {entry.name}"

        assert key not in seen, f"{key} is listed twice"
        seen.add(key)
        assert entry.platform in SYSTEM_PLATFORMS, key
        assert entry.weight > 0, key
        assert entry.name in entry.full, key

    for platform in SYSTEM_PLATFORMS:
        assert sum(entry.weight for entry in APP_STORES if entry.platform == platform) == 100


def test_every_store_is_one_the_catalog_holds_written_by_its_full_name_or_its_own() -> None:
    entries = {(entry.platform, entry.name): entry for entry in APP_STORES}

    for detail in rand_app_store(count=SAMPLE * 5, output="detail"):
        entry = entries[(detail.platform, detail.name)]

        assert detail.store == entry.full
        assert detail.company == entry.company

    for detail in rand_app_store(include_company=False, count=SAMPLE, output="detail"):
        assert detail.store == detail.name


def test_platform_keeps_to_one_kind_of_machine_and_google_play_is_never_a_desktops() -> None:
    for platform in SYSTEM_PLATFORMS:
        details = rand_app_store(platform=platform, count=SAMPLE, output="detail")

        assert all(detail.platform == platform for detail in details)

    assert not any(
        "Google Play" in store for store in rand_app_store(platform="desktop", count=LARGE)
    )

    details = rand_app_store(count=LARGE, output="detail")
    desktop = sum(detail.platform == "desktop" for detail in details) / len(details)

    assert 0.45 < desktop < 0.55


def test_the_common_stores_come_up_most_often() -> None:
    phones = rand_app_store(platform="mobile", count=LARGE)

    def share(store: str) -> float:
        return phones.count(store) / len(phones)

    assert share("Google Play Store") > 0.38
    assert share("Google Play Store") > share("Apple App Store")
    assert share("Apple App Store") > share("Samsung Galaxy Store")
    assert share("F-Droid") < 0.03


def test_unique_never_repeats_a_store() -> None:
    found = rand_app_store(unique=True, count=100)

    assert len(set(found)) == len(found)
    assert 10 < len(found) <= len(APP_STORES)
