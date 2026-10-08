"""The resolution generator: a screen size people really have, drawn by how common it is."""

from collections.abc import Callable

from randino._internal.generate import collect, resolve_platforms
from randino._internal.utils import pick, pick_weighted, with_random
from randino._types import ResolutionDetail
from randino.resolution.data import RESOLUTION_SEPARATOR_DEFAULT, RESOLUTIONS


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
    # One list per platform, worked out once per call rather than per draw.
    pools = [
        [entry for entry in RESOLUTIONS if entry.platform == each]
        for each in resolve_platforms(platform)
    ]

    def draw() -> ResolutionDetail:
        # The platform first, so `"all"` is half screens of each kind rather than whichever
        # kind the table happens to list more sizes for.
        entry = pick_weighted(pick(pools), lambda each: each.weight)

        return ResolutionDetail(
            resolution=f"{entry.width}{between}{entry.height}",
            width=entry.width,
            height=entry.height,
            platform=entry.platform,
        )

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.resolution,
        )
