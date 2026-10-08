"""The OS generator: a real release, written the way the release is known.

Nothing is invented. A draw picks a line of operating systems, then one of its releases,
then — when the caller asked for one — one of that release's builds, and every option
narrows what may be picked rather than shaping what is written afterwards.
"""

from collections.abc import Callable

from randino._internal.generate import collect, resolve_platforms, resolve_years
from randino._internal.utils import pick, pick_weighted, with_random
from randino._types import OsDetail, SystemPlatform, SystemPlatformOption
from randino.os.data import OS_FAMILIES, OS_RELEASES, OsBuild, OsFamily, OsRelease


def write_os(release: OsRelease, build: OsBuild | None, edition: str | None) -> str:
    """Write `release` out, with `build` and `edition` where the call asked for them."""
    # A template with no `{b}` writes its build in the version's place: macOS 14 at a
    # point release is `14.5`, never `14 14.5`.
    in_place = "{b}" not in release.template

    return (
        release.template.replace(
            "{v}", build.text if build is not None and in_place else release.version, 1
        )
        .replace("{e}", f" {edition}" if edition is not None else "", 1)
        .replace("{b}", f" {build.text}" if build is not None and not in_place else "", 1)
    )


def _candidates(
    platforms: tuple[SystemPlatform, ...], years: tuple[int, int], by_build: bool
) -> dict[OsFamily, list[tuple[OsRelease, tuple[OsBuild, ...]]]]:
    """The releases one call may land on, grouped by line, with the builds it may write.

    Worked out once per call: a year range is read against every release and every
    build, and a call of ten thousand would otherwise read them all ten thousand times.
    With `by_build` the year that counts is the build's — the thing the result names — so
    a release none of whose builds is inside the range is left out, and one without
    builds is read by its own year.
    """
    min_year, max_year = years
    families: dict[OsFamily, list[tuple[OsRelease, tuple[OsBuild, ...]]]] = {}

    for release in OS_RELEASES:
        if OS_FAMILIES[release.family].platform not in platforms:
            continue

        builds = (
            tuple(build for build in release.builds if min_year <= build.year <= max_year)
            if by_build and release.builds
            else None
        )

        if builds is not None:
            if not builds:
                continue
        elif not min_year <= release.year <= max_year:
            continue

        families.setdefault(release.family, []).append((release, builds or ()))

    return families


def generate_os_details(
    *,
    platform: SystemPlatformOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    include_version: bool = True,
    include_build: bool = False,
    include_edition: bool = False,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[OsDetail]:
    """Generate `count` operating systems, applied to every option."""
    # `is not False` and `is True` rather than truthiness, the way the npm package
    # reads them: a value the type rules out does not switch a part on or off.
    with_version = include_version is not False
    families = _candidates(
        resolve_platforms(platform),
        resolve_years(min_year, max_year),
        with_version and include_build is True,
    )
    lines = list(families)
    with_edition = with_version and include_edition is True

    def draw() -> OsDetail:
        family = pick_weighted(lines, lambda line: OS_FAMILIES[line].weight)
        release, builds = pick(families[family])
        build = pick(builds) if builds else None
        edition = pick(release.editions) if with_edition and release.editions else None

        return OsDetail(
            os=write_os(release, build, edition) if with_version else release.name,
            name=release.name,
            version=release.version if with_version else None,
            build=build.text if build is not None else None,
            edition=edition,
            platform=OS_FAMILIES[family].platform,
            year=build.year if build is not None else release.year,
        )

    with with_random(random):
        return collect(
            count=count if lines else 0,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.os,
        )
