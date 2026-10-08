"""The phone number generator: a block the plan gives out, and the digits after it.

What is drawn and how it is written are kept apart. A number is its groups of digits, and
the national form, the international form and E.164 are three ways of writing the same
groups — which is why a separator can replace the country's own punctuation without the
number changing underneath it.
"""

import re
from collections.abc import Callable, Sequence

from randino._internal.generate import collect, resolve_option
from randino._internal.utils import pick, pick_weighted, rand_int, with_random
from randino._types import (
    PhoneCountry,
    PhoneCountryOption,
    PhoneDetail,
    PhoneType,
    PhoneTypeOption,
)
from randino.phone.data import PHONE_COUNTRIES, PHONE_DATA, PHONE_TYPES
from randino.phone.data._types import PhoneCountryData, PhoneShape

_AVOID_ATTEMPTS = 20
"""Draws a group that keeps landing on an avoided value gets before it is given up on.

Nine values out of eight hundred never get close to it.
"""

_MARKS = re.compile(r"[T#]")


def _fill(pattern: str) -> str:
    """`pattern` with every `x`, `n` and `N` replaced by a digit it allows."""
    lows = {"x": 0, "n": 1, "N": 2}

    return "".join(str(rand_int(lows[mark], 9)) if mark in lows else mark for mark in pattern)


def _openings(shape: PhoneShape) -> int:
    """How many first groups `shape` can write: its prefixes, times what its lead can add."""
    span = len(shape.prefixes)

    for mark in shape.lead:
        span *= {"x": 10, "n": 9, "N": 8}.get(mark, 1)

    return span


def _draw_group(pattern: str, avoid: Sequence[str]) -> str:
    """A group drawn from `pattern`, never one of the values in `avoid`."""
    group = _fill(pattern)
    attempt = 1

    while group in avoid and attempt < _AVOID_ATTEMPTS:
        group = _fill(pattern)
        attempt += 1

    return group


def _write_template(template: str, trunk: str, groups: Sequence[str]) -> str:
    """`template` with its trunk and its groups put in, in order."""
    remaining = iter(groups)

    return _MARKS.sub(lambda match: trunk if match.group(0) == "T" else next(remaining), template)


def _join_national(template: str, trunk: str, groups: Sequence[str], separator: str) -> str:
    """The national form's groups, joined by the caller's separator.

    The trunk goes where the country's own template puts it: attached to the first group
    (`010`), or a group of its own (`8`).
    """
    if not trunk:
        return separator.join(groups)

    if "T#" in template:
        return separator.join([trunk + groups[0], *groups[1:]])

    return separator.join([trunk, *groups])


def _write(
    data: PhoneCountryData,
    trunk: str,
    groups: Sequence[str],
    include_country_code: bool,
    separator: str | None,
) -> str:
    """The number in the form the caller asked for."""
    if include_country_code:
        if separator is None:
            return f"+{data.calling_code} {_write_template(data.international, '', groups)}"

        return f"+{data.calling_code}{separator}{separator.join(groups)}"

    if separator is None:
        return _write_template(data.national, trunk, groups)

    return _join_national(data.national, trunk, groups, separator)


def resolve_phone_country(country: object) -> PhoneCountryOption:
    """The caller's `country`, read regardless of case.

    `"kr"` is a code people write, and answering it with every country would ignore what
    they plainly meant.
    """
    code = country.upper() if isinstance(country, str) else country
    known: tuple[PhoneCountryOption, ...] = PHONE_COUNTRIES

    return resolve_option(code, known, "all")


def _resolve_phone_type(type: object) -> PhoneTypeOption:
    """The caller's `type`, or mobile numbers for one this package does not know."""
    known: tuple[PhoneTypeOption, ...] = (*PHONE_TYPES, "all")

    return resolve_option(type, known, "mobile")


def generate_phone_details(
    *,
    country: PhoneCountryOption = "all",
    type: PhoneTypeOption = "mobile",
    count: int = 1,
    include_country_code: bool = False,
    separator: str | None = None,
    fictional: bool = False,
    unique: bool = False,
    random: Callable[[], float] | None = None,
) -> list[PhoneDetail]:
    """Generate `count` phone numbers, applied to every option."""
    chosen = resolve_phone_country(country)
    kind = _resolve_phone_type(type)
    fiction = fictional is True
    # A country that reserves no numbers for fiction can only answer with real ones, so
    # asking it for fiction is asking for nothing.
    countries: tuple[PhoneCountry, ...] = tuple(
        code
        for code in (PHONE_COUNTRIES if chosen == "all" else (chosen,))
        if not fiction or PHONE_DATA[code].fiction is not None
    )

    if not countries:
        return []
    international = include_country_code is True
    written = separator if isinstance(separator, str) else None

    def draw() -> PhoneDetail:
        code = pick(countries)
        drawn: PhoneType = pick(PHONE_TYPES) if kind == "all" else kind
        data = PHONE_DATA[code]
        # Every opening the plan can write is as likely as any other, so a shape listing
        # sixteen area codes comes up sixteen times as often as one listing one, and
        # Spain's `6xx` ten times as often as its `71x`.
        plans = data.fiction if fiction and data.fiction is not None else data.plans
        shape = pick_weighted(plans[drawn], _openings)
        groups = [
            pick(shape.prefixes) + _fill(shape.lead),
            *(_draw_group(pattern, shape.avoid) for pattern in shape.groups),
        ]
        trunk = data.trunk if shape.trunk is None else shape.trunk

        return PhoneDetail(
            phone=_write(data, trunk, groups, international, written),
            e164=f"+{data.calling_code}{''.join(groups)}",
            country=code,
            calling_code=data.calling_code,
            type=drawn,
        )

    with with_random(random):
        return collect(
            count=count,
            unique=unique,
            starts_with="",
            draw=draw,
            key_of=lambda detail: detail.phone,
        )
