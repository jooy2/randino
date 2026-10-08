"""The app store generator: a store people really get apps from, drawn by how common it is."""

from collections.abc import Callable

from randino._internal.generate import collect, resolve_platforms
from randino._internal.utils import pick, pick_weighted, with_random
from randino._types import AppStoreDetail
from randino.appstore.data import APP_STORES


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
    # One list per platform, worked out once per call rather than per draw.
    pools = [
        [entry for entry in APP_STORES if entry.platform == each]
        for each in resolve_platforms(platform)
    ]

    def draw() -> AppStoreDetail:
        # The platform first, so `"all"` is half stores of each kind rather than whichever
        # kind the table happens to list more stores for.
        entry = pick_weighted(pick(pools), lambda each: each.weight)

        return AppStoreDetail(
            store=entry.full if with_company else entry.name,
            name=entry.name,
            company=entry.company,
            platform=entry.platform,
        )

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.store,
        )
