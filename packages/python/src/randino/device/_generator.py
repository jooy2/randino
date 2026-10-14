"""The device generator: a real phone, tablet or laptop, by the name its maker gave it.

Nothing is invented and nothing is weighted. Every option narrows the models a draw may
land on, and every model left is as likely as the next.
"""

from collections.abc import Callable

from randino._internal.generate import collect_from, kept_outcomes, resolve_many, resolve_years
from randino._internal.utils import with_random
from randino._types import DeviceDetail, DeviceTypeOption
from randino.device.data import DEVICE_TYPES, DEVICE_VENDORS, DEVICES, DeviceEntry


def write_device(entry: DeviceEntry, include_vendor: bool) -> str:
    """Write `entry` with its maker in front, unless the model already opens on it.

    `Xiaomi 14` and `OnePlus 12` are never written with the maker twice.
    """
    if include_vendor and not entry.model.startswith(entry.vendor):
        return f"{entry.vendor} {entry.model}"

    return entry.model


_KEPT: dict[str, list[tuple[DeviceEntry, float]]] = {}
"""The models each set of options leaves, kept so a call does not work them out again."""


def generate_device_details(
    *,
    type: DeviceTypeOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    vendor: object = "all",
    include_vendor: bool = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[DeviceDetail]:
    """Generate `count` devices, applied to every option."""
    types = resolve_many(type, DEVICE_TYPES, DEVICE_TYPES)
    low, high = resolve_years(min_year, max_year)
    vendors = resolve_many(vendor, DEVICE_VENDORS, DEVICE_VENDORS)
    # `is not False` rather than truthiness, the way the npm package reads it: a value
    # the type rules out does not switch the maker off.
    with_vendor = include_vendor is not False
    outcomes = kept_outcomes(
        _KEPT,
        f"{','.join(types)}|{','.join(vendors)}|{low}|{high}",
        lambda: [
            (entry, 1.0)
            for entry in DEVICES
            if entry.type in types and entry.vendor in vendors and low <= entry.year <= high
        ],
    )

    with with_random(random):
        return collect_from(
            count=count,
            unique=unique,
            starts_with="",
            outcomes=outcomes,
            key_of=lambda entry: write_device(entry, with_vendor),
            build=lambda entry: DeviceDetail(
                device=write_device(entry, with_vendor),
                vendor=entry.vendor,
                model=entry.model,
                type=entry.type,
                year=entry.year,
            ),
        )
