"""Internal shape of the phone dataset."""

from dataclasses import dataclass, field

from randino._types import PhoneType


@dataclass(frozen=True, slots=True)
class PhoneShape:
    """One way a country writes a number: what it opens on, and the groups after that.

    A digit in a pattern is written as it is; `x` is any digit, `n` is 1 to 9 and `N` is
    2 to 9, because a subscriber number seldom opens on a `0` or a `1` where those are
    what a trunk prefix and a special service dial.
    """

    prefixes: tuple[str, ...]
    """What the first group opens on, after the trunk prefix: an area code, or a block."""

    groups: tuple[str, ...]
    """The groups after the first, as patterns."""

    lead: str = ""
    """Digits the first group carries after its prefix, as a pattern."""

    avoid: tuple[str, ...] = field(default=())
    """Group values no number is written with: a US exchange is never `N11` nor `555`."""

    trunk: str | None = None
    """The trunk prefix, where this shape's is not the country's: a Chinese mobile has none."""


@dataclass(frozen=True, slots=True)
class PhoneCountryData:
    """How one country numbers its phones and writes them."""

    calling_code: str
    """The country calling code, without the `+`."""

    trunk: str
    """What a number opens on at home and drops abroad: `0`, `8`, or `""`."""

    national: str
    """How the country writes a number for itself.

    `T` is the trunk prefix and each `#` the next group. `T#` attaches the trunk to the
    first group (`010`), and anything between them keeps the two apart (`8 (912)`).
    """

    international: str
    """How it writes one for the world, after `+` and the calling code and a space."""

    plans: dict[PhoneType, tuple[PhoneShape, ...]]
    """The shapes each type of number is drawn from."""

    fiction: dict[PhoneType, tuple[PhoneShape, ...]] | None = None
    """The numbers the country sets aside for fiction, which no subscriber is ever given.

    Written in the same templates, and None where a country reserves none, which is most
    of them.
    """
