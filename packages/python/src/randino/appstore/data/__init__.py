"""Every app store the catalog holds, and how often each one comes up."""

from dataclasses import dataclass

from randino._internal.table import rows
from randino._types import SystemPlatform


@dataclass(frozen=True, slots=True)
class AppStoreEntry:
    """One store the catalog holds."""

    platform: SystemPlatform
    """The kind of machine the store sells apps for."""

    weight: float
    """How often it comes up beside the other stores of its platform, out of a hundred."""

    company: str
    """The company that runs it."""

    name: str
    """The store's own name: `App Store`, `Galaxy Store`."""

    full: str
    """The name with its company, where the store is known by one: `Apple App Store`."""


APP_STORES: tuple[AppStoreEntry, ...] = tuple(
    AppStoreEntry(
        platform=row[0],  # type: ignore[arg-type]
        weight=float(row[1]),
        company=row[2],
        name=row[3],
        full=row[4],
    )
    for row in rows("""
mobile | 45 | Google | Google Play | Google Play Store
mobile | 35 | Apple | App Store | Apple App Store
mobile | 6 | Samsung | Galaxy Store | Samsung Galaxy Store
mobile | 5 | Huawei | AppGallery | Huawei AppGallery
mobile | 3 | Amazon | Amazon Appstore | Amazon Appstore
mobile | 2 | Xiaomi | GetApps | Xiaomi GetApps
mobile | 2 | ONE store | ONE store | ONE store
mobile | 1 | Aptoide | Aptoide | Aptoide
mobile | 1 | F-Droid | F-Droid | F-Droid

desktop | 30 | Microsoft | Microsoft Store | Microsoft Store
desktop | 25 | Valve | Steam | Steam
desktop | 20 | Apple | Mac App Store | Mac App Store
desktop | 8 | Epic Games | Epic Games Store | Epic Games Store
desktop | 4 | GOG | GOG.com | GOG.com
desktop | 4 | Canonical | Snap Store | Snap Store
desktop | 3 | Electronic Arts | EA app | EA app
desktop | 3 | Ubisoft | Ubisoft Connect | Ubisoft Connect
desktop | 3 | MacPaw | Setapp | Setapp
""")
)
"""Every store the catalog holds, one per row: `platform | weight | company | name | full name`.

Only stores that sell or hand out apps for a platform's own system are in, and only ones
still open. Google Play is a phone's alone, since no desktop system ships it. The weights
are written by hand in the order the stores are common in, not measured, and each
platform's add up to a hundred.
"""
