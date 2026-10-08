"""The device generator: a real phone, tablet or laptop, by the name its maker gave it.

Nothing is invented and nothing is weighted. Every option narrows the models a draw may
land on, and every model left is as likely as the next.
"""

from collections.abc import Callable

from randino._internal.generate import collect, resolve_many, resolve_years
from randino._internal.utils import pick, with_random
from randino._types import DeviceDetail, DeviceTypeOption
from randino.device.data import DEVICE_TYPES, DEVICES, DeviceEntry


def write_device(entry: DeviceEntry, include_vendor: bool) -> str:
    """Write `entry` with its maker in front, unless the model already opens on it.

    `Xiaomi 14` and `OnePlus 12` are never written with the maker twice.
    """
    if include_vendor and not entry.model.startswith(entry.vendor):
        return f"{entry.vendor} {entry.model}"

    return entry.model


def generate_device_details(
    *,
    type: DeviceTypeOption = "all",
    min_year: int | None = None,
    max_year: int | None = None,
    include_vendor: bool = True,
    count: int = 1,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[DeviceDetail]:
    """Generate `count` devices, applied to every option."""
    types = resolve_many(type, DEVICE_TYPES, DEVICE_TYPES)
    low, high = resolve_years(min_year, max_year)
    # `is not False` rather than truthiness, the way the npm package reads it: a value
    # the type rules out does not switch the maker off.
    with_vendor = include_vendor is not False
    # Worked out once per call rather than per draw: a call of ten thousand would
    # otherwise filter the catalog ten thousand times.
    candidates = [entry for entry in DEVICES if entry.type in types and low <= entry.year <= high]

    def draw() -> DeviceDetail:
        entry = pick(candidates)

        return DeviceDetail(
            device=write_device(entry, with_vendor),
            vendor=entry.vendor,
            model=entry.model,
            type=entry.type,
            year=entry.year,
        )

    with with_random(random):
        return collect(
            count=count if candidates else 0,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.device,
        )
