"""Prepend a random token to a string, or to every string in a list."""

from typing import overload

from randino.decorate._attach import attach
from randino.decorate.data import AFFIX_LENGTH_DEFAULT, AFFIX_SEPARATOR_DEFAULT


@overload
def rand_prefix(
    value: None = ...,
    *,
    length: int = ...,
    separator: str = ...,
    charset: str = ...,
) -> str: ...


@overload
def rand_prefix(
    value: str,
    *,
    length: int = ...,
    separator: str = ...,
    charset: str = ...,
) -> str: ...


@overload
def rand_prefix(
    value: list[str],
    *,
    length: int = ...,
    separator: str = ...,
    charset: str = ...,
) -> list[str]: ...


def rand_prefix(
    value: str | list[str] | None = None,
    *,
    length: int = AFFIX_LENGTH_DEFAULT,
    separator: str = AFFIX_SEPARATOR_DEFAULT,
    charset: str = "",
) -> str | list[str]:
    """Prepend a random token, for the places the distinguishing part goes in front.

    The mirror of `rand_suffix` — a shard, a tenant, a key that is sortable by
    nothing. With no value at all you get the bare token, which is the same thing
    `rand_suffix` hands back: which side it would have landed on is not decided yet.

    Args:
        value: The string, or the list of strings, to prepend to. Omitted, the
            token is the whole answer and `separator` is not used.
        length: Characters in the token. Clamped to `1..32`.
        separator: Placed between the token and the value.
        charset: Characters the token is drawn from. Defaults to alphanumerics
            without `0O1lI`, the pairs that are easy to misread.

    Returns:
        A string when `value` is a string or omitted, a list when it is a list.

    Example:
        >>> rand_prefix()
        'nVtRC'
        >>> rand_prefix("멋진사자")
        'nVtRC_멋진사자'
        >>> rand_prefix("order", length=4, separator="-")
        'k3Rm-order'
    """
    return attach(value, length, separator, charset, lambda item, token, sep: token + sep + item)
