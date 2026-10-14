"""The resolution generator: a screen size people really have, drawn by how common it is."""

from collections.abc import Callable

from randino._internal.generate import collect_from, kept_outcomes, resolve_platforms
from randino._internal.utils import shares, with_random
from randino._types import ResolutionDetail
from randino.resolution.data import RESOLUTION_SEPARATOR_DEFAULT, RESOLUTIONS, ResolutionEntry

_KEPT: dict[str, list[tuple[ResolutionEntry, float]]] = {}
"""The sizes each set of platforms leaves, kept so a call does not work them out again."""


def generate_resolution_details(
    *,
    platform: object = "all",
    separator: object = RESOLUTION_SEPARATOR_DEFAULT,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[ResolutionDetail]:
    """Generate `count` resolutions, applied to every option."""
    between = separator if isinstance(separator, str) else RESOLUTION_SEPARATOR_DEFAULT
    platforms = resolve_platforms(platform)

    def listed() -> list[tuple[ResolutionEntry, float]]:
        pools = [[entry for entry in RESOLUTIONS if entry.platform == each] for each in platforms]

        # The platform first, so `"all"` is half screens of each kind rather than whichever kind
        # the table happens to list more sizes for.
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
            key_of=lambda entry: f"{entry.width}{between}{entry.height}",
            build=lambda entry: ResolutionDetail(
                resolution=f"{entry.width}{between}{entry.height}",
                width=entry.width,
                height=entry.height,
                platform=entry.platform,
            ),
        )
