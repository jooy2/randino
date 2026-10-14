"""The app store generator: a store people really get apps from, drawn by how common it is."""

from collections.abc import Callable

from randino._internal.generate import collect_from, kept_outcomes, resolve_platforms
from randino._internal.utils import shares, with_random
from randino._types import AppStoreDetail
from randino.appstore.data import APP_STORES, AppStoreEntry

_KEPT: dict[str, list[tuple[AppStoreEntry, float]]] = {}
"""The stores each set of platforms leaves, kept so a call does not work them out again."""


def generate_app_store_details(
    *,
    platform: object = "all",
    include_company: object = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[AppStoreDetail]:
    """Generate `count` app stores, applied to every option."""
    # `is not False` rather than truthiness, the way the npm package reads it.
    with_company = include_company is not False
    platforms = resolve_platforms(platform)

    def listed() -> list[tuple[AppStoreEntry, float]]:
        pools = [[entry for entry in APP_STORES if entry.platform == each] for each in platforms]

        # The platform first, so `"all"` is half stores of each kind rather than whichever kind
        # the table happens to list more stores for.
        return [
            (entry, share / len(pools))
            for pool in pools
            for entry, share in zip(pool, shares(pool, lambda each: each.weight), strict=True)
        ]

    outcomes = kept_outcomes(_KEPT, ",".join(platforms), listed)

    with with_random(random):
        return collect_from(
            count=count,
            unique=unique,
            starts_with="",
            outcomes=outcomes,
            key_of=lambda entry: entry.full if with_company else entry.name,
            build=lambda entry: AppStoreDetail(
                store=entry.full if with_company else entry.name,
                name=entry.name,
                company=entry.company,
                platform=entry.platform,
            ),
        )
