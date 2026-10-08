"""Real app stores, by the name each is known by."""

from collections.abc import Callable
from typing import Literal, overload

from randino._types import AppStoreDetail, SystemPlatformOption
from randino.appstore._generator import generate_app_store_details


@overload
def rand_app_store(
    *,
    platform: SystemPlatformOption = ...,
    include_company: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_app_store(
    *,
    platform: SystemPlatformOption = ...,
    include_company: bool = ...,
    count: int = ...,
    unique: bool = ...,
    random: Callable[[], float] | None = ...,
    output: Literal["detail"],
) -> list[AppStoreDetail]: ...


def rand_app_store(
    *,
    platform: SystemPlatformOption = "all",
    include_company: bool = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
    output: str = "value",
) -> list[str] | list[AppStoreDetail]:
    """Generate real app stores: `Google Play Store`, `Apple App Store`, `Steam`.

    Google Play and Apple's App Store are most of the phones, and the Microsoft Store,
    Steam and the Mac App Store most of the desktops. Google Play is never a desktop's.

    Args:
        platform: `"desktop"` for the stores of desktops and laptops, `"mobile"` for
            those of phones and tablets. `"all"` draws both evenly.
        include_company: Write the name with its company where the store is known by
            one: `Apple App Store` rather than `App Store`.
        count: How many stores to return. Held inside `0`..`RAND_COUNT_MAX`.
        unique: Never return the same store twice. Returns fewer than `count` once they
            run out.
        random: Where the randomness comes from: a callable returning a number in
            `[0, 1)`, the way `random.random` does. `SystemRandom().random` for a value
            nobody may predict, `Random(42).random` for one that has to come out the
            same every run.
        output: `"value"` for strings, `"detail"` for an `AppStoreDetail` per result — the
            store's own name and the company that runs it.

    Returns:
        A `list[str]`, or a `list[AppStoreDetail]` when `output="detail"` — the overloads
        carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_app_store()
        ['Google Play Store']
        >>> rand_app_store(platform="desktop", count=3)
        ['Steam', 'Microsoft Store', 'Mac App Store']
        >>> rand_app_store(platform="mobile", include_company=False)
        ['App Store']
    """
    details = generate_app_store_details(
        platform=platform,
        include_company=include_company,
        count=count,
        unique=unique,
        random=random,
    )

    if output == "detail":
        return details

    stores: list[str] = [detail.store for detail in details]

    return stores
